// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  avatar?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'trainer' | 'user' | 'participant';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

// Tenant Types
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings: TenantSettings;
  createdAt: Date;
  isActive: boolean;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
}

export interface TenantSettings {
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
  };
  features: {
    allowCustomBranding: boolean;
    maxTrainers: number;
    maxUsers: number;
    maxPrograms: number;
  };
}

// Training Program Types
export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  duration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  trainerId: string;
  tenantId: string;
  sessions: TrainingSession[];
  participants: string[]; // user IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingSession {
  id: string;
  programId: string;
  title: string;
  description: string;
  scheduledDate: Date;
  duration: number; // in minutes
  location?: string;
  type: 'online' | 'offline' | 'hybrid';
  maxParticipants?: number;
  resources: SessionResource[];
  attendance: AttendanceRecord[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface SessionResource {
  id: string;
  name: string;
  type: 'document' | 'video' | 'audio' | 'link' | 'other';
  url: string;
  description?: string;
}

export interface AttendanceRecord {
  userId: string;
  sessionId: string;
  status: 'present' | 'absent' | 'late';
  joinTime?: Date;
  leaveTime?: Date;
  notes?: string;
}

// Assessment Types
export interface Assessment {
  id: string;
  title: string;
  description: string;
  programId: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // in minutes
  isActive: boolean;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  answers: Answer[];
  score: number;
  passed: boolean;
  submittedAt: Date;
}

export interface Answer {
  questionId: string;
  answer: string | string[];
}

// Menu and Navigation Types
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: UserRole[];
  children?: MenuItem[];
  isActive?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalPrograms: number;
  totalSessions: number;
  completionRate: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'user_joined' | 'program_created' | 'session_completed' | 'assessment_taken';
  description: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  tenantDomain?: string;
}

export interface CreateUserForm {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
}

export interface CreateProgramForm {
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  trainerId: string;
}

// Group Management Types
export interface Group {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  tenantId: string;
  members: GroupMember[];
  maxSize?: number;
  category?: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  performanceMetrics: GroupPerformanceMetrics;
}

export interface GroupMember {
  userId: string;
  joinedAt: Date;
  role: 'leader' | 'member' | 'observer';
  status: 'active' | 'inactive' | 'suspended';
  performanceScore?: number;
  lastActivity?: Date;
}

export interface GroupPerformanceMetrics {
  averageScore: number;
  completionRate: number;
  participationRate: number;
  totalSessions: number;
  totalAssessments: number;
  improvementTrend: 'increasing' | 'decreasing' | 'stable';
  lastUpdated: Date;
}

// Live Polling and Presentation Types
export interface LivePresentation {
  id: string;
  title: string;
  description?: string;
  trainerId: string;
  groupId?: string;
  status: 'preparing' | 'live' | 'paused' | 'ended';
  currentSlide: number;
  totalSlides: number;
  startedAt?: Date;
  endedAt?: Date;
  participants: PresentationParticipant[];
  polls: LivePoll[];
  analytics: PresentationAnalytics;
}

export interface PresentationParticipant {
  userId: string;
  joinedAt: Date;
  isActive: boolean;
  lastActivity: Date;
  responses: PollResponse[];
}

export interface LivePoll {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'rating' | 'open_ended' | 'word_cloud';
  options?: string[];
  isActive: boolean;
  timeLimit?: number; // in seconds
  createdAt: Date;
  responses: PollResponse[];
  results: PollResults;
}

export interface PollResponse {
  id: string;
  pollId: string;
  userId: string;
  answer: string | number | string[];
  submittedAt: Date;
  responseTime?: number; // in seconds
}

export interface PollResults {
  totalResponses: number;
  participationRate: number;
  answers: PollAnswer[];
  wordCloud?: WordCloudData[];
  averageResponseTime: number;
}

export interface PollAnswer {
  answer: string | number;
  count: number;
  percentage: number;
}

export interface WordCloudData {
  text: string;
  value: number;
  color?: string;
}

export interface PresentationAnalytics {
  totalParticipants: number;
  averageEngagement: number;
  totalPolls: number;
  averageResponseRate: number;
  peakConcurrentUsers: number;
  sessionDuration: number;
  engagementTrend: EngagementData[];
}

export interface EngagementData {
  timestamp: Date;
  activeUsers: number;
  responses: number;
}

// Group Assignment and Management
export interface GroupAssignment {
  id: string;
  groupId: string;
  userId: string;
  assignedBy: string;
  assignedAt: Date;
  reason?: string;
  status: 'active' | 'temporary' | 'removed';
}

export interface GroupTemplate {
  id: string;
  name: string;
  description: string;
  maxSize: number;
  category: string;
  tags: string[];
  trainerId: string;
  isPublic: boolean;
  usageCount: number;
  createdAt: Date;
}

// Real-time Communication Types
export interface RealTimeEvent {
  type: 'poll_created' | 'poll_response' | 'user_joined' | 'user_left' | 'presentation_started' | 'presentation_ended';
  data: any;
  timestamp: Date;
  userId?: string;
  groupId?: string;
  presentationId?: string;
}

// Performance Tracking Types
export interface UserPerformance {
  userId: string;
  groupId: string;
  metrics: {
    attendanceRate: number;
    participationScore: number;
    assessmentScore: number;
    engagementLevel: number;
    improvementRate: number;
  };
  history: PerformanceRecord[];
  lastUpdated: Date;
}

export interface PerformanceRecord {
  date: Date;
  score: number;
  type: 'assessment' | 'participation' | 'attendance' | 'engagement';
  details?: string;
}

// Group Analytics and Reporting
export interface GroupReport {
  groupId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalMembers: number;
    activeMembers: number;
    averagePerformance: number;
    topPerformers: string[];
    improvementAreas: string[];
    engagementTrend: number;
  };
  recommendations: string[];
  generatedAt: Date;
} 