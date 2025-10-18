import React from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock
} from 'lucide-react';
import ModernDashboardLayout from '../components/layout/ModernDashboardLayout';
import ModernCard from '../components/common/ModernCard';
import ModernButton from '../components/common/ModernButton';
import ResponsiveContainer from '../components/layout/ResponsiveContainer';

const ModernDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '12,345',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Growth Rate',
      value: '23.5%',
      change: '-2%',
      changeType: 'negative' as const,
      icon: TrendingUp,
      color: 'yellow'
    },
    {
      title: 'Active Users',
      value: '8,901',
      change: '+15%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'purple'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'New user registered',
      description: 'John Doe joined the platform',
      time: '2 minutes ago',
      type: 'user'
    },
    {
      id: 2,
      title: 'Payment received',
      description: '$299.00 from Acme Corp',
      time: '1 hour ago',
      type: 'payment'
    },
    {
      id: 3,
      title: 'System update',
      description: 'Version 2.1.0 deployed',
      time: '3 hours ago',
      type: 'system'
    },
    {
      id: 4,
      title: 'New project created',
      description: 'Marketing Campaign 2024',
      time: '5 hours ago',
      type: 'project'
    }
  ];

  const getStatIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      purple: 'text-purple-600 bg-purple-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'payment':
        return <DollarSign className="w-4 h-4" />;
      case 'system':
        return <Activity className="w-4 h-4" />;
      case 'project':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <ModernDashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening with your business."
      actions={
        <ModernButton
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          iconPosition="left"
        >
          New Project
        </ModernButton>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <ModernCard key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${getStatIconColor(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </ModernCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ModernCard
            title="Recent Activity"
            subtitle="Latest updates from your account"
            actions={
              <ModernButton variant="ghost" size="sm">
                View All
              </ModernButton>
            }
          >
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>
        </div>

        {/* Quick Actions */}
        <div>
          <ModernCard
            title="Quick Actions"
            subtitle="Common tasks and shortcuts"
          >
            <div className="space-y-3">
              <ModernButton
                variant="primary"
                fullWidth
                icon={<Plus className="w-4 h-4" />}
                iconPosition="left"
              >
                Create Project
              </ModernButton>
              
              <ModernButton
                variant="secondary"
                fullWidth
                icon={<Users className="w-4 h-4" />}
                iconPosition="left"
              >
                Invite Team
              </ModernButton>
              
              <ModernButton
                variant="secondary"
                fullWidth
                icon={<Calendar className="w-4 h-4" />}
                iconPosition="left"
              >
                Schedule Meeting
              </ModernButton>
              
              <ModernButton
                variant="secondary"
                fullWidth
                icon={<TrendingUp className="w-4 h-4" />}
                iconPosition="left"
              >
                View Analytics
              </ModernButton>
            </div>
          </ModernCard>

          {/* System Status */}
          <ModernCard
            title="System Status"
            subtitle="All systems operational"
            className="mt-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">API Services</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Database</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">CDN</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Email Service</span>
                </div>
                <span className="text-sm text-yellow-600 font-medium">Degraded</span>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>
    </ModernDashboardLayout>
  );
};

export default ModernDashboard;
