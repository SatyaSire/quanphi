import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  Eye
} from 'lucide-react';
import { ExpenseAttachment } from '../types/expenses';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: (File | ExpenseAttachment)[];
  initialIndex?: number;
  title?: string;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  files,
  initialIndex = 0,
  title = 'File Preview'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const currentFile = files[currentIndex];

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(100);
      setRotation(0);
      setPreviewUrl(null);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (currentFile && isOpen) {
      if (currentFile instanceof File) {
        // Handle File objects
        if (currentFile.type.startsWith('image/')) {
          const url = URL.createObjectURL(currentFile);
          setPreviewUrl(url);
          return () => URL.revokeObjectURL(url);
        }
      } else {
        // Handle ExpenseAttachment objects
        if (currentFile.fileType.startsWith('image/')) {
          setPreviewUrl(currentFile.fileUrl);
        }
      }
    }
  }, [currentFile, isOpen]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
    setZoom(100);
    setRotation(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
    setZoom(100);
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (currentFile instanceof File) {
      const url = URL.createObjectURL(currentFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Handle ExpenseAttachment download
      const a = document.createElement('a');
      a.href = currentFile.fileUrl;
      a.download = currentFile.fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getFileName = (file: File | ExpenseAttachment): string => {
    return file instanceof File ? file.name : file.fileName;
  };

  const getFileSize = (file: File | ExpenseAttachment): string => {
    const bytes = file instanceof File ? file.size : file.fileSize;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (file: File | ExpenseAttachment): string => {
    return file instanceof File ? file.type : file.fileType;
  };

  const isImage = (file: File | ExpenseAttachment): boolean => {
    return getFileType(file).startsWith('image/');
  };

  const isPDF = (file: File | ExpenseAttachment): boolean => {
    return getFileType(file) === 'application/pdf';
  };

  if (!isOpen || !currentFile) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <div className="text-sm text-gray-500">
              {currentIndex + 1} of {files.length}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Navigation */}
            {files.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="Previous file"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="Next file"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-2" />
              </>
            )}
            
            {/* Image Controls */}
            {isImage(currentFile) && (
              <>
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 25}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom out"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 300}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom in"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="Rotate"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-2" />
              </>
            )}
            
            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            
            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
          {isImage(currentFile) && previewUrl ? (
            <div className="max-w-full max-h-full overflow-auto">
              <img
                src={previewUrl}
                alt={getFileName(currentFile)}
                className="max-w-none transition-transform duration-200"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
              />
            </div>
          ) : isPDF(currentFile) ? (
            <div className="text-center">
              <FileText className="h-24 w-24 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getFileName(currentFile)}
              </h3>
              <p className="text-gray-600 mb-4">
                PDF files cannot be previewed inline
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download to View
              </button>
            </div>
          ) : (
            <div className="text-center">
              <FileText className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getFileName(currentFile)}
              </h3>
              <p className="text-gray-600 mb-4">
                This file type cannot be previewed
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download File
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-medium">{getFileName(currentFile)}</span>
              <span className="ml-2">({getFileSize(currentFile)})</span>
            </div>
            {files.length > 1 && (
              <div className="flex items-center space-x-2">
                <span>Use arrow keys to navigate</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Keyboard navigation
const useKeyboardNavigation = (
  isOpen: boolean,
  onPrevious: () => void,
  onNext: () => void,
  onClose: () => void
) => {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNext();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrevious, onNext, onClose]);
};

export default FilePreviewModal;
export { useKeyboardNavigation };