import React, { useState, useMemo } from 'react';
import {
  X,
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Filter,
  FileText,
  Eye
} from 'lucide-react';
import { PaymentCalculationResult } from '../../utils/paymentCalculations';

interface PayrollReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentCalculationResult[];
}

type ReportType = 'cost_analysis' | 'worker_summary' | 'trend_analysis' | 'department_breakdown';
type TimeRange = 'week' | 'month' | 'quarter' | 'year';

interface CostAnalysis {
  totalPayroll: number;
  totalWorkers: number;
  averageWage: number;
  overtimeCosts: number;
  advanceDeductions: number;
  netPayouts: number;
}

interface WorkerSummary {
  workerId: string;
  workerName: string;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  hoursWorked: number;
  daysWorked: number;
  overtimeHours: number;
}

const PayrollReportsModal: React.FC<PayrollReportsModalProps> = ({
  isOpen,
  onClose,
  paymentData
}) => {
  const [activeReport, setActiveReport] = useState<ReportType>('cost_analysis');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  if (!isOpen) return null;

  // Calculate cost analysis
  const costAnalysis = useMemo((): CostAnalysis => {
    const totalPayroll = paymentData.reduce((sum, payment) => sum + payment.grossPay, 0);
    const totalWorkers = paymentData.length;
    const averageWage = totalWorkers > 0 ? totalPayroll / totalWorkers : 0;
    const overtimeCosts = paymentData.reduce((sum, payment) => sum + payment.overtimePay, 0);
    const advanceDeductions = paymentData.reduce((sum, payment) => sum + payment.advanceDeduction, 0);
    const netPayouts = paymentData.reduce((sum, payment) => sum + payment.netPay, 0);

    return {
      totalPayroll,
      totalWorkers,
      averageWage,
      overtimeCosts,
      advanceDeductions,
      netPayouts
    };
  }, [paymentData]);

  // Calculate worker summaries
  const workerSummaries = useMemo((): WorkerSummary[] => {
    return paymentData.map(payment => ({
      workerId: payment.workerId,
      workerName: payment.workerName,
      totalEarnings: payment.grossPay,
      totalDeductions: payment.totalDeductions,
      netPay: payment.netPay,
      hoursWorked: payment.hoursWorked,
      daysWorked: payment.daysWorked,
      overtimeHours: payment.overtimeHours
    }));
  }, [paymentData]);

  // Calculate department breakdown
  const departmentBreakdown = useMemo(() => {
    const departments = paymentData.reduce((acc, payment) => {
      const dept = payment.department || 'General';
      if (!acc[dept]) {
        acc[dept] = {
          name: dept,
          workers: 0,
          totalCost: 0,
          averageWage: 0
        };
      }
      acc[dept].workers += 1;
      acc[dept].totalCost += payment.netPay;
      return acc;
    }, {} as Record<string, any>);

    Object.values(departments).forEach((dept: any) => {
      dept.averageWage = dept.totalCost / dept.workers;
    });

    return Object.values(departments);
  }, [paymentData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleExport = () => {
    // In a real implementation, this would generate and download a report
    alert('Export functionality would be implemented here');
  };

  const renderCostAnalysis = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Payroll</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(costAnalysis.totalPayroll)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Net Payouts</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(costAnalysis.netPayouts)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Workers</p>
              <p className="text-2xl font-bold text-purple-900">{costAnalysis.totalWorkers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Average Wage</p>
              <p className="text-2xl font-bold text-orange-900">{formatCurrency(costAnalysis.averageWage)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Overtime Costs</p>
              <p className="text-2xl font-bold text-red-900">{formatCurrency(costAnalysis.overtimeCosts)}</p>
            </div>
            <Clock className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Advance Deductions</p>
              <p className="text-2xl font-bold text-yellow-900">{formatCurrency(costAnalysis.advanceDeductions)}</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Cost Breakdown Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization would be implemented here</p>
            <p className="text-sm text-gray-400">Using libraries like Chart.js or Recharts</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkerSummary = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Worker Payment Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Worker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Pay
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workerSummaries.map((worker) => (
                <tr key={worker.workerId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{worker.workerName}</div>
                      <div className="text-sm text-gray-500">ID: {worker.workerId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{worker.hoursWorked}h</div>
                    <div className="text-sm text-gray-500">{worker.daysWorked} days</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(worker.totalEarnings)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatCurrency(worker.totalDeductions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(worker.netPay)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDepartmentBreakdown = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departmentBreakdown.map((dept: any) => (
          <div key={dept.name} className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{dept.name}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Workers:</span>
                <span className="text-sm font-medium text-gray-900">{dept.workers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Cost:</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(dept.totalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Wage:</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(dept.averageWage)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeReport) {
      case 'cost_analysis':
        return renderCostAnalysis();
      case 'worker_summary':
        return renderWorkerSummary();
      case 'department_breakdown':
        return renderDepartmentBreakdown();
      case 'trend_analysis':
        return (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Trend Analysis</h3>
            <p className="text-gray-600">Historical trend analysis would be implemented here</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Payroll Reports & Analytics</h2>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'cost_analysis', label: 'Cost Analysis', icon: DollarSign },
              { id: 'worker_summary', label: 'Worker Summary', icon: Users },
              { id: 'department_breakdown', label: 'Departments', icon: PieChart },
              { id: 'trend_analysis', label: 'Trends', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveReport(id as ReportType)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeReport === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PayrollReportsModal;