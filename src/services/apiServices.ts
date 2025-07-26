import apiClient, { ApiResponse } from './apiClient';
import { Poll, PollResponse, PollFeedback, Notification } from '../types/polls';

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
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/auth/register', userData);
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token);
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
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
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/auth/logout', {});
    apiClient.setAuthToken(null);
    localStorage.removeItem('user');
    return response;
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

  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put(`/users/${userId}`, userData);
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/users/${userId}`);
  }

  // Tenant Management API
  async createTenant(tenantData: any): Promise<ApiResponse<any>> {
    return apiClient.post('/tenants/create', tenantData);
  }

  async getTenants(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/tenants');
  }

  async getTenant(tenantId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/tenants/${tenantId}`);
  }

  async updateTenant(tenantId: string, tenantData: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/tenants/${tenantId}`, tenantData);
  }

  async deleteTenant(tenantId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/tenants/${tenantId}`);
  }

  // Polls API
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

  // Notifications
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
      status: 'draft' as const,
      responses: [],
      feedback: [],
      notifications: [],
      createdAt: undefined,
      updatedAt: undefined,
    };

    return this.createPoll(tenantId, duplicatedPoll);
  }

  async archivePoll(tenantId: string, pollId: string): Promise<ApiResponse<Poll>> {
    return this.updatePoll(tenantId, pollId, { status: 'archived' });
  }

  async restorePoll(tenantId: string, pollId: string): Promise<ApiResponse<Poll>> {
    return this.updatePoll(tenantId, pollId, { status: 'draft' });
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