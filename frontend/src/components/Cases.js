// src/components/Cases.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Cases() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    api.get('/cases')
      .then(res => setCases(res.data.cases)) // предположим, что API возвращает { cases: [...] }
      .catch(err => console.error('Ошибка при получении кейсов', err));
  }, []);

  return (
    <div className="container mt-4">
      <h1>Кейсы</h1>
      {cases.length ? (
        <ul className="list-group">
          {cases.map(item => (
            <li key={item._id} className="list-group-item">
              <h5>{item.title}</h5>
              <p>{item.description}</p>
              <small>{new Date(item.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет кейсов</p>
      )}
    </div>
  );
}

export default Cases;
