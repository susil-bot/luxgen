import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  UserX,
  Shield,
  Activity,
  BarChart3,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Key,
  Lock,
  Unlock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import { 
  mongoDBUserService, 
  UserStats, 
  UserAnalytics, 
  UserFilter,
  UserBulkAction 
} from '../../services/MongoDBUserService';
import CreateUserModal from './CreateUserModal';
import UserDetailsModal from './UserDetailsModal';
import UserAnalyticsPanel from './UserAnalyticsPanel';

const UserManagementInterface: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0,
    newUsersThisMonth: 0,
    usersByRole: [],
    usersByTenant: [],
    averageUsersPerTenant: 0,
    topActiveUsers: []
  });
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [mongoDBStatus, setMongoDBStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Check if current user has admin privileges
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  useEffect(() => {
    loadUsers();
    loadStats();
    checkMongoDBConnection();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const checkMongoDBConnection = async () => {
    try {
      setMongoDBStatus('checking');
      // Test connection by trying to fetch users
      await mongoDBUserService.getAllUsers();
      setMongoDBStatus('connected');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      setMongoDBStatus('disconnected');
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await mongoDBUserService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const userStats = await mongoDBUserService.getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const userAnalytics = await mongoDBUserService.getUserAnalytics('monthly');
      setAnalytics(userAnalytics);
    } catch (error) {
      console.error('Failed to load user analytics:', error);
    }
  };

  const applyFilters = () => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      await mongoDBUserService.createUser(userData);
      setShowCreateModal(false);
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Failed to create user:', error);
      alert(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDeleteUser = async (user: User) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`);
    if (!confirmed) {
      return;
    }

    try {
      await mongoDBUserService.deleteUser(user.id);
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleBulkAction = async (action: UserBulkAction['action']) => {
    if (selectedUsers.length === 0) {
      alert('Please select users to perform bulk action');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to ${action} ${selectedUsers.length} users?`);
    if (!confirmed) {
      return;
    }

    try {
      const bulkAction: UserBulkAction = {
        userIds: selectedUsers,
        action,
      };

      await mongoDBUserService.bulkAction(bulkAction);
      setSelectedUsers([]);
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
      alert(`Failed to perform bulk action: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'text-red-600 bg-red-100';
      case 'admin': return 'text-blue-600 bg-blue-100';
      case 'trainer': return 'text-green-600 bg-green-100';
      case 'user': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-600" />
    );
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600">
            You need administrator privileges to access user management.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all users and their permissions</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                mongoDBStatus === 'connected' ? 'bg-green-500' : 
                mongoDBStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                MongoDB: {mongoDBStatus === 'connected' ? 'Connected' : 
                         mongoDBStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                setLastRefresh(new Date());
                await loadUsers();
                await loadStats();
                await checkMongoDBConnection();
              } catch (error) {
                console.error('Failed to refresh data:', error);
              }
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
            title="Refresh data from MongoDB"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={handleCreateUser}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create User
          </button>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <UserAnalyticsPanel 
          stats={stats} 
          analytics={analytics} 
          onLoadAnalytics={loadAnalytics}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-green-600">Live from MongoDB</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
              <p className="text-xs text-green-600">Live from MongoDB</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive Users</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactiveUsers}</p>
              <p className="text-xs text-green-600">Live from MongoDB</p>
            </div>
            <UserX className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-purple-600">{stats.newUsersThisMonth}</p>
              <p className="text-xs text-green-600">Live from MongoDB</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg per Tenant</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageUsersPerTenant.toFixed(1)}</p>
              <p className="text-xs text-green-600">Live from MongoDB</p>
            </div>
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="trainer">Trainer</option>
              <option value="user">User</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('activate')}
              disabled={selectedUsers.length === 0}
              className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Unlock className="w-4 h-4" />
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              disabled={selectedUsers.length === 0}
              className="px-3 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Lock className="w-4 h-4" />
              Deactivate
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={selectedUsers.length === 0}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Users ({filteredUsers.length})</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-600">Live MongoDB Data</span>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(user.isActive)}
                      <span className="ml-2 text-sm text-gray-900">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveUser}
      />

      <UserDetailsModal
        user={selectedUser}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default UserManagementInterface; 