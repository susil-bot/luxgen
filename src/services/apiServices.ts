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
    return apiClient.get('/api/database/status');
  }

  // Polls API
  async getPolls(tenantId: string): Promise<ApiResponse<Poll[]>> {
    return apiClient.get(`/api/polls/${tenantId}`);
  }

  async getPoll(tenantId: string, pollId: string): Promise<ApiResponse<Poll>> {
    return apiClient.get(`/api/polls/${tenantId}/${pollId}`);
  }

  async createPoll(tenantId: string, pollData: Partial<Poll>): Promise<ApiResponse<Poll>> {
    return apiClient.post(`/api/polls/${tenantId}`, pollData);
  }

  async updatePoll(tenantId: string, pollId: string, pollData: Partial<Poll>): Promise<ApiResponse<Poll>> {
    return apiClient.put(`/api/polls/${tenantId}/${pollId}`, pollData);
  }

  async deletePoll(tenantId: string, pollId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/polls/${tenantId}/${pollId}`);
  }

  async getPollStats(tenantId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/polls/${tenantId}/stats`);
  }

  // Poll Responses
  async submitPollResponse(
    tenantId: string, 
    pollId: string, 
    response: Partial<PollResponse>
  ): Promise<ApiResponse<PollResponse>> {
    return apiClient.post(`/api/polls/${tenantId}/${pollId}/response`, response);
  }

  async getPollResponses(tenantId: string, pollId: string): Promise<ApiResponse<PollResponse[]>> {
    return apiClient.get(`/api/polls/${tenantId}/${pollId}/responses`);
  }

  // Poll Feedback
  async submitPollFeedback(
    tenantId: string, 
    pollId: string, 
    feedback: Partial<PollFeedback>
  ): Promise<ApiResponse<PollFeedback>> {
    return apiClient.post(`/api/polls/${tenantId}/${pollId}/feedback`, feedback);
  }

  async getPollFeedback(tenantId: string, pollId: string): Promise<ApiResponse<PollFeedback[]>> {
    return apiClient.get(`/api/polls/${tenantId}/${pollId}/feedback`);
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
    const endpoint = `/api/polls/${tenantId}/notifications${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  }

  async markNotificationAsRead(
    tenantId: string, 
    notificationId: string
  ): Promise<ApiResponse<void>> {
    return apiClient.put(`/api/polls/${tenantId}/notifications/${notificationId}/read`, {});
  }

  // Poll Actions
  async sendPoll(tenantId: string, pollId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/api/polls/${tenantId}/${pollId}/send`, {});
  }

  // Users API
  async getUsers(tenantId: string): Promise<ApiResponse<User[]>> {
    return apiClient.get(`/api/${tenantId}/users`);
  }

  async getCourses(tenantId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`/api/${tenantId}/courses`);
  }

  // Authentication
  async login(credentials: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/api/auth/login', credentials);
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token);
    }
    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/api/auth/logout', {});
    apiClient.setAuthToken(null);
    return response;
  }

  async register(userData: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/api/auth/register', userData);
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token);
    }
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get('/api/auth/me');
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
    return apiClient.get(`/api/polls/${tenantId}/${pollId}/analytics`);
  }

  async getTenantAnalytics(tenantId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/${tenantId}/analytics`);
  }

  // Export functionality
  async exportPollData(tenantId: string, pollId: string, format: 'csv' | 'json' = 'csv'): Promise<ApiResponse<string>> {
    return apiClient.get(`/api/polls/${tenantId}/${pollId}/export?format=${format}`);
  }

  // Bulk operations
  async bulkDeletePolls(tenantId: string, pollIds: string[]): Promise<ApiResponse<{ deleted: number; failed: number }>> {
    return apiClient.post(`/api/polls/${tenantId}/bulk-delete`, { pollIds });
  }

  async bulkUpdatePolls(tenantId: string, pollIds: string[], updates: Partial<Poll>): Promise<ApiResponse<{ updated: number; failed: number }>> {
    return apiClient.put(`/api/polls/${tenantId}/bulk-update`, { pollIds, updates });
  }
}

// Create singleton instance
const apiServices = new ApiServices();

export default apiServices; 