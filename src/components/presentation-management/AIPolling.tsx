import React, { useState } from 'react';
import { 
  Brain, 
  Plus, 
  Sparkles, 
  Zap, 
  MessageSquare, 
  BarChart3,
  Settings,
  Copy,
  Trash2
} from 'lucide-react';

interface AIPoll {
  id: string;
  question: string;
  type: 'multiple_choice' | 'rating' | 'open_ended' | 'word_cloud';
  options?: string[];
  isActive: boolean;
  responses: number;
  engagement: number;
  aiGenerated: boolean;
}

const AIPolling: React.FC = () => {
  const [polls, setPolls] = useState<AIPoll[]>([
    {
      id: '1',
      question: 'How well did you understand the leadership concepts?',
      type: 'rating',
      isActive: true,
      responses: 45,
      engagement: 87,
      aiGenerated: true
    },
    {
      id: '2',
      question: 'What aspect of team building would you like to explore further?',
      type: 'multiple_choice',
      options: ['Communication', 'Trust Building', 'Conflict Resolution', 'Goal Setting'],
      isActive: false,
      responses: 32,
      engagement: 92,
      aiGenerated: true
    },
    {
      id: '3',
      question: 'Share your thoughts on effective leadership...',
      type: 'open_ended',
      isActive: true,
      responses: 28,
      engagement: 78,
      aiGenerated: false
    }
  ]);

  const generateAIPolls = () => {
    const newPolls: AIPoll[] = [
      {
        id: `poll_${Date.now()}_1`,
        question: 'How engaged do you feel with the current topic?',
        type: 'rating',
        isActive: false,
        responses: 0,
        engagement: 0,
        aiGenerated: true
      },
      {
        id: `poll_${Date.now()}_2`,
        question: 'Which learning method works best for you?',
        type: 'multiple_choice',
        options: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'],
        isActive: false,
        responses: 0,
        engagement: 0,
        aiGenerated: true
      }
    ];
    setPolls(prev => [...prev, ...newPolls]);
  };

  const optimizePolls = () => {
    setPolls(prev => prev.map(poll => ({
      ...poll,
      question: poll.question + ' (AI optimized)'
    })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Polling</h2>
          <p className="text-gray-600 dark:text-gray-400">Create intelligent polls and questions with AI assistance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={generateAIPolls}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Sparkles className="h-5 w-5" />
            <span>Generate AI Polls</span>
          </button>
          <button
            onClick={optimizePolls}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Zap className="h-5 w-5" />
            <span>Optimize</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <div key={poll.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className={`px-2 py-1 text-xs rounded-full ${
                  poll.aiGenerated 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {poll.aiGenerated ? 'AI Generated' : 'Manual'}
                </span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                poll.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {poll.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {poll.question}
            </h3>

            {poll.options && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Options:</p>
                <div className="space-y-1">
                  {poll.options.map((option, index) => (
                    <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      {index + 1}. {option}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{poll.responses} responses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>{poll.engagement}% engagement</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              
              <button className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Polling Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Smart Generation</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI creates relevant polls based on content</p>
          </div>
          <div className="text-center">
            <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Engagement Optimization</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Improve poll effectiveness with AI insights</p>
          </div>
          <div className="text-center">
            <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Real-time Analysis</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get instant feedback and analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPolling; 