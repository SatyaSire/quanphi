import type { Client } from '../types/api';

export const staticClients: Client[] = [
  {
    id: '1',
    name: 'Metro Development Corp',
    businessName: 'Metro Development Corporation Ltd.',
    companyType: 'company',
    primaryContact: {
      id: 'c1',
      name: 'Sarah Johnson',
      designation: 'Project Director',
      email: 'sarah.johnson@metrodev.com',
      phone: '+91 98765 43210',
      isPrimary: true,
    },
    additionalContacts: [
      {
        id: 'c2',
        name: 'Michael Chen',
        designation: 'Finance Manager',
        email: 'michael.chen@metrodev.com',
        phone: '+91 98765 43211',
        isPrimary: false,
      },
    ],
    addresses: [
      {
        id: 'a1',
        type: 'headquarters',
        addressLine1: '123 Business District',
        addressLine2: 'Tower A, 15th Floor',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
        isPrimary: true,
      },
    ],
    preferredContactMethod: 'email',
    gstin: '27AABCU9603R1ZX',
    panNumber: 'AABCU9603R',
    status: 'active',
    riskLevel: 'low',
    tags: [
      { id: 't1', name: 'Premium Client', color: 'bg-purple-100 text-purple-800', description: 'High-value client' },
      { id: 't2', name: 'Commercial', color: 'bg-blue-100 text-blue-800', description: 'Commercial projects' },
    ],
    financialSummary: {
      totalProjects: 3,
      totalInvoices: 8,
      totalAmountInvoiced: 2500000,
      totalAmountPaid: 2100000,
      outstandingAmount: 400000,
      overdueAmount: 0,
      creditLimit: 5000000,
      averagePaymentDelay: 5,
      lastPaymentDate: '2024-01-15',
    },
    notes: [],
    internalComments: 'Excellent payment history, preferred client for large projects.',
    lastActivity: '2024-01-20',
    createdBy: 'admin',
    assignedManager: 'manager1',
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'Premium Homes Ltd',
    businessName: 'Premium Homes Private Limited',
    companyType: 'company',
    primaryContact: {
      id: 'c3',
      name: 'Rajesh Kumar',
      designation: 'Managing Director',
      email: 'rajesh@premiumhomes.in',
      phone: '+91 98765 43220',
      isPrimary: true,
    },
    additionalContacts: [],
    addresses: [
      {
        id: 'a2',
        type: 'headquarters',
        addressLine1: '456 Residential Complex',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        country: 'India',
        isPrimary: true,
      },
    ],
    preferredContactMethod: 'phone',
    gstin: '27AABCP9603R1ZY',
    status: 'active',
    riskLevel: 'medium',
    tags: [
      { id: 't3', name: 'Residential', color: 'bg-green-100 text-green-800', description: 'Residential projects' },
    ],
    financialSummary: {
      totalProjects: 2,
      totalInvoices: 5,
      totalAmountInvoiced: 1800000,
      totalAmountPaid: 1350000,
      outstandingAmount: 450000,
      overdueAmount: 150000,
      averagePaymentDelay: 15,
      lastPaymentDate: '2023-12-20',
    },
    notes: [],
    internalComments: 'Sometimes delays in payments, but reliable overall.',
    lastActivity: '2024-01-18',
    createdBy: 'admin',
    assignedManager: 'manager2',
    createdAt: '2023-08-10T10:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
  },
  {
    id: '3',
    name: 'LogiTech Solutions',
    businessName: 'LogiTech Solutions Pvt Ltd',
    companyType: 'company',
    primaryContact: {
      id: 'c4',
      name: 'David Rodriguez',
      designation: 'Operations Head',
      email: 'david@logitech.com',
      phone: '+91 98765 43230',
      isPrimary: true,
    },
    additionalContacts: [],
    addresses: [
      {
        id: 'a3',
        type: 'headquarters',
        addressLine1: '789 Industrial Area',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        country: 'India',
        isPrimary: true,
      },
    ],
    preferredContactMethod: 'email',
    gstin: '33AABCL9603R1ZZ',
    status: 'active',
    riskLevel: 'low',
    tags: [
      { id: 't4', name: 'Industrial', color: 'bg-orange-100 text-orange-800', description: 'Industrial projects' },
      { id: 't5', name: 'Technology', color: 'bg-indigo-100 text-indigo-800', description: 'Tech solutions' },
    ],
    financialSummary: {
      totalProjects: 4,
      totalInvoices: 12,
      totalAmountInvoiced: 3200000,
      totalAmountPaid: 3200000,
      outstandingAmount: 0,
      overdueAmount: 0,
      averagePaymentDelay: 2,
      lastPaymentDate: '2024-01-22',
    },
    notes: [],
    internalComments: 'Very prompt with payments, excellent client relationship.',
    lastActivity: '2024-01-22',
    createdBy: 'admin',
    assignedManager: 'manager1',
    createdAt: '2023-09-05T10:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
  },
  {
    id: '4',
    name: 'Anita Sharma',
    businessName: 'Anita Sharma Consultancy',
    companyType: 'individual',
    primaryContact: {
      id: 'c5',
      name: 'Anita Sharma',
      designation: 'Owner',
      email: 'anita.sharma@gmail.com',
      phone: '+91 98765 43240',
      isPrimary: true,
    },
    additionalContacts: [],
    addresses: [
      {
        id: 'a4',
        type: 'residential',
        addressLine1: '321 Green Park',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110016',
        country: 'India',
        isPrimary: true,
      },
    ],
    preferredContactMethod: 'email',
    status: 'active',
    riskLevel: 'low',
    tags: [
      { id: 't6', name: 'Individual', color: 'bg-teal-100 text-teal-800', description: 'Individual client' },
      { id: 't7', name: 'Consulting', color: 'bg-yellow-100 text-yellow-800', description: 'Consulting services' },
    ],
    financialSummary: {
      totalProjects: 1,
      totalInvoices: 3,
      totalAmountInvoiced: 750000,
      totalAmountPaid: 500000,
      outstandingAmount: 250000,
      overdueAmount: 0,
      averagePaymentDelay: 7,
      lastPaymentDate: '2024-01-10',
    },
    notes: [],
    internalComments: 'Small but consistent client, good for specialized consulting work.',
    lastActivity: '2024-01-15',
    createdBy: 'admin',
    assignedManager: 'manager3',
    createdAt: '2023-11-20T10:00:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
  },
  {
    id: '5',
    name: 'Government Housing Board',
    businessName: 'State Government Housing Development Board',
    companyType: 'government',
    primaryContact: {
      id: 'c6',
      name: 'Priya Patel',
      designation: 'Assistant Director',
      email: 'priya.patel@housing.gov.in',
      phone: '+91 98765 43250',
      isPrimary: true,
    },
    additionalContacts: [
      {
        id: 'c7',
        name: 'Amit Verma',
        designation: 'Project Coordinator',
        email: 'amit.verma@housing.gov.in',
        phone: '+91 98765 43251',
        isPrimary: false,
      },
    ],
    addresses: [
      {
        id: 'a5',
        type: 'office',
        addressLine1: 'Government Complex',
        addressLine2: 'Block C, 3rd Floor',
        city: 'Gandhinagar',
        state: 'Gujarat',
        pincode: '382010',
        country: 'India',
        isPrimary: true,
      },
    ],
    preferredContactMethod: 'email',
    gstin: '24AABCG9603R1AA',
    status: 'active',
    riskLevel: 'high',
    tags: [
      { id: 't8', name: 'Government', color: 'bg-gray-100 text-gray-800', description: 'Government entity' },
      { id: 't9', name: 'Large Scale', color: 'bg-red-100 text-red-800', description: 'Large scale projects' },
    ],
    financialSummary: {
      totalProjects: 2,
      totalInvoices: 6,
      totalAmountInvoiced: 5000000,
      totalAmountPaid: 3000000,
      outstandingAmount: 2000000,
      overdueAmount: 800000,
      averagePaymentDelay: 45,
      lastPaymentDate: '2023-11-30',
    },
    notes: [],
    internalComments: 'Large projects but very slow payment cycles. Requires patience.',
    lastActivity: '2024-01-12',
    createdBy: 'admin',
    assignedManager: 'manager1',
    createdAt: '2023-07-01T10:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
  },
];

export const getClientById = (id: string): Client | undefined => {
  return staticClients.find(client => client.id === id);
};

export const getClientProjects = (clientId: string) => {
  // Mock project data based on client
  const projectsMap: Record<string, any[]> = {
    '1': [
      { id: 'p1', name: 'Metro Tower Construction', status: 'active', updatedAt: '2024-01-20T10:00:00Z', budget: 1500000 },
      { id: 'p2', name: 'Commercial Complex Phase 1', status: 'completed', updatedAt: '2023-12-15T10:00:00Z', budget: 800000 },
      { id: 'p3', name: 'Parking Structure', status: 'active', updatedAt: '2024-01-18T10:00:00Z', budget: 200000 },
    ],
    '2': [
      { id: 'p4', name: 'Residential Villa Project', status: 'active', updatedAt: '2024-01-18T10:00:00Z', budget: 1200000 },
      { id: 'p5', name: 'Apartment Complex', status: 'completed', updatedAt: '2023-11-20T10:00:00Z', budget: 600000 },
    ],
    '3': [
      { id: 'p6', name: 'Warehouse Automation', status: 'active', updatedAt: '2024-01-22T10:00:00Z', budget: 2000000 },
      { id: 'p7', name: 'Office Building', status: 'completed', updatedAt: '2023-12-30T10:00:00Z', budget: 800000 },
      { id: 'p8', name: 'Manufacturing Unit', status: 'completed', updatedAt: '2023-10-15T10:00:00Z', budget: 400000 },
    ],
    '4': [
      { id: 'p9', name: 'Business Consulting Setup', status: 'active', updatedAt: '2024-01-15T10:00:00Z', budget: 750000 },
    ],
    '5': [
      { id: 'p10', name: 'Public Housing Phase 1', status: 'active', updatedAt: '2024-01-12T10:00:00Z', budget: 3000000 },
      { id: 'p11', name: 'Community Center', status: 'on_hold', updatedAt: '2023-12-01T10:00:00Z', budget: 2000000 },
    ],
  };
  
  return projectsMap[clientId] || [];
};

export const getClientInvoices = (clientId: string) => {
  // Mock invoice data based on client
  const invoicesMap: Record<string, any[]> = {
    '1': [
      { id: 'inv1', total: 500000, paidAmount: 500000, status: 'paid', createdAt: '2024-01-01T10:00:00Z', projectName: 'Metro Tower Construction' },
      { id: 'inv2', total: 300000, paidAmount: 300000, status: 'paid', createdAt: '2024-01-15T10:00:00Z', projectName: 'Commercial Complex Phase 1' },
      { id: 'inv3', total: 400000, paidAmount: 0, status: 'pending', createdAt: '2024-01-20T10:00:00Z', projectName: 'Metro Tower Construction' },
    ],
    '2': [
      { id: 'inv4', total: 600000, paidAmount: 450000, status: 'partial', createdAt: '2024-01-10T10:00:00Z', projectName: 'Residential Villa Project' },
      { id: 'inv5', total: 300000, paidAmount: 300000, status: 'paid', createdAt: '2023-12-20T10:00:00Z', projectName: 'Apartment Complex' },
    ],
    '3': [
      { id: 'inv6', total: 800000, paidAmount: 800000, status: 'paid', createdAt: '2024-01-22T10:00:00Z', projectName: 'Warehouse Automation' },
      { id: 'inv7', total: 400000, paidAmount: 400000, status: 'paid', createdAt: '2023-12-30T10:00:00Z', projectName: 'Office Building' },
    ],
    '4': [
      { id: 'inv8', total: 250000, paidAmount: 250000, status: 'paid', createdAt: '2024-01-10T10:00:00Z', projectName: 'Business Consulting Setup' },
      { id: 'inv9', total: 250000, paidAmount: 0, status: 'pending', createdAt: '2024-01-15T10:00:00Z', projectName: 'Business Consulting Setup' },
    ],
    '5': [
      { id: 'inv10', total: 1000000, paidAmount: 1000000, status: 'paid', createdAt: '2023-11-30T10:00:00Z', projectName: 'Public Housing Phase 1' },
      { id: 'inv11', total: 2000000, paidAmount: 0, status: 'overdue', createdAt: '2023-10-15T10:00:00Z', projectName: 'Public Housing Phase 1' },
    ],
  };
  
  return invoicesMap[clientId] || [];
};

export const getClientPayments = (clientId: string) => {
  // Mock payment data based on client
  const paymentsMap: Record<string, any[]> = {
    '1': [
      { id: 'pay1', amount: 500000, createdAt: '2024-01-05T10:00:00Z', method: 'bank_transfer', invoiceId: 'inv1' },
      { id: 'pay2', amount: 300000, createdAt: '2024-01-18T10:00:00Z', method: 'cheque', invoiceId: 'inv2' },
    ],
    '2': [
      { id: 'pay3', amount: 450000, createdAt: '2024-01-12T10:00:00Z', method: 'bank_transfer', invoiceId: 'inv4' },
      { id: 'pay4', amount: 300000, createdAt: '2023-12-22T10:00:00Z', method: 'cash', invoiceId: 'inv5' },
    ],
    '3': [
      { id: 'pay5', amount: 800000, createdAt: '2024-01-24T10:00:00Z', method: 'bank_transfer', invoiceId: 'inv6' },
      { id: 'pay6', amount: 400000, createdAt: '2024-01-02T10:00:00Z', method: 'bank_transfer', invoiceId: 'inv7' },
    ],
    '4': [
      { id: 'pay7', amount: 250000, createdAt: '2024-01-12T10:00:00Z', method: 'bank_transfer', invoiceId: 'inv8' },
    ],
    '5': [
      { id: 'pay8', amount: 1000000, createdAt: '2023-12-05T10:00:00Z', method: 'government_transfer', invoiceId: 'inv10' },
    ],
  };
  
  return paymentsMap[clientId] || [];
};

// CRUD Operations for managing clients
let clientsData = [...staticClients];

export const addClient = (clientData: any) => {
  const newClient = {
    ...clientData,
    id: `client_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    financialSummary: {
      totalAmountInvoiced: 0,
      outstandingAmount: 0,
      overdueAmount: 0,
      totalProjects: 0,
      lastPaymentDate: null,
    },
    lastActivity: new Date().toISOString(),
  };
  
  clientsData.push(newClient);
  return newClient;
};

export const updateClient = (clientId: string, updates: any) => {
  const index = clientsData.findIndex(client => client.id === clientId);
  if (index !== -1) {
    clientsData[index] = {
      ...clientsData[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return clientsData[index];
  }
  return null;
};

export const deleteClient = (clientId: string) => {
  const index = clientsData.findIndex(client => client.id === clientId);
  if (index !== -1) {
    const deletedClient = clientsData[index];
    clientsData.splice(index, 1);
    return deletedClient;
  }
  return null;
};

export const getAllClients = () => {
  return clientsData;
};

// Update the staticClients export to use the dynamic data
export { clientsData as dynamicClients };