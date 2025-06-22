import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Microscope } from 'lucide-react';
import CaseStudySection from '../CaseStudySection';
import RecruiterSection from '../RecruiterSection';

interface Chapter6Props {
  onPrev: () => void;
  onFinish: () => void;
}

const Chapter6DeepDive: React.FC<Chapter6Props> = ({ onPrev, onFinish }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium mb-6">
            <Microscope className="w-4 h-4 mr-2" />
            Chapter 6: The Deep Dive
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            "For the technically <span className="text-slate-600">curious</span>"
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            This is where we get into the nitty-gritty. The technical architecture, implementation details, 
            and all the <span className="font-semibold">skills and tools</span> that made this platform possible.
          </p>
        </div>
      </div>

      {/* Technical Showcase */}
      <CaseStudySection />
      
      {/* Professional Summary */}
      <RecruiterSection />

      <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">The Journey Complete</h2>
            <p className="text-xl mb-8 text-slate-100 max-w-2xl mx-auto">
              From identifying the challenge to building the solution, measuring the impact, and showcasing the technical depth. 
              This is how you turn marketing chaos into <span className="font-bold">intelligent decisions</span>.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={onPrev}
                variant="outline"
                size="lg" 
                className="px-8 py-4 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> The Impact
              </Button>
              <Button 
                onClick={onFinish}
                size="lg" 
                className="bg-white text-slate-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg"
              >
                Explore the Platform
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter6DeepDive; 