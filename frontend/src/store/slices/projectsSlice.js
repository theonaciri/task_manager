import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../../services/projectService';

// Actions asynchrones
export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await projectService.getAll(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchProjectById = createAsyncThunk(
    'projects/fetchProjectById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await projectService.getById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const response = await projectService.create(projectData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async ({ id, projectData }, { rejectWithValue }) => {
        try {
            const response = await projectService.update(id, projectData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (id, { rejectWithValue }) => {
        try {
            await projectService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
    pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    },
    search: '',
    formData: {
        name: '',
    },
    formErrors: {},
};

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearFormErrors: (state) => {
            state.formErrors = {};
        },
        updateFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        resetFormData: (state) => {
            state.formData = { name: '' };
        },
        setCurrentProject: (state, action) => {
            state.currentProject = action.payload;
        },
        updateSearch: (state, action) => {
            state.search = action.payload;
        },
        clearSearch: (state) => {
            state.search = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.data || action.payload;
                // Gestion de la pagination si elle existe
                if (action.payload.meta) {
                    state.pagination = {
                        current_page: action.payload.meta.current_page,
                        last_page: action.payload.meta.last_page,
                        per_page: action.payload.meta.per_page,
                        total: action.payload.meta.total,
                    };
                }
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch project by ID
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create project
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.formErrors = {};
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.push(action.payload);
                state.formData = { name: '' };
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.payload;
                state.formErrors = action.payload?.errors || {};
            })

            // Update project
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.formErrors = {};
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                state.currentProject = action.payload;
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.payload;
                state.formErrors = action.payload?.errors || {};
            })

            // Delete project
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = state.projects.filter(p => p.id !== action.payload);
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearError,
    clearFormErrors,
    updateFormData,
    resetFormData,
    setCurrentProject,
    updateSearch,
    clearSearch,
} = projectsSlice.actions;

export default projectsSlice.reducer;
