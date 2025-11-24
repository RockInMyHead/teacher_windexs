/**
 * ChatWithLLMContext
 * Обертка для чата с интеграцией контекста курса для LLM
 */

import React, { useEffect, useState } from 'react';
import { useLLMContext } from '@/hooks/useLLMContext';
import { ChatContainer } from '@/components/Chat';
import { Loader2 } from 'lucide-react';

interface ChatWithLLMContextProps {
  userId?: string;
  courseId?: string;
  isLessonMode?: boolean;
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string) => void;
}

export const ChatWithLLMContext: React.FC<ChatWithLLMContextProps> = ({
  userId,
  courseId,
  isLessonMode = false,
  onMessageSent,
  onResponseReceived
}) => {
  const { context, isLoading, error, generateSystemPrompt } = useLLMContext(userId, courseId);
  const [systemPrompt, setSystemPrompt] = useState<string>('');

  // Генерируем system prompt при загрузке контекста
  useEffect(() => {
    if (context) {
      const prompt = generateSystemPrompt();
      setSystemPrompt(prompt);
      console.log('✅ System prompt generated:', prompt.substring(0, 200) + '...');
    }
  }, [context, generateSystemPrompt]);

  // Показываем загрузку
  if (isLoading && !context) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Загрузка контекста курса...</p>
        </div>
      </div>
    );
  }

  // Показываем ошибку (но не блокируем чат)
  if (error && !context) {
    console.warn('⚠️ Failed to load LLM context:', error);
    // Продолжаем работу с базовым промптом
  }

  return (
    <ChatContainer
      initialSystemPrompt={systemPrompt || undefined}
      onSendMessage={(message) => {
        console.log('📤 User message:', message);
        onMessageSent?.(message);
      }}
      onReceiveMessage={(response) => {
        console.log('📥 Assistant response:', response);
        onResponseReceived?.(response);
      }}
    />
  );
};

export default ChatWithLLMContext;

