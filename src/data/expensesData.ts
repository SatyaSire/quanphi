import { 
  Expense, 
  ExpenseCategory, 
  ExpenseCategoryType, 
  PaymentMode, 
  PaidBy,
  ExpenseSummary,
  MonthlyExpense,
  ProjectExpenseSummary,
  ExpenseStats,
  CategoryBreakdown
} from '../types/expenses';

// Predefined expense categories
export const expenseCategories: ExpenseCategory[] = [
  {
    id: 'cat-1',
    name: ExpenseCategoryType.MATERIALS,
    color: '#3B82F6',
    icon: '🧱',
    order: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-2',
    name: ExpenseCategoryType.LABOR,
    color: '#10B981',
    icon: '👷',
    order: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-3',
    name: ExpenseCategoryType.TRAVEL_TRANSPORT,
    color: '#F59E0B',
    icon: '🚛',
    order: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-4',
    name: ExpenseCategoryType.SITE_SETUP,
    color: '#8B5CF6',
    icon: '🏗️',
    order: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-5',
    name: ExpenseCategoryType.FOOD_LODGING,
    color: '#EF4444',
    icon: '🍽️',
    order: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-6',
    name: ExpenseCategoryType.TOOLS_EQUIPMENT,
    color: '#6B7280',
    icon: '🔧',
    order: 6,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-7',
    name: ExpenseCategoryType.OFFICE_ADMIN,
    color: '#EC4899',
    icon: '📋',
    order: 7,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-8',
    name: ExpenseCategoryType.MISCELLANEOUS,
    color: '#64748B',
    icon: '📦',
    order: 8,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Sample expenses data
export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    date: '2024-01-15',
    projectId: 'proj-1',
    projectName: 'Residential Complex A',
    categoryId: 'cat-1',
    categoryName: ExpenseCategoryType.MATERIALS,
    description: 'Cement for basement slab - 10 bags',
    vendorName: 'Local Cement Supplier',
    amount: 4500,
    paymentMode: PaymentMode.CASH,
    paidBy: PaidBy.SITE_MANAGER,
    attachments: [
      {
        id: 'att-1',
        fileName: 'cement_bill.pdf',
        fileUrl: '/uploads/cement_bill.pdf',
        fileType: 'application/pdf',
        fileSize: 245760,
        uploadedAt: '2024-01-15T10:30:00Z'
      }
    ],
    notes: 'Urgent purchase for foundation work',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'user-2',
    isDeleted: false
  },
  {
    id: 'exp-2',
    date: '2024-01-14',
    projectId: 'proj-2',
    projectName: 'Commercial Plaza B',
    categoryId: 'cat-2',
    categoryName: ExpenseCategoryType.LABOR,
    description: 'Electrical contractor payment',
    vendorName: 'ABC Electrical Works',
    amount: 15000,
    paymentMode: PaymentMode.BANK_TRANSFER,
    paidBy: PaidBy.ADMIN,
    attachments: [],
    notes: 'Phase 1 electrical work completion',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    createdBy: 'user-1',
    isDeleted: false
  },
  {
    id: 'exp-3',
    date: '2024-01-13',
    projectId: 'proj-1',
    projectName: 'Residential Complex A',
    categoryId: 'cat-3',
    categoryName: ExpenseCategoryType.TRAVEL_TRANSPORT,
    description: 'Material transportation from warehouse',
    vendorName: 'City Transport Services',
    amount: 2500,
    paymentMode: PaymentMode.UPI,
    paidBy: PaidBy.SITE_MANAGER,
    attachments: [
      {
        id: 'att-2',
        fileName: 'transport_receipt.jpg',
        fileUrl: '/uploads/transport_receipt.jpg',
        fileType: 'image/jpeg',
        fileSize: 156432,
        uploadedAt: '2024-01-13T16:45:00Z'
      }
    ],
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-13T16:45:00Z',
    createdBy: 'user-2',
    isDeleted: false
  },
  {
    id: 'exp-4',
    date: '2024-01-12',
    projectId: 'proj-3',
    projectName: 'Office Building C',
    categoryId: 'cat-6',
    categoryName: ExpenseCategoryType.TOOLS_EQUIPMENT,
    description: 'Power drill and accessories',
    vendorName: 'Hardware Store',
    amount: 8500,
    paymentMode: PaymentMode.CASH,
    paidBy: PaidBy.WORKER,
    attachments: [],
    notes: 'Tools for interior work',
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-12T11:15:00Z',
    createdBy: 'user-3',
    isDeleted: false
  },
  {
    id: 'exp-5',
    date: '2024-01-11',
    projectId: 'proj-2',
    projectName: 'Commercial Plaza B',
    categoryId: 'cat-5',
    categoryName: ExpenseCategoryType.FOOD_LODGING,
    description: 'Worker lunch for 15 people',
    vendorName: 'Local Caterer',
    amount: 1200,
    paymentMode: PaymentMode.CASH,
    paidBy: PaidBy.SITE_MANAGER,
    attachments: [],
    createdAt: '2024-01-11T13:30:00Z',
    updatedAt: '2024-01-11T13:30:00Z',
    createdBy: 'user-2',
    isDeleted: false
  },
  {
    id: 'exp-6',
    date: '2024-01-10',
    projectId: 'proj-1',
    projectName: 'Residential Complex A',
    categoryId: 'cat-1',
    categoryName: ExpenseCategoryType.MATERIALS,
    description: 'Steel rods - 2 tons',
    vendorName: 'Steel Suppliers Ltd',
    amount: 85000,
    paymentMode: PaymentMode.CHEQUE,
    paidBy: PaidBy.ADMIN,
    attachments: [
      {
        id: 'att-3',
        fileName: 'steel_invoice.pdf',
        fileUrl: '/uploads/steel_invoice.pdf',
        fileType: 'application/pdf',
        fileSize: 324567,
        uploadedAt: '2024-01-10T09:20:00Z'
      }
    ],
    notes: 'High-grade steel for structural work',
    createdAt: '2024-01-10T09:20:00Z',
    updatedAt: '2024-01-10T09:20:00Z',
    createdBy: 'user-1',
    isDeleted: false
  }
];

// Mock expense summary data
export const mockExpenseSummary: ExpenseSummary = {
  totalExpenses: 6,
  totalAmount: 116700,
  categoryBreakdown: [
    {
      id: 'cat-1',
      name: ExpenseCategoryType.MATERIALS,
      value: 89500,
      count: 3,
      percentage: 76.7,
      color: '#3B82F6'
    },
    {
      id: 'cat-2',
      name: ExpenseCategoryType.SUBCONTRACTORS,
      value: 15000,
      count: 1,
      percentage: 12.9,
      color: '#10B981'
    },
    {
      id: 'cat-6',
      name: ExpenseCategoryType.TOOLS_EQUIPMENT,
      value: 8500,
      count: 1,
      percentage: 7.3,
      color: '#6B7280'
    },
    {
      id: 'cat-3',
      name: ExpenseCategoryType.TRAVEL,
      value: 2500,
      count: 1,
      percentage: 2.1,
      color: '#F59E0B'
    },
    {
      id: 'cat-5',
      name: ExpenseCategoryType.MEALS,
      value: 1200,
      count: 1,
      percentage: 1.0,
      color: '#EF4444'
    }
  ],
  monthlyTrend: [
    { month: 'Dec 2023', amount: 95000, count: 8 },
    { month: 'Jan 2024', amount: 116700, count: 6 },
  ],
  topProjects: [
    {
      projectId: 'proj-1',
      projectName: 'Residential Complex A',
      totalAmount: 92000,
      expenseCount: 3,
      budget: 500000,
      budgetUtilization: 18.4
    },
    {
      projectId: 'proj-2',
      projectName: 'Commercial Plaza B',
      totalAmount: 16200,
      expenseCount: 2,
      budget: 750000,
      budgetUtilization: 2.2
    },
    {
      projectId: 'proj-3',
      projectName: 'Office Building C',
      totalAmount: 8500,
      expenseCount: 1,
      budget: 300000,
      budgetUtilization: 2.8
    }
  ]
};

// Mock expense stats
export const mockExpenseStats: ExpenseStats = {
  todayTotal: 0,
  weekTotal: 31700,
  monthTotal: 116700,
  yearTotal: 211700,
  pendingReceipts: 2,
  overBudgetProjects: 0
};

// Utility functions
export const getCategoryById = (id: string): ExpenseCategory | undefined => {
  return expenseCategories.find(cat => cat.id === id);
};

export const getCategoryByName = (name: string): ExpenseCategory | undefined => {
  return expenseCategories.find(cat => cat.name === name);
};

export const getExpensesByProject = (projectId: string): Expense[] => {
  return mockExpenses.filter(expense => expense.projectId === projectId && !expense.isDeleted);
};

export const getExpensesByCategory = (categoryId: string): Expense[] => {
  return mockExpenses.filter(expense => expense.categoryId === categoryId && !expense.isDeleted);
};

export const getExpensesByDateRange = (startDate: string, endDate: string): Expense[] => {
  return mockExpenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return expenseDate >= start && expenseDate <= end && !expense.isDeleted;
  });
};

export const calculateTotalAmount = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const getPaymentModeColor = (mode: PaymentMode): string => {
  const colors = {
    [PaymentMode.CASH]: '#EF4444',
    [PaymentMode.UPI]: '#8B5CF6',
    [PaymentMode.BANK_TRANSFER]: '#10B981',
    [PaymentMode.CHEQUE]: '#F59E0B'
  };
  return colors[mode] || '#6B7280';
};