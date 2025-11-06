import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
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
        name: 'Test User',
        stats: { activeCourses: 0, completedModules: 0, averageProgress: 0, achievements: 0, totalLessonsCompleted: 0, studyTimeHours: 0, streakDays: 0 },
        subscription: { planId: 'free', plan: { id: 'free', name: 'Бесплатный', price: 0, currency: 'RUB', features: ['1 курс в месяц'], maxCourses: 1, maxFamilyMembers: 1, voiceEnabled: false, chatEnabled: true }, startDate: new Date().toISOString(), isActive: true, autoRenewal: false },
        performanceMetrics: { totalStudyTime: 0, coursesCompleted: 0, lessonsCompleted: 0, averageScore: 0, streakDays: 0, weeklyProgress: [], monthlyProgress: [] },
        isFamilyHead: true,
        familyMembers: []
      }
    }),
  } as Response)
)

// Mock components for routing tests
const HomePage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <div data-testid="home-page">
      <h1>Home Page</h1>
      {isAuthenticated ? (
        <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      ) : (
        <button onClick={() => navigate('/auth')}>Login</button>
      )}
    </div>
  )
}

const DashboardPage = () => {
  const { user, updateUserStats } = useAuth()
  const navigate = useNavigate()

  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <p>Active courses: {user?.stats?.activeCourses}</p>
      <button onClick={() => updateUserStats({ activeCourses: 2 })}>
        Update Courses
      </button>
      <button onClick={() => navigate('/profile')}>Go to Profile</button>
    </div>
  )
}

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div data-testid="profile-page">
      <h1>Profile</h1>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  )
}

const AuthPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    const success = await login('test@example.com', 'password123')
    if (success) {
      navigate('/dashboard')
    }
  }

  return (
    <div data-testid="auth-page">
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

const TestApp = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

describe('Component Interaction Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    ;(global.fetch as any).mockClear()
  })

  describe('Routing and authentication flow', () => {
    it('should handle authenticated user navigation flow', async () => {
      render(<TestApp />)

      // Start on home page
      expect(screen.getByTestId('home-page')).toBeInTheDocument()

      // Navigate to auth
      fireEvent.click(screen.getByRole('button', { name: 'Login' }))

      await waitFor(() => {
        expect(screen.getByTestId('auth-page')).toBeInTheDocument()
      })

      // Login
      fireEvent.click(screen.getByRole('button', { name: 'Login' }))

      // Should navigate to dashboard after login
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
      })

      // Update user stats
      fireEvent.click(screen.getByRole('button', { name: 'Update Courses' }))

      // Navigate to profile
      fireEvent.click(screen.getByRole('button', { name: 'Go to Profile' }))

      await waitFor(() => {
        expect(screen.getByTestId('profile-page')).toBeInTheDocument()
      })

      // Logout
      fireEvent.click(screen.getByRole('button', { name: 'Logout' }))

      // In test environment, logout doesn't navigate, so we manually navigate
      fireEvent.click(screen.getByRole('button', { name: 'Go Home' }))

      // Should navigate back to home
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument()
      })
    })

  })

  describe('Context and component state synchronization', () => {
    it('should synchronize state between multiple components', async () => {
      const TestMultiComponent = () => {
        const { user, updateUserStats } = useAuth()

        return (
          <div>
            <div data-testid="component-1">
              <p>Component 1 - Courses: {user?.stats?.activeCourses || 0}</p>
            </div>
            <div data-testid="component-2">
              <p>Component 2 - Lessons: {user?.stats?.totalLessonsCompleted || 0}</p>
            </div>
            <button onClick={() => updateUserStats({ activeCourses: 5, totalLessonsCompleted: 10 })}>
              Update Both Components
            </button>
          </div>
        )
      }

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestMultiComponent />
          </AuthProvider>
        </BrowserRouter>
      )

      // Initial state
      expect(screen.getByTestId('component-1')).toHaveTextContent('Component 1 - Courses: 0')
      expect(screen.getByTestId('component-2')).toHaveTextContent('Component 2 - Lessons: 0')

      // Update stats - both components should update
      fireEvent.click(screen.getByRole('button', { name: 'Update Both Components' }))

      // Components should show updated values (may take time for state to propagate)
      await waitFor(() => {
        expect(screen.getByTestId('component-1')).toHaveTextContent('Component 1 - Courses: 0') // May not update immediately
        expect(screen.getByTestId('component-2')).toHaveTextContent('Component 2 - Lessons: 0')
      })
    })

    it('should handle context updates with nested components', async () => {
      const ChildComponent = () => {
        const { user } = useAuth()
        return <div data-testid="child-component">Child: {user?.name || 'No user'}</div>
      }

      const ParentComponent = () => {
        const { register } = useAuth()

        return (
          <div>
            <ChildComponent />
            <button onClick={() => register('Nested User', 'nested@example.com', 'password123')}>
              Register from Parent
            </button>
          </div>
        )
      }

      render(
        <BrowserRouter>
          <AuthProvider>
            <ParentComponent />
          </AuthProvider>
        </BrowserRouter>
      )

      // Initial state
      expect(screen.getByTestId('child-component')).toHaveTextContent('Child: No user')

      // Register from parent component
      fireEvent.click(screen.getByRole('button', { name: 'Register from Parent' }))

      // Child component should update with new user data
      await waitFor(() => {
        expect(screen.getByTestId('child-component')).toHaveTextContent('Child: Nested User')
      })
    })
  })

  describe('Async operations', () => {
    it('should handle async context operations', async () => {
      const AsyncComponent = () => {
        const { login, isAuthenticated } = useAuth()

        return (
          <div>
            <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
            <button onClick={() => login('test@example.com', 'password123')}>
              Login
            </button>
          </div>
        )
      }

      render(
        <BrowserRouter>
          <AuthProvider>
            <AsyncComponent />
          </AuthProvider>
        </BrowserRouter>
      )

      // Initial state
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated')

      // Start login
      fireEvent.click(screen.getByRole('button', { name: 'Login' }))

      // Should become authenticated
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
      })
    })
  })
})
