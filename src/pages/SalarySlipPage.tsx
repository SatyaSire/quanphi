import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Calendar, Clock, User, Building, CreditCard, Receipt, CheckCircle } from 'lucide-react';

interface SalarySlipData {
  workerId: string;
  workerName: string;
  workerRole: string;
  employeeId: string;
  department: string;
  payPeriod: string;
  payDate: string;
  profilePicture?: string;
  basicSalary: number;
  hoursWorked: number;
  overtimeHours: number;
  overtimeRate: number;
  allowances: {
    name: string;
    amount: number;
  }[];
  deductions: {
    name: string;
    amount: number;
  }[];
  advances: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  paymentMethod: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
}

const SalarySlipPage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();

  // Mock data - in real app, fetch based on workerId
  const salaryData: SalarySlipData = {
    workerId: workerId || '1',
    workerName: 'Rajesh Kumar',
    workerRole: 'Senior Mason',
    employeeId: 'EMP001',
    department: 'Construction',
    payPeriod: 'January 2024',
    payDate: '2024-01-31',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    basicSalary: 25000,
    hoursWorked: 184,
    overtimeHours: 16,
    overtimeRate: 200,
    allowances: [
      { name: 'Transport Allowance', amount: 2000 },
      { name: 'Skill Bonus', amount: 1500 },
      { name: 'Safety Bonus', amount: 1000 }
    ],
    deductions: [
      { name: 'PF Contribution', amount: 1800 },
      { name: 'ESI', amount: 500 },
      { name: 'Professional Tax', amount: 200 }
    ],
    advances: 3000,
    grossPay: 32700,
    totalDeductions: 5500,
    netPay: 24200,
    paymentMethod: 'Bank Transfer',
    bankDetails: {
      accountNumber: '****1234',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank'
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/payments')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Payments</span>
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Salary Slip */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
          {/* Company Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">BuildTrack Pro</h1>
                <p className="text-blue-100 mt-1">Construction Management System</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100">Salary Slip</p>
                <p className="text-xl font-semibold">{salaryData.payPeriod}</p>
              </div>
            </div>
          </div>

          {/* Employee Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Employee Info */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Employee Information
                </h2>
                <div className="flex items-center space-x-4">
                  {salaryData.profilePicture ? (
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={salaryData.profilePicture}
                      alt={salaryData.workerName}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{salaryData.workerName}</h3>
                    <p className="text-gray-600">{salaryData.workerRole}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Employee ID:</span>
                    <p className="font-semibold">{salaryData.employeeId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <p className="font-semibold">{salaryData.department}</p>
                  </div>
                </div>
              </div>

              {/* Pay Period Info */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Pay Period Details
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <div>
                      <span className="text-gray-500">Pay Period:</span>
                      <p className="font-semibold">{salaryData.payPeriod}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <span className="text-gray-500">Pay Date:</span>
                      <p className="font-semibold">{new Date(salaryData.payDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <div>
                      <span className="text-gray-500">Hours Worked:</span>
                      <p className="font-semibold">{salaryData.hoursWorked}h</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <div>
                      <span className="text-gray-500">Overtime:</span>
                      <p className="font-semibold">{salaryData.overtimeHours}h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings and Deductions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Earnings */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Earnings
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Basic Salary</span>
                    <span className="font-semibold">{formatCurrency(salaryData.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Overtime ({salaryData.overtimeHours}h @ ₹{salaryData.overtimeRate}/h)</span>
                    <span className="font-semibold">{formatCurrency(salaryData.overtimeHours * salaryData.overtimeRate)}</span>
                  </div>
                  {salaryData.allowances.map((allowance, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-700">{allowance.name}</span>
                      <span className="font-semibold">{formatCurrency(allowance.amount)}</span>
                    </div>
                  ))}
                  <div className="border-t border-green-200 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-green-800">
                      <span>Gross Pay</span>
                      <span>{formatCurrency(salaryData.grossPay)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Deductions
                </h3>
                <div className="space-y-3">
                  {salaryData.deductions.map((deduction, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-700">{deduction.name}</span>
                      <span className="font-semibold">-{formatCurrency(deduction.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-gray-700">Advance Payments</span>
                    <span className="font-semibold">-{formatCurrency(salaryData.advances)}</span>
                  </div>
                  <div className="border-t border-red-200 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-red-800">
                      <span>Total Deductions</span>
                      <span>-{formatCurrency(salaryData.totalDeductions + salaryData.advances)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Net Pay</h3>
                  <p className="text-blue-100">Amount to be paid</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{formatCurrency(salaryData.netPay)}</p>
                  <p className="text-blue-100 text-sm mt-1">via {salaryData.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            {salaryData.bankDetails && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Account Number:</span>
                    <p className="font-semibold">{salaryData.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">IFSC Code:</span>
                    <p className="font-semibold">{salaryData.bankDetails.ifscCode}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Bank Name:</span>
                    <p className="font-semibold">{salaryData.bankDetails.bankName}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>This is a computer-generated salary slip and does not require a signature.</p>
              <p className="mt-1">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlipPage;