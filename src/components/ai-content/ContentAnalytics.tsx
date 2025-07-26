import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Download, Filter } from 'lucide-react';

const ContentAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('generation');

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const metrics = [
    { value: 'generation', label: 'Content Generation' },
    { value: 'performance', label: 'Performance' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'efficiency', label: 'Efficiency' }
  ];

  const stats = [
    {
      title: 'Total Content Generated',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Average Generation Time',
      value: '2.3s',
      change: '-8.2%',
      trend: 'down',
      icon: TrendingDown
    },
    {
      title: 'Content Quality Score',
      value: '94.2%',
      change: '+3.1%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'User Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  const contentTypeData = [
    { type: 'Text', count: 456, percentage: 36.6, color: 'bg-blue-500' },
    { type: 'Image', count: 234, percentage: 18.8, color: 'bg-green-500' },
    { type: 'Video', count: 189, percentage: 15.2, color: 'bg-purple-500' },
    { type: 'Audio', count: 123, percentage: 9.9, color: 'bg-orange-500' },
    { type: 'Other', count: 245, percentage: 19.6, color: 'bg-gray-500' }
  ];

  const performanceData = [
    { day: 'Mon', generated: 45, published: 38 },
    { day: 'Tue', generated: 52, published: 44 },
    { day: 'Wed', generated: 38, published: 32 },
    { day: 'Thu', generated: 61, published: 55 },
    { day: 'Fri', generated: 48, published: 41 },
    { day: 'Sat', generated: 35, published: 28 },
    { day: 'Sun', generated: 42, published: 36 }
  ];

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Content Analytics</h2>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last period</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Type Distribution</h3>
              <PieChart className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-3">
              {contentTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{item.count}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Performance</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-3">
              {performanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">{item.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex space-x-1">
                      <div 
                        className="bg-blue-500 rounded-sm"
                        style={{ width: `${(item.generated / 70) * 100}%`, height: '8px' }}
                      ></div>
                      <div 
                        className="bg-green-500 rounded-sm"
                        style={{ width: `${(item.published / 70) * 100}%`, height: '8px' }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.generated}/{item.published}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                <span>Generated</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span>Published</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Content</h3>
            <Filter className="w-5 h-5 text-gray-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Content</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Views</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Engagement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">AI in Modern Business</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Blog Post</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Text
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">2,847</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">94.2%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">92%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Social Media Campaign</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Graphics</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Image
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">1,923</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">87.5%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">87%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Product Launch Video</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Script</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Video
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">1,456</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">82.1%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">82%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalytics; 