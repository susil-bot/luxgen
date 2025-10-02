/**
 * Training Program Manager - Test Fixtures
 * Mock data and fixtures for testing training program functionality
 */

const mockTrainingPrograms = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming language',
    shortDescription: 'Master JavaScript from scratch',
    category: 'technology',
    level: 'beginner',
    duration: 180,
    status: 'published',
    type: 'course',
    instructor: 'instructor1',
    maxEnrollments: 100,
    currentEnrollments: 45,
    price: 99.99,
    currency: 'USD',
    tags: ['javascript', 'programming', 'web-development'],
    prerequisites: ['Basic HTML knowledge'],
    learningObjectives: [
      'Understand JavaScript syntax',
      'Work with variables and functions',
      'Handle DOM manipulation'
    ],
    targetAudience: ['Beginners', 'Web developers'],
    materials: [
      { name: 'JavaScript Basics PDF', type: 'document', url: '/materials/js-basics.pdf' },
      { name: 'Code Examples', type: 'code', url: '/materials/js-examples.zip' }
    ],
    modules: [
      {
        id: 'module1',
        title: 'Introduction to JavaScript',
        description: 'Getting started with JavaScript',
        estimatedDuration: 30,
        order: 1
      },
      {
        id: 'module2',
        title: 'Variables and Data Types',
        description: 'Understanding JavaScript variables',
        estimatedDuration: 45,
        order: 2
      }
    ],
    assessments: [
      {
        id: 'assessment1',
        title: 'JavaScript Basics Quiz',
        type: 'quiz',
        questions: 10,
        passingScore: 70
      }
    ],
    certificates: [
      {
        id: 'cert1',
        name: 'JavaScript Fundamentals Certificate',
        description: 'Certificate of completion for JavaScript Fundamentals'
      }
    ],
    banner: '/images/js-fundamentals-banner.jpg',
    thumbnail: '/images/js-fundamentals-thumb.jpg',
    isActive: true,
    isPublic: true,
    isFeatured: true,
    analytics: {
      views: 1250,
      enrollments: 45,
      completions: 38,
      rating: 4.5,
      totalRatings: 42,
      completionRate: 84.4
    },
    metadata: {
      createdBy: 'admin1',
      lastModifiedBy: 'admin1',
      version: 1,
      language: 'en',
      timezone: 'UTC'
    },
    settings: {
      allowEnrollment: true,
      requireApproval: false,
      maxAttempts: 3,
      passingScore: 70,
      allowRetake: true,
      showProgress: true,
      enableNotifications: true
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Advanced React Development',
    description: 'Master advanced React concepts and patterns',
    shortDescription: 'Take your React skills to the next level',
    category: 'technology',
    level: 'advanced',
    duration: 300,
    status: 'published',
    type: 'course',
    instructor: 'instructor2',
    maxEnrollments: 50,
    currentEnrollments: 32,
    price: 199.99,
    currency: 'USD',
    tags: ['react', 'javascript', 'frontend', 'advanced'],
    prerequisites: [
      'JavaScript Fundamentals',
      'Basic React knowledge',
      'ES6+ features'
    ],
    learningObjectives: [
      'Master React hooks and context',
      'Implement advanced patterns',
      'Build scalable applications'
    ],
    targetAudience: ['Experienced developers', 'React developers'],
    materials: [
      { name: 'React Advanced Guide', type: 'document', url: '/materials/react-advanced.pdf' },
      { name: 'Project Templates', type: 'code', url: '/materials/react-templates.zip' }
    ],
    modules: [
      {
        id: 'module1',
        title: 'Advanced Hooks',
        description: 'Deep dive into React hooks',
        estimatedDuration: 60,
        order: 1
      },
      {
        id: 'module2',
        title: 'Context and State Management',
        description: 'Managing complex state',
        estimatedDuration: 90,
        order: 2
      }
    ],
    assessments: [
      {
        id: 'assessment1',
        title: 'React Advanced Assessment',
        type: 'project',
        description: 'Build a complex React application'
      }
    ],
    certificates: [
      {
        id: 'cert1',
        name: 'Advanced React Developer Certificate',
        description: 'Certificate for advanced React development'
      }
    ],
    banner: '/images/react-advanced-banner.jpg',
    thumbnail: '/images/react-advanced-thumb.jpg',
    isActive: true,
    isPublic: true,
    isFeatured: false,
    analytics: {
      views: 890,
      enrollments: 32,
      completions: 28,
      rating: 4.8,
      totalRatings: 30,
      completionRate: 87.5
    },
    metadata: {
      createdBy: 'admin2',
      lastModifiedBy: 'admin2',
      version: 2,
      language: 'en',
      timezone: 'UTC'
    },
    settings: {
      allowEnrollment: true,
      requireApproval: true,
      maxAttempts: 2,
      passingScore: 80,
      allowRetake: true,
      showProgress: true,
      enableNotifications: true
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '3',
    title: 'Project Management Fundamentals',
    description: 'Learn essential project management skills',
    shortDescription: 'Master project management basics',
    category: 'business',
    level: 'intermediate',
    duration: 240,
    status: 'draft',
    type: 'workshop',
    instructor: 'instructor3',
    maxEnrollments: 75,
    currentEnrollments: 0,
    price: 149.99,
    currency: 'USD',
    tags: ['project-management', 'business', 'leadership'],
    prerequisites: ['Basic business knowledge'],
    learningObjectives: [
      'Understand project lifecycle',
      'Learn planning techniques',
      'Master team management'
    ],
    targetAudience: ['Managers', 'Team leads', 'Business professionals'],
    materials: [
      { name: 'PM Guide', type: 'document', url: '/materials/pm-guide.pdf' },
      { name: 'Templates', type: 'document', url: '/materials/pm-templates.zip' }
    ],
    modules: [
      {
        id: 'module1',
        title: 'Project Initiation',
        description: 'Starting projects right',
        estimatedDuration: 60,
        order: 1
      }
    ],
    assessments: [
      {
        id: 'assessment1',
        title: 'PM Fundamentals Test',
        type: 'quiz',
        questions: 15,
        passingScore: 75
      }
    ],
    certificates: [
      {
        id: 'cert1',
        name: 'Project Management Certificate',
        description: 'Certificate in project management'
      }
    ],
    banner: '/images/pm-fundamentals-banner.jpg',
    thumbnail: '/images/pm-fundamentals-thumb.jpg',
    isActive: true,
    isPublic: false,
    isFeatured: false,
    analytics: {
      views: 0,
      enrollments: 0,
      completions: 0,
      rating: 0,
      totalRatings: 0,
      completionRate: 0
    },
    metadata: {
      createdBy: 'admin3',
      lastModifiedBy: 'admin3',
      version: 1,
      language: 'en',
      timezone: 'UTC'
    },
    settings: {
      allowEnrollment: false,
      requireApproval: true,
      maxAttempts: 3,
      passingScore: 75,
      allowRetake: true,
      showProgress: true,
      enableNotifications: true
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

const mockFilters = {
  status: 'published',
  category: 'technology',
  level: 'beginner',
  type: 'course',
  search: 'javascript',
  tags: ['javascript', 'programming'],
  priceRange: { min: 0, max: 200 },
  durationRange: { min: 60, max: 300 },
  isActive: true,
  isPublic: true,
  isFeatured: false,
  sortBy: 'title',
  sortOrder: 'asc',
  page: 1,
  limit: 10
};

const mockFormData = {
  title: 'New Training Program',
  description: 'This is a new training program',
  shortDescription: 'New program description',
  category: 'technology',
  level: 'beginner',
  duration: 120,
  status: 'draft',
  type: 'course',
  instructor: 'instructor1',
  maxEnrollments: 50,
  price: 79.99,
  currency: 'USD',
  tags: ['new', 'programming'],
  prerequisites: ['Basic knowledge'],
  learningObjectives: ['Learn new skills'],
  targetAudience: ['Beginners'],
  materials: [],
  modules: [],
  assessments: [],
  certificates: [],
  banner: null,
  thumbnail: null,
  isActive: true,
  isPublic: false,
  isFeatured: false,
  settings: {
    allowEnrollment: true,
    requireApproval: false,
    maxAttempts: 3,
    passingScore: 70,
    allowRetake: true,
    showProgress: true,
    enableNotifications: true
  }
};

const mockStatistics = {
  total: 3,
  byStatus: {
    published: 2,
    draft: 1
  },
  byCategory: {
    technology: 2,
    business: 1
  },
  byLevel: {
    beginner: 1,
    intermediate: 1,
    advanced: 1
  },
  averageRating: 4.65,
  totalEnrollments: 77,
  totalViews: 2140
};

const mockInstructors = [
  {
    id: 'instructor1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    specialization: 'JavaScript'
  },
  {
    id: 'instructor2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    specialization: 'React'
  },
  {
    id: 'instructor3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    specialization: 'Project Management'
  }
];

const mockCategories = [
  'technology',
  'business',
  'design',
  'marketing',
  'data-science',
  'leadership'
];

const mockLevels = [
  'beginner',
  'intermediate',
  'advanced'
];

const mockStatuses = [
  'draft',
  'published',
  'archived',
  'suspended'
];

const mockTypes = [
  'course',
  'workshop',
  'seminar',
  'bootcamp'
];

module.exports = {
  mockTrainingPrograms,
  mockFilters,
  mockFormData,
  mockStatistics,
  mockInstructors,
  mockCategories,
  mockLevels,
  mockStatuses,
  mockTypes
};
