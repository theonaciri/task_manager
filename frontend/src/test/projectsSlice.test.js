import { describe, it, expect, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import projectsReducer, {
  updateFormData,
  resetFormData,
  clearError,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject
} from '../store/slices/projectsSlice'

// Mock de l'API
vi.mock('../../services/projectService', () => ({
  projectService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('Projects Redux Slice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        projects: projectsReducer,
      },
    })
  })

  it('should have correct initial state', () => {
    const state = store.getState().projects

    expect(state.projects).toEqual([])
    expect(state.currentProject).toBeNull()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.formData).toEqual({ name: '' })
    expect(state.formErrors).toEqual({})
  })

  it('should update form data', () => {
    store.dispatch(updateFormData({ name: 'Test Project' }))

    const state = store.getState().projects
    expect(state.formData.name).toBe('Test Project')
  })

  it('should reset form data', () => {
    store.dispatch(updateFormData({ name: 'Test Project' }))
    store.dispatch(resetFormData())

    const state = store.getState().projects
    expect(state.formData).toEqual({ name: '' })
  })

  it('should clear error', () => {
    // Simuler un état avec erreur
    store.dispatch({ type: 'projects/fetchProjects/rejected', payload: 'Test error' })

    // Vérifier que l'erreur est présente
    let state = store.getState().projects
    expect(state.error).toBeTruthy()

    // Effacer l'erreur
    store.dispatch(clearError())

    state = store.getState().projects
    expect(state.error).toBeNull()
  })

  it('should handle fetchProjects pending', () => {
    store.dispatch({ type: fetchProjects.pending.type })

    const state = store.getState().projects
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should handle fetchProjects fulfilled', () => {
    const mockProjects = [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' }
    ]

    store.dispatch({
      type: fetchProjects.fulfilled.type,
      payload: mockProjects
    })

    const state = store.getState().projects
    expect(state.loading).toBe(false)
    expect(state.projects).toEqual(mockProjects)
  })

  it('should handle fetchProjects rejected', () => {
    const errorMessage = 'Failed to fetch projects'

    store.dispatch({
      type: fetchProjects.rejected.type,
      payload: errorMessage
    })

    const state = store.getState().projects
    expect(state.loading).toBe(false)
    expect(state.error).toBe(errorMessage)
  })

  it('should handle createProject fulfilled', () => {
    const newProject = { id: 1, name: 'New Project' }

    store.dispatch({
      type: createProject.fulfilled.type,
      payload: newProject
    })

    const state = store.getState().projects
    expect(state.loading).toBe(false)
    expect(state.projects).toContain(newProject)
    expect(state.formData).toEqual({ name: '' })
  })

  it('should handle updateProject fulfilled', () => {
    const initialProject = { id: 1, name: 'Original Name' }
    const updatedProject = { id: 1, name: 'Updated Name' }

    // D'abord ajouter le projet initial
    store.dispatch({
      type: fetchProjects.fulfilled.type,
      payload: [initialProject]
    })

    // Puis le mettre à jour
    store.dispatch({
      type: updateProject.fulfilled.type,
      payload: updatedProject
    })

    const state = store.getState().projects
    expect(state.projects[0]).toEqual(updatedProject)
    expect(state.currentProject).toEqual(updatedProject)
  })

  it('should handle deleteProject fulfilled', () => {
    const projects = [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' }
    ]

    // D'abord ajouter les projets
    store.dispatch({
      type: fetchProjects.fulfilled.type,
      payload: projects
    })

    // Puis supprimer un projet
    store.dispatch({
      type: deleteProject.fulfilled.type,
      payload: 1 // ID du projet supprimé
    })

    const state = store.getState().projects
    expect(state.projects).toHaveLength(1)
    expect(state.projects[0].id).toBe(2)
  })
})
