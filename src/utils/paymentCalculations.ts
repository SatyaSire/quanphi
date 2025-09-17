import { Worker } from '../types/workers';
import { AttendanceRecord, AttendanceSummary } from '../types/attendance';
import { mockAttendanceRecords, getAttendanceSummary } from '../data/attendanceData';
import { workersData } from '../data/workersData';

export interface PaymentCalculationResult {
  workerId: string;
  workerName: string;
  workerRole: string;
  profilePicture?: string;
  payrollPeriod: string;
  hoursWorked: number;
  overtimeHours: number;
  grossPay: number;
  deductions: number;
  advances: number;
  netPay: number;
  paymentStatus: 'paid' | 'pending' | 'partial' | 'failed';
  paymentMethod: 'bank_transfer' | 'upi' | 'cash' | 'mixed';
  paymentDate?: string;
  projectId: string;
  projectName: string;
  wageType: 'daily' | 'hourly' | 'fixed';
  dailyWage?: number;
  hourlyRate?: number;
  fixedSalary?: number;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  upiId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentPeriod {
  startDate: string;
  endDate: string;
  type: 'weekly' | 'bi-weekly' | 'monthly';
}

export interface AdvancePayment {
  id: string;
  workerId: string;
  amount: number;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'adjusted';
}

export interface PaymentDeduction {
  id: string;
  workerId: string;
  type: 'late_penalty' | 'absent_deduction' | 'advance_adjustment' | 'loan_deduction' | 'other';
  amount: number;
  description: string;
  date: string;
}

// Auto-fetch worker details with payment preferences
export const getWorkerPaymentProfile = (workerId: string): Worker | null => {
  return workersData.find(worker => worker.id === workerId) || null;
};

// Get attendance data for salary calculation
export const getWorkerAttendanceData = (workerId: string, period: PaymentPeriod): AttendanceRecord[] => {
  return mockAttendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);
    
    return record.workerId === workerId && 
           recordDate >= startDate && 
           recordDate <= endDate;
  });
};

// Calculate working hours from attendance data
export const calculateWorkingHours = (attendanceRecords: AttendanceRecord[]) => {
  let totalHours = 0;
  let overtimeHours = 0;
  let presentDays = 0;
  
  attendanceRecords.forEach(record => {
    if (record.status === 'present' || record.status === 'late') {
      presentDays++;
      totalHours += record.totalHours || 0;
      overtimeHours += record.overtimeHours || 0;
    } else if (record.status === 'half_day') {
      presentDays += 0.5;
      totalHours += (record.totalHours || 0);
    }
  });
  
  return {
    totalHours,
    overtimeHours,
    presentDays,
    regularHours: totalHours - overtimeHours
  };
};

// Wage calculation logic based on worker type
export const calculateWages = (
  worker: Worker,
  attendanceData: ReturnType<typeof calculateWorkingHours>,
  period: PaymentPeriod
): { grossPay: number; wageType: 'daily' | 'hourly' | 'fixed' } => {
  const paymentInfo = worker.paymentInfo;
  
  // Determine wage type based on payment info
  let wageType: 'daily' | 'hourly' | 'fixed';
  let grossPay = 0;
  
  switch (paymentInfo.paymentType) {
    case 'daily_wages':
      wageType = 'daily';
      grossPay = paymentInfo.wageAmount * attendanceData.presentDays;
      break;
      
    case 'monthly_wages':
      wageType = 'fixed';
      // For fixed salary, calculate based on working days in month
      const totalWorkingDaysInPeriod = getWorkingDaysInPeriod(period);
      const attendancePercentage = attendanceData.presentDays / totalWorkingDaysInPeriod;
      grossPay = (paymentInfo.salaryAmount || paymentInfo.wageAmount) * attendancePercentage;
      break;
      
    default:
      // Treat as hourly if not specified
      wageType = 'hourly';
      const hourlyRate = paymentInfo.wageAmount / 8; // Assuming 8-hour workday
      grossPay = hourlyRate * attendanceData.totalHours;
      break;
  }
  
  // Add overtime pay (1.5x regular rate)
  if (attendanceData.overtimeHours > 0) {
    const overtimeRate = wageType === 'daily' 
      ? (paymentInfo.wageAmount / 8) * 1.5
      : wageType === 'hourly'
      ? (paymentInfo.wageAmount / 8) * 1.5
      : ((paymentInfo.salaryAmount || paymentInfo.wageAmount) / (getWorkingDaysInPeriod(period) * 8)) * 1.5;
    
    grossPay += overtimeRate * attendanceData.overtimeHours;
  }
  
  return { grossPay, wageType };
};

// Calculate deductions
export const calculateDeductions = (
  workerId: string,
  period: PaymentPeriod,
  advances: AdvancePayment[] = [],
  otherDeductions: PaymentDeduction[] = []
): number => {
  let totalDeductions = 0;
  
  // Advance adjustments
  const pendingAdvances = advances.filter(advance => 
    advance.workerId === workerId && 
    advance.status === 'approved' &&
    new Date(advance.date) <= new Date(period.endDate)
  );
  
  totalDeductions += pendingAdvances.reduce((sum, advance) => sum + advance.amount, 0);
  
  // Other deductions
  const periodDeductions = otherDeductions.filter(deduction =>
    deduction.workerId === workerId &&
    new Date(deduction.date) >= new Date(period.startDate) &&
    new Date(deduction.date) <= new Date(period.endDate)
  );
  
  totalDeductions += periodDeductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  
  return totalDeductions;
};

// Get working days in period (excluding weekends)
export const getWorkingDaysInPeriod = (period: PaymentPeriod): number => {
  const startDate = new Date(period.startDate);
  const endDate = new Date(period.endDate);
  let workingDays = 0;
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      workingDays++;
    }
  }
  
  return workingDays;
};

// Generate payment calculation for a worker
export const generateWorkerPayment = (
  workerId: string,
  period: PaymentPeriod,
  advances: AdvancePayment[] = [],
  deductions: PaymentDeduction[] = [],
  projectName: string = 'Default Project'
): PaymentCalculationResult | null => {
  const worker = getWorkerPaymentProfile(workerId);
  if (!worker) return null;
  
  const attendanceRecords = getWorkerAttendanceData(workerId, period);
  const attendanceData = calculateWorkingHours(attendanceRecords);
  const { grossPay, wageType } = calculateWages(worker, attendanceData, period);
  const totalDeductions = calculateDeductions(workerId, period, advances, deductions);
  const advanceAmount = advances
    .filter(a => a.workerId === workerId && a.status === 'approved')
    .reduce((sum, a) => sum + a.amount, 0);
  
  const netPay = Math.max(0, grossPay - totalDeductions);
  
  return {
    workerId: worker.id,
    workerName: `${worker.personalInfo.firstName} ${worker.personalInfo.lastName}`,
    workerRole: worker.jobInfo.role,
    profilePicture: worker.personalInfo.profilePicture,
    payrollPeriod: `${period.startDate} to ${period.endDate}`,
    hoursWorked: attendanceData.totalHours,
    overtimeHours: attendanceData.overtimeHours,
    grossPay,
    deductions: totalDeductions,
    advances: advanceAmount,
    netPay,
    paymentStatus: 'pending',
    paymentMethod: worker.paymentInfo.paymentPreference as any,
    projectId: worker.jobInfo.currentProject || 'default',
    projectName,
    wageType,
    dailyWage: wageType === 'daily' ? worker.paymentInfo.wageAmount : undefined,
    hourlyRate: wageType === 'hourly' ? worker.paymentInfo.wageAmount / 8 : undefined,
    fixedSalary: wageType === 'fixed' ? (worker.paymentInfo.salaryAmount || worker.paymentInfo.wageAmount) : undefined,
    bankDetails: {
      accountNumber: `****${worker.paymentInfo.accountNumber.slice(-4)}`,
      ifscCode: worker.paymentInfo.ifscCode,
      bankName: worker.paymentInfo.bankName
    },
    upiId: worker.paymentInfo.upiId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Batch payment generation for multiple workers
export const generateBatchPayments = (
  workerIds: string[],
  period: PaymentPeriod,
  advances: AdvancePayment[] = [],
  deductions: PaymentDeduction[] = []
): PaymentCalculationResult[] => {
  return workerIds
    .map(workerId => generateWorkerPayment(workerId, period, advances, deductions))
    .filter((payment): payment is PaymentCalculationResult => payment !== null);
};

// Error handling for missing attendance data
export const validatePaymentData = (workerId: string, period: PaymentPeriod): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const worker = getWorkerPaymentProfile(workerId);
  if (!worker) {
    errors.push('Worker profile not found');
    return { isValid: false, errors, warnings };
  }
  
  const attendanceRecords = getWorkerAttendanceData(workerId, period);
  if (attendanceRecords.length === 0) {
    warnings.push('No attendance data found for the specified period');
  }
  
  if (!worker.paymentInfo.bankName || !worker.paymentInfo.accountNumber) {
    warnings.push('Incomplete bank details');
  }
  
  if (!worker.paymentInfo.wageAmount && !worker.paymentInfo.salaryAmount) {
    errors.push('No wage/salary amount specified');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};