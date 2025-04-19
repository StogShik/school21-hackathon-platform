import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminHeader from './AdminHeader';

function AdminDashboard() {
  const { currentUser } = useAuth();

  return (
    <>
      <AdminHeader title="Панель управления" />
      <p>Добро пожаловать, администратор <strong>{currentUser?.username}</strong>!</p>
    </>
  );
}

export default AdminDashboard;
