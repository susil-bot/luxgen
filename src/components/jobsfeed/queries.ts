import { JobPostItem, JobsFeedFilters, JobsFeedSortOptions } from './Types.types';

export class JobsFeedQueries {
  /**
   * Build query parameters for API requests
   */
  static buildQueryParams(
    page: number,
    limit: number,
    filters?: JobsFeedFilters,
    sortOptions?: JobsFeedSortOptions
  ): URLSearchParams {
    const params = new URLSearchParams();
    
    // Pagination
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    // Filters
    if (filters?.search) {
      params.append('search', filters.search.trim());
    }
    if (filters?.location) {
      params.append('location', filters.location.trim());
    }
    if (filters?.jobType) {
      params.append('jobType', filters.jobType);
    }
    if (filters?.experience) {
      params.append('experienceLevel', filters.experience);
    }
    if (filters?.salary) {
      this.addSalaryFilter(params, filters.salary);
    }
    
    // Sorting
    if (sortOptions?.sortBy) {
      params.append('sortBy', sortOptions.sortBy);
    }
    if (sortOptions?.sortOrder) {
      params.append('sortOrder', sortOptions.sortOrder);
    }
    
    return params;
  }

  /**
   * Add salary filter to query parameters
   */
  private static addSalaryFilter(params: URLSearchParams, salaryFilter: string): void {
    if (salaryFilter.includes('-')) {
      const [min, max] = salaryFilter.split('-').map(s => parseInt(s));
      params.append('salaryMin', min.toString());
      params.append('salaryMax', max.toString());
    } else if (salaryFilter.endsWith('+')) {
      const min = parseInt(salaryFilter.replace('+', ''));
      params.append('salaryMin', min.toString());
    }
  }

  /**
   * Build search query
   */
  static buildSearchQuery(query: string, filters?: JobsFeedFilters): string {
    const searchTerms: string[] = [];
    
    if (query.trim()) {
      searchTerms.push(query.trim());
    }
    
    if (filters?.location) {
      searchTerms.push(`location:${filters.location}`);
    }
    
    if (filters?.jobType) {
      searchTerms.push(`type:${filters.jobType}`);
    }
    
    if (filters?.experience) {
      searchTerms.push(`experience:${filters.experience}`);
    }
    
    return searchTerms.join(' ');
  }

  /**
   * Build MongoDB-style query for filtering
   */
  static buildMongoQuery(filters?: JobsFeedFilters): any {
    const query: any = {};
    
    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { 'company.name': { $regex: filters.search, $options: 'i' } },
        { 'requirements.skills': { $in: [new RegExp(filters.search, 'i')] } }
      ];
    }
    
    if (filters?.location) {
      query.$or = [
        { 'location.city': { $regex: filters.location, $options: 'i' } },
        { 'location.country': { $regex: filters.location, $options: 'i' } }
      ];
    }
    
    if (filters?.jobType) {
      query.jobType = filters.jobType;
    }
    
    if (filters?.experience) {
      query.experienceLevel = filters.experience;
    }
    
    if (filters?.salary) {
      this.addSalaryQuery(query, filters.salary);
    }
    
    // Only show active jobs by default
    query.status = 'active';
    query.visibility = 'public';
    
    return query;
  }

  /**
   * Add salary query to MongoDB query
   */
  private static addSalaryQuery(query: any, salaryFilter: string): void {
    if (salaryFilter.includes('-')) {
      const [min, max] = salaryFilter.split('-').map(s => parseInt(s));
      query['salary.min'] = { $gte: min, $lte: max };
    } else if (salaryFilter.endsWith('+')) {
      const min = parseInt(salaryFilter.replace('+', ''));
      query['salary.min'] = { $gte: min };
    }
  }

  /**
   * Build sort options for MongoDB
   */
  static buildSortOptions(sortBy: string, sortOrder: 'asc' | 'desc'): any {
    const sortMapping: { [key: string]: string } = {
      'title': 'title',
      'company': 'company.name',
      'location': 'location.city',
      'salary': 'salary.min',
      'createdAt': 'createdAt',
      'views': 'analytics.views',
      'applications': 'analytics.applications'
    };
    
    const field = sortMapping[sortBy] || 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    
    return { [field]: order };
  }

  /**
   * Build aggregation pipeline for job statistics
   */
  static buildStatisticsPipeline(tenantId?: string): any[] {
    const pipeline: any[] = [];
    
    // Match stage
    const matchStage: any = {
      status: 'active',
      visibility: 'public'
    };
    
    if (tenantId) {
      matchStage.tenantId = tenantId;
    }
    
    pipeline.push({ $match: matchStage });
    
    // Group stage
    pipeline.push({
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalViews: { $sum: '$analytics.views' },
        totalApplications: { $sum: '$analytics.applications' },
        totalShortlisted: { $sum: '$analytics.shortlisted' },
        totalHired: { $sum: '$analytics.hired' },
        featured: { $sum: { $cond: ['$featured', 1, 0] } },
        urgent: { $sum: { $cond: ['$urgent', 1, 0] } },
        avgViews: { $avg: '$analytics.views' },
        avgApplications: { $avg: '$analytics.applications' }
      }
    });
    
    return pipeline;
  }

  /**
   * Build aggregation pipeline for job insights
   */
  static buildInsightsPipeline(tenantId?: string): any[] {
    const pipeline: any[] = [];
    
    // Match stage
    const matchStage: any = {
      status: 'active',
      visibility: 'public'
    };
    
    if (tenantId) {
      matchStage.tenantId = tenantId;
    }
    
    pipeline.push({ $match: matchStage });
    
    // Group by company
    pipeline.push({
      $group: {
        _id: '$company.name',
        jobsCount: { $sum: 1 },
        activeJobs: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        totalViews: { $sum: '$analytics.views' },
        totalApplications: { $sum: '$analytics.applications' },
        avgSalary: { $avg: '$salary.min' }
      }
    });
    
    // Sort by jobs count
    pipeline.push({ $sort: { jobsCount: -1 } });
    
    // Limit to top companies
    pipeline.push({ $limit: 10 });
    
    return pipeline;
  }

  /**
   * Build aggregation pipeline for location insights
   */
  static buildLocationInsightsPipeline(tenantId?: string): any[] {
    const pipeline: any[] = [];
    
    // Match stage
    const matchStage: any = {
      status: 'active',
      visibility: 'public'
    };
    
    if (tenantId) {
      matchStage.tenantId = tenantId;
    }
    
    pipeline.push({ $match: matchStage });
    
    // Group by location
    pipeline.push({
      $group: {
        _id: {
          city: '$location.city',
          country: '$location.country'
        },
        jobsCount: { $sum: 1 },
        remoteJobs: { $sum: { $cond: ['$location.remote', 1, 0] } },
        hybridJobs: { $sum: { $cond: ['$location.hybrid', 1, 0] } },
        avgSalary: { $avg: '$salary.min' }
      }
    });
    
    // Sort by jobs count
    pipeline.push({ $sort: { jobsCount: -1 } });
    
    // Limit to top locations
    pipeline.push({ $limit: 10 });
    
    return pipeline;
  }

  /**
   * Build aggregation pipeline for skill insights
   */
  static buildSkillInsightsPipeline(tenantId?: string): any[] {
    const pipeline: any[] = [];
    
    // Match stage
    const matchStage: any = {
      status: 'active',
      visibility: 'public'
    };
    
    if (tenantId) {
      matchStage.tenantId = tenantId;
    }
    
    pipeline.push({ $match: matchStage });
    
    // Unwind skills array
    pipeline.push({ $unwind: '$requirements.skills' });
    
    // Group by skill
    pipeline.push({
      $group: {
        _id: '$requirements.skills',
        count: { $sum: 1 },
        relatedJobs: { $addToSet: '$_id' }
      }
    });
    
    // Add percentage calculation
    pipeline.push({
      $addFields: {
        percentage: { $multiply: [{ $divide: ['$count', { $sum: '$count' }] }, 100] }
      }
    });
    
    // Sort by count
    pipeline.push({ $sort: { count: -1 } });
    
    // Limit to top skills
    pipeline.push({ $limit: 20 });
    
    return pipeline;
  }

  /**
   * Build query for featured jobs
   */
  static buildFeaturedJobsQuery(tenantId?: string): any {
    const query: any = {
      status: 'active',
      visibility: 'public',
      featured: true
    };
    
    if (tenantId) {
      query.tenantId = tenantId;
    }
    
    return query;
  }

  /**
   * Build query for urgent jobs
   */
  static buildUrgentJobsQuery(tenantId?: string): any {
    const query: any = {
      status: 'active',
      visibility: 'public',
      urgent: true
    };
    
    if (tenantId) {
      query.tenantId = tenantId;
    }
    
    return query;
  }

  /**
   * Build query for jobs by company
   */
  static buildJobsByCompanyQuery(companyId: string, tenantId?: string): any {
    const query: any = {
      'company._id': companyId,
      status: 'active',
      visibility: 'public'
    };
    
    if (tenantId) {
      query.tenantId = tenantId;
    }
    
    return query;
  }

  /**
   * Build query for jobs by location
   */
  static buildJobsByLocationQuery(location: string, tenantId?: string): any {
    const query: any = {
      $or: [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } }
      ],
      status: 'active',
      visibility: 'public'
    };
    
    if (tenantId) {
      query.tenantId = tenantId;
    }
    
    return query;
  }
}
