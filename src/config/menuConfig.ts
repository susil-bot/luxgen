import { MenuItem } from '../types';

export const menuConfig: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/app/dashboard',
    roles: ['super_admin', 'admin', 'trainer', 'user'],
  },
  
  // Super Admin Menu Items
  {
    id: 'tenants',
    label: 'Tenant Management',
    icon: 'Building2',
    path: '/app/tenants',
    roles: ['super_admin'],
  },
  {
    id: 'system-settings',
    label: 'System Settings',
    icon: 'Settings2',
    path: '/app/system-settings',
    roles: ['super_admin'],
  },
  
  // Admin Menu Items
  {
    id: 'user-management',
    label: 'User Management',
    icon: 'Users',
    path: '/app/users',
    roles: ['super_admin', 'admin'],
    children: [
      {
        id: 'all-users',
        label: 'All Users',
        icon: 'UserCheck',
        path: '/app/users/all',
        roles: ['super_admin', 'admin'],
      },
      {
        id: 'trainers',
        label: 'Trainers',
        icon: 'GraduationCap',
        path: '/app/users/trainers',
        roles: ['super_admin', 'admin'],
      },
      {
        id: 'participants',
        label: 'Participants',
        icon: 'UserGroup',
        path: '/app/users/participants',
        roles: ['super_admin', 'admin'],
      },
    ],
  },
  
  // Niche-Based Notification & Feedback
  {
    id: 'notification-feedback',
    label: 'Notifications & Feedback',
    icon: 'Bell',
    path: '/app/notifications',
    roles: ['super_admin', 'admin', 'trainer'],
    children: [
      {
        id: 'niche-polls',
        label: 'Niche Polls',
        icon: 'BarChart3',
        path: '/app/notifications/polls',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'feedback-collection',
        label: 'Feedback Collection',
        icon: 'MessageSquare',
        path: '/app/notifications/feedback',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'post-test-analysis',
        label: 'Post-Test Analysis',
        icon: 'ClipboardCheck',
        path: '/app/notifications/post-tests',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'notification-scheduler',
        label: 'Notification Scheduler',
        icon: 'Calendar',
        path: '/app/notifications/scheduler',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'channel-management',
        label: 'Channel Management',
        icon: 'Share2',
        path: '/app/notifications/channels',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'analytics-reports',
        label: 'Analytics & Reports',
        icon: 'TrendingUp',
        path: '/app/notifications/analytics',
        roles: ['super_admin', 'admin', 'trainer'],
      },
    ],
  },
  
  // Presentation Management
  {
    id: 'presentation-management',
    label: 'Presentations',
    icon: 'Presentation',
    path: '/app/presentations',
    roles: ['super_admin', 'admin', 'trainer'],
    children: [
      {
        id: 'my-presentations',
        label: 'My Presentations',
        icon: 'FolderOpen',
        path: '/app/presentations/my',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'create-presentation',
        label: 'Create New',
        icon: 'Plus',
        path: '/app/presentations/create',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'presentation-templates',
        label: 'Templates',
        icon: 'FileText',
        path: '/app/presentations/templates',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'live-presentations',
        label: 'Live Sessions',
        icon: 'Radio',
        path: '/app/presentations/live',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'presentation-analytics',
        label: 'Analytics',
        icon: 'BarChart3',
        path: '/app/presentations/analytics',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'ai-polling',
        label: 'AI Polling',
        icon: 'Brain',
        path: '/app/presentations/ai-polling',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'qr-management',
        label: 'QR Codes',
        icon: 'QrCode',
        path: '/app/presentations/qr-codes',
        roles: ['super_admin', 'admin', 'trainer'],
      },
    ],
  },
  
  // Training Management
  {
    id: 'training-management',
    label: 'Training Management',
    icon: 'BookOpen',
    path: '/app/training',
    roles: ['super_admin', 'admin', 'trainer'],
    children: [
      {
        id: 'programs',
        label: 'Programs',
        icon: 'Folder',
        path: '/app/training/programs',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'sessions',
        label: 'Sessions',
        icon: 'Calendar',
        path: '/app/training/sessions',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'assessments',
        label: 'Assessments',
        icon: 'ClipboardCheck',
        path: '/app/training/assessments',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'resources',
        label: 'Resources',
        icon: 'FileText',
        path: '/app/training/resources',
        roles: ['super_admin', 'admin', 'trainer'],
      },
    ],
  },
  
  // Trainer Dashboard
  {
    id: 'trainer-dashboard',
    label: 'Trainer Dashboard',
    icon: 'GraduationCap',
    path: '/app/trainer',
    roles: ['trainer', 'super_admin', 'admin'],
  },
  
  // Participant Dashboard
  {
    id: 'participant-dashboard',
    label: 'Learning Dashboard',
    icon: 'BookOpen',
    path: '/app/participant',
    roles: ['participant', 'super_admin', 'admin'],
  },
  
  // Group Management
  {
    id: 'group-management',
    label: 'Group Management',
    icon: 'Users',
    path: '/app/groups',
    roles: ['super_admin', 'admin', 'trainer'],
  },
  
  // Reports and Analytics
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: 'BarChart3',
    path: '/app/reports',
    roles: ['super_admin', 'admin', 'trainer'],
    children: [
      {
        id: 'attendance-reports',
        label: 'Attendance Reports',
        icon: 'UserCheck2',
        path: '/app/reports/attendance',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'performance-reports',
        label: 'Performance Reports',
        icon: 'TrendingUp',
        path: '/app/reports/performance',
        roles: ['super_admin', 'admin', 'trainer'],
      },
      {
        id: 'completion-reports',
        label: 'Completion Reports',
        icon: 'CheckCircle',
        path: '/app/reports/completion',
        roles: ['super_admin', 'admin', 'trainer'],
      },
    ],
  },
  
  // User/Participant Menu Items
  {
    id: 'my-training',
    label: 'My Training',
    icon: 'BookOpen',
    path: '/app/my-training',
    roles: ['user'],
    children: [
      {
        id: 'enrolled-programs',
        label: 'Enrolled Programs',
        icon: 'BookOpenCheck',
        path: '/app/my-training/programs',
        roles: ['user'],
      },
      {
        id: 'my-sessions',
        label: 'My Sessions',
        icon: 'Calendar',
        path: '/app/my-training/sessions',
        roles: ['user'],
      },
      {
        id: 'my-assessments',
        label: 'My Assessments',
        icon: 'ClipboardCheck',
        path: '/app/my-training/assessments',
        roles: ['user'],
      },
      {
        id: 'certificates',
        label: 'Certificates',
        icon: 'Award',
        path: '/app/my-training/certificates',
        roles: ['user'],
      },
    ],
  },
  
  // AI Assistant
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: 'Zap',
    path: '/app/ai-assistant',
    roles: ['super_admin', 'admin', 'trainer', 'user'],
  },
  
  // Components Showcase (Development)
  {
    id: 'components',
    label: 'Components',
    icon: 'Puzzle',
    path: '/app/components',
    roles: ['super_admin', 'admin', 'trainer', 'user'],
  },
  
  // Shared Settings
  {
    id: 'profile',
    label: 'Profile',
    icon: 'User',
    path: '/app/profile',
    roles: ['super_admin', 'admin', 'trainer', 'user'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/app/settings/account',
    roles: ['super_admin', 'admin', 'trainer', 'user'],
  },
];

// Helper function to filter menu items based on user role
export const getMenuForRole = (userRole: string): MenuItem[] => {
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter(item => item.roles.includes(userRole as any))
      .map(item => ({
        ...item,
        children: item.children ? filterMenuItems(item.children) : undefined,
      }));
  };

  return filterMenuItems(menuConfig);
};

// Business Logic Architecture Analysis:

/*
BUSINESS PROBLEMS SOLVED:

1. MULTI-TENANT ISOLATION
   - Each organization gets isolated data and users
   - Tenant-specific branding and settings
   - Scalable pricing plans (free, basic, premium, enterprise)

2. ROLE-BASED ACCESS CONTROL
   - Super Admin: System-wide management, tenant oversight
   - Admin: Organization-level user and training management
   - Trainer: Training content creation and delivery
   - User: Training consumption and progress tracking

3. TRAINING LIFECYCLE MANAGEMENT
   - Program creation and management
   - Session scheduling and delivery
   - Assessment and certification
   - Progress tracking and reporting

4. SCALABILITY AND ANALYTICS
   - Comprehensive reporting system
   - Performance analytics
   - Attendance tracking
   - Completion rates and certification management

ARCHITECTURE BENEFITS:

1. SEPARATION OF CONCERNS
   - Clear role boundaries
   - Modular menu system
   - Type-safe interfaces

2. EXTENSIBILITY
   - Easy to add new roles
   - Configurable menu items
   - Pluggable assessment types

3. SECURITY
   - Role-based access at UI and API level
   - Tenant isolation
   - Secure authentication flow

4. USER EXPERIENCE
   - Role-specific dashboards
   - Contextual navigation
   - Progressive disclosure of features
*/ 