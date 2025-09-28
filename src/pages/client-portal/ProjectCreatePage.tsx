import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const isEdit = !!projectId;
  
  const [formData, setFormData] = useState({
    // Basic Project Info
    name: '',
    description: '',
    projectType: 'residential',
    category: 'construction',
    priority: 'medium',
    
    // Budget & Timeline
    budget: '',
    budgetType: 'fixed',
    startDate: '',
    endDate: '',
    estimatedHours: '',
    
    // Client Information
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientCompany: '',
    linkedClientId: '',
    
    // Project Requirements
    objectives: '',
    scope: '',
    targetAudience: '',
    technicalRequirements: '',
    
    // Additional Details
    additionalNotes: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Load existing project data for editing
  useEffect(() => {
    if (isEdit && projectId) {
      // Mock project data - in a real app, this would be an API call
      const mockProject = {
        name: 'Modern Villa Construction',
        description: 'A luxury modern villa with contemporary design and smart home features.',
        projectType: 'residential',
        category: 'construction',
        priority: 'high',
        budget: '250000',
        budgetType: 'fixed',
        startDate: '2024-02-01',
        endDate: '2024-08-31',
        estimatedHours: '1200',
        clientName: 'John Smith',
        clientEmail: 'john.smith@email.com',
        clientPhone: '+1-555-0123',
        clientAddress: '123 Main Street, Cityville, ST 12345',
        clientCompany: 'Smith Enterprises',
        linkedClientId: 'client-001',
        objectives: 'Create a modern, energy-efficient villa with smart home integration and sustainable materials.',
        scope: 'Full construction including foundation, structure, interior finishing, landscaping, and smart home system installation.',
        targetAudience: 'High-end residential clients seeking luxury and sustainability.',
        technicalRequirements: 'Smart home automation, solar panels, energy-efficient HVAC, premium materials throughout.',
        additionalNotes: 'Client prefers eco-friendly materials and wants completion before September 2024.'
      };
      
      setFormData(mockProject);
    }
  }, [isEdit, projectId]);

  const steps = [
    { title: 'Basic Info', description: 'Project details and information' },
    { title: 'Client Info', description: 'Client contact information' },
    { title: 'Requirements', description: 'Project objectives and requirements' },
    { title: 'Budget & Timeline', description: 'Budget and schedule details' },
    { title: 'Review', description: 'Review and save your project' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Project description is required';
    }
    
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      errors.budget = 'Valid budget amount is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = 'End date must be after start date';
    }

    if (!formData.clientName.trim()) {
      errors.clientName = 'Client name is required';
    }

    if (!formData.clientEmail.trim()) {
      errors.clientEmail = 'Client email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      errors.clientEmail = 'Valid email address is required';
    }

    if (!formData.objectives.trim()) {
      errors.objectives = 'Project objectives are required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const validateCurrentStep = () => {
    const errors: {[key: string]: string} = {};
    
    switch (currentStep) {
      case 0: // Basic Info
        if (!formData.name.trim()) errors.name = 'Project name is required';
        if (!formData.description.trim()) errors.description = 'Project description is required';
        break;
      case 1: // Client Info
        if (!formData.clientName.trim()) errors.clientName = 'Client name is required';
        if (!formData.clientEmail.trim()) errors.clientEmail = 'Client email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) errors.clientEmail = 'Valid email address is required';
        if (formData.clientPhone && !/^[\d\s\-\(\)\+]+$/.test(formData.clientPhone)) {
          errors.clientPhone = 'Valid phone number is required';
        }
        break;
      case 2: // Requirements
        if (!formData.objectives.trim()) errors.objectives = 'Project objectives are required';
        if (formData.scope && formData.scope.length < 10) {
          errors.scope = 'Project scope should be more detailed';
        }
        break;
      case 3: // Budget & Timeline
        if (!formData.budget || parseFloat(formData.budget) <= 0) errors.budget = 'Valid budget amount is required';
        if (!formData.startDate) errors.startDate = 'Start date is required';
        if (!formData.endDate) errors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
          errors.endDate = 'End date must be after start date';
        }
        if (formData.estimatedHours && parseFloat(formData.estimatedHours) <= 0) {
          errors.estimatedHours = 'Valid estimated hours is required';
        }
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate back to client portal projects section
      navigate('/client-portal?section=projects');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/client-portal?section=projects')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Projects</span>
          </button>
          
          <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-500 rounded-2xl p-8 shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                {isEdit ? 'Edit Project' : 'Create New Project'}
              </h1>
              <p className="text-white/90 text-lg font-medium">
                {isEdit ? 'Update your project details' : 'Start your next project with us'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === currentStep
                    ? 'bg-green-100 border-green-500 text-green-600'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 ml-4 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Step Content */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter project name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${
                      formErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Describe your project"
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="construction">Construction</option>
                    <option value="renovation">Renovation</option>
                    <option value="design">Design</option>
                    <option value="consulting">Consulting</option>
                  </select>
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                
                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.clientName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter client name"
                  />
                  {formErrors.clientName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.clientName}</p>
                  )}
                </div>

                {/* Client Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Email *
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.clientEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter client email"
                  />
                  {formErrors.clientEmail && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.clientEmail}</p>
                  )}
                </div>

                {/* Client Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter client phone number"
                  />
                </div>

                {/* Client Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Address
                  </label>
                  <textarea
                    value={formData.clientAddress}
                    onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter client address"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Requirements</h3>
                
                {/* Objectives */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Objectives *
                  </label>
                  <textarea
                    value={formData.objectives}
                    onChange={(e) => handleInputChange('objectives', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${
                      formErrors.objectives ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Describe the main objectives and goals of this project"
                  />
                  {formErrors.objectives && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.objectives}</p>
                  )}
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Scope
                  </label>
                  <textarea
                    value={formData.scope}
                    onChange={(e) => handleInputChange('scope', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Define what is included and excluded from the project scope"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Any additional information or special requirements"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Timeline</h3>
                
                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        formErrors.budget ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {formErrors.budget && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.budget}</p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.startDate}</p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.endDate}</p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{isEdit ? 'Review & Update' : 'Review & Submit'}</h3>
                
                <div className="bg-gray-50 rounded-xl p-6 space-y-4 max-w-full overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">Project Name</h4>
                      <p className="text-gray-600 break-words">{formData.name || 'Not specified'}</p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">Category</h4>
                      <p className="text-gray-600 capitalize break-words">{formData.category}</p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">Client Name</h4>
                      <p className="text-gray-600 break-words">{formData.clientName || 'Not specified'}</p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">Budget</h4>
                      <p className="text-gray-600 break-words">${formData.budget || '0.00'}</p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">Start Date</h4>
                      <p className="text-gray-600 break-words">{formData.startDate || 'Not specified'}</p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">End Date</h4>
                      <p className="text-gray-600 break-words">{formData.endDate || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  {formData.description && (
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">Description</h4>
                      <p className="text-gray-600 break-words whitespace-pre-wrap">{formData.description}</p>
                    </div>
                  )}
                  
                  {formData.objectives && (
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">Objectives</h4>
                      <p className="text-gray-600 break-words whitespace-pre-wrap">{formData.objectives}</p>
                    </div>
                  )}
                  
                  {formData.scope && (
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">Project Scope</h4>
                      <p className="text-gray-600 break-words whitespace-pre-wrap">{formData.scope}</p>
                    </div>
                  )}
                  
                  {formData.additionalNotes && (
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900">Additional Notes</h4>
                      <p className="text-gray-600 break-words whitespace-pre-wrap">{formData.additionalNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={currentStep === 0 ? () => navigate('/client-portal?section=projects') : prevStep}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep === 0 ? 'Cancel' : 'Previous'}
            </button>
            
            <button
              type="button"
              onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length - 1 ? (
                isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isEdit ? 'Update Project' : 'Create Project'}</span>
                  </>
                )
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreatePage;