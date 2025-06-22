import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, ArrowLeft, Rocket, TrendingUp, Target, Award } from 'lucide-react';

interface Chapter5Props {
  onNext: () => void;
  onPrev: () => void;
}

const Chapter5Impact: React.FC<Chapter5Props> = ({ onNext, onPrev }) => {
  const impactMetrics = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "16.5% Conversion Lift",
      description: "A/B testing optimization increased conversion rates across EMEA campaigns",
      value: "+£100K ARR",
      color: "bg-green-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "96.8% Statistical Confidence",
      description: "High-confidence insights enable quick decision making on campaign optimizations",
      value: "Data-Driven",
      color: "bg-blue-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "68% Retention Rate",
      description: "Customer lifecycle analytics improved retention vs 45% industry average",
      value: "+23% vs Industry",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6">
            <Rocket className="w-4 h-4 mr-2" />
            Chapter 5: The Impact
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            "The numbers don't <span className="text-orange-600">lie</span>"
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Once deployed, the platform transformed how marketing decisions were made. 
            From reactive reporting to <span className="font-semibold">proactive intelligence</span>.
          </p>
        </div>

        {/* Key Impact Metrics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {impactMetrics.map((metric, index) => (
            <Card key={index} className="border-2 border-orange-200 bg-orange-50/50 hover:shadow-lg transition-all">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 ${metric.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {metric.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{metric.title}</h3>
                <p className="text-gray-600 mb-4">{metric.description}</p>
                <div className="text-lg font-bold text-orange-600">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white mb-12 shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Measurable Business Impact</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold mb-2">€368K</div>
                <div className="text-orange-100">Total Revenue Tracked</div>
                <div className="text-sm text-orange-200 mt-1">Across EMEA markets with full attribution</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold mb-2">&lt;3min</div>
                <div className="text-orange-100">ETL Processing Time</div>
                <div className="text-sm text-orange-200 mt-1">For 565K+ records with data validation</div>
              </div>
            </div>
            <p className="text-xl text-orange-100">
              "This platform didn't just organize our data - it transformed our entire approach to marketing intelligence."
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl text-gray-600 mb-8">
            Ready for the technical deep dive? <span className="font-bold">"Let's explore the architecture."</span>
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={onPrev}
              variant="outline"
              size="lg" 
              className="px-8 py-4 rounded-full text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> The Platform
            </Button>
            <Button 
              onClick={onNext}
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full text-lg"
            >
              The Deep Dive <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter5Impact; 