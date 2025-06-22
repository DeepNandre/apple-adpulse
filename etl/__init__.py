"""
Interactive Apple-Style Ad Performance Dashboard - ETL Package

This package contains all ETL (Extract, Transform, Load) functionality for 
processing simulated ad performance and web analytics data.

Author: Apple Ad Performance Dashboard Team
Version: 1.0.0
"""

__version__ = "1.0.0"
__author__ = "Apple Ad Performance Dashboard Team"

# Core ETL modules (only import what exists)
from .data_generator import DataGenerator, DataGenerationConfig

# Utility functions
try:
    from .utils import (
        setup_logging,
        get_database_connection,
        validate_data_quality,
        calculate_etl_metrics
    )
except ImportError:
    # utils module doesn't exist yet, define minimal functions
    def setup_logging(level="INFO"):
        import logging
        logging.basicConfig(level=getattr(logging, level.upper()))
        return logging.getLogger()
    
    def get_database_connection():
        import psycopg2
        import os
        return psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=int(os.getenv('DB_PORT', '5432')),
            database=os.getenv('DB_NAME', 'ad_dashboard'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )

__all__ = [
    'DataGenerator',
    'DataGenerationConfig',
    'setup_logging',
    'get_database_connection'
] 