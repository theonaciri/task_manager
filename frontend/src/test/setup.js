import '@testing-library/jest-dom'

// Mock de l'API pour les tests
global.fetch = vi.fn()

// Configuration pour les tests
beforeEach(() => {
  fetch.mockClear()
})
