/**
 * Lesson Renderer
 * Renders 15-block structured lessons in the UI
 */

import React from 'react';
import { LessonBlock, CompleteLesson } from './lessonStructure';

export const renderLessonBlock = (block: LessonBlock, courseLanguage?: string): React.ReactNode => {
  return (
    <div key={block.id} className="mb-6 p-4 bg-card rounded-lg border border-border">
      {/* Заголовок блока */}
      <div className="mb-3 pb-2 border-b border-border">
        <h3 className="text-lg font-semibold">
          {getBlockIcon(block.type)} Блок {block.id}: {block.title}
        </h3>
        <div className="text-sm text-muted-foreground mt-1">
          {getDifficultyBadge(block.difficulty)}
        </div>
      </div>

      {/* Основной контент */}
      <div className="mb-4 whitespace-pre-wrap text-sm">
        {block.content}
      </div>

      {/* Инструкции */}
      {block.instructions && (
        <div className="mb-4 p-2 bg-primary/5 rounded border border-primary/10">
          <p className="text-sm font-medium">📝 Инструкция:</p>
          <p className="text-sm mt-1">{block.instructions}</p>
        </div>
      )}

      {/* Практические вопросы */}
      {block.questions && block.questions.length > 0 && (
        <div className="mb-4 space-y-3">
          <p className="font-medium text-sm">✍️ Вопросы:</p>
          {block.questions.map((question, idx) => (
            <div key={question.id} className="p-3 bg-muted/50 rounded">
              <p className="font-medium text-sm mb-2">
                {idx + 1}. {question.question}
              </p>
              <div className="space-y-1 ml-2">
                {question.options.map((option, optIdx) => (
                  <label key={optIdx} className="flex items-center text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      className="mr-2"
                      defaultChecked={optIdx === question.correctAnswer}
                    />
                    <span>{String.fromCharCode(65 + optIdx)}) {option}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                💡 {question.explanation}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Произношение */}
      {block.pronunciationWords && block.pronunciationWords.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="font-medium text-sm">🎤 Произношение:</p>
          <div className="space-y-2">
            {block.pronunciationWords.map((word, idx) => (
              <div key={idx} className="p-2 bg-blue-50 dark:bg-blue-950 rounded border border-blue-100 dark:border-blue-900">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{word.word}</p>
                    <p className="text-xs text-muted-foreground">{word.translation}</p>
                  </div>
                  <button
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => speakPronunciation(word.word, courseLanguage)}
                  >
                    🔊 Слушать
                  </button>
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                  <p className="text-xs">
                    <strong>Пример:</strong> <em>{word.example}</em>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {word.exampleTranslation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const renderCompleteLesson = (lesson: CompleteLesson): React.ReactNode => {
  return (
    <div className="space-y-2">
      {/* Заголовок урока */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
        <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>📚 <span className="font-medium">Тема:</span> {lesson.topic}</div>
          <div>📈 <span className="font-medium">Уровень:</span> {lesson.level}</div>
          <div>🌐 <span className="font-medium">Язык:</span> {lesson.language}</div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Всего блоков: {lesson.blocks.length} | 
          Ожидаемое время: ~{Math.round(lesson.blocks.length * 5)} минут
        </p>
      </div>

      {/* Блоки урока */}
      <div className="space-y-4">
        {lesson.blocks.map((block) => (
          <React.Fragment key={block.id}>
            {renderLessonBlock(block, lesson.language)}
          </React.Fragment>
        ))}
      </div>

      {/* Заключение */}
      <div className="mt-8 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
        <p className="text-sm font-medium">✅ Урок завершен!</p>
        <p className="text-xs text-muted-foreground mt-1">
          Вы прошли все 15 блоков урока. Поздравляем!
        </p>
      </div>
    </div>
  );
};

// Вспомогательные функции
function getBlockIcon(type: string): string {
  const icons: Record<string, string> = {
    theory: '📖',
    practice: '✍️',
    pronunciation: '🎤',
    exercise: '🏋️',
    interactive: '🎯',
    summary: '📋'
  };
  return icons[type] || '📌';
}

function getDifficultyBadge(difficulty: string): React.ReactNode {
  const badges: Record<string, { color: string; label: string }> = {
    beginner: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', label: 'Начинающий' },
    intermediate: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', label: 'Средний' },
    advanced: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', label: 'Продвинутый' }
  };
  const badge = badges[difficulty] || badges.beginner;
  return (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${badge.color}`}>
      {badge.label}
    </span>
  );
}

// Функция для воспроизведения произношения
export async function speakPronunciation(text: string, language?: string): Promise<void> {
  try {
    // Используем Web Speech API
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Устанавливаем язык
    if (language) {
      const langMap: Record<string, string> = {
        'английский': 'en-US',
        'english': 'en-US',
        'русский': 'ru-RU',
        'russian': 'ru-RU',
        'китайский': 'zh-CN',
        'chinese': 'zh-CN',
        'арабский': 'ar-SA',
        'arabic': 'ar-SA'
      };
      utterance.lang = langMap[language.toLowerCase()] || 'en-US';
    }

    utterance.rate = 0.9; // Немного медленнее для четкости
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Ошибка при воспроизведении:', error);
  }
}

