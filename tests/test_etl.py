"""
Test Suite for Apple Ad Performance Dashboard ETL Pipeline

Tests data generation, transformation, loading, and validation processes.
"""

import pytest
import pandas as pd
import numpy as np
from datetime import datetime, date
import uuid
import os
import sys

# Add etl package to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'etl'))

from etl.data_generator import DataGenerator, DataGenerationConfig
from etl.utils import validate_data_quality, setup_logging, get_database_connection

class TestDataGeneration:
    """Test data generation functionality"""
    
    @pytest.fixture
    def config(self):
        """Test configuration"""
        return DataGenerationConfig(
            start_date="2024-01-01",
            end_date="2024-01-31",  # Small date range for testing
            num_campaigns=5,
            num_users=100,
            daily_volume_scale="small",
            seed=42
        )
    
    @pytest.fixture
    def generator(self, config):
        """Data generator instance"""
        return DataGenerator(config)
    
    def test_config_initialization(self, config):
        """Test configuration object initialization"""
        assert config.start_date == "2024-01-01"
        assert config.end_date == "2024-01-31"
        assert config.num_campaigns == 5
        assert config.seed == 42
        assert len(config.emea_countries) > 0
    
    def test_date_dimension_generation(self, generator):
        """Test date dimension data generation"""
        dimensions = generator.generate_dimension_data()
        date_df = dimensions['dim_date']
        
        # Test structure
        assert not date_df.empty
        assert 'date_key' in date_df.columns
        assert 'date_value' in date_df.columns
        assert 'day_name' in date_df.columns
        assert 'is_weekend' in date_df.columns
        
        # Test data quality
        assert date_df['date_key'].dtype == int
        assert date_df['date_value'].dtype == object  # pandas date
        assert date_df['is_weekend'].dtype == bool
        
        # Test business logic
        assert date_df['date_key'].min() == 20240101
        assert date_df['date_key'].max() == 20240131
        assert date_df['day_of_week'].min() >= 1
        assert date_df['day_of_week'].max() <= 7
    
    def test_campaign_dimension_generation(self, generator):
        """Test campaign dimension data generation"""
        dimensions = generator.generate_dimension_data()
        campaign_df = dimensions['dim_campaign']
        
        # Test structure
        assert len(campaign_df) == generator.config.num_campaigns
        assert 'campaign_key' in campaign_df.columns
        assert 'campaign_name' in campaign_df.columns
        assert 'campaign_type' in campaign_df.columns
        assert 'status' in campaign_df.columns
        
        # Test data quality
        assert campaign_df['campaign_key'].nunique() == len(campaign_df)  # Unique keys
        assert not campaign_df['campaign_name'].isnull().any()
        assert campaign_df['campaign_type'].isin(['Search', 'Social', 'Display', 'Video']).all()
        assert campaign_df['status'].isin(['Active', 'Paused']).all()
        
        # Test budget values
        assert (campaign_df['budget'] > 0).all()
        assert (campaign_df['daily_budget'] > 0).all()
    
    def test_geo_dimension_generation(self, generator):
        """Test geographic dimension data generation"""
        dimensions = generator.generate_dimension_data()
        geo_df = dimensions['dim_geo']
        
        # Test structure
        assert not geo_df.empty
        assert 'geo_key' in geo_df.columns
        assert 'country' in geo_df.columns
        assert 'country_code' in geo_df.columns
        assert 'is_emea' in geo_df.columns
        
        # Test data quality
        assert geo_df['is_emea'].all()  # All should be EMEA
        assert geo_df['country'].isin(generator.config.emea_countries).all()
        assert geo_df['country_code'].str.len().eq(2).all()  # ISO 2-letter codes
    
    def test_ad_performance_fact_generation(self, generator):
        """Test ad performance fact table generation"""
        # Generate dimensions first
        generator.generate_dimension_data()
        
        # Generate facts
        facts = generator.generate_fact_data()
        ad_perf_df = facts['fact_ad_performance']
        
        # Test structure
        assert not ad_perf_df.empty
        required_cols = ['date_key', 'campaign_key', 'geo_key', 'impressions', 
                        'clicks', 'spend', 'attributed_conversions', 'attributed_revenue']
        for col in required_cols:
            assert col in ad_perf_df.columns
        
        # Test business rules
        assert (ad_perf_df['impressions'] >= 0).all()
        assert (ad_perf_df['clicks'] >= 0).all()
        assert (ad_perf_df['clicks'] <= ad_perf_df['impressions']).all()
        assert (ad_perf_df['spend'] >= 0).all()
        assert (ad_perf_df['attributed_conversions'] >= 0).all()
        
        # Test data ranges
        assert ad_perf_df['date_key'].min() >= 20240101
        assert ad_perf_df['date_key'].max() <= 20240131
    
    def test_web_analytics_fact_generation(self, generator):
        """Test web analytics fact table generation"""
        generator.generate_dimension_data()
        facts = generator.generate_fact_data()
        web_df = facts['fact_web_analytics']
        
        # Test structure
        assert not web_df.empty
        required_cols = ['session_id', 'date_key', 'page_views', 
                        'session_duration_seconds', 'is_bounce']
        for col in required_cols:
            assert col in web_df.columns
        
        # Test business rules
        assert (web_df['page_views'] >= 1).all()
        assert (web_df['session_duration_seconds'] >= 0).all()
        assert web_df['is_bounce'].dtype == bool
        
        # Test bounce logic
        single_page_sessions = web_df['page_views'] == 1
        short_sessions = web_df['session_duration_seconds'] < 30
        bounces = web_df['is_bounce']
        
        # Most single page sessions should be bounces
        assert (single_page_sessions & bounces).sum() > 0
    
    def test_conversions_fact_generation(self, generator):
        """Test conversions fact table generation"""
        generator.generate_dimension_data()
        facts = generator.generate_fact_data()
        conv_df = facts['fact_conversions']
        
        # Test structure
        assert not conv_df.empty
        required_cols = ['conversion_id', 'date_key', 'conversion_type', 
                        'conversion_value', 'quantity']
        for col in required_cols:
            assert col in conv_df.columns
        
        # Test business rules
        assert (conv_df['conversion_value'] >= 0).all()
        assert (conv_df['quantity'] > 0).all()
        assert conv_df['conversion_type'].isin(['Purchase', 'Lead', 'Signup']).all()


class TestDataValidation:
    """Test data validation functionality"""
    
    def test_data_quality_validation(self):
        """Test data quality validation function"""
        # Create test dataframe
        test_data = pd.DataFrame({
            'id': [1, 2, 3, 4, 5],
            'name': ['A', 'B', None, 'D', 'E'],
            'value': [10.5, 20.0, 30.5, 40.0, 50.5],
            'category': ['X', 'Y', 'X', 'Y', 'X']
        })
        
        # Add duplicate row
        test_data = pd.concat([test_data, test_data.iloc[0:1]], ignore_index=True)
        
        # Run validation
        results = validate_data_quality(test_data, 'test_table')
        
        # Test results
        assert results['table_name'] == 'test_table'
        assert results['total_rows'] == 6
        assert results['total_columns'] == 4
        assert results['duplicate_rows'] == 1
        assert results['null_counts']['name'] == 1
        assert results['null_percentages']['name'] > 0
    
    def test_data_type_validation(self):
        """Test data type validation"""
        # Test numeric columns
        test_data = pd.DataFrame({
            'impressions': [1000, 2000, 3000],
            'clicks': [50, 100, 150],
            'spend': [25.50, 50.00, 75.25]
        })
        
        results = validate_data_quality(test_data, 'ad_performance')
        
        # Check data types are appropriate
        assert results['data_types']['impressions'] in [np.int64, int]
        assert results['data_types']['clicks'] in [np.int64, int]
        assert results['data_types']['spend'] in [np.float64, float]


class TestDataConsistency:
    """Test data consistency and business rules"""
    
    def test_date_key_consistency(self):
        """Test date key format consistency"""
        config = DataGenerationConfig(
            start_date="2024-06-01",
            end_date="2024-06-03",
            seed=42
        )
        generator = DataGenerator(config)
        dimensions = generator.generate_dimension_data()
        
        date_df = dimensions['dim_date']
        
        # Test date key format (YYYYMMDD)
        for _, row in date_df.iterrows():
            date_key = row['date_key']
            date_value = row['date_value']
            
            # Convert date to expected key
            expected_key = int(date_value.strftime('%Y%m%d'))
            assert date_key == expected_key
    
    def test_campaign_budget_consistency(self):
        """Test campaign budget business rules"""
        config = DataGenerationConfig(num_campaigns=10, seed=42)
        generator = DataGenerator(config)
        dimensions = generator.generate_dimension_data()
        
        campaign_df = dimensions['dim_campaign']
        
        # Daily budget should be less than or equal to total budget / 30
        for _, row in campaign_df.iterrows():
            daily_budget = row['daily_budget']
            total_budget = row['budget']
            
            # Allow some flexibility in the ratio
            assert daily_budget <= total_budget
            assert daily_budget > 0
    
    def test_geographic_emea_consistency(self):
        """Test EMEA geographic consistency"""
        config = DataGenerationConfig(seed=42)
        generator = DataGenerator(config)
        dimensions = generator.generate_dimension_data()
        
        geo_df = dimensions['dim_geo']
        
        # All countries should be EMEA
        assert geo_df['is_emea'].all()
        
        # All countries should be in the EMEA list
        emea_countries = set(config.emea_countries)
        assert set(geo_df['country'].unique()).issubset(emea_countries)
        
        # Currency codes should be valid for EMEA
        valid_currencies = {'EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON'}
        assert set(geo_df['currency_code'].unique()).issubset(valid_currencies)


class TestETLIntegration:
    """Integration tests for complete ETL process"""
    
    @pytest.mark.integration
    def test_full_data_generation_pipeline(self):
        """Test complete data generation pipeline"""
        config = DataGenerationConfig(
            start_date="2024-01-01",
            end_date="2024-01-07",  # One week for testing
            num_campaigns=3,
            num_users=50,
            daily_volume_scale="small",
            seed=42
        )
        
        generator = DataGenerator(config)
        
        # Generate all data
        dimensions = generator.generate_dimension_data()
        facts = generator.generate_fact_data()
        
        # Test all tables are generated
        expected_dims = ['dim_date', 'dim_campaign', 'dim_geo', 'dim_device', 'dim_user']
        expected_facts = ['fact_ad_performance', 'fact_web_analytics', 'fact_conversions']
        
        for table in expected_dims:
            assert table in dimensions
            assert not dimensions[table].empty
        
        for table in expected_facts:
            assert table in facts
            assert not facts[table].empty
        
        # Test referential integrity (simplified)
        ad_perf = facts['fact_ad_performance']
        campaigns = dimensions['dim_campaign']
        dates = dimensions['dim_date']
        
        # All campaign keys in facts should exist in dimension
        fact_campaigns = set(ad_perf['campaign_key'].unique())
        dim_campaigns = set(campaigns['campaign_key'].unique())
        assert fact_campaigns.issubset(dim_campaigns)
        
        # All date keys in facts should exist in dimension
        fact_dates = set(ad_perf['date_key'].unique())
        dim_dates = set(dates['date_key'].unique())
        assert fact_dates.issubset(dim_dates)
    
    @pytest.mark.slow
    def test_large_data_generation(self):
        """Test data generation with larger volumes"""
        config = DataGenerationConfig(
            start_date="2024-01-01",
            end_date="2024-01-31",
            num_campaigns=20,
            num_users=1000,
            daily_volume_scale="medium",
            seed=42
        )
        
        generator = DataGenerator(config)
        
        # Generate data and measure performance
        start_time = datetime.now()
        dimensions = generator.generate_dimension_data()
        facts = generator.generate_fact_data()
        end_time = datetime.now()
        
        duration = (end_time - start_time).total_seconds()
        
        # Performance check (should complete within reasonable time)
        assert duration < 60  # Should complete within 1 minute
        
        # Volume checks
        assert len(facts['fact_ad_performance']) > 1000
        assert len(facts['fact_web_analytics']) > 500


class TestErrorHandling:
    """Test error handling and edge cases"""
    
    def test_invalid_date_range(self):
        """Test handling of invalid date ranges"""
        with pytest.raises(Exception):
            config = DataGenerationConfig(
                start_date="2024-12-31",
                end_date="2024-01-01"  # End before start
            )
            generator = DataGenerator(config)
            generator.generate_dimension_data()
    
    def test_zero_campaigns(self):
        """Test handling of zero campaigns"""
        config = DataGenerationConfig(num_campaigns=0, seed=42)
        generator = DataGenerator(config)
        
        dimensions = generator.generate_dimension_data()
        
        # Should still generate dimension table but empty
        assert 'dim_campaign' in dimensions
        assert len(dimensions['dim_campaign']) == 0
    
    def test_missing_dependencies(self):
        """Test error when trying to generate facts without dimensions"""
        config = DataGenerationConfig(seed=42)
        generator = DataGenerator(config)
        
        # Try to generate facts without dimensions
        with pytest.raises(ValueError, match="Must generate dimension data first"):
            generator.generate_fact_data()


# Test fixtures and utilities
@pytest.fixture(scope="session")
def test_data_dir():
    """Create temporary directory for test data"""
    import tempfile
    import shutil
    
    temp_dir = tempfile.mkdtemp(prefix="apple_ad_test_")
    yield temp_dir
    shutil.rmtree(temp_dir)


def test_logging_setup():
    """Test logging configuration"""
    logger = setup_logging(level="DEBUG")
    assert logger is not None
    
    # Test log message
    logger.info("Test message")


if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "--tb=short"]) 