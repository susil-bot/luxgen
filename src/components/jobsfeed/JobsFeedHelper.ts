import { JobPostItem } from './types';

export class JobsFeedHelper {
  /**
   * Format salary for display
   */
  static formatSalary(salary: any): string {
    if (!salary) return 'Salary not specified';
    if (typeof salary === 'string') return salary;
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    if (salary.min) return `$${salary.min.toLocaleString()}+`;
    if (salary.max) return `Up to $${salary.max.toLocaleString()}`;
    return 'Salary not specified';
  }

  /**
   * Format date for display
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  /**
   * Filter jobs based on criteria
   */
  static filterJobs(jobs: JobPostItem[], filters: any): JobPostItem[] {
    return jobs.filter(job => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.company?.name?.toLowerCase().includes(searchTerm) ||
          job.requirements?.skills?.some(skill => 
            skill.toLowerCase().includes(searchTerm)
          );
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location) {
        const locationTerm = filters.location.toLowerCase();
        const matchesLocation = 
          job.location?.city?.toLowerCase().includes(locationTerm) ||
          job.location?.country?.toLowerCase().includes(locationTerm);
        if (!matchesLocation) return false;
      }

      // Job type filter
      if (filters.jobType) {
        if (job.jobType !== filters.jobType) return false;
      }

      // Experience filter
      if (filters.experience) {
        if (job.experienceLevel !== filters.experience) return false;
      }

      // Salary filter
      if (filters.salary) {
        const salaryRange = filters.salary.split('-');
        if (salaryRange.length === 2) {
          const minSalary = parseInt(salaryRange[0]);
          const maxSalary = parseInt(salaryRange[1]);
          if (job.salary?.min && (job.salary.min < minSalary || job.salary.min > maxSalary)) {
            return false;
          }
        } else if (filters.salary.endsWith('+')) {
          const minSalary = parseInt(filters.salary.replace('+', ''));
          if (job.salary?.min && job.salary.min < minSalary) {
            return false;
          }
        }
      }

      return true;
    });
  }

  /**
   * Sort jobs by criteria
   */
  static sortJobs(jobs: JobPostItem[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc'): JobPostItem[] {
    return [...jobs].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'company':
          aValue = a.company?.name?.toLowerCase() || '';
          bValue = b.company?.name?.toLowerCase() || '';
          break;
        case 'location':
          aValue = a.location?.city?.toLowerCase() || '';
          bValue = b.location?.city?.toLowerCase() || '';
          break;
        case 'salary':
          aValue = a.salary?.min || 0;
          bValue = b.salary?.min || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'views':
          aValue = a.analytics?.views || 0;
          bValue = b.analytics?.views || 0;
          break;
        case 'applications':
          aValue = a.analytics?.applications || 0;
          bValue = b.analytics?.applications || 0;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  /**
   * Get job priority based on various factors
   */
  static getJobPriority(job: JobPostItem): 'high' | 'medium' | 'low' {
    let score = 0;

    // Featured jobs get high priority
    if (job.featured) score += 3;
    
    // Urgent jobs get high priority
    if (job.urgent) score += 2;
    
    // Recent jobs get higher priority
    const daysSinceCreated = Math.ceil(
      (new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreated <= 7) score += 2;
    else if (daysSinceCreated <= 30) score += 1;
    
    // High engagement gets priority
    const totalEngagement = (job.analytics?.views || 0) + (job.analytics?.applications || 0);
    if (totalEngagement > 100) score += 2;
    else if (totalEngagement > 50) score += 1;

    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  /**
   * Calculate job engagement metrics
   */
  static calculateEngagementMetrics(job: JobPostItem) {
    const views = job.analytics?.views || 0;
    const applications = job.analytics?.applications || 0;
    const shortlisted = job.analytics?.shortlisted || 0;
    const hired = job.analytics?.hired || 0;

    const totalInteractions = views + applications;
    const conversionRate = views > 0 ? (applications / views) * 100 : 0;
    const successRate = applications > 0 ? (hired / applications) * 100 : 0;

    return {
      views,
      applications,
      shortlisted,
      hired,
      totalInteractions,
      conversionRate: Math.round(conversionRate * 100) / 100,
      successRate: Math.round(successRate * 100) / 100
    };
  }

  /**
   * Generate job summary for analytics
   */
  static generateJobSummary(job: JobPostItem): string {
    const metrics = this.calculateEngagementMetrics(job);
    const priority = this.getJobPriority(job);
    
    return `${job.title} - ${job.company?.name} (${job.location?.city}) - ${metrics.totalInteractions} interactions, ${priority} priority`;
  }

  /**
   * Validate job data
   */
  static validateJob(job: JobPostItem): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!job.title || job.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!job.description || job.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!job.company?.name || job.company.name.trim().length === 0) {
      errors.push('Company name is required');
    }

    if (!job.location?.city || job.location.city.trim().length === 0) {
      errors.push('Location is required');
    }

    if (!job.jobType || job.jobType.trim().length === 0) {
      errors.push('Job type is required');
    }

    if (job.salary?.min && job.salary.min < 0) {
      errors.push('Salary must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get job statistics
   */
  static getJobStatistics(jobs: JobPostItem[]) {
    const total = jobs.length;
    const active = jobs.filter(job => job.status === 'active').length;
    const featured = jobs.filter(job => job.featured).length;
    const urgent = jobs.filter(job => job.urgent).length;
    
    const totalViews = jobs.reduce((sum, job) => sum + (job.analytics?.views || 0), 0);
    const totalApplications = jobs.reduce((sum, job) => sum + (job.analytics?.applications || 0), 0);
    
    const avgViews = total > 0 ? Math.round(totalViews / total) : 0;
    const avgApplications = total > 0 ? Math.round(totalApplications / total) : 0;

    return {
      total,
      active,
      featured,
      urgent,
      totalViews,
      totalApplications,
      avgViews,
      avgApplications
    };
  }
}
