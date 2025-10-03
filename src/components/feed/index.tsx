import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Filter, 
  Search, 
  RefreshCw, 
  MoreVertical, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Clock, 
  User, 
  Users, 
  TrendingUp, 
  Award, 
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Target,
  BarChart3,
  Play
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ActivityFeedHelper } from './helpers/ActivityFeedHelper';
import { ActivityFeedFetcher } from './fetchers/ActivityFeedFetcher';
import { ActivityFeedTransformer } from './transformers/ActivityFeedTransformer';
import { ActivityFeedItem, ActivityFeedFilter, ActivityFeedStats } from './types/types';
import { FEED_CONSTANTS } from './constants/constants';

const ActivityFeed: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ActivityFeedFilter>('all');
  const [stats, setStats] = useState<ActivityFeedStats | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Load activities on component mount
  useEffect(() => {
    loadActivities();
  }, []);

  // Filter activities when search term or filter changes
  useEffect(() => {
    const filtered = ActivityFeedHelper.filterActivities(activities, searchTerm, selectedFilter);
    setFilteredActivities(filtered);
  }, [activities, searchTerm, selectedFilter]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.tenantId) {
        setError('User tenant ID is required');
        return;
      }
      
      const result = await ActivityFeedFetcher.getActivities(user.tenantId);
      
      if (result && result.success && result.data) {
        const transformedActivities = ActivityFeedTransformer.transformActivities(result.data);
        setActivities(transformedActivities);
        
        // Load stats
        const statsResult = await ActivityFeedFetcher.getFeedStats(user.tenantId);
        if (statsResult && statsResult.success && statsResult.data) {
          setStats(ActivityFeedTransformer.transformStats(statsResult.data));
        }
      } else {
        setError(result?.error || 'Failed to load activities');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const handleActivityAction = async (activityId: string, action: string) => {
    try {
      if (!user?.tenantId) {
        console.error('User tenant ID is required');
        return;
      }
      
      const result = await ActivityFeedFetcher.performActivityAction(activityId, action, user.tenantId);
      
      if (result && result.success) {
        // Update local state
        setActivities(prev => 
          ActivityFeedHelper.updateActivityAction(prev, activityId, action)
        );
      }
    } catch (err) {
      console.error('Error performing activity action:', err);
    }
  };

  const handleFilterChange = (filter: ActivityFeedFilter) => {
    setSelectedFilter(filter);
  };

  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      'user_joined': User,
      'program_created': Bookmark,
      'session_completed': CheckCircle,
      'assessment_taken': Award,
      'training_started': Play,
      'certificate_earned': Award,
      'feedback_submitted': MessageCircle,
      'poll_created': Target,
      'announcement': AlertCircle,
      'milestone_reached': TrendingUp
    };
    return iconMap[type] || Activity;
  };

  const getActivityColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'user_joined': 'text-blue-600 bg-blue-100',
      'program_created': 'text-green-600 bg-green-100',
      'session_completed': 'text-purple-600 bg-purple-100',
      'assessment_taken': 'text-orange-600 bg-orange-100',
      'training_started': 'text-indigo-600 bg-indigo-100',
      'certificate_earned': 'text-yellow-600 bg-yellow-100',
      'feedback_submitted': 'text-pink-600 bg-pink-100',
      'poll_created': 'text-red-600 bg-red-100',
      'announcement': 'text-gray-600 bg-gray-100',
      'milestone_reached': 'text-emerald-600 bg-emerald-100'
    };
    return colorMap[type] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading activities...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Feed</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={loadActivities}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6" ref={feedRef}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Feed</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay updated with the latest activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalActivities}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Engagement</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.engagementRate}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.thisWeek}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {FEED_CONSTANTS.FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value as ActivityFeedFilter)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Activities Found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No activities to show at the moment'
              }
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            const colorClasses = getActivityColor(activity.type);
            
            return (
              <div
                key={activity.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${colorClasses}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {ActivityFeedHelper.formatTimestamp(activity.timestamp)}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {activity.description}
                    </p>
                    
                    {activity.metadata && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleActivityAction(activity.id, 'like')}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{activity.likes || 0}</span>
                        </button>
                        <button
                          onClick={() => handleActivityAction(activity.id, 'comment')}
                          className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{activity.comments || 0}</span>
                        </button>
                        <button
                          onClick={() => handleActivityAction(activity.id, 'share')}
                          className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.user?.name || 'System'}
                        </span>
                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
