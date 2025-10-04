import { JobPostItem } from './types';

export interface JobsFeedParams {
  page: number;
  limit: number;
  filters?: {
    search?: string;
    location?: string;
    jobType?: string;
    experience?: string;
    salary?: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobsFeedResponse {
  success: boolean;
  data: JobPostItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export class JobsFeedFetcher {
  private static baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  /**
   * Get jobs with pagination and filters
   */
  static async getJobs(params: JobsFeedParams): Promise<JobsFeedResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      
      if (params.filters?.search) {
        queryParams.append('search', params.filters.search);
      }
      if (params.filters?.location) {
        queryParams.append('location', params.filters.location);
      }
      if (params.filters?.jobType) {
        queryParams.append('jobType', params.filters.jobType);
      }
      if (params.filters?.experience) {
        queryParams.append('experience', params.filters.experience);
      }
      if (params.filters?.salary) {
        queryParams.append('salary', params.filters.salary);
      }
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
      }
      if (params.sortOrder) {
        queryParams.append('sortOrder', params.sortOrder);
      }

      const response = await fetch(`${this.baseUrl}/api/v1/jobs?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.data || [],
        pagination: data.pagination || {
          page: params.page,
          limit: params.limit,
          total: 0,
          totalPages: 0
        },
        error: undefined
      };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: params.page,
          limit: params.limit,
          total: 0,
          totalPages: 0
        },
        error: (error as Error).message
      };
    }
  }

  /**
   * Get job by ID
   */
  static async getJobById(jobId: string): Promise<JobsFeedResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.data ? [data.data] : [],
        pagination: {
          page: 1,
          limit: 1,
          total: data.data ? 1 : 0,
          totalPages: 1
        },
        error: undefined
      };
    } catch (error) {
      console.error('Error fetching job:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 1,
          total: 0,
          totalPages: 0
        },
        error: (error as Error).message
      };
    }
  }

  /**
   * Search jobs
   */
  static async searchJobs(query: string, params: Omit<JobsFeedParams, 'filters'>): Promise<JobsFeedResponse> {
    return this.getJobs({
      ...params,
      filters: {
        search: query
      }
    });
  }

  /**
   * Get jobs by company
   */
  static async getJobsByCompany(companyId: string, params: Omit<JobsFeedParams, 'filters'>): Promise<JobsFeedResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      queryParams.append('company', companyId);
      
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
      }
      if (params.sortOrder) {
        queryParams.append('sortOrder', params.sortOrder);
      }

      const response = await fetch(`${this.baseUrl}/api/v1/jobs/company/${companyId}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.data || [],
        pagination: data.pagination || {
          page: params.page,
          limit: params.limit,
          total: 0,
          totalPages: 0
        },
        error: undefined
      };
    } catch (error) {
      console.error('Error fetching jobs by company:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: params.page,
          limit: params.limit,
          total: 0,
          totalPages: 0
        },
        error: (error as Error).message
      };
    }
  }

  /**
   * Get featured jobs
   */
  static async getFeaturedJobs(params: Omit<JobsFeedParams, 'filters'>): Promise<JobsFeedResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      queryParams.append('featured', 'true');
      
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
      }
      if (params.sortOrder) {
        queryParams.append('sortOrder', params.sortOrder);
      }

      const response = await fetch(`${this.baseUrl}/api/v1/jobs/featured?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.data || [],
        pagination: data.pagination || {
          page: params.page,
          limit: params.limit,
          total: 0,
          totalPages: 0
        },
        error: undefined
      };
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: params.page,
          limit: params.limit,
          total: 0,
          totalPages: 0
        },
        error: (error as Error).message
      };
    }
  }

  /**
   * Get job statistics
   */
  static async getJobStatistics(): Promise<{
    success: boolean;
    data?: {
      total: number;
      active: number;
      featured: number;
      urgent: number;
      totalViews: number;
      totalApplications: number;
      avgViews: number;
      avgApplications: number;
    };
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/jobs/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.data,
        error: undefined
      };
    } catch (error) {
      console.error('Error fetching job statistics:', error);
      return {
        success: false,
        data: undefined,
        error: (error as Error).message
      };
    }
  }

  /**
   * Get authentication token
   */
  private static getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}
