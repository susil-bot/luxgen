import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, MessageCircle, User, Settings, 
  Home, Users, Briefcase, Bell as BellIcon, 
  ChevronDown, Plus, Globe, Image, Video, FileText,
  MoreHorizontal, ThumbsUp, MessageCircle as CommentIcon, Share2, Send
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import FeedHeader from './FeedHeader';
import FeedSidebar from './FeedSidebar';
import FeedMain from './FeedMain';
import FeedRightSidebar from './FeedRightSidebar';
import FeedMessagingWidget from './FeedMessagingWidget';

interface FeedLayoutProps {
  children?: React.ReactNode;
}

const FeedLayout: React.FC<FeedLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [notifications, setNotifications] = useState(9);
  const [networkRequests, setNetworkRequests] = useState(1);

  return (
    <div className="feed-standalone min-h-screen bg-gray-50">
      {/* Feed Header */}
      <FeedHeader 
        user={user}
        notifications={notifications}
        networkRequests={networkRequests}
      />

      {/* Main Feed Container */}
      <div className="flex max-w-7xl mx-auto pt-16">
        {/* Left Sidebar */}
        <div className="w-80 flex-shrink-0 pr-6">
          <FeedSidebar user={user} />
        </div>

        {/* Main Feed Content */}
        <div className="flex-1 max-w-2xl mx-6">
          <FeedMain />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0 pl-6">
          <FeedRightSidebar />
        </div>
      </div>

      {/* Messaging Widget */}
      <FeedMessagingWidget 
        isOpen={isMessagingOpen}
        onToggle={() => setIsMessagingOpen(!isMessagingOpen)}
      />
    </div>
  );
};

export default FeedLayout;
