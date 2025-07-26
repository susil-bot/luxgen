import React from 'react';
import { 
  Users, BookOpen, Calendar, Award, TrendingUp, 
  ClipboardCheck, Building2, Settings, BarChart3 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${
                trend.isPositive ? '' : 'rotate-180'
              }`} />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { startOnboarding } = useOnboarding();

  const renderSuperAdminDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Overview</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={startOnboarding}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Test Onboarding
          </button>
          <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium px-3 py-1 rounded-full">
            Super Admin
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tenants"
          value="12"
          icon={Building2}
          color="bg-purple-500"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Total Users"
          value="1,247"
          icon={Users}
          color="bg-blue-500"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Programs"
          value="89"
          icon={BookOpen}
          color="bg-green-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="System Health"
          value="99.9%"
          icon={BarChart3}
          color="bg-orange-500"
          trend={{ value: 0.1, isPositive: true }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent System Activities</h3>
        <div className="space-y-3">
          {[
            { action: 'New tenant "TechCorp" registered', time: '2 hours ago', type: 'success' },
            { action: 'System maintenance completed', time: '1 day ago', type: 'info' },
            { action: 'Security update deployed', time: '3 days ago', type: 'warning' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Organization Overview</h2>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
          Admin
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="157"
          icon={Users}
          color="bg-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Training Programs"
          value="23"
          icon={BookOpen}
          color="bg-green-500"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Active Sessions"
          value="8"
          icon={Calendar}
          color="bg-orange-500"
        />
        <StatCard
          title="Completion Rate"
          value="87%"
          icon={Award}
          color="bg-purple-500"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {[
              { action: 'New user John Doe registered', time: '1 hour ago' },
              { action: 'Training session "Leadership Basics" completed', time: '3 hours ago' },
              { action: 'Assessment "Team Management" created', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {[
              { title: 'Leadership Fundamentals', date: 'Today 2:00 PM', participants: 15 },
              { title: 'Team Building Workshop', date: 'Tomorrow 10:00 AM', participants: 12 },
              { title: 'Communication Skills', date: 'Friday 3:00 PM', participants: 8 },
            ].map((session, index) => (
              <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.title}</span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">{session.participants} participants</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{session.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrainerDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Trainer Dashboard</h2>
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium px-3 py-1 rounded-full">
          Trainer
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Programs"
          value="8"
          icon={BookOpen}
          color="bg-green-500"
        />
        <StatCard
          title="Total Students"
          value="156"
          icon={Users}
          color="bg-blue-500"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="This Week Sessions"
          value="12"
          icon={Calendar}
          color="bg-orange-500"
        />
        <StatCard
          title="Avg. Rating"
          value="4.8"
          icon={Award}
          color="bg-purple-500"
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">My Upcoming Sessions</h3>
        <div className="space-y-3">
          {[
            { title: 'Advanced Leadership', date: 'Today 3:00 PM', participants: 15, room: 'Room A' },
            { title: 'Team Dynamics', date: 'Tomorrow 10:00 AM', participants: 12, room: 'Online' },
            { title: 'Conflict Resolution', date: 'Wednesday 2:00 PM', participants: 8, room: 'Room B' },
          ].map((session, index) => (
            <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.title}</span>
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                  {session.participants} enrolled
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{session.date}</span>
                <span>{session.room}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Learning Dashboard</h2>
        <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm font-medium px-3 py-1 rounded-full">
          Learner
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Programs"
          value="5"
          icon={BookOpen}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed Sessions"
          value="12"
          icon={Calendar}
          color="bg-green-500"
          trend={{ value: 25, isPositive: true }}
        />
        <StatCard
          title="Certificates Earned"
          value="3"
          icon={Award}
          color="bg-purple-500"
        />
        <StatCard
          title="Pending Assessments"
          value="2"
          icon={ClipboardCheck}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">My Upcoming Sessions</h3>
          <div className="space-y-3">
            {[
              { title: 'Leadership Fundamentals', date: 'Today 2:00 PM', trainer: 'John Smith' },
              { title: 'Communication Skills', date: 'Tomorrow 10:00 AM', trainer: 'Sarah Johnson' },
              { title: 'Project Management', date: 'Friday 3:00 PM', trainer: 'Mike Wilson' },
            ].map((session, index) => (
              <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.title}</span>
                  <span className="text-xs text-orange-600 dark:text-orange-400">by {session.trainer}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{session.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Learning Progress</h3>
          <div className="space-y-4">
            {[
              { program: 'Leadership Development', progress: 75, completed: 6, total: 8 },
              { program: 'Team Management', progress: 50, completed: 3, total: 6 },
              { program: 'Communication Skills', progress: 90, completed: 9, total: 10 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.program}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.completed}/{item.total} sessions</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case 'super_admin':
      return renderSuperAdminDashboard();
    case 'admin':
      return renderAdminDashboard();
    case 'trainer':
      return renderTrainerDashboard();
    case 'user':
      return renderUserDashboard();
    default:
      return <div>Access denied</div>;
  }
};

export default Dashboard; 