import React, { useState } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  Square, 
  Users, 
  Clock, 
  BarChart3, 
  QrCode,
  Settings,
  Eye,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';

interface LivePresentation {
  id: string;
  title: string;
  status: 'preparing' | 'live' | 'paused' | 'ended';
  participants: number;
  maxParticipants: number;
  startedAt?: Date;
  duration: number;
  currentSlide: number;
  totalSlides: number;
  qrCode: string;
  engagement: number;
}

const LivePresentations: React.FC = () => {
  const [presentations] = useState<LivePresentation[]>([
    {
      id: '1',
      title: 'Leadership Workshop - Live',
      status: 'live',
      participants: 45,
      maxParticipants: 100,
      startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      duration: 90,
      currentSlide: 8,
      totalSlides: 25,
      qrCode: 'https://luxgen.app/present/abc123',
      engagement: 87
    },
    {
      id: '2',
      title: 'Team Building Session',
      status: 'preparing',
      participants: 0,
      maxParticipants: 50,
      duration: 60,
      currentSlide: 1,
      totalSlides: 18,
      qrCode: 'https://luxgen.app/present/def456',
      engagement: 0
    },
    {
      id: '3',
      title: 'Sales Training - Advanced',
      status: 'paused',
      participants: 32,
      maxParticipants: 75,
      startedAt: new Date(Date.now() - 45 * 60 * 1000),
      duration: 120,
      currentSlide: 12,
      totalSlides: 30,
      qrCode: 'https://luxgen.app/present/ghi789',
      engagement: 92
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'paused':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'ended':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getElapsedTime = (startedAt: Date) => {
    const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000 / 60);
    return formatDuration(elapsed);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Presentations</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage active and upcoming presentation sessions</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
          <Radio className="h-5 w-5" />
          <span>Start New Session</span>
        </button>
      </div>

      {/* Live Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presentations.map((presentation) => (
          <div key={presentation.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {presentation.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(presentation.status)}`}>
                  {presentation.status.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{presentation.participants}/{presentation.maxParticipants}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(presentation.duration)}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {presentation.currentSlide}/{presentation.totalSlides}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(presentation.currentSlide / presentation.totalSlides) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Engagement */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Engagement</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {presentation.engagement}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${presentation.engagement}%` }}
                  ></div>
                </div>
              </div>

              {/* Session Info */}
              {presentation.startedAt && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Started: {getElapsedTime(presentation.startedAt)} ago
                  </div>
                </div>
              )}

              {/* QR Code */}
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <QrCode className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Audience Access
                  </span>
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 break-all">
                  {presentation.qrCode}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {presentation.status === 'live' && (
                    <>
                      <button className="p-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors">
                        <Pause className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Square className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {presentation.status === 'preparing' && (
                    <button className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  {presentation.status === 'paused' && (
                    <button className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Radio className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {presentations.filter(p => p.status === 'live').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {presentations.reduce((sum, p) => sum + p.participants, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Engagement</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {Math.round(presentations.reduce((sum, p) => sum + p.engagement, 0) / presentations.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Duration</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatDuration(presentations.reduce((sum, p) => sum + p.duration, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePresentations; 