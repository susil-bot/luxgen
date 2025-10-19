import { JobPostItem } from './Types.types';

export interface JobsFeedTransformer {
  transformJobs(jobs: JobPostItem[]): JobPostItem[];
  transformJob(job: any): JobPostItem;
  transformFilters(filters: any): any;
  transformSortOptions(sortBy: string, sortOrder: 'asc' | 'desc'): any;
}

export class JobsFeedTransformer implements JobsFeedTransformer {
  /**
   * Transform array of jobs for display
   */
  static transformJobs(jobs: JobPostItem[]): JobPostItem[] {
    return jobs.map(job => this.transformJob(job));
  }

  /**
   * Transform single job for display
   */
  static transformJob(job: any): JobPostItem {
    return {
      _id: job._id || job.id,
      title: job.title || '',
      description: job.description || '',
      shortDescription: job.shortDescription || '',
      company: {
        name: job.company?.name || '',
        logo: job.company?.logo || '',
        website: job.company?.website || '',
        size: job.company?.size || 'medium',
        industry: job.company?.industry || '',
        location: {
          city: job.company?.location?.city || '',
          state: job.company?.location?.state || '',
          country: job.company?.location?.country || '',
          remote: job.company?.location?.remote || false
        }
      },
      jobType: job.jobType || 'full-time',
      experienceLevel: job.experienceLevel || 'entry',
      salary: job.salary ? {
        min: job.salary.min || 0,
        max: job.salary.max || 0,
        currency: job.salary.currency || 'USD',
        period: job.salary.period || 'yearly'
      } : undefined,
      location: {
        city: job.location?.city || '',
        state: job.location?.state || '',
        country: job.location?.country || '',
        remote: job.location?.remote || false,
        hybrid: job.location?.hybrid || false
      },
      requirements: {
        skills: job.requirements?.skills || [],
        education: {
          level: job.requirements?.education?.level || 'any',
          field: job.requirements?.education?.field || ''
        },
        experience: {
          years: job.requirements?.experience?.years || 0,
          description: job.requirements?.experience?.description || ''
        },
        certifications: job.requirements?.certifications || [],
        languages: job.requirements?.languages || []
      },
      benefits: job.benefits || [],
      perks: job.perks || [],
      applicationProcess: job.applicationProcess ? {
        deadline: job.applicationProcess.deadline || '',
        startDate: job.applicationProcess.startDate || '',
        process: job.applicationProcess.process || 'direct',
        stages: job.applicationProcess.stages || []
      } : undefined,
      status: job.status || 'active',
      visibility: job.visibility || 'public',
      analytics: {
        views: job.analytics?.views || 0,
        applications: job.analytics?.applications || 0,
        shortlisted: job.analytics?.shortlisted || 0,
        hired: job.analytics?.hired || 0
      },
      tags: job.tags || [],
      keywords: job.keywords || [],
      featured: job.featured || false,
      urgent: job.urgent || false,
      postedBy: job.postedBy || '',
      tenantId: job.tenantId || '',
      publishedAt: job.publishedAt || '',
      expiresAt: job.expiresAt || '',
      createdAt: job.createdAt || new Date().toISOString(),
      updatedAt: job.updatedAt || new Date().toISOString()
    };
  }

  /**
   * Transform filters for API
   */
  static transformFilters(filters: any): any {
    const transformedFilters: any = {};

    if (filters.search) {
      transformedFilters.search = filters.search.trim();
    }

    if (filters.location) {
      transformedFilters.location = filters.location.trim();
    }

    if (filters.jobType) {
      transformedFilters.jobType = filters.jobType;
    }

    if (filters.experience) {
      transformedFilters.experienceLevel = filters.experience;
    }

    if (filters.salary) {
      // Parse salary range
      if (filters.salary.includes('-')) {
        const [min, max] = filters.salary.split('-').map((s: string) => parseInt(s));
        transformedFilters.salaryMin = min;
        transformedFilters.salaryMax = max;
      } else if (filters.salary.endsWith('+')) {
        const min = parseInt(filters.salary.replace('+', ''));
        transformedFilters.salaryMin = min;
      }
    }

    return transformedFilters;
  }

  /**
   * Transform sort options for API
   */
  static transformSortOptions(sortBy: string, sortOrder: 'asc' | 'desc'): any {
    const sortMapping: { [key: string]: string } = {
      'title': 'title',
      'company': 'company.name',
      'location': 'location.city',
      'salary': 'salary.min',
      'createdAt': 'createdAt',
      'views': 'analytics.views',
      'applications': 'analytics.applications'
    };

    return {
      sortBy: sortMapping[sortBy] || 'createdAt',
      sortOrder: sortOrder
    };
  }

  /**
   * Transform job for creation/update
   */
  static transformJobForAPI(job: any): any {
    return {
      title: job.title,
      description: job.description,
      shortDescription: job.shortDescription,
      company: {
        name: job.company?.name,
        logo: job.company?.logo,
        website: job.company?.website,
        size: job.company?.size,
        industry: job.company?.industry,
        location: {
          city: job.company?.location?.city,
          state: job.company?.location?.state,
          country: job.company?.location?.country,
          remote: job.company?.location?.remote
        }
      },
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      salary: job.salary ? {
        min: job.salary.min,
        max: job.salary.max,
        currency: job.salary.currency,
        period: job.salary.period
      } : undefined,
      location: {
        city: job.location?.city,
        state: job.location?.state,
        country: job.location?.country,
        remote: job.location?.remote,
        hybrid: job.location?.hybrid
      },
      requirements: {
        skills: job.requirements?.skills,
        education: {
          level: job.requirements?.education?.level,
          field: job.requirements?.education?.field
        },
        experience: {
          years: job.requirements?.experience?.years,
          description: job.requirements?.experience?.description
        },
        certifications: job.requirements?.certifications,
        languages: job.requirements?.languages
      },
      benefits: job.benefits,
      perks: job.perks,
      applicationProcess: job.applicationProcess ? {
        deadline: job.applicationProcess.deadline,
        startDate: job.applicationProcess.startDate,
        process: job.applicationProcess.process,
        stages: job.applicationProcess.stages
      } : undefined,
      status: job.status,
      visibility: job.visibility,
      tags: job.tags,
      keywords: job.keywords,
      featured: job.featured,
      urgent: job.urgent,
      publishedAt: job.publishedAt,
      expiresAt: job.expiresAt
    };
  }

  /**
   * Transform job statistics
   */
  static transformJobStatistics(stats: any): any {
    return {
      total: stats.total || 0,
      active: stats.active || 0,
      featured: stats.featured || 0,
      urgent: stats.urgent || 0,
      totalViews: stats.totalViews || 0,
      totalApplications: stats.totalApplications || 0,
      avgViews: stats.avgViews || 0,
      avgApplications: stats.avgApplications || 0
    };
  }

  /**
   * Transform search results
   */
  static transformSearchResults(results: any[]): JobPostItem[] {
    return results.map(result => this.transformJob(result));
  }

  /**
   * Transform job for analytics
   */
  static transformJobForAnalytics(job: JobPostItem): any {
    return {
      id: job._id,
      title: job.title,
      company: job.company?.name,
      location: `${job.location?.city}, ${job.location?.country}`,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      views: job.analytics?.views || 0,
      applications: job.analytics?.applications || 0,
      shortlisted: job.analytics?.shortlisted || 0,
      hired: job.analytics?.hired || 0,
      featured: job.featured,
      urgent: job.urgent,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    };
  }
}
