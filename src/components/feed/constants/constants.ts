/**
 * constants.ts
 * Constants and configuration for ActivityFeed component
 */

export const FEED_CONSTANTS = {
  // API Endpoints
  API_ENDPOINTS: {
    ACTIVITIES: '/api/activities',
    ACTIVITY_STATS: '/api/activities/stats',
    ACTIVITY_ACTIONS: '/api/activities/actions',
    ACTIVITY_ENGAGEMENT: '/api/activities/engagement',
    ACTIVITY_SEARCH: '/api/activities/search'
  },

  // Activity Types
  ACTIVITY_TYPES: {
    USER_JOINED: 'user_joined',
    PROGRAM_CREATED: 'program_created',
    SESSION_COMPLETED: 'session_completed',
    ASSESSMENT_TAKEN: 'assessment_taken',
    TRAINING_STARTED: 'training_started',
    CERTIFICATE_EARNED: 'certificate_earned',
    FEEDBACK_SUBMITTED: 'feedback_submitted',
    POLL_CREATED: 'poll_created',
    ANNOUNCEMENT: 'announcement',
    MILESTONE_REACHED: 'milestone_reached',
    GENERAL: 'general'
  },

  // Filter Options
  FILTER_OPTIONS: [
    { value: 'all', label: 'All Activities' },
    { value: 'user_joined', label: 'User Joined' },
    { value: 'program_created', label: 'Program Created' },
    { value: 'session_completed', label: 'Session Completed' },
    { value: 'assessment_taken', label: 'Assessment Taken' },
    { value: 'training_started', label: 'Training Started' },
    { value: 'certificate_earned', label: 'Certificate Earned' },
    { value: 'feedback_submitted', label: 'Feedback Submitted' },
    { value: 'poll_created', label: 'Poll Created' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'milestone_reached', label: 'Milestones' }
  ],

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    MIN_PAGE_SIZE: 5
  },

  // Refresh Intervals
  REFRESH_INTERVALS: {
    AUTO_REFRESH: 30000, // 30 seconds
    MANUAL_REFRESH: 0,
    REAL_TIME: 5000 // 5 seconds
  },

  // Activity Priorities
  PRIORITIES: {
    LOW: 1,
    NORMAL: 2,
    HIGH: 3,
    URGENT: 4,
    CRITICAL: 5
  },

  // Visibility Levels
  VISIBILITY: {
    PUBLIC: 'public',
    PRIVATE: 'private',
    INTERNAL: 'internal'
  },

  // Activity Status
  STATUS: {
    ACTIVE: 'active',
    ARCHIVED: 'archived',
    DELETED: 'deleted'
  },

  // Actions
  ACTIONS: {
    LIKE: 'like',
    UNLIKE: 'unlike',
    COMMENT: 'comment',
    SHARE: 'share',
    BOOKMARK: 'bookmark',
    UNBOOKMARK: 'unbookmark'
  },

  // Notification Types
  NOTIFICATION_TYPES: {
    NEW_ACTIVITY: 'new_activity',
    ACTIVITY_LIKED: 'activity_liked',
    ACTIVITY_COMMENTED: 'activity_commented',
    ACTIVITY_SHARED: 'activity_shared'
  },

  // Default Settings
  DEFAULT_SETTINGS: {
    autoRefresh: true,
    refreshInterval: 30000,
    itemsPerPage: 20,
    showTimestamps: true,
    showUserAvatars: true,
    enableNotifications: true,
    defaultFilter: 'all',
    sortOrder: 'desc',
    groupByDate: false
  },

  // Color Schemes for Activity Types
  ACTIVITY_COLORS: {
    user_joined: {
      text: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-200'
    },
    program_created: {
      text: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-200'
    },
    session_completed: {
      text: 'text-purple-600',
      bg: 'bg-purple-100',
      border: 'border-purple-200'
    },
    assessment_taken: {
      text: 'text-orange-600',
      bg: 'bg-orange-100',
      border: 'border-orange-200'
    },
    training_started: {
      text: 'text-indigo-600',
      bg: 'bg-indigo-100',
      border: 'border-indigo-200'
    },
    certificate_earned: {
      text: 'text-yellow-600',
      bg: 'bg-yellow-100',
      border: 'border-yellow-200'
    },
    feedback_submitted: {
      text: 'text-pink-600',
      bg: 'bg-pink-100',
      border: 'border-pink-200'
    },
    poll_created: {
      text: 'text-red-600',
      bg: 'bg-red-100',
      border: 'border-red-200'
    },
    announcement: {
      text: 'text-gray-600',
      bg: 'bg-gray-100',
      border: 'border-gray-200'
    },
    milestone_reached: {
      text: 'text-emerald-600',
      bg: 'bg-emerald-100',
      border: 'border-emerald-200'
    },
    general: {
      text: 'text-gray-600',
      bg: 'bg-gray-100',
      border: 'border-gray-200'
    }
  },

  // Icon Mappings
  ACTIVITY_ICONS: {
    user_joined: 'User',
    program_created: 'Bookmark',
    session_completed: 'CheckCircle',
    assessment_taken: 'Award',
    training_started: 'Play',
    certificate_earned: 'Award',
    feedback_submitted: 'MessageCircle',
    poll_created: 'Target',
    announcement: 'AlertCircle',
    milestone_reached: 'TrendingUp',
    general: 'Activity'
  },

  // Error Messages
  ERROR_MESSAGES: {
    LOAD_FAILED: 'Failed to load activities',
    SAVE_FAILED: 'Failed to save activity',
    DELETE_FAILED: 'Failed to delete activity',
    ACTION_FAILED: 'Failed to perform action',
    NETWORK_ERROR: 'Network error occurred',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Activity not found',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Server error occurred'
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    LOADED: 'Activities loaded successfully',
    SAVED: 'Activity saved successfully',
    DELETED: 'Activity deleted successfully',
    ACTION_PERFORMED: 'Action performed successfully',
    REFRESHED: 'Activities refreshed successfully'
  },

  // Validation Rules
  VALIDATION: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MIN_LENGTH: 1,
    DESCRIPTION_MAX_LENGTH: 1000,
    TAGS_MAX_COUNT: 10,
    METADATA_MAX_SIZE: 50
  },

  // Cache Keys
  CACHE_KEYS: {
    ACTIVITIES: 'feed_activities',
    STATS: 'feed_stats',
    USER_ACTIVITIES: 'feed_user_activities',
    FILTERED_ACTIVITIES: 'feed_filtered_activities'
  },

  // Cache TTL (Time To Live) in milliseconds
  CACHE_TTL: {
    ACTIVITIES: 300000, // 5 minutes
    STATS: 600000, // 10 minutes
    USER_ACTIVITIES: 180000, // 3 minutes
    FILTERED_ACTIVITIES: 60000 // 1 minute
  },

  // Analytics
  ANALYTICS: {
    TRACK_ACTIONS: true,
    TRACK_VIEWS: true,
    TRACK_ENGAGEMENT: true,
    TRACK_PERFORMANCE: true
  },

  // Performance
  PERFORMANCE: {
    VIRTUAL_SCROLLING_THRESHOLD: 100,
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100,
    MAX_CONCURRENT_REQUESTS: 5
  },

  // Accessibility
  ACCESSIBILITY: {
    ARIA_LABELS: {
      ACTIVITY_FEED: 'Activity feed',
      LOAD_MORE: 'Load more activities',
      REFRESH: 'Refresh activities',
      FILTER: 'Filter activities',
      SEARCH: 'Search activities',
      SORT: 'Sort activities'
    },
    KEYBOARD_SHORTCUTS: {
      REFRESH: 'r',
      SEARCH: '/',
      FILTER: 'f',
      LOAD_MORE: 'm'
    }
  },

  // Localization
  LOCALIZATION: {
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'],
    DATE_FORMATS: {
      SHORT: 'MMM dd, yyyy',
      LONG: 'MMMM dd, yyyy',
      TIME: 'h:mm a',
      DATETIME: 'MMM dd, yyyy h:mm a'
    }
  }
};

// Export individual constants for easier imports
export const {
  ACTIVITY_TYPES,
  FILTER_OPTIONS,
  PAGINATION,
  REFRESH_INTERVALS,
  PRIORITIES,
  VISIBILITY,
  STATUS,
  ACTIONS,
  NOTIFICATION_TYPES,
  DEFAULT_SETTINGS,
  ACTIVITY_COLORS,
  ACTIVITY_ICONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  CACHE_KEYS,
  CACHE_TTL,
  ANALYTICS,
  PERFORMANCE,
  ACCESSIBILITY,
  LOCALIZATION
} = FEED_CONSTANTS;

export default FEED_CONSTANTS;
