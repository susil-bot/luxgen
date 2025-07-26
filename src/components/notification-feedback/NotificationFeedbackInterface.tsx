import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  BarChart3, 
  MessageSquare, 
  ClipboardCheck, 
  Calendar, 
  Share2,
  TrendingUp,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Smartphone,
  MessageCircle,
  Hash
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Import notification components
import NichePolls from './NichePolls';
import FeedbackCollection from './FeedbackCollection';
import PostTestAnalysis from './PostTestAnalysis';
import NotificationScheduler from './NotificationScheduler';
import ChannelManagement from './ChannelManagement';
import NotificationAnalytics from './NotificationAnalytics';

const NotificationFeedbackInterface: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const navigationItems = [
    {
      id: 'niche-polls',
      label: 'Niche Polls',
      icon: BarChart3,
      path: '/app/notifications/polls',
      description: 'Create and manage targeted polls for specific audiences'
    },
    {
      id: 'feedback-collection',
      label: 'Feedback Collection',
      icon: MessageSquare,
      path: '/app/notifications/feedback',
      description: 'Gather and analyze user feedback and responses'
    },
    {
      id: 'post-test-analysis',
      label: 'Post-Test Analysis',
      icon: ClipboardCheck,
      path: '/app/notifications/post-tests',
      description: 'Analyze test results and generate insights'
    },
    {
      id: 'notification-scheduler',
      label: 'Notification Scheduler',
      icon: Calendar,
      path: '/app/notifications/scheduler',
      description: 'Schedule and manage multi-channel notifications'
    },
    {
      id: 'channel-management',
      label: 'Channel Management',
      icon: Share2,
      path: '/app/notifications/channels',
      description: 'Configure email, SMS, WhatsApp, and Slack channels'
    },
    {
      id: 'analytics-reports',
      label: 'Analytics & Reports',
      icon: TrendingUp,
      path: '/app/notifications/analytics',
      description: 'View comprehensive analytics and generate reports'
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
                Notifications & Feedback
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage niche-based polls, feedback collection, and multi-channel notifications
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <BarChart3 className="h-5 w-5" />
              <span>Create Poll</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span>Send Feedback</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Calendar className="h-5 w-5" />
              <span>Schedule Notification</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
              <Send className="h-5 w-5" />
              <span>Send Now</span>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h3>
            <Link
              to="/app/notifications/analytics"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                type: 'poll',
                title: 'Leadership Training Poll',
                status: 'sent',
                channel: 'email',
                recipients: 45,
                responses: 32,
                time: '2 hours ago'
              },
              {
                type: 'feedback',
                title: 'Course Feedback Request',
                status: 'scheduled',
                channel: 'whatsapp',
                recipients: 28,
                responses: 0,
                time: 'Tomorrow 10:00 AM'
              },
              {
                type: 'notification',
                title: 'Test Results Available',
                status: 'sent',
                channel: 'slack',
                recipients: 15,
                responses: 12,
                time: '1 day ago'
              }
            ].map((activity, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {activity.type === 'poll' && <BarChart3 className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'feedback' && <MessageSquare className="h-4 w-4 text-green-600" />}
                    {activity.type === 'notification' && <Bell className="h-4 w-4 text-purple-600" />}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === 'sent' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {activity.title}
                </h4>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    {activity.channel === 'email' && <Mail className="h-4 w-4" />}
                    {activity.channel === 'whatsapp' && <MessageCircle className="h-4 w-4" />}
                    {activity.channel === 'slack' && <Hash className="h-4 w-4" />}
                    <span>{activity.channel}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{activity.recipients} recipients</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{activity.time}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>{activity.responses} responses</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Connected</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">WhatsApp</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Connected</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Hash className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Slack</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Connected</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Smartphone className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">SMS</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Connected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/polls" element={<NichePolls />} />
        <Route path="/feedback" element={<FeedbackCollection />} />
        <Route path="/post-tests" element={<PostTestAnalysis />} />
        <Route path="/scheduler" element={<NotificationScheduler />} />
        <Route path="/channels" element={<ChannelManagement />} />
        <Route path="/analytics" element={<NotificationAnalytics />} />
      </Routes>
    </div>
  );
};

export default NotificationFeedbackInterface; 