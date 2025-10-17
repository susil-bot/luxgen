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
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Move,
  Grid,
  List,
  Columns,
  Rows,
  Layout,
  Sidebar,
  Menu,
  SortAsc,
  SortDesc,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Users as UsersIcon,
  UserCog,
  UserSearch,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiServices } from '../../core/api/ApiService';
import { TrainingProgram } from '../../types/training';
import { toast } from 'react-hot-toast';

interface ProgramFilters {
  status: 'all' | 'draft' | 'active' | 'archived' | 'completed' | 'suspended';
  category: 'all' | string;
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  duration: 'all' | 'short' | 'medium' | 'long';
  instructor: 'all' | string;
}

interface ProgramStats {
  totalPrograms: number;
  enrolledPrograms: number;
  completedPrograms: number;
  inProgressPrograms: number;
  averageProgress: number;
  totalHours: number;
  certificatesEarned: number;
}

const MyTrainingPrograms: React.FC = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<TrainingProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProgramFilters>({
    status: 'all',
    category: 'all',
    difficulty: 'all',
    duration: 'all',
    instructor: 'all',
  });
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'duration' | 'enrolledAt' | 'lastAccessed'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<ProgramStats>({
    totalPrograms: 0,
    enrolledPrograms: 0,
    completedPrograms: 0,
    inProgressPrograms: 0,
    averageProgress: 0,
    totalHours: 0,
    certificatesEarned: 0,
  });

  // Load programs on component mount
  useEffect(() => {
    loadPrograms();
    loadStats();
  }, []);

  // Filter and sort programs
  useEffect(() => {
    let filtered = programs.filter(program => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!program.title.toLowerCase().includes(searchLower) &&
            !program.description.toLowerCase().includes(searchLower) &&
            !program.category.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && program.status !== filters.status) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && program.category !== filters.category) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulty !== 'all' && program.difficulty !== filters.difficulty) {
        return false;
      }

      // Duration filter
      if (filters.duration !== 'all') {
        const duration = program.duration || 0;
        if (filters.duration === 'short' && duration > 60) return false;
        if (filters.duration === 'medium' && (duration <= 60 || duration > 180)) return false;
        if (filters.duration === 'long' && duration <= 180) return false;
      }

      // Instructor filter
      if (filters.instructor !== 'all' && program.instructor !== filters.instructor) {
        return false;
      }

      return true;
    });

    // Sort programs
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'progress':
          aValue = a.progress || 0;
          bValue = b.progress || 0;
          break;
        case 'duration':
          aValue = a.duration || 0;
          bValue = b.duration || 0;
          break;
        case 'enrolledAt':
          aValue = new Date(a.enrolledAt || '').getTime();
          bValue = new Date(b.enrolledAt || '').getTime();
          break;
        case 'lastAccessed':
          aValue = new Date(a.lastAccessed || '').getTime();
          bValue = new Date(b.lastAccessed || '').getTime();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPrograms(filtered);
  }, [programs, searchTerm, filters, sortBy, sortOrder]);

  const loadPrograms = async () => {
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
          shortDescription: course.shortDescription,
          category: course.category,
          type: 'course' as const,
          difficulty: 'intermediate' as const, // Default difficulty
          status: 'active' as const,
          instructor: course.instructor,
          duration: course.totalDuration || 0,
          maxEnrollments: course.maxEnrollments,
          currentEnrollments: course.currentEnrollments,
          price: course.price,
          currency: course.currency,
          thumbnail: course.thumbnail,
          banner: course.banner,
          tags: course.tags || [],
          prerequisites: course.prerequisites || [],
          learningObjectives: course.learningObjectives || [],
          targetAudience: course.targetAudience || [],
          materials: course.materials || [],
          modules: course.modules || [],
          assessments: course.assessments || [],
          certificates: course.certificates || [],
          metadata: {
            language: 'en',
            version: '1.0.0',
            lastUpdated: course.updatedAt || new Date().toISOString(),
            createdBy: course.createdBy || 'system',
            approvedBy: course.approvedBy,
            approvalDate: course.approvalDate,
            seoKeywords: course.seoKeywords || [],
            seoDescription: course.seoDescription
          },
          settings: {
            allowEnrollment: true,
            requireApproval: false,
            allowGuestAccess: false,
            enableDiscussion: true,
            enableNotes: true,
            enableBookmarks: true,
            enableProgressTracking: true,
            enableCertificates: true,
            enableBadges: true,
            maxAttempts: 3,
            passingScore: 70,
            timeLimit: 0,
            retakePolicy: 'unlimited'
          },
          // User-specific properties
          progress: 0, // Will be calculated from participant progress
          enrolledAt: course.createdAt || new Date().toISOString(),
          lastAccessed: course.updatedAt,
          estimatedCompletion: undefined,
          certificate: undefined,
          rating: course.rating || 0,
          analytics: {
            views: course.views || 0,
            enrollments: course.enrollments || 0,
            completions: course.completions || 0,
            averageRating: course.averageRating || 0,
            totalRatings: course.totalRatings || 0,
            averageCompletionTime: course.averageCompletionTime || 0,
            completionRate: course.completionRate || 0
          },
          createdAt: course.createdAt || new Date().toISOString(),
          updatedAt: course.updatedAt || new Date().toISOString()
        }));
        setPrograms(transformedPrograms);
      }
    } catch (error) {
      console.error('Error loading programs:', error);
      toast.error('Failed to load training programs');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsResponse = await apiServices.getParticipantStats(user?.id || '');
      if (statsResponse.success) {
        const data = statsResponse.data;
        setStats({
          totalPrograms: data?.totalPrograms || 0,
          enrolledPrograms: data?.enrolledPrograms || 0,
          completedPrograms: data?.completedPrograms || 0,
          inProgressPrograms: data?.inProgressPrograms || 0,
          averageProgress: data?.averageProgress || 0,
          totalHours: data?.totalHours || 0,
          certificatesEarned: data?.certificatesEarned || 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleEnrollProgram = async (programId: string) => {
    try {
      const response = await apiServices.enrollInTraining(programId);
      if (response.success) {
        toast.success('Successfully enrolled in program!');
        loadPrograms();
        loadStats();
      } else {
        toast.error('Failed to enroll in program');
      }
    } catch (error) {
      console.error('Error enrolling in program:', error);
      toast.error('Failed to enroll in program');
    }
  };

  const handleStartProgram = async (programId: string) => {
    try {
      const response = await apiServices.startTraining(programId);
      if (response.success) {
        toast.success('Program started!');
        loadPrograms();
      } else {
        toast.error('Failed to start program');
      }
    } catch (error) {
      console.error('Error starting program:', error);
      toast.error('Failed to start program');
    }
  };

  const handleBookmarkProgram = async (programId: string) => {
    try {
      const response = await apiServices.bookmarkTraining(programId);
      if (response.success) {
        toast.success('Program bookmarked!');
        loadPrograms();
      } else {
        toast.error('Failed to bookmark program');
      }
    } catch (error) {
      console.error('Error bookmarking program:', error);
      toast.error('Failed to bookmark program');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  const getCategories = () => {
    const categories = Array.from(new Set(programs.map(p => p.category)));
    return categories;
  };

  const getInstructors = () => {
    const instructors = Array.from(new Set(programs.map(p => p.instructor).filter(Boolean)));
    return instructors;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Training Programs</h1>
                <p className="mt-2 text-gray-600">Manage and track your learning progress</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <Filter className="h-5 w-5" />
                </button>
                <button
                  onClick={loadPrograms}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedPrograms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressPrograms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificatesEarned}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="progress">Progress</option>
                <option value="duration">Duration</option>
                <option value="enrolledAt">Enrolled Date</option>
                <option value="lastAccessed">Last Accessed</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-5 w-5" /> : <SortDesc className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="completed">Completed</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {getCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Durations</option>
                    <option value="short">Short (&lt; 1h)</option>
                    <option value="medium">Medium (1-3h)</option>
                    <option value="long">Long (&gt; 3h)</option>
                  </select>
                </div>

                {/* Instructor Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                  <select
                    value={filters.instructor}
                    onChange={(e) => setFilters(prev => ({ ...prev, instructor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Instructors</option>
                    {getInstructors().map(instructor => (
                      <option key={instructor} value={instructor}>{instructor}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Programs Grid/List */}
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No programs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some(f => f !== 'all') 
                ? 'Try adjusting your search or filters.' 
                : 'Get started by enrolling in a training program.'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Program Image */}
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      {program.thumbnail ? (
                        <img
                          src={program.thumbnail}
                          alt={program.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Program Info */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {program.title}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{program.rating}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2">
                        {program.description}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(program.duration || 0)}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {program.instructor}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                          {program.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(program.difficulty)}`}>
                          {program.difficulty}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {program.progress && program.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-gray-900 font-medium">{program.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${program.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center space-x-2">
                          {program.status === 'draft' ? (
                            <button
                              onClick={() => handleEnrollProgram(program.id)}
                              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              Enroll
                            </button>
                          ) : program.status === 'active' ? (
                            <button
                              onClick={() => handleStartProgram(program.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Start
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedProgram(program)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              View
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleBookmarkProgram(program.id)}
                            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                          >
                            <Bookmark className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setSelectedProgram(program)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* List View */
                  <>
                    <div className="flex-shrink-0">
                      {program.thumbnail ? (
                        <img
                          src={program.thumbnail}
                          alt={program.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 ml-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {program.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {program.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDuration(program.duration || 0)}
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {program.instructor}
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-400" />
                              {program.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                            {program.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(program.difficulty)}`}>
                            {program.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar for List View */}
                      {program.progress && program.progress > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-gray-900 font-medium">{program.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${program.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Actions for List View */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          {program.status === 'draft' ? (
                            <button
                              onClick={() => handleEnrollProgram(program.id)}
                              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              Enroll
                            </button>
                          ) : program.status === 'active' ? (
                            <button
                              onClick={() => handleStartProgram(program.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Start
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedProgram(program)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              View
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleBookmarkProgram(program.id)}
                            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                          >
                            <Bookmark className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setSelectedProgram(program)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.title}</h2>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {selectedProgram.thumbnail && (
                    <img
                      src={selectedProgram.thumbnail}
                      alt={selectedProgram.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedProgram.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Objectives</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {selectedProgram.learningObjectives?.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        )) || <li>No objectives specified</li>}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Modules</h3>
                      <div className="space-y-2">
                        {selectedProgram.modules?.map((module, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{module.title}</p>
                                <p className="text-sm text-gray-500">{module.estimatedDuration} minutes</p>
                              </div>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )) || <p className="text-gray-500">No modules available</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{formatDuration(selectedProgram.duration || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedProgram.difficulty)}`}>
                          {selectedProgram.difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Instructor:</span>
                        <span className="font-medium">{selectedProgram.instructor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedProgram.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{selectedProgram.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
                    {selectedProgram.progress && selectedProgram.progress > 0 ? (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{selectedProgram.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${selectedProgram.progress}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          {selectedProgram.progress === 100 ? 'Completed!' : 'In Progress'}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Not started yet</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedProgram.status === 'draft' ? (
                      <button
                        onClick={() => handleEnrollProgram(selectedProgram.id)}
                        className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                      >
                        Enroll in Program
                      </button>
                    ) : selectedProgram.status === 'active' ? (
                      <button
                        onClick={() => handleStartProgram(selectedProgram.id)}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Start Program
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedProgram(null)}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        View Program
                      </button>
                    )}

                    <button
                      onClick={() => handleBookmarkProgram(selectedProgram.id)}
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      <Bookmark className="h-5 w-5 inline mr-2" />
                      Bookmark
                    </button>

                    <button
                      onClick={() => setSelectedProgram(null)}
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Close
                    </button>
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

export default MyTrainingPrograms;
