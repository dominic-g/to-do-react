import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../../store/useAppState';

const Sidebar: React.FC = () => {
  const { projects } = useAppState();
  const { projectId: currentProjectId } = useParams();

  return (
    // Sidebar container: Fixed width, scrolls if content is too tall
    <div className="w-64 min-h-screen bg-gray-50 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 p-4 flex flex-col">
      
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Projects</h2>
      
      {/* Dashboard Link */}
      <Link 
        to="/dashboard"
        className={`px-3 py-2 rounded-lg mb-2 transition-colors duration-200 
                    font-medium text-gray-700 dark:text-gray-300
                    hover:bg-primary-accent/20 dark:hover:bg-primary-accent/30
                    ${!currentProjectId ? 'bg-primary-accent dark:bg-primary-accent/70 text-white' : ''}`}
      >
        <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 00-8 8c0 4.418 3.582 8 8 8s8-3.582 8-8a8 8 0 00-8-8zm0 14a6 6 0 110-12 6 6 0 010 12z" />
              <path fillRule="evenodd" d="M10 5a1 1 0 00-1 1v3H6a1 1 0 000 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Dashboard</span>
        </div>
      </Link>


      <ul className="space-y-1 mt-4 flex-grow overflow-y-auto">
        {projects.map((project) => (
          <li key={project.id}>
            <Link 
              to={`/projects/${project.id}/kanban`}
              className={`block px-3 py-2 rounded-lg transition-colors duration-200 truncate
                          font-medium text-gray-700 dark:text-gray-300
                          hover:bg-primary-accent/20 dark:hover:bg-primary-accent/30
                          ${currentProjectId === project.id ? 'bg-primary-accent dark:bg-primary-accent/70 text-white' : ''}`}
              title={project.name}
            >
              {project.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Add Project Button - Placeholder for a modal trigger */}
      <button className="mt-4 w-full py-2 rounded-lg bg-primary-accent hover:bg-blue-600 text-white font-semibold transition-colors">
        + Add New Project
      </button>
    </div>
  );
};

export default Sidebar;