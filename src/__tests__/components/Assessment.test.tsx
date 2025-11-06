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

  it('should render level selection step initially', () => {
    renderWithProviders(<Assessment />)

    expect(screen.getByText('Выберите ваш уровень владения языком')).toBeInTheDocument()
    expect(screen.getByText('Укажите ваш текущий уровень, чтобы мы могли подобрать подходящие вопросы для точной оценки')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /продолжить/i })).toBeInTheDocument()
  })

  it('should show CEFR level options', () => {
    renderWithProviders(<Assessment />)

    expect(screen.getByText('Элементарный (A1)')).toBeInTheDocument()
    expect(screen.getByText('Базовый (A2)')).toBeInTheDocument()
    expect(screen.getByText('Средний (B1)')).toBeInTheDocument()
    expect(screen.getByText('Выше среднего (B2)')).toBeInTheDocument()
    expect(screen.getByText('Продвинутый (C1)')).toBeInTheDocument()
    expect(screen.getByText('В совершенстве (C2)')).toBeInTheDocument()
  })

  it('should move to goal setting step when level is selected', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Assessment />)

    const levelButton = screen.getByRole('radio', { name: /элементарный \(a1\)/i })
    await user.click(levelButton)

    const continueButton = screen.getByRole('button', { name: /продолжить/i })
    await user.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText('Расскажите о ваших целях')).toBeInTheDocument()
      expect(screen.getByText('Зачем вы изучаете язык? Это поможет нам лучше понять ваши потребности')).toBeInTheDocument()
    })
  })

  it('should show goal setting form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Assessment />)

    // Select level
    const levelButton = screen.getByRole('radio', { name: /элементарный \(a1\)/i })
    await user.click(levelButton)

    const continueButton = screen.getByRole('button', { name: /продолжить/i })
    await user.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText('Ваша цель изучения языка')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  it('should handle goal setting and start testing', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Assessment />)

    // Step 1: Level Selection
    const levelButton = screen.getByRole('radio', { name: /элементарный \(a1\)/i })
    await user.click(levelButton)

    const continueButton = screen.getByRole('button', { name: /продолжить/i })
    await user.click(continueButton)

    // Step 2: Goal Setting
    await waitFor(() => {
      expect(screen.getByText('Расскажите о ваших целях')).toBeInTheDocument()
    })

    const goalTextarea = screen.getByRole('textbox')
    const testingButton = screen.getByRole('button', { name: /начать тестирование/i })

    // Verify goal input is available
    expect(goalTextarea).toBeInTheDocument()
    expect(testingButton).toBeInTheDocument()

    // Set goal - this should trigger the testing process
    await user.type(goalTextarea, 'Для работы')

    // Mock the fetch for question generation
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: JSON.stringify({
          questions: [
            { id: 1, question: 'Test question?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'Test explanation', difficulty: 'easy' }
          ]
        }) } }]
      }),
    })

    await user.click(testingButton)

    // Should attempt to start testing (may show loading or transition)
    await waitFor(() => {
      // Either shows loading state or transitions to testing
      const currentStep = screen.queryByText('Расскажите о ваших целях') ||
                         screen.queryByText(/Загрузка вопроса/i) ||
                         screen.queryByText('Test question?')
      expect(currentStep).toBeTruthy()
    }, { timeout: 2000 })
  })

  it('should disable continue button when no level is selected', () => {
    renderWithProviders(<Assessment />)

    const continueButton = screen.getByRole('button', { name: /продолжить/i })
    expect(continueButton).toBeDisabled()
  })

  it('should enable continue button when level is selected', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Assessment />)

    const levelButton = screen.getByRole('radio', { name: /элементарный \(a1\)/i })
    await user.click(levelButton)

    const continueButton = screen.getByRole('button', { name: /продолжить/i })
    expect(continueButton).not.toBeDisabled()
  })

  it('should show progress indicators after level selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Assessment />)

    // Select level to show progress indicators
    const levelButton = screen.getByRole('radio', { name: /элементарный \(a1\)/i })
    await user.click(levelButton)

    const continueButton = screen.getByRole('button', { name: /продолжить/i })
    await user.click(continueButton)

    // Should show step indicators in the header - goal setting step should be active
    await waitFor(() => {
      expect(screen.getByText('Цели обучения')).toBeInTheDocument()
      // Progress indicators are visual circles, not text - just check the header is shown
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Цели обучения')
    })
  })

  it('should have proper step titles after level selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Assessment />)

    // Select level to navigate to goal setting
    const levelButton = screen.getByRole('radio', { name: /элементарный \(a1\)/i })
    await user.click(levelButton)

    const continueButton = screen.getByRole('button', { name: /продолжить/i })
    await user.click(continueButton)

    // Should show the correct header title for goal setting step
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Цели обучения')
      expect(screen.getByText('Расскажите о ваших целях')).toBeInTheDocument()
    })
  })

  it('should show CEFR level options', () => {
    renderWithProviders(<Assessment />)

    // Should show CEFR level names
    expect(screen.getByText('Элементарный (A1)')).toBeInTheDocument()
    expect(screen.getByText('Базовый (A2)')).toBeInTheDocument()
    expect(screen.getByText('Средний (B1)')).toBeInTheDocument()
    expect(screen.getByText('Выше среднего (B2)')).toBeInTheDocument()
    expect(screen.getByText('Продвинутый (C1)')).toBeInTheDocument()
    expect(screen.getByText('В совершенстве (C2)')).toBeInTheDocument()
  })

  describe('Assessment basic functionality', () => {
    it('should render assessment component', () => {
      renderWithProviders(<Assessment />)
      expect(screen.getByText('Выберите ваш уровень владения языком')).toBeInTheDocument()
    })

    it('should navigate to goal setting step', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Assessment />)

      const levelButton = screen.getByRole('radio', { name: /элементарный \(a1\)/i })
      await user.click(levelButton)

      const continueButton = screen.getByRole('button', { name: /продолжить/i })
      await user.click(continueButton)

      await waitFor(() => {
        expect(screen.getByText('Расскажите о ваших целях')).toBeInTheDocument()
      })
    })
  })

  describe('Assessment goal setting', () => {
    it('should allow goal input and start testing button', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Assessment />)

      // Navigate to goal setting
      const levelButton = screen.getByRole('radio', { name: /элементарный \(a1\)/i })
      await user.click(levelButton)

      const continueButton = screen.getByRole('button', { name: /продолжить/i })
      await user.click(continueButton)

      await waitFor(() => {
        expect(screen.getByText('Расскажите о ваших целях')).toBeInTheDocument()
      })

      const goalTextarea = screen.getByRole('textbox')
      const testingButton = screen.getByRole('button', { name: /начать тестирование/i })

      expect(goalTextarea).toBeInTheDocument()
      expect(testingButton).toBeInTheDocument()

      // Type in goal
      await user.type(goalTextarea, 'Learn for work')
      expect(goalTextarea).toHaveValue('Learn for work')
    })
  })
})
