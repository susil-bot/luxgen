import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2,
  Send,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Mail,
  MessageCircle,
  Hash,
  Smartphone,
  Target,
  TrendingUp,
  Eye,
  Download,
  Settings,
  TestTube,
  Wifi,
  WifiOff,
  Key,
  Globe,
  Shield
} from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'slack';
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  config: ChannelConfig;
  stats: ChannelStats;
  lastTest?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ChannelConfig {
  apiKey?: string;
  apiSecret?: string;
  endpoint?: string;
  webhookUrl?: string;
  senderEmail?: string;
  senderName?: string;
  phoneNumber?: string;
  workspaceId?: string;
  channelId?: string;
  botToken?: string;
  settings: {
    rateLimit: number;
    retryAttempts: number;
    timeout: number;
    enableNotifications: boolean;
  };
}

interface ChannelStats {
  totalSent: number;
  successful: number;
  failed: number;
  successRate: number;
  averageDeliveryTime: number;
  lastSent?: Date;
}

const ChannelManagement: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'Primary Email Service',
      type: 'email',
      status: 'connected',
      config: {
        apiKey: 'sk_test_...',
        senderEmail: 'noreply@luxgen.com',
        senderName: 'LuxGen Notifications',
        settings: {
          rateLimit: 100,
          retryAttempts: 3,
          timeout: 30,
          enableNotifications: true
        }
      },
      stats: {
        totalSent: 1250,
        successful: 1180,
        failed: 70,
        successRate: 94.4,
        averageDeliveryTime: 2.5,
        lastSent: new Date('2024-01-15')
      },
      lastTest: new Date('2024-01-15'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'WhatsApp Business API',
      type: 'whatsapp',
      status: 'connected',
      config: {
        apiKey: 'wa_api_key_...',
        phoneNumber: '+1234567890',
        settings: {
          rateLimit: 50,
          retryAttempts: 2,
          timeout: 60,
          enableNotifications: true
        }
      },
      stats: {
        totalSent: 450,
        successful: 435,
        failed: 15,
        successRate: 96.7,
        averageDeliveryTime: 5.2,
        lastSent: new Date('2024-01-14')
      },
      lastTest: new Date('2024-01-14'),
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-14')
    },
    {
      id: '3',
      name: 'Slack Workspace',
      type: 'slack',
      status: 'connected',
      config: {
        botToken: 'xoxb_...',
        workspaceId: 'T1234567890',
        channelId: 'C1234567890',
        settings: {
          rateLimit: 200,
          retryAttempts: 1,
          timeout: 10,
          enableNotifications: true
        }
      },
      stats: {
        totalSent: 320,
        successful: 320,
        failed: 0,
        successRate: 100,
        averageDeliveryTime: 0.5,
        lastSent: new Date('2024-01-15')
      },
      lastTest: new Date('2024-01-15'),
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '4',
      name: 'SMS Gateway',
      type: 'sms',
      status: 'error',
      config: {
        apiKey: 'sms_api_key_...',
        endpoint: 'https://api.smsgateway.com',
        settings: {
          rateLimit: 25,
          retryAttempts: 3,
          timeout: 45,
          enableNotifications: true
        }
      },
      stats: {
        totalSent: 180,
        successful: 150,
        failed: 30,
        successRate: 83.3,
        averageDeliveryTime: 8.1,
        lastSent: new Date('2024-01-13')
      },
      lastTest: new Date('2024-01-13'),
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-13')
    }
  ]);

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const channelTypes = ['email', 'sms', 'whatsapp', 'slack'];
  const statuses = ['connected', 'disconnected', 'error', 'testing'];

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || channel.status === filterStatus;
    const matchesType = filterType === 'all' || channel.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'disconnected': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'testing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      case 'slack': return <Hash className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      default: return <Share2 className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-600" />;
      case 'disconnected': return <WifiOff className="h-4 w-4 text-gray-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'testing': return <TestTube className="h-4 w-4 text-yellow-600" />;
      default: return <WifiOff className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Channel Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure email, SMS, WhatsApp, and Slack channels
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {channelTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <Filter className="h-4 w-4 inline mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Share2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Channels</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{channels.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Wifi className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connected</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {channels.filter(channel => channel.status === 'connected').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Send className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sent</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {channels.reduce((sum, channel) => sum + channel.stats.totalSent, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Success Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {channels.length > 0 
                  ? Math.round(channels.reduce((sum, channel) => sum + channel.stats.successRate, 0) / channels.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Channels List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notification Channels ({filteredChannels.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredChannels.map((channel) => (
            <div key={channel.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(channel.type)}
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {channel.name}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(channel.status)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(channel.status)}`}>
                        {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Type:</span>
                      <span className="ml-1 text-gray-900 dark:text-white capitalize">{channel.type}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Total Sent:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{channel.stats.totalSent}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Success Rate:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{channel.stats.successRate}%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Avg Delivery:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{channel.stats.averageDeliveryTime}s</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Successful:</span>
                      <span className="ml-1 text-green-600 dark:text-green-400">{channel.stats.successful}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Failed:</span>
                      <span className="ml-1 text-red-600 dark:text-red-400">{channel.stats.failed}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Rate Limit:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{channel.config.settings.rateLimit}/min</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Last Sent:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">
                        {channel.stats.lastSent?.toLocaleDateString() || 'Never'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Configuration Details */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Configuration
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {channel.type === 'email' && (
                        <>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Sender Email:</span>
                            <span className="ml-1 text-gray-900 dark:text-white">{channel.config.senderEmail}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Sender Name:</span>
                            <span className="ml-1 text-gray-900 dark:text-white">{channel.config.senderName}</span>
                          </div>
                        </>
                      )}
                      {channel.type === 'whatsapp' && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Phone Number:</span>
                          <span className="ml-1 text-gray-900 dark:text-white">{channel.config.phoneNumber}</span>
                        </div>
                      )}
                      {channel.type === 'slack' && (
                        <>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Workspace ID:</span>
                            <span className="ml-1 text-gray-900 dark:text-white">{channel.config.workspaceId}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Channel ID:</span>
                            <span className="ml-1 text-gray-900 dark:text-white">{channel.config.channelId}</span>
                          </div>
                        </>
                      )}
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">API Key:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">
                          {channel.config.apiKey ? `${channel.config.apiKey.substring(0, 8)}...` : 'Not set'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <TestTube className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <TestTube className="h-5 w-5" />
            <span>Test All Channels</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
            <span>Bulk Settings</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Download className="h-5 w-5" />
            <span>Export Config</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
            <Shield className="h-5 w-5" />
            <span>Security Check</span>
          </button>
        </div>
      </div>

      {/* Add Channel Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Channel
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Modal content for adding new channels will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Add Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelManagement; 