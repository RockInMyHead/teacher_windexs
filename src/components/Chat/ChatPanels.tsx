/**
 * ChatPanels - Assessment, AudioTask, and TestQuestion panels
 */

import React from 'react';
import { X, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { AssessmentPanelProps, AudioTaskPanelProps, TestQuestionPanelProps } from './types';
import { logger } from '@/utils/logger';

// ============= ASSESSMENT PANEL =============

export const AssessmentPanel = React.memo(
  ({
    isActive,
    currentQuestion,
    questionCount = 0,
    assessmentState = 'initial',
    assessmentResult,
    classGrade = '',
    lastTopic = '',
    onGradeSelect,
    onTopicSelect,
    onAnswerSubmit,
    onClose,
    isLoading = false,
  }: AssessmentPanelProps) => {
    const [answer, setAnswer] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);

    if (!isActive) return null;

    const handleSubmitAnswer = async () => {
      if (!answer.trim()) return;

      try {
        setIsSending(true);
        logger.debug('Submitting answer', { questionCount });
        await onAnswerSubmit?.(answer.trim());
        setAnswer('');
      } catch (error) {
        logger.error('Failed to submit answer', error as Error);
      } finally {
        setIsSending(false);
      }
    };

    // Initial state - select grade
    if (assessmentState === 'collecting_grade') {
      return (
        <Dialog open={isActive} onOpenChange={open => !open && onClose?.()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Выберите класс</DialogTitle>
              <DialogDescription>
                Это поможет адаптировать сложность вопросов
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {['1-2', '3-4', '5-6', '7-8', '9-10', '11'].map(grade => (
                <Button
                  key={grade}
                  variant="outline"
                  onClick={() => onGradeSelect?.(grade)}
                  disabled={isLoading}
                >
                  {grade} класс
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    // Select topic
    if (assessmentState === 'collecting_topic') {
      return (
        <Dialog open={isActive} onOpenChange={open => !open && onClose?.()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Выберите тему</DialogTitle>
              <DialogDescription>
                Какую тему вы изучали?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {['Present Simple', 'Past Continuous', 'Future Perfect', 'Modal Verbs'].map(topic => (
                <Button
                  key={topic}
                  variant="outline"
                  onClick={() => onTopicSelect?.(topic)}
                  disabled={isLoading}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    // In progress - show question
    if (assessmentState === 'in_progress' && currentQuestion) {
      return (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Вопрос {questionCount}</CardTitle>
            <CardDescription>Адаптивное тестирование</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base font-medium">{currentQuestion.prompt}</p>

            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <div className="grid gap-2">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => setAnswer(option)}
                    className={answer === option ? 'border-primary bg-primary/10' : ''}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {currentQuestion.type !== 'multiple_choice' && (
              <input
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Введите ответ..."
                className="w-full rounded border border-input px-3 py-2"
              />
            )}

            <Button
              onClick={handleSubmitAnswer}
              disabled={!answer || isSending || isLoading}
              className="w-full"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  Ответить
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Completed
    if (assessmentState === 'completed' && assessmentResult) {
      return (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle>Результаты тестирования</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Уровень</p>
                <p className="text-2xl font-bold">{assessmentResult.cluster}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Точность</p>
                <p className="text-2xl font-bold">
                  {Math.round((assessmentResult.correctAnswers / assessmentResult.totalQuestions) * 100)}%
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Рекомендации: {assessmentResult.recommendations[0]}
            </p>

            <Button onClick={onClose} className="w-full">
              Закрыть
            </Button>
          </CardContent>
        </Card>
      );
    }

    return null;
  }
);

AssessmentPanel.displayName = 'AssessmentPanel';

// ============= AUDIO TASK PANEL =============

export const AudioTaskPanel = React.memo(
  ({
    isActive,
    taskText = '',
    isRecording = false,
    onStart,
    onStop,
    onClose,
  }: AudioTaskPanelProps) => {
    if (!isActive) return null;

    return (
      <Card className="border-yellow-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Голосовое задание</CardTitle>
              <CardDescription>{taskText}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">Запишите ваш ответ голосом</p>

          <Button
            onClick={isRecording ? onStop : onStart}
            variant={isRecording ? 'destructive' : 'default'}
            className="w-full"
          >
            {isRecording ? (
              <>
                <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-current" />
                Запись...
              </>
            ) : (
              'Начать запись'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }
);

AudioTaskPanel.displayName = 'AudioTaskPanel';

// ============= TEST QUESTION PANEL =============

export const TestQuestionPanel = React.memo(
  ({
    isActive,
    questionData,
    onAnswerSelect,
    onClose,
  }: TestQuestionPanelProps) => {
    if (!isActive || !questionData) return null;

    return (
      <Dialog open={isActive} onOpenChange={open => !open && onClose?.()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="font-medium">{questionData.question}</p>

            <div className="grid gap-2">
              {questionData.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => onAnswerSelect?.(option)}
                  className="justify-start text-left"
                >
                  <span className="mr-2 font-bold text-muted-foreground">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

TestQuestionPanel.displayName = 'TestQuestionPanel';

export default {
  AssessmentPanel,
  AudioTaskPanel,
  TestQuestionPanel,
};

