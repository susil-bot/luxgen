import { JobPostItem, JobPostStats, CreateJobPostData, UpdateJobPostData, JobPostQueryParams, JobPostResponse } from './Types.types';

/**
 * Fetcher interface for API operations
 */
export interface IFetcher {
  getJobPosts(params: JobPostQueryParams): Promise<JobPostResponse>;
  getJobPostById(id: string): Promise<{ success: boolean; data?: JobPostItem; error?: string }>;
  createJobPost(data: CreateJobPostData): Promise<{ success: boolean; data?: JobPostItem; error?: string }>;
  updateJobPost(id: string, data: UpdateJobPostData): Promise<{ success: boolean; data?: JobPostItem; error?: string }>;
  deleteJobPost(id: string): Promise<{ success: boolean; error?: string }>;
  likeJobPost(id: string): Promise<{ success: boolean; data?: JobPostItem; error?: string }>;
  commentJobPost(id: string, comment: string): Promise<{ success: boolean; data?: JobPostItem; error?: string }>;
  shareJobPost(id: string): Promise<{ success: boolean; data?: JobPostItem; error?: string }>;
  getJobPostStats(): Promise<{ success: boolean; data?: JobPostStats; error?: string }>;
}

/**
 * JobPost Fetcher implementation
 */
export const JobPostFetcher: IFetcher = {
  /**
   * Fetch job posts with filters and pagination
   */
  async getJobPosts(params: JobPostQueryParams): Promise<JobPostResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      // Add filters
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value && value !== 'all') {
            queryParams.append(key, value);
          }
        });
      }
      
      // Add search
      if (params.search) {
        queryParams.append('search', params.search);
      }
      
      // Add sorting
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await fetch(`/api/v1/jobs?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: {
          jobPosts: data.data?.jobPosts || [],
          totalPages: data.data?.totalPages || 1,
          currentPage: data.data?.currentPage || 1,
          total: data.data?.total || 0
        }
      };
    } catch (error) {
      console.error('Error fetching job posts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch job posts'
      };
    }
  },

  /**
   * Fetch a single job post by ID
   */
  async getJobPostById(id: string): Promise<{ success: boolean; data?: JobPostItem; error?: string }> {
    try {
      const response = await fetch(`/api/v1/jobs/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Error fetching job post:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch job post'
      };
    }
  },

  /**
   * Create a new job post
   */
  async createJobPost(data: CreateJobPostData): Promise<{ success: boolean; data?: JobPostItem; error?: string }> {
    try {
      console.log('Fetcher: Creating job post with data:', data);
      console.log('Fetcher: Making request to /api/v1/jobs');
      
      // Transform the data to match backend format
      const { JobPostTransformer } = await import('./transformer');
      const transformedData = JobPostTransformer.transformFormDataToBackend(data);
      console.log('Fetcher: Transformed data:', transformedData);
      
      const response = await fetch('/api/v1/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(transformedData)
      });
      
      console.log('Fetcher: Response status:', response.status);
      console.log('Fetcher: Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetcher: Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Fetcher: Response data:', result);
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error creating job post:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create job post'
      };
    }
  },

  /**
   * Update an existing job post
   */
  async updateJobPost(id: string, data: UpdateJobPostData): Promise<{ success: boolean; data?: JobPostItem; error?: string }> {
    try {
      const response = await fetch(`/api/v1/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error updating job post:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update job post'
      };
    }
  },

  /**
   * Delete a job post
   */
  async deleteJobPost(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/v1/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting job post:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete job post'
      };
    }
  },

  /**
   * Like a job post
   */
  async likeJobPost(id: string): Promise<{ success: boolean; data?: JobPostItem; error?: string }> {
    try {
      const response = await fetch(`/api/v1/jobs/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error liking job post:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to like job post'
      };
    }
  },

  /**
   * Comment on a job post
   */
  async commentJobPost(id: string, comment: string): Promise<{ success: boolean; data?: JobPostItem; error?: string }> {
    try {
      const response = await fetch(`/api/v1/jobs/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ comment })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error commenting on job post:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to comment on job post'
      };
    }
  },

  /**
   * Share a job post
   */
  async shareJobPost(id: string): Promise<{ success: boolean; data?: JobPostItem; error?: string }> {
    try {
      const response = await fetch(`/api/v1/jobs/${id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error sharing job post:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to share job post'
      };
    }
  },

  /**
   * Get job post statistics
   */
  async getJobPostStats(): Promise<{ success: boolean; data?: JobPostStats; error?: string }> {
    try {
      const response = await fetch('/api/v1/jobs/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error fetching job post stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch job post stats'
      };
    }
  }
};

/**
 * Default fetcher instance
 */
export default JobPostFetcher;
