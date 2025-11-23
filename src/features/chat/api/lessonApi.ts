/**
 * Lesson API Module
 * Handles all API calls related to lesson sessions and generated lessons
 * @module features/chat/api/lessonApi
 */

interface LessonSession {
  id: number;
  lessonId: string;
  studentId: string;
  startTime: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
}

interface GeneratedLesson {
  id: number;
  title: string;
  topic: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a new lesson session
 * @param lessonData - Lesson information
 * @returns Promise with the created session
 */
export async function createLessonSession(lessonData: {
  lessonId: string;
  studentId: string;
  lessonTitle: string;
  lessonTopic: string;
}): Promise<LessonSession> {
  const response = await fetch('/api/lesson-sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lessonData)
  });

  if (!response.ok) {
    throw new Error(`Failed to create lesson session: ${response.status}`);
  }

  return response.json();
}

/**
 * Update lesson session progress
 * @param sessionId - Session ID
 * @param progress - Progress data
 */
export async function updateLessonProgress(
  sessionId: number,
  progress: {
    currentStep?: number;
    completedSections?: string[];
    notes?: string[];
  }
): Promise<void> {
  const response = await fetch(`/api/lesson-sessions/${sessionId}/progress`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progress)
  });

  if (!response.ok) {
    throw new Error(`Failed to update lesson progress: ${response.status}`);
  }
}

/**
 * Complete a lesson session
 * @param sessionId - Session ID
 * @param finalData - Final lesson data (notes, results, etc.)
 */
export async function completeLessonSession(
  sessionId: number,
  finalData: {
    notes?: string[];
    transcript?: string;
    completionStatus: 'completed' | 'interrupted';
  }
): Promise<void> {
  const response = await fetch(`/api/lesson-sessions/${sessionId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(finalData)
  });

  if (!response.ok) {
    throw new Error(`Failed to complete lesson session: ${response.status}`);
  }
}

/**
 * Get list of generated lessons
 * @param limit - Maximum number of lessons to retrieve
 * @returns Promise with array of generated lessons
 */
export async function getGeneratedLessons(limit: number = 20): Promise<GeneratedLesson[]> {
  const response = await fetch(`/api/generated-lessons?limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch generated lessons: ${response.status}`);
  }

  return response.json();
}

/**
 * Save a generated lesson
 * @param lessonData - Lesson data to save
 * @returns Promise with the saved lesson
 */
export async function saveGeneratedLesson(lessonData: {
  title: string;
  topic: string;
  content: any;
  metadata?: Record<string, any>;
}): Promise<GeneratedLesson> {
  const response = await fetch('/api/generated-lessons', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lessonData)
  });

  if (!response.ok) {
    throw new Error(`Failed to save generated lesson: ${response.status}`);
  }

  return response.json();
}

/**
 * Update an existing generated lesson
 * @param lessonId - Lesson ID
 * @param updates - Partial lesson data to update
 * @returns Promise with the updated lesson
 */
export async function updateGeneratedLesson(
  lessonId: number,
  updates: Partial<{
    title: string;
    topic: string;
    content: any;
    metadata: Record<string, any>;
  }>
): Promise<GeneratedLesson> {
  const response = await fetch(`/api/generated-lessons/${lessonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error(`Failed to update generated lesson: ${response.status}`);
  }

  return response.json();
}

/**
 * Get a specific generated lesson by ID
 * @param lessonId - Lesson ID
 * @returns Promise with the lesson data
 */
export async function getGeneratedLesson(lessonId: number): Promise<GeneratedLesson> {
  const response = await fetch(`/api/generated-lessons/${lessonId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch generated lesson: ${response.status}`);
  }

  return response.json();
}

/**
 * Delete a generated lesson
 * @param lessonId - Lesson ID
 */
export async function deleteGeneratedLesson(lessonId: number): Promise<void> {
  const response = await fetch(`/api/generated-lessons/${lessonId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete generated lesson: ${response.status}`);
  }
}





