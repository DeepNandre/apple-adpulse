"""
Utility functions for the ETL pipeline
"""

import logging
import os
import psycopg2
from typing import Optional, Dict, Any
import colorlog
import pandas as pd
from datetime import datetime

def setup_logging(level: str = "INFO", log_file: Optional[str] = None):
    """Setup colored logging configuration"""
    
    # Create logs directory if it doesn't exist
    log_dir = "logs"
    os.makedirs(log_dir, exist_ok=True)
    
    # Default log file
    if log_file is None:
        log_file = os.path.join(log_dir, f"etl_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
    
    # Color formatter for console
    console_formatter = colorlog.ColoredFormatter(
        "%(log_color)s%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        log_colors={
            'DEBUG': 'cyan',
            'INFO': 'green',
            'WARNING': 'yellow',
            'ERROR': 'red',
            'CRITICAL': 'red,bg_white',
        }
    )
    
    # File formatter
    file_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    # Setup root logger
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, level.upper()))
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)
    
    # File handler
    file_handler = logging.FileHandler(log_file)
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)
    
    return logger

def get_database_connection():
    """Get PostgreSQL database connection using environment variables"""
    
    connection_params = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': int(os.getenv('DB_PORT', '5432')),
        'database': os.getenv('DB_NAME', 'ad_dashboard'),
        'user': os.getenv('DB_USER'),
        'password': os.getenv('DB_PASSWORD')
    }
    
    # Validate required parameters
    if not connection_params['user'] or not connection_params['password']:
        raise ValueError("Database credentials not provided. Check DB_USER and DB_PASSWORD environment variables.")
    
    try:
        conn = psycopg2.connect(**connection_params)
        return conn
    except psycopg2.Error as e:
        raise ConnectionError(f"Failed to connect to database: {str(e)}")

def validate_data_quality(df: pd.DataFrame, table_name: str) -> Dict[str, Any]:
    """Validate data quality and return metrics"""
    
    logger = logging.getLogger(__name__)
    
    validation_results = {
        'table_name': table_name,
        'total_rows': len(df),
        'total_columns': len(df.columns),
        'null_counts': df.isnull().sum().to_dict(),
        'duplicate_rows': df.duplicated().sum(),
        'data_types': df.dtypes.to_dict(),
        'memory_usage_mb': df.memory_usage(deep=True).sum() / 1024 / 1024,
        'validation_timestamp': datetime.now()
    }
    
    # Calculate null percentages
    null_percentages = {}
    for col, null_count in validation_results['null_counts'].items():
        null_percentages[col] = (null_count / len(df)) * 100 if len(df) > 0 else 0
    
    validation_results['null_percentages'] = null_percentages
    
    # Log validation summary
    logger.info(f"📊 Data Quality Report for {table_name}:")
    logger.info(f"   Rows: {validation_results['total_rows']:,}")
    logger.info(f"   Columns: {validation_results['total_columns']}")
    logger.info(f"   Duplicates: {validation_results['duplicate_rows']}")
    logger.info(f"   Memory: {validation_results['memory_usage_mb']:.2f} MB")
    
    # Warn about high null percentages
    high_null_cols = [col for col, pct in null_percentages.items() if pct > 10]
    if high_null_cols:
        logger.warning(f"⚠️  High null percentages in columns: {high_null_cols}")
    
    return validation_results

def calculate_etl_metrics(start_time: datetime, end_time: datetime, 
                         total_rows: int) -> Dict[str, Any]:
    """Calculate ETL performance metrics"""
    
    duration = end_time - start_time
    duration_seconds = duration.total_seconds()
    
    metrics = {
        'start_time': start_time,
        'end_time': end_time,
        'duration_seconds': duration_seconds,
        'duration_minutes': duration_seconds / 60,
        'total_rows_processed': total_rows,
        'rows_per_second': total_rows / duration_seconds if duration_seconds > 0 else 0,
        'rows_per_minute': (total_rows / duration_seconds) * 60 if duration_seconds > 0 else 0
    }
    
    return metrics

def format_number(num: float) -> str:
    """Format numbers with appropriate suffixes"""
    if num >= 1_000_000:
        return f"{num / 1_000_000:.1f}M"
    elif num >= 1_000:
        return f"{num / 1_000:.1f}K"
    else:
        return f"{num:.0f}"

def check_database_connection() -> bool:
    """Test database connection"""
    try:
        conn = get_database_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        conn.close()
        return True
    except Exception:
        return False

def get_table_row_count(table_name: str, schema: str = "ad_dashboard") -> int:
    """Get row count for a specific table"""
    conn = get_database_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT COUNT(*) FROM {schema}.{table_name}")
            return cursor.fetchone()[0]
    finally:
        conn.close()

def execute_sql_file(file_path: str) -> bool:
    """Execute SQL file against the database"""
    logger = logging.getLogger(__name__)
    
    if not os.path.exists(file_path):
        logger.error(f"SQL file not found: {file_path}")
        return False
    
    conn = get_database_connection()
    try:
        with conn.cursor() as cursor:
            with open(file_path, 'r') as f:
                sql_content = f.read()
                cursor.execute(sql_content)
        conn.commit()
        logger.info(f"✅ Successfully executed: {file_path}")
        return True
    except Exception as e:
        conn.rollback()
        logger.error(f"❌ Failed to execute {file_path}: {str(e)}")
        return False
    finally:
        conn.close()

class ETLTimer:
    """Context manager for timing ETL operations"""
    
    def __init__(self, operation_name: str):
        self.operation_name = operation_name
        self.logger = logging.getLogger(__name__)
        self.start_time = None
        self.end_time = None
    
    def __enter__(self):
        self.start_time = datetime.now()
        self.logger.info(f"⏱️  Starting {self.operation_name}...")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = datetime.now()
        duration = self.end_time - self.start_time
        
        if exc_type is None:
            self.logger.info(f"✅ {self.operation_name} completed in {duration.total_seconds():.2f} seconds")
        else:
            self.logger.error(f"❌ {self.operation_name} failed after {duration.total_seconds():.2f} seconds")
    
    @property
    def duration(self):
        if self.start_time and self.end_time:
            return self.end_time - self.start_time
        return None 