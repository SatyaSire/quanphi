import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Download, Share2, Trash2, Eye, EyeOff, 
  Calendar, User, Building, Tag, FileText, Clock, Shield,
  AlertCircle, CheckCircle, XCircle, MoreVertical, Copy,
  ExternalLink, History, Lock, Unlock
} from 'lucide-react';
import { Document } from '../types/documents';
import { getDocumentById } from '../data/documentsData';

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVersions, setShowVersions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<'preview' | 'fullscreen'>('preview');
  const [shareLink, setShareLink] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('7');
  const [allowDownload, setAllowDownload] = useState(true);

  useEffect(() => {
    if (id) {
      const doc = getDocumentById(id);
      setDocument(doc);
      setLoading(false);
    }
  }, [id]);

  const handleDownload = () => {
    // Simulate download
    console.log('Downloading document:', document?.title);
  };

  const handleEdit = () => {
    navigate(`/documents/${id}/edit`);
  };

  const handleDelete = () => {
    // Simulate delete
    console.log('Deleting document:', document?.title);
    setShowDeleteModal(false);
    navigate('/documents');
  };

  const generateShareLink = () => {
    const link = `${window.location.origin}/shared/documents/${id}?token=${Math.random().toString(36).substr(2, 16)}`;
    setShareLink(link);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'expired': return 'text-red-400 bg-red-500/20';
      case 'expiring_soon': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'expired': return XCircle;
      case 'expiring_soon': return AlertCircle;
      default: return Clock;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Document Not Found</h2>
          <p className="text-white/60 mb-4">The document you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/documents')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(document.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/documents')}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Documents</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              
              <div className="relative">
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              {/* Preview Header */}
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Document Preview</span>
                </h2>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewMode(previewMode === 'preview' ? 'fullscreen' : 'preview')}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title={previewMode === 'preview' ? 'Fullscreen' : 'Exit Fullscreen'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  
                  {document.allowDownload && (
                    <button
                      onClick={handleDownload}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Preview Content */}
              <div className="p-6">
                {document.fileType === 'pdf' ? (
                  <div className="bg-white rounded-lg p-8 min-h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">PDF Preview</p>
                      <p className="text-gray-500 text-sm mt-1">{document.title}</p>
                      <button
                        onClick={handleDownload}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download to View</span>
                      </button>
                    </div>
                  </div>
                ) : document.fileType.startsWith('image/') ? (
                  <div className="bg-white rounded-lg p-4">
                    <img
                      src={`/api/documents/${document.id}/preview`}
                      alt={document.title}
                      className="w-full h-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE2MCAyMTBIMjQwTDIwMCAxNTBaIiBmaWxsPSIjOUI5QkEzIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiM5QjlCQTMiLz4KPC9zdmc+';
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Document Preview Not Available</p>
                      <p className="text-gray-500 text-sm mt-1">File type: {document.fileType}</p>
                      <button
                        onClick={handleDownload}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download File</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-white mb-2">{document.title}</h1>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span className="capitalize">{document.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                {document.isConfidential && (
                  <div className="flex items-center space-x-1 text-red-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs font-medium">Confidential</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Tag className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">Category:</span>
                  <span className="text-white font-medium capitalize">{document.category}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">Type:</span>
                  <span className="text-white font-medium capitalize">{document.type.replace('_', ' ')}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">Uploaded:</span>
                  <span className="text-white font-medium">{new Date(document.uploadedAt).toLocaleDateString()}</span>
                </div>
                
                {document.expiryDate && (
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm">Expires:</span>
                    <span className="text-white font-medium">{new Date(document.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">Uploaded by:</span>
                  <span className="text-white font-medium">{document.uploadedBy?.name || 'Unknown'}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">Size:</span>
                  <span className="text-white font-medium">{formatFileSize(document.fileSize)}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Tags</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Information */}
            {document.linkedEntity && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Related Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {document.linkedEntity.type === 'worker' ? (
                      <User className="w-4 h-4 text-white/60" />
                    ) : document.linkedEntity.type === 'project' ? (
                      <Building className="w-4 h-4 text-white/60" />
                    ) : (
                      <User className="w-4 h-4 text-white/60" />
                    )}
                    <span className="text-white/80 text-sm">
                      {document.linkedEntity.type === 'worker' ? 'Worker:' : 
                       document.linkedEntity.type === 'project' ? 'Project:' : 
                       'Client:'}
                    </span>
                    <span className="text-white font-medium">{document.linkedEntity.name}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Description & Notes */}
            {(document.description || document.notes) && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Description & Notes</h3>
                <div className="space-y-4">
                  {document.description && (
                    <div>
                      <h4 className="text-white/80 text-sm font-medium mb-2">Description</h4>
                      <p className="text-white/70 text-sm leading-relaxed">{document.description}</p>
                    </div>
                  )}
                  
                  {document.notes && (
                    <div>
                      <h4 className="text-white/80 text-sm font-medium mb-2">Notes</h4>
                      <p className="text-white/70 text-sm leading-relaxed">{document.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Document</span>
                </button>
                
                {document.allowDownload && (
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                )}
                
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                
                <button
                  onClick={() => setShowVersions(!showVersions)}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span>Version History</span>
                </button>
                
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Version History */}
            {showVersions && document.versions && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Version History</span>
                </h3>
                <div className="space-y-3">
                  {document.versions.map((version, index) => (
                    <div key={version.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="text-white font-medium">Version {version.version}</p>
                        <p className="text-white/60 text-sm">
                          {new Date(version.uploadedAt).toLocaleDateString()} by {version.uploadedBy?.name || 'Unknown'}
                        </p>
                        {version.notes && (
                          <p className="text-white/50 text-xs mt-1">{version.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {index === 0 && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            Current
                          </span>
                        )}
                        <button className="p-1 text-white/60 hover:text-white transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Share Document</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Link expires in:
                </label>
                <select
                  value={linkExpiry}
                  onChange={(e) => setLinkExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1" className="bg-slate-800">1 day</option>
                  <option value="7" className="bg-slate-800">7 days</option>
                  <option value="30" className="bg-slate-800">30 days</option>
                  <option value="never" className="bg-slate-800">Never</option>
                </select>
              </div>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-white text-sm">Allow download</span>
              </label>
              
              <button
                onClick={generateShareLink}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Generate Share Link
              </button>
              
              {shareLink && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 bg-transparent text-white text-sm mr-2 focus:outline-none"
                    />
                    <button
                      onClick={copyShareLink}
                      className="p-1 text-white/60 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Document</h3>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete "{document.title}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetailPage;