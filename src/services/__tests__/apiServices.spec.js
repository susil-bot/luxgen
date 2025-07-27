import apiServices from '../apiServices';
import apiClient from '../apiClient';

// Mock the apiClient
jest.mock('../apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  setAuthToken: jest.fn(),
}));

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Authentication Services', () => {
    describe('login', () => {
      test('should call login API with correct parameters', async () => {
        const mockResponse = {
          success: true,
          user: { id: 'user-123', name: 'Test User' },
          token: 'test-token',
        };
        
        apiClient.post.mockResolvedValue({ data: mockResponse });
        
        const credentials = {
          email: 'test@example.com',
          password: 'password123',
        };
        
        const result = await apiServices.login(credentials);
        
        expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
        expect(result).toEqual({ data: mockResponse });
      });

      test('should handle login errors', async () => {
        const mockError = new Error('Invalid credentials');
        apiClient.post.mockRejectedValue(mockError);
        
        const credentials = {
          email: 'test@example.com',
          password: 'wrongpassword',
        };
        
        await expect(apiServices.login(credentials)).rejects.toThrow('Invalid credentials');
      });
    });

    describe('register', () => {
      test('should call register API with correct parameters', async () => {
        const mockResponse = {
          success: true,
          user: { id: 'user-123', name: 'New User' },
          token: 'test-token',
        };
        
        apiClient.post.mockResolvedValue({ data: mockResponse });
        
        const userData = {
          firstName: 'New',
          lastName: 'User',
          email: 'newuser@example.com',
          password: 'password123',
        };
        
        const result = await apiServices.register(userData);
        
        expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData);
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('logout', () => {
      test('should call logout API', async () => {
        const mockResponse = { success: true, message: 'Logged out successfully' };
        apiClient.post.mockResolvedValue({ data: mockResponse });
        
        const result = await apiServices.logout();
        
        expect(apiClient.post).toHaveBeenCalledWith('/auth/logout', {});
        expect(apiClient.setAuthToken).toHaveBeenCalledWith(null);
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('getCurrentUser', () => {
      test('should call getCurrentUser API', async () => {
        const mockResponse = {
          success: true,
          user: { id: 'user-123', name: 'Test User' },
        };
        
        apiClient.get.mockResolvedValue({ data: mockResponse });
        
        const result = await apiServices.getCurrentUser();
        
        expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
        expect(result).toEqual({ data: mockResponse });
      });
    });
  });

  describe('User Management Services', () => {
    describe('getUsers', () => {
      test('should call getUsers API', async () => {
        const mockResponse = {
          success: true,
          data: [
            { id: 'user-1', name: 'User 1' },
            { id: 'user-2', name: 'User 2' },
          ],
        };
        
        apiClient.get.mockResolvedValue({ data: mockResponse });
        
        const result = await apiServices.getUsers();
        
        expect(apiClient.get).toHaveBeenCalledWith('/users');
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('createUser', () => {
      test('should call createUser API', async () => {
        const mockResponse = {
          success: true,
          user: { id: 'user-123', name: 'New User' },
        };
        
        apiClient.post.mockResolvedValue({ data: mockResponse });
        
        const userData = {
          firstName: 'New',
          lastName: 'User',
          email: 'newuser@example.com',
          role: 'participant',
        };
        
        const result = await apiServices.createUser(userData);
        
        expect(apiClient.post).toHaveBeenCalledWith('/users', userData);
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('updateUser', () => {
      test('should call updateUser API', async () => {
        const mockResponse = {
          success: true,
          user: { id: 'user-123', name: 'Updated User' },
        };
        
        apiClient.put.mockResolvedValue({ data: mockResponse });
        
        const userId = 'user-123';
        const userData = { firstName: 'Updated', lastName: 'User' };
        
        const result = await apiServices.updateUser(userId, userData);
        
        expect(apiClient.put).toHaveBeenCalledWith(`/users/${userId}`, userData);
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('deleteUser', () => {
      test('should call deleteUser API', async () => {
        const mockResponse = { success: true, message: 'User deleted' };
        apiClient.delete.mockResolvedValue({ data: mockResponse });
        
        const userId = 'user-123';
        const result = await apiServices.deleteUser(userId);
        
        expect(apiClient.delete).toHaveBeenCalledWith(`/users/${userId}`);
        expect(result).toEqual({ data: mockResponse });
      });
    });
  });

  describe('Tenant Management Services', () => {
    describe('getTenants', () => {
      test('should call getTenants API', async () => {
        const mockResponse = {
          success: true,
          data: [
            { id: 'tenant-1', name: 'Tenant 1' },
            { id: 'tenant-2', name: 'Tenant 2' },
          ],
        };
        
        apiClient.get.mockResolvedValue({ data: mockResponse });
        
        const result = await apiServices.getTenants();
        
        expect(apiClient.get).toHaveBeenCalledWith('/tenants');
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('createTenant', () => {
      test('should call createTenant API', async () => {
        const mockResponse = {
          success: true,
          tenant: { id: 'tenant-123', name: 'New Tenant' },
        };
        
        apiClient.post.mockResolvedValue({ data: mockResponse });
        
        const tenantData = {
          name: 'New Tenant',
          domain: 'newtenant.com',
          settings: {},
        };
        
        const result = await apiServices.createTenant(tenantData);
        
        expect(apiClient.post).toHaveBeenCalledWith('/tenants', tenantData);
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('updateTenant', () => {
      test('should call updateTenant API', async () => {
        const mockResponse = {
          success: true,
          tenant: { id: 'tenant-123', name: 'Updated Tenant' },
        };
        
        apiClient.put.mockResolvedValue({ data: mockResponse });
        
        const tenantId = 'tenant-123';
        const tenantData = { name: 'Updated Tenant' };
        
        const result = await apiServices.updateTenant(tenantId, tenantData);
        
        expect(apiClient.put).toHaveBeenCalledWith(`/tenants/${tenantId}`, tenantData);
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('deleteTenant', () => {
      test('should call deleteTenant API', async () => {
        const mockResponse = { success: true, message: 'Tenant deleted' };
        apiClient.delete.mockResolvedValue({ data: mockResponse });
        
        const tenantId = 'tenant-123';
        const result = await apiServices.deleteTenant(tenantId);
        
        expect(apiClient.delete).toHaveBeenCalledWith(`/tenants/${tenantId}`);
        expect(result).toEqual({ data: mockResponse });
      });
    });
  });

  describe('Training Services', () => {
    describe('getTrainingSessions', () => {
      test('should call getTrainingSessions API', async () => {
        const mockResponse = {
          success: true,
          data: [
            { id: 'session-1', title: 'Session 1' },
            { id: 'session-2', title: 'Session 2' },
          ],
        };
        
        apiClient.get.mockResolvedValue({ data: mockResponse });
        
        const result = await apiServices.getTrainingSessions();
        
        expect(apiClient.get).toHaveBeenCalledWith('/training/sessions');
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('createTrainingSession', () => {
      test('should call createTrainingSession API', async () => {
        const mockResponse = {
          success: true,
          session: { id: 'session-123', title: 'New Session' },
        };
        
        apiClient.post.mockResolvedValue({ data: mockResponse });
        
        const sessionData = {
          title: 'New Session',
          description: 'Session description',
          date: '2024-01-20T10:00:00Z',
        };
        
        const result = await apiServices.createTrainingSession(sessionData);
        
        expect(apiClient.post).toHaveBeenCalledWith('/training/sessions', sessionData);
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('submitAssessment', () => {
      test('should call submitAssessment API', async () => {
        const mockResponse = {
          success: true,
          score: 85,
          feedback: 'Good job!',
        };
        
        apiClient.post.mockResolvedValue({ data: mockResponse });
        
        const assessmentId = 'assessment-123';
        const submission = {
          answers: [
            { questionId: 'q1', answer: 'React is a library' },
          ],
        };
        
        const result = await apiServices.submitAssessment(assessmentId, submission);
        
        expect(apiClient.post).toHaveBeenCalledWith(`/training/assessments/${assessmentId}/submit`, submission);
        expect(result).toEqual({ data: mockResponse });
      });
    });
  });

  describe('Content Services', () => {
    describe('getContentLibrary', () => {
      test('should call getContentLibrary API', async () => {
        const mockResponse = {
          success: true,
          data: [
            { id: 'content-1', title: 'Content 1' },
            { id: 'content-2', title: 'Content 2' },
          ],
        };
        
        apiClient.get.mockResolvedValue({ data: mockResponse });
        
        const filters = { type: 'video' };
        const result = await apiServices.getContentLibrary(filters);
        
        expect(apiClient.get).toHaveBeenCalledWith('/ai/content/library?type=video');
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('generateContent', () => {
      test('should call generateContent API', async () => {
        const mockResponse = {
          success: true,
          content: { id: 'content-123', title: 'Generated Content' },
        };
        
        apiClient.post.mockResolvedValue({ data: mockResponse });
        
        const type = 'article';
        const prompt = 'Write about React hooks';
        const options = { tone: 'professional', length: 'medium' };
        
        const result = await apiServices.generateContent(type, prompt, options);
        
        expect(apiClient.post).toHaveBeenCalledWith('/ai/generate/content', {
          type,
          prompt,
          options,
        });
        expect(result).toEqual({ data: mockResponse });
      });
    });
  });

  describe('Analytics Services', () => {
    describe('getDashboardAnalytics', () => {
      test('should call getDashboardAnalytics API', async () => {
        const mockResponse = {
          success: true,
          data: {
            users: { total: 100, active: 80 },
            groups: { total: 10, active: 8 },
            training: { totalSessions: 25, completedSessions: 20 },
          },
        };
        
        apiClient.get.mockResolvedValue({ data: mockResponse });
        
        const result = await apiServices.getDashboardAnalytics();
        
        expect(apiClient.get).toHaveBeenCalledWith('/analytics/dashboard');
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('getUserAnalytics', () => {
      test('should call getUserAnalytics API', async () => {
        const mockResponse = {
          success: true,
          data: {
            sessionsCompleted: 8,
            averageScore: 85,
            timeSpent: 24,
          },
        };
        
        apiClient.get.mockResolvedValue({ data: mockResponse });
        
        const result = await apiServices.getUserAnalytics();
        
        expect(apiClient.get).toHaveBeenCalledWith('/analytics/users');
        expect(result).toEqual({ data: mockResponse });
      });
    });
  });

  describe('Notification Services', () => {
    describe('getNotifications', () => {
      test('should call getNotifications API', async () => {
        const mockResponse = {
          success: true,
          data: {
            notifications: [
              { id: 'notif-1', title: 'Notification 1' },
              { id: 'notif-2', title: 'Notification 2' },
            ],
            unreadCount: 1,
          },
        };
        
        apiClient.get.mockResolvedValue({ data: mockResponse });
        
        const tenantId = 'tenant-123';
        const options = { page: 1, limit: 10, unreadOnly: false };
        const result = await apiServices.getNotifications(tenantId, options);
        
        expect(apiClient.get).toHaveBeenCalledWith(`/polls/${tenantId}/notifications?page=1&limit=10`);
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('markNotificationAsRead', () => {
      test('should call markNotificationAsRead API', async () => {
        const mockResponse = { success: true, message: 'Notification marked as read' };
        apiClient.put.mockResolvedValue({ data: mockResponse });
        
        const tenantId = 'tenant-123';
        const notificationId = 'notif-123';
        const result = await apiServices.markNotificationAsRead(tenantId, notificationId);
        
        expect(apiClient.put).toHaveBeenCalledWith(`/polls/${tenantId}/notifications/${notificationId}/read`, {});
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('deleteNotification', () => {
      test('should call deleteNotification API', async () => {
        const mockResponse = { success: true, message: 'Notification deleted' };
        apiClient.delete.mockResolvedValue({ data: mockResponse });
        
        const notificationId = 'notif-123';
        const result = await apiServices.deleteNotification(notificationId);
        
        expect(apiClient.delete).toHaveBeenCalledWith(`/notifications/${notificationId}`);
        expect(result).toEqual({ data: mockResponse });
      });
    });
  });

  describe('File Upload Services', () => {
    describe('uploadFile', () => {
      test('should call uploadFile API', async () => {
        const mockResponse = {
          success: true,
          file: {
            id: 'file-123',
            name: 'document.pdf',
            url: 'https://example.com/files/document.pdf',
          },
        };
        
        apiClient.post.mockResolvedValue({ data: mockResponse });
        
        const file = new File(['test content'], 'document.pdf', { type: 'application/pdf' });
        const type = 'document';
        const category = 'training';
        
        const result = await apiServices.uploadFile(file, type, category);
        
        expect(apiClient.post).toHaveBeenCalledWith('/files/upload', expect.any(FormData));
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('deleteFile', () => {
      test('should call deleteFile API', async () => {
        const mockResponse = { success: true, message: 'File deleted' };
        apiClient.delete.mockResolvedValue({ data: mockResponse });
        
        const fileId = 'file-123';
        const result = await apiServices.deleteFile(fileId);
        
        expect(apiClient.delete).toHaveBeenCalledWith(`/files/${fileId}`);
        expect(result).toEqual({ data: mockResponse });
      });
    });
  });

  describe('Poll Services', () => {
    describe('getPolls', () => {
      test('should call getPolls API', async () => {
        const mockResponse = {
          success: true,
          data: [
            { id: 'poll-1', title: 'Poll 1' },
            { id: 'poll-2', title: 'Poll 2' },
          ],
        };
        
        apiClient.get.mockResolvedValue({ data: mockResponse });
        
        const tenantId = 'tenant-123';
        const result = await apiServices.getPolls(tenantId);
        
        expect(apiClient.get).toHaveBeenCalledWith(`/polls/${tenantId}`);
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('createPoll', () => {
      test('should call createPoll API', async () => {
        const mockResponse = {
          success: true,
          poll: { id: 'poll-123', title: 'New Poll' },
        };
        
        apiClient.post.mockResolvedValue({ data: mockResponse });
        
        const tenantId = 'tenant-123';
        const pollData = {
          title: 'New Poll',
          question: 'What is your favorite color?',
          type: 'multiple_choice',
        };
        
        const result = await apiServices.createPoll(tenantId, pollData);
        
        expect(apiClient.post).toHaveBeenCalledWith(`/polls/${tenantId}`, pollData);
        expect(result).toEqual({ data: mockResponse });
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      apiClient.get.mockRejectedValue(networkError);
      
      await expect(apiServices.getUsers()).rejects.toThrow('Network Error');
    });

    test('should handle API errors with status codes', async () => {
      const apiError = {
        response: {
          status: 404,
          data: { message: 'Resource not found' },
        },
      };
      apiClient.get.mockRejectedValue(apiError);
      
      await expect(apiServices.getUsers()).rejects.toEqual(apiError);
    });

    test('should handle validation errors', async () => {
      const validationError = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            errors: ['Email is required', 'Password is too short'],
          },
        },
      };
      apiClient.post.mockRejectedValue(validationError);
      
      await expect(apiServices.login({})).rejects.toEqual(validationError);
    });
  });

  describe('Health Check Services', () => {
    describe('getHealth', () => {
      test('should call getHealth API', async () => {
        const mockResponse = {
          success: true,
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'api',
            version: '1.0.0',
          },
        };
        
        apiClient.get.mockResolvedValue({ data: mockResponse });
        
        const result = await apiServices.getHealth();
        
        expect(apiClient.get).toHaveBeenCalledWith('/health');
        expect(result).toEqual({ data: mockResponse });
      });
    });

    describe('checkApiConnection', () => {
      test('should call checkApiConnection API', async () => {
        const mockHealthResponse = {
          success: true,
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'api',
            version: '1.0.0',
          },
        };
        
        // Mock the getHealth method that checkApiConnection calls internally
        jest.spyOn(apiServices, 'getHealth').mockResolvedValue(mockHealthResponse);
        
        const result = await apiServices.checkApiConnection();
        
        expect(apiServices.getHealth).toHaveBeenCalled();
        expect(result).toEqual({
          success: true,
          data: {
            connected: true,
            timestamp: expect.any(String),
          },
        });
      });
    });
  });
}); 