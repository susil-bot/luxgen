import React, { useState, useEffect } from 'react';
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
  Download,
  Bell,
  BellOff,
  Settings,
  RefreshCw,
  Calendar,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Zap,
  Filter as FilterIcon,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Poll, PollQuestion, PollFeedback, Notification } from '../types/polls';
// Removed useApi import - using new API services
import { apiServices } from '../core/api/ApiService';

const NichePollsPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: '1',
      tenantId: 'tenant1',
      title: 'Leadership Training Effectiveness',
      description: 'Evaluate the impact of our leadership development program',
      niche: 'Leadership Development',
      targetAudience: ['Managers', 'Team Leads', 'Supervisors'],
      questions: [
        {
          id: '1',
          question: 'How would you rate the overall quality of the leadership training?',
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
      recipients: [
        {
          userId: 'user1',
          email: 'john.smith@company.com',
          name: 'John Smith',
          sentAt: new Date('2024-01-15'),
          respondedAt: new Date('2024-01-16')
        },
        {
          userId: 'user2',
          email: 'jane.doe@company.com',
          name: 'Jane Doe',
          sentAt: new Date('2024-01-15'),
          respondedAt: new Date('2024-01-17')
        }
      ],
      responses: [
        {
          id: 'resp1',
          userId: 'user1',
          userName: 'John Smith',
          userEmail: 'john.smith@company.com',
          answers: [
            {
              questionId: '1',
              answer: 5,
              questionText: 'How would you rate the overall quality of the leadership training?'
            },
            {
              questionId: '2',
              answer: 'Communication',
              questionText: 'Which leadership skills did you find most valuable?'
            }
          ],
          completedAt: new Date('2024-01-16'),
          createdAt: new Date('2024-01-16')
        }
      ],
      responseRatePercentage: 71.1,
      createdAt: new Date('2024-01-10'),
      priority: 'high',
      tags: ['leadership', 'training', 'feedback'],
      feedback: [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Smith',
          userEmail: 'john.smith@company.com',
          rating: 5,
          comment: 'Excellent training program! The practical exercises were very helpful.',
          createdAt: new Date('2024-01-16'),
          helpful: 8
        }
      ],
      notifications: [
        {
          id: '1',
          type: 'poll_response',
          title: 'New Response Received',
          message: 'John Smith completed the Leadership Training Effectiveness poll',
          read: false,
          createdAt: new Date('2024-01-16')
        }
      ],
      settings: {
        allowAnonymous: false,
        requireEmail: true,
        autoClose: false
      },
      analytics: {
        totalRecipients: 45,
        totalResponses: 32,
        responseRate: 71.1,
        averageRating: 4.2,
        completionTime: 5.5
      }
    },
    {
      id: '2',
      tenantId: 'tenant1',
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
      recipients: [
        {
          userId: 'user3',
          email: 'mike.johnson@company.com',
          name: 'Mike Johnson',
          sentAt: new Date('2024-01-20')
        }
      ],
      responses: [],
      responseRatePercentage: 0,
      createdAt: new Date('2024-01-20'),
      priority: 'medium',
      tags: ['sales', 'performance', 'assessment'],
      feedback: [],
      notifications: [
        {
          id: '2',
          type: 'schedule_reminder',
          title: 'Poll Scheduled',
          message: 'Sales Team Performance Survey is scheduled for Jan 25, 2024',
          read: true,
          createdAt: new Date('2024-01-20')
        }
      ],
      settings: {
        allowAnonymous: false,
        requireEmail: true,
        autoClose: true,
        closeDate: new Date('2024-01-30')
      },
      analytics: {
        totalRecipients: 28,
        totalResponses: 0,
        responseRate: 0,
        averageRating: 0,
        completionTime: 0
      }
    }
  ]);

  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterNiche, setFilterNiche] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<'polls' | 'notifications' | 'analytics'>('polls');

  const niches = ['Leadership Development', 'Sales Training', 'Technical Skills', 'Soft Skills', 'Compliance'];
  const statuses = ['draft', 'scheduled', 'sent', 'completed'];
  const priorities = ['low', 'medium', 'high'];

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || poll.status === filterStatus;
    const matchesNiche = filterNiche === 'all' || poll.niche === filterNiche;
    const matchesPriority = filterPriority === 'all' || poll.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesNiche && matchesPriority;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'createdAt':
        comparison = (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        break;
      case 'responseRate':
        comparison = (a.responseRatePercentage || 0) - (b.responseRatePercentage || 0);
        break;
      case 'recipients':
        comparison = a.recipients.length - b.recipients.length;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const allNotifications = polls.flatMap(poll => poll.notifications);
  const unreadNotifications = allNotifications.filter(n => !n.read);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'poll_response': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'feedback_received': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'schedule_reminder': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completion_alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Niche Polls & Feedback</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create targeted polls, manage notifications, and gather feedback from your audience
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Bell className="h-6 w-6" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Poll
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'polls', label: 'Polls', icon: BarChart3 },
                { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications.length },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'polls' && (
          <div className="space-y-6">
            {/* Enhanced Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="title">Title</option>
                  <option value="responseRate">Response Rate</option>
                  <option value="recipients">Recipients</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                      {polls.reduce((sum, poll) => sum + poll.recipients.length, 0)}
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
                      {polls.reduce((sum, poll) => sum + poll.responses.length, 0)}
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
                        ? Math.round(polls.reduce((sum, poll) => sum + (poll.responseRatePercentage || 0), 0) / polls.length)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <Bell className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Unread Notifications</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {unreadNotifications.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Polls List */}
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
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(poll.priority)}`}>
                            {poll.priority.charAt(0).toUpperCase() + poll.priority.slice(1)}
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
                            <span>{poll.recipients.length} recipients</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>{poll.responses.length} responses ({poll.responseRatePercentage}%)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{poll.feedback.length} feedback</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          {poll.channels.map((channel) => (
                            <div key={channel} className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              {getChannelIcon(channel)}
                              <span>{channel}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2">
                          {poll.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setShowFeedbackModal(true)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          title="View Feedback"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
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
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications ({allNotifications.length})
                  </h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Mark all as read
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {allNotifications.map((notification) => (
                  <div key={notification.id} className={`p-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {notification.createdAt?.toLocaleDateString() || 'Unknown date'}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Poll Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Analytics dashboard will be implemented here with charts and insights.
              </p>
            </div>
          </div>
        )}

        {/* Create Poll Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create New Poll
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Poll Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter poll title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter poll description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Niche
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {niches.map(niche => (
                        <option key={niche} value={niche}>{niche}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
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

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Poll Feedback
              </h3>
              <div className="space-y-4">
                {polls[0]?.feedback.map((feedback) => (
                  <div key={feedback.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{feedback.userName}</h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{feedback.comment}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{feedback.createdAt?.toLocaleDateString() || 'Unknown date'}</span>
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 hover:text-green-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{feedback.helpful}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-red-600">
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NichePollsPage; 