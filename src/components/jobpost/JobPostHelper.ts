import { JobPostItem, JobPostFilters, JobPostStats } from './types';

export class JobPostHelper {
  /**
   * Filter job posts based on criteria
   */
  static filterJobPosts(jobPosts: JobPostItem[], filters: JobPostFilters): JobPostItem[] {
    return jobPosts.filter(jobPost => {
      // Status filter
      if (filters.status !== 'all' && jobPost.status !== filters.status) {
        return false;
      }
      
      // Department filter (using company industry as department)
      if (filters.department !== 'all' && jobPost.company.industry !== filters.department) {
        return false;
      }
      
      // Location filter
      if (filters.location !== 'all' && jobPost.location.city !== filters.location) {
        return false;
      }
      
      // Type filter
      if (filters.type !== 'all' && jobPost.jobType !== filters.type) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Search job posts by query
   */
  static searchJobPosts(jobPosts: JobPostItem[], query: string): JobPostItem[] {
    if (!query.trim()) return jobPosts;
    
    const searchTerm = query.toLowerCase();
    return jobPosts.filter(jobPost => 
      jobPost.title.toLowerCase().includes(searchTerm) ||
      jobPost.description.toLowerCase().includes(searchTerm) ||
      jobPost.company.industry?.toLowerCase().includes(searchTerm) ||
      jobPost.location.city?.toLowerCase().includes(searchTerm) ||
      jobPost.requirements?.experience?.description?.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Sort job posts by criteria
   */
  static sortJobPosts(jobPosts: JobPostItem[], sortBy: string, sortOrder: 'asc' | 'desc'): JobPostItem[] {
    return [...jobPosts].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'likes':
          aValue = 0; // Not in new structure
          bValue = 0;
          break;
        case 'comments':
          aValue = 0; // Not in new structure
          bValue = 0;
          break;
        case 'shares':
          aValue = 0; // Not in new structure
          bValue = 0;
          break;
        case 'views':
          aValue = a.analytics?.views || 0;
          bValue = b.analytics?.views || 0;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  /**
   * Format date for display
   */
  static formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  static formatRelativeTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return this.formatDate(dateObj);
    }
  }

  /**
   * Validate job post data
   */
  static validateJobPost(jobPost: Partial<JobPostItem>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!jobPost.title || jobPost.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (jobPost.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }
    
    if (!jobPost.description || jobPost.description.trim().length === 0) {
      errors.push('Description is required');
    } else if (jobPost.description.length > 2000) {
      errors.push('Description must be less than 2000 characters');
    }
    
    if (!jobPost.company?.industry || jobPost.company.industry.trim().length === 0) {
      errors.push('Department is required');
    }
    
    if (!jobPost.location?.city || jobPost.location.city.trim().length === 0) {
      errors.push('Location is required');
    }
    
    if (!jobPost.jobType || jobPost.jobType.trim().length === 0) {
      errors.push('Job type is required');
    }
    
    if (jobPost.salary && jobPost.salary.min && jobPost.salary.min < 0) {
      errors.push('Salary must be a positive number');
    }
    
    if (jobPost.requirements?.experience?.description && jobPost.requirements.experience.description.length > 1000) {
      errors.push('Requirements must be less than 1000 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate job post engagement metrics
   */
  static calculateEngagementMetrics(jobPost: JobPostItem): {
    engagementScore: number;
    engagementRate: number;
    totalInteractions: number;
  } {
    const totalInteractions = (jobPost.analytics?.views || 0) + (jobPost.analytics?.applications || 0);
    const engagementScore = (jobPost.analytics?.views || 0) * 1 + (jobPost.analytics?.applications || 0) * 2;
    const engagementRate = (jobPost.analytics?.views || 0) > 0 ? (totalInteractions / (jobPost.analytics?.views || 1)) * 100 : 0;
    
    return {
      engagementScore,
      engagementRate: Math.round(engagementRate * 100) / 100,
      totalInteractions
    };
  }

  /**
   * Get job post priority based on engagement and recency
   */
  static getJobPostPriority(jobPost: JobPostItem): 'high' | 'medium' | 'low' {
    const metrics = this.calculateEngagementMetrics(jobPost);
    const daysSinceCreated = Math.floor(
      (new Date().getTime() - new Date(jobPost.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (metrics.engagementScore > 50 || daysSinceCreated < 1) {
      return 'high';
    } else if (metrics.engagementScore > 20 || daysSinceCreated < 7) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Check if job post is recent (within last 24 hours)
   */
  static isRecentJobPost(jobPost: JobPostItem): boolean {
    const hoursSinceCreated = Math.floor(
      (new Date().getTime() - new Date(jobPost.createdAt).getTime()) / (1000 * 60 * 60)
    );
    return hoursSinceCreated < 24;
  }

  /**
   * Get job post status color
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get job post type icon
   */
  static getTypeIcon(type: string): string {
    switch (type) {
      case 'full-time':
        return '💼';
      case 'part-time':
        return '⏰';
      case 'contract':
        return '📋';
      case 'internship':
        return '🎓';
      case 'remote':
        return '🏠';
      default:
        return '💼';
    }
  }

  /**
   * Generate job post summary
   */
  static generateJobPostSummary(jobPost: JobPostItem): string {
    const metrics = this.calculateEngagementMetrics(jobPost);
    const priority = this.getJobPostPriority(jobPost);
    
    return `${jobPost.title} - ${jobPost.company.industry} (${jobPost.location.city}) - ${metrics.totalInteractions} interactions, ${priority} priority`;
  }

  /**
   * Check if user can perform action on job post
   */
  static canUserPerformAction(
    user: any,
    jobPost: JobPostItem,
    action: 'edit' | 'delete' | 'view'
  ): boolean {
    if (!user) return false;
    
    // Super admin can do everything
    if (user.role === 'super_admin') return true;
    
    // Admin can edit/delete their own posts
    if (user.role === 'admin') {
      if (action === 'view') return true;
      if (action === 'edit' || action === 'delete') {
        return jobPost.postedBy === user.id;
      }
    }
    
    // Regular users can only view
    if (user.role === 'user') {
      return action === 'view';
    }
    
    return false;
  }

  /**
   * Get job post statistics
   */
  static getJobPostStatistics(jobPosts: JobPostItem[]): JobPostStats {
    const total = jobPosts.length;
    const active = jobPosts.filter(p => p.status === 'active').length;
    const paused = jobPosts.filter(p => p.status === 'paused').length;
    const draft = jobPosts.filter(p => p.status === 'draft').length;
    
    const totalViews = jobPosts.reduce((sum, p) => sum + (p.analytics?.views || 0), 0);
    const totalApplications = jobPosts.reduce((sum, p) => sum + (p.analytics?.applications || 0), 0);
    const totalShortlisted = jobPosts.reduce((sum, p) => sum + (p.analytics?.shortlisted || 0), 0);
    const totalHired = jobPosts.reduce((sum, p) => sum + (p.analytics?.hired || 0), 0);
    
    const avgEngagement = totalViews > 0 ? ((totalApplications + totalShortlisted + totalHired) / totalViews) * 100 : 0;
    
    return {
      total,
      active,
      inactive: paused, // Map paused to inactive for compatibility
      draft,
      totalLikes: 0, // Not in new structure
      totalComments: 0, // Not in new structure
      totalShares: 0, // Not in new structure
      totalViews,
      avgEngagement: Math.round(avgEngagement * 100) / 100
    };
  }
}
