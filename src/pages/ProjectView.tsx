
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppState } from '../store/useAppState';
// import ProjectKanban from '../components/project/ProjectKanban';

const ProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects } = useAppState();
  
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return <div className="p-8 text-center text-red-500">Project Not Found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
      <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
      
      {/* Placeholder for the Kanban Board/List/Dashboard Toggle */}
      <div className="mt-8">
        {/* <ProjectKanban projectId={project.id} /> */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
             <p className="text-gray-500 dark:text-gray-400">Placeholder for Kanban Board/Project Dashboard</p>
        </div>
      </div>
    </div>
  );
  
};

export default ProjectView;