import TrainingProgramService from '../TrainingProgramService';
import apiClient from '../apiClient';

// Mock the apiClient
jest.mock('../apiClient');

describe('TrainingProgramService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPrograms', () => {
    it('should fetch programs without filters', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            title: 'Test Program',
            description: 'Test Description',
            status: 'active'
          }
        ]
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getPrograms('tenant-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs');
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch programs with filters', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            title: 'Test Program',
            description: 'Test Description',
            status: 'active'
          }
        ]
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const filters = {
        status: 'active',
        type: 'course',
        category: 'technology'
      };

      const result = await TrainingProgramService.getPrograms('tenant-1', filters);

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs?status=active&type=course&category=technology');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getProgram', () => {
    it('should fetch a specific program', async () => {
      const mockResponse = {
        data: {
          id: '1',
          title: 'Test Program',
          description: 'Test Description',
          status: 'active'
        }
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getProgram('tenant-1', 'program-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createProgram', () => {
    it('should create a new program', async () => {
      const mockResponse = {
        data: {
          id: '1',
          title: 'New Program',
          description: 'New Description',
          status: 'draft'
        }
      };
      
      apiClient.post.mockResolvedValue(mockResponse);

      const programData = {
        title: 'New Program',
        description: 'New Description'
      };

      const result = await TrainingProgramService.createProgram('tenant-1', programData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs', programData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateProgram', () => {
    it('should update a program', async () => {
      const mockResponse = {
        data: {
          id: '1',
          title: 'Updated Program',
          description: 'Updated Description',
          status: 'active'
        }
      };
      
      apiClient.put.mockResolvedValue(mockResponse);

      const updates = {
        title: 'Updated Program',
        description: 'Updated Description'
      };

      const result = await TrainingProgramService.updateProgram('tenant-1', 'program-1', updates);

      expect(apiClient.put).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1', updates);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteProgram', () => {
    it('should delete a program', async () => {
      apiClient.delete.mockResolvedValue({});

      await TrainingProgramService.deleteProgram('tenant-1', 'program-1');

      expect(apiClient.delete).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1');
    });
  });

  describe('searchPrograms', () => {
    it('should search programs with query and filters', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            title: 'Search Result',
            description: 'Search Description',
            status: 'active'
          }
        ]
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const filters = {
        status: 'active',
        category: 'technology'
      };

      const result = await TrainingProgramService.searchPrograms('tenant-1', 'test query', filters);

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/search?q=test+query&status=active&category=technology');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getRecommendations', () => {
    it('should get program recommendations with userId', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            title: 'Recommended Program',
            description: 'Recommended Description',
            status: 'active'
          }
        ]
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getRecommendations('tenant-1', 'user-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/recommendations?userId=user-1');
      expect(result).toEqual(mockResponse.data);
    });

    it('should get program recommendations without userId', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            title: 'Recommended Program',
            description: 'Recommended Description',
            status: 'active'
          }
        ]
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getRecommendations('tenant-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/recommendations');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('exportPrograms', () => {
    it('should export programs with format and filters', async () => {
      const mockBlob = new Blob(['test data'], { type: 'text/csv' });
      const mockResponse = {
        data: mockBlob
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const filters = {
        status: 'active',
        category: 'technology'
      };

      const result = await TrainingProgramService.exportPrograms('tenant-1', 'csv', filters);

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/export?format=csv&status=active&category=technology');
      expect(result).toEqual(mockBlob);
    });
  });

  describe('importPrograms', () => {
    it('should import programs from file', async () => {
      const mockResponse = {
        data: {
          success: 5,
          failed: 1,
          errors: ['Row 3: Invalid data']
        }
      };
      
      apiClient.post.mockResolvedValue(mockResponse);

      const file = new File(['test data'], 'test.csv', { type: 'text/csv' });

      const result = await TrainingProgramService.importPrograms('tenant-1', file);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/tenants/tenant-1/training-programs/import',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getCategories', () => {
    it('should fetch program categories', async () => {
      const mockResponse = {
        data: ['Technology', 'Business', 'Marketing']
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getCategories('tenant-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/categories');
      expect(result).toEqual(['Technology', 'Business', 'Marketing']);
    });
  });

  describe('getInstructors', () => {
    it('should fetch program instructors', async () => {
      const mockResponse = {
        data: ['John Doe', 'Jane Smith', 'Bob Johnson']
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getInstructors('tenant-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/instructors');
      expect(result).toEqual(['John Doe', 'Jane Smith', 'Bob Johnson']);
    });
  });

  describe('getEnrollmentData', () => {
    it('should fetch enrollment data', async () => {
      const mockResponse = {
        data: {
          totalEnrollments: 100,
          activeEnrollments: 75,
          completedEnrollments: 20,
          averageProgress: 65,
          recentEnrollments: [
            { date: '2024-01-01', count: 10 },
            { date: '2024-01-02', count: 15 }
          ]
        }
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getEnrollmentData('tenant-1', 'program-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1/enrollments');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getCompletionData', () => {
    it('should fetch completion data', async () => {
      const mockResponse = {
        data: {
          totalCompletions: 20,
          averageCompletionTime: 120,
          completionRate: 20,
          recentCompletions: [
            { date: '2024-01-01', count: 5 },
            { date: '2024-01-02', count: 8 }
          ]
        }
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getCompletionData('tenant-1', 'program-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1/completions');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getFeedback', () => {
    it('should fetch program feedback', async () => {
      const mockResponse = {
        data: {
          averageRating: 4.5,
          totalRatings: 50,
          ratingDistribution: [
            { rating: 5, count: 30 },
            { rating: 4, count: 15 }
          ],
          recentFeedback: [
            {
              id: '1',
              userId: 'user-1',
              userName: 'John Doe',
              rating: 5,
              comment: 'Great program!',
              date: '2024-01-01'
            }
          ]
        }
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getFeedback('tenant-1', 'program-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1/feedback');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('validateProgram', () => {
    it('should validate program data', async () => {
      const mockResponse = {
        data: {
          valid: true,
          errors: {},
          warnings: {
            title: ['Consider making the title more descriptive']
          }
        }
      };
      
      apiClient.post.mockResolvedValue(mockResponse);

      const programData = {
        title: 'Test Program',
        description: 'Test Description'
      };

      const result = await TrainingProgramService.validateProgram('tenant-1', programData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/validate', programData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getTemplates', () => {
    it('should fetch program templates', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            title: 'Template Program',
            description: 'Template Description',
            status: 'active'
          }
        ]
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getTemplates('tenant-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/templates');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createFromTemplate', () => {
    it('should create program from template', async () => {
      const mockResponse = {
        data: {
          id: '1',
          title: 'New Program from Template',
          description: 'New Description',
          status: 'draft'
        }
      };
      
      apiClient.post.mockResolvedValue(mockResponse);

      const customizations = {
        title: 'New Program from Template',
        description: 'New Description'
      };

      const result = await TrainingProgramService.createFromTemplate('tenant-1', 'template-1', customizations);

      expect(apiClient.post).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/templates/template-1/create', customizations);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('saveAsTemplate', () => {
    it('should save program as template', async () => {
      const mockResponse = {
        data: {
          id: '1',
          title: 'Saved Template',
          description: 'Template Description',
          status: 'active'
        }
      };
      
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.saveAsTemplate('tenant-1', 'program-1', 'Saved Template');

      expect(apiClient.post).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1/save-as-template', {
        templateName: 'Saved Template'
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getAuditLog', () => {
    it('should fetch audit log with options', async () => {
      const mockResponse = {
        data: {
          logs: [
            {
              id: '1',
              action: 'update',
              userId: 'user-1',
              userName: 'John Doe',
              oldValue: { title: 'Old Title' },
              newValue: { title: 'New Title' },
              timestamp: '2024-01-01T00:00:00Z',
              ipAddress: '192.168.1.1'
            }
          ],
          total: 1,
          page: 1,
          limit: 10
        }
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const options = {
        page: 1,
        limit: 10,
        action: 'update'
      };

      const result = await TrainingProgramService.getAuditLog('tenant-1', 'program-1', options);

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1/audit-log?page=1&limit=10&action=update');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('revertProgram', () => {
    it('should revert program to previous state', async () => {
      const mockResponse = {
        data: {
          id: '1',
          title: 'Reverted Program',
          description: 'Reverted Description',
          status: 'active'
        }
      };
      
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.revertProgram('tenant-1', 'program-1', 'audit-1');

      expect(apiClient.post).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1/revert/audit-1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getSharingSettings', () => {
    it('should fetch sharing settings', async () => {
      const mockResponse = {
        data: {
          isPublic: true,
          allowEnrollment: true,
          requireApproval: false,
          maxEnrollments: 100,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          allowedGroups: ['group-1'],
          allowedRoles: ['user', 'admin']
        }
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getSharingSettings('tenant-1', 'program-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1/sharing-settings');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateSharingSettings', () => {
    it('should update sharing settings', async () => {
      apiClient.put.mockResolvedValue({});

      const settings = {
        isPublic: false,
        allowEnrollment: true,
        requireApproval: true
      };

      await TrainingProgramService.updateSharingSettings('tenant-1', 'program-1', settings);

      expect(apiClient.put).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1/sharing-settings', settings);
    });
  });

  describe('getPrerequisites', () => {
    it('should fetch prerequisites', async () => {
      const mockResponse = {
        data: ['prerequisite-1', 'prerequisite-2']
      };
      
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await TrainingProgramService.getPrerequisites('tenant-1', 'program-1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1/prerequisites');
      expect(result).toEqual(['prerequisite-1', 'prerequisite-2']);
    });
  });

  describe('updatePrerequisites', () => {
    it('should update prerequisites', async () => {
      apiClient.put.mockResolvedValue({});

      const prerequisites = ['prerequisite-1', 'prerequisite-2'];

      await TrainingProgramService.updatePrerequisites('tenant-1', 'program-1', prerequisites);

      expect(apiClient.put).toHaveBeenCalledWith('/api/tenants/tenant-1/training-programs/program-1/prerequisites', {
        prerequisites
      });
    });
  });

  describe('Error handling', () => {
    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      apiClient.get.mockRejectedValue(error);

      await expect(TrainingProgramService.getPrograms('tenant-1')).rejects.toThrow('API Error');
    });
  });
}); 