import React, { useState, useEffect } from 'react';
import {
  X,
  Edit,
  Trash2,
  User,
  Mail,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Key,
  Lock,
  Unlock,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Settings
} from 'lucide-react';
import { User as UserType } from '../../types';
import { 
  mongoDBUserService, 
  UserHealth 
} from '../../services/MongoDBUserService';
import { useTheme } from '../../contexts/ThemeContext';

interface UserDetailsModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: UserType) => void;
  onDelete: (user: UserType) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'security' | 'settings'>('overview');
  const [userHealth, setUserHealth] = useState<UserHealth | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadUserHealth();
    }
  }, [isOpen, user]);

  const loadUserHealth = async () => {
    if (!user) return;
    
    try {
      setLoadingHealth(true);
      const health = await mongoDBUserService.getUserHealth(user.id);
      setUserHealth(health);
    } catch (error) {
      console.error('Failed to load user health:', error);
    } finally {
      setLoadingHealth(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(`Are you sure you want to reset the password for ${user.firstName} ${user.lastName}?`);
    if (!confirmed) {
      return;
    }

    try {
      await mongoDBUserService.resetUserPassword(user.id);
      alert('Password reset email has been sent to the user.');
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert(`Failed to reset password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSuspendUser = async () => {
    if (!user) return;
    
    const reason = window.prompt('Please provide a reason for suspending this user:');
    if (reason === null) return;

    try {
      await mongoDBUserService.suspendUser(user.id, reason);
      alert('User has been suspended successfully.');
      onClose();
    } catch (error) {
      console.error('Failed to suspend user:', error);
      alert(`Failed to suspend user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleActivateUser = async () => {
    if (!user) return;
    
    try {
      await mongoDBUserService.activateUser(user.id);
      alert('User has been activated successfully.');
      onClose();
    } catch (error) {
      console.error('Failed to activate user:', error);
      alert(`Failed to activate user: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
        theme.colors.background.modal ? `bg-[${theme.colors.background.modal}]` : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme.colors.border.primary ? `border-[${theme.colors.border.primary}]` : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              theme.colors.gray[300] ? `bg-[${theme.colors.gray[300]}]` : 'bg-gray-300'
            }`}>
              <span className={`text-lg font-medium ${
                theme.colors.gray[700] ? `text-[${theme.colors.gray[700]}]` : 'text-gray-700'
              }`}>
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                theme.colors.text.primary ? `text-[${theme.colors.text.primary}]` : 'text-gray-900'
              }`}>
                {user.firstName} {user.lastName}
              </h2>
              <p className={`${
                theme.colors.text.tertiary ? `text-[${theme.colors.text.tertiary}]` : 'text-gray-500'
              }`}>{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(user)}
              className={`p-2 rounded-lg transition-colors ${
                theme.colors.primary[600] ? `text-[${theme.colors.primary[600]}]` : 'text-blue-600'
              } ${
                theme.colors.primary[50] ? `hover:bg-[${theme.colors.primary[50]}]` : 'hover:bg-blue-50'
              }`}
              title="Edit User"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(user)}
              className={`p-2 rounded-lg transition-colors ${
                theme.colors.error[600] ? `text-[${theme.colors.error[600]}]` : 'text-red-600'
              } ${
                theme.colors.error[50] ? `hover:bg-[${theme.colors.error[50]}]` : 'hover:bg-red-50'
              }`}
              title="Delete User"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-b ${
          theme.colors.border.primary ? `border-[${theme.colors.border.primary}]` : 'border-gray-200'
        }`}>
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'activity', label: 'Activity', icon: Activity },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? `${theme.colors.primary[500] ? `border-[${theme.colors.primary[500]}]` : 'border-primary-500'} ${
                        theme.colors.primary[600] ? `text-[${theme.colors.primary[600]}]` : 'text-primary-600'
                      }`
                    : `border-transparent ${
                        theme.colors.text.tertiary ? `text-[${theme.colors.text.tertiary}]` : 'text-gray-500'
                      } hover:${
                        theme.colors.text.secondary ? `text-[${theme.colors.text.secondary}]` : 'text-gray-700'
                      } hover:${
                        theme.colors.border.primary ? `border-[${theme.colors.border.primary}]` : 'border-gray-300'
                      }`
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Role:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(user.isActive)}
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-sm font-medium">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Last Login:</span>
                      <span className="text-sm font-medium">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Tenant:</span>
                      <span className="text-sm font-medium">{user.tenantId}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Health */}
              {userHealth && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Health</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getHealthStatusColor(userHealth.status)}`}>
                        {userHealth.status}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{userHealth.sessionCount}</div>
                      <div className="text-sm text-gray-600">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{userHealth.failedLogins}</div>
                      <div className="text-sm text-gray-600">Failed Logins</div>
                    </div>
                  </div>
                  {userHealth.recommendations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {userHealth.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <p className="text-gray-600">Activity tracking will be implemented here.</p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleResetPassword}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Key className="w-4 h-4" />
                    Reset Password
                  </button>
                  {user.isActive ? (
                    <button
                      onClick={handleSuspendUser}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Lock className="w-4 h-4" />
                      Suspend User
                    </button>
                  ) : (
                    <button
                      onClick={handleActivateUser}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Unlock className="w-4 h-4" />
                      Activate User
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Settings</h3>
                <p className="text-gray-600">User settings configuration will be implemented here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal; 