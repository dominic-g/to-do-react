import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import GlobalDashboard from './pages/GlobalDashboard';
import ProjectView from './pages/ProjectView';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main Application Layout */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Default Route: Redirect to Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Global Dashboard (with graphs, overall status) */}
          <Route path="dashboard" element={<GlobalDashboard />} />
          
          {/* Project View (for Kanban, List, and Project Dashboard) */}
          <Route path="projects/:projectId/*" element={<ProjectView />} />
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<div className="p-8 text-center text-xl text-gray-500">404 Not Found</div>} />
        
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;