import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Layout from '../components/Layout'
import projectsReducer from '../store/slices/projectsSlice'
import tasksReducer from '../store/slices/tasksSlice'

// Store de test
const createTestStore = () => {
  return configureStore({
    reducer: {
      projects: projectsReducer,
      tasks: tasksReducer,
    },
  })
}

// Wrapper de test avec les providers nécessaires
const TestWrapper = ({ children }) => {
  const store = createTestStore()
  
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
}

describe('Layout Component', () => {
  it('renders the main layout correctly', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    )

    // Vérifier que les éléments principaux sont présents
    expect(screen.getByText('Gestionnaire de Tâches')).toBeInTheDocument()
    expect(screen.getByText('Projets')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.getByText(/© 2025 Gestionnaire de Tâches/)).toBeInTheDocument()
  })

  it('renders navigation links correctly', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    )

    const projectsLink = screen.getByRole('link', { name: 'Projets' })
    expect(projectsLink).toBeInTheDocument()
    expect(projectsLink).toHaveAttribute('href', '/projects')
  })

  it('displays children content in main section', () => {
    const testContent = 'This is test content for the layout'
    
    render(
      <TestWrapper>
        <Layout>
          <div>{testContent}</div>
        </Layout>
      </TestWrapper>
    )

    expect(screen.getByText(testContent)).toBeInTheDocument()
  })
})
