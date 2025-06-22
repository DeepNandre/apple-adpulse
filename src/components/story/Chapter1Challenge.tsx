import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, AlertTriangle, TrendingDown } from 'lucide-react';

interface Chapter1Props {
  onNext: () => void;
}

const Chapter1Challenge: React.FC<Chapter1Props> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 pt-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Chapter 1: The Challenge
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            "We're flying blind in EMEA"
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Imagine you're the Apple Marketing team managing campaigns across Europe, Middle East, and Africa. 
            You have massive budgets, multiple channels, diverse markets, but...
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-6 text-center">
              <TrendingDown className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fragmented Data</h3>
              <p className="text-gray-600 text-sm">
                Campaign data scattered across platforms. No unified view of performance across EMEA markets.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delayed Insights</h3>
              <p className="text-gray-600 text-sm">
                Weekly reports, manual analysis. By the time you spot issues, budgets are burned.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-6 text-center">
              <TrendingDown className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Missed Opportunities</h3>
              <p className="text-gray-600 text-sm">
                Can't quickly identify winning campaigns to scale or failing ones to pause.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The £2M Question</h2>
          <p className="text-lg text-gray-700 mb-6">
            With quarterly marketing budgets exceeding £2M across EMEA markets, every optimization matters. 
            A 5% improvement in conversion rates could mean <span className="font-bold text-green-600">£100K+ additional revenue</span>.
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
            <div>🇬🇧 UK: 35% of budget</div>
            <div>🇩🇪 Germany: 25% of budget</div>
            <div>🇫🇷 France: 20% of budget</div>
            <div>🇪🇸 Spain: 12% of budget</div>
            <div>🇮🇹 Italy: 8% of budget</div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            So I asked myself: <span className="font-bold">"What if we could see everything, in real-time, with predictive insights?"</span>
          </p>
          <Button 
            onClick={onNext}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full"
          >
            The Vision <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chapter1Challenge; 