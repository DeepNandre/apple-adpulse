import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, Wrench, Database, Code, BarChart, ArrowLeft, CheckCircle } from 'lucide-react';

interface Chapter3Props {
  onNext: () => void;
  onPrev: () => void;
}

const Chapter3Build: React.FC<Chapter3Props> = ({ onNext, onPrev }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const buildSteps = [
    {
      id: 1,
      title: "Foundation First",
      icon: <Database className="w-8 h-8" />,
      challenge: "How do we store and structure 565K+ marketing records efficiently?",
      solution: "Built a star schema with PostgreSQL - fact tables for performance data, dimension tables for campaigns, geography, and time.",
      outcome: "Optimized for both storage and query performance with proper indexing.",
      techStack: ["PostgreSQL", "Star Schema", "Indexes"]
    },
    {
      id: 2,
      title: "Data Pipeline",
      icon: <Code className="w-8 h-8" />,
      challenge: "How do we simulate realistic EMEA marketing data for testing?",
      solution: "Created Python ETL scripts with Faker library to generate authentic-looking campaign data across 28 EMEA markets.",
      outcome: "Generated 565K records with realistic performance patterns and seasonal trends.",
      techStack: ["Python", "Pandas", "Faker", "SQLAlchemy"]
    },
    {
      id: 3,
      title: "Intelligence Layer",
      icon: <BarChart className="w-8 h-8" />,
      challenge: "How do we turn raw data into actionable insights?",
      solution: "Built analytics views and KPI calculations directly in SQL, with pre-aggregated dashboard tables for performance.",
      outcome: "Sub-second query times for complex EMEA market analysis and campaign performance metrics.",
      techStack: ["SQL Views", "Aggregations", "Business Logic"]
    },
    {
      id: 4,
      title: "User Experience",
      icon: <Wrench className="w-8 h-8" />,
      challenge: "How do we make complex data intuitive for marketing teams?",
      solution: "Designed React dashboard with Apple-style aesthetics, interactive charts, and progressive disclosure of information.",
      outcome: "Beautiful, responsive interface that marketers actually want to use daily.",
      techStack: ["React", "TypeScript", "Recharts", "Tailwind"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 px-4 py-8 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <Wrench className="w-4 h-4 mr-2" />
            Chapter 3: The Build
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            "From concept to <span className="text-green-600">reality</span>"
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            The journey from vision to working platform. Every technical decision had one goal: 
            <span className="font-semibold"> make marketing intelligence effortless</span>.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {buildSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep === step.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                </button>
                {index < buildSteps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Detail */}
        <div className="mb-12">
          {buildSteps.map((step) => (
            currentStep === step.id && (
              <Card key={step.id} className="border-2 border-green-200 bg-green-50/50">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="text-green-600 flex-shrink-0">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">🤔 The Challenge</h3>
                          <p className="text-gray-600 text-sm">{step.challenge}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">💡 The Solution</h3>
                          <p className="text-gray-600 text-sm">{step.solution}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">🎯 The Outcome</h3>
                          <p className="text-gray-600 text-sm">{step.outcome}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {step.techStack.map((tech) => (
                          <span key={tech} className="px-3 py-1 bg-white text-green-700 rounded-full text-xs font-medium border border-green-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>

        {/* Build Summary */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Technical Excellence Achieved</h2>
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">565K+</div>
                <div className="text-green-100 text-sm">Marketing Records</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">28</div>
                <div className="text-green-100 text-sm">EMEA Markets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">&lt;1s</div>
                <div className="text-green-100 text-sm">Query Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-green-100 text-sm">Test Coverage</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            The platform was ready. Now for the moment of truth: <span className="font-bold">"Does it actually work?"</span>
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={onPrev}
              variant="outline"
              size="lg" 
              className="px-8 py-3 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> The Vision
            </Button>
            <Button 
              onClick={onNext}
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full"
            >
              The Platform <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter3Build; 