"""
Data Generator for Interactive Apple-Style Ad Performance Dashboard

Generates realistic simulated ad performance and web analytics data
for EMEA region with proper statistical distributions and correlations.
"""

import pandas as pd
import numpy as np
from faker import Faker
from datetime import datetime, timedelta
import random
import uuid
from typing import Dict, List, Tuple, Optional
import logging
from dataclasses import dataclass

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DataGenerationConfig:
    """Configuration for data generation parameters"""
    start_date: str = "2024-01-01"
    end_date: str = "2024-12-31"
    num_campaigns: int = 50
    num_users: int = 100000
    daily_volume_scale: str = "medium"  # small, medium, large
    seed: int = 42
    emea_countries: List[str] = None
    
    def __post_init__(self):
        if self.emea_countries is None:
            self.emea_countries = [
                'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
                'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden',
                'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic',
                'Hungary', 'Romania', 'Greece', 'Portugal', 'Ireland'
            ]

class DataGenerator:
    """Generate realistic simulated data for ad performance dashboard"""
    
    def __init__(self, config: DataGenerationConfig):
        self.config = config
        self.fake = Faker()
        Faker.seed(config.seed)
        np.random.seed(config.seed)
        random.seed(config.seed)
        
        # Volume scaling factors
        self.volume_scales = {
            'small': {'base_impressions': 1000, 'multiplier': 1},
            'medium': {'base_impressions': 10000, 'multiplier': 5},
            'large': {'base_impressions': 50000, 'multiplier': 20}
        }
        
        # Initialize campaign and geo data
        self.campaigns_df = None
        self.geo_df = None
        self.date_range = pd.date_range(
            start=config.start_date, 
            end=config.end_date, 
            freq='D'
        )
        
    def generate_dimension_data(self) -> Dict[str, pd.DataFrame]:
        """Generate all dimension tables"""
        logger.info("Generating dimension data...")
        
        dimensions = {
            'dim_date': self._generate_date_dimension(),
            'dim_campaign': self._generate_campaign_dimension(),
            'dim_geo': self._generate_geo_dimension(),
            'dim_device': self._generate_device_dimension(),
            'dim_user': self._generate_user_dimension()
        }
        
        # Store for use in fact table generation
        self.campaigns_df = dimensions['dim_campaign']
        self.geo_df = dimensions['dim_geo']
        
        return dimensions
    
    def generate_fact_data(self) -> Dict[str, pd.DataFrame]:
        """Generate all fact tables"""
        logger.info("Generating fact data...")
        
        if self.campaigns_df is None or self.geo_df is None:
            raise ValueError("Must generate dimension data first")
            
        facts = {
            'fact_ad_performance': self._generate_ad_performance_data(),
            'fact_web_analytics': self._generate_web_analytics_data(),
            'fact_conversions': self._generate_conversions_data()
        }
        
        return facts
    
    def _generate_date_dimension(self) -> pd.DataFrame:
        """Generate date dimension with calendar attributes"""
        dates = []
        
        for date in self.date_range:
            dates.append({
                'date_key': int(date.strftime('%Y%m%d')),
                'date_value': date.date(),
                'day_of_week': date.weekday() + 1,
                'day_name': date.strftime('%A'),
                'month': date.month,
                'month_name': date.strftime('%B'),
                'quarter': (date.month - 1) // 3 + 1,
                'year': date.year,
                'week_of_year': date.isocalendar()[1],
                'is_weekend': date.weekday() >= 5,
                'is_holiday': self._is_holiday(date)
            })
        
        return pd.DataFrame(dates)
    
    def _generate_campaign_dimension(self) -> pd.DataFrame:
        """Generate campaign dimension with realistic campaign data"""
        campaigns = []
        
        campaign_types = ['Search', 'Social', 'Display', 'Video']
        platforms = ['Google Ads', 'Facebook', 'LinkedIn', 'Twitter']
        objectives = ['Awareness', 'Conversion', 'Traffic', 'Engagement']
        
        # Convert string dates to datetime.date objects
        start_date = datetime.strptime(self.config.start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(self.config.end_date, '%Y-%m-%d').date()
        
        for i in range(self.config.num_campaigns):
            campaign_type = random.choice(campaign_types)
            platform = random.choice(platforms)
            
            campaigns.append({
                'campaign_key': str(uuid.uuid4()),
                'source_campaign_id': f'cmp_{i:04d}',
                'campaign_name': f'{campaign_type} Campaign {i+1} - {platform}',
                'campaign_type': campaign_type,
                'campaign_objective': random.choice(objectives),
                'platform': platform,
                'status': random.choices(['Active', 'Paused'], weights=[0.8, 0.2])[0],
                'budget': round(random.uniform(1000, 50000), 2),
                'daily_budget': round(random.uniform(50, 1000), 2),
                'start_date': self.fake.date_between(
                    start_date=start_date,
                    end_date=end_date
                )
            })
        
        return pd.DataFrame(campaigns)
    
    def _generate_geo_dimension(self) -> pd.DataFrame:
        """Generate geographic dimension focused on EMEA"""
        geo_data = []
        
        for country in self.config.emea_countries:
            # Add country-level entry
            geo_data.append({
                'geo_key': str(uuid.uuid4()),
                'country': country,
                'country_code': self._get_country_code(country),
                'region': None,
                'city': None,
                'is_emea': True,
                'timezone': self._get_timezone(country),
                'currency_code': self._get_currency(country)
            })
            
            # Add some major cities for variety
            for _ in range(random.randint(1, 3)):
                geo_data.append({
                    'geo_key': str(uuid.uuid4()),
                    'country': country,
                    'country_code': self._get_country_code(country),
                    'region': self.fake.state(),
                    'city': self.fake.city(),
                    'is_emea': True,
                    'timezone': self._get_timezone(country),
                    'currency_code': self._get_currency(country)
                })
        
        return pd.DataFrame(geo_data)
    
    def _generate_device_dimension(self) -> pd.DataFrame:
        """Generate device dimension"""
        devices = [
            {'device_type': 'Mobile', 'operating_system': 'iOS', 'browser': 'Safari'},
            {'device_type': 'Mobile', 'operating_system': 'Android', 'browser': 'Chrome'},
            {'device_type': 'Desktop', 'operating_system': 'Windows', 'browser': 'Chrome'},
            {'device_type': 'Desktop', 'operating_system': 'macOS', 'browser': 'Safari'},
            {'device_type': 'Tablet', 'operating_system': 'iOS', 'browser': 'Safari'},
            {'device_type': 'Tablet', 'operating_system': 'Android', 'browser': 'Chrome'},
        ]
        
        device_data = []
        for device in devices:
            device_data.append({
                'device_key': str(uuid.uuid4()),
                'device_type': device['device_type'],
                'operating_system': device['operating_system'],
                'browser': device['browser'],
                'device_category': device['device_type']
            })
        
        return pd.DataFrame(device_data)
    
    def _generate_user_dimension(self) -> pd.DataFrame:
        """Generate pseudonymized user dimension"""
        users = []
        
        # Convert string dates to datetime.date objects
        start_date = datetime.strptime(self.config.start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(self.config.end_date, '%Y-%m-%d').date()
        
        for i in range(self.config.num_users):
            users.append({
                'user_key': str(uuid.uuid4()),
                'source_user_id_hashed': self.fake.sha256(),
                'first_session_date': self.fake.date_between(
                    start_date=start_date,
                    end_date=end_date
                ),
                'customer_segment': random.choices(
                    ['New', 'Returning', 'VIP'], 
                    weights=[0.5, 0.4, 0.1]
                )[0]
            })
        
        return pd.DataFrame(users)
    
    def _generate_ad_performance_data(self) -> pd.DataFrame:
        """Generate realistic ad performance data with correlations"""
        logger.info("Generating ad performance data...")
        
        ad_data = []
        scale = self.volume_scales[self.config.daily_volume_scale]
        
        for date in self.date_range:
            date_key = int(date.strftime('%Y%m%d'))
            
            # Generate data for active campaigns
            active_campaigns = self.campaigns_df[
                self.campaigns_df['status'] == 'Active'
            ].sample(n=min(30, len(self.campaigns_df)))
            
            for _, campaign in active_campaigns.iterrows():
                # Sample geos and devices
                geo_sample = self.geo_df.sample(n=random.randint(3, 8))
                
                for _, geo in geo_sample.iterrows():
                    # Generate base metrics with realistic distributions
                    base_impressions = max(1, int(np.random.lognormal(
                        np.log(scale['base_impressions']), 0.5
                    )))
                    
                    # Apply day-of-week and seasonal effects
                    day_effect = self._get_day_effect(date)
                    seasonal_effect = self._get_seasonal_effect(date)
                    
                    impressions = int(base_impressions * day_effect * seasonal_effect)
                    
                    # Calculate correlated metrics
                    ctr = max(0.1, min(15.0, np.random.lognormal(np.log(2.5), 0.3)))
                    clicks = max(1, int(impressions * ctr / 100))
                    
                    cpc = max(0.1, np.random.lognormal(np.log(1.5), 0.4))
                    spend = round(clicks * cpc, 2)
                    
                    cvr = max(0.1, min(10.0, np.random.lognormal(np.log(2.0), 0.4)))
                    conversions = max(0, int(clicks * cvr / 100))
                    
                    aov = max(10, np.random.lognormal(np.log(75), 0.3))
                    revenue = round(conversions * aov, 2)
                    
                    # A/B test assignment (20% of campaigns)
                    ab_test_id = None
                    ab_test_variant = None
                    if random.random() < 0.2:
                        ab_test_id = f'test_{random.randint(1, 10):03d}'
                        ab_test_variant = random.choice(['A', 'B'])
                    
                    ad_data.append({
                        'date_key': date_key,
                        'campaign_key': campaign['campaign_key'],
                        'geo_key': geo['geo_key'],
                        'device_key': random.choice(self.geo_df.index),  # Simplified
                        'impressions': impressions,
                        'clicks': clicks,
                        'spend': spend,
                        'attributed_conversions': conversions,
                        'attributed_revenue': revenue,
                        'ab_test_id': ab_test_id,
                        'ab_test_variant': ab_test_variant
                    })
        
        return pd.DataFrame(ad_data)
    
    def _generate_web_analytics_data(self) -> pd.DataFrame:
        """Generate web analytics data correlated with ad performance"""
        logger.info("Generating web analytics data...")
        
        web_data = []
        
        for date in self.date_range:
            date_key = int(date.strftime('%Y%m%d'))
            
            # Generate sessions based on ad clicks (simplified correlation)
            num_sessions = random.randint(100, 2000)
            
            for _ in range(num_sessions):
                session_id = str(uuid.uuid4())
                
                # Generate session metrics
                page_views = max(1, int(np.random.lognormal(np.log(3), 0.5)))
                session_duration = max(10, int(np.random.lognormal(np.log(120), 0.8)))
                
                # Bounce rate logic
                is_bounce = (page_views == 1) or (session_duration < 30)
                
                web_data.append({
                    'session_id': session_id,
                    'session_start_timestamp': date + timedelta(
                        seconds=random.randint(0, 86400)
                    ),
                    'date_key': date_key,
                    'page_views': page_views,
                    'session_duration_seconds': session_duration,
                    'is_bounce': is_bounce,
                    'goals_completed': random.randint(0, 2) if not is_bounce else 0,
                    'utm_source': random.choice(['google', 'facebook', 'direct']),
                    'utm_medium': random.choice(['cpc', 'social', 'organic'])
                })
        
        return pd.DataFrame(web_data)
    
    def _generate_conversions_data(self) -> pd.DataFrame:
        """Generate conversion events data"""
        logger.info("Generating conversions data...")
        
        conversions = []
        
        for date in self.date_range:
            date_key = int(date.strftime('%Y%m%d'))
            
            # Generate conversions for the day
            num_conversions = random.randint(10, 100)
            
            for _ in range(num_conversions):
                conversion_value = max(10, np.random.lognormal(np.log(75), 0.4))
                
                conversions.append({
                    'conversion_id': str(uuid.uuid4()),
                    'conversion_timestamp': date + timedelta(
                        seconds=random.randint(0, 86400)
                    ),
                    'date_key': date_key,
                    'conversion_type': random.choices(
                        ['Purchase', 'Lead', 'Signup'], 
                        weights=[0.6, 0.3, 0.1]
                    )[0],
                    'conversion_value': round(conversion_value, 2),
                    'quantity': random.randint(1, 3),
                    'attribution_model': 'last_click',
                    'time_to_conversion_hours': random.randint(1, 168)
                })
        
        return pd.DataFrame(conversions)
    
    def _is_holiday(self, date: datetime) -> bool:
        """Simple holiday detection"""
        # Major holidays (simplified)
        holidays = [
            (1, 1),   # New Year
            (12, 25), # Christmas
            (12, 26), # Boxing Day
        ]
        return (date.month, date.day) in holidays
    
    def _get_day_effect(self, date: datetime) -> float:
        """Get day-of-week effect on performance"""
        # Lower performance on weekends
        if date.weekday() >= 5:  # Weekend
            return 0.7
        return 1.0
    
    def _get_seasonal_effect(self, date: datetime) -> float:
        """Get seasonal effect on performance"""
        # Higher performance in Q4 (holiday season)
        if date.month in [11, 12]:
            return 1.3
        elif date.month in [7, 8]:  # Summer slowdown
            return 0.8
        return 1.0
    
    def _get_country_code(self, country: str) -> str:
        """Get ISO 2-letter country code"""
        country_codes = {
            'United Kingdom': 'GB', 'Germany': 'DE', 'France': 'FR',
            'Italy': 'IT', 'Spain': 'ES', 'Netherlands': 'NL',
            'Belgium': 'BE', 'Switzerland': 'CH', 'Austria': 'AT',
            'Sweden': 'SE', 'Norway': 'NO', 'Denmark': 'DK',
            'Finland': 'FI', 'Poland': 'PL', 'Czech Republic': 'CZ',
            'Hungary': 'HU', 'Romania': 'RO', 'Greece': 'GR',
            'Portugal': 'PT', 'Ireland': 'IE'
        }
        return country_codes.get(country, 'XX')
    
    def _get_timezone(self, country: str) -> str:
        """Get timezone for country"""
        timezones = {
            'United Kingdom': 'Europe/London', 'Germany': 'Europe/Berlin',
            'France': 'Europe/Paris', 'Italy': 'Europe/Rome',
            'Spain': 'Europe/Madrid', 'Netherlands': 'Europe/Amsterdam'
        }
        return timezones.get(country, 'Europe/London')
    
    def _get_currency(self, country: str) -> str:
        """Get currency code for country"""
        currencies = {
            'United Kingdom': 'GBP', 'Switzerland': 'CHF',
            'Sweden': 'SEK', 'Norway': 'NOK', 'Denmark': 'DKK',
            'Poland': 'PLN', 'Czech Republic': 'CZK', 'Hungary': 'HUF',
            'Romania': 'RON'
        }
        return currencies.get(country, 'EUR')

def main():
    """Main function for testing data generation"""
    config = DataGenerationConfig()
    generator = DataGenerator(config)
    
    # Generate dimensions
    dimensions = generator.generate_dimension_data()
    
    # Generate facts
    facts = generator.generate_fact_data()
    
    # Save to CSV files
    import os
    os.makedirs('data/raw', exist_ok=True)
    
    for name, df in {**dimensions, **facts}.items():
        filename = f'data/raw/{name}.csv'
        df.to_csv(filename, index=False)
        logger.info(f"Saved {len(df)} rows to {filename}")

if __name__ == "__main__":
    main() 