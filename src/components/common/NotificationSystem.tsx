import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { toast, Toast } from 'react-hot-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X,
  Bell,
  BellOff
} from 'lucide-react';

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  timestamp: Date;
}

export interface NotificationState {
  notifications: Notification[];
  isEnabled: boolean;
  soundEnabled: boolean;
}

// Notification Actions
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'CLEAR_OLD_NOTIFICATIONS' };

// Notification Context
interface NotificationContextType {
  state: NotificationState;
  showSuccess: (title: string, message: string, options?: Partial<Notification>) => void;
  showError: (title: string, message: string, options?: Partial<Notification>) => void;
  showWarning: (title: string, message: string, options?: Partial<Notification>) => void;
  showInfo: (title: string, message: string, options?: Partial<Notification>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  toggleNotifications: () => void;
  toggleSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification Reducer
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50), // Keep max 50 notifications
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        isEnabled: !state.isEnabled,
      };
    case 'TOGGLE_SOUND':
      return {
        ...state,
        soundEnabled: !state.soundEnabled,
      };
    case 'CLEAR_OLD_NOTIFICATIONS':
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.timestamp > oneHourAgo),
      };
    default:
      return state;
  }
};

// Notification Provider
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    isEnabled: true,
    soundEnabled: true,
  });

  // Generate unique ID
  const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Play notification sound
  const playNotificationSound = (type: NotificationType) => {
    if (!state.soundEnabled) return;
    
    // Skip audio in test environment
    if (process.env.NODE_ENV === 'test' || typeof window === 'undefined' || !window.Audio) {
      return;
    }
    
    try {
      // Use Web Audio API to generate simple notification sounds
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set frequency and duration based on notification type
      let frequency = 800;
      let duration = 0.1;
      
      switch (type) {
        case 'success':
          frequency = 1000;
          duration = 0.2;
          break;
        case 'error':
          frequency = 400;
          duration = 0.3;
          break;
        case 'warning':
          frequency = 600;
          duration = 0.15;
          break;
        case 'info':
          frequency = 800;
          duration = 0.1;
          break;
      }
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
    } catch (error) {
      // Silently handle audio errors
      console.log('Notification sound failed:', error);
    }
  };

  // Show notification with toast
  const showNotification = (type: NotificationType, title: string, message: string, options?: Partial<Notification>) => {
    if (!state.isEnabled) return;

    const notification: Notification = {
      id: generateId(),
      type,
      title,
      message,
      duration: options?.duration ?? (type === 'error' ? 8000 : 5000),
      action: options?.action,
      dismissible: options?.dismissible ?? true,
      timestamp: new Date(),
    };

    // Add to state
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    // Play sound
    playNotificationSound(type);

    // Show toast
    const toastOptions = {
      duration: notification.duration,
      position: 'top-right' as const,
      style: {
        background: getNotificationColor(type),
        color: 'white',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    };

    const toastContent = (
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getNotificationIcon(type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-sm opacity-90 mt-1">{message}</p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="text-sm underline mt-2 hover:no-underline transition-all"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        {notification.dismissible && (
          <button
            onClick={() => toast.dismiss()}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );

    toast(toastContent, toastOptions);
  };

  // Notification methods
  const showSuccess = (title: string, message: string, options?: Partial<Notification>) => {
    showNotification('success', title, message, options);
  };

  const showError = (title: string, message: string, options?: Partial<Notification>) => {
    showNotification('error', title, message, options);
  };

  const showWarning = (title: string, message: string, options?: Partial<Notification>) => {
    showNotification('warning', title, message, options);
  };

  const showInfo = (title: string, message: string, options?: Partial<Notification>) => {
    showNotification('info', title, message, options);
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    toast.dismiss();
  };

  const toggleNotifications = () => {
    dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
  };

  const toggleSound = () => {
    dispatch({ type: 'TOGGLE_SOUND' });
  };

  // Clean up old notifications periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'CLEAR_OLD_NOTIFICATIONS' });
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const contextValue: NotificationContextType = {
    state,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAllNotifications,
    toggleNotifications,
    toggleSound,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Helper functions
const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return '#10B981';
    case 'error':
      return '#EF4444';
    case 'warning':
      return '#F59E0B';
    case 'info':
      return '#3B82F6';
    default:
      return '#6B7280';
  }
};

const getNotificationIcon = (type: NotificationType) => {
  const iconClass = 'w-5 h-5';
  switch (type) {
    case 'success':
      return <CheckCircle className={iconClass} />;
    case 'error':
      return <XCircle className={iconClass} />;
    case 'warning':
      return <AlertTriangle className={iconClass} />;
    case 'info':
      return <Info className={iconClass} />;
    default:
      return <Info className={iconClass} />;
  }
};

// Notification Bell Component
export const NotificationBell: React.FC = () => {
  const { state, toggleNotifications, toggleSound } = useNotifications();
  const unreadCount = state.notifications.length;

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        title={state.isEnabled ? 'Disable notifications' : 'Enable notifications'}
      >
        {state.isEnabled ? (
          <Bell className="w-5 h-5" />
        ) : (
          <BellOff className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      <button
        onClick={toggleSound}
        className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        title={state.soundEnabled ? 'Disable sound' : 'Enable sound'}
      >
        {state.soundEnabled ? (
          <div className="w-4 h-4 bg-green-500 rounded-full" />
        ) : (
          <div className="w-4 h-4 bg-gray-400 rounded-full" />
        )}
      </button>
    </div>
  );
};

// Notification List Component
export const NotificationList: React.FC = () => {
  const { state, removeNotification, clearAllNotifications } = useNotifications();

  if (state.notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No notifications</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-medium">Notifications</h3>
        <button
          onClick={clearAllNotifications}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>
      
      {state.notifications.map((notification) => (
        <div
          key={notification.id}
          className="p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {notification.timestamp.toLocaleTimeString()}
              </p>
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 