/**
 * Training Program Manager - Helper Functions
 * Utility functions and helpers for training program management
 */

import { TrainingProgram, TrainingProgramFilters, TrainingProgramFormData } from './types';

export class TrainingProgramManagerHelper {
  /**
   * Validate training program form data
   */
  static validateFormData(formData: TrainingProgramFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.title || formData.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (formData.title && formData.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (!formData.description || formData.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (formData.description && formData.description.length > 2000) {
      errors.push('Description must be less than 2000 characters');
    }

    if (formData.duration < 0) {
      errors.push('Duration must be a positive number');
    }

    if (formData.price < 0) {
      errors.push('Price must be a positive number');
    }

    if (formData.maxEnrollments < 0) {
      errors.push('Max enrollments must be a positive number');
    }

    if (formData.tags && formData.tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    }

    if (formData.learningObjectives && formData.learningObjectives.length > 20) {
      errors.push('Maximum 20 learning objectives allowed');
    }

    if (formData.prerequisites && formData.prerequisites.length > 15) {
      errors.push('Maximum 15 prerequisites allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate unique slug from title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Generate program code
   */
  static generateProgramCode(category: string, title: string): string {
    const categoryCode = category.substring(0, 3).toUpperCase();
    const titleCode = title
      .split(' ')
      .map(word => word.substring(0, 2))
      .join('')
      .toUpperCase()
      .substring(0, 6);
    const randomCode = Math.random().toString(36).substring(2, 5).toUpperCase();
    
    return `${categoryCode}-${titleCode}-${randomCode}`;
  }

  /**
   * Calculate estimated completion time
   */
  static calculateCompletionTime(duration: number, modules: any[]): number {
    const baseTime = duration;
    const moduleTime = modules.reduce((total, module) => total + (module.estimatedDuration || 0), 0);
    const assessmentTime = modules.length * 15; // 15 minutes per assessment
    
    return baseTime + moduleTime + assessmentTime;
  }

  /**
   * Calculate difficulty score
   */
  static calculateDifficultyScore(level: string, prerequisites: string[], modules: any[]): number {
    let score = 0;
    
    // Base score by level
    switch (level) {
      case 'beginner':
        score = 1;
        break;
      case 'intermediate':
        score = 3;
        break;
      case 'advanced':
        score = 5;
        break;
      default:
        score = 1;
    }
    
    // Add score for prerequisites
    score += prerequisites.length * 0.5;
    
    // Add score for module complexity
    const complexModules = modules.filter(module => module.complexity === 'high').length;
    score += complexModules * 0.3;
    
    return Math.min(score, 5); // Cap at 5
  }

  /**
   * Generate program summary
   */
  static generateProgramSummary(program: TrainingProgram): string {
    const parts = [];
    
    if (program.category) {
      parts.push(program.category);
    }
    
    if (program.level) {
      parts.push(program.level);
    }
    
    if (program.duration) {
      parts.push(`${program.duration} minutes`);
    }
    
    if (program.tags && program.tags.length > 0) {
      parts.push(program.tags.slice(0, 3).join(', '));
    }
    
    return parts.join(' • ');
  }

  /**
   * Filter programs by criteria
   */
  static filterPrograms(programs: TrainingProgram[], filters: TrainingProgramFilters): TrainingProgram[] {
    return programs.filter(program => {
      // Status filter
      if (filters.status && program.status !== filters.status) {
        return false;
      }
      
      // Category filter
      if (filters.category && program.category !== filters.category) {
        return false;
      }
      
      // Level filter
      if (filters.level && program.level !== filters.level) {
        return false;
      }
      
      // Type filter
      if (filters.type && program.type !== filters.type) {
        return false;
      }
      
      // Instructor filter
      if (filters.instructor && program.instructor !== filters.instructor) {
        return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          program.title,
          program.description,
          program.shortDescription,
          ...program.tags
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }
      
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          program.tags.some(programTag => 
            programTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) {
          return false;
        }
      }
      
      // Price range filter
      if (filters.priceRange) {
        if (program.price < filters.priceRange.min || program.price > filters.priceRange.max) {
          return false;
        }
      }
      
      // Duration range filter
      if (filters.durationRange) {
        if (program.duration < filters.durationRange.min || program.duration > filters.durationRange.max) {
          return false;
        }
      }
      
      // Active filter
      if (filters.isActive !== undefined && program.isActive !== filters.isActive) {
        return false;
      }
      
      // Public filter
      if (filters.isPublic !== undefined && program.isPublic !== filters.isPublic) {
        return false;
      }
      
      // Featured filter
      if (filters.isFeatured !== undefined && program.isFeatured !== filters.isFeatured) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Sort programs by criteria
   */
  static sortPrograms(programs: TrainingProgram[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): TrainingProgram[] {
    return [...programs].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'rating':
          aValue = a.analytics.rating;
          bValue = b.analytics.rating;
          break;
        case 'enrollments':
          aValue = a.analytics.enrollments;
          bValue = b.analytics.enrollments;
          break;
        case 'views':
          aValue = a.analytics.views;
          bValue = b.analytics.views;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }
      
      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Paginate programs
   */
  static paginatePrograms(programs: TrainingProgram[], page: number, limit: number): {
    data: TrainingProgram[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  } {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = programs.slice(startIndex, endIndex);
    const total = programs.length;
    const pages = Math.ceil(total / limit);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get program statistics
   */
  static getProgramStatistics(programs: TrainingProgram[]): {
    total: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    byLevel: Record<string, number>;
    averageRating: number;
    totalEnrollments: number;
    totalViews: number;
  } {
    const stats = {
      total: programs.length,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byLevel: {} as Record<string, number>,
      averageRating: 0,
      totalEnrollments: 0,
      totalViews: 0
    };
    
    let totalRating = 0;
    let ratedPrograms = 0;
    
    programs.forEach(program => {
      // Status statistics
      stats.byStatus[program.status] = (stats.byStatus[program.status] || 0) + 1;
      
      // Category statistics
      stats.byCategory[program.category] = (stats.byCategory[program.category] || 0) + 1;
      
      // Level statistics
      stats.byLevel[program.level] = (stats.byLevel[program.level] || 0) + 1;
      
      // Rating statistics
      if (program.analytics.rating > 0) {
        totalRating += program.analytics.rating;
        ratedPrograms++;
      }
      
      // Enrollment and view statistics
      stats.totalEnrollments += program.analytics.enrollments;
      stats.totalViews += program.analytics.views;
    });
    
    stats.averageRating = ratedPrograms > 0 ? totalRating / ratedPrograms : 0;
    
    return stats;
  }

  /**
   * Export programs to CSV
   */
  static exportProgramsToCSV(programs: TrainingProgram[]): string {
    const headers = [
      'ID',
      'Title',
      'Category',
      'Level',
      'Status',
      'Duration (minutes)',
      'Price',
      'Currency',
      'Enrollments',
      'Max Enrollments',
      'Rating',
      'Views',
      'Created At',
      'Updated At'
    ];
    
    const rows = programs.map(program => [
      program.id,
      program.title,
      program.category,
      program.level,
      program.status,
      program.duration,
      program.price,
      program.currency,
      program.analytics.enrollments,
      program.maxEnrollments,
      program.analytics.rating,
      program.analytics.views,
      program.createdAt.toISOString(),
      program.updatedAt.toISOString()
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  }

  /**
   * Import programs from CSV
   */
  static importProgramsFromCSV(csvContent: string): Partial<TrainingProgram>[] {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(header => header.replace(/"/g, ''));
    const programs: Partial<TrainingProgram>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(value => value.replace(/"/g, ''));
        const program: Partial<TrainingProgram> = {};
        
        headers.forEach((header, index) => {
          const value = values[index];
          switch (header) {
            case 'Title':
              program.title = value;
              break;
            case 'Category':
              program.category = value;
              break;
            case 'Level':
              program.level = value as 'beginner' | 'intermediate' | 'advanced';
              break;
            case 'Status':
              program.status = value as 'draft' | 'published' | 'archived' | 'suspended';
              break;
            case 'Duration (minutes)':
              program.duration = parseInt(value) || 0;
              break;
            case 'Price':
              program.price = parseFloat(value) || 0;
              break;
            case 'Currency':
              program.currency = value;
              break;
            case 'Max Enrollments':
              program.maxEnrollments = parseInt(value) || 0;
              break;
          }
        });
        
        programs.push(program);
      }
    }
    
    return programs;
  }

  /**
   * Generate program report
   */
  static generateProgramReport(programs: TrainingProgram[]): {
    summary: {
      totalPrograms: number;
      activePrograms: number;
      totalEnrollments: number;
      averageRating: number;
    };
    topPrograms: Array<{
      id: string;
      title: string;
      enrollments: number;
      rating: number;
    }>;
    categoryBreakdown: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
  } {
    const stats = this.getProgramStatistics(programs);
    const activePrograms = programs.filter(p => p.isActive).length;
    
    const topPrograms = programs
      .sort((a, b) => b.analytics.enrollments - a.analytics.enrollments)
      .slice(0, 10)
      .map(program => ({
        id: program.id,
        title: program.title,
        enrollments: program.analytics.enrollments,
        rating: program.analytics.rating
      }));
    
    const categoryBreakdown = Object.entries(stats.byCategory)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / stats.total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
    
    return {
      summary: {
        totalPrograms: stats.total,
        activePrograms,
        totalEnrollments: stats.totalEnrollments,
        averageRating: stats.averageRating
      },
      topPrograms,
      categoryBreakdown
    };
  }
}
