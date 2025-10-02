/**
 * Training Program Manager - Constants
 * Constants and configuration values for training program management
 */

export const PROGRAM_STATUSES = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  SUSPENDED: 'suspended'
} as const;

export const PROGRAM_TYPES = {
  COURSE: 'course',
  WORKSHOP: 'workshop',
  SEMINAR: 'seminar',
  BOOTCAMP: 'bootcamp'
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const;

export const PROGRAM_CATEGORIES = {
  TECHNOLOGY: 'technology',
  BUSINESS: 'business',
  DESIGN: 'design',
  MARKETING: 'marketing',
  DATA_SCIENCE: 'data-science',
  LEADERSHIP: 'leadership',
  HEALTHCARE: 'healthcare',
  FINANCE: 'finance',
  EDUCATION: 'education',
  OTHER: 'other'
} as const;

export const MATERIAL_TYPES = {
  DOCUMENT: 'document',
  VIDEO: 'video',
  AUDIO: 'audio',
  CODE: 'code',
  LINK: 'link'
} as const;

export const ASSESSMENT_TYPES = {
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  PROJECT: 'project',
  EXAM: 'exam'
} as const;

export const SORT_OPTIONS = {
  TITLE: 'title',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  PRICE: 'price',
  DURATION: 'duration',
  RATING: 'rating',
  ENROLLMENTS: 'enrollments',
  VIEWS: 'views'
} as const;

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export const DEFAULT_FILTERS = {
  status: undefined,
  category: undefined,
  level: undefined,
  type: undefined,
  instructor: undefined,
  search: '',
  tags: [],
  priceRange: undefined,
  durationRange: undefined,
  isActive: undefined,
  isPublic: undefined,
  isFeatured: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
  page: 1,
  limit: 12
};

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
  total: 0,
  pages: 0,
  hasNext: false,
  hasPrev: false
};

export const DEFAULT_SETTINGS = {
  allowEnrollment: true,
  requireApproval: false,
  maxAttempts: 3,
  passingScore: 70,
  allowRetake: true,
  showProgress: true,
  enableNotifications: true
};

export const DEFAULT_ANALYTICS = {
  views: 0,
  enrollments: 0,
  completions: 0,
  rating: 0,
  totalRatings: 0,
  completionRate: 0
};

export const VALIDATION_RULES = {
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 200,
    REQUIRED: true
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
    REQUIRED: true
  },
  SHORT_DESCRIPTION: {
    MAX_LENGTH: 150
  },
  DURATION: {
    MIN: 1,
    MAX: 10080 // 1 week in minutes
  },
  PRICE: {
    MIN: 0,
    MAX: 10000
  },
  MAX_ENROLLMENTS: {
    MIN: 1,
    MAX: 10000
  },
  TAGS: {
    MAX_COUNT: 10,
    MAX_LENGTH: 50
  },
  LEARNING_OBJECTIVES: {
    MAX_COUNT: 20,
    MAX_LENGTH: 200
  },
  PREREQUISITES: {
    MAX_COUNT: 15,
    MAX_LENGTH: 200
  },
  TARGET_AUDIENCE: {
    MAX_COUNT: 10,
    MAX_LENGTH: 100
  }
};

export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  PDF: 'pdf'
} as const;

export const IMPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel'
} as const;

export const BULK_ACTIONS = {
  DELETE: 'delete',
  PUBLISH: 'publish',
  ARCHIVE: 'archive',
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate'
} as const;

export const NOTIFICATION_TYPES = {
  ENROLLMENT: 'enrollment',
  COMPLETION: 'completion',
  DEADLINE: 'deadline',
  UPDATE: 'update'
} as const;

export const ACTIVITY_TYPES = {
  CREATED: 'created',
  UPDATED: 'updated',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  ENROLLED: 'enrolled',
  COMPLETED: 'completed'
} as const;

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
  { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
  { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' }
];

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' }
];

export const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
];

export const STATUS_COLORS = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800'
};

export const LEVEL_COLORS = {
  beginner: 'bg-blue-100 text-blue-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

export const TYPE_COLORS = {
  course: 'bg-purple-100 text-purple-800',
  workshop: 'bg-orange-100 text-orange-800',
  seminar: 'bg-green-100 text-green-800',
  bootcamp: 'bg-pink-100 text-pink-800'
};

export const CATEGORY_COLORS = {
  technology: 'bg-blue-100 text-blue-800',
  business: 'bg-green-100 text-green-800',
  design: 'bg-purple-100 text-purple-800',
  marketing: 'bg-pink-100 text-pink-800',
  'data-science': 'bg-indigo-100 text-indigo-800',
  leadership: 'bg-yellow-100 text-yellow-800',
  healthcare: 'bg-red-100 text-red-800',
  finance: 'bg-gray-100 text-gray-800',
  education: 'bg-teal-100 text-teal-800',
  other: 'bg-gray-100 text-gray-800'
};

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  AUDIO: 20 * 1024 * 1024 // 20MB
};

export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const SUPPORTED_DOCUMENT_FORMATS = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
export const SUPPORTED_VIDEO_FORMATS = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'aac', 'ogg', 'm4a'];

export const API_ENDPOINTS = {
  PROGRAMS: '/api/v1/training/programs',
  PROGRAMS_BY_ID: (id: string) => `/api/v1/training/programs/${id}`,
  PROGRAMS_STATS: '/api/v1/training/programs/stats',
  PROGRAMS_SEARCH: '/api/v1/training/programs/search',
  PROGRAMS_EXPORT: '/api/v1/training/programs/export',
  PROGRAMS_IMPORT: '/api/v1/training/programs/import',
  PROGRAMS_BULK: '/api/v1/training/programs/bulk',
  PROGRAMS_ANALYTICS: (id: string) => `/api/v1/training/programs/${id}/analytics`,
  PROGRAMS_CLONE: (id: string) => `/api/v1/training/programs/${id}/clone`,
  PROGRAMS_DUPLICATE: (id: string) => `/api/v1/training/programs/${id}/duplicate`
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_NUMBER: 'Please enter a valid number',
  INVALID_DATE: 'Please enter a valid date',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_FORMAT: 'File format is not supported',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  DUPLICATE_ENTRY: 'This entry already exists',
  OPERATION_FAILED: 'Operation failed. Please try again.'
};

export const SUCCESS_MESSAGES = {
  CREATED: 'Training program created successfully',
  UPDATED: 'Training program updated successfully',
  DELETED: 'Training program deleted successfully',
  PUBLISHED: 'Training program published successfully',
  ARCHIVED: 'Training program archived successfully',
  ACTIVATED: 'Training program activated successfully',
  DEACTIVATED: 'Training program deactivated successfully',
  EXPORTED: 'Data exported successfully',
  IMPORTED: 'Data imported successfully',
  BULK_ACTION_COMPLETED: 'Bulk action completed successfully'
};

export const LOADING_MESSAGES = {
  LOADING_PROGRAMS: 'Loading training programs...',
  CREATING_PROGRAM: 'Creating training program...',
  UPDATING_PROGRAM: 'Updating training program...',
  DELETING_PROGRAM: 'Deleting training program...',
  EXPORTING_DATA: 'Exporting data...',
  IMPORTING_DATA: 'Importing data...',
  PROCESSING_BULK_ACTION: 'Processing bulk action...'
};

export const EMPTY_STATE_MESSAGES = {
  NO_PROGRAMS: 'No training programs found',
  NO_SEARCH_RESULTS: 'No programs match your search criteria',
  NO_FILTERED_RESULTS: 'No programs match your filter criteria',
  CREATE_FIRST_PROGRAM: 'Create your first training program to get started'
};

export const CONFIRMATION_MESSAGES = {
  DELETE_PROGRAM: 'Are you sure you want to delete this training program? This action cannot be undone.',
  DELETE_MULTIPLE_PROGRAMS: 'Are you sure you want to delete the selected training programs? This action cannot be undone.',
  PUBLISH_PROGRAM: 'Are you sure you want to publish this training program?',
  ARCHIVE_PROGRAM: 'Are you sure you want to archive this training program?',
  ACTIVATE_PROGRAM: 'Are you sure you want to activate this training program?',
  DEACTIVATE_PROGRAM: 'Are you sure you want to deactivate this training program?'
};

export const TOOLTIP_MESSAGES = {
  CREATE_PROGRAM: 'Create a new training program',
  EDIT_PROGRAM: 'Edit this training program',
  DELETE_PROGRAM: 'Delete this training program',
  VIEW_PROGRAM: 'View program details',
  PUBLISH_PROGRAM: 'Publish this training program',
  ARCHIVE_PROGRAM: 'Archive this training program',
  ACTIVATE_PROGRAM: 'Activate this training program',
  DEACTIVATE_PROGRAM: 'Deactivate this training program',
  EXPORT_PROGRAMS: 'Export training programs data',
  IMPORT_PROGRAMS: 'Import training programs data',
  REFRESH_PROGRAMS: 'Refresh the programs list',
  FILTER_PROGRAMS: 'Filter training programs',
  SEARCH_PROGRAMS: 'Search training programs',
  SORT_PROGRAMS: 'Sort training programs'
};

export const ACCESSIBILITY_LABELS = {
  CREATE_BUTTON: 'Create new training program',
  EDIT_BUTTON: 'Edit training program',
  DELETE_BUTTON: 'Delete training program',
  VIEW_BUTTON: 'View program details',
  SEARCH_INPUT: 'Search training programs',
  FILTER_SELECT: 'Filter training programs',
  SORT_SELECT: 'Sort training programs',
  PAGINATION_PREV: 'Go to previous page',
  PAGINATION_NEXT: 'Go to next page',
  EXPORT_BUTTON: 'Export training programs',
  IMPORT_BUTTON: 'Import training programs',
  REFRESH_BUTTON: 'Refresh programs list'
};

export const KEYBOARD_SHORTCUTS = {
  CREATE: 'Ctrl+N',
  SEARCH: 'Ctrl+F',
  REFRESH: 'F5',
  EXPORT: 'Ctrl+E',
  IMPORT: 'Ctrl+I',
  DELETE: 'Delete',
  ESCAPE: 'Escape'
};

export const RESPONSIVE_BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  FILTER: 200,
  SAVE: 1000
};

export const CACHE_DURATIONS = {
  PROGRAMS: 5 * 60 * 1000, // 5 minutes
  STATS: 10 * 60 * 1000, // 10 minutes
  ANALYTICS: 15 * 60 * 1000 // 15 minutes
};

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  DELAY: 1000,
  BACKOFF_FACTOR: 2
};

export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_BULK_ACTIONS: true,
  ENABLE_EXPORT: true,
  ENABLE_IMPORT: true,
  ENABLE_TEMPLATES: true,
  ENABLE_CLONING: true,
  ENABLE_DUPLICATION: true
};
