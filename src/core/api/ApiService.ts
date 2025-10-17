/**
 * ROBUST API SERVICE
 * Centralized API service with consistent error handling and type safety
 */

import apiClient, { ApiResponse } from './ApiClient';

// Base API Service Class
export abstract class BaseApiService {
  protected baseUrl: string;
  protected tenantId?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setTenantId(tenantId: string): void {
    this.tenantId = tenantId;
  }

  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return await apiClient.get<T>(url, { params });
  }

  protected async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return await apiClient.post<T>(url, data);
  }

  protected async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return await apiClient.put<T>(url, data);
  }

  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return await apiClient.delete<T>(url);
  }

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }
}

// Tenant API Service
export class TenantApiService extends BaseApiService {
  constructor() {
    super('/api/tenants');
  }

  // Get all tenants
  async getTenants(): Promise<ApiResponse<any[]>> {
    return await this.get<any[]>('');
  }

  // Get tenant by ID
  async getTenant(tenantId: string): Promise<ApiResponse<any>> {
    return await this.get<any>(`/${tenantId}`);
  }

  // Create tenant
  async createTenant(tenantData: any): Promise<ApiResponse<any>> {
    return await this.post<any>('', tenantData);
  }

  // Update tenant
  async updateTenant(tenantId: string, updates: any): Promise<ApiResponse<any>> {
    return await this.put<any>(`/${tenantId}`, updates);
  }

  // Delete tenant
  async deleteTenant(tenantId: string): Promise<ApiResponse<void>> {
    return await this.delete<void>(`/${tenantId}`);
  }

  // Get tenant users
  async getTenantUsers(tenantId: string): Promise<ApiResponse<any[]>> {
    return await this.get<any[]>(`/${tenantId}/users`);
  }

  // Add user to tenant
  async addUserToTenant(tenantId: string, userData: any): Promise<ApiResponse<any>> {
    return await this.post<any>(`/${tenantId}/users`, userData);
  }

  // Remove user from tenant
  async removeUserFromTenant(tenantId: string, userId: string): Promise<ApiResponse<void>> {
    return await this.delete<void>(`/${tenantId}/users/${userId}`);
  }

  // Get tenant settings
  async getTenantSettings(tenantId: string): Promise<ApiResponse<any>> {
    return await this.get<any>(`/${tenantId}/settings`);
  }

  // Update tenant settings
  async updateTenantSettings(tenantId: string, settings: any): Promise<ApiResponse<any>> {
    return await this.put<any>(`/${tenantId}/settings`, settings);
  }

  // Get tenant health
  async getTenantHealth(tenantId: string): Promise<ApiResponse<any>> {
    return await this.get<any>(`/${tenantId}/health`);
  }

  // Get tenant analytics
  async getTenantAnalytics(tenantId: string, period: string = 'monthly'): Promise<ApiResponse<any>> {
    return await this.get<any>(`/${tenantId}/analytics?period=${period}`);
  }
}

// User API Service
export class UserApiService extends BaseApiService {
  constructor() {
    super('/api/users');
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<any>> {
    return await this.get<any>('/me');
  }

  // Update user profile
  async updateProfile(userData: any): Promise<ApiResponse<any>> {
    return await this.put<any>('/me', userData);
  }

  // Change password
  async changePassword(passwordData: any): Promise<ApiResponse<void>> {
    return await this.post<void>('/me/password', passwordData);
  }

  // Get user preferences
  async getPreferences(): Promise<ApiResponse<any>> {
    return await this.get<any>('/me/preferences');
  }

  // Update user preferences
  async updatePreferences(preferences: any): Promise<ApiResponse<any>> {
    return await this.put<any>('/me/preferences', preferences);
  }
}

// Auth API Service
export class AuthApiService extends BaseApiService {
  constructor() {
    super('/api/auth');
  }

  // Login
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<any>> {
    const response = await this.post<any>('/login', credentials);
    
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // Register
  async register(userData: any): Promise<ApiResponse<any>> {
    const response = await this.post<any>('/register', userData);
    
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // Logout
  async logout(): Promise<ApiResponse<void>> {
    const response = await this.post<void>('/logout');
    apiClient.setAuthToken(null);
    return response;
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<any>> {
    return await this.post<any>('/refresh');
  }

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return await this.post<void>('/forgot-password', { email });
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return await this.post<void>('/reset-password', { token, newPassword });
  }

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return await this.post<void>('/verify-email', { token });
  }

  // Resend verification
  async resendVerification(email: string): Promise<ApiResponse<void>> {
    return await this.post<void>('/resend-verification', { email });
  }
}

// Content API Service
export class ContentApiService extends BaseApiService {
  constructor() {
    super('/api/content');
  }

  // Get content
  async getContent(contentId: string): Promise<ApiResponse<any>> {
    return await this.get<any>(`/${contentId}`);
  }

  // Create content
  async createContent(contentData: any): Promise<ApiResponse<any>> {
    return await this.post<any>('', contentData);
  }

  // Update content
  async updateContent(contentId: string, updates: any): Promise<ApiResponse<any>> {
    return await this.put<any>(`/${contentId}`, updates);
  }

  // Delete content
  async deleteContent(contentId: string): Promise<ApiResponse<void>> {
    return await this.delete<void>(`/${contentId}`);
  }

  // Get content list
  async getContentList(filters?: any): Promise<ApiResponse<any[]>> {
    return await this.get<any[]>('', filters);
  }
}

// Analytics API Service
export class AnalyticsApiService extends BaseApiService {
  constructor() {
    super('/api/analytics');
  }

  // Get dashboard data
  async getDashboardData(): Promise<ApiResponse<any>> {
    return await this.get<any>('/dashboard');
  }

  // Get user analytics
  async getUserAnalytics(period: string = 'monthly'): Promise<ApiResponse<any>> {
    return await this.get<any>(`/users?period=${period}`);
  }

  // Get content analytics
  async getContentAnalytics(period: string = 'monthly'): Promise<ApiResponse<any>> {
    return await this.get<any>(`/content?period=${period}`);
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<ApiResponse<any>> {
    return await this.get<any>('/performance');
  }
}

// Job API Service
export class JobApiService extends BaseApiService {
  constructor() {
    super('/api/jobs');
  }

  async getJobs(params?: any): Promise<ApiResponse<any[]>> {
    return await this.get<any[]>('', params);
  }

  async getJob(jobId: string): Promise<ApiResponse<any>> {
    return await this.get<any>(`/${jobId}`);
  }

  async createJob(jobData: any): Promise<ApiResponse<any>> {
    return await this.post<any>('', jobData);
  }

  async updateJob(jobId: string, updates: any): Promise<ApiResponse<any>> {
    return await this.put<any>(`/${jobId}`, updates);
  }

  async deleteJob(jobId: string): Promise<ApiResponse<void>> {
    return await this.delete<void>(`/${jobId}`);
  }
}

// Export service instances
export const tenantApiService = new TenantApiService();
export const userApiService = new UserApiService();
export const authApiService = new AuthApiService();
export const contentApiService = new ContentApiService();
export const analyticsApiService = new AnalyticsApiService();
export const jobApiService = new JobApiService();

// Helper function to standardize response format
const createResponse = (response: ApiResponse<any>) => ({
  success: response.success,
  data: response.data,
  message: response.message || (response.success ? 'Success' : 'Request failed'),
  error: response.error,
  timestamp: response.timestamp,
  pagination: response.pagination || null
});

// Export all services
export const apiServices = {
  tenant: tenantApiService,
  user: userApiService,
  auth: authApiService,
  content: contentApiService,
  analytics: analyticsApiService,
  jobs: jobApiService,
  // Backward compatibility methods
  getJobs: async (params?: any) => {
    const response = await jobApiService.getJobs(params);
    return createResponse({ ...response, data: response.data || [] });
  },
  getJob: async (jobId: string) => {
    const response = await jobApiService.getJob(jobId);
    return createResponse(response);
  },
  createJob: async (jobData: any) => {
    const response = await jobApiService.createJob(jobData);
    return createResponse(response);
  },
  updateJob: async (jobId: string, updates: any) => {
    const response = await jobApiService.updateJob(jobId, updates);
    return createResponse(response);
  },
  deleteJob: async (jobId: string) => {
    const response = await jobApiService.deleteJob(jobId);
    return createResponse(response);
  },
  getATSDashboard: async () => {
    const response = await analyticsApiService.getDashboardData();
    return { success: response.success, data: response.data };
  },
  getTrainingPrograms: async () => {
    const response = await contentApiService.getContentList({ type: 'training' });
    return { success: response.success, data: response.data || [] };
  },
  getNotifications: async (tenantId?: string, params?: any) => {
    const response = await contentApiService.getContentList({ ...params, type: 'notification', tenantId });
    return createResponse({ ...response, data: response.data || [] });
  },
  getPolls: async () => {
    const response = await contentApiService.getContentList({ type: 'poll' });
    return { success: response.success, data: response.data || [] };
  },
  getCurrentUser: async () => {
    const response = await userApiService.getCurrentUser();
    return { success: response.success, data: response.data };
  },
  // Additional backward compatibility methods
  getCandidates: async (params?: any) => {
    const response = await jobApiService.getJobs({ ...params, type: 'candidate' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getApplications: async (params?: any) => {
    const response = await jobApiService.getJobs({ ...params, type: 'application' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getResumes: async (params?: any) => {
    const response = await contentApiService.getContentList({ ...params, type: 'resume' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getFeedData: async () => {
    const response = await contentApiService.getContentList({ type: 'post' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getActivityFeed: async () => {
    const response = await contentApiService.getContentList({ type: 'activity' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getTrainingData: async () => {
    const response = await contentApiService.getContentList({ type: 'training' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getAssessmentData: async () => {
    const response = await contentApiService.getContentList({ type: 'assessment' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getPresentationData: async () => {
    const response = await contentApiService.getContentList({ type: 'presentation' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getGroupData: async () => {
    const response = await contentApiService.getContentList({ type: 'group' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getPerformanceData: async () => {
    const response = await analyticsApiService.getPerformanceMetrics();
    return createResponse(response);
  },
  getHealthCheck: async () => {
    const response = await analyticsApiService.getDashboardData();
    return createResponse(response);
  },
  getDatabaseStatus: async () => {
    const response = await analyticsApiService.getDashboardData();
    return createResponse(response);
  },
  checkApiConnection: async () => {
    const response = await analyticsApiService.getDashboardData();
    return createResponse(response);
  },
  // Additional methods for backward compatibility
  requestCandidateAccess: async (candidateId: string, reason: string) => {
    const response = await jobApiService.updateJob(candidateId, { accessRequest: { reason, status: 'pending' } });
    return createResponse(response);
  },
  approveCandidateAccess: async (candidateId: string) => {
    const response = await jobApiService.updateJob(candidateId, { accessRequest: { status: 'approved' } });
    return createResponse(response);
  },
  rejectCandidateAccess: async (candidateId: string) => {
    const response = await jobApiService.updateJob(candidateId, { accessRequest: { status: 'rejected' } });
    return createResponse(response);
  },
  uploadResume: async (formData: FormData) => {
    const response = await contentApiService.createContent({ type: 'resume', formData });
    return createResponse(response);
  },
  downloadResume: async (resumeId: string) => {
    const response = await contentApiService.getContent(resumeId);
    return createResponse(response);
  },
  createTrainingProgram: async (programData: any) => {
    const response = await contentApiService.createContent({ ...programData, type: 'training' });
    return { success: response.success, data: response.data };
  },
  updateTrainingProgram: async (programId: string, updates: any) => {
    const response = await contentApiService.updateContent(programId, updates);
    return { success: response.success, data: response.data };
  },
  deleteTrainingProgram: async (programId: string) => {
    const response = await contentApiService.deleteContent(programId);
    return { success: response.success };
  },
  createPoll: async (pollData: any) => {
    const response = await contentApiService.createContent({ ...pollData, type: 'poll' });
    return { success: response.success, data: response.data };
  },
  updatePoll: async (pollId: string, updates: any) => {
    const response = await contentApiService.updateContent(pollId, updates);
    return { success: response.success, data: response.data };
  },
  deletePoll: async (pollId: string) => {
    const response = await contentApiService.deleteContent(pollId);
    return { success: response.success };
  },
  submitPollResponse: async (pollId: string, responseData: any) => {
    const response = await contentApiService.updateContent(pollId, { responses: responseData });
    return { success: response.success, data: response.data };
  },
  createGroup: async (groupData: any) => {
    const response = await contentApiService.createContent({ ...groupData, type: 'group' });
    return { success: response.success, data: response.data };
  },
  updateGroup: async (groupId: string, updates: any) => {
    const response = await contentApiService.updateContent(groupId, updates);
    return { success: response.success, data: response.data };
  },
  deleteGroup: async (groupId: string) => {
    const response = await contentApiService.deleteContent(groupId);
    return { success: response.success };
  },
  createPresentation: async (presentationData: any) => {
    const response = await contentApiService.createContent({ ...presentationData, type: 'presentation' });
    return { success: response.success, data: response.data };
  },
  updatePresentation: async (presentationId: string, updates: any) => {
    const response = await contentApiService.updateContent(presentationId, updates);
    return { success: response.success, data: response.data };
  },
  deletePresentation: async (presentationId: string) => {
    const response = await contentApiService.deleteContent(presentationId);
    return { success: response.success };
  },
  createAssessment: async (assessmentData: any) => {
    const response = await contentApiService.createContent({ ...assessmentData, type: 'assessment' });
    return { success: response.success, data: response.data };
  },
  updateAssessment: async (assessmentId: string, updates: any) => {
    const response = await contentApiService.updateContent(assessmentId, updates);
    return { success: response.success, data: response.data };
  },
  deleteAssessment: async (assessmentId: string) => {
    const response = await contentApiService.deleteContent(assessmentId);
    return { success: response.success };
  },
  submitAssessment: async (assessmentId: string, answers: any) => {
    const response = await contentApiService.updateContent(assessmentId, { answers });
    return { success: response.success, data: response.data };
  },
  getAssessmentResults: async (assessmentId: string) => {
    const response = await contentApiService.getContent(assessmentId);
    return { success: response.success, data: response.data };
  },
  createNotification: async (notificationData: any) => {
    const response = await contentApiService.createContent({ ...notificationData, type: 'notification' });
    return { success: response.success, data: response.data };
  },
  updateNotification: async (notificationId: string, updates: any) => {
    const response = await contentApiService.updateContent(notificationId, updates);
    return { success: response.success, data: response.data };
  },
  deleteNotification: async (notificationId: string) => {
    const response = await contentApiService.deleteContent(notificationId);
    return { success: response.success };
  },
  markNotificationAsRead: async (notificationId: string) => {
    const response = await contentApiService.updateContent(notificationId, { read: true });
    return { success: response.success, data: response.data };
  },
  // Application management methods
  updateApplicationStatus: async (applicationId: string, status: string, notes?: string) => {
    const response = await jobApiService.updateJob(applicationId, { status, notes });
    return { success: response.success, data: response.data };
  },
  getApplicationDetails: async (applicationId: string) => {
    const response = await jobApiService.getJob(applicationId);
    return { success: response.success, data: response.data };
  },
  createApplication: async (applicationData: any) => {
    const response = await jobApiService.createJob({ ...applicationData, type: 'application' });
    return { success: response.success, data: response.data };
  },
  updateApplication: async (applicationId: string, updates: any) => {
    const response = await jobApiService.updateJob(applicationId, updates);
    return { success: response.success, data: response.data };
  },
  deleteApplication: async (applicationId: string) => {
    const response = await jobApiService.deleteJob(applicationId);
    return { success: response.success };
  },
  // Candidate management methods
  updateCandidateStatus: async (candidateId: string, status: string, notes?: string) => {
    const response = await jobApiService.updateJob(candidateId, { status, notes });
    return { success: response.success, data: response.data };
  },
  getCandidateDetails: async (candidateId: string) => {
    const response = await jobApiService.getJob(candidateId);
    return { success: response.success, data: response.data };
  },
  createCandidate: async (candidateData: any) => {
    const response = await jobApiService.createJob({ ...candidateData, type: 'candidate' });
    return { success: response.success, data: response.data };
  },
  updateCandidate: async (candidateId: string, updates: any) => {
    const response = await jobApiService.updateJob(candidateId, updates);
    return { success: response.success, data: response.data };
  },
  deleteCandidate: async (candidateId: string) => {
    const response = await jobApiService.deleteJob(candidateId);
    return { success: response.success };
  },
  // Job posting methods
  createJobPosting: async (jobData: any) => {
    const response = await jobApiService.createJob({ ...jobData, type: 'job_posting' });
    return { success: response.success, data: response.data };
  },
  updateJobPosting: async (jobId: string, updates: any) => {
    const response = await jobApiService.updateJob(jobId, updates);
    return { success: response.success, data: response.data };
  },
  deleteJobPosting: async (jobId: string) => {
    const response = await jobApiService.deleteJob(jobId);
    return { success: response.success };
  },
  publishJobPosting: async (jobId: string) => {
    const response = await jobApiService.updateJob(jobId, { status: 'published' });
    return { success: response.success, data: response.data };
  },
  unpublishJobPosting: async (jobId: string) => {
    const response = await jobApiService.updateJob(jobId, { status: 'draft' });
    return { success: response.success, data: response.data };
  },
  // Resume management methods
  uploadResumeFile: async (file: File, candidateId: string) => {
    const response = await contentApiService.createContent({ type: 'resume', file, candidateId });
    return { success: response.success, data: response.data };
  },
  downloadResumeFile: async (resumeId: string) => {
    const response = await contentApiService.getContent(resumeId);
    return { success: response.success, data: response.data };
  },
  deleteResume: async (resumeId: string) => {
    const response = await contentApiService.deleteContent(resumeId);
    return { success: response.success };
  },
  unenrollFromTraining: async (programId: string, userId: string) => {
    const response = await contentApiService.updateContent(programId, { enrolledUsers: { $pull: userId } });
    return { success: response.success, data: response.data };
  },
  completeTraining: async (programId: string, userId: string, completionData: any) => {
    const response = await contentApiService.updateContent(programId, { 
      completions: { $push: { userId, ...completionData } } 
    });
    return { success: response.success, data: response.data };
  },
  submitAssessmentAnswers: async (assessmentId: string, userId: string, answers: any) => {
    const response = await contentApiService.updateContent(assessmentId, { 
      submissions: { $push: { userId, answers, submitTime: new Date() } } 
    });
    return { success: response.success, data: response.data };
  },
  getAssessmentScore: async (assessmentId: string, userId: string) => {
    const response = await contentApiService.getContent(assessmentId);
    return { success: response.success, data: response.data };
  },
  // Group management methods
  joinGroup: async (groupId: string, userId: string) => {
    const response = await contentApiService.updateContent(groupId, { members: { $push: userId } });
    return { success: response.success, data: response.data };
  },
  leaveGroup: async (groupId: string, userId: string) => {
    const response = await contentApiService.updateContent(groupId, { members: { $pull: userId } });
    return { success: response.success, data: response.data };
  },
  inviteToGroup: async (groupId: string, userId: string) => {
    const response = await contentApiService.updateContent(groupId, { invitations: { $push: userId } });
    return { success: response.success, data: response.data };
  },
  // Presentation methods
  startPresentation: async (presentationId: string, userId: string) => {
    const response = await contentApiService.updateContent(presentationId, { 
      startedBy: { $push: { userId, startTime: new Date() } } 
    });
    return { success: response.success, data: response.data };
  },
  endPresentation: async (presentationId: string, userId: string) => {
    const response = await contentApiService.updateContent(presentationId, { 
      endedBy: { $push: { userId, endTime: new Date() } } 
    });
    return { success: response.success, data: response.data };
  },
  // Notification methods
  sendNotification: async (notificationData: any) => {
    const response = await contentApiService.createContent({ ...notificationData, type: 'notification' });
    return { success: response.success, data: response.data };
  },
  markAllNotificationsAsRead: async (userId: string) => {
    const response = await contentApiService.updateContent('', { 
      readBy: { $push: { userId, readTime: new Date() } } 
    });
    return { success: response.success, data: response.data };
  },
  // Feed methods
  getFeedPosts: async (params?: any) => {
    const response = await contentApiService.getContentList({ ...params, type: 'post' });
    return createResponse({ ...response, data: response.data || [] });
  },
  createFeedPost: async (postData: any) => {
    const response = await contentApiService.createContent({ ...postData, type: 'post' });
    return createResponse(response);
  },
  updateFeedPost: async (postId: string, updates: any) => {
    const response = await contentApiService.updateContent(postId, updates);
    return createResponse(response);
  },
  deleteFeedPost: async (postId: string) => {
    const response = await contentApiService.deleteContent(postId);
    return createResponse(response);
  },
  likeFeedPost: async (postId: string, userId?: string) => {
    const response = await contentApiService.updateContent(postId, { 
      likes: { $push: { userId: userId || 'current', timestamp: new Date() } } 
    });
    return createResponse(response);
  },
  unlikeFeedPost: async (postId: string, userId?: string) => {
    const response = await contentApiService.updateContent(postId, { 
      likes: { $pull: { userId: userId || 'current' } } 
    });
    return createResponse(response);
  },
  commentOnFeedPost: async (postId: string, comment: any) => {
    const response = await contentApiService.updateContent(postId, { 
      comments: { $push: { ...comment, timestamp: new Date() } } 
    });
    return createResponse(response);
  },
  deleteComment: async (postId: string, commentId: string) => {
    const response = await contentApiService.updateContent(postId, { 
      comments: { $pull: { _id: commentId } } 
    });
    return createResponse(response);
  },
  shareFeedPost: async (postId: string, userId?: string) => {
    const response = await contentApiService.updateContent(postId, { 
      shares: { $push: { userId: userId || 'current', timestamp: new Date() } } 
    });
    return createResponse(response);
  },
  // Authentication methods
  resendVerificationEmail: async (data: { email: string; registrationId: string }) => {
    const response = await authApiService.resendVerification(data.email);
    return createResponse(response);
  },
  verifyEmail: async (token: string) => {
    const response = await authApiService.verifyEmail(token);
    return createResponse(response);
  },
  forgotPassword: async (data: { email: string }) => {
    const response = await authApiService.forgotPassword(data.email);
    return createResponse(response);
  },
  resetPassword: async (token: string, newPassword: string) => {
    const response = await authApiService.resetPassword(token, newPassword);
    return createResponse(response);
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await userApiService.changePassword({ currentPassword, newPassword });
    return createResponse(response);
  },
  updateProfile: async (profileData: any) => {
    const response = await userApiService.updateProfile(profileData);
    return createResponse(response);
  },
  getProfile: async () => {
    const response = await userApiService.getCurrentUser();
    return createResponse(response);
  },
  // User management methods
  getUsers: async (params?: any) => {
    // TODO: Implement getUsers method in UserApiService
    const response = await userApiService.getCurrentUser();
    return createResponse({ ...response, data: [response.data] });
  },
  getUser: async (userId: string) => {
    // TODO: Implement getUser method in UserApiService
    const response = await userApiService.getCurrentUser();
    return createResponse(response);
  },
  createUser: async (userData: any) => {
    // TODO: Implement createUser method in UserApiService
    const response = await userApiService.updateProfile(userData);
    return createResponse(response);
  },
  updateUser: async (userId: string, updates: any) => {
    // TODO: Implement updateUser method in UserApiService
    const response = await userApiService.updateProfile(updates);
    return createResponse(response);
  },
  deleteUser: async (userId: string) => {
    // TODO: Implement deleteUser method in UserApiService
    const response = await userApiService.getCurrentUser();
    return createResponse({ ...response, success: false, message: 'Delete user not implemented' });
  },
  // Tenant management methods
  getTenants: async (params?: any) => {
    const response = await tenantApiService.getTenants();
    return createResponse({ ...response, data: response.data || [] });
  },
  createTenant: async (tenantData: any) => {
    const response = await tenantApiService.createTenant(tenantData);
    return createResponse(response);
  },
  updateTenant: async (tenantId: string, updates: any) => {
    const response = await tenantApiService.updateTenant(tenantId, updates);
    return createResponse(response);
  },
  deleteTenant: async (tenantId: string) => {
    const response = await tenantApiService.deleteTenant(tenantId);
    return createResponse(response);
  },
  getTenantDetails: async (tenantId: string) => {
    const response = await tenantApiService.getTenant(tenantId);
    return createResponse(response);
  },
  // Content management methods
  getContent: async (contentId: string) => {
    const response = await contentApiService.getContent(contentId);
    return createResponse(response);
  },
  getContentList: async (params?: any) => {
    const response = await contentApiService.getContentList(params);
    return createResponse({ ...response, data: response.data || [] });
  },
  createContent: async (contentData: any) => {
    const response = await contentApiService.createContent(contentData);
    return createResponse(response);
  },
  updateContent: async (contentId: string, updates: any) => {
    const response = await contentApiService.updateContent(contentId, updates);
    return createResponse(response);
  },
  deleteContent: async (contentId: string) => {
    const response = await contentApiService.deleteContent(contentId);
    return createResponse(response);
  },
  // Analytics methods
  getDashboardData: async () => {
    const response = await analyticsApiService.getDashboardData();
    return createResponse(response);
  },
  getPerformanceMetrics: async () => {
    const response = await analyticsApiService.getPerformanceMetrics();
    return createResponse(response);
  },
  getAnalytics: async (params?: any) => {
    const response = await analyticsApiService.getDashboardData();
    return createResponse(response);
  },
  // Additional authentication methods
  checkEmailVerification: async (registrationId: string) => {
    // TODO: Implement checkEmailVerification method in AuthApiService
    const response = await authApiService.verifyEmail(registrationId);
    return createResponse(response);
  },
  register: async (userData: any) => {
    const response = await authApiService.register(userData);
    return createResponse(response);
  },
  getCandidateProfile: async (userId: string) => {
    // TODO: Implement getUser method in UserApiService
    const response = await userApiService.getCurrentUser();
    return createResponse(response);
  },
  updateCandidateProfile: async (profileId: string, profileData: any) => {
    // TODO: Implement updateUser method in UserApiService
    const response = await userApiService.updateProfile(profileData);
    return createResponse(response);
  },
  addSkill: async (profileId: string, skill: any) => {
    // TODO: Implement updateUser method in UserApiService
    const response = await userApiService.updateProfile({ skills: { $push: skill } });
    return createResponse(response);
  },
  addExperience: async (profileId: string, experience: any) => {
    // TODO: Implement updateUser method in UserApiService
    const response = await userApiService.updateProfile({ experience: { $push: experience } });
    return createResponse(response);
  },
  addEducation: async (profileId: string, education: any) => {
    // TODO: Implement updateUser method in UserApiService
    const response = await userApiService.updateProfile({ education: { $push: education } });
    return createResponse(response);
  },
  addFeedPostComment: async (postId: string, comment: any) => {
    const response = await contentApiService.updateContent(postId, { comments: { $push: comment } });
    return createResponse(response);
  },
  applyForJob: async (jobId: string, applicationData: any) => {
    const response = await jobApiService.createJob({ ...applicationData, jobId, status: 'applied' });
    return createResponse(response);
  },
  getTrainingCourses: async (params?: any) => {
    const response = await contentApiService.getContentList({ ...params, type: 'training' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getParticipantStats: async (userId: string) => {
    const response = await analyticsApiService.getUserAnalytics(userId);
    return createResponse(response);
  },
  completeModule: async (courseId: string, moduleId: string, userId: string) => {
    const response = await contentApiService.updateContent(courseId, { 
      completedModules: { $push: { moduleId, userId, completedAt: new Date() } } 
    });
    return createResponse(response);
  },
  getTrainerStats: async (trainerId: string) => {
    const response = await analyticsApiService.getUserAnalytics(trainerId);
    return createResponse(response);
  },
  getTrainingSessions: async (params?: any) => {
    const response = await contentApiService.getContentList({ ...params, type: 'session' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getContentLibrary: async (params?: any) => {
    const response = await contentApiService.getContentList({ ...params, type: 'library' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getTrainingAnalytics: async (params?: any) => {
    // TODO: Implement getAnalytics method in AnalyticsApiService
    const response = await analyticsApiService.getDashboardData();
    return createResponse(response);
  },
  getPerformanceAnalytics: async (params?: any) => {
    // TODO: Implement getAnalytics method in AnalyticsApiService
    const response = await analyticsApiService.getDashboardData();
    return createResponse(response);
  },
  getUserAnalytics: async (userId?: string) => {
    const response = await analyticsApiService.getUserAnalytics(userId || 'current');
    return createResponse(response);
  },
  generateCustomReport: async (params: any) => {
    // TODO: Implement getAnalytics method in AnalyticsApiService
    const response = await analyticsApiService.getDashboardData();
    return createResponse(response);
  },
  globalSearch: async (query: string) => {
    const response = await contentApiService.getContentList({ search: query, type: 'all' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getAssessments: async (params?: any) => {
    const response = await contentApiService.getContentList({ ...params, type: 'assessment' });
    return createResponse({ ...response, data: response.data || [] });
  },
  getLearningPaths: async (params?: any) => {
    const response = await contentApiService.getContentList({ ...params, type: 'learning_path' });
    return createResponse({ ...response, data: response.data || [] });
  },
  startModule: async (programId: string, moduleId: string) => {
    const response = await contentApiService.updateContent(programId, { 
      startedModules: { $push: { moduleId, startedAt: new Date() } } 
    });
    return createResponse(response);
  },
  startAssessment: async (assessmentId: string, userId?: string) => {
    const response = await contentApiService.updateContent(assessmentId, { 
      startedAssessments: { $push: { userId: userId || 'current', startedAt: new Date() } } 
    });
    return createResponse(response);
  },
  downloadCertificate: async (programId: string) => {
    const response = await contentApiService.getContent(programId);
    return createResponse(response);
  },
  enrollInTraining: async (programId: string, userId?: string) => {
    const response = await contentApiService.updateContent(programId, { 
      enrolledUsers: { $push: { userId: userId || 'current', enrolledAt: new Date() } } 
    });
    return createResponse(response);
  },
  startTraining: async (programId: string) => {
    const response = await contentApiService.updateContent(programId, { 
      status: 'started', startedAt: new Date() 
    });
    return createResponse(response);
  },
  bookmarkTraining: async (programId: string) => {
    const response = await contentApiService.updateContent(programId, { 
      bookmarked: true, bookmarkedAt: new Date() 
    });
    return createResponse(response);
  },
};

export default apiServices;
