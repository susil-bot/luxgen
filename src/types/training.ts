export type ProgramStatus = 'draft' | 'active' | 'archived' | 'completed' | 'suspended';
export type ProgramType = 'course' | 'workshop' | 'certification' | 'webinar' | 'mentorship';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ContentType = 'video' | 'document' | 'quiz' | 'assignment' | 'interactive' | 'link';

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  type: ProgramType;
  difficulty: DifficultyLevel;
  status: ProgramStatus;
  instructor: string;
  duration: number; // in minutes
  maxEnrollments?: number;
  currentEnrollments?: number;
  price?: number;
  currency?: string;
  thumbnail?: string;
  banner?: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  targetAudience: string[];
  materials: TrainingMaterial[];
  modules: TrainingModule[];
  assessments: Assessment[];
  certificates: Certificate[];
  metadata: {
    language: string;
    version: string;
    lastUpdated: string;
    createdBy: string;
    approvedBy?: string;
    approvalDate?: string;
    seoKeywords?: string[];
    seoDescription?: string;
  };
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
    maxAttempts?: number;
    passingScore?: number;
    timeLimit?: number;
    retakePolicy?: string;
  };
  // User-specific properties
  progress?: number;
  enrolledAt?: string;
  lastAccessed?: string;
  estimatedCompletion?: string;
  certificate?: string;
  rating?: number;
  analytics: {
    views: number;
    enrollments: number;
    completions: number;
    averageRating: number;
    totalRatings: number;
    averageCompletionTime: number;
    completionRate: number;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  archivedAt?: string;
}

export interface TrainingMaterial {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  url?: string;
  filePath?: string;
  fileSize?: number;
  duration?: number; // for videos
  thumbnail?: string;
  tags: string[];
  isRequired: boolean;
  isDownloadable: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description?: string;
  materials: string[]; // material IDs
  assessments: string[]; // assessment IDs
  order: number;
  estimatedDuration: number; // in minutes
  isRequired: boolean;
  prerequisites: string[]; // module IDs
  learningObjectives: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'assignment' | 'project' | 'exam';
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number;
  maxAttempts: number;
  isRequired: boolean;
  weight: number; // percentage of total grade
  instructions?: string;
  rubric?: RubricCriteria[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching' | 'fill-blank';
  text: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  points: number;
  order: number;
  isRequired: boolean;
}

export interface RubricCriteria {
  id: string;
  title: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  title: string;
  description: string;
  points: number;
}

export interface Certificate {
  id: string;
  title: string;
  description?: string;
  template: string;
  criteria: CertificateCriteria;
  validityPeriod?: number; // in days
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateCriteria {
  type: 'completion' | 'score' | 'attendance' | 'custom';
  minScore?: number;
  minAttendance?: number;
  customConditions?: string[];
}

export interface Enrollment {
  id: string;
  userId: string;
  programId: string;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped' | 'suspended';
  enrolledAt: string;
  startedAt?: string;
  completedAt?: string;
  progress: number; // percentage
  currentModule?: string;
  currentMaterial?: string;
  timeSpent: number; // in minutes
  lastActivityAt: string;
  certificateId?: string;
  certificateIssuedAt?: string;
  notes?: string;
  metadata: {
    enrollmentMethod: 'self' | 'admin' | 'invitation';
    source?: string;
    campaign?: string;
  };
}

export interface Progress {
  id: string;
  userId: string;
  programId: string;
  moduleId?: string;
  materialId?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  progress: number; // percentage
  timeSpent: number; // in minutes
  startedAt?: string;
  completedAt?: string;
  score?: number;
  attempts: number;
  notes?: string;
  bookmarks: string[]; // material IDs
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  assessmentId: string;
  programId: string;
  attemptNumber: number;
  status: 'in-progress' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in minutes
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers: AssessmentAnswer[];
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  feedback?: string;
}

export interface Feedback {
  id: string;
  userId: string;
  programId: string;
  rating: number; // 1-5
  comment?: string;
  category: 'content' | 'instructor' | 'platform' | 'overall';
  isAnonymous: boolean;
  isPublic: boolean;
  helpfulCount: number;
  reportedCount: number;
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  id: string;
  programId: string;
  userId: string;
  title: string;
  content: string;
  type: 'question' | 'discussion' | 'announcement';
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  likeCount: number;
  status: 'active' | 'closed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  userId: string;
  content: string;
  isAnswer: boolean;
  likeCount: number;
  status: 'active' | 'hidden';
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  programId: string;
  materialId?: string;
  content: string;
  timestamp?: number; // for video notes
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  programId: string;
  materialId: string;
  timestamp?: number; // for video bookmarks
  note?: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: BadgeCriteria;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BadgeCriteria {
  type: 'completion' | 'score' | 'participation' | 'time' | 'custom';
  programId?: string;
  minScore?: number;
  minTime?: number; // in minutes
  minParticipation?: number;
  customConditions?: string[];
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface ProgramTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  type: ProgramType;
  difficulty: DifficultyLevel;
  estimatedDuration: number;
  thumbnail?: string;
  tags: string[];
  structure: {
    modules: Partial<TrainingModule>[];
    assessments: Partial<Assessment>[];
    certificates: Partial<Certificate>[];
  };
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramAnalytics {
  enrollments: Array<{ date: string; count: number }>;
  completions: Array<{ date: string; count: number }>;
  ratings: Array<{ rating: number; count: number }>;
  categoryDistribution: Array<{ category: string; count: number }>;
  difficultyDistribution: Array<{ difficulty: string; count: number }>;
  averageCompletionTime: number;
  topPerformingPrograms: Array<{ id: string; title: string; completionRate: number }>;
}

export interface ProgramStats {
  totalPrograms: number;
  activePrograms: number;
  completedPrograms: number;
  draftPrograms: number;
  totalEnrollments: number;
  averageCompletionRate: number;
  totalDuration: number;
  popularCategories: Array<{ name: string; count: number }>;
}

export interface ProgramFilters {
  status?: ProgramStatus;
  type?: ProgramType;
  difficulty?: DifficultyLevel;
  category?: string;
  instructor?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  priceRange?: { min: number; max: number };
  durationRange?: { min: number; max: number };
}

export interface ProgramSearchResult {
  programs: TrainingProgram[];
  total: number;
  page: number;
  limit: number;
  facets: {
    categories: Array<{ name: string; count: number }>;
    difficulties: Array<{ name: string; count: number }>;
    types: Array<{ name: string; count: number }>;
    instructors: Array<{ name: string; count: number }>;
  };
}

export interface ProgramRecommendation {
  program: TrainingProgram;
  score: number;
  reasons: string[];
}

export interface ProgramImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export interface ProgramExportOptions {
  format: 'csv' | 'excel' | 'json';
  includeModules?: boolean;
  includeAssessments?: boolean;
  includeAnalytics?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ProgramSharingSettings {
  isPublic: boolean;
  allowEnrollment: boolean;
  requireApproval: boolean;
  maxEnrollments: number;
  startDate: string;
  endDate: string;
  allowedGroups: string[];
  allowedRoles: string[];
  allowedDomains: string[];
  password?: string;
  accessCode?: string;
}

export interface ProgramPrerequisites {
  programs: string[]; // program IDs
  skills: string[];
  certifications: string[];
  experience: {
    years: number;
    field: string;
  };
  customRequirements: string[];
}

export interface ProgramSchedule {
  id: string;
  programId: string;
  type: 'one-time' | 'recurring' | 'self-paced';
  startDate: string;
  endDate?: string;
  sessions: ProgramSession[];
  timezone: string;
  maxParticipants?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramSession {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  instructor: string;
  location?: string;
  meetingUrl?: string;
  materials: string[]; // material IDs
  isRequired: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ProgramNotification {
  id: string;
  programId: string;
  type: 'enrollment' | 'completion' | 'reminder' | 'announcement' | 'assessment';
  title: string;
  message: string;
  recipients: 'all' | 'enrolled' | 'instructors' | 'admins' | string[];
  channels: 'email' | 'sms' | 'push' | 'in-app';
  scheduledAt?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
} 