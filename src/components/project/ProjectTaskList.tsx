import React from 'react';
import { List } from 'lucide-react';

// NOTE: This component is only a placeholder for now.
const ProjectTaskList: React.FC = () => {
    return (
        <div className="text-center p-8 bg-white dark:bg-zinc-800 rounded-lg h-96 flex flex-col items-center justify-center">
            <List className="h-10 w-10 text-primary-accent mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Detailed Task List View</h2>
            <p className="text-gray-500 dark:text-gray-400">Will show tasks in List/Card views with filtering.</p>
        </div>
    );
};

export default ProjectTaskList;