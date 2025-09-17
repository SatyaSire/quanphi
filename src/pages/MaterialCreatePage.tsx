import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  User,
  Paperclip,
  FileText,
  Upload,
  Camera,
  X,
  AlertTriangle,
  Building2,
  Calendar,
  Hash,
  Scale
} from 'lucide-react';
import { Material, MaterialFormData, MaterialValidationErrors } from '../types/materials';
import { projects } from '../data/projectsData';
import { materialCategories, materialUnits } from '../data/materialsData';
import { getAllCategories } from '../utils/categoryManager';
import MaterialCategoryManager from '../components/common/MaterialCategoryManager';
import { PaymentMode, PaidBy } from '../types/materials';

const MaterialCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [allCategories, setAllCategories] = useState(getAllCategories());

  const [formData, setFormData] = useState<MaterialFormData>({
    materialName: '',
    categoryId: '',
    vendorName: '',
    unit: '',
    quantity: 0,
    ratePerUnit: 0,
    totalAmount: 0,
    projectId: '',
    dateOfPurchase: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    paymentMode: PaymentMode.CASH,
    paidBy: PaidBy.ADMIN,
    attachments: [],
    notes: ''
  });

  const [errors, setErrors] = useState<MaterialValidationErrors>({});
  const [warnings, setWarnings] = useState<string[]>([]);

  // Auto-calculate total amount
  useEffect(() => {
    const total = formData.quantity * formData.ratePerUnit;
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.quantity, formData.ratePerUnit]);

  // Check for duplicate entries
  useEffect(() => {
    if (formData.materialName && formData.vendorName && formData.projectId && formData.dateOfPurchase) {
      // In a real app, this would check against existing materials
      // For now, we'll just show a warning for demonstration
      const isDuplicate = false; // Replace with actual duplicate check
      if (isDuplicate) {
        setWarnings(['⚠️ Similar material entry found for the same vendor, project, and date']);
      } else {
        setWarnings([]);
      }
    }
  }, [formData.materialName, formData.vendorName, formData.projectId, formData.dateOfPurchase]);

  const handleInputChange = (field: keyof MaterialFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));

    // Generate previews for images
    validFiles.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachmentPreviews(prev => {
            const newPreviews = [...prev];
            newPreviews[formData.attachments.length + index] = e.target?.result as string;
            return newPreviews;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleCategoryUpdate = () => {
    // Refresh categories when they are updated
    setAllCategories(getAllCategories());
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: MaterialValidationErrors = {};

    if (!formData.materialName.trim()) {
      newErrors.materialName = 'Material name is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (formData.ratePerUnit <= 0) {
      newErrors.ratePerUnit = 'Rate per unit must be greater than 0';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }

    if (!formData.dateOfPurchase) {
      newErrors.dateOfPurchase = 'Date of purchase is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create new material object
      const newMaterial: Material = {
        id: `mat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        materialName: formData.materialName,
        category: formData.categoryId,
        vendorName: formData.vendorName || 'Unknown Vendor',
        unit: formData.unit,
        quantityPurchased: formData.quantity,
        ratePerUnit: formData.ratePerUnit,
        totalAmount: formData.totalAmount,
        projectId: formData.projectId,
        dateOfPurchase: formData.dateOfPurchase,
        invoiceNumber: formData.invoiceNumber || '',
        paymentMode: formData.paymentMode,
        paidBy: formData.paidBy,
        attachments: formData.attachments.map(file => ({
          id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size
        })),
        notes: formData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
      };

      // Save to localStorage
      const existingMaterials = JSON.parse(localStorage.getItem('materials') || '[]');
      const updatedMaterials = [...existingMaterials, newMaterial];
      localStorage.setItem('materials', JSON.stringify(updatedMaterials));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/materials');
    } catch (error) {
      console.error('Error creating material:', error);
      alert('Failed to save material. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: keyof MaterialValidationErrors) => {
    return errors[field];
  };

  const materialAmount = formData.totalAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/materials"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Materials
          </Link>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-4">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Material</h1>
              <p className="text-gray-600 mt-1">Record a new material purchase for your project</p>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800 mb-1">Warnings</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter material details and purchase information
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date of Purchase *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfPurchase}
                    onChange={(e) => handleInputChange('dateOfPurchase', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      getFieldError('dateOfPurchase') ? 'border-red-300' : ''
                    }`}
                  />
                  {getFieldError('dateOfPurchase') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('dateOfPurchase')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="inline h-4 w-4 mr-1" />
                    Project *
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      getFieldError('projectId') ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {getFieldError('projectId') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('projectId')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cement OPC 43, Iron Rod 12mm"
                  value={formData.materialName}
                  onChange={(e) => handleInputChange('materialName', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    getFieldError('materialName') ? 'border-red-300' : ''
                  }`}
                />
                {getFieldError('materialName') && (
                  <p className="text-red-600 text-sm mt-1">{getFieldError('materialName')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="space-y-3">
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      getFieldError('categoryId') ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">Select a category</option>
                    {allCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    type="button"
                    onClick={() => setShowCategoryManager(true)}
                    className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Manage Categories
                  </button>
                </div>
                {getFieldError('categoryId') && (
                  <p className="text-red-600 text-sm mt-1">{getFieldError('categoryId')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor / Supplier Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Local Cement Supplier"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Quantity & Pricing */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Quantity & Pricing</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter quantity, unit, and pricing information
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      getFieldError('unit') ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">Select unit</option>
                    {materialUnits.map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  {getFieldError('unit') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('unit')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      getFieldError('quantity') ? 'border-red-300' : ''
                    }`}
                  />
                  {getFieldError('quantity') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('quantity')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Rate per Unit (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.ratePerUnit}
                    onChange={(e) => handleInputChange('ratePerUnit', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      getFieldError('ratePerUnit') ? 'border-red-300' : ''
                    }`}
                  />
                  {getFieldError('ratePerUnit') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('ratePerUnit')}</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{materialAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                {materialAmount > 50000 && (
                  <p className="text-yellow-600 text-sm mt-2">
                    ⚠️ High amount purchase - Admin notification will be sent
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg mr-3">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter payment and invoice information
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode
                  </label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => handleInputChange('paymentMode', e.target.value as PaymentMode)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.values(PaymentMode).map(mode => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Paid By
                  </label>
                  <select
                    value={formData.paidBy}
                    onChange={(e) => handleInputChange('paidBy', e.target.value as PaidBy)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.values(PaidBy).map(paidBy => (
                      <option key={paidBy} value={paidBy}>
                        {paidBy}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="inline h-4 w-4 mr-1" />
                    Invoice / Bill Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., INV-2024-001"
                    value={formData.invoiceNumber}
                    onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                  <Paperclip className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Attachments</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload bills, invoices, delivery challans, or receipts (PDF, JPG, PNG - Max 5MB each)
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                          Drop files here or click to upload
                        </span>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      PDF, JPG, PNG up to 5MB each
                    </p>
                  </div>
                </div>

                {/* File Previews */}
                {formData.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Uploaded Files ({formData.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="relative border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              {file.type === 'application/pdf' ? (
                                <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                              ) : (
                                <Camera className="h-8 w-8 text-blue-500 flex-shrink-0" />
                              )}
                              <div className="ml-3 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="ml-2 text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {attachmentPreviews[index] && (
                            <div className="mt-2">
                              <img
                                src={attachmentPreviews[index]}
                                alt="Preview"
                                className="w-full h-20 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {getFieldError('attachments') && (
                  <p className="text-red-600 text-sm mt-2">{getFieldError('attachments')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Additional Notes</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Add any additional notes or remarks
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6">
              <textarea
                rows={4}
                placeholder="Any additional notes or remarks..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/materials"
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Material'}
            </button>
          </div>
        </form>
      </div>

      {/* Material Category Manager Modal */}
      {showCategoryManager && (
        <MaterialCategoryManager
          isOpen={showCategoryManager}
          onClose={() => setShowCategoryManager(false)}
          onCategoryUpdate={handleCategoryUpdate}
        />
      )}
    </div>
  );
};

export default MaterialCreatePage;