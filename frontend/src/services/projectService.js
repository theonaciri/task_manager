import api from './api';

export const projectService = {
    // Récupérer tous les projets avec pagination
    getAll: async (params = {}) => {
        const response = await api.get('/projects', { params });
        return response.data;
    },

    // Récupérer un projet par ID avec ses tâches
    getById: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    // Créer un nouveau projet
    create: async (projectData) => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },

    // Mettre à jour un projet
    update: async (id, projectData) => {
        const response = await api.put(`/projects/${id}`, projectData);
        return response.data;
    },

    // Supprimer un projet
    delete: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },
};
