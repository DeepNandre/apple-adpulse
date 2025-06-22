# Interactive Apple-Style Ad Performance Dashboard

A comprehensive data analytics project showcasing end-to-end ETL pipeline and interactive visualization for digital advertising performance data with a focus on EMEA region.

## Project Overview

This project simulates a real-world marketing analytics scenario involving data ingestion, ETL processing, data modeling, and visualization. The final deliverable is a dynamic Tableau dashboard with a clean, minimalist Apple aesthetic, providing insights into campaign performance, A/B tests, customer lifecycle, and geographic trends.

## Features

- **Data Engineering**: Python-based ETL pipeline for processing simulated ad performance and web analytics data
- **Data Warehouse**: PostgreSQL database with optimized star schema design
- **Interactive Dashboard**: Tableau visualization with Apple-style aesthetic
- **Geographic Focus**: EMEA region analysis and segmentation
- **Multi-dimensional Analysis**: Campaign trends, A/B testing, customer lifecycle, and geographic performance

## Technology Stack

- **ETL Pipeline**: Python 3.8+, pandas, psycopg2, SQLAlchemy
- **Data Warehouse**: PostgreSQL 13+
- **Visualization**: Tableau Desktop/Public
- **Version Control**: Git/GitHub
- **Data**: Simulated/anonymized CSV files

## Project Structure

```
├── data/
│   ├── raw/                    # Raw simulated data files
│   ├── processed/              # Cleaned and transformed data
│   └── sample/                 # Sample data for testing
├── etl/
│   ├── __init__.py
│   ├── data_generator.py       # Generate simulated data
│   ├── ingestion.py           # Data ingestion scripts
│   ├── transformation.py      # Data cleaning and transformation
│   ├── loading.py             # Database loading utilities
│   └── pipeline.py            # Main ETL orchestration
├── sql/
│   ├── schema/
│   │   ├── create_tables.sql  # Database schema creation
│   │   └── indexes.sql        # Performance indexes
│   ├── transformations/
│   │   ├── fact_tables.sql    # Fact table transformations
│   │   └── dimension_tables.sql # Dimension table transformations
│   └── views/
│       └── dashboard_views.sql # Pre-aggregated views for Tableau
├── tableau/
│   └── dashboard.twb          # Tableau workbook (placeholder)
├── config/
│   ├── database.yaml          # Database configuration
│   └── etl_config.yaml        # ETL pipeline configuration
├── tests/
│   ├── test_etl.py           # ETL pipeline tests
│   └── test_data_quality.py  # Data quality validation tests
├── docs/
│   ├── setup_guide.md        # Detailed setup instructions
│   ├── data_dictionary.md    # Data model documentation
│   └── insights_guide.md     # Dashboard insights explanation
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore patterns
└── run_etl.py              # Main ETL execution script
```

## Quick Start

### Prerequisites

- Python 3.8 or higher
- PostgreSQL 13 or higher
- Tableau Desktop (for development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/apple-ad-dashboard.git
   cd apple-ad-dashboard
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb ad_dashboard
   
   # Run schema setup
   psql -d ad_dashboard -f sql/schema/create_tables.sql
   psql -d ad_dashboard -f sql/schema/indexes.sql
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Generate sample data and run ETL**
   ```bash
   python run_etl.py
   ```

6. **Connect Tableau to the database**
   - Open Tableau Desktop
   - Connect to PostgreSQL using your database credentials
   - Use the views in the `dashboard_views` schema

## Data Model

The project implements a star schema optimized for analytical queries:

- **Fact Tables**: `fact_ad_performance`, `fact_web_analytics`, `fact_conversions`
- **Dimension Tables**: `dim_date`, `dim_campaign`, `dim_geo`, `dim_device`, `dim_user`
- **Views**: Pre-aggregated views for dashboard performance

## Dashboard Features

### Campaign Trends
- Time-series analysis of key metrics (Impressions, Clicks, Spend, Conversions)
- Interactive date range filtering
- Campaign performance comparison

### A/B Test Performance
- Side-by-side variant comparison
- Statistical significance indicators
- Conversion rate analysis

### Customer Lifecycle
- Cohort retention analysis
- Conversion funnel visualization
- Customer journey mapping

### Geographic Segmentation (EMEA)
- Interactive map visualization
- Country-level performance metrics
- Regional comparison analysis

## Development Guidelines

### Code Style
- Follow PEP 8 for Python code
- Use type hints where applicable
- Include comprehensive docstrings

### Testing
- Run tests before committing: `python -m pytest tests/`
- Validate data quality after ETL runs
- Test dashboard functionality in Tableau

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Deployment

### Tableau Public
1. Create extract from PostgreSQL data
2. Publish to Tableau Public
3. Update README with public dashboard link

### ETL Automation
- Set up scheduled runs using cron (Linux/Mac) or Task Scheduler (Windows)
- Monitor ETL logs for errors
- Implement alerting for failed runs

## Troubleshooting

### Common Issues
- **Database connection errors**: Check credentials in .env file
- **ETL failures**: Review logs in `logs/` directory
- **Tableau connection issues**: Ensure PostgreSQL allows external connections

### Performance Optimization
- Use data extracts in Tableau for better performance
- Implement incremental ETL for large datasets
- Add indexes for frequently queried columns

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Project inspired by real-world marketing analytics scenarios
- Apple design principles for dashboard aesthetics
- Open-source community for excellent Python and SQL tools 