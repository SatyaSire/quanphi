import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, File, X, Plus, Calendar, Tag, User, Building, FileText, AlertCircle, Check, ChevronRight, ChevronLeft, Shield } from 'lucide-react';
import { DocumentCategory, DocumentType } from '../types/documents';
import { documentCategories } from '../data/documentsData';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const DocumentCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    { id: 1, title: 'Upload Files', icon: Upload, description: 'Select and upload your documents' },
    { id: 2, title: 'Document Info', icon: FileText, description: 'Add document details and metadata' },
    { id: 3, title: 'Additional Details', icon: Tag, description: 'Tags, relations, and notes' },
    { id: 4, title: 'Security & Review', icon: Shield, description: 'Security settings and final review' }
  ];
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: '',
    linkedEntityType: '',
    linkedEntityName: '',
    expiryDate: '',
    description: '',
    tags: [] as string[],
    notes: '',
    isConfidential: false,
    allowDownload: true
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // File handling functions
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(uploadFile => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress: 100, status: 'completed' }
              : f
          )
        );
      }, 2000);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
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

  // Validation and navigation
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (uploadedFiles.length === 0) newErrors.files = 'At least one file must be uploaded';
        break;
      case 2:
        if (!formData.title.trim()) newErrors.title = 'Document title is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.type) newErrors.type = 'Document type is required';
        break;
      case 3:
        // Optional fields, no validation required
        break;
      case 4:
        // Final review, no additional validation
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before final submission
    let allValid = true;
    for (let i = 1; i <= steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setCurrentStep(i);
        break;
      }
    }
    
    if (!allValid) {
      return;
    }

    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Document created:', { formData, uploadedFiles });
      setIsUploading(false);
      navigate('/documents');
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Upload Documents</h2>
                  <p className="text-sm text-gray-600 mt-1">Select files to upload or drag and drop them here</p>
                </div>
              </div>
            </div>
            <div className="p-6">
            
              {/* Drag & Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
                <div className="space-y-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-lg">Drop files here or click to browse</p>
                    <p className="text-gray-600 text-sm mt-2">
                      Supports PDF, DOCX, XLSX, JPG, PNG (Max 10MB each)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Choose Files
                  </button>
                </div>
            </div>
            
                {errors.files && (
                  <p className="text-red-600 text-sm mt-4 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.files}</span>
                  </p>
                )}

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-gray-900 font-bold text-lg">Uploaded Files ({uploadedFiles.length})</h3>
                    {uploadedFiles.map((uploadFile) => (
                      <div key={uploadFile.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {uploadFile.preview ? (
                              <img src={uploadFile.preview} alt="Preview" className="w-12 h-12 rounded-xl object-cover shadow-md" />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-md">
                                <File className="w-6 h-6 text-gray-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-gray-900 font-semibold">{uploadFile.file.name}</p>
                              <p className="text-gray-600 text-sm">
                                {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {uploadFile.status === 'completed' && (
                              <div className="p-1 bg-green-100 rounded-full">
                                <Check className="w-4 h-4 text-green-600" />
                              </div>
                            )}
                            {uploadFile.status === 'uploading' && (
                              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile(uploadFile.id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {uploadFile.status === 'uploading' && (
                          <div className="mt-3">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadFile.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Document Information</h2>
                  <p className="text-sm text-gray-600 mt-1">Add basic details about your document</p>
                </div>
              </div>
            </div>
            <div className="p-6">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
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
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    {documentCategories.map(category => (
                      <option key={category.id} value={category.id}>
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
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Document Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.type ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="contract">Contract</option>
                    <option value="invoice">Invoice</option>
                    <option value="report">Report</option>
                    <option value="certificate">Certificate</option>
                    <option value="other">Other</option>
                </select>
                {errors.type && (
                  <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.type}</span>
                  </p>
                )}
              </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                    placeholder="Brief description of the document"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Tag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Additional Details</h2>
                  <p className="text-sm text-gray-600">Add tags, relations, and additional information</p>
                </div>
              </div>
            </div>
            <div className="px-2">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Linked Entity Type */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Related To
                  </label>
                  <select
                    value={formData.linkedEntityType}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedEntityType: e.target.value, linkedEntityName: '' }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      {formData.linkedEntityType === 'worker' ? 'Worker Name' : 
                       formData.linkedEntityType === 'project' ? 'Project Name' : 'Client Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.linkedEntityName}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedEntityName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={`Enter ${formData.linkedEntityType} name`}
                    />
                  </div>
                )}

                {/* Expiry Date */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm shadow-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
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
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 shadow-lg flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                    placeholder="Additional notes or remarks"
                  />
                </div>
              </div>
            </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            {/* Security Settings */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                    <p className="text-sm text-gray-600">Configure document access and permissions</p>
                  </div>
                </div>
              </div>
              <div className="px-2">
              
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 border border-gray-200 hover:bg-white/70 transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={formData.isConfidential}
                      onChange={(e) => setFormData(prev => ({ ...prev, isConfidential: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-gray-900 font-medium">Mark as confidential</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 border border-gray-200 hover:bg-white/70 transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={formData.allowDownload}
                      onChange={(e) => setFormData(prev => ({ ...prev, allowDownload: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-gray-900 font-medium">Allow download</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Review Summary */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Review & Submit</h2>
                    <p className="text-sm text-gray-600">Review your document details before submission</p>
                  </div>
                </div>
              </div>
              <div className="px-2">
              
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-white/50 rounded-xl border border-gray-200">
                      <p className="text-gray-500 text-sm font-medium">Document Title</p>
                      <p className="text-gray-900 font-semibold">{formData.title || 'Not specified'}</p>
                    </div>
                    <div className="p-3 bg-white/50 rounded-xl border border-gray-200">
                      <p className="text-gray-500 text-sm font-medium">Category</p>
                      <p className="text-gray-900 font-semibold">{formData.category || 'Not specified'}</p>
                    </div>
                    <div className="p-3 bg-white/50 rounded-xl border border-gray-200">
                      <p className="text-gray-500 text-sm font-medium">Type</p>
                      <p className="text-gray-900 font-semibold">{formData.type || 'Not specified'}</p>
                    </div>
                    <div className="p-3 bg-white/50 rounded-xl border border-gray-200">
                      <p className="text-gray-500 text-sm font-medium">Files</p>
                      <p className="text-gray-900 font-semibold">{uploadedFiles.length} file(s)</p>
                    </div>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="p-3 bg-white/50 rounded-xl border border-gray-200">
                      <p className="text-gray-500 text-sm font-medium mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm shadow-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(formData.isConfidential || !formData.allowDownload) && (
                    <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-200">
                      <p className="text-gray-500 text-sm font-medium mb-2">Security Settings</p>
                      <div className="space-y-1">
                        {formData.isConfidential && (
                          <p className="text-sm text-orange-600 font-medium">• Marked as confidential</p>
                        )}
                        {!formData.allowDownload && (
                          <p className="text-sm text-orange-600 font-medium">• Download restricted</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/documents')}
                className="group flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back to Documents</span>
              </button>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Document</h1>
                  <p className="text-sm text-gray-600">Upload and organize your documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isClickable = step.id <= currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => isClickable && goToStep(step.id)}
                      disabled={!isClickable}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-200 shadow-lg ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-500 text-white shadow-green-200'
                          : isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 text-white shadow-blue-200'
                          : isClickable
                          ? 'bg-white border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:shadow-blue-100 cursor-pointer'
                          : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </button>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-semibold ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 max-w-28">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-6 rounded-full transition-all duration-300 ${
                      currentStep > step.id ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-200 border border-gray-300 shadow-lg hover:shadow-xl flex items-center space-x-2 font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/documents')}
                  className="px-6 py-3 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-200 border border-gray-300 shadow-lg hover:shadow-xl font-medium"
                >
                  Cancel
                </button>
                
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 font-medium"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isUploading || uploadedFiles.length === 0}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 font-medium"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Document</span>
                      </>
                    )}
                  </button>
                )}
               </div>
             </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentCreatePage;