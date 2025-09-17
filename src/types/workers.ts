export interface Worker {
  id: string;
  personalInfo: PersonalInfo;
  jobInfo: JobInfo;
  documents: WorkerDocument[];
  paymentInfo: PaymentInfo;
  status: WorkerStatus;
  skills: Skill[];
  notes: Note[];
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  email?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  profilePicture?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  alternatePhone?: string;
}

export interface JobInfo {
  employeeId: string;
  role: string;
  designation: string;
  department: string;
  joiningDate: string;
  currentProject?: string;
  reportingManager?: string;
  workLocation: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary';
  shiftTiming?: string;
}

export interface WorkerDocument {
  id: string;
  type: DocumentType;
  name: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  expiryDate?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
  notes?: string;
}

export type DocumentType = 
  | 'id_proof' 
  | 'address_proof' 
  | 'educational_certificate' 
  | 'experience_certificate' 
  | 'medical_certificate' 
  | 'police_verification' 
  | 'other';

export interface PaymentInfo {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  upiId?: string;
  paymentPreference: 'bank_transfer' | 'upi' | 'cash' | 'cheque';
  paymentType: 'daily_wages' | 'weekly_wages' | 'monthly_wages' | 'contract_basis' | 'square_foot' | 'running_foot';
  wageAmount: number;
  salaryAmount?: number;
  paymentFrequency?: 'daily' | 'weekly' | 'monthly';
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  certifications?: string[];
}

export interface Note {
  id: string;
  content: string;
  type: 'general' | 'performance' | 'disciplinary' | 'achievement';
  createdBy: string;
  createdAt: string;
  isPrivate: boolean;
}

export type WorkerStatus = 'active' | 'inactive' | 'suspended' | 'terminated' | 'on_leave';

export type VerificationMethod = 'mobile_otp' | 'document_signing' | 'both';
export type VerificationStage = 'pending' | 'in_progress' | 'completed' | 'failed' | 'expired';

export interface MobileVerification {
  phoneNumber: string;
  otpSentAt?: string;
  otpVerifiedAt?: string;
  attempts: number;
  maxAttempts: number;
  status: VerificationStage;
  lastOtpCode?: string; // For development/testing only
}

export interface DocumentVerification {
  requiredDocuments: string[];
  signedDocuments: SignedDocument[];
  agreementSigned: boolean;
  agreementSignedAt?: string;
  status: VerificationStage;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface SignedDocument {
  id: string;
  documentType: string;
  documentName: string;
  signedAt: string;
  signedBy: string;
  digitalSignature?: string;
  witnessSignature?: string;
}

export interface VerificationStatus {
  overallStatus: VerificationStage;
  method: VerificationMethod;
  mobileVerification: MobileVerification;
  documentVerification: DocumentVerification;
  initiatedAt: string;
  completedAt?: string;
  expiresAt?: string;
}

export interface WorkerFilters {
  search?: string;
  role?: string;
  department?: string;
  project?: string;
  status?: WorkerStatus;
  skill?: string;
  joiningDateFrom?: string;
  joiningDateTo?: string;
}

export interface WorkerStats {
  totalWorkers: number;
  activeWorkers: number;
  inactiveWorkers: number;
  newJoinersThisMonth: number;
  attendancePercentage?: number;
  averageExperience?: number;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  component: string;
}

export interface WorkerFormData {
  step: number;
  personalInfo: Partial<PersonalInfo>;
  jobInfo: Partial<JobInfo>;
  documents: WorkerDocument[];
  paymentInfo: Partial<PaymentInfo>;
  skills: Skill[];
  verificationStatus: Partial<VerificationStatus>;
}

// Role-based access control types
export type UserRole = 'admin' | 'site_manager' | 'accountant' | 'hr' | 'viewer';

export interface RolePermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  canManageDocuments: boolean;
  canViewPaymentInfo: boolean;
  canViewAttendance: boolean;
  restrictedFields?: string[];
}

export interface AuditLog {
  id: string;
  workerId: string;
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'document_uploaded';
  field?: string;
  oldValue?: any;
  newValue?: any;
  performedBy: string;
  performedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// View mode types
export type ViewMode = 'grid' | 'list';

export interface WorkerCardProps {
  worker: Worker;
  viewMode: ViewMode;
  onEdit: (worker: Worker) => void;
  onDelete: (workerId: string) => void;
  onView: (workerId: string) => void;
}

export interface WorkerListItemProps {
  worker: Worker;
  onEdit: (worker: Worker) => void;
  onDelete: (workerId: string) => void;
  onView: (workerId: string) => void;
}