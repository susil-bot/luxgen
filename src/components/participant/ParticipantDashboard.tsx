import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Star, 
  Calendar, 
  TrendingUp, 
  Play,
  Video,
  FileText,
  CheckSquare,
  Eye,
  Download,
  Edit,
  Plus,
  Search,
  RefreshCw,
  Activity,
  Bookmark,
  MessageSquare,
  BarChart3,
  AlertCircle,
  Target,
  Zap,
  Flame,
  Trophy,
  Lock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiServices } from '../../core/api/ApiService';
import { errorManager } from '../../core/error/ErrorManager';
import { toast } from 'react-hot-toast';

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  lastAccessed: Date;
  nextSession?: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  category: string;
  rating: number;
  duration: number;
}

interface LearningModule {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'interactive';
  duration: number;
  isCompleted: boolean;
  isLocked: boolean;
  description: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  type: 'course' | 'streak' | 'milestone' | 'assessment';
}

interface ParticipantStats {
  totalCourses: number;
  completedCourses: number;
  totalModules: number;
  completedModules: number;
  averageScore: number;
  learningStreak: number;
  totalTimeSpent: number;
  certificates: number;
}

const ParticipantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'content' | 'progress' | 'achievements' | 'calendar'>('overview');
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [currentCourse, setCurrentCourse] = useState<EnrolledCourse | null>(null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [learningContent, setLearningContent] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [stats, setStats] = useState<ParticipantStats | null>(null);

  // Load participant data from API
  const loadParticipantData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Load enrolled courses
      const coursesResponse = await apiServices.getTrainingCourses();
      if (coursesResponse.success) {
        // Convert API courses to enrolled courses format
        const convertedCourses: EnrolledCourse[] = (coursesResponse.data || []).map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
          progress: 0, // This would come from progress tracking
          totalModules: course.modules.length,
          completedModules: 0, // This would come from progress tracking
          lastAccessed: new Date(),
          status: 'not-started' as const,
          category: course.category,
          rating: course.rating,
          duration: course.totalDuration
        }));
        setEnrolledCourses(convertedCourses);
        setCurrentCourse(convertedCourses[0] || null);
      }

      // Load participant stats
      const statsResponse = await apiServices.getParticipantStats(user.id);
      if (statsResponse.success) {
        setStats(statsResponse.data);
      } else {
        setStats({
          totalCourses: 0,
          completedCourses: 0,
          totalModules: 0,
          completedModules: 0,
          averageScore: 0,
          learningStreak: 0,
          totalTimeSpent: 0,
          certificates: 0
        });
      }

      // Load modules for current course (this would come from course details)
      const mockModules: LearningModule[] = [
        {
          id: '1',
          title: 'Introduction to React Hooks',
          type: 'video',
          duration: 45,
          isCompleted: true,
          isLocked: false,
          description: 'Learn the basics of React hooks and their use cases'
        },
        {
          id: '2',
          title: 'useState and useEffect Deep Dive',
          type: 'video',
          duration: 60,
          isCompleted: true,
          isLocked: false,
          description: 'Master the most commonly used React hooks'
        },
        {
          id: '3',
          title: 'Custom Hooks Development',
          type: 'document',
          duration: 30,
          isCompleted: true,
          isLocked: false,
          description: 'Learn to create reusable custom hooks'
        },
        {
          id: '4',
          title: 'Context API and useContext',
          type: 'video',
          duration: 50,
          isCompleted: false,
          isLocked: false,
          description: 'Understand React context for state management'
        },
        {
          id: '5',
          title: 'Hooks Quiz',
          type: 'quiz',
          duration: 20,
          isCompleted: false,
          isLocked: false,
          description: 'Test your knowledge of React hooks'
        }
      ];
      setModules(mockModules);

      // Load achievements (this would come from gamification system)
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Course Completed',
          description: 'Successfully completed your first course',
          icon: '🎓',
          earnedDate: new Date('2024-04-08'),
          type: 'course'
        },
        {
          id: '2',
          title: '7-Day Learning Streak',
          description: 'Maintained a 7-day learning streak',
          icon: '🔥',
          earnedDate: new Date('2024-04-10'),
          type: 'streak'
        },
        {
          id: '3',
          title: 'Perfect Score',
          description: 'Achieved 100% on a course assessment',
          icon: '⭐',
          earnedDate: new Date('2024-04-05'),
          type: 'milestone'
        }
      ];
      setAchievements(mockAchievements);

    } catch (error) {
      errorManager.handleError(error, 'Loading participant data');
    } finally {
      setLoading(false);
    }
  };

  // Complete a module
  const completeModule = async (courseId: string, moduleId: string) => {
    try {
      const response = await apiServices.completeModule(courseId, moduleId, user?.id || '');
      
      if (response.success) {
        toast.success('Module completed successfully!');
        loadParticipantData(); // Reload data
      }
    } catch (error) {
      errorManager.handleError(error, 'Completing module');
    }
  };



  // Load data on component mount
  useEffect(() => {
    loadParticipantData();
  }, [loadParticipantData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'not-started': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'quiz': return CheckSquare;
      case 'assignment': return Target;
      case 'interactive': return Zap;
      default: return FileText;
    }
  };

  const filteredCourses = enrolledCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading participant dashboard...</p>
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
                Learning Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {stats?.totalCourses || 0} Courses
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {stats?.completedCourses || 0} Completed
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {stats?.learningStreak || 0} Day Streak
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadParticipantData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Browse Courses
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
                  <BookOpen className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Courses
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats?.totalCourses || 0}
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
                  <CheckCircle className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Completed Courses
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats?.completedCourses || 0}
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
                      Average Score
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {(stats?.averageScore || 0).toFixed(1)}%
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
                  <Flame className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Learning Streak
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats?.learningStreak || 0} days
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
                { id: 'courses', label: 'My Courses', icon: BookOpen },
                { id: 'content', label: 'Learning Content', icon: FileText },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
                { id: 'calendar', label: 'Calendar', icon: Calendar }
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
              {/* Learning Progress Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">Learning Progress</h3>
                        <p className="text-blue-100">Keep up the great work!</p>
                      </div>
                      <TrendingUp className="h-12 w-12 text-blue-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-blue-100 text-sm">Overall Progress</p>
                        <p className="text-2xl font-bold">{Math.round((stats?.completedModules || 0) / (stats?.totalModules || 1) * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm">Learning Streak</p>
                        <p className="text-2xl font-bold">{stats?.learningStreak || 0} days</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Continue Learning</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                        <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-900 dark:text-green-100">Browse Courses</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                        <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-purple-900 dark:text-purple-100">View Achievements</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Upcoming Sessions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                          <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{course.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Last accessed: {course.lastAccessed.toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{course.progress}%</span>
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-1">
                            <div 
                              className="bg-primary-600 h-1 rounded-full" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Sessions</h3>
                  <div className="space-y-4">
                    {enrolledCourses.filter(c => c.nextSession).slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                          <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{course.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {course.nextSession?.toLocaleDateString()} at {course.nextSession?.toLocaleTimeString()}
                          </p>
                        </div>
                        <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                          Join
                        </button>
                      </div>
                    ))}
                    {enrolledCourses.filter(c => c.nextSession).length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No upcoming sessions</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Learning Content</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedFilters({ type: 'all' })}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSelectedFilters({ type: 'video' })}
                      className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30"
                    >
                      Videos
                    </button>
                    <button
                      onClick={() => setSelectedFilters({ type: 'document' })}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30"
                    >
                      Documents
                    </button>
                    <button
                      onClick={() => setSelectedFilters({ type: 'quiz' })}
                      className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30"
                    >
                      Quizzes
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningContent.length > 0 ? (
                  learningContent.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        {(() => {
                          const IconComponent = getModuleIcon(item.type);
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
                          <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{item.duration} min</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Status:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.isCompleted 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : item.isLocked
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {item.isCompleted ? 'Completed' : item.isLocked ? 'Locked' : 'Available'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Course:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{item.courseTitle}</span>
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
                            <Bookmark className="h-4 w-4" />
                          </button>
                        </div>
                        {!item.isLocked && !item.isCompleted && (
                          <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            Start
                          </button>
                        )}
                        {item.isCompleted && (
                          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Completed</span>
                    </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No content available</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Enroll in courses to access learning content.</p>
                    <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">My Courses</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{course.description}</p>
                    <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Modules</span>
                        <span>{course.completedModules}/{course.totalModules}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Duration</span>
                        <span>{course.duration} min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rating</span>
                        <span className="flex items-center">
                          {course.rating} <Star className="w-3 h-3 ml-1 text-yellow-500" />
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentCourse(course);
                        setActiveTab('progress');
                      }}
                      className="w-full mt-4 px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Continue Learning
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && currentCourse && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{currentCourse.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentCourse.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentCourse.progress}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</div>
                </div>
              </div>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {module.isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : module.isLocked ? (
                          <Lock className="h-6 w-6 text-gray-400" />
                        ) : (
                          (() => {
                            const IconComponent = getModuleIcon(module.type);
                            return <IconComponent className="h-6 w-6 text-gray-400" />;
                          })()
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{module.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {module.duration} min
                          </span>
                          <span className="flex items-center">
                            {(() => {
                              const IconComponent = getModuleIcon(module.type);
                              return <IconComponent className="w-3 h-3 mr-1" />;
                            })()}
                            {module.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {module.isCompleted ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </span>
                      ) : module.isLocked ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </span>
                      ) : (
                        <button
                          onClick={() => completeModule(currentCourse.id, module.id)}
                          className="inline-flex items-center px-3 py-1 border border-primary-300 dark:border-primary-600 shadow-sm text-xs font-medium rounded text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900 hover:bg-primary-100 dark:hover:bg-primary-800"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{achievement.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{achievement.description}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Earned {achievement.earnedDate.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Learning Calendar</h3>
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Calendar view coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard; 