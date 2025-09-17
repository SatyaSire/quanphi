import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useAddTaskCommentMutation,
  useUploadTaskAttachmentMutation
} from '../../api/apiService';
import { InputField, TextAreaField, SelectField, DateField } from '../common/FormField';
import {
  XMarkIcon,
  PaperClipIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ClockIcon,
  DocumentIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import type { Task, TaskComment, TaskAttachment } from '../../types/api';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate || '',
    assigneeId: task?.assigneeId || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [addComment, { isLoading: isAddingComment }] = useAddTaskCommentMutation();
  const [uploadAttachment, { isLoading: isUploading }] = useUploadTaskAttachmentMutation();

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        assigneeId: task.assigneeId
      });
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;
    
    try {
      const updatedTask = await updateTask({
        id: task.id,
        data: formData
      }).unwrap();
      
      onUpdate(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newComment.trim()) return;

    try {
      await addComment({
        taskId: task.id,
        text: newComment.trim()
      }).unwrap();
      
      setNewComment('');
      // In a real app, you'd refetch the task or update via socket
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !task) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await uploadAttachment({
        taskId: task.id,
        file: formData
      }).unwrap();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload attachment:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !task) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Task' : 'Task Details'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Info */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <InputField
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
                <TextAreaField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
                <SelectField
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' }
                  ]}
                />
                <DateField
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                    getPriorityColor(task.priority)
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    getStatusColor(task.status)
                  }`}>
                    {task.status}
                  </span>
                </div>

                {task.description && (
                  <p className="text-gray-600">{task.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {task.assigneeName}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 flex items-center">
                <PaperClipIcon className="h-4 w-4 mr-2" />
                Attachments
              </h4>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            
            {task.attachments?.length > 0 ? (
              <div className="space-y-2">
                {task.attachments.map((attachment: TaskAttachment) => (
                  <div key={attachment.id} className="flex items-center p-2 bg-gray-50 rounded">
                    <DocumentIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900 flex-1">{attachment.filename}</span>
                    <span className="text-xs text-gray-500">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No attachments</p>
            )}
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center">
              <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
              Comments
            </h4>
            
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-2">
              <TextAreaField
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
              />
              <button
                type="submit"
                disabled={isAddingComment || !newComment.trim()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {isAddingComment ? 'Adding...' : 'Add Comment'}
              </button>
            </form>
            
            {/* Comments List */}
            {task.comments?.length > 0 ? (
              <div className="space-y-3">
                {task.comments.map((comment: TaskComment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailDrawer;