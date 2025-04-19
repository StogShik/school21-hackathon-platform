import apiClient from './apiClient';

const dashboardService = {
  getDashboard: () => apiClient.get('/dashboard'),
};

export default dashboardService;
