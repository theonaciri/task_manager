import api from './api';

export const taskService = {
    // Récupérer toutes les tâches
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.status) {
            params.append('status', filters.status);
        }

        if (filters.project_id) {
            params.append('project_id', filters.project_id);
        }

        const queryString = params.toString();
        const url = queryString ? `/tasks?${queryString}` : '/tasks';

        const response = await api.get(url);
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
