import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import DocumentsListPage from './pages/documents/DocumentsListPage';
import DocumentDetailPage from './pages/documents/DocumentDetailPage';
import AdherentsListPage from './pages/adherents/AdherentsListPage';
import AdherentDetailPage from './pages/adherents/AdherentDetailPage';
import EmpruntsListPage from './pages/emprunts/EmpruntsListPage';
import NotFoundPage from './pages/common/NotFoundPage';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import NotificationsContainer from './components/ui/NotificationsContainer';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.ui);

  return (
    <div className={`app ${darkMode ? 'dark-theme' : ''}`}>
      <NotificationsContainer />
      
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        } />
        
        {/* Routes protégées */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          <Route path="documents">
            <Route index element={<DocumentsListPage />} />
            <Route path=":id" element={<DocumentDetailPage />} />
            <Route path="new" element={<DocumentDetailPage isNew />} />
          </Route>
          
          <Route path="adherents">
            <Route index element={<AdherentsListPage />} />
            <Route path=":id" element={<AdherentDetailPage />} />
            <Route path="new" element={<AdherentDetailPage isNew />} />
          </Route>
          
          <Route path="emprunts">
            <Route index element={<EmpruntsListPage />} />
          </Route>
        </Route>
        
        {/* Page 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
