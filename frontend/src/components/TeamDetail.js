import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { teamService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await teamService.getTeam(id);
        setTeam(response.data.team);
        setGithubLink(response.data.team.githubLink || '');
      } catch (err) {
        console.error('Ошибка при получении информации о команде', err);
        setError('Ошибка при получении информации о команде');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  const handleGitHubChange = (e) => {
    setGithubLink(e.target.value);
    setIsEdited(e.target.value !== (team?.githubLink || ''));
  };

  const handleGitHubSubmit = async (e) => {
    e.preventDefault();
    try {
      await teamService.editGithub(id, githubLink);
      setTeam({ ...team, githubLink });
      setIsEdited(false);
      alert('GitHub-ссылка обновлена');
    } catch (err) {
      console.error('Ошибка при обновлении ссылки', err);
      setError('Ошибка при обновлении GitHub-ссылки');
    }
  };

  const handleLeaveTeam = async () => {
    if (window.confirm('Вы уверены, что хотите покинуть команду?')) {
      try {
        await teamService.leaveTeam(id);
        alert('Вы успешно покинули команду');
        navigate('/dashboard');
      } catch (err) {
        console.error('Ошибка при выходе из команды', err);
        setError('Ошибка при выходе из команды');
      }
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!team) return <p>Команда не найдена</p>;

  const isMember = team.members.some(member => member._id === currentUser?.id);

  return (
    <div className="container mt-4">
      <h1>Команда: {team.name}</h1>

      {team.githubLink ? (
        <p>
          GitHub: <a href={team.githubLink} target="_blank" rel="noopener noreferrer">{team.githubLink}</a>
        </p>
      ) : (
        <p>GitHub: не установлен</p>
      )}

      {/* Форма редактирования GitHub-ссылки, доступная только участникам */}
      {isMember && (
        <form onSubmit={handleGitHubSubmit}>
          <div className="form-group">
            <label htmlFor="githubLink">GitHub-ссылка:</label>
            <input
              type="url"
              className="form-control"
              id="githubLink"
              placeholder="Введите ссылку"
              value={githubLink}
              onChange={handleGitHubChange}
            />
          </div>
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={!isEdited}
          >
            Сохранить
          </button>
        </form>
      )}
      
      <br />
      <h3>Участники:</h3>
      <ul className="list-group">
        {team.members.map(member => (
          <li key={member._id} className="list-group-item">{member.username}</li>
        ))}
      </ul>
      
      {/* Кнопка для приглашения участника */}
      {isMember && (
        <div className="mt-3">
          <Link to={`/team/${id}/invite`} className="btn btn-primary">
            Пригласить участника
          </Link>
        </div>
      )}
      
      {/* Кнопка для выхода из команды */}
      {isMember && (
        <div className="mt-3">
          <button onClick={handleLeaveTeam} className="btn btn-warning">
            Покинуть команду
          </button>
        </div>
      )}
    </div>
  );
}

export default TeamDetail;
