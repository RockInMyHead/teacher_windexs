/**
 * Learning Progress Service
 * Управление прогрессом обучения, темами и домашними заданиями
 */

import api from './api';

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

export interface UserCourseProgress {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  lastAccessedAt?: string;
  currentLessonNumber: number;
  completedLessons: number;
  progressPercentage: number;
  totalStudyTimeMinutes: number;
  averageScore: number;
  status: 'active' | 'completed' | 'paused' | 'dropped';
}

export interface CourseContext {
  courseTitle: string;
  courseDescription: string;
  grade: number;
  subject: string;
  currentLessonNumber: number;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  currentLessonTitle?: string;
  currentLessonTopic?: string;
  currentLessonObjectives?: string[];
  previousHomework?: {
    task: string;
    submitted: boolean;
    feedback?: string;
  };
  studyHistory?: {
    topicsCovered: string[];
    lastStudyDate: string;
    totalStudyTime: number;
  };
}

class LearningProgressService {
  /**
   * Записать пользователя на курс
   */
  async enrollInCourse(data: {
    userId: string;
    courseId: string;
  }): Promise<{ userCourse: UserCourseProgress }> {
    return api.post('/learning-progress/enroll', data);
  }

  /**
   * Получить прогресс пользователя по курсу
   */
  async getUserCourseProgress(
    userId: string,
    courseId: string
  ): Promise<{ userCourse: UserCourseProgress; lessons: LessonProgress[] }> {
    return api.get(`/learning-progress/users/${userId}/courses/${courseId}`);
  }

  /**
   * Начать урок
   */
  async startLesson(data: {
    userId: string;
    lessonId: string;
    userCourseId: string;
  }): Promise<{ lessonProgress: LessonProgress }> {
    return api.post('/learning-progress/lessons/start', data);
  }

  /**
   * Завершить урок
   */
  async completeLesson(data: {
    userId: string;
    lessonId: string;
    score?: number;
    timeSpentMinutes: number;
  }): Promise<{ lessonProgress: LessonProgress; userCourse: UserCourseProgress }> {
    return api.post('/learning-progress/lessons/complete', data);
  }

  /**
   * Отправить домашнее задание
   */
  async submitHomework(data: {
    userId: string;
    lessonId: string;
    homeworkContent: any;
  }): Promise<{ lessonProgress: LessonProgress }> {
    return api.post('/learning-progress/homework/submit', data);
  }

  /**
   * Получить домашние задания пользователя
   */
  async getUserHomeworks(
    userId: string,
    filters?: {
      courseId?: string;
      status?: 'pending' | 'submitted' | 'reviewed';
      limit?: number;
    }
  ): Promise<{ homeworks: LessonProgress[] }> {
    return api.get(`/learning-progress/users/${userId}/homeworks`, {
      params: filters as any,
    });
  }

  /**
   * Получить контекст курса для LLM
   * Это ключевой метод для передачи всей информации о курсе и прогрессе в LLM
   */
  async getCourseContextForLLM(
    userId: string,
    courseId: string
  ): Promise<{ context: CourseContext }> {
    return api.get(`/learning-progress/users/${userId}/courses/${courseId}/llm-context`);
  }

  /**
   * Обновить прогресс по теме
   */
  async updateTopicProgress(data: {
    userId: string;
    lessonId: string;
    topicName: string;
    completed: boolean;
  }): Promise<{ lessonProgress: LessonProgress }> {
    return api.post('/learning-progress/topics/update', data);
  }

  /**
   * Получить рекомендации для следующего урока
   */
  async getNextLessonRecommendation(
    userId: string,
    courseId: string
  ): Promise<{
    nextLesson: {
      id: string;
      title: string;
      topic: string;
      description: string;
      lessonNumber: number;
    };
    readinessScore: number;
    recommendations: string[];
  }> {
    return api.get(`/learning-progress/users/${userId}/courses/${courseId}/next-lesson`);
  }

  /**
   * Обновить время обучения
   */
  async updateStudyTime(data: {
    userId: string;
    courseId: string;
    minutesSpent: number;
  }): Promise<{ userCourse: UserCourseProgress }> {
    return api.post('/learning-progress/study-time/update', data);
  }

  /**
   * Получить статистику обучения
   */
  async getLearningStats(userId: string): Promise<{
    totalCoursesEnrolled: number;
    activeCourses: number;
    completedCourses: number;
    totalLessonsCompleted: number;
    totalStudyHours: number;
    averageScore: number;
    currentStreak: number;
    longestStreak: number;
  }> {
    return api.get(`/learning-progress/users/${userId}/stats`);
  }

  /**
   * Сохранить контекст урока в localStorage (для быстрого доступа)
   */
  saveLessonContext(context: CourseContext): void {
    localStorage.setItem('currentLessonContext', JSON.stringify(context));
  }

  /**
   * Получить контекст урока из localStorage
   */
  getLessonContext(): CourseContext | null {
    const data = localStorage.getItem('currentLessonContext');
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing lesson context:', error);
      return null;
    }
  }

  /**
   * Очистить контекст урока
   */
  clearLessonContext(): void {
    localStorage.removeItem('currentLessonContext');
  }
}

export const learningProgressService = new LearningProgressService();
export default learningProgressService;

