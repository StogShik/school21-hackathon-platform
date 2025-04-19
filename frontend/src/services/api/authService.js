import apiClient from './apiClient';

const authService = {
  login: (username, password) => apiClient.post('/auth/login', { username, password }),
  register: (username, telegram, password) => apiClient.post('/auth/register', { username, telegram, password }),
  logout: () => apiClient.get('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/current-user'),
};

export default authService;
