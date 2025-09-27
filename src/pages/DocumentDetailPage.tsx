import React from 'react';
import { FileText } from 'lucide-react';

// Temporary placeholder component - original code commented out due to JSX parsing issues
const DocumentDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Detail Page</h2>
        <p className="text-gray-600">This page is temporarily unavailable for maintenance.</p>
      </div>
    </div>
  );
};

export default DocumentDetailPage;