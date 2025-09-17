import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Worker } from '../../types/workers';
import { getWorkerFullName } from '../../data/workersData';
import { Building, Calendar, MapPin, User, Shield, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import WorkerIDManager from '../../utils/workerIdManager';

interface WorkerIDCardProps {
  worker: Worker;
  onDownload?: () => void;
  onPrint?: () => void;
}

const WorkerIDCard: React.FC<WorkerIDCardProps> = ({ worker, onDownload, onPrint }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string>('');
  const [uniqueCardId, setUniqueCardId] = useState<string>('');
  const idManager = WorkerIDManager.getInstance();

  useEffect(() => {
    generateQRCode();
  }, [worker]);

  const generateQRCode = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setRefreshMessage('');
      
      // Get or create unique worker ID
      const workerIdData = idManager.getOrCreateWorkerID(worker);
      setUniqueCardId(workerIdData.uniqueCardId);
      
      // Create comprehensive data for QR code
      const qrData = idManager.createQRData(worker, workerIdData);

      // Generate professional QR code with enhanced visual design
      const qrString = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 280,
        margin: 4,
        color: {
          dark: '#1e40af', // Professional blue color
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M', // Medium error correction for cleaner appearance
        type: 'image/png',
        quality: 0.95,
        rendererOpts: {
          quality: 0.95
        }
      });
      
      // Create enhanced QR code with professional styling
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const enhancedQR = await new Promise<string>((resolve, reject) => {
        img.onload = () => {
          const padding = 30;
          canvas.width = img.width + (padding * 2);
          canvas.height = img.height + (padding * 2);
          
          // Create subtle gradient background
          const gradient = ctx!.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
          );
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(1, '#f1f5f9');
          
          ctx!.fillStyle = gradient;
          ctx!.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add professional border with shadow effect
          ctx!.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx!.shadowBlur = 10;
          ctx!.shadowOffsetX = 0;
          ctx!.shadowOffsetY = 2;
          
          ctx!.fillStyle = '#ffffff';
          ctx!.fillRect(padding - 5, padding - 5, img.width + 10, img.height + 10);
          
          // Reset shadow for QR code
          ctx!.shadowColor = 'transparent';
          
          // Draw the QR code
          ctx!.drawImage(img, padding, padding);
          
          // Add corner decorations for professional look
          const cornerSize = 15;
          const cornerThickness = 3;
          ctx!.fillStyle = '#1e40af';
          
          // Top-left corner
          ctx!.fillRect(padding - 8, padding - 8, cornerSize, cornerThickness);
          ctx!.fillRect(padding - 8, padding - 8, cornerThickness, cornerSize);
          
          // Top-right corner
          ctx!.fillRect(canvas.width - padding - 7, padding - 8, cornerSize, cornerThickness);
          ctx!.fillRect(canvas.width - padding + 5, padding - 8, cornerThickness, cornerSize);
          
          // Bottom-left corner
          ctx!.fillRect(padding - 8, canvas.height - padding + 5, cornerSize, cornerThickness);
          ctx!.fillRect(padding - 8, canvas.height - padding - 7, cornerThickness, cornerSize);
          
          // Bottom-right corner
          ctx!.fillRect(canvas.width - padding - 7, canvas.height - padding + 5, cornerSize, cornerThickness);
          ctx!.fillRect(canvas.width - padding + 5, canvas.height - padding - 7, cornerThickness, cornerSize);
          
          resolve(canvas.toDataURL('image/png', 0.95));
        };
        
        img.onerror = () => reject(new Error('Failed to enhance QR code'));
        img.src = qrString;
      });
      
      setQrCodeUrl(enhancedQR);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshQR = async () => {
    try {
      setRefreshing(true);
      setRefreshMessage('');
      
      const refreshResult = idManager.refreshQR(worker);
      
      if (refreshResult.success) {
        await generateQRCode(true);
        setRefreshMessage('QR code refreshed successfully!');
      } else {
        setRefreshMessage(refreshResult.message);
      }
    } catch (error) {
      console.error('Error refreshing QR code:', error);
      setRefreshMessage('Error refreshing QR code');
    } finally {
      setRefreshing(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setRefreshMessage(''), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'on_leave': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      case 'temporary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEmploymentType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee ID Card</h2>
        <p className="text-gray-600">Front and Back View</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* FRONT SIDE */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-3 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative text-center">
              <h3 className="text-lg font-bold tracking-wide">THE SOLUTIONIST</h3>
              <p className="text-blue-100 text-xs font-medium">Employee ID Card</p>
              <div className="absolute top-0 right-0 bg-white/20 px-2 py-1 rounded text-xs font-bold">
                FRONT
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Worker Photo and Basic Info */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={worker.personalInfo.profilePicture || `https://ui-avatars.com/api/?name=${getWorkerFullName(worker)}&background=6366f1&color=fff&size=120`}
                  alt={getWorkerFullName(worker)}
                  className="w-24 h-24 rounded-xl object-cover border-4 border-gray-200 mx-auto"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white ${
                  getStatusColor(worker.status)
                }`}></div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  {getWorkerFullName(worker)}
                </h4>
                <p className="text-gray-600 font-medium mb-1">{worker.jobInfo.role}</p>
                <p className="text-sm text-gray-500">{worker.jobInfo.designation}</p>
                
                <div className="mt-3 space-y-2">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <span className="text-xs font-medium text-gray-500 block">Employee ID</span>
                    <span className="text-lg font-mono font-bold text-gray-800">
                      {worker.jobInfo.employeeId}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2">
                    <span className="text-xs font-medium text-blue-600 block">Card ID</span>
                    <span className="text-sm font-mono font-bold text-blue-800">
                      {uniqueCardId || 'Generating...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Department</span>
                </div>
                <span className="font-medium text-gray-900">{worker.jobInfo.department}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">Joined</span>
                </div>
                <span className="font-medium text-gray-900">
                  {new Date(worker.jobInfo.joiningDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Status</span>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                  getEmploymentTypeColor(worker.jobInfo.employmentType)
                }`}>
                  {formatEmploymentType(worker.jobInfo.employmentType)}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">Construction Management Solutions</p>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-600 px-6 py-3 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative text-center">
              <h3 className="text-lg font-bold tracking-wide">THE SOLUTIONIST</h3>
              <p className="text-blue-100 text-xs font-medium">Attendance & Verification</p>
              <div className="absolute top-0 right-0 bg-white/20 px-2 py-1 rounded text-xs font-bold">
                BACK
              </div>
            </div>
          </div>

          <div className="p-6">

            {/* QR Code Section */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center border border-blue-200 mb-6">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="text-sm font-semibold text-gray-900">Attendance QR Code</h4>
                <button
                  onClick={handleRefreshQR}
                  disabled={refreshing || loading}
                  className="ml-auto flex items-center px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
          
          {/* Refresh Message */}
          {refreshMessage && (
            <div className={`mb-3 p-2 rounded-md text-xs ${
              refreshMessage.includes('successfully') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : refreshMessage.includes('No changes') 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center justify-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {refreshMessage}
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative">
                <img 
                  src={qrCodeUrl} 
                  alt="Attendance QR Code" 
                  className="w-32 h-32 border-2 border-blue-300 rounded-xl bg-white p-2 shadow-lg"
                />
                {/* QR Code Overlay Branding */}
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded font-bold">
                  TSL
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3 max-w-xs font-medium">
                Scan this QR code to mark attendance<br/>
                <span className="text-blue-600">First scan = Login • Second scan = Logout</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Powered by The Solutionist
              </p>
            </div>
          )}
        </div>

            {/* Employment Details */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Employment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position:</span>
                    <span className="font-medium">{worker.jobInfo.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{worker.jobInfo.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employment Type:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getEmploymentTypeColor(worker.jobInfo.employmentType)
                    }`}>
                      {formatEmploymentType(worker.jobInfo.employmentType)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined Date:</span>
                    <span className="font-medium">
                      {new Date(worker.jobInfo.joiningDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      worker.status === 'active' ? 'bg-green-100 text-green-800' :
                      worker.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      worker.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {worker.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Validity */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Card Validity</h4>
                <div className="text-sm text-blue-800">
                  <div>Valid Until: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</div>
                  <div>Generated: {new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>
            </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Valid for active employment</span>
            <span>Generated: {new Date().toLocaleDateString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 px-6 py-4 flex space-x-3">
        <button
          onClick={onDownload}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          Download ID
        </button>
        <button
          onClick={onPrint}
          className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors text-sm"
        >
          Print ID
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default WorkerIDCard;