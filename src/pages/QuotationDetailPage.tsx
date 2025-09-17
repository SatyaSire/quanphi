import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Edit, 
  Download, 
  ArrowLeft, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign,
  Building,
  User,
  Printer,
  Share2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileDown,
  FileImage,
  FileType
} from 'lucide-react';
import { 
  getQuotationById, 
  generateQuotationPDF
} from '../data/quotationsData';
import { getClientById } from '../data/clientsData';

// Use the correct types from quotationsData
type QuotationStatus = 'draft' | 'finalized' | 'sent' | 'accepted' | 'rejected' | 'expired';

interface QuotationLineItem {
  id: string;
  category: string;
  description: string;
  unit: 'Sqft' | 'Nos' | 'Rft' | 'Lumpsum' | 'Day' | 'Kg' | 'Meter' | 'Hour';
  quantity: number;
  rate: number;
  amount: number;
  discount?: number;
  discountAmount?: number;
}

interface QuotationPaymentTerms {
  advance: number;
  milestone1: number;
  milestone2?: number;
  final: number;
  description: string;
}

interface QuotationTermsConditions {
  id: string;
  title: string;
  content: string;
  isDefault: boolean;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  siteAddress: string;
  workDescription: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  totalDiscount: number;
  totalAmount: number;
  termsConditions: QuotationTermsConditions[];
  paymentTerms: QuotationPaymentTerms;
  validityPeriod: number;
  validUntil: string;
  status: QuotationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  finalizedAt?: string;
  attachments: any[];
  sendHistory: any[];
  versions: any[];
  currentVersion: number;
  aiGenerated: boolean;
  originalInput?: string;
  companyLogo?: string;
  companyName: string;
  companyAddress: string;
  companyGSTIN?: string;
  companyPhone: string;
  companyEmail: string;
  followUpDate?: string;
  followUpNotes?: string;
  convertedToProject: boolean;
  convertedProjectId?: string;
  convertedAt?: string;
}

const QuotationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      try {
        const quotationData = getQuotationById(id);
        if (quotationData) {
          setQuotation(quotationData);
          const clientData = getClientById(quotationData.clientId);
          setClient(clientData);
        } else {
          console.error('Quotation not found with ID:', id);
          // Don't navigate away, show error message instead
        }
      } catch (error) {
        console.error('Failed to load quotation:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [id, navigate]);

  const handleDownloadPDF = async () => {
    if (!quotation) return;
    setActionLoading('pdf');
    try {
      await generateQuotationPDF(quotation.id);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadWord = async () => {
    if (!quotation) return;
    setActionLoading('word');
    try {
      // Implement Word document generation
      console.log('Generating Word document for quotation:', quotation.id);
      // This would typically call an API to generate Word document
    } catch (error) {
      console.error('Failed to generate Word document:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditQuotation = () => {
    if (quotation) {
      navigate(`/quotations/${quotation.id}/edit`);
    }
  };

  const getStatusColor = (status: QuotationStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'finalized': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotation...</p>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quotation Not Found</h2>
          <p className="text-gray-600 mb-6">The quotation you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/quotations')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quotations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header with Action Buttons */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Back Button - Top Left */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/quotations')}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quotations
            </button>
          </div>
          
          {/* Title and Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Quotation {quotation.quotationNumber}
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadPDF}
                disabled={actionLoading === 'pdf'}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading === 'pdf' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                Download PDF
              </button>
              
              <button
                onClick={handleDownloadWord}
                disabled={actionLoading === 'word'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading === 'word' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <FileType className="h-4 w-4 mr-2" />
                )}
                Download Word
              </button>
              
              <button
                onClick={handleEditQuotation}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Quotation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">QUOTATION</h1>
                <p className="text-blue-100 text-lg">{quotation.quotationNumber}</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <p className="text-sm text-blue-100">Date</p>
                  <p className="font-semibold">{formatDate(quotation.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company & Client Info */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  From
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">{quotation.companyName}</h4>
                  <p className="text-gray-600 mt-1">{quotation.companyAddress}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {quotation.companyPhone}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {quotation.companyEmail}
                    </p>
                    {quotation.companyGSTIN && (
                      <p className="text-sm text-gray-600">
                        <strong>GSTIN:</strong> {quotation.companyGSTIN}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  To
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">{quotation.clientName}</h4>
                  {client && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {client.phone || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {client.email || 'N/A'}
                      </p>
                    </div>
                  )}
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{quotation.siteAddress}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Details</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-800">{quotation.workDescription}</p>
              {quotation.projectName && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Project:</strong> {quotation.projectName}
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items & Services</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Unit</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Rate</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.lineItems.map((item, index) => (
                    <tr key={item.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-4 px-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.category}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{item.description}</td>
                      <td className="py-4 px-4 text-sm text-center text-gray-600">{item.unit}</td>
                      <td className="py-4 px-4 text-sm text-right text-gray-600">{item.quantity}</td>
                      <td className="py-4 px-4 text-sm text-right text-gray-600">{formatCurrency(item.rate)}</td>
                      <td className="py-4 px-4 text-sm text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(quotation.subtotal)}</span>
                </div>
                {quotation.totalDiscount > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(quotation.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Tax ({quotation.taxPercentage}%):</span>
                  <span className="font-medium text-gray-900">{formatCurrency(quotation.taxAmount)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(quotation.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="px-8 py-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Terms</h3>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-gray-800 mb-3">{quotation.paymentTerms.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Advance</p>
                  <p className="font-semibold text-gray-900">{quotation.paymentTerms.advance}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Milestone 1</p>
                  <p className="font-semibold text-gray-900">{quotation.paymentTerms.milestone1}%</p>
                </div>
                {quotation.paymentTerms.milestone2 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Milestone 2</p>
                    <p className="font-semibold text-gray-900">{quotation.paymentTerms.milestone2}%</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm text-gray-600">Final</p>
                  <p className="font-semibold text-gray-900">{quotation.paymentTerms.final}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          {quotation.termsConditions && quotation.termsConditions.length > 0 && (
            <div className="px-8 py-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
              <div className="space-y-3">
                {quotation.termsConditions.map((term, index) => (
                  <div key={term.id} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-1">{index + 1}. {term.title}</h4>
                    <p className="text-sm text-gray-700">{term.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validity & Footer */}
          <div className="px-8 py-6 bg-gray-900 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-300">Valid Until</p>
                <p className="font-semibold flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(quotation.validUntil)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Thank you for your business!</p>
                <p className="text-xs text-gray-400 mt-1">
                  Generated on {formatDate(new Date().toISOString())}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetailPage;