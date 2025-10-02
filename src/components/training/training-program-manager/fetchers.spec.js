/**
 * Training Program Manager Fetchers - Test Specifications
 * Unit tests for data fetching functionality
 */

import { TrainingProgramManagerFetcher } from './fetchers';
import apiServices from '../../../services/apiServices';

// Mock the API services
jest.mock('../../../services/apiServices');

describe('TrainingProgramManagerFetcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTrainingPrograms', () => {
    it('should fetch training programs successfully', async () => {
      const mockPrograms = [
        { id: '1', title: 'Test Program 1', status: 'active' },
        { id: '2', title: 'Test Program 2', status: 'draft' }
      ];
      const mockResponse = {
        success: true,
        data: mockPrograms,
        pagination: { total: 2, page: 1, limit: 10 }
      };

      apiServices.getTrainingPrograms.mockResolvedValue(mockResponse);

      const result = await TrainingProgramManagerFetcher.getTrainingPrograms();

      expect(result.programs).toEqual(mockPrograms);
      expect(result.total).toBe(2);
      expect(apiServices.getTrainingPrograms).toHaveBeenCalledWith(undefined);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      apiServices.getTrainingPrograms.mockRejectedValue(mockError);

      await expect(TrainingProgramManagerFetcher.getTrainingPrograms()).rejects.toThrow('API Error');
    });

    it('should pass filters to API service', async () => {
      const filters = { status: 'active', category: 'technology' };
      const mockResponse = { success: true, data: [], pagination: { total: 0 } };
      
      apiServices.getTrainingPrograms.mockResolvedValue(mockResponse);

      await TrainingProgramManagerFetcher.getTrainingPrograms(filters);

      expect(apiServices.getTrainingPrograms).toHaveBeenCalledWith(filters);
    });
  });

  describe('getTrainingProgramById', () => {
    it('should fetch a single training program', async () => {
      const mockProgram = { id: '1', title: 'Test Program', status: 'active' };
      const mockResponse = { success: true, data: mockProgram };

      apiServices.getTrainingProgram.mockResolvedValue(mockResponse);

      const result = await TrainingProgramManagerFetcher.getTrainingProgramById('1');

      expect(result).toEqual(mockProgram);
      expect(apiServices.getTrainingProgram).toHaveBeenCalledWith('1');
    });

    it('should handle not found error', async () => {
      const mockResponse = { success: false, error: 'Program not found' };
      apiServices.getTrainingProgram.mockResolvedValue(mockResponse);

      await expect(TrainingProgramManagerFetcher.getTrainingProgramById('999')).rejects.toThrow('Program not found');
    });
  });

  describe('createTrainingProgram', () => {
    it('should create a new training program', async () => {
      const programData = { title: 'New Program', description: 'Test description' };
      const mockResponse = { success: true, data: { id: '1', ...programData } };

      apiServices.createTrainingProgram.mockResolvedValue(mockResponse);

      const result = await TrainingProgramManagerFetcher.createTrainingProgram(programData);

      expect(result).toEqual(mockResponse.data);
      expect(apiServices.createTrainingProgram).toHaveBeenCalledWith(programData);
    });

    it('should handle validation errors', async () => {
      const programData = { title: '' }; // Invalid data
      const mockResponse = { success: false, error: 'Title is required' };
      
      apiServices.createTrainingProgram.mockResolvedValue(mockResponse);

      await expect(TrainingProgramManagerFetcher.createTrainingProgram(programData)).rejects.toThrow('Title is required');
    });
  });

  describe('updateTrainingProgram', () => {
    it('should update an existing training program', async () => {
      const programData = { title: 'Updated Program' };
      const mockResponse = { success: true, data: { id: '1', ...programData } };

      apiServices.updateTrainingProgram.mockResolvedValue(mockResponse);

      const result = await TrainingProgramManagerFetcher.updateTrainingProgram('1', programData);

      expect(result).toEqual(mockResponse.data);
      expect(apiServices.updateTrainingProgram).toHaveBeenCalledWith('1', programData);
    });
  });

  describe('deleteTrainingProgram', () => {
    it('should delete a training program', async () => {
      const mockResponse = { success: true };
      apiServices.deleteTrainingProgram.mockResolvedValue(mockResponse);

      const result = await TrainingProgramManagerFetcher.deleteTrainingProgram('1');

      expect(result).toBe(true);
      expect(apiServices.deleteTrainingProgram).toHaveBeenCalledWith('1');
    });

    it('should handle deletion errors', async () => {
      const mockResponse = { success: false, error: 'Cannot delete program with active sessions' };
      apiServices.deleteTrainingProgram.mockResolvedValue(mockResponse);

      await expect(TrainingProgramManagerFetcher.deleteTrainingProgram('1')).rejects.toThrow('Cannot delete program with active sessions');
    });
  });

  describe('getTrainingProgramStats', () => {
    it('should fetch training program statistics', async () => {
      const mockStats = {
        total: 10,
        active: 8,
        draft: 2,
        completed: 5
      };
      const mockResponse = { success: true, data: mockStats };

      apiServices.getTrainingProgramStats.mockResolvedValue(mockResponse);

      const result = await TrainingProgramManagerFetcher.getTrainingProgramStats();

      expect(result).toEqual(mockStats);
      expect(apiServices.getTrainingProgramStats).toHaveBeenCalled();
    });
  });

  describe('searchTrainingPrograms', () => {
    it('should search training programs', async () => {
      const query = 'javascript';
      const mockPrograms = [{ id: '1', title: 'JavaScript Basics' }];
      const mockResponse = {
        success: true,
        data: mockPrograms,
        pagination: { total: 1 }
      };

      apiServices.searchTrainingPrograms.mockResolvedValue(mockResponse);

      const result = await TrainingProgramManagerFetcher.searchTrainingPrograms(query);

      expect(result.programs).toEqual(mockPrograms);
      expect(result.total).toBe(1);
      expect(apiServices.searchTrainingPrograms).toHaveBeenCalledWith({ search: query });
    });
  });

  describe('getTrainingProgramsByCategory', () => {
    it('should fetch programs by category', async () => {
      const category = 'technology';
      const mockPrograms = [{ id: '1', title: 'Tech Program', category }];
      const mockResponse = { success: true, data: mockPrograms };

      apiServices.getTrainingPrograms.mockResolvedValue(mockResponse);

      const result = await TrainingProgramManagerFetcher.getTrainingProgramsByCategory(category);

      expect(result).toEqual(mockPrograms);
      expect(apiServices.getTrainingPrograms).toHaveBeenCalledWith({ category });
    });
  });

  describe('getTrainingProgramsByStatus', () => {
    it('should fetch programs by status', async () => {
      const status = 'active';
      const mockPrograms = [{ id: '1', title: 'Active Program', status }];
      const mockResponse = { success: true, data: mockPrograms };

      apiServices.getTrainingPrograms.mockResolvedValue(mockResponse);

      const result = await TrainingProgramManagerFetcher.getTrainingProgramsByStatus(status);

      expect(result).toEqual(mockPrograms);
      expect(apiServices.getTrainingPrograms).toHaveBeenCalledWith({ status });
    });
  });
});
