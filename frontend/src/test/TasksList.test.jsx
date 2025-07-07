import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TasksList from '../pages/TasksList';
import tasksSlice from '../store/slices/tasksSlice';
import projectsSlice from '../store/slices/projectsSlice';

// Mock the services
vi.mock('../services/taskService');
vi.mock('../services/projectService');

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      tasks: tasksSlice,
      projects: projectsSlice,
    },
    preloadedState: {
      tasks: {
        tasks: [{ id: 1, title: 'Test Task', status: 'pending', project_id: 1 }],
        loading: false,
        error: null,
        pagination: { current_page: 1, last_page: 1, per_page: 10, total: 1 },
        filters: { status: '', project_id: '', search: '' },
        ...initialState.tasks
      },
      projects: {
        projects: [{ id: 1, name: 'Test Project' }],
        loading: false,
        error: null,
        ...initialState.projects
      }
    }
  });
};

const renderWithProviders = (component, { store } = {}) => {
  const mockStore = store || createMockStore();
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('TasksList Search Functionality', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders search input with correct id and placeholder', () => {
    renderWithProviders(<TasksList />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher une tâche...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('id', 'tasks-search');
  });

  it('debounces search input to prevent excessive API calls', async () => {
    const mockStore = createMockStore();
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');
    
    renderWithProviders(<TasksList />, { store: mockStore });
    
    const searchInput = screen.getByPlaceholderText('Rechercher une tâche...');
    
    // Type multiple characters quickly
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Should not dispatch immediately
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/updateFilters',
        payload: { search: 'test' }
      })
    );
    
    // Fast-forward time by 300ms (debounce delay)
    vi.advanceTimersByTime(300);
    
    // Wait for the debounced effect to run
    await vi.runAllTimersAsync();
    
    // Now it should have dispatched
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/updateFilters',
        payload: { search: 'test' }
      })
    );
  }, 10000); // Increase timeout to 10 seconds

  it('shows clear filters button when search term is present', () => {
    renderWithProviders(<TasksList />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher une tâche...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(screen.getByText('Effacer les filtres')).toBeInTheDocument();
  });

  it('clears search term when clear filters is clicked', () => {
    renderWithProviders(<TasksList />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher une tâche...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    const clearButton = screen.getByText('Effacer les filtres');
    fireEvent.click(clearButton);
    
    expect(searchInput.value).toBe('');
  });
});
