import apiClient from './apiClient';

const adminService = {
  getUsers: () => apiClient.get('/admin/users'),
  promoteUser: (id) => apiClient.post(`/admin/users/${id}/promote`),
  demoteUser: (id) => apiClient.post(`/admin/users/${id}/demote`),
  deleteUser: (id) => apiClient.post(`/admin/users/${id}/delete`),
  
  getTeams: () => apiClient.get('/admin/teams'),
  deleteTeam: (id) => apiClient.post(`/admin/teams/${id}/delete`),
  
  getCases: () => apiClient.get('/admin/cases'),
  createCase: (formData) => apiClient.post('/admin/cases', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteCase: (id) => apiClient.post(`/admin/cases/${id}/delete`),
};

export default adminService;
