import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function AdminHeader({ title, success = null, error = null }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/admin">Админ панель</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" 
                data-target="#navbarAdmin" aria-controls="navbarAdmin" aria-expanded="false" 
                aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarAdmin">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item"><Link className="nav-link" to="/admin/users">Пользователи</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin/teams">Команды</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin/cases">Кейсы</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/">На сайт</Link></li>
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-link nav-link">Выход</button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mt-4">
        <h1 className="mb-4">{title}</h1>
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </>
  );
}

export default AdminHeader;
