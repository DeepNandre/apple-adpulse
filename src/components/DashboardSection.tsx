import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardSection = () => {
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

        {/* Main Dashboard Charts */}
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

        {/* Geographic Performance */}
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

        {/* Tableau Dashboard Section */}
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
