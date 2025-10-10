import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../../store/useAppState';
import { LayoutDashboard, Folder, Plus, Users, Settings } from 'lucide-react'; 


// Define Props for the toggle logic
interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const { projects } = useAppState();
  const { projectId: currentProjectId } = useParams();

  const isActive = (path: string) => window.location.pathname.startsWith(path);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden" 
          onClick={toggle}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-30 transform 
        w-64 min-h-screen bg-gray-50 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 p-4 flex flex-col 
        transition-transform duration-300 ease-in-out
        
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        
        lg:relative lg:translate-x-0 
      `}>

        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Projects</h2>
        
        <Link 
          to="/dashboard"
          className={`px-3 py-2 rounded-lg mb-2 transition-colors duration-200 
                      font-medium text-gray-700 dark:text-gray-300
                      hover:bg-primary-accent/20 dark:hover:bg-primary-accent/30
                      ${!currentProjectId ? 'bg-primary-accent dark:bg-primary-accent/70' : ''}`}
        >
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </div>
        </Link>

        {/* NEW: Clients Link */}
        <Link 
          to="/clients"
          className={`px-3 py-2 rounded-lg mb-2 transition-colors duration-200 
                      font-medium text-gray-700 dark:text-gray-300
                      hover:bg-primary-accent/20 dark:hover:bg-primary-accent/30
                      ${isActive('/clients') ? 'bg-primary-accent text-white dark:bg-primary-accent' : ''}`}
          onClick={toggle}
        >
          <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Clients</span>
          </div>
        </Link>

        <h3 className="text-sm font-semibold mt-4 mb-2 uppercase text-gray-500 dark:text-gray-400">Projects</h3>
        
        <ul className="space-y-1 mt-4 flex-grow overflow-y-auto">
          {projects.map((project) => (
            <li key={project.id}>
              <Link 
                to={`/projects/${project.id}/kanban`}
                className={`block px-3 py-2 rounded-lg transition-colors duration-200 truncate
                            font-medium text-gray-700 dark:text-gray-300
                            hover:bg-primary-accent/20 dark:hover:bg-primary-accent/30
                            ${currentProjectId === project.id ? 'bg-primary-accent dark:bg-primary-accent/70 ' : ''}`}
                title={project.name}
              >
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4" /> {/* NEW ICON */}
                  <span>{project.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      
        {/* Settings Link (for a final professional touch) */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-zinc-700">
            <Link 
              to="/settings"
              className="px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 block"
              onClick={toggle}
            >
              <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
              </div>
            </Link>
        </div>
        
        <button className="mt-4 w-full py-2 rounded-lg bg-primary-accent hover:bg-blue-600 text-white font-semibold transition-colors flex items-center justify-center">
          <Plus className="h-5 w-5" />
          <span>Add New Project</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;