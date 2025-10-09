import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-dark-bg">
      
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} /> 

      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} /> 
        
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-600" >
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default MainLayout;