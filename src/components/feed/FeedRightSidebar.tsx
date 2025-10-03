import React from 'react';
import { 
  Info, ExternalLink, ChevronRight, 
  Grid3X3, Clock, Users, Star, User
} from 'lucide-react';

const FeedRightSidebar: React.FC = () => {
  const linkedInNews = [
    {
      title: 'From job seeker to CEO',
      time: '6d ago',
      readers: '14,335 readers'
    },
    {
      title: 'The future of remote work',
      time: '1w ago',
      readers: '8,921 readers'
    },
    {
      title: 'AI in recruitment trends',
      time: '2w ago',
      readers: '12,456 readers'
    }
  ];

  const puzzles = [
    {
      title: 'Mini Sudoku',
      description: 'Crafted by the originators of \'Sudoku\' and the 3x World Sudoku Champion',
      icon: Grid3X3
    },
    {
      title: 'Zip - a quick brain teaser',
      description: 'Solve in 60s or less! 22 connections played',
      icon: Clock
    }
  ];

  return (
    <div className="space-y-6">
      {/* LinkedIn News */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">LinkedIn News</h3>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Top stories</h4>
        </div>

        <div className="space-y-3">
          {linkedInNews.map((news, index) => (
            <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
              <h5 className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                {news.title}
              </h5>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">{news.time}</span>
                <span className="text-xs text-gray-500">{news.readers}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full text-left text-sm text-blue-600 hover:underline mt-3">
          Show more
        </button>
      </div>

      {/* Today's Puzzles */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Today's puzzles</h3>
        
        <div className="space-y-4">
          {puzzles.map((puzzle, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <puzzle.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{puzzle.title}</h4>
                <p className="text-xs text-gray-600">{puzzle.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Premium Advertisement */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs text-gray-500">Ad</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">Sponsored</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Sobhana, unlock your full potential with LinkedIn Premium
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Get exclusive insights, advanced search, and more with Premium
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
              Premium
            </button>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Trending in your network</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">#AI</span>
              <span className="text-xs text-gray-500">• Trending</span>
            </div>
            <span className="text-xs text-gray-500">2.3K posts</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">#RemoteWork</span>
              <span className="text-xs text-gray-500">• Trending</span>
            </div>
            <span className="text-xs text-gray-500">1.8K posts</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">#TechJobs</span>
              <span className="text-xs text-gray-500">• Trending</span>
            </div>
            <span className="text-xs text-gray-500">1.2K posts</span>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Privacy & Terms</a>
          <a href="#" className="hover:underline">Ad Choices</a>
          <a href="#" className="hover:underline">Advertising</a>
          <a href="#" className="hover:underline">Business Services</a>
          <a href="#" className="hover:underline">Get the LinkedIn app</a>
          <a href="#" className="hover:underline">More</a>
        </div>
        <p className="pt-2">LinkedIn Corporation © 2024</p>
      </div>
    </div>
  );
};

export default FeedRightSidebar;
