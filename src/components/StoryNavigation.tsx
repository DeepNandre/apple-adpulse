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
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">Marketing Intelligence Journey</h2>
            <Badge variant="outline" className="text-xs">
              {currentChapter}/6
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => onChapterChange(chapter.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  currentChapter === chapter.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
                    : currentChapter > chapter.id
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                title={`${chapter.title}: ${chapter.description}`}
              >
                <span className="text-sm">{chapter.icon}</span>
                <span className="font-medium hidden lg:inline">{chapter.title}</span>
                <span className="font-medium lg:hidden">{chapter.id}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryNavigation; 