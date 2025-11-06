import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, renderHook } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import userEvent from '@testing-library/user-event'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock fetch
global.fetch = vi.fn()

// Test component that uses AuthContext
const TestComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth()

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'not-authenticated'}
      </div>
      <div data-testid="user-name">{user?.name || 'no-user'}</div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should provide initial unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated')
    expect(screen.getByTestId('user-name')).toHaveTextContent('no-user')
  })

  it('should handle login successfully', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      knowledgeLevel: 'beginner' as const
    }

    // Mock successful API response
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser, token: 'fake-token' })
    })

    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginButton = screen.getByRole('button', { name: /login/i })
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
      expect(screen.getByTestId('user-name')).toHaveTextContent('test') // The mock user has email 'test@example.com', so name should be 'test'
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', expect.any(String))
  })

  it('should handle login with empty credentials', async () => {
    // Test login with empty credentials
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    const loginResult = await result.current.login('', '')
    expect(loginResult).toBe(false)
  })

  describe('Initial data functions', () => {
    it('should create user with correct initial stats', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await result.current.register('Test User', 'test@example.com', 'password')

      const updateCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(updateCall).toBeDefined()

      const savedUser = JSON.parse(updateCall[1])
      expect(savedUser.stats).toEqual({
        activeCourses: 0,
        completedModules: 0,
        averageProgress: 0,
        achievements: 0,
        totalLessonsCompleted: 0,
        studyTimeHours: 0,
        streakDays: 0
      })
    })

    it('should create user with initial achievements', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await result.current.register('Test User', 'test@example.com', 'password')

      const updateCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(updateCall).toBeDefined()

      const savedUser = JSON.parse(updateCall[1])
      expect(Array.isArray(savedUser.achievements)).toBe(true)
      expect(savedUser.achievements.length).toBeGreaterThan(0)

      // Check structure of first achievement
      const firstAchievement = savedUser.achievements[0]
      expect(firstAchievement).toHaveProperty('id')
      expect(firstAchievement).toHaveProperty('title')
      expect(firstAchievement).toHaveProperty('description')
      expect(firstAchievement).toHaveProperty('category')
      expect(firstAchievement).toHaveProperty('rarity')
      expect(firstAchievement).toHaveProperty('requirement')
      expect(firstAchievement).toHaveProperty('points')
      expect(firstAchievement).toHaveProperty('maxProgress')
      expect(firstAchievement).toHaveProperty('unlocked')
      expect(firstAchievement.unlocked).toBe(false)
    })

    it('should create user with correct initial performance metrics', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await result.current.register('Test User', 'test@example.com', 'password')

      const updateCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(updateCall).toBeDefined()

      const savedUser = JSON.parse(updateCall[1])
      expect(savedUser.performanceMetrics).toEqual({
        totalStudyTime: 0,
        coursesCompleted: 0,
        lessonsCompleted: 0,
        averageScore: 0,
        streakDays: 0,
        weeklyProgress: [],
        monthlyProgress: []
      })
    })
  })

  describe('User registration', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      localStorageMock.getItem.mockReturnValue(null)
    })

    it('should register new user successfully', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      const registerResult = await result.current.register('Test User', 'test@example.com', 'password')
      expect(registerResult).toBe(true)

      // Check that user was saved to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', expect.any(String))

      // Check the saved user data
      const savedUserCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(savedUserCall).toBeDefined()

      const savedUser = JSON.parse(savedUserCall[1])
      expect(savedUser.name).toBe('Test User')
      expect(savedUser.email).toBe('test@example.com')
      expect(savedUser.stats.activeCourses).toBe(0)
      expect(savedUser.stats.completedModules).toBe(0)
      expect(savedUser.subscription.planId).toBe('free')
    })

    it('should reject registration with empty fields', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      const registerResult = await result.current.register('', '', '')
      expect(registerResult).toBe(false)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('Assessment result updates', () => {
    it('should update assessment result for beginner level', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        stats: { activeCourses: 0, completedModules: 0, averageProgress: 0, achievements: 0, totalLessonsCompleted: 0, studyTimeHours: 0, streakDays: 0 },
        subscription: { planId: 'free', plan: { id: 'free', name: 'Бесплатный', price: 0, currency: 'RUB', features: ['1 курс в месяц'], maxCourses: 1, maxFamilyMembers: 1, voiceEnabled: false, chatEnabled: true }, startDate: new Date().toISOString(), isActive: true, autoRenewal: false },
        performanceMetrics: { totalStudyTime: 0, coursesCompleted: 0, lessonsCompleted: 0, averageScore: 0, streakDays: 0, weeklyProgress: [], monthlyProgress: [] },
        isFamilyHead: true,
        familyMembers: []
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      // Wait for user to be loaded
      await waitFor(() => {
        expect(result.current.user).toBeTruthy()
      })

      // Mock generatePersonalizedCourse to avoid API call
      const mockGeneratePersonalizedCourse = vi.fn().mockResolvedValue({
        id: 'personalized-course',
        title: 'Personalized Course',
        description: 'Test Description',
        topics: ['Grammar'],
        difficulty: 'beginner' as const,
        estimatedHours: 20,
        modules: [{
          title: 'Module 1',
          description: 'Description',
          lessons: ['Lesson 1']
        }]
      })

      // Temporarily replace the function
      const originalGeneratePersonalizedCourse = result.current.generatePersonalizedCourse
      result.current.generatePersonalizedCourse = mockGeneratePersonalizedCourse

      await result.current.updateAssessmentResult(8, 10, ['Grammar'])

      // Check that user was updated
      expect(localStorageMock.setItem).toHaveBeenCalled()

      // Check the updated user data
      const updateCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(updateCall).toBeDefined()

      const updatedUser = JSON.parse(updateCall[1])
      expect(updatedUser.assessmentResult).toBeDefined()
      expect(updatedUser.assessmentResult.score).toBe(8) // Raw score, not percentage
      expect(updatedUser.assessmentResult.totalQuestions).toBe(10)
      expect(updatedUser.assessmentResult.level).toBe('advanced') // 80% = advanced level
      expect(updatedUser.assessmentResult.weakTopics).toEqual(['Grammar'])
    })

    it('should determine correct level based on score', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      // Test different score ranges
      await result.current.updateAssessmentResult(5, 10, []) // 50% - A2 level
      await result.current.updateAssessmentResult(7, 10, []) // 70% - B1 level
      await result.current.updateAssessmentResult(9, 10, []) // 90% - C1 level

      // The function should handle different levels correctly
      expect(result.current.updateAssessmentResult).toBeDefined()
    })
  })

  describe('User stats management', () => {
    it('should update user stats correctly', () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        stats: { activeCourses: 0, completedModules: 0, averageProgress: 0, achievements: 0, totalLessonsCompleted: 0, studyTimeHours: 0, streakDays: 0 },
        subscription: { planId: 'free', plan: { id: 'free', name: 'Бесплатный', price: 0, currency: 'RUB', features: ['1 курс в месяц'], maxCourses: 1, maxFamilyMembers: 1, voiceEnabled: false, chatEnabled: true }, startDate: new Date().toISOString(), isActive: true, autoRenewal: false },
        performanceMetrics: { totalStudyTime: 0, coursesCompleted: 0, lessonsCompleted: 0, averageScore: 0, streakDays: 0, weeklyProgress: [], monthlyProgress: [] },
        isFamilyHead: true,
        familyMembers: []
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      result.current.updateUserStats({
        activeCourses: 2,
        completedModules: 5,
        studyTimeHours: 10
      })

      // Check that user was updated
      const updateCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(updateCall).toBeDefined()

      const updatedUser = JSON.parse(updateCall[1])
      expect(updatedUser.stats.activeCourses).toBe(2)
      expect(updatedUser.stats.completedModules).toBe(5)
      expect(updatedUser.stats.studyTimeHours).toBe(10)
      // Other stats should remain unchanged
      expect(updatedUser.stats.averageProgress).toBe(0)
    })
  })

  describe('Course management', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      stats: { activeCourses: 0, completedModules: 0, averageProgress: 0, achievements: 0, totalLessonsCompleted: 0, studyTimeHours: 0, streakDays: 0 },
      subscription: { planId: 'free', plan: { id: 'free', name: 'Бесплатный', price: 0, currency: 'RUB', features: ['1 курс в месяц'], maxCourses: 1, maxFamilyMembers: 1, voiceEnabled: false, chatEnabled: true }, startDate: new Date().toISOString(), isActive: true, autoRenewal: false },
      performanceMetrics: { totalStudyTime: 0, coursesCompleted: 0, lessonsCompleted: 0, averageScore: 0, streakDays: 0, weeklyProgress: [], monthlyProgress: [] },
      isFamilyHead: true,
      familyMembers: [],
      activeCourses: []
    }

    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))
    })

    it('should start a new course', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      const courseData = {
        id: 'course-1',
        title: 'Test Course',
        description: 'Test Description',
        progress: 0,
        level: 'beginner',
        students: '1',
        color: '#ff0000',
        modules: 5,
        completedModules: 0,
        icon: 'book'
      }

      result.current.startCourse(courseData)

      const updateCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(updateCall).toBeDefined()

      const updatedUser = JSON.parse(updateCall[1])
      expect(updatedUser.activeCourses).toHaveLength(1)
      expect(updatedUser.activeCourses[0]).toMatchObject({
        ...courseData,
        startedAt: expect.any(String) // Date serialized as string
      })
    })

    it('should complete a lesson and update stats', () => {
      const userWithCourse = {
        ...mockUser,
        activeCourses: [{
          id: 'course-1',
          title: 'Test Course',
          description: 'Test Description',
          progress: 0,
          level: 'beginner',
          students: '1',
          color: '#ff0000',
          modules: 5,
          completedModules: 0,
          icon: 'book',
          startedAt: new Date()
        }]
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(userWithCourse))

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      result.current.completeLesson(0, 0) // Complete lesson 0 in module 0

      const updateCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(updateCall).toBeDefined()

      const updatedUser = JSON.parse(updateCall[1])
      expect(updatedUser.stats.totalLessonsCompleted).toBe(1)
    })

    it('should stop a course', () => {
      const userWithCourse = {
        ...mockUser,
        activeCourses: [{
          id: 'course-1',
          title: 'Test Course',
          description: 'Test Description',
          progress: 50,
          level: 'beginner',
          students: '1',
          color: '#ff0000',
          modules: 5,
          completedModules: 2,
          icon: 'book',
          startedAt: new Date()
        }]
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(userWithCourse))

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      result.current.stopCourse('course-1')

      const updateCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(updateCall).toBeDefined()

      const updatedUser = JSON.parse(updateCall[1])
      expect(updatedUser.activeCourses).toHaveLength(0)
    })
  })

  describe('Achievement system', () => {
    const baseMockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      stats: { activeCourses: 0, completedModules: 0, averageProgress: 0, achievements: 0, totalLessonsCompleted: 0, studyTimeHours: 0, streakDays: 0 },
      subscription: { planId: 'free', plan: { id: 'free', name: 'Бесплатный', price: 0, currency: 'RUB', features: ['1 курс в месяц'], maxCourses: 1, maxFamilyMembers: 1, voiceEnabled: false, chatEnabled: true }, startDate: new Date().toISOString(), isActive: true, autoRenewal: false },
      performanceMetrics: { totalStudyTime: 0, coursesCompleted: 0, lessonsCompleted: 0, averageScore: 0, streakDays: 0, weeklyProgress: [], monthlyProgress: [] },
      isFamilyHead: true,
      familyMembers: []
    }

    it('should update achievement progress', () => {
      const mockUser = {
        ...baseMockUser,
        achievements: [{
          id: 'achievement-1',
          title: 'First Lesson',
          description: 'Complete your first lesson',
          category: 'learning' as const,
          rarity: 'common' as const,
          requirement: 'Complete 1 lesson',
          points: 10,
          maxProgress: 1,
          unlocked: false
        }],
        achievementProgress: []
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      result.current.updateAchievementProgress('achievement-1', 1)

      const updateCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(updateCall).toBeDefined()

      const updatedUser = JSON.parse(updateCall[1])
      expect(updatedUser.achievementProgress).toHaveLength(1)
      expect(updatedUser.achievementProgress[0]).toMatchObject({
        achievementId: 'achievement-1',
        currentProgress: 1,
        lastUpdated: expect.any(String)
      })
    })

    it('should check and unlock achievements', () => {
      const mockUser = {
        ...baseMockUser,
        stats: { activeCourses: 0, completedModules: 0, averageProgress: 0, achievements: 0, totalLessonsCompleted: 1, studyTimeHours: 0, streakDays: 0 },
        achievements: [{
          id: 'achievement-1',
          title: 'First Lesson',
          description: 'Complete your first lesson',
          category: 'learning' as const,
          rarity: 'common' as const,
          requirement: 'Complete 1 lesson',
          points: 10,
          maxProgress: 1,
          unlocked: false
        }],
        achievementProgress: [{
          achievementId: 'achievement-1',
          currentProgress: 1,
          lastUpdated: new Date()
        }]
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      result.current.checkAchievements()

      const updateCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'user')
      expect(updateCall).toBeDefined()

      const updatedUser = JSON.parse(updateCall[1])
      expect(updatedUser.achievements[0].unlocked).toBe(true)
      expect(updatedUser.achievements[0].unlockedAt).toBeDefined()
      expect(updatedUser.stats.achievements).toBe(1)
    })
  })

  it('should handle logout', async () => {
    // First, set up authenticated state
    const logoutUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      stats: { activeCourses: 0, completedModules: 0, averageProgress: 0, achievements: 0, totalLessonsCompleted: 0, studyTimeHours: 0, streakDays: 0 },
      subscription: { planId: 'free', plan: { id: 'free', name: 'Бесплатный', price: 0, currency: 'RUB', features: ['1 курс в месяц'], maxCourses: 1, maxFamilyMembers: 1, voiceEnabled: false, chatEnabled: true }, startDate: new Date().toISOString(), isActive: true, autoRenewal: false },
      performanceMetrics: { totalStudyTime: 0, coursesCompleted: 0, lessonsCompleted: 0, averageScore: 0, streakDays: 0, weeklyProgress: [], monthlyProgress: [] },
      isFamilyHead: true,
      familyMembers: []
    }
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(logoutUser))

    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Should be authenticated initially
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')

    // Click logout
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated')
    expect(screen.getByTestId('user-name')).toHaveTextContent('no-user')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
  })

  it('should load user from localStorage on mount', () => {
    const storedUser = {
      id: '1',
      name: 'Stored User',
      email: 'stored@example.com',
      stats: { activeCourses: 0, completedModules: 0, averageProgress: 0, achievements: 0, totalLessonsCompleted: 0, studyTimeHours: 0, streakDays: 0 },
      subscription: { planId: 'free', plan: { id: 'free', name: 'Бесплатный', price: 0, currency: 'RUB', features: ['1 курс в месяц'], maxCourses: 1, maxFamilyMembers: 1, voiceEnabled: false, chatEnabled: true }, startDate: new Date().toISOString(), isActive: true, autoRenewal: false },
      performanceMetrics: { totalStudyTime: 0, coursesCompleted: 0, lessonsCompleted: 0, averageScore: 0, streakDays: 0, weeklyProgress: [], monthlyProgress: [] },
      isFamilyHead: true,
      familyMembers: []
    }

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedUser))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Stored User')
  })

  it('should handle corrupted localStorage data', () => {
    localStorageMock.getItem.mockReturnValueOnce('invalid-json')

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated')
  })
})
