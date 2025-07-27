import apiClient from './apiClient';
import { ApiResponse } from '../types/api';
import { Poll, PollResponse, PollFeedback, Notification } from '../types/polls';
import { AuthResponse } from '../types/api';

// Database Status Types
export interface DatabaseStatus {
  isConnected: boolean;
  retryAttempts: number;
  maxRetryAttempts: number;
  connectionState: number;
  databaseName: string;
  host: string;
  port: number;
  timestamp: string;
}

export interface DatabaseHealth {
  status: string;
  message: string;
  timestamp: string;
  stats?: {
    collections: number;
    dataSize: number;
    storageSize: number;
    indexes: number;
    indexSize: number;
  };
}

export interface DatabaseTest {
  success: boolean;
  message: string;
  collections: number;
  serverStatus: {
    version: string;
    uptime: number;
    connections: {
      current: number;
      available: number;
    };
  };
  timestamp: string;
}

export interface DatabaseMonitorData {
  status: DatabaseStatus;
  health: DatabaseHealth;
  test: DatabaseTest;
  timestamp: string;
}

// User Types
export interface User {
  _id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'trainer' | 'participant' | 'admin';
  preferences?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Health Check Types
export interface HealthCheck {
  status: string;
  timestamp: string;
  service: string;
  version: string;
  database?: {
    status: DatabaseStatus;
    health: DatabaseHealth;
  };
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
  name: string;
  email: string;
  role: 'leader' | 'member' | 'observer';
  joinedAt: Date;
}

export interface GroupPerformanceMetrics {
  averageScore: number;
  completionRate: number;
  participationRate: number;
  totalSessions: number;
  totalAssessments: number;
  improvementTrend: 'improving' | 'stable' | 'declining';
  lastUpdated: Date;
}

// Presentation Management Types
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
  name: string;
  email: string;
  joinedAt: Date;
  isActive: boolean;
  lastActivity: Date;
}

export interface LivePoll {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'rating' | 'open_ended' | 'word_cloud';
  options?: string[];
  isActive: boolean;
  timeLimit?: number;
  createdAt: Date;
  responses: PollResponse[];
  results: PollResults;
}

export interface PollResults {
  totalResponses: number;
  averageRating?: number;
  optionCounts?: Record<string, number>;
  wordCloud?: Array<{ word: string; count: number }>;
}

export interface PresentationAnalytics {
  totalParticipants: number;
  averageEngagement: number;
  totalPolls: number;
  averageResponseRate: number;
  duration: number;
}

// Training Management Types
export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  instructor: User;
  date: Date;
  duration: number;
  participants: User[];
  maxParticipants: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'workshop' | 'seminar' | 'hands-on' | 'assessment';
  category: string;
  materials: TrainingMaterial[];
  location?: string;
  meetingLink?: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  instructor: User;
  modules: CourseModule[];
  enrolledParticipants: User[];
  maxEnrollment: number;
  status: 'active' | 'inactive' | 'completed';
  category: string;
  rating: number;
  totalDuration: number;
  thumbnail?: string;
  prerequisites?: string[];
  learningObjectives: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'interactive';
  duration: number;
  content: string;
  isRequired: boolean;
  order: number;
  materials: TrainingMaterial[];
}

export interface TrainingMaterial {
  id: string;
  title: string;
  type: 'video' | 'document' | 'presentation' | 'link' | 'file';
  url: string;
  size?: number;
  duration?: number;
  description: string;
}

// AI Content Creation Types
export interface ContentItem {
  id: string;
  title: string;
  type: 'text' | 'image' | 'video' | 'audio';
  category: string;
  createdAt: string;
  lastModified: string;
  status: 'draft' | 'published' | 'archived';
  size: string;
  tags: string[];
}

export interface ContentGenerationOptions {
  tone?: 'professional' | 'casual' | 'formal' | 'friendly';
  length?: 'short' | 'medium' | 'long';
  style?: 'informative' | 'persuasive' | 'narrative' | 'technical';
  language?: 'english' | 'spanish' | 'french' | 'german';
}

// Analytics Types
export interface DashboardAnalytics {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growthRate: number;
  };
  groups: {
    total: number;
    active: number;
    averageMembers: number;
  };
  training: {
    totalSessions: number;
    completedSessions: number;
    averageRating: number;
    totalParticipants: number;
  };
  content: {
    totalGenerated: number;
    published: number;
    averageQuality: number;
  };
  performance: {
    averageCompletionRate: number;
    averageResponseRate: number;
    averageEngagement: number;
  };
}

// API Service Class
class ApiServices {
  // Health and Status Endpoints
  async getHealth(): Promise<ApiResponse<HealthCheck>> {
    return apiClient.get('/health');
  }

  async getDetailedHealth(): Promise<ApiResponse<HealthCheck>> {
    return apiClient.get('/health/detailed');
  }

  async getDatabaseStatus(): Promise<ApiResponse<DatabaseMonitorData>> {
    return apiClient.get('/database/status');
  }

  // User Registration API
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    company?: string;
    role?: string;
    marketingConsent?: boolean;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post('/auth/register', userData);
    if (response.success && response.data) {
      const authData = response.data as AuthResponse;
      if (authData.token) {
        apiClient.setAuthToken(authData.token);
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
    }
    return response as ApiResponse<AuthResponse>;
  }

  // Email Verification API
  async resendVerificationEmail(data: {
    email: string;
    registrationId: string;
  }): Promise<ApiResponse<any>> {
    return apiClient.post('/auth/resend-verification', data);
  }

  async checkEmailVerification(registrationId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/auth/verification-status/${registrationId}`);
  }

  async verifyEmail(token: string): Promise<ApiResponse<any>> {
    return apiClient.post('/auth/verify-email', { token });
  }

  // Password Reset API
  async forgotPassword(data: { email: string }): Promise<ApiResponse<any>> {
    return apiClient.post('/auth/forgot-password', data);
  }

  async resetPassword(data: { token: string; password: string }): Promise<ApiResponse<any>> {
    return apiClient.post('/auth/reset-password', data);
  }

  // Authentication
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.success && response.data) {
      const authData = response.data as AuthResponse;
      if (authData.token) {
        apiClient.setAuthToken(authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
    }
    return response as ApiResponse<AuthResponse>;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/auth/logout', {});
    apiClient.setAuthToken(null);
    localStorage.removeItem('user');
    return response as ApiResponse<void>;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/me');
  }

  // Users API
  async getUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get('/users');
  }

  async getUser(userId: string): Promise<ApiResponse<User>> {
    return apiClient.get(`/users/${userId}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.post('/users', userData);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put(`/users/${userId}`, userData);
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/users/${userId}`);
  }

  async bulkUserAction(userIds: string[], action: string, data?: any): Promise<ApiResponse<any>> {
    return apiClient.post('/users/bulk-action', { userIds, action, data });
  }

  async getUserHealth(userId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/users/${userId}/health`);
  }

  async resetUserPassword(userId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/users/${userId}/reset-password`);
  }

  async suspendUser(userId: string, reason?: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/users/${userId}/suspend`, { reason });
  }

  async activateUser(userId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/users/${userId}/activate`);
  }

  // Tenant Management API
  async createTenant(tenantData: any): Promise<ApiResponse<any>> {
    return apiClient.post('/v1/tenants/create', tenantData);
  }

  async getTenants(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/v1/tenants');
  }

  async getTenant(tenantId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/v1/tenants/${tenantId}`);
  }

  async updateTenant(tenantId: string, tenantData: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/v1/tenants/${tenantId}`, tenantData);
  }

  async deleteTenant(tenantId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/v1/tenants/${tenantId}`);
  }



  async getTenantUsers(tenantId: string): Promise<ApiResponse<User[]>> {
    return apiClient.get(`/tenants/${tenantId}/users`);
  }

  async getTenantSettings(tenantId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/tenants/${tenantId}/settings`);
  }

  async updateTenantSettings(tenantId: string, settings: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/tenants/${tenantId}/settings`, settings);
  }

  // Group Management API
  async getGroups(): Promise<ApiResponse<Group[]>> {
    return apiClient.get('/groups');
  }

  async getGroup(groupId: string): Promise<ApiResponse<Group>> {
    return apiClient.get(`/groups/${groupId}`);
  }

  async createGroup(groupData: Partial<Group>): Promise<ApiResponse<Group>> {
    return apiClient.post('/groups', groupData);
  }

  async updateGroup(groupId: string, groupData: Partial<Group>): Promise<ApiResponse<Group>> {
    return apiClient.put(`/groups/${groupId}`, groupData);
  }

  async deleteGroup(groupId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/groups/${groupId}`);
  }

  async addMemberToGroup(groupId: string, memberData: { userId: string; role: string }): Promise<ApiResponse<any>> {
    return apiClient.post(`/groups/${groupId}/members`, memberData);
  }

  async removeMemberFromGroup(groupId: string, userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/groups/${groupId}/members/${userId}`);
  }

  async getGroupPerformance(groupId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/groups/${groupId}/performance`);
  }

  async getGroupMembers(groupId: string): Promise<ApiResponse<GroupMember[]>> {
    return apiClient.get(`/groups/${groupId}/members`);
  }

  async updateMemberRole(groupId: string, userId: string, role: string): Promise<ApiResponse<any>> {
    return apiClient.put(`/groups/${groupId}/members/${userId}`, { role });
  }

  // Presentation Management API
  async getPresentations(): Promise<ApiResponse<LivePresentation[]>> {
    return apiClient.get('/presentations');
  }

  async getPresentation(presentationId: string): Promise<ApiResponse<LivePresentation>> {
    return apiClient.get(`/presentations/${presentationId}`);
  }

  async createPresentation(presentationData: Partial<LivePresentation>): Promise<ApiResponse<LivePresentation>> {
    return apiClient.post('/presentations', presentationData);
  }

  async updatePresentation(presentationId: string, presentationData: Partial<LivePresentation>): Promise<ApiResponse<LivePresentation>> {
    return apiClient.put(`/presentations/${presentationId}`, presentationData);
  }

  async deletePresentation(presentationId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/presentations/${presentationId}`);
  }

  async startPresentation(presentationId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/presentations/${presentationId}/start`);
  }

  async endPresentation(presentationId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/presentations/${presentationId}/end`);
  }

  async addPollToPresentation(presentationId: string, pollData: Partial<LivePoll>): Promise<ApiResponse<LivePoll>> {
    return apiClient.post(`/presentations/${presentationId}/polls`, pollData);
  }

  async activatePoll(presentationId: string, pollId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/presentations/${presentationId}/polls/${pollId}/activate`);
  }

  async deactivatePoll(presentationId: string, pollId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/presentations/${presentationId}/polls/${pollId}/deactivate`);
  }



  async getPollResults(presentationId: string, pollId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/presentations/${presentationId}/polls/${pollId}/results`);
  }

  // Training Management API
  async getTrainingSessions(): Promise<ApiResponse<TrainingSession[]>> {
    return apiClient.get('/training/sessions');
  }

  async getTrainingSession(sessionId: string): Promise<ApiResponse<TrainingSession>> {
    return apiClient.get(`/training/sessions/${sessionId}`);
  }

  async createTrainingSession(sessionData: Partial<TrainingSession>): Promise<ApiResponse<TrainingSession>> {
    return apiClient.post('/training/sessions', sessionData);
  }

  async updateTrainingSession(sessionId: string, sessionData: Partial<TrainingSession>): Promise<ApiResponse<TrainingSession>> {
    return apiClient.put(`/training/sessions/${sessionId}`, sessionData);
  }

  async deleteTrainingSession(sessionId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/training/sessions/${sessionId}`);
  }

  async getTrainingCourses(): Promise<ApiResponse<TrainingCourse[]>> {
    return apiClient.get('/training/courses');
  }

  async getTrainingCourse(courseId: string): Promise<ApiResponse<TrainingCourse>> {
    return apiClient.get(`/training/courses/${courseId}`);
  }

  async createTrainingCourse(courseData: Partial<TrainingCourse>): Promise<ApiResponse<TrainingCourse>> {
    return apiClient.post('/training/courses', courseData);
  }

  async enrollInCourse(courseId: string, participantId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/training/courses/${courseId}/enroll`, { participantId });
  }

  async getParticipantProgress(courseId: string, participantId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/training/courses/${courseId}/participants/${participantId}/progress`);
  }

  async completeModule(courseId: string, moduleId: string, participantId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/training/courses/${courseId}/modules/${moduleId}/complete`, { participantId });
  }

  async submitAssessment(assessmentId: string, submission: any): Promise<ApiResponse<any>> {
    return apiClient.post(`/training/assessments/${assessmentId}/submit`, submission);
  }

  async getTrainerStats(trainerId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/training/trainers/${trainerId}/stats`);
  }

  async getParticipantStats(participantId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/training/participants/${participantId}/stats`);
  }

  async getLearningPaths(): Promise<ApiResponse<any>> {
    return apiClient.get('/training/learning-paths');
  }

  async getAssessments(): Promise<ApiResponse<any>> {
    return apiClient.get('/training/assessments');
  }

  async startModule(programId: string, moduleId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/training/programs/${programId}/modules/${moduleId}/start`);
  }



  async startAssessment(assessmentId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/training/assessments/${assessmentId}/start`);
  }

  async downloadCertificate(programId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/training/programs/${programId}/certificate`);
  }

  // AI Content Creation API
  async generateContent(type: string, prompt: string, options?: ContentGenerationOptions): Promise<ApiResponse<any>> {
    return apiClient.post('/ai/generate/content', { type, prompt, options });
  }

  async generateTrainingMaterial(topic: string, context?: string): Promise<ApiResponse<any>> {
    return apiClient.post('/ai/generate/training-material', { topic, context });
  }

  async generateAssessmentQuestions(topic: string, questionCount?: number): Promise<ApiResponse<any>> {
    return apiClient.post('/ai/generate/assessment-questions', { topic, questionCount });
  }

  async generatePresentationOutline(topic: string): Promise<ApiResponse<any>> {
    return apiClient.post('/ai/generate/presentation-outline', { topic });
  }

  async improveContent(content: string, improvementType: string): Promise<ApiResponse<any>> {
    return apiClient.post('/ai/improve/content', { content, improvementType });
  }

  async translateContent(content: string, targetLanguage: string): Promise<ApiResponse<any>> {
    return apiClient.post('/ai/translate/content', { content, targetLanguage });
  }

  async saveContentToLibrary(contentData: any): Promise<ApiResponse<any>> {
    return apiClient.post('/ai/content/save', contentData);
  }

  async getContentLibrary(filters?: any): Promise<ApiResponse<ContentItem[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const queryString = params.toString();
    const endpoint = `/ai/content/library${queryString ? `?${queryString}` : ''}`;
    return apiClient.get(endpoint);
  }

  // Analytics API
  async getDashboardAnalytics(): Promise<ApiResponse<DashboardAnalytics>> {
    return apiClient.get('/analytics/dashboard');
  }

  async getUserAnalytics(): Promise<ApiResponse<any>> {
    return apiClient.get('/analytics/users');
  }

  async getGroupAnalytics(): Promise<ApiResponse<any>> {
    return apiClient.get('/analytics/groups');
  }

  async getTrainingAnalytics(): Promise<ApiResponse<any>> {
    return apiClient.get('/analytics/training');
  }

  async getPerformanceAnalytics(): Promise<ApiResponse<any>> {
    return apiClient.get('/analytics/performance');
  }

  async generateCustomReport(reportData: any): Promise<ApiResponse<any>> {
    return apiClient.post('/analytics/reports', reportData);
  }

  async exportAnalyticsData(): Promise<ApiResponse<any>> {
    return apiClient.get('/analytics/export');
  }



  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return apiClient.put('/notifications/read-all');
  }

  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/notifications/${notificationId}`);
  }

  async getNotificationSettings(): Promise<ApiResponse<any>> {
    return apiClient.get('/notifications/settings');
  }

  async updateNotificationSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put('/notifications/settings', settings);
  }

  // Settings API
  async getUserSettings(): Promise<ApiResponse<any>> {
    return apiClient.get('/settings/user');
  }

  async updateUserSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put('/settings/user', settings);
  }

  async getAccountSettings(): Promise<ApiResponse<any>> {
    return apiClient.get('/settings/account');
  }

  async updateAccountSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put('/settings/account', settings);
  }

  async getSystemSettings(): Promise<ApiResponse<any>> {
    return apiClient.get('/settings/system');
  }

  async updateSystemSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put('/settings/system', settings);
  }

  // File Management API
  async uploadFile(file: File, type: string, category: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('category', category);
    return apiClient.post('/files/upload', formData);
  }

  async getFile(fileId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/files/${fileId}`);
  }

  async deleteFile(fileId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/files/${fileId}`);
  }

  async getFileList(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/files');
  }

  // Search API
  async globalSearch(query: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/search?q=${encodeURIComponent(query)}`);
  }

  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    return apiClient.get(`/search/users?q=${encodeURIComponent(query)}`);
  }

  async searchGroups(query: string): Promise<ApiResponse<Group[]>> {
    return apiClient.get(`/search/groups?q=${encodeURIComponent(query)}`);
  }

  async searchTrainingContent(query: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`/search/training?q=${encodeURIComponent(query)}`);
  }

  // Export/Import API
  async exportData(type: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/export/${type}`);
  }

  async importData(type: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/import/${type}`, formData);
  }

  async getExportStatus(exportId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/export/status/${exportId}`);
  }

  // Polls API (existing)
  async getPolls(tenantId: string): Promise<ApiResponse<Poll[]>> {
    return apiClient.get(`/polls/${tenantId}`);
  }

  async getPoll(tenantId: string, pollId: string): Promise<ApiResponse<Poll>> {
    return apiClient.get(`/polls/${tenantId}/${pollId}`);
  }

  async createPoll(tenantId: string, pollData: Partial<Poll>): Promise<ApiResponse<Poll>> {
    return apiClient.post(`/polls/${tenantId}`, pollData);
  }

  async updatePoll(tenantId: string, pollId: string, pollData: Partial<Poll>): Promise<ApiResponse<Poll>> {
    return apiClient.put(`/polls/${tenantId}/${pollId}`, pollData);
  }

  async deletePoll(tenantId: string, pollId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/polls/${tenantId}/${pollId}`);
  }

  async getPollStats(tenantId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/polls/${tenantId}/stats`);
  }

  // Poll Responses
  async submitPollResponse(
    tenantId: string, 
    pollId: string, 
    response: Partial<PollResponse>
  ): Promise<ApiResponse<PollResponse>> {
    return apiClient.post(`/polls/${tenantId}/${pollId}/response`, response);
  }

  async getPollResponses(tenantId: string, pollId: string): Promise<ApiResponse<PollResponse[]>> {
    return apiClient.get(`/polls/${tenantId}/${pollId}/responses`);
  }

  // Poll Feedback
  async submitPollFeedback(
    tenantId: string, 
    pollId: string, 
    feedback: Partial<PollFeedback>
  ): Promise<ApiResponse<PollFeedback>> {
    return apiClient.post(`/polls/${tenantId}/${pollId}/feedback`, feedback);
  }

  async getPollFeedback(tenantId: string, pollId: string): Promise<ApiResponse<PollFeedback[]>> {
    return apiClient.get(`/polls/${tenantId}/${pollId}/feedback`);
  }

  // Notifications (existing)
  async getNotifications(
    tenantId: string, 
    options?: { page?: number; limit?: number; unreadOnly?: boolean }
  ): Promise<ApiResponse<Notification[]>> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.unreadOnly) params.append('unreadOnly', options.unreadOnly.toString());
    
    const queryString = params.toString();
    const endpoint = `/polls/${tenantId}/notifications${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  }

  async markNotificationAsRead(
    tenantId: string, 
    notificationId: string
  ): Promise<ApiResponse<void>> {
    return apiClient.put(`/polls/${tenantId}/notifications/${notificationId}/read`, {});
  }

  // Poll Actions
  async sendPoll(tenantId: string, pollId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/polls/${tenantId}/${pollId}/send`, {});
  }

  // Utility methods
  async checkApiConnection(): Promise<ApiResponse<{ connected: boolean; timestamp: string }>> {
    try {
      const healthResponse = await this.getHealth();
      return {
        success: healthResponse.success,
        data: {
          connected: healthResponse.success,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {
          connected: false,
          timestamp: new Date().toISOString(),
        },
        error: 'Failed to connect to API',
      };
    }
  }

  // Poll Management with advanced features
  async duplicatePoll(tenantId: string, pollId: string): Promise<ApiResponse<Poll>> {
    const originalPoll = await this.getPoll(tenantId, pollId);
    if (!originalPoll.success || !originalPoll.data) {
      return {
        success: false,
        error: 'Failed to fetch original poll',
      };
    }

    const duplicatedPoll: Partial<Poll> = {
      ...originalPoll.data,
      title: `${originalPoll.data.title} (Copy)`,
      status: 'draft' as any,
      responses: [],
      feedback: [],
      notifications: [],
      createdAt: undefined,
      updatedAt: undefined,
    };

    return this.createPoll(tenantId, duplicatedPoll);
  }

  async archivePoll(tenantId: string, pollId: string): Promise<ApiResponse<Poll>> {
    return this.updatePoll(tenantId, pollId, { status: 'archived' as any });
  }

  async restorePoll(tenantId: string, pollId: string): Promise<ApiResponse<Poll>> {
    return this.updatePoll(tenantId, pollId, { status: 'draft' as any });
  }

  // Analytics and Reporting
  async getPollAnalytics(tenantId: string, pollId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/polls/${tenantId}/${pollId}/analytics`);
  }

  async getTenantAnalytics(tenantId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/analytics/${tenantId}`);
  }

  // Export functionality
  async exportPollData(tenantId: string, pollId: string, format: 'csv' | 'json' = 'csv'): Promise<ApiResponse<string>> {
    return apiClient.get(`/polls/${tenantId}/${pollId}/export?format=${format}`);
  }

  // Bulk operations
  async bulkDeletePolls(tenantId: string, pollIds: string[]): Promise<ApiResponse<{ deleted: number; failed: number }>> {
    return apiClient.post(`/polls/${tenantId}/bulk-delete`, { pollIds });
  }

  async bulkUpdatePolls(tenantId: string, pollIds: string[], updates: Partial<Poll>): Promise<ApiResponse<{ updated: number; failed: number }>> {
    return apiClient.put(`/polls/${tenantId}/bulk-update`, { pollIds, updates });
  }
}

// Create singleton instance
const apiServices = new ApiServices();

export default apiServices; 