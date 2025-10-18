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

export interface JobsFeedFilters {
  search?: string;
  location?: string;
  jobType?: string;
  experience?: string;
  salary?: string;
}

export interface JobsFeedState {
  loading: boolean;
  error: string | null;
  filters: JobsFeedFilters;
  showFilters: boolean;
}

export interface JobsFeedProps {
  className?: string;
  onError?: (error: Error) => void;
  onSuccess?: (message: string) => void;
}

export interface JobsFeedStatistics {
  total: number;
  active: number;
  featured: number;
  urgent: number;
  totalViews: number;
  totalApplications: number;
  avgViews: number;
  avgApplications: number;
}

export interface JobsFeedSortOptions {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface JobsFeedPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobsFeedResponse {
  success: boolean;
  data: JobPostItem[];
  pagination: JobsFeedPagination;
  error?: string;
}

export interface JobsFeedParams {
  page: number;
  limit: number;
  filters?: JobsFeedFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobsFeedAnalytics {
  views: number;
  applications: number;
  shortlisted: number;
  hired: number;
  totalInteractions: number;
  conversionRate: number;
  successRate: number;
}

export interface JobsFeedPriority {
  level: 'high' | 'medium' | 'low';
  score: number;
  factors: string[];
}

export interface JobsFeedValidation {
  isValid: boolean;
  errors: string[];
}

export interface JobsFeedSearchResult {
  query: string;
  results: JobPostItem[];
  total: number;
  filters: JobsFeedFilters;
}

export interface JobsFeedCompany {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  industry: string;
  location: {
    city: string;
    state?: string;
    country: string;
    remote: boolean;
  };
  jobsCount: number;
  activeJobs: number;
}

export interface JobsFeedLocation {
  city: string;
  state?: string;
  country: string;
  remote: boolean;
  hybrid: boolean;
  jobsCount: number;
}

export interface JobsFeedSkill {
  name: string;
  count: number;
  percentage: number;
  relatedJobs: number;
}

export interface JobsFeedIndustry {
  name: string;
  count: number;
  percentage: number;
  avgSalary: number;
  topSkills: string[];
}

export interface JobsFeedSalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
  jobsCount: number;
}

export interface JobsFeedExperienceLevel {
  level: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  count: number;
  percentage: number;
  avgSalary: number;
}

export interface JobsFeedJobType {
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  count: number;
  percentage: number;
  avgSalary: number;
}

export interface JobsFeedTrend {
  period: string;
  jobsPosted: number;
  applicationsReceived: number;
  views: number;
  avgSalary: number;
}

export interface JobsFeedInsights {
  topCompanies: JobsFeedCompany[];
  topLocations: JobsFeedLocation[];
  topSkills: JobsFeedSkill[];
  topIndustries: JobsFeedIndustry[];
  salaryRanges: JobsFeedSalaryRange[];
  experienceLevels: JobsFeedExperienceLevel[];
  jobTypes: JobsFeedJobType[];
  trends: JobsFeedTrend[];
  totalJobs: number;
  totalCompanies: number;
  totalLocations: number;
  avgSalary: number;
  avgExperience: number;
}
