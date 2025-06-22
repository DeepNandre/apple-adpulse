import React, { useState } from 'react';
import StoryNavigation from './StoryNavigation';
import Chapter1Challenge from './story/Chapter1Challenge';
import Chapter2Vision from './story/Chapter2Vision';
import Chapter3Build from './story/Chapter3Build';
import Chapter4Platform from './story/Chapter4Platform';
import Chapter5Impact from './story/Chapter5Impact';
import Chapter6DeepDive from './story/Chapter6DeepDive';

// Fallback component for regular dashboard view
import HeroSection from './HeroSection';
import ArchitectureSection from './ArchitectureSection';
import DashboardSection from './DashboardSection';
import PipelineTimeline from './PipelineTimeline';
import CaseStudySection from './CaseStudySection';
import RecruiterSection from './RecruiterSection';

const StoryMode: React.FC = () => {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [isStoryMode, setIsStoryMode] = useState(true);

  const handleChapterChange = (chapter: number) => {
    setCurrentChapter(chapter);
  };

  const handleNextChapter = () => {
    if (currentChapter < 6) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleFinishStory = () => {
    setIsStoryMode(false);
  };

  // Regular platform view (non-story mode)
  if (!isStoryMode) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsStoryMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            📖 Story Mode
          </button>
        </div>
        <HeroSection />
        <ArchitectureSection />
        <DashboardSection />
        <PipelineTimeline />
        <CaseStudySection />
        <RecruiterSection />
      </div>
    );
  }

  // Story mode chapters
  return (
    <div className="min-h-screen overflow-x-hidden">
      <StoryNavigation 
        currentChapter={currentChapter} 
        onChapterChange={handleChapterChange} 
      />
      
      {currentChapter === 1 && (
        <Chapter1Challenge onNext={handleNextChapter} />
      )}
      
      {currentChapter === 2 && (
        <Chapter2Vision 
          onNext={handleNextChapter} 
          onPrev={handlePrevChapter} 
        />
      )}
      
      {currentChapter === 3 && (
        <Chapter3Build 
          onNext={handleNextChapter} 
          onPrev={handlePrevChapter} 
        />
      )}
      
      {currentChapter === 4 && (
        <Chapter4Platform 
          onNext={handleNextChapter} 
          onPrev={handlePrevChapter} 
        />
      )}
      
      {currentChapter === 5 && (
        <Chapter5Impact 
          onNext={handleNextChapter} 
          onPrev={handlePrevChapter} 
        />
      )}
      
      {currentChapter === 6 && (
        <Chapter6DeepDive 
          onPrev={handlePrevChapter} 
          onFinish={handleFinishStory} 
        />
      )}
    </div>
  );
};

export default StoryMode; 