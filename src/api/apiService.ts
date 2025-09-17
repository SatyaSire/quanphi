import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import { generateIdempotencyKey } from '../utils/idempotency';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Base query with auth token
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include', // Include cookies for refresh token
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).session.accessToken;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

// Enhanced base query with token refresh logic
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );
    
    if (refreshResult.data) {
      // Store the new token
      api.dispatch({
        type: 'session/setCredentials',
        payload: refreshResult.data,
      });
      
      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout
      api.dispatch({ type: 'session/clearCredentials' });
      window.location.href = '/login';
    }
  }
  
  return result;
};

export const apiService = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Project',
    'Client',
    'Quotation',
    'Expense',
    'Attendance',
    'Notification',
    'Dashboard',
    'Task',
    'Milestone',
    'Invoice',
    'Payment',
    'Report',
  ],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      { accessToken: string; user: any },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
    }),
    
    signup: builder.mutation<
      { accessToken: string; user: any },
      {
        fullName: string;
        email: string;
        phone: string;
        organizationName: string;
        password: string;
        confirmPassword: string;
        acceptTerms: boolean;
      }
    >({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
    }),
    
    forgotPassword: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
    }),
    
    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string; confirmPassword: string }
    >({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
    }),
    
    refreshToken: builder.mutation<
      { accessToken: string; user: any },
      void
    >({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    
    // User profile endpoints
    getProfile: builder.query<any, void>({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    
    updateProfile: builder.mutation<any, Partial<any>>({
      query: (updates) => ({
        url: '/user/profile',
        method: 'PUT',
        body: updates,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['User'],
    }),

    // Dashboard endpoints
    getDashboardData: builder.query<any, void>({
      query: () => '/reports/dashboard',
      providesTags: ['Dashboard'],
    }),

    // AI Chat endpoint
    queryAI: builder.mutation<any, any>({
      query: (data) => ({
        url: '/ai/query',
        method: 'POST',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
    }),

    // Projects endpoints
    getProjects: builder.query<any, any>({
      query: (params) => ({
        url: '/projects',
        params,
      }),
      providesTags: ['Project'],
    }),

    getProject: builder.query<any, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    createProject: builder.mutation<any, any>({
      query: (data) => ({
        url: '/projects',
        method: 'POST',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Project'],
    }),

    updateProject: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Project'],
    }),

    // Tasks endpoints
    getTasks: builder.query<any, any>({
      query: (params) => ({
        url: '/tasks',
        params,
      }),
      providesTags: ['Task'],
    }),

    createTask: builder.mutation<any, any>({
      query: (data) => ({
        url: '/tasks',
        method: 'POST',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Task', 'Project'],
    }),

    updateTask: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Task', 'Project'],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Task', 'Project'],
    }),

    moveTask: builder.mutation<any, { id: string; status: string; position?: number }>({
      query: ({ id, status, position }) => ({
        url: `/tasks/${id}/move`,
        method: 'POST',
        body: { status, position },
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Task', 'Project'],
    }),

    addTaskComment: builder.mutation<any, { taskId: string; text: string }>({
      query: ({ taskId, text }) => ({
        url: `/tasks/${taskId}/comments`,
        method: 'POST',
        body: { text },
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Task'],
    }),

    uploadTaskAttachment: builder.mutation<any, { taskId: string; file: FormData }>({
      query: ({ taskId, file }) => ({
        url: `/tasks/${taskId}/attachments`,
        method: 'POST',
        body: file,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Task'],
    }),

    // Milestones endpoints
    getProjectMilestones: builder.query<any, string>({
      query: (projectId) => `/projects/${projectId}/milestones`,
      providesTags: ['Milestone'],
    }),

    createMilestone: builder.mutation<any, { projectId: string; data: any }>({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/milestones`,
        method: 'POST',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Milestone', 'Project'],
    }),

    updateMilestone: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/milestones/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Milestone', 'Project'],
    }),

    deleteMilestone: builder.mutation<void, string>({
      query: (id) => ({
        url: `/milestones/${id}`,
        method: 'DELETE',
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Milestone', 'Project'],
    }),

    completeMilestone: builder.mutation<any, { id: string; createInvoice?: boolean }>({
      query: ({ id, createInvoice }) => ({
        url: `/milestones/${id}/complete`,
        method: 'PATCH',
        body: { createInvoice },
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Milestone', 'Project', 'Invoice'],
    }),

    createInvoiceFromMilestone: builder.mutation<any, string>({
      query: (milestoneId) => ({
        url: `/milestones/${milestoneId}/create-invoice`,
        method: 'POST',
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Invoice', 'Milestone', 'Client'],
    }),

    // Clients endpoints
    getClients: builder.query<any, any>({
      query: (params) => ({
        url: '/clients',
        params,
      }),
      providesTags: ['Client'],
    }),

    getClient: builder.query<any, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),

    createClient: builder.mutation<any, any>({
      query: (data) => ({
        url: '/clients',
        method: 'POST',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Client'],
    }),

    updateClient: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/clients/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Client', id }],
    }),

    deleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Client'],
    }),

    // Client-specific data endpoints
    getClientProjects: builder.query<any, string>({
      query: (clientId) => `/clients/${clientId}/projects`,
      providesTags: (result, error, clientId) => [
        { type: 'Project', id: 'LIST' },
        { type: 'Client', id: clientId },
      ],
    }),

    getClientInvoices: builder.query<any, string>({
      query: (clientId) => `/clients/${clientId}/invoices`,
      providesTags: (result, error, clientId) => [
        { type: 'Invoice', id: 'LIST' },
        { type: 'Client', id: clientId },
      ],
    }),

    getClientPayments: builder.query<any, string>({
      query: (clientId) => `/clients/${clientId}/payments`,
      providesTags: (result, error, clientId) => [
        { type: 'Payment', id: 'LIST' },
        { type: 'Client', id: clientId },
      ],
    }),

    // Invoices endpoints
    getInvoices: builder.query<any, any>({
      query: (params) => ({
        url: '/invoices',
        params,
      }),
      providesTags: ['Invoice'],
    }),

    getInvoice: builder.query<any, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),

    createInvoice: builder.mutation<any, any>({
      query: (data) => ({
        url: '/invoices',
        method: 'POST',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Invoice', 'Client'],
    }),

    updateInvoice: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }],
    }),

    deleteInvoice: builder.mutation<void, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: 'DELETE',
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Invoice'],
    }),

    sendInvoice: builder.mutation<void, string>({
      query: (id) => ({
        url: `/invoices/${id}/send`,
        method: 'POST',
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),

    // Payments endpoints
    createPayment: builder.mutation<any, any>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data,
        headers: {
          'Idempotency-Key': data.idempotencyKey || generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Payment', 'Invoice', 'Client'],
    }),

    recordPayment: builder.mutation<any, any>({
      query: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'receiptFile' && data[key]) {
            formData.append('receiptFile', data[key]);
          } else if (data[key] !== undefined) {
            formData.append(key, data[key]);
          }
        });
        
        return {
          url: '/payments/record',
          method: 'POST',
          body: formData,
          headers: {
            'Idempotency-Key': data.idempotencyKey || generateIdempotencyKey(),
          },
        };
      },
      invalidatesTags: ['Payment', 'Invoice', 'Client'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetDashboardDataQuery,
  useQueryAIMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useMoveTaskMutation,
  useAddTaskCommentMutation,
  useUploadTaskAttachmentMutation,
  useGetProjectMilestonesQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
  useCompleteMilestoneMutation,
  useCreateInvoiceFromMilestoneMutation,
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientProjectsQuery,
  useGetClientInvoicesQuery,
  useGetClientPaymentsQuery,
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useSendInvoiceMutation,
  useCreatePaymentMutation,
  useRecordPaymentMutation,
} = apiService;