import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Plus, 
  Send, 
  Sparkles, 
  BookOpen, 
  Users, 
  FileText, 
  Target, 
  Zap, 
  Settings, 
  X, 
  Bot, 
  User,
  Copy,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Search,
  Filter,
  MoreVertical,
  Lightbulb,
  TrendingUp,
  Calendar,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  BarChart3,
  Mic
} from 'lucide-react';
import { useAIChatbot } from '../../contexts/AIChatbotContext';
import { toast } from 'react-hot-toast';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  prompt: string;
  category: 'content' | 'training' | 'communication' | 'analysis';
}

const AIChatbotInterface: React.FC = () => {
  const {
    conversations,
    currentConversation,
    isLoading,
    userNiche,
    startNewConversation,
    sendMessage,
    selectConversation
  } = useAIChatbot();

  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'templates' | 'history'>('chat');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() || !currentConversation) return;

    await sendMessage(message.trim());
    setMessage('');
  };

  const handleNewConversation = () => {
    startNewConversation(userNiche);
    setShowSidebar(false);
    setActiveView('chat');
  };

  const handleQuickAction = async (action: QuickAction) => {
    if (!currentConversation) {
      await startNewConversation(userNiche);
    }
    
    await sendMessage(action.prompt, 'content', {
      contentType: action.category
    });
    
    toast.success(`Started ${action.title.toLowerCase()} assistant`);
  };

  const handleVoiceInput = () => {
    // Voice input functionality
    toast('Voice input coming soon!');
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Message copied to clipboard');
  };

  const handleExportConversation = () => {
    if (!currentConversation) return;
    
    const conversationText = currentConversation.messages
      .map(msg => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${currentConversation.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Conversation exported');
  };

  const quickActions: QuickAction[] = [
    {
      id: 'training-module',
      title: 'Training Module',
      description: 'Create engaging learning content',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-blue-500',
      prompt: `Create a comprehensive training module for ${userNiche} that includes learning objectives, key concepts, practical exercises, and assessment questions. Make it engaging and interactive.`,
      category: 'training'
    },
    {
      id: 'client-followup',
      title: 'Client Follow-up',
      description: 'Build lasting relationships',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-green-500',
      prompt: `Draft a professional follow-up message for a ${userNiche} client that shows value, addresses their needs, and encourages continued engagement.`,
      category: 'communication'
    },
    {
      id: 'content-creation',
      title: 'Content Creation',
      description: 'Generate engaging content',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-purple-500',
      prompt: `Create compelling ${userNiche} content that educates, entertains, and converts. Include a catchy headline, key points, and call-to-action.`,
      category: 'content'
    },
    {
      id: 'assessment-questions',
      title: 'Assessment Questions',
      description: 'Evaluate learning progress',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-orange-500',
      prompt: `Generate 10 assessment questions for ${userNiche} that test understanding, application, and critical thinking skills. Include multiple choice, short answer, and scenario-based questions.`,
      category: 'training'
    },
    {
      id: 'social-media',
      title: 'Social Media',
      description: 'Engage your audience',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-pink-500',
      prompt: `Create 5 social media posts for ${userNiche} that are engaging, informative, and shareable. Include hashtags and call-to-actions.`,
      category: 'content'
    },
    {
      id: 'performance-analysis',
      title: 'Performance Analysis',
      description: 'Analyze training effectiveness',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-indigo-500',
      prompt: `Analyze the effectiveness of ${userNiche} training programs and provide insights on improvement areas, success metrics, and recommendations.`,
      category: 'analysis'
    }
  ];

  const filteredActions = quickActions.filter(action =>
    action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentConversations = conversations.slice(0, 5);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Compact Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {showSidebar && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
              </div>
            )}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {showSidebar ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-2">
          {showSidebar ? (
            <div className="space-y-2">
              <button
                onClick={() => setActiveView('chat')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeView === 'chat' 
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Chat</span>
              </button>
              
              <button
                onClick={() => setActiveView('templates')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeView === 'templates' 
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Templates</span>
              </button>
              
              <button
                onClick={() => setActiveView('history')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeView === 'history' 
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">History</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => setActiveView('chat')}
                className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Chat"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveView('templates')}
                className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Templates"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveView('history')}
                className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="History"
              >
                <Clock className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* New Conversation Button */}
        <div className="p-2">
          <button
            onClick={handleNewConversation}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            {showSidebar && <span className="text-sm font-medium">New Chat</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {activeView === 'chat' && 'AI Assistant'}
                {activeView === 'templates' && 'Quick Templates'}
                {activeView === 'history' && 'Conversation History'}
              </h1>
              {currentConversation && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Active conversation</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {currentConversation && (
                <>
                  <button
                    onClick={handleExportConversation}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Export conversation"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyMessage(currentConversation.messages.map(msg => msg.content).join('\n\n'))}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Copy conversation"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Toggle sidebar"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeView === 'chat' && (
            <div className="h-full flex flex-col">
              {/* Welcome Screen or Chat Messages */}
              {!currentConversation ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="max-w-2xl w-full">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bot className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome to AI Assistant! 🤖
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        I'm here to help you with {userNiche} content creation, training, and client communication.
                      </p>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleQuickAction(action)}
                          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 text-left group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${action.color} text-white`}>
                              {action.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {action.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Search Templates */}
                    <div className="mt-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search templates..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentConversation.messages.map((msg, index) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-3xl rounded-lg p-4 ${
                            msg.role === 'user'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {msg.role === 'assistant' && (
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => handleCopyMessage(msg.content)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    title="Copy message"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="prose prose-sm max-w-none">
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Ask me anything about content creation, training, or client communication..."
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={handleVoiceInput}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Voice input"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          )}

          {activeView === 'templates' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <div
                    key={action.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => handleQuickAction(action)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        {action.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {action.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {action.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {action.category}
                      </span>
                      <Zap className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'history' && (
            <div className="p-6">
              <div className="space-y-4">
                {recentConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {conversation.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {conversation.messages.length} messages
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(conversation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChatbotInterface; 