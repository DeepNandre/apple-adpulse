import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, Lightbulb, Target, BarChart3, Brain, ArrowLeft } from 'lucide-react';

interface Chapter2Props {
  onNext: () => void;
  onPrev: () => void;
}

const Chapter2Vision: React.FC<Chapter2Props> = ({ onNext, onPrev }) => {
  const [selectedVision, setSelectedVision] = useState<number | null>(null);

  const visionPoints = [
    {
      id: 1,
      icon: <Target className="w-8 h-8" />,
      title: "Unified Command Center",
      description: "Single dashboard showing all EMEA campaigns, channels, and performance metrics in real-time",
      details: "No more jumping between platforms. Everything in one place - from Apple Search Ads to programmatic display across 28 EMEA markets."
    },
    {
      id: 2,
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Predictive Intelligence",
      description: "AI-powered insights that predict performance trends and recommend optimizations",
      details: "Machine learning algorithms analyzing patterns to predict which campaigns will succeed and which markets to prioritize."
    },
    {
      id: 3,
      icon: <Brain className="w-8 h-8" />,
      title: "Automated Decision Engine",
      description: "Smart alerts and recommendations for budget reallocation and campaign optimization",
      details: "Real-time alerts when campaigns underperform, with specific recommendations for fixes and budget shifts."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 pt-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Lightbulb className="w-4 h-4 mr-2" />
            Chapter 2: The Vision
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            "What if marketing intelligence was <span className="text-blue-600">effortless</span>?"
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            I envisioned a platform that would transform how Apple's EMEA marketing team makes decisions. 
            Not just reports, but <span className="font-semibold">intelligence</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {visionPoints.map((point) => (
            <Card 
              key={point.id}
              className={`cursor-pointer transition-all duration-300 border-2 ${
                selectedVision === point.id 
                  ? 'border-blue-400 bg-blue-50 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedVision(selectedVision === point.id ? null : point.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-blue-600 mb-4 flex justify-center">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{point.description}</p>
                {selectedVision === point.id && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200 text-left">
                    <p className="text-sm text-gray-700">{point.details}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">The Platform Vision</h2>
            <p className="text-xl mb-6 text-blue-100">
              "A marketing intelligence platform that thinks like a strategist, acts like an analyst, and delivers like a consultant."
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-3 text-blue-100">Before: The Problems</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-red-300 mr-2">✗</span> Data in silos</li>
                  <li className="flex items-center"><span className="text-red-300 mr-2">✗</span> Manual reporting</li>
                  <li className="flex items-center"><span className="text-red-300 mr-2">✗</span> Reactive decisions</li>
                  <li className="flex items-center"><span className="text-red-300 mr-2">✗</span> Budget inefficiencies</li>
                </ul>
              </div>
              
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-3 text-blue-100">After: The Solution</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-300 mr-2">✓</span> Unified data view</li>
                  <li className="flex items-center"><span className="text-green-300 mr-2">✓</span> Automated insights</li>
                  <li className="flex items-center"><span className="text-green-300 mr-2">✓</span> Proactive recommendations</li>
                  <li className="flex items-center"><span className="text-green-300 mr-2">✓</span> Optimized ROI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            Now came the exciting part: <span className="font-bold">"How do we build this?"</span>
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={onPrev}
              variant="outline"
              size="lg" 
              className="px-8 py-3 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> The Challenge
            </Button>
            <Button 
              onClick={onNext}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full"
            >
              The Build <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter2Vision; 