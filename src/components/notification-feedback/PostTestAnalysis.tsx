import React, { useState } from 'react';
import { 
  ClipboardCheck, 
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
  BarChart3,
  PieChart,
  Activity,
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react';

interface PostTest {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  testType: 'assessment' | 'quiz' | 'final_exam' | 'certification';
  totalQuestions: number;
  passingScore: number;
  participants: number;
  completed: number;
  passed: number;
  failed: number;
  averageScore: number;
  status: 'active' | 'completed' | 'analyzed';
  results: TestResult[];
  analysis: TestAnalysis;
  createdAt: Date;
  endDate?: Date;
}

interface TestResult {
  id: string;
  userId: string;
  userName: string;
  score: number;
  percentage: number;
  passed: boolean;
  timeTaken: number; // in minutes
  completedAt: Date;
  answers: {
    questionId: string;
    selectedAnswer: string;
    correct: boolean;
  }[];
}

interface TestAnalysis {
  scoreDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  questionAnalysis: {
    questionId: string;
    question: string;
    correctAnswers: number;
    incorrectAnswers: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }[];
  timeAnalysis: {
    averageTime: number;
    fastestTime: number;
    slowestTime: number;
  };
  recommendations: string[];
}

const PostTestAnalysis: React.FC = () => {
  const [tests, setTests] = useState<PostTest[]>([
    {
      id: '1',
      title: 'Leadership Fundamentals Assessment',
      description: 'Comprehensive assessment of leadership fundamentals',
      courseId: 'course1',
      courseName: 'Leadership Fundamentals',
      testType: 'assessment',
      totalQuestions: 50,
      passingScore: 70,
      participants: 45,
      completed: 42,
      passed: 35,
      failed: 7,
      averageScore: 78.5,
      status: 'analyzed',
      results: [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          score: 85,
          percentage: 85,
          passed: true,
          timeTaken: 45,
          completedAt: new Date('2024-01-15'),
          answers: []
        }
      ],
      analysis: {
        scoreDistribution: [
          { range: '90-100', count: 8, percentage: 19 },
          { range: '80-89', count: 12, percentage: 29 },
          { range: '70-79', count: 15, percentage: 36 },
          { range: '60-69', count: 5, percentage: 12 },
          { range: '0-59', count: 2, percentage: 4 }
        ],
        questionAnalysis: [
          {
            questionId: '1',
            question: 'What is the primary role of a leader?',
            correctAnswers: 38,
            incorrectAnswers: 4,
            difficulty: 'easy'
          }
        ],
        timeAnalysis: {
          averageTime: 48,
          fastestTime: 32,
          slowestTime: 75
        },
        recommendations: [
          'Focus on communication skills in future training',
          'Consider additional practice for decision-making scenarios',
          'Review time management strategies'
        ]
      },
      createdAt: new Date('2024-01-10'),
      endDate: new Date('2024-01-20')
    }
  ]);

  const [selectedTest, setSelectedTest] = useState<PostTest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const testTypes = ['assessment', 'quiz', 'final_exam', 'certification'];
  const statuses = ['active', 'completed', 'analyzed'];

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus;
    const matchesType = filterType === 'all' || test.testType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'analyzed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assessment': return <ClipboardCheck className="h-4 w-4" />;
      case 'quiz': return <BookOpen className="h-4 w-4" />;
      case 'final_exam': return <GraduationCap className="h-4 w-4" />;
      case 'certification': return <Award className="h-4 w-4" />;
      default: return <ClipboardCheck className="h-4 w-4" />;
    }
  };

  const getPassRate = (test: PostTest) => {
    return test.completed > 0 ? Math.round((test.passed / test.completed) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post-Test Analysis</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze test results and generate insights
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Test Analysis
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
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
            {testTypes.map(type => (
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
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{tests.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {tests.reduce((sum, test) => sum + test.participants, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Pass Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {tests.length > 0 
                  ? Math.round(tests.reduce((sum, test) => sum + getPassRate(test), 0) / tests.length)
                  : 0}%
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {tests.length > 0 
                  ? Math.round(tests.reduce((sum, test) => sum + test.averageScore, 0) / tests.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Analysis ({filteredTests.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTests.map((test) => (
            <div key={test.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(test.testType)}
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {test.title}
                      </h4>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {test.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Course:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{test.courseName}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Questions:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{test.totalQuestions}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Participants:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{test.participants}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Completed:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{test.completed}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Passed:</span>
                      <span className="ml-1 text-green-600 dark:text-green-400">{test.passed}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Failed:</span>
                      <span className="ml-1 text-red-600 dark:text-red-400">{test.failed}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Pass Rate:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{getPassRate(test)}%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Avg Score:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{test.averageScore.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  {/* Score Distribution Chart */}
                  {test.analysis && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Score Distribution
                      </h5>
                      <div className="flex items-end space-x-2 h-20">
                        {test.analysis.scoreDistribution.map((dist, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-blue-200 dark:bg-blue-800 rounded-t"
                              style={{ height: `${dist.percentage * 0.6}%` }}
                            ></div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {dist.range}
                            </span>
                            <span className="text-xs text-gray-900 dark:text-white">
                              {dist.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Send className="h-4 w-4" />
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
            <BarChart3 className="h-5 w-5" />
            <span>Generate Report</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Send className="h-5 w-5" />
            <span>Send Results</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Download className="h-5 w-5" />
            <span>Export Data</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
            <Activity className="h-5 w-5" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Create Analysis Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create Test Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Modal content for creating test analysis will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Create Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTestAnalysis; 