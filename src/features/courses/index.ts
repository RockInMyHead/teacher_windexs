/**
 * Courses Feature Public API
 * Exports all courses-related functionality
 * @module features/courses
 */

// Types
export * from './types';

// API
export * from './api/coursesApi';

// Data
export * from './data/courseRegistry';
export * from './data/legacyAdapter';

// Model
export * from './model/coursesModel';

// UI Components
export { CourseCard } from './ui/CourseCard';
export { CoursesList } from './ui/CoursesList';
export { LessonCard } from './ui/LessonCard';
