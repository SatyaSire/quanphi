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
          <p className="text-white/60 mb-4">The document you're trying to edit doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Document</h1>
              <p className="text-white/60">Update document information and metadata</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Current File Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Current File</span>
            </h2>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{document.fileName}</p>
                  <p className="text-white/60 text-sm">
                    {formatFileSize(document.fileSize)} • Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowReplaceFile(!showReplaceFile)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Replace File</span>
              </button>
            </div>
            
            {/* File Replacement */}
            {showReplaceFile && (
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <h3 className="text-white font-medium mb-3">Replace with new file</h3>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                    onChange={handleFileReplace}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  
                  {replacementFile && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{replacementFile.name}</p>
                        <p className="text-white/60 text-sm">{formatFileSize(replacementFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReplacementFile(null)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Version Notes
                    </label>
                    <input
                      type="text"
                      value={versionNotes}
                      onChange={(e) => setVersionNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Describe what changed in this version"
                    />
                  </div>
                  
                  <p className="text-orange-300 text-sm">
                    ⚠️ Replacing the file will create a new version. The old version will be preserved in version history.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Document Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Document Information</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter document title"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as DocumentCategory }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {documentCategories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-slate-800">
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.category}</span>
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Document Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DocumentType }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="aadhaar" className="bg-slate-800">Aadhaar Card</option>
                  <option value="pan" className="bg-slate-800">PAN Card</option>
                  <option value="passport" className="bg-slate-800">Passport</option>
                  <option value="bank_proof" className="bg-slate-800">Bank Proof</option>
                  <option value="certificate" className="bg-slate-800">Certificate</option>
                  <option value="contract" className="bg-slate-800">Contract</option>
                  <option value="blueprint" className="bg-slate-800">Blueprint</option>
                  <option value="permit" className="bg-slate-800">Permit</option>
                  <option value="invoice" className="bg-slate-800">Invoice</option>
                  <option value="bill" className="bg-slate-800">Bill</option>
                  <option value="salary_slip" className="bg-slate-800">Salary Slip</option>
                  <option value="compliance" className="bg-slate-800">Compliance Certificate</option>
                  <option value="gst" className="bg-slate-800">GST Registration</option>
                  <option value="agreement" className="bg-slate-800">Agreement</option>
                  <option value="other" className="bg-slate-800">Other</option>
                </select>
                {errors.type && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.type}</span>
                  </p>
                )}
              </div>

              {/* Linked Entity Type */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Related To
                </label>
                <select
                  value={formData.linkedEntityType}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedEntityType: e.target.value, linkedEntityName: '' }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    {formData.linkedEntityType === 'worker' ? 'Worker Name' : 
                     formData.linkedEntityType === 'project' ? 'Project Name' : 'Client Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.linkedEntityName}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedEntityName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${formData.linkedEntityType} name`}
                  />
                </div>
              )}

              {/* Expiry Date */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Brief description of the document"
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-300 hover:text-blue-200"
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
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Additional notes or remarks"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Security Settings</span>
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isConfidential}
                  onChange={(e) => setFormData(prev => ({ ...prev, isConfidential: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center space-x-2">
                  {formData.isConfidential ? <Lock className="w-4 h-4 text-red-400" /> : <Unlock className="w-4 h-4 text-green-400" />}
                  <span className="text-white">Mark as confidential</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.allowDownload}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowDownload: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-white">Allow download</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors flex items-center space-x-2"
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
        </form>
      </div>
    </div>
  );
};

export default DocumentEditPage;