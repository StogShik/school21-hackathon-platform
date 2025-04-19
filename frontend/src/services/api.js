import apiClient from './api/apiClient';
import authService from './api/authService';
import teamService from './api/teamService';
import invitationService from './api/invitationService';
import dashboardService from './api/dashboardService';
import casesService from './api/casesService';
import adminService from './api/adminService';

// Re-export all services to maintain compatibility with existing imports
export { 
  apiClient as api, 
  authService, 
  teamService, 
  invitationService, 
  dashboardService, 
  casesService,
  adminService 
};

// Also export default for compatibility
export default apiClient;
