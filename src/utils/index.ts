/**
 * Centralized exports for utility functions and types
 */

// Adaptive Lesson Flow
export {
  LessonProgressTracker,
  generateRemedialsPrompt,
  insertRemedialsIntoLesson,
  generateRemedialsReport,
  type BlockPerformance,
  type LessonProgress,
  type FailedBlockEntry,
  type RemedialsAddedEntry,
  type LessonWithRemedials
} from './adaptiveLessonFlow';

// Lesson Context Manager
export {
  LessonContextManager,
  createLessonContext,
  updateLessonContextForBlock,
  generateLessonSystemPrompt,
  isQuestionRelevantToLesson,
  createContextualReminder,
  generateProgressUpdate,
  type LessonContext,
  type LessonBlock
} from './lessonContextManager';

// Course Plans
export {
  COURSE_PLANS,
  getCoursePlan,
  getLessonFromPlan,
  getAvailableGrades,
  type CoursePlan,
  type LessonPlan
} from './coursePlans';

// Other existing utilities can be exported here as needed

