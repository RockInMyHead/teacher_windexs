import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Assessment from '@/pages/Assessment'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock fetch
global.fetch = vi.fn()

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Assessment Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading initially and complete assessment automatically', async () => {
    renderWithProviders(<Assessment />)

    // Should show loading screen initially
    expect(screen.getByText('Создание персонального курса')).toBeInTheDocument()
    expect(screen.getByText('Анализируем ваши предпочтения и создаем индивидуальную программу обучения...')).toBeInTheDocument()

    // Should navigate to personalized course automatically
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/personalized-course')
    })
  })

  // All assessment steps are now skipped - assessment completes automatically on mount
  })
})

