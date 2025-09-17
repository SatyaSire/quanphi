import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  Building,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  QrCode,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  MapPin,
  Camera,
  Smartphone,
  Monitor,
  FileText,
  Timer,
  TrendingUp,
  UserCheck,
  UserX,
  Coffee,
  Zap,
  FileDown,
  FileUp,
  X
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, QRScanData } from '../types/attendance';
import { Worker } from '../types/workers';
import { workersData, getWorkerFullName } from '../data/workersData';
import { projects } from '../data/projectsData';
import {
  mockAttendanceRecords,
  getAttendanceStatusColor,
  getAttendanceStatusIcon,
  getTodayAttendanceSummary,
  formatTime,
  formatDate,
  canWorkerScan,
  generateWorkerQRData,
  leaveTypes
} from '../data/attendanceData';
import DataTable from '../components/common/DataTable';
import AttendanceScanner from '../components/attendance/AttendanceScanner';
import ManualAttendanceEntry from '../components/attendance/ManualAttendanceEntry';
import AttendanceReports from '../components/attendance/AttendanceReports';

type ViewMode = 'list' | 'calendar' | 'project';

interface AttendanceFilters {
  search?: string;
  projectId?: string;
  department?: string;
  status?: AttendanceStatus;
  dateFrom?: string;
  dateTo?: string;
  workerId?: string;
}

const AttendancePage: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMarkAllModal, setShowMarkAllModal] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [selectedWorkerForEntry, setSelectedWorkerForEntry] = useState<Worker | null>(null);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [showReports, setShowReports] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Handler for QR scan completion
  const handleQRScan = (qrData: string) => {
    try {
      const scanData: QRScanData = JSON.parse(qrData);
      const worker = workersData.find(w => w.id === scanData.workerId);
      
      if (!worker) {
        alert('Worker not found');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const existingRecord = attendanceRecords.find(r => 
        r.workerId === scanData.workerId && r.date === today
      );

      if (existingRecord && existingRecord.clockOut) {
        alert('Worker has already completed attendance for today');
        return;
      }

      const newRecord: AttendanceRecord = {
        id: `att_${Date.now()}_${scanData.workerId}`,
        workerId: scanData.workerId,
        employeeId: worker.jobInfo.employeeId,
        projectId: scanData.projectId,
        date: today,
        status: 'present' as AttendanceStatus,
        clockIn: existingRecord?.clockIn || {
          timestamp: new Date().toISOString(),
          method: 'qr_scan',
          location: { lat: 0, lng: 0 }
        },
        clockOut: existingRecord?.clockIn ? {
          timestamp: new Date().toISOString(),
          method: 'qr_scan',
          location: { lat: 0, lng: 0 }
        } : undefined,
        department: worker.jobInfo.department,
        employmentType: worker.jobInfo.employmentType,
        createdAt: existingRecord?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      handleScanComplete(newRecord);
      alert(`${existingRecord?.clockIn ? 'Clock out' : 'Clock in'} successful for ${getWorkerFullName(worker)}`);
    } catch (error) {
      alert('Invalid QR code');
    }
  };

  // Handler for export functionality
  const handleExportData = () => {
    const csvContent = [
      ['Date', 'Employee ID', 'Worker Name', 'Project', 'Status', 'Clock In', 'Clock Out', 'Notes'],
      ...filteredRecords.map(record => {
        const worker = getWorkerInfo(record.workerId);
        const project = projects.find(p => p.id === record.projectId);
        return [
          record.date,
          record.employeeId,
          worker ? getWorkerFullName(worker) : 'Unknown Worker',
          project?.name || 'Unknown Project',
          record.status,
          record.clockIn ? new Date(record.clockIn.timestamp).toLocaleString() : '',
          record.clockOut ? new Date(record.clockOut.timestamp).toLocaleString() : '',
          record.notes || ''
        ];
      })
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-records-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
   };

   // Handler for import functionality
   const handleImportData = () => {
     const input = document.createElement('input');
     input.type = 'file';
     input.accept = '.csv';
     input.onchange = (e) => {
       const file = (e.target as HTMLInputElement).files?.[0];
       if (file) {
         const reader = new FileReader();
         reader.onload = (event) => {
           const csv = event.target?.result as string;
           const lines = csv.split('\n');
           const headers = lines[0].split(',');
           
           if (headers.length < 5) {
             alert('Invalid CSV format. Please ensure the file has the correct columns.');
             return;
           }
           
           const importedRecords = lines.slice(1)
             .filter(line => line.trim())
             .map((line, index) => {
               const values = line.split(',');
               return {
                 id: `imported_${Date.now()}_${index}`,
                 workerId: values[1] || '',
                 employeeId: values[1] || '',
                 projectId: projects[0]?.id || 'proj_001',
                 date: values[0] || new Date().toISOString().split('T')[0],
                 status: (values[4] || 'present') as AttendanceStatus,
                 clockIn: values[5] ? {
                   timestamp: new Date(values[5]).toISOString(),
                   location: { lat: 0, lng: 0 },
                   method: 'imported' as const
                 } : undefined,
                 clockOut: values[6] ? {
                   timestamp: new Date(values[6]).toISOString(),
                   location: { lat: 0, lng: 0 }
                 } : undefined,
                 notes: values[7] || 'Imported from CSV'
               };
             });
           
           setAttendanceRecords(prev => [...prev, ...importedRecords]);
           alert(`Successfully imported ${importedRecords.length} attendance records`);
         };
         reader.readAsText(file);
       }
     };
     input.click();
  };

  // Handler for Mark All Present functionality
  const handleMarkAllPresent = () => {
    const today = new Date().toISOString().split('T')[0];
    const presentWorkers = workersData.filter(worker => {
      const existingRecord = attendanceRecords.find(record => 
        record.workerId === worker.id && record.date === today
      );
      return !existingRecord;
    });
    
    if (presentWorkers.length === 0) {
      alert('All workers already have attendance records for today');
      return;
    }
    
    const newRecords = presentWorkers.map(worker => ({
      id: `att_${Date.now()}_${worker.id}`,
      workerId: worker.id,
      employeeId: worker.jobInfo.employeeId,
      projectId: projects[0]?.id || 'proj_001',
      date: today,
      status: 'present' as AttendanceStatus,
      clockIn: {
        timestamp: new Date().toISOString(),
        location: { lat: 0, lng: 0 },
        method: 'manual' as const
      },
      notes: 'Marked present via bulk action',
      department: worker.jobInfo.department,
      employmentType: worker.jobInfo.employmentType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    setAttendanceRecords(prev => [...prev, ...newRecords]);
    alert(`Marked ${presentWorkers.length} workers as present`);
  };

  const [filters, setFilters] = useState<AttendanceFilters>({
    search: '',
    projectId: '',
    department: '',
    status: undefined,
    dateFrom: '',
    dateTo: '',
    workerId: ''
  });

  // Get today's attendance summary
  const todayStats = useMemo(() => getTodayAttendanceSummary(attendanceRecords), [attendanceRecords]);

  // Filter attendance records
  const filteredRecords = useMemo(() => {
    let filtered = attendanceRecords;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(record => {
        const worker = workersData.find(w => w.id === record.workerId);
        const workerName = worker ? getWorkerFullName(worker).toLowerCase() : '';
        return workerName.includes(searchLower) || 
               record.employeeId.toLowerCase().includes(searchLower) ||
               record.department.toLowerCase().includes(searchLower);
      });
    }

    if (filters.projectId) {
      filtered = filtered.filter(record => record.projectId === filters.projectId);
    }

    if (filters.department) {
      filtered = filtered.filter(record => record.department === filters.department);
    }

    if (filters.status) {
      filtered = filtered.filter(record => record.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(record => record.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(record => record.date <= filters.dateTo!);
    }

    if (filters.workerId) {
      filtered = filtered.filter(record => record.workerId === filters.workerId);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendanceRecords, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  // Handle filter changes
  const handleFilterChange = (key: keyof AttendanceFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      projectId: '',
      department: '',
      status: undefined,
      dateFrom: '',
      dateTo: '',
      workerId: ''
    });
    setCurrentPage(1);
  };

  // Handle scan completion
  const handleScanComplete = (record: AttendanceRecord) => {
    const existingIndex = attendanceRecords.findIndex(r => r.id === record.id);
    if (existingIndex >= 0) {
      setAttendanceRecords(prev => 
        prev.map((r, index) => index === existingIndex ? record : r)
      );
    } else {
      setAttendanceRecords(prev => [...prev, record]);
    }
    setShowQRScanner(false);
  };

  // Handle manual entry save
  const handleManualEntrySave = (record: AttendanceRecord) => {
    const existingIndex = attendanceRecords.findIndex(r => r.id === record.id);
    if (existingIndex >= 0) {
      setAttendanceRecords(prev => 
        prev.map((r, index) => index === existingIndex ? record : r)
      );
    } else {
      setAttendanceRecords(prev => [...prev, record]);
    }
    setShowManualEntryModal(false);
    setEditingRecord(null);
    setSelectedWorkerForEntry(null);
  };

  // Handle edit attendance
  const handleEditAttendance = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setShowManualEntryModal(true);
  };



  // Get worker info
  const getWorkerInfo = (workerId: string) => {
    return workersData.find(w => w.id === workerId);
  };

  // Get project info
  const getProjectInfo = (projectId?: string) => {
    return projects.find(p => p.id === projectId);
  };

  // Calendar view helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Render calendar view
  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayRecords = attendanceRecords.filter(r => r.date === dateStr);
      
      days.push(
        <div 
          key={day} 
          className="h-32 border border-gray-200 p-2 overflow-hidden hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => {
            const selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            setSelectedDate(selectedDate);
            setShowManualEntryModal(true);
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-900">{day}</div>
            <Plus className="w-3 h-3 text-gray-400 hover:text-blue-600" />
          </div>
          <div className="space-y-1">
            {dayRecords.slice(0, 4).map(record => {
              const worker = getWorkerInfo(record.workerId);
              const statusColors = {
                present: 'bg-green-100 text-green-800',
                absent: 'bg-red-100 text-red-800',
                late: 'bg-yellow-100 text-yellow-800',
                half_day: 'bg-blue-100 text-blue-800',
                on_leave: 'bg-purple-100 text-purple-800'
              };
              return (
                <div 
                  key={record.id} 
                  className={`text-xs px-2 py-1 rounded-full ${statusColors[record.status]} flex items-center justify-between`}
                  title={worker ? getWorkerFullName(worker) : record.employeeId}
                >
                  <span className="truncate">
                    {worker ? `${worker.personalInfo.firstName.charAt(0)}${worker.personalInfo.lastName.charAt(0)}` : record.employeeId}
                  </span>
                  <span className="ml-1 text-xs opacity-75">
                    {record.status === 'present' ? '✓' : record.status === 'absent' ? '✗' : '!'}
                  </span>
                </div>
              );
            })}
            {dayRecords.length > 4 && (
              <div className="text-xs text-gray-500 text-center">+{dayRecords.length - 4} more</div>
            )}
            {dayRecords.length === 0 && (
              <div className="text-xs text-gray-400 text-center py-2">No records</div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <h3 className="text-xl font-bold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  // Render project view
  const renderProjectView = () => {
    const projectGroups = projects.map(project => {
      const projectRecords = filteredRecords.filter(record => record.projectId === project.id);
      
      // Get stats for all records, not just today
      const stats = {
        total: projectRecords.length,
        present: projectRecords.filter(r => r.status === 'present').length,
        absent: projectRecords.filter(r => r.status === 'absent').length,
        late: projectRecords.filter(r => r.status === 'late').length,
        uniqueWorkers: new Set(projectRecords.map(r => r.workerId)).size
      };
      
      return { project, records: projectRecords, stats };
    });

    return (
      <div className="space-y-6">
        {projectGroups.map(({ project, records, stats }) => (
          <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{project.name}</h3>
                  <p className="text-indigo-100 text-sm">{project.location}</p>
                </div>
                <div className="flex items-center space-x-4 text-white">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs opacity-75">Total Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.uniqueWorkers}</div>
                    <div className="text-xs opacity-75">Workers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.present}</div>
                    <div className="text-xs opacity-75">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.absent}</div>
                    <div className="text-xs opacity-75">Absent</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {records.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {Math.min(records.length, 6)} of {records.length} records
                    </p>
                    {records.length > 6 && (
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View All Records
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {records.slice(0, 6).map(record => {
                      const worker = getWorkerInfo(record.workerId);
                      const statusColors = {
                        present: 'bg-green-50 border-green-200 text-green-800',
                        absent: 'bg-red-50 border-red-200 text-red-800',
                        late: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                        half_day: 'bg-blue-50 border-blue-200 text-blue-800',
                        on_leave: 'bg-purple-50 border-purple-200 text-purple-800'
                      };
                      
                      return (
                        <div key={record.id} className={`p-4 rounded-lg border-2 ${statusColors[record.status]}`}>
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">
                                {worker ? getWorkerFullName(worker) : 'Unknown Worker'}
                              </div>
                              <div className="text-xs opacity-75">{record.employeeId}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="capitalize font-medium">{record.status.replace('_', ' ')}</span>
                            {record.clockIn && (
                              <span>{new Date(record.clockIn.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No attendance records found for this project</p>
                  <p className="text-sm mt-1">Records will appear here once workers start clocking in</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Table columns for list view
  const attendanceColumns = [
    {
      key: 'worker',
      title: 'Worker Details',
      dataIndex: 'workerId',
      sortable: false,
      render: (value: any, record: AttendanceRecord) => {
        const worker = getWorkerInfo(record.workerId);
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {worker ? getWorkerFullName(worker) : 'Unknown Worker'}
                </div>
                <div className="text-xs text-gray-600">{record.employeeId}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">{record.department}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'date',
      title: 'Date / Project',
      dataIndex: 'date',
      sortable: true,
      render: (value: any, record: AttendanceRecord) => {
        const project = getProjectInfo(record.projectId);
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900">{formatDate(record.date)}</span>
            </div>
            {project && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600">{project.name}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      title: 'Status / Hours',
      dataIndex: 'status',
      sortable: false,
      render: (value: any, record: AttendanceRecord) => (
        <div className="space-y-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(record.status)}`}>
            <span className="mr-1">{getAttendanceStatusIcon(record.status)}</span>
            {record.status.replace('_', ' ').toUpperCase()}
          </span>
          {record.totalHours && (
            <div className="flex items-center space-x-2">
              <Timer className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">{record.totalHours}h</span>
              {record.overtimeHours && record.overtimeHours > 0 && (
                <span className="text-xs text-orange-600">+{record.overtimeHours}h OT</span>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'timing',
      title: 'Clock In / Out',
      dataIndex: 'clockIn',
      sortable: false,
      render: (value: any, record: AttendanceRecord) => (
        <div className="space-y-2">
          {record.clockIn && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">{formatTime(record.clockIn.timestamp)}</div>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  {record.clockIn.method === 'qr_scan' && <QrCode className="w-3 h-3" />}
                  {record.clockIn.method === 'manual' && <Edit className="w-3 h-3" />}
                  <span>{record.clockIn.method.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          )}
          {record.clockOut && (
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">{formatTime(record.clockOut.timestamp)}</div>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  {record.clockOut.method === 'qr_scan' && <QrCode className="w-3 h-3" />}
                  {record.clockOut.method === 'manual' && <Edit className="w-3 h-3" />}
                  <span>{record.clockOut.method.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          )}
          {record.clockIn && !record.clockOut && (
            <div className="text-xs text-yellow-600 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Not clocked out</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      sortable: false,
      render: (value: any, record: AttendanceRecord) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditAttendance(record)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit Attendance"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const worker = getWorkerInfo(record.workerId);
              if (worker) {
                setSelectedWorkerForEntry(worker);
                setShowManualEntryModal(true);
              }
            }}
            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
            title="Add Entry"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white">
                        Attendance
                      </h1>
                      <p className="text-xl text-blue-100 mt-2">
                        Track workforce attendance and manage time records
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Workforce Tracking</span>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Action Buttons - Responsive grid layout */}
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
              <button 
                onClick={() => setShowQRScanner(true)}
                className="group relative inline-flex items-center justify-center px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm"
              >
                <QrCode className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">QR Scanner</span>
                <span className="sm:hidden">QR</span>
              </button>
              <button 
                onClick={handleMarkAllPresent}
                className="group relative inline-flex items-center justify-center px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm"
              >
                <UserCheck className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Mark All Present</span>
                <span className="sm:hidden">Mark All</span>
              </button>
              <button 
                onClick={() => setShowManualEntryModal(true)}
                className="group relative inline-flex items-center justify-center px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm"
              >
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Manual Entry</span>
                <span className="sm:hidden">Manual</span>
              </button>
              <button 
                onClick={() => setShowReports(true)}
                className="group relative inline-flex items-center justify-center px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm"
              >
                <Download className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Reports</span>
                <span className="sm:hidden">Reports</span>
              </button>
              <button 
                onClick={handleExportData}
                className="group relative inline-flex items-center justify-center px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm"
              >
                <FileDown className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </button>
              <button 
                onClick={handleImportData}
                className="group relative inline-flex items-center justify-center px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 text-sm"
              >
                <FileUp className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Import</span>
                <span className="sm:hidden">Import</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Present Today</p>
                <p className="text-3xl font-bold">{todayStats.present}</p>
                <p className="text-green-100 text-xs mt-1">Active workers</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <UserCheck className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Absent Today</p>
                <p className="text-3xl font-bold">{todayStats.absent}</p>
                <p className="text-red-100 text-xs mt-1">Missing workers</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <UserX className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">On Leave</p>
                <p className="text-3xl font-bold">{todayStats.onLeave}</p>
                <p className="text-yellow-100 text-xs mt-1">Approved leaves</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Coffee className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Overtime</p>
                <p className="text-3xl font-bold">{todayStats.overtime}</p>
                <p className="text-purple-100 text-xs mt-1">Extra hours</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Zap className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Selector and Filters */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'calendar'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Calendar View
                  </button>
                  <button
                    onClick={() => setViewMode('project')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'project'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Project View
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                    showFilters
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search workers..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select
                    value={filters.projectId}
                    onChange={(e) => handleFilterChange('projectId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Projects</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half_day">Half Day</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content based on view mode */}
        {viewMode === 'calendar' ? (
          renderCalendarView()
        ) : viewMode === 'project' ? (
          renderProjectView()
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Bulk Actions - Top Right */}
            {selectedRecords.length > 0 && (
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-700 font-medium">
                    {selectedRecords.length} record{selectedRecords.length > 1 ? 's' : ''} selected
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        const recordsToUpdate = attendanceRecords.filter(r => selectedRecords.includes(r.id));
                        recordsToUpdate.forEach(record => {
                          if (record.status === 'absent') {
                            const updatedRecord = { ...record, status: 'present' as AttendanceStatus };
                            setAttendanceRecords(prev => prev.map(r => r.id === record.id ? updatedRecord : r));
                          }
                        });
                        setSelectedRecords([]);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-green-300 text-sm leading-4 font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Present
                    </button>
                    <button
                      onClick={() => {
                        setAttendanceRecords(prev => prev.filter(r => !selectedRecords.includes(r.id)));
                        setSelectedRecords([]);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedRecords([])}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            )}
            <DataTable
              columns={attendanceColumns}
              data={paginatedRecords}
              loading={false}
              onSort={() => {}}
              sortField=""
              sortDirection="asc"
              selectable={true}
              selectedRows={selectedRecords}
              onSelectionChange={setSelectedRecords}
            />

            
            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {startIndex + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredRecords.length)}
                </span>{' '}
                of <span className="font-medium">{filteredRecords.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>
                {totalPages > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {currentPage} of{' '}
                      {Math.ceil(filteredRecords.length / itemsPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}



        {/* Mark All Present Modal */}
        {showMarkAllModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mark All Present</h3>
                <p className="text-gray-600 mb-6">This will mark all active workers as present for today. You can adjust individual records later.</p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowMarkAllModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMarkAllPresent}
                    disabled={!selectedProject}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark All Present
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QR Code Scanner</h3>
              <button
                onClick={() => setShowQRScanner(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <AttendanceScanner
              selectedProject={selectedProject}
              onScanComplete={handleScanComplete}
              onClose={() => setShowQRScanner(false)}
            />
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showManualEntryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ManualAttendanceEntry
              worker={selectedWorkerForEntry}
              existingRecord={editingRecord}
              selectedProject={selectedProject}
              onSave={handleManualEntrySave}
              onClose={() => {
                setShowManualEntryModal(false);
                setEditingRecord(null);
                setSelectedWorkerForEntry(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Mark All Present Modal */}
      {showMarkAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mark All Present</h3>
              <button
                onClick={() => setShowMarkAllModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              This will mark all workers as present for {currentDate.toLocaleDateString()}. You can adjust individual records later.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  handleMarkAllPresent();
                  setShowMarkAllModal(false);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowMarkAllModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AttendanceReports onClose={() => setShowReports(false)} />
        </div>
      )}
    </div>
  );
};

export default AttendancePage;