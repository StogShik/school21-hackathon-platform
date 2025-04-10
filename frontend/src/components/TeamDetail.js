// src/components/TeamDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    api.get(`/team/${id}`)
      .then(res => {
        setTeam(res.data.team);
        setGithubLink(res.data.team.githubLink || '');
      })
      .catch(err => console.error('Ошибка при получении информации о команде', err));
  }, [id]);

  const handleGitHubChange = e => {
    setGithubLink(e.target.value);
    setIsEdited(e.target.value !== (team.githubLink || ''));
  };

  const handleGitHubSubmit = e => {
    e.preventDefault();
    api.post(`/team/${id}/edit-github`, { githubLink })
       .then(res => {
         setTeam({ ...team, githubLink });
         setIsEdited(false);
         alert('GitHub-ссылка обновлена');
       })
       .catch(err => console.error('Ошибка при обновлении ссылки', err));
  };

  const handleLeaveTeam = () => {
    if(window.confirm('Вы уверены, что хотите покинуть команду?')) {
      api.post(`/team/${id}/leave`)
         .then(res => {
           alert('Вы успешно покинули команду');
           window.location.href = '/dashboard';
         })
         .catch(err => console.error('Ошибка при выходе из команды', err));
    }
  };

  if (!team) return <p>Загрузка...</p>;

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

      {/* Форма редактирования GitHub-ссылки, доступная участникам */}
      <form onSubmit={handleGitHubSubmit}>
        <div className="form-group">
          <label htmlFor="githubLink">Редактировать GitHub-ссылку:</label>
          <input
            type="url"
            id="githubLink"
            className="form-control"
            value={githubLink}
            onChange={handleGitHubChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!isEdited}>
          Сохранить
        </button>
      </form>

      <h3>Участники:</h3>
      <ul className="list-group">
        {team.members.map(member => (
          <li key={member._id} className="list-group-item">{member.username}</li>
        ))}
      </ul>
      <div className="mt-3">
        <Link to={`/team/${id}/invite`} className="btn btn-secondary">
          Пригласить участника
        </Link>
      </div>
      <div className="mt-3">
        <button onClick={handleLeaveTeam} className="btn btn-warning">
          Покинуть команду
        </button>
      </div>
    </div>
  );
}

export default TeamDetail;
