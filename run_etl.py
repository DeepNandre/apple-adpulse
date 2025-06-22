#!/usr/bin/env python3
"""
Main ETL Execution Script
Interactive Apple-Style Ad Performance Dashboard

This script orchestrates the ETL pipeline:
1. Data generation/simulation
2. Data loading into PostgreSQL warehouse
"""

import os
import sys
import logging
from datetime import datetime
import argparse
import pandas as pd
import psycopg2
from io import StringIO
from sqlalchemy import create_engine

# Add etl package to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'etl'))

from etl.data_generator import DataGenerator, DataGenerationConfig
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def setup_logging(level="INFO"):
    """Simple logging setup"""
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    return logging.getLogger(__name__)

def get_database_connection():
    """Get database connection"""
    return psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=int(os.getenv('DB_PORT', '5432')),
        database=os.getenv('DB_NAME', 'ad_dashboard'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD')
    )

def get_sqlalchemy_engine():
    """Get SQLAlchemy engine for pandas operations"""
    db_url = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME', 'ad_dashboard')}"
    return create_engine(db_url)

def main():
    """Main ETL execution function"""
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Run Apple Ad Dashboard ETL Pipeline')
    parser.add_argument('--step', choices=['generate', 'load', 'all'], 
                       default='all', help='ETL step to run')
    parser.add_argument('--log-level', choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
                       default='INFO', help='Logging level')
    
    args = parser.parse_args()
    
    # Setup logging
    logger = setup_logging(level=args.log_level)
    
    logger.info("=" * 60)
    logger.info("🍎 Apple Ad Performance Dashboard ETL Pipeline")
    logger.info("=" * 60)
    logger.info(f"Started at: {datetime.now()}")
    logger.info(f"Step: {args.step}")
    
    try:
        if args.step in ['generate', 'all']:
            logger.info("\n📊 Step 1: Data Generation")
            logger.info("-" * 30)
            generate_data()
        
        if args.step in ['load', 'all']:
            logger.info("\n🔄 Step 2: Data Loading")
            logger.info("-" * 30)
            load_data()
        
        logger.info("\n✅ ETL Pipeline completed successfully!")
        logger.info(f"Finished at: {datetime.now()}")
        
    except Exception as e:
        logger.error(f"❌ ETL Pipeline failed: {str(e)}")
        raise

def generate_data():
    """Generate simulated data"""
    logger = logging.getLogger(__name__)
    
    # Create data generation configuration
    config = DataGenerationConfig(
        start_date=os.getenv('DATA_START_DATE', '2024-01-01'),
        end_date=os.getenv('DATA_END_DATE', '2024-12-31'),
        daily_volume_scale=os.getenv('DATA_VOLUME_SCALE', 'medium'),
        seed=int(os.getenv('SIMULATION_SEED', '42'))
    )
    
    logger.info(f"📈 Generating data from {config.start_date} to {config.end_date}")
    logger.info(f"📊 Volume scale: {config.daily_volume_scale}")
    logger.info(f"🎲 Random seed: {config.seed}")
    
    # Initialize generator
    generator = DataGenerator(config)
    
    # Generate dimension data
    logger.info("🗂️  Generating dimension tables...")
    dimensions = generator.generate_dimension_data()
    
    # Generate fact data
    logger.info("📋 Generating fact tables...")
    facts = generator.generate_fact_data()
    
    # Save to files
    save_data_files({**dimensions, **facts})
    
    logger.info("✅ Data generation completed")

def save_data_files(data_dict):
    """Save generated data to CSV files"""
    logger = logging.getLogger(__name__)
    
    # Ensure directories exist
    raw_path = os.getenv('RAW_DATA_PATH', 'data/raw/')
    os.makedirs(raw_path, exist_ok=True)
    
    total_rows = 0
    for table_name, df in data_dict.items():
        filename = os.path.join(raw_path, f"{table_name}.csv")
        df.to_csv(filename, index=False)
        logger.info(f"💾 Saved {len(df):,} rows to {filename}")
        total_rows += len(df)
    
    logger.info(f"📊 Total rows generated: {total_rows:,}")

def load_data():
    """Load data from CSV files into database"""
    logger = logging.getLogger(__name__)
    
    logger.info("📤 Loading data into database...")
    
    # Define load order (dimensions first, then facts)
    load_order = [
        'dim_date',
        'dim_campaign', 
        'dim_geo',
        'dim_device',
        'dim_user',
        'fact_ad_performance',
        'fact_web_analytics', 
        'fact_conversions'
    ]
    
    raw_path = os.getenv('RAW_DATA_PATH', 'data/raw/')
    engine = get_sqlalchemy_engine()
    
    try:
        total_loaded = 0
        
        for table_name in load_order:
            csv_file = os.path.join(raw_path, f"{table_name}.csv")
            
            if not os.path.exists(csv_file):
                logger.warning(f"⚠️  File not found: {csv_file}")
                continue
            
            logger.info(f"📥 Loading {table_name}...")
            
            # Load data in smaller chunks to avoid memory issues
            chunk_size = 100  # Much smaller batch size
            total_rows = 0
            
            for chunk in pd.read_csv(csv_file, chunksize=chunk_size):
                chunk.to_sql(
                    table_name, 
                    engine, 
                    schema='ad_dashboard',
                    if_exists='append', 
                    index=False,
                    method='multi'
                )
                total_rows += len(chunk)
                if total_rows % 1000 == 0:  # Progress indicator
                    logger.info(f"   Loaded {total_rows} rows so far...")
            
            logger.info(f"✅ Loaded {total_rows} rows into {table_name}")
            total_loaded += total_rows
        
        logger.info(f"🎉 Successfully loaded {total_loaded:,} total rows into database!")
        
    except Exception as e:
        logger.error(f"❌ Error loading data: {str(e)}")
        raise

if __name__ == "__main__":
    main() 