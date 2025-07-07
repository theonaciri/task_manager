import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projectService } from '../services/projectService'
import api from '../services/api'

// Mock de l'API
vi.mock('../services/api')

describe('Project Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all projects', async () => {
      const mockProjects = {
        data: [
          { id: 1, name: 'Project 1' },
          { id: 2, name: 'Project 2' }
        ]
      }
      
      api.get.mockResolvedValue(mockProjects)
      
      const result = await projectService.getAll()
      
      expect(api.get).toHaveBeenCalledWith('/projects')
      expect(result).toEqual(mockProjects.data)
    })

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error'
      api.get.mockRejectedValue(new Error(errorMessage))
      
      await expect(projectService.getAll()).rejects.toThrow(errorMessage)
    })
  })

  describe('getById', () => {
    it('should fetch project by id', async () => {
      const projectId = 1
      const mockProject = {
        data: { id: 1, name: 'Project 1', tasks: [] }
      }
      
      api.get.mockResolvedValue(mockProject)
      
      const result = await projectService.getById(projectId)
      
      expect(api.get).toHaveBeenCalledWith(`/projects/${projectId}`)
      expect(result).toEqual(mockProject.data)
    })
  })

  describe('create', () => {
    it('should create a new project', async () => {
      const projectData = { name: 'New Project' }
      const mockResponse = {
        data: { id: 1, ...projectData }
      }
      
      api.post.mockResolvedValue(mockResponse)
      
      const result = await projectService.create(projectData)
      
      expect(api.post).toHaveBeenCalledWith('/projects', projectData)
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle validation errors', async () => {
      const projectData = { name: '' }
      const errorResponse = {
        response: {
          data: {
            message: 'Validation failed',
            errors: { name: ['The name field is required.'] }
          }
        }
      }
      
      api.post.mockRejectedValue(errorResponse)
      
      await expect(projectService.create(projectData)).rejects.toEqual(errorResponse)
    })
  })

  describe('update', () => {
    it('should update an existing project', async () => {
      const projectId = 1
      const updateData = { name: 'Updated Project' }
      const mockResponse = {
        data: { id: projectId, ...updateData }
      }
      
      api.put.mockResolvedValue(mockResponse)
      
      const result = await projectService.update(projectId, updateData)
      
      expect(api.put).toHaveBeenCalledWith(`/projects/${projectId}`, updateData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('delete', () => {
    it('should delete a project', async () => {
      const projectId = 1
      const mockResponse = {
        data: { message: 'Project deleted successfully' }
      }
      
      api.delete.mockResolvedValue(mockResponse)
      
      const result = await projectService.delete(projectId)
      
      expect(api.delete).toHaveBeenCalledWith(`/projects/${projectId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })
})
