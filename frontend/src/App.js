import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TeamDetail from './components/TeamDetail';
import CreateTeam from './components/CreateTeam';
import InviteTeam from './components/InviteTeam';
import Cases from './components/Cases';

// Административные компоненты
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminTeams from './components/admin/AdminTeams';
import AdminCases from './components/admin/AdminCases';
import AdminNewCase from './components/admin/AdminNewCase';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Загрузка...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  return children;
};

// Компонент для маршрутов администратора
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div>Загрузка...</div>;
  }
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Административные маршруты - без общего Header/Footer */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        } />
        <Route path="/admin/teams" element={
          <AdminRoute>
            <AdminTeams />
          </AdminRoute>
        } />
        <Route path="/admin/cases" element={
          <AdminRoute>
            <AdminCases />
          </AdminRoute>
        } />
        <Route path="/admin/cases/new" element={
          <AdminRoute>
            <AdminNewCase />
          </AdminRoute>
        } />
        
        {/* Обычные маршруты с общим Header/Footer */}
        <Route path="/*" element={
          <div id="root">
            <div className="content-wrapper">
              <Header />
              <div className="container my-4 main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  
                  {/* Защищенные маршруты */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/team/:id" element={
                    <ProtectedRoute>
                      <TeamDetail />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/team/create" element={
                    <ProtectedRoute>
                      <CreateTeam />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/team/:id/invite" element={
                    <ProtectedRoute>
                      <InviteTeam />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/cases" element={
                    <ProtectedRoute>
                      <Cases />
                    </ProtectedRoute>
                  } />
                  
                  {/* На случай неверного URL */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
