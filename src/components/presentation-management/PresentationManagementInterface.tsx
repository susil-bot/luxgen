import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  FolderOpen, 
  Plus, 
  FileText, 
  Radio, 
  BarChart3, 
  Brain, 
  QrCode,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Play,
  Edit,
  Copy,
  Trash2,
  Eye,
  Download,
  Share2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Import presentation components
import MyPresentations from './MyPresentations';
import CreatePresentation from './CreatePresentation';
import PresentationTemplates from './PresentationTemplates';
import LivePresentations from './LivePresentations';
import PresentationAnalytics from './PresentationAnalytics';
import AIPolling from './AIPolling';
import QRManagement from './QRManagement';

const PresentationManagementInterface: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const navigationItems = [
    {
      id: 'my-presentations',
      label: 'My Presentations',
      icon: FolderOpen,
      path: '/app/presentations/my',
      description: 'Manage your created presentations'
    },
    {
      id: 'create-presentation',
      label: 'Create New',
      icon: Plus,
      path: '/app/presentations/create',
      description: 'Create a new presentation with AI support'
    },
    {
      id: 'presentation-templates',
      label: 'Templates',
      icon: FileText,
      path: '/app/presentations/templates',
      description: 'Use pre-built presentation templates'
    },
    {
      id: 'live-presentations',
      label: 'Live Sessions',
      icon: Radio,
      path: '/app/presentations/live',
      description: 'Manage active and upcoming live presentations'
    },
    {
      id: 'presentation-analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/app/presentations/analytics',
      description: 'View presentation performance and engagement'
    },
    {
      id: 'ai-polling',
      label: 'AI Polling',
      icon: Brain,
      path: '/app/presentations/ai-polling',
      description: 'Create AI-powered polls and questions'
    },
    {
      id: 'qr-management',
      label: 'QR Codes',
      icon: QrCode,
      path: '/app/presentations/qr-codes',
      description: 'Manage QR codes for audience participation'
    }
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Presentation Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create, manage, and deliver engaging presentations with AI support
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search presentations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Filter className="h-5 w-5" />
              </button>
              
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`block p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isActiveRoute(item.path)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    isActiveRoute(item.path)
                      ? 'bg-blue-100 dark:bg-blue-900/40'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      isActiveRoute(item.path)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${
                      isActiveRoute(item.path)
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Plus className="h-5 w-5" />
              <span>Create Presentation</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Radio className="h-5 w-5" />
              <span>Start Live Session</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Brain className="h-5 w-5" />
              <span>Generate AI Polls</span>
            </button>
          </div>
        </div>

        {/* Recent Presentations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Presentations
            </h3>
            <Link
              to="/app/presentations/my"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Leadership Workshop {item}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Created 2 days ago • 15 slides
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      <Play className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Views</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">1.2k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/my" element={<MyPresentations />} />
        <Route path="/create" element={<CreatePresentation />} />
        <Route path="/templates" element={<PresentationTemplates />} />
        <Route path="/live" element={<LivePresentations />} />
        <Route path="/analytics" element={<PresentationAnalytics />} />
        <Route path="/ai-polling" element={<AIPolling />} />
        <Route path="/qr-codes" element={<QRManagement />} />
      </Routes>
    </div>
  );
};

export default PresentationManagementInterface; 