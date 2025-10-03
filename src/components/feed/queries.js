/**
 * queries.js
 * Database queries for ActivityFeed component
 */

const mongoose = require('mongoose');

/**
 * Get activities for a tenant with pagination and filtering
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Activities array
 */
const getActivities = async (options = {}) => {
  try {
    const {
      tenantId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      type,
      userId,
      dateFrom,
      dateTo,
      search,
      status = 'active'
    } = options;

    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    // Build query
    const query = { tenantId, status };

    if (type) {
      query.type = type;
    }

    if (userId) {
      query.userId = userId;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query
    const activities = await mongoose.model('Activity').find(query)
      .populate('userId', 'name email avatar role department position')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await mongoose.model('Activity').countDocuments(query);

    return {
      activities,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  } catch (error) {
    console.error('Error in getActivities query:', error);
    throw error;
  }
};

/**
 * Get activity statistics for a tenant
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Statistics object
 */
const getActivityStats = async (options = {}) => {
  try {
    const {
      tenantId,
      dateFrom,
      dateTo,
      userId,
      type
    } = options;

    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    // Build base query
    const baseQuery = { tenantId, status: 'active' };

    if (userId) {
      baseQuery.userId = userId;
    }

    if (type) {
      baseQuery.type = type;
    }

    if (dateFrom || dateTo) {
      baseQuery.createdAt = {};
      if (dateFrom) {
        baseQuery.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        baseQuery.createdAt.$lte = new Date(dateTo);
      }
    }

    // Get total activities
    const totalActivities = await mongoose.model('Activity').countDocuments(baseQuery);

    // Get activities by type
    const activitiesByType = await mongoose.model('Activity').aggregate([
      { $match: baseQuery },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get active users (users who created activities)
    const activeUsers = await mongoose.model('Activity').distinct('userId', baseQuery);

    // Get engagement metrics
    const engagementMetrics = await mongoose.model('Activity').aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
          totalShares: { $sum: '$shares' },
          averageEngagement: { $avg: { $add: ['$likes', '$comments', '$shares'] } }
        }
      }
    ]);

    // Get this week's activities
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekQuery = { ...baseQuery, createdAt: { $gte: oneWeekAgo } };
    const thisWeek = await mongoose.model('Activity').countDocuments(thisWeekQuery);

    // Get this month's activities
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const thisMonthQuery = { ...baseQuery, createdAt: { $gte: oneMonthAgo } };
    const thisMonth = await mongoose.model('Activity').countDocuments(thisMonthQuery);

    // Calculate engagement rate
    const engagement = engagementMetrics[0] || { totalLikes: 0, totalComments: 0, totalShares: 0, averageEngagement: 0 };
    const totalEngagement = engagement.totalLikes + engagement.totalComments + engagement.totalShares;
    const engagementRate = totalActivities > 0 ? (totalEngagement / totalActivities) * 100 : 0;

    // Get top activity type
    const topActivityType = activitiesByType.length > 0 ? activitiesByType[0]._id : null;

    return {
      totalActivities,
      activeUsers: activeUsers.length,
      engagementRate: Math.round(engagementRate * 100) / 100,
      thisWeek,
      thisMonth,
      topActivityType,
      averageEngagement: Math.round(engagement.averageEngagement * 100) / 100,
      totalLikes: engagement.totalLikes,
      totalComments: engagement.totalComments,
      totalShares: engagement.totalShares,
      activitiesByType: activitiesByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error in getActivityStats query:', error);
    throw error;
  }
};

/**
 * Get activities by user
 * @param {Object} options - Query options
 * @returns {Promise<Array>} User activities array
 */
const getActivitiesByUser = async (options = {}) => {
  try {
    const {
      userId,
      tenantId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      type,
      dateFrom,
      dateTo
    } = options;

    if (!userId || !tenantId) {
      throw new Error('User ID and Tenant ID are required');
    }

    const query = { userId, tenantId, status: 'active' };

    if (type) {
      query.type = type;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const activities = await mongoose.model('Activity').find(query)
      .populate('userId', 'name email avatar role')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await mongoose.model('Activity').countDocuments(query);

    return {
      activities,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  } catch (error) {
    console.error('Error in getActivitiesByUser query:', error);
    throw error;
  }
};

/**
 * Get activities by type
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Activities by type array
 */
const getActivitiesByType = async (options = {}) => {
  try {
    const {
      type,
      tenantId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      dateFrom,
      dateTo
    } = options;

    if (!type || !tenantId) {
      throw new Error('Type and Tenant ID are required');
    }

    const query = { type, tenantId, status: 'active' };

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const activities = await mongoose.model('Activity').find(query)
      .populate('userId', 'name email avatar role')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await mongoose.model('Activity').countDocuments(query);

    return {
      activities,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  } catch (error) {
    console.error('Error in getActivitiesByType query:', error);
    throw error;
  }
};

/**
 * Search activities
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Search results array
 */
const searchActivities = async (options = {}) => {
  try {
    const {
      query: searchQuery,
      tenantId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      filters = {}
    } = options;

    if (!searchQuery || !tenantId) {
      throw new Error('Search query and Tenant ID are required');
    }

    const query = {
      tenantId,
      status: 'active',
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } }
      ]
    };

    // Apply additional filters
    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) {
        query.createdAt.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        query.createdAt.$lte = new Date(filters.dateTo);
      }
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const activities = await mongoose.model('Activity').find(query)
      .populate('userId', 'name email avatar role')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await mongoose.model('Activity').countDocuments(query);

    return {
      activities,
      total,
      page,
      limit,
      hasMore: (page * limit) < total,
      query: searchQuery,
      filters
    };
  } catch (error) {
    console.error('Error in searchActivities query:', error);
    throw error;
  }
};

/**
 * Get activity engagement metrics
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Engagement metrics
 */
const getActivityEngagement = async (options = {}) => {
  try {
    const { activityId, tenantId } = options;

    if (!activityId || !tenantId) {
      throw new Error('Activity ID and Tenant ID are required');
    }

    const activity = await mongoose.model('Activity').findOne({
      _id: activityId,
      tenantId,
      status: 'active'
    }).lean();

    if (!activity) {
      throw new Error('Activity not found');
    }

    // Get engagement actions
    const engagementActions = await mongoose.model('ActivityAction').find({
      activityId,
      tenantId
    }).populate('userId', 'name email avatar').lean();

    // Calculate metrics
    const likes = engagementActions.filter(action => action.action === 'like').length;
    const comments = engagementActions.filter(action => action.action === 'comment').length;
    const shares = engagementActions.filter(action => action.action === 'share').length;
    const bookmarks = engagementActions.filter(action => action.action === 'bookmark').length;

    // Get top engagers
    const topEngagers = await mongoose.model('ActivityAction').aggregate([
      { $match: { activityId, tenantId } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          avatar: '$user.avatar',
          engagementCount: '$count'
        }
      }
    ]);

    // Get recent comments
    const recentComments = await mongoose.model('ActivityComment').find({
      activityId,
      tenantId
    })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const totalEngagement = likes + comments + shares;
    const engagementRate = totalEngagement > 0 ? (totalEngagement / (likes + comments + shares + bookmarks)) * 100 : 0;

    return {
      likes,
      comments,
      shares,
      bookmarks,
      totalEngagement,
      engagementRate: Math.round(engagementRate * 100) / 100,
      topEngagers,
      recentComments
    };
  } catch (error) {
    console.error('Error in getActivityEngagement query:', error);
    throw error;
  }
};

/**
 * Create a new activity
 * @param {Object} activityData - Activity data
 * @returns {Promise<Object>} Created activity
 */
const createActivity = async (activityData) => {
  try {
    const {
      title,
      description,
      type,
      userId,
      tenantId,
      metadata = {},
      tags = [],
      visibility = 'public',
      priority = 2
    } = activityData;

    if (!title || !description || !type || !userId || !tenantId) {
      throw new Error('Required fields: title, description, type, userId, tenantId');
    }

    const activity = new mongoose.model('Activity')({
      title,
      description,
      type,
      userId,
      tenantId,
      metadata,
      tags,
      visibility,
      priority,
      likes: 0,
      comments: 0,
      shares: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedActivity = await activity.save();
    return await mongoose.model('Activity').findById(savedActivity._id)
      .populate('userId', 'name email avatar role')
      .lean();
  } catch (error) {
    console.error('Error in createActivity query:', error);
    throw error;
  }
};

/**
 * Update an activity
 * @param {Object} options - Update options
 * @returns {Promise<Object>} Updated activity
 */
const updateActivity = async (options = {}) => {
  try {
    const {
      activityId,
      tenantId,
      updateData
    } = options;

    if (!activityId || !tenantId || !updateData) {
      throw new Error('Activity ID, Tenant ID, and update data are required');
    }

    const activity = await mongoose.model('Activity').findOneAndUpdate(
      { _id: activityId, tenantId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email avatar role').lean();

    if (!activity) {
      throw new Error('Activity not found');
    }

    return activity;
  } catch (error) {
    console.error('Error in updateActivity query:', error);
    throw error;
  }
};

/**
 * Delete an activity (soft delete)
 * @param {Object} options - Delete options
 * @returns {Promise<Object>} Deletion result
 */
const deleteActivity = async (options = {}) => {
  try {
    const { activityId, tenantId } = options;

    if (!activityId || !tenantId) {
      throw new Error('Activity ID and Tenant ID are required');
    }

    const result = await mongoose.model('Activity').findOneAndUpdate(
      { _id: activityId, tenantId },
      { status: 'deleted', updatedAt: new Date() },
      { new: true }
    );

    if (!result) {
      throw new Error('Activity not found');
    }

    return { success: true, message: 'Activity deleted successfully' };
  } catch (error) {
    console.error('Error in deleteActivity query:', error);
    throw error;
  }
};

/**
 * Export all query functions
 */
module.exports = {
  getActivities,
  getActivityStats,
  getActivitiesByUser,
  getActivitiesByType,
  searchActivities,
  getActivityEngagement,
  createActivity,
  updateActivity,
  deleteActivity
};
