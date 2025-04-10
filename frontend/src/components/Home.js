import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="jumbotron text-center">
      <h1 className="display-4">Добро пожаловать!</h1>
      <p className="lead">Участвуйте в кейсах, создавайте команды и принимайте участие в мероприятиях.</p>
      <hr className="my-4" />
      <p>Узнайте больше о наших проектах.</p>
      <Link className="btn btn-primary btn-lg" to="/dashboard" role="button">
        Перейти в личный кабинет
      </Link>
    </div>
  );
}

export default Home;
