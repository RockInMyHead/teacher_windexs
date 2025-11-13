/**
 * Store middleware
 * Provides logging, persistence, and DevTools integration
 */

import { logger } from '@/utils/logger';
import { STORAGE_KEYS } from '@/utils/constants';
import type { ChatStore, AssessmentStore } from './types';

/**
 * Persist chat store to localStorage
 */
export const persistChatState = (state: ChatStore): void => {
  try {
    const serialized = JSON.stringify({
      messages: state.messages,
      systemPrompt: state.systemPrompt,
    });
    localStorage.setItem(STORAGE_KEYS.CACHED_MESSAGES, serialized);
    logger.debug('Chat state persisted');
  } catch (error) {
    logger.error('Failed to persist chat state', error as Error);
  }
};

/**
 * Restore chat state from localStorage
 */
export const restoreChatState = (): Partial<ChatStore> | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.CACHED_MESSAGES);
    if (!serialized) return null;

    const restored = JSON.parse(serialized);
    logger.debug('Chat state restored', { messageCount: restored.messages?.length });
    return restored;
  } catch (error) {
    logger.error('Failed to restore chat state', error as Error);
    return null;
  }
};

/**
 * Persist assessment state to localStorage
 */
export const persistAssessmentState = (state: AssessmentStore): void => {
  try {
    const serialized = JSON.stringify({
      classGrade: state.classGrade,
      lastTopic: state.lastTopic,
      state: state.state,
    });
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_STATE, serialized);
    logger.debug('Assessment state persisted');
  } catch (error) {
    logger.error('Failed to persist assessment state', error as Error);
  }
};

/**
 * Restore assessment state from localStorage
 */
export const restoreAssessmentState = (): Partial<AssessmentStore> | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_STATE);
    if (!serialized) return null;

    const restored = JSON.parse(serialized);
    logger.debug('Assessment state restored');
    return restored;
  } catch (error) {
    logger.error('Failed to restore assessment state', error as Error);
    return null;
  }
};

/**
 * Clear all persisted state
 */
export const clearPersistedState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CACHED_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_STATE);
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
    logger.info('Persisted state cleared');
  } catch (error) {
    logger.error('Failed to clear persisted state', error as Error);
  }
};

/**
 * Export store state as JSON for debugging
 */
export const exportStoreState = (states: Record<string, any>): string => {
  try {
    return JSON.stringify(states, null, 2);
  } catch (error) {
    logger.error('Failed to export store state', error as Error);
    return '{}';
  }
};

/**
 * Log state changes for debugging
 */
export const logStateChange = (
  storeName: string,
  action: string,
  previousState: any,
  newState: any
): void => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`[${storeName}] ${action}`, {
      previous: previousState,
      new: newState,
    });
  }
};

/**
 * DevTools integration (for future Zustand migration)
 * Can be used with zustand/middleware when Zustand is installed
 */
export const initDevTools = (): void => {
  if (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    logger.info('Redux DevTools detected - ready for integration');
  }
};

export default {
  persistChatState,
  restoreChatState,
  persistAssessmentState,
  restoreAssessmentState,
  clearPersistedState,
  exportStoreState,
  logStateChange,
  initDevTools,
};

