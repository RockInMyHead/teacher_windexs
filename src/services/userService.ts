/**
 * User Service
 * Handles user authentication, profile, and preferences
 */

import api from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  role: string;
  totalLessonsCompleted: number;
  totalStudyHours: number;
  currentStreakDays: number;
  maxStreakDays: number;
  totalPoints: number;
  level: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: string;
  language: string;
  notificationsEnabled: boolean;
  preferredLessonDuration: number;
  ttsVoice: string;
  ttsSpeed: number;
  profileVisibility: string;
  otherSettings: Record<string, any>;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class UserService {
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<{ user: User }> {
    return api.post('/users/register', data);
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<{ user: User }> {
    const result = await api.post<{ user: User }>('/users/login', data);
    
    // Store user in localStorage for session persistence
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    
    return result;
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  /**
   * Get user profile
   */
  async getUser(userId: string): Promise<{ user: User }> {
    return api.get(`/users/${userId}`);
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, data: Partial<User>): Promise<{ user: User }> {
    const result = await api.put<{ user: User }>(`/users/${userId}`, data);
    
    // Update localStorage
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...result.user }));
    }
    
    return result;
  }

  /**
   * Update user statistics
   */
  async updateStats(userId: string, stats: {
    totalLessonsCompleted?: number;
    totalStudyHours?: number;
    currentStreakDays?: number;
    maxStreakDays?: number;
    totalPoints?: number;
    level?: number;
  }): Promise<{ stats: any }> {
    const result = await api.put(`/users/${userId}/stats`, stats);
    
    // Update localStorage
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...result.stats }));
    }
    
    return result;
  }

  /**
   * Get user preferences
   */
  async getPreferences(userId: string): Promise<{ preferences: UserPreferences }> {
    return api.get(`/users/${userId}/preferences`);
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<{ preferences: UserPreferences }> {
    return api.put(`/users/${userId}/preferences`, preferences);
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('user');
  }
}

export const userService = new UserService();
export default userService;

