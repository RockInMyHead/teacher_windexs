/**
 * Courses Feature Types
 * Type definitions for course data structures
 * @module features/courses/types
 */

/**
 * Lesson module - smallest unit of learning content
 */
export interface LessonModule {
  number: number;
  title: string;
  type: 'theory' | 'practice' | 'test' | 'conspectus';
  content: string;
  estimatedTime?: number; // в минутах
}

/**
 * Lesson plan - single lesson within a course
 */
export interface LessonPlan {
  number: number;
  title: string;
  topic: string;
  aspects: string;
  modules?: LessonModule[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

/**
 * Course plan - complete course for a specific grade
 */
export interface CoursePlan {
  grade: number;
  title: string;
  description: string;
  lessons: LessonPlan[];
  subject?: string; // Added for better organization
  metadata?: CourseMetadata;
}

/**
 * Course metadata for additional information
 */
export interface CourseMetadata {
  author?: string;
  lastUpdated?: Date;
  estimatedDuration?: number; // в часах
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

/**
 * Test question for assessments
 */
export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

/**
 * Course test questions organized by course and grade
 */
export interface CourseTestQuestions {
  [courseId: number]: {
    [grade: number]: TestQuestion[];
  };
}

/**
 * Course recommendation based on assessment
 */
export interface CourseRecommendation {
  courseId: number;
  grade: number;
  title: string;
  description: string;
  matchScore: number; // 0-100
  recommendedLessons: number[];
  reasoning: string;
}

/**
 * Subject categories
 */
export enum Subject {
  ENGLISH = 'english',
  MATHEMATICS = 'mathematics',
  RUSSIAN = 'russian',
  LITERATURE = 'literature',
  HISTORY = 'history',
  GEOGRAPHY = 'geography',
  PHYSICS = 'physics',
  CHEMISTRY = 'chemistry',
  BIOLOGY = 'biology',
  INFORMATICS = 'informatics',
  OTHER = 'other'
}

/**
 * Course filter options
 */
export interface CourseFilter {
  grade?: number;
  subject?: Subject | string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  searchQuery?: string;
}

/**
 * Course progress tracking
 */
export interface CourseProgress {
  courseId: number;
  grade: number;
  completedLessons: number[];
  currentLesson?: number;
  overallProgress: number; // 0-100
  startedAt: Date;
  lastAccessedAt: Date;
}

/**
 * Lesson completion result
 */
export interface LessonCompletionResult {
  lessonId: number;
  completedAt: Date;
  timeSpent: number; // в минутах
  score?: number; // 0-100
  notes?: string[];
}

