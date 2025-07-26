import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle, MessageSquare, Clock, AlertCircle, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'poll_response' | 'feedback_received' | 'schedule_reminder' | 'completion_alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'poll_response',
      title: 'New Response Received',
      message: 'John Smith completed the Leadership Training Effectiveness poll',
      read: false,
      createdAt: new Date('2024-01-16')
    },
    {
      id: '2',
      type: 'feedback_received',
      title: 'Feedback Received',
      message: 'Sarah Johnson left feedback on Sales Training Program',
      read: false,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '3',
      type: 'schedule_reminder',
      title: 'Poll Scheduled',
      message: 'Sales Team Performance Survey is scheduled for Jan 25, 2024',
      read: true,
      createdAt: new Date('2024-01-14')
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'poll_response': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'feedback_received': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'schedule_reminder': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completion_alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        {unreadCount > 0 ? (
          <Bell className="h-6 w-6" />
        ) : (
          <BellOff className="h-6 w-6" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {displayedNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 5 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {showAll ? 'Show less' : `Show all ${notifications.length} notifications`}
              </button>
            </div>
          )}

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href="/app/notifications/polls"
              className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all notifications
            </a>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell; 