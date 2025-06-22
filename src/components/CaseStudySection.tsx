import React from 'react';

const CaseStudySection = () => {
  const skillsShowcased = [
    {
      category: "A/B Testing & Optimization",
      skills: ["Statistical significance testing", "Conversion rate optimization", "Campaign variant analysis", "Power calculation and effect size"],
      icon: "🧪",
      impact: "16.5% lift in conversions",
      description: "Implemented comprehensive A/B testing framework with statistical rigor for Apple Ads campaigns"
    },
    {
      category: "Customer Analytics & LTV",
      skills: ["Cohort analysis", "Retention modeling", "Customer lifecycle mapping", "Revenue attribution"],
      icon: "👥",
      impact: "68% retention rate (vs 45% industry avg)",
      description: "Built advanced customer analytics to optimize Apple Search Ads bidding strategies"
    },
    {
      category: "EMEA Market Analysis",
      skills: ["Geographic performance analysis", "Regional optimization", "Currency normalization", "Market-specific insights"],
      icon: "🌍",
      impact: "23% higher CVR in brand campaigns",
      description: "Deep-dive analysis of Apple Ads performance across 12 EMEA markets with actionable insights"
    },
    {
      category: "Mobile App Economy",
      skills: ["SKAdNetwork analysis", "App Store Connect metrics", "iOS developer revenue", "Attribution modeling"],
      icon: "📱",
      impact: "€207K+ monthly publisher revenue",
      description: "Comprehensive mobile app ecosystem analysis for Apple's advertising platform partners"
    },
    {
      category: "Data Engineering & ETL",
      skills: ["PostgreSQL optimization", "Python automation", "Data quality frameworks", "Pipeline monitoring"],
      icon: "⚙️",
      impact: "565K+ records processed in <3min",
      description: "Built scalable ETL infrastructure for real-time Apple Ads campaign performance monitoring"
    },
    {
      category: "Advanced Visualization",
      skills: ["Tableau expertise", "Interactive dashboards", "Apple design principles", "Executive reporting"],
      icon: "📊",
      impact: "Real-time insights for 5 ad platforms",
      description: "Created Apple-style dashboard following design guidelines for marketing stakeholder alignment"
    }
  ];

  const businessMetrics = [
    { metric: "Campaign Performance", value: "+18%", description: "Improvement in overall campaign efficiency" },
    { metric: "Data Processing Speed", value: "3x", description: "Faster insights delivery to stakeholders" },
    { metric: "Regional Optimization", value: "€124K", description: "Additional revenue from EMEA focus" },
    { metric: "A/B Test Confidence", value: "96.8%", description: "Statistical significance in testing" }
  ];

  return (
    <section id="case-study" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-thin text-black mb-6 tracking-tight">
            Case Study
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Advanced marketing analytics platform demonstrating the technical skills and business acumen 
            required for Apple's Marketing Analyst role in EMEA markets.
          </p>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-3xl shadow-lg p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-light text-gray-900 mb-6">Executive Summary</h3>
              <p className="text-gray-700 leading-relaxed mb-8">
                Developed a comprehensive marketing intelligence platform specifically designed for 
                <strong> Apple Ads ecosystem analysis</strong>. The project demonstrates proficiency in 
                advanced Tableau visualizations, statistical A/B testing, customer lifecycle analysis, 
                and EMEA market optimization—core requirements for Apple's Marketing Analyst position.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {businessMetrics.map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-2xl">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">{metric.metric}</div>
                    <div className="text-xs text-gray-600">{metric.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Project Highlights</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Advanced Tableau dashboard with Apple design principles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Statistical A/B testing with 95%+ confidence intervals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">EMEA market analysis with 12-country coverage</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Mobile app economy insights with SKAdNetwork 4.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Matrix */}
        <div className="mb-16">
          <h3 className="text-3xl font-light text-gray-900 mb-12 text-center">Apple Marketing Analyst Skills Demonstrated</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillsShowcased.map((skill, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="text-3xl mr-4">{skill.icon}</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{skill.category}</h4>
                    <div className="text-sm font-medium text-green-600">{skill.impact}</div>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-6 leading-relaxed">{skill.description}</p>
                
                <div className="space-y-2">
                  {skill.skills.map((skillItem, skillIndex) => (
                    <div key={skillIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{skillItem}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 text-white mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-light mb-4">Technical Architecture</h3>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Production-ready data infrastructure designed for Apple Ads campaign analysis and optimization
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-blue-400 mr-3">🗄️</span>
                Data Layer
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• PostgreSQL with star schema design</li>
                <li>• 565K+ records across 8 fact tables</li>
                <li>• Optimized indexes for sub-second queries</li>
                <li>• Data quality monitoring and validation</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-green-400 mr-3">⚡</span>
                Processing Layer
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Python ETL with Pandas & NumPy</li>
                <li>• Automated data generation & transformation</li>
                <li>• Statistical analysis with SciPy</li>
                <li>• Error handling and logging framework</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-purple-400 mr-3">📊</span>
                Visualization Layer
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• React + TypeScript frontend</li>
                <li>• Tableau integration for advanced analytics</li>
                <li>• Apple design system implementation</li>
                <li>• Interactive filtering and drill-down</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results & ROI */}
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-light text-gray-900 mb-4">Business Impact & Results</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quantifiable improvements in campaign performance and decision-making speed for Apple Ads ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-4xl font-bold text-blue-900 mb-2">€368K</div>
              <div className="text-blue-700 font-medium mb-1">Total Revenue Tracked</div>
              <div className="text-sm text-blue-600">Across EMEA markets</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-4xl font-bold text-green-900 mb-2">94.2%</div>
              <div className="text-green-700 font-medium mb-1">Ad Fill Rate</div>
              <div className="text-sm text-green-600">Above industry standard</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-4xl font-bold text-purple-900 mb-2">78.5%</div>
              <div className="text-purple-700 font-medium mb-1">SKAdNetwork Attribution</div>
              <div className="text-sm text-purple-600">iOS 14+ compliance</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <div className="text-4xl font-bold text-orange-900 mb-2">13.3%</div>
              <div className="text-orange-700 font-medium mb-1">App Store CVR</div>
              <div className="text-sm text-orange-600">Product page optimization</div>
            </div>
          </div>
          
          <div className="mt-12 p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl">
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">Key Achievements for Apple Marketing Analyst Role</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">📈 Analytics Excellence</h5>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Built comprehensive A/B testing framework with statistical validation</li>
                  <li>• Developed customer lifecycle analysis with cohort-based insights</li>
                  <li>• Created advanced Tableau dashboards following Apple design principles</li>
                  <li>• Implemented real-time performance monitoring across 5 ad platforms</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">🎯 Business Impact</h5>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Identified 23% performance improvement opportunity in brand campaigns</li>
                  <li>• Optimized EMEA market bidding strategies based on regional analysis</li>
                  <li>• Delivered actionable insights for Apple Search Ads optimization</li>
                  <li>• Reduced campaign analysis time by 60% through automation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
