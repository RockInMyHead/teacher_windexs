/**
 * Learning Plan Service
 * Handles AI-generated learning plans and lesson progress
 */

import api from './api';

export interface LearningPlan {
  id: string;
  userId: string;
  courseId: string;
  planData: any;
  lessonsStructure: any[];
  generatedAt: string;
  lastUpdatedAt: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  userCourseId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'reviewed';
  startedAt?: string;
  completedAt?: string;
  score?: number;
  timeSpentMinutes: number;
  attemptsCount: number;
  homeworkSubmitted: boolean;
  homeworkSubmittedAt?: string;
  homeworkContent?: any;
  homeworkFeedback?: any;
  createdAt: string;
  updatedAt: string;
}

class LearningPlanService {
  /**
   * Create or update learning plan
   */
  async saveLearningPlan(data: {
    userId: string;
    courseId: string;
    planData: any;
    lessonsStructure: any[];
  }): Promise<{ learningPlan: LearningPlan }> {
    return api.post('/learning-plans', data);
  }

  /**
   * Get all learning plans for user
   */
  async getUserLearningPlans(userId: string): Promise<{ learningPlans: LearningPlan[] }> {
    return api.get(`/learning-plans/user/${userId}`);
  }

  /**
   * Get specific learning plan
   */
  async getLearningPlan(userId: string, courseId: string): Promise<{ learningPlan: LearningPlan }> {
    return api.get(`/learning-plans/${userId}/${courseId}`);
  }

  /**
   * Delete learning plan
   */
  async deleteLearningPlan(userId: string, courseId: string): Promise<{ message: string }> {
    return api.delete(`/learning-plans/${userId}/${courseId}`);
  }

  /**
   * Get lesson progress
   */
  async getLessonProgress(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<{ lessonProgress: LessonProgress }> {
    return api.get(`/learning-plans/${userId}/${courseId}/lessons/${lessonId}`);
  }

  /**
   * Create or update lesson progress
   */
  async saveLessonProgress(data: {
    userId: string;
    lessonId: string;
    userCourseId: string;
    status?: string;
    score?: number;
    timeSpentMinutes?: number;
    homeworkSubmitted?: boolean;
    homeworkContent?: any;
    homeworkFeedback?: any;
  }): Promise<{ lessonProgress: LessonProgress }> {
    return api.post('/learning-plans/lessons/progress', data);
  }

  /**
   * Get all lesson progress for user in a course
   */
  async getCourseLessonsProgress(
    userId: string,
    courseId: string
  ): Promise<{ lessonsProgress: LessonProgress[] }> {
    return api.get(`/learning-plans/user/${userId}/course/${courseId}/lessons`);
  }

  /**
   * Save learning plans to localStorage (for backward compatibility)
   */
  savePlansToLocalStorage(plans: Record<string, any>): void {
    localStorage.setItem('userLearningPlans', JSON.stringify(plans));
  }

  /**
   * Get learning plans from localStorage
   */
  getPlansFromLocalStorage(): Record<string, any> | null {
    const data = localStorage.getItem('userLearningPlans');
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing learning plans from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear learning plan data from localStorage
   */
  clearLocalStorage(): void {
    localStorage.removeItem('userLearningPlans');
  }

  /**
   * Save lesson session to localStorage (for backward compatibility)
   */
  saveLessonSessionToLocalStorage(courseId: string, sessionData: any): void {
    const key = `lesson_session_${courseId}`;
    localStorage.setItem(key, JSON.stringify(sessionData));
  }

  /**
   * Get lesson session from localStorage
   */
  getLessonSessionFromLocalStorage(courseId: string): any | null {
    const key = `lesson_session_${courseId}`;
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing lesson session from localStorage:', error);
      return null;
    }
  }
}

export const learningPlanService = new LearningPlanService();
export default learningPlanService;

