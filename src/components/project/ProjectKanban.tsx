import React, { useMemo, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { OnDragEndResponder, DropResult } from '@hello-pangea/dnd';
import { useAppState } from '../../store/useAppState';
import type { Task } from '../../types';
import { TaskStatus, TaskPriority } from '../../types';
import { format } from 'date-fns';
import { ChevronDown, Calendar, FileText, Trash2 } from 'lucide-react';

interface ProjectKanbanProps {
    projectId: string;
}

// --- Kanban Column Definitions ---
const COLUMN_TITLES = {
    [TaskStatus.Todo]: 'To Do',
    [TaskStatus.InProgress]: 'In Progress',
    [TaskStatus.Review]: 'In Review',
    [TaskStatus.Done]: 'Done',
};

const COLUMN_COLORS = {
    [TaskStatus.Todo]: 'border-blue-500',
    [TaskStatus.InProgress]: 'border-yellow-500',
    [TaskStatus.Review]: 'border-purple-500',
    [TaskStatus.Done]: 'border-emerald-500',
};

// --- Helper Component: Task Card ---
const KanbanTaskCard: React.FC<{ task: Task, index: number }> = ({ task, index }) => {
    
    const priorityColor = task.priority === TaskPriority.High ? 'bg-red-500' : task.priority === TaskPriority.Medium ? 'bg-yellow-500' : 'bg-gray-500';
    const isOverdue = task.dueDate < new Date() && task.status !== TaskStatus.Done;

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps} // CRITICAL: This allows the card itself to be the drag handle
                    className="p-3 bg-white dark:bg-zinc-700 rounded-lg shadow-md mb-3 border-l-4 border-l-primary-accent hover:shadow-lg transition-shadow duration-150"
                >
                    <div className="flex items-start justify-between">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${priorityColor}`}>
                            {task.priority}
                        </span>
                        <div className="flex space-x-1 opacity-70 hover:opacity-100 transition-opacity">
                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500 cursor-pointer" />
                            <ChevronDown className="h-4 w-4 text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer" />
                        </div>
                    </div>

                    {/* Task Title */}
                    <h4 className="text-md font-bold mt-2 text-gray-900 dark:text-gray-100">{task.title}</h4>

                    {/* Description Preview */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        <FileText className="inline h-3 w-3 mr-1 text-gray-500" />
                        {task.description.substring(0, 50)}...
                    </p>

                    {/* Due Date */}
                    <div className="flex items-center space-x-1 mt-2">
                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className={`text-xs font-medium ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                            Due: {format(task.dueDate, 'MMM dd, h:mm a')}
                        </span>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

// --- Main Component: Kanban Board ---
const ProjectKanban: React.FC<ProjectKanbanProps> = ({ projectId }) => {
    // Get project-specific tasks and the action to update status
    const { tasks, updateTaskStatus } = useAppState();
    
    // Filter tasks only for the current project
    const projectTasks = useMemo(() => tasks.filter(t => t.projectId === projectId), [tasks, projectId]);

    // Group tasks by their status (the key for the Kanban columns)
    const columns = useMemo(() => {
        return Object.values(TaskStatus).reduce((acc, status) => {
            acc[status] = projectTasks.filter(task => task.status === status);
            return acc;
        }, {} as Record<TaskStatus, Task[]>);
    }, [projectTasks]);


    // --- Drag End Handler ---
    const onDragEnd: OnDragEndResponder = useCallback((result) => {
        const { destination, source, draggableId } = result;

        // Dropped outside a droppable area or back to the same place
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const newStatus = destination.droppableId as TaskStatus;
        
        // Update the state (Zustand store)
        updateTaskStatus(draggableId, newStatus);

    }, [updateTaskStatus]);


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto p-4 space-x-4 min-h-[70vh]">
                {/* Map over all possible task statuses to create columns */}
                {Object.values(TaskStatus).map((status) => (
                    <Droppable droppableId={status} key={status}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex flex-col w-72 flex-shrink-0 p-3 rounded-xl shadow-lg 
                                    bg-gray-100 dark:bg-zinc-800
                                    ${snapshot.isDraggingOver ? 'bg-primary-accent/10 dark:bg-primary-accent/20' : ''}
                                `}
                            >
                                {/* Column Header */}
                                <div className={`text-lg font-bold mb-4 p-2 rounded-lg text-gray-900 dark:text-white border-b-4 ${COLUMN_COLORS[status]}`}>
                                    {COLUMN_TITLES[status]} ({columns[status].length})
                                </div>

                                {/* Task Cards */}
                                <div className="flex-1 overflow-y-auto pr-1">
                                    {columns[status].map((task, index) => (
                                        <KanbanTaskCard key={task.id} task={task} index={index} />
                                    ))}
                                    {provided.placeholder}
                                </div>

                                {/* Empty State */}
                                {columns[status].length === 0 && !snapshot.isDraggingOver && (
                                    <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                                        No tasks here!
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default ProjectKanban;