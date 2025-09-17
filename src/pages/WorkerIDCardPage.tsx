import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Printer,
  Edit3,
  User,
  CreditCard,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Worker } from '../types/workers';
import { workersData } from '../data/workersData';
import WorkerIDCard from '../components/common/WorkerIDCard';

const WorkerIDCardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success'>('idle');
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'success'>('idle');

  useEffect(() => {
    // Simulate API call
    const foundWorker = workersData.find(w => w.id === id);
    setWorker(foundWorker || null);
    setLoading(false);
  }, [id]);

  const handleDownload = async () => {
    setDownloadStatus('downloading');
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a canvas to capture the ID card
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx && worker) {
        canvas.width = 400;
        canvas.height = 600;
        
        // Simple ID card generation (in real app, use html2canvas or similar)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#1e40af';
        ctx.fillRect(0, 0, canvas.width, 80);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('Employee ID Card', 20, 30);
        
        ctx.fillStyle = '#000000';
        ctx.font = '16px Arial';
        ctx.fillText(`Name: ${worker.personalInfo.firstName} ${worker.personalInfo.lastName}`, 20, 120);
        ctx.fillText(`ID: ${worker.jobInfo.employeeId}`, 20, 150);
        ctx.fillText(`Department: ${worker.jobInfo.department}`, 20, 180);
        ctx.fillText(`Role: ${worker.jobInfo.role}`, 20, 210);
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${worker.personalInfo.firstName}_${worker.personalInfo.lastName}_ID_Card.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      }
      
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus('idle');
    }
  };

  const handlePrint = () => {
    setPrintStatus('printing');
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow && worker) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Employee ID Card - ${worker.personalInfo.firstName} ${worker.personalInfo.lastName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .id-card { width: 350px; margin: 0 auto; border: 2px solid #333; border-radius: 10px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #1e40af, #3730a3); color: white; padding: 15px; text-align: center; }
                .content { padding: 20px; }
                .field { margin-bottom: 10px; }
                .label { font-weight: bold; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <div class="id-card">
                <div class="header">
                  <h2>Employee ID Card</h2>
                  <p>Construction Management</p>
                </div>
                <div class="content">
                  <div class="field"><span class="label">Name:</span> ${worker.personalInfo.firstName} ${worker.personalInfo.lastName}</div>
                  <div class="field"><span class="label">Employee ID:</span> ${worker.jobInfo.employeeId}</div>
                  <div class="field"><span class="label">Department:</span> ${worker.jobInfo.department}</div>
                  <div class="field"><span class="label">Role:</span> ${worker.jobInfo.role}</div>
                  <div class="field"><span class="label">Employment Type:</span> ${worker.jobInfo.employmentType}</div>
                  <div class="field"><span class="label">Phone:</span> ${worker.personalInfo.phoneNumber}</div>
                  <div class="field"><span class="label">Joining Date:</span> ${new Date(worker.jobInfo.joiningDate).toLocaleDateString()}</div>
                  <div class="field"><span class="label">Status:</span> ${worker.status}</div>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
      
      setPrintStatus('success');
      setTimeout(() => setPrintStatus('idle'), 2000);
    } catch (error) {
      console.error('Print failed:', error);
      setPrintStatus('idle');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Worker Not Found</h2>
          <p className="text-gray-600 mb-4">The worker you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/workers')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Workers
          </button>
        </div>
      </div>
    );
  }

  if (worker.status !== 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ID Card Not Available</h2>
          <p className="text-gray-600 mb-4">
            ID cards can only be generated for active workers. This worker's status is: <span className="font-semibold text-red-600">{worker.status}</span>
          </p>
          <div className="space-x-3">
            <button
              onClick={() => navigate('/workers')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Workers
            </button>
            <Link
              to={`/workers/${worker.id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/workers')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Workers</span>
            </button>
          </div>
          
          {/* Title and Worker Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Employee ID Card
                </h1>
                <p className="text-gray-600">
                  {worker.personalInfo.firstName} {worker.personalInfo.lastName} • {worker.jobInfo.employeeId}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to={`/workers/${worker.id}`}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>View Profile</span>
              </Link>
              <Link
                to={`/workers/${worker.id}/edit`}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Worker</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ID Card Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Digital ID Card</h2>
                <p className="text-gray-600">
                  Professional identification card with QR code for attendance tracking
                </p>
              </div>
              
              <div className="flex justify-center">
                <WorkerIDCard 
                  worker={worker}
                  onDownload={handleDownload}
                  onPrint={handlePrint}
                />
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  disabled={downloadStatus === 'downloading'}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    downloadStatus === 'success'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : downloadStatus === 'downloading'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                  }`}
                >
                  {downloadStatus === 'downloading' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Downloading...</span>
                    </>
                  ) : downloadStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download ID Card</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handlePrint}
                  disabled={printStatus === 'printing'}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    printStatus === 'success'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : printStatus === 'printing'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'
                  }`}
                >
                  {printStatus === 'printing' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span>Printing...</span>
                    </>
                  ) : printStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Print Sent!</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4" />
                      <span>Print ID Card</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* QR Code Information */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">QR Code Usage</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• <strong>First scan:</strong> Login (marks attendance)</p>
                <p>• <strong>Second scan:</strong> Logout (end of shift)</p>
                <p>• Contains worker ID, department, and project info</p>
                <p>• Used for attendance tracking and salary calculations</p>
              </div>
            </div>

            {/* Worker Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Worker Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Employment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    worker.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Employment Type:</span>
                  <span className="text-gray-900 font-medium">
                    {worker.jobInfo.employmentType.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="text-gray-900 font-medium">{worker.jobInfo.department}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerIDCardPage;