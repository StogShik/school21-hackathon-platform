import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, invitationService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await dashboardService.getDashboard();
        setTeams(data.teams || []);
        setInvitations(data.invitations || []);
      } catch (err) {
        console.error('Ошибка загрузки данных', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleAcceptInvitation = async (inviteId) => {
    try {
      await invitationService.acceptInvitation(inviteId);
      // Обновляем списки после принятия
      const newInvitations = invitations.filter(invite => invite._id !== inviteId);
      setInvitations(newInvitations);
      // Перезагрузим информацию о командах
      const { data } = await dashboardService.getDashboard();
      setTeams(data.teams || []);
    } catch (err) {
      console.error('Ошибка при принятии приглашения', err);
      setError('Ошибка при принятии приглашения');
    }
  };

  const handleDeclineInvitation = async (inviteId) => {
    try {
      await invitationService.declineInvitation(inviteId);
      // Обновляем список после отклонения
      const newInvitations = invitations.filter(invite => invite._id !== inviteId);
      setInvitations(newInvitations);
    } catch (err) {
      console.error('Ошибка при отклонении приглашения', err);
      setError('Ошибка при отклонении приглашения');
    }
  };

  if (loading) return <p>Загрузка...</p>;
  
  return (
    <div>
      <h1>Личный кабинет</h1>
      <p>Привет, {currentUser?.username}!</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <section className="mt-4">
        <h2>Ваши команды</h2>
        {teams.length > 0 ? (
          <div className="list-group">
            {teams.map((team) => (
              <Link key={team._id} to={`/team/${team._id}`} className="list-group-item list-group-item-action">
                <strong>{team.name}</strong>
                {team.githubLink && <br />}
                {team.githubLink && <>GitHub: {team.githubLink}</>}
              </Link>
            ))}
          </div>
        ) : (
          <p>Ты не состоишь ни в одной команде.</p>
        )}
        <div className="mb-3 mt-3">
          <Link to="/team/create" className="btn btn-success">Создать новую команду</Link>
        </div>
      </section>
      
      <section className="mt-4">
        <h2>Приглашения</h2>
        {invitations.length > 0 ? (
          <ul className="list-group mb-4">
            {invitations.map((invite) => (
              <li key={invite._id} className="list-group-item">
                Приглашение от <strong>{invite.inviter.username}</strong> в команду <strong>{invite.team.name}</strong>.
                <div className="mt-2">
                  <button 
                    className="btn btn-success btn-sm mr-2"
                    onClick={() => handleAcceptInvitation(invite._id)}
                  >
                    Принять
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeclineInvitation(invite._id)}
                  >
                    Отклонить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>У вас нет новых приглашений.</p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
