import { Document, DocumentCategory, DocumentStats } from '../types/documents';

export const documentCategories: DocumentCategory[] = [
  {
    id: 'worker-docs',
    name: 'Worker Documents',
    icon: 'Users',
    color: 'blue',
    description: 'Personal documents and certificates for workers',
    subcategories: ['Identity Proof', 'Address Proof', 'Bank Details', 'Certificates', 'Training Records'],
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'docx'],
    maxFileSize: 10,
    requiresExpiry: true
  },
  {
    id: 'project-docs',
    name: 'Project Documents',
    icon: 'Building',
    color: 'green',
    description: 'Project-related contracts, blueprints, and permits',
    subcategories: ['Contracts', 'Blueprints', 'Permits', 'Approvals', 'Inspection Reports'],
    allowedFileTypes: ['pdf', 'dwg', 'docx', 'xlsx', 'jpg', 'png'],
    maxFileSize: 50,
    requiresExpiry: true
  },
  {
    id: 'financial-docs',
    name: 'Financial Documents',
    icon: 'DollarSign',
    color: 'yellow',
    description: 'Invoices, bills, and financial records',
    subcategories: ['Invoices', 'Bills', 'Salary Slips', 'Tax Documents', 'Bank Statements'],
    allowedFileTypes: ['pdf', 'xlsx', 'docx'],
    maxFileSize: 20,
    requiresExpiry: false
  },
  {
    id: 'legal-docs',
    name: 'Legal & Compliance',
    icon: 'Shield',
    color: 'red',
    description: 'Legal documents and compliance certificates',
    subcategories: ['GST Registration', 'Licenses', 'Agreements', 'Compliance Certificates', 'Legal Notices'],
    allowedFileTypes: ['pdf', 'docx'],
    maxFileSize: 25,
    requiresExpiry: true
  },
  {
    id: 'custom-docs',
    name: 'Custom Documents',
    icon: 'FolderOpen',
    color: 'purple',
    description: 'Custom document categories created by admin',
    subcategories: ['Miscellaneous', 'Templates', 'Reports', 'Presentations'],
    allowedFileTypes: ['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'png'],
    maxFileSize: 30,
    requiresExpiry: false
  }
];

export const documentsData: Document[] = [
  {
    id: 'doc-001',
    name: 'Aadhaar Card - Rajesh Kumar',
    fileName: 'rajesh_aadhaar.pdf',
    fileSize: 2.5,
    fileType: 'pdf',
    category: documentCategories[0],
    subcategory: 'Identity Proof',
    uploadDate: '2024-01-15T10:30:00Z',
    expiryDate: '2034-01-15T00:00:00Z',
    version: 1,
    versions: [
      {
        id: 'v1',
        version: 1,
        fileName: 'rajesh_aadhaar.pdf',
        fileSize: 2.5,
        uploadDate: '2024-01-15T10:30:00Z',
        uploadedBy: { id: 'admin-1', name: 'Admin User' },
        fileUrl: '/documents/rajesh_aadhaar.pdf'
      }
    ],
    uploadedBy: {
      id: 'admin-1',
      name: 'Admin User',
      role: 'Administrator'
    },
    linkedEntity: {
      type: 'worker',
      id: 'worker-001',
      name: 'Rajesh Kumar'
    },
    tags: ['identity', 'mandatory', 'government-id'],
    notes: 'Primary identity document for worker onboarding',
    status: 'active',
    accessLevel: 'restricted',
    downloadCount: 5,
    lastAccessed: '2024-01-20T14:22:00Z',
    isEncrypted: true,
    thumbnailUrl: '/thumbnails/rajesh_aadhaar_thumb.jpg',
    fileUrl: '/documents/rajesh_aadhaar.pdf'
  },
  {
    id: 'doc-002',
    name: 'Site Plan - Residential Complex A',
    fileName: 'residential_complex_a_plan.pdf',
    fileSize: 15.8,
    fileType: 'pdf',
    category: documentCategories[1],
    subcategory: 'Blueprints',
    uploadDate: '2024-01-10T09:15:00Z',
    version: 2,
    versions: [
      {
        id: 'v1',
        version: 1,
        fileName: 'residential_complex_a_plan_v1.pdf',
        fileSize: 14.2,
        uploadDate: '2024-01-05T09:15:00Z',
        uploadedBy: { id: 'manager-1', name: 'Site Manager' },
        fileUrl: '/documents/residential_complex_a_plan_v1.pdf'
      },
      {
        id: 'v2',
        version: 2,
        fileName: 'residential_complex_a_plan.pdf',
        fileSize: 15.8,
        uploadDate: '2024-01-10T09:15:00Z',
        uploadedBy: { id: 'manager-1', name: 'Site Manager' },
        fileUrl: '/documents/residential_complex_a_plan.pdf'
      }
    ],
    uploadedBy: {
      id: 'manager-1',
      name: 'Site Manager',
      role: 'Site Manager'
    },
    linkedEntity: {
      type: 'project',
      id: 'project-001',
      name: 'Residential Complex A'
    },
    tags: ['blueprint', 'architectural', 'approved'],
    notes: 'Updated site plan with revised specifications',
    status: 'active',
    accessLevel: 'public',
    downloadCount: 12,
    lastAccessed: '2024-01-22T11:45:00Z',
    isEncrypted: false,
    thumbnailUrl: '/thumbnails/site_plan_thumb.jpg',
    fileUrl: '/documents/residential_complex_a_plan.pdf'
  },
  {
    id: 'doc-003',
    name: 'Invoice - Material Supply Jan 2024',
    fileName: 'material_invoice_jan_2024.pdf',
    fileSize: 1.2,
    fileType: 'pdf',
    category: documentCategories[2],
    subcategory: 'Invoices',
    uploadDate: '2024-01-25T16:20:00Z',
    version: 1,
    versions: [
      {
        id: 'v1',
        version: 1,
        fileName: 'material_invoice_jan_2024.pdf',
        fileSize: 1.2,
        uploadDate: '2024-01-25T16:20:00Z',
        uploadedBy: { id: 'accountant-1', name: 'Accountant' },
        fileUrl: '/documents/material_invoice_jan_2024.pdf'
      }
    ],
    uploadedBy: {
      id: 'accountant-1',
      name: 'Accountant',
      role: 'Accountant'
    },
    tags: ['invoice', 'materials', 'january'],
    notes: 'Monthly material supply invoice',
    status: 'active',
    accessLevel: 'restricted',
    downloadCount: 3,
    lastAccessed: '2024-01-26T09:30:00Z',
    isEncrypted: true,
    thumbnailUrl: '/thumbnails/invoice_thumb.jpg',
    fileUrl: '/documents/material_invoice_jan_2024.pdf'
  },
  {
    id: 'doc-004',
    name: 'GST Registration Certificate',
    fileName: 'gst_registration_cert.pdf',
    fileSize: 0.8,
    fileType: 'pdf',
    category: documentCategories[3],
    subcategory: 'GST Registration',
    uploadDate: '2024-01-01T12:00:00Z',
    expiryDate: '2025-12-31T23:59:59Z',
    version: 1,
    versions: [
      {
        id: 'v1',
        version: 1,
        fileName: 'gst_registration_cert.pdf',
        fileSize: 0.8,
        uploadDate: '2024-01-01T12:00:00Z',
        uploadedBy: { id: 'admin-1', name: 'Admin User' },
        fileUrl: '/documents/gst_registration_cert.pdf'
      }
    ],
    uploadedBy: {
      id: 'admin-1',
      name: 'Admin User',
      role: 'Administrator'
    },
    tags: ['gst', 'registration', 'legal', 'tax'],
    notes: 'Company GST registration certificate',
    status: 'active',
    accessLevel: 'confidential',
    downloadCount: 8,
    lastAccessed: '2024-01-18T15:10:00Z',
    isEncrypted: true,
    thumbnailUrl: '/thumbnails/gst_cert_thumb.jpg',
    fileUrl: '/documents/gst_registration_cert.pdf'
  },
  {
    id: 'doc-005',
    name: 'Safety Training Certificate - Amit Singh',
    fileName: 'amit_safety_training.pdf',
    fileSize: 1.5,
    fileType: 'pdf',
    category: documentCategories[0],
    subcategory: 'Training Records',
    uploadDate: '2024-01-12T14:45:00Z',
    expiryDate: '2025-01-12T00:00:00Z',
    version: 1,
    versions: [
      {
        id: 'v1',
        version: 1,
        fileName: 'amit_safety_training.pdf',
        fileSize: 1.5,
        uploadDate: '2024-01-12T14:45:00Z',
        uploadedBy: { id: 'hr-1', name: 'HR Manager' },
        fileUrl: '/documents/amit_safety_training.pdf'
      }
    ],
    uploadedBy: {
      id: 'hr-1',
      name: 'HR Manager',
      role: 'HR Manager'
    },
    linkedEntity: {
      type: 'worker',
      id: 'worker-002',
      name: 'Amit Singh'
    },
    tags: ['training', 'safety', 'certificate', 'mandatory'],
    notes: 'Completed basic safety training course',
    status: 'active',
    accessLevel: 'public',
    downloadCount: 2,
    lastAccessed: '2024-01-15T10:20:00Z',
    isEncrypted: false,
    thumbnailUrl: '/thumbnails/training_cert_thumb.jpg',
    fileUrl: '/documents/amit_safety_training.pdf'
  },
  {
    id: 'doc-006',
    name: 'Building Permit - Commercial Plaza',
    fileName: 'commercial_plaza_permit.pdf',
    fileSize: 3.2,
    fileType: 'pdf',
    category: documentCategories[1],
    subcategory: 'Permits',
    uploadDate: '2024-01-08T11:30:00Z',
    expiryDate: '2024-12-31T23:59:59Z',
    version: 1,
    versions: [
      {
        id: 'v1',
        version: 1,
        fileName: 'commercial_plaza_permit.pdf',
        fileSize: 3.2,
        uploadDate: '2024-01-08T11:30:00Z',
        uploadedBy: { id: 'manager-2', name: 'Project Manager' },
        fileUrl: '/documents/commercial_plaza_permit.pdf'
      }
    ],
    uploadedBy: {
      id: 'manager-2',
      name: 'Project Manager',
      role: 'Project Manager'
    },
    linkedEntity: {
      type: 'project',
      id: 'project-002',
      name: 'Commercial Plaza'
    },
    tags: ['permit', 'building', 'government', 'approved'],
    notes: 'Municipal building permit for commercial construction',
    status: 'active',
    accessLevel: 'restricted',
    downloadCount: 7,
    lastAccessed: '2024-01-21T13:15:00Z',
    isEncrypted: true,
    thumbnailUrl: '/thumbnails/permit_thumb.jpg',
    fileUrl: '/documents/commercial_plaza_permit.pdf'
  },
  {
    id: 'doc-007',
    name: 'Expired License - Heavy Equipment',
    fileName: 'heavy_equipment_license.pdf',
    fileSize: 0.9,
    fileType: 'pdf',
    category: documentCategories[3],
    subcategory: 'Licenses',
    uploadDate: '2023-06-15T09:00:00Z',
    expiryDate: '2024-01-15T23:59:59Z',
    version: 1,
    versions: [
      {
        id: 'v1',
        version: 1,
        fileName: 'heavy_equipment_license.pdf',
        fileSize: 0.9,
        uploadDate: '2023-06-15T09:00:00Z',
        uploadedBy: { id: 'admin-1', name: 'Admin User' },
        fileUrl: '/documents/heavy_equipment_license.pdf'
      }
    ],
    uploadedBy: {
      id: 'admin-1',
      name: 'Admin User',
      role: 'Administrator'
    },
    tags: ['license', 'equipment', 'expired', 'renewal-required'],
    notes: 'License expired - renewal required urgently',
    status: 'expired',
    accessLevel: 'restricted',
    downloadCount: 15,
    lastAccessed: '2024-01-16T08:45:00Z',
    isEncrypted: true,
    thumbnailUrl: '/thumbnails/license_thumb.jpg',
    fileUrl: '/documents/heavy_equipment_license.pdf'
  },
  {
    id: 'doc-008',
    name: 'Monthly Report Template',
    fileName: 'monthly_report_template.docx',
    fileSize: 0.5,
    fileType: 'docx',
    category: documentCategories[4],
    subcategory: 'Templates',
    uploadDate: '2024-01-20T16:00:00Z',
    version: 1,
    versions: [
      {
        id: 'v1',
        version: 1,
        fileName: 'monthly_report_template.docx',
        fileSize: 0.5,
        uploadDate: '2024-01-20T16:00:00Z',
        uploadedBy: { id: 'admin-1', name: 'Admin User' },
        fileUrl: '/documents/monthly_report_template.docx'
      }
    ],
    uploadedBy: {
      id: 'admin-1',
      name: 'Admin User',
      role: 'Administrator'
    },
    tags: ['template', 'report', 'monthly', 'standard'],
    notes: 'Standard template for monthly progress reports',
    status: 'active',
    accessLevel: 'public',
    downloadCount: 25,
    lastAccessed: '2024-01-24T12:30:00Z',
    isEncrypted: false,
    fileUrl: '/documents/monthly_report_template.docx'
  }
];

export const documentStats: DocumentStats = {
  totalDocuments: documentsData.length,
  uploadedToday: 2,
  uploadedThisMonth: 8,
  expiringThisWeek: 1,
  expiringThisMonth: 3,
  expiredDocuments: 1,
  documentsByCategory: {
    'Worker Documents': 2,
    'Project Documents': 2,
    'Financial Documents': 1,
    'Legal & Compliance': 2,
    'Custom Documents': 1
  },
  documentsByStatus: {
    'active': 7,
    'expired': 1,
    'archived': 0,
    'pending': 0
  },
  totalStorageUsed: 25.4,
  averageFileSize: 3.2
};

export const getDocumentById = (id: string): Document | undefined => {
  return documentsData.find(doc => doc.id === id);
};

export const getDocumentsByCategory = (categoryId: string): Document[] => {
  return documentsData.filter(doc => doc.category.id === categoryId);
};

export const getDocumentsByWorker = (workerId: string): Document[] => {
  return documentsData.filter(doc => 
    doc.linkedEntity?.type === 'worker' && doc.linkedEntity.id === workerId
  );
};

export const getDocumentsByProject = (projectId: string): Document[] => {
  return documentsData.filter(doc => 
    doc.linkedEntity?.type === 'project' && doc.linkedEntity.id === projectId
  );
};

export const getExpiringDocuments = (days: number = 30): Document[] => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return documentsData.filter(doc => {
    if (!doc.expiryDate) return false;
    const expiryDate = new Date(doc.expiryDate);
    return expiryDate <= futureDate && expiryDate >= new Date();
  });
};

export const getExpiredDocuments = (): Document[] => {
  const now = new Date();
  return documentsData.filter(doc => {
    if (!doc.expiryDate) return false;
    return new Date(doc.expiryDate) < now;
  });
};