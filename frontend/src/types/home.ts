export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  department?: string;
  status: 'active' | 'inactive';
}

export interface Workload {
  id: number;
  userId: number;
  department: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
} 