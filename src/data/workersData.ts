import { Worker, WorkerStats, OnboardingStep } from '../types/workers';

export const workersData: Worker[] = [
  {
    id: 'WKR001',
    personalInfo: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      dateOfBirth: '1985-03-15',
      gender: 'male',
      phoneNumber: '+91-9876543210',
      email: 'rajesh.kumar@email.com',
      address: {
        street: '123 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Sunita Kumar',
        relationship: 'Wife',
        phoneNumber: '+91-9876543211',
        alternatePhone: '+91-9876543212'
      },
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    jobInfo: {
      employeeId: 'EMP001',
      role: 'Site Supervisor',
      designation: 'Senior Supervisor',
      department: 'Construction',
      joiningDate: '2023-01-15',
      currentProject: 'Residential Complex A',
      reportingManager: 'Amit Sharma',
      workLocation: 'Site A - Whitefield',
      employmentType: 'full-time',
      shiftTiming: '8:00 AM - 6:00 PM'
    },
    documents: [
      {
        id: 'DOC001',
        type: 'id_proof',
        name: 'Aadhaar Card',
        fileName: 'rajesh_aadhaar.pdf',
        fileUrl: '/documents/rajesh_aadhaar.pdf',
        uploadDate: '2023-01-10',
        isVerified: true,
        verifiedBy: 'HR Team',
        verifiedDate: '2023-01-12'
      },
      {
        id: 'DOC002',
        type: 'educational_certificate',
        name: 'Civil Engineering Diploma',
        fileName: 'rajesh_diploma.pdf',
        fileUrl: '/documents/rajesh_diploma.pdf',
        uploadDate: '2023-01-10',
        isVerified: true,
        verifiedBy: 'HR Team',
        verifiedDate: '2023-01-12'
      }
    ],
    paymentInfo: {
      bankName: 'State Bank of India',
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      accountHolderName: 'Rajesh Kumar',
      upiId: 'rajesh@paytm',
      paymentPreference: 'bank_transfer',
      salaryAmount: 45000,
      paymentFrequency: 'monthly'
    },
    status: 'active',
    skills: [
      {
        id: 'SKL001',
        name: 'Site Management',
        category: 'Management',
        level: 'advanced',
        yearsOfExperience: 8
      },
      {
        id: 'SKL002',
        name: 'Quality Control',
        category: 'Technical',
        level: 'expert',
        yearsOfExperience: 10
      }
    ],
    notes: [
      {
        id: 'NOTE001',
        content: 'Excellent leadership skills and team management.',
        type: 'performance',
        createdBy: 'Amit Sharma',
        createdAt: '2023-06-15T10:30:00Z',
        isPrivate: false
      }
    ],
    verificationStatus: {
      overallStatus: 'completed',
      method: 'both',
      mobileVerification: {
        phoneNumber: '+91-9876543210',
        otpSentAt: '2023-01-12T09:00:00Z',
        otpVerifiedAt: '2023-01-12T09:05:00Z',
        attempts: 1,
        maxAttempts: 3,
        status: 'completed'
      },
      documentVerification: {
        requiredDocuments: ['employment_agreement', 'safety_guidelines', 'code_of_conduct'],
        signedDocuments: [
          {
            id: 'SIGN001',
            documentType: 'employment_agreement',
            documentName: 'Employment Agreement - Rajesh Kumar',
            signedAt: '2023-01-13T10:00:00Z',
            signedBy: 'Rajesh Kumar',
            digitalSignature: 'digital_signature_hash_001'
          },
          {
            id: 'SIGN002',
            documentType: 'safety_guidelines',
            documentName: 'Safety Guidelines Acknowledgment',
            signedAt: '2023-01-13T10:15:00Z',
            signedBy: 'Rajesh Kumar',
            digitalSignature: 'digital_signature_hash_002'
          }
        ],
        agreementSigned: true,
        agreementSignedAt: '2023-01-13T10:00:00Z',
        status: 'completed',
        verifiedBy: 'HR Team',
        verifiedAt: '2023-01-13T11:00:00Z'
      },
      initiatedAt: '2023-01-12T09:00:00Z',
      completedAt: '2023-01-13T11:00:00Z'
    },
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2023-12-01T14:30:00Z',
    createdBy: 'HR Team',
    updatedBy: 'Amit Sharma'
  },
  {
    id: 'WKR002',
    personalInfo: {
      firstName: 'Priya',
      lastName: 'Sharma',
      dateOfBirth: '1990-07-22',
      gender: 'female',
      phoneNumber: '+91-9876543213',
      email: 'priya.sharma@email.com',
      address: {
        street: '456 Brigade Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        country: 'India'
      },
      emergencyContact: {
        name: 'Vikram Sharma',
        relationship: 'Husband',
        phoneNumber: '+91-9876543214'
      },
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    jobInfo: {
      employeeId: 'EMP002',
      role: 'Architect',
      designation: 'Junior Architect',
      department: 'Design',
      joiningDate: '2023-03-01',
      currentProject: 'Commercial Plaza B',
      reportingManager: 'Neha Gupta',
      workLocation: 'Head Office',
      employmentType: 'full-time',
      shiftTiming: '9:00 AM - 6:00 PM'
    },
    documents: [
      {
        id: 'DOC003',
        type: 'id_proof',
        name: 'Passport',
        fileName: 'priya_passport.pdf',
        fileUrl: '/documents/priya_passport.pdf',
        uploadDate: '2023-02-25',
        expiryDate: '2033-02-25',
        isVerified: true,
        verifiedBy: 'HR Team',
        verifiedDate: '2023-02-28'
      }
    ],
    paymentInfo: {
      bankName: 'HDFC Bank',
      accountNumber: '0987654321',
      ifscCode: 'HDFC0001234',
      accountHolderName: 'Priya Sharma',
      upiId: 'priya@gpay',
      paymentPreference: 'upi',
      salaryAmount: 55000,
      paymentFrequency: 'monthly'
    },
    status: 'active',
    skills: [
      {
        id: 'SKL003',
        name: 'AutoCAD',
        category: 'Software',
        level: 'advanced',
        yearsOfExperience: 4
      },
      {
        id: 'SKL004',
        name: 'Building Design',
        category: 'Technical',
        level: 'intermediate',
        yearsOfExperience: 3
      }
    ],
    notes: [],
    verificationStatus: {
      overallStatus: 'in_progress',
      method: 'both',
      mobileVerification: {
        phoneNumber: '+91-9876543213',
        otpSentAt: '2023-02-28T14:30:00Z',
        otpVerifiedAt: '2023-02-28T14:35:00Z',
        attempts: 1,
        maxAttempts: 3,
        status: 'completed'
      },
      documentVerification: {
        requiredDocuments: ['employment_agreement', 'safety_guidelines', 'code_of_conduct'],
        signedDocuments: [
          {
            id: 'SIGN003',
            documentType: 'employment_agreement',
            documentName: 'Employment Agreement - Priya Sharma',
            signedAt: '2023-03-01T09:30:00Z',
            signedBy: 'Priya Sharma',
            digitalSignature: 'digital_signature_hash_003'
          }
        ],
        agreementSigned: true,
        agreementSignedAt: '2023-03-01T09:30:00Z',
        status: 'in_progress',
        verifiedBy: 'HR Team'
      },
      initiatedAt: '2023-02-28T14:30:00Z'
    },
    createdAt: '2023-03-01T09:00:00Z',
    updatedAt: '2023-11-15T16:45:00Z',
    createdBy: 'HR Team',
    updatedBy: 'Neha Gupta'
  },
  {
    id: 'WKR003',
    personalInfo: {
      firstName: 'Mohammed',
      lastName: 'Ali',
      dateOfBirth: '1988-12-10',
      gender: 'male',
      phoneNumber: '+91-9876543215',
      address: {
        street: '789 Commercial Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Fatima Ali',
        relationship: 'Sister',
        phoneNumber: '+91-9876543216'
      },
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    jobInfo: {
      employeeId: 'EMP003',
      role: 'Electrician',
      designation: 'Senior Electrician',
      department: 'Electrical',
      joiningDate: '2022-08-15',
      currentProject: 'Residential Complex A',
      reportingManager: 'Rajesh Kumar',
      workLocation: 'Site A - Whitefield',
      employmentType: 'full-time',
      shiftTiming: '7:00 AM - 4:00 PM'
    },
    documents: [
      {
        id: 'DOC004',
        type: 'id_proof',
        name: 'Voter ID',
        fileName: 'mohammed_voter_id.pdf',
        fileUrl: '/documents/mohammed_voter_id.pdf',
        uploadDate: '2022-08-10',
        isVerified: true,
        verifiedBy: 'HR Team',
        verifiedDate: '2022-08-12'
      },
      {
        id: 'DOC005',
        type: 'educational_certificate',
        name: 'ITI Certificate - Electrician',
        fileName: 'mohammed_iti.pdf',
        fileUrl: '/documents/mohammed_iti.pdf',
        uploadDate: '2022-08-10',
        isVerified: true,
        verifiedBy: 'Technical Team',
        verifiedDate: '2022-08-13'
      }
    ],
    paymentInfo: {
      bankName: 'Canara Bank',
      accountNumber: '5678901234',
      ifscCode: 'CNRB0001234',
      accountHolderName: 'Mohammed Ali',
      paymentPreference: 'bank_transfer',
      salaryAmount: 35000,
      paymentFrequency: 'monthly'
    },
    status: 'active',
    skills: [
      {
        id: 'SKL005',
        name: 'Electrical Wiring',
        category: 'Technical',
        level: 'expert',
        yearsOfExperience: 12
      },
      {
        id: 'SKL006',
        name: 'Panel Installation',
        category: 'Technical',
        level: 'advanced',
        yearsOfExperience: 8
      }
    ],
    notes: [
      {
        id: 'NOTE002',
        content: 'Completed electrical work ahead of schedule.',
        type: 'achievement',
        createdBy: 'Rajesh Kumar',
        createdAt: '2023-09-20T11:15:00Z',
        isPrivate: false
      }
    ],
    verificationStatus: {
      overallStatus: 'pending',
      method: 'mobile_otp',
      mobileVerification: {
        phoneNumber: '+91-9876543215',
        attempts: 0,
        maxAttempts: 3,
        status: 'pending'
      },
      documentVerification: {
        requiredDocuments: ['employment_agreement', 'safety_guidelines'],
        signedDocuments: [],
        agreementSigned: false,
        status: 'pending'
      },
      initiatedAt: '2022-08-15T09:00:00Z'
    },
    createdAt: '2022-08-15T09:00:00Z',
    updatedAt: '2023-10-05T13:20:00Z',
    createdBy: 'HR Team',
    updatedBy: 'Rajesh Kumar'
  }
];

export const workerStats: WorkerStats = {
  totalWorkers: 45,
  activeWorkers: 42,
  inactiveWorkers: 3,
  newJoinersThisMonth: 5,
  attendancePercentage: 87.5,
  averageExperience: 6.2
};

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Basic personal details and contact information',
    isCompleted: false,
    isActive: true,
    component: 'PersonalInfoStep'
  },
  {
    id: 2,
    title: 'Job Information',
    description: 'Role, department, and project assignment',
    isCompleted: false,
    isActive: false,
    component: 'JobInfoStep'
  },
  {
    id: 3,
    title: 'Documents Upload',
    description: 'ID proof, certificates, and other documents',
    isCompleted: false,
    isActive: false,
    component: 'DocumentsStep'
  },
  {
    id: 4,
    title: 'Payment Information',
    description: 'Bank details and payment preferences',
    isCompleted: false,
    isActive: false,
    component: 'PaymentInfoStep'
  },
  {
    id: 5,
    title: 'Verification',
    description: 'Mobile OTP and document signing verification',
    isCompleted: false,
    isActive: false,
    component: 'VerificationStep'
  },
  {
    id: 6,
    title: 'Review & Confirm',
    description: 'Review all information before submission',
    isCompleted: false,
    isActive: false,
    component: 'ReviewStep'
  }
];

// Helper functions
export const getWorkerById = (id: string): Worker | undefined => {
  return workersData.find(worker => worker.id === id);
};

export const getWorkersByProject = (projectName: string): Worker[] => {
  return workersData.filter(worker => worker.jobInfo.currentProject === projectName);
};

export const getWorkersByRole = (role: string): Worker[] => {
  return workersData.filter(worker => worker.jobInfo.role === role);
};

export const getActiveWorkers = (): Worker[] => {
  return workersData.filter(worker => worker.status === 'active');
};

export const getWorkerFullName = (worker: Worker): string => {
  return `${worker.personalInfo.firstName} ${worker.personalInfo.lastName}`;
};

export const getWorkerExperience = (worker: Worker): number => {
  const joiningDate = new Date(worker.jobInfo.joiningDate);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - joiningDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 365 * 10) / 10; // Years with 1 decimal place
};

export const roles = [
  'Site Supervisor',
  'Architect',
  'Electrician',
  'Plumber',
  'Mason',
  'Carpenter',
  'Painter',
  'Helper',
  'Security Guard',
  'Project Manager',
  'Quality Inspector',
  'Safety Officer'
];

export const departments = [
  'Construction',
  'Design',
  'Electrical',
  'Plumbing',
  'Finishing',
  'Security',
  'Administration',
  'Quality Assurance',
  'Safety'
];

export const skillCategories = [
  'Technical',
  'Management',
  'Software',
  'Safety',
  'Communication',
  'Leadership'
];