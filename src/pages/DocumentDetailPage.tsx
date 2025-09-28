import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Eye,
  Share2,
  Edit,
  Trash2,
  Clock,
  User,
  Calendar,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Archive,
  ArrowLeft,
  Building2,
  Users,
  FileIcon,
  Activity,
  History,
  GitCompare,
  ExternalLink
} from 'lucide-react';
import { getDocumentById } from '../data/documentsData';
import { Document } from '../types/documents';

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Helper functions defined before early returns
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'archived':
        return <Archive className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (id) {
      const doc = getDocumentById(id);
      setDocument(doc || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-600 mb-6">The document you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/documents')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/documents"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Link>
          
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{document.name}</h1>
                  <p className="text-gray-600 text-lg">{document.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(document.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(document.status)}`}>
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileIcon className="h-5 w-5 mr-2 text-blue-600" />
                Document Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
                    <p className="text-gray-900 font-medium">{document.name}</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                    <p className="text-gray-900 font-medium">{document.fileType}</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
                    <p className="text-gray-900 font-medium">{formatFileSize(document.fileSize)}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <p className="text-gray-900 font-medium">{document.category.name}</p>
                  </div>
                  
                  {document.subcategory && (
                    <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                      <p className="text-gray-900 font-medium">{document.subcategory}</p>
                    </div>
                  )}
                  
                  {document.accessLevel && (
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                      <p className="text-gray-900 font-medium">{document.accessLevel}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {document.tags && document.tags.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {document.notes && (
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <p className="text-gray-900">{document.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Document Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-600" />
                Document Preview
              </h3>
              
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4 border border-gray-200">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                
                <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
                  <Eye className="h-4 w-4" />
                  <span>View Full</span>
                </button>
                
                <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'details', label: 'Details', icon: FileText },
                { id: 'versions', label: 'Versions', icon: Clock },
                { id: 'activity', label: 'Activity', icon: User }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {/* Actions & Metadata */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Quick Actions
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button className="bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 py-3 px-4 rounded-xl hover:bg-white/90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    
                    <button className="bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 py-3 px-4 rounded-xl hover:bg-white/90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm">
                      <Archive className="h-4 w-4" />
                      <span>Archive</span>
                    </button>
                    
                    <button className="bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 py-3 px-4 rounded-xl hover:bg-white/90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                    
                    <button className="bg-white/80 backdrop-blur-sm border border-white/20 text-red-600 py-3 px-4 rounded-xl hover:bg-red-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Document Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Edit className="h-5 w-5 mr-2 text-blue-600" />
                    Document Actions
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                    {/* Edit Document */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Edit className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Edit Document</h4>
                          <p className="text-sm text-gray-600">Update document details and metadata</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Edit
                        </button>
                      </div>
                    </div>
                    
                    {/* Share Document */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Share2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Share Document</h4>
                          <p className="text-sm text-gray-600">Share with team members or external users</p>
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          Share
                        </button>
                      </div>
                    </div>
                    
                    {/* Archive Document */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Archive className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Archive Document</h4>
                          <p className="text-sm text-gray-600">Move to archive for long-term storage</p>
                        </div>
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                          Archive
                        </button>
                      </div>
                    </div>
                    
                    {/* Delete Document */}
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Delete Document</h4>
                          <p className="text-sm text-gray-600">Permanently remove this document</p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Actions */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-3">Additional Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Duplicate
                      </button>
                      <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Export
                      </button>
                      <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Print
                      </button>
                      <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Convert
                      </button>
                      <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Add to Favorites
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Metadata */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Metadata
                  </h3>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Uploaded By</span>
                      </div>
                      <span className="text-gray-900 font-medium">{document.uploadedBy.name}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Upload Date</span>
                      </div>
                      <span className="text-gray-900 font-medium">{formatDate(document.uploadDate)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Downloads</span>
                      </div>
                      <span className="text-gray-900 font-medium">{document.downloads || 0}</span>
                    </div>
                  </div>
                  
                  {document.expiryDate && (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-700">Expiry Date</span>
                        </div>
                        <span className="text-gray-900 font-medium">{formatDate(document.expiryDate)}</span>
                      </div>
                    </div>
                  )}
                  
                  {document.linkedEntity && (
                    <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-teal-600" />
                          <span className="text-sm font-medium text-gray-700">Linked to</span>
                        </div>
                        <span className="text-gray-900 font-medium">{document.linkedEntity.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'versions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <History className="h-5 w-5 mr-2 text-blue-600" />
                    Version History
                  </h3>
                  {document.versions && document.versions.length > 1 && (
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-lg">
                      Compare All Versions
                    </button>
                  )}
                </div>
                
                {document.versions && document.versions.length > 0 ? (
                  <div className="space-y-4">
                    {document.versions.map((version, index) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                index === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {index === 0 ? 'Current' : `Version ${version.version}`}
                              </span>
                              <span className="text-sm text-gray-500">
                                {(version.fileSize || 0).toFixed(1)} MB
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">{version.fileName}</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Uploaded {formatDate(version.uploadDate)} by {version.uploadedBy.name}
                            </p>
                            {index > 0 && (
                              <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded inline-block">
                                Changes: Updated specifications and layout
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium">
                              <Download className="h-4 w-4 inline mr-1" />
                              Download
                            </button>
                            {index > 0 && (
                              <button className="px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 text-sm font-medium">
                                <GitCompare className="h-4 w-4 inline mr-1" />
                                Compare
                              </button>
                            )}
                            <button className="px-4 py-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all duration-200 text-sm font-medium">
                              <Eye className="h-4 w-4 inline mr-1" />
                              Preview
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No version history available</p>
                  </div>
                )}
                
                {/* Related Documents Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ExternalLink className="h-5 w-5 mr-2 text-indigo-600" />
                    Related Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">PAN Card - Rajesh Kumar</h5>
                          <p className="text-sm text-gray-600">Identity Proof • 1.2 MB</p>
                          <p className="text-xs text-gray-500">Same entity</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Bank Details - Rajesh Kumar</h5>
                          <p className="text-sm text-gray-600">Bank Details • 0.8 MB</p>
                          <p className="text-xs text-gray-500">Same entity</p>
                        </div>
                        <button className="text-green-600 hover:text-green-800">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Audit Log & Activity
                  </h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Activities</option>
                      <option>Access Events</option>
                      <option>Modifications</option>
                      <option>Sharing</option>
                    </select>
                    <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Last 30 days</option>
                      <option>Last 7 days</option>
                      <option>Last 24 hours</option>
                      <option>All time</option>
                    </select>
                  </div>
                </div>
                
                {/* Activity Timeline */}
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-gray-200"></div>
                  
                  <div className="space-y-6">
                    {/* Document Downloaded */}
                    <div className="relative flex items-start space-x-4">
                      <div className="relative z-10 p-2 bg-blue-100 rounded-full border-4 border-white shadow-sm">
                        <Download className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Document Downloaded</h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">2 hours ago</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Downloaded by <span className="font-medium">John Doe</span></p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>IP: 192.168.1.100</span>
                          <span>Device: Chrome on Windows</span>
                          <span>File Size: 2.5 MB</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Document Viewed */}
                    <div className="relative flex items-start space-x-4">
                      <div className="relative z-10 p-2 bg-green-100 rounded-full border-4 border-white shadow-sm">
                        <Eye className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Document Viewed</h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">1 day ago</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Viewed by <span className="font-medium">Jane Smith</span></p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>IP: 192.168.1.105</span>
                          <span>Device: Safari on macOS</span>
                          <span>Duration: 3 minutes</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Document Updated */}
                    <div className="relative flex items-start space-x-4">
                      <div className="relative z-10 p-2 bg-purple-100 rounded-full border-4 border-white shadow-sm">
                        <Edit className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Document Updated</h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">3 days ago</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Updated by <span className="font-medium">Admin User</span></p>
                        <div className="text-xs text-gray-600 mb-2">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Metadata changed</span>
                          <span className="ml-2">Expiry date extended to 2034-01-15</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>IP: 192.168.1.50</span>
                          <span>Device: Chrome on Windows</span>
                          <span>Session ID: sess_abc123</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Document Shared */}
                    <div className="relative flex items-start space-x-4">
                      <div className="relative z-10 p-2 bg-orange-100 rounded-full border-4 border-white shadow-sm">
                        <Share2 className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Document Shared</h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">1 week ago</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Shared by <span className="font-medium">Site Manager</span> with <span className="font-medium">Team Alpha</span></p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Permission: View Only</span>
                          <span>Expires: Never</span>
                          <span>Recipients: 5 users</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Document Created */}
                    <div className="relative flex items-start space-x-4">
                      <div className="relative z-10 p-2 bg-gray-100 rounded-full border-4 border-white shadow-sm">
                        <FileText className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Document Created</h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">2 weeks ago</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Created by <span className="font-medium">Admin User</span></p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Original file: rajesh_aadhaar.pdf</span>
                          <span>Size: 2.5 MB</span>
                          <span>Category: Worker Documents</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Activity Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">Activity Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">5</div>
                      <div className="text-sm text-gray-600">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">2</div>
                      <div className="text-sm text-gray-600">Updates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">1</div>
                      <div className="text-sm text-gray-600">Shares</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;