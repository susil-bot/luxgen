import React, { useState, useRef, useEffect } from 'react';
import { useAIChatbot } from '../../contexts/AIChatbotContext';
import AIChatMessage from './AIChatMessage';
import AIContentGenerator from './AIContentGenerator';
import AIConversationSidebar from './AIConversationSidebar';
import AINicheSelector from './AINicheSelector';

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
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentConversation) return;

    await sendMessage(message.trim());
    setMessage('');
  };

  const handleNewConversation = () => {
    startNewConversation(userNiche);
    setShowContentGenerator(false);
  };

  const handleQuickActions = async (action: string) => {
    if (!currentConversation) return;

    const quickPrompts = {
      'training': 'Create a training module for leadership development',
      'followup': 'Generate a client follow-up message',
      'social': 'Create social media content for LinkedIn',
      'assessment': 'Generate assessment questions for skill evaluation'
    };

    await sendMessage(quickPrompts[action as keyof typeof quickPrompts] || action, 'content', {
      contentType: action
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AIConversationSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={selectConversation}
        onNewConversation={handleNewConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Content Assistant
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentConversation ? currentConversation.title : 'Start a new conversation'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <AINicheSelector />
              
              <button
                onClick={() => setShowContentGenerator(!showContentGenerator)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showContentGenerator
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {showContentGenerator ? 'Hide Generator' : 'Content Generator'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Generator Panel */}
        {showContentGenerator && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <AIContentGenerator />
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentConversation ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Welcome to AI Assistant! 🤖
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  I'm here to help you create content, follow up with clients, and build long-term training relationships. 
                  Let's get started with your {userNiche} journey!
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQuickActions('training')}
                    className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="text-blue-600 dark:text-blue-400 text-lg mb-1">📚</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Training Module</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Create learning content</div>
                  </button>
                  
                  <button
                    onClick={() => handleQuickActions('followup')}
                    className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <div className="text-green-600 dark:text-green-400 text-lg mb-1">📧</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Client Follow-up</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Build relationships</div>
                  </button>
                  
                  <button
                    onClick={() => handleQuickActions('social')}
                    className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <div className="text-purple-600 dark:text-purple-400 text-lg mb-1">📱</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Social Content</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Engage your audience</div>
                  </button>
                  
                  <button
                    onClick={() => handleQuickActions('assessment')}
                    className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-left hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                  >
                    <div className="text-orange-600 dark:text-orange-400 text-lg mb-1">📝</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Assessment</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Evaluate progress</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {currentConversation.messages.map((msg) => (
                <AIChatMessage key={msg.id} message={msg} />
              ))}
              
              {isLoading && (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        {currentConversation && (
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about content creation, client follow-ups, or training..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
              
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatbotInterface; 