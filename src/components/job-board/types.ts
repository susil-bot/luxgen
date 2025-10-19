/**
 * Job Board Types
 * Type definitions for job board functionality
 */

export interface JobPostItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedAt: string;
  deadline: string;
  status: string;
  tenantId: string;
  createdBy: string;
  updatedAt: string;
}

export interface JobPostStats {
  total: number;
  active: number;
  closed: number;
  byType: Record<string, number>;
  byLocation: Record<string, number>;
  byExperience: Record<string, number>;
}

export interface CreateJobPostData {
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  skills: string[];
  deadline: string;
  tenantId: string;
}

export interface UpdateJobPostData {
  id: string;
  title?: string;
  company?: string;
  location?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type?: string;
  experience?: string;
  description?: string;
  requirements?: string[];
  skills?: string[];
  deadline?: string;
  status?: string;
}

export interface JobPostQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  type?: string;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  tenantId?: string;
}

export interface JobPostResponse {
  success: boolean;
  data: JobPostItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}
