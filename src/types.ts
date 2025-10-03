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

// --- TASK INTERFACE ---
export interface Task {
  id: string; 
  projectId: string; // Link to parent project
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date; 
  startDate: Date; 
  createdAt: Date;
}

// --- PROJECT INTERFACE ---
export interface Project {
  id: string; 
  name: string;
  description: string;
  status: ProjectStatus;
  tasks: string[]; 
  startDate: Date;
  endDate: Date;
}

// --- GLOBAL APP STATE INTERFACE (For Zustand) ---
export interface AppState {
  projects: Project[];
  tasks: Task[];
}


export const TypeCheck = 0;