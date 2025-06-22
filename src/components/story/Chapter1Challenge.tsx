import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, AlertTriangle, TrendingDown } from 'lucide-react';

interface Chapter1Props {
  onNext: () => void;
}

const Chapter1Challenge: React.FC<Chapter1Props> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
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

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-red-200 bg-red-50/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <TrendingDown className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fragmented Data</h3>
              <p className="text-gray-600">
                Campaign data scattered across platforms. No unified view of performance across EMEA markets.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Delayed Insights</h3>
              <p className="text-gray-600">
                Weekly reports, manual analysis. By the time you spot issues, budgets are burned.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <TrendingDown className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Missed Opportunities</h3>
              <p className="text-gray-600">
                Can't quickly identify winning campaigns to scale or failing ones to pause.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-gray-200 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">The £2M Question</h2>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-4xl mx-auto">
            With quarterly marketing budgets exceeding £2M across EMEA markets, every optimization matters. 
            A 5% improvement in conversion rates could mean <span className="font-bold text-green-600">£100K+ additional revenue</span>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl mb-2">🇬🇧</div>
              <div className="font-semibold text-gray-900">UK</div>
              <div className="text-sm text-gray-600">35% of budget</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl mb-2">🇩🇪</div>
              <div className="font-semibold text-gray-900">Germany</div>
              <div className="text-sm text-gray-600">25% of budget</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl mb-2">🇫🇷</div>
              <div className="font-semibold text-gray-900">France</div>
              <div className="text-sm text-gray-600">20% of budget</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl mb-2">🇪🇸</div>
              <div className="font-semibold text-gray-900">Spain</div>
              <div className="text-sm text-gray-600">12% of budget</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl mb-2">🇮🇹</div>
              <div className="font-semibold text-gray-900">Italy</div>
              <div className="text-sm text-gray-600">8% of budget</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl text-gray-600 mb-8">
            So I asked myself: <span className="font-bold">"What if we could see everything, in real-time, with predictive insights?"</span>
          </p>
          <Button 
            onClick={onNext}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg"
          >
            The Vision <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chapter1Challenge; 