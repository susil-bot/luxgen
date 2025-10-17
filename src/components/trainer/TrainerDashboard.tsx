import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  BarChart3, 
  TrendingUp, 
  Award, 
  Play,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  CheckSquare,
  Star,
  Eye,
  Download,
  Edit,
  Plus,
  Search,
  RefreshCw,
  Activity,
  Bookmark,
  MessageSquare,
  Users2,
  FileImage,
  FileAudio,
  Link,
  Trash2,
  Timer,
  Upload,
  Share,
  XCircle,
  DollarSign,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { apiServices } from '../../core/api/ApiService';
import { errorManager } from '../../core/error/ErrorManager';
import { toast } from 'react-hot-toast';

// Enhanced Types
interface TrainerStats {
  totalSessions: number;
  completedSessions: number;
  totalParticipants: number;
  averageRating: number;
  totalContent: number;
  activeParticipants: number;
  upcomingSessions: number;
  completionRate: number;
  revenue: number;
  engagementScore: number;
  satisfactionScore: number;
  retentionRate: number;
  averageSessionDuration: number;
  totalHoursDelivered: number;
  certificatesIssued: number;
  feedbackCount: number;
}

interface SessionAnalytics {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  averageParticipants: number;
  averageDuration: number;
  averageRating: number;
  completionRate: number;
  revenue: number;
  topPerformingSessions: Array<{
  id: string;
  title: string;
  rating: number;
    participants: number;
    revenue: number;
  }>;
  sessionTrends: Array<{
    date: string;
    sessions: number;
    participants: number;
    revenue: number;
  }>;
}

interface ParticipantAnalytics {
  totalParticipants: number;
  activeParticipants: number;
  newParticipants: number;
  returningParticipants: number;
  averageProgress: number;
  averageCompletionTime: number;
  topPerformers: Array<{
    id: string;
    name: string;
    email: string;
    progress: number;
    rating: number;
    completedSessions: number;
  }>;
  strugglingParticipants: Array<{
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActivity: Date;
    issues: string[];
  }>;
  participantTrends: Array<{
    date: string;
    newParticipants: number;
    activeParticipants: number;
    completedSessions: number;
  }>;
}

interface ContentAnalytics {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  archivedContent: number;
  averageViews: number;
  averageRating: number;
  topContent: Array<{
    id: string;
    title: string;
    type: string;
    views: number;
    rating: number;
    downloads: number;
  }>;
  contentPerformance: Array<{
    type: string;
    count: number;
    averageViews: number;
    averageRating: number;
  }>;
}

interface BusinessMetrics {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    projected: number;
  };
  costs: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    breakdown: {
      platform: number;
      marketing: number;
      content: number;
      support: number;
    };
  };
  profit: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    margin: number;
  };
  roi: {
    overall: number;
    bySession: number;
    byParticipant: number;
    byContent: number;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color: string;
  category: 'session' | 'content' | 'participant' | 'analytics' | 'business';
}

const TrainerDashboard: React.FC = React.memo(() => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'content' | 'participants' | 'analytics' | 'business' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // State for comprehensive data
  const [stats, setStats] = useState<TrainerStats | null>(null);

  const [sessionAnalytics, setSessionAnalytics] = useState<SessionAnalytics | null>(null);
  const [participantAnalytics, setParticipantAnalytics] = useState<ParticipantAnalytics | null>(null);
  const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics | null>(null);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);

  // Enhanced data arrays
  const [sessions, setSessions] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Quick Actions
  const quickActions: QuickAction[] = [
    {
      id: 'create-session',
      title: 'Create Session',
      description: 'Schedule a new training session',
      icon: Plus,
      action: () => handleCreateSession(),
      color: 'bg-blue-500',
      category: 'session'
    },
    {
      id: 'upload-content',
      title: 'Upload Content',
      description: 'Add new training materials',
      icon: Upload,
      action: () => handleUploadContent(),
      color: 'bg-green-500',
      category: 'content'
    },
    {
      id: 'invite-participants',
      title: 'Invite Participants',
      description: 'Send invitations to learners',
      icon: Users2,
      action: () => handleInviteParticipants(),
      color: 'bg-purple-500',
      category: 'participant'
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create performance analytics',
      icon: BarChart3,
      action: () => handleGenerateReport(),
      color: 'bg-orange-500',
      category: 'analytics'
    },
    {
      id: 'schedule-assessment',
      title: 'Schedule Assessment',
      description: 'Create evaluation tests',
      icon: CheckSquare,
      action: () => handleScheduleAssessment(),
      color: 'bg-red-500',
      category: 'session'
    },
    {
      id: 'view-feedback',
      title: 'View Feedback',
      description: 'Review participant feedback',
      icon: MessageSquare,
      action: () => handleViewFeedback(),
      color: 'bg-indigo-500',
      category: 'analytics'
    }
  ];

  // Load comprehensive trainer data
  const loadTrainerData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load all data in parallel for better performance
      const [
        statsResponse,
        sessionsResponse,
        contentResponse,
        participantsResponse,
        analyticsResponse,
        businessResponse
      ] = await Promise.all([
        apiServices.getTrainerStats(user.id),
        apiServices.getTrainingSessions(),
        apiServices.getContentLibrary(),
        apiServices.getUsers(),
        apiServices.getTrainingAnalytics(),
        apiServices.getPerformanceAnalytics()
      ]);

      // Handle responses
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (sessionsResponse.success) {
        setSessions(sessionsResponse.data || []);
      }

      if (contentResponse.success) {
        setContent(contentResponse.data || []);
      }

      if (participantsResponse.success) {
        setParticipants((participantsResponse.data || []).filter((p: any) => p.role === 'participant'));
      }

      if (analyticsResponse.success) {
        const analytics = analyticsResponse.data;
        setSessionAnalytics(analytics.sessions);
        setParticipantAnalytics(analytics.participants);
        setContentAnalytics(analytics.content);
      }

      if (businessResponse.success) {
        setBusinessMetrics(businessResponse.data);
      }

      // Load recent activity and notifications
      await loadRecentActivity();
      await loadNotifications();

    } catch (error) {
      console.error('Failed to load trainer data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadRecentActivity = async () => {
    try {
      // Load recent activity from API
      const activityResponse = await apiServices.getUserAnalytics();
      if (activityResponse.success && activityResponse.data?.recentActivity) {
        setRecentActivity(activityResponse.data.recentActivity);
      } else {
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Failed to load recent activity:', error);
      setRecentActivity([]);
    }
  };

  const loadNotifications = async () => {
    try {
      // Load notifications from API
      const notificationsResponse = await apiServices.getNotifications(user?.tenantId || '', {
        limit: 10,
        unreadOnly: false
      });
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data || []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    }
  };

  // Business Logic Functions
  const handleCreateSession = async () => {
    try {
      // Navigate to session creation or open modal
      // This would typically open a form modal or navigate to a creation page
      toast.success('Redirecting to session creation...');
      // Example: navigate('/app/sessions/create');
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error('Failed to create session');
    }
  };

  const handleUploadContent = async () => {
    try {
      // Open file upload modal or navigate to content creation
      toast.success('Opening content upload...');
      // Example: openUploadModal();
    } catch (error) {
      console.error('Failed to upload content:', error);
      toast.error('Failed to upload content');
    }
  };

  const handleInviteParticipants = async () => {
    try {
      // Open participant invitation modal
      toast.success('Opening participant invitation...');
      // Example: openInviteModal();
    } catch (error) {
      console.error('Failed to invite participants:', error);
      toast.error('Failed to invite participants');
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await apiServices.generateCustomReport({
        type: 'trainer_performance',
        dateRange: '30d',
        includeAnalytics: true
      });
      
      if (response.success) {
        toast.success('Report generated successfully');
        // Handle report download or display
      } else {
        toast.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report');
    }
  };

  const handleScheduleAssessment = async () => {
    try {
      // Navigate to assessment creation
      toast.success('Redirecting to assessment creation...');
      // Example: navigate('/app/assessments/create');
    } catch (error) {
      console.error('Failed to schedule assessment:', error);
      toast.error('Failed to schedule assessment');
    }
  };

  const handleViewFeedback = async () => {
    try {
      // Navigate to feedback dashboard
      toast.success('Redirecting to feedback dashboard...');
      // Example: navigate('/app/feedback');
    } catch (error) {
      console.error('Failed to view feedback:', error);
      toast.error('Failed to view feedback');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTrainerData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    try {
      if (query.trim()) {
        const searchResponse = await apiServices.globalSearch(query);
        if (searchResponse.success) {
          // Handle search results based on active tab
          const results = searchResponse.data;
          if (activeTab === 'sessions') {
            setSessions(results.sessions || []);
          } else if (activeTab === 'content') {
            setContent(results.content || []);
          } else if (activeTab === 'participants') {
            setParticipants(results.participants || []);
          }
        }
      } else {
        // Reload original data when search is cleared
        await loadTrainerData();
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    }
  };

  const handleFilter = async (filters: Record<string, any>) => {
    setSelectedFilters(filters);
    try {
      // Apply filters based on active tab
      let filteredData = [];
      
      if (activeTab === 'sessions') {
        const response = await apiServices.getTrainingSessions();
        if (response.success) {
          filteredData = (response.data || []).filter((session: any) => {
            return Object.entries(filters).every(([key, value]) => {
              if (!value) return true;
              return session[key] === value;
            });
          });
          setSessions(filteredData);
        }
      } else if (activeTab === 'content') {
        const response = await apiServices.getContentLibrary(filters);
        if (response.success) {
          setContent(response.data || []);
        }
      } else if (activeTab === 'participants') {
        const response = await apiServices.getUsers();
        if (response.success) {
          filteredData = (response.data || []).filter((user: any) => {
            return user.role === 'participant' && Object.entries(filters).every(([key, value]) => {
              if (!value) return true;
              return user[key] === value;
            });
          });
          setParticipants(filteredData);
        }
      }
    } catch (error) {
      console.error('Filter failed:', error);
      toast.error('Filter failed');
    }
  };



  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };



  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'presentation': return FileImage;
      case 'audio': return FileAudio;
      case 'link': return Link;
      default: return FileText;
    }
  };

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }, []);

  const formatPercentage = useCallback((value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  }, []);

  const formatDuration = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadTrainerData();
  }, [loadTrainerData]);

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading trainer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Trainer Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.firstName}! Here's your training overview.
              </p>
              </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions, content, participants..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  loadTrainerData();
                }}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
                                 <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.totalSessions || 0}</p>
                </div>
              </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Participants</p>
                                 <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.activeParticipants || 0}</p>
                </div>
              </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+8% from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                                 <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{(stats?.averageRating || 0).toFixed(1)}</p>
                </div>
              </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+0.3 from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                                 <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(stats?.revenue || 0)}</p>
                </div>
              </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+15% from last month</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group ${action.color} hover:scale-105`}
              >
                <div className="text-center">
                  <action.icon className="h-8 w-8 text-white mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">{action.title}</p>
                  <p className="text-xs text-white/80 mt-1">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'sessions', label: 'Sessions', icon: Calendar },
                { id: 'content', label: 'Content', icon: BookOpen },
                { id: 'participants', label: 'Participants', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'business', label: 'Business', icon: DollarSign },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                  <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
              ))}
            </nav>
        </div>

        {/* Tab Content */}
            <div className="p-6">
                        {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Dashboard Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Hours Delivered</p>
                        <p className="text-2xl font-bold">{formatDuration(stats?.totalHoursDelivered || 0)}</p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-200" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+15% this month</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Certificates Issued</p>
                        <p className="text-2xl font-bold">{stats?.certificatesIssued || 0}</p>
                      </div>
                      <Award className="h-8 w-8 text-green-200" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+8% this month</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Feedback Received</p>
                        <p className="text-2xl font-bold">{stats?.feedbackCount || 0}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-purple-200" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+12% this month</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Average Session Duration</p>
                        <p className="text-2xl font-bold">{formatDuration(stats?.averageSessionDuration || 0)}</p>
                      </div>
                      <Timer className="h-8 w-8 text-orange-200" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+5% this month</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Performance Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatPercentage(stats?.completionRate || 0)}</span>
                      </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Score</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats?.engagementScore || 0}/100</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Score</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats?.satisfactionScore || 0}/100</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatPercentage(stats?.retentionRate || 0)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Active Participants</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats?.activeParticipants || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming Sessions</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats?.upcomingSessions || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                      <div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={handleCreateSession}
                          className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Create Session</span>
                        </button>
                        <button
                          onClick={handleUploadContent}
                          className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                          <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-900 dark:text-green-100">Upload Content</span>
                        </button>
                        <button
                          onClick={handleGenerateReport}
                          className="w-full flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        >
                          <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Generate Report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity & Upcoming Sessions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                              <activity.icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.timestamp.toLocaleTimeString()}
                      </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Sessions</h3>
                    <div className="space-y-3">
                      {sessions.filter(s => s.status === 'scheduled').length > 0 ? (
                        sessions.filter(s => s.status === 'scheduled').slice(0, 5).map((session) => (
                          <div key={session.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                              <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{session.date.toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {session.participants.length} participants
                      </span>
                              <div className="flex items-center space-x-1 mt-1">
                                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                  <Eye className="h-3 w-3" />
                                </button>
                    </div>
                  </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No upcoming sessions</p>
                          <button
                            onClick={handleCreateSession}
                            className="mt-2 inline-flex items-center px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Create Session
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Training Sessions</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                <button
                        onClick={() => handleFilter({ status: 'all' })}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        All
                      </button>
                      <button
                        onClick={() => handleFilter({ status: 'scheduled' })}
                        className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30"
                      >
                        Scheduled
                      </button>
                      <button
                        onClick={() => handleFilter({ status: 'in-progress' })}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleFilter({ status: 'completed' })}
                        className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30"
                      >
                        Completed
                </button>
              </div>
                    <button
                      onClick={handleCreateSession}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Session</span>
                    </button>
                      </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <div key={session.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{session.title}</h4>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{session.description}</p>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{session.date.toLocaleDateString()}</span>
                      </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{formatDuration(session.duration || 0)}</span>
                    </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Participants:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{session.participants.length}/{session.maxParticipants || '∞'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Type:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{session.type}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                          {session.status === 'scheduled' && (
                            <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              Start Session
                            </button>
                          )}
                  </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No sessions found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by creating your first training session.</p>
                      <button
                        onClick={handleCreateSession}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Session
                      </button>
                    </div>
                  )}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Training Content</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFilter({ type: 'all' })}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        All
                      </button>
                      <button
                        onClick={() => handleFilter({ type: 'video' })}
                        className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30"
                      >
                        Videos
                      </button>
                      <button
                        onClick={() => handleFilter({ type: 'document' })}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30"
                      >
                        Documents
                      </button>
                      <button
                        onClick={() => handleFilter({ type: 'presentation' })}
                        className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30"
                      >
                        Presentations
                      </button>
                    </div>
                    <button
                      onClick={handleUploadContent}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Content</span>
                    </button>
                    </div>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.length > 0 ? (
                    content.map((item) => (
                      <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-4">
                          {(() => {
                            const IconComponent = getContentIcon(item.type);
                            return <IconComponent className="h-8 w-8 text-gray-600 dark:text-gray-400" />;
                          })()}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.type}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Views:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{item.views || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Rating:</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium text-gray-900 dark:text-gray-100">{item.rating || 0}/5</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Size:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{item.size || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Created:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <Share className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button className="p-1 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400">
                              <Star className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                              <Bookmark className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No content found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Start building your content library by uploading training materials.</p>
                      <button
                        onClick={handleUploadContent}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Content
                      </button>
                    </div>
                  )}
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Participants</h3>
                  <button
                    onClick={handleInviteParticipants}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Users2 className="h-4 w-4" />
                    <span>Invite Participants</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {participants.map((participant) => (
                    <div key={participant.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {participant.firstName[0]}{participant.lastName[0]}
                          </span>
                      </div>
                      <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {participant.firstName} {participant.lastName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{participant.email}</p>
                      </div>
                    </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Progress: 75%</span>
                        <span>Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Analytics Dashboard</h3>
                
                {sessionAnalytics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Session Analytics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Sessions:</span>
                          <span className="font-medium">{sessionAnalytics.totalSessions}</span>
                    </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Completion Rate:</span>
                          <span className="font-medium">{formatPercentage(sessionAnalytics.completionRate)}</span>
                    </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Average Rating:</span>
                          <span className="font-medium">{sessionAnalytics.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                    </div>
                )}

                {participantAnalytics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Participant Analytics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Participants:</span>
                          <span className="font-medium">{participantAnalytics.totalParticipants}</span>
                    </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Active Participants:</span>
                          <span className="font-medium">{participantAnalytics.activeParticipants}</span>
                    </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Average Progress:</span>
                          <span className="font-medium">{formatPercentage(participantAnalytics.averageProgress)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Business Metrics</h3>
                
                {businessMetrics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Revenue</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total:</span>
                          <span className="font-medium">{formatCurrency(businessMetrics.revenue.total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">This Month:</span>
                          <span className="font-medium">{formatCurrency(businessMetrics.revenue.thisMonth)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Growth:</span>
                          <span className="font-medium text-green-600">{businessMetrics.revenue.growth}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Profit</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total:</span>
                          <span className="font-medium">{formatCurrency(businessMetrics.profit.total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Margin:</span>
                          <span className="font-medium">{businessMetrics.profit.margin}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">ROI</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Overall:</span>
                          <span className="font-medium">{businessMetrics.roi.overall}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Per Session:</span>
                          <span className="font-medium">{businessMetrics.roi.bySession}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Trainer Settings</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure your trainer profile, preferences, and notification settings.
                </p>
                {/* Settings content will be implemented */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default TrainerDashboard; 