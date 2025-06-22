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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 pt-16">
      <div className="text-center py-16 px-4">
        <span className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium mb-4">
          <Microscope className="w-4 h-4 mr-2" />
          Chapter 6: The Deep Dive
        </span>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          "For the technically <span className="text-slate-600">curious</span>"
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          This is where we get into the nitty-gritty. The technical architecture, implementation details, 
          and all the <span className="font-semibold">skills and tools</span> that made this platform possible.
        </p>
      </div>

      {/* Technical Showcase */}
      <CaseStudySection />
      
      {/* Professional Summary */}
      <RecruiterSection />

      <div className="text-center py-16 px-4 bg-gradient-to-r from-slate-600 to-gray-600 text-white">
        <h2 className="text-3xl font-bold mb-4">The Journey Complete</h2>
        <p className="text-xl mb-6 text-slate-100 max-w-2xl mx-auto">
          From identifying the challenge to building the solution, measuring the impact, and showcasing the technical depth. 
          This is how you turn marketing chaos into <span className="font-bold">intelligent decisions</span>.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={onPrev}
            variant="outline"
            size="lg" 
            className="px-8 py-3 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> The Impact
          </Button>
          <Button 
            onClick={onFinish}
            size="lg" 
            className="bg-white text-slate-600 hover:bg-gray-100 px-8 py-3 rounded-full"
          >
            Explore the Platform
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chapter6DeepDive; 