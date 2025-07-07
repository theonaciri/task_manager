import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectsSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
