# Data Dictionary - Apple Interactive Ad Performance Dashboard

This document provides comprehensive documentation of the data model, including all tables, columns, relationships, and business logic.

## Schema Overview

The data warehouse implements a **star schema** design optimized for analytical queries, with fact tables containing metrics and dimension tables containing descriptive attributes.

### Schema: `ad_dashboard`

## Dimension Tables

### dim_date
**Purpose**: Date dimension with calendar and fiscal attributes for time-based analysis.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `date_key` | INTEGER (PK) | Surrogate key in YYYYMMDD format | 20240615 |
| `date_value` | DATE | Actual date value | 2024-06-15 |
| `day_of_week` | INTEGER | Day of week (1=Monday, 7=Sunday) | 6 |
| `day_name` | VARCHAR(10) | Name of the day | Saturday |
| `month` | INTEGER | Month number (1-12) | 6 |
| `month_name` | VARCHAR(15) | Name of the month | June |
| `quarter` | INTEGER | Quarter number (1-4) | 2 |
| `year` | INTEGER | Year | 2024 |
| `week_of_year` | INTEGER | ISO week number | 24 |
| `is_weekend` | BOOLEAN | True if Saturday or Sunday | true |
| `is_holiday` | BOOLEAN | True if major holiday | false |
| `fiscal_quarter` | INTEGER | Fiscal quarter (if different from calendar) | 2 |
| `fiscal_year` | INTEGER | Fiscal year | 2024 |

**Business Rules**:
- Date keys are generated as INTEGER for performance
- Fiscal year/quarter can be customized per business requirements
- Holiday detection includes major EMEA holidays

---

### dim_campaign
**Purpose**: Campaign dimension containing campaign metadata and hierarchy.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `campaign_key` | UUID (PK) | Unique campaign identifier | 550e8400-e29b-41d4-a716-446655440000 |
| `source_campaign_id` | VARCHAR(100) | Campaign ID from source system | cmp_0001 |
| `campaign_name` | VARCHAR(255) | Human-readable campaign name | Search Campaign 1 - Google Ads |
| `campaign_type` | VARCHAR(50) | Type of campaign | Search, Social, Display, Video |
| `campaign_objective` | VARCHAR(50) | Primary campaign objective | Awareness, Conversion, Traffic |
| `start_date` | DATE | Campaign start date | 2024-01-15 |
| `end_date` | DATE | Campaign end date (NULL if ongoing) | 2024-12-31 |
| `status` | VARCHAR(20) | Current campaign status | Active, Paused, Ended |
| `budget` | DECIMAL(12,2) | Total campaign budget | 25000.00 |
| `daily_budget` | DECIMAL(10,2) | Daily budget limit | 500.00 |
| `platform` | VARCHAR(50) | Advertising platform | Google Ads, Facebook, LinkedIn |

**Business Rules**:
- Campaign names follow pattern: {Type} Campaign {Number} - {Platform}
- Budget fields in local currency (primarily EUR for EMEA)
- Status changes tracked through updated_at timestamp

---

### dim_geo
**Purpose**: Geographic dimension focused on EMEA region for location-based analysis.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `geo_key` | UUID (PK) | Unique geographic identifier | 550e8400-e29b-41d4-a716-446655440001 |
| `source_geo_id` | VARCHAR(50) | Geographic ID from source system | geo_uk_001 |
| `country` | VARCHAR(100) | Country name | United Kingdom |
| `country_code` | CHAR(2) | ISO 2-letter country code | GB |
| `region` | VARCHAR(100) | Region/state within country | England |
| `city` | VARCHAR(100) | City name | London |
| `is_emea` | BOOLEAN | True for EMEA countries | true |
| `timezone` | VARCHAR(50) | Timezone identifier | Europe/London |
| `currency_code` | CHAR(3) | Local currency code | GBP |

**Business Rules**:
- All records have `is_emea = true` (project focus)
- Country codes follow ISO 3166-1 alpha-2 standard
- Hierarchy: Country > Region > City
- Currency codes follow ISO 4217 standard

---

### dim_device
**Purpose**: Device and technology dimension for cross-device analysis.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `device_key` | UUID (PK) | Unique device identifier | 550e8400-e29b-41d4-a716-446655440002 |
| `source_device_id` | VARCHAR(50) | Device ID from source system | dev_mobile_ios |
| `device_type` | VARCHAR(20) | Type of device | Mobile, Tablet, Desktop |
| `operating_system` | VARCHAR(50) | Operating system | iOS, Android, Windows, macOS |
| `browser` | VARCHAR(50) | Browser name | Safari, Chrome, Firefox |
| `device_category` | VARCHAR(30) | Device category | Smartphone, Tablet, Computer |

**Business Rules**:
- Device combinations represent unique device profiles
- Categories align with Google Analytics definitions
- Used for cross-device journey analysis

---

### dim_user
**Purpose**: Pseudonymized user dimension for customer analysis while maintaining privacy.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `user_key` | UUID (PK) | Unique user identifier | 550e8400-e29b-41d4-a716-446655440003 |
| `source_user_id_hashed` | VARCHAR(255) | Hashed user ID from source | SHA256 hash |
| `first_session_date` | DATE | Date of first session | 2024-01-15 |
| `first_conversion_date` | DATE | Date of first conversion | 2024-01-20 |
| `acquisition_campaign_key` | UUID (FK) | Campaign that acquired user | → dim_campaign |
| `acquisition_geo_key` | UUID (FK) | Geographic location of acquisition | → dim_geo |
| `customer_segment` | VARCHAR(50) | Customer segment | New, Returning, VIP |

**Business Rules**:
- All user IDs are cryptographically hashed
- First touch attribution for acquisition campaign
- Segments updated based on behavior patterns
- Privacy-compliant with GDPR requirements

---

## Fact Tables

### fact_ad_performance
**Purpose**: Core advertising performance metrics at daily granularity.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `ad_performance_id` | UUID (PK) | Unique record identifier | 550e8400-e29b-41d4-a716-446655440004 |
| `date_key` | INTEGER (FK) | Date of performance | 20240615 → dim_date |
| `campaign_key` | UUID (FK) | Campaign identifier | → dim_campaign |
| `ad_group_key` | UUID (FK) | Ad group identifier | → dim_ad_group |
| `geo_key` | UUID (FK) | Geographic location | → dim_geo |
| `device_key` | UUID (FK) | Device type | → dim_device |
| `impressions` | INTEGER | Number of ad impressions | 10000 |
| `clicks` | INTEGER | Number of clicks | 250 |
| `spend` | DECIMAL(12,2) | Amount spent | 375.50 |
| `attributed_conversions` | INTEGER | Number of conversions | 12 |
| `attributed_revenue` | DECIMAL(12,2) | Revenue from conversions | 900.00 |
| `ctr` | DECIMAL(8,4) | Click-through rate (%) | 2.5000 |
| `cpc` | DECIMAL(10,2) | Cost per click | 1.50 |
| `cpa` | DECIMAL(10,2) | Cost per acquisition | 31.29 |
| `roas` | DECIMAL(8,2) | Return on ad spend | 2.40 |
| `ab_test_id` | VARCHAR(100) | A/B test identifier | test_001 |
| `ab_test_variant` | VARCHAR(50) | Test variant | A, B, Control |

**Business Rules**:
- Impressions ≥ Clicks (enforced by constraint)
- Calculated fields auto-computed on insert/update
- A/B test fields nullable (only 20% of campaigns)
- Partitioned by date_key for performance

**Calculated Fields**:
- `ctr = (clicks / impressions) * 100`
- `cpc = spend / clicks`
- `cpa = spend / attributed_conversions`
- `roas = attributed_revenue / spend`

---

### fact_web_analytics
**Purpose**: Web session behavior metrics inspired by Adobe Analytics.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `web_analytics_id` | UUID (PK) | Unique session record | 550e8400-e29b-41d4-a716-446655440005 |
| `session_id` | VARCHAR(255) | Unique session identifier | sess_abc123 |
| `session_start_timestamp` | TIMESTAMP | Session start time | 2024-06-15 14:30:00 |
| `date_key` | INTEGER (FK) | Session date | 20240615 → dim_date |
| `user_key` | UUID (FK) | User identifier | → dim_user |
| `campaign_key` | UUID (FK) | Attributed campaign | → dim_campaign |
| `geo_key` | UUID (FK) | Session location | → dim_geo |
| `device_key` | UUID (FK) | Device used | → dim_device |
| `source_key` | UUID (FK) | Traffic source | → dim_source_medium |
| `landing_page_key` | UUID (FK) | Landing page | → dim_page |
| `exit_page_key` | UUID (FK) | Exit page | → dim_page |
| `page_views` | INTEGER | Pages viewed in session | 5 |
| `session_duration_seconds` | INTEGER | Session duration | 180 |
| `is_bounce` | BOOLEAN | Single page session | false |
| `goals_completed` | INTEGER | Number of goals completed | 1 |
| `ecommerce_transactions` | INTEGER | E-commerce transactions | 0 |
| `transaction_revenue` | DECIMAL(10,2) | Transaction revenue | 0.00 |

**Business Rules**:
- Bounce = single page view OR < 30 seconds
- Goals represent micro-conversions
- UTM parameters parsed into campaign attribution
- Session timeout = 30 minutes of inactivity

---

### fact_conversions
**Purpose**: Detailed conversion events with attribution data.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `conversion_id` | UUID (PK) | Unique conversion identifier | 550e8400-e29b-41d4-a716-446655440006 |
| `source_conversion_id` | VARCHAR(255) | Source system conversion ID | order_12345 |
| `conversion_timestamp` | TIMESTAMP | Conversion date/time | 2024-06-15 15:45:00 |
| `date_key` | INTEGER (FK) | Conversion date | 20240615 → dim_date |
| `user_key` | UUID (FK) | Converting user | → dim_user |
| `session_id` | VARCHAR(255) | Associated session | sess_abc123 |
| `campaign_key` | UUID (FK) | Attributed campaign | → dim_campaign |
| `geo_key` | UUID (FK) | Conversion location | → dim_geo |
| `device_key` | UUID (FK) | Device used | → dim_device |
| `conversion_type` | VARCHAR(50) | Type of conversion | Purchase, Lead, Signup |
| `conversion_value` | DECIMAL(10,2) | Monetary value | 75.00 |
| `quantity` | INTEGER | Number of items | 1 |
| `product_category` | VARCHAR(100) | Product category | Electronics |
| `attribution_model` | VARCHAR(50) | Attribution model used | last_click |
| `time_to_conversion_hours` | INTEGER | Hours from first touch | 48 |

**Business Rules**:
- Last-click attribution by default
- Conversion value in local currency
- Time to conversion measured from first campaign interaction
- Multiple conversion types supported

---

### fact_customer_retention
**Purpose**: Customer cohort analysis for retention tracking.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `retention_id` | UUID (PK) | Unique retention record | 550e8400-e29b-41d4-a716-446655440007 |
| `user_key` | UUID (FK) | User being tracked | → dim_user |
| `acquisition_date_key` | INTEGER (FK) | User acquisition date | 20240101 → dim_date |
| `retention_date_key` | INTEGER (FK) | Retention period date | 20240201 → dim_date |
| `acquisition_campaign_key` | UUID (FK) | Acquisition campaign | → dim_campaign |
| `period_number` | INTEGER | Retention period (0=acquisition) | 1 |
| `is_active` | BOOLEAN | Active in this period | true |
| `transactions_count` | INTEGER | Transactions in period | 2 |
| `revenue_amount` | DECIMAL(10,2) | Revenue in period | 150.00 |

**Business Rules**:
- Period 0 = acquisition period
- Period 1 = first retention period (e.g., month 1)
- Cohorts defined by acquisition date
- Activity measured by transactions/engagement

---

### fact_funnel_events
**Purpose**: Conversion funnel step tracking for customer journey analysis.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `funnel_event_id` | UUID (PK) | Unique event identifier | 550e8400-e29b-41d4-a716-446655440008 |
| `event_timestamp` | TIMESTAMP | Event occurrence time | 2024-06-15 14:35:00 |
| `session_id` | VARCHAR(255) | Associated session | sess_abc123 |
| `user_key` | UUID (FK) | User performing action | → dim_user |
| `date_key` | INTEGER (FK) | Event date | 20240615 → dim_date |
| `campaign_key` | UUID (FK) | Attributed campaign | → dim_campaign |
| `funnel_step` | VARCHAR(50) | Step name | page_view, add_to_cart, purchase |
| `funnel_step_number` | INTEGER | Step sequence number | 2 |
| `step_completed` | BOOLEAN | Step successfully completed | true |
| `page_key` | UUID (FK) | Associated page | → dim_page |
| `event_value` | DECIMAL(10,2) | Event monetary value | 25.00 |

**Business Rules**:
- Steps numbered sequentially (1, 2, 3, ...)
- Standard funnel: page_view → add_to_cart → checkout → purchase
- Events within session context
- Value captured for revenue-generating steps

---

## Relationships

### Primary Relationships
```
dim_date (1) ←→ (M) fact_ad_performance
dim_campaign (1) ←→ (M) fact_ad_performance
dim_geo (1) ←→ (M) fact_ad_performance
dim_device (1) ←→ (M) fact_ad_performance

dim_date (1) ←→ (M) fact_web_analytics
dim_user (1) ←→ (M) fact_web_analytics
dim_campaign (1) ←→ (M) fact_web_analytics

dim_date (1) ←→ (M) fact_conversions
dim_user (1) ←→ (M) fact_conversions
dim_campaign (1) ←→ (M) fact_conversions
```

### Attribution Links
```
fact_web_analytics.utm_campaign → dim_campaign.source_campaign_id
fact_conversions.session_id → fact_web_analytics.session_id
fact_funnel_events.session_id → fact_web_analytics.session_id
```

## Data Lineage

### Source Systems (Simulated)
1. **Ad Platforms**: Google Ads, Facebook Ads, LinkedIn Ads
2. **Web Analytics**: Adobe Analytics (simulated)
3. **E-commerce**: Transaction system (simulated)
4. **CRM**: Customer data (simulated)

### ETL Process
1. **Extract**: CSV files generated by simulation
2. **Transform**: Python pandas for cleaning and business logic
3. **Load**: PostgreSQL COPY for bulk loading
4. **Validate**: Data quality checks and constraints

## Business Definitions

### Key Performance Indicators (KPIs)

| KPI | Calculation | Description |
|-----|-------------|-------------|
| **Click-Through Rate (CTR)** | (Clicks ÷ Impressions) × 100 | Percentage of impressions that resulted in clicks |
| **Cost Per Click (CPC)** | Spend ÷ Clicks | Average cost for each click |
| **Conversion Rate (CVR)** | (Conversions ÷ Clicks) × 100 | Percentage of clicks that converted |
| **Cost Per Acquisition (CPA)** | Spend ÷ Conversions | Average cost to acquire a customer |
| **Return on Ad Spend (ROAS)** | Revenue ÷ Spend | Revenue generated per dollar spent |
| **Average Order Value (AOV)** | Revenue ÷ Transactions | Average value per transaction |
| **Bounce Rate** | Bounced Sessions ÷ Total Sessions | Percentage of single-page sessions |
| **Session Duration** | Average time spent per session | Engagement quality metric |

### Customer Segments
- **New**: First-time visitors/customers
- **Returning**: Previous customers making repeat purchases
- **VIP**: High-value customers (top 10% by revenue)

### Attribution Models
- **Last Click**: Credit to final click before conversion
- **First Click**: Credit to initial click that started journey
- **Linear**: Equal credit across all touchpoints
- **Time Decay**: More credit to recent touchpoints

## Data Quality Rules

### Validation Constraints
- Impressions ≥ 0
- Clicks ≤ Impressions
- Spend ≥ 0
- Session Duration ≥ 0
- Conversion Value ≥ 0
- Date Keys must exist in dim_date
- All foreign keys must reference valid dimension records

### Business Rules
- EMEA countries only (is_emea = true)
- Campaign dates within valid ranges
- Attribution models from approved list
- Currency consistency within geographic regions
- Privacy compliance (all user data hashed)

## Performance Optimization

### Partitioning Strategy
- **fact_ad_performance**: Monthly partitions by date_key
- **fact_web_analytics**: Monthly partitions by date_key
- **fact_conversions**: Monthly partitions by date_key

### Indexing Strategy
- **Date-based queries**: Indexes on date_key columns
- **Campaign analysis**: Indexes on campaign_key columns
- **Geographic analysis**: Indexes on geo_key columns
- **User journey**: Indexes on user_key and session_id columns
- **A/B testing**: Indexes on ab_test_id and ab_test_variant

### Materialized Views
- Daily campaign summaries
- Monthly cohort analysis
- Geographic performance aggregates
- Funnel conversion rates 