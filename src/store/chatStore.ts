/**
 * Chat Store - Zustand-like API with Context
 * Professional state management for chat messages
 */

import type { Message } from '@/types';
import type { ChatStore } from './types';
import { logger } from '@/utils/logger';

/**
 * Simple but powerful store implementation (Zustand-like pattern)
 * Can be replaced with real Zustand when installed: `npm install zustand`
 */

type ChatStoreListener = (state: ChatStore) => void;

class ChatStoreImpl implements ChatStore {
  private listeners: Set<ChatStoreListener> = new Set();

  // State
  messages: Message[] = [];
  isLoading = false;
  error: Error | null = null;
  systemPrompt = '';

  /**
   * Subscribe to store changes
   */
  subscribe(listener: ChatStoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  /**
   * Get current state
   */
  getState(): ChatStore {
    return {
      messages: this.messages,
      isLoading: this.isLoading,
      error: this.error,
      systemPrompt: this.systemPrompt,
      addMessage: this.addMessage.bind(this),
      updateMessage: this.updateMessage.bind(this),
      removeMessage: this.removeMessage.bind(this),
      clearMessages: this.clearMessages.bind(this),
      setIsLoading: this.setIsLoading.bind(this),
      setError: this.setError.bind(this),
      setSystemPrompt: this.setSystemPrompt.bind(this),
      getLastMessage: this.getLastMessage.bind(this),
      getContext: this.getContext.bind(this),
      getTotalTokens: this.getTotalTokens.bind(this),
    };
  }

  // ============= ACTIONS =============

  /**
   * Add message to store
   */
  addMessage(message: Message): void {
    try {
      logger.debug('Adding message', { id: message.id, role: message.role });
      this.messages = [...this.messages, message];
      this.error = null;
      this.notifyListeners();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add message');
      this.setError(error);
    }
  }

  /**
   * Update message by id
   */
  updateMessage(id: string, updates: Partial<Message>): void {
    try {
      logger.debug('Updating message', { id });
      this.messages = this.messages.map(msg =>
        msg.id === id ? { ...msg, ...updates } : msg
      );
      this.error = null;
      this.notifyListeners();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update message');
      this.setError(error);
    }
  }

  /**
   * Remove message by id
   */
  removeMessage(id: string): void {
    try {
      logger.debug('Removing message', { id });
      this.messages = this.messages.filter(msg => msg.id !== id);
      this.error = null;
      this.notifyListeners();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove message');
      this.setError(error);
    }
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    try {
      logger.debug('Clearing all messages');
      this.messages = [];
      this.error = null;
      this.notifyListeners();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to clear messages');
      this.setError(error);
    }
  }

  /**
   * Set loading state
   */
  setIsLoading(loading: boolean): void {
    if (this.isLoading === loading) return;
    logger.debug('Setting loading state', { loading });
    this.isLoading = loading;
    this.notifyListeners();
  }

  /**
   * Set error state
   */
  setError(error: Error | null): void {
    if (error) {
      logger.error('Chat store error', error);
    }
    this.error = error;
    this.notifyListeners();
  }

  /**
   * Set system prompt
   */
  setSystemPrompt(prompt: string): void {
    logger.debug('Setting system prompt', { length: prompt.length });
    this.systemPrompt = prompt;
    this.error = null;
    this.notifyListeners();
  }

  // ============= COMPUTED =============

  /**
   * Get last message
   */
  getLastMessage(): Message | null {
    return this.messages[this.messages.length - 1] || null;
  }

  /**
   * Get context (last N messages)
   */
  getContext(limit: number = 10): Message[] {
    return this.messages.slice(-limit);
  }

  /**
   * Estimate total tokens (rough calculation)
   */
  getTotalTokens(): number {
    return this.messages.reduce((total, msg) => {
      // Rough estimate: 1 token ~ 4 characters
      return total + Math.ceil(msg.content.length / 4);
    }, 0);
  }
}

// Create singleton instance
export const chatStore = new ChatStoreImpl();

/**
 * Hook-like function for React components
 */
export const useChatStore = (): ChatStore => chatStore.getState();

/**
 * Subscribe to store changes (for class components or custom logic)
 */
export const subscribeToChatStore = (listener: ChatStoreListener): (() => void) => {
  return chatStore.subscribe(listener);
};

export default chatStore;

