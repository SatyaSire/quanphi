// Attendance module types - prepared for future integration

export interface AttendanceRecord {
  id: string;
  workerId: string;
  employeeId: string;
  date: string; // YYYY-MM-DD format
  clockIn?: AttendanceEntry;
  clockOut?: AttendanceEntry;
  status: AttendanceStatus;
  totalHours?: number;
  overtimeHours?: number;
  breakDuration?: number; // in minutes
  projectId?: string;
  department: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceEntry {
  timestamp: string; // ISO string
  method: 'qr_scan' | 'manual' | 'biometric' | 'mobile_app';
  location?: AttendanceLocation;
  deviceInfo?: DeviceInfo;
  qrData?: QRScanData;
  verifiedBy?: string; // For manual entries
}

export interface AttendanceLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
  projectSite?: string;
}

export interface DeviceInfo {
  deviceId: string;
  deviceType: 'mobile' | 'tablet' | 'scanner' | 'web';
  userAgent?: string;
  ipAddress?: string;
}

export interface QRScanData {
  workerId: string;
  employeeId: string;
  name: string;
  department: string;
  project: string;
  employmentType: string;
  timestamp: string;
  version: string;
}

export type AttendanceStatus = 
  | 'present' 
  | 'absent' 
  | 'late' 
  | 'half_day' 
  | 'on_leave' 
  | 'holiday' 
  | 'weekend';

export interface AttendanceSummary {
  workerId: string;
  period: AttendancePeriod;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  leaveDays: number;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  attendancePercentage: number;
}

export interface AttendancePeriod {
  startDate: string;
  endDate: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
}

// QR Code scanning logic interfaces
export interface QRScanResult {
  success: boolean;
  data?: QRScanData;
  error?: string;
  scanType: 'clock_in' | 'clock_out';
  previousScanToday?: AttendanceEntry;
}

export interface AttendanceRule {
  id: string;
  name: string;
  description: string;
  workingHours: {
    startTime: string; // HH:MM format
    endTime: string;
    breakDuration: number; // minutes
  };
  lateThreshold: number; // minutes
  overtimeThreshold: number; // minutes
  weeklyWorkingDays: number[];
  applicableEmploymentTypes: string[];
  applicableDepartments: string[];
  isActive: boolean;
}

// Salary calculation preparation interfaces
export interface SalaryCalculationData {
  workerId: string;
  period: AttendancePeriod;
  attendanceSummary: AttendanceSummary;
  paymentInfo: {
    paymentType: 'daily_wages' | 'weekly_wages' | 'monthly_wages' | 'contract_basis' | 'square_foot' | 'running_foot';
    wageAmount: number;
    salaryAmount?: number;
  };
  deductions?: SalaryDeduction[];
  bonuses?: SalaryBonus[];
}

export interface SalaryDeduction {
  id: string;
  type: 'late_penalty' | 'absent_deduction' | 'advance_deduction' | 'other';
  amount: number;
  description: string;
  date: string;
}

export interface SalaryBonus {
  id: string;
  type: 'overtime_bonus' | 'performance_bonus' | 'project_completion' | 'other';
  amount: number;
  description: string;
  date: string;
}

// API interfaces for future integration
export interface AttendanceAPIEndpoints {
  // QR Code scanning
  scanQRCode: (qrData: string, location?: AttendanceLocation) => Promise<QRScanResult>;
  
  // Attendance records
  getAttendanceRecords: (workerId: string, period: AttendancePeriod) => Promise<AttendanceRecord[]>;
  createAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AttendanceRecord>;
  updateAttendanceRecord: (id: string, updates: Partial<AttendanceRecord>) => Promise<AttendanceRecord>;
  
  // Attendance summary
  getAttendanceSummary: (workerId: string, period: AttendancePeriod) => Promise<AttendanceSummary>;
  
  // Bulk operations
  bulkAttendanceImport: (records: AttendanceRecord[]) => Promise<{ success: number; failed: number; errors: string[] }>;
  
  // Reports
  generateAttendanceReport: (filters: AttendanceReportFilters) => Promise<AttendanceReport>;
}

export interface AttendanceReportFilters {
  workerIds?: string[];
  departments?: string[];
  projects?: string[];
  employmentTypes?: string[];
  period: AttendancePeriod;
  status?: AttendanceStatus[];
}

export interface AttendanceReport {
  id: string;
  title: string;
  filters: AttendanceReportFilters;
  data: AttendanceRecord[];
  summary: {
    totalWorkers: number;
    averageAttendance: number;
    totalWorkingDays: number;
    totalHours: number;
  };
  generatedAt: string;
  generatedBy: string;
}

// Real-time attendance tracking
export interface AttendanceWebSocketEvents {
  'attendance:scan': (data: { workerId: string; scanResult: QRScanResult }) => void;
  'attendance:update': (data: { recordId: string; record: AttendanceRecord }) => void;
  'attendance:alert': (data: { type: 'late_arrival' | 'missing_checkout' | 'overtime'; workerId: string; message: string }) => void;
}

// Configuration for attendance system
export interface AttendanceSystemConfig {
  qrCodeSettings: {
    expirationTime: number; // hours
    encryptionEnabled: boolean;
    allowOfflineScanning: boolean;
  };
  workingHours: {
    defaultStartTime: string;
    defaultEndTime: string;
    defaultBreakDuration: number;
  };
  rules: {
    lateThreshold: number; // minutes
    overtimeThreshold: number; // minutes
    autoClockOutTime: string; // HH:MM
    requireLocationVerification: boolean;
  };
  notifications: {
    lateArrivalAlert: boolean;
    missingCheckoutAlert: boolean;
    overtimeAlert: boolean;
  };
}