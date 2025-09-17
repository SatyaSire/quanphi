import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Edit, 
  ArrowLeft, 
  Package, 
  Calendar, 
  DollarSign,
  Building,
  User,
  Tag,
  CreditCard,
  FileText,
  Download,
  Eye,
  Trash2,
  MapPin,
  Paperclip,
  Scale,
  Hash,
  Layers
} from 'lucide-react';
import { mockMaterials, getAllMaterials, materialCategories, formatCurrency, getPaymentModeColor } from '../data/materialsData';
import { Material, PaymentMode, PaidBy } from '../types/materials';

const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<'edit' | 'delete' | null>(null);

  useEffect(() => {
    // Simulate API call to fetch material details
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        const allMaterials = getAllMaterials();
        const foundMaterial = allMaterials.find(m => m.id === id);
        if (foundMaterial) {
          setMaterial(foundMaterial);
        } else {
          navigate('/materials');
        }
      } catch (error) {
        console.error('Error fetching material:', error);
        navigate('/materials');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMaterial();
    }
  }, [id, navigate]);

  const handleEditMaterial = () => {
    setActionLoading('edit');
    navigate(`/materials/${id}/edit`);
  };

  const handleDeleteMaterial = async () => {
    if (!window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }

    setActionLoading('delete');
    try {
      // Get materials from localStorage
      const storedMaterials = JSON.parse(localStorage.getItem('materials') || '[]');
      
      // Check if material exists in localStorage (user-created)
      const materialIndex = storedMaterials.findIndex((m: Material) => m.id === id);
      
      if (materialIndex !== -1) {
        // Remove from localStorage
        storedMaterials.splice(materialIndex, 1);
        localStorage.setItem('materials', JSON.stringify(storedMaterials));
      } else {
        // For mock materials, we can't actually delete them, just show a message
        alert('This is a demo material and cannot be deleted. Only user-created materials can be deleted.');
        setActionLoading(null);
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/materials');
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getPaymentModeDisplay = (mode: PaymentMode): string => {
    return mode.replace('_', ' ');
  };

  const getPaidByDisplay = (paidBy: PaidBy): string => {
    return paidBy.replace('_', ' ');
  };

  const getCategoryById = (categoryId: string) => {
    return materialCategories.find(cat => cat.id === categoryId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Material Not Found</h2>
          <p className="text-gray-600 mb-4">The material you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/materials')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  const category = getCategoryById(material.categoryId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/materials')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Materials
            </button>
          </div>
          
          {/* Title and Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Material Details
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white shadow-lg"
                    style={{ backgroundColor: category?.color || '#6B7280' }}
                  >
                    {category?.icon} {category?.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(material.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEditMaterial}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Material
              </button>
              
              <button
                onClick={handleDeleteMaterial}
                disabled={actionLoading === 'delete'}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-medium rounded-xl hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {actionLoading === 'delete' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Material Information</h3>
                    <p className="text-sm text-gray-600">Essential material details and categorization</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Material Name</label>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      <p className="text-lg font-bold text-gray-900">{material.materialName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Date of Purchase</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-gray-900 font-medium">
                        {new Date(material.dateOfPurchase).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Project</label>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-gray-900 font-medium">{material.projectName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Category</label>
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-blue-500" />
                      <span 
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-lg"
                        style={{ backgroundColor: category?.color || '#6B7280' }}
                      >
                        {category?.icon} {category?.name}
                      </span>
                    </div>
                  </div>
                  
                  {material.vendorName && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Vendor</label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <p className="text-sm text-gray-900 font-medium">{material.vendorName}</p>
                      </div>
                    </div>
                  )}
                  
                  {material.invoiceNumber && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Invoice Number</label>
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-blue-500" />
                        <p className="text-sm text-gray-900 font-medium">{material.invoiceNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity & Pricing Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Scale className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Quantity & Pricing</h3>
                    <p className="text-sm text-gray-600">Material quantity and cost breakdown</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Quantity</label>
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-green-500" />
                      <p className="text-2xl font-bold text-green-600">
                        {material.quantity} {material.unit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Rate per Unit</label>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(material.ratePerUnit)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Total Amount</label>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(material.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
                    <p className="text-sm text-gray-600">Payment method and authorization information</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Payment Mode</label>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-blue-500" />
                      <span 
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-lg"
                        style={{ backgroundColor: getPaymentModeColor(material.paymentMode) }}
                      >
                        {getPaymentModeDisplay(material.paymentMode)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Paid By</label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-gray-900 font-medium">{getPaidByDisplay(material.paidBy)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            {material.notes && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Notes</h3>
                      <p className="text-sm text-gray-600">Additional notes and comments</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {material.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Attachments & Metadata */}
          <div className="space-y-8">
            {/* Attachments Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Paperclip className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Attachments</h3>
                    <p className="text-sm text-gray-600">Bills, invoices, and receipts</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {material.attachments && material.attachments.length > 0 ? (
                  <div className="space-y-3">
                    {material.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {attachment.name || `Attachment ${index + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors">
                            <Eye className="h-3 w-3" />
                          </button>
                          <button className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors">
                            <Download className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No attachments</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Metadata</h3>
                    <p className="text-sm text-gray-600">Creation and modification details</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Created</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(material.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Last Updated</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(material.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailPage;