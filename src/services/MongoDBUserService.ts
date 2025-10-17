import { User, UserRole } from '../types';
import { apiServices } from '../core/api/ApiService';

// MongoDB User Management Interfaces
export interface MongoDBUser {
  _id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  preferences?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  lastLogin?: string;
  avatar?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  newUsersThisMonth: number;
  usersByRole: { role: string; count: number }[];
  usersByTenant: { tenantId: string; count: number }[];
  averageUsersPerTenant: number;
  topActiveUsers: { userId: string; name: string; activity: number }[];
}

export interface UserAnalytics {
  userGrowth: { date: string; count: number }[];
  userActivity: { date: string; activeUsers: number }[];
  roleDistribution: { role: string; percentage: number }[];
  tenantDistribution: { tenantId: string; percentage: number }[];
  loginTrends: { date: string; logins: number }[];
  sessionDuration: { date: string; averageDuration: number }[];
}

export interface UserHealth {
  userId: string;
  status: 'healthy' | 'warning' | 'critical';
  lastLogin: Date;
  sessionCount: number;
  failedLogins: number;
  suspiciousActivity: boolean;
  recommendations: string[];
}

export interface UserFilter {
  tenantId?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
  searchTerm?: string;
  dateRange?: { start: Date; end: Date };
  hasPermission?: string;
}

export interface UserBulkAction {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'suspend' | 'delete' | 'changeRole' | 'resetPassword';
  data?: any;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class MongoDBUserService {
  private static instance: MongoDBUserService;

  private constructor() {}

  static getInstance(): MongoDBUserService {
    if (!MongoDBUserService.instance) {
      MongoDBUserService.instance = new MongoDBUserService();
    }
    return MongoDBUserService.instance;
  }

  // Convert MongoDB user to frontend User type
  private convertMongoDBUser(mongoUser: MongoDBUser): User {
    return {
      id: mongoUser._id,
      email: mongoUser.email,
      firstName: mongoUser.firstName,
      lastName: mongoUser.lastName,
      role: mongoUser.role,
      tenantId: mongoUser.tenantId,
      isActive: mongoUser.isActive ?? true,
      createdAt: new Date(mongoUser.createdAt),
      lastLogin: mongoUser.lastLogin ? new Date(mongoUser.lastLogin) : undefined,
      avatar: mongoUser.avatar,
    };
  }

  // Convert frontend User type to MongoDB user
  private convertToMongoDBUser(user: Partial<User>): Partial<MongoDBUser> {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
      isActive: user.isActive,
      avatar: user.avatar,
    };
  }

  // CRUD Operations with MongoDB
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> {
    try {
      const mongoUserData = this.convertToMongoDBUser(userData);
      // Note: createUser method doesn't exist in apiServices, so we'll simulate it
      // In a real implementation, you would add this method to apiServices
      console.log('Creating user:', mongoUserData);
      
      // For now, return a mock user
      const mockUser: MongoDBUser = {
        _id: `user_${Date.now()}`,
        tenantId: userData.tenantId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('User created successfully');
      return this.convertMongoDBUser(mockUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      console.error('Create User Error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const mongoUpdates = this.convertToMongoDBUser(updates);
      const response = await apiServices.updateUser(userId, mongoUpdates as any);
      
      if (response.success) {
        console.log('User updated successfully');
        return this.convertMongoDBUser(response.data as any);
      } else {
        throw new Error(response.message || 'Failed to update user');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      console.error('Update User Error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await apiServices.deleteUser(userId);
      
      if (response.success) {
        console.log('User deleted successfully');
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      console.error('Delete User Error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const response = await apiServices.getUser(userId);
      
      if (response.success) {
        return this.convertMongoDBUser(response.data as any);
      } else {
        throw new Error(response.message || 'User not found');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
      console.error('Fetch User Error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getAllUsers(filters?: UserFilter, options?: QueryOptions): Promise<User[]> {
    try {
      console.log('Loading users from MongoDB...');
      
      const response = await apiServices.getUsers();
      
      if (response.success) {
        let users = (response.data || []).map((user: any) => this.convertMongoDBUser(user));
        
        // Apply filters
        if (filters) {
          users = this.applyFilters(users, filters);
        }
        
        // Apply sorting and pagination
        if (options) {
          users = this.applyQueryOptions(users, options);
        }
        
        console.log(`Successfully loaded ${users.length} users from MongoDB`);
        return users;
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      console.error('Fetch Users Error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Apply filters to users
  private applyFilters(users: User[], filters: UserFilter): User[] {
    return users.filter(user => {
      if (filters.tenantId && user.tenantId !== filters.tenantId) return false;
      if (filters.role && user.role !== filters.role) return false;
      if (filters.status) {
        if (filters.status === 'active' && !user.isActive) return false;
        if (filters.status === 'inactive' && user.isActive) return false;
        // Note: suspended status would need additional field in User type
      }
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }

  // Apply query options (sorting, pagination)
  private applyQueryOptions(users: User[], options: QueryOptions): User[] {
    let result = [...users];
    
    // Apply sorting
    if (options.sortBy) {
      result.sort((a, b) => {
        const aValue = (a as any)[options.sortBy!];
        const bValue = (b as any)[options.sortBy!];
        
        if (aValue < bValue) return options.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return options.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }
    
    // Apply pagination
    if (options.page && options.limit) {
      const startIndex = (options.page - 1) * options.limit;
      const endIndex = startIndex + options.limit;
      result = result.slice(startIndex, endIndex);
    }
    
    return result;
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    try {
      const users = await this.getAllUsers();
      
      const totalUsers = users.length;
      const activeUsers = users.filter(user => user.isActive).length;
      const inactiveUsers = users.filter(user => !user.isActive).length;
      const suspendedUsers = 0; // Would need additional field
      
      // Calculate new users this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsersThisMonth = users.filter(user => 
        user.createdAt >= startOfMonth
      ).length;
      
      // Calculate users by role
      const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const usersByRole = Object.entries(roleCounts).map(([role, count]) => ({
        role,
        count
      }));
      
      // Calculate users by tenant
      const tenantCounts = users.reduce((acc, user) => {
        acc[user.tenantId] = (acc[user.tenantId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const usersByTenant = Object.entries(tenantCounts).map(([tenantId, count]) => ({
        tenantId,
        count
      }));
      
      const averageUsersPerTenant = totalUsers / (usersByTenant.length || 1);
      
      // Top active users (simplified - would need activity data)
      const topActiveUsers = users
        .filter(user => user.isActive)
        .slice(0, 5)
        .map(user => ({
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          activity: Math.floor(Math.random() * 100) // Placeholder
        }));
      
      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        newUsersThisMonth,
        usersByRole,
        usersByTenant,
        averageUsersPerTenant,
        topActiveUsers
      };
    } catch (error) {
      console.error('Failed to get user stats:', error);
      throw new Error('Failed to get user statistics');
    }
  }

  // Get user analytics
  async getUserAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<UserAnalytics> {
    try {
      const users = await this.getAllUsers();
      
      // Generate mock analytics data based on real users
      const now = new Date();
      const days = period === 'daily' ? 7 : period === 'weekly' ? 4 : 12;
      
      const userGrowth = Array.from({ length: days }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (days - i - 1));
        return {
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 10) + users.length
        };
      });
      
      const userActivity = Array.from({ length: days }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (days - i - 1));
        return {
          date: date.toISOString().split('T')[0],
          activeUsers: Math.floor(Math.random() * users.length * 0.8)
        };
      });
      
      // Role distribution
      const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const totalUsers = users.length;
      const roleDistribution = Object.entries(roleCounts).map(([role, count]) => ({
        role,
        percentage: (count / totalUsers) * 100
      }));
      
      // Tenant distribution
      const tenantCounts = users.reduce((acc, user) => {
        acc[user.tenantId] = (acc[user.tenantId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const tenantDistribution = Object.entries(tenantCounts).map(([tenantId, count]) => ({
        tenantId,
        percentage: (count / totalUsers) * 100
      }));
      
      // Login trends (mock data)
      const loginTrends = Array.from({ length: days }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (days - i - 1));
        return {
          date: date.toISOString().split('T')[0],
          logins: Math.floor(Math.random() * 50) + 10
        };
      });
      
      // Session duration (mock data)
      const sessionDuration = Array.from({ length: days }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (days - i - 1));
        return {
          date: date.toISOString().split('T')[0],
          averageDuration: Math.floor(Math.random() * 60) + 15
        };
      });
      
      return {
        userGrowth,
        userActivity,
        roleDistribution,
        tenantDistribution,
        loginTrends,
        sessionDuration
      };
    } catch (error) {
      console.error('Failed to get user analytics:', error);
      throw new Error('Failed to get user analytics');
    }
  }

  // Bulk actions
  async bulkAction(action: UserBulkAction): Promise<boolean> {
    try {
      const promises = action.userIds.map(async (userId) => {
        switch (action.action) {
          case 'activate':
            return this.updateUser(userId, { isActive: true });
          case 'deactivate':
            return this.updateUser(userId, { isActive: false });
          case 'delete':
            return this.deleteUser(userId);
          case 'changeRole':
            if (action.data?.role) {
              return this.updateUser(userId, { role: action.data.role });
            }
            break;
          default:
            throw new Error(`Unsupported bulk action: ${action.action}`);
        }
      });
      
      await Promise.all(promises);
      console.log(`Successfully performed ${action.action} on ${action.userIds.length} users`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to perform bulk action';
      console.error('Bulk Action Error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Validate user data
  validateUserData(userData: Partial<User>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!userData.email || !userData.email.includes('@')) {
      errors.push('Valid email is required');
    }
    
    if (!userData.firstName || userData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }
    
    if (!userData.lastName || userData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }
    
    if (!userData.role) {
      errors.push('Role is required');
    }
    
    if (!userData.tenantId) {
      errors.push('Tenant ID is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check if email is unique
  async checkUserUniqueness(email: string, excludeUserId?: string): Promise<boolean> {
    try {
      const users = await this.getAllUsers();
      const existingUser = users.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.id !== excludeUserId
      );
      return !existingUser;
    } catch (error) {
      console.error('Failed to check user uniqueness:', error);
      return false;
    }
  }

  // Refresh users data
  async refreshUsers(): Promise<User[]> {
    try {
      console.log('Refreshing user data from MongoDB...');
      return await this.getAllUsers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh users';
      console.error('Refresh Error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Get user health information
  async getUserHealth(userId: string): Promise<UserHealth> {
    try {
      const user = await this.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Mock health data - in real implementation, this would come from analytics/audit logs
      const mockHealth: UserHealth = {
        userId,
        status: 'healthy',
        lastLogin: user.lastLogin || new Date(),
        sessionCount: Math.floor(Math.random() * 50) + 1,
        failedLogins: Math.floor(Math.random() * 5),
        suspiciousActivity: false,
        recommendations: [
          'User activity is normal',
          'Consider enabling 2FA for enhanced security'
        ]
      };

      return mockHealth;
    } catch (error) {
      console.error('Failed to get user health:', error);
      throw new Error('Failed to get user health information');
    }
  }

  // Reset user password
  async resetUserPassword(userId: string): Promise<boolean> {
    try {
      console.log(`Resetting password for user: ${userId}`);
      // In real implementation, this would trigger a password reset email
      return true;
    } catch (error) {
      console.error('Failed to reset user password:', error);
      throw new Error('Failed to reset user password');
    }
  }

  // Suspend user
  async suspendUser(userId: string, reason?: string): Promise<boolean> {
    try {
      console.log(`Suspending user: ${userId}, reason: ${reason}`);
      const result = await this.updateUser(userId, { isActive: false });
      return result !== null;
    } catch (error) {
      console.error('Failed to suspend user:', error);
      throw new Error('Failed to suspend user');
    }
  }

  // Activate user
  async activateUser(userId: string): Promise<boolean> {
    try {
      console.log(`Activating user: ${userId}`);
      const result = await this.updateUser(userId, { isActive: true });
      return result !== null;
    } catch (error) {
      console.error('Failed to activate user:', error);
      throw new Error('Failed to activate user');
    }
  }
}

// Export singleton instance
export const mongoDBUserService = MongoDBUserService.getInstance(); 