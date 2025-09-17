import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProjectMutation, useUpdateProjectMutation, useGetProjectQuery, useGetClientsQuery } from '../api/apiService';
import { InputField, TextAreaField, SelectField, DateField } from '../components/common/FormField';
import { LoadingState } from '../components/common/LoadingSpinner';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { CreateProjectRequest, UpdateProjectRequest } from '../types/api';

interface ProjectFormData {
  name: string;
  clientId: string;
  address: string;
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  assignedStaff: string[];
  linkedQuotationId?: string;
  tags: string[];
}

const steps = [
  { id: 'basic', title: 'Basic Info', description: 'Project details and client' },
  { id: 'team', title: 'Team', description: 'Assign staff members' },
  { id: 'budget', title: 'Budget & Schedule', description: 'Timeline and budget' },
  { id: 'review', title: 'Review', description: 'Review and save' },
];

const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    clientId: '',
    address: '',
    startDate: '',
    endDate: '',
    budget: 0,
    description: '',
    assignedStaff: [],
    tags: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);

  const { data: project, isLoading: isLoadingProject } = useGetProjectQuery(id!, {
    skip: !isEdit,
  });
  const { data: clientsData } = useGetClientsQuery({ page: 1, limit: 100 });
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  // Load project data for editing
  React.useEffect(() => {
    if (project && isEdit) {
      setFormData({
        name: project.name,
        clientId: project.clientId,
        address: project.address,
        startDate: project.startDate.split('T')[0],
        endDate: project.endDate.split('T')[0],
        budget: project.budget,
        description: project.description || '',
        assignedStaff: project.assignedStaff || [],
        linkedQuotationId: project.linkedQuotationId,
        tags: project.tags || [],
      });
    }
  }, [project, isEdit]);

  const updateFormData = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Info
        if (!formData.name.trim()) newErrors.name = 'Project name is required';
        if (!formData.clientId) newErrors.clientId = 'Client is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        break;
      case 1: // Team
        // Team assignment is optional
        break;
      case 2: // Budget & Schedule
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (saveAsDraft = false) => {
    if (!validateStep(2)) return; // Validate all required fields

    const projectData = {
      ...formData,
      status: saveAsDraft ? 'draft' : 'active',
    };

    try {
      if (isEdit) {
        await updateProject({ id: id!, ...projectData as UpdateProjectRequest }).unwrap();
      } else {
        await createProject(projectData as CreateProjectRequest).unwrap();
      }
      navigate('/projects');
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  if (isEdit && isLoadingProject) {
    return <LoadingState message="Loading project..." />;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-6">
            <InputField
              label="Project Name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              error={errors.name}
              required
            />
            
            <SelectField
              label="Client"
              value={formData.clientId}
              onChange={(e) => updateFormData('clientId', e.target.value)}
              error={errors.clientId}
              required
            >
              <option value="">Select a client</option>
              {clientsData?.data.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </SelectField>

            <TextAreaField
              label="Project Address"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              error={errors.address}
              rows={3}
              required
            />

            <TextAreaField
              label="Description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={4}
              placeholder="Describe the project scope and requirements..."
            />

            <InputField
              label="Tags"
              value={formData.tags.join(', ')}
              onChange={(e) => updateFormData('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
              placeholder="Enter tags separated by commas"
              helpText="e.g., residential, renovation, kitchen"
            />
          </div>
        );

      case 1: // Team
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Team Members</h3>
              <p className="text-sm text-gray-600 mb-6">
                Select staff members to assign to this project. You can modify assignments later.
              </p>
            </div>

            {/* TODO: Implement staff selection component */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">Staff assignment component will be implemented here</p>
              <p className="text-sm text-gray-400 mt-2">
                For now, team members can be assigned after project creation
              </p>
            </div>
          </div>
        );

      case 2: // Budget & Schedule
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DateField
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => updateFormData('startDate', e.target.value)}
                error={errors.startDate}
                required
              />
              
              <DateField
                label="End Date"
                value={formData.endDate}
                onChange={(e) => updateFormData('endDate', e.target.value)}
                error={errors.endDate}
                required
              />
            </div>

            <InputField
              label="Budget"
              type="number"
              value={formData.budget.toString()}
              onChange={(e) => updateFormData('budget', parseFloat(e.target.value) || 0)}
              error={errors.budget}
              min="0"
              step="0.01"
              required
              helpText="Total project budget in USD"
            />

            <InputField
              label="Linked Quotation ID"
              value={formData.linkedQuotationId || ''}
              onChange={(e) => updateFormData('linkedQuotationId', e.target.value || undefined)}
              placeholder="Optional: Link to existing quotation"
            />
          </div>
        );

      case 3: // Review
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Project Details</h3>
              <p className="text-sm text-gray-600 mb-6">
                Please review the project information before saving.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <p className="mt-1 text-sm text-gray-900">{formData.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {clientsData?.data.find(c => c.id === formData.clientId)?.name || 'Not selected'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <p className="mt-1 text-sm text-gray-900">${formData.budget.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formData.tags.length > 0 ? formData.tags.join(', ') : 'None'}
                  </p>
                </div>
              </div>
              
              {formData.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{formData.address}</p>
                </div>
              )}
              
              {formData.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{formData.description}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to Projects
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEdit ? 'Edit Project' : 'Create New Project'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {isEdit ? 'Update project information' : 'Follow the steps to create a new project'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, index) => (
              <li key={step.id} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                {index !== steps.length - 1 && (
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                )}
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    index < currentStep
                      ? 'bg-blue-600'
                      : index === currentStep
                      ? 'border-2 border-blue-600 bg-white'
                      : 'border-2 border-gray-300 bg-white'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckIcon className="h-5 w-5 text-white" />
                  ) : (
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        index === currentStep ? 'bg-blue-600' : 'bg-transparent'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <p className={`text-sm font-medium ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Form Content */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep === steps.length - 1 && (
              <button
                onClick={() => handleSubmit(true)}
                disabled={isCreating || isUpdating}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Save as Draft
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={isCreating || isUpdating}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreatePage;