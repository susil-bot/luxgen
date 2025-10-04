export const JOB_POST_CONSTANTS = {
  // API Endpoints
  API_ENDPOINTS: {
    JOB_POSTS: '/api/jobposts',
    JOB_POST_BY_ID: (id: string) => `/api/jobposts/${id}`,
    JOB_POST_LIKE: (id: string) => `/api/jobposts/${id}/like`,
    JOB_POST_COMMENT: (id: string) => `/api/jobposts/${id}/comment`,
    JOB_POST_SHARE: (id: string) => `/api/jobposts/${id}/share`,
    JOB_POST_STATS: '/api/jobposts/stats',
    JOB_POST_BY_USER: (userId: string) => `/api/jobposts/user/${userId}`,
    JOB_POST_BY_DEPARTMENT: (department: string) => `/api/jobposts/department/${department}`,
    JOB_POST_SEARCH: '/api/jobposts/search',
    JOB_POST_ENGAGEMENT: (id: string) => `/api/jobposts/${id}/engagement`
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Job Post Types
  JOB_TYPES: [
    { value: 'full-time', label: 'Full Time', icon: '💼' },
    { value: 'part-time', label: 'Part Time', icon: '⏰' },
    { value: 'contract', label: 'Contract', icon: '📋' },
    { value: 'internship', label: 'Internship', icon: '🎓' },
    { value: 'remote', label: 'Remote', icon: '🏠' }
  ],

  // Job Post Status
  JOB_STATUS: [
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'red' },
    { value: 'draft', label: 'Draft', color: 'yellow' },
    { value: 'archived', label: 'Archived', color: 'gray' }
  ],

  // Departments
  DEPARTMENTS: [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Service',
    'Product',
    'Design',
    'Data Science',
    'Security',
    'Legal'
  ],

  // Locations
  LOCATIONS: [
    'Remote',
    'On-site',
    'Hybrid',
    'New York, NY',
    'San Francisco, CA',
    'Los Angeles, CA',
    'Chicago, IL',
    'Boston, MA',
    'Seattle, WA',
    'Austin, TX',
    'Denver, CO',
    'Miami, FL'
  ],

  // Skills
  COMMON_SKILLS: [
    'JavaScript',
    'Python',
    'Java',
    'React',
    'Node.js',
    'SQL',
    'AWS',
    'Docker',
    'Kubernetes',
    'Git',
    'Agile',
    'Scrum',
    'Project Management',
    'Communication',
    'Leadership',
    'Problem Solving',
    'Analytical Thinking',
    'Teamwork',
    'Time Management',
    'Customer Service'
  ],

  // Benefits
  COMMON_BENEFITS: [
    'Health Insurance',
    'Dental Insurance',
    'Vision Insurance',
    '401(k) Matching',
    'Paid Time Off',
    'Sick Leave',
    'Maternity/Paternity Leave',
    'Flexible Schedule',
    'Remote Work',
    'Professional Development',
    'Gym Membership',
    'Commuter Benefits',
    'Stock Options',
    'Bonus',
    'Tuition Reimbursement'
  ],

  // Experience Levels
  EXPERIENCE_LEVELS: [
    'Entry Level (0-2 years)',
    'Mid Level (3-5 years)',
    'Senior Level (6-10 years)',
    'Lead Level (11+ years)',
    'Executive Level'
  ],

  // Education Levels
  EDUCATION_LEVELS: [
    'High School',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'No Degree Required'
  ],

  // Sort Options
  SORT_OPTIONS: [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'title', label: 'Title' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'comments', label: 'Most Commented' },
    { value: 'shares', label: 'Most Shared' },
    { value: 'views', label: 'Most Viewed' }
  ],

  // Filter Options
  FILTER_OPTIONS: {
    STATUS: [
      { value: 'all', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'draft', label: 'Draft' },
      { value: 'archived', label: 'Archived' }
    ],
    DEPARTMENT: [
      { value: 'all', label: 'All Departments' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'hr', label: 'Human Resources' },
      { value: 'finance', label: 'Finance' },
      { value: 'operations', label: 'Operations' }
    ],
    LOCATION: [
      { value: 'all', label: 'All Locations' },
      { value: 'remote', label: 'Remote' },
      { value: 'onsite', label: 'On-site' },
      { value: 'hybrid', label: 'Hybrid' }
    ],
    TYPE: [
      { value: 'all', label: 'All Types' },
      { value: 'full-time', label: 'Full Time' },
      { value: 'part-time', label: 'Part Time' },
      { value: 'contract', label: 'Contract' },
      { value: 'internship', label: 'Internship' },
      { value: 'remote', label: 'Remote' }
    ]
  },

  // Validation Rules
  VALIDATION: {
    TITLE: {
      MIN_LENGTH: 5,
      MAX_LENGTH: 200
    },
    DESCRIPTION: {
      MIN_LENGTH: 20,
      MAX_LENGTH: 2000
    },
    REQUIREMENTS: {
      MAX_LENGTH: 1000
    },
    SALARY: {
      MIN: 0,
      MAX: 1000000
    }
  },

  // UI Constants
  UI: {
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 200,
    MAX_TAGS: 10,
    MAX_SKILLS: 20,
    MAX_BENEFITS: 15,
    ITEMS_PER_PAGE: 10,
    MAX_SEARCH_RESULTS: 100
  },

  // Error Messages
  ERROR_MESSAGES: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_SALARY: 'Please enter a valid salary amount',
    INVALID_DATE: 'Please enter a valid date',
    TITLE_TOO_SHORT: 'Title must be at least 5 characters long',
    TITLE_TOO_LONG: 'Title must be less than 200 characters',
    DESCRIPTION_TOO_SHORT: 'Description must be at least 20 characters long',
    DESCRIPTION_TOO_LONG: 'Description must be less than 2000 characters',
    REQUIREMENTS_TOO_LONG: 'Requirements must be less than 1000 characters',
    SALARY_INVALID: 'Salary must be a positive number',
    NETWORK_ERROR: 'Network error. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NOT_FOUND: 'Job post not found',
    SERVER_ERROR: 'Server error. Please try again later.'
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    CREATED: 'Job post created successfully',
    UPDATED: 'Job post updated successfully',
    DELETED: 'Job post deleted successfully',
    LIKED: 'Job post liked successfully',
    UNLIKED: 'Job post unliked successfully',
    COMMENTED: 'Comment added successfully',
    SHARED: 'Job post shared successfully',
    BOOKMARKED: 'Job post bookmarked successfully',
    UNBOOKMARKED: 'Job post unbookmarked successfully'
  }
};
