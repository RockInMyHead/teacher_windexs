/**
 * Lesson Card Component
 * Displays lesson information in a card format
 * @module features/courses/ui/LessonCard
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, CheckCircle, Lock } from 'lucide-react';
import type { LessonPlan } from '../types';

interface LessonCardProps {
  lesson: LessonPlan;
  isCompleted?: boolean;
  isLocked?: boolean;
  isCurrent?: boolean;
  onStart?: () => void;
  className?: string;
}

export function LessonCard({
  lesson,
  isCompleted = false,
  isLocked = false,
  isCurrent = false,
  onStart,
  className = ''
}: LessonCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'Начальный';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Продвинутый';
      default: return 'Базовый';
    }
  };

  return (
    <Card 
      className={`transition-all ${
        isCurrent ? 'border-primary shadow-md' : ''
      } ${
        isLocked ? 'opacity-60' : 'hover:shadow-lg cursor-pointer'
      } ${className}`}
      onClick={!isLocked && onStart ? onStart : undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-muted-foreground">
                Урок {lesson.number}
              </span>
              {lesson.difficulty && (
                <Badge className={getDifficultyColor(lesson.difficulty)}>
                  {getDifficultyLabel(lesson.difficulty)}
                </Badge>
              )}
            </div>
            <CardTitle className="text-base">{lesson.title}</CardTitle>
          </div>
          <div className="ml-2">
            {isCompleted && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            {isLocked && (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Topic */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Тема:</p>
            <p className="text-sm">{lesson.topic}</p>
          </div>

          {/* Aspects preview */}
          <div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {lesson.aspects}
            </p>
          </div>

          {/* Modules count */}
          {lesson.modules && lesson.modules.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{lesson.modules.length} модулей</span>
            </div>
          )}

          {/* Estimated time */}
          {lesson.modules && lesson.modules.some(m => m.estimatedTime) && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {lesson.modules.reduce((sum, m) => sum + (m.estimatedTime || 0), 0)} мин
              </span>
            </div>
          )}

          {/* Action button */}
          {!isLocked && onStart && (
            <Button 
              className="w-full mt-2"
              variant={isCurrent ? 'default' : 'outline'}
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              disabled={isLocked}
            >
              {isCompleted ? 'Повторить' : isCurrent ? 'Продолжить' : 'Начать'}
            </Button>
          )}

          {isLocked && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Завершите предыдущие уроки
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





