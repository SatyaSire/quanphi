import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Upload, X, Eye, AlertTriangle, Package, Scale, CreditCard, Paperclip } from 'lucide-react';
import { Material, MaterialFormData, MaterialValidationErrors, MaterialCategory } from '../types/materials';
import { projects } from '../data/projectsData';
import { mockMaterials, getAllMaterials, materialCategories, materialUnits } from '../data/materialsData';
import { getAllCategories } from '../utils/categoryManager';
import MaterialCategoryManager from '../components/common/MaterialCategoryManager';
import { PaymentMode, PaidBy } from '../types/materials';

const MaterialEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [newAttachmentPreviews, setNewAttachmentPreviews] = useState<string[]>([]);
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
  const [generalError, setGeneralError] = useState<string>('');
  const [budgetWarning, setBudgetWarning] = useState<string>('');

  // Load material data
  useEffect(() => {
    const loadMaterial = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const allMaterials = getAllMaterials();
        const foundMaterial = allMaterials.find(m => m.id === id && !m.isDeleted);
        if (!foundMaterial) {
          setMaterial(null);
          return;
        }

        setMaterial(foundMaterial);
        setFormData({
          materialName: foundMaterial.materialName,
          categoryId: foundMaterial.categoryId,
          vendorName: foundMaterial.vendorName,
          unit: foundMaterial.unit,
          quantity: foundMaterial.quantity,
          ratePerUnit: foundMaterial.ratePerUnit,
          totalAmount: foundMaterial.totalAmount,
          projectId: foundMaterial.projectId,
          dateOfPurchase: foundMaterial.dateOfPurchase,
          invoiceNumber: foundMaterial.invoiceNumber,
          paymentMode: foundMaterial.paymentMode,
          paidBy: foundMaterial.paidBy,
          attachments: foundMaterial.attachments || [],
          notes: foundMaterial.notes || ''
        });
      } catch (error) {
        console.error('Error loading material:', error);
        setGeneralError('Failed to load material data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMaterial();
    }
  }, [id]);

  // Calculate total amount when quantity or rate per unit changes
  useEffect(() => {
    const total = formData.quantity * formData.ratePerUnit;
    if (total !== formData.totalAmount) {
      setFormData(prev => ({ ...prev, totalAmount: total }));
    }
  }, [formData.quantity, formData.ratePerUnit]);

  const handleInputChange = (field: keyof MaterialFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    if (validFiles.length !== files.length) {
      setGeneralError('Some files were too large (max 10MB)');
    }

    setNewAttachments(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewAttachmentPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCategoryUpdate = () => {
    // Refresh categories when they are updated
    setAllCategories(getAllCategories());
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments(prev => prev.filter((_, i) => i !== index));
    setNewAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: MaterialValidationErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Material name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.vendorName.trim()) newErrors.vendorName = 'Vendor name is required';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (formData.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be greater than 0';
    if (!formData.projectId) newErrors.projectId = 'Project selection is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      setGeneralError('Please fix the errors above');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get materials from localStorage
      const storedMaterials = JSON.parse(localStorage.getItem('materials') || '[]');
      
      // Check if material exists in localStorage (user-created)
      const materialIndex = storedMaterials.findIndex((m: Material) => m.id === id);
      
      if (materialIndex !== -1) {
        // Update the material in localStorage
        const updatedMaterial: Material = {
          ...storedMaterials[materialIndex],
          materialName: formData.materialName,
          categoryId: formData.categoryId,
          vendorName: formData.vendorName,
          unit: formData.unit,
          quantity: formData.quantity,
          ratePerUnit: formData.ratePerUnit,
          totalAmount: formData.totalAmount,
          projectId: formData.projectId,
          dateOfPurchase: formData.dateOfPurchase,
          invoiceNumber: formData.invoiceNumber,
          paymentMode: formData.paymentMode,
          paidBy: formData.paidBy,
          notes: formData.notes,
          updatedAt: new Date().toISOString()
        };
        
        storedMaterials[materialIndex] = updatedMaterial;
        localStorage.setItem('materials', JSON.stringify(storedMaterials));
      } else {
        // For mock materials, we can't actually update them
        alert('This is a demo material and cannot be edited. Only user-created materials can be edited.');
        setIsSubmitting(false);
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/materials');
    } catch (error) {
      console.error('Error updating material:', error);
      setGeneralError('Failed to update material. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Get materials from localStorage
      const storedMaterials = JSON.parse(localStorage.getItem('materials') || '[]');
      
      // Check if material exists in localStorage (user-created)
      const materialIndex = storedMaterials.findIndex((m: Material) => m.id === id);
      
      if (materialIndex !== -1) {
        // Remove from localStorage
        storedMaterials.splice(materialIndex, 1);
        localStorage.setItem('materials', JSON.stringify(storedMaterials));
      } else {
        // For mock materials, we can't actually delete them
        alert('This is a demo material and cannot be deleted. Only user-created materials can be deleted.');
        setIsDeleting(false);
        setShowDeleteModal(false);
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/materials');
    } catch (error) {
      console.error('Error deleting material:', error);
      setGeneralError('Failed to delete material. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading material...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Material Not Found</h1>
          <p className="text-gray-600 mb-4">The material you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/materials')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  const selectedProject = projects.find(p => p.id === formData.projectId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/materials')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Materials
          </button>
          
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Material</h1>
                <p className="text-gray-600 mt-1">Update material information and details</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Updating...' : 'Update Material'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {generalError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{generalError}</p>
            </div>
          </div>
        )}

        {budgetWarning && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-700">{budgetWarning}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">📋 Material Information</h3>
                  <p className="text-sm text-gray-600">Essential material details and categorization</p>
                </div>
              </div>
            </div>
            <div className="p-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  value={formData.dateOfPurchase}
                  onChange={(e) => handleInputChange('dateOfPurchase', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dateOfPurchase ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfPurchase && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfPurchase}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => handleInputChange('projectId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.projectId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
                )}
              </div>
            </div>

            {selectedProject && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Project Budget:</span> ₹{selectedProject.budget.toLocaleString()}
                </p>
              </div>
            )}
            </div>
          </div>

          {/* Material Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">🏗️ Material Details</h3>
                  <p className="text-sm text-gray-600">Detailed material specifications and properties</p>
                </div>
              </div>
            </div>
            <div className="p-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter material name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
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
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter material description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.vendorName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter vendor name"
                />
                {errors.vendorName && (
                  <p className="mt-1 text-sm text-red-600">{errors.vendorName}</p>
                )}
              </div>
            </div>
            </div>
          </div>

          {/* Quantity & Pricing */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">💰 Quantity & Pricing</h3>
                  <p className="text-sm text-gray-600">Material quantity and cost breakdown</p>
                </div>
              </div>
            </div>
            <div className="p-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.quantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {materialUnits.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.unitPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.unitPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  placeholder="0.00"
                />
              </div>
            </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">💳 Payment Details</h3>
                  <p className="text-sm text-gray-600">Payment method and authorization information</p>
                </div>
              </div>
            </div>
            <div className="p-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode *
                </label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) => handleInputChange('paymentMode', e.target.value as PaymentMode)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  Paid By *
                </label>
                <select
                  value={formData.paidBy}
                  onChange={(e) => handleInputChange('paidBy', e.target.value as PaidBy)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(PaidBy).map(paidBy => (
                    <option key={paidBy} value={paidBy}>
                      {paidBy}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            </div>
          </div>

          {/* Existing Attachments */}
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <Paperclip className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">📎 Existing Attachments</h3>
                    <p className="text-sm text-gray-600">Previously uploaded documents and images</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.attachments.map((attachment, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={attachment}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open(attachment, '_blank')}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200"
                    >
                      <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                    </button>
                  </div>
                ))}
              </div>
              </div>
            </div>
          )}

          {/* Add New Attachments */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">📤 Add New Attachments</h3>
                  <p className="text-sm text-gray-600">Upload additional documents and images</p>
                </div>
              </div>
            </div>
            <div className="p-6">
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, PDF up to 10MB
                </p>
              </label>
            </div>

            {newAttachmentPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newAttachmentPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt={`New attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewAttachment(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-500/10 to-slate-500/10 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">📝 Additional Notes</h3>
                  <p className="text-sm text-gray-600">Extra information and comments</p>
                </div>
              </div>
            </div>
            <div className="p-6">
            
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes or comments..."
            />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/materials')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Updating...' : 'Update Material'}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Material</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this material? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default MaterialEditPage;