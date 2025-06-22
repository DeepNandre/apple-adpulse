
import React from 'react';

const CaseStudySection = () => {
  const caseStudies = [
    {
      problem: "Realistic Data Simulation",
      challenge: "Creating believable ad campaign data that reflects real-world performance patterns",
      solution: "Used exponential and binomial distributions to model budget-to-performance relationships with seasonal variance",
      outcome: "Generated 565K records with realistic CTR, CPC, and conversion patterns across 12 EMEA markets"
    },
    {
      problem: "ETL Performance",
      challenge: "Processing large datasets efficiently while maintaining data quality and validation",
      solution: "Implemented parallel processing, data validation layers, and optimized PostgreSQL indexing strategies",
      outcome: "Reduced processing time to under 3 minutes with 99.9% data quality scores"
    },
    {
      problem: "Regional Attribution",
      challenge: "Modeling campaign lift and attribution across diverse EMEA markets with different behaviors",
      solution: "Applied market-specific multipliers and attribution models based on historical performance data",
      outcome: "Created realistic regional variance in campaign performance matching industry benchmarks"
    }
  ];

  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-7xl font-thin text-black mb-6 tracking-tight">
            Case Studies
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Complex problems solved with innovative approaches
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {caseStudies.map((study, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 hover:shadow-sm transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl mb-8 flex items-center justify-center">
                <span className="text-white font-medium">{String(index + 1).padStart(2, '0')}</span>
              </div>
              
              <h3 className="text-2xl font-medium text-black mb-8">
                {study.problem}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-red-500 mb-2 uppercase tracking-wide">Challenge</div>
                  <p className="text-gray-600 font-light leading-relaxed">{study.challenge}</p>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-blue-500 mb-2 uppercase tracking-wide">Solution</div>
                  <p className="text-gray-600 font-light leading-relaxed">{study.solution}</p>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-green-500 mb-2 uppercase tracking-wide">Outcome</div>
                  <p className="text-gray-600 font-light leading-relaxed">{study.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
