import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Plus,
  Upload,
  Link,
  FileText,
  Video,
  Image,
  Tag,
  Users,
  Clock,
  Target,
  Award,
  BookOpen,
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
  HelpCircle,
  Eye,
  EyeOff,
  Calendar,
  Globe,
  Lock,
  Unlock,
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
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Share2,
  Copy,
  Archive,
  Archive as Unarchive,
  Play,
  Pause,
  BarChart3,
  PieChart,
  TrendingUp,
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
  HelpCircle as HelpCircleIcon,
  Info as InfoIcon,
  AlertTriangle,
  CheckSquare,
  Square,
  Circle,
  Minus,
  Divide,
  Percent,
  Hash as HashIcon,
  AtSign,
  DollarSign,
  Euro,
  DollarSign as PoundIcon,
  DollarSign as YenIcon,
  Bitcoin,
  CreditCard,
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
  GlassWater as Soda
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TrainingProgram, ProgramType, DifficultyLevel, ProgramStatus } from '../../types/training';
import TrainingProgramService from '../../services/TrainingProgramService';

interface CreateProgramModalProps {
  tenantId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (program: TrainingProgram) => void;
}

interface ProgramFormData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  type: ProgramType;
  difficulty: DifficultyLevel;
  instructor: string;
  duration: number;
  maxEnrollments: number;
  price: number;
  currency: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  targetAudience: string[];
  thumbnail: File | null;
  banner: File | null;
  settings: {
    allowEnrollment: boolean;
    requireApproval: boolean;
    allowGuestAccess: boolean;
    enableDiscussion: boolean;
    enableNotes: boolean;
    enableBookmarks: boolean;
    enableProgressTracking: boolean;
    enableCertificates: boolean;
    enableBadges: boolean;
    maxAttempts: number;
    passingScore: number;
    timeLimit: number;
    retakePolicy: string;
  };
  metadata: {
    language: string;
    version: string;
    seoKeywords: string[];
    seoDescription: string;
  };
}

const CreateProgramModal: React.FC<CreateProgramModalProps> = ({
  tenantId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    type: 'course',
    difficulty: 'beginner',
    instructor: '',
    duration: 60,
    maxEnrollments: 100,
    price: 0,
    currency: 'USD',
    tags: [],
    prerequisites: [],
    learningObjectives: [],
    targetAudience: [],
    thumbnail: null,
    banner: null,
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
      retakePolicy: 'unlimited',
    },
    metadata: {
      language: 'en',
      version: '1.0.0',
      seoKeywords: [],
      seoDescription: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [categories, setCategories] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'seo', label: 'SEO & Metadata', icon: Globe },
  ];

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadInstructors();
    }
  }, [isOpen, tenantId]);

  const loadCategories = async () => {
    try {
      const response = await TrainingProgramService.getCategories(tenantId);
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadInstructors = async () => {
    try {
      const response = await TrainingProgramService.getInstructors(tenantId);
      setInstructors(response);
    } catch (error) {
      console.error('Error loading instructors:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof ProgramFormData] as Record<string, any>),
        [field]: value,
      },
    }));
    
    const errorKey = `${parent}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()],
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (prerequisite: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prerequisite),
    }));
  };

  const addLearningObjective = () => {
    if (newObjective.trim() && !formData.learningObjectives.includes(newObjective.trim())) {
      setFormData(prev => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, newObjective.trim()],
      }));
      setNewObjective('');
    }
  };

  const removeLearningObjective = (objective: string) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter(o => o !== objective),
    }));
  };

  const addTargetAudience = () => {
    if (newAudience.trim() && !formData.targetAudience.includes(newAudience.trim())) {
      setFormData(prev => ({
        ...prev,
        targetAudience: [...prev.targetAudience, newAudience.trim()],
      }));
      setNewAudience('');
    }
  };

  const removeTargetAudience = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter(a => a !== audience),
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.metadata.seoKeywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          seoKeywords: [...prev.metadata.seoKeywords, newKeyword.trim()],
        },
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        seoKeywords: prev.metadata.seoKeywords.filter(k => k !== keyword),
      },
    }));
  };

  const handleFileUpload = (field: 'thumbnail' | 'banner', file: File) => {
    setFormData(prev => ({
      ...prev,
      [field]: file,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor is required';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    if (formData.maxEnrollments <= 0) {
      newErrors.maxEnrollments = 'Max enrollments must be greater than 0';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (formData.settings.passingScore < 0 || formData.settings.passingScore > 100) {
      newErrors['settings.passingScore'] = 'Passing score must be between 0 and 100';
    }

    if (formData.settings.maxAttempts <= 0) {
      newErrors['settings.maxAttempts'] = 'Max attempts must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const programData: Partial<TrainingProgram> = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        type: formData.type,
        difficulty: formData.difficulty,
        instructor: formData.instructor,
        duration: formData.duration,
        maxEnrollments: formData.maxEnrollments,
        price: formData.price,
        currency: formData.currency,
        tags: formData.tags,
        prerequisites: formData.prerequisites,
        learningObjectives: formData.learningObjectives,
        targetAudience: formData.targetAudience,
        settings: formData.settings,
        metadata: {
          ...formData.metadata,
          lastUpdated: new Date().toISOString(),
          createdBy: 'current-user', // This should come from auth context
        },
        status: 'draft' as ProgramStatus,
      };

      const response = await TrainingProgramService.createProgram(tenantId, programData);
      onSuccess(response);
      onClose();
      toast.success('Training program created successfully!');
    } catch (error) {
      console.error('Error creating program:', error);
      toast.error('Failed to create training program');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Program Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter program title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Short Description
        </label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Brief description (optional)"
          maxLength={200}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Detailed description of the program"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Program Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value as ProgramType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="course">Course</option>
            <option value="workshop">Workshop</option>
            <option value="certification">Certification</option>
            <option value="webinar">Webinar</option>
            <option value="mentorship">Mentorship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value as DifficultyLevel)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructor *
          </label>
          <select
            value={formData.instructor}
            onChange={(e) => handleInputChange('instructor', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.instructor ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select instructor</option>
            {instructors.map(instructor => (
              <option key={instructor} value={instructor}>{instructor}</option>
            ))}
          </select>
          {errors.instructor && <p className="text-red-500 text-sm mt-1">{errors.instructor}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes) *
          </label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.duration ? 'border-red-500' : 'border-gray-300'
            }`}
            min="1"
          />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Enrollments *
          </label>
          <input
            type="number"
            value={formData.maxEnrollments}
            onChange={(e) => handleInputChange('maxEnrollments', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.maxEnrollments ? 'border-red-500' : 'border-gray-300'
            }`}
            min="1"
          />
          {errors.maxEnrollments && <p className="text-red-500 text-sm mt-1">{errors.maxEnrollments}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <div className="flex">
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
              className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              step="0.01"
            />
          </div>
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-primary-600 hover:text-primary-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prerequisites
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newPrerequisite}
            onChange={(e) => setNewPrerequisite(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add a prerequisite"
          />
          <button
            type="button"
            onClick={addPrerequisite}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add
          </button>
        </div>
        <ul className="space-y-1">
          {formData.prerequisites.map(prerequisite => (
            <li key={prerequisite} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{prerequisite}</span>
              <button
                type="button"
                onClick={() => removePrerequisite(prerequisite)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Learning Objectives
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearningObjective())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add a learning objective"
          />
          <button
            type="button"
            onClick={addLearningObjective}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add
          </button>
        </div>
        <ul className="space-y-1">
          {formData.learningObjectives.map(objective => (
            <li key={objective} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{objective}</span>
              <button
                type="button"
                onClick={() => removeLearningObjective(objective)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Audience
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newAudience}
            onChange={(e) => setNewAudience(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetAudience())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add target audience"
          />
          <button
            type="button"
            onClick={addTargetAudience}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add
          </button>
        </div>
        <ul className="space-y-1">
          {formData.targetAudience.map(audience => (
            <li key={audience} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{audience}</span>
              <button
                type="button"
                onClick={() => removeTargetAudience(audience)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Enrollment Settings</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Allow Enrollment</span>
            <input
              type="checkbox"
              checked={formData.settings.allowEnrollment}
              onChange={(e) => handleNestedChange('settings', 'allowEnrollment', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Require Approval</span>
            <input
              type="checkbox"
              checked={formData.settings.requireApproval}
              onChange={(e) => handleNestedChange('settings', 'requireApproval', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Allow Guest Access</span>
            <input
              type="checkbox"
              checked={formData.settings.allowGuestAccess}
              onChange={(e) => handleNestedChange('settings', 'allowGuestAccess', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Feature Settings</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Enable Discussion</span>
            <input
              type="checkbox"
              checked={formData.settings.enableDiscussion}
              onChange={(e) => handleNestedChange('settings', 'enableDiscussion', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Enable Notes</span>
            <input
              type="checkbox"
              checked={formData.settings.enableNotes}
              onChange={(e) => handleNestedChange('settings', 'enableNotes', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Enable Bookmarks</span>
            <input
              type="checkbox"
              checked={formData.settings.enableBookmarks}
              onChange={(e) => handleNestedChange('settings', 'enableBookmarks', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Enable Progress Tracking</span>
            <input
              type="checkbox"
              checked={formData.settings.enableProgressTracking}
              onChange={(e) => handleNestedChange('settings', 'enableProgressTracking', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Enable Certificates</span>
            <input
              type="checkbox"
              checked={formData.settings.enableCertificates}
              onChange={(e) => handleNestedChange('settings', 'enableCertificates', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Enable Badges</span>
            <input
              type="checkbox"
              checked={formData.settings.enableBadges}
              onChange={(e) => handleNestedChange('settings', 'enableBadges', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Attempts
          </label>
          <input
            type="number"
            value={formData.settings.maxAttempts}
            onChange={(e) => handleNestedChange('settings', 'maxAttempts', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors['settings.maxAttempts'] ? 'border-red-500' : 'border-gray-300'
            }`}
            min="1"
          />
          {errors['settings.maxAttempts'] && <p className="text-red-500 text-sm mt-1">{errors['settings.maxAttempts']}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passing Score (%)
          </label>
          <input
            type="number"
            value={formData.settings.passingScore}
            onChange={(e) => handleNestedChange('settings', 'passingScore', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors['settings.passingScore'] ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
            max="100"
          />
          {errors['settings.passingScore'] && <p className="text-red-500 text-sm mt-1">{errors['settings.passingScore']}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Limit (minutes)
          </label>
          <input
            type="number"
            value={formData.settings.timeLimit}
            onChange={(e) => handleNestedChange('settings', 'timeLimit', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="0"
            placeholder="0 = no limit"
          />
        </div>
      </div>
    </div>
  );

  const renderSEO = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={formData.metadata.language}
            onChange={(e) => handleNestedChange('metadata', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Version
          </label>
          <input
            type="text"
            value={formData.metadata.version}
            onChange={(e) => handleNestedChange('metadata', 'version', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="1.0.0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SEO Description
        </label>
        <textarea
          value={formData.metadata.seoDescription}
          onChange={(e) => handleNestedChange('metadata', 'seoDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="SEO-friendly description for search engines"
          maxLength={160}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SEO Keywords
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add a keyword"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.metadata.seoKeywords.map(keyword => (
            <span
              key={keyword}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="ml-2 text-gray-600 hover:text-gray-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'content':
        return renderContent();
      case 'settings':
        return renderSettings();
      case 'seo':
        return renderSEO();
      default:
        return renderBasicInfo();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create Training Program</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {renderTabContent()}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgramModal; 