import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminHeader from './AdminHeader';
import { adminService } from '../../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminService.getUsers();
        setUsers(response.data.users || []);
      } catch (err) {
        console.error('Ошибка при получении пользователей', err);
        setError('Ошибка при получении списка пользователей');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePromote = async (userId) => {
    if (window.confirm('Вы уверены, что хотите сделать пользователя администратором?')) {
      try {
        await adminService.promoteUser(userId);
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isAdmin: true } : user
        ));
        setSuccess('Пользователь успешно повышен до администратора');
      } catch (err) {
        console.error('Ошибка при повышении пользователя', err);
        setError('Ошибка при повышении пользователя');
      }
    }
  };

  const handleDemote = async (userId) => {
    if (window.confirm('Вы уверены, что хотите понизить пользователя?')) {
      try {
        await adminService.demoteUser(userId);
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isAdmin: false } : user
        ));
        setSuccess('Пользователь успешно понижен');
      } catch (err) {
        console.error('Ошибка при понижении пользователя', err);
        setError('Ошибка при понижении пользователя');
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await adminService.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
        setSuccess('Пользователь успешно удален');
      } catch (err) {
        console.error('Ошибка при удалении пользователя', err);
        setError('Ошибка при удалении пользователя');
      }
    }
  };

  if (loading) return <AdminHeader title="Пользователи" />;

  return (
    <>
      <AdminHeader title="Пользователи" success={success} error={error} />
      <div className="container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Имя пользователя</th>
              <th>Telegram</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.username !== currentUser?.username).map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.telegram}</td>
                <td>{user.isAdmin ? 'Администратор' : 'Пользователь'}</td>
                <td>
                  <div className="btn-group" role="group">
                    {!user.isAdmin && (
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handlePromote(user._id)}
                      >
                        <i className="fa-solid fa-user-plus"></i>
                      </button>
                    )}
                    {user.isAdmin && currentUser?.username === "admin" && (
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleDemote(user._id)}
                      >
                        <i className="fa-solid fa-user-minus"></i>
                      </button>
                    )}
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminUsers;
