import React, { useState } from 'react';
import { 
  Calendar, 
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
  Play,
  Pause,
  CalendarDays,
  Repeat,
  Zap,
  BarChart3,
  MessageSquare
} from 'lucide-react';

interface NotificationJob {
  id: string;
  title: string;
  description: string;
  type: 'poll' | 'feedback' | 'reminder' | 'announcement' | 'test_results';
  channels: string[];
  targetAudience: string[];
  content: {
    subject?: string;
    message: string;
    template?: string;
  };
  schedule: {
    type: 'immediate' | 'scheduled' | 'recurring';
    date?: Date;
    time?: string;
    frequency?: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    endDate?: Date;
  };
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed';
  recipients: number;
  sent: number;
  failed: number;
  createdAt: Date;
  lastRun?: Date;
  nextRun?: Date;
}

const NotificationScheduler: React.FC = () => {
  const [jobs, setJobs] = useState<NotificationJob[]>([
    {
      id: '1',
      title: 'Weekly Leadership Poll',
      description: 'Send weekly leadership effectiveness poll to managers',
      type: 'poll',
      channels: ['email', 'slack'],
      targetAudience: ['Managers', 'Team Leads'],
      content: {
        subject: 'Weekly Leadership Effectiveness Poll',
        message: 'Please take a moment to complete our weekly leadership effectiveness poll.',
        template: 'leadership_poll_template'
      },
      schedule: {
        type: 'recurring',
        frequency: 'weekly',
        daysOfWeek: [1], // Monday
        time: '09:00',
        endDate: new Date('2024-12-31')
      },
      status: 'running',
      recipients: 45,
      sent: 42,
      failed: 3,
      createdAt: new Date('2024-01-01'),
      lastRun: new Date('2024-01-15'),
      nextRun: new Date('2024-01-22')
    },
    {
      id: '2',
      title: 'Course Completion Reminder',
      description: 'Remind participants about upcoming course deadlines',
      type: 'reminder',
      channels: ['email', 'whatsapp'],
      targetAudience: ['Course Participants'],
      content: {
        subject: 'Course Completion Reminder',
        message: 'Your course deadline is approaching. Please complete the remaining modules.',
        template: 'course_reminder_template'
      },
      schedule: {
        type: 'scheduled',
        date: new Date('2024-01-25'),
        time: '14:00'
      },
      status: 'scheduled',
      recipients: 28,
      sent: 0,
      failed: 0,
      createdAt: new Date('2024-01-20'),
      nextRun: new Date('2024-01-25')
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<NotificationJob | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const jobTypes = ['poll', 'feedback', 'reminder', 'announcement', 'test_results'];
  const statuses = ['draft', 'scheduled', 'running', 'paused', 'completed', 'failed'];
  const channels = ['email', 'sms', 'whatsapp', 'slack'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesType = filterType === 'all' || job.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'running': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'poll': return <BarChart3 className="h-4 w-4" />;
      case 'feedback': return <MessageSquare className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'announcement': return <AlertCircle className="h-4 w-4" />;
      case 'test_results': return <CheckCircle className="h-4 w-4" />;
      default: return <Send className="h-4 w-4" />;
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

  const getScheduleText = (schedule: NotificationJob['schedule']) => {
    if (schedule.type === 'immediate') return 'Send immediately';
    if (schedule.type === 'scheduled') {
      return `Scheduled for ${schedule.date?.toLocaleDateString()} at ${schedule.time}`;
    }
    if (schedule.type === 'recurring') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayNames = schedule.daysOfWeek?.map(d => days[d]).join(', ');
      return `Recurring ${schedule.frequency} on ${dayNames} at ${schedule.time}`;
    }
    return 'No schedule';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Scheduler</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule and manage multi-channel notifications
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Notification
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
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
            {jobTypes.map(type => (
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
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{jobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Play className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Running</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {jobs.filter(job => job.status === 'running').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {jobs.filter(job => job.status === 'scheduled').length}
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
                {jobs.reduce((sum, job) => sum + job.sent, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scheduled Jobs ({filteredJobs.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredJobs.map((job) => (
            <div key={job.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(job.type)}
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {job.title}
                      </h4>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {job.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>{getScheduleText(job.schedule)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{job.recipients} recipients</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Send className="h-4 w-4" />
                      <span>{job.sent} sent, {job.failed} failed</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {job.channels.map((channel) => (
                      <div key={channel} className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        {getChannelIcon(channel)}
                        <span>{channel}</span>
                      </div>
                    ))}
                  </div>
                  
                  {job.nextRun && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Next run: {job.nextRun.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {job.status === 'running' && (
                    <button className="p-2 text-orange-400 hover:text-orange-600">
                      <Pause className="h-4 w-4" />
                    </button>
                  )}
                  {job.status === 'paused' && (
                    <button className="p-2 text-green-400 hover:text-green-600">
                      <Play className="h-4 w-4" />
                    </button>
                  )}
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
            <Zap className="h-5 w-5" />
            <span>Send Now</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Repeat className="h-5 w-5" />
            <span>Create Recurring</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Download className="h-5 w-5" />
            <span>Export Jobs</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
            <Calendar className="h-5 w-5" />
            <span>Bulk Schedule</span>
          </button>
        </div>
      </div>

      {/* Create Job Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Schedule New Notification
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Modal content for scheduling new notifications will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationScheduler; 