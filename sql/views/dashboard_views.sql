-- Dashboard Views for Apple Ad Performance Dashboard
-- Pre-aggregated views optimized for Tableau queries
-- Version: 1.0

SET search_path TO ad_dashboard;

-- =============================================================================
-- CAMPAIGN PERFORMANCE VIEWS
-- =============================================================================

-- Daily Campaign Summary View
CREATE OR REPLACE VIEW v_daily_campaign_summary AS
SELECT 
    d.date_value,
    d.year,
    d.month,
    d.quarter,
    d.day_name,
    d.is_weekend,
    c.campaign_name,
    c.campaign_type,
    c.platform,
    c.status as campaign_status,
    g.country,
    g.is_emea,
    dev.device_type,
    
    -- Core Metrics
    SUM(f.impressions) as total_impressions,
    SUM(f.clicks) as total_clicks,
    SUM(f.spend) as total_spend,
    SUM(f.attributed_conversions) as total_conversions,
    SUM(f.attributed_revenue) as total_revenue,
    
    -- Calculated KPIs
    CASE 
        WHEN SUM(f.impressions) > 0 
        THEN ROUND((SUM(f.clicks)::DECIMAL / SUM(f.impressions) * 100), 4)
        ELSE 0 
    END as ctr_percent,
    
    CASE 
        WHEN SUM(f.clicks) > 0 
        THEN ROUND((SUM(f.spend) / SUM(f.clicks)), 2)
        ELSE 0 
    END as avg_cpc,
    
    CASE 
        WHEN SUM(f.attributed_conversions) > 0 
        THEN ROUND((SUM(f.spend) / SUM(f.attributed_conversions)), 2)
        ELSE 0 
    END as avg_cpa,
    
    CASE 
        WHEN SUM(f.spend) > 0 
        THEN ROUND((SUM(f.attributed_revenue) / SUM(f.spend)), 2)
        ELSE 0 
    END as roas,
    
    -- Record Metadata
    COUNT(*) as record_count,
    MAX(f.etl_timestamp) as last_updated
    
FROM fact_ad_performance f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_campaign c ON f.campaign_key = c.campaign_key
JOIN dim_geo g ON f.geo_key = g.geo_key
JOIN dim_device dev ON f.device_key = dev.device_key

GROUP BY 
    d.date_value, d.year, d.month, d.quarter, d.day_name, d.is_weekend,
    c.campaign_name, c.campaign_type, c.platform, c.status,
    g.country, g.is_emea, dev.device_type;

-- Monthly Campaign Rollup View
CREATE OR REPLACE VIEW v_monthly_campaign_summary AS
SELECT 
    d.year,
    d.month,
    d.month_name,
    d.quarter,
    c.campaign_name,
    c.campaign_type,
    c.platform,
    
    -- Aggregated Metrics
    SUM(f.impressions) as total_impressions,
    SUM(f.clicks) as total_clicks,
    SUM(f.spend) as total_spend,
    SUM(f.attributed_conversions) as total_conversions,
    SUM(f.attributed_revenue) as total_revenue,
    
    -- KPIs
    ROUND(AVG(f.ctr), 4) as avg_ctr,
    ROUND(AVG(f.cpc), 2) as avg_cpc,
    ROUND(AVG(f.cpa), 2) as avg_cpa,
    ROUND(AVG(f.roas), 2) as avg_roas,
    
    -- Performance Indicators
    COUNT(DISTINCT f.date_key) as active_days,
    COUNT(DISTINCT f.geo_key) as unique_geos,
    COUNT(*) as total_records
    
FROM fact_ad_performance f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_campaign c ON f.campaign_key = c.campaign_key

GROUP BY 
    d.year, d.month, d.month_name, d.quarter,
    c.campaign_name, c.campaign_type, c.platform;

-- =============================================================================
-- A/B TEST PERFORMANCE VIEWS
-- =============================================================================

-- A/B Test Comparison View
CREATE OR REPLACE VIEW v_ab_test_performance AS
SELECT 
    f.ab_test_id,
    f.ab_test_variant,
    c.campaign_name,
    c.campaign_type,
    
    -- Date Range
    MIN(d.date_value) as test_start_date,
    MAX(d.date_value) as test_end_date,
    COUNT(DISTINCT d.date_value) as test_days,
    
    -- Performance Metrics
    SUM(f.impressions) as total_impressions,
    SUM(f.clicks) as total_clicks,
    SUM(f.spend) as total_spend,
    SUM(f.attributed_conversions) as total_conversions,
    SUM(f.attributed_revenue) as total_revenue,
    
    -- Test-Specific KPIs
    ROUND((SUM(f.clicks)::DECIMAL / SUM(f.impressions) * 100), 4) as ctr_percent,
    ROUND((SUM(f.attributed_conversions)::DECIMAL / SUM(f.clicks) * 100), 4) as cvr_percent,
    ROUND((SUM(f.spend) / SUM(f.clicks)), 2) as avg_cpc,
    ROUND((SUM(f.spend) / SUM(f.attributed_conversions)), 2) as avg_cpa,
    ROUND((SUM(f.attributed_revenue) / SUM(f.spend)), 2) as roas,
    
    -- Statistical Metrics
    COUNT(*) as sample_size,
    STDDEV(f.ctr) as ctr_stddev,
    STDDEV(f.cpa) as cpa_stddev
    
FROM fact_ad_performance f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_campaign c ON f.campaign_key = c.campaign_key

WHERE f.ab_test_id IS NOT NULL

GROUP BY 
    f.ab_test_id, f.ab_test_variant,
    c.campaign_name, c.campaign_type;

-- =============================================================================
-- GEOGRAPHIC PERFORMANCE VIEWS (EMEA)
-- =============================================================================

-- EMEA Geographic Performance Summary
CREATE OR REPLACE VIEW v_emea_geo_performance AS
SELECT 
    g.country,
    g.country_code,
    g.currency_code,
    g.timezone,
    
    -- Time Period
    DATE_TRUNC('month', d.date_value) as month_year,
    
    -- Performance Metrics
    SUM(f.impressions) as total_impressions,
    SUM(f.clicks) as total_clicks,
    SUM(f.spend) as total_spend,
    SUM(f.attributed_conversions) as total_conversions,
    SUM(f.attributed_revenue) as total_revenue,
    
    -- Geographic KPIs
    ROUND((SUM(f.clicks)::DECIMAL / SUM(f.impressions) * 100), 4) as ctr_percent,
    ROUND((SUM(f.spend) / SUM(f.clicks)), 2) as avg_cpc,
    ROUND((SUM(f.spend) / SUM(f.attributed_conversions)), 2) as avg_cpa,
    ROUND((SUM(f.attributed_revenue) / SUM(f.spend)), 2) as roas,
    
    -- Market Share Metrics
    COUNT(DISTINCT c.campaign_key) as active_campaigns,
    COUNT(DISTINCT f.date_key) as active_days,
    COUNT(*) as total_records
    
FROM fact_ad_performance f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_campaign c ON f.campaign_key = c.campaign_key
JOIN dim_geo g ON f.geo_key = g.geo_key

WHERE g.is_emea = TRUE

GROUP BY 
    g.country, g.country_code, g.currency_code, g.timezone,
    DATE_TRUNC('month', d.date_value);

-- =============================================================================
-- WEB ANALYTICS VIEWS
-- =============================================================================

-- Web Analytics Daily Summary
CREATE OR REPLACE VIEW v_web_analytics_daily AS
SELECT 
    d.date_value,
    d.day_name,
    d.is_weekend,
    c.campaign_name,
    c.campaign_type,
    g.country,
    dev.device_type,
    
    -- Session Metrics
    COUNT(DISTINCT w.session_id) as total_sessions,
    COUNT(DISTINCT w.user_key) as unique_users,
    SUM(w.page_views) as total_page_views,
    SUM(w.session_duration_seconds) as total_session_duration,
    SUM(w.goals_completed) as total_goals,
    
    -- Web Analytics KPIs
    ROUND(AVG(w.page_views), 2) as avg_pages_per_session,
    ROUND(AVG(w.session_duration_seconds), 0) as avg_session_duration,
    ROUND((SUM(CASE WHEN w.is_bounce THEN 1 ELSE 0 END)::DECIMAL / COUNT(*) * 100), 2) as bounce_rate_percent,
    ROUND((SUM(w.goals_completed)::DECIMAL / COUNT(DISTINCT w.session_id) * 100), 2) as goal_conversion_rate_percent,
    
    -- Traffic Quality
    ROUND((COUNT(DISTINCT w.user_key)::DECIMAL / COUNT(DISTINCT w.session_id)), 2) as sessions_per_user
    
FROM fact_web_analytics w
JOIN dim_date d ON w.date_key = d.date_key
LEFT JOIN dim_campaign c ON w.campaign_key = c.campaign_key
JOIN dim_geo g ON w.geo_key = g.geo_key
JOIN dim_device dev ON w.device_key = dev.device_key

GROUP BY 
    d.date_value, d.day_name, d.is_weekend,
    c.campaign_name, c.campaign_type,
    g.country, dev.device_type;

-- =============================================================================
-- CUSTOMER LIFECYCLE VIEWS
-- =============================================================================

-- Cohort Retention Analysis View
CREATE OR REPLACE VIEW v_cohort_retention AS
SELECT 
    ac.year as acquisition_year,
    ac.month as acquisition_month,
    ac.month_name as acquisition_month_name,
    r.period_number,
    
    -- Cohort Metrics
    COUNT(DISTINCT r.user_key) as active_users,
    SUM(r.transactions_count) as total_transactions,
    SUM(r.revenue_amount) as total_revenue,
    
    -- Retention Rates (calculated against period 0)
    ROUND(AVG(r.revenue_amount), 2) as avg_revenue_per_user,
    COUNT(DISTINCT CASE WHEN r.period_number = 0 THEN r.user_key END) as cohort_size,
    
    -- Acquisition Campaign Attribution
    c.campaign_name as acquisition_campaign,
    c.campaign_type as acquisition_campaign_type
    
FROM fact_customer_retention r
JOIN dim_date ac ON r.acquisition_date_key = ac.date_key
LEFT JOIN dim_campaign c ON r.acquisition_campaign_key = c.campaign_key

WHERE r.is_active = TRUE

GROUP BY 
    ac.year, ac.month, ac.month_name, r.period_number,
    c.campaign_name, c.campaign_type;

-- =============================================================================
-- FUNNEL CONVERSION VIEWS
-- =============================================================================

-- Conversion Funnel Analysis View
CREATE OR REPLACE VIEW v_conversion_funnel AS
SELECT 
    DATE_TRUNC('week', d.date_value) as week_start,
    c.campaign_name,
    c.campaign_type,
    f.funnel_step,
    f.funnel_step_number,
    
    -- Funnel Metrics
    COUNT(*) as total_events,
    COUNT(DISTINCT f.session_id) as unique_sessions,
    COUNT(DISTINCT f.user_key) as unique_users,
    SUM(f.event_value) as total_event_value,
    
    -- Step Completion
    SUM(CASE WHEN f.step_completed THEN 1 ELSE 0 END) as completed_events,
    ROUND((SUM(CASE WHEN f.step_completed THEN 1 ELSE 0 END)::DECIMAL / COUNT(*) * 100), 2) as completion_rate_percent
    
FROM fact_funnel_events f
JOIN dim_date d ON f.date_key = d.date_key
LEFT JOIN dim_campaign c ON f.campaign_key = c.campaign_key

GROUP BY 
    DATE_TRUNC('week', d.date_value),
    c.campaign_name, c.campaign_type,
    f.funnel_step, f.funnel_step_number;

-- =============================================================================
-- PERFORMANCE SUMMARY VIEWS
-- =============================================================================

-- Executive Dashboard Summary
CREATE OR REPLACE VIEW v_executive_summary AS
SELECT 
    'Campaign Performance' as metric_category,
    COUNT(DISTINCT c.campaign_key) as total_campaigns,
    SUM(f.impressions) as total_impressions,
    SUM(f.clicks) as total_clicks,
    SUM(f.spend) as total_spend,
    SUM(f.attributed_conversions) as total_conversions,
    SUM(f.attributed_revenue) as total_revenue,
    ROUND(AVG(f.ctr), 2) as avg_ctr,
    ROUND(AVG(f.roas), 2) as avg_roas,
    COUNT(DISTINCT g.country) as countries_reached,
    MAX(d.date_value) as last_update_date
    
FROM fact_ad_performance f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_campaign c ON f.campaign_key = c.campaign_key  
JOIN dim_geo g ON f.geo_key = g.geo_key

WHERE d.date_value >= CURRENT_DATE - INTERVAL '30 days';

-- =============================================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- =============================================================================

-- Create materialized view for heavy campaign analysis
CREATE MATERIALIZED VIEW mv_campaign_trends AS
SELECT 
    d.date_value,
    c.campaign_name,
    c.campaign_type,
    c.platform,
    SUM(f.impressions) as impressions,
    SUM(f.clicks) as clicks,
    SUM(f.spend) as spend,
    SUM(f.attributed_conversions) as conversions,
    SUM(f.attributed_revenue) as revenue,
    AVG(f.ctr) as avg_ctr,
    AVG(f.cpc) as avg_cpc,
    AVG(f.cpa) as avg_cpa,
    AVG(f.roas) as avg_roas
FROM fact_ad_performance f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_campaign c ON f.campaign_key = c.campaign_key
GROUP BY d.date_value, c.campaign_name, c.campaign_type, c.platform;

-- Create index on materialized view
CREATE INDEX idx_mv_campaign_trends_date ON mv_campaign_trends(date_value);
CREATE INDEX idx_mv_campaign_trends_campaign ON mv_campaign_trends(campaign_name);

-- =============================================================================
-- VIEW GRANTS AND COMMENTS
-- =============================================================================

-- Grant read access to tableau user (uncomment when ready)
-- GRANT SELECT ON ALL TABLES IN SCHEMA ad_dashboard TO tableau_user;

-- Add comments for documentation
COMMENT ON VIEW v_daily_campaign_summary IS 'Daily campaign performance summary for Tableau dashboard';
COMMENT ON VIEW v_ab_test_performance IS 'A/B test comparison metrics for statistical analysis';
COMMENT ON VIEW v_emea_geo_performance IS 'Geographic performance summary focused on EMEA region';
COMMENT ON VIEW v_web_analytics_daily IS 'Daily web analytics metrics for session analysis';
COMMENT ON VIEW v_cohort_retention IS 'Customer cohort retention analysis for lifecycle insights';
COMMENT ON VIEW v_conversion_funnel IS 'Conversion funnel analysis for customer journey optimization';

-- Refresh materialized views (setup refresh schedule)
-- SELECT cron.schedule('refresh-campaign-trends', '0 1 * * *', 'REFRESH MATERIALIZED VIEW ad_dashboard.mv_campaign_trends;'); 