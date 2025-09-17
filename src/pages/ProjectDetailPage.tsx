import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProjectQuery } from '../api/apiService';
import { LoadingState } from '../components/common/LoadingSpinner';
import KPICard from '../components/common/KPICard';
import Chart from '../components/common/Chart';
import {
  ChevronLeftIcon,
  PencilIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  DocumentIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import type { Project } from '../types/api';
import ProjectExpensesTab from '../components/ProjectExpensesTab';

interface TabItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: project, isLoading, error } = useGetProjectQuery(id!);

  if (isLoading) {
    return <LoadingState message="Loading project details..." />;
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load project details</p>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
        statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const tabs: TabItem[] = [
    { id: 'overview', name: 'Overview', icon: ClipboardDocumentListIcon },
    { id: 'tasks', name: 'Tasks', icon: ClipboardDocumentListIcon, count: project.taskCount || 0 },
    { id: 'milestones', name: 'Milestones', icon: CalendarIcon, count: project.milestoneCount || 0 },
    { id: 'workers', name: 'Workers', icon: UserGroupIcon, count: project.assignedStaff?.length || 0 },
    { id: 'materials', name: 'Materials', icon: BuildingOfficeIcon },
    { id: 'expenses', name: 'Expenses', icon: CurrencyDollarIcon },
    { id: 'documents', name: 'Documents', icon: DocumentIcon },
    { id: 'payments', name: 'Payments', icon: CreditCardIcon },
  ];

  const renderOverviewTab = () => {
    const budgetData = [
      { name: 'Budget', value: project.budget },
      { name: 'Actual', value: project.actualCost },
    ];

    const progressData = [
      { name: 'Completed', value: project.progress },
      { name: 'Remaining', value: 100 - project.progress },
    ];

    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Budget vs Actual"
            value={`$${project.actualCost.toLocaleString()}`}
            change={{
              value: ((project.actualCost - project.budget) / project.budget * 100),
              type: project.actualCost > project.budget ? 'decrease' : 'increase'
            }}
            icon={CurrencyDollarIcon}
          />
          <KPICard
            title="Progress"
            value={`${project.progress}%`}
            icon={ClipboardDocumentListIcon}
          />
          <KPICard
            title="Tasks"
            value={project.taskCount?.toString() || '0'}
            icon={ClipboardDocumentListIcon}
          />
          <KPICard
            title="Team Members"
            value={project.assignedStaff?.length.toString() || '0'}
            icon={UserGroupIcon}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h3>
            <Chart
              type="bar"
              data={budgetData}
              height={300}
              options={{
                xAxisKey: 'name',
                yAxisKey: 'value',
              }}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Progress</h3>
            <Chart
              type="pie"
              data={progressData}
              height={300}
              options={{
                dataKey: 'value',
                nameKey: 'name',
              }}
            />
          </div>
        </div>

        {/* Project Timeline */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Project Start</p>
                <p className="text-sm text-gray-600">{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">Project End</p>
                <p className="text-sm text-gray-600">{new Date(project.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab('tasks')}
              className="p-4 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ClipboardDocumentListIcon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium text-gray-900">Manage Tasks</p>
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className="p-4 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium text-gray-900">View Milestones</p>
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className="p-4 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CurrencyDollarIcon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium text-gray-900">Add Expense</p>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className="p-4 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CreditCardIcon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium text-gray-900">View Payments</p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'tasks':
        return (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Task Management</h3>
            <p className="text-gray-600 mb-4">Task kanban board will be implemented here</p>
            <button
              onClick={() => navigate(`/tasks?projectId=${project.id}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Task Board
            </button>
          </div>
        );
      case 'milestones':
        return (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Project Milestones</h3>
            <p className="text-gray-600 mb-4">Milestone management will be implemented here</p>
          </div>
        );
      case 'workers':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Assigned Workers</h3>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Assign Worker
              </button>
            </div>
            {project.assignedStaff && project.assignedStaff.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.assignedStaff.map((staffId, index) => (
                  <div key={staffId} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Worker {index + 1}</p>
                        <p className="text-sm text-gray-600">ID: {staffId}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UserGroupIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Workers Assigned</h3>
                <p className="text-gray-600 mb-4">Assign workers to this project to track their progress</p>
              </div>
            )}
          </div>
        );
      case 'materials':
        return (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Project Materials</h3>
            <p className="text-gray-600 mb-4">Material allocation and tracking will be implemented here</p>
          </div>
        );
      case 'expenses':
        return <ProjectExpensesTab projectId={project.id} projectName={project.name} projectBudget={project.budget} />;
      case 'documents':
        return (
          <div className="text-center py-12">
            <DocumentIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Project Documents</h3>
            <p className="text-gray-600 mb-4">Document management will be implemented here</p>
          </div>
        );
      case 'payments':
        return (
          <div className="text-center py-12">
            <CreditCardIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Project Payments</h3>
            <p className="text-gray-600 mb-4">Payment tracking will be implemented here</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Back to Projects
            </button>
            <button
              onClick={() => navigate(`/projects/${project.id}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Project
            </button>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
              <p className="mt-1 text-sm text-gray-600">{project.clientName}</p>
              <p className="mt-1 text-sm text-gray-500">{project.address}</p>
            </div>
            <div className="text-right">
              {getStatusBadge(project.status)}
              <p className="mt-2 text-sm text-gray-600">
                Budget: <span className="font-medium">${project.budget.toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Actual: <span className="font-medium">${project.actualCost.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;