import { TrainingProgram, ProgramStatus, ProgramType, DifficultyLevel, ProgramStats, ProgramAnalytics, ProgramFilters } from '../types/training';
import apiClient from '../core/api/ApiClient';

class TrainingProgramService {
  /**
   * Get all programs for a tenant
   */
  async getPrograms(tenantId: string, filters?: ProgramFilters): Promise<TrainingProgram[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const queryString = params.toString();
      const endpoint = `/api/tenants/${tenantId}/training-programs${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data as TrainingProgram[];
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  }

  /**
   * Get a specific program
   */
  async getProgram(tenantId: string, programId: string): Promise<TrainingProgram> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/training-programs/${programId}`);
      return response.data as TrainingProgram;
    } catch (error) {
      console.error('Error fetching program:', error);
      throw error;
    }
  }

  /**
   * Create a new program
   */
  async createProgram(tenantId: string, programData: Partial<TrainingProgram>): Promise<TrainingProgram> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/training-programs`, programData);
      return response.data as TrainingProgram;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  }

  /**
   * Update a program
   */
  async updateProgram(tenantId: string, programId: string, updates: Partial<TrainingProgram>): Promise<TrainingProgram> {
    try {
      const response = await apiClient.put(`/api/tenants/${tenantId}/training-programs/${programId}`, updates);
      return response.data as TrainingProgram;
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  }

  /**
   * Delete a program
   */
  async deleteProgram(tenantId: string, programId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/tenants/${tenantId}/training-programs/${programId}`);
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }

  /**
   * Duplicate a program
   */
  async duplicateProgram(tenantId: string, programId: string, newTitle?: string): Promise<TrainingProgram> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/training-programs/${programId}/duplicate`, {
        newTitle
      });
      return response.data as TrainingProgram;
    } catch (error) {
      console.error('Error duplicating program:', error);
      throw error;
    }
  }

  /**
   * Archive/Unarchive a program
   */
  async archiveProgram(tenantId: string, programId: string, archive: boolean): Promise<TrainingProgram> {
    try {
      const response = await apiClient.put(`/api/tenants/${tenantId}/training-programs/${programId}/archive`, {
        archived: archive
      });
      return response.data as TrainingProgram;
    } catch (error) {
      console.error('Error archiving program:', error);
      throw error;
    }
  }

  /**
   * Publish a program
   */
  async publishProgram(tenantId: string, programId: string): Promise<TrainingProgram> {
    try {
      const response = await apiClient.put(`/api/tenants/${tenantId}/training-programs/${programId}/publish`);
      return response.data as TrainingProgram;
    } catch (error) {
      console.error('Error publishing program:', error);
      throw error;
    }
  }

  /**
   * Suspend a program
   */
  async suspendProgram(tenantId: string, programId: string): Promise<TrainingProgram> {
    try {
      const response = await apiClient.put(`/api/tenants/${tenantId}/training-programs/${programId}/suspend`);
      return response.data as TrainingProgram;
    } catch (error) {
      console.error('Error suspending program:', error);
      throw error;
    }
  }

  /**
   * Get program statistics
   */
  async getProgramStats(tenantId: string): Promise<ProgramStats> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/training-programs/stats`);
      return response.data as ProgramStats;
    } catch (error) {
      console.error('Error fetching program stats:', error);
      throw error;
    }
  }

  /**
   * Get program analytics
   */
  async getProgramAnalytics(tenantId: string, programId: string, period?: string): Promise<ProgramAnalytics> {
    try {
      const params = new URLSearchParams();
      if (period) params.append('period', period);
      
      const queryString = params.toString();
      const endpoint = `/api/tenants/${tenantId}/training-programs/${programId}/analytics${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data as ProgramAnalytics;
    } catch (error) {
      console.error('Error fetching program analytics:', error);
      throw error;
    }
  }

  /**
   * Get all programs analytics
   */
  async getAllProgramAnalytics(tenantId: string, period?: string): Promise<ProgramAnalytics> {
    try {
      const params = new URLSearchParams();
      if (period) params.append('period', period);
      
      const queryString = params.toString();
      const endpoint = `/api/tenants/${tenantId}/training-programs/analytics${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data as ProgramAnalytics;
    } catch (error) {
      console.error('Error fetching all programs analytics:', error);
      throw error;
    }
  }

  /**
   * Export programs to CSV/Excel
   */
  async exportPrograms(tenantId: string, format: 'csv' | 'excel', filters?: ProgramFilters): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const queryString = params.toString();
      const endpoint = `/api/tenants/${tenantId}/training-programs/export${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data as Blob;
    } catch (error) {
      console.error('Error exporting programs:', error);
      throw error;
    }
  }

  /**
   * Import programs from CSV/Excel
   */
  async importPrograms(tenantId: string, file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(`/api/tenants/${tenantId}/training-programs/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data as { success: number; failed: number; errors: string[] };
    } catch (error) {
      console.error('Error importing programs:', error);
      throw error;
    }
  }

  /**
   * Get program categories
   */
  async getCategories(tenantId: string): Promise<string[]> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/training-programs/categories`);
      return response.data as string[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get program instructors
   */
  async getInstructors(tenantId: string): Promise<string[]> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/training-programs/instructors`);
      return response.data as string[];
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  }

  /**
   * Search programs
   */
  async searchPrograms(tenantId: string, query: string, filters?: ProgramFilters): Promise<TrainingProgram[]> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const queryString = params.toString();
      const endpoint = `/api/tenants/${tenantId}/training-programs/search${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data as TrainingProgram[];
    } catch (error) {
      console.error('Error searching programs:', error);
      throw error;
    }
  }

  /**
   * Get program recommendations
   */
  async getRecommendations(tenantId: string, userId?: string): Promise<TrainingProgram[]> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      
      const queryString = params.toString();
      const endpoint = `/api/tenants/${tenantId}/training-programs/recommendations${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data as TrainingProgram[];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  /**
   * Get program enrollment data
   */
  async getEnrollmentData(tenantId: string, programId: string): Promise<{
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    averageProgress: number;
    recentEnrollments: Array<{ date: string; count: number }>;
  }> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/training-programs/${programId}/enrollments`);
      return response.data as {
        totalEnrollments: number;
        activeEnrollments: number;
        completedEnrollments: number;
        averageProgress: number;
        recentEnrollments: Array<{ date: string; count: number }>;
      };
    } catch (error) {
      console.error('Error fetching enrollment data:', error);
      throw error;
    }
  }

  /**
   * Get program completion data
   */
  async getCompletionData(tenantId: string, programId: string): Promise<{
    totalCompletions: number;
    averageCompletionTime: number;
    completionRate: number;
    recentCompletions: Array<{ date: string; count: number }>;
  }> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/training-programs/${programId}/completions`);
      return response.data as {
        totalCompletions: number;
        averageCompletionTime: number;
        completionRate: number;
        recentCompletions: Array<{ date: string; count: number }>;
      };
    } catch (error) {
      console.error('Error fetching completion data:', error);
      throw error;
    }
  }

  /**
   * Get program feedback
   */
  async getFeedback(tenantId: string, programId: string): Promise<{
    averageRating: number;
    totalRatings: number;
    ratingDistribution: Array<{ rating: number; count: number }>;
    recentFeedback: Array<{
      id: string;
      userId: string;
      userName: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  }> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/training-programs/${programId}/feedback`);
      return response.data as {
        averageRating: number;
        totalRatings: number;
        ratingDistribution: Array<{ rating: number; count: number }>;
        recentFeedback: Array<{
          id: string;
          userId: string;
          userName: string;
          rating: number;
          comment: string;
          date: string;
        }>;
      };
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  }

  /**
   * Validate program data
   */
  async validateProgram(tenantId: string, programData: Partial<TrainingProgram>): Promise<{
    valid: boolean;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
  }> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/training-programs/validate`, programData);
      return response.data as {
        valid: boolean;
        errors: Record<string, string[]>;
        warnings: Record<string, string[]>;
      };
    } catch (error) {
      console.error('Error validating program:', error);
      throw error;
    }
  }

  /**
   * Get program templates
   */
  async getTemplates(tenantId: string): Promise<TrainingProgram[]> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/training-programs/templates`);
      return response.data as TrainingProgram[];
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  /**
   * Create program from template
   */
  async createFromTemplate(tenantId: string, templateId: string, customizations: Partial<TrainingProgram>): Promise<TrainingProgram> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/training-programs/templates/${templateId}/create`, customizations);
      return response.data as TrainingProgram;
    } catch (error) {
      console.error('Error creating from template:', error);
      throw error;
    }
  }

  /**
   * Save program as template
   */
  async saveAsTemplate(tenantId: string, programId: string, templateName: string): Promise<TrainingProgram> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/training-programs/${programId}/save-as-template`, {
        templateName
      });
      return response.data as TrainingProgram;
    } catch (error) {
      console.error('Error saving as template:', error);
      throw error;
    }
  }

  /**
   * Get program audit log
   */
  async getAuditLog(tenantId: string, programId: string, options?: {
    page?: number;
    limit?: number;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    logs: Array<{
      id: string;
      action: string;
      userId: string;
      userName: string;
      oldValue: any;
      newValue: any;
      timestamp: string;
      ipAddress: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const queryString = params.toString();
      const endpoint = `/api/tenants/${tenantId}/training-programs/${programId}/audit-log${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data as {
        logs: Array<{
          id: string;
          action: string;
          userId: string;
          userName: string;
          oldValue: any;
          newValue: any;
          timestamp: string;
          ipAddress: string;
        }>;
        total: number;
        page: number;
        limit: number;
      };
    } catch (error) {
      console.error('Error fetching audit log:', error);
      throw error;
    }
  }

  /**
   * Revert program to previous state
   */
  async revertProgram(tenantId: string, programId: string, auditLogId: string): Promise<TrainingProgram> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/training-programs/${programId}/revert/${auditLogId}`);
      return response.data as TrainingProgram;
    } catch (error) {
      console.error('Error reverting program:', error);
      throw error;
    }
  }

  /**
   * Get program sharing settings
   */
  async getSharingSettings(tenantId: string, programId: string): Promise<{
    isPublic: boolean;
    allowEnrollment: boolean;
    requireApproval: boolean;
    maxEnrollments: number;
    startDate: string;
    endDate: string;
    allowedGroups: string[];
    allowedRoles: string[];
  }> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/training-programs/${programId}/sharing-settings`);
      return response.data as {
        isPublic: boolean;
        allowEnrollment: boolean;
        requireApproval: boolean;
        maxEnrollments: number;
        startDate: string;
        endDate: string;
        allowedGroups: string[];
        allowedRoles: string[];
      };
    } catch (error) {
      console.error('Error fetching sharing settings:', error);
      throw error;
    }
  }

  /**
   * Update program sharing settings
   */
  async updateSharingSettings(tenantId: string, programId: string, settings: any): Promise<void> {
    try {
      await apiClient.put(`/api/tenants/${tenantId}/training-programs/${programId}/sharing-settings`, settings);
    } catch (error) {
      console.error('Error updating sharing settings:', error);
      throw error;
    }
  }

  /**
   * Get program prerequisites
   */
  async getPrerequisites(tenantId: string, programId: string): Promise<string[]> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/training-programs/${programId}/prerequisites`);
      return response.data as string[];
    } catch (error) {
      console.error('Error fetching prerequisites:', error);
      throw error;
    }
  }

  /**
   * Update program prerequisites
   */
  async updatePrerequisites(tenantId: string, programId: string, prerequisites: string[]): Promise<void> {
    try {
      await apiClient.put(`/api/tenants/${tenantId}/training-programs/${programId}/prerequisites`, {
        prerequisites
      });
    } catch (error) {
      console.error('Error updating prerequisites:', error);
      throw error;
    }
  }
}

export default new TrainingProgramService(); 