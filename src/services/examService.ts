/**
 * Exam Service
 * Handles ЕГЭ and ОГЭ exam courses
 */

import api from './api';

export interface ExamCourse {
  id: string;
  userId: string;
  examType: 'ЕГЭ' | 'ОГЭ';
  subject: string;
  progressPercentage: number;
  topicsCompleted: number;
  totalTopics: number;
  createdAt: string;
  lastStudiedAt?: string;
}

class ExamService {
  /**
   * Get user's exam courses
   */
  async getUserExamCourses(userId: string, examType?: string): Promise<{ examCourses: ExamCourse[] }> {
    return api.get(`/exams/user/${userId}`, {
      params: examType ? { examType } : undefined,
    });
  }

  /**
   * Add exam course
   */
  async addExamCourse(data: {
    userId: string;
    examType: string;
    subject: string;
    totalTopics?: number;
  }): Promise<{ examCourse: ExamCourse }> {
    return api.post('/exams', data);
  }

  /**
   * Add multiple exam courses
   */
  async addBulkExamCourses(
    userId: string,
    courses: Array<{
      examType: string;
      subject: string;
      totalTopics?: number;
    }>
  ): Promise<{ examCourses: ExamCourse[] }> {
    return api.post('/exams/bulk', { userId, examCourses: courses });
  }

  /**
   * Update exam course progress
   */
  async updateExamCourse(
    examCourseId: string,
    data: {
      progressPercentage?: number;
      topicsCompleted?: number;
      lastStudiedAt?: string;
    }
  ): Promise<{ examCourse: ExamCourse }> {
    return api.put(`/exams/${examCourseId}`, data);
  }

  /**
   * Delete exam course
   */
  async deleteExamCourse(examCourseId: string): Promise<{ message: string }> {
    return api.delete(`/exams/${examCourseId}`);
  }

  /**
   * Get specific exam course
   */
  async getExamCourse(
    userId: string,
    examType: string,
    subject: string
  ): Promise<{ examCourse: ExamCourse }> {
    return api.get(`/exams/${userId}/${examType}/${subject}`);
  }

  /**
   * Save exam courses to localStorage (for backward compatibility)
   */
  saveExamCoursesToLocalStorage(courses: ExamCourse[]): void {
    localStorage.setItem('examCourses', JSON.stringify(courses));
  }

  /**
   * Get exam courses from localStorage
   */
  getExamCoursesFromLocalStorage(): ExamCourse[] | null {
    const data = localStorage.getItem('examCourses');
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing exam courses from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear exam courses from localStorage
   */
  clearLocalStorage(): void {
    localStorage.removeItem('examCourses');
  }
}

export const examService = new ExamService();
export default examService;

