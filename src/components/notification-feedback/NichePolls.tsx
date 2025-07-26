import React, { useState } from 'react';
import { 
  BarChart3, 
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
  Download
} from 'lucide-react';

interface Poll {
  id: string;
  title: string;
  description: string;
  niche: string;
  targetAudience: string[];
  questions: PollQuestion[];
  channels: string[];
  status: 'draft' | 'scheduled' | 'sent' | 'completed';
  scheduledDate?: Date;
  sentDate?: Date;
  recipients: number;
  responses: number;
  responseRate: number;
  createdAt: Date;
}

interface PollQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'rating' | 'text' | 'yes_no';
  options?: string[];
  required: boolean;
}

const NichePolls: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: '1',
      title: 'Leadership Training Effectiveness',
      description: 'Gather feedback on leadership training program effectiveness',
      niche: 'Leadership Development',
      targetAudience: ['Managers', 'Team Leads', 'Executives'],
      questions: [
        {
          id: '1',
          question: 'How would you rate the overall effectiveness of the leadership training?',
          type: 'rating',
          required: true
        },
        {
          id: '2',
          question: 'Which leadership skills did you find most valuable?',
          type: 'multiple_choice',
          options: ['Communication', 'Decision Making', 'Team Building', 'Strategic Thinking'],
          required: true
        }
      ],
      channels: ['email', 'slack'],
      status: 'sent',
      sentDate: new Date('2024-01-15'),
      recipients: 45,
      responses: 32,
      responseRate: 71.1,
      createdAt: new Date('2024-01-10')
    },
    {
      id: '2',
      title: 'Sales Team Performance Survey',
      description: 'Assess sales team performance and identify improvement areas',
      niche: 'Sales Training',
      targetAudience: ['Sales Representatives', 'Account Managers'],
      questions: [
        {
          id: '1',
          question: 'How confident are you in your sales techniques?',
          type: 'rating',
          required: true
        }
      ],
      channels: ['whatsapp', 'email'],
      status: 'scheduled',
      scheduledDate: new Date('2024-01-25'),
      recipients: 28,
      responses: 0,
      responseRate: 0,
      createdAt: new Date('2024-01-20')
    }
  ]);

  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterNiche, setFilterNiche] = useState<string>('all');

  const niches = ['Leadership Development', 'Sales Training', 'Technical Skills', 'Soft Skills', 'Compliance'];
  const statuses = ['draft', 'scheduled', 'sent', 'completed'];

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || poll.status === filterStatus;
    const matchesNiche = filterNiche === 'all' || poll.niche === filterNiche;
    
    return matchesSearch && matchesStatus && matchesNiche;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      case 'slack': return <Hash className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Niche Polls</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage targeted polls for specific audiences
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Poll
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search polls..."
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
            value={filterNiche}
            onChange={(e) => setFilterNiche(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Niches</option>
            {niches.map(niche => (
              <option key={niche} value={niche}>{niche}</option>
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
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Polls</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{polls.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Recipients</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {polls.reduce((sum, poll) => sum + poll.recipients, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Responses</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {polls.reduce((sum, poll) => sum + poll.responses, 0)}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {polls.length > 0 
                  ? Math.round(polls.reduce((sum, poll) => sum + poll.responseRate, 0) / polls.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Polls List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Polls ({filteredPolls.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPolls.map((poll) => (
            <div key={poll.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {poll.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(poll.status)}`}>
                      {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {poll.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>{poll.niche}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{poll.recipients} recipients</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>{poll.responses} responses ({poll.responseRate}%)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {poll.channels.map((channel) => (
                      <div key={channel} className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        {getChannelIcon(channel)}
                        <span>{channel}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {poll.status === 'scheduled' && poll.scheduledDate && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Scheduled for {poll.scheduledDate.toLocaleDateString()}</span>
                </div>
              )}
              
              {poll.status === 'sent' && poll.sentDate && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Send className="h-4 w-4" />
                  <span>Sent on {poll.sentDate.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Poll Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Poll
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Modal content for creating new polls will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Create Poll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NichePolls; 