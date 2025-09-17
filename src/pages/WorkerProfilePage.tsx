import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Edit3,
  Upload,
  UserX,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  DollarSign,
  Star,
  MessageSquare,
  Clock,
  Briefcase,
  Award,
  AlertTriangle,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { Worker } from '../types/workers';
import { workersData } from '../data/workersData';
import WorkerIDCard from '../components/common/WorkerIDCard';

const WorkerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const foundWorker = workersData.find(w => w.id === id);
    setWorker(foundWorker || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Worker Not Found</h2>
          <p className="text-gray-600 mb-4">The worker you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/workers')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Workers
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    ...(worker.status === 'active' ? [{ id: 'id-card', label: 'ID Card', icon: CreditCard }] : []),
    { id: 'documents', label: 'Documents & Compliance', icon: FileText },
    { id: 'attendance', label: 'Attendance Summary', icon: Clock },
    { id: 'payments', label: 'Payment History', icon: DollarSign },
    { id: 'skills', label: 'Skills & Performance', icon: Star },
    { id: 'notes', label: 'Notes & Comments', icon: MessageSquare }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Date of Birth:</span>
                    <span className="ml-2 text-sm font-medium">{worker.personalInfo.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="ml-2 text-sm font-medium">{worker.personalInfo.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="ml-2 text-sm font-medium">{worker.personalInfo.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Address:</span>
                    <span className="ml-2 text-sm font-medium">
                      {`${worker.personalInfo.address.street}, ${worker.personalInfo.address.city}, ${worker.personalInfo.address.state} ${worker.personalInfo.address.pincode}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-red-600" />
                  Emergency Contact
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="ml-2 text-sm font-medium">{worker.personalInfo.emergencyContact.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Relationship:</span>
                    <span className="ml-2 text-sm font-medium">{worker.personalInfo.emergencyContact.relationship}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="ml-2 text-sm font-medium">{worker.personalInfo.emergencyContact.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                Job Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Role:</span>
                  <span className="ml-2 text-sm font-medium">{worker.jobInfo.role}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Department:</span>
                  <span className="ml-2 text-sm font-medium">{worker.jobInfo.department}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Joining Date:</span>
                  <span className="ml-2 text-sm font-medium">{worker.jobInfo.joiningDate}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'id-card':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee ID Card</h3>
                <p className="text-gray-600">
                  Digital ID card with QR code for attendance tracking. Only available for active workers.
                </p>
              </div>
              
              <div className="flex justify-center">
                <WorkerIDCard 
                  worker={worker}
                  onDownload={() => {
                    // TODO: Implement download functionality
                    console.log('Download ID card for:', worker.id);
                  }}
                  onPrint={() => {
                    // TODO: Implement print functionality
                    window.print();
                  }}
                />
              </div>
              
              <div className="mt-8 bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">QR Code Usage Instructions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• First scan of the day marks attendance as <strong>Login</strong></li>
                  <li>• Second scan of the same day marks attendance as <strong>Logout</strong> (end of shift)</li>
                  <li>• QR code contains worker ID, department, project, and employment status</li>
                  <li>• Data will be used by the Attendance module for tracking and salary calculations</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {worker.documents.map((doc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{doc.type}</span>
                      {doc.expiryDate && new Date(doc.expiryDate) < new Date() && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{doc.fileName}</p>
                    {doc.expiryDate && (
                      <p className="text-xs text-gray-500">Expires: {doc.expiryDate}</p>
                    )}
                    <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">View Document</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Attendance data will be synced from the Attendance module</p>
              <p className="text-sm text-gray-500 mt-2">(Read-only view)</p>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Payment data will be synced from the Workers Payment module</p>
              <p className="text-sm text-gray-500 mt-2">(Read-only view)</p>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((skill, index) => (
                  <span
                    key={skill.id || index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill.name} ({skill.level})
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Rating</h3>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">4.0/5.0</span>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes & Comments</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-700">Excellent performance on the recent project. Recommended for team lead role.</p>
                <p className="text-xs text-gray-500 mt-1">Added by John Doe on Dec 15, 2024</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="text-sm text-gray-700">Completed safety training certification ahead of schedule.</p>
                <p className="text-xs text-gray-500 mt-1">Added by Sarah Smith on Dec 10, 2024</p>
              </div>
            </div>
            <div className="mt-6">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Add a new note..."
              ></textarea>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Note
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/workers')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Workers
          </button>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            {/* Header with responsive button positioning */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Worker Info Section */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                    worker.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 break-words">
                    {worker.personalInfo.firstName} {worker.personalInfo.lastName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
                    <span className="text-base md:text-lg text-gray-600">{worker.jobInfo.role}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {worker.jobInfo.currentProject}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      worker.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons - Right side on large screens, below on small screens */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:flex-shrink-0">
                <button 
                  onClick={() => navigate(`/workers/${worker.id}/edit`)}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm whitespace-nowrap">
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Quick Stats Overview</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-5 border border-green-200 hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-700 group-hover:text-green-800 transition-colors">94%</p>
                  <p className="text-sm font-medium text-green-600">Attendance</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-5 border border-blue-200 hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-700 group-hover:text-blue-800 transition-colors">Dec 1, 2024</p>
                  <p className="text-sm font-medium text-blue-600">Last Payment</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-5 border border-purple-200 hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-700 group-hover:text-purple-800 transition-colors truncate">{worker.jobInfo.currentProject}</p>
                  <p className="text-sm font-medium text-purple-600">Current Project</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-5 border border-orange-200 hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-orange-700 group-hover:text-orange-800 transition-colors">3.5</p>
                  <p className="text-sm font-medium text-orange-600">Years Exp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap px-4 sm:px-6 w-full" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isLongLabel = ['Documents & Compliance', 'Attendance Summary', 'Skills & Performance', 'Notes & Comments'].includes(tab.label);
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm transition-colors min-w-0 flex-1 justify-center ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                      {isLongLabel ? (
                        <div className="text-center leading-tight">
                          <div className="text-xs">{tab.label.split(' ').slice(0, -1).join(' ')}</div>
                          <div className="text-xs">{tab.label.split(' ').slice(-1)[0]}</div>
                        </div>
                      ) : (
                        <span className="hidden sm:inline">{tab.label}</span>
                      )}
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-w-0">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfilePage;