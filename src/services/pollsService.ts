import { Poll, PollResponse, PollFeedback, Notification, PollQuestion } from '../types/polls';
import { securityConfig } from '../config/security';
import { apiLogger } from '../utils/logger';

const API_BASE_URL = securityConfig.apiBaseUrl;

class PollsService {
  private tenantId: string = 'tenant1'; // Default tenant, should come from auth context

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      apiLogger.apiError(endpoint, error);
      throw error;
    }
  }

  // Get all polls with filtering and pagination
  async getPolls(params: {
    page?: number;
    limit?: number;
    status?: string;
    niche?: string;
    priority?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    success: boolean;
    data: Poll[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request(`/polls/${this.tenantId}?${queryParams.toString()}`);
  }

  // Get poll statistics
  async getPollStats(): Promise<{
    success: boolean;
    data: {
      overview: {
        totalPolls: number;
        totalRecipients: number;
        totalResponses: number;
        avgResponseRate: number;
        avgRating: number;
      };
      byStatus: Array<{ _id: string; count: number }>;
      byNiche: Array<{ _id: string; count: number }>;
    };
  }> {
    return this.request(`/polls/${this.tenantId}/stats`);
  }

  // Get single poll
  async getPoll(id: string): Promise<{
    success: boolean;
    data: Poll;
  }> {
    return this.request(`/polls/${this.tenantId}/${id}`);
  }

  // Create new poll
  async createPoll(pollData: Partial<Poll>): Promise<{
    success: boolean;
    message: string;
    data: Poll;
  }> {
    return this.request(`/polls/${this.tenantId}`, {
      method: 'POST',
      body: JSON.stringify(pollData),
    });
  }

  // Update poll
  async updatePoll(id: string, pollData: Partial<Poll>): Promise<{
    success: boolean;
    message: string;
    data: Poll;
  }> {
    return this.request(`/polls/${this.tenantId}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pollData),
    });
  }

  // Delete poll
  async deletePoll(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/polls/${this.tenantId}/${id}`, {
      method: 'DELETE',
    });
  }

  // Add recipients to poll
  async addRecipients(pollId: string, recipients: Array<{
    userId?: string;
    email: string;
    name: string;
  }>): Promise<{
    success: boolean;
    message: string;
    data: any[];
  }> {
    return this.request(`/polls/${this.tenantId}/${pollId}/recipients`, {
      method: 'POST',
      body: JSON.stringify({ recipients }),
    });
  }

  // Submit poll response
  async submitResponse(pollId: string, responseData: {
    userId?: string;
    userName: string;
    userEmail: string;
    answers: Array<{
      questionId: string;
      answer: any;
      questionText: string;
    }>;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/polls/${this.tenantId}/${pollId}/responses`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  }

  // Submit feedback
  async submitFeedback(pollId: string, feedbackData: {
    userId?: string;
    userName: string;
    userEmail: string;
    rating: number;
    comment?: string;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/polls/${this.tenantId}/${pollId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  // Get poll responses
  async getPollResponses(pollId: string): Promise<{
    success: boolean;
    data: PollResponse[];
  }> {
    return this.request(`/polls/${this.tenantId}/${pollId}/responses`);
  }

  // Get poll feedback
  async getPollFeedback(pollId: string): Promise<{
    success: boolean;
    data: PollFeedback[];
  }> {
    return this.request(`/polls/${this.tenantId}/${pollId}/feedback`);
  }

  // Send poll to recipients
  async sendPoll(pollId: string): Promise<{
    success: boolean;
    message: string;
    data: {
      sentTo: number;
      sentAt: string;
    };
  }> {
    return this.request(`/polls/${this.tenantId}/${pollId}/send`, {
      method: 'POST',
    });
  }

  // Get notifications
  async getNotifications(params: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  } = {}): Promise<{
    success: boolean;
    data: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request(`/polls/${this.tenantId}/notifications?${queryParams.toString()}`);
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/polls/${this.tenantId}/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // Helper method to format poll data for API
  formatPollForAPI(poll: Partial<Poll>): any {
    return {
      title: poll.title,
      description: poll.description,
      niche: poll.niche,
      targetAudience: poll.targetAudience,
      questions: poll.questions?.map((q: PollQuestion, index: number) => ({
        ...q,
        order: index + 1,
      })),
      channels: poll.channels,
      priority: poll.priority,
      tags: poll.tags,
      scheduledDate: poll.scheduledDate,
      settings: poll.settings,
      recipients: poll.recipients,
    };
  }

  // Helper method to format response data for API
  formatResponseForAPI(response: {
    userName: string;
    userEmail: string;
    answers: Array<{
      questionId: string;
      answer: any;
      questionText: string;
    }>;
  }): any {
    return {
      userName: response.userName,
      userEmail: response.userEmail,
      answers: response.answers,
    };
  }

  // Helper method to format feedback data for API
  formatFeedbackForAPI(feedback: {
    userName: string;
    userEmail: string;
    rating: number;
    comment?: string;
  }): any {
    return {
      userName: feedback.userName,
      userEmail: feedback.userEmail,
      rating: feedback.rating,
      comment: feedback.comment,
    };
  }
}

// Create singleton instance
const pollsService = new PollsService();

export default pollsService; 