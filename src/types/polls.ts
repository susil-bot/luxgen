export interface PollQuestion {
  id?: string;
  question: string;
  type: 'multiple_choice' | 'rating' | 'text' | 'yes_no';
  options?: string[];
  required: boolean;
  order?: number;
}

export interface PollRecipient {
  userId?: string;
  email: string;
  name: string;
  sentAt?: Date;
  respondedAt?: Date;
}

export interface PollResponse {
  id?: string;
  userId?: string;
  userName: string;
  userEmail: string;
  answers: Array<{
    questionId: string;
    answer: any;
    questionText: string;
  }>;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PollFeedback {
  id?: string;
  userId?: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment?: string;
  helpful: number;
  helpfulUsers?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Notification {
  id?: string;
  type: 'poll_response' | 'feedback_received' | 'schedule_reminder' | 'completion_alert';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  recipientId?: string;
  pollTitle?: string;
  pollId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PollSettings {
  allowAnonymous: boolean;
  requireEmail: boolean;
  maxResponses?: number;
  autoClose: boolean;
  closeDate?: Date;
}

export interface PollAnalytics {
  totalRecipients: number;
  totalResponses: number;
  responseRate: number;
  averageRating: number;
  completionTime: number;
}

export interface Poll {
  id?: string;
  tenantId: string;
  title: string;
  description: string;
  niche: string;
  targetAudience: string[];
  questions: PollQuestion[];
  channels: string[];
  status: 'draft' | 'scheduled' | 'sent' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  scheduledDate?: Date;
  sentDate?: Date;
  recipients: PollRecipient[];
  responses: PollResponse[];
  feedback: PollFeedback[];
  notifications: Notification[];
  settings: PollSettings;
  analytics: PollAnalytics;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  responseRatePercentage?: number;
}

export interface PollStats {
  overview: {
    totalPolls: number;
    totalRecipients: number;
    totalResponses: number;
    avgResponseRate: number;
    avgRating: number;
  };
  byStatus: Array<{ _id: string; count: number }>;
  byNiche: Array<{ _id: string; count: number }>;
}

export interface PollFilters {
  page?: number;
  limit?: number;
  status?: string;
  niche?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type { ApiResponse } from './api'; 