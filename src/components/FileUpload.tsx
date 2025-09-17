import React, { useState, useCallback } from 'react';
import {
  Upload,
  FileText,
  Camera,
  X,
  Eye,
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  showPreviews?: boolean;
  className?: string;
}

interface FilePreview {
  file: File;
  preview?: string;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 5,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  showPreviews = true,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const processFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const errors: string[] = [];
    const validFiles: File[] = [];
    const previews: FilePreview[] = [];

    // Check total file count
    if (files.length + fileArray.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      setUploadErrors(errors);
      return;
    }

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
        const preview: FilePreview = { file };
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            preview.preview = e.target?.result as string;
            setFilePreviews(prev => {
              const updated = [...prev];
              const index = updated.findIndex(p => p.file === file);
              if (index !== -1) {
                updated[index] = preview;
              }
              return updated;
            });
          };
          reader.readAsDataURL(file);
        }
        
        previews.push(preview);
      }
    });

    if (errors.length > 0) {
      setUploadErrors(errors);
    } else {
      setUploadErrors([]);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      onFilesChange(updatedFiles);
      setFilePreviews(prev => [...prev, ...previews]);
    }
  }, [files, maxFiles, maxFileSize, acceptedTypes, onFilesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [processFiles]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
    setFilePreviews(updatedPreviews);
    setUploadErrors([]);
  }, [files, filePreviews, onFilesChange]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 ${
            dragActive ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <div className="mt-4">
            <label className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {dragActive ? 'Drop files here' : 'Drop files here or click to upload'}
              </span>
              <input
                type="file"
                multiple
                accept={acceptedTypes.join(',')}
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {acceptedTypes.join(', ').toUpperCase()} up to {maxFileSize}MB each • Max {maxFiles} files
          </p>
          {files.length > 0 && (
            <p className="mt-1 text-xs text-blue-600">
              {files.length} of {maxFiles} files selected
            </p>
          )}
        </div>
      </div>

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Errors</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {uploadErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Previews */}
      {showPreviews && files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">
              Uploaded Files ({files.length})
            </h4>
            {files.length > 0 && (
              <button
                onClick={() => {
                  onFilesChange([]);
                  setFilePreviews([]);
                  setUploadErrors([]);
                }}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => {
              const preview = filePreviews.find(p => p.file === file);
              const isImage = file.type.startsWith('image/');
              const isPDF = file.type === 'application/pdf';
              
              return (
                <div key={`${file.name}-${index}`} className="border border-gray-200 rounded-lg p-3 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center min-w-0 flex-1">
                      {isPDF ? (
                        <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                      ) : isImage ? (
                        <Camera className="h-8 w-8 text-blue-500 flex-shrink-0" />
                      ) : (
                        <FileText className="h-8 w-8 text-gray-500 flex-shrink-0" />
                      )}
                      <div className="ml-3 min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => downloadFile(file)}
                        className="text-gray-400 hover:text-blue-500 p-1"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {isImage && preview?.preview && (
                    <div className="mt-2">
                      <img
                        src={preview.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded border"
                      />
                    </div>
                  )}
                  
                  {/* Upload Status */}
                  <div className="mt-2 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">Ready to upload</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;