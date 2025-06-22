# Setup Guide - Apple Interactive Ad Performance Dashboard

This guide provides step-by-step instructions for setting up the Apple Interactive Ad Performance Dashboard project from scratch.

## Prerequisites

### System Requirements
- **Operating System**: macOS, Linux, or Windows 10+
- **Python**: 3.8 or higher
- **PostgreSQL**: 13 or higher
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 2GB free space minimum

### Software Installation

#### 1. Python Setup
```bash
# Check Python version
python --version

# Install Python 3.8+ if needed
# macOS (using Homebrew)
brew install python@3.8

# Ubuntu/Debian
sudo apt update
sudo apt install python3.8 python3.8-venv python3.8-dev

# Windows - Download from python.org
```

#### 2. PostgreSQL Installation
```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Windows - Download from postgresql.org
```

#### 3. Git Installation
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt install git

# Windows - Download from git-scm.com
```

## Project Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/apple-ad-dashboard.git
cd apple-ad-dashboard
```

### 2. Python Environment Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Setup

#### Create Database
```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database and user
CREATE DATABASE ad_dashboard;
CREATE USER dashboard_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ad_dashboard TO dashboard_user;
\q
```

#### Create Schema
```bash
# Run schema creation script
psql -h localhost -U dashboard_user -d ad_dashboard -f sql/schema/create_tables.sql

# Create indexes
psql -h localhost -U dashboard_user -d ad_dashboard -f sql/schema/indexes.sql
```

### 4. Environment Configuration

#### Create Environment File
Create a `.env` file in the project root:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ad_dashboard
DB_USER=dashboard_user
DB_PASSWORD=your_secure_password

# ETL Configuration
ETL_BATCH_SIZE=10000
ETL_LOG_LEVEL=INFO

# Data Generation
DATA_START_DATE=2024-01-01
DATA_END_DATE=2024-12-31
SIMULATION_SEED=42

# File Paths
RAW_DATA_PATH=data/raw/
PROCESSED_DATA_PATH=data/processed/
LOG_FILE_PATH=logs/etl.log
```

## Running the ETL Pipeline

### 1. Generate Sample Data
```bash
# Generate all data
python run_etl.py --step generate

# Check generated files
ls -la data/raw/
```

### 2. Load Data into Database
```bash
# Load data into PostgreSQL
python run_etl.py --step load

# Verify data loading
psql -h localhost -U dashboard_user -d ad_dashboard -c "\dt ad_dashboard.*"
```

### 3. Run Complete Pipeline
```bash
# Run full ETL pipeline
python run_etl.py --step all

# Check logs
tail -f logs/etl_*.log
```

## Tableau Setup

### 1. Install Tableau Desktop
- Download Tableau Desktop from tableau.com
- Install with free trial or license
- Create Tableau Public account for publishing

### 2. Connect to Database
1. Open Tableau Desktop
2. Click "Connect" → "More..." → "PostgreSQL"
3. Enter connection details:
   - Server: localhost
   - Port: 5432
   - Database: ad_dashboard
   - Authentication: Username and Password
   - Username: dashboard_user
   - Password: your_secure_password

### 3. Create Data Source
1. Select schema: ad_dashboard
2. Drag tables to canvas:
   - Start with fact tables
   - Add dimension tables
   - Create relationships/joins as needed
3. Create calculated fields for metrics
4. Save data source

### 4. Build Dashboard
1. Create individual worksheets for each tab:
   - Campaign Trends
   - A/B Test Performance
   - Customer Lifecycle
   - Geographic Segmentation
2. Design with Apple aesthetic:
   - Clean, minimal layout
   - Limited color palette
   - Clear typography
   - Ample white space
3. Create dashboard combining worksheets
4. Add interactivity with filters and actions

### 5. Publish to Tableau Public
1. Sign in to Tableau Public account
2. Server → Tableau Public → Save to Tableau Public
3. Configure privacy settings
4. Update README with public dashboard link

## Verification & Testing

### 1. Data Quality Checks
```bash
# Check row counts
psql -h localhost -U dashboard_user -d ad_dashboard -c "
SELECT 
  table_name,
  (xpath('/row/c/text()', query_to_xml(
    format('SELECT COUNT(*) FROM ad_dashboard.%I', table_name), 
    false, true, ''
  )))[1]::text::int as row_count
FROM information_schema.tables 
WHERE table_schema = 'ad_dashboard' AND table_type = 'BASE TABLE'
ORDER BY table_name;
"
```

### 2. Performance Testing
```bash
# Test query performance
psql -h localhost -U dashboard_user -d ad_dashboard -c "
EXPLAIN ANALYZE 
SELECT 
  d.date_value,
  c.campaign_name,
  SUM(f.impressions) as total_impressions,
  SUM(f.clicks) as total_clicks,
  SUM(f.spend) as total_spend
FROM ad_dashboard.fact_ad_performance f
JOIN ad_dashboard.dim_date d ON f.date_key = d.date_key
JOIN ad_dashboard.dim_campaign c ON f.campaign_key = c.campaign_key
WHERE d.date_value >= '2024-01-01'
GROUP BY d.date_value, c.campaign_name
ORDER BY d.date_value, total_spend DESC
LIMIT 100;
"
```

### 3. Dashboard Testing
- Test all filters and interactions
- Verify data accuracy against source
- Check performance on different screen sizes
- Validate Apple aesthetic guidelines

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check connection
psql -h localhost -U dashboard_user -d ad_dashboard -c "SELECT 1;"
```

#### Python Environment Issues
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Permission Issues
```bash
# Fix file permissions
chmod +x run_etl.py
chmod -R 755 data/ logs/

# Database permissions
psql -h localhost -U postgres -c "
GRANT ALL PRIVILEGES ON DATABASE ad_dashboard TO dashboard_user;
GRANT ALL PRIVILEGES ON SCHEMA ad_dashboard TO dashboard_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ad_dashboard TO dashboard_user;
"
```

#### Memory Issues
- Reduce `ETL_BATCH_SIZE` in `.env`
- Use `DATA_VOLUME_SCALE=small` for testing
- Monitor system resources during ETL

### Getting Help

1. **Check Logs**: Review log files in `logs/` directory
2. **GitHub Issues**: Report bugs or request features
3. **Documentation**: Review all docs in `docs/` directory
4. **Community**: Join discussions in project forums

## Next Steps

1. **Customize Data**: Modify data generation parameters
2. **Extend Dashboard**: Add new visualizations or metrics
3. **Automate**: Set up scheduled ETL runs
4. **Deploy**: Consider cloud deployment options
5. **Monitor**: Implement monitoring and alerting

## Maintenance

### Regular Tasks
- **Daily**: Monitor ETL logs and dashboard performance
- **Weekly**: Review data quality metrics
- **Monthly**: Update dashboard with new insights
- **Quarterly**: Review and optimize database performance

### Backup Strategy
```bash
# Database backup
pg_dump -h localhost -U dashboard_user ad_dashboard > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -h localhost -U dashboard_user -d ad_dashboard < backup_20241201.sql
``` 