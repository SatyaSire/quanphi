import React from 'react';
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';
import { Document } from '../types/workers';

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (document: Document) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isOpen,
  onClose,
  onDownload
}) => {
  const [zoom, setZoom] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);

  if (!isOpen || !document) return null;

  const handleDownload = () => {
    if (onDownload && document) {
      onDownload(document);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  const isImage = (fileName: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return imageExtensions.includes(getFileExtension(fileName));
  };

  const isPDF = (fileName: string) => {
    return getFileExtension(fileName) === 'pdf';
  };

  const isExpired = document.expiryDate && new Date(document.expiryDate) < new Date();
  const isExpiringSoon = document.expiryDate && 
    new Date(document.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl max-h-[95vh] w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {document.fileName}
            </h3>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-gray-600">
                Type: {document.type.replace('_', ' ')}
              </span>
              {document.uploadDate && (
                <span className="text-sm text-gray-600">
                  Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
                </span>
              )}
              {document.expiryDate && (
                <span className={`text-sm px-2 py-1 rounded-full ${
                  isExpired 
                    ? 'bg-red-100 text-red-800'
                    : isExpiringSoon 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isExpired ? 'Expired' : `Expires: ${new Date(document.expiryDate).toLocaleDateString()}`}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Zoom Controls for Images */}
            {isImage(document.fileName) && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
              </>
            )}
            
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {isImage(document.fileName) ? (
            <div className="flex items-center justify-center min-h-full p-4">
              <img
                src={document.url || `/api/documents/${document.id}/preview`}
                alt={document.fileName}
                className="max-w-full max-h-full object-contain transition-transform"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-center py-12">
                <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <p className="text-gray-600">Failed to load image</p>
                <p className="text-sm text-gray-500 mt-2">The image file may be corrupted or unavailable</p>
              </div>
            </div>
          ) : isPDF(document.fileName) ? (
            <div className="w-full h-full">
              <iframe
                src={document.url || `/api/documents/${document.id}/preview`}
                className="w-full h-full border-0"
                title={document.fileName}
                onError={() => {
                  console.error('Failed to load PDF');
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-12">
                <FileText className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Preview Not Available
                </h3>
                <p className="text-gray-600 mb-4">
                  Preview is not supported for this file type
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  File type: {getFileExtension(document.fileName).toUpperCase()}
                </p>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download to View
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Document Info */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Size: {document.size ? `${(document.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</span>
              {document.uploadedBy && (
                <span>Uploaded by: {document.uploadedBy}</span>
              )}
            </div>
            
            {(isExpired || isExpiringSoon) && (
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`h-4 w-4 ${
                  isExpired ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <span className={isExpired ? 'text-red-600' : 'text-yellow-600'}>
                  {isExpired ? 'Document has expired' : 'Document expires soon'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;