import React, { useState, useRef } from 'react';
import { QrCode, Download, Printer, User, Building, Calendar, MapPin } from 'lucide-react';
import { Worker } from '../../types/workers';
import { generateWorkerQRData } from '../../data/attendanceData';

interface QRCodeGeneratorProps {
  worker: Worker;
  projectId?: string;
  onClose?: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ worker, projectId, onClose }) => {
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate QR data
  const qrData = generateWorkerQRData(worker.id, selectedProject);
  const qrString = JSON.stringify(qrData);

  // Simple QR code representation (in real app, use a QR library like qrcode.js)
  const generateQRPattern = (data: string) => {
    const size = 21; // Standard QR code size
    const pattern = [];
    
    // Create a simple pattern based on data hash
    const hash = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Create pattern based on position and hash
        const value = (i * size + j + hash) % 3;
        row.push(value === 0);
      }
      pattern.push(row);
    }
    
    return pattern;
  };

  const qrPattern = generateQRPattern(qrString);

  const handleDownload = () => {
    // In a real app, this would generate and download the QR code image
    const element = document.createElement('a');
    const file = new Blob([qrString], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${worker.personalInfo.firstName}_${worker.personalInfo.lastName}_QR.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Worker QR ID</h3>
              <p className="text-blue-100 text-sm">Attendance Scanner</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <span className="text-white text-xl">×</span>
            </button>
          )}
        </div>
      </div>

      {/* ID Card Front */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-4 border-2 border-dashed border-gray-300">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">
              {worker.personalInfo.firstName} {worker.personalInfo.lastName}
            </h4>
            <p className="text-gray-600 text-sm">{worker.jobInfo.employeeId}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Department:</span>
              <span className="font-medium text-gray-900">{worker.jobInfo.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-gray-900">{worker.jobInfo.position}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium text-gray-900">
                {worker.jobInfo.employmentType.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
          <h5 className="text-lg font-bold text-gray-900 mb-4">Scan for Attendance</h5>
          
          {/* QR Code Display */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-300 inline-block mb-4">
            <div 
              ref={qrRef}
              className="grid gap-0 bg-white p-2"
              style={{ 
                gridTemplateColumns: `repeat(${qrPattern.length}, 1fr)`,
                width: '200px',
                height: '200px'
              }}
            >
              {qrPattern.flat().map((filled, index) => (
                <div
                  key={index}
                  className={`aspect-square ${filled ? 'bg-black' : 'bg-white'}`}
                  style={{ width: '100%', height: '100%' }}
                />
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Unique ID: {worker.id}</p>
            <p>Generated: {new Date().toLocaleDateString()}</p>
            {selectedProject && (
              <p>Project: {selectedProject}</p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <h6 className="font-semibold text-blue-900 mb-2">How to Use:</h6>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Show this QR code to site manager</li>
            <li>• First scan = Clock In</li>
            <li>• Second scan = Clock Out</li>
            <li>• Cannot be reused after clock out</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;