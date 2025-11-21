/**
 * Voice Lesson Example
 * Demonstrates how to use the new voice feature modules
 * This shows how much simpler voice lessons are now to implement
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Import the new voice feature
import { VoiceTeacherChat } from '@/features/voice';

export function VoiceLessonExample() {
  const [showVoiceLesson, setShowVoiceLesson] = React.useState(false);

  if (showVoiceLesson) {
    return (
      <VoiceTeacherChat
        lessonTitle="Биология"
        lessonTopic="Клетка"
        lessonAspects="Строение и функции клетки, основные органеллы"
        onComplete={() => {
          console.log('🎉 Voice lesson completed!');
          alert('Урок завершён! Проверьте историю разговора.');
        }}
        onClose={() => {
          console.log('👋 Voice lesson closed');
          setShowVoiceLesson(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              🎤 Голосовой урок: Новая архитектура
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Теперь голосовые уроки используют модульную архитектуру!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">🎯 Модульность</h3>
                  <p className="text-sm text-blue-700">
                    Код разделён на API, Model и UI слои. Легко тестировать и поддерживать.
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">🔄 Переиспользование</h3>
                  <p className="text-sm text-green-700">
                    Компоненты и хуки можно использовать в любых голосовых интерфейсах.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">⚡ Производительность</h3>
                  <p className="text-sm text-purple-700">
                    Оптимизированная архитектура с lazy loading и code splitting.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">📊 Результат рефакторинга</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">835 → 200</div>
                    <div className="text-sm opacity-90">строк кода (-75%)</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">9</div>
                    <div className="text-sm opacity-90">модулей вместо 1</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setShowVoiceLesson(true)}
                className="px-8 py-4 text-lg font-semibold"
              >
                🚀 Попробовать голосовой урок
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Урок будет включать:</p>
              <ul className="mt-2 space-y-1">
                <li>• Автоматическую генерацию заметок урока ИИ</li>
                <li>• Распознавание речи в браузере</li>
                <li>• OpenAI TTS для озвучки ответов учителя</li>
                <li>• Интерактивный диалог с GPT-5.1</li>
                <li>• Отслеживание прогресса и истории разговора</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default VoiceLessonExample;


