export interface JobPostItem {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
    size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
    industry?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
      remote?: boolean;
    };
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: 'hourly' | 'monthly' | 'yearly';
  };
  location: {
    city?: string;
    state?: string;
    country?: string;
    remote?: boolean;
    hybrid?: boolean;
  };
  requirements: {
    skills?: string[];
    education?: {
      level?: 'high-school' | 'associate' | 'bachelor' | 'master' | 'phd' | 'any';
      field?: string;
    };
    experience?: {
      years?: number;
      description?: string;
    };
    certifications?: string[];
    languages?: Array<{
      name: string;
      proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
    }>;
  };
  benefits?: string[];
  perks?: string[];
  applicationProcess?: {
    deadline?: string;
    startDate?: string;
    process?: 'direct' | 'screening' | 'interview' | 'assessment' | 'multi-stage';
    stages?: Array<{
      name: string;
      description: string;
      order: number;
    }>;
  };
  status: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  visibility: 'public' | 'internal' | 'private';
  analytics: {
    views: number;
    applications: number;
    shortlisted: number;
    hired: number;
  };
  tags?: string[];
  keywords?: string[];
  featured: boolean;
  urgent: boolean;
  postedBy: string;
  tenantId: string;
  publishedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobPostFilters {
  status: string;
  department: string;
  location: string;
  type: string;
}

export interface JobPostStats {
  total: number;
  active: number;
  inactive: number;
  draft: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  avgEngagement: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'super_admin' | 'user';
  department: string;
  position: string;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobPostProps {
  className?: string;
  onError?: (error: Error) => void;
  onSuccess?: (message: string) => void;
  user?: User;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  isTrainer?: boolean;
}

export interface CreateJobPostData {
  title: string;
  description: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  salary?: number;
  requirements?: string;
  benefits?: string[];
  skills?: string[];
  experience?: string;
  education?: string;
  company?: string;
  contactEmail?: string;
  contactPhone?: string;
  applicationDeadline?: string;
  startDate?: string;
  isRemote?: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}

export interface UpdateJobPostData {
  title?: string;
  description?: string;
  shortDescription?: string;
  company?: {
    name: string;
    logo?: string;
    website?: string;
    size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
    industry?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
      remote?: boolean;
    };
  };
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experienceLevel?: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: 'hourly' | 'monthly' | 'yearly';
  };
  location?: {
    city: string;
    state?: string;
    country: string;
    remote?: boolean;
    hybrid?: boolean;
  };
  requirements?: {
    skills?: string[];
    education?: {
      level?: 'high-school' | 'associate' | 'bachelor' | 'master' | 'phd' | 'any';
      field?: string;
    };
    experience?: {
      years?: number;
      description?: string;
    };
    certifications?: string[];
    languages?: Array<{
      name: string;
      proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
    }>;
  };
  benefits?: string[];
  perks?: string[];
  applicationProcess?: {
    deadline?: string;
    startDate?: string;
    process?: 'direct' | 'screening' | 'interview' | 'assessment' | 'multi-stage';
    stages?: Array<{
      name: string;
      description: string;
      order: number;
    }>;
  };
  status?: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  visibility?: 'public' | 'internal' | 'private';
}

export interface JobPostFilters {
  page?: number;
  limit?: number;
  filters?: {
    status?: string;
    department?: string;
    location?: string;
    type?: string;
  };
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobPostQueryParams {
  page?: number;
  limit?: number;
  filters?: {
    status?: string;
    department?: string;
    location?: string;
    type?: string;
  };
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobPostResponse {
  success: boolean;
  data?: {
    jobPosts: JobPostItem[];
    totalPages: number;
    currentPage: number;
    total: number;
  };
  error?: string;
}

export interface JobPostState {
  loading: boolean;
  error: string | null;
  jobPosts: JobPostItem[];
  stats: JobPostStats | null;
  currentPage: number;
  totalPages: number;
  filters: JobPostFilters;
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface JobPostAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
