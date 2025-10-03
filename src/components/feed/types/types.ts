/**
 * types.ts
 * TypeScript type definitions for ActivityFeed component
 */

export interface ActivityFeedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  department?: string | null;
  position?: string | null;
}

export interface ActivityFeedMetadata {
  [key: string]: any;
  programId?: string;
  sessionId?: string;
  assessmentId?: string;
  courseId?: string;
  score?: number;
  percentage?: number;
  rating?: number;
  duration?: number;
  completed?: boolean;
  passed?: boolean;
  isActive?: boolean;
}

export interface ActivityFeedItem {
  id: string;
  title: string;
  description: string;
  type: ActivityFeedType;
  timestamp: Date;
  user: ActivityFeedUser;
  metadata?: ActivityFeedMetadata;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  priority: number;
  tags: string[];
  visibility: 'public' | 'private' | 'internal';
  status: 'active' | 'archived' | 'deleted';
}

export type ActivityFeedType = 
  | 'user_joined'
  | 'program_created'
  | 'session_completed'
  | 'assessment_taken'
  | 'training_started'
  | 'certificate_earned'
  | 'feedback_submitted'
  | 'poll_created'
  | 'announcement'
  | 'milestone_reached'
  | 'general';

export type ActivityFeedFilter = 
  | 'all'
  | 'user_joined'
  | 'program_created'
  | 'session_completed'
  | 'assessment_taken'
  | 'training_started'
  | 'certificate_earned'
  | 'feedback_submitted'
  | 'poll_created'
  | 'announcement'
  | 'milestone_reached';

export interface ActivityFeedStats {
  totalActivities: number;
  activeUsers: number;
  engagementRate: number;
  thisWeek: number;
  thisMonth: number;
  topActivityType: string | null;
  averageEngagement: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  growthRate: number;
}

export interface ActivityFeedEngagement {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagementRate: number;
  topEngagers: ActivityFeedEngager[];
  recentComments: ActivityFeedComment[];
}

export interface ActivityFeedEngager {
  id: string;
  name: string;
  avatar?: string | null;
  engagementCount: number;
  lastEngagement: Date | null;
}

export interface ActivityFeedComment {
  id: string;
  text: string;
  user: ActivityFeedUser;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export interface ActivityFeedFilters {
  types: string[];
  dateRange: DateRange | null;
  users: string[];
  tags: string[];
  status: string;
  priority: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ActivityFeedSearchResults {
  activities: ActivityFeedItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  query: string;
  filters: ActivityFeedFilters;
}

export interface ActivityFeedAnalytics {
  byType: Record<string, number>;
  byUser: Record<string, { name: string; count: number }>;
  byDate: Record<string, number>;
  engagement: {
    totalLikes: number;
    totalComments: number;
    totalShares: number;
  };
}

export interface ActivityFeedExportData {
  id: string;
  title: string;
  description: string;
  type: string;
  timestamp: Date;
  user: string;
  likes: number;
  comments: number;
  shares: number;
  metadata: Record<string, any>;
  tags: string[];
}

export interface ActivityFeedAction {
  type: 'like' | 'comment' | 'share' | 'bookmark' | 'unlike' | 'unbookmark';
  activityId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ActivityFeedNotification {
  id: string;
  type: 'new_activity' | 'activity_liked' | 'activity_commented' | 'activity_shared';
  activityId: string;
  userId: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
}

export interface ActivityFeedSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  itemsPerPage: number;
  showTimestamps: boolean;
  showUserAvatars: boolean;
  enableNotifications: boolean;
  defaultFilter: ActivityFeedFilter;
  sortOrder: 'asc' | 'desc';
  groupByDate: boolean;
}

export interface ActivityFeedProps {
  tenantId?: string;
  userId?: string;
  filters?: ActivityFeedFilters;
  settings?: Partial<ActivityFeedSettings>;
  onActivityClick?: (activity: ActivityFeedItem) => void;
  onActivityAction?: (activityId: string, action: string) => void;
  onFilterChange?: (filters: ActivityFeedFilters) => void;
  onSettingsChange?: (settings: ActivityFeedSettings) => void;
}

export interface ActivityFeedState {
  activities: ActivityFeedItem[];
  filteredActivities: ActivityFeedItem[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  searchTerm: string;
  selectedFilter: ActivityFeedFilter;
  stats: ActivityFeedStats | null;
  showFilters: boolean;
  page: number;
  hasMore: boolean;
}

export interface ActivityFeedHook {
  activities: ActivityFeedItem[];
  loading: boolean;
  error: string | null;
  stats: ActivityFeedStats | null;
  loadActivities: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  performAction: (activityId: string, action: string) => Promise<void>;
  searchActivities: (term: string) => Promise<void>;
  filterActivities: (filter: ActivityFeedFilter) => void;
  loadMore: () => Promise<void>;
}

export interface ActivityFeedAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ActivityFeedQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  type?: ActivityFeedType;
  search?: string;
}

export interface ActivityFeedCreateRequest {
  title: string;
  description: string;
  type: ActivityFeedType;
  userId: string;
  tenantId: string;
  metadata?: ActivityFeedMetadata;
  tags?: string[];
  visibility?: 'public' | 'private' | 'internal';
  priority?: number;
}

export interface ActivityFeedUpdateRequest {
  title?: string;
  description?: string;
  metadata?: ActivityFeedMetadata;
  tags?: string[];
  visibility?: 'public' | 'private' | 'internal';
  priority?: number;
  status?: 'active' | 'archived' | 'deleted';
}

export interface ActivityFeedActionRequest {
  activityId: string;
  action: string;
  userId: string;
  tenantId: string;
  metadata?: Record<string, any>;
}

export interface ActivityFeedStatsRequest {
  tenantId: string;
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  type?: ActivityFeedType;
}

export interface ActivityFeedSearchRequest {
  query: string;
  tenantId: string;
  filters?: ActivityFeedFilters;
  options?: ActivityFeedQueryOptions;
}

// Re-export commonly used types
export type {
  ActivityFeedItem as Activity,
  ActivityFeedUser as User,
  ActivityFeedStats as Stats,
  ActivityFeedEngagement as Engagement,
  ActivityFeedFilters as Filters,
  ActivityFeedSearchResults as SearchResults,
  ActivityFeedAnalytics as Analytics
};
