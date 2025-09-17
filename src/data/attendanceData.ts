import { AttendanceRecord, AttendanceStatus, AttendanceSummary, QRScanData } from '../types/attendance';
import { workersData } from './workersData';
import { projects } from './projectsData';

// Mock attendance data
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-001',
    workerId: 'WKR001',
    employeeId: 'EMP001',
    date: '2024-01-15',
    clockIn: {
      timestamp: '2024-01-15T08:30:00Z',
      method: 'qr_scan',
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'Construction Site A',
        projectSite: 'Residential Complex'
      },
      qrData: {
        workerId: 'WKR001',
        employeeId: 'EMP001',
        name: 'Rajesh Kumar',
        department: 'Construction',
        project: 'Residential Complex',
        employmentType: 'full-time',
        timestamp: '2024-01-15T08:30:00Z',
        version: '1.0'
      }
    },
    clockOut: {
      timestamp: '2024-01-15T17:45:00Z',
      method: 'qr_scan',
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'Construction Site A',
        projectSite: 'Residential Complex'
      }
    },
    status: 'present',
    totalHours: 9.25,
    overtimeHours: 1.25,
    projectId: 'proj-001',
    department: 'Construction',
    employmentType: 'full-time',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T17:45:00Z'
  },
  {
    id: 'att-002',
    workerId: 'WKR002',
    employeeId: 'EMP002',
    date: '2024-01-15',
    status: 'absent',
    projectId: 'proj-001',
    department: 'Electrical',
    employmentType: 'contract',
    notes: 'Sick leave - medical certificate provided',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'att-003',
    workerId: 'WKR003',
    employeeId: 'EMP003',
    date: '2024-01-15',
    clockIn: {
      timestamp: '2024-01-15T09:15:00Z',
      method: 'manual',
      verifiedBy: 'site-manager-001'
    },
    clockOut: {
      timestamp: '2024-01-15T13:00:00Z',
      method: 'qr_scan'
    },
    status: 'half_day',
    totalHours: 3.75,
    projectId: 'proj-002',
    department: 'Plumbing',
    employmentType: 'part-time',
    notes: 'Half day - personal work',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T13:00:00Z'
  }
];

// Attendance status colors
export const getAttendanceStatusColor = (status: AttendanceStatus): string => {
  switch (status) {
    case 'present':
      return 'bg-green-100 text-green-800';
    case 'absent':
      return 'bg-red-100 text-red-800';
    case 'late':
      return 'bg-yellow-100 text-yellow-800';
    case 'half_day':
      return 'bg-blue-100 text-blue-800';
    case 'on_leave':
      return 'bg-purple-100 text-purple-800';
    case 'holiday':
      return 'bg-gray-100 text-gray-800';
    case 'weekend':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Attendance status icons
export const getAttendanceStatusIcon = (status: AttendanceStatus): string => {
  switch (status) {
    case 'present':
      return '✓';
    case 'absent':
      return '✗';
    case 'late':
      return '⏰';
    case 'half_day':
      return '◐';
    case 'on_leave':
      return '🏖️';
    case 'holiday':
      return '🎉';
    case 'weekend':
      return '📅';
    default:
      return '?';
  }
};

// Calculate total hours from clock in/out
export const calculateTotalHours = (clockIn?: string, clockOut?: string): number => {
  if (!clockIn || !clockOut) return 0;
  
  const inTime = new Date(clockIn);
  const outTime = new Date(clockOut);
  const diffMs = outTime.getTime() - inTime.getTime();
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
};

// Calculate overtime hours
export const calculateOvertimeHours = (totalHours: number, standardHours: number = 8): number => {
  return totalHours > standardHours ? totalHours - standardHours : 0;
};

// Generate QR data for worker
export const generateWorkerQRData = (workerId: string, projectId?: string): QRScanData => {
  const worker = workersData.find(w => w.id === workerId);
  const project = projects.find(p => p.id === projectId);
  
  if (!worker) {
    throw new Error('Worker not found');
  }
  
  return {
    workerId: worker.id,
    employeeId: worker.jobInfo.employeeId,
    name: `${worker.personalInfo.firstName} ${worker.personalInfo.lastName}`,
    department: worker.jobInfo.department,
    project: project?.name || 'General',
    employmentType: worker.jobInfo.employmentType,
    timestamp: new Date().toISOString(),
    version: '1.0'
  };
};

// Mock attendance summary data
export const mockAttendanceSummary: AttendanceSummary[] = [
  {
    workerId: 'WKR001',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      type: 'monthly'
    },
    totalWorkingDays: 22,
    presentDays: 20,
    absentDays: 2,
    lateDays: 3,
    halfDays: 1,
    leaveDays: 1,
    totalHours: 176,
    regularHours: 160,
    overtimeHours: 16,
    attendancePercentage: 90.9
  }
];

// Get attendance records for a specific worker
export const getWorkerAttendanceRecords = (workerId: string, startDate?: string, endDate?: string): AttendanceRecord[] => {
  let records = mockAttendanceRecords.filter(record => record.workerId === workerId);
  
  if (startDate) {
    records = records.filter(record => record.date >= startDate);
  }
  
  if (endDate) {
    records = records.filter(record => record.date <= endDate);
  }
  
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get attendance records for a specific project
export const getProjectAttendanceRecords = (projectId: string, date?: string): AttendanceRecord[] => {
  let records = mockAttendanceRecords.filter(record => record.projectId === projectId);
  
  if (date) {
    records = records.filter(record => record.date === date);
  }
  
  return records;
};

// Get today's attendance summary
export const getTodayAttendanceSummary = (records: AttendanceRecord[] = mockAttendanceRecords) => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(record => record.date === today);
  
  // Get active workers count
  const activeWorkers = workersData.filter(w => w.status === 'active');
  const totalActiveWorkers = activeWorkers.length;
  
  // Count workers with attendance records for today
  const workersWithRecords = new Set(todayRecords.map(r => r.workerId));
  
  const present = todayRecords.filter(r => r.status === 'present').length;
  const late = todayRecords.filter(r => r.status === 'late').length;
  const halfDay = todayRecords.filter(r => r.status === 'half_day').length;
  const onLeave = todayRecords.filter(r => r.status === 'on_leave').length;
  const explicitAbsent = todayRecords.filter(r => r.status === 'absent').length;
  
  // Workers without any attendance record are considered absent
  const workersWithoutRecords = totalActiveWorkers - workersWithRecords.size;
  const totalAbsent = explicitAbsent + workersWithoutRecords;
  
  return {
    total: totalActiveWorkers,
    present: present + late + halfDay, // All who showed up
    absent: totalAbsent,
    late: late,
    halfDay: halfDay,
    onLeave: onLeave,
    overtime: todayRecords.filter(r => r.overtimeHours && r.overtimeHours > 0).length
  };
};

// Format time for display
export const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Check if worker can scan QR (prevent duplicate scans)
export const canWorkerScan = (workerId: string, scanType: 'clock_in' | 'clock_out'): { canScan: boolean; reason?: string } => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = mockAttendanceRecords.find(r => r.workerId === workerId && r.date === today);
  
  if (!todayRecord) {
    return scanType === 'clock_in' ? { canScan: true } : { canScan: false, reason: 'No clock-in record found for today' };
  }
  
  if (scanType === 'clock_in' && todayRecord.clockIn) {
    return { canScan: false, reason: 'Already clocked in today' };
  }
  
  if (scanType === 'clock_out' && !todayRecord.clockIn) {
    return { canScan: false, reason: 'Must clock in first' };
  }
  
  if (scanType === 'clock_out' && todayRecord.clockOut) {
    return { canScan: false, reason: 'Already clocked out today' };
  }
  
  return { canScan: true };
};

// Leave types
export const leaveTypes = [
  { id: 'sick', name: 'Sick Leave', color: 'bg-red-100 text-red-800' },
  { id: 'casual', name: 'Casual Leave', color: 'bg-blue-100 text-blue-800' },
  { id: 'paid', name: 'Paid Leave', color: 'bg-green-100 text-green-800' },
  { id: 'unpaid', name: 'Unpaid Leave', color: 'bg-gray-100 text-gray-800' },
  { id: 'maternity', name: 'Maternity Leave', color: 'bg-pink-100 text-pink-800' },
  { id: 'paternity', name: 'Paternity Leave', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'emergency', name: 'Emergency Leave', color: 'bg-orange-100 text-orange-800' }
];

// Get leave type by id
export const getLeaveTypeById = (id: string) => {
  return leaveTypes.find(type => type.id === id);
};