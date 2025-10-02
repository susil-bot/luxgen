/**
 * Training Program Manager - Data Fetchers
 * Handles all API calls and data fetching for training programs
 */

import apiServices from '../../../services/apiServices';
import { TrainingProgram, TrainingProgramFilters, TrainingProgramStats } from './types';
import { TrainingProgramManagerTransformer } from './transformers';

export class TrainingProgramManagerFetcher {
  /**
   * Fetch all training programs with optional filters
   */
  static async getTrainingPrograms(filters?: TrainingProgramFilters): Promise<{
    programs: TrainingProgram[];
    total: number;
    pagination: any;
  }> {
    try {
      const response = await apiServices.getTrainingCourses();
      if (response.success) {
        const courses = response.data || [];
        const programs = courses.map((course: any) => 
          TrainingProgramManagerTransformer.transformApiResponseToProgram(course)
        );
        return {
          programs,
          total: response.pagination?.total || programs.length,
          pagination: response.pagination
        };
      }
      throw new Error(response.error || 'Failed to fetch training programs');
    } catch (error) {
      console.error('Error fetching training programs:', error);
      throw error;
    }
  }

  /**
   * Fetch a single training program by ID
   */
  static async getTrainingProgramById(id: string): Promise<TrainingProgram> {
    try {
      const response = await apiServices.getTrainingCourse(id);
      if (response.success) {
        return TrainingProgramManagerTransformer.transformApiResponseToProgram(response.data);
      }
      throw new Error(response.error || 'Failed to fetch training program');
    } catch (error) {
      console.error(`Error fetching training program ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new training program
   */
  static async createTrainingProgram(programData: Partial<TrainingProgram>): Promise<TrainingProgram> {
    try {
      const courseData = TrainingProgramManagerTransformer.transformFormDataToApi(programData as any);
      const response = await apiServices.createTrainingCourse(courseData);
      if (response.success) {
        return TrainingProgramManagerTransformer.transformApiResponseToProgram(response.data);
      }
      throw new Error(response.error || 'Failed to create training program');
    } catch (error) {
      console.error('Error creating training program:', error);
      throw error;
    }
  }

  /**
   * Update an existing training program
   */
  static async updateTrainingProgram(id: string, programData: Partial<TrainingProgram>): Promise<TrainingProgram> {
    try {
      // Note: Update functionality not available in current API
      // This would need to be implemented in the backend
      throw new Error('Update functionality not implemented');
    } catch (error) {
      console.error(`Error updating training program ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a training program
   */
  static async deleteTrainingProgram(id: string): Promise<boolean> {
    try {
      // Note: Delete functionality not available in current API
      // This would need to be implemented in the backend
      throw new Error('Delete functionality not implemented');
    } catch (error) {
      console.error(`Error deleting training program ${id}:`, error);
      throw error;
    }
  }

  /**
   * Fetch training program statistics
   */
  static async getTrainingProgramStats(): Promise<TrainingProgramStats> {
    try {
      const response = await apiServices.getTrainingAnalytics();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch training program stats');
    } catch (error) {
      console.error('Error fetching training program stats:', error);
      throw error;
    }
  }

  /**
   * Search training programs
   */
  static async searchTrainingPrograms(query: string, filters?: TrainingProgramFilters): Promise<{
    programs: TrainingProgram[];
    total: number;
  }> {
    try {
      const response = await apiServices.searchTrainingContent(query);
      if (response.success) {
        return {
          programs: response.data || [],
          total: response.data?.length || 0
        };
      }
      throw new Error(response.error || 'Failed to search training programs');
    } catch (error) {
      console.error('Error searching training programs:', error);
      throw error;
    }
  }

  /**
   * Fetch training programs by category
   */
  static async getTrainingProgramsByCategory(category: string): Promise<TrainingProgram[]> {
    try {
      const response = await apiServices.getTrainingCourses();
      if (response.success) {
        const courses = response.data || [];
        const programs = courses.map((course: any) => 
          TrainingProgramManagerTransformer.transformApiResponseToProgram(course)
        );
        return programs.filter((program: TrainingProgram) => program.category === category);
      }
      throw new Error(response.error || 'Failed to fetch training programs by category');
    } catch (error) {
      console.error(`Error fetching training programs by category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Fetch training programs by status
   */
  static async getTrainingProgramsByStatus(status: string): Promise<TrainingProgram[]> {
    try {
      const response = await apiServices.getTrainingCourses();
      if (response.success) {
        const courses = response.data || [];
        const programs = courses.map((course: any) => 
          TrainingProgramManagerTransformer.transformApiResponseToProgram(course)
        );
        return programs.filter((program: TrainingProgram) => program.status === status);
      }
      throw new Error(response.error || 'Failed to fetch training programs by status');
    } catch (error) {
      console.error(`Error fetching training programs by status ${status}:`, error);
      throw error;
    }
  }
}
