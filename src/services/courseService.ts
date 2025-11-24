/**
 * Course Service
 * Handles course catalog, lessons, and enrollment
 */

import api from './api';

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade?: number;
  examType?: string;
  difficultyLevel: string;
  totalLessons: number;
  estimatedHours: number;
  imageUrl?: string;
  iconName?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  lessonNumber: number;
  title: string;
  topic: string;
  description: string;
  content: string;
  learningObjectives?: any[];
  keyConcepts?: any[];
  practiceExercises?: any[];
  homework?: any;
  createdAt: string;
  updatedAt: string;
}

export interface UserCourse {
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

class CourseService {
  /**
   * Get all courses
   */
  async getCourses(filters?: {
    grade?: number;
    examType?: string;
    subject?: string;
  }): Promise<{ courses: Course[] }> {
    return api.get('/courses', { params: filters as any });
  }

  /**
   * Get course details with lessons
   */
  async getCourse(courseId: string): Promise<{ course: Course & { lessons: Lesson[] } }> {
    return api.get(`/courses/${courseId}`);
  }

  /**
   * Get lessons for a course
   */
  async getLessons(courseId: string): Promise<{ lessons: Lesson[] }> {
    return api.get(`/courses/${courseId}/lessons`);
  }

  /**
   * Get specific lesson
   */
  async getLesson(courseId: string, lessonNumber: number): Promise<{ lesson: Lesson }> {
    return api.get(`/courses/${courseId}/lessons/${lessonNumber}`);
  }

  /**
   * Get user's enrolled courses
   */
  async getUserCourses(userId: string, status?: string): Promise<{ courses: any[] }> {
    return api.get(`/courses/user/${userId}`, {
      params: status ? { status } : undefined,
    });
  }

  /**
   * Enroll user in course
   */
  async enrollCourse(courseId: string, userId: string): Promise<{ enrollment: UserCourse }> {
    return api.post(`/courses/${courseId}/enroll`, { userId });
  }

  /**
   * Update course progress
   */
  async updateProgress(
    courseId: string,
    userId: string,
    progress: {
      currentLessonNumber?: number;
      completedLessons?: number;
      progressPercentage?: number;
      totalStudyTimeMinutes?: number;
      averageScore?: number;
    }
  ): Promise<{ progress: UserCourse }> {
    return api.put(`/courses/${courseId}/progress`, {
      userId,
      ...progress,
    });
  }

  /**
   * Save course data to localStorage (for backward compatibility during migration)
   */
  saveCourseToLocalStorage(courseData: any): void {
    localStorage.setItem('selectedCourseData', JSON.stringify(courseData));
  }

  /**
   * Get course data from localStorage (for backward compatibility)
   */
  getCourseFromLocalStorage(): any | null {
    const data = localStorage.getItem('selectedCourseData');
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing course from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear course data from localStorage
   */
  clearLocalStorage(): void {
    localStorage.removeItem('selectedCourseData');
    localStorage.removeItem('currentCourse');
    localStorage.removeItem('currentLesson');
    localStorage.removeItem('courseInfo');
  }
}

export const courseService = new CourseService();
export default courseService;

