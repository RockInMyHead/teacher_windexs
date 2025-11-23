/**
 * Courses API Module
 * API functions for working with courses, lessons, and assessments
 * @module features/courses/api/coursesApi
 */

import type {
  CoursePlan,
  LessonPlan,
  TestQuestion,
  CourseFilter,
  CourseRecommendation
} from '../types';
import {
  getLegacyCoursePlans,
  getLegacyCourseByGrade,
  getLegacyTestQuestionsForCourse,
  searchLegacyCourses,
  getLegacyLesson,
  getLegacyAvailableGrades,
  getLegacyDataStats
} from '../data/legacyAdapter';

/**
 * Get all available courses
 * @param filter - Optional filter criteria
 * @returns Promise with array of courses
 */
export async function getAllCourses(filter?: CourseFilter): Promise<CoursePlan[]> {
  // Для начала используем legacy данные
  // В будущем это будет API call к бэкенду
  let courses = getLegacyCoursePlans();

  if (filter) {
    if (filter.grade) {
      courses = courses.filter(c => c.grade === filter.grade);
    }
    if (filter.subject) {
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(filter.subject!.toLowerCase())
      );
    }
    if (filter.difficulty) {
      courses = courses.filter(c => 
        c.lessons.some(l => l.difficulty === filter.difficulty)
      );
    }
    if (filter.searchQuery) {
      courses = searchLegacyCourses(filter.searchQuery);
    }
  }

  return Promise.resolve(courses);
}

/**
 * Get course by grade
 * @param grade - Grade number
 * @returns Promise with course or undefined
 */
export async function getCourseByGrade(grade: number): Promise<CoursePlan | undefined> {
  return Promise.resolve(getLegacyCourseByGrade(grade));
}

/**
 * Get lesson by grade and lesson number
 * @param grade - Grade number
 * @param lessonNumber - Lesson number
 * @returns Promise with lesson or undefined
 */
export async function getLesson(
  grade: number,
  lessonNumber: number
): Promise<LessonPlan | undefined> {
  return Promise.resolve(getLegacyLesson(grade, lessonNumber));
}

/**
 * Get test questions for a course
 * @param courseId - Course ID
 * @param grade - Grade number
 * @returns Promise with array of test questions
 */
export async function getTestQuestions(
  courseId: number,
  grade: number
): Promise<TestQuestion[]> {
  return Promise.resolve(getLegacyTestQuestionsForCourse(courseId, grade));
}

/**
 * Search courses by query
 * @param query - Search query string
 * @returns Promise with matching courses
 */
export async function searchCourses(query: string): Promise<CoursePlan[]> {
  return Promise.resolve(searchLegacyCourses(query));
}

/**
 * Get available grades
 * @returns Promise with array of grade numbers
 */
export async function getAvailableGrades(): Promise<number[]> {
  return Promise.resolve(getLegacyAvailableGrades());
}

/**
 * Get course statistics
 * @returns Promise with course stats
 */
export async function getCourseStats() {
  return Promise.resolve(getLegacyDataStats());
}

/**
 * Get recommended courses based on assessment results
 * @param assessmentResults - Student assessment results
 * @returns Promise with course recommendations
 */
export async function getRecommendedCourses(
  assessmentResults: {
    grade: number;
    subject: string;
    score: number;
    weakAreas?: string[];
  }
): Promise<CourseRecommendation[]> {
  // Простая логика рекомендаций
  const courses = await getAllCourses({
    grade: assessmentResults.grade,
    subject: assessmentResults.subject
  });

  const recommendations: CourseRecommendation[] = courses.map((course, index) => {
    // Базовый scoring на основе результатов теста
    let matchScore = 70;
    
    if (assessmentResults.score < 50) {
      // Низкий балл - рекомендуем базовый уровень
      matchScore += course.lessons.filter(l => l.difficulty === 'beginner').length * 2;
    } else if (assessmentResults.score > 80) {
      // Высокий балл - рекомендуем продвинутый уровень
      matchScore += course.lessons.filter(l => l.difficulty === 'advanced').length * 2;
    }

    // Рекомендуем первые несколько уроков для начала
    const recommendedLessons = course.lessons
      .slice(0, Math.min(5, course.lessons.length))
      .map(l => l.number);

    return {
      courseId: index + 1,
      grade: course.grade,
      title: course.title,
      description: course.description,
      matchScore,
      recommendedLessons,
      reasoning: `На основе вашего результата (${assessmentResults.score}%) рекомендуем этот курс.`
    };
  });

  // Сортируем по matchScore
  return Promise.resolve(
    recommendations.sort((a, b) => b.matchScore - a.matchScore)
  );
}

/**
 * Get lessons by difficulty
 * @param grade - Grade number
 * @param difficulty - Difficulty level
 * @returns Promise with filtered lessons
 */
export async function getLessonsByDifficulty(
  grade: number,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Promise<LessonPlan[]> {
  const course = await getCourseByGrade(grade);
  if (!course) return [];

  return course.lessons.filter(lesson => lesson.difficulty === difficulty);
}

/**
 * Get lesson prerequisites
 * @param grade - Grade number
 * @param lessonNumber - Lesson number
 * @returns Promise with array of prerequisite lesson numbers
 */
export async function getLessonPrerequisites(
  grade: number,
  lessonNumber: number
): Promise<number[]> {
  const lesson = await getLesson(grade, lessonNumber);
  
  if (!lesson || !lesson.prerequisites) {
    return [];
  }

  // Извлекаем номера уроков из prerequisites (если они указаны как "Lesson 1", "Урок 2" и т.д.)
  const numbers: number[] = [];
  lesson.prerequisites.forEach(prereq => {
    const match = prereq.match(/\d+/);
    if (match) {
      numbers.push(parseInt(match[0]));
    }
  });

  return numbers;
}

/**
 * Validate lesson completion order
 * @param grade - Grade number
 * @param lessonNumber - Lesson number to validate
 * @param completedLessons - Array of completed lesson numbers
 * @returns Promise with boolean indicating if lesson can be started
 */
export async function validateLessonAccess(
  grade: number,
  lessonNumber: number,
  completedLessons: number[]
): Promise<boolean> {
  const prerequisites = await getLessonPrerequisites(grade, lessonNumber);
  
  if (prerequisites.length === 0) {
    return true; // No prerequisites, can start anytime
  }

  // Check if all prerequisites are completed
  return prerequisites.every(prereqNum => completedLessons.includes(prereqNum));
}





