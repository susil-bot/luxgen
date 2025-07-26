import apiServices from '../apiServices';
import apiClient from '../apiClient';

// Mock the apiClient
jest.mock('../apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  setAuthToken: jest.fn(),
  getAuthToken: jest.fn(),
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('apiServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    it('calls health endpoint correctly', async () => {
      const mockResponse = { success: true, data: { status: 'ok' } };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await apiServices.getHealth();

      expect(mockApiClient.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockResponse);
    });

    it('handles health check error', async () => {
      const mockError = new Error('Network error');
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(apiServices.getHealth()).rejects.toThrow('Network error');
      expect(mockApiClient.get).toHaveBeenCalledWith('/health');
    });
  });

  describe('User Registration', () => {
    it('calls registration endpoint with correct data', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          user: { id: '1', email: 'test@example.com' },
          token: 'mock-token'
        } 
      };
      mockApiClient.post.mockResolvedValue(mockResponse);

      const registrationData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        company: 'Test Company',
        role: 'user',
        marketingConsent: true
      };

      const result = await apiServices.register(registrationData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', registrationData);
      expect(result).toEqual(mockResponse);
    });

    it('handles registration error', async () => {
      const mockError = new Error('Registration failed');
      mockApiClient.post.mockRejectedValue(mockError);

      const registrationData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        company: 'Test Company',
        role: 'user',
        marketingConsent: true
      };

      await expect(apiServices.register(registrationData)).rejects.toThrow('Registration failed');
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', registrationData);
    });
  });

  describe('User Authentication', () => {
    it('calls login endpoint with correct data', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          user: { id: '1', email: 'test@example.com' },
          token: 'mock-token'
        } 
      };
      mockApiClient.post.mockResolvedValue(mockResponse);

      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await apiServices.login(loginData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', loginData);
      expect(result).toEqual(mockResponse);
    });

    it('calls logout endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'Logged out successfully' };
      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await apiServices.logout();

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout', {});
      expect(result).toEqual(mockResponse);
    });

    it('calls getCurrentUser endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          user: { id: '1', email: 'test@example.com' }
        } 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await apiServices.getCurrentUser();

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Email Verification', () => {
    it('calls resend verification email endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'Verification email sent' };
      mockApiClient.post.mockResolvedValue(mockResponse);

      const data = {
        email: 'test@example.com',
        registrationId: 'mock-registration-id'
      };

      const result = await apiServices.resendVerificationEmail(data);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/resend-verification', data);
      expect(result).toEqual(mockResponse);
    });

    it('calls check email verification status endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          isEmailVerified: true,
          registrationId: 'mock-registration-id'
        } 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const registrationId = 'mock-registration-id';

      const result = await apiServices.checkEmailVerification(registrationId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/auth/verification-status/${registrationId}`);
      expect(result).toEqual(mockResponse);
    });

    it('calls verify email endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'Email verified successfully' };
      mockApiClient.post.mockResolvedValue(mockResponse);

      const token = 'mock-verification-token';

      const result = await apiServices.verifyEmail(token);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/verify-email', { token });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Password Reset', () => {
    it('calls forgot password endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'Password reset email sent' };
      mockApiClient.post.mockResolvedValue(mockResponse);

      const data = { email: 'test@example.com' };

      const result = await apiServices.forgotPassword(data);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/forgot-password', data);
      expect(result).toEqual(mockResponse);
    });

    it('calls reset password endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'Password reset successfully' };
      mockApiClient.post.mockResolvedValue(mockResponse);

      const data = {
        token: 'mock-reset-token',
        password: 'newpassword123'
      };

      const result = await apiServices.resetPassword(data);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/reset-password', data);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('User Management', () => {
    it('calls get users endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          users: [
            { id: '1', email: 'user1@example.com' },
            { id: '2', email: 'user2@example.com' }
          ]
        } 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await apiServices.getUsers();

      expect(mockApiClient.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockResponse);
    });

    it('calls get user by id endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          user: { id: '1', email: 'test@example.com' }
        } 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const userId = '1';

      const result = await apiServices.getUser(userId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockResponse);
    });

    it('calls update user endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'User updated successfully' };
      mockApiClient.put.mockResolvedValue(mockResponse);

      const userId = '1';
      const userData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+1234567890'
      };

      const result = await apiServices.updateUser(userId, userData);

      expect(mockApiClient.put).toHaveBeenCalledWith(`/users/${userId}`, userData);
      expect(result).toEqual(mockResponse);
    });

    it('calls delete user endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'User deleted successfully' };
      mockApiClient.delete.mockResolvedValue(mockResponse);

      const userId = '1';

      const result = await apiServices.deleteUser(userId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Tenant Management', () => {
    it('calls create tenant endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          tenant: { id: '1', name: 'Test Tenant' }
        } 
      };
      mockApiClient.post.mockResolvedValue(mockResponse);

      const tenantData = {
        name: 'Test Tenant',
        domain: 'test-tenant',
        settings: { theme: 'dark' }
      };

      const result = await apiServices.createTenant(tenantData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/tenants/create', tenantData);
      expect(result).toEqual(mockResponse);
    });

    it('calls get tenants endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          tenants: [
            { id: '1', name: 'Tenant 1' },
            { id: '2', name: 'Tenant 2' }
          ]
        } 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await apiServices.getTenants();

      expect(mockApiClient.get).toHaveBeenCalledWith('/tenants');
      expect(result).toEqual(mockResponse);
    });

    it('calls get tenant by id endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          tenant: { id: '1', name: 'Test Tenant' }
        } 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const tenantId = '1';

      const result = await apiServices.getTenant(tenantId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/tenants/${tenantId}`);
      expect(result).toEqual(mockResponse);
    });

    it('calls update tenant endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'Tenant updated successfully' };
      mockApiClient.put.mockResolvedValue(mockResponse);

      const tenantId = '1';
      const tenantData = {
        name: 'Updated Tenant',
        settings: { theme: 'light' }
      };

      const result = await apiServices.updateTenant(tenantId, tenantData);

      expect(mockApiClient.put).toHaveBeenCalledWith(`/tenants/${tenantId}`, tenantData);
      expect(result).toEqual(mockResponse);
    });

    it('calls delete tenant endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'Tenant deleted successfully' };
      mockApiClient.delete.mockResolvedValue(mockResponse);

      const tenantId = '1';

      const result = await apiServices.deleteTenant(tenantId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/tenants/${tenantId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Polls Management', () => {
    it('calls get polls endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          polls: [
            { id: '1', question: 'Test Poll 1' },
            { id: '2', question: 'Test Poll 2' }
          ]
        } 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const tenantId = '1';
      const result = await apiServices.getPolls(tenantId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/polls/${tenantId}`);
      expect(result).toEqual(mockResponse);
    });

    it('calls create poll endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          poll: { id: '1', question: 'New Poll' }
        } 
      };
      mockApiClient.post.mockResolvedValue(mockResponse);

      const tenantId = '1';
      const pollData = {
        title: 'New Poll',
        description: 'Test poll description',
        niche: 'general',
        targetAudience: ['all'],
        questions: [{
          question: 'Test question?',
          type: 'multiple_choice' as const,
          options: ['Option 1', 'Option 2'],
          required: true
        }],
        channels: ['email'],
        status: 'draft' as const,
        priority: 'medium' as const,
        tags: ['test'],
        recipients: [],
        responses: [],
        feedback: [],
        notifications: [],
        settings: {
          allowAnonymous: false,
          requireEmail: true,
          autoClose: false
        },
        analytics: {
          totalRecipients: 0,
          totalResponses: 0,
          responseRate: 0,
          averageRating: 0,
          completionTime: 0
        }
      };

      const result = await apiServices.createPoll(tenantId, pollData);

      expect(mockApiClient.post).toHaveBeenCalledWith(`/polls/${tenantId}`, pollData);
      expect(result).toEqual(mockResponse);
    });

    it('calls get poll by id endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          poll: { id: '1', question: 'Test Poll' }
        } 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const tenantId = '1';
      const pollId = '1';

      const result = await apiServices.getPoll(tenantId, pollId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/polls/${tenantId}/${pollId}`);
      expect(result).toEqual(mockResponse);
    });

    it('calls update poll endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'Poll updated successfully' };
      mockApiClient.put.mockResolvedValue(mockResponse);

      const tenantId = '1';
      const pollId = '1';
      const pollData = {
        title: 'Updated Poll',
        description: 'Updated poll description',
        questions: [{
          question: 'Updated question?',
          type: 'multiple_choice' as const,
          options: ['Updated Option 1', 'Updated Option 2'],
          required: true
        }]
      };

      const result = await apiServices.updatePoll(tenantId, pollId, pollData);

      expect(mockApiClient.put).toHaveBeenCalledWith(`/polls/${tenantId}/${pollId}`, pollData);
      expect(result).toEqual(mockResponse);
    });

    it('calls delete poll endpoint correctly', async () => {
      const mockResponse = { success: true, message: 'Poll deleted successfully' };
      mockApiClient.delete.mockResolvedValue(mockResponse);

      const tenantId = '1';
      const pollId = '1';

      const result = await apiServices.deletePoll(tenantId, pollId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/polls/${tenantId}/${pollId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Analytics', () => {
    it('calls get tenant analytics endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          analytics: { totalUsers: 100, activeUsers: 50 }
        } 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const tenantId = '1';

      const result = await apiServices.getTenantAnalytics(tenantId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/analytics/${tenantId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Database Status', () => {
    it('calls database status endpoint correctly', async () => {
      const mockResponse = { 
        success: true, 
        data: { 
          status: 'connected',
          tables: ['users', 'tenants']
        } 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await apiServices.getDatabaseStatus();

      expect(mockApiClient.get).toHaveBeenCalledWith('/database/status');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('handles network errors consistently', async () => {
      const mockError = new Error('Network error');
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(apiServices.getHealth()).rejects.toThrow('Network error');
    });

    it('handles API errors consistently', async () => {
      const mockError = { response: { data: { message: 'API Error' } } };
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(apiServices.getHealth()).rejects.toEqual(mockError);
    });

    it('handles timeout errors', async () => {
      const mockError = new Error('Request timeout');
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(apiServices.getHealth()).rejects.toThrow('Request timeout');
    });
  });

  describe('Request/Response Format', () => {
    it('maintains consistent request format', async () => {
      const mockResponse = { success: true, data: {} };
      mockApiClient.post.mockResolvedValue(mockResponse);

      const testData = { email: 'test@example.com', password: 'password123' };
      await apiServices.login(testData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', testData);
    });

    it('handles different response formats', async () => {
      const mockResponse = { success: true, data: {}, message: 'Success' };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await apiServices.getHealth();

      expect(result).toEqual(mockResponse);
    });
  });
}); 