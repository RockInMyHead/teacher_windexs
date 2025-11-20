/**
 * Legacy Adapter
 * Адаптер для работы со старыми данными из coursePlans.ts
 * Позволяет постепенно мигрировать данные без поломки функциональности
 * @module features/courses/data/legacyAdapter
 */

import type { CoursePlan, TestQuestion, CourseTestQuestions } from '../types';

// Импортируем старые данные (временно, пока идёт миграция)
import {
  COURSE_PLANS as LEGACY_COURSE_PLANS,
  COURSE_TEST_QUESTIONS as LEGACY_TEST_QUESTIONS
} from '@/utils/coursePlans';

/**
 * Get all courses from legacy data
 * @deprecated Use coursesApi.getAllCourses() instead
 */
export function getLegacyCoursePlans(): CoursePlan[] {
  return LEGACY_COURSE_PLANS as CoursePlan[];
}

/**
 * Get course by grade from legacy data
 * @deprecated Use coursesApi.getCourseByGrade() instead
 */
export function getLegacyCourseByGrade(grade: number): CoursePlan | undefined {
  const plans = LEGACY_COURSE_PLANS as CoursePlan[];
  return plans.find(plan => plan.grade === grade);
}

/**
 * Get all test questions from legacy data
 * @deprecated Use coursesApi.getTestQuestions() instead
 */
export function getLegacyTestQuestions(): CourseTestQuestions {
  return LEGACY_TEST_QUESTIONS as CourseTestQuestions;
}

/**
 * Get test questions for specific course and grade
 * @deprecated Use coursesApi.getTestQuestionsForCourse() instead
 */
export function getLegacyTestQuestionsForCourse(
  courseId: number,
  grade: number
): TestQuestion[] {
  const questions = LEGACY_TEST_QUESTIONS as CourseTestQuestions;
  return questions[courseId]?.[grade] || [];
}

/**
 * Count total courses in legacy data
 */
export function countLegacyCourses(): number {
  return (LEGACY_COURSE_PLANS as CoursePlan[]).length;
}

/**
 * Count total lessons across all courses
 */
export function countLegacyLessons(): number {
  return (LEGACY_COURSE_PLANS as CoursePlan[]).reduce(
    (total, course) => total + course.lessons.length,
    0
  );
}

/**
 * Get available grades from legacy data
 */
export function getLegacyAvailableGrades(): number[] {
  const grades = new Set<number>();
  (LEGACY_COURSE_PLANS as CoursePlan[]).forEach(course => {
    grades.add(course.grade);
  });
  return Array.from(grades).sort((a, b) => a - b);
}

/**
 * Search courses by title
 */
export function searchLegacyCourses(query: string): CoursePlan[] {
  const lowerQuery = query.toLowerCase();
  return (LEGACY_COURSE_PLANS as CoursePlan[]).filter(course =>
    course.title.toLowerCase().includes(lowerQuery) ||
    course.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get lesson by number from course
 */
export function getLegacyLesson(
  grade: number,
  lessonNumber: number
): CoursePlan['lessons'][0] | undefined {
  const course = getLegacyCourseByGrade(grade);
  return course?.lessons.find(lesson => lesson.number === lessonNumber);
}

/**
 * Migration helper: Extract unique subjects from legacy data
 */
export function extractLegacySubjects(): string[] {
  const subjects = new Set<string>();
  (LEGACY_COURSE_PLANS as CoursePlan[]).forEach(course => {
    // Extract subject from title (e.g., "Английский язык для 1 класса" -> "Английский язык")
    const match = course.title.match(/^(.+?)(?:\s+для\s+|\s+\d+)/);
    if (match) {
      subjects.add(match[1].trim());
    }
  });
  return Array.from(subjects);
}

/**
 * Migration helper: Group courses by subject
 */
export function groupLegacyCoursesBySubject(): Record<string, CoursePlan[]> {
  const grouped: Record<string, CoursePlan[]> = {};
  const subjects = extractLegacySubjects();

  subjects.forEach(subject => {
    grouped[subject] = (LEGACY_COURSE_PLANS as CoursePlan[]).filter(course =>
      course.title.startsWith(subject)
    );
  });

  return grouped;
}

/**
 * Migration statistics
 */
export interface LegacyDataStats {
  totalCourses: number;
  totalLessons: number;
  availableGrades: number[];
  subjects: string[];
  testQuestionsCount: number;
}

/**
 * Get legacy data statistics
 */
export function getLegacyDataStats(): LegacyDataStats {
  const courses = LEGACY_COURSE_PLANS as CoursePlan[];
  const testQuestions = LEGACY_TEST_QUESTIONS as CourseTestQuestions;

  let testQuestionsCount = 0;
  Object.keys(testQuestions).forEach(courseId => {
    Object.keys(testQuestions[Number(courseId)]).forEach(grade => {
      testQuestionsCount += testQuestions[Number(courseId)][Number(grade)].length;
    });
  });

  return {
    totalCourses: countLegacyCourses(),
    totalLessons: countLegacyLessons(),
    availableGrades: getLegacyAvailableGrades(),
    subjects: extractLegacySubjects(),
    testQuestionsCount
  };
}

