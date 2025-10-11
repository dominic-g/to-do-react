// --- ENUMS for predefined statuses/values ---
export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'In Progress',
  Review = 'Review', 
  Done = 'Done',
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum ProjectStatus {
  Active = 'Active',
  Archived = 'Archived',
  Complete = 'Complete',
}

// --- NEW ENUM: Task Category ---
export enum TaskType {
  Bug = 'Bug',
  NewFeature = 'New Feature',
  Research = 'Research',
  Documentation = 'Documentation',
  Maintenance = 'Maintenance',
}


// --- TASK INTERFACE ---
export interface Task {
  id: string; 
  projectId: string; 
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  dueDate: Date; 
  startDate: Date; 
  createdAt: Date;
}

// --- PROJECT INTERFACE ---
export interface Project {
  id: string; 
  clientId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  tasks: string[]; 
  startDate: Date;
  endDate: Date;
}

// --- NEW INTERFACE: INVOICE ---
export enum PaymentStatus {
  Overdue = 'Overdue',
  NotPaid = 'Not Paid',
  Partial = 'Partial',
  FullyPaid = 'Fully Paid',
}

export interface Invoice {
  id: string;
  projectId: string;
  title: string;
  totalAmount: number;
  amountPaid: number;
  dueDate: Date;
  status: PaymentStatus;
  notes: string;
}

// --- NEW INTERFACE: EXPENSE ---
export interface Expense {
  id: string;
  projectId: string;
  title: string;
  amount: number;
  date: Date;
  category: string; // e.g., 'Hosting', 'Software Subscription'
}

// --- NEW INTERFACE: TICKET ---
export enum TicketStatus {
  New = 'New',
  InProgress = 'In Progress',
  OnHold = 'On Hold',
  Resolved = 'Resolved',
}

export interface Ticket {
  id: string;
  projectId: string;
  title: string;
  status: TicketStatus;
  priority: TaskPriority;
  createdAt: Date;
}


export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  telegram?: string;
}


// --- GLOBAL APP STATE INTERFACE ---
export interface AppState {
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  expenses: Expense[];
  tickets: Ticket[];
  clients: Client[]; 
  filters: FilterState; 
}


export type FilterDateRange = '30days' | '7days' | '90days' | 'custom';

export interface FilterState {
    projectId: string | null;
    dateRange: FilterDateRange;
    startDate: Date | null;
    endDate: Date | null;
}

export const TypeCheck = 0;