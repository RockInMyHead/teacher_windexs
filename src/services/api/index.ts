/**
 * API Services - Barrel export
 */

export { chatService, ChatService } from './chatService';
export { handleApiError, isRetryableError, retryWithBackoff, getUserFriendlyErrorMessage, logError } from './errorHandler';

// Export types
export type { AppError } from '@/types';

