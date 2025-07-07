import api from './api';

export const taskService = {
    // Récupérer toutes les tâches avec pagination et filtres
    getAll: async (params = {}) => {
        const response = await api.get('/tasks', { params });
        return response.data;
    },

    // Récupérer une tâche par ID
    getById: async (id) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    // Créer une nouvelle tâche
    create: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    // Mettre à jour une tâche
    update: async (id, taskData) => {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data;
    },

    // Supprimer une tâche
    delete: async (id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },
};
