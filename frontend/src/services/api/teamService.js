import apiClient from './apiClient';

const teamService = {
  createTeam: (data) => apiClient.post('/team/create', data),
  getTeam: (id) => apiClient.get(`/team/${id}`),
  leaveTeam: (id) => apiClient.post(`/team/${id}/leave`),
  editGithub: (id, githubLink) => apiClient.post(`/team/${id}/edit-github`, { githubLink }),
  inviteUser: (teamId, inviteeUsername) => apiClient.post(`/team/${teamId}/invite`, { inviteeUsername }),
};

export default teamService;
