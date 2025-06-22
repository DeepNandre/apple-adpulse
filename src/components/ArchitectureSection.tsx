
import React from 'react';

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-7xl font-thin text-black mb-6 tracking-tight">
            Architecture
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Built for scale, performance, and insight generation
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-16 mb-24">
          {/* Data Simulation */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl mb-8 mx-auto flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-lg font-medium">01</span>
              </div>
            </div>
            <h3 className="text-2xl font-medium text-black mb-4">Data Simulation</h3>
            <p className="text-gray-600 font-light leading-relaxed mb-6">
              Generated 565K+ realistic campaign records using sophisticated distribution models
            </p>
            <div className="text-sm text-gray-500 font-medium">
              Python • Faker • Pandas
            </div>
          </div>

          {/* ETL Pipeline */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl mb-8 mx-auto flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-lg font-medium">02</span>
              </div>
            </div>
            <h3 className="text-2xl font-medium text-black mb-4">ETL Pipeline</h3>
            <p className="text-gray-600 font-light leading-relaxed mb-6">
              Star schema database with optimized processing in under 3 minutes
            </p>
            <div className="text-sm text-gray-500 font-medium">
              PostgreSQL • ETL • Star Schema
            </div>
          </div>

          {/* Dashboard */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl mb-8 mx-auto flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-lg font-medium">03</span>
              </div>
            </div>
            <h3 className="text-2xl font-medium text-black mb-4">Dashboard</h3>
            <p className="text-gray-600 font-light leading-relaxed mb-6">
              Interactive insights with regional analytics and KPI tracking
            </p>
            <div className="text-sm text-gray-500 font-medium">
              Tableau • Analytics • Visualization
            </div>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="bg-gray-50 rounded-3xl p-16">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl font-thin text-black mb-3">565K+</div>
              <div className="text-gray-600 font-light">Records Generated</div>
            </div>
            <div>
              <div className="text-5xl font-thin text-black mb-3">3min</div>
              <div className="text-gray-600 font-light">ETL Processing</div>
            </div>
            <div>
              <div className="text-5xl font-thin text-black mb-3">12</div>
              <div className="text-gray-600 font-light">EMEA Countries</div>
            </div>
            <div>
              <div className="text-5xl font-thin text-black mb-3">5</div>
              <div className="text-gray-600 font-light">Ad Platforms</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
