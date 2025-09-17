import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { toggleNotificationsPane } from '../../app/slices/uiSlice';
import {
  XMarkIcon,
  BellIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Project Assigned',
    message: 'You have been assigned to the "Downtown Office Renovation" project.',
    type: 'info',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    actionUrl: '/projects/1',
    actionText: 'View Project'
  },
  {
    id: '2',
    title: 'Quotation Approved',
    message: 'Your quotation for "Kitchen Remodel - Smith Residence" has been approved.',
    type: 'success',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    actionUrl: '/quotations/2',
    actionText: 'View Quotation'
  },
  {
    id: '3',
    title: 'Payment Overdue',
    message: 'Invoice #INV-2024-001 is 5 days overdue. Please follow up with the client.',
    type: 'warning',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    actionUrl: '/invoices/1',
    actionText: 'View Invoice'
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 11 PM to 1 AM EST.',
    type: 'info',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true
  },
  {
    id: '5',
    title: 'Expense Limit Exceeded',
    message: 'Monthly expense limit has been exceeded by $500. Please review your expenses.',
    type: 'error',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    actionUrl: '/expenses',
    actionText: 'Review Expenses'
  }
];

const NotificationPane: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getNotificationBgColor = (type: Notification['type'], read: boolean) => {
    const baseColor = read ? 'bg-gray-50' : 'bg-white';
    switch (type) {
      case 'success':
        return read ? 'bg-green-50' : 'bg-green-25';
      case 'warning':
        return read ? 'bg-yellow-50' : 'bg-yellow-25';
      case 'error':
        return read ? 'bg-red-50' : 'bg-red-25';
      default:
        return baseColor;
    }
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };
  
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <BellIcon className="h-5 w-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={() => dispatch(toggleNotificationsPane())}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          aria-label="Close notifications"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Actions */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Mark all as read
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-700">
            Clear all
          </button>
        </div>
      </div>
      
      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {mockNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <BellIcon className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                  getNotificationBgColor(notification.type, notification.read)
                } ${
                  !notification.read ? 'border-l-4 border-primary-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        notification.read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className={`mt-1 text-sm ${
                      notification.read ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {formatTimestamp(notification.timestamp)}
                      </div>
                      
                      {notification.actionUrl && notification.actionText && (
                        <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                          {notification.actionText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <button className="w-full text-sm text-center text-primary-600 hover:text-primary-700 font-medium">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationPane;