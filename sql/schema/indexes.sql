-- Additional Performance Indexes
-- Interactive Apple-Style Ad Performance Dashboard
-- Advanced indexing for analytical workloads

SET search_path TO ad_dashboard;

-- =============================================================================
-- ADVANCED COMPOSITE INDEXES
-- =============================================================================

-- Multi-dimensional analysis indexes
CREATE INDEX idx_fact_ad_performance_multi_dim 
ON fact_ad_performance(date_key, campaign_key, geo_key, device_key);

CREATE INDEX idx_fact_web_analytics_multi_dim 
ON fact_web_analytics(date_key, campaign_key, geo_key, device_key);

-- Time-series analysis indexes
CREATE INDEX idx_fact_ad_performance_time_series 
ON fact_ad_performance(campaign_key, date_key, spend DESC);

CREATE INDEX idx_fact_web_analytics_time_series 
ON fact_web_analytics(campaign_key, date_key, page_views DESC);

-- A/B Testing analysis indexes
CREATE INDEX idx_ab_test_performance 
ON fact_ad_performance(ab_test_id, ab_test_variant, date_key) 
WHERE ab_test_id IS NOT NULL;

-- Geographic segmentation indexes (EMEA focus)
CREATE INDEX idx_emea_performance 
ON fact_ad_performance(geo_key, date_key) 
WHERE EXISTS (SELECT 1 FROM dim_geo g WHERE g.geo_key = fact_ad_performance.geo_key AND g.is_emea = TRUE);

-- Customer lifecycle indexes
CREATE INDEX idx_cohort_analysis 
ON fact_customer_retention(acquisition_date_key, period_number, user_key);

CREATE INDEX idx_funnel_analysis 
ON fact_funnel_events(session_id, funnel_step_number, event_timestamp);

-- =============================================================================
-- PARTIAL INDEXES FOR SPECIFIC USE CASES
-- =============================================================================

-- Active campaigns only
CREATE INDEX idx_active_campaigns_performance 
ON fact_ad_performance(date_key, spend DESC) 
WHERE campaign_key IN (
    SELECT campaign_key FROM dim_campaign WHERE status = 'Active'
);

-- High-value conversions
CREATE INDEX idx_high_value_conversions 
ON fact_conversions(date_key, conversion_value DESC) 
WHERE conversion_value > 100;

-- Bounced sessions for analysis
CREATE INDEX idx_bounced_sessions 
ON fact_web_analytics(date_key, campaign_key) 
WHERE is_bounce = TRUE;

-- Recent data performance indexes
CREATE INDEX idx_recent_ad_performance 
ON fact_ad_performance(date_key DESC, etl_timestamp DESC) 
WHERE date_key >= TO_NUMBER(TO_CHAR(CURRENT_DATE - INTERVAL '90 days', 'YYYYMMDD'), '99999999');

-- =============================================================================
-- FUNCTION-BASED INDEXES
-- =============================================================================

-- Month-based aggregations
CREATE INDEX idx_monthly_performance 
ON fact_ad_performance(EXTRACT(YEAR FROM (date_key::TEXT::DATE)), EXTRACT(MONTH FROM (date_key::TEXT::DATE)), campaign_key);

-- Quarter-based aggregations
CREATE INDEX idx_quarterly_performance 
ON fact_ad_performance(EXTRACT(YEAR FROM (date_key::TEXT::DATE)), EXTRACT(QUARTER FROM (date_key::TEXT::DATE)), campaign_key);

-- =============================================================================
-- DIMENSION TABLE OPTIMIZATION INDEXES
-- =============================================================================

-- Campaign hierarchy lookups
CREATE INDEX idx_dim_campaign_type_status ON dim_campaign(campaign_type, status);
CREATE INDEX idx_dim_campaign_platform ON dim_campaign(platform, status);

-- Geographic hierarchy lookups
CREATE INDEX idx_dim_geo_emea_country ON dim_geo(is_emea, country) WHERE is_emea = TRUE;
CREATE INDEX idx_dim_geo_hierarchy ON dim_geo(country, region, city);

-- Date dimension optimization
CREATE INDEX idx_dim_date_year_month ON dim_date(year, month);
CREATE INDEX idx_dim_date_quarter ON dim_date(year, quarter);
CREATE INDEX idx_dim_date_weekday ON dim_date(day_of_week, is_weekend);

-- User segmentation
CREATE INDEX idx_dim_user_segment ON dim_user(customer_segment, acquisition_campaign_key);

-- =============================================================================
-- COVERING INDEXES FOR COMMON DASHBOARD QUERIES
-- =============================================================================

-- Campaign trends dashboard
CREATE INDEX idx_campaign_trends_covering 
ON fact_ad_performance(campaign_key, date_key) 
INCLUDE (impressions, clicks, spend, attributed_conversions, attributed_revenue);

-- Geographic dashboard
CREATE INDEX idx_geo_dashboard_covering 
ON fact_ad_performance(geo_key, date_key) 
INCLUDE (impressions, clicks, spend, attributed_conversions, ctr, cpa);

-- Web analytics dashboard
CREATE INDEX idx_web_analytics_covering 
ON fact_web_analytics(date_key, campaign_key) 
INCLUDE (page_views, session_duration_seconds, is_bounce, goals_completed);

-- =============================================================================
-- MAINTENANCE COMMANDS
-- =============================================================================

-- Analyze tables for query optimization
ANALYZE dim_date;
ANALYZE dim_campaign;
ANALYZE dim_geo;
ANALYZE dim_device;
ANALYZE dim_user;
ANALYZE fact_ad_performance;
ANALYZE fact_web_analytics;
ANALYZE fact_conversions;
ANALYZE fact_customer_retention;
ANALYZE fact_funnel_events;

-- Comments for documentation
COMMENT ON INDEX idx_fact_ad_performance_multi_dim IS 'Multi-dimensional slice and dice queries';
COMMENT ON INDEX idx_ab_test_performance IS 'A/B test comparison and analysis';
COMMENT ON INDEX idx_emea_performance IS 'EMEA regional performance analysis';
COMMENT ON INDEX idx_cohort_analysis IS 'Customer cohort retention analysis';
COMMENT ON INDEX idx_campaign_trends_covering IS 'Campaign trends dashboard optimization';

-- Index usage monitoring query (for development/optimization)
/*
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE schemaname = 'ad_dashboard'
ORDER BY idx_scan DESC;
*/ 