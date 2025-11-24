/**
 * useChat Hook - Manage chat state and operations
 */

import { useState, useCallback, useRef } from 'react';
import type { Message, ChatCompletionRequest, UseChatReturn, AppError } from '@/types';
import { chatService } from '@/services/api/chatService';
import { handleApiError, getUserFriendlyErrorMessage } from '@/services/api/errorHandler';
import { logger } from '@/utils/logger';
import { learningProgressService } from '@/services';

/**
 * Функция пост-обработки текста для исправления распространенных ошибок
 */
function postProcessText(text: string): string {
  let processed = text;

  // Исправление распространенных ошибок
  const corrections = [
    // Слитные слова
    [/изменениелаголов/g, 'изменение глаголов'],
    [/спреннями/g, 'спряжениями'],
    [/спрение/g, 'спряжение'],
    [/голы/g, 'глаголы'],
    [/напр\./g, 'например'],
    [/кот\./g, 'которые'],
    [/т\.е\./g, 'то есть'],
    [/и\.т\.д\./g, 'и так далее'],

    // Неполные предложения
    [/спряж\.$/g, 'спряжения.'],

    // Ошибки в окончаниях
    [/спрениями/g, 'спряжениями'],
    [/спрении/g, 'спряжения'],

    // Пунктуация
    [/-ять -еть \(/g, '-ять, -еть ('],
    [/-ять -еть,/g, '-ять, -еть,'],
    [/-ить или -/g, '-ить или -еть ('],
  ];

  corrections.forEach(([pattern, replacement]) => {
    processed = processed.replace(pattern, replacement as string);
  });

  return processed;
}

/**
 * Convert file to base64 data URL
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  /**
   * Send message to AI with streaming
   */
  const sendMessage = useCallback(
    async (content: string, systemPrompt: string, model: string = 'gpt-4o', images?: File[]) => {
      try {
        setIsLoading(true);
        setError(null);

        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content,
          timestamp: new Date(),
          images: images || [],
        };

        setMessages(prev => {
          const updated = [...prev, userMessage];
          if (updated.length > maxMessages) {
            return updated.slice(-maxMessages);
          }
          return updated;
        });

        onMessageReceived?.(userMessage);

        // Create streaming assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        };

        setStreamingMessage(assistantMessage);

        // Prepare chat messages
        const chatMessages = messagesRef.current
          .slice(-29) // Keep last 29 messages + new one = 30 total
          .map(async (msg) => {
            if (msg.images && msg.images.length > 0) {
              // Convert images to base64 and create content array
              const imageUrls = await Promise.all(
                msg.images.map(file => fileToBase64(file))
              );

              const content = [
                { type: 'text' as const, text: msg.content }
              ];

              imageUrls.forEach(url => {
                content.push({
                  type: 'image_url' as const,
                  image_url: { url }
                });
              });

              return {
                role: msg.role,
                content,
              };
            }

            return {
              role: msg.role,
              content: msg.content,
            };
          });

        // Wait for all message conversions
        const resolvedChatMessages = await Promise.all(chatMessages);

        resolvedChatMessages.unshift({
          role: 'system',
          content: systemPrompt,
        });

        // Add current message with images
        if (images && images.length > 0) {
          const imageUrls = await Promise.all(
            images.map(file => fileToBase64(file))
          );

          const content = [
            { type: 'text' as const, text: content }
          ];

          imageUrls.forEach(url => {
            content.push({
              type: 'image_url' as const,
              image_url: { url }
            });
          });

          resolvedChatMessages.push({
            role: 'user',
            content,
          });
        } else {
          resolvedChatMessages.push({
            role: 'user',
            content,
          });
        }

        // Определяем тип чата и соответствующие настройки
        const lessonContext = learningProgressService.getLessonContext();
        const isLessonChat = !!lessonContext;

        console.log('🎓 Chat type determination:', {
          hasLessonContext: !!lessonContext,
          isLessonChat,
          lessonTitle: lessonContext?.currentLessonTitle
        });

        // Настройки для разных типов чата
        const chatSettings = isLessonChat ? {
          // Образовательный чат - более строгие настройки для качества
          temperature: 0.3,
          top_p: 0.8,
          presence_penalty: 0.2,
          frequency_penalty: 0.2,
          max_tokens: 2500
        } : {
          // Общий чат - более креативные настройки
          temperature: 0.7,
          top_p: 0.9,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
          max_tokens: 2000
        };

        // Get AI response with streaming
        const request: ChatCompletionRequest = {
          model,
          messages: resolvedChatMessages as any,
          max_completion_tokens: chatSettings.max_tokens,
          temperature: chatSettings.temperature,
          top_p: chatSettings.top_p,
          presence_penalty: chatSettings.presence_penalty,
          frequency_penalty: chatSettings.frequency_penalty,
        };

        console.log('🎛️ Using chat settings:', chatSettings);

        // Initialize streaming message
        console.log('🚀 Initializing streaming message');
        setStreamingMessage({
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        });

        await chatService.sendMessageStream(request, (chunk: string) => {
          console.log('📦 Received chunk:', chunk, `(length: ${chunk.length})`);
          setStreamingMessage(prev => {
            const newContent = (prev?.content || '') + chunk;
            console.log('📝 Updated streaming message, total length:', newContent.length);
            return {
              role: 'assistant',
              content: newContent,
              timestamp: prev?.timestamp || new Date(),
            };
          });
        });

        // Finalize streaming message
        setStreamingMessage(prev => {
          if (!prev) return null;

          // Применяем пост-обработку для исправления ошибок в образовательном контенте
          const processedContent = isLessonChat ? postProcessText(prev.content) : prev.content;
          const processedMessage = {
            ...prev,
            content: processedContent
          };

          console.log('✅ Finalizing streaming message with', processedContent.length, 'characters');
          console.log('📝 Original content:', prev.content);
          console.log('📝 Processed content:', processedContent);

          setMessages(currentMessages => {
            const updated = [...currentMessages, processedMessage];
          if (updated.length > maxMessages) {
            return updated.slice(-maxMessages);
          }
          return updated;
        });
          onMessageReceived?.(processedMessage);
          return null;
        });

        logger.debug('Message sent successfully');
      } catch (err) {
        const appError = handleApiError(err);
        setError(appError);
        setStreamingMessage(null);
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
    streamingMessage,
  };
};

// Re-export for convenience
export default useChat;

