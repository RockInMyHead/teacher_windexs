import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Assessment from '@/pages/Assessment'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock fetch to simulate API failures and force fallback
global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Assessment Workflow Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show level selection step', () => {
    renderWithProviders(<Assessment />)

    // Should show level selection initially
    expect(screen.getByText('Выберите ваш уровень владения языком')).toBeInTheDocument()

    // Should have CEFR level options
    expect(screen.getByText('Элементарный (A1)')).toBeInTheDocument()
    expect(screen.getByText('Базовый (A2)')).toBeInTheDocument()
    expect(screen.getByText('Средний (B1)')).toBeInTheDocument()
  })

  it('should navigate to goal setting after level selection', async () => {
    const user = userEvent.setup()

    renderWithProviders(<Assessment />)

    // Select A2 level
    const a2Radio = screen.getByRole('radio', { name: /базовый \(a2\)/i })
    await user.click(a2Radio)

    const continueButton = screen.getByRole('button', { name: /продолжить/i })
    await user.click(continueButton)

    // Should move to goal setting
    await waitFor(() => {
      expect(screen.getByText('Расскажите о ваших целях')).toBeInTheDocument()
    })

    // Should have goal input field
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  }) // Increase timeout for this integration test

  it('should allow goal input and navigation to testing', async () => {
    const user = userEvent.setup()

    renderWithProviders(<Assessment />)

    // Select level first
    const b1Radio = screen.getByRole('radio', { name: /средний \(b1\)/i })
    await user.click(b1Radio)

    const continueButton = screen.getByRole('button', { name: /продолжить/i })
    await user.click(continueButton)

    // Should be in goal setting
    await waitFor(() => {
      expect(screen.getByText('Расскажите о ваших целях')).toBeInTheDocument()
    })

    // Input goal and continue
    const goalTextarea = screen.getByRole('textbox')
    await user.type(goalTextarea, 'Для работы в IT')

    const startTestingButton = screen.getByRole('button', { name: /начать тестирование/i })
    expect(startTestingButton).not.toBeDisabled()

    await user.click(startTestingButton)

    // Should attempt to start testing (may show loading or questions)
    await waitFor(() => {
      // Either shows loading or questions (depending on API response)
      const loadingText = screen.queryByText(/AI создает персональный тест/i)
      const questionText = screen.queryByText(/Какое/i)

      expect(loadingText || questionText).toBeTruthy()
    }, { timeout: 3000 })
  })
})
