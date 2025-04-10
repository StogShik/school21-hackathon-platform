// src/components/InviteTeam.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function InviteTeam() {
  const { id } = useParams(); // id команды
  const [inviteeUsername, setInviteeUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    api.post(`/team/${id}/invite`, { inviteeUsername })
      .then(res => {
        alert('Приглашение отправлено');
        navigate('/dashboard');
      })
      .catch(err => {
        console.error('Ошибка при отправке приглашения', err);
        alert('Ошибка при отправке приглашения');
      });
  };

  return (
    <div className="container mt-4">
      <h1>Пригласить участника</h1>
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
        <button type="submit" className="btn btn-primary">Отправить приглашение</button>
      </form>
    </div>
  );
}

export default InviteTeam;
