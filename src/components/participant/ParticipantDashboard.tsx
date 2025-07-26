import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Video,
  MessageSquare,
  Star,
  Award,
  Target,
  Activity,
  Eye,
  Play,
  Download,
  Bookmark,
  Heart,
  Share2,
  Search,
  Filter,
  Bell,
  Settings,
  GraduationCap,
  Trophy,
  Clock as ClockIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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
  status: 'in-progress' | 'completed' | 'not-started';
  category: string;
  rating: number;
  duration: number;
  thumbnail?: string;
}

interface LearningModule {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
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
  type: 'course' | 'streak' | 'milestone';
}

const ParticipantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'progress' | 'achievements' | 'calendar'>('overview');
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [currentCourse, setCurrentCourse] = useState<EnrolledCourse | null>(null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock enrolled courses
    const mockCourses: EnrolledCourse[] = [
      {
        id: '1',
        title: 'Advanced React Development',
        description: 'Master React hooks, context, and advanced patterns',
        instructor: 'Dr. Sarah Johnson',
        progress: 75,
        totalModules: 12,
        completedModules: 9,
        lastAccessed: new Date('2024-04-10'),
        nextSession: new Date('2024-04-15T10:00:00'),
        status: 'in-progress',
        category: 'Frontend Development',
        rating: 4.8,
        duration: 480
      },
      {
        id: '2',
        title: 'TypeScript Fundamentals',
        description: 'Learn TypeScript from basics to advanced concepts',
        instructor: 'Prof. Mike Davis',
        progress: 100,
        totalModules: 8,
        completedModules: 8,
        lastAccessed: new Date('2024-04-08'),
        status: 'completed',
        category: 'Programming',
        rating: 4.6,
        duration: 360
      },
      {
        id: '3',
        title: 'State Management with Redux',
        description: 'Build scalable state management solutions',
        instructor: 'Alex Chen',
        progress: 25,
        totalModules: 10,
        completedModules: 2,
        lastAccessed: new Date('2024-04-09'),
        nextSession: new Date('2024-04-18T14:00:00'),
        status: 'in-progress',
        category: 'Frontend Development',
        rating: 4.7,
        duration: 600
      }
    ];

    // Mock learning modules for the first course
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

    // Mock achievements
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

    setEnrolledCourses(mockCourses);
    setCurrentCourse(mockCourses[0]);
    setModules(mockModules);
    setAchievements(mockAchievements);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'not-started': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'quiz': return <CheckCircle className="w-4 h-4" />;
      case 'assignment': return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredCourses = enrolledCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading participant dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Browse Courses
          </button>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {enrolledCourses.filter(c => c.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Learning Hours</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(enrolledCourses.reduce((acc, c) => acc + (c.duration * c.progress / 100), 0) / 60)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-orange-600">{achievements.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'courses', label: 'My Courses', icon: BookOpen },
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Continue Learning */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Continue Learning</h3>
                {currentCourse && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{currentCourse.title}</h4>
                        <p className="text-gray-600 mb-4">{currentCourse.description}</p>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-sm text-gray-500">Instructor: {currentCourse.instructor}</span>
                          <span className="text-sm text-gray-500">{currentCourse.completedModules}/{currentCourse.totalModules} modules</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${currentCourse.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Continue Learning
                          </button>
                          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                            <Bookmark className="w-4 h-4" />
                            Bookmark
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{currentCourse.progress}%</div>
                        <div className="text-sm text-gray-500">Complete</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upcoming Sessions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Sessions</h3>
                <div className="space-y-3">
                  {enrolledCourses.filter(c => c.nextSession).slice(0, 3).map((course) => (
                    <div key={course.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{course.title}</h4>
                          <p className="text-sm text-gray-600">{course.instructor}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {course.nextSession && new Date(course.nextSession).toLocaleDateString()}
                            </span>
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {course.nextSession && new Date(course.nextSession).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(achievement.earnedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">My Courses</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {course.instructor}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {Math.round(course.duration / 60)} hours
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {course.completedModules}/{course.totalModules} modules
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
                        <Play className="w-4 h-4" />
                        Continue
                      </button>
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && currentCourse && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Course Progress: {currentCourse.title}</h3>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{currentCourse.title}</h4>
                      <p className="text-gray-600">{currentCourse.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{currentCourse.progress}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <div key={module.id} className={`p-4 rounded-lg border ${
                        module.isCompleted ? 'bg-green-50 border-green-200' : 
                        module.isLocked ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              module.isCompleted ? 'bg-green-100 text-green-600' :
                              module.isLocked ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {getModuleIcon(module.type)}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{module.title}</h5>
                              <p className="text-sm text-gray-600">{module.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{module.duration} min</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {module.isCompleted && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            {!module.isLocked && !module.isCompleted && (
                              <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1">
                                <Play className="w-3 h-3" />
                                Start
                              </button>
                            )}
                            {module.isLocked && (
                              <span className="text-sm text-gray-500">Locked</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
                <div className="text-sm text-gray-500">
                  {achievements.length} achievements earned
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                    <div className="text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-2">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          achievement.type === 'course' ? 'bg-blue-100 text-blue-600' :
                          achievement.type === 'streak' ? 'bg-red-100 text-red-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {achievement.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(achievement.earnedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Learning Calendar</h3>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - 15 + i);
                    const hasSession = enrolledCourses.some(c => 
                      c.nextSession && 
                      new Date(c.nextSession).toDateString() === date.toDateString()
                    );
                    
                    return (
                      <div
                        key={i}
                        className={`h-12 border border-gray-200 flex items-center justify-center text-sm ${
                          hasSession ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'
                        }`}
                      >
                        {date.getDate()}
                        {hasSession && (
                          <div className="absolute w-2 h-2 bg-blue-600 rounded-full mt-6"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Upcoming Sessions</h4>
                <div className="space-y-2">
                  {enrolledCourses.filter(c => c.nextSession).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-2 bg-white rounded">
                      <div>
                        <p className="font-medium text-gray-900">{course.title}</p>
                        <p className="text-sm text-gray-500">
                          {course.nextSession && new Date(course.nextSession).toLocaleDateString()} at{' '}
                          {course.nextSession && new Date(course.nextSession).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard; 