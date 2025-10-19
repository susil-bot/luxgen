/**
 * ActivityFeedHelper.ts
 * Utility functions for ActivityFeed component
 */

import { FEED_CONSTANTS } from '../constants/CONSTANTS';
import { ActivityFeedItem, ActivityFeedFilter } from '../types/Types.types';

/**
 * Filter activities based on search term and filter type
 * @param {Array} activities - Array of activity objects
 * @param {string} searchTerm - Search term to filter by
 * @param {string} filter - Filter type (all, user_joined, program_created, etc.)
 * @returns {Array} Filtered activities
 */
export const filterActivities = (activities: ActivityFeedItem[], searchTerm: string, filter: ActivityFeedFilter): ActivityFeedItem[] => {
  if (!activities || !Array.isArray(activities)) {
    return [];
  }

  let filtered = activities;

  // Apply search filter
  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    filtered = filtered.filter(activity => 
      activity.title?.toLowerCase().includes(term) ||
      activity.description?.toLowerCase().includes(term) ||
      activity.user?.name?.toLowerCase().includes(term) ||
      activity.type?.toLowerCase().includes(term)
    );
  }

  // Apply type filter
  if (filter && filter !== 'all') {
    filtered = filtered.filter(activity => activity.type === filter);
  }

  return filtered;
};

/**
 * Update activity action (like, comment, share)
 * @param {Array} activities - Array of activity objects
 * @param {string} activityId - ID of the activity to update
 * @param {string} action - Action type (like, comment, share)
 * @returns {Array} Updated activities array
 */
export const updateActivityAction = (activities: ActivityFeedItem[], activityId: string, action: string): ActivityFeedItem[] => {
  return activities.map(activity => {
    if (activity.id === activityId) {
      const updatedActivity = { ...activity };
      
      switch (action) {
        case 'like':
          updatedActivity.likes = (updatedActivity.likes || 0) + 1;
          updatedActivity.isLiked = true;
          break;
        case 'comment':
          updatedActivity.comments = (updatedActivity.comments || 0) + 1;
          break;
        case 'share':
          updatedActivity.shares = (updatedActivity.shares || 0) + 1;
          break;
        default:
          break;
      }
      
      return updatedActivity;
    }
    return activity;
  });
};

/**
 * Format timestamp for display
 * @param {Date|string} timestamp - Timestamp to format
 * @returns {string} Formatted timestamp string
 */
export const formatTimestamp = (timestamp: Date | string): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Sort activities by timestamp
 * @param {Array} activities - Array of activity objects
 * @param {string} order - Sort order (asc, desc)
 * @returns {Array} Sorted activities array
 */
export const sortActivitiesByTimestamp = (activities: ActivityFeedItem[], order: 'asc' | 'desc' = 'desc'): ActivityFeedItem[] => {
  if (!activities || !Array.isArray(activities)) {
    return [];
  }

  return [...activities].sort((a, b) => {
    const timestampA = new Date(a.timestamp).getTime();
    const timestampB = new Date(b.timestamp).getTime();
    
    return order === 'asc' ? timestampA - timestampB : timestampB - timestampA;
  });
};

/**
 * Group activities by date
 * @param {Array} activities - Array of activity objects
 * @returns {Object} Activities grouped by date
 */
export const groupActivitiesByDate = (activities: ActivityFeedItem[]): Record<string, ActivityFeedItem[]> => {
  if (!activities || !Array.isArray(activities)) {
    return {};
  }

  const grouped: Record<string, ActivityFeedItem[]> = {};
  
  activities.forEach(activity => {
    const date = new Date(activity.timestamp);
    const dateKey = date.toDateString();
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(activity);
  });
  
  return grouped;
};

/**
 * Calculate engagement metrics for activities
 * @param {Array} activities - Array of activity objects
 * @returns {Object} Engagement metrics
 */
export const calculateEngagementMetrics = (activities: ActivityFeedItem[]): any => {
  if (!activities || !Array.isArray(activities)) {
    return {
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      averageEngagement: 0,
      mostEngagedActivity: null
    };
  }

  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  let mostEngagedActivity = null;
  let maxEngagement = 0;

  activities.forEach(activity => {
    const likes = activity.likes || 0;
    const comments = activity.comments || 0;
    const shares = activity.shares || 0;
    
    totalLikes += likes;
    totalComments += comments;
    totalShares += shares;
    
    const engagement = likes + comments + shares;
    if (engagement > maxEngagement) {
      maxEngagement = engagement;
      mostEngagedActivity = activity;
    }
  });

  const totalEngagement = totalLikes + totalComments + totalShares;
  const averageEngagement = activities.length > 0 ? totalEngagement / activities.length : 0;

  return {
    totalLikes,
    totalComments,
    totalShares,
    totalEngagement,
    averageEngagement,
    mostEngagedActivity
  };
};

/**
 * Validate activity object
 * @param {Object} activity - Activity object to validate
 * @returns {Object} Validation result
 */
export const validateActivity = (activity: any): { isValid: boolean; errors: string[] } => {
  const errors = [];
  
  if (!activity.id) {
    errors.push('Activity ID is required');
  }
  
  if (!activity.title) {
    errors.push('Activity title is required');
  }
  
  if (!activity.description) {
    errors.push('Activity description is required');
  }
  
  if (!activity.type) {
    errors.push('Activity type is required');
  }
  
  if (!activity.timestamp) {
    errors.push('Activity timestamp is required');
  }
  
  if (!activity.user || !activity.user.id) {
    errors.push('Activity user is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate activity summary text
 * @param {Object} activity - Activity object
 * @returns {string} Summary text
 */
export const generateActivitySummary = (activity: ActivityFeedItem): string => {
  if (!activity) return '';
  
  const { type, user, metadata } = activity;
  const userName = user?.name || 'Unknown User';
  
  switch (type) {
    case 'user_joined':
      return `${userName} joined the platform`;
    case 'program_created':
      return `${userName} created a new training program`;
    case 'session_completed':
      return `${userName} completed a training session`;
    case 'assessment_taken':
      return `${userName} took an assessment`;
    case 'training_started':
      return `${userName} started a new training`;
    case 'certificate_earned':
      return `${userName} earned a certificate`;
    case 'feedback_submitted':
      return `${userName} submitted feedback`;
    case 'poll_created':
      return `${userName} created a poll`;
    case 'announcement':
      return `New announcement: ${activity.title}`;
    case 'milestone_reached':
      return `${userName} reached a milestone`;
    default:
      return `${userName} performed an action`;
  }
};

/**
 * Get activity priority for sorting
 * @param {Object} activity - Activity object
 * @returns {number} Priority value (higher = more important)
 */
export const getActivityPriority = (activity: ActivityFeedItem): number => {
  if (!activity) return 0;
  
  const priorityMap: Record<string, number> = {
    'announcement': 10,
    'milestone_reached': 9,
    'certificate_earned': 8,
    'assessment_taken': 7,
    'session_completed': 6,
    'training_started': 5,
    'program_created': 4,
    'feedback_submitted': 3,
    'poll_created': 2,
    'user_joined': 1,
    'general': 0
  };
  
  return priorityMap[activity.type] || 0;
};

/**
 * Check if activity is recent (within last 24 hours)
 * @param {Object} activity - Activity object
 * @returns {boolean} True if activity is recent
 */
export const isRecentActivity = (activity: ActivityFeedItem): boolean => {
  if (!activity || !activity.timestamp) return false;
  
  const activityTime = new Date(activity.timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - activityTime.getTime()) / (1000 * 60 * 60);
  
  return diffInHours <= 24;
};

/**
 * Export all helper functions
 */
export const ActivityFeedHelper = {
  filterActivities,
  updateActivityAction,
  formatTimestamp,
  sortActivitiesByTimestamp,
  groupActivitiesByDate,
  calculateEngagementMetrics,
  validateActivity,
  generateActivitySummary,
  getActivityPriority,
  isRecentActivity
};

export default ActivityFeedHelper;
