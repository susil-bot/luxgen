import {
  TenantUser,
  TenantRole,
  Permission,
  AuditLog,
  QueryOptions
} from '../types/multiTenancy';
import { User } from '../types';
import { multiTenancyManager } from './MultiTenancyManager';

// User Management Interfaces
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

export class UserManagementService {
  private static instance: UserManagementService;

  private constructor() {}

  static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
    }
    return UserManagementService.instance;
  }

  // CRUD Operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> {
    try {
      const newUser: User = {
        ...userData,
        id: `user_${Date.now()}`,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
      };

      // In a real implementation, this would save to database
      // For now, we'll simulate the operation
      return newUser;
    } catch (error) {
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      // In a real implementation, this would update the database
      // For now, we'll simulate the operation
      const mockUser: User = {
        id: userId,
        email: 'user@example.com',
        firstName: 'Updated',
        lastName: 'User',
        role: 'user',
        tenantId: 'tenant-1',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
        ...updates,
      };

      return mockUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      // In a real implementation, this would delete from database
      // For now, we'll simulate the operation
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      // In a real implementation, this would fetch from database
      // For now, we'll simulate the operation
      const mockUser: User = {
        id: userId,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        tenantId: 'tenant-1',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      return mockUser;
    } catch (error) {
      throw new Error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllUsers(filters?: UserFilter, options?: QueryOptions): Promise<User[]> {
    try {
      // In a real implementation, this would fetch from database with filters
      // For now, we'll return mock data
      const mockUsers: User[] = [
        {
          id: 'user_1',
          email: 'superadmin@trainer.com',
          firstName: 'Super',
          lastName: 'Admin',
          role: 'super_admin',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date(),
        },
        {
          id: 'user_2',
          email: 'admin@trainer.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date('2024-01-15'),
          lastLogin: new Date(),
        },
        {
          id: 'user_3',
          email: 'trainer@trainer.com',
          firstName: 'Lead',
          lastName: 'Trainer',
          role: 'trainer',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date('2024-02-01'),
          lastLogin: new Date(),
        },
        {
          id: 'user_4',
          email: 'user@trainer.com',
          firstName: 'Regular',
          lastName: 'User',
          role: 'user',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date('2024-02-15'),
          lastLogin: new Date(),
        },
        {
          id: 'user_5',
          email: 'inactive@trainer.com',
          firstName: 'Inactive',
          lastName: 'User',
          role: 'user',
          tenantId: 'tenant-1',
          isActive: false,
          createdAt: new Date('2024-01-20'),
          lastLogin: new Date('2024-01-25'),
        },
      ];

      // Apply filters
      let filteredUsers = mockUsers;

      if (filters?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters?.status) {
        filteredUsers = filteredUsers.filter(user => 
          filters.status === 'active' ? user.isActive : !user.isActive
        );
      }

      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }

      return filteredUsers;
    } catch (error) {
      throw new Error(`Failed to get users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Role Management
  async getRoles(): Promise<TenantRole[]> {
    try {
      // In a real implementation, this would fetch from database
      const mockRoles: TenantRole[] = [
        {
          id: 'role_1',
          name: 'Super Admin',
          description: 'Full system access and control',
          permissions: [],
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'role_2',
          name: 'Admin',
          description: 'Organization-level management',
          permissions: [],
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'role_3',
          name: 'Trainer',
          description: 'Training content creation and delivery',
          permissions: [],
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'role_4',
          name: 'User',
          description: 'Basic user access',
          permissions: [],
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      return mockRoles;
    } catch (error) {
      throw new Error(`Failed to get roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createRole(roleData: Omit<TenantRole, 'id' | 'createdAt' | 'updatedAt'>): Promise<TenantRole> {
    try {
      const newRole: TenantRole = {
        ...roleData,
        id: `role_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return newRole;
    } catch (error) {
      throw new Error(`Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateRole(roleId: string, updates: Partial<TenantRole>): Promise<TenantRole | null> {
    try {
      // In a real implementation, this would update the database
      const mockRole: TenantRole = {
        id: roleId,
        name: 'Updated Role',
        description: 'Updated description',
        permissions: [],
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...updates,
      };

      return mockRole;
    } catch (error) {
      throw new Error(`Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteRole(roleId: string): Promise<boolean> {
    try {
      // In a real implementation, this would delete from database
      return true;
    } catch (error) {
      throw new Error(`Failed to delete role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Analytics and Statistics
  async getUserStats(): Promise<UserStats> {
    try {
      const users = await this.getAllUsers();
      
      const stats: UserStats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        inactiveUsers: users.filter(u => !u.isActive).length,
        suspendedUsers: 0, // Would be calculated based on status
        newUsersThisMonth: users.filter(u => 
          u.createdAt.getMonth() === new Date().getMonth() &&
          u.createdAt.getFullYear() === new Date().getFullYear()
        ).length,
        usersByRole: [
          { role: 'super_admin', count: users.filter(u => u.role === 'super_admin').length },
          { role: 'admin', count: users.filter(u => u.role === 'admin').length },
          { role: 'trainer', count: users.filter(u => u.role === 'trainer').length },
          { role: 'user', count: users.filter(u => u.role === 'user').length },
        ],
        usersByTenant: [
          { tenantId: 'tenant-1', count: users.length },
        ],
        averageUsersPerTenant: users.length,
        topActiveUsers: users.slice(0, 5).map(u => ({
          userId: u.id,
          name: `${u.firstName} ${u.lastName}`,
          activity: Math.floor(Math.random() * 100),
        })),
      };

      return stats;
    } catch (error) {
      throw new Error(`Failed to get user stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<UserAnalytics> {
    try {
      // In a real implementation, this would calculate from database
      const analytics: UserAnalytics = {
        userGrowth: [
          { date: '2024-01', count: 10 },
          { date: '2024-02', count: 15 },
          { date: '2024-03', count: 20 },
          { date: '2024-04', count: 25 },
        ],
        userActivity: [
          { date: '2024-04-01', activeUsers: 20 },
          { date: '2024-04-02', activeUsers: 22 },
          { date: '2024-04-03', activeUsers: 18 },
          { date: '2024-04-04', activeUsers: 25 },
        ],
        roleDistribution: [
          { role: 'super_admin', percentage: 5 },
          { role: 'admin', percentage: 15 },
          { role: 'trainer', percentage: 30 },
          { role: 'user', percentage: 50 },
        ],
        tenantDistribution: [
          { tenantId: 'tenant-1', percentage: 100 },
        ],
        loginTrends: [
          { date: '2024-04-01', logins: 45 },
          { date: '2024-04-02', logins: 52 },
          { date: '2024-04-03', logins: 38 },
          { date: '2024-04-04', logins: 61 },
        ],
        sessionDuration: [
          { date: '2024-04-01', averageDuration: 25 },
          { date: '2024-04-02', averageDuration: 30 },
          { date: '2024-04-03', averageDuration: 22 },
          { date: '2024-04-04', averageDuration: 35 },
        ],
      };

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get user analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserHealth(userId: string): Promise<UserHealth> {
    try {
      const user = await this.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const health: UserHealth = {
        userId,
        status: user.isActive ? 'healthy' : 'warning',
        lastLogin: user.lastLogin || new Date(),
        sessionCount: Math.floor(Math.random() * 50),
        failedLogins: Math.floor(Math.random() * 5),
        suspiciousActivity: false,
        recommendations: [
          'User is active and healthy',
          'Consider enabling MFA for enhanced security',
        ],
      };

      return health;
    } catch (error) {
      throw new Error(`Failed to get user health: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Bulk Operations
  async bulkAction(action: UserBulkAction): Promise<boolean> {
    try {
      // In a real implementation, this would perform bulk operations
      console.log(`Performing bulk action: ${action.action} on ${action.userIds.length} users`);
      return true;
    } catch (error) {
      throw new Error(`Failed to perform bulk action: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // User Management Utilities
  async resetUserPassword(userId: string): Promise<boolean> {
    try {
      // In a real implementation, this would reset the password
      console.log(`Resetting password for user: ${userId}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to reset password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async suspendUser(userId: string, reason?: string): Promise<boolean> {
    try {
      // In a real implementation, this would suspend the user
      console.log(`Suspending user: ${userId}, reason: ${reason}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to suspend user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async activateUser(userId: string): Promise<boolean> {
    try {
      // In a real implementation, this would activate the user
      console.log(`Activating user: ${userId}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to activate user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserAuditLogs(userId: string, options?: QueryOptions): Promise<AuditLog[]> {
    try {
      // In a real implementation, this would fetch audit logs
      const mockLogs: AuditLog[] = [
        {
          id: 'log_1',
          tenantId: 'tenant-1',
          userId,
          action: 'login',
          resource: 'auth',
          details: { ipAddress: 'unknown', userAgent: 'Mozilla/5.0' },
          ipAddress: 'unknown',
          userAgent: 'Mozilla/5.0',
          timestamp: new Date(),
          severity: 'low',
        },
        {
          id: 'log_2',
          tenantId: 'tenant-1',
          userId,
          action: 'profile_update',
          resource: 'user',
          details: { field: 'email', oldValue: 'old@email.com', newValue: 'new@email.com' },
          ipAddress: 'unknown',
          userAgent: 'Mozilla/5.0',
          timestamp: new Date(),
          severity: 'medium',
        },
      ];

      return mockLogs;
    } catch (error) {
      throw new Error(`Failed to get user audit logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validation Methods
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

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async checkUserUniqueness(email: string, excludeUserId?: string): Promise<boolean> {
    try {
      const users = await this.getAllUsers();
      const existingUser = users.find(u => u.email === email && u.id !== excludeUserId);
      return !existingUser;
    } catch (error) {
      throw new Error(`Failed to check user uniqueness: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const userManagementService = UserManagementService.getInstance(); 