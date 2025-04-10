import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000', // URL вашего бэкенда
  withCredentials: true, // если используются куки для сессии
});

export default api;
