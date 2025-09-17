import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useGetTasksQuery, useUpdateTaskMutation, useCreateTaskMutation, useMoveTaskMutation } from '../api/apiService';
import Modal from '../components/common/Modal';
import TaskDetailDrawer from '../components/tasks/TaskDetailDrawer';
import { InputField, TextAreaField, SelectField, DateField } from '../components/common/FormField';
import { LoadingState } from '../components/common/LoadingSpinner';
import {
  PlusIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/api';

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

interface TaskFormData {
  title: string;
  description: string;
  assigneeId: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectId?: string;
}

const handleTaskClick = (task: Task) => {
  setSelectedTask(task);
  setShowTaskDrawer(true);
};

const TaskCard: React.FC<{ task: Task; onEdit: (task: Task) => void }> = ({ task, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div
        {...listeners}
        className="cursor-move"
        onClick={(e) => {
          e.stopPropagation();
          handleTaskClick(task);
        }}
      >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
        <button className="text-gray-400 hover:text-gray-600">
          <EllipsisVerticalIcon className="h-4 w-4" />
        </button>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          getPriorityColor(task.priority)
        }`}>
          {task.priority}
        </span>
        
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {task.commentsCount > 0 && (
            <div className="flex items-center">
              <ChatBubbleLeftIcon className="h-3 w-3 mr-1" />
              {task.commentsCount}
            </div>
          )}
          {task.attachmentsCount > 0 && (
            <div className="flex items-center">
              <PaperClipIcon className="h-3 w-3 mr-1" />
              {task.attachmentsCount}
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      
      {task.assigneeName && (
        <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
          <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
            <UserIcon className="h-3 w-3 text-gray-600" />
          </div>
          <span className="text-xs text-gray-600">{task.assigneeName}</span>
        </div>
      )}</div>
      
      {/* Error Toast */}
      {dragError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {dragError}
        </div>
      )}
      
      {/* Task Detail Drawer */}
      {showTaskDrawer && selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          isOpen={showTaskDrawer}
          onClose={() => {
            setShowTaskDrawer(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

const TaskColumn: React.FC<{
  column: Column;
  onAddTask: (status: string) => void;
  onEditTask: (task: Task) => void;
}> = ({ column, onAddTask, onEditTask }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 min-h-[600px] w-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${column.color}`} />
          <h3 className="font-medium text-gray-900">{column.title}</h3>
          <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="text-gray-400 hover:text-gray-600"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      
      <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [], color: 'bg-gray-400' },
    { id: 'in-progress', title: 'In Progress', tasks: [], color: 'bg-blue-400' },
    { id: 'review', title: 'Review', tasks: [], color: 'bg-yellow-400' },
    { id: 'done', title: 'Done', tasks: [], color: 'bg-green-400' },
  ]);
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDrawer, setShowTaskDrawer] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'medium',
    dueDate: '',
    projectId: projectId || undefined,
  });

  const { data: tasksData, isLoading } = useGetTasksQuery({ projectId: projectId || undefined });
  const [updateTask] = useUpdateTaskMutation();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [moveTask, { isLoading: isMoving }] = useMoveTaskMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Organize tasks into columns
  useEffect(() => {
    if (tasksData?.data) {
      const tasksByStatus = tasksData.data.reduce((acc, task) => {
        if (!acc[task.status]) acc[task.status] = [];
        acc[task.status].push(task);
        return acc;
      }, {} as Record<string, Task[]>);

      setColumns(prev => prev.map(column => ({
        ...column,
        tasks: tasksByStatus[column.id] || [],
      })));
    }
  }, [tasksData]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = columns.flatMap(col => col.tasks).find(task => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setDragError(null);
    
    if (!over) return;
    
    const activeTaskId = active.id as string;
    const overColumnId = over.id as string;
    
    // Find the task being moved
    const task = columns.flatMap(col => col.tasks).find(t => t.id === activeTaskId);
    if (!task) return;
    
    // If task is being moved to a different column
    if (task.status !== overColumnId) {
      // Store original state for rollback
      const originalColumns = columns;
      
      // Optimistic update
      setColumns(prevColumns => {
        const newColumns = prevColumns.map(column => {
          if (column.id === task.status) {
            // Remove task from current column
            return {
              ...column,
              tasks: column.tasks.filter(t => t.id !== activeTaskId)
            };
          }
          if (column.id === overColumnId) {
            // Add task to new column
            return {
              ...column,
              tasks: [...column.tasks, { ...task, status: overColumnId as any }]
            };
          }
          return column;
        });
        return newColumns;
      });
      
      try {
        // Update task status on server
        await moveTask({
          id: activeTaskId,
          status: overColumnId
        }).unwrap();
      } catch (error) {
        // Rollback on error
        setColumns(originalColumns);
        setDragError('Failed to move task. Please try again.');
        console.error('Failed to move task:', error);
        
        // Clear error after 3 seconds
        setTimeout(() => setDragError(null), 3000);
      }
    }
  };

  const handleAddTask = (status: string) => {
    setTaskFormData({
      title: '',
      description: '',
      assigneeId: '',
      priority: 'medium',
      dueDate: '',
      projectId: projectId || undefined,
    });
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskFormData({
      title: task.title,
      description: task.description || '',
      assigneeId: task.assigneeId || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      projectId: task.projectId,
    });
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSubmitTask = async () => {
    try {
      if (editingTask) {
        await updateTask({
          id: editingTask.id,
          ...taskFormData,
        } as UpdateTaskRequest).unwrap();
      } else {
        await createTask(taskFormData as CreateTaskRequest).unwrap();
      }
      setShowTaskModal(false);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading tasks..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {projectId ? 'Project Tasks' : 'All Tasks'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage tasks using the kanban board. Drag and drop to change status.
          </p>
        </div>
        <button
          onClick={() => handleAddTask('todo')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 pb-6">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeTask ? (
              <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 rotate-3">
                <h4 className="font-medium text-gray-900 text-sm">{activeTask.title}</h4>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <div className="space-y-6">
          <InputField
            label="Task Title"
            value={taskFormData.title}
            onChange={(e) => setTaskFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          
          <TextAreaField
            label="Description"
            value={taskFormData.description}
            onChange={(e) => setTaskFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Priority"
              value={taskFormData.priority}
              onChange={(e) => setTaskFormData(prev => ({ ...prev, priority: e.target.value as any }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </SelectField>
            
            <DateField
              label="Due Date"
              value={taskFormData.dueDate}
              onChange={(e) => setTaskFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>
          
          <InputField
            label="Assignee ID"
            value={taskFormData.assigneeId}
            onChange={(e) => setTaskFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
            placeholder="Enter assignee ID"
          />
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              onClick={() => setShowTaskModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitTask}
              disabled={isCreating || !taskFormData.title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;