import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Clock,
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Upload,
  Share2,
  Copy,
  Archive,
  Archive as Unarchive,
  Play,
  Pause,
  Settings,
  BarChart3,
  PieChart,
  TrendingUp,
  Users as UsersIcon,
  FileText,
  Video,
  Image,
  Link,
  Tag,
  Hash,
  Star,
  Heart,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreVertical,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
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
  X,
  Save,
  RefreshCw,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Printer,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building,
  CreditCard,
  DollarSign,
  Activity,
  TrendingDown,
  Target as TargetIcon,
  Award as AwardIcon,
  Trophy,
  Medal,
  Badge,
  Award as Certificate,
  Crown,
  Diamond,
  Gem,
  Sparkles,
  Zap,
  Shield,
  Lock,
  Unlock,
  Key,
  Database,
  Cloud,
  Server,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Monitor as Desktop,
  Wifi,
  Bluetooth,
  Battery,
  Power,
  Volume2,
  Volume1,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Video as VideoIcon,
  VideoOff,
  Headphones,
  Speaker,
  Music,
  Play as PlayIcon,
  Pause as PauseIcon,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Shuffle,
  Repeat,
  Volume,
  Settings as SettingsIcon,
  HelpCircle,
  Info,
  AlertTriangle,
  CheckSquare,
  Square,
  Circle,
  Minus,
  Divide,
  Percent,
  Hash as HashIcon,
  AtSign,
  DollarSign as DollarSignIcon,
  Euro,
  DollarSign as Pound,
  DollarSign as Yen,
  Bitcoin,
  CreditCard as CreditCardIcon,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Package,
  Truck,
  Home,
  Building as Office,
  School,
  Hospital,
  Building as Bank,
  Store,
  Utensils as Restaurant,
  Coffee,
  Pizza,
  Hamburger,
  IceCream,
  Cake,
  Wine,
  Beer,
  GlassWater as Cocktail,
  Coffee as Tea,
  Droplets as Water,
  Milk,
  GlassWater as Juice,
  GlassWater as Soda,
  Coffee as CoffeeIcon,
  Pizza as PizzaIcon,
  Hamburger as HamburgerIcon,
  IceCream as IceCreamIcon,
  Cake as CakeIcon,
  Wine as WineIcon,
  Beer as BeerIcon,
  GlassWater as CocktailIcon,
  Coffee as TeaIcon,
  Droplets as WaterIcon,
  Milk as MilkIcon,
  GlassWater as JuiceIcon,
  GlassWater as SodaIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import TrainingProgramService from '../../services/TrainingProgramService';
import { TrainingProgram, ProgramStatus, ProgramType, DifficultyLevel } from '../../types/training';

interface TrainingProgramManagerProps {
  tenantId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ProgramFilters {
  status: string;
  type: string;
  difficulty: string;
  category: string;
  instructor: string;
}

interface ProgramStats {
  totalPrograms: number;
  activePrograms: number;
  completedPrograms: number;
  draftPrograms: number;
  totalEnrollments: number;
  averageCompletionRate: number;
  totalDuration: number;
  popularCategories: Array<{ name: string; count: number }>;
}

const TrainingProgramManager: React.FC<TrainingProgramManagerProps> = ({
  tenantId,
  isOpen,
  onClose,
}) => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<TrainingProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProgramFilters>({
    status: 'all',
    type: 'all',
    difficulty: 'all',
    category: 'all',
    instructor: 'all',
  });
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [stats, setStats] = useState<ProgramStats>({
    totalPrograms: 0,
    activePrograms: 0,
    completedPrograms: 0,
    draftPrograms: 0,
    totalEnrollments: 0,
    averageCompletionRate: 0,
    totalDuration: 0,
    popularCategories: [],
  });

  // Load programs on component mount
  useEffect(() => {
    if (isOpen) {
      loadPrograms();
      loadStats();
    }
  }, [isOpen, tenantId]);

  // Filter and sort programs
  useEffect(() => {
    let filtered = programs.filter(program => {
      const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === 'all' || program.status === filters.status;
      const matchesType = filters.type === 'all' || program.type === filters.type;
      const matchesDifficulty = filters.difficulty === 'all' || program.difficulty === filters.difficulty;
      const matchesCategory = filters.category === 'all' || program.category === filters.category;
      const matchesInstructor = filters.instructor === 'all' || program.instructor === filters.instructor;
      
      return matchesSearch && matchesStatus && matchesType && matchesDifficulty && matchesCategory && matchesInstructor;
    });

    // Sort programs
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'difficulty':
          aValue = a.difficulty;
          bValue = b.difficulty;
          break;
        case 'enrollments':
          aValue = a.currentEnrollments || 0;
          bValue = b.currentEnrollments || 0;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updated':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default:
          aValue = a.title;
          bValue = b.title;
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
      const response = await TrainingProgramService.getPrograms(tenantId);
      setPrograms(response);
    } catch (error) {
      console.error('Error loading programs:', error);
      toast.error('Failed to load training programs');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await TrainingProgramService.getProgramStats(tenantId);
      setStats(response);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreateProgram = async (programData: Partial<TrainingProgram>) => {
    try {
      const response = await TrainingProgramService.createProgram(tenantId, programData);
      setPrograms(prev => [...prev, response]);
      setShowCreateModal(false);
      toast.success('Training program created successfully!');
      loadStats();
    } catch (error) {
      console.error('Error creating program:', error);
      toast.error('Failed to create training program');
    }
  };

  const handleUpdateProgram = async (programId: string, updates: Partial<TrainingProgram>) => {
    try {
      const response = await TrainingProgramService.updateProgram(tenantId, programId, updates);
      setPrograms(prev => prev.map(p => p.id === programId ? response : p));
      setShowEditModal(false);
      setSelectedProgram(null);
      toast.success('Training program updated successfully!');
      loadStats();
    } catch (error) {
      console.error('Error updating program:', error);
      toast.error('Failed to update training program');
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this training program? This action cannot be undone.')) {
      return;
    }

    try {
      await TrainingProgramService.deleteProgram(tenantId, programId);
      setPrograms(prev => prev.filter(p => p.id !== programId));
      toast.success('Training program deleted successfully!');
      loadStats();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete training program');
    }
  };

  const handleDuplicateProgram = async (programId: string) => {
    try {
      const originalProgram = programs.find(p => p.id === programId);
      if (!originalProgram) return;

      const { id, createdAt, updatedAt, ...duplicateData } = originalProgram;
      const newProgramData = {
        ...duplicateData,
        title: `${originalProgram.title} (Copy)`,
        status: 'draft' as ProgramStatus,
      };

      const response = await TrainingProgramService.createProgram(tenantId, newProgramData);
      setPrograms(prev => [...prev, response]);
      toast.success('Training program duplicated successfully!');
      loadStats();
    } catch (error) {
      console.error('Error duplicating program:', error);
      toast.error('Failed to duplicate training program');
    }
  };

  const handleArchiveProgram = async (programId: string, archive: boolean) => {
    try {
      const response = await TrainingProgramService.updateProgram(tenantId, programId, {
        status: archive ? 'archived' : 'draft'
      });
      setPrograms(prev => prev.map(p => p.id === programId ? response : p));
      toast.success(`Training program ${archive ? 'archived' : 'unarchived'} successfully!`);
      loadStats();
    } catch (error) {
      console.error('Error archiving program:', error);
      toast.error(`Failed to ${archive ? 'archive' : 'unarchive'} training program`);
    }
  };

  const getStatusColor = (status: ProgramStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ProgramStatus) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'suspended': return <Pause className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: ProgramType) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'workshop': return <Users className="w-4 h-4" />;
      case 'certification': return <Award className="w-4 h-4" />;
      case 'webinar': return <Video className="w-4 h-4" />;
      case 'mentorship': return <Target className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Training Program Management</h2>
              <p className="text-sm text-gray-600">Create and manage training programs for your organization</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadPrograms}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Program
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Programs</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Programs</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activePrograms}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Play className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.averageCompletionRate}%</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Target className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search programs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                      <option value="completed">Completed</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="course">Course</option>
                      <option value="workshop">Workshop</option>
                      <option value="certification">Certification</option>
                      <option value="webinar">Webinar</option>
                      <option value="mentorship">Mentorship</option>
                    </select>
                    <select
                      value={filters.difficulty}
                      onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order as 'asc' | 'desc');
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="name-asc">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                      <option value="created-desc">Newest First</option>
                      <option value="created-asc">Oldest First</option>
                      <option value="enrollments-desc">Most Enrollments</option>
                      <option value="duration-asc">Shortest Duration</option>
                      <option value="duration-desc">Longest Duration</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Programs Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading training programs...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program) => (
                    <div key={program.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getTypeIcon(program.type)}
                              <span className="text-sm text-gray-600">{program.type}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{program.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{program.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(program.status)}`}>
                              {program.status}
                            </span>
                            <div className="relative">
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium">{program.category}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Difficulty:</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(program.difficulty)}`}>
                              {program.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{formatDuration(program.duration)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Enrollments:</span>
                            <span className="font-medium">{program.currentEnrollments || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProgram(program);
                              setShowViewModal(true);
                            }}
                            className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProgram(program);
                              setShowEditModal(true);
                            }}
                            className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicateProgram(program.id)}
                            className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredPrograms.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No training programs found matching your criteria.</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Create Your First Program
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals would be implemented here */}
        {/* CreateProgramModal, EditProgramModal, ViewProgramModal */}
      </div>
    </div>
  );
};

export default TrainingProgramManager; 