/**
 * Voice Lesson Progress Component
 * Shows lesson progress, current note, and lesson controls
 * @module features/voice/ui/VoiceLessonProgress
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CheckCircle,
  SkipForward,
  RotateCcw,
  BookOpen,
  Target
} from 'lucide-react';

interface VoiceLessonProgressProps {
  currentNoteIndex: number;
  totalNotes: number;
  currentNote?: string;
  lessonProgress: number;
  callDuration: number;
  conversationHistory: Array<{ role: 'teacher' | 'student'; text: string }>;
  onNextNote?: () => void;
  onRepeatNote?: () => void;
  onFinishLesson?: () => void;
  className?: string;
}

export function VoiceLessonProgress({
  currentNoteIndex,
  totalNotes,
  currentNote,
  lessonProgress,
  callDuration,
  conversationHistory,
  onNextNote,
  onRepeatNote,
  onFinishLesson,
  className = ''
}: VoiceLessonProgressProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLastNote = currentNoteIndex >= totalNotes - 1;
  const questionsCount = conversationHistory.filter(item => item.role === 'student').length;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="w-5 h-5" />
          Прогресс урока
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="font-medium">
                Заметка {currentNoteIndex + 1} из {totalNotes}
              </span>
            </span>
            <span className="text-muted-foreground">
              {lessonProgress}%
            </span>
          </div>
          <Progress value={lessonProgress} />
        </div>

        {/* Current note */}
        {currentNote && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Текущая тема:</p>
            <p className="text-sm text-muted-foreground">{currentNote}</p>
          </div>
        )}

        {/* Statistics */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(callDuration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            <span>{questionsCount} вопросов</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {onRepeatNote && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRepeatNote}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Повторить
            </Button>
          )}

          {!isLastNote && onNextNote && (
            <Button
              variant="default"
              size="sm"
              onClick={onNextNote}
              className="flex-1"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Далее
            </Button>
          )}

          {isLastNote && onFinishLesson && (
            <Button
              variant="default"
              size="sm"
              onClick={onFinishLesson}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Завершить
            </Button>
          )}
        </div>

        {/* Lesson completion indicator */}
        {lessonProgress === 100 && (
          <Badge variant="default" className="w-full justify-center py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            Урок завершён!
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

