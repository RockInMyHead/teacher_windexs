/**
 * useChat Hook - Manage chat state and operations
 */

import { useState, useCallback, useRef } from 'react';
import type { Message, ChatCompletionRequest, UseChatReturn, AppError } from '@/types';
import { chatService } from '@/services/api';
import { handleApiError, getUserFriendlyErrorMessage } from '@/services/api/errorHandler';
import { logger } from '@/utils/logger';

interface UseChatOptions {
  onMessageReceived?: (message: Message) => void;
  onError?: (error: AppError) => void;
  maxMessages?: number;
}

export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
  const {
    onMessageReceived,
    onError,
    maxMessages = 100,
  } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  /**
   * Send message to AI
   */
  const sendMessage = useCallback(
    async (content: string, systemPrompt: string, model: string = 'gpt-4o-mini') => {
      try {
        setIsLoading(true);
        setError(null);

        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content,
          timestamp: new Date(),
        };

        setMessages(prev => {
          const updated = [...prev, userMessage];
          if (updated.length > maxMessages) {
            return updated.slice(-maxMessages);
          }
          return updated;
        });

        onMessageReceived?.(userMessage);

        // Prepare chat messages
        const chatMessages = messagesRef.current
          .slice(-29) // Keep last 29 messages + new one = 30 total
          .map(msg => ({
            role: msg.role,
            content: msg.content,
          }));

        chatMessages.unshift({
          role: 'system',
          content: systemPrompt,
        });

        chatMessages.push({
          role: 'user',
          content,
        });

        // Get AI response
        const request: ChatCompletionRequest = {
          model,
          messages: chatMessages as any,
          max_tokens: 2000,
          temperature: 0.7,
        };

        const response = await chatService.sendMessage(request);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.choices[0]?.message?.content || 'No response',
          timestamp: new Date(),
        };

        setMessages(prev => {
          const updated = [...prev, assistantMessage];
          if (updated.length > maxMessages) {
            return updated.slice(-maxMessages);
          }
          return updated;
        });

        onMessageReceived?.(assistantMessage);

        logger.debug('Message sent successfully');
      } catch (err) {
        const appError = handleApiError(err);
        setError(appError);
        onError?.(appError);
        logger.error('Failed to send message', err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [onMessageReceived, onError, maxMessages]
  );

  /**
   * Add message directly
   */
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const updated = [...prev, message];
      if (updated.length > maxMessages) {
        return updated.slice(-maxMessages);
      }
      return updated;
    });
    onMessageReceived?.(message);
  }, [onMessageReceived, maxMessages]);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    logger.debug('Messages cleared');
  }, []);

  /**
   * Update message
   */
  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  }, []);

  /**
   * Get last message
   */
  const getLastMessage = useCallback((): Message | null => {
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }, [messages]);

  /**
   * Get conversation context
   */
  const getContext = useCallback((limit: number = 10): Message[] => {
    return messages.slice(-limit);
  }, [messages]);

  return {
    messages,
    isLoading,
    sendMessage,
    addMessage,
    clearMessages,
    updateMessage,
    getLastMessage,
    getContext,
    error,
  };
};

// Re-export for convenience
export default useChat;

