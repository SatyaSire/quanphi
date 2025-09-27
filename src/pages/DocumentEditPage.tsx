import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, X, Plus, Calendar, Tag, User, Building, 
  FileText, AlertCircle, Upload, Trash2, Eye, Lock, Unlock
} from 'lucide-react';
import { Document, DocumentCategory, DocumentType } from '../types/documents';
import { getDocumentById, documentCategories } from '../data/documentsData';

const DocumentEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showReplaceFile, setShowReplaceFile] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '' as DocumentCategory,
    type: '' as DocumentType,
    description: '',
    tags: [] as string[],
    expiryDate: '',
    linkedEntityType: '',
    linkedEntityName: '',
    notes: '',
    isConfidential: false,
    allowDownload: true
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [versionNotes, setVersionNotes] = useState('');

  useEffect(() => {
    if (id) {
      const doc = getDocumentById(id);
      if (doc) {
        setDocument(doc);
        setFormData({
          title: doc.title,
          category: doc.category,
          type: doc.type,
          description: doc.description || '',
          tags: doc.tags || [],
          expiryDate: doc.expiryDate ? new Date(doc.expiryDate).toISOString().split('T')[0] : '',
          linkedEntityType: doc.linkedEntity?.type || '',
          linkedEntityName: doc.linkedEntity?.name || '',
          notes: doc.notes || '',
          isConfidential: doc.isConfidential || false,
          allowDownload: doc.allowDownload !== false
        });
      }
      setLoading(false);
    }
  }, [id]);

  const handleFileReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png'];
      
      if (validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024) {
        setReplacementFile(file);
      } else {
        alert('Invalid file type or size. Please select a valid file under 10MB.');
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Document title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.type) newErrors.type = 'Document type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      navigate(`/documents/${id}`);
    }, 2000);
  };

  const handleCancel = () => {
    navigate(`/documents/${id}`);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-700 font-medium">Loading document...</span>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-600 mb-6">The document you're trying to edit doesn't exist.</p>
          <button
            onClick={() => navigate('/documents')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Document</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Edit Document</h1>
                <p className="text-sm text-gray-600">Update document information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Current File Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Current File</h2>
                  <p className="text-sm text-gray-600">Manage the current document file</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">{document.fileName}</p>
                    <p className="text-gray-600 text-sm">
                      {formatFileSize(document.fileSize)} • Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowReplaceFile(!showReplaceFile)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <span>Replace File</span>
                </button>
              </div>
            
              {/* File Replacement */}
              {showReplaceFile && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <h3 className="text-gray-900 font-semibold mb-3">Replace with new file</h3>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                      onChange={handleFileReplace}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    
                    {replacementFile && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          <p className="text-gray-900 font-medium">{replacementFile.name}</p>
                          <p className="text-gray-600 text-sm">{formatFileSize(replacementFile.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReplacementFile(null)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Version Notes
                      </label>
                      <input
                        type="text"
                        value={versionNotes}
                        onChange={(e) => setVersionNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe what changed in this version"
                      />
                    </div>
                    
                    <p className="text-orange-700 text-sm bg-orange-100 p-3 rounded-lg">
                      ⚠️ Replacing the file will create a new version. The old version will be preserved in version history.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Document Information</h2>
                  <p className="text-sm text-gray-600">Update document details and metadata</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter document title"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as DocumentCategory }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select category</option>
                  {documentCategories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-white">
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.category}</span>
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Document Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DocumentType }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select type</option>
                  <option value="aadhaar" className="bg-white">Aadhaar Card</option>
                  <option value="pan" className="bg-white">PAN Card</option>
                  <option value="passport" className="bg-white">Passport</option>
                  <option value="bank_proof" className="bg-white">Bank Proof</option>
                  <option value="certificate" className="bg-white">Certificate</option>
                  <option value="contract" className="bg-white">Contract</option>
                  <option value="blueprint" className="bg-white">Blueprint</option>
                  <option value="permit" className="bg-white">Permit</option>
                  <option value="invoice" className="bg-white">Invoice</option>
                  <option value="bill" className="bg-white">Bill</option>
                  <option value="salary_slip" className="bg-white">Salary Slip</option>
                  <option value="compliance" className="bg-white">Compliance Certificate</option>
                  <option value="gst" className="bg-white">GST Registration</option>
                  <option value="agreement" className="bg-white">Agreement</option>
                  <option value="other" className="bg-white">Other</option>
                </select>
                {errors.type && (
                  <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.type}</span>
                  </p>
                )}
              </div>

              {/* Linked Entity Type */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Related To
                </label>
                <select
                  value={formData.linkedEntityType}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedEntityType: e.target.value, linkedEntityName: '' }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select entity type</option>
                  <option value="worker">Worker</option>
                  <option value="project">Project</option>
                  <option value="client">Client</option>
                </select>
              </div>

              {/* Linked Entity Name */}
              {formData.linkedEntityType && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {formData.linkedEntityType === 'worker' ? 'Worker Name' : 
                     formData.linkedEntityType === 'project' ? 'Project Name' : 'Client Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.linkedEntityName}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedEntityName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Enter ${formData.linkedEntityType} name`}
                  />
                </div>
              )}

              {/* Expiry Date */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  placeholder="Brief description of the document"
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  placeholder="Additional notes or remarks"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span>Security Settings</span>
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isConfidential}
                  onChange={(e) => setFormData(prev => ({ ...prev, isConfidential: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center space-x-2">
                  {formData.isConfidential ? <Lock className="w-4 h-4 text-red-600" /> : <Unlock className="w-4 h-4 text-green-600" />}
                  <span className="text-gray-700">Mark as confidential</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowDownload}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowDownload: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-700">Allow download</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl transition-colors flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentEditPage;