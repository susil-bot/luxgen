/**
 * Training Program Manager - Data Transformers
 * Handles data transformation and business logic for training programs
 */

import { TrainingProgram, TrainingProgramFormData, TrainingProgramFilters } from './types';

export class TrainingProgramManagerTransformer {
  /**
   * Transform API response to training program format
   */
  static transformApiResponseToProgram(apiData: any): TrainingProgram {
    return {
      id: apiData.id || apiData._id,
      title: apiData.title || '',
      description: apiData.description || '',
      shortDescription: apiData.shortDescription || apiData.description?.substring(0, 100) + '...' || '',
      category: apiData.category || 'general',
      level: apiData.level || 'beginner',
      duration: apiData.duration || 0,
      status: apiData.status || 'draft',
      type: apiData.type || 'course',
      instructor: apiData.instructor || apiData.instructorId || null,
      maxEnrollments: apiData.maxEnrollments || 0,
      currentEnrollments: apiData.currentEnrollments || 0,
      price: apiData.price || 0,
      currency: apiData.currency || 'USD',
      tags: apiData.tags || [],
      prerequisites: apiData.prerequisites || [],
      learningObjectives: apiData.learningObjectives || [],
      targetAudience: apiData.targetAudience || [],
      materials: apiData.materials || [],
      modules: apiData.modules || [],
      assessments: apiData.assessments || [],
      certificates: apiData.certificates || [],
      banner: apiData.banner || null,
      thumbnail: apiData.thumbnail || null,
      isActive: apiData.isActive ?? true,
      isPublic: apiData.isPublic ?? false,
      isFeatured: apiData.isFeatured ?? false,
      analytics: {
        views: apiData.analytics?.views || 0,
        enrollments: apiData.analytics?.enrollments || 0,
        completions: apiData.analytics?.completions || 0,
        rating: apiData.analytics?.rating || 0,
        totalRatings: apiData.analytics?.totalRatings || 0,
        completionRate: apiData.analytics?.completionRate || 0
      },
      metadata: {
        createdBy: apiData.metadata?.createdBy || apiData.createdBy,
        lastModifiedBy: apiData.metadata?.lastModifiedBy || apiData.lastModifiedBy,
        version: apiData.metadata?.version || 1,
        language: apiData.metadata?.language || 'en',
        timezone: apiData.metadata?.timezone || 'UTC'
      },
      settings: {
        allowEnrollment: apiData.settings?.allowEnrollment ?? true,
        requireApproval: apiData.settings?.requireApproval ?? false,
        maxAttempts: apiData.settings?.maxAttempts || 3,
        passingScore: apiData.settings?.passingScore || 70,
        allowRetake: apiData.settings?.allowRetake ?? true,
        showProgress: apiData.settings?.showProgress ?? true,
        enableNotifications: apiData.settings?.enableNotifications ?? true
      },
      createdAt: apiData.createdAt ? new Date(apiData.createdAt) : new Date(),
      updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : new Date()
    };
  }

  /**
   * Transform training program to form data
   */
  static transformProgramToFormData(program: TrainingProgram): TrainingProgramFormData {
    return {
      title: program.title,
      description: program.description,
      shortDescription: program.shortDescription,
      category: program.category,
      level: program.level,
      duration: program.duration,
      status: program.status,
      type: program.type,
      instructor: program.instructor,
      maxEnrollments: program.maxEnrollments,
      price: program.price,
      currency: program.currency,
      tags: program.tags,
      prerequisites: program.prerequisites,
      learningObjectives: program.learningObjectives,
      targetAudience: program.targetAudience,
      materials: program.materials,
      modules: program.modules,
      assessments: program.assessments,
      certificates: program.certificates,
      banner: program.banner,
      thumbnail: program.thumbnail,
      isActive: program.isActive,
      isPublic: program.isPublic,
      isFeatured: program.isFeatured,
      settings: program.settings
    };
  }

  /**
   * Transform form data to API format
   */
  static transformFormDataToApi(formData: TrainingProgramFormData): any {
    return {
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      category: formData.category,
      level: formData.level,
      duration: formData.duration,
      status: formData.status,
      type: formData.type,
      instructor: formData.instructor,
      maxEnrollments: formData.maxEnrollments,
      price: formData.price,
      currency: formData.currency,
      tags: formData.tags,
      prerequisites: formData.prerequisites,
      learningObjectives: formData.learningObjectives,
      targetAudience: formData.targetAudience,
      materials: formData.materials,
      modules: formData.modules,
      assessments: formData.assessments,
      certificates: formData.certificates,
      banner: formData.banner,
      thumbnail: formData.thumbnail,
      isActive: formData.isActive,
      isPublic: formData.isPublic,
      isFeatured: formData.isFeatured,
      settings: formData.settings
    };
  }

  /**
   * Transform filters for API
   */
  static transformFiltersToApi(filters: TrainingProgramFilters): any {
    const apiFilters: any = {};

    if (filters.status) {
      apiFilters.status = filters.status;
    }

    if (filters.category) {
      apiFilters.category = filters.category;
    }

    if (filters.level) {
      apiFilters.level = filters.level;
    }

    if (filters.type) {
      apiFilters.type = filters.type;
    }

    if (filters.instructor) {
      apiFilters.instructor = filters.instructor;
    }

    if (filters.search) {
      apiFilters.search = filters.search;
    }

    if (filters.tags && filters.tags.length > 0) {
      apiFilters.tags = filters.tags;
    }

    if (filters.priceRange) {
      apiFilters.minPrice = filters.priceRange.min;
      apiFilters.maxPrice = filters.priceRange.max;
    }

    if (filters.durationRange) {
      apiFilters.minDuration = filters.durationRange.min;
      apiFilters.maxDuration = filters.durationRange.max;
    }

    if (filters.isActive !== undefined) {
      apiFilters.isActive = filters.isActive;
    }

    if (filters.isPublic !== undefined) {
      apiFilters.isPublic = filters.isPublic;
    }

    if (filters.isFeatured !== undefined) {
      apiFilters.isFeatured = filters.isFeatured;
    }

    if (filters.sortBy) {
      apiFilters.sortBy = filters.sortBy;
    }

    if (filters.sortOrder) {
      apiFilters.sortOrder = filters.sortOrder;
    }

    if (filters.page) {
      apiFilters.page = filters.page;
    }

    if (filters.limit) {
      apiFilters.limit = filters.limit;
    }

    return apiFilters;
  }

  /**
   * Transform program for display
   */
  static transformProgramForDisplay(program: TrainingProgram): any {
    return {
      ...program,
      displayTitle: program.title,
      displayDescription: program.shortDescription || program.description?.substring(0, 150) + '...',
      displayDuration: this.formatDuration(program.duration),
      displayPrice: this.formatPrice(program.price, program.currency),
      displayStatus: this.formatStatus(program.status),
      displayLevel: this.formatLevel(program.level),
      displayCategory: this.formatCategory(program.category),
      enrollmentProgress: this.calculateEnrollmentProgress(program),
      completionRate: program.analytics.completionRate,
      averageRating: program.analytics.rating,
      totalViews: program.analytics.views,
      totalEnrollments: program.analytics.enrollments,
      totalCompletions: program.analytics.completions
    };
  }

  /**
   * Format duration for display
   */
  static formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hours`;
    } else {
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days} days`;
    }
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  /**
   * Format status for display
   */
  static formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }

  /**
   * Format level for display
   */
  static formatLevel(level: string): string {
    return level.charAt(0).toUpperCase() + level.slice(1);
  }

  /**
   * Format category for display
   */
  static formatCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
  }

  /**
   * Calculate enrollment progress
   */
  static calculateEnrollmentProgress(program: TrainingProgram): number {
    if (program.maxEnrollments === 0) return 0;
    return Math.round((program.currentEnrollments / program.maxEnrollments) * 100);
  }

  /**
   * Transform programs for table display
   */
  static transformProgramsForTable(programs: TrainingProgram[]): any[] {
    return programs.map(program => ({
      id: program.id,
      title: program.title,
      category: this.formatCategory(program.category),
      level: this.formatLevel(program.level),
      status: this.formatStatus(program.status),
      duration: this.formatDuration(program.duration),
      price: this.formatPrice(program.price, program.currency),
      enrollments: `${program.currentEnrollments}/${program.maxEnrollments}`,
      completionRate: `${program.analytics.completionRate}%`,
      rating: program.analytics.rating.toFixed(1),
      views: program.analytics.views,
      createdAt: program.createdAt.toLocaleDateString(),
      updatedAt: program.updatedAt.toLocaleDateString()
    }));
  }

  /**
   * Transform programs for card display
   */
  static transformProgramsForCards(programs: TrainingProgram[]): any[] {
    return programs.map(program => ({
      id: program.id,
      title: program.title,
      description: program.shortDescription || program.description?.substring(0, 100) + '...',
      category: program.category,
      level: program.level,
      status: program.status,
      duration: this.formatDuration(program.duration),
      price: this.formatPrice(program.price, program.currency),
      thumbnail: program.thumbnail,
      banner: program.banner,
      tags: program.tags,
      enrollmentProgress: this.calculateEnrollmentProgress(program),
      rating: program.analytics.rating,
      totalRatings: program.analytics.totalRatings,
      isActive: program.isActive,
      isPublic: program.isPublic,
      isFeatured: program.isFeatured
    }));
  }

  /**
   * Transform search results
   */
  static transformSearchResults(results: any[]): any[] {
    return results.map(result => ({
      id: result.id,
      title: result.title,
      description: result.description,
      category: result.category,
      level: result.level,
      status: result.status,
      duration: this.formatDuration(result.duration),
      price: this.formatPrice(result.price, result.currency),
      thumbnail: result.thumbnail,
      tags: result.tags,
      relevanceScore: result.relevanceScore || 0,
      highlights: result.highlights || []
    }));
  }
}
