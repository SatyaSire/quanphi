import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  Briefcase, 
  FileText, 
  CreditCard, 
  Eye,
  Upload,
  X,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  Users,
  Shield,
  Smartphone,
  FileSignature
} from 'lucide-react';
import { WorkerFormData, OnboardingStep } from '../types/workers';
import { onboardingSteps, roles, departments, getWorkerById } from '../data/workersData';

const WorkerCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<OnboardingStep[]>(onboardingSteps);
  const [formData, setFormData] = useState<WorkerFormData>({
    step: 1,
    personalInfo: {},
    jobInfo: {},
    documents: [],
    paymentInfo: {},
    skills: [],
    verificationStatus: {
      mobileVerification: {
        phoneNumber: '',
        attempts: 0,
        maxAttempts: 3,
        status: 'pending'
      },
      documentVerification: {
        requiredDocuments: ['employment_agreement', 'safety_guidelines', 'code_of_conduct'],
        signedDocuments: [],
        agreementSigned: false,
        status: 'pending'
      },
      overallStatus: 'pending',
      method: 'both',
      initiatedAt: new Date().toISOString()
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing worker data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const existingWorker = getWorkerById(id);
      if (existingWorker) {
        setFormData({
          step: 1,
          personalInfo: existingWorker.personalInfo,
          jobInfo: existingWorker.jobInfo,
          documents: existingWorker.documents || [],
          paymentInfo: existingWorker.paymentInfo,
          skills: existingWorker.skills || []
        });
      } else {
        // Worker not found, redirect to workers page
        navigate('/workers');
      }
    }
  }, [id, isEditMode, navigate]);

  const updateFormData = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const clearFieldError = (fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.personalInfo.firstName) newErrors.firstName = 'First name is required';
        if (!formData.personalInfo.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.personalInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.personalInfo.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.personalInfo.address?.street) newErrors.street = 'Street address is required';
        if (!formData.personalInfo.address?.city) newErrors.city = 'City is required';
        if (!formData.personalInfo.emergencyContact?.name) newErrors.emergencyName = 'Emergency contact name is required';
        if (!formData.personalInfo.emergencyContact?.phoneNumber) newErrors.emergencyPhone = 'Emergency contact phone is required';
        break;
      case 2:
        if (!formData.jobInfo.employeeId) newErrors.employeeId = 'Employee ID is required';
        if (!formData.jobInfo.role) newErrors.role = 'Role is required';
        if (!formData.jobInfo.department) newErrors.department = 'Department is required';
        if (!formData.jobInfo.joiningDate) newErrors.joiningDate = 'Joining date is required';
        if (!formData.jobInfo.workLocation) newErrors.workLocation = 'Work location is required';
        break;
      case 4:
        if (!formData.paymentInfo.bankName) newErrors.bankName = 'Bank name is required';
        if (!formData.paymentInfo.accountNumber) newErrors.accountNumber = 'Account number is required';
        if (!formData.paymentInfo.ifscCode) newErrors.ifscCode = 'IFSC code is required';
        if (!formData.paymentInfo.accountHolderName) newErrors.accountHolderName = 'Account holder name is required';
        if (!formData.paymentInfo.paymentType) newErrors.paymentType = 'Payment type is required';
        if (!formData.paymentInfo.wageAmount) newErrors.wageAmount = 'Wage amount is required';
        break;
      case 5:
        if (!formData.verificationStatus?.mobileVerification?.status || formData.verificationStatus.mobileVerification.status !== 'completed') {
          newErrors.mobileVerification = 'Mobile verification is required';
        }
        if (!formData.verificationStatus?.documentVerification?.agreementSigned) {
          newErrors.documentVerification = 'Document signing is required';
        }
        break;
    }
    
    // Only set errors when trying to proceed to next step, not on input change
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    
    // Clear errors if validation passes
    setErrors({});
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
        setSteps(prev => prev.map(step => ({
          ...step,
          isCompleted: step.id < currentStep + 1,
          isActive: step.id === currentStep + 1
        })));
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSteps(prev => prev.map(step => ({
        ...step,
        isCompleted: step.id < currentStep - 1,
        isActive: step.id === currentStep - 1
      })));
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Here you would typically submit to your API
      console.log(isEditMode ? 'Updating worker data:' : 'Submitting worker data:', formData);
      navigate('/workers');
    }
  };

  // Render step function
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoStep />;
      case 2: return <JobInfoStep />;
      case 3: return <DocumentsStep />;
      case 4: return <PaymentInfoStep />;
      case 5: return <VerificationStep />;
      case 6: return <ReviewStep />;
      default: return <PersonalInfoStep />;
    }
  };

  const StepIndicator = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                step.isCompleted 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : step.isActive 
                    ? 'bg-indigo-500 border-indigo-500 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}>
                {step.isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  step.isActive ? 'text-indigo-600' : step.isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                steps[index + 1].isCompleted || steps[index + 1].isActive ? 'bg-indigo-200' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      </div>
    );

  const PersonalInfoStep = () => (
    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <p className="text-sm text-gray-500 mt-1">
              Basic personal details and contact information
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={formData.personalInfo.firstName || ''}
            onChange={(e) => {
              updateFormData({ personalInfo: { ...formData.personalInfo, firstName: e.target.value } });
              clearFieldError('firstName');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.firstName ? 'border-red-300' : ''
            }`}
            placeholder="Enter first name"
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.firstName || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.personalInfo.lastName || ''}
            onChange={(e) => {
              updateFormData({ personalInfo: { ...formData.personalInfo, lastName: e.target.value } });
              clearFieldError('lastName');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.lastName ? 'border-red-300' : ''
            }`}
            placeholder="Enter last name"
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.lastName || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
          <input
            type="date"
            value={formData.personalInfo.dateOfBirth || ''}
            onChange={(e) => {
              updateFormData({ personalInfo: { ...formData.personalInfo, dateOfBirth: e.target.value } });
              clearFieldError('dateOfBirth');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.dateOfBirth ? 'border-red-300' : ''
            }`}
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.dateOfBirth || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formData.personalInfo.gender || ''}
            onChange={(e) => updateFormData({ personalInfo: { ...formData.personalInfo, gender: e.target.value as any } })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={formData.personalInfo.phoneNumber || ''}
            onChange={(e) => {
              updateFormData({ personalInfo: { ...formData.personalInfo, phoneNumber: e.target.value } });
              clearFieldError('phoneNumber');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.phoneNumber ? 'border-red-300' : ''
            }`}
            placeholder="+91-9876543210"
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.phoneNumber || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.personalInfo.email || ''}
            onChange={(e) => updateFormData({ personalInfo: { ...formData.personalInfo, email: e.target.value } })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="worker@email.com"
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
            <input
              type="text"
              value={formData.personalInfo.address?.street || ''}
              onChange={(e) => {
                updateFormData({ 
                  personalInfo: { 
                    ...formData.personalInfo, 
                    address: { ...formData.personalInfo.address, street: e.target.value } 
                  } 
                });
                clearFieldError('street');
              }}
              className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.street ? 'border-red-300' : ''
              }`}
              placeholder="Enter street address"
            />
            <p className="text-red-500 text-sm mt-1 h-5">{errors.street || ''}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              value={formData.personalInfo.address?.city || ''}
              onChange={(e) => {
                updateFormData({ 
                  personalInfo: { 
                    ...formData.personalInfo, 
                    address: { ...formData.personalInfo.address, city: e.target.value } 
                  } 
                });
                clearFieldError('city');
              }}
              className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.city ? 'border-red-300' : ''
              }`}
              placeholder="Enter city"
            />
            <p className="text-red-500 text-sm mt-1 h-5">{errors.city || ''}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={formData.personalInfo.address?.state || ''}
              onChange={(e) => updateFormData({ 
                personalInfo: { 
                  ...formData.personalInfo, 
                  address: { ...formData.personalInfo.address, state: e.target.value } 
                } 
              })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            <input
              type="text"
              value={formData.personalInfo.address?.pincode || ''}
              onChange={(e) => updateFormData({ 
                personalInfo: { 
                  ...formData.personalInfo, 
                  address: { ...formData.personalInfo.address, pincode: e.target.value } 
                } 
              })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter pincode"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={formData.personalInfo.address?.country || 'India'}
              onChange={(e) => updateFormData({ 
                personalInfo: { 
                  ...formData.personalInfo, 
                  address: { ...formData.personalInfo.address, country: e.target.value } 
                } 
              })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter country"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
            <input
              type="text"
              value={formData.personalInfo.emergencyContact?.name || ''}
              onChange={(e) => {
                updateFormData({ 
                  personalInfo: { 
                    ...formData.personalInfo, 
                    emergencyContact: { ...formData.personalInfo.emergencyContact, name: e.target.value } 
                  } 
                });
                clearFieldError('emergencyName');
              }}
              className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.emergencyName ? 'border-red-300' : ''
              }`}
              placeholder="Enter emergency contact name"
            />
            <p className="text-red-500 text-sm mt-1 h-5">{errors.emergencyName || ''}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
            <input
              type="text"
              value={formData.personalInfo.emergencyContact?.relationship || ''}
              onChange={(e) => updateFormData({ 
                personalInfo: { 
                  ...formData.personalInfo, 
                  emergencyContact: { ...formData.personalInfo.emergencyContact, relationship: e.target.value } 
                } 
              })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Father, Mother, Spouse"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              value={formData.personalInfo.emergencyContact?.phoneNumber || ''}
              onChange={(e) => {
                updateFormData({ 
                  personalInfo: { 
                    ...formData.personalInfo, 
                    emergencyContact: { ...formData.personalInfo.emergencyContact, phoneNumber: e.target.value } 
                  } 
                });
                clearFieldError('emergencyPhone');
              }}
              className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.emergencyPhone ? 'border-red-300' : ''
              }`}
              placeholder="+91-9876543210"
            />
            <p className="text-red-500 text-sm mt-1 h-5">{errors.emergencyPhone || ''}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone</label>
            <input
              type="tel"
              value={formData.personalInfo.emergencyContact?.alternatePhone || ''}
              onChange={(e) => updateFormData({ 
                personalInfo: { 
                  ...formData.personalInfo, 
                  emergencyContact: { ...formData.personalInfo.emergencyContact, alternatePhone: e.target.value } 
                } 
              })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="+91-9876543210"
            />
          </div>
        </div>
        </div>
      </div>

        {/* Verification Status Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-indigo-600" />
            Verification Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Mobile Verification:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                formData.verificationStatus?.mobileVerification?.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {formData.verificationStatus?.mobileVerification?.status === 'completed' ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div><span className="font-medium">Agreement Signed:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                formData.verificationStatus?.documentVerification?.agreementSigned
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {formData.verificationStatus?.documentVerification?.agreementSigned ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
    </div>
    </div>
   );

  const JobInfoStep = () => (
    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Job Information</h3>
            <p className="text-sm text-gray-500 mt-1">
              Role, department, and project assignment details
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
          <input
            type="text"
            value={formData.jobInfo.employeeId || ''}
            onChange={(e) => {
              updateFormData({ jobInfo: { ...formData.jobInfo, employeeId: e.target.value } });
              clearFieldError('employeeId');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.employeeId ? 'border-red-300' : ''
            }`}
            placeholder="EMP001"
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.employeeId || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
          <select
            value={formData.jobInfo.role || ''}
            onChange={(e) => {
              updateFormData({ jobInfo: { ...formData.jobInfo, role: e.target.value } });
              clearFieldError('role');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.role ? 'border-red-300' : ''
            }`}
          >
            <option value="">Select role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <p className="text-red-500 text-sm mt-1 h-5">{errors.role || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
          <select
            value={formData.jobInfo.department || ''}
            onChange={(e) => {
              updateFormData({ jobInfo: { ...formData.jobInfo, department: e.target.value } });
              clearFieldError('department');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.department ? 'border-red-300' : ''
            }`}
          >
            <option value="">Select department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <p className="text-red-500 text-sm mt-1 h-5">{errors.department || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
          <input
            type="text"
            value={formData.jobInfo.designation || ''}
            onChange={(e) => updateFormData({ jobInfo: { ...formData.jobInfo, designation: e.target.value } })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Senior, Junior, Lead, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date *</label>
          <input
            type="date"
            value={formData.jobInfo.joiningDate || ''}
            onChange={(e) => {
              updateFormData({ jobInfo: { ...formData.jobInfo, joiningDate: e.target.value } });
              clearFieldError('joiningDate');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.joiningDate ? 'border-red-300' : ''
            }`}
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.joiningDate || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Work Location *</label>
          <input
            type="text"
            value={formData.jobInfo.workLocation || ''}
            onChange={(e) => {
              updateFormData({ jobInfo: { ...formData.jobInfo, workLocation: e.target.value } });
              clearFieldError('workLocation');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.workLocation ? 'border-red-300' : ''
            }`}
            placeholder="Site A - Whitefield"
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.workLocation || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Project</label>
          <input
            type="text"
            value={formData.jobInfo.currentProject || ''}
            onChange={(e) => updateFormData({ jobInfo: { ...formData.jobInfo, currentProject: e.target.value } })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Residential Complex A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Manager</label>
          <input
            type="text"
            value={formData.jobInfo.reportingManager || ''}
            onChange={(e) => updateFormData({ jobInfo: { ...formData.jobInfo, reportingManager: e.target.value } })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Manager name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
          <select
            value={formData.jobInfo.employmentType || ''}
            onChange={(e) => updateFormData({ jobInfo: { ...formData.jobInfo, employmentType: e.target.value as any } })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select employment type</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shift Timing</label>
          <input
            type="text"
            value={formData.jobInfo.shiftTiming || ''}
            onChange={(e) => updateFormData({ jobInfo: { ...formData.jobInfo, shiftTiming: e.target.value } })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="8:00 AM - 6:00 PM"
          />
        </div>
      </div>
    </div>
    </div>
  );

  const DocumentsStep = () => (
    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Documents Upload</h3>
            <p className="text-sm text-gray-500 mt-1">
              Upload ID proof, certificates, and other required documents
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 space-y-6">

      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h3>
          <p className="text-gray-500 mb-4">Drag and drop files here, or click to select files</p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Choose Files
          </button>
          <p className="text-sm text-gray-400 mt-2">Supported formats: PDF, JPG, PNG (Max 5MB each)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• ID Proof (Aadhaar/Passport/Voter ID)</li>
              <li>• Address Proof</li>
              <li>• Educational Certificates</li>
              <li>• Experience Certificates (if any)</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Optional Documents</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Medical Certificate</li>
              <li>• Police Verification</li>
              <li>• Skill Certificates</li>
              <li>• Other relevant documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  );

  const PaymentInfoStep = () => (
    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
            <p className="text-sm text-gray-500 mt-1">
              Bank details and payment preferences
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
          <input
            type="text"
            value={formData.paymentInfo.bankName || ''}
            onChange={(e) => {
              updateFormData({ paymentInfo: { ...formData.paymentInfo, bankName: e.target.value } });
              clearFieldError('bankName');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.bankName ? 'border-red-300' : ''
            }`}
            placeholder="State Bank of India"
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.bankName || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
          <input
            type="text"
            value={formData.paymentInfo.accountNumber || ''}
            onChange={(e) => {
              updateFormData({ paymentInfo: { ...formData.paymentInfo, accountNumber: e.target.value } });
              clearFieldError('accountNumber');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.accountNumber ? 'border-red-300' : ''
            }`}
            placeholder="1234567890"
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.accountNumber || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
          <input
            type="text"
            value={formData.paymentInfo.ifscCode || ''}
            onChange={(e) => {
              updateFormData({ paymentInfo: { ...formData.paymentInfo, ifscCode: e.target.value } });
              clearFieldError('ifscCode');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.ifscCode ? 'border-red-300' : ''
            }`}
            placeholder="SBIN0001234"
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.ifscCode || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
          <input
            type="text"
            value={formData.paymentInfo.accountHolderName || ''}
            onChange={(e) => {
              updateFormData({ paymentInfo: { ...formData.paymentInfo, accountHolderName: e.target.value } });
              clearFieldError('accountHolderName');
            }}
            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.accountHolderName ? 'border-red-300' : ''
            }`}
            placeholder="As per bank records"
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.accountHolderName || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
          <input
            type="text"
            value={formData.paymentInfo.upiId || ''}
            onChange={(e) => updateFormData({ paymentInfo: { ...formData.paymentInfo, upiId: e.target.value } })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="worker@paytm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type *</label>
          <select
            value={formData.paymentInfo.paymentType || ''}
            onChange={(e) => {
              updateFormData({ paymentInfo: { ...formData.paymentInfo, paymentType: e.target.value } });
              clearFieldError('paymentType');
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.paymentType ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select payment type</option>
            <option value="daily_wages">Daily Wages</option>
            <option value="weekly_wages">Weekly Wages</option>
            <option value="monthly_wages">Monthly Wages</option>
            <option value="contract_basis">Contract Basis</option>
            <option value="square_foot">Square Foot</option>
            <option value="running_foot">Running Foot</option>
          </select>
          <p className="text-red-500 text-sm mt-1 h-5">{errors.paymentType || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.paymentInfo.paymentType === 'daily_wages' ? 'Daily Wage Amount *' :
             formData.paymentInfo.paymentType === 'weekly_wages' ? 'Weekly Wage Amount *' :
             formData.paymentInfo.paymentType === 'monthly_wages' ? 'Monthly Salary Amount *' :
             formData.paymentInfo.paymentType === 'contract_basis' ? 'Contract Amount *' :
             formData.paymentInfo.paymentType === 'square_foot' ? 'Rate per Square Foot *' :
             formData.paymentInfo.paymentType === 'running_foot' ? 'Rate per Running Foot *' :
             'Wage Amount *'}
          </label>
          <input
            type="number"
            value={formData.paymentInfo.wageAmount || ''}
            onChange={(e) => {
              updateFormData({ paymentInfo: { ...formData.paymentInfo, wageAmount: Number(e.target.value) } });
              clearFieldError('wageAmount');
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.wageAmount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={
              formData.paymentInfo.paymentType === 'daily_wages' ? '500' :
              formData.paymentInfo.paymentType === 'weekly_wages' ? '3500' :
              formData.paymentInfo.paymentType === 'monthly_wages' ? '15000' :
              formData.paymentInfo.paymentType === 'contract_basis' ? '50000' :
              formData.paymentInfo.paymentType === 'square_foot' ? '25' :
              formData.paymentInfo.paymentType === 'running_foot' ? '15' :
              'Enter amount'
            }
          />
          <p className="text-red-500 text-sm mt-1 h-5">{errors.wageAmount || ''}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Preference</label>
          <select
            value={formData.paymentInfo.paymentPreference || ''}
            onChange={(e) => updateFormData({ paymentInfo: { ...formData.paymentInfo, paymentPreference: e.target.value as any } })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select preference</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Frequency</label>
          <select
            value={formData.paymentInfo.paymentFrequency || ''}
            onChange={(e) => updateFormData({ paymentInfo: { ...formData.paymentInfo, paymentFrequency: e.target.value as any } })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
    </div>
    </div>
  );

  const VerificationStep = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Shield className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verification & Compliance</h2>
          <p className="text-gray-600">Complete verification steps and sign agreements</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Mobile Verification */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Mobile Verification</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.verificationStatus?.mobileVerification?.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {formData.verificationStatus?.mobileVerification?.status === 'completed' ? 'Verified' : 'Pending'}
            </span>
          </div>
          <p className="text-gray-600 mb-4">Verify mobile number: {formData.personalInfo.phoneNumber}</p>
          {formData.verificationStatus?.mobileVerification?.status !== 'completed' && (
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Send OTP
            </button>
          )}
          <p className="text-red-500 text-sm mt-2 h-5">{errors.mobileVerification || ''}</p>
        </div>

        {/* Document Verification */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileSignature className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Document Verification & Agreement</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.verificationStatus?.documentVerification?.agreementSigned
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {formData.verificationStatus?.documentVerification?.agreementSigned ? 'Signed' : 'Pending'}
            </span>
          </div>
          <p className="text-gray-600 mb-4">Review and sign the employment agreement and terms of service</p>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.verificationStatus?.documentVerification?.agreementSigned || false}
                onChange={(e) => {
                  updateFormData({
                    verificationStatus: {
                      ...formData.verificationStatus,
                      documentVerification: {
                        ...formData.verificationStatus?.documentVerification,
                        agreementSigned: e.target.checked
                      }
                    }
                  });
                  clearFieldError('documentVerification');
                }}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">I agree to the terms and conditions of employment</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.verificationStatus?.documentVerification?.privacyPolicyAccepted || false}
                onChange={(e) => {
                  updateFormData({
                    verificationStatus: {
                      ...formData.verificationStatus,
                      documentVerification: {
                        ...formData.verificationStatus?.documentVerification,
                        privacyPolicyAccepted: e.target.checked
                      }
                    }
                  });
                }}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">I accept the privacy policy and data handling terms</span>
            </label>
          </div>
          <p className="text-red-500 text-sm mt-2 h-5">{errors.documentVerification || ''}</p>
        </div>

        {/* Background Verification */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Background Verification</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Optional
            </span>
          </div>
          <p className="text-gray-600 mb-4">Background verification will be conducted as per company policy</p>
          <div className="text-sm text-gray-500">
            <p>• Police verification (if required)</p>
            <p>• Previous employment verification</p>
            <p>• Reference checks</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ReviewStep = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Eye className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Review & Confirm</h2>
          <p className="text-gray-600">Please review all information before submission</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Personal Information Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-600" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Name:</span> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</div>
            <div><span className="font-medium">Date of Birth:</span> {formData.personalInfo.dateOfBirth}</div>
            <div><span className="font-medium">Phone:</span> {formData.personalInfo.phoneNumber}</div>
            <div><span className="font-medium">Email:</span> {formData.personalInfo.email || 'Not provided'}</div>
            <div className="md:col-span-2"><span className="font-medium">Address:</span> {formData.personalInfo.address?.street}, {formData.personalInfo.address?.city}</div>
            <div><span className="font-medium">Emergency Contact:</span> {formData.personalInfo.emergencyContact?.name}</div>
            <div><span className="font-medium">Emergency Phone:</span> {formData.personalInfo.emergencyContact?.phoneNumber}</div>
          </div>
        </div>

        {/* Job Information Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
            Job Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Employee ID:</span> {formData.jobInfo.employeeId}</div>
            <div><span className="font-medium">Role:</span> {formData.jobInfo.role}</div>
            <div><span className="font-medium">Department:</span> {formData.jobInfo.department}</div>
            <div><span className="font-medium">Joining Date:</span> {formData.jobInfo.joiningDate}</div>
            <div><span className="font-medium">Work Location:</span> {formData.jobInfo.workLocation}</div>
            <div><span className="font-medium">Current Project:</span> {formData.jobInfo.currentProject || 'Not assigned'}</div>
          </div>
        </div>

        {/* Payment Information Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
            Payment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Bank Name:</span> {formData.paymentInfo.bankName}</div>
            <div><span className="font-medium">Account Number:</span> ****{formData.paymentInfo.accountNumber?.slice(-4)}</div>
            <div><span className="font-medium">IFSC Code:</span> {formData.paymentInfo.ifscCode}</div>
            <div><span className="font-medium">Account Holder:</span> {formData.paymentInfo.accountHolderName}</div>
            <div><span className="font-medium">Payment Preference:</span> {formData.paymentInfo.paymentPreference?.replace('_', ' ').toUpperCase()}</div>
            <div><span className="font-medium">Wage Amount:</span> ₹{formData.paymentInfo.wageAmount?.toLocaleString() || 'Not specified'}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <Link
              to="/workers"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Workers
            </Link>
            
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit Worker' : 'Add New Worker'}</h1>
                  <p className="text-gray-600 mt-1">{isEditMode ? 'Update worker information and details' : 'Complete the onboarding process step by step'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator />
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentStep < 6 ? (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
            >
              <Check className="w-5 h-5" />
              <span>{isEditMode ? 'Update Worker' : 'Submit & Create Worker'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerCreatePage;