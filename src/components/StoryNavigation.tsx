import React from 'react';
import { Badge } from './ui/badge';

interface StoryNavigationProps {
  currentChapter: number;
  onChapterChange: (chapter: number) => void;
}

const chapters = [
  { id: 1, title: "The Challenge", icon: "🎯", description: "EMEA Marketing Visibility Gap" },
  { id: 2, title: "The Vision", icon: "💡", description: "Unified Intelligence Platform" },
  { id: 3, title: "The Build", icon: "🔧", description: "Technical Implementation" },
  { id: 4, title: "The Platform", icon: "📊", description: "Interactive Dashboard" },
  { id: 5, title: "The Impact", icon: "🚀", description: "Business Results" },
  { id: 6, title: "The Deep Dive", icon: "🔬", description: "Technical Showcase" }
];

const StoryNavigation: React.FC<StoryNavigationProps> = ({ currentChapter, onChapterChange }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-600">The Journey:</span>
        <div className="flex items-center space-x-2">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => onChapterChange(chapter.id)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all duration-300 ${
                currentChapter === chapter.id
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : currentChapter > chapter.id
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title={`${chapter.title}: ${chapter.description}`}
            >
              <span className="text-sm">{chapter.icon}</span>
              <span className="text-xs font-medium hidden sm:inline">{chapter.title}</span>
            </button>
          ))}
        </div>
        <Badge variant="outline" className="text-xs">
          {currentChapter}/6
        </Badge>
      </div>
    </div>
  );
};

export default StoryNavigation; 