/**
 * fixture.js
 * Mock data for ActivityFeed component testing and development
 */

export const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    role: 'admin',
    department: 'Engineering',
    position: 'Senior Developer'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    role: 'trainer',
    department: 'Training',
    position: 'Lead Trainer'
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    role: 'participant',
    department: 'Sales',
    position: 'Sales Manager'
  },
  {
    id: 'user-4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    role: 'participant',
    department: 'Marketing',
    position: 'Marketing Specialist'
  },
  {
    id: 'user-5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    role: 'participant',
    department: 'HR',
    position: 'HR Manager'
  }
];

export const mockActivities = [
  {
    id: 'activity-1',
    title: 'New User Joined the Platform',
    description: 'Welcome to our training platform! We\'re excited to have you on board.',
    type: 'user_joined',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: mockUsers[2],
    metadata: {
      department: 'Sales',
      position: 'Sales Manager',
      onboardingCompleted: false
    },
    likes: 12,
    comments: 3,
    shares: 1,
    isLiked: false,
    isBookmarked: false,
    priority: 1,
    tags: ['welcome', 'new-user'],
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'activity-2',
    title: 'Leadership Training Program Created',
    description: 'A comprehensive leadership development program has been created for all managers.',
    type: 'program_created',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    user: mockUsers[1],
    metadata: {
      programId: 'program-1',
      duration: 120,
      participants: 25,
      difficulty: 'intermediate'
    },
    likes: 8,
    comments: 5,
    shares: 2,
    isLiked: true,
    isBookmarked: true,
    priority: 3,
    tags: ['leadership', 'training', 'management'],
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'activity-3',
    title: 'Training Session Completed',
    description: 'Successfully completed the "Effective Communication" training session.',
    type: 'session_completed',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    user: mockUsers[3],
    metadata: {
      sessionId: 'session-1',
      score: 85,
      duration: 45,
      passed: true
    },
    likes: 15,
    comments: 2,
    shares: 0,
    isLiked: false,
    isBookmarked: false,
    priority: 2,
    tags: ['communication', 'completed', 'success'],
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'activity-4',
    title: 'Assessment Taken',
    description: 'Completed the "Project Management Fundamentals" assessment with excellent results.',
    type: 'assessment_taken',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    user: mockUsers[4],
    metadata: {
      assessmentId: 'assessment-1',
      score: 92,
      percentage: 92,
      timeSpent: 30,
      passed: true
    },
    likes: 20,
    comments: 7,
    shares: 3,
    isLiked: true,
    isBookmarked: false,
    priority: 3,
    tags: ['assessment', 'project-management', 'excellent'],
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'activity-5',
    title: 'New Training Started',
    description: 'Started the "Digital Marketing Strategies" training program.',
    type: 'training_started',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    user: mockUsers[3],
    metadata: {
      programId: 'program-2',
      module: 1,
      totalModules: 8,
      estimatedDuration: 240
    },
    likes: 6,
    comments: 1,
    shares: 0,
    isLiked: false,
    isBookmarked: true,
    priority: 2,
    tags: ['digital-marketing', 'started', 'new'],
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'activity-6',
    title: 'Certificate Earned',
    description: 'Congratulations! You\'ve earned the "Advanced Excel Skills" certificate.',
    type: 'certificate_earned',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    user: mockUsers[2],
    metadata: {
      certificateId: 'cert-1',
      programName: 'Advanced Excel Skills',
      issueDate: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    likes: 25,
    comments: 10,
    shares: 5,
    isLiked: true,
    isBookmarked: true,
    priority: 4,
    tags: ['certificate', 'excel', 'achievement'],
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'activity-7',
    title: 'Feedback Submitted',
    description: 'Thank you for providing valuable feedback on the "Team Collaboration" course.',
    type: 'feedback_submitted',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
    user: mockUsers[4],
    metadata: {
      courseId: 'course-1',
      rating: 4.5,
      feedbackType: 'course_feedback',
      helpful: true
    },
    likes: 3,
    comments: 1,
    shares: 0,
    isLiked: false,
    isBookmarked: false,
    priority: 1,
    tags: ['feedback', 'collaboration', 'rating'],
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'activity-8',
    title: 'Poll Created',
    description: 'A new poll has been created: "What training topics interest you most?"',
    type: 'poll_created',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    user: mockUsers[1],
    metadata: {
      pollId: 'poll-1',
      question: 'What training topics interest you most?',
      options: ['Leadership', 'Technical Skills', 'Soft Skills', 'Management'],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    likes: 18,
    comments: 12,
    shares: 4,
    isLiked: false,
    isBookmarked: false,
    priority: 2,
    tags: ['poll', 'survey', 'feedback'],
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'activity-9',
    title: 'Important Announcement',
    description: 'New platform features are now available! Check out the enhanced analytics dashboard.',
    type: 'announcement',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    user: mockUsers[0],
    metadata: {
      announcementType: 'feature_update',
      priority: 'high',
      readBy: 45,
      totalUsers: 50
    },
    likes: 30,
    comments: 15,
    shares: 8,
    isLiked: true,
    isBookmarked: true,
    priority: 5,
    tags: ['announcement', 'features', 'update'],
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'activity-10',
    title: 'Milestone Reached',
    description: 'Congratulations! You\'ve completed 10 training modules this month.',
    type: 'milestone_reached',
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000), // 4 days ago
    user: mockUsers[2],
    metadata: {
      milestoneType: 'modules_completed',
      count: 10,
      period: 'month',
      reward: 'badge_earned'
    },
    likes: 22,
    comments: 8,
    shares: 2,
    isLiked: true,
    isBookmarked: false,
    priority: 4,
    tags: ['milestone', 'achievement', 'progress'],
    visibility: 'public',
    status: 'active'
  }
];

export const mockStats = {
  totalActivities: 156,
  activeUsers: 45,
  engagementRate: 78.5,
  thisWeek: 23,
  thisMonth: 89,
  topActivityType: 'session_completed',
  averageEngagement: 12.3,
  totalLikes: 234,
  totalComments: 89,
  totalShares: 45,
  growthRate: 15.2
};

export const mockEngagement = {
  likes: 15,
  comments: 8,
  shares: 3,
  views: 45,
  engagementRate: 57.8,
  topEngagers: [
    {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      engagementCount: 12,
      lastEngagement: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      engagementCount: 8,
      lastEngagement: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ],
  recentComments: [
    {
      id: 'comment-1',
      text: 'Great work on this training session!',
      user: mockUsers[0],
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likes: 3,
      isLiked: false
    },
    {
      id: 'comment-2',
      text: 'This was very helpful, thank you!',
      user: mockUsers[1],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 1,
      isLiked: true
    }
  ]
};

export const mockFilters = {
  types: ['user_joined', 'program_created', 'session_completed', 'assessment_taken'],
  dateRange: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  },
  users: ['user-1', 'user-2', 'user-3'],
  tags: ['leadership', 'training', 'completed'],
  status: 'active',
  priority: 'all'
};

export const mockSearchResults = {
  activities: mockActivities.slice(0, 5),
  total: 5,
  page: 1,
  limit: 20,
  hasMore: false,
  query: 'training',
  filters: mockFilters
};

export const mockAnalytics = {
  byType: {
    user_joined: 12,
    program_created: 8,
    session_completed: 45,
    assessment_taken: 23,
    training_started: 15,
    certificate_earned: 18,
    feedback_submitted: 9,
    poll_created: 5,
    announcement: 3,
    milestone_reached: 7
  },
  byUser: {
    'user-1': { name: 'John Doe', count: 25 },
    'user-2': { name: 'Jane Smith', count: 18 },
    'user-3': { name: 'Mike Johnson', count: 12 },
    'user-4': { name: 'Sarah Wilson', count: 8 },
    'user-5': { name: 'David Brown', count: 5 }
  },
  byDate: {
    'Mon Dec 18 2023': 5,
    'Tue Dec 19 2023': 8,
    'Wed Dec 20 2023': 12,
    'Thu Dec 21 2023': 6,
    'Fri Dec 22 2023': 9
  },
  engagement: {
    totalLikes: 234,
    totalComments: 89,
    totalShares: 45
  }
};

export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'new_activity',
    activityId: 'activity-1',
    userId: 'user-1',
    message: 'New activity in your feed',
    isRead: false,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: 'notif-2',
    type: 'activity_liked',
    activityId: 'activity-2',
    userId: 'user-2',
    message: 'Someone liked your activity',
    isRead: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'notif-3',
    type: 'activity_commented',
    activityId: 'activity-3',
    userId: 'user-3',
    message: 'New comment on your activity',
    isRead: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
  }
];

export const mockSettings = {
  autoRefresh: true,
  refreshInterval: 30000,
  itemsPerPage: 20,
  showTimestamps: true,
  showUserAvatars: true,
  enableNotifications: true,
  defaultFilter: 'all',
  sortOrder: 'desc',
  groupByDate: false
};

// Export all mock data
module.exports = {
  mockUsers,
  mockActivities,
  mockStats,
  mockEngagement,
  mockFilters,
  mockSearchResults,
  mockAnalytics,
  mockNotifications,
  mockSettings,
  
  // Helper functions for generating mock data
  generateMockActivity: (overrides = {}) => ({
    id: `activity-${Date.now()}`,
    title: 'Mock Activity',
    description: 'This is a mock activity for testing purposes.',
    type: 'general',
    timestamp: new Date(),
    user: mockUsers[0],
    metadata: {},
    likes: 0,
    comments: 0,
    shares: 0,
    isLiked: false,
    isBookmarked: false,
    priority: 2,
    tags: [],
    visibility: 'public',
    status: 'active',
    ...overrides
  }),
  
  generateMockUser: (overrides = {}) => ({
    id: `user-${Date.now()}`,
    name: 'Mock User',
    email: 'mock@example.com',
    avatar: null,
    role: 'participant',
    department: 'Mock Department',
    position: 'Mock Position',
    ...overrides
  }),
  
  generateMockStats: (overrides = {}) => ({
    totalActivities: 0,
    activeUsers: 0,
    engagementRate: 0,
    thisWeek: 0,
    thisMonth: 0,
    topActivityType: null,
    averageEngagement: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    growthRate: 0,
    ...overrides
  })
};
