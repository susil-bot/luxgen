import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Play, 
  Pause, 
  Award, 
  Target, 
  Calendar,
  FileText,
  Video,
  Download,
  Star,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  RefreshCw,
  Bookmark,
  Share2,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Users,
  Timer,
  GraduationCap,
  Trophy,
  Zap,
  Flame,
  Brain,
  Lightbulb,
  Rocket,
  Shield,
  Heart,
  ThumbsUp,
  MessageCircle,
  Share,
  BookmarkPlus,
  CalendarDays,
  Clock4,
  Target as TargetIcon,
  TrendingDown,
  AlertCircle,
  Info,
  ExternalLink,
  X,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiServices } from '../../core/api/ApiService';
import { toast } from 'react-hot-toast';

// Types for My Training
interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  modules: TrainingModule[];
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  thumbnail?: string;
  rating: number;
  enrolledAt: string;
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  lastAccessed?: string;
  estimatedCompletion?: string;
  certificate?: string;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'interactive';
  duration: number; // in minutes
  content: string;
  isRequired: boolean;
  order: number;
  isCompleted: boolean;
  materials: TrainingMaterial[];
  quiz?: Quiz;
}

interface TrainingMaterial {
  id: string;
  title: string;
  type: 'video' | 'document' | 'presentation' | 'link' | 'file';
  url: string;
  size?: number;
  duration?: number;
  description: string;
  isDownloaded?: boolean;
}

interface Quiz {
  id: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  attempts: number;
  maxAttempts: number;
  bestScore?: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  programId: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit?: number;
  isActive: boolean;
  attempts: AssessmentAttempt[];
  nextAttemptDate?: string;
}

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

interface AssessmentAttempt {
  id: string;
  score: number;
  passed: boolean;
  submittedAt: string;
  answers: Answer[];
  timeSpent: number;
}

interface Answer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  programs: string[];
  estimatedDuration: number;
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isRecommended: boolean;
}

interface TrainingStats {
  totalPrograms: number;
  completedPrograms: number;
  inProgressPrograms: number;
  totalHoursLearned: number;
  averageScore: number;
  certificatesEarned: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: WeeklyProgress[];
  skillProgress: SkillProgress[];
}

interface WeeklyProgress {
  week: string;
  hoursLearned: number;
  programsCompleted: number;
  assessmentsPassed: number;
}

interface SkillProgress {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress: number;
  programsCompleted: number;
}

const MyTrainingInterface: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'assessments' | 'materials' | 'certificates' | 'analytics'>('overview');
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'name' | 'duration'>('recent');
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Load training data
  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      
      // Load enrolled programs
      const programsResponse = await apiServices.getTrainingCourses();
      if (programsResponse.success) {
        // Transform TrainingCourse to TrainingProgram format
        const transformedPrograms = (programsResponse.data || []).map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          category: course.category,
          difficulty: 'intermediate' as const, // Default difficulty
          duration: course.totalDuration || 0,
          modules: course.modules || [],
          instructor: course.instructor,
          thumbnail: course.thumbnail,
          rating: course.rating || 0,
          enrolledAt: course.createdAt || new Date().toISOString(),
          progress: 0, // Will be calculated from participant progress
          status: 'not_started' as const,
          lastAccessed: course.updatedAt,
          estimatedCompletion: undefined,
          certificate: undefined
        }));
        setPrograms(transformedPrograms);
      }

      // Load assessments
      const assessmentsResponse = await apiServices.getAssessments();
      if (assessmentsResponse.success) {
        setAssessments(assessmentsResponse.data || []);
      }

      // Load training stats
      const statsResponse = await apiServices.getParticipantStats(user?.id || '');
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Load learning paths
      const pathsResponse = await apiServices.getLearningPaths();
      if (pathsResponse.success) {
        setLearningPaths(pathsResponse.data || []);
      }

    } catch (error) {
      console.error('Error loading training data:', error);
      toast.error('Failed to load training data');
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || program.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || program.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return b.progress - a.progress;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'duration':
        return a.duration - b.duration;
      case 'recent':
      default:
        return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
    }
  });

  const handleStartModule = async (programId: string, moduleId: string) => {
    try {
      // Update progress
      const response = await apiServices.startModule(programId, moduleId);
      if (response.success) {
        toast.success('Module started successfully');
        loadTrainingData(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to start module');
    }
  };

  const handleCompleteModule = async (programId: string, moduleId: string) => {
    try {
      const response = await apiServices.completeModule(programId, moduleId, user?.id || '');
      if (response.success) {
        toast.success('Module completed successfully');
        loadTrainingData(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to complete module');
    }
  };

  const handleTakeAssessment = async (assessmentId: string) => {
    try {
      const response = await apiServices.startAssessment(assessmentId);
      if (response.success) {
        // Navigate to assessment interface
        window.open(`/app/assessment/${assessmentId}`, '_blank');
      }
    } catch (error) {
      toast.error('Failed to start assessment');
    }
  };

  const handleDownloadCertificate = async (programId: string) => {
    try {
      const response = await apiServices.downloadCertificate(programId);
      if (response.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = `certificate-${programId}.pdf`;
        link.click();
        toast.success('Certificate downloaded successfully');
      }
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      case 'in_progress':
        return <Play className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your training data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Training</h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>•</span>
                <span>{user?.firstName} {user?.lastName}</span>
                <span>•</span>
                <span>{programs.length} Programs</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={loadTrainingData}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button className="bg-primary-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base">
                <Plus className="w-4 h-4 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Browse Programs</span>
                <span className="sm:hidden">Browse</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Programs</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Hours Learned</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalHoursLearned}</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Certificates</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.certificatesEarned}</p>
                </div>
                <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                  <Award className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.currentStreak} days</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                  <Flame className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            {/* Mobile Tab Selector */}
            <div className="md:hidden p-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'programs', label: 'My Programs' },
                  { id: 'assessments', label: 'Assessments' },
                  { id: 'materials', label: 'Materials' },
                  { id: 'certificates', label: 'Certificates' },
                  { id: 'analytics', label: 'Analytics' }
                ].map((tab) => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
            </div>

            {/* Desktop Tab Navigation */}
            <nav className="hidden md:flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'programs', label: 'My Programs', icon: BookOpen },
                { id: 'assessments', label: 'Assessments', icon: Target },
                { id: 'materials', label: 'Materials', icon: FileText },
                { id: 'certificates', label: 'Certificates', icon: Award },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {programs.slice(0, 3).map((program) => (
                        <div key={program.id} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(program.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {program.title}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {program.progress}% complete
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-xs text-gray-400">
                              {new Date(program.lastAccessed || program.enrolledAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Paths */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recommended Paths</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {learningPaths.slice(0, 3).map((path) => (
                        <div key={path.id} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {path.title}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {path.estimatedDuration} hours • {path.difficulty}
                            </p>
                          </div>
                          <button className="text-primary-600 hover:text-primary-700">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Chart */}
                {stats && (
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {stats.weeklyProgress.slice(-7).map((week, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xs text-gray-500 mb-1">
                            {new Date(week.week).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="h-16 sm:h-20 bg-white rounded border border-gray-200 flex flex-col justify-end p-1">
                            <div 
                              className="bg-primary-600 rounded-sm"
                              style={{ height: `${(week.hoursLearned / 10) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {week.hoursLearned}h
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search programs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="all">All Status</option>
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="paused">Paused</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="recent">Recent</option>
                      <option value="progress">Progress</option>
                      <option value="name">Name</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>
                </div>

                {/* Programs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {sortedPrograms.map((program) => (
                    <div key={program.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {program.thumbnail && (
                        <div className="h-32 sm:h-48 bg-gray-200 relative">
                          <img
                            src={program.thumbnail}
                            alt={program.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(program.difficulty)}`}>
                              {program.difficulty}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                            {program.title}
                          </h3>
                          <button className="text-gray-400 hover:text-gray-600 ml-2">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">
                          {program.description}
                        </p>
                        
                        <div className="flex items-center space-x-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                            <span className="text-gray-600">{program.rating}</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600">{program.duration}h</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600 truncate">{program.category}</span>
                        </div>
                        
                        <div className="mb-3 sm:mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">Progress</span>
                            <span className={`text-xs sm:text-sm font-medium ${getProgressColor(program.progress)}`}>
                              {program.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${program.progress >= 80 ? 'bg-green-600' : program.progress >= 60 ? 'bg-yellow-600' : program.progress >= 40 ? 'bg-orange-600' : 'bg-red-600'}`}
                              style={{ width: `${program.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(program.status)}
                            <span className="text-xs sm:text-sm text-gray-600 capitalize">
                              {program.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedProgram(program)}
                              className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
                            >
                              Continue
                            </button>
                            {program.certificate && (
                              <button
                                onClick={() => handleDownloadCertificate(program.id)}
                                className="text-gray-600 hover:text-gray-700"
                                title="Download Certificate"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assessments Tab */}
            {activeTab === 'assessments' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{assessment.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          assessment.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {assessment.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 sm:mb-4">{assessment.description}</p>
                      
                      <div className="space-y-2 mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                          <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Passing Score: {assessment.passingScore}%</span>
                        </div>
                        {assessment.timeLimit && (
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                            <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Time Limit: {assessment.timeLimit} minutes</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                          <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Attempts: {assessment.attempts.length}/Unlimited</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleTakeAssessment(assessment.id)}
                          disabled={!assessment.isActive}
                          className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          Take Assessment
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {programs.flatMap(program => 
                    program.modules.flatMap(module => 
                      module.materials.map(material => ({
                        ...material,
                        programTitle: program.title,
                        moduleTitle: module.title
                      }))
                    )
                  ).map((material, index) => (
                    <div key={`${material.id}-${index}`} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-3">
                          {material.type === 'video' && <Video className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
                          {material.type === 'document' && <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />}
                          {material.type === 'presentation' && <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />}
                          {material.type === 'link' && <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />}
                          {material.type === 'file' && <Download className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <BookmarkPlus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{material.description}</p>
                      
                      <div className="text-xs text-gray-500 mb-3 sm:mb-4">
                        <p>{material.programTitle} • {material.moduleTitle}</p>
                        {material.duration && <p>Duration: {material.duration} minutes</p>}
                        {material.size && <p>Size: {(material.size / 1024 / 1024).toFixed(1)} MB</p>}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm">
                          {material.type === 'video' ? 'Watch' : material.type === 'link' ? 'Open' : 'Download'}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {programs.filter(p => p.certificate).map((program) => (
                    <div key={program.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-3">
                          <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{program.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Certificate of Completion</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Completed: {new Date(program.certificate!).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Instructor: {program.instructor.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Rating: {program.rating}/5</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleDownloadCertificate(program.id)}
                          className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                        >
                          Download Certificate
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && stats && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Skill Progress */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Skill Progress</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {stats.skillProgress.map((skill, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                            <span className="text-xs sm:text-sm text-gray-600 capitalize">{skill.level}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 bg-primary-600 rounded-full"
                              style={{ width: `${skill.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{skill.progress}%</span>
                            <span>{skill.programsCompleted} programs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Stats */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Learning Statistics</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Average Score</span>
                        <span className="text-base sm:text-lg font-semibold text-gray-900">{stats.averageScore}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Longest Streak</span>
                        <span className="text-base sm:text-lg font-semibold text-gray-900">{stats.longestStreak} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Completion Rate</span>
                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                          {stats.totalPrograms > 0 ? Math.round((stats.completedPrograms / stats.totalPrograms) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Program Details Modal */}
      {selectedProgram && showProgramDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{selectedProgram.title}</h2>
                <button
                  onClick={() => setShowProgramDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Modules</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {selectedProgram.modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">{module.title}</h4>
                          <div className="flex items-center space-x-2">
                            {module.isCompleted ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            )}
                            <span className="text-xs sm:text-sm text-gray-600">{module.duration} min</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">{module.description}</p>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          {!module.isCompleted ? (
                            <button
                              onClick={() => handleStartModule(selectedProgram.id, module.id)}
                              className="bg-primary-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                            >
                              Start Module
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCompleteModule(selectedProgram.id, module.id)}
                              className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              Complete Module
                            </button>
                          )}
                          
                          {module.quiz && (
                            <button className="bg-yellow-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                              Take Quiz
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Program Info</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Progress</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">{selectedProgram.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 bg-primary-600 rounded-full"
                            style={{ width: `${selectedProgram.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Instructor</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {selectedProgram.instructor.avatar && (
                          <img
                            src={selectedProgram.instructor.avatar}
                            alt={selectedProgram.instructor.name}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedProgram.instructor.name}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{selectedProgram.instructor.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Details</p>
                      <div className="mt-2 space-y-1 text-xs sm:text-sm text-gray-600">
                        <p>Duration: {selectedProgram.duration} hours</p>
                        <p>Category: {selectedProgram.category}</p>
                        <p>Difficulty: {selectedProgram.difficulty}</p>
                        <p>Enrolled: {new Date(selectedProgram.enrolledAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrainingInterface; 