/**
 * Course Card Component
 * Displays course information in a card format
 * @module features/courses/ui/CourseCard
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Target } from 'lucide-react';
import type { CoursePlan } from '../types';

interface CourseCardProps {
  course: CoursePlan;
  onSelect?: () => void;
  onStart?: () => void;
  progress?: number; // 0-100
  className?: string;
}

export function CourseCard({
  course,
  onSelect,
  onStart,
  progress = 0,
  className = ''
}: CourseCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${className}`} onClick={onSelect}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <CardDescription className="mt-2">{course.description}</CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {course.grade} класс
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Course stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.lessons.length} уроков</span>
            </div>
            {course.metadata?.estimatedDuration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.metadata.estimatedDuration} ч</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {progress > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Прогресс
                </span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action button */}
          {onStart && (
            <Button 
              className="w-full mt-2" 
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
            >
              {progress > 0 ? 'Продолжить' : 'Начать курс'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





