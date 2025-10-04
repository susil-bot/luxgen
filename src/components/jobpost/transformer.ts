import { JobPostItem, JobPostStats, User } from './types';

/**
 * Transformer interface for data transformation operations
 */
export interface ITransformer {
  transformSingleJobPost(apiJobPost: any): JobPostItem | null;
  transformJobPosts(apiJobPosts: any[]): JobPostItem[];
  transformUser(userData: any): User | null;
  transformForFeed(jobPost: JobPostItem): JobPostItem;
  transformStats(apiStats: any): JobPostStats | null;
  transformFormDataToBackend(formData: any): any;
  mapExperienceToLevel(experience: string): string;
  mapEducationToLevel(education: string): string;
  extractYearsFromExperience(experience: string): number;
}

/**
 * JobPost Transformer implementation
 */
export const JobPostTransformer: ITransformer = {
  /**
   * Transform a single job post from API response
   */
  transformSingleJobPost(apiJobPost: any): JobPostItem | null {
    if (!apiJobPost) return null;

    return {
      _id: apiJobPost._id || apiJobPost.id,
      title: apiJobPost.title || '',
      description: apiJobPost.description || '',
      shortDescription: apiJobPost.shortDescription || '',
      company: {
        name: apiJobPost.company?.name || '',
        logo: apiJobPost.company?.logo || '',
        website: apiJobPost.company?.website || '',
        size: apiJobPost.company?.size || 'medium',
        industry: apiJobPost.company?.industry || '',
        location: {
          city: apiJobPost.company?.location?.city || '',
          state: apiJobPost.company?.location?.state || '',
          country: apiJobPost.company?.location?.country || '',
          remote: apiJobPost.company?.location?.remote || false
        }
      },
      jobType: apiJobPost.jobType || 'full-time',
      experienceLevel: apiJobPost.experienceLevel || 'entry',
      salary: apiJobPost.salary ? {
        min: apiJobPost.salary.min,
        max: apiJobPost.salary.max,
        currency: apiJobPost.salary.currency || 'USD',
        period: apiJobPost.salary.period || 'yearly'
      } : undefined,
      location: {
        city: apiJobPost.location?.city || '',
        state: apiJobPost.location?.state || '',
        country: apiJobPost.location?.country || '',
        remote: apiJobPost.location?.remote || false,
        hybrid: apiJobPost.location?.hybrid || false
      },
      requirements: {
        skills: apiJobPost.requirements?.skills || [],
        education: {
          level: apiJobPost.requirements?.education?.level || 'any',
          field: apiJobPost.requirements?.education?.field || ''
        },
        experience: {
          years: apiJobPost.requirements?.experience?.years || 0,
          description: apiJobPost.requirements?.experience?.description || ''
        },
        certifications: apiJobPost.requirements?.certifications || [],
        languages: apiJobPost.requirements?.languages || []
      },
      benefits: apiJobPost.benefits || [],
      perks: apiJobPost.perks || [],
      applicationProcess: apiJobPost.applicationProcess ? {
        deadline: apiJobPost.applicationProcess.deadline || '',
        startDate: apiJobPost.applicationProcess.startDate || '',
        process: apiJobPost.applicationProcess.process || 'direct',
        stages: apiJobPost.applicationProcess.stages || []
      } : undefined,
      status: apiJobPost.status || 'draft',
      visibility: apiJobPost.visibility || 'public',
      analytics: {
        views: apiJobPost.analytics?.views || 0,
        applications: apiJobPost.analytics?.applications || 0,
        shortlisted: apiJobPost.analytics?.shortlisted || 0,
        hired: apiJobPost.analytics?.hired || 0
      },
      tags: apiJobPost.tags || [],
      keywords: apiJobPost.keywords || [],
      featured: apiJobPost.featured || false,
      urgent: apiJobPost.urgent || false,
      postedBy: apiJobPost.postedBy || '',
      tenantId: apiJobPost.tenantId || '',
      publishedAt: apiJobPost.publishedAt || '',
      expiresAt: apiJobPost.expiresAt || '',
      createdAt: apiJobPost.createdAt || new Date().toISOString(),
      updatedAt: apiJobPost.updatedAt || new Date().toISOString()
    };
  },

  /**
   * Transform multiple job posts from API response
   */
  transformJobPosts(apiJobPosts: any[]): JobPostItem[] {
    if (!Array.isArray(apiJobPosts)) return [];
    
    return apiJobPosts
      .map(jobPost => this.transformSingleJobPost(jobPost))
      .filter((jobPost): jobPost is JobPostItem => jobPost !== null);
  },

  /**
   * Transform user data for job post display
   */
  transformUser(userData: any): User | null {
    if (!userData) return null;
    
    return {
      id: userData._id || userData.id,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      role: userData.role || 'user',
      department: userData.department || '',
      position: userData.position || '',
      avatar: userData.avatar || '',
      isActive: userData.isActive || false,
      isVerified: userData.isVerified || false,
      createdAt: userData.createdAt || new Date().toISOString(),
      updatedAt: userData.updatedAt || new Date().toISOString()
    };
  },

  /**
   * Transform job post for feed display
   */
  transformForFeed(jobPost: JobPostItem): JobPostItem {
    return {
      ...jobPost,
      description: jobPost.description.length > 200 
        ? jobPost.description.substring(0, 200) + '...' 
        : jobPost.description
    };
  },

  /**
   * Transform statistics data
   */
  transformStats(apiStats: any): JobPostStats | null {
    if (!apiStats) return null;

    return {
      total: apiStats.total || 0,
      active: apiStats.active || 0,
      inactive: apiStats.inactive || 0,
      draft: apiStats.draft || 0,
      totalViews: apiStats.totalViews || 0,
      totalLikes: apiStats.totalLikes || 0,
      totalComments: apiStats.totalComments || 0,
      totalShares: apiStats.totalShares || 0,
      avgEngagement: apiStats.avgEngagement || 0
    };
  },

  /**
   * Transform frontend form data to backend format
   */
  transformFormDataToBackend(formData: any): any {
    return {
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      company: {
        name: formData.company,
        industry: formData.department,
        location: {
          city: formData.location?.split(',')[0]?.trim() || '',
          country: formData.location?.split(',')[1]?.trim() || 'US'
        }
      },
      jobType: formData.type,
      experienceLevel: this.mapExperienceToLevel(formData.experience),
      salary: formData.salary ? {
        min: formData.salary,
        currency: 'USD',
        period: 'yearly'
      } : undefined,
      location: {
        city: formData.location?.split(',')[0]?.trim() || '',
        country: formData.location?.split(',')[1]?.trim() || 'US',
        remote: formData.isRemote || false,
        hybrid: false
      },
      requirements: {
        skills: formData.skills || [],
        education: {
          level: this.mapEducationToLevel(formData.education),
          field: formData.education
        },
        experience: {
          years: this.extractYearsFromExperience(formData.experience),
          description: formData.requirements
        },
        certifications: formData.tags || []
      },
      benefits: formData.benefits || [],
      applicationProcess: {
        deadline: formData.applicationDeadline,
        startDate: formData.startDate,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone
      },
      status: 'active',
      visibility: 'public'
    };
  },

  /**
   * Map experience string to experience level
   */
  mapExperienceToLevel(experience: string): string {
    if (!experience) return 'entry';
    const exp = experience.toLowerCase();
    if (exp.includes('senior') || exp.includes('lead') || exp.includes('5+') || exp.includes('10+')) return 'senior';
    if (exp.includes('mid') || exp.includes('3+') || exp.includes('4+')) return 'mid';
    if (exp.includes('junior') || exp.includes('1+') || exp.includes('2+')) return 'junior';
    if (exp.includes('executive') || exp.includes('director')) return 'executive';
    return 'entry';
  },

  /**
   * Map education string to education level
   */
  mapEducationToLevel(education: string): string {
    if (!education) return 'any';
    const edu = education.toLowerCase();
    if (edu.includes('phd') || edu.includes('doctorate')) return 'phd';
    if (edu.includes('master') || edu.includes('mba')) return 'master';
    if (edu.includes('bachelor') || edu.includes('degree')) return 'bachelor';
    if (edu.includes('associate')) return 'associate';
    if (edu.includes('high school')) return 'high-school';
    return 'any';
  },

  /**
   * Extract years from experience string
   */
  extractYearsFromExperience(experience: string): number {
    if (!experience) return 0;
    const match = experience.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
};

/**
 * Default transformer instance
 */
export default JobPostTransformer;
