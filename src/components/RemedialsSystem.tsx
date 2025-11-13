/**
 * Remedials System Component
 * Displays failed blocks and tracks remedial performance
 */

import React, { useState } from 'react';
import { LessonProgressTracker, BlockPerformance, FailedBlockEntry } from '../utils/adaptiveLessonFlow';
import { AlertCircle, CheckCircle2, RotateCcw, TrendingUp } from 'lucide-react';

interface RemedialsSystemProps {
  tracker: LessonProgressTracker;
  onRemedialsGenerated?: (remedialsCount: number) => void;
}

export const RemedialsSystemComponent: React.FC<RemedialsSystemProps> = ({
  tracker,
  onRemedialsGenerated
}) => {
  const [showStats, setShowStats] = useState(true);
  const stats = tracker.getStatistics();
  const failedBlocks = tracker.getFailedBlocks();

  return (
    <div className="w-full space-y-4">
      {/* Статистика прогресса */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-xs text-muted-foreground">Всего вопросов</div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalAnswers}</div>
        </div>

        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-xs text-muted-foreground">Правильно</div>
          <div className="text-2xl font-bold text-green-600">{stats.correctAnswers}</div>
        </div>

        <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-xs text-muted-foreground">Точность</div>
          <div className="text-2xl font-bold text-purple-600">{stats.accuracy}%</div>
        </div>

        <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="text-xs text-muted-foreground">К повторению</div>
          <div className="text-2xl font-bold text-orange-600">{stats.failedBlocksCount}</div>
        </div>
      </div>

      {/* Статус прогресса */}
      <div className="p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">📈 Прогресс урока</h3>
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80"
          >
            {showStats ? 'Скрыть' : 'Показать'}
          </button>
        </div>

        {showStats && (
          <div className="space-y-2">
            {/* Прогресс бар */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.accuracy}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Вы ответили правильно на {stats.correctAnswers} из {stats.totalAnswers} вопросов
            </p>
          </div>
        )}
      </div>

      {/* Список неправильных блоков */}
      {failedBlocks.length > 0 && (
        <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                🔄 Блоки для повторения
              </h3>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                Вы ответили неправильно на {failedBlocks.length} блоке(ов). 
                Сейчас создадим ремедиальные задания для повторения!
              </p>

              <div className="space-y-2">
                {failedBlocks.map((block, index) => (
                  <FailedBlockCard
                    key={block.blockId}
                    block={block}
                    index={index + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Инструкции по повторению */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          💡 Как работает повторение?
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>
            ✅ После основных 15 блоков добавляются <strong>ремедиальные блоки</strong>
          </li>
          <li>
            ✅ Каждый ремедиал содержит <strong>другие примеры</strong> и новые вопросы
          </li>
          <li>
            ✅ Объяснения <strong>упрощены</strong> или подходят с другой стороны
          </li>
          <li>
            ✅ Это помогает <strong>закрепить</strong> сложный материал
          </li>
        </ul>
      </div>

      {/* Статус генерации ремедиалов */}
      {stats.remedialsAddedCount > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                ✅ Ремедиалы созданы!
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                Создано {stats.remedialsAddedCount} ремедиальных блоков для повторения.
                Они добавлены в конец урока.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Компонент для отображения неправильного блока
 */
interface FailedBlockCardProps {
  block: FailedBlockEntry;
  index: number;
}

const FailedBlockCard: React.FC<FailedBlockCardProps> = ({ block, index }) => {
  const difficultyColor: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  };

  const difficultyLabel: Record<string, string> = {
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый'
  };

  return (
    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-orange-200 dark:border-orange-800">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold">
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{block.blockTitle}</p>
          <p className="text-xs text-muted-foreground">
            Тема: <span className="font-medium">{block.topic}</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${difficultyColor[block.difficulty]}`}>
              {difficultyLabel[block.difficulty]}
            </span>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              ❌ {block.failureCount} ошибок
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Компонент ремедиального блока
 */
interface RemedialsBlockProps {
  block: any;
  onAnswerSubmit?: (questionId: string, answer: string, isCorrect: boolean) => void;
}

export const RemedialsBlock: React.FC<RemedialsBlockProps> = ({ block, onAnswerSubmit }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));

    const isCorrect = optionIndex === block.questions[0]?.correctAnswer;
    onAnswerSubmit?.(questionId, block.questions[0]?.options[optionIndex], isCorrect);
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
      {/* Заголовок ремедиала */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <RotateCcw className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold">{block.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground italic">
          🔄 Это повторение темы с другого подхода. Постарайся понять материал лучше!
        </p>
      </div>

      {/* Объяснение */}
      <div className="mb-4 p-3 bg-white dark:bg-slate-900 rounded border border-blue-200 dark:border-blue-800">
        <p className="text-sm">{block.content}</p>
      </div>

      {/* Инструкции */}
      {block.instructions && (
        <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded text-sm">
          {block.instructions}
        </div>
      )}

      {/* Вопросы */}
      <div className="space-y-3">
        {block.questions?.map((question: any, qIdx: number) => (
          <div key={question.id} className="p-3 bg-white dark:bg-slate-900 rounded border border-border">
            <p className="font-medium text-sm mb-2">{qIdx + 1}. {question.question}</p>
            <div className="space-y-1 ml-2">
              {question.options.map((option: string, optIdx: number) => (
                <label key={optIdx} className="flex items-center text-sm cursor-pointer">
                  <input
                    type="radio"
                    name={`remedial-${block.id}-${question.id}`}
                    className="mr-2"
                    checked={selectedAnswers[question.id] === optIdx}
                    onChange={() => handleAnswerSelect(question.id, optIdx)}
                  />
                  <span>{String.fromCharCode(65 + optIdx)}) {option}</span>
                </label>
              ))}
            </div>
            {selectedAnswers[question.id] !== undefined && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                💡 {question.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

