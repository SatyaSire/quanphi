// Project data for expense management
export interface Project {
  id: string;
  name: string;
  budget: number;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  description?: string;
}

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Residential Complex A',
    budget: 500000,
    status: 'active',
    startDate: '2024-01-01',
    description: 'Multi-story residential complex construction'
  },
  {
    id: 'proj-2',
    name: 'Commercial Plaza B',
    budget: 750000,
    status: 'active',
    startDate: '2024-01-15',
    description: 'Commercial plaza with retail spaces'
  },
  {
    id: 'proj-3',
    name: 'Office Building C',
    budget: 300000,
    status: 'active',
    startDate: '2024-02-01',
    description: 'Modern office building construction'
  },
  {
    id: 'proj-4',
    name: 'Warehouse Complex D',
    budget: 450000,
    status: 'on-hold',
    startDate: '2024-03-01',
    description: 'Industrial warehouse facility'
  },
  {
    id: 'proj-5',
    name: 'Shopping Mall E',
    budget: 1200000,
    status: 'active',
    startDate: '2024-01-10',
    description: 'Large shopping mall development'
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getActiveProjects = (): Project[] => {
  return projects.filter(project => project.status === 'active');
};

export const getProjectsByStatus = (status: Project['status']): Project[] => {
  return projects.filter(project => project.status === status);
};