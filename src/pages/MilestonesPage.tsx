import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetProjectMilestonesQuery,
  useCreateMilestoneMutation,
  // useUpdateMilestoneMutation, // Not available in apiService
  // useDeleteMilestoneMutation, // Not available in apiService
  useCompleteMilestoneMutation,
  useCreateInvoiceFromMilestoneMutation
} from '../api/apiService';
// TODO: Temporarily commented out all api imports due to import issues
// import { Milestone, CreateMilestoneRequest, UpdateMilestoneRequest } from '../types/api';
import LoadingSpinner, { LoadingState } from '../components/common/LoadingSpinner';
import Modal, { ConfirmModal } from '../components/common/Modal';
import { InputField, SelectField, TextAreaField, DateField } from '../components/common/FormField';
import {
  PlusIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface MilestoneFormData {
  title: string;
  description: string;
  dueDate: string;
  amount: number;
  taskIds: string[];
}

const MilestonesPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [deletingMilestone, setDeletingMilestone] = useState<Milestone | null>(null);
  const [completingMilestone, setCompletingMilestone] = useState<Milestone | null>(null);
  const [createInvoice, setCreateInvoice] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [showInvoiceRetry, setShowInvoiceRetry] = useState(false);
  const [completedMilestoneId, setCompletedMilestoneId] = useState<string | null>(null);

  const {
    data: milestones,
    isLoading,
    error
  } = useGetProjectMilestonesQuery(projectId!);

  const [createMilestone, { isLoading: isCreating }] = useCreateMilestoneMutation();
  const [updateMilestone, { isLoading: isUpdating }] = useUpdateMilestoneMutation();
  const [deleteMilestone, { isLoading: isDeleting }] = useDeleteMilestoneMutation();
  const [completeMilestone, { isLoading: isCompleting }] = useCompleteMilestoneMutation();
  const [createInvoiceFromMilestone, { isLoading: isCreatingInvoice }] = useCreateInvoiceFromMilestoneMutation();

  const [formData, setFormData] = useState<MilestoneFormData>({
    title: '',
    description: '',
    dueDate: '',
    amount: 0,
    taskIds: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMilestone) {
        await updateMilestone({
          id: editingMilestone.id,
          ...formData
        }).unwrap();
        setEditingMilestone(null);
      } else {
        await createMilestone({
          projectId: projectId!,
          ...formData
        }).unwrap();
        setShowCreateModal(false);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save milestone:', error);
    }
  };

  const handleDelete = async () => {
    if (!deletingMilestone) return;
    try {
      await deleteMilestone(deletingMilestone.id).unwrap();
      setDeletingMilestone(null);
    } catch (error) {
      console.error('Failed to delete milestone:', error);
    }
  };

  const handleComplete = async () => {
    if (!completingMilestone) return;
    
    try {
      // First, complete the milestone
      await completeMilestone({
        id: completingMilestone.id
      }).unwrap();
      
      // If invoice creation is requested, create it
      if (createInvoice && completingMilestone.amount > 0) {
        try {
          await createInvoiceFromMilestone({
            milestoneId: completingMilestone.id
          }).unwrap();
          
          // Success - close modal and reset state
          setCompletingMilestone(null);
          setCreateInvoice(false);
          setInvoiceError(null);
          setShowInvoiceRetry(false);
        } catch (invoiceError: any) {
          // Milestone completed but invoice creation failed
          setCompletedMilestoneId(completingMilestone.id);
          setInvoiceError(
            invoiceError?.data?.message || 
            'Failed to create invoice. The milestone has been completed, but the invoice could not be generated.'
          );
          setShowInvoiceRetry(true);
          setCompletingMilestone(null);
        }
      } else {
        // No invoice needed - just close modal
        setCompletingMilestone(null);
        setCreateInvoice(false);
      }
    } catch (error: any) {
      console.error('Failed to complete milestone:', error);
      // Handle milestone completion error
      setInvoiceError(
        error?.data?.message || 
        'Failed to complete milestone. Please try again.'
      );
    }
  };
  
  const handleRetryInvoiceCreation = async () => {
    if (!completedMilestoneId) return;
    
    try {
      await createInvoiceFromMilestone({
        milestoneId: completedMilestoneId
      }).unwrap();
      
      // Success - close retry modal
      setShowInvoiceRetry(false);
      setInvoiceError(null);
      setCompletedMilestoneId(null);
    } catch (error: any) {
      setInvoiceError(
        error?.data?.message || 
        'Failed to create invoice. Please try again or create the invoice manually.'
      );
    }
  };
  
  const handleCloseInvoiceRetry = () => {
    setShowInvoiceRetry(false);
    setInvoiceError(null);
    setCompletedMilestoneId(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      amount: 0,
      taskIds: []
    });
  };

  const openEditModal = (milestone: Milestone) => {
    setFormData({
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate.split('T')[0],
      amount: milestone.amount,
      taskIds: milestone.taskIds || []
    });
    setEditingMilestone(milestone);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIconSolid className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <div className="p-6 text-red-600">Error loading milestones</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Milestones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track project progress and manage milestone payments
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Milestone
        </button>
      </div>

      {/* Timeline View */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Milestone Timeline</h2>
        
        {milestones && milestones.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className="relative flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-200 rounded-full">
                    {getStatusIcon(milestone.status)}
                  </div>
                  
                  {/* Milestone card */}
                  <div className="ml-6 flex-1">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {milestone.title}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                              {milestone.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="mt-1 text-sm text-gray-600">
                            {milestone.description}
                          </p>
                          
                          <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                              ${milestone.amount.toLocaleString()}
                            </div>
                            {milestone.taskIds && milestone.taskIds.length > 0 && (
                              <div className="flex items-center">
                                <DocumentTextIcon className="h-4 w-4 mr-1" />
                                {milestone.taskIds.length} tasks
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {milestone.status !== 'completed' && (
                            <button
                              onClick={() => setCompletingMilestone(milestone)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(milestone)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingMilestone(milestone)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No milestones</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first milestone.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Milestone
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!editingMilestone}
        onClose={() => {
          setShowCreateModal(false);
          setEditingMilestone(null);
          resetForm();
        }}
        title={editingMilestone ? 'Edit Milestone' : 'Create Milestone'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            
            <FormField
              label="Amount ($)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setEditingMilestone(null);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isCreating || isUpdating ? (
                <LoadingSpinner size="sm" />
              ) : editingMilestone ? (
                'Update Milestone'
              ) : (
                'Create Milestone'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Complete Milestone Modal */}
      <Modal
        isOpen={!!completingMilestone}
        onClose={() => {
          setCompletingMilestone(null);
          setCreateInvoice(false);
        }}
        title="Complete Milestone"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Mark milestone as complete?
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This will update the milestone status and optionally create an invoice.
              </p>
            </div>
          </div>
          
          {completingMilestone && completingMilestone.amount > 0 && (
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <input
                  id="create-invoice"
                  type="checkbox"
                  checked={createInvoice}
                  onChange={(e) => setCreateInvoice(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="create-invoice" className="ml-2 text-sm text-gray-700">
                  Create invoice for ${completingMilestone.amount.toLocaleString()}
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                An invoice will be automatically generated for this milestone amount.
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setCompletingMilestone(null);
                setCreateInvoice(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isCompleting ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Complete Milestone'
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingMilestone}
        onClose={() => setDeletingMilestone(null)}
        onConfirm={handleDelete}
        title="Delete Milestone"
        message="Are you sure you want to delete this milestone? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
        icon={<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />}
      />
      
      {/* Invoice Creation Error/Retry Modal */}
      <Modal
        isOpen={showInvoiceRetry}
        onClose={handleCloseInvoiceRetry}
        title="Invoice Creation Failed"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Invoice could not be created
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The milestone has been completed successfully, but there was an issue creating the invoice.
              </p>
            </div>
          </div>
          
          {invoiceError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{invoiceError}</p>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              You can retry creating the invoice now, or create it manually later from the invoices page.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCloseInvoiceRetry}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handleRetryInvoiceCreation}
              disabled={isCreatingInvoice}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isCreatingInvoice ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Retry Invoice Creation'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MilestonesPage;