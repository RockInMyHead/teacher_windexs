/**
 * Data Migration Utility
 * Migrates data from localStorage to database
 */

import {
  userService,
  courseService,
  chatService,
  learningPlanService,
  examService,
} from '../services';

export interface MigrationResult {
  success: boolean;
  migratedItems: {
    user?: boolean;
    examCourses?: number;
    learningPlans?: number;
    chatSessions?: number;
  };
  errors: string[];
}

/**
 * Main migration function
 * Migrates all localStorage data to database
 */
export async function migrateLocalStorageToDatabase(userId: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    migratedItems: {},
    errors: [],
  };

  console.log('🔄 Starting migration from localStorage to database...');

  try {
    // 1. Migrate exam courses
    await migrateExamCourses(userId, result);

    // 2. Migrate learning plans
    await migrateLearningPlans(userId, result);

    // 3. Migrate chat messages (if any active session)
    await migrateChatMessages(userId, result);

    console.log('✅ Migration completed:', result);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
  }

  return result;
}

/**
 * Migrate exam courses
 */
async function migrateExamCourses(userId: string, result: MigrationResult): Promise<void> {
  try {
    const examCoursesStr = localStorage.getItem('examCourses');
    if (!examCoursesStr) {
      console.log('ℹ️ No exam courses to migrate');
      return;
    }

    const examCourses = JSON.parse(examCoursesStr);
    if (!Array.isArray(examCourses) || examCourses.length === 0) {
      console.log('ℹ️ No exam courses to migrate');
      return;
    }

    console.log(`📚 Migrating ${examCourses.length} exam courses...`);

    const coursesToMigrate = examCourses.map((course: any) => ({
      examType: course.examType,
      subject: course.subject,
      totalTopics: course.totalTopics || 50,
    }));

    await examService.addBulkExamCourses(userId, coursesToMigrate);

    result.migratedItems.examCourses = examCourses.length;
    console.log(`✅ Migrated ${examCourses.length} exam courses`);
  } catch (error) {
    console.error('Error migrating exam courses:', error);
    result.errors.push(`Exam courses: ${error}`);
  }
}

/**
 * Migrate learning plans
 */
async function migrateLearningPlans(userId: string, result: MigrationResult): Promise<void> {
  try {
    const plansStr = localStorage.getItem('userLearningPlans');
    if (!plansStr) {
      console.log('ℹ️ No learning plans to migrate');
      return;
    }

    const plans = JSON.parse(plansStr);
    if (!plans || typeof plans !== 'object') {
      console.log('ℹ️ No learning plans to migrate');
      return;
    }

    console.log(`📖 Migrating ${Object.keys(plans).length} learning plans...`);

    let migratedCount = 0;
    for (const [courseId, planData] of Object.entries(plans)) {
      try {
        await learningPlanService.saveLearningPlan({
          userId,
          courseId,
          planData: planData,
          lessonsStructure: (planData as any).lessons || [],
        });
        migratedCount++;
      } catch (error) {
        console.error(`Error migrating plan for course ${courseId}:`, error);
        result.errors.push(`Learning plan ${courseId}: ${error}`);
      }
    }

    result.migratedItems.learningPlans = migratedCount;
    console.log(`✅ Migrated ${migratedCount} learning plans`);
  } catch (error) {
    console.error('Error migrating learning plans:', error);
    result.errors.push(`Learning plans: ${error}`);
  }
}

/**
 * Migrate chat messages
 */
async function migrateChatMessages(userId: string, result: MigrationResult): Promise<void> {
  try {
    const messagesStr = localStorage.getItem('chatMessages');
    if (!messagesStr) {
      console.log('ℹ️ No chat messages to migrate');
      return;
    }

    const messages = JSON.parse(messagesStr);
    if (!Array.isArray(messages) || messages.length === 0) {
      console.log('ℹ️ No chat messages to migrate');
      return;
    }

    console.log(`💬 Migrating ${messages.length} chat messages...`);

    // Get current course context
    const courseDataStr = localStorage.getItem('currentCourse');
    const lessonContextStr = localStorage.getItem('currentLesson');

    let courseId: string | undefined;
    let lessonId: string | undefined;

    if (courseDataStr) {
      const courseData = JSON.parse(courseDataStr);
      courseId = courseData.id;
    }

    if (lessonContextStr) {
      const lessonContext = JSON.parse(lessonContextStr);
      lessonId = lessonContext.id;
    }

    // Create chat session
    const { session } = await chatService.createSession({
      userId,
      courseId,
      lessonId,
      sessionType: 'interactive',
      contextData: { migrated: true, migratedAt: new Date().toISOString() },
    });

    // Add messages to session
    await chatService.addBulkMessages(
      session.id,
      messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        ttsPlayed: msg.ttsPlayed || false,
        ttsAudioUrl: msg.ttsAudioUrl,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      }))
    );

    // Save session ID for future use
    chatService.setCurrentSessionId(session.id);

    result.migratedItems.chatSessions = 1;
    console.log(`✅ Migrated ${messages.length} messages to session ${session.id}`);
  } catch (error) {
    console.error('Error migrating chat messages:', error);
    result.errors.push(`Chat messages: ${error}`);
  }
}

/**
 * Clear localStorage after successful migration
 */
export function clearMigratedData(): void {
  console.log('🧹 Clearing migrated localStorage data...');
  
  const keysToRemove = [
    'examCourses',
    'userLearningPlans',
    'chatMessages',
    'chatHistory',
    'currentCourse',
    'currentLesson',
    'courseInfo',
    'lessonContext',
    'selectedCourseData',
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });

  // Mark migration as complete
  localStorage.setItem('migrationCompleted', 'true');
  localStorage.setItem('migrationDate', new Date().toISOString());

  console.log('✅ Migration cleanup complete');
}

/**
 * Check if migration is needed
 */
export function isMigrationNeeded(): boolean {
  // If migration already completed, skip
  if (localStorage.getItem('migrationCompleted') === 'true') {
    return false;
  }

  // Check if there's any data to migrate
  const hasExamCourses = !!localStorage.getItem('examCourses');
  const hasLearningPlans = !!localStorage.getItem('userLearningPlans');
  const hasChatMessages = !!localStorage.getItem('chatMessages');

  return hasExamCourses || hasLearningPlans || hasChatMessages;
}

/**
 * Auto-run migration if needed
 */
export async function autoMigrate(userId: string): Promise<void> {
  if (!isMigrationNeeded()) {
    console.log('ℹ️ No migration needed');
    return;
  }

  console.log('🚀 Auto-migration started...');

  const result = await migrateLocalStorageToDatabase(userId);

  if (result.success && result.errors.length === 0) {
    clearMigratedData();
    console.log('✅ Auto-migration successful');
  } else {
    console.warn('⚠️ Auto-migration completed with errors:', result.errors);
  }
}

