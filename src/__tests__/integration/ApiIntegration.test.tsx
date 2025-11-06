import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      token: 'fake-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'test',
        stats: { activeCourses: 0, completedModules: 0, averageProgress: 0, achievements: 0, totalLessonsCompleted: 0, studyTimeHours: 0, streakDays: 0 },
        subscription: { planId: 'free', plan: { id: 'free', name: 'Бесплатный', price: 0, currency: 'RUB', features: ['1 курс в месяц'], maxCourses: 1, maxFamilyMembers: 1, voiceEnabled: false, chatEnabled: true }, startDate: new Date().toISOString(), isActive: true, autoRenewal: false },
        performanceMetrics: { totalStudyTime: 0, coursesCompleted: 0, lessonsCompleted: 0, averageScore: 0, streakDays: 0, weeklyProgress: [], monthlyProgress: [] },
        isFamilyHead: true,
        familyMembers: []
      }
    }),
  } as Response)
)

const TestApp = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    ;(global.fetch as any).mockClear()
  })

  describe('Data persistence and recovery', () => {
    it('should load user data from localStorage on app start', () => {
      // Mock saved user data
      const savedUser = {
        id: '1',
        email: 'saved@example.com',
        name: 'Saved User',
        stats: { activeCourses: 2, completedModules: 1, averageProgress: 75, achievements: 1, totalLessonsCompleted: 5, studyTimeHours: 8, streakDays: 3 },
        subscription: { planId: 'premium', plan: { id: 'premium', name: 'Премиум', price: 500, currency: 'RUB', features: ['Неограниченное количество курсов'], maxCourses: 999, maxFamilyMembers: 5, voiceEnabled: true, chatEnabled: true }, startDate: new Date().toISOString(), isActive: true, autoRenewal: true },
        performanceMetrics: { totalStudyTime: 480, coursesCompleted: 1, lessonsCompleted: 5, averageScore: 85, streakDays: 3, weeklyProgress: [10, 15, 20], monthlyProgress: [50, 75, 100] },
        isFamilyHead: true,
        familyMembers: []
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedUser))

      const TestComponent = () => {
        const { user, isAuthenticated } = useAuth()

        return (
          <div>
            <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
            <div data-testid="user-name">{user?.name || 'No user'}</div>
            <div data-testid="user-courses">{user?.stats?.activeCourses || 0}</div>
            <div data-testid="user-plan">{user?.subscription?.plan?.name || 'No plan'}</div>
          </div>
        )
      }

      render(
        <TestApp>
          <TestComponent />
        </TestApp>
      )

      // Should load saved user data
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
      expect(screen.getByTestId('user-name')).toHaveTextContent('Saved User')
      expect(screen.getByTestId('user-courses')).toHaveTextContent('2')
      expect(screen.getByTestId('user-plan')).toHaveTextContent('Премиум')
    })

    it('should handle corrupted localStorage data', () => {
      // Mock corrupted data
      localStorageMock.getItem.mockReturnValue('invalid-json-data')

      const TestComponent = () => {
        const { user, isAuthenticated } = useAuth()

        return (
          <div>
            <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
            <div data-testid="user-name">{user?.name || 'No user'}</div>
          </div>
        )
      }

      // Should not crash with corrupted data
      render(
        <TestApp>
          <TestComponent />
        </TestApp>
      )

      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated')
      expect(screen.getByTestId('user-name')).toHaveTextContent('No user')

      // Should clear corrupted data
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })
})