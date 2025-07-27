import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  BarChart3, 
  TrendingUp, 
  Award, 
  Target,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  Video,
  FileText,
  CheckSquare,
  Target as TargetIcon,
  Star,
  Eye,
  Download,
  Share2,
  Edit,
  Plus,
  Filter,
  Search,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Activity,
  Zap,
  Lightbulb,
  Bookmark,
  MessageSquare,
  Bell,
  Settings,
  User,
  UserCheck,
  UserX,
  GraduationCap,
  Trophy,
  Medal,
  Crown,
  Flame,
  Rocket,
  ChartLine,
  PieChart,
  BarChart,
  LineChart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiServices from '../../services/apiServices';
import { handleApiError, handleApiResponse } from '../../utils/errorHandler';
import { toast } from 'react-hot-toast';

// Use the types from apiServices instead of local interfaces
import { TrainingSession, TrainingCourse, ContentItem } from '../../services/apiServices';

interface LocalTrainingContent {
  id: string;
  title: string;
  type: 'presentation' | 'video' | 'document' | 'quiz' | 'interactive';
  createdAt: Date;
  lastModified: Date;
  views: number;
  rating: number;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActivity: Date;
  status: 'active' | 'inactive' | 'completed';
}

interface TrainerStats {
  totalSessions: number;
  completedSessions: number;
  totalParticipants: number;
  averageRating: number;
  totalContent: number;
  activeParticipants: number;
  upcomingSessions: number;
  completionRate: number;
}

const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'content' | 'participants' | 'analytics'>('overview');
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [content, setContent] = useState<LocalTrainingContent[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TrainerStats>({
    totalSessions: 0,
    completedSessions: 0,
    totalParticipants: 0,
    averageRating: 0,
    totalContent: 0,
    activeParticipants: 0,
    upcomingSessions: 0,
    completionRate: 0
  });

  // Load trainer data from API
  const loadTrainerData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Load training sessions
      const sessionsResponse = await apiServices.getTrainingSessions();
      if (handleApiResponse(sessionsResponse)) {
        setSessions(sessionsResponse.data || []);
      }

      // Load trainer stats
      const statsResponse = await apiServices.getTrainerStats(user.id);
      if (handleApiResponse(statsResponse)) {
        setStats(statsResponse.data || {
          totalSessions: 0,
          completedSessions: 0,
          totalParticipants: 0,
          averageRating: 0,
          totalContent: 0,
          activeParticipants: 0,
          upcomingSessions: 0,
          completionRate: 0
        });
      }

      // Load training content (this would be from AI content creation or training materials)
      const contentResponse = await apiServices.getContentLibrary();
      if (handleApiResponse(contentResponse)) {
        // Convert ContentItem to LocalTrainingContent
        const convertedContent: LocalTrainingContent[] = (contentResponse.data || []).map(item => ({
          id: item.id,
          title: item.title,
          type: item.type as any,
          createdAt: new Date(item.createdAt),
          lastModified: new Date(item.lastModified),
          views: 0, // This would come from analytics
          rating: 0 // This would come from ratings
        }));
        setContent(convertedContent);
      }

      // Load participants (this would come from group management or training sessions)
      // For now, we'll simulate this data
      const mockParticipants: Participant[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          progress: 85,
          lastActivity: new Date('2024-04-10'),
          status: 'active'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          progress: 92,
          lastActivity: new Date('2024-04-11'),
          status: 'active'
        },
        {
          id: '3',
          name: 'Mike Davis',
          email: 'mike.davis@example.com',
          progress: 67,
          lastActivity: new Date('2024-04-09'),
          status: 'active'
        }
      ];
      setParticipants(mockParticipants);

    } catch (error) {
      handleApiError(error, 'Loading trainer data');
    } finally {
      setLoading(false);
    }
  };

  // Create new training session
  const createSession = async (sessionData: Partial<TrainingSession>) => {
    try {
      const response = await apiServices.createTrainingSession(sessionData);
      
      if (handleApiResponse(response)) {
        toast.success('Training session created successfully');
        loadTrainerData(); // Reload data
      }
    } catch (error) {
      handleApiError(error, 'Creating training session');
    }
  };

  // Update training session
  const updateSession = async (sessionId: string, updates: Partial<TrainingSession>) => {
    try {
      const response = await apiServices.updateTrainingSession(sessionId, updates);
      
      if (handleApiResponse(response)) {
        toast.success('Training session updated successfully');
        loadTrainerData(); // Reload data
      }
    } catch (error) {
      handleApiError(error, 'Updating training session');
    }
  };

  // Delete training session
  const deleteSession = async (sessionId: string) => {
    if (!window.confirm('Are you sure you want to delete this training session?')) {
      return;
    }

    try {
      const response = await apiServices.deleteTrainingSession(sessionId);
      
      if (handleApiResponse(response)) {
        toast.success('Training session deleted successfully');
        loadTrainerData(); // Reload data
      }
    } catch (error) {
      handleApiError(error, 'Deleting training session');
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadTrainerData();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'in-progress': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'completed': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Play className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'presentation': return <BarChart3 className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'quiz': return <CheckSquare className="w-4 h-4" />;
      case 'interactive': return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading trainer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Trainer Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {stats.totalSessions} Sessions
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {stats.totalParticipants} Participants
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {stats.averageRating.toFixed(1)} ⭐ Rating
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadTrainerData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Sessions
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats.totalSessions}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Participants
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats.totalParticipants}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Average Rating
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats.averageRating.toFixed(1)} ⭐
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Completion Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats.completionRate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'sessions', label: 'Sessions', icon: Calendar },
                { id: 'content', label: 'Content', icon: BookOpen },
                { id: 'participants', label: 'Participants', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{session.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{session.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1">{session.status}</span>
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Training Sessions</h3>
                <button
                  onClick={() => {/* Open create session modal */}}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Session
                </button>
              </div>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{session.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{session.description}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {session.duration} min
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {session.participants?.length || 0}/{session.maxParticipants || 0}
                          </span>
                          <span className="flex items-center">
                            <Target className="w-3 h-3 mr-1" />
                            {session.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1">{session.status}</span>
                      </span>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Training Content</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.map((item) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      {getContentIcon(item.type)}
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h4>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{item.views} views</span>
                      <span>{item.rating} ⭐</span>
                      <span>{new Date(item.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Participants</h3>
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{participant.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{participant.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{participant.progress}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Progress</div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        participant.status === 'active' 
                          ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900'
                          : 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900'
                      }`}>
                        {participant.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Session Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Completion Rate</span>
                      <span className="font-medium">{stats.completionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Average Rating</span>
                      <span className="font-medium">{stats.averageRating.toFixed(1)} ⭐</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Active Participants</span>
                      <span className="font-medium">{stats.activeParticipants}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Upcoming Sessions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Scheduled</span>
                      <span className="font-medium">{stats.upcomingSessions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Total Content</span>
                      <span className="font-medium">{stats.totalContent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Completed</span>
                      <span className="font-medium">{stats.completedSessions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard; 