-- Interactive Apple-Style Ad Performance Dashboard
-- Database Schema Creation Script
-- Version: 1.0

-- Clean up existing tables (use CASCADE carefully in production)
DROP SCHEMA IF EXISTS ad_dashboard CASCADE;
CREATE SCHEMA ad_dashboard;
SET search_path TO ad_dashboard;

-- =============================================================================
-- DIMENSION TABLES
-- =============================================================================

-- Date Dimension
CREATE TABLE dim_date (
    date_key INTEGER PRIMARY KEY,
    date_value DATE NOT NULL,
    day_of_week INTEGER NOT NULL,
    day_name VARCHAR(10) NOT NULL,
    month INTEGER NOT NULL,
    month_name VARCHAR(15) NOT NULL,
    quarter INTEGER NOT NULL,
    year INTEGER NOT NULL,
    week_of_year INTEGER NOT NULL,
    is_weekend BOOLEAN NOT NULL DEFAULT FALSE,
    is_holiday BOOLEAN NOT NULL DEFAULT FALSE,
    fiscal_quarter INTEGER,
    fiscal_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign Dimension
CREATE TABLE dim_campaign (
    campaign_key UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_campaign_id VARCHAR(100) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50) NOT NULL, -- 'Search', 'Social', 'Display', 'Video'
    campaign_objective VARCHAR(50), -- 'Awareness', 'Conversion', 'Traffic'
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Paused', 'Ended'
    budget DECIMAL(12,2),
    daily_budget DECIMAL(10,2),
    platform VARCHAR(50), -- 'Google Ads', 'Facebook', 'LinkedIn'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_campaign_id)
);

-- Ad Group Dimension
CREATE TABLE dim_ad_group (
    ad_group_key UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_ad_group_id VARCHAR(100) NOT NULL,
    ad_group_name VARCHAR(255) NOT NULL,
    campaign_key UUID REFERENCES dim_campaign(campaign_key),
    status VARCHAR(20) DEFAULT 'Active',
    bid_strategy VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_ad_group_id)
);

-- Geographic Dimension (EMEA Focus)
CREATE TABLE dim_geo (
    geo_key UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_geo_id VARCHAR(50),
    country VARCHAR(100) NOT NULL,
    country_code CHAR(2) NOT NULL, -- ISO 2-letter code
    region VARCHAR(100), -- Sub-regions within countries
    city VARCHAR(100),
    is_emea BOOLEAN NOT NULL DEFAULT TRUE,
    timezone VARCHAR(50),
    currency_code CHAR(3), -- EUR, GBP, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country_code, region, city)
);

-- Device Dimension
CREATE TABLE dim_device (
    device_key UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_device_id VARCHAR(50),
    device_type VARCHAR(20) NOT NULL, -- 'Mobile', 'Tablet', 'Desktop'
    operating_system VARCHAR(50),
    browser VARCHAR(50),
    device_category VARCHAR(30), -- 'Smartphone', 'Tablet', 'Computer'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(device_type, operating_system, browser)
);

-- User Dimension (Pseudonymized)
CREATE TABLE dim_user (
    user_key UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_user_id_hashed VARCHAR(255) NOT NULL,
    first_session_date DATE,
    first_conversion_date DATE,
    acquisition_campaign_key UUID REFERENCES dim_campaign(campaign_key),
    acquisition_geo_key UUID REFERENCES dim_geo(geo_key),
    customer_segment VARCHAR(50), -- 'New', 'Returning', 'VIP'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_user_id_hashed)
);

-- Source/Medium Dimension (for web analytics)
CREATE TABLE dim_source_medium (
    source_key UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(100) NOT NULL, -- 'google', 'facebook', 'direct'
    medium VARCHAR(100) NOT NULL, -- 'cpc', 'organic', 'referral', 'email'
    source_medium VARCHAR(200) GENERATED ALWAYS AS (source || ' / ' || medium) STORED,
    channel_grouping VARCHAR(50), -- 'Paid Search', 'Social Media', 'Direct'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source, medium)
);

-- Page Dimension (for web analytics)
CREATE TABLE dim_page (
    page_key UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_url TEXT NOT NULL,
    page_path VARCHAR(500),
    page_title VARCHAR(255),
    page_type VARCHAR(50), -- 'Landing', 'Product', 'Category', 'Checkout'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page_url)
);

-- =============================================================================
-- FACT TABLES
-- =============================================================================

-- Ad Performance Fact Table
CREATE TABLE fact_ad_performance (
    ad_performance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_key INTEGER NOT NULL REFERENCES dim_date(date_key),
    campaign_key UUID NOT NULL REFERENCES dim_campaign(campaign_key),
    ad_group_key UUID REFERENCES dim_ad_group(ad_group_key),
    geo_key UUID NOT NULL REFERENCES dim_geo(geo_key),
    device_key UUID NOT NULL REFERENCES dim_device(device_key),
    
    -- Core Ad Metrics
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    spend DECIMAL(12,2) DEFAULT 0.00,
    attributed_conversions INTEGER DEFAULT 0,
    attributed_revenue DECIMAL(12,2) DEFAULT 0.00,
    
    -- Calculated Metrics (can be computed or stored)
    ctr DECIMAL(8,4) GENERATED ALWAYS AS (
        CASE WHEN impressions > 0 THEN (clicks::DECIMAL / impressions * 100) ELSE 0 END
    ) STORED,
    cpc DECIMAL(10,2) GENERATED ALWAYS AS (
        CASE WHEN clicks > 0 THEN (spend / clicks) ELSE 0 END
    ) STORED,
    cpa DECIMAL(10,2) GENERATED ALWAYS AS (
        CASE WHEN attributed_conversions > 0 THEN (spend / attributed_conversions) ELSE 0 END
    ) STORED,
    roas DECIMAL(8,2) GENERATED ALWAYS AS (
        CASE WHEN spend > 0 THEN (attributed_revenue / spend) ELSE 0 END
    ) STORED,
    
    -- A/B Testing
    ab_test_id VARCHAR(100),
    ab_test_variant VARCHAR(50), -- 'A', 'B', 'Control', etc.
    
    -- ETL Metadata
    etl_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_source VARCHAR(50) DEFAULT 'simulated',
    
    -- Constraints
    CONSTRAINT positive_impressions CHECK (impressions >= 0),
    CONSTRAINT positive_clicks CHECK (clicks >= 0),
    CONSTRAINT positive_spend CHECK (spend >= 0),
    CONSTRAINT clicks_not_exceed_impressions CHECK (clicks <= impressions)
);

-- Web Analytics Fact Table
CREATE TABLE fact_web_analytics (
    web_analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL,
    session_start_timestamp TIMESTAMP NOT NULL,
    date_key INTEGER NOT NULL REFERENCES dim_date(date_key),
    user_key UUID REFERENCES dim_user(user_key),
    campaign_key UUID REFERENCES dim_campaign(campaign_key),
    geo_key UUID NOT NULL REFERENCES dim_geo(geo_key),
    device_key UUID NOT NULL REFERENCES dim_device(device_key),
    source_key UUID REFERENCES dim_source_medium(source_key),
    landing_page_key UUID REFERENCES dim_page(page_key),
    exit_page_key UUID REFERENCES dim_page(page_key),
    
    -- Session Metrics
    page_views INTEGER DEFAULT 0,
    session_duration_seconds INTEGER DEFAULT 0,
    is_bounce BOOLEAN DEFAULT FALSE,
    
    -- Conversion Events
    goals_completed INTEGER DEFAULT 0,
    ecommerce_transactions INTEGER DEFAULT 0,
    transaction_revenue DECIMAL(10,2) DEFAULT 0.00,
    
    -- UTM Parameters
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),
    
    -- ETL Metadata
    etl_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT positive_page_views CHECK (page_views >= 0),
    CONSTRAINT positive_session_duration CHECK (session_duration_seconds >= 0),
    CONSTRAINT bounce_logic CHECK (
        (is_bounce = TRUE AND (page_views <= 1 OR session_duration_seconds < 10)) OR
        (is_bounce = FALSE)
    )
);

-- Conversions Fact Table
CREATE TABLE fact_conversions (
    conversion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_conversion_id VARCHAR(255),
    conversion_timestamp TIMESTAMP NOT NULL,
    date_key INTEGER NOT NULL REFERENCES dim_date(date_key),
    user_key UUID REFERENCES dim_user(user_key),
    session_id VARCHAR(255),
    campaign_key UUID REFERENCES dim_campaign(campaign_key),
    geo_key UUID NOT NULL REFERENCES dim_geo(geo_key),
    device_key UUID NOT NULL REFERENCES dim_device(device_key),
    
    -- Conversion Details
    conversion_type VARCHAR(50) NOT NULL, -- 'Purchase', 'Lead', 'Signup'
    conversion_value DECIMAL(10,2) DEFAULT 0.00,
    quantity INTEGER DEFAULT 1,
    product_category VARCHAR(100),
    
    -- Attribution
    attribution_model VARCHAR(50) DEFAULT 'last_click',
    time_to_conversion_hours INTEGER,
    
    -- ETL Metadata
    etl_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT positive_conversion_value CHECK (conversion_value >= 0),
    CONSTRAINT positive_quantity CHECK (quantity > 0)
);

-- Customer Retention Fact Table (for cohort analysis)
CREATE TABLE fact_customer_retention (
    retention_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_key UUID NOT NULL REFERENCES dim_user(user_key),
    acquisition_date_key INTEGER NOT NULL REFERENCES dim_date(date_key),
    retention_date_key INTEGER NOT NULL REFERENCES dim_date(date_key),
    acquisition_campaign_key UUID REFERENCES dim_campaign(campaign_key),
    
    -- Retention Metrics
    period_number INTEGER NOT NULL, -- 0 = acquisition period, 1 = first retention period, etc.
    is_active BOOLEAN DEFAULT FALSE,
    transactions_count INTEGER DEFAULT 0,
    revenue_amount DECIMAL(10,2) DEFAULT 0.00,
    
    -- ETL Metadata
    etl_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_period_number CHECK (period_number >= 0)
);

-- Funnel Events Fact Table
CREATE TABLE fact_funnel_events (
    funnel_event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_timestamp TIMESTAMP NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    user_key UUID REFERENCES dim_user(user_key),
    date_key INTEGER NOT NULL REFERENCES dim_date(date_key),
    campaign_key UUID REFERENCES dim_campaign(campaign_key),
    
    -- Funnel Steps
    funnel_step VARCHAR(50) NOT NULL, -- 'page_view', 'add_to_cart', 'checkout', 'purchase'
    funnel_step_number INTEGER NOT NULL,
    step_completed BOOLEAN DEFAULT TRUE,
    
    -- Event Details
    page_key UUID REFERENCES dim_page(page_key),
    event_value DECIMAL(10,2) DEFAULT 0.00,
    
    -- ETL Metadata
    etl_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT positive_step_number CHECK (funnel_step_number > 0)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Date-based queries (most common)
CREATE INDEX idx_fact_ad_performance_date ON fact_ad_performance(date_key);
CREATE INDEX idx_fact_web_analytics_date ON fact_web_analytics(date_key);
CREATE INDEX idx_fact_conversions_date ON fact_conversions(date_key);

-- Campaign-based queries
CREATE INDEX idx_fact_ad_performance_campaign ON fact_ad_performance(campaign_key);
CREATE INDEX idx_fact_web_analytics_campaign ON fact_web_analytics(campaign_key);
CREATE INDEX idx_fact_conversions_campaign ON fact_conversions(campaign_key);

-- Geographic queries (EMEA focus)
CREATE INDEX idx_fact_ad_performance_geo ON fact_ad_performance(geo_key);
CREATE INDEX idx_fact_web_analytics_geo ON fact_web_analytics(geo_key);

-- User journey queries
CREATE INDEX idx_fact_web_analytics_user ON fact_web_analytics(user_key);
CREATE INDEX idx_fact_conversions_user ON fact_conversions(user_key);
CREATE INDEX idx_fact_customer_retention_user ON fact_customer_retention(user_key);

-- Session-based queries
CREATE INDEX idx_fact_web_analytics_session ON fact_web_analytics(session_id);
CREATE INDEX idx_fact_funnel_events_session ON fact_funnel_events(session_id);

-- A/B Test queries
CREATE INDEX idx_fact_ad_performance_ab_test ON fact_ad_performance(ab_test_id, ab_test_variant);

-- Composite indexes for common query patterns
CREATE INDEX idx_fact_ad_performance_date_campaign ON fact_ad_performance(date_key, campaign_key);
CREATE INDEX idx_fact_ad_performance_date_geo ON fact_ad_performance(date_key, geo_key);

-- =============================================================================
-- COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON SCHEMA ad_dashboard IS 'Apple-Style Ad Performance Dashboard - Data Warehouse Schema';

COMMENT ON TABLE dim_date IS 'Date dimension with fiscal and calendar attributes';
COMMENT ON TABLE dim_campaign IS 'Campaign dimension with hierarchy and metadata';
COMMENT ON TABLE dim_geo IS 'Geographic dimension focused on EMEA region';
COMMENT ON TABLE dim_device IS 'Device and technology dimension';
COMMENT ON TABLE dim_user IS 'Pseudonymized user dimension for privacy compliance';

COMMENT ON TABLE fact_ad_performance IS 'Core ad delivery and performance metrics';
COMMENT ON TABLE fact_web_analytics IS 'Web session and behavior metrics (Adobe Analytics style)';
COMMENT ON TABLE fact_conversions IS 'Conversion events with attribution';
COMMENT ON TABLE fact_customer_retention IS 'Customer cohort and retention analysis';
COMMENT ON TABLE fact_funnel_events IS 'Conversion funnel step tracking';

-- Grant permissions (adjust as needed for your environment)
-- GRANT USAGE ON SCHEMA ad_dashboard TO tableau_user;
-- GRANT SELECT ON ALL TABLES IN SCHEMA ad_dashboard TO tableau_user; 