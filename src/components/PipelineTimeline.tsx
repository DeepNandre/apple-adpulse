
import React from 'react';

const PipelineTimeline = () => {
  const steps = [
    {
      title: "Data Simulation",
      description: "Generated realistic ad campaign data using Python and Faker library",
      tech: "Python, Faker, Pandas"
    },
    {
      title: "Schema Design",
      description: "Created optimized star schema for analytical queries",
      tech: "PostgreSQL, Database Design"
    },
    {
      title: "ETL Process",
      description: "Automated data extraction, transformation, and loading pipeline",
      tech: "Python, SQL, Data Validation"
    },
    {
      title: "Data Transformation",
      description: "Applied business logic and calculated derived metrics",
      tech: "SQL, Data Modeling"
    },
    {
      title: "Visualization",
      description: "Built interactive Tableau dashboard for stakeholder insights",
      tech: "Tableau, Analytics"
    },
    {
      title: "Optimization",
      description: "Performance tuning and query optimization for sub-3min processing",
      tech: "PostgreSQL, Indexing"
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-7xl font-thin text-black mb-6 tracking-tight">
            Pipeline
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            From raw data simulation to actionable business insights
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-8 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                <span className="text-gray-600 font-medium">{String(index + 1).padStart(2, '0')}</span>
              </div>
              
              <div className="flex-1 pb-8">
                <h3 className="text-2xl font-medium text-black mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 font-light mb-4 text-lg leading-relaxed">
                  {step.description}
                </p>
                <div className="text-sm text-gray-500 font-medium">
                  {step.tech}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineTimeline;
