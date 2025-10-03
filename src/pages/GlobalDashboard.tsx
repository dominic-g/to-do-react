import React from 'react';
import { useAppState } from '../store/useAppState';
import { TaskStatus } from '../types';

const GlobalDashboard: React.FC = () => {
  const { projects, tasks } = useAppState();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Global Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</p>
          <p className="text-4xl font-extrabold text-primary-accent mt-1">{projects.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
          <p className="text-4xl font-extrabold text-primary-accent mt-1">{tasks.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Tasks</p>
          <p className="text-4xl font-extrabold text-primary-accent mt-1">{tasks.filter(t => t.status !== TaskStatus.Done).length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Placeholder for Graphs/Analytics</p>
      </div>

    </div>
  );
};

export default GlobalDashboard;