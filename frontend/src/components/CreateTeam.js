import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamService } from '../services/api';

function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await teamService.createTeam({ teamName, githubLink });
      alert('Команда успешно создана');
      navigate('/dashboard');
    } catch (err) {
      console.error('Ошибка при создании команды', err);
      setError('Ошибка при создании команды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Создать команду</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teamName">Название команды</label>
          <input
            type="text"
            id="teamName"
            className="form-control"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="githubLink">GitHub-ссылка (необязательно)</label>
          <input
            type="url"
            id="githubLink"
            className="form-control"
            value={githubLink}
            onChange={e => setGithubLink(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Создание...' : 'Создать команду'}
        </button>
      </form>
    </div>
  );
}

export default CreateTeam;
