/**
 * LessonProgress Component
 * Displays lesson progress and current step
 * @module features/chat/ui/LessonProgress
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Target } from 'lucide-react';

interface LessonProgressProps {
  currentStep: number;
  totalSteps: number;
  currentStepTitle?: string;
  progress?: number;
  notes?: string[];
  className?: string;
}

export function LessonProgress({
  currentStep,
  totalSteps,
  currentStepTitle,
  progress = 0,
  notes = [],
  className = ''
}: LessonProgressProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  Шаг {currentStep} из {totalSteps}
                </span>
              </span>
              <span className="text-muted-foreground">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} />
          </div>

          {/* Current step title */}
          {currentStepTitle && (
            <div className="text-sm">
              <p className="font-medium text-primary">{currentStepTitle}</p>
            </div>
          )}

          {/* Lesson notes */}
          {notes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Ключевые моменты урока:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {notes.map((note, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





