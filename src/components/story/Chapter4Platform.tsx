import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, ArrowLeft, Monitor, Sparkles } from 'lucide-react';
import DashboardSection from '../DashboardSection';

interface Chapter4Props {
  onNext: () => void;
  onPrev: () => void;
}

const Chapter4Platform: React.FC<Chapter4Props> = ({ onNext, onPrev }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-16">
      <div className="text-center py-16 px-4">
        <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
          <Monitor className="w-4 h-4 mr-2" />
          Chapter 4: The Platform
        </span>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          "The moment of <span className="text-purple-600">truth</span>"
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          After rigorous development and testing, here it is: <span className="font-semibold">AdPulse Marketing Intelligence Platform</span>. 
          A unified command center for EMEA marketing operations.
        </p>
        
        <div className="flex justify-center items-center space-x-4 mb-12">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <span className="text-lg font-medium text-purple-600">Live Interactive Dashboard</span>
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      {/* Embed the existing DashboardSection */}
      <DashboardSection />

      <div className="text-center py-16 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Platform Highlights</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
          <div>
            <div className="text-2xl font-bold mb-2">Real-Time KPIs</div>
            <div className="text-purple-100 text-sm">Live performance metrics across all EMEA campaigns</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-2">Interactive Analytics</div>
            <div className="text-purple-100 text-sm">A/B testing, cohort analysis, and predictive insights</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-2">Unified Intelligence</div>
            <div className="text-purple-100 text-sm">All marketing channels in one beautiful interface</div>
          </div>
        </div>

        <p className="text-lg mb-6 text-purple-100">
          But the real question wasn't just "Does it work?" It was <span className="font-bold">"What impact does it have?"</span>
        </p>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={onPrev}
            variant="outline"
            size="lg" 
            className="px-8 py-3 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> The Build
          </Button>
          <Button 
            onClick={onNext}
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full"
          >
            The Impact <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chapter4Platform; 