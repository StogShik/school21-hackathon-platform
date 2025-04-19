import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { adminService } from '../../services/api';

function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await adminService.getTeams();
        setTeams(response.data.teams || []);
      } catch (err) {
        console.error('Ошибка при получении команд', err);
        setError('Ошибка при получении списка команд');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту команду?')) {
      try {
        await adminService.deleteTeam(teamId);
        setTeams(teams.filter(team => team._id !== teamId));
        setSuccess('Команда успешно удалена');
      } catch (err) {
        console.error('Ошибка при удалении команды', err);
        setError('Ошибка при удалении команды');
      }
    }
  };

  if (loading) return <AdminHeader title="Команды" />;

  return (
    <>
      <AdminHeader title="Команды" success={success} error={error} />
      <div className="container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Название</th>
              <th>GitHub-ссылка</th>
              <th>Участники</th>
              <th>Дата создания</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team._id}>
                <td>{team.name}</td>
                <td>
                  {team.githubLink ? (
                    <a href={team.githubLink} target="_blank" rel="noopener noreferrer">
                      {team.githubLink}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {team.members && team.members.length > 0 ? (
                    team.members.map(member => member.username).join(', ')
                  ) : (
                    'Нет участников'
                  )}
                </td>
                <td>{new Date(team.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteTeam(team._id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminTeams;
