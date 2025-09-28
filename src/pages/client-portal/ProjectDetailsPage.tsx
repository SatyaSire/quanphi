import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, FileText, DollarSign, Camera, Video, Download, MessageSquare, CheckCircle, AlertTriangle, Clock, Play, Filter, Eye, ChevronRight, TrendingUp, PieChart, BarChart3, Bell, Settings, Upload, Edit3 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Milestone {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'on-track' | 'delayed' | 'pending';
  progress: number;
  responsible: string;
  dependencies?: string[];
}

interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail: string;
  title: string;
  uploadDate: string;
  milestone: string;
  description: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  version: string;
  category: 'contract' | 'permit' | 'blueprint' | 'certificate' | 'report';
  isClientVisible: boolean;
}

const ProjectDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState<'timeline' | 'media' | 'documents' | 'expenses'>('timeline');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  // Project data based on projectId
  const projectsData = {
    'PRJ-001': {
      id: 'PRJ-001',
      name: 'Office Complex Renovation',
      client: 'Satya Nadella',
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      status: 'In Progress',
      progress: 75,
      budget: {
        total: 850000,
        spent: 637500,
        remaining: 212500
      },
      workers: {
        total: 35,
        skilled: 18,
        unskilled: 17,
        present: 32
      },
      gradient: 'from-blue-500 to-indigo-600'
    },
    'PRJ-002': {
      id: 'PRJ-002',
      name: 'Warehouse Development',
      client: 'Satya Nadella',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      status: 'In Progress',
      progress: 45,
      budget: {
        total: 1200000,
        spent: 540000,
        remaining: 660000
      },
      workers: {
        total: 52,
        skilled: 25,
        unskilled: 27,
        present: 48
      },
      gradient: 'from-yellow-500 to-orange-600'
    },
    'PRJ-003': {
      id: 'PRJ-003',
      name: 'Residential Complex',
      client: 'Satya Nadella',
      startDate: '2024-03-01',
      endDate: '2024-10-15',
      status: 'Completed',
      progress: 100,
      budget: {
        total: 950000,
        spent: 920000,
        remaining: 30000
      },
      workers: {
        total: 28,
        skilled: 15,
        unskilled: 13,
        present: 0
      },
      gradient: 'from-green-500 to-emerald-600'
    }
  };

  const projectData = projectsData[projectId as keyof typeof projectsData] || projectsData['PRJ-001'];

  const milestones: Milestone[] = [
    {
      id: 'M1',
      title: 'Foundation Complete',
      description: 'Complete foundation work including excavation and concrete pouring',
      startDate: '2024-01-15',
      endDate: '2024-02-28',
      status: 'completed',
      progress: 100,
      responsible: 'Foundation Team',
      dependencies: []
    },
    {
      id: 'M2',
      title: 'Structural Framework',
      description: 'Complete structural steel and concrete framework',
      startDate: '2024-03-01',
      endDate: '2024-05-15',
      status: 'completed',
      progress: 100,
      responsible: 'Structural Team',
      dependencies: ['M1']
    },
    {
      id: 'M3',
      title: 'Electrical Installation',
      description: 'Complete electrical wiring and panel installation',
      startDate: '2024-05-16',
      endDate: '2024-07-30',
      status: 'on-track',
      progress: 85,
      responsible: 'Electrical Team',
      dependencies: ['M2']
    },
    {
      id: 'M4',
      title: 'Plumbing & HVAC',
      description: 'Install plumbing systems and HVAC equipment',
      startDate: '2024-06-01',
      endDate: '2024-08-15',
      status: 'delayed',
      progress: 45,
      responsible: 'MEP Team',
      dependencies: ['M2']
    },
    {
      id: 'M5',
      title: 'Interior Finishing',
      description: 'Complete interior finishing work including flooring and painting',
      startDate: '2024-08-16',
      endDate: '2024-11-30',
      status: 'pending',
      progress: 0,
      responsible: 'Interior Team',
      dependencies: ['M3', 'M4']
    }
  ];

  const mediaItems: MediaItem[] = [
    {
      id: 'IMG1',
      type: 'photo',
      url: '/api/media/foundation-complete.jpg',
      thumbnail: '/api/media/thumbs/foundation-complete.jpg',
      title: 'Foundation Completion',
      uploadDate: '2024-02-28',
      milestone: 'M1',
      description: 'Foundation work completed successfully'
    },
    {
      id: 'VID1',
      type: 'video',
      url: '/api/media/structural-progress.mp4',
      thumbnail: '/api/media/thumbs/structural-progress.jpg',
      title: 'Structural Progress Overview',
      uploadDate: '2024-04-15',
      milestone: 'M2',
      description: 'Drone footage showing structural framework progress'
    },
    {
      id: 'IMG2',
      type: 'photo',
      url: '/api/media/electrical-work.jpg',
      thumbnail: '/api/media/thumbs/electrical-work.jpg',
      title: 'Electrical Installation Progress',
      uploadDate: '2024-07-10',
      milestone: 'M3',
      description: 'Current state of electrical installation'
    }
  ];

  const documents: Document[] = [
    {
      id: 'DOC1',
      name: 'Construction Contract',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-01-10',
      version: '1.2',
      category: 'contract',
      isClientVisible: true
    },
    {
      id: 'DOC2',
      name: 'Building Permit',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-12',
      version: '1.0',
      category: 'permit',
      isClientVisible: true
    },
    {
      id: 'DOC3',
      name: 'Architectural Blueprints',
      type: 'DWG',
      size: '15.2 MB',
      uploadDate: '2024-01-08',
      version: '2.1',
      category: 'blueprint',
      isClientVisible: true
    },
    {
      id: 'DOC4',
      name: 'Foundation Inspection Certificate',
      type: 'PDF',
      size: '0.8 MB',
      uploadDate: '2024-03-01',
      version: '1.0',
      category: 'certificate',
      isClientVisible: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'on-track': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'delayed': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-gray-400" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredMedia = mediaItems.filter(item => 
    mediaFilter === 'all' || item.type === mediaFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/client-portal')}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Projects</span>
          </button>
        </div>

        {/* Header */}
        <div className={`bg-gradient-to-r ${projectData.gradient} rounded-2xl shadow-xl overflow-hidden -mx-8 px-8 pt-8 pb-6 mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{projectData.name}</h1>
                <p className="text-white/90 text-lg">Comprehensive project overview and progress tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
                <Bell className="h-6 w-6 text-white" />
              </button>
              <button className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
                <Download className="h-6 w-6 text-white" />
              </button>
              <button className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
                <MessageSquare className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Overall Progress</p>
                  <p className="text-3xl font-bold text-white">{projectData.progress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-white/70 hover:text-white transition-colors duration-300" />
              </div>
              <div className="mt-3 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${projectData.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Budget Spent</p>
                  <p className="text-2xl font-bold text-white">${(projectData.budget.spent / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-white/70">of ${(projectData.budget.total / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="h-8 w-8 text-white/70 hover:text-white transition-colors duration-300" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Active Workers</p>
                  <p className="text-2xl font-bold text-white">{projectData.workers.present}</p>
                  <p className="text-xs text-white/70">of {projectData.workers.total} total</p>
                </div>
                <Users className="h-8 w-8 text-white/70 hover:text-white transition-colors duration-300" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Project Status</p>
                  <p className="text-xl font-bold text-white">{projectData.status}</p>
                  <p className="text-xs text-white/70">On Schedule</p>
                </div>
                <CheckCircle className="h-8 w-8 text-white/70 hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'timeline', label: 'Progress Timeline', icon: Calendar },
              { id: 'media', label: 'Visual Updates', icon: Camera },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'expenses', label: 'Expense Summary', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Project Timeline & Milestones</h3>
                <p className="text-green-100">Interactive Gantt-style progress tracking</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="relative">
                      {/* Timeline Line */}
                      {index < milestones.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full ${getStatusColor(milestone.status)} flex items-center justify-center relative z-10`}>
                          {getStatusIcon(milestone.status)}
                        </div>
                        
                        <div className="flex-1 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                             onClick={() => setSelectedMilestone(selectedMilestone === milestone.id ? null : milestone.id)}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>Start: {new Date(milestone.startDate).toLocaleDateString()}</span>
                                <span>End: {new Date(milestone.endDate).toLocaleDateString()}</span>
                                <span>Team: {milestone.responsible}</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">{milestone.progress}%</div>
                              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className={`${getStatusColor(milestone.status)} rounded-full h-2 transition-all duration-500`}
                                  style={{ width: `${milestone.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {selectedMilestone === milestone.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Status Details</h5>
                                  <p className="text-sm text-gray-600">Current status: {milestone.status}</p>
                                  <p className="text-sm text-gray-600">Progress: {milestone.progress}%</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Timeline</h5>
                                  <p className="text-sm text-gray-600">Duration: {Math.ceil((new Date(milestone.endDate).getTime() - new Date(milestone.startDate).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                                  <p className="text-sm text-gray-600">Responsible: {milestone.responsible}</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Dependencies</h5>
                                  {milestone.dependencies && milestone.dependencies.length > 0 ? (
                                    <div className="space-y-1">
                                      {milestone.dependencies.map(dep => (
                                        <span key={dep} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                          {milestones.find(m => m.id === dep)?.title || dep}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-600">No dependencies</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Visual Progress Updates</h3>
                    <p className="text-green-100">Photos and videos showing project progress</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select 
                      value={mediaFilter}
                      onChange={(e) => setMediaFilter(e.target.value as any)}
                      className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm backdrop-blur-sm"
                    >
                      <option value="all">All Media</option>
                      <option value="photo">Photos Only</option>
                      <option value="video">Videos Only</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedia.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      <div className="relative aspect-video bg-gray-200">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJIMTc2VjEwNEgxNDRWNzJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNTIgODBIMTY4Vjk2SDE1MlY4MFoiIGZpbGw9IiNGM0Y0RjYiLz4KPC9zdmc+';
                          }}
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-3 group-hover:bg-black/70 transition-all duration-200">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.type === 'video' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                          }`}>
                            {item.type === 'video' ? 'VIDEO' : 'PHOTO'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Uploaded: {new Date(item.uploadDate).toLocaleDateString()}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {milestones.find(m => m.id === item.milestone)?.title || 'General'}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center space-x-2">
                          <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Project Documents</h3>
                <p className="text-green-100">All project-related documents and files</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {documents.filter(doc => doc.isClientVisible).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                          <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{doc.type} • {doc.size}</span>
                            <span>Version {doc.version}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              doc.category === 'contract' ? 'bg-blue-100 text-blue-800' :
                              doc.category === 'permit' ? 'bg-yellow-100 text-yellow-800' :
                              doc.category === 'blueprint' ? 'bg-purple-100 text-purple-800' :
                              doc.category === 'certificate' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-8">
              {/* Budget Overview */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">Budget Overview</h3>
                  <p className="text-green-100">High-level financial summary</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-blue-900">Total Budget</h4>
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-blue-900">${(projectData.budget.total / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-blue-600 mt-1">Approved budget</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-orange-900">Amount Spent</h4>
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                      </div>
                      <p className="text-3xl font-bold text-orange-900">${(projectData.budget.spent / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-orange-600 mt-1">{((projectData.budget.spent / projectData.budget.total) * 100).toFixed(1)}% of budget</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-green-900">Remaining</h4>
                        <PieChart className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-green-900">${(projectData.budget.remaining / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-green-600 mt-1">{((projectData.budget.remaining / projectData.budget.total) * 100).toFixed(1)}% remaining</p>
                    </div>
                  </div>
                  
                  {/* Budget Progress Bar */}
                  <div className="bg-gray-100 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full h-4 transition-all duration-500"
                      style={{ width: `${(projectData.budget.spent / projectData.budget.total) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span className="font-medium">Budget Utilization: {((projectData.budget.spent / projectData.budget.total) * 100).toFixed(1)}%</span>
                    <span>${(projectData.budget.total / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
              
              {/* Expense Breakdown */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Expense Breakdown</h3>
                      <p className="text-green-100">Categorized spending overview</p>
                    </div>
                    <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors duration-200 flex items-center space-x-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>View Detailed Report</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { category: 'Labor', amount: 850000, color: 'bg-blue-500', percentage: 50 },
                      { category: 'Materials', amount: 680000, color: 'bg-green-500', percentage: 40 },
                      { category: 'Equipment', amount: 136000, color: 'bg-yellow-500', percentage: 8 },
                      { category: 'Permits & Licenses', amount: 34000, color: 'bg-purple-500', percentage: 2 }
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.category}</h4>
                            <p className="text-sm text-gray-600">{item.percentage}% of total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${(item.amount / 1000).toFixed(0)}K</p>
                          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`${item.color} rounded-full h-2 transition-all duration-500`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Client Actions Panel */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Quick Actions</h3>
            <p className="text-green-100">Available client actions for this project</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200 group">
                <Edit3 className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-left">
                  <h4 className="font-semibold text-blue-900">Change Request</h4>
                  <p className="text-sm text-blue-600">Request modifications</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-200 group">
                <CheckCircle className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-left">
                  <h4 className="font-semibold text-green-900">Approve Milestone</h4>
                  <p className="text-sm text-green-600">Review & approve</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-200 group">
                <Download className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-left">
                  <h4 className="font-semibold text-purple-900">Download Report</h4>
                  <p className="text-sm text-purple-600">Progress summary</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-200 group">
                <MessageSquare className="h-6 w-6 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-left">
                  <h4 className="font-semibold text-orange-900">Contact PM</h4>
                  <p className="text-sm text-orange-600">Send message</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Project Alerts & Notifications</h3>
            <p className="text-green-100">Important updates and pending actions</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900">Milestone Delay Alert</h4>
                  <p className="text-sm text-red-700 mt-1">Plumbing & HVAC milestone is running 5 days behind schedule. Immediate attention required.</p>
                  <p className="text-xs text-red-600 mt-2">2 hours ago</p>
                </div>
                <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900">Approval Pending</h4>
                  <p className="text-sm text-yellow-700 mt-1">Electrical installation milestone is ready for your approval. Please review and approve.</p>
                  <p className="text-xs text-yellow-600 mt-2">4 hours ago</p>
                </div>
                <button className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <Upload className="h-6 w-6 text-blue-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900">New Document Uploaded</h4>
                  <p className="text-sm text-blue-700 mt-1">Updated architectural blueprints (v2.1) have been uploaded to the document repository.</p>
                  <p className="text-xs text-blue-600 mt-2">1 day ago</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;