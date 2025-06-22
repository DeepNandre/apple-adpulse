
import React from 'react';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-7xl md:text-9xl font-thin mb-8 tracking-tight animate-fade-in">
          AdPulse
        </h1>
        <p className="text-2xl md:text-3xl font-light mb-4 text-gray-300 animate-fade-in" style={{animationDelay: '0.3s'}}>
          Marketing Intelligence Platform
        </p>
        <p className="text-lg md:text-xl font-light mb-16 text-gray-400 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.6s'}}>
          A comprehensive data journey from simulation to insight
        </p>
        
        <button 
          onClick={() => scrollToSection('architecture')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 animate-fade-in"
          style={{animationDelay: '0.9s'}}
        >
          Explore the Journey
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 animate-bounce">
        <ChevronDown size={24} />
      </div>
    </section>
  );
};

export default HeroSection;
