/**
 * Training Program Manager - Type Definitions
 * TypeScript interfaces and types for training program management
 */

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  status: 'draft' | 'published' | 'archived' | 'suspended';
  type: 'course' | 'workshop' | 'seminar' | 'bootcamp';
  instructor: string | null;
  maxEnrollments: number;
  currentEnrollments: number;
  price: number;
  currency: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  targetAudience: string[];
  materials: TrainingMaterial[];
  modules: TrainingModule[];
  assessments: TrainingAssessment[];
  certificates: TrainingCertificate[];
  banner: string | null;
  thumbnail: string | null;
  isActive: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  analytics: TrainingProgramAnalytics;
  metadata: TrainingProgramMetadata;
  settings: TrainingProgramSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingProgramFormData {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  status: 'draft' | 'published' | 'archived' | 'suspended';
  type: 'course' | 'workshop' | 'seminar' | 'bootcamp';
  instructor: string | null;
  maxEnrollments: number;
  price: number;
  currency: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  targetAudience: string[];
  materials: TrainingMaterial[];
  modules: TrainingModule[];
  assessments: TrainingAssessment[];
  certificates: TrainingCertificate[];
  banner: string | null;
  thumbnail: string | null;
  isActive: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  settings: TrainingProgramSettings;
}

export interface TrainingProgramFilters {
  status?: 'draft' | 'published' | 'archived' | 'suspended';
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  type?: 'course' | 'workshop' | 'seminar' | 'bootcamp';
  instructor?: string;
  search?: string;
  tags?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  durationRange?: {
    min: number;
    max: number;
  };
  isActive?: boolean;
  isPublic?: boolean;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TrainingProgramStats {
  total: number;
  active: number;
  draft: number;
  published: number;
  totalEnrollments: number;
  totalViews: number;
  averageRating: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byLevel: Record<string, number>;
}

export interface TrainingMaterial {
  id: string;
  name: string;
  type: 'document' | 'video' | 'audio' | 'code' | 'link';
  url: string;
  description?: string;
  size?: number;
  duration?: number; // for video/audio
  order: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  estimatedDuration: number; // in minutes
  order: number;
  content: string;
  materials: string[]; // material IDs
  isRequired: boolean;
  isPublished: boolean;
  prerequisites: string[]; // module IDs
}

export interface TrainingAssessment {
  id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'assignment' | 'project' | 'exam';
  questions?: number;
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number; // in minutes
  isRequired: boolean;
  isPublished: boolean;
}

export interface TrainingCertificate {
  id: string;
  name: string;
  description: string;
  template: string;
  requirements: {
    completionRate: number;
    passingScore: number;
    attendanceRate?: number;
  };
  isActive: boolean;
}

export interface TrainingProgramAnalytics {
  views: number;
  enrollments: number;
  completions: number;
  rating: number;
  totalRatings: number;
  completionRate: number;
  averageCompletionTime?: number;
  dropOffPoints?: Array<{
    module: string;
    dropOffRate: number;
  }>;
  feedback?: Array<{
    rating: number;
    comment: string;
    userId: string;
    createdAt: Date;
  }>;
}

export interface TrainingProgramMetadata {
  createdBy: string;
  lastModifiedBy: string;
  version: number;
  language: string;
  timezone: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface TrainingProgramSettings {
  allowEnrollment: boolean;
  requireApproval: boolean;
  maxAttempts: number;
  passingScore: number;
  allowRetake: boolean;
  showProgress: boolean;
  enableNotifications: boolean;
  enrollmentDeadline?: Date;
  startDate?: Date;
  endDate?: Date;
  prerequisites?: string[];
  coInstructors?: string[];
  assistants?: string[];
}

export interface TrainingProgramReport {
  summary: {
    totalPrograms: number;
    activePrograms: number;
    totalEnrollments: number;
    averageRating: number;
  };
  topPrograms: Array<{
    id: string;
    title: string;
    enrollments: number;
    rating: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

export interface TrainingProgramSearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  status: string;
  duration: string;
  price: string;
  thumbnail: string | null;
  tags: string[];
  relevanceScore: number;
  highlights: string[];
}

export interface TrainingProgramTableData {
  id: string;
  title: string;
  category: string;
  level: string;
  status: string;
  duration: string;
  price: string;
  enrollments: string;
  completionRate: string;
  rating: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingProgramCardData {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  status: string;
  duration: string;
  price: string;
  thumbnail: string | null;
  banner: string | null;
  tags: string[];
  enrollmentProgress: number;
  rating: number;
  totalRatings: number;
  isActive: boolean;
  isPublic: boolean;
  isFeatured: boolean;
}

export interface TrainingProgramFormErrors {
  title?: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
  price?: string;
  maxEnrollments?: string;
  general?: string;
}

export interface TrainingProgramValidationResult {
  isValid: boolean;
  errors: TrainingProgramFormErrors;
}

export interface TrainingProgramPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TrainingProgramListResponse {
  programs: TrainingProgram[];
  pagination: TrainingProgramPagination;
}

export interface TrainingProgramSearchResponse {
  programs: TrainingProgramSearchResult[];
  total: number;
  pagination: TrainingProgramPagination;
}

export interface TrainingProgramStatsResponse {
  stats: TrainingProgramStats;
  report: TrainingProgramReport;
}

export interface TrainingProgramExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  fields: string[];
  filters?: TrainingProgramFilters;
  includeAnalytics?: boolean;
}

export interface TrainingProgramImportOptions {
  format: 'csv' | 'excel';
  updateExisting?: boolean;
  validateData?: boolean;
}

export interface TrainingProgramBulkAction {
  action: 'delete' | 'publish' | 'archive' | 'activate' | 'deactivate';
  programIds: string[];
  options?: Record<string, any>;
}

export interface TrainingProgramBulkActionResult {
  success: string[];
  failed: Array<{
    id: string;
    error: string;
  }>;
}

export interface TrainingProgramNotification {
  id: string;
  type: 'enrollment' | 'completion' | 'deadline' | 'update';
  programId: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface TrainingProgramActivity {
  id: string;
  type: 'created' | 'updated' | 'published' | 'archived' | 'enrolled' | 'completed';
  programId: string;
  userId: string;
  details: Record<string, any>;
  timestamp: Date;
}

export interface TrainingProgramTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  modules: Omit<TrainingModule, 'id'>[];
  assessments: Omit<TrainingAssessment, 'id'>[];
  settings: TrainingProgramSettings;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface TrainingProgramCloneOptions {
  newTitle: string;
  newInstructor?: string;
  copyModules?: boolean;
  copyAssessments?: boolean;
  copySettings?: boolean;
  resetAnalytics?: boolean;
}

export interface TrainingProgramDuplicateResult {
  originalId: string;
  newId: string;
  newTitle: string;
  success: boolean;
  error?: string;
}
