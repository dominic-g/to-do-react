import { create } from 'zustand';
// import { persist, StateStorage } from 'zustand/middleware';


import { persist } from 'zustand/middleware'; 
import type { StateStorage } from 'zustand/middleware'; 


/*import type { 
    AppState, 
    Project, 
    Task, 
    TaskStatus, 
    ProjectStatus, 
    TaskPriority 
} from '../types.ts';*/


import type { 
    AppState, 
    Project, 
    Task 
} from '../types'; 

import { 
    TaskStatus, 
    ProjectStatus, 
    TaskPriority 
} from '../types'

// --- LocalStorage Date Handling ---
// Zustand's persist middleware saves Dates as strings. We must convert them back 
// to Date objects when loading from storage.

const dateStorage: StateStorage = {
    getItem: (name: string): string | null => {
        const str = localStorage.getItem(name);
        if (!str) return null;
        
        // Parse the JSON string
        const { state, version } = JSON.parse(str);
        
        // Custom parser to convert date strings back to Date objects
        const newState = {
            ...state,
            tasks: state.tasks.map((task: Task) => ({
                ...task,
                dueDate: new Date(task.dueDate),
                startDate: new Date(task.startDate),
                createdAt: new Date(task.createdAt),
            })),
            projects: state.projects.map((project: Project) => ({
                ...project,
                startDate: new Date(project.startDate),
                endDate: new Date(project.endDate),
            })),
        };

        return JSON.stringify({ state: newState, version });
    },
    setItem: (name: string, value: string): void => {
        localStorage.setItem(name, value);
    },
    removeItem: (name: string): void => {
        localStorage.removeItem(name);
    },
};


// --- INITIAL STATE ---
// Create some dummy data for initial load
const projectId = 'p-initial-project';
const initialDate = new Date();
const tomorrow = new Date(initialDate);
tomorrow.setDate(initialDate.getDate() + 1);

const initialState: AppState = {
  projects: [
    {
      id: projectId,
      name: 'Website Redesign',
      description: 'The main project for Q4 goals and new feature rollouts.',
      status: ProjectStatus.Active,
      tasks: ['t-1', 't-2', 't-3'],
      startDate: initialDate,
      endDate: new Date(initialDate.setDate(initialDate.getDate() + 30)),
    }
  ],
  tasks: [
    {
      id: 't-1',
      projectId: projectId,
      title: 'Setup Kanban Board',
      description: 'Implement the react-beautiful-dnd components.',
      status: TaskStatus.Done,
      priority: TaskPriority.High,
      dueDate: new Date(initialDate.setHours(12, 0, 0)),
      startDate: new Date(initialDate.setHours(9, 0, 0)),
      createdAt: initialDate,
    },
    {
      id: 't-2',
      projectId: projectId,
      title: 'Design Dashboard Charts',
      description: 'Sketch out Recharts design for project status.',
      status: TaskStatus.InProgress,
      priority: TaskPriority.Medium,
      dueDate: new Date(tomorrow.setHours(17, 0, 0)), // Tomorrow @ 5:00 PM
      startDate: new Date(tomorrow.setHours(9, 0, 0)),
      createdAt: initialDate,
    },
    {
      id: 't-3',
      projectId: projectId,
      title: 'Implement JSON Import/Export',
      description: 'Develop the I/O feature for data backups.',
      status: TaskStatus.Todo,
      priority: TaskPriority.High,
      dueDate: new Date(tomorrow.setDate(tomorrow.getDate() + 2)),
      startDate: new Date(tomorrow.setDate(tomorrow.getDate() + 1)),
      createdAt: initialDate,
    }
  ]
};

// --- ACTIONS INTERFACE (CRUD) ---
interface AppActions {
  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'tasks'>) => void;
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  // Global Actions
  importState: (newState: AppState) => void;
}


// --- ZUSTAND STORE CREATION ---
export const useAppState = create<AppState & AppActions>()(
  persist(
    (set) => ({
      ...initialState,

      // --- PROJECT ACTIONS ---
      addProject: (newProjectData) => {
        const newProject: Project = {
            ...newProjectData,
            id: `p-${Date.now()}`, 
            tasks: [],
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },
      
      // --- TASK ACTIONS ---
      addTask: (newTaskData) => {
        const now = new Date();
        const newTask: Task = {
            ...newTaskData,
            id: `t-${Date.now()}`,
            createdAt: now,
        };
        
        // Add the task to the tasks list
        set((state) => ({ tasks: [...state.tasks, newTask] }));

        // Link the task ID to the parent project
        set((state) => ({
             projects: state.projects.map(p => {
                 if (p.id === newTask.projectId && !p.tasks.includes(newTask.id)) {
                     return { ...p, tasks: [...p.tasks, newTask.id] };
                 }
                 return p;
             })
        }));
      },
      
      updateTaskStatus: (taskId, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        }));
      },
      
      // --- GLOBAL ACTIONS ---
      importState: (newState: AppState) => {
          set(newState);
      },
    }),
    {
      name: 'taskflow-pro-storage', 
      storage: dateStorage, // Use our custom storage solution for Dates
    }
  )
);