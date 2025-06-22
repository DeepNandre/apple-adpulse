import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardSection = () => {
  const [selectedTestVariant, setSelectedTestVariant] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [activeMetric, setActiveMetric] = useState('conversions');

  // Mock data for the dashboard
  const performanceData = [
    { month: 'Jan', impressions: 245000, clicks: 12250, conversions: 1225, spend: 15200 },
    { month: 'Feb', impressions: 298000, clicks: 14900, conversions: 1342, spend: 18600 },
    { month: 'Mar', impressions: 387000, clicks: 19350, conversions: 1548, spend: 24200 },
    { month: 'Apr', impressions: 425000, clicks: 21250, conversions: 1912, spend: 26500 },
    { month: 'May', impressions: 492000, clicks: 24600, conversions: 2214, spend: 30800 },
    { month: 'Jun', impressions: 534000, clicks: 26700, conversions: 2401, spend: 33400 },
  ];

  const geoData = [
    { country: 'United Kingdom', value: 35, revenue: 125000 },
    { country: 'Germany', value: 28, revenue: 98000 },
    { country: 'France', value: 18, revenue: 72000 },
    { country: 'Spain', value: 12, revenue: 45000 },
    { country: 'Italy', value: 7, revenue: 28000 },
  ];

  const channelData = [
    { name: 'Search', value: 45 },
    { name: 'Social', value: 30 },
    { name: 'Display', value: 15 },
    { name: 'Video', value: 10 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Mock A/B testing data
  const abTestData = [
    { variant: 'Control', conversions: 1150, ctr: 4.2, cpa: 28.50, confidence: 95.2, visitors: 15420 },
    { variant: 'Variant A', conversions: 1340, ctr: 4.8, cpa: 24.20, confidence: 96.8, visitors: 15380 },
    { variant: 'Variant B', conversions: 1280, ctr: 4.6, cpa: 26.10, confidence: 94.1, visitors: 15401 },
  ];

  // Customer lifecycle data
  const lifecycleData = [
    { week: 'Week 1', newUsers: 1200, returningUsers: 800, retentionRate: 78 },
    { week: 'Week 2', newUsers: 1450, returningUsers: 950, retentionRate: 72 },
    { week: 'Week 3', newUsers: 1320, returningUsers: 1100, retentionRate: 68 },
    { week: 'Week 4', newUsers: 1580, returningUsers: 1250, retentionRate: 65 },
  ];

  // Code showcase data
  const sqlQueries = {
    customerLTV: `-- Customer Lifetime Value Analysis for EMEA
SELECT 
    g.country,
    u.user_cohort_month,
    COUNT(DISTINCT u.user_key) as cohort_size,
    
    -- LTV Calculations
    SUM(f.attributed_revenue) / COUNT(DISTINCT u.user_key) as avg_ltv,
    AVG(DATEDIFF(u.last_active_date, u.first_install_date)) as avg_lifespan_days,
    
    -- Retention Metrics  
    COUNT(DISTINCT CASE WHEN u.days_since_install >= 7 THEN u.user_key END)::DECIMAL 
        / COUNT(DISTINCT u.user_key) * 100 as d7_retention_rate,
    
    -- Revenue Distribution
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY user_total_revenue) as median_revenue,
    PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY user_total_revenue) as p90_revenue

FROM dim_user u
JOIN dim_geo g ON u.geo_key = g.geo_key  
JOIN fact_ad_performance f ON u.user_key = f.user_key
WHERE g.is_emea = TRUE
  AND u.first_install_date >= '2024-01-01'
GROUP BY g.country, u.user_cohort_month
ORDER BY avg_ltv DESC;`,
    
    abTesting: `-- A/B Test Statistical Significance Analysis
WITH test_metrics AS (
    SELECT 
        c.ab_test_variant,
        COUNT(DISTINCT f.user_key) as visitors,
        SUM(f.attributed_conversions) as conversions,
        SUM(f.attributed_conversions)::DECIMAL / COUNT(DISTINCT f.user_key) as conversion_rate,
        SUM(f.spend) / SUM(f.attributed_conversions) as cpa
        
    FROM fact_ad_performance f
    JOIN dim_campaign c ON f.campaign_key = c.campaign_key
    WHERE c.ab_test_variant IN ('control', 'variant_a', 'variant_b')
      AND f.date_key >= DATE_SUB(CURRENT_DATE, INTERVAL 14 DAY)
    GROUP BY c.ab_test_variant
),
significance_test AS (
    SELECT 
        *,
        -- Z-score calculation for conversion rate difference
        (conversion_rate - LAG(conversion_rate) OVER (ORDER BY ab_test_variant)) / 
        SQRT((conversion_rate * (1 - conversion_rate) / visitors) + 
             (LAG(conversion_rate) OVER (ORDER BY ab_test_variant) * 
              (1 - LAG(conversion_rate) OVER (ORDER BY ab_test_variant)) / 
              LAG(visitors) OVER (ORDER BY ab_test_variant))) as z_score
    FROM test_metrics
)
SELECT 
    *,
    CASE 
        WHEN ABS(z_score) >= 1.96 THEN 'Significant (95% confidence)'
        WHEN ABS(z_score) >= 1.645 THEN 'Significant (90% confidence)'  
        ELSE 'Not significant'
    END as statistical_significance
FROM significance_test;`
  };

  const pythonCode = `# Advanced ETL Pipeline with Data Quality Checks
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

class AppleAdsAnalytics:
    def __init__(self, connection_string):
        self.conn = connection_string
        self.data_quality_threshold = 0.95
        
    def calculate_customer_ltv(self, cohort_month, lookback_days=90):
        """
        Calculate Customer LTV with cohort analysis for Apple Ads campaigns
        """
        query = f'''
        SELECT user_key, install_date, country, 
               SUM(revenue) as total_revenue,
               COUNT(DISTINCT session_date) as active_days,
               MAX(session_date) as last_active_date
        FROM user_revenue_daily 
        WHERE install_date >= '{cohort_month}-01'
          AND install_date < '{cohort_month}-01' + INTERVAL '1 MONTH'
          AND session_date <= install_date + INTERVAL '{lookback_days} DAYS'
        GROUP BY user_key, install_date, country
        '''
        
        df = pd.read_sql(query, self.conn)
        
        # Calculate LTV metrics
        ltv_metrics = {
            'cohort_size': len(df),
            'avg_ltv': df['total_revenue'].mean(),
            'median_ltv': df['total_revenue'].median(),
            'ltv_90th_percentile': df['total_revenue'].quantile(0.9),
            'retention_rate_d7': (df['active_days'] >= 7).mean(),
            'retention_rate_d30': (df['active_days'] >= 30).mean()
        }
        
        return ltv_metrics
    
    def run_ab_test_analysis(self, test_id, alpha=0.05):
        """
        Comprehensive A/B test analysis with power calculation
        """
        # Get test data
        query = f'''
        SELECT variant, user_id, 
               CASE WHEN conversion_event_time IS NOT NULL THEN 1 ELSE 0 END as converted
        FROM ab_test_results 
        WHERE test_id = {test_id}
        '''
        
        df = pd.read_sql(query, self.conn)
        
        # Calculate conversion rates by variant
        results = df.groupby('variant').agg({
            'user_id': 'count',
            'converted': ['sum', 'mean']
        }).round(4)
        
        results.columns = ['visitors', 'conversions', 'conversion_rate']
        
        # Statistical significance test
        control = df[df['variant'] == 'control']['converted']
        treatment = df[df['variant'] == 'treatment']['converted']
        
        # Two-proportion z-test
        z_stat, p_value = stats.proportions_ztest(
            [treatment.sum(), control.sum()], 
            [len(treatment), len(control)]
        )
        
        # Effect size calculation
        effect_size = treatment.mean() - control.mean()
        relative_lift = (effect_size / control.mean()) * 100
        
        # Power analysis
        power = stats.ttest_ind(treatment, control).pvalue
        
        return {
            'results': results,
            'p_value': p_value,
            'z_statistic': z_stat,
            'effect_size': effect_size,
            'relative_lift_percent': relative_lift,
            'is_significant': p_value < alpha,
            'confidence_level': (1 - alpha) * 100
        }
    
    def generate_executive_summary(self, date_range):
        """
        Generate executive summary with key business metrics
        """
        summary_data = self.get_campaign_performance(date_range)
        
        insights = {
            'top_performing_countries': summary_data.nlargest(3, 'roas')[['country', 'roas']],
            'campaign_optimization_opportunities': summary_data[summary_data['cpa'] > summary_data['cpa'].quantile(0.8)],
            'budget_reallocation_suggestions': self.calculate_budget_optimization(summary_data)
        }
        
        return insights`;

  const [activeCodeTab, setActiveCodeTab] = useState('sql1');

  return (
    <section id="dashboard" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-thin text-black mb-6 tracking-tight">
            Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Real-time insights into EMEA marketing performance
          </p>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl">
            <div className="text-3xl font-thin text-blue-900 mb-2">2.4M</div>
            <div className="text-blue-700 font-medium">Total Impressions</div>
            <div className="text-sm text-blue-600 mt-1">↗ +18% vs last month</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl">
            <div className="text-3xl font-thin text-green-900 mb-2">119K</div>
            <div className="text-green-700 font-medium">Total Clicks</div>
            <div className="text-sm text-green-600 mt-1">↗ +22% vs last month</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl">
            <div className="text-3xl font-thin text-purple-900 mb-2">10.6K</div>
            <div className="text-purple-700 font-medium">Conversions</div>
            <div className="text-sm text-purple-600 mt-1">↗ +15% vs last month</div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl">
            <div className="text-3xl font-thin text-orange-900 mb-2">4.2%</div>
            <div className="text-orange-700 font-medium">CVR</div>
            <div className="text-sm text-orange-600 mt-1">↗ +0.8% vs last month</div>
          </div>
        </div>

        {/* Advanced Tableau Dashboard Section - MOVED TO TOP PRIORITY */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-light text-gray-900 mb-4">Advanced Analytics Dashboard</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
              Interactive Tableau dashboard built with the comprehensive ETL pipeline, featuring advanced filtering, 
              drill-down capabilities, and sophisticated data modeling techniques.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-inner">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
              {/* Tableau Dashboard Preview */}
              <div className="absolute inset-0 bg-white m-4 rounded shadow-lg">
                <div className="h-full w-full relative">
                  {/* Mock Tableau Interface */}
                  <div className="h-12 bg-gray-100 border-b flex items-center px-4 space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="text-sm text-gray-600 ml-4">Tableau Public - Apple Interactive Ad Dashboard</div>
                  </div>
                  
                  {/* Dashboard Content Preview */}
                  <div className="p-6 h-full bg-white">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-blue-900">2.4M</div>
                        <div className="text-xs text-blue-700">Impressions</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-green-900">119K</div>
                        <div className="text-xs text-green-700">Clicks</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-purple-900">10.6K</div>
                        <div className="text-xs text-purple-700">Conversions</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 h-32">
                      <div className="bg-gray-50 rounded flex items-center justify-center">
                        <div className="text-gray-500 text-sm">Performance Trends</div>
                      </div>
                      <div className="bg-gray-50 rounded flex items-center justify-center">
                        <div className="text-gray-500 text-sm">Geographic Heat Map</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Overlay with access button */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <a 
                  href="https://public.tableau.com/views/Book1_17505426601910/Dashboard1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-gray-900 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                >
                  View Interactive Dashboard →
                </a>
              </div>
            </div>
            
            {/* Dashboard Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Advanced Visualizations</h4>
                <p className="text-sm text-gray-600">Complex charts, heat maps, and drill-down capabilities built with Tableau's enterprise features</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl mb-4 mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Integration</h4>
                <p className="text-sm text-gray-600">Connected to PostgreSQL with 565K+ records from our comprehensive ETL pipeline</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl mb-4 mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Interactive Filtering</h4>
                <p className="text-sm text-gray-600">Dynamic filters for campaigns, geographic regions, date ranges, and device types</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive A/B Testing Section - HIGH PRIORITY FOR APPLE */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h3 className="text-2xl font-light text-gray-900 mb-4 md:mb-0">A/B Testing Analysis</h3>
            <div className="flex gap-4">
              <select 
                value={activeMetric} 
                onChange={(e) => setActiveMetric(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="conversions">Conversions</option>
                <option value="ctr">Click-Through Rate</option>
                <option value="cpa">Cost Per Acquisition</option>
              </select>
              <select 
                value={selectedTimeRange} 
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="14d">Last 14 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {abTestData.map((test, index) => (
              <div 
                key={test.variant} 
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedTestVariant === test.variant.toLowerCase() || selectedTestVariant === 'all'
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTestVariant(test.variant.toLowerCase())}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{test.variant}</h4>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    test.confidence >= 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {test.confidence}% Confidence
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversions</span>
                    <span className="font-semibold">{test.conversions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CTR</span>
                    <span className="font-semibold">{test.ctr}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CPA</span>
                    <span className="font-semibold">€{test.cpa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visitors</span>
                    <span className="font-semibold">{test.visitors.toLocaleString()}</span>
                  </div>
                </div>
                
                {test.variant !== 'Control' && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">vs Control</span>
                      <span className={`text-sm font-semibold ${
                        test.conversions > abTestData[0].conversions ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {((test.conversions - abTestData[0].conversions) / abTestData[0].conversions * 100).toFixed(1)}% 
                        {test.conversions > abTestData[0].conversions ? ' ↗' : ' ↘'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2">📊 Test Insights</h4>
            <p className="text-gray-700 mb-3">
              <strong>Variant A</strong> shows the strongest performance with a 16.5% lift in conversions and 15.1% reduction in CPA.
              Statistical significance achieved with 96.8% confidence.
            </p>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Deploy Winner
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Extend Test
              </button>
            </div>
          </div>
        </div>

        {/* EMEA Regional Performance - CRITICAL FOR APPLE EMEA ROLE */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-light text-gray-900 mb-6">EMEA Regional Performance</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geoData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="country" type="category" stroke="#666" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {geoData.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{country.country}</div>
                    <div className="text-sm text-gray-600">{country.value}% of total traffic</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">€{country.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive SQL & Python Code Showcase - TECHNICAL SKILLS FOR APPLE */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-light text-gray-900 mb-4">Technical Implementation</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
              Advanced SQL queries and Python analytics showcasing expertise in ETL processes, 
              statistical analysis, and data modeling for Apple Ads campaigns.
            </p>
          </div>
          
          {/* Code Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveCodeTab('sql1')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeCodeTab === 'sql1' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Customer LTV SQL
            </button>
            <button
              onClick={() => setActiveCodeTab('sql2')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeCodeTab === 'sql2' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🧪 A/B Testing SQL
            </button>
            <button
              onClick={() => setActiveCodeTab('python')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeCodeTab === 'python' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🐍 Python Analytics
            </button>
          </div>
          
          {/* Code Display */}
          <div className="bg-gray-900 rounded-xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm font-mono">
                  {activeCodeTab === 'python' ? 'analytics.py' : 'query.sql'}
                </span>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors text-sm">
                Copy Code
              </button>
            </div>
            
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>
                {activeCodeTab === 'sql1' && sqlQueries.customerLTV}
                {activeCodeTab === 'sql2' && sqlQueries.abTesting}
                {activeCodeTab === 'python' && pythonCode}
              </code>
            </pre>
          </div>
          
          {/* Code Explanation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <span className="text-lg mr-2">⚡</span>
                Performance Optimized
              </h4>
              <p className="text-blue-800 text-sm">
                Queries optimized for large datasets with proper indexing, CTEs, and window functions 
                for sub-second response times on 565K+ records.
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                <span className="text-lg mr-2">📈</span>
                Statistical Rigor
              </h4>
              <p className="text-green-800 text-sm">
                Advanced statistical methods including z-tests, power analysis, and confidence intervals 
                for reliable A/B testing and business decision making.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                <span className="text-lg mr-2">🔄</span>
                Production Ready
              </h4>
              <p className="text-purple-800 text-sm">
                Error handling, data quality checks, and automated ETL processes designed for 
                enterprise-scale Apple Ads campaign management.
              </p>
            </div>
          </div>
        </div>

        {/* Apple Ads Ecosystem Analysis */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-lg p-8 mb-12 text-white">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">📱</span>
            </div>
            <div>
              <h3 className="text-2xl font-light mb-1">Apple Ads Mobile Ecosystem</h3>
              <p className="text-gray-300">iOS Developer Revenue & App Store Connect Analytics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* App Store Connect Metrics */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-blue-400 mr-2">📊</span>
                App Store Performance
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">App Store Impressions</span>
                  <span className="font-bold text-xl">2.8M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Product Page Views</span>
                  <span className="font-bold text-xl">340K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">App Units (Downloads)</span>
                  <span className="font-bold text-xl">45.2K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Conversion Rate</span>
                  <span className="font-bold text-xl text-green-400">13.3%</span>
                </div>
              </div>
            </div>
            
            {/* Developer Revenue */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-green-400 mr-2">💰</span>
                Publisher Revenue
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Ad Revenue (30d)</span>
                  <span className="font-bold text-xl">€82.4K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">IAP Revenue</span>
                  <span className="font-bold text-xl">€124.6K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">eCPM</span>
                  <span className="font-bold text-xl">€4.85</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Fill Rate</span>
                  <span className="font-bold text-xl text-blue-400">94.2%</span>
                </div>
              </div>
            </div>
            
            {/* Campaign Attribution */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-purple-400 mr-2">🎯</span>
                Attribution & LTV
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">D7 LTV</span>
                  <span className="font-bold text-xl">€12.40</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">D30 LTV</span>
                  <span className="font-bold text-xl">€28.90</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Organic vs Paid</span>
                  <span className="font-bold text-xl">60/40</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">SKAN Conversion</span>
                  <span className="font-bold text-xl text-orange-400">78.5%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-600/20 rounded-xl border border-blue-400/30">
            <div className="flex items-start gap-4">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold mb-2">Apple Search Ads Optimization Insights</h4>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Based on SKAdNetwork 4.0 data, <strong>Brand campaigns</strong> show 23% higher conversion rates in EMEA markets. 
                  <strong>Generic keywords</strong> in UK and Germany markets demonstrate strong performance with 
                  18% lower CPT compared to competitor targeting. Consider increasing bids for high-value keywords 
                  during peak iOS app usage hours (7-9 PM local time).
                </p>
                <div className="flex gap-3 mt-4">
                  <span className="px-3 py-1 bg-blue-500/30 rounded-full text-xs">SKAdNetwork 4.0</span>
                  <span className="px-3 py-1 bg-green-500/30 rounded-full text-xs">App Store Connect</span>
                  <span className="px-3 py-1 bg-purple-500/30 rounded-full text-xs">Apple Search Ads</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Lifecycle Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-light text-gray-900 mb-6">Customer Lifecycle & Retention</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">User Acquisition vs Retention</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={lifecycleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="returningUsers" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Retention Rate Trend</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lifecycleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Line type="monotone" dataKey="retentionRate" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-900">68%</div>
              <div className="text-blue-700 font-medium">4-Week Retention</div>
              <div className="text-sm text-blue-600 mt-1">Industry avg: 45%</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-900">4.8</div>
              <div className="text-green-700 font-medium">Avg Session/User</div>
              <div className="text-sm text-green-600 mt-1">↗ +0.6 vs last month</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-purple-900">3.2</div>
              <div className="text-purple-700 font-medium">Pages/Session</div>
              <div className="text-sm text-purple-600 mt-1">↗ +0.4 vs last month</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-orange-900">2:34</div>
              <div className="text-orange-700 font-medium">Avg Session Time</div>
              <div className="text-sm text-orange-600 mt-1">↗ +0:18 vs last month</div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Charts - Performance Trends & Channel Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Performance Trends */}
            <div>
              <h3 className="text-2xl font-light text-gray-900 mb-6">Performance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Area type="monotone" dataKey="conversions" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="clicks" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Channel Distribution */}
            <div>
              <h3 className="text-2xl font-light text-gray-900 mb-6">Channel Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {channelData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-600">{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl mb-6 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h4 className="text-xl font-medium text-black mb-3">Advanced Filtering</h4>
            <p className="text-gray-600 font-light">Filter by platform, country, date range, and campaign type</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl mb-6 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h4 className="text-xl font-medium text-black mb-3">KPI Tracking</h4>
            <p className="text-gray-600 font-light">Monitor ROAS, CTR, CPC, and conversion metrics</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl mb-6 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-medium text-black mb-3">Regional Insights</h4>
            <p className="text-gray-600 font-light">Drill down into EMEA markets with geographic data</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
