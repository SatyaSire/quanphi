import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Clock,
  MapPin,
  Building,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff
} from 'lucide-react';
import { QRScanData, AttendanceRecord, AttendanceEntry } from '../../types/attendance';
import { Worker } from '../../types/workers';
import { Project } from '../../types/projects';
import { workersData, getWorkerFullName } from '../../data/workersData';
import { projects } from '../../data/projectsData';
import { canWorkerScan, generateWorkerQRData } from '../../data/attendanceData';

interface AttendanceScannerProps {
  selectedProject: string;
  onScanComplete: (record: AttendanceRecord) => void;
  onClose: () => void;
  existingRecords: AttendanceRecord[];
}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error' | 'warning';

interface ScanResult {
  status: ScanStatus;
  message: string;
  worker?: Worker;
  action?: 'clock_in' | 'clock_out';
  record?: AttendanceRecord;
}

const AttendanceScanner: React.FC<AttendanceScannerProps> = ({
  selectedProject,
  onScanComplete,
  onClose,
  existingRecords
}) => {
  const [scanResult, setScanResult] = useState<ScanResult>({ status: 'idle', message: '' });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    timestamp: new Date().toISOString()
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get project info
  const project = projects.find(p => p.id === selectedProject);

  // Simulate QR code scanning
  const handleQRScan = (qrData: string) => {
    setScanResult({ status: 'scanning', message: 'Processing scan...' });

    try {
      const scanData: QRScanData = JSON.parse(qrData);
      const worker = workersData.find(w => w.id === scanData.workerId);

      if (!worker) {
        setScanResult({
          status: 'error',
          message: 'Worker not found in system'
        });
        return;
      }

      // Check if worker is active
      if (worker.status !== 'active') {
        setScanResult({
          status: 'error',
          message: `Worker is ${worker.status}. Cannot mark attendance.`
        });
        return;
      }

      // Check today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = existingRecords.find(r => 
        r.workerId === scanData.workerId && r.date === today
      );

      // Determine action (clock in or clock out)
      let action: 'clock_in' | 'clock_out';
      let message: string;

      if (!todayRecord) {
        // First scan of the day - Clock In
        action = 'clock_in';
        message = `${getWorkerFullName(worker)} clocked in successfully!`;
      } else if (todayRecord.clockIn && !todayRecord.clockOut) {
        // Has clock in, no clock out - Clock Out
        action = 'clock_out';
        message = `${getWorkerFullName(worker)} clocked out successfully!`;
      } else if (todayRecord.clockIn && todayRecord.clockOut) {
        // Already completed both - Warning
        setScanResult({
          status: 'warning',
          message: `${getWorkerFullName(worker)} has already completed attendance for today.`,
          worker
        });
        return;
      } else {
        setScanResult({
          status: 'error',
          message: 'Invalid attendance state'
        });
        return;
      }

      // Validate scan capability
      const scanValidation = canWorkerScan(scanData.workerId, action);
      if (!scanValidation.canScan) {
        setScanResult({
          status: 'error',
          message: scanValidation.reason || 'Cannot scan at this time'
        });
        return;
      }

      // Create attendance entry
      const attendanceEntry: AttendanceEntry = {
        timestamp: new Date().toISOString(),
        method: 'qr_scan',
        location: {
          address: project?.location || 'Construction Site',
          projectSite: selectedProject,
          coordinates: project?.coordinates
        },
        deviceInfo,
        qrData: scanData,
        verifiedBy: 'scanner'
      };

      let newRecord: AttendanceRecord;

      if (action === 'clock_in') {
        // Create new attendance record
        newRecord = {
          id: `att-${scanData.workerId}-${Date.now()}`,
          workerId: scanData.workerId,
          employeeId: scanData.employeeId,
          date: today,
          clockIn: attendanceEntry,
          status: 'present',
          projectId: selectedProject,
          department: scanData.department,
          employmentType: scanData.employmentType as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else {
        // Update existing record with clock out
        const clockInTime = new Date(todayRecord!.clockIn!.timestamp);
        const clockOutTime = new Date();
        const totalHours = Math.round((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60) * 100) / 100;
        const standardHours = 8; // Standard work hours
        const overtimeHours = Math.max(0, totalHours - standardHours);

        newRecord = {
          ...todayRecord!,
          clockOut: attendanceEntry,
          totalHours,
          overtimeHours: overtimeHours > 0 ? overtimeHours : undefined,
          updatedAt: new Date().toISOString()
        };
      }

      setScanResult({
        status: 'success',
        message,
        worker,
        action,
        record: newRecord
      });

      // Call parent callback after a short delay
      setTimeout(() => {
        onScanComplete(newRecord);
      }, 2000);

    } catch (error) {
      setScanResult({
        status: 'error',
        message: 'Invalid QR code format'
      });
    }
  };

  // Get status icon and color
  const getStatusDisplay = () => {
    switch (scanResult.status) {
      case 'scanning':
        return {
          icon: <QrCode className="w-8 h-8 text-blue-600 animate-pulse" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-600" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'error':
        return {
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        };
      default:
        return {
          icon: <Camera className="w-8 h-8 text-gray-600" />,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Attendance Scanner</h3>
                <p className="text-blue-100 text-sm">Scan worker QR code</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-300" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-300" />
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>
          </div>
        </div>

        {/* Project Info */}
        {project && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{project.name}</span>
              {project.location && (
                <>
                  <span className="text-gray-400">•</span>
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{project.location}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Scanner Area */}
        <div className="p-6">
          {/* Status Display */}
          <div className={`${statusDisplay.bgColor} rounded-xl p-6 text-center mb-6`}>
            <div className="flex justify-center mb-3">
              {statusDisplay.icon}
            </div>
            <p className={`${statusDisplay.textColor} font-medium`}>
              {scanResult.message || 'Ready to scan QR code'}
            </p>
            
            {scanResult.worker && (
              <div className="mt-4 p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">
                      {getWorkerFullName(scanResult.worker)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {scanResult.worker.jobInfo.employeeId} • {scanResult.worker.jobInfo.department}
                    </div>
                  </div>
                </div>
                
                {scanResult.action && (
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      {scanResult.action === 'clock_in' ? 'CLOCKED IN' : 'CLOCKED OUT'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Scan Simulation Buttons */}
          {scanResult.status === 'idle' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center mb-4">
                Simulate QR code scanning:
              </p>
              
              <button
                onClick={() => {
                  const qrData = generateWorkerQRData('worker-001', selectedProject);
                  handleQRScan(JSON.stringify(qrData));
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Scan - Rajesh Kumar (EMP001)
              </button>
              
              <button
                onClick={() => {
                  const qrData = generateWorkerQRData('worker-002', selectedProject);
                  handleQRScan(JSON.stringify(qrData));
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Scan - Priya Sharma (EMP002)
              </button>
              
              <button
                onClick={() => {
                  const qrData = generateWorkerQRData('worker-003', selectedProject);
                  handleQRScan(JSON.stringify(qrData));
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Scan - Amit Patel (EMP003)
              </button>
            </div>
          )}

          {/* Device Info */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                {navigator.userAgent.includes('Mobile') ? (
                  <Smartphone className="w-3 h-3" />
                ) : (
                  <Monitor className="w-3 h-3" />
                )}
                <span>Scanner Device</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            {scanResult.status === 'success' ? (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                {(scanResult.status === 'error' || scanResult.status === 'warning') && (
                  <button
                    onClick={() => setScanResult({ status: 'idle', message: '' })}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceScanner;