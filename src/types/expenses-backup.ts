export interface CategoryBreakdown {
  id: string;
  name: string;
  value: number;
  count: number;
  color: string;
  percentage: number;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
  count: number;
}

export enum ExpenseCategoryType {
  MATERIALS = 'MATERIALS',
  LABOR = 'LABOR',
  TRAVEL_TRANSPORT = 'TRAVEL_TRANSPORT',
  SITE_SETUP = 'SITE_SETUP',
  FOOD_LODGING = 'FOOD_LODGING',
  TOOLS_EQUIPMENT = 'TOOLS_EQUIPMENT',
  OFFICE_ADMIN = 'OFFICE_ADMIN',
  MISCELLANEOUS = 'MISCELLANEOUS',
  SUBCONTRACTORS = 'SUBCONTRACTORS',
  EQUIPMENT = 'EQUIPMENT',
  TRAVEL = 'TRAVEL',
  MEALS = 'MEALS',
  PERMITS = 'PERMITS',
  UTILITIES = 'UTILITIES',
  INSURANCE = 'INSURANCE',
  OFFICE = 'OFFICE',
  MARKETING = 'MARKETING',
  PROFESSIONAL = 'PROFESSIONAL',
  OTHER = 'OTHER'
}

export enum PaymentMode {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  OTHER = 'OTHER'
}

export enum PaidBy {
  COMPANY = 'COMPANY',
  EMPLOYEE = 'EMPLOYEE',
  CONTRACTOR = 'CONTRACTOR',
  CLIENT = 'CLIENT',
  SITE_MANAGER = 'SITE_MANAGER'
}

export interface Expense {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  categoryId: string;
  categoryName: string;
  description: string;
  vendorName: string;
  amount: number;
  paymentMode: PaymentMode;
  paidBy: PaidBy;
  attachments: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  type: ExpenseCategoryType;
  color: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface ExpenseFilters {
  dateRange: {
    from: string;
    to: string;
  };
  categories: string[];
  projects: string[];
  paymentModes: PaymentMode[];
  amountRange: {
    min: number;
    max: number;
  };
  searchQuery: string;
}

export interface ExpenseSortOptions {
  field: 'date' | 'amount' | 'projectName' | 'categoryName';
  direction: 'asc' | 'desc';
}

export interface ExpenseSummary {
  totalExpenses: number;
  totalBudget: number;
  remainingBudget: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyExpenses: MonthlyExpense[];
}

export interface ProjectExpenseSummary {
  projectId: string;
  projectName: string;
  totalAmount: number;
  expenseCount: number;
  budgetUtilization: number;
}

export interface ExpenseFormData {
  date: string;
  projectId: string;
  categoryId: string;
  description: string;
  vendorName: string;
  amount: number;
  paymentMode: PaymentMode;
  paidBy: PaidBy;
  attachments: File[];
  notes: string;
}

export interface ExpenseValidationErrors {
  date?: string;
  projectId?: string;
  categoryId?: string;
  description?: string;
  amount?: string;
  paymentMode?: string;
  paidBy?: string;
  general?: string;
}

export interface BudgetWarning {
  type: 'warning' | 'danger';
  message: string;
  remainingBudget: number;
  utilizationPercentage: number;
}

export interface ExpenseSearchFilters {
  query: string;
  dateRange: {
    from: string;
    to: string;
  };
}

export interface ExpenseStats {
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
  yearTotal: number;
  pendingReceipts: number;
  overBudgetProjects: number;
}