import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // сервис для API запросов

function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    // Пример запроса к API (предполагается, что бэкенд возвращает данные для dashboard)
    api.get('/dashboard')
      .then((res) => {
        // Ожидаем структуру { teams, invitations }
        setTeams(res.data.teams);
        setInvitations(res.data.invitations);
      })
      .catch((err) => console.error('Ошибка загрузки данных', err));
  }, []);

  return (
    <div>
      <h1>Личный кабинет</h1>
      
      <section className="mt-4">
        <h2>Ваши команды</h2>
        {teams.length > 0 ? (
          <ul className="list-group">
            {teams.map((team) => (
              <li key={team._id} className="list-group-item">
                <Link to={`/team/${team._id}`}>{team.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>У вас пока нет команд.</p>
        )}
        <Link to="/team/create" className="btn btn-success mt-2">Создать команду</Link>
      </section>

      <section className="mt-4">
        <h2>Приглашения</h2>
        {invitations.length > 0 ? (
          <ul className="list-group">
            {invitations.map((invite) => (
              <li key={invite._id} className="list-group-item">
                Приглашение в команду <strong>{invite.team.name}</strong> от <strong>{invite.inviter.username}</strong>
                {/* Здесь можно добавить кнопки для принятия/отклонения */}
              </li>
            ))}
          </ul>
        ) : (
          <p>Новых приглашений нет.</p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
