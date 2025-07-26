import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Target, 
  Activity,
  Calendar,
  Award
} from 'lucide-react';
import { Group, UserPerformance } from '../../types';

interface GroupChartProps {
  groups: Group[];
  userPerformances: UserPerformance[];
}

type ChartType = 'member-distribution' | 'performance-trends' | 'group-comparison' | 'activity-timeline';

const GroupChart: React.FC<GroupChartProps> = ({ groups, userPerformances }) => {
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('member-distribution');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Calculate chart data
  const memberDistributionData = groups.map(group => ({
    name: group.name,
    members: group.members.length,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  const performanceData = groups.map(group => ({
    name: group.name,
    averageScore: group.performanceMetrics.averageScore,
    completionRate: group.performanceMetrics.completionRate,
    participationRate: group.performanceMetrics.participationRate
  }));

  const groupComparisonData = groups.map(group => ({
    name: group.name,
    totalSessions: group.performanceMetrics.totalSessions,
    totalAssessments: group.performanceMetrics.totalAssessments,
    improvementTrend: group.performanceMetrics.improvementTrend === 'increasing' ? 1 : 
                     group.performanceMetrics.improvementTrend === 'decreasing' ? -1 : 0
  }));

  const activityTimelineData = [
    { month: 'Jan', newGroups: 3, activeGroups: 8, totalMembers: 45 },
    { month: 'Feb', newGroups: 2, activeGroups: 10, totalMembers: 52 },
    { month: 'Mar', newGroups: 4, activeGroups: 12, totalMembers: 68 },
    { month: 'Apr', newGroups: 1, activeGroups: 11, totalMembers: 65 },
    { month: 'May', newGroups: 3, activeGroups: 14, totalMembers: 78 },
    { month: 'Jun', newGroups: 2, activeGroups: 15, totalMembers: 82 }
  ];

  const renderMemberDistributionChart = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Member Distribution</h3>
        <PieChart className="h-5 w-5 text-blue-600" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart Visualization */}
        <div className="relative">
          <div className="w-48 h-48 mx-auto relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {memberDistributionData.map((item, index) => {
                const total = memberDistributionData.reduce((sum, d) => sum + d.members, 0);
                const percentage = (item.members / total) * 100;
                const circumference = 2 * Math.PI * 40;
                const strokeDasharray = (percentage / 100) * circumference;
                const strokeDashoffset = circumference - strokeDasharray;
                
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {memberDistributionData.reduce((sum, d) => sum + d.members, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Members</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {memberDistributionData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.members} members
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformanceTrendsChart = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Trends</h3>
        <TrendingUp className="h-5 w-5 text-green-600" />
      </div>
      
      <div className="space-y-6">
        {performanceData.map((group, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">{group.name}</h4>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Score: {group.averageScore.toFixed(1)}/100
              </span>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                  <span className="text-gray-900 dark:text-white">{group.averageScore.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${group.averageScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                  <span className="text-gray-900 dark:text-white">{group.completionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${group.completionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Participation Rate</span>
                  <span className="text-gray-900 dark:text-white">{group.participationRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${group.participationRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGroupComparisonChart = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Group Comparison</h3>
        <BarChart3 className="h-5 w-5 text-purple-600" />
      </div>
      
      <div className="space-y-6">
        {/* Sessions Comparison */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Total Sessions</h4>
          <div className="space-y-3">
            {groupComparisonData.map((group, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-24 text-sm text-gray-600 dark:text-gray-400">{group.name}</div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(group.totalSessions / Math.max(...groupComparisonData.map(g => g.totalSessions))) * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900 dark:text-white text-right">
                  {group.totalSessions}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Assessments Comparison */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Total Assessments</h4>
          <div className="space-y-3">
            {groupComparisonData.map((group, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-24 text-sm text-gray-600 dark:text-gray-400">{group.name}</div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(group.totalAssessments / Math.max(...groupComparisonData.map(g => g.totalAssessments))) * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900 dark:text-white text-right">
                  {group.totalAssessments}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Improvement Trends */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Improvement Trend</h4>
          <div className="space-y-3">
            {groupComparisonData.map((group, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-24 text-sm text-gray-600 dark:text-gray-400">{group.name}</div>
                <div className="flex-1 flex items-center space-x-2">
                  {group.improvementTrend === 1 && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                  {group.improvementTrend === -1 && (
                    <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
                  )}
                  {group.improvementTrend === 0 && (
                    <Activity className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-900 dark:text-white">
                    {group.improvementTrend === 1 ? 'Increasing' : 
                     group.improvementTrend === -1 ? 'Decreasing' : 'Stable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityTimelineChart = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Timeline</h3>
        <Calendar className="h-5 w-5 text-orange-600" />
      </div>
      
      <div className="space-y-4">
        {activityTimelineData.map((data, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-16 text-sm font-medium text-gray-900 dark:text-white">{data.month}</div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{data.newGroups}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">New Groups</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{data.activeGroups}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Groups</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">{data.totalMembers}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Members</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const chartTypes = [
    { id: 'member-distribution', label: 'Member Distribution', icon: PieChart },
    { id: 'performance-trends', label: 'Performance Trends', icon: TrendingUp },
    { id: 'group-comparison', label: 'Group Comparison', icon: BarChart3 },
    { id: 'activity-timeline', label: 'Activity Timeline', icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-2">
          {chartTypes.map((chartType) => {
            const Icon = chartType.icon;
            return (
              <button
                key={chartType.id}
                onClick={() => setSelectedChartType(chartType.id as ChartType)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedChartType === chartType.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{chartType.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Content */}
      {selectedChartType === 'member-distribution' && renderMemberDistributionChart()}
      {selectedChartType === 'performance-trends' && renderPerformanceTrendsChart()}
      {selectedChartType === 'group-comparison' && renderGroupComparisonChart()}
      {selectedChartType === 'activity-timeline' && renderActivityTimelineChart()}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Groups</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{groups.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Performance</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {groups.length > 0 
                  ? Math.round(groups.reduce((sum, g) => sum + g.performanceMetrics.averageScore, 0) / groups.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Top Performing</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {groups.length > 0 
                  ? groups.reduce((max, g) => g.performanceMetrics.averageScore > max.performanceMetrics.averageScore ? g : max).name
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {groups.reduce((sum, g) => sum + g.members.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChart; 