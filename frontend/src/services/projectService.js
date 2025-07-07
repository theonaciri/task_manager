import api from './api';

export const projectService = {
  // Get all projects
  getAll: () => api.get('/projects'),
  
  // Get single project with tasks
  getById: (id) => api.get(`/projects/${id}`),
  
  // Create new project
  create: (data) => api.post('/projects', data),
  
  // Update project
  update: (id, data) => api.put(`/projects/${id}`, data),
  
  // Delete project
  delete: (id) => api.delete(`/projects/${id}`),
};
