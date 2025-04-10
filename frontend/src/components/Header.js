import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  // Здесь можно добавить логику проверки авторизации
  const user = null; // Например, можно получить пользователя через контекст

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Платформа Хакатона</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ml-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Личный кабинет</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth/logout">Выход</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth/login">Вход</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth/register">Регистрация</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
