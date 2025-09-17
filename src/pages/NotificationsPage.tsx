import React, { useState, useMemo } from 'react';
import { ArrowLeft, Bell, BellRing, Check, X, Filter, Search, Calendar, User, DollarSign, AlertTriangle, Info, CheckCircle, Settings, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workersData } from '../data/workersData';

interface Notification {
  id: string;
  type: 'payroll' | 'system' | 'alert' | 'reminder' | 'approval';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  actionRequired?: boolean;
  relatedUser?: string;
  relatedAmount?: number;
}

interface NotificationFilter {
  type: string;
  priority: string;
  status: string;
  category: string;
  dateRange: string;
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<NotificationFilter>({
    type: 'all',
    priority: 'all',
    status: 'all',
    category: 'all',
    dateRange: 'all'
  });
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'NOT001',
      type: 'payroll',
      title: 'Payroll Processing Complete',
      message: 'January 2024 payroll has been processed successfully for 52 employees. Total amount: ₹3,450,000',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      priority: 'high',
      category: 'Payroll',
      relatedAmount: 3450000
    },
    {
      id: 'NOT002',
      type: 'approval',
      title: 'Advance Request Pending',
      message: 'New advance request from Rajesh Kumar for ₹25,000 requires approval',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      priority: 'urgent',
      category: 'Advances',
      actionRequired: true,
      relatedUser: 'Rajesh Kumar',
      relatedAmount: 25000
    },
    {
      id: 'NOT003',
      type: 'alert',
      title: 'Attendance Discrepancy',
      message: '5 employees have attendance discrepancies that may affect payroll calculation',
      timestamp: '2024-01-15T08:45:00Z',
      isRead: true,
      priority: 'medium',
      category: 'Attendance',
      actionRequired: true
    },
    {
      id: 'NOT004',
      type: 'system',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance on January 20, 2024 from 2:00 AM to 4:00 AM IST',
      timestamp: '2024-01-14T16:00:00Z',
      isRead: true,
      priority: 'low',
      category: 'System'
    },
    {
      id: 'NOT005',
      type: 'reminder',
      title: 'Monthly Report Due',
      message: 'Monthly payroll report for December 2023 is due in 3 days',
      timestamp: '2024-01-14T14:30:00Z',
      isRead: false,
      priority: 'medium',
      category: 'Reports',
      actionRequired: true
    },
    {
      id: 'NOT006',
      type: 'payroll',
      title: 'Salary Increment Applied',
      message: 'Annual salary increments have been applied to 15 employees effective January 1, 2024',
      timestamp: '2024-01-14T11:20:00Z',
      isRead: true,
      priority: 'medium',
      category: 'Payroll'
    },
    {
      id: 'NOT007',
      type: 'alert',
      title: 'Budget Threshold Exceeded',
      message: 'Department budget for Engineering has exceeded 90% of allocated amount',
      timestamp: '2024-01-13T15:45:00Z',
      isRead: false,
      priority: 'high',
      category: 'Budget',
      actionRequired: true
    },
    {
      id: 'NOT008',
      type: 'approval',
      title: 'Overtime Approval Required',
      message: '8 overtime requests pending approval for this week',
      timestamp: '2024-01-13T13:10:00Z',
      isRead: true,
      priority: 'medium',
      category: 'Overtime',
      actionRequired: true
    }
  ]);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(notification => notification.type === filters.type);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === filters.priority);
    }

    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'read') {
        filtered = filtered.filter(notification => notification.isRead);
      } else if (filters.status === 'unread') {
        filtered = filtered.filter(notification => !notification.isRead);
      } else if (filters.status === 'action_required') {
        filtered = filtered.filter(notification => notification.actionRequired);
      }
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(notification => notification.category === filters.category);
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notifications, searchTerm, filters]);

  const notificationStats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const actionRequired = notifications.filter(n => n.actionRequired).length;
    const urgent = notifications.filter(n => n.priority === 'urgent').length;
    const high = notifications.filter(n => n.priority === 'high').length;

    return { total, unread, actionRequired, urgent, high };
  }, [notifications]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payroll': return <DollarSign className="h-5 w-5" />;
      case 'system': return <Settings className="h-5 w-5" />;
      case 'alert': return <AlertTriangle className="h-5 w-5" />;
      case 'reminder': return <Calendar className="h-5 w-5" />;
      case 'approval': return <CheckCircle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payroll': return 'bg-green-100 text-green-700';
      case 'system': return 'bg-blue-100 text-blue-700';
      case 'alert': return 'bg-red-100 text-red-700';
      case 'reminder': return 'bg-yellow-100 text-yellow-700';
      case 'approval': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const handleBulkAction = (action: 'read' | 'delete') => {
    if (action === 'read') {
      setNotifications(prev => prev.map(notification => 
        selectedNotifications.includes(notification.id)
          ? { ...notification, isRead: true }
          : notification
      ));
    } else if (action === 'delete') {
      setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)));
    }
    setSelectedNotifications([]);
  };

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const categories = [...new Set(notifications.map(n => n.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/payments')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white shadow-md group-hover:shadow-lg transition-all duration-200">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium">Back to Payments</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-blue-200 text-sm font-medium">Notifications • {new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
                <p className="text-xl text-blue-100">Stay updated with system alerts and important updates</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark All Read</span>
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Notifications</p>
                <p className="text-3xl font-bold text-white">{notificationStats.total}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <Bell className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Unread</p>
                <p className="text-3xl font-bold text-white">{notificationStats.unread}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <BellRing className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Action Required</p>
                <p className="text-3xl font-bold text-white">{notificationStats.actionRequired}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">High Priority</p>
                <p className="text-3xl font-bold text-white">{notificationStats.urgent + notificationStats.high}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="payroll">Payroll</option>
                <option value="system">System</option>
                <option value="alert">Alert</option>
                <option value="reminder">Reminder</option>
                <option value="approval">Approval</option>
              </select>
              
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="action_required">Action Required</option>
              </select>
            </div>
          </div>
          
          {selectedNotifications.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl">
              <span className="text-blue-800 font-medium">
                {selectedNotifications.length} notification(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('read')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Notifications</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleNotificationSelection(notification.id)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  
                  <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-lg font-semibold ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          {notification.actionRequired && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                              Action Required
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                            <span className="capitalize">{notification.priority}</span>
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {notification.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notifications found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;