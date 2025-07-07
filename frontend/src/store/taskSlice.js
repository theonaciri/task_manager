import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../services/taskService';

// Async thunks
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await taskService.getAll(params);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);

export const fetchTaskById = createAsyncThunk(
    'tasks/fetchTaskById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await taskService.getById(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await taskService.create(taskData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create task');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await taskService.update(id, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update task');
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
            return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        currentTask: null,
        loading: false,
        error: null,
        formLoading: false,
        formError: null,
        statusFilter: 'all', // 'all', 'pending', 'completed'
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.formError = null;
        },
        clearCurrentTask: (state) => {
            state.currentTask = null;
        },
        setStatusFilter: (state, action) => {
            state.statusFilter = action.payload;
        },
        // Update task in current project
        updateTaskInProject: (state, action) => {
            const updatedTask = action.payload;
            const index = state.tasks.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
                state.tasks[index] = updatedTask;
            }
        },
        // Remove task from current project
        removeTaskFromProject: (state, action) => {
            const taskId = action.payload;
            state.tasks = state.tasks.filter(t => t.id !== taskId);
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
                state.tasks = action.payload;
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
                state.formLoading = true;
                state.formError = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.formLoading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.formLoading = false;
                state.formError = action.payload;
            })

            // Update task
            .addCase(updateTask.pending, (state) => {
                state.formLoading = true;
                state.formError = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.formLoading = false;
                const index = state.tasks.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
                state.currentTask = action.payload;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.formLoading = false;
                state.formError = action.payload;
            })

            // Delete task
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(t => t.id !== action.payload);
            });
    },
});

export const {
    clearError,
    clearCurrentTask,
    setStatusFilter,
    updateTaskInProject,
    removeTaskFromProject
} = taskSlice.actions;
export default taskSlice.reducer;
