import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Building,
  FileText,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Coffee,
  UserX,
  Timer,
  Edit
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, AttendanceEntry } from '../../types/attendance';
import { Worker } from '../../types/workers';
import { Project } from '../../types/projects';
import { workersData, getWorkerFullName } from '../../data/workersData';
import { projects } from '../../data/projectsData';
import { leaveTypes } from '../../data/attendanceData';

interface ManualAttendanceEntryProps {
  worker?: Worker;
  existingRecord?: AttendanceRecord;
  selectedProject: string;
  onSave: (record: AttendanceRecord) => void;
  onClose: () => void;
}

interface FormData {
  workerId: string;
  date: string;
  status: AttendanceStatus;
  clockInTime: string;
  clockOutTime: string;
  projectId: string;
  leaveType?: string;
  notes: string;
  halfDayType?: 'first_half' | 'second_half';
  attachments: File[];
}

const ManualAttendanceEntry: React.FC<ManualAttendanceEntryProps> = ({
  worker,
  existingRecord,
  selectedProject,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<FormData>({
    workerId: worker?.id || '',
    date: existingRecord?.date || new Date().toISOString().split('T')[0],
    status: existingRecord?.status || 'present',
    clockInTime: existingRecord?.clockIn ? new Date(existingRecord.clockIn.timestamp).toTimeString().slice(0, 5) : '09:00',
    clockOutTime: existingRecord?.clockOut ? new Date(existingRecord.clockOut.timestamp).toTimeString().slice(0, 5) : '17:00',
    projectId: existingRecord?.projectId || selectedProject,
    leaveType: existingRecord?.leaveType || '',
    notes: existingRecord?.notes || '',
    halfDayType: existingRecord?.halfDayType,
    attachments: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get selected worker
  const selectedWorker = worker || workersData.find(w => w.id === formData.workerId);
  const selectedProject_info = projects.find(p => p.id === formData.projectId);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.workerId) {
      newErrors.workerId = 'Please select a worker';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project';
    }

    if (formData.status === 'present' || formData.status === 'late') {
      if (!formData.clockInTime) {
        newErrors.clockInTime = 'Clock in time is required';
      }
      if (!formData.clockOutTime) {
        newErrors.clockOutTime = 'Clock out time is required';
      }
      if (formData.clockInTime && formData.clockOutTime && formData.clockInTime >= formData.clockOutTime) {
        newErrors.clockOutTime = 'Clock out time must be after clock in time';
      }
    }

    if (formData.status === 'on_leave' && !formData.leaveType) {
      newErrors.leaveType = 'Please select leave type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate hours
      let totalHours: number | undefined;
      let overtimeHours: number | undefined;

      if (formData.status === 'present' || formData.status === 'late') {
        const clockIn = new Date(`${formData.date}T${formData.clockInTime}:00`);
        const clockOut = new Date(`${formData.date}T${formData.clockOutTime}:00`);
        totalHours = Math.round((clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60) * 100) / 100;
        
        if (formData.status === 'half_day') {
          totalHours = totalHours / 2;
        }
        
        const standardHours = 8;
        overtimeHours = Math.max(0, totalHours - standardHours);
      }

      // Create attendance entries
      const clockIn: AttendanceEntry | undefined = (formData.status === 'present' || formData.status === 'late') ? {
        timestamp: new Date(`${formData.date}T${formData.clockInTime}:00`).toISOString(),
        method: 'manual',
        location: {
          address: selectedProject_info?.location || 'Manual Entry',
          projectSite: formData.projectId
        },
        verifiedBy: 'admin',
        notes: formData.notes
      } : undefined;

      const clockOut: AttendanceEntry | undefined = (formData.status === 'present' || formData.status === 'late') ? {
        timestamp: new Date(`${formData.date}T${formData.clockOutTime}:00`).toISOString(),
        method: 'manual',
        location: {
          address: selectedProject_info?.location || 'Manual Entry',
          projectSite: formData.projectId
        },
        verifiedBy: 'admin',
        notes: formData.notes
      } : undefined;

      // Create or update attendance record
      const record: AttendanceRecord = {
        id: existingRecord?.id || `att-${formData.workerId}-${Date.now()}`,
        workerId: formData.workerId,
        employeeId: selectedWorker?.jobInfo.employeeId || '',
        date: formData.date,
        status: formData.status,
        clockIn,
        clockOut,
        totalHours,
        overtimeHours: overtimeHours && overtimeHours > 0 ? overtimeHours : undefined,
        projectId: formData.projectId,
        department: selectedWorker?.jobInfo.department || '',
        employmentType: selectedWorker?.jobInfo.employmentType || 'daily_wage',
        leaveType: formData.status === 'on_leave' ? formData.leaveType : undefined,
        halfDayType: formData.status === 'half_day' ? formData.halfDayType : undefined,
        notes: formData.notes,
        attachments: formData.attachments.map(file => ({
          id: `att-${Date.now()}-${file.name}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString()
        })),
        createdAt: existingRecord?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(record);
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Edit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {existingRecord ? 'Edit Attendance' : 'Manual Attendance Entry'}
                </h3>
                <p className="text-blue-100 text-sm">
                  {selectedWorker ? getWorkerFullName(selectedWorker) : 'Select worker and mark attendance'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Worker Selection */}
            {!worker && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Worker *
                </label>
                <select
                  value={formData.workerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, workerId: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.workerId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a worker...</option>
                  {workersData.filter(w => w.status === 'active').map(worker => (
                    <option key={worker.id} value={worker.id}>
                      {getWorkerFullName(worker)} ({worker.jobInfo.employeeId})
                    </option>
                  ))}
                </select>
                {errors.workerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.workerId}</p>
                )}
              </div>
            )}

            {/* Date and Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select project...</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance Status *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { value: 'present', label: 'Present', icon: CheckCircle, color: 'green' },
                  { value: 'absent', label: 'Absent', icon: UserX, color: 'red' },
                  { value: 'late', label: 'Late', icon: Clock, color: 'yellow' },
                  { value: 'half_day', label: 'Half Day', icon: Timer, color: 'blue' },
                  { value: 'on_leave', label: 'On Leave', icon: Coffee, color: 'purple' }
                ].map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: value as AttendanceStatus }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.status === value
                        ? `border-${color}-500 bg-${color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${
                      formData.status === value ? `text-${color}-600` : 'text-gray-400'
                    }`} />
                    <div className={`text-xs font-medium ${
                      formData.status === value ? `text-${color}-700` : 'text-gray-600'
                    }`}>
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Fields */}
            {(formData.status === 'present' || formData.status === 'late') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clock In Time *
                  </label>
                  <input
                    type="time"
                    value={formData.clockInTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, clockInTime: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.clockInTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.clockInTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.clockInTime}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clock Out Time *
                  </label>
                  <input
                    type="time"
                    value={formData.clockOutTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, clockOutTime: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.clockOutTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.clockOutTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.clockOutTime}</p>
                  )}
                </div>
              </div>
            )}

            {/* Half Day Type */}
            {formData.status === 'half_day' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Half Day Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="first_half"
                      checked={formData.halfDayType === 'first_half'}
                      onChange={(e) => setFormData(prev => ({ ...prev, halfDayType: e.target.value as any }))}
                      className="mr-2"
                    />
                    First Half
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="second_half"
                      checked={formData.halfDayType === 'second_half'}
                      onChange={(e) => setFormData(prev => ({ ...prev, halfDayType: e.target.value as any }))}
                      className="mr-2"
                    />
                    Second Half
                  </label>
                </div>
              </div>
            )}

            {/* Leave Type */}
            {formData.status === 'on_leave' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type *
                </label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData(prev => ({ ...prev, leaveType: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.leaveType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select leave type...</option>
                  {leaveTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} - {type.description}
                    </option>
                  ))}
                </select>
                {errors.leaveType && (
                  <p className="mt-1 text-sm text-red-600">{errors.leaveType}</p>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                placeholder="Add any additional notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload files or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    PDF, DOC, JPG, PNG up to 10MB each
                  </span>
                </label>
              </div>
              
              {/* Attachment List */}
              {formData.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : existingRecord ? 'Update Attendance' : 'Save Attendance'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualAttendanceEntry;