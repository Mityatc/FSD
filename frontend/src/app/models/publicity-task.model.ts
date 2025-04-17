export interface PublicityTask {
  id?: number;
  title: string;
  description?: string;
  type: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo?: string;
  deadline: Date;
  createdAt?: Date;
  updatedAt?: Date;
} 