import React from 'react';
import { 
  Building, 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Phone, 
  Mail, 
  Globe
} from 'lucide-react';
import { Quotation } from '../../types/quotation';
import { Client } from '../../types/client';
import { getAllClients } from '../../data/clientsData';
import { defaultTermsConditions } from '../../data/quotationsData';

interface QuotationPreviewProps {
  quotation: Quotation;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const QuotationPreview: React.FC<QuotationPreviewProps> = ({ 
  quotation, 
  showHeader = true, 
  showFooter = true, 
  className = '' 
}) => {
  const clients = getAllClients();
  const client = clients.find(c => c.id === quotation.clientId);
  
  const subtotal = quotation.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * quotation.taxPercentage) / 100;
  const totalAmount = subtotal + taxAmount;
  
  const selectedTerms = defaultTermsConditions.filter(tc => 
    quotation.termsConditions?.includes(tc.id)
  );
  
  return (
    <div className={`bg-white ${className}`}>
      {/* Company Header */}
      {showHeader && (
        <div className="border-b-2 border-blue-600 pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">ContractorPro</h1>
              <div className="text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>123 Business Street, City, State 12345</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@contractorpro.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>www.contractorpro.com</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">QUOTATION</h2>
              <div className="text-gray-600 space-y-1">
                <div><strong>Quote #:</strong> {quotation.quotationNumber}</div>
                <div><strong>Date:</strong> {new Date(quotation.createdAt).toLocaleDateString()}</div>
                <div><strong>Valid Until:</strong> {new Date(quotation.validUntil).toLocaleDateString()}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    quotation.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    quotation.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    quotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {quotation.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Client Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            Bill To:
          </h3>
          {client && (
            <div className="text-gray-700 space-y-1">
              <div className="font-medium text-lg">{client.name}</div>
              {client.contactPerson && (
                <div>Contact: {client.contactPerson}</div>
              )}
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-start gap-2 mt-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>{client.address}</span>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Project Details:
          </h3>
          <div className="text-gray-700 space-y-2">
            <div>
              <strong>Site Address:</strong>
              <div className="mt-1">{quotation.siteAddress}</div>
            </div>
            <div>
              <strong>Work Description:</strong>
              <div className="mt-1">{quotation.workDescription}</div>
            </div>
            {quotation.projectId && (
              <div>
                <strong>Project ID:</strong> {quotation.projectId}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Line Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Items & Services</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                  #
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                  Category
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                  Unit
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                  Qty
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                  Rate
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {quotation.lineItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-600">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                    {item.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    {item.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-600">
                    {item.unit}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">
                    ₹{item.rate.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-900">
                    ₹{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-md">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-gray-700">
                <span>Tax ({quotation.taxPercentage}%):</span>
                <span className="font-medium">₹{taxAmount.toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Terms */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Terms</h3>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{quotation.paymentTerms.advance}%</div>
              <div className="text-sm text-gray-600">Advance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{quotation.paymentTerms.milestone1}%</div>
              <div className="text-sm text-gray-600">Milestone 1</div>
            </div>
            {quotation.paymentTerms.milestone2 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{quotation.paymentTerms.milestone2}%</div>
                <div className="text-sm text-gray-600">Milestone 2</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{quotation.paymentTerms.final}%</div>
              <div className="text-sm text-gray-600">Final</div>
            </div>
          </div>
          <p className="text-sm text-gray-700 text-center">{quotation.paymentTerms.description}</p>
        </div>
      </div>
      
      {/* Terms & Conditions */}
      {selectedTerms.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Terms & Conditions
          </h3>
          <div className="space-y-4">
            {selectedTerms.map((term, index) => (
              <div key={term.id} className="border-l-4 border-blue-600 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">
                  {index + 1}. {term.title}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">{term.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer */}
      {showFooter && (
        <div className="border-t pt-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Authorized Signature</h4>
              <div className="border-b border-gray-300 w-48 mb-2"></div>
              <p className="text-sm text-gray-600">ContractorPro Team</p>
              <p className="text-xs text-gray-500 mt-1">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-right">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  This quotation is valid for {Math.ceil((new Date(quotation.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                </p>
                <p className="text-xs text-yellow-700">
                  Please contact us for any clarifications or modifications.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Thank you for considering ContractorPro for your construction needs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationPreview;