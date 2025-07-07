import api from './api';

export const taskService = {
  // Get all tasks (with optional filters)
  getAll: (params = {}) => api.get('/tasks', { params }),
  
  // Get single task
  getById: (id) => api.get(`/tasks/${id}`),
  
  // Create new task
  create: (data) => api.post('/tasks', data),
  
  // Update task
  update: (id, data) => api.put(`/tasks/${id}`, data),
  
  // Delete task
  delete: (id) => api.delete(`/tasks/${id}`),
};
