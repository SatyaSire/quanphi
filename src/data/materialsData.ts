import {
  Material,
  MaterialCategory,
  PaymentMode,
  PaidBy,
  MaterialStats,
  MaterialStock,
  VendorSummary,
  ProjectMaterialSummary,
  COMMON_UNITS,
  DEFAULT_STOCK_THRESHOLDS
} from '../types/materials';

// Material Units
export const materialUnits = COMMON_UNITS;

// Material Categories with metadata
export const materialCategories = [
  {
    id: MaterialCategory.CEMENT,
    name: 'Cement',
    color: 'bg-gray-100 text-gray-800',
    icon: '🏗️',
    description: 'Cement and binding materials'
  },
  {
    id: MaterialCategory.STEEL,
    name: 'Steel',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔩',
    description: 'Steel bars, rods, and metal components'
  },
  {
    id: MaterialCategory.PAINT,
    name: 'Paint',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🎨',
    description: 'Paints, primers, and coatings'
  },
  {
    id: MaterialCategory.WOOD,
    name: 'Wood',
    color: 'bg-amber-100 text-amber-800',
    icon: '🪵',
    description: 'Timber, plywood, and wooden materials'
  },
  {
    id: MaterialCategory.ELECTRICAL,
    name: 'Electrical',
    color: 'bg-purple-100 text-purple-800',
    icon: '⚡',
    description: 'Wires, switches, and electrical components'
  },
  {
    id: MaterialCategory.PLUMBING,
    name: 'Plumbing',
    color: 'bg-cyan-100 text-cyan-800',
    icon: '🔧',
    description: 'Pipes, fittings, and plumbing materials'
  },
  {
    id: MaterialCategory.MISC,
    name: 'Miscellaneous',
    color: 'bg-green-100 text-green-800',
    icon: '📦',
    description: 'Other construction materials'
  }
];

// Mock Materials Data
export const mockMaterials: Material[] = [
  {
    id: 'mat-1',
    materialName: 'Cement OPC 43 Grade',
    category: MaterialCategory.CEMENT,
    vendorName: 'Ambuja Cement Dealers',
    unit: 'Bag',
    quantityPurchased: 100,
    ratePerUnit: 350,
    totalAmount: 35000,
    projectId: 'proj-1',
    dateOfPurchase: '2024-01-15',
    invoiceNumber: 'INV-2024-001',
    paymentMode: PaymentMode.BANK_TRANSFER,
    paidBy: PaidBy.ADMIN,
    attachments: ['cement-bill-001.pdf'],
    notes: 'High quality cement for foundation work',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'admin@contractorpro.com',
    isDeleted: false,
    stockRemaining: 85
  },
  {
    id: 'mat-2',
    materialName: 'Iron Rod 12mm TMT',
    category: MaterialCategory.STEEL,
    vendorName: 'Tata Steel Distributors',
    unit: 'Kg',
    quantityPurchased: 500,
    ratePerUnit: 65,
    totalAmount: 32500,
    projectId: 'proj-1',
    dateOfPurchase: '2024-01-16',
    invoiceNumber: 'TATA-2024-045',
    paymentMode: PaymentMode.UPI,
    paidBy: PaidBy.SITE_MANAGER,
    attachments: ['steel-invoice-045.pdf'],
    notes: 'TMT bars for reinforcement',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    createdBy: 'sitemanager@contractorpro.com',
    isDeleted: false,
    stockRemaining: 450
  },
  {
    id: 'mat-3',
    materialName: 'Asian Paints Apex Ultima',
    category: MaterialCategory.PAINT,
    vendorName: 'Color World Paint Shop',
    unit: 'Liters',
    quantityPurchased: 50,
    ratePerUnit: 280,
    totalAmount: 14000,
    projectId: 'proj-2',
    dateOfPurchase: '2024-01-17',
    invoiceNumber: 'CW-2024-123',
    paymentMode: PaymentMode.CASH,
    paidBy: PaidBy.SITE_MANAGER,
    attachments: ['paint-receipt-123.jpg'],
    notes: 'Premium exterior paint for walls',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
    createdBy: 'sitemanager@contractorpro.com',
    isDeleted: false,
    stockRemaining: 35
  },
  {
    id: 'mat-4',
    materialName: 'Plywood 18mm Marine Grade',
    category: MaterialCategory.WOOD,
    vendorName: 'Greenply Industries',
    unit: 'Nos',
    quantityPurchased: 25,
    ratePerUnit: 1200,
    totalAmount: 30000,
    projectId: 'proj-1',
    dateOfPurchase: '2024-01-18',
    invoiceNumber: 'GP-2024-789',
    paymentMode: PaymentMode.BANK_TRANSFER,
    paidBy: PaidBy.ADMIN,
    attachments: ['plywood-invoice-789.pdf'],
    notes: 'Marine grade plywood for kitchen cabinets',
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
    createdBy: 'admin@contractorpro.com',
    isDeleted: false,
    stockRemaining: 20
  },
  {
    id: 'mat-5',
    materialName: 'Copper Wire 2.5mm',
    category: MaterialCategory.ELECTRICAL,
    vendorName: 'Havells Electrical Store',
    unit: 'Meter',
    quantityPurchased: 200,
    ratePerUnit: 45,
    totalAmount: 9000,
    projectId: 'proj-2',
    dateOfPurchase: '2024-01-19',
    invoiceNumber: 'HVL-2024-456',
    paymentMode: PaymentMode.UPI,
    paidBy: PaidBy.SITE_MANAGER,
    attachments: ['wire-bill-456.pdf'],
    notes: 'House wiring for electrical installation',
    createdAt: '2024-01-19T16:30:00Z',
    updatedAt: '2024-01-19T16:30:00Z',
    createdBy: 'sitemanager@contractorpro.com',
    isDeleted: false,
    stockRemaining: 150
  },
  {
    id: 'mat-6',
    materialName: 'PVC Pipe 4 inch',
    category: MaterialCategory.PLUMBING,
    vendorName: 'Supreme Pipes & Fittings',
    unit: 'Meter',
    quantityPurchased: 100,
    ratePerUnit: 120,
    totalAmount: 12000,
    projectId: 'proj-1',
    dateOfPurchase: '2024-01-20',
    invoiceNumber: 'SUP-2024-321',
    paymentMode: PaymentMode.CASH,
    paidBy: PaidBy.SITE_MANAGER,
    attachments: ['pipe-receipt-321.jpg'],
    notes: 'Drainage pipes for bathroom',
    createdAt: '2024-01-20T13:20:00Z',
    updatedAt: '2024-01-20T13:20:00Z',
    createdBy: 'sitemanager@contractorpro.com',
    isDeleted: false,
    stockRemaining: 80
  }
];

// Mock Material Stats
export const mockMaterialStats: MaterialStats = {
  todayTotal: 12000,
  weekTotal: 85000,
  monthTotal: 132500,
  totalSpent: 132500,
  totalMaterials: 6,
  lowStockItems: 2
};

// Mock Material Stock Data
export const mockMaterialStock: MaterialStock[] = [
  {
    materialId: 'mat-1',
    materialName: 'Cement OPC 43 Grade',
    category: MaterialCategory.CEMENT,
    projectId: 'proj-1',
    totalPurchased: 100,
    totalUsed: 15,
    currentStock: 85,
    unit: 'Bag',
    threshold: 50,
    isLowStock: false
  },
  {
    materialId: 'mat-2',
    materialName: 'Iron Rod 12mm TMT',
    category: MaterialCategory.STEEL,
    projectId: 'proj-1',
    totalPurchased: 500,
    totalUsed: 50,
    currentStock: 450,
    unit: 'Kg',
    threshold: 100,
    isLowStock: false
  },
  {
    materialId: 'mat-3',
    materialName: 'Asian Paints Apex Ultima',
    category: MaterialCategory.PAINT,
    projectId: 'proj-2',
    totalPurchased: 50,
    totalUsed: 15,
    currentStock: 35,
    unit: 'Liters',
    threshold: 20,
    isLowStock: false
  }
];

// Utility Functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getCategoryById = (categoryId: MaterialCategory) => {
  return materialCategories.find(cat => cat.id === categoryId);
};

export const getPaymentModeColor = (mode: PaymentMode): string => {
  const colors = {
    [PaymentMode.CASH]: 'bg-green-100 text-green-800',
    [PaymentMode.UPI]: 'bg-blue-100 text-blue-800',
    [PaymentMode.BANK_TRANSFER]: 'bg-purple-100 text-purple-800',
    [PaymentMode.CREDIT]: 'bg-orange-100 text-orange-800',
  };
  return colors[mode] || 'bg-gray-100 text-gray-800';
};

export const getPaidByColor = (paidBy: PaidBy): string => {
  const colors = {
    [PaidBy.ADMIN]: 'bg-indigo-100 text-indigo-800',
    [PaidBy.SITE_MANAGER]: 'bg-teal-100 text-teal-800',
  };
  return colors[paidBy] || 'bg-gray-100 text-gray-800';
};

// Filter materials by project
export const getMaterialsByProject = (projectId: string): Material[] => {
  return mockMaterials.filter(material => material.projectId === projectId && !material.isDeleted);
};

// Filter materials by category
export const getMaterialsByCategory = (category: MaterialCategory): Material[] => {
  return mockMaterials.filter(material => material.category === category && !material.isDeleted);
};

// Filter materials by vendor
export const getMaterialsByVendor = (vendorName: string): Material[] => {
  return mockMaterials.filter(material => 
    material.vendorName.toLowerCase().includes(vendorName.toLowerCase()) && !material.isDeleted
  );
};

// Get vendor summary
export const getVendorSummary = (): VendorSummary[] => {
  const vendorMap = new Map<string, VendorSummary>();
  
  mockMaterials.filter(m => !m.isDeleted).forEach(material => {
    const existing = vendorMap.get(material.vendorName);
    if (existing) {
      existing.totalSpent += material.totalAmount;
      existing.totalOrders += 1;
      existing.lastOrderDate = material.dateOfPurchase > existing.lastOrderDate ? 
        material.dateOfPurchase : existing.lastOrderDate;
      if (!existing.materials.includes(material.materialName)) {
        existing.materials.push(material.materialName);
      }
    } else {
      vendorMap.set(material.vendorName, {
        vendorName: material.vendorName,
        totalSpent: material.totalAmount,
        totalOrders: 1,
        lastOrderDate: material.dateOfPurchase,
        materials: [material.materialName]
      });
    }
  });
  
  return Array.from(vendorMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
};

// Get project material summary
export const getProjectMaterialSummary = (): ProjectMaterialSummary[] => {
  const projectMap = new Map<string, ProjectMaterialSummary>();
  
  mockMaterials.filter(m => !m.isDeleted).forEach(material => {
    const existing = projectMap.get(material.projectId);
    if (existing) {
      existing.totalSpent += material.totalAmount;
      existing.materialsCount += 1;
      existing.categoryBreakdown[material.category] = 
        (existing.categoryBreakdown[material.category] || 0) + material.totalAmount;
      existing.lastPurchaseDate = material.dateOfPurchase > existing.lastPurchaseDate ? 
        material.dateOfPurchase : existing.lastPurchaseDate;
    } else {
      projectMap.set(material.projectId, {
        projectId: material.projectId,
        projectName: `Project ${material.projectId}`, // This would come from projects data
        totalSpent: material.totalAmount,
        categoryBreakdown: { [material.category]: material.totalAmount },
        materialsCount: 1,
        lastPurchaseDate: material.dateOfPurchase
      });
    }
  });
  
  return Array.from(projectMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
};

// Check for low stock items
export const getLowStockItems = (): MaterialStock[] => {
  return mockMaterialStock.filter(stock => stock.currentStock <= stock.threshold);
};

// Calculate total stock value
export const calculateStockValue = (): number => {
  return mockMaterials
    .filter(m => !m.isDeleted && m.stockRemaining)
    .reduce((total, material) => {
      return total + (material.stockRemaining! * material.ratePerUnit);
    }, 0);
};

// Check for duplicate material entry
export const checkDuplicateMaterial = (
  materialName: string,
  vendorName: string,
  projectId: string,
  dateOfPurchase: string
): boolean => {
  return mockMaterials.some(material => 
    material.materialName.toLowerCase() === materialName.toLowerCase() &&
    material.vendorName.toLowerCase() === vendorName.toLowerCase() &&
    material.projectId === projectId &&
    material.dateOfPurchase === dateOfPurchase &&
    !material.isDeleted
  );
};

// Function to get all materials including those from localStorage
export const getAllMaterials = (): Material[] => {
  const storedMaterials = JSON.parse(localStorage.getItem('materials') || '[]');
  return [...mockMaterials, ...storedMaterials];
};

// Updated mockMaterials that includes localStorage materials
export const getMockMaterials = (): Material[] => {
  return getAllMaterials();
};

export { COMMON_UNITS, DEFAULT_STOCK_THRESHOLDS };