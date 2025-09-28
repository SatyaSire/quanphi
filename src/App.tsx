import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useAppDispatch } from './app/hooks';
import { setLoading, setCredentials } from './app/slices/sessionSlice';
import AppLayout from './layouts/AppLayout';
import ClientPortalPage from './pages/ClientPortalPage';
import ProjectDetailsPage from './pages/client-portal/ProjectDetailsPage';
import ClientPortalProjectCreatePage from './pages/client-portal/ProjectCreatePage';
import ProjectReportPage from './pages/client-portal/ProjectReportPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectCreatePage from './pages/ProjectCreatePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TasksPage from './pages/TasksPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import ClientCreatePage from './pages/ClientCreatePage';
import ClientEditPage from './pages/ClientEditPage';
import MilestonesPage from './pages/MilestonesPage';
import InvoicesPage from './pages/InvoicesPage';
import InvoiceCreatePage from './pages/InvoiceCreatePage';
import PaymentRecordPage from './pages/PaymentRecordPage';
import ExportPayrollPage from './pages/ExportPayrollPage';
import ReportsPage from './pages/ReportsPage';
import AdvancesPage from './pages/AdvancesPage';
import NewAdvancePage from './pages/NewAdvancePage';
import NewReportPage from './pages/NewReportPage';
import NewExportPage from './pages/NewExportPage';
import NotificationsPage from './pages/NotificationsPage';
import AuditTrailPage from './pages/AuditTrailPage';
import PayrollSettingsPage from './pages/PayrollSettingsPage';
import QuotationsPage from './pages/QuotationsPage';
import QuotationCreatePage from './pages/QuotationCreatePage';
import QuotationDetailPage from './pages/QuotationDetailPage';
import QuotationEditPage from './pages/QuotationEditPage';
import ExpensesPage from './pages/ExpensesPage';
import ExpenseCreatePage from './pages/ExpenseCreatePage';
import ExpenseDetailPage from './pages/ExpenseDetailPage';
import ExpenseEditPage from './pages/ExpenseEditPage';
import ExpenseReportsPage from './pages/ExpenseReportsPage';
import ExpenseCategoriesPage from './pages/ExpenseCategoriesPage';
import MaterialsPage from './pages/MaterialsPage';
import MaterialCreatePage from './pages/MaterialCreatePage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import MaterialEditPage from './pages/MaterialEditPage';
import DocumentsPage from './pages/DocumentsPage';
import DocumentCreatePage from './pages/DocumentCreatePage';
import DocumentUploadPage from './pages/DocumentUploadPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import DocumentEditPage from './pages/DocumentEditPage';
import WorkersPage from './pages/WorkersPage';
import WorkerCreatePage from './pages/WorkerCreatePage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import WorkerIDCardPage from './pages/WorkerIDCardPage';
import AuditLogsPage from './pages/AuditLogsPage';
import AttendancePage from './pages/AttendancePage';
import SalarySlipPage from './pages/SalarySlipPage';


const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(setLoading(true));
        
        // Check for existing session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          dispatch(setCredentials({
            user: userData,
            token: localStorage.getItem('token') || ''
          }));
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeApp();
  }, [dispatch]);

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main App Routes */}
          <Route path="/" element={<AppLayout />}>
            {/* Redirect root to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Client Portal */}
            <Route path="client-portal" element={<ClientPortalPage />} />
            <Route path="client-portal/projects" element={<ClientPortalPage />} />
            <Route path="client-portal/projects/new" element={<ClientPortalProjectCreatePage />} />
            <Route path="client-portal/project/:projectId" element={<ProjectDetailsPage />} />
            <Route path="client-portal/project/:projectId/edit" element={<ClientPortalProjectCreatePage />} />
            <Route path="client-portal/project/:projectId/report" element={<ProjectReportPage />} />
            
            {/* Project routes */}
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<ProjectCreatePage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="projects/:id/edit" element={<ProjectCreatePage />} />
            
            {/* Task routes */}
            <Route path="tasks" element={<TasksPage />} />
            
            {/* Milestone routes */}
            <Route path="projects/:projectId/milestones" element={<MilestonesPage />} />
            
            {/* Invoice routes */}
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/new" element={<InvoiceCreatePage />} />
            <Route path="invoices/:id" element={
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">Invoice Details</h1>
                <p className="mt-2 text-gray-600">Invoice details page coming soon...</p>
              </div>
            } />
            <Route path="invoices/:id/edit" element={<InvoiceCreatePage />} />
            <Route path="invoices/:invoiceId/payment" element={<PaymentRecordPage />} />
            
            {/* Client routes */}
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/new" element={<ClientCreatePage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="clients/:id/edit" element={<ClientEditPage />} />
            
            {/* Quotation routes */}
            <Route path="quotations" element={<QuotationsPage />} />
            <Route path="quotations/new" element={<QuotationCreatePage />} />
            <Route path="quotations/:id" element={<QuotationDetailPage />} />
            <Route path="quotations/:id/edit" element={<QuotationEditPage />} />
            
            {/* Additional CRM modules */}
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="expenses/create" element={<ExpenseCreatePage />} />
            <Route path="expenses/:id" element={<ExpenseDetailPage />} />
            <Route path="expenses/:id/edit" element={<ExpenseEditPage />} />
            <Route path="expenses/reports" element={<ExpenseReportsPage />} />
            <Route path="expenses/categories" element={<ExpenseCategoriesPage />} />
            
            {/* Materials routes */}
            <Route path="materials" element={<MaterialsPage />} />
            <Route path="materials/new" element={<MaterialCreatePage />} />
            <Route path="materials/:id" element={<MaterialDetailPage />} />
            <Route path="materials/:id/edit" element={<MaterialEditPage />} />
            
            {/* Documents routes */}
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="documents/new" element={<DocumentCreatePage />} />
            <Route path="documents/upload" element={<DocumentUploadPage />} />
            <Route path="documents/:id" element={<DocumentDetailPage />} />
            <Route path="documents/:id/edit" element={<DocumentEditPage />} />
            
            {/* Workers routes */}
            <Route path="workers" element={<WorkersPage />} />
            <Route path="workers/create" element={<WorkerCreatePage />} />
            <Route path="workers/:id" element={<WorkerProfilePage />} />
            <Route path="workers/:id/edit" element={<WorkerCreatePage />} />
            <Route path="workers/:id/id-card" element={<WorkerIDCardPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="payments" element={<PaymentRecordPage />} />
            <Route path="export-payroll" element={<ExportPayrollPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="/reports/new" element={<NewReportPage />} />
            <Route path="/export-payroll/new" element={<NewExportPage />} />
            <Route path="/advances" element={<AdvancesPage />} />
            <Route path="/advances/new" element={<NewAdvancePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="audit-trail" element={<AuditTrailPage />} />
            <Route path="payroll-settings" element={<PayrollSettingsPage />} />
            <Route path="salary-slip/:workerId" element={<SalarySlipPage />} />
            <Route path="settings" element={
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="mt-2 text-gray-600">Settings page coming soon...</p>
              </div>
            } />
            <Route path="profile" element={
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="mt-2 text-gray-600">Profile page coming soon...</p>
              </div>
            } />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
        </div>
      </AppInitializer>
    </Provider>
  );
}

export default App;
