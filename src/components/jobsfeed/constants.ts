export const JOBS_FEED_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  MIN_PAGE_SIZE: 5,

  // Sorting options
  SORT_OPTIONS: {
    TITLE: 'title',
    COMPANY: 'company',
    LOCATION: 'location',
    SALARY: 'salary',
    CREATED_AT: 'createdAt',
    VIEWS: 'views',
    APPLICATIONS: 'applications'
  },

  // Sort orders
  SORT_ORDERS: {
    ASC: 'asc',
    DESC: 'desc'
  },

  // Job types
  JOB_TYPES: {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    CONTRACT: 'contract',
    INTERNSHIP: 'internship',
    FREELANCE: 'freelance'
  },

  // Experience levels
  EXPERIENCE_LEVELS: {
    ENTRY: 'entry',
    JUNIOR: 'junior',
    MID: 'mid',
    SENIOR: 'senior',
    LEAD: 'lead',
    EXECUTIVE: 'executive'
  },

  // Job statuses
  JOB_STATUSES: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    PAUSED: 'paused',
    CLOSED: 'closed',
    FILLED: 'filled'
  },

  // Visibility levels
  VISIBILITY_LEVELS: {
    PUBLIC: 'public',
    INTERNAL: 'internal',
    PRIVATE: 'private'
  },

  // Company sizes
  COMPANY_SIZES: {
    STARTUP: 'startup',
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    ENTERPRISE: 'enterprise'
  },

  // Education levels
  EDUCATION_LEVELS: {
    HIGH_SCHOOL: 'high-school',
    ASSOCIATE: 'associate',
    BACHELOR: 'bachelor',
    MASTER: 'master',
    PHD: 'phd',
    ANY: 'any'
  },

  // Language proficiency levels
  LANGUAGE_PROFICIENCY: {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
    NATIVE: 'native'
  },

  // Salary periods
  SALARY_PERIODS: {
    HOURLY: 'hourly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
  },

  // Application processes
  APPLICATION_PROCESSES: {
    DIRECT: 'direct',
    SCREENING: 'screening',
    INTERVIEW: 'interview',
    ASSESSMENT: 'assessment',
    MULTI_STAGE: 'multi-stage'
  },

  // Salary ranges
  SALARY_RANGES: {
    '0-50000': { min: 0, max: 50000 },
    '50000-100000': { min: 50000, max: 100000 },
    '100000-150000': { min: 100000, max: 150000 },
    '150000+': { min: 150000, max: null }
  },

  // Filter options
  FILTER_OPTIONS: {
    JOB_TYPES: [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'internship', label: 'Internship' },
      { value: 'freelance', label: 'Freelance' }
    ],
    EXPERIENCE_LEVELS: [
      { value: 'entry', label: 'Entry Level' },
      { value: 'junior', label: 'Junior' },
      { value: 'mid', label: 'Mid Level' },
      { value: 'senior', label: 'Senior Level' },
      { value: 'lead', label: 'Lead' },
      { value: 'executive', label: 'Executive' }
    ],
    SALARY_RANGES: [
      { value: '0-50000', label: '$0 - $50k' },
      { value: '50000-100000', label: '$50k - $100k' },
      { value: '100000-150000', label: '$100k - $150k' },
      { value: '150000+', label: '$150k+' }
    ]
  },

  // API endpoints
  API_ENDPOINTS: {
    JOBS: '/api/v1/jobs',
    JOBS_BY_COMPANY: '/api/v1/jobs/company',
    FEATURED_JOBS: '/api/v1/jobs/featured',
    JOB_STATISTICS: '/api/v1/jobs/statistics',
    JOB_SEARCH: '/api/v1/jobs/search'
  },

  // Cache keys
  CACHE_KEYS: {
    JOBS: 'jobs_feed',
    FEATURED_JOBS: 'featured_jobs',
    JOB_STATISTICS: 'job_statistics',
    FILTERS: 'jobs_filters'
  },

  // Cache TTL (Time To Live) in milliseconds
  CACHE_TTL: {
    JOBS: 5 * 60 * 1000, // 5 minutes
    FEATURED_JOBS: 10 * 60 * 1000, // 10 minutes
    JOB_STATISTICS: 15 * 60 * 1000, // 15 minutes
    FILTERS: 30 * 60 * 1000 // 30 minutes
  },

  // Validation rules
  VALIDATION_RULES: {
    TITLE_MIN_LENGTH: 5,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MIN_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 5000,
    SHORT_DESCRIPTION_MAX_LENGTH: 500,
    SKILLS_MAX_COUNT: 20,
    BENEFITS_MAX_COUNT: 15,
    TAGS_MAX_COUNT: 10,
    SALARY_MIN: 0,
    SALARY_MAX: 10000000
  },

  // UI constants
  UI: {
    JOBS_PER_PAGE: 10,
    MAX_JOBS_DISPLAY: 100,
    SEARCH_DEBOUNCE_MS: 300,
    FILTER_ANIMATION_DURATION: 200,
    LOADING_SKELETON_COUNT: 5
  },

  // Analytics thresholds
  ANALYTICS_THRESHOLDS: {
    HIGH_VIEWS: 100,
    HIGH_APPLICATIONS: 50,
    HIGH_CONVERSION_RATE: 10,
    HIGH_SUCCESS_RATE: 20
  },

  // Priority scoring
  PRIORITY_SCORING: {
    FEATURED_BONUS: 3,
    URGENT_BONUS: 2,
    RECENT_BONUS: 2,
    HIGH_ENGAGEMENT_BONUS: 2,
    MEDIUM_ENGAGEMENT_BONUS: 1
  },

  // Date formats
  DATE_FORMATS: {
    DISPLAY: 'MMM DD, YYYY',
    API: 'YYYY-MM-DD',
    TIMESTAMP: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
  },

  // Error messages
  ERROR_MESSAGES: {
    FETCH_JOBS_FAILED: 'Failed to fetch jobs',
    FETCH_JOB_FAILED: 'Failed to fetch job details',
    FETCH_STATISTICS_FAILED: 'Failed to fetch job statistics',
    INVALID_FILTERS: 'Invalid filter parameters',
    INVALID_SORT_OPTIONS: 'Invalid sort options',
    NETWORK_ERROR: 'Network error occurred',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Server error occurred'
  },

  // Success messages
  SUCCESS_MESSAGES: {
    JOBS_LOADED: 'Jobs loaded successfully',
    FILTERS_APPLIED: 'Filters applied successfully',
    SORT_APPLIED: 'Sort applied successfully',
    SEARCH_COMPLETED: 'Search completed successfully'
  },

  // Default values
  DEFAULTS: {
    SORT_BY: 'createdAt',
    SORT_ORDER: 'desc',
    PAGE: 1,
    LIMIT: 10,
    SEARCH_QUERY: '',
    FILTERS: {
      search: '',
      location: '',
      jobType: '',
      experience: '',
      salary: ''
    }
  }
} as const;

export default JOBS_FEED_CONSTANTS;
