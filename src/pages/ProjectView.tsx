
import React from 'react';
// import { useParams } from 'react-router-dom';
// import { useAppState } from '../store/useAppState';
// import ProjectKanban from '../components/project/ProjectKanban';
import { useParams, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAppState } from '../store/useAppState';
import ProjectDashboard from '../components/project/ProjectDashboard';
import ProjectKanban from '../components/project/ProjectKanban';
import ProjectTaskList from '../components/project/ProjectTaskList';
import { Home } from 'lucide-react';

const ProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const { projects } = useAppState();
  
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return <div className="p-8 text-center text-red-500">Project Not Found</div>;
  }

  const navLinks = [
    { to: `/projects/${projectId}/dashboard`, label: 'Dashboard' },
    { to: `/projects/${projectId}/kanban`, label: 'Kanban Board' },
    { to: `/projects/${projectId}/list`, label: 'Task List' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
      <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
      
      <div className="flex border-b border-gray-300 dark:border-zinc-700">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`py-2 px-4 text-sm font-medium transition-colors
                        ${location.pathname.startsWith(link.to)
                          ? 'text-primary-accent border-b-2 border-primary-accent'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
          >
            {link.icon && <link.icon className="w-4 h-4" />}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Nested Routes for Project Content */}
      <Routes>
        <Route index element={<ProjectDashboard projectId={projectId!} />} /> {/* Default to Dashboard */}
        <Route path="dashboard" element={<ProjectDashboard projectId={projectId!} />} />
        <Route path="kanban" element={<ProjectKanban projectId={projectId!} />} />
        <Route path="list" element={<ProjectTaskList projectId={projectId!} />} />
        <Route path="*" element={<div className="p-8 text-center text-gray-500">View Not Found</div>} />
      </Routes>
    </div>
  );
  
};

export default ProjectView;