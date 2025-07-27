import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Video, 
  FileText, 
  Search, 
  BookOpen, 
  Lightbulb, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  User, 
  Settings, 
  Globe, 
  Shield, 
  Zap, 
  Database, 
  Network, 
  Monitor, 
  Server, 
  Cloud, 
  Wifi, 
  WifiOff, 
  Key, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  RotateCcw, 
  Power, 
  PowerOff, 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume, 
  VolumeX, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Image, 
  File, 
  Folder, 
  Download, 
  Upload, 
  Share, 
  Copy, 
  Edit, 
  Trash2, 
  Archive, 
  Archive as ArchiveRestore, 
  Star, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Award, 
  Trophy, 
  Medal, 
  Badge, 
  Award as Certificate, 
  Crown, 
  Diamond, 
  Gem, 
  Sparkles, 
  Rocket, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Cpu, 
  HardDrive, 
  Cpu as Memory, 
  HardDrive as HardDrive2, 
  Database as Database2, 
  Server as Server2, 
  Network as Network2, 
  Wifi as Wifi2, 
  Bluetooth, 
  Bluetooth as BluetoothOff, 
  Signal, 
  Signal as SignalHigh, 
  Signal as SignalMedium, 
  Signal as SignalLow, 
  Signal as SignalZero, 
  Battery, 
  Battery as BatteryCharging, 
  Battery as BatteryFull, 
  Battery as BatteryMedium, 
  Battery as BatteryLow, 
  Battery as BatteryEmpty, 
  Plug, 
  Plug as Plug2, 
  Power as Power2, 
  PowerOff as PowerOff2, 
  Zap as Zap2, 
  Zap as Lightning, 
  Sun, 
  Moon, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  Wind, 
  Umbrella, 
  Droplets, 
  Thermometer, 
  ThermometerSun, 
  ThermometerSnowflake, 
  Gauge, 
  Timer, 
  TimerOff, 
  TimerReset, 
  Calendar,
  CalendarRange,
  CalendarClock,
  CalendarHeart,
  CreditCard,
  Code
} from 'lucide-react';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  tenantId: string;
  userId: string;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
}

interface LiveChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: Date;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

const TenantSupportSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'help' | 'chat' | 'tickets' | 'docs'>('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [articles, setArticles] = useState<HelpArticle[]>([]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: Rocket },
    { id: 'account-management', name: 'Account Management', icon: User },
    { id: 'security', name: 'Security & Privacy', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Zap },
    { id: 'billing', name: 'Billing & Plans', icon: CreditCard },
    { id: 'technical', name: 'Technical Issues', icon: Settings },
    { id: 'api', name: 'API & Development', icon: Code },
  ];

  const helpArticles = [
    {
      id: '1',
      title: 'How to Create Your First Tenant',
      content: 'Step-by-step guide to creating your first tenant in the platform...',
      category: 'getting-started',
      tags: ['tenant', 'setup', 'first-time'],
      views: 1250,
      helpful: 89,
      notHelpful: 3,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Configuring Security Settings',
      content: 'Learn how to configure MFA, password policies, and other security features...',
      category: 'security',
      tags: ['security', 'mfa', 'password'],
      views: 890,
      helpful: 67,
      notHelpful: 2,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      title: 'Setting Up Custom Domains',
      content: 'Complete guide to configuring custom domains for your tenant...',
      category: 'account-management',
      tags: ['domain', 'custom', 'dns'],
      views: 567,
      helpful: 45,
      notHelpful: 1,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
    },
  ];

  const troubleshootingGuides = [
    {
      id: '1',
      title: 'Connection Issues',
      icon: Wifi,
      description: 'Troubleshoot network and connectivity problems',
      steps: [
        'Check your internet connection',
        'Verify firewall settings',
        'Test DNS resolution',
        'Contact your network administrator',
      ],
    },
    {
      id: '2',
      title: 'Authentication Problems',
      icon: Lock,
      description: 'Resolve login and authentication issues',
      steps: [
        'Verify your credentials',
        'Check MFA settings',
        'Clear browser cache',
        'Try incognito mode',
      ],
    },
    {
      id: '3',
      title: 'Performance Issues',
      icon: Activity,
      description: 'Improve system performance and speed',
      steps: [
        'Check system resources',
        'Optimize database queries',
        'Review caching settings',
        'Monitor API usage',
      ],
    },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: LiveChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: LiveChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        message: 'Thank you for your message. An agent will be with you shortly.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <HelpCircle className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Call Support</p>
                    <p className="text-sm text-gray-500">1-800-SUPPORT</p>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-500">support@company.com</p>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <Video className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Schedule Demo</p>
                    <p className="text-sm text-gray-500">Book a call</p>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Troubleshooting</h4>
                <div className="space-y-2">
                  {troubleshootingGuides.map((guide) => (
                    <button
                      key={guide.id}
                      className="w-full text-left p-2 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <guide.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{guide.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'help', label: 'Help Center', icon: BookOpen },
                    { id: 'chat', label: 'Live Chat', icon: MessageCircle },
                    { id: 'tickets', label: 'Support Tickets', icon: FileText },
                    { id: 'docs', label: 'Documentation', icon: FileText },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Help Center Tab */}
                {activeTab === 'help' && (
                  <div className="space-y-6">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search help articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-4 rounded-lg border transition-colors ${
                            selectedCategory === category.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <category.icon className="w-6 h-6 text-gray-600 mb-2" />
                          <p className="text-sm font-medium text-gray-900">{category.name}</p>
                        </button>
                      ))}
                    </div>

                    {/* Articles */}
                    <div className="space-y-4">
                      {filteredArticles.map((article) => (
                        <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-gray-600 mb-3">{article.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{article.views} views</span>
                              <span>{article.helpful} helpful</span>
                              <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 font-medium">
                              Read More
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Chat Tab */}
                {activeTab === 'chat' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                      <p className="text-gray-600">Get instant help from our support team.</p>
                    </div>

                    {/* Chat Messages */}
                    <div className="border border-gray-200 rounded-lg h-96 overflow-y-auto p-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {/* Support Tickets Tab */}
                {activeTab === 'tickets' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                        Create Ticket
                      </button>
                    </div>

                    <div className="space-y-4">
                      {tickets.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No support tickets yet.</p>
                          <button className="mt-2 text-primary-600 hover:text-primary-700 font-medium">
                            Create your first ticket
                          </button>
                        </div>
                      ) : (
                        tickets.map((ticket) => (
                          <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                                ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{ticket.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Created: {ticket.createdAt.toLocaleDateString()}</span>
                              <span>Priority: {ticket.priority}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Documentation Tab */}
                {activeTab === 'docs' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Documentation</h3>
                      <p className="text-blue-700">Comprehensive guides and API documentation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Quick Start Guide</li>
                          <li>• Installation Instructions</li>
                          <li>• First Configuration</li>
                          <li>• Basic Usage</li>
                        </ul>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">API Reference</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Authentication</li>
                          <li>• Endpoints</li>
                          <li>• Request/Response Examples</li>
                          <li>• Error Codes</li>
                        </ul>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Best Practices</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Security Guidelines</li>
                          <li>• Performance Optimization</li>
                          <li>• Data Management</li>
                          <li>• Monitoring & Logging</li>
                        </ul>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Troubleshooting</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Common Issues</li>
                          <li>• Error Resolution</li>
                          <li>• Debugging Tools</li>
                          <li>• Support Resources</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantSupportSystem; 