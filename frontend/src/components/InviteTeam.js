// src/components/InviteTeam.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamService } from '../services/api';

function InviteTeam() {
  const { id } = useParams();
  const [inviteeUsername, setInviteeUsername] = useState('');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await teamService.getTeam(id);
        setTeamName(response.data.team.name);
      } catch (err) {
        console.error('Ошибка при получении информации о команде', err);
        setError('Ошибка при получении информации о команде');
      }
    };

    fetchTeam();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await teamService.inviteUser(id, inviteeUsername);
      alert('Приглашение отправлено');
      navigate('/dashboard');
    } catch (err) {
      console.error('Ошибка при отправке приглашения', err);
      setError('Ошибка при отправке приглашения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Пригласить участника в команду "{teamName}"</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="inviteeUsername">Имя пользователя для приглашения</label>
          <input
            type="text"
            id="inviteeUsername"
            className="form-control"
            value={inviteeUsername}
            onChange={e => setInviteeUsername(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? 'Отправка...' : 'Отправить приглашение'}
        </button>
      </form>
    </div>
  );
}

export default InviteTeam;
