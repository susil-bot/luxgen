import { JobPostItem, JobPostFilters } from './types';

export class JobPostQueries {
  /**
   * Get job posts with pagination and filters
   */
  static getJobPostsQuery(filters: JobPostFilters, page: number = 1, limit: number = 10) {
    const query: any = {};
    
    // Status filter
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    
    // Department filter
    if (filters.department && filters.department !== 'all') {
      query.department = filters.department;
    }
    
    // Location filter
    if (filters.location && filters.location !== 'all') {
      query.location = filters.location;
    }
    
    // Type filter
    if (filters.type && filters.type !== 'all') {
      query.type = filters.type;
    }
    
    return {
      query,
      options: {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }

  /**
   * Get job post by ID
   */
  static getJobPostByIdQuery(id: string) {
    return {
      query: { _id: id },
      options: {
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar department position' },
          { path: 'department', select: 'name description' },
          { path: 'comments', populate: { path: 'user', select: 'firstName lastName avatar' } }
        ]
      }
    };
  }

  /**
   * Search job posts
   */
  static searchJobPostsQuery(searchTerm: string, filters: JobPostFilters) {
    const query: any = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { department: { $regex: searchTerm, $options: 'i' } },
        { location: { $regex: searchTerm, $options: 'i' } },
        { requirements: { $regex: searchTerm, $options: 'i' } },
        { skills: { $in: [new RegExp(searchTerm, 'i')] } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    };
    
    // Apply additional filters
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    
    if (filters.department && filters.department !== 'all') {
      query.department = filters.department;
    }
    
    if (filters.location && filters.location !== 'all') {
      query.location = filters.location;
    }
    
    if (filters.type && filters.type !== 'all') {
      query.type = filters.type;
    }
    
    return {
      query,
      options: {
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }

  /**
   * Get job posts by user
   */
  static getJobPostsByUserQuery(userId: string, page: number = 1, limit: number = 10) {
    return {
      query: { createdBy: userId },
      options: {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }

  /**
   * Get job posts by department
   */
  static getJobPostsByDepartmentQuery(department: string, page: number = 1, limit: number = 10) {
    return {
      query: { department },
      options: {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }

  /**
   * Get job post statistics
   */
  static getJobPostStatsQuery() {
    return [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
          draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
          archived: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } },
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
          totalShares: { $sum: '$shares' },
          totalViews: { $sum: '$views' }
        }
      }
    ];
  }

  /**
   * Get job post engagement metrics
   */
  static getJobPostEngagementQuery(jobPostId: string) {
    return {
      query: { _id: jobPostId },
      options: {
        select: 'likes comments shares views',
        populate: [
          { path: 'likes', select: 'user' },
          { path: 'comments', select: 'user text createdAt' },
          { path: 'shares', select: 'user platform createdAt' }
        ]
      }
    };
  }

  /**
   * Get featured job posts
   */
  static getFeaturedJobPostsQuery(limit: number = 5) {
    return {
      query: { isFeatured: true, status: 'active' },
      options: {
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }

  /**
   * Get urgent job posts
   */
  static getUrgentJobPostsQuery(limit: number = 5) {
    return {
      query: { isUrgent: true, status: 'active' },
      options: {
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }

  /**
   * Get recent job posts
   */
  static getRecentJobPostsQuery(limit: number = 10) {
    return {
      query: { status: 'active' },
      options: {
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }

  /**
   * Get job posts by tags
   */
  static getJobPostsByTagsQuery(tags: string[], limit: number = 10) {
    return {
      query: { 
        tags: { $in: tags },
        status: 'active'
      },
      options: {
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }

  /**
   * Get job posts by skills
   */
  static getJobPostsBySkillsQuery(skills: string[], limit: number = 10) {
    return {
      query: { 
        skills: { $in: skills },
        status: 'active'
      },
      options: {
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }

  /**
   * Get job posts by salary range
   */
  static getJobPostsBySalaryRangeQuery(minSalary: number, maxSalary: number, limit: number = 10) {
    return {
      query: { 
        salary: { $gte: minSalary, $lte: maxSalary },
        status: 'active'
      },
      options: {
        limit,
        sort: { salary: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }

  /**
   * Get job posts by remote work
   */
  static getRemoteJobPostsQuery(limit: number = 10) {
    return {
      query: { 
        isRemote: true,
        status: 'active'
      },
      options: {
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'firstName lastName email avatar' },
          { path: 'department', select: 'name' }
        ]
      }
    };
  }
}
