/**
 * ActivityFeedFetcher.ts
 * API calls for ActivityFeed component
 */

import apiClient from '../../../services/apiClient';
import { ActivityFeedAPIResponse, ActivityFeedItem, ActivityFeedStats } from '../types/types';

/**
 * Get activities for a specific tenant
 * @param {string} tenantId - Tenant ID
 * @param {Object} options - Query options
 * @returns {Promise<ActivityFeedAPIResponse<ActivityFeedItem[]>>} API response
 */
export const getActivities = async (tenantId: string, options: any = {}): Promise<ActivityFeedAPIResponse<ActivityFeedItem[]>> => {
  try {
    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    const queryParams = new URLSearchParams({
      tenantId,
      ...options
    });

    const response = await apiClient.get(`/api/activities?${queryParams}`);
    
    return {
      success: true,
      data: response.data as ActivityFeedItem[],
      message: 'Activities loaded successfully'
    };
  } catch (error) {
    console.error('Error fetching activities:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch activities',
      data: undefined
    };
  }
};

/**
 * Get feed statistics for a tenant
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<ActivityFeedAPIResponse<ActivityFeedStats>>} API response
 */
export const getFeedStats = async (tenantId: string): Promise<ActivityFeedAPIResponse<ActivityFeedStats>> => {
  try {
    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    const response = await apiClient.get(`/api/activities/stats?tenantId=${tenantId}`);
    
    return {
      success: true,
      data: response.data as ActivityFeedStats,
      message: 'Feed stats loaded successfully'
    };
  } catch (error) {
    console.error('Error fetching feed stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch feed stats',
      data: undefined
    };
  }
};

/**
 * Perform an action on an activity (like, comment, share)
 * @param {string} activityId - Activity ID
 * @param {string} action - Action type
 * @param {string} tenantId - Tenant ID
 * @param {Object} payload - Additional payload data
 * @returns {Promise<ActivityFeedAPIResponse<any>>} API response
 */
export const performActivityAction = async (activityId: string, action: string, tenantId: string, payload: any = {}): Promise<ActivityFeedAPIResponse<any>> => {
  try {
    if (!activityId || !action || !tenantId) {
      throw new Error('Activity ID, action, and tenant ID are required');
    }

    const requestData = {
      activityId,
      action,
      tenantId,
      ...payload
    };

    const response = await apiClient.post(`/api/activities/${activityId}/actions`, requestData);
    
    return {
      success: true,
      data: response.data,
      message: 'Action performed successfully'
    };
  } catch (error) {
    console.error('Error performing activity action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to perform action',
      data: undefined
    };
  }
};

/**
 * Create a new activity
 * @param {Object} activityData - Activity data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>} API response
 */
export const createActivity = async (activityData: any, tenantId: string): Promise<ActivityFeedAPIResponse<any>> => {
  try {
    if (!activityData || !tenantId) {
      throw new Error('Activity data and tenant ID are required');
    }

    const requestData = {
      ...activityData,
      tenantId
    };

    const response = await apiClient.post('/api/activities', requestData);
    
    return {
      success: true,
      data: response.data,
      message: 'Activity created successfully'
    };
  } catch (error) {
    console.error('Error creating activity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create activity',
      data: undefined
    };
  }
};

/**
 * Update an existing activity
 * @param {string} activityId - Activity ID
 * @param {Object} updateData - Update data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>} API response
 */
export const updateActivity = async (activityId: string, updateData: any, tenantId: string): Promise<ActivityFeedAPIResponse<any>> => {
  try {
    if (!activityId || !updateData || !tenantId) {
      throw new Error('Activity ID, update data, and tenant ID are required');
    }

    const requestData = {
      ...updateData,
      tenantId
    };

    const response = await apiClient.put(`/api/activities/${activityId}`, requestData);
    
    return {
      success: true,
      data: response.data,
      message: 'Activity updated successfully'
    };
  } catch (error) {
    console.error('Error updating activity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update activity',
      data: undefined
    };
  }
};

/**
 * Delete an activity
 * @param {string} activityId - Activity ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>} API response
 */
export const deleteActivity = async (activityId: string, tenantId: string): Promise<ActivityFeedAPIResponse<any>> => {
  try {
    if (!activityId || !tenantId) {
      throw new Error('Activity ID and tenant ID are required');
    }

    const response = await apiClient.delete(`/api/activities/${activityId}?tenantId=${tenantId}`);
    
    return {
      success: true,
      data: response.data,
      message: 'Activity deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting activity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete activity',
      data: undefined
    };
  }
};

/**
 * Get activities by user
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} API response
 */
export const getActivitiesByUser = async (userId: string, tenantId: string, options: any = {}): Promise<ActivityFeedAPIResponse<ActivityFeedItem[]>> => {
  try {
    if (!userId || !tenantId) {
      throw new Error('User ID and tenant ID are required');
    }

    const queryParams = new URLSearchParams({
      userId,
      tenantId,
      ...options
    });

    const response = await apiClient.get(`/api/activities/user/${userId}?${queryParams}`);
    
    return {
      success: true,
      data: response.data as ActivityFeedItem[],
      message: 'User activities loaded successfully'
    };
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user activities',
      data: undefined
    };
  }
};

/**
 * Get activities by type
 * @param {string} type - Activity type
 * @param {string} tenantId - Tenant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} API response
 */
export const getActivitiesByType = async (type: string, tenantId: string, options: any = {}): Promise<ActivityFeedAPIResponse<ActivityFeedItem[]>> => {
  try {
    if (!type || !tenantId) {
      throw new Error('Activity type and tenant ID are required');
    }

    const queryParams = new URLSearchParams({
      type,
      tenantId,
      ...options
    });

    const response = await apiClient.get(`/api/activities/type/${type}?${queryParams}`);
    
    return {
      success: true,
      data: response.data as ActivityFeedItem[],
      message: 'Activities by type loaded successfully'
    };
  } catch (error) {
    console.error('Error fetching activities by type:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch activities by type',
      data: undefined
    };
  }
};

/**
 * Search activities
 * @param {string} searchTerm - Search term
 * @param {string} tenantId - Tenant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} API response
 */
export const searchActivities = async (searchTerm: string, tenantId: string, options: any = {}): Promise<ActivityFeedAPIResponse<ActivityFeedItem[]>> => {
  try {
    if (!searchTerm || !tenantId) {
      throw new Error('Search term and tenant ID are required');
    }

    const queryParams = new URLSearchParams({
      q: searchTerm,
      tenantId,
      ...options
    });

    const response = await apiClient.get(`/api/activities/search?${queryParams}`);
    
    return {
      success: true,
      data: response.data as ActivityFeedItem[],
      message: 'Search results loaded successfully'
    };
  } catch (error) {
    console.error('Error searching activities:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search activities',
      data: undefined
    };
  }
};

/**
 * Get activity engagement metrics
 * @param {string} activityId - Activity ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>} API response
 */
export const getActivityEngagement = async (activityId: string, tenantId: string): Promise<ActivityFeedAPIResponse<any>> => {
  try {
    if (!activityId || !tenantId) {
      throw new Error('Activity ID and tenant ID are required');
    }

    const response = await apiClient.get(`/api/activities/${activityId}/engagement?tenantId=${tenantId}`);
    
    return {
      success: true,
      data: response.data,
      message: 'Activity engagement loaded successfully'
    };
  } catch (error) {
    console.error('Error fetching activity engagement:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch activity engagement',
      data: undefined
    };
  }
};

/**
 * Export all fetcher functions
 */
export const ActivityFeedFetcher = {
  getActivities,
  getFeedStats,
  performActivityAction,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitiesByUser,
  getActivitiesByType,
  searchActivities,
  getActivityEngagement
};

export default ActivityFeedFetcher;
