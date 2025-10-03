/**
 * ActivityFeedTransformer.ts
 * Data transformation functions for ActivityFeed component
 */

import { ActivityFeedItem, ActivityFeedStats, ActivityFeedUser } from '../types/types';

/**
 * Transform raw activity data from API to component format
 * @param {Array} rawActivities - Raw activity data from API
 * @returns {Array} Transformed activities
 */
export const transformActivities = (rawActivities: any[]): ActivityFeedItem[] => {
  if (!rawActivities || !Array.isArray(rawActivities)) {
    return [];
  }

  return rawActivities.map(transformSingleActivity).filter((activity): activity is ActivityFeedItem => activity !== null);
};

/**
 * Transform a single activity from API format to component format
 * @param {Object} rawActivity - Raw activity object from API
 * @returns {Object} Transformed activity object
 */
export const transformSingleActivity = (rawActivity: any): ActivityFeedItem | null => {
  if (!rawActivity) {
    return null;
  }

  return {
    id: rawActivity._id || rawActivity.id,
    title: rawActivity.title || 'Untitled Activity',
    description: rawActivity.description || '',
    type: rawActivity.type || 'general',
    timestamp: rawActivity.createdAt || rawActivity.timestamp || new Date(),
    user: transformUser(rawActivity.user || rawActivity.userId),
    metadata: transformMetadata(rawActivity.metadata || {}),
    likes: rawActivity.likes || 0,
    comments: rawActivity.comments || 0,
    shares: rawActivity.shares || 0,
    isLiked: rawActivity.isLiked || false,
    isBookmarked: rawActivity.isBookmarked || false,
    priority: rawActivity.priority || 0,
    tags: rawActivity.tags || [],
    visibility: rawActivity.visibility || 'public',
    status: rawActivity.status || 'active'
  };
};

/**
 * Transform user data
 * @param {Object|string} userData - User data from API
 * @returns {Object} Transformed user object
 */
export const transformUser = (userData: any): ActivityFeedUser => {
  if (!userData) {
    return {
      id: 'system',
      name: 'System',
      email: '',
      avatar: null,
      role: 'system'
    };
  }

  // If userData is a string (user ID), return basic user object
  if (typeof userData === 'string') {
    return {
      id: userData,
      name: 'Unknown User',
      email: '',
      avatar: null,
      role: 'user'
    };
  }

  return {
    id: userData._id || userData.id,
    name: userData.name || userData.fullName || 'Unknown User',
    email: userData.email || '',
    avatar: userData.avatar || userData.profilePicture || null,
    role: userData.role || 'user',
    department: userData.department || null,
    position: userData.position || null
  };
};

/**
 * Transform metadata object
 * @param {Object} metadata - Raw metadata object
 * @returns {Object} Transformed metadata
 */
export const transformMetadata = (metadata: any): Record<string, any> => {
  if (!metadata || typeof metadata !== 'object') {
    return {};
  }

  const transformed: Record<string, any> = {};
  
  Object.keys(metadata).forEach(key => {
    const value = metadata[key];
    
    // Transform common metadata fields
    switch (key) {
      case 'programId':
      case 'sessionId':
      case 'assessmentId':
      case 'courseId':
        transformed[key] = value;
        break;
      case 'score':
      case 'percentage':
      case 'rating':
        transformed[key] = typeof value === 'number' ? value : parseFloat(value) || 0;
        break;
      case 'duration':
        transformed[key] = typeof value === 'number' ? value : parseInt(value) || 0;
        break;
      case 'completed':
      case 'passed':
      case 'isActive':
        transformed[key] = Boolean(value);
        break;
      default:
        transformed[key] = value;
        break;
    }
  });

  return transformed;
};

/**
 * Transform feed statistics from API
 * @param {Object} rawStats - Raw stats from API
 * @returns {Object} Transformed stats object
 */
export const transformStats = (rawStats: any): ActivityFeedStats => {
  if (!rawStats) {
    return {
      totalActivities: 0,
      activeUsers: 0,
      engagementRate: 0,
      thisWeek: 0,
      thisMonth: 0,
      topActivityType: null,
      averageEngagement: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      growthRate: 0
    };
  }

  return {
    totalActivities: rawStats.totalActivities || 0,
    activeUsers: rawStats.activeUsers || 0,
    engagementRate: Math.round((rawStats.engagementRate || 0) * 100) / 100,
    thisWeek: rawStats.thisWeek || 0,
    thisMonth: rawStats.thisMonth || 0,
    topActivityType: rawStats.topActivityType || null,
    averageEngagement: Math.round((rawStats.averageEngagement || 0) * 100) / 100,
    totalLikes: rawStats.totalLikes || 0,
    totalComments: rawStats.totalComments || 0,
    totalShares: rawStats.totalShares || 0,
    growthRate: Math.round((rawStats.growthRate || 0) * 100) / 100
  };
};

/**
 * Transform activity engagement data
 * @param {Object} rawEngagement - Raw engagement data from API
 * @returns {Object} Transformed engagement object
 */
export const transformEngagement = (rawEngagement: any): any => {
  if (!rawEngagement) {
    return {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      engagementRate: 0,
      topEngagers: []
    };
  }

  return {
    likes: rawEngagement.likes || 0,
    comments: rawEngagement.comments || 0,
    shares: rawEngagement.shares || 0,
    views: rawEngagement.views || 0,
    engagementRate: Math.round((rawEngagement.engagementRate || 0) * 100) / 100,
    topEngagers: transformTopEngagers(rawEngagement.topEngagers || []),
    recentComments: transformRecentComments(rawEngagement.recentComments || [])
  };
};

/**
 * Transform top engagers data
 * @param {Array} rawEngagers - Raw engagers data
 * @returns {Array} Transformed engagers array
 */
export const transformTopEngagers = (rawEngagers: any[]): any[] => {
  if (!Array.isArray(rawEngagers)) {
    return [];
  }

  return rawEngagers.map(engager => ({
    id: engager._id || engager.id,
    name: engager.name || 'Unknown User',
    avatar: engager.avatar || null,
    engagementCount: engager.engagementCount || 0,
    lastEngagement: engager.lastEngagement || null
  }));
};

/**
 * Transform recent comments data
 * @param {Array} rawComments - Raw comments data
 * @returns {Array} Transformed comments array
 */
export const transformRecentComments = (rawComments: any[]): any[] => {
  if (!Array.isArray(rawComments)) {
    return [];
  }

  return rawComments.map(comment => ({
    id: comment._id || comment.id,
    text: comment.text || comment.content || '',
    user: transformUser(comment.user || comment.userId),
    timestamp: comment.createdAt || comment.timestamp || new Date(),
    likes: comment.likes || 0,
    isLiked: comment.isLiked || false
  }));
};

/**
 * Transform activity filters
 * @param {Object} rawFilters - Raw filter data
 * @returns {Object} Transformed filter object
 */
export const transformFilters = (rawFilters: any): any => {
  if (!rawFilters) {
    return {
      types: [],
      dateRange: null,
      users: [],
      tags: []
    };
  }

  return {
    types: rawFilters.types || [],
    dateRange: rawFilters.dateRange || null,
    users: rawFilters.users || [],
    tags: rawFilters.tags || [],
    status: rawFilters.status || 'all',
    priority: rawFilters.priority || 'all'
  };
};

/**
 * Transform search results
 * @param {Object} rawSearchResults - Raw search results from API
 * @returns {Object} Transformed search results
 */
export const transformSearchResults = (rawSearchResults: any): any => {
  if (!rawSearchResults) {
    return {
      activities: [],
      total: 0,
      page: 1,
      limit: 20,
      hasMore: false
    };
  }

  return {
    activities: transformActivities(rawSearchResults.activities || []),
    total: rawSearchResults.total || 0,
    page: rawSearchResults.page || 1,
    limit: rawSearchResults.limit || 20,
    hasMore: rawSearchResults.hasMore || false,
    query: rawSearchResults.query || '',
    filters: transformFilters(rawSearchResults.filters || {})
  };
};

/**
 * Transform activity for export
 * @param {Object} activity - Activity object
 * @returns {Object} Export-ready activity object
 */
export const transformForExport = (activity: ActivityFeedItem): any => {
  if (!activity) {
    return null;
  }

  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    type: activity.type,
    timestamp: activity.timestamp,
    user: activity.user?.name || 'Unknown User',
    likes: activity.likes || 0,
    comments: activity.comments || 0,
    shares: activity.shares || 0,
    metadata: activity.metadata || {},
    tags: activity.tags || []
  };
};

/**
 * Transform activities for analytics
 * @param {Array} activities - Array of activity objects
 * @returns {Object} Analytics-ready data
 */
export const transformForAnalytics = (activities: ActivityFeedItem[]): any => {
  if (!activities || !Array.isArray(activities)) {
    return {
      byType: {},
      byUser: {},
      byDate: {},
      engagement: {
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0
      }
    };
  }

  const analytics: any = {
    byType: {},
    byUser: {},
    byDate: {},
    engagement: {
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0
    }
  };

  activities.forEach(activity => {
    // Group by type
    if (!analytics.byType[activity.type]) {
      analytics.byType[activity.type] = 0;
    }
    analytics.byType[activity.type]++;

    // Group by user
    const userId = activity.user?.id || 'unknown';
    if (!analytics.byUser[userId]) {
      analytics.byUser[userId] = {
        name: activity.user?.name || 'Unknown User',
        count: 0
      };
    }
    analytics.byUser[userId].count++;

    // Group by date
    const date = new Date(activity.timestamp).toDateString();
    if (!analytics.byDate[date]) {
      analytics.byDate[date] = 0;
    }
    analytics.byDate[date]++;

    // Aggregate engagement
    analytics.engagement.totalLikes += activity.likes || 0;
    analytics.engagement.totalComments += activity.comments || 0;
    analytics.engagement.totalShares += activity.shares || 0;
  });

  return analytics;
};

/**
 * Export all transformer functions
 */
export const ActivityFeedTransformer = {
  transformActivities,
  transformSingleActivity,
  transformUser,
  transformMetadata,
  transformStats,
  transformEngagement,
  transformTopEngagers,
  transformRecentComments,
  transformFilters,
  transformSearchResults,
  transformForExport,
  transformForAnalytics
};

export default ActivityFeedTransformer;
