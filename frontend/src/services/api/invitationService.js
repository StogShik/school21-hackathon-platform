import apiClient from './apiClient';

const invitationService = {
  getInvitations: () => apiClient.get('/invitations'),
  acceptInvitation: (id) => apiClient.post(`/invitations/${id}/accept`),
  declineInvitation: (id) => apiClient.post(`/invitations/${id}/decline`),
};

export default invitationService;
