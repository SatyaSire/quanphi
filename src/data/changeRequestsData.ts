export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  type: 'New Requirement' | 'Design Modification' | 'Material Substitution';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending Review' | 'Accepted' | 'Rejected' | 'Need Clarification' | 'In Progress' | 'Completed';
  projectId: string;
  projectName: string;
  milestoneId?: string;
  milestoneName?: string;
  submittedDate: string;
  lastUpdated: string;
  submittedBy: string;
  reviewedBy?: string;
  remarks?: string;
  attachments: {
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
  costImpact?: {
    estimated: number;
    type: 'increase' | 'decrease';
    breakdown: {
      materials?: number;
      labor?: number;
      equipment?: number;
      other?: number;
    };
  };
  timelineImpact?: {
    days: number;
    type: 'delay' | 'advance';
    newCompletionDate: string;
  };
}

export const mockChangeRequests: ChangeRequest[] = [
  {
    id: 'CR001',
    title: 'Add False Ceiling in Lobby',
    description: 'Client requests addition of false ceiling with LED lighting in the main lobby area to enhance aesthetics and provide better lighting distribution.',
    type: 'New Requirement',
    priority: 'High',
    status: 'Pending Review',
    projectId: 'PROJ001',
    projectName: 'Luxury Villa Construction',
    milestoneId: 'MS003',
    milestoneName: 'Interior Finishing',
    submittedDate: '2024-01-15',
    lastUpdated: '2024-01-15',
    submittedBy: 'John Smith',
    attachments: [
      {
        id: 'ATT001',
        name: 'lobby_ceiling_design.pdf',
        type: 'PDF',
        size: '2.3 MB',
        url: '/attachments/lobby_ceiling_design.pdf'
      },
      {
        id: 'ATT002',
        name: 'reference_image.jpg',
        type: 'Image',
        size: '1.8 MB',
        url: '/attachments/reference_image.jpg'
      }
    ],
    costImpact: {
      estimated: 25000,
      type: 'increase',
      breakdown: {
        materials: 15000,
        labor: 8000,
        equipment: 2000
      }
    },
    timelineImpact: {
      days: 7,
      type: 'delay',
      newCompletionDate: '2024-03-15'
    }
  },
  {
    id: 'CR002',
    title: 'Shift Staircase Position',
    description: 'Request to relocate the main staircase 2 feet to the left to create more space in the living area and improve traffic flow.',
    type: 'Design Modification',
    priority: 'Medium',
    status: 'Accepted',
    projectId: 'PROJ001',
    projectName: 'Luxury Villa Construction',
    milestoneId: 'MS002',
    milestoneName: 'Structural Work',
    submittedDate: '2024-01-10',
    lastUpdated: '2024-01-12',
    submittedBy: 'John Smith',
    reviewedBy: 'Mike Johnson',
    remarks: 'Approved after structural engineer review. No impact on load-bearing elements.',
    attachments: [
      {
        id: 'ATT003',
        name: 'revised_floor_plan.dwg',
        type: 'CAD',
        size: '3.1 MB',
        url: '/attachments/revised_floor_plan.dwg'
      }
    ],
    costImpact: {
      estimated: 8000,
      type: 'increase',
      breakdown: {
        labor: 6000,
        materials: 2000
      }
    },
    timelineImpact: {
      days: 3,
      type: 'delay',
      newCompletionDate: '2024-03-11'
    }
  },
  {
    id: 'CR003',
    title: 'Use Marble Instead of Tiles',
    description: 'Replace ceramic tiles with Italian marble for the master bathroom flooring and walls for a more luxurious finish.',
    type: 'Material Substitution',
    priority: 'High',
    status: 'In Progress',
    projectId: 'PROJ001',
    projectName: 'Luxury Villa Construction',
    milestoneId: 'MS003',
    milestoneName: 'Interior Finishing',
    submittedDate: '2024-01-08',
    lastUpdated: '2024-01-14',
    submittedBy: 'John Smith',
    reviewedBy: 'Sarah Davis',
    remarks: 'Approved. Marble samples ordered for client approval.',
    attachments: [
      {
        id: 'ATT004',
        name: 'marble_samples.jpg',
        type: 'Image',
        size: '2.7 MB',
        url: '/attachments/marble_samples.jpg'
      }
    ],
    costImpact: {
      estimated: 18000,
      type: 'increase',
      breakdown: {
        materials: 15000,
        labor: 3000
      }
    },
    timelineImpact: {
      days: 5,
      type: 'delay',
      newCompletionDate: '2024-03-13'
    }
  },
  {
    id: 'CR004',
    title: 'Remove Balcony Extension',
    description: 'Client decided to remove the planned balcony extension from the second floor to reduce overall project cost.',
    type: 'Design Modification',
    priority: 'Medium',
    status: 'Completed',
    projectId: 'PROJ002',
    projectName: 'Modern Apartment Complex',
    milestoneId: 'MS001',
    milestoneName: 'Foundation & Structure',
    submittedDate: '2024-01-05',
    lastUpdated: '2024-01-13',
    submittedBy: 'Emily Wilson',
    reviewedBy: 'Mike Johnson',
    remarks: 'Completed. Design revised and construction adjusted accordingly.',
    attachments: [],
    costImpact: {
      estimated: 12000,
      type: 'decrease',
      breakdown: {
        materials: 8000,
        labor: 4000
      }
    },
    timelineImpact: {
      days: 2,
      type: 'advance',
      newCompletionDate: '2024-02-28'
    }
  },
  {
    id: 'CR005',
    title: 'Add Smart Home Integration',
    description: 'Request to integrate smart home automation system including lighting control, security system, and climate control.',
    type: 'New Requirement',
    priority: 'Low',
    status: 'Rejected',
    projectId: 'PROJ001',
    projectName: 'Luxury Villa Construction',
    milestoneId: 'MS004',
    milestoneName: 'Final Installations',
    submittedDate: '2024-01-12',
    lastUpdated: '2024-01-14',
    submittedBy: 'John Smith',
    reviewedBy: 'Sarah Davis',
    remarks: 'Rejected due to significant timeline impact and budget constraints. Can be considered as separate project after completion.',
    attachments: [
      {
        id: 'ATT005',
        name: 'smart_home_specs.pdf',
        type: 'PDF',
        size: '1.5 MB',
        url: '/attachments/smart_home_specs.pdf'
      }
    ],
    costImpact: {
      estimated: 45000,
      type: 'increase',
      breakdown: {
        materials: 30000,
        labor: 12000,
        equipment: 3000
      }
    },
    timelineImpact: {
      days: 14,
      type: 'delay',
      newCompletionDate: '2024-03-22'
    }
  },
  {
    id: 'CR006',
    title: 'Change Kitchen Cabinet Material',
    description: 'Switch from laminate to solid wood kitchen cabinets for better durability and aesthetics.',
    type: 'Material Substitution',
    priority: 'Medium',
    status: 'Need Clarification',
    projectId: 'PROJ003',
    projectName: 'Residential Renovation',
    milestoneId: 'MS002',
    milestoneName: 'Kitchen Renovation',
    submittedDate: '2024-01-13',
    lastUpdated: '2024-01-14',
    submittedBy: 'Robert Brown',
    reviewedBy: 'Mike Johnson',
    remarks: 'Need clarification on wood type preference and finish requirements. Please provide detailed specifications.',
    attachments: [],
    costImpact: {
      estimated: 22000,
      type: 'increase',
      breakdown: {
        materials: 18000,
        labor: 4000
      }
    },
    timelineImpact: {
      days: 6,
      type: 'delay',
      newCompletionDate: '2024-02-20'
    }
  }
];

export const getChangeRequestsByProject = (projectId: string): ChangeRequest[] => {
  return mockChangeRequests.filter(request => request.projectId === projectId);
};

export const getChangeRequestById = (id: string): ChangeRequest | undefined => {
  return mockChangeRequests.find(request => request.id === id);
};

export const getChangeRequestsByStatus = (status: ChangeRequest['status']): ChangeRequest[] => {
  return mockChangeRequests.filter(request => request.status === status);
};

export const getChangeRequestsByPriority = (priority: ChangeRequest['priority']): ChangeRequest[] => {
  return mockChangeRequests.filter(request => request.priority === priority);
};

export const requestTypes = [
  'New Requirement',
  'Design Modification',
  'Material Substitution'
] as const;

export const priorityLevels = [
  'Low',
  'Medium',
  'High'
] as const;

export const statusOptions = [
  'Pending Review',
  'Accepted',
  'Rejected',
  'Need Clarification',
  'In Progress',
  'Completed'
] as const;