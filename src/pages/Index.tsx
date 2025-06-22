
import React from 'react';
import HeroSection from '../components/HeroSection';
import ArchitectureSection from '../components/ArchitectureSection';
import DashboardSection from '../components/DashboardSection';
import PipelineTimeline from '../components/PipelineTimeline';
import CaseStudySection from '../components/CaseStudySection';
import RecruiterSection from '../components/RecruiterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <HeroSection />
      <ArchitectureSection />
      <DashboardSection />
      <PipelineTimeline />
      <CaseStudySection />
      <RecruiterSection />
    </div>
  );
};

export default Index;
