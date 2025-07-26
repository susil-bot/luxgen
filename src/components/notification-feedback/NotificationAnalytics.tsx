import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity, 
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  Mail,
  MessageCircle,
  Hash,
  Smartphone,
  Users,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalNotifications: number;
    totalPolls: number;
    totalFeedback: number;
    totalTests: number;
    averageResponseRate: number;
    averageDeliveryTime: number;
    totalRecipients: number;
    totalResponses: number;
  };
  channelPerformance: {
    email: ChannelStats;
    whatsapp: ChannelStats;
    slack: ChannelStats;
    sms: ChannelStats;
  };
  timeSeriesData: {
    date: string;
    notifications: number;
    responses: number;
    polls: number;
    feedback: number;
  }[];
  topPerformers: {
    polls: PollPerformance[];
    feedback: FeedbackPerformance[];
    tests: TestPerformance[];
  };
  responseRates: {
    polls: number;
    feedback: number;
    tests: number;
    notifications: number;
  };
}

interface ChannelStats {
  sent: number;
  delivered: number;
  failed: number;
  successRate: number;
  averageDeliveryTime: number;
  responseRate: number;
}

interface PollPerformance {
  id: string;
  title: string;
  responses: number;
  responseRate: number;
  averageRating: number;
  niche: string;
}

interface FeedbackPerformance {
  id: string;
  title: string;
  responses: number;
  responseRate: number;
  satisfactionScore: number;
  type: string;
}

interface TestPerformance {
  id: string;
  title: string;
  participants: number;
  completionRate: number;
  averageScore: number;
  passRate: number;
}

const NotificationAnalytics: React.FC = () => {
  const [analyticsData] = useState<AnalyticsData>({
    overview: {
      totalNotifications: 2847,
      totalPolls: 156,
      totalFeedback: 89,
      totalTests: 67,
      averageResponseRate: 78.5,
      averageDeliveryTime: 3.2,
      totalRecipients: 12450,
      totalResponses: 9763
    },
    channelPerformance: {
      email: {
        sent: 1450,
        delivered: 1380,
        failed: 70,
        successRate: 95.2,
        averageDeliveryTime: 2.1,
        responseRate: 82.3
      },
      whatsapp: {
        sent: 680,
        delivered: 665,
        failed: 15,
        successRate: 97.8,
        averageDeliveryTime: 5.4,
        responseRate: 91.2
      },
      slack: {
        sent: 420,
        delivered: 420,
        failed: 0,
        successRate: 100,
        averageDeliveryTime: 0.8,
        responseRate: 76.8
      },
      sms: {
        sent: 297,
        delivered: 245,
        failed: 52,
        successRate: 82.5,
        averageDeliveryTime: 8.7,
        responseRate: 45.2
      }
    },
    timeSeriesData: [
      { date: '2024-01-01', notifications: 45, responses: 38, polls: 3, feedback: 2 },
      { date: '2024-01-02', notifications: 52, responses: 44, polls: 4, feedback: 3 },
      { date: '2024-01-03', notifications: 38, responses: 31, polls: 2, feedback: 1 },
      { date: '2024-01-04', notifications: 67, responses: 58, polls: 5, feedback: 4 },
      { date: '2024-01-05', notifications: 73, responses: 65, polls: 6, feedback: 5 },
      { date: '2024-01-06', notifications: 41, responses: 35, polls: 3, feedback: 2 },
      { date: '2024-01-07', notifications: 55, responses: 48, polls: 4, feedback: 3 }
    ],
    topPerformers: {
      polls: [
        {
          id: '1',
          title: 'Leadership Training Effectiveness',
          responses: 45,
          responseRate: 85.7,
          averageRating: 4.3,
          niche: 'Leadership Development'
        },
        {
          id: '2',
          title: 'Sales Team Performance',
          responses: 38,
          responseRate: 79.2,
          averageRating: 4.1,
          niche: 'Sales Training'
        }
      ],
      feedback: [
        {
          id: '1',
          title: 'Course Satisfaction Survey',
          responses: 67,
          responseRate: 92.3,
          satisfactionScore: 88,
          type: 'Course Feedback'
        },
        {
          id: '2',
          title: 'Training Program Evaluation',
          responses: 54,
          responseRate: 87.1,
          satisfactionScore: 85,
          type: 'Training Feedback'
        }
      ],
      tests: [
        {
          id: '1',
          title: 'Leadership Fundamentals Assessment',
          participants: 45,
          completionRate: 93.3,
          averageScore: 78.5,
          passRate: 83.3
        },
        {
          id: '2',
          title: 'Sales Techniques Quiz',
          participants: 38,
          completionRate: 89.5,
          averageScore: 82.1,
          passRate: 86.8
        }
      ]
    },
    responseRates: {
      polls: 82.3,
      feedback: 89.7,
      tests: 91.4,
      notifications: 78.5
    }
  });

  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  const periods = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const channels = [
    { value: 'all', label: 'All Channels' },
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'slack', label: 'Slack' },
    { value: 'sms', label: 'SMS' }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      case 'slack': return <Hash className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      default: return <Send className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View comprehensive analytics and generate reports
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Send className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.overview.totalNotifications.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Recipients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.overview.totalRecipients.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.overview.totalResponses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.overview.averageResponseRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Channel Performance</h3>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {channels.map(channel => (
              <option key={channel.value} value={channel.value}>{channel.label}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(analyticsData.channelPerformance).map(([channel, stats]) => (
            <div key={channel} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                {getChannelIcon(channel)}
                <span className="font-medium text-gray-900 dark:text-white capitalize">{channel}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Sent:</span>
                  <span className="text-gray-900 dark:text-white">{stats.sent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Delivered:</span>
                  <span className="text-gray-900 dark:text-white">{stats.delivered.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                  <span className="text-green-600 dark:text-green-400">{stats.successRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Response Rate:</span>
                  <span className="text-blue-600 dark:text-blue-400">{stats.responseRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Avg Delivery:</span>
                  <span className="text-gray-900 dark:text-white">{stats.averageDeliveryTime}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Rates Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Rates by Type</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.responseRates).map(([type, rate]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {type === 'polls' && <BarChart3 className="h-4 w-4 text-blue-600" />}
                  {type === 'feedback' && <Activity className="h-4 w-4 text-green-600" />}
                  {type === 'tests' && <Target className="h-4 w-4 text-purple-600" />}
                  {type === 'notifications' && <Send className="h-4 w-4 text-orange-600" />}
                  <span className="text-gray-900 dark:text-white capitalize">{type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${rate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Polls</span>
              <span className="text-gray-900 dark:text-white font-medium">{analyticsData.overview.totalPolls}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Feedback Forms</span>
              <span className="text-gray-900 dark:text-white font-medium">{analyticsData.overview.totalFeedback}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Tests</span>
              <span className="text-gray-900 dark:text-white font-medium">{analyticsData.overview.totalTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Average Delivery Time</span>
              <span className="text-gray-900 dark:text-white font-medium">{analyticsData.overview.averageDeliveryTime}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Polls</h3>
          <div className="space-y-4">
            {analyticsData.topPerformers.polls.map((poll) => (
              <div key={poll.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">{poll.title}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Responses:</span>
                    <span className="ml-1 text-gray-900 dark:text-white">{poll.responses}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                    <span className="ml-1 text-blue-600 dark:text-blue-400">{poll.responseRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                    <span className="ml-1 text-yellow-600 dark:text-yellow-400">{poll.averageRating}/5</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Niche:</span>
                    <span className="ml-1 text-gray-900 dark:text-white text-xs">{poll.niche}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Feedback Forms</h3>
          <div className="space-y-4">
            {analyticsData.topPerformers.feedback.map((feedback) => (
              <div key={feedback.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">{feedback.title}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Responses:</span>
                    <span className="ml-1 text-gray-900 dark:text-white">{feedback.responses}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                    <span className="ml-1 text-green-600 dark:text-green-400">{feedback.responseRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Satisfaction:</span>
                    <span className="ml-1 text-purple-600 dark:text-purple-400">{feedback.satisfactionScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="ml-1 text-gray-900 dark:text-white text-xs">{feedback.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Tests</h3>
          <div className="space-y-4">
            {analyticsData.topPerformers.tests.map((test) => (
              <div key={test.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">{test.title}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Participants:</span>
                    <span className="ml-1 text-gray-900 dark:text-white">{test.participants}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Completion:</span>
                    <span className="ml-1 text-blue-600 dark:text-blue-400">{test.completionRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Avg Score:</span>
                    <span className="ml-1 text-green-600 dark:text-green-400">{test.averageScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Pass Rate:</span>
                    <span className="ml-1 text-purple-600 dark:text-purple-400">{test.passRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="h-5 w-5" />
            <span>Export Analytics</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <BarChart3 className="h-5 w-5" />
            <span>Generate Report</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Eye className="h-5 w-5" />
            <span>View Details</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
            <Zap className="h-5 w-5" />
            <span>Real-time Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationAnalytics; 