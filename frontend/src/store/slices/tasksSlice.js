import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/taskService';

// Actions asynchrones
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await taskService.getAll(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchTaskById = createAsyncThunk(
    'tasks/fetchTaskById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await taskService.getById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await taskService.create(taskData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, taskData }, { rejectWithValue }) => {
        try {
            const response = await taskService.update(id, taskData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id, { rejectWithValue }) => {
        try {
            await taskService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
    pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    },
    filters: {
        status: '',
        project_id: '',
        search: '',
    },
    formData: {
        title: '',
        status: 'pending',
        project_id: '',
    },
    formErrors: {},
};

const tasksSlice = createSlice({
    name: 'tasks',
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
            state.formData = { title: '', status: 'pending', project_id: '' };
        },
        updateFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { status: '', project_id: '', search: '' };
        },
        setCurrentTask: (state, action) => {
            state.currentTask = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.data || action.payload;
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
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch task by ID
            .addCase(fetchTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTask = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.formErrors = {};
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
                state.formData = { title: '', status: 'pending', project_id: '' };
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.payload;
                state.formErrors = action.payload?.errors || {};
            })

            // Update task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.formErrors = {};
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
                state.currentTask = action.payload;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.payload;
                state.formErrors = action.payload?.errors || {};
            })

            // Delete task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(t => t.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
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
    updateFilters,
    clearFilters,
    setCurrentTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
