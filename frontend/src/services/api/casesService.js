import apiClient from './apiClient';

const casesService = {
  getCases: () => apiClient.get('/cases'),
  downloadFile: (filename) => apiClient.get(`/cases/files/${filename}`, {
    responseType: 'blob'
  }),
};

export default casesService;
