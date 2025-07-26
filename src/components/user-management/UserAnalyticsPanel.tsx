import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  UserX,
  Activity,
  BarChart3,
  Calendar,
  Clock,
  Globe
} from 'lucide-react';
import { UserStats, UserAnalytics } from '../../services/UserManagementService';

interface UserAnalyticsPanelProps {
  stats: UserStats;
  analytics: UserAnalytics | null;
  onLoadAnalytics: () => void;
}

const UserAnalyticsPanel: React.FC<UserAnalyticsPanelProps> = ({
  stats,
  analytics,
  onLoadAnalytics
}) => {
  const getGrowthRate = () => {
    if (!analytics || analytics.userGrowth.length < 2) return 0;
    const current = analytics.userGrowth[analytics.userGrowth.length - 1].count;
    const previous = analytics.userGrowth[analytics.userGrowth.length - 2].count;
    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
  };

  const growthRate = getGrowthRate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">User Analytics</h3>
        <button
          onClick={onLoadAnalytics}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <BarChart3 className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 mb-4">User Growth</h4>
          {analytics ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <div className="flex items-center gap-1">
                  {growthRate >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(growthRate).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {analytics.userGrowth.slice(-4).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.date}</span>
                    <span className="text-sm font-medium">{item.count} users</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No analytics data available</p>
          )}
        </div>

        {/* Role Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 mb-4">Role Distribution</h4>
          <div className="space-y-3">
            {stats.usersByRole.map((role, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600 capitalize">
                    {role.role.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-sm font-medium">{role.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Metrics */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 mb-4">Activity Metrics</h4>
          {analytics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.loginTrends[analytics.loginTrends.length - 1]?.logins || 0}
                  </div>
                  <div className="text-xs text-gray-600">Daily Logins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.sessionDuration[analytics.sessionDuration.length - 1]?.averageDuration || 0}
                  </div>
                  <div className="text-xs text-gray-600">Avg Session (min)</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No activity data available</p>
          )}
        </div>

        {/* Top Active Users */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 mb-4">Top Active Users</h4>
          <div className="space-y-2">
            {stats.topActiveUsers.slice(0, 5).map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{user.name}</span>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-600" />
                  <span className="text-sm font-medium">{user.activity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-blue-900">{stats.totalUsers}</div>
          <div className="text-xs text-blue-600">Total Users</div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-green-900">{stats.activeUsers}</div>
          <div className="text-xs text-green-600">Active Users</div>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-lg text-center">
          <UserX className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-yellow-900">{stats.inactiveUsers}</div>
          <div className="text-xs text-yellow-600">Inactive Users</div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-purple-900">{stats.newUsersThisMonth}</div>
          <div className="text-xs text-purple-600">New This Month</div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsPanel; 