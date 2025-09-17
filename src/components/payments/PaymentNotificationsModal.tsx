import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Plus
} from 'lucide-react';

interface PaymentNotification {
  id: string;
  type: 'payment_due' | 'advance_request' | 'payroll_ready' | 'payment_failed' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  workerId?: string;
  workerName?: string;
  amount?: number;
  dueDate?: string;
}

interface NotificationSettings {
  paymentReminders: boolean;
  advanceRequests: boolean;
  payrollAlerts: boolean;
  failedPayments: boolean;
  reminderDays: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface PaymentNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentNotificationsModal: React.FC<PaymentNotificationsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const [notifications, setNotifications] = useState<PaymentNotification[]>([
    {
      id: '1',
      type: 'payment_due',
      title: 'Payment Due Tomorrow',
      message: 'Salary payment for 15 workers is due tomorrow (₹45,000)',
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'high',
      amount: 45000,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      type: 'advance_request',
      title: 'New Advance Request',
      message: 'Rajesh Kumar has requested an advance of ₹5,000',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'medium',
      workerId: 'W001',
      workerName: 'Rajesh Kumar',
      amount: 5000
    },
    {
      id: '3',
      type: 'payroll_ready',
      title: 'Payroll Ready for Processing',
      message: 'Monthly payroll for January 2024 is ready for approval',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'payment_failed',
      title: 'Payment Failed',
      message: 'Bank transfer to Amit Singh failed - insufficient funds',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'high',
      workerId: 'W002',
      workerName: 'Amit Singh',
      amount: 8500
    },
    {
      id: '5',
      type: 'reminder',
      title: 'Weekly Payroll Reminder',
      message: 'Don\'t forget to process weekly payroll by Friday',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'low'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    paymentReminders: true,
    advanceRequests: true,
    payrollAlerts: true,
    failedPayments: true,
    reminderDays: 2,
    emailNotifications: true,
    smsNotifications: false
  });

  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  if (!isOpen) return null;

  const getNotificationIcon = (type: PaymentNotification['type']) => {
    switch (type) {
      case 'payment_due':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'advance_request':
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      case 'payroll_ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'payment_failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'reminder':
        return <Bell className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: PaymentNotification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.isRead;
      case 'high':
        return notif.priority === 'high';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const renderNotifications = () => (
    <div className="space-y-4">
      {/* Filter and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-l-4 cursor-pointer transition-colors ${
                getPriorityColor(notification.priority)
              } ${!notification.isRead ? 'shadow-md' : 'opacity-75'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-medium ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{formatTimestamp(notification.timestamp)}</span>
                      {notification.amount && (
                        <span className="font-medium">
                          {formatCurrency(notification.amount)}
                        </span>
                      )}
                      {notification.workerName && (
                        <span>{notification.workerName}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'paymentReminders', label: 'Payment Due Reminders', description: 'Get notified when payments are due' },
            { key: 'advanceRequests', label: 'Advance Requests', description: 'Notifications for new advance requests' },
            { key: 'payrollAlerts', label: 'Payroll Alerts', description: 'Alerts when payroll is ready for processing' },
            { key: 'failedPayments', label: 'Failed Payments', description: 'Immediate alerts for payment failures' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key as keyof NotificationSettings] as boolean}
                  onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Reminder Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Reminder Days</h4>
              <p className="text-sm text-gray-600">Days before payment due date to send reminders</p>
            </div>
            <select
              value={settings.reminderDays}
              onChange={(e) => setSettings(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 Day</option>
              <option value={2}>2 Days</option>
              <option value={3}>3 Days</option>
              <option value={7}>1 Week</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Methods</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Send notifications via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', description: 'Send critical alerts via SMS' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key as keyof NotificationSettings] as boolean}
                  onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            // Save settings logic would go here
            alert('Settings saved successfully!');
          }}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Payment Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {activeTab === 'notifications' ? renderNotifications() : renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default PaymentNotificationsModal;