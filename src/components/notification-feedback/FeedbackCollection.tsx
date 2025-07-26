import React, { useState } from 'react';
import { 
  MessageSquare, 
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
  Star,
  ThumbsUp,
  ThumbsDown,
  Heart
} from 'lucide-react';

interface Feedback {
  id: string;
  title: string;
  description: string;
  type: 'course_feedback' | 'training_feedback' | 'general_feedback' | 'satisfaction_survey';
  targetAudience: string[];
  questions: FeedbackQuestion[];
  channels: string[];
  status: 'draft' | 'active' | 'closed' | 'analyzed';
  responses: FeedbackResponse[];
  totalResponses: number;
  averageRating: number;
  satisfactionScore: number;
  createdAt: Date;
  endDate?: Date;
}

interface FeedbackQuestion {
  id: string;
  question: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'yes_no' | 'emoji';
  options?: string[];
  required: boolean;
}

interface FeedbackResponse {
  id: string;
  userId: string;
  userName: string;
  responses: {
    questionId: string;
    answer: string | number;
  }[];
  rating?: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  submittedAt: Date;
}

const FeedbackCollection: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      title: 'Leadership Training Feedback',
      description: 'Collect feedback on the recent leadership training program',
      type: 'training_feedback',
      targetAudience: ['Managers', 'Team Leads'],
      questions: [
        {
          id: '1',
          question: 'How would you rate the overall quality of the training?',
          type: 'rating',
          required: true
        },
        {
          id: '2',
          question: 'What aspects of the training were most valuable?',
          type: 'text',
          required: false
        }
      ],
      channels: ['email', 'slack'],
      status: 'active',
      responses: [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          responses: [
            { questionId: '1', answer: 4 },
            { questionId: '2', answer: 'The practical exercises were very helpful' }
          ],
          rating: 4,
          sentiment: 'positive',
          submittedAt: new Date('2024-01-15')
        }
      ],
      totalResponses: 25,
      averageRating: 4.2,
      satisfactionScore: 85,
      createdAt: new Date('2024-01-10')
    }
  ]);

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const feedbackTypes = ['course_feedback', 'training_feedback', 'general_feedback', 'satisfaction_survey'];
  const statuses = ['draft', 'active', 'closed', 'analyzed'];

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
    const matchesType = filterType === 'all' || feedback.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'closed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'analyzed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course_feedback': return <MessageSquare className="h-4 w-4" />;
      case 'training_feedback': return <Target className="h-4 w-4" />;
      case 'general_feedback': return <MessageSquare className="h-4 w-4" />;
      case 'satisfaction_survey': return <Star className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <ThumbsDown className="h-4 w-4 text-red-600" />;
      case 'neutral': return <Heart className="h-4 w-4 text-gray-600" />;
      default: return <Heart className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback Collection</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gather and analyze user feedback and responses
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Feedback Form
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback forms..."
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
            {feedbackTypes.map(type => (
              <option key={type} value={type}>
                {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Forms</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{feedbacks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Responses</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {feedbacks.reduce((sum, feedback) => sum + feedback.totalResponses, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {feedbacks.length > 0 
                  ? (feedbacks.reduce((sum, feedback) => sum + feedback.averageRating, 0) / feedbacks.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Score</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {feedbacks.length > 0 
                  ? Math.round(feedbacks.reduce((sum, feedback) => sum + feedback.satisfactionScore, 0) / feedbacks.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Forms List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Feedback Forms ({filteredFeedbacks.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(feedback.type)}
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {feedback.title}
                      </h4>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(feedback.status)}`}>
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {feedback.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{feedback.targetAudience.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>{feedback.totalResponses} responses</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{feedback.averageRating.toFixed(1)} avg rating</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {feedback.channels.map((channel) => (
                      <div key={channel} className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        {channel === 'email' && <Mail className="h-4 w-4" />}
                        {channel === 'whatsapp' && <MessageCircle className="h-4 w-4" />}
                        {channel === 'slack' && <Hash className="h-4 w-4" />}
                        {channel === 'sms' && <Smartphone className="h-4 w-4" />}
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
              
              {/* Recent Responses */}
              {feedback.responses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Recent Responses
                  </h5>
                  <div className="space-y-2">
                    {feedback.responses.slice(0, 3).map((response) => (
                      <div key={response.id} className="flex items-center space-x-3 text-sm">
                        <div className="flex items-center space-x-2">
                          {getSentimentIcon(response.sentiment)}
                          <span className="text-gray-900 dark:text-white">{response.userName}</span>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">
                          {response.rating && `${response.rating}/5`}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">
                          {response.submittedAt.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Feedback Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create Feedback Form
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Modal content for creating feedback forms will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Create Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackCollection; 