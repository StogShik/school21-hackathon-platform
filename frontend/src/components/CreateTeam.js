// src/components/CreateTeam.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    api.post('/team/create', { teamName, githubLink })
      .then(res => {
        alert('Команда создана');
        navigate.push('/dashboard');
      })
      .catch(err => {
        console.error('Ошибка при создании команды', err);
        alert('Ошибка при создании команды');
      });
  };

  return (
    <div className="container mt-4">
      <h1>Создать команду</h1>
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
        <button type="submit" className="btn btn-success">Создать команду</button>
      </form>
    </div>
  );
}

export default CreateTeam;
