// Material Types and Interfaces

export interface Material {
  id: string;
  materialName: string;
  category: MaterialCategory;
  vendorName: string;
  unit: string;
  quantityPurchased: number;
  ratePerUnit: number;
  totalAmount: number;
  projectId: string;
  dateOfPurchase: string;
  invoiceNumber?: string;
  paymentMode: PaymentMode;
  paidBy: PaidBy;
  attachments: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isDeleted: boolean;
  stockRemaining?: number;
}

export enum MaterialCategory {
  CEMENT = 'Cement',
  STEEL = 'Steel',
  PAINT = 'Paint',
  WOOD = 'Wood',
  ELECTRICAL = 'Electrical',
  PLUMBING = 'Plumbing',
  MISC = 'Miscellaneous'
}

export enum PaymentMode {
  CASH = 'Cash',
  UPI = 'UPI',
  BANK_TRANSFER = 'Bank Transfer',
  CREDIT = 'Credit'
}

export enum PaidBy {
  ADMIN = 'Admin',
  SITE_MANAGER = 'Site Manager'
}

export interface MaterialFormData {
  materialName: string;
  category: MaterialCategory;
  vendorName: string;
  unit: string;
  quantityPurchased: string | number;
  ratePerUnit: string | number;
  projectId: string;
  dateOfPurchase: string;
  invoiceNumber?: string;
  paymentMode: PaymentMode;
  paidBy: PaidBy;
  attachments: File[];
  notes?: string;
}

export interface MaterialValidationError {
  field: string;
  message: string;
}

export interface MaterialFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  materialName?: string;
  category?: MaterialCategory | '';
  vendorName?: string;
  projectId?: string;
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface MaterialSortOptions {
  field: 'dateOfPurchase' | 'materialName' | 'totalAmount' | 'quantityPurchased';
  direction: 'asc' | 'desc';
}

export interface MaterialStats {
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
  totalSpent: number;
  totalMaterials: number;
  lowStockItems: number;
}

export interface MaterialStock {
  materialId: string;
  materialName: string;
  category: MaterialCategory;
  projectId: string;
  totalPurchased: number;
  totalUsed: number;
  currentStock: number;
  unit: string;
  threshold: number;
  isLowStock: boolean;
}

export interface VendorSummary {
  vendorName: string;
  totalSpent: number;
  totalOrders: number;
  lastOrderDate: string;
  materials: string[];
}

export interface ProjectMaterialSummary {
  projectId: string;
  projectName: string;
  totalSpent: number;
  categoryBreakdown: {
    [key in MaterialCategory]?: number;
  };
  materialsCount: number;
  lastPurchaseDate: string;
}

export interface MaterialReport {
  type: 'project' | 'vendor' | 'category' | 'dateRange';
  data: any[];
  summary: {
    totalAmount: number;
    totalQuantity: number;
    averageRate: number;
  };
  generatedAt: string;
}

// Common units for materials
export const COMMON_UNITS = [
  'Kg',
  'Bag',
  'Ton',
  'Liters',
  'Nos',
  'Meter',
  'Sq Ft',
  'Cubic Ft',
  'Bundle',
  'Roll'
];

// Default thresholds for low stock alerts
export const DEFAULT_STOCK_THRESHOLDS = {
  [MaterialCategory.CEMENT]: 50,
  [MaterialCategory.STEEL]: 100,
  [MaterialCategory.PAINT]: 20,
  [MaterialCategory.WOOD]: 30,
  [MaterialCategory.ELECTRICAL]: 25,
  [MaterialCategory.PLUMBING]: 15,
  [MaterialCategory.MISC]: 10
};