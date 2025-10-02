import React, { useState } from 'react';
import { 
  MessageCircle, MoreHorizontal, Pen, ChevronUp, ChevronDown,
  User, Search, Send, Smile, Paperclip, Phone, Video
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  unread: boolean;
}

interface FeedMessagingWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

const FeedMessagingWidget: React.FC<FeedMessagingWidgetProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      lastMessage: 'Thanks for the connection!',
      timestamp: '2m',
      unread: true,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '2',
      name: 'Mike Chen',
      lastMessage: 'Looking forward to our meeting',
      timestamp: '1h',
      unread: false,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '3',
      name: 'Emily Davis',
      lastMessage: 'Great article you shared!',
      timestamp: '3h',
      unread: false,
      avatar: '/api/placeholder/40/40'
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggle}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="font-medium">Messaging</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold text-gray-900">Messaging</h3>
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
            {conversations.filter(c => c.unread).length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Pen className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-h-80 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
              conversation.unread ? 'bg-blue-50' : ''
            }`}
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {conversation.name}
                </h4>
                <span className="text-xs text-gray-500">{conversation.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
            </div>
            {conversation.unread && (
              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <Video className="w-4 h-4" />
            <span>Video</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <Paperclip className="w-4 h-4" />
            <span>Attach</span>
          </button>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Smile className="w-4 h-4 text-gray-600" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedMessagingWidget;
