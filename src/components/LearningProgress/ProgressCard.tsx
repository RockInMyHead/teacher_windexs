/**
 * ProgressCard Component
 * Отображение прогресса обучения по курсу
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, Clock, Target } from 'lucide-react';
import { CourseContext } from '@/services';

interface ProgressCardProps {
  context: CourseContext;
  className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ context, className }) => {
  const {
    courseTitle,
    currentLessonNumber,
    completedLessons,
    totalLessons,
    progressPercentage,
    currentLessonTitle,
    currentLessonTopic,
    studyHistory
  } = context;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-600" />
          Прогресс обучения
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Основной прогресс */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{courseTitle}</span>
            <span className="text-sm text-muted-foreground">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Статистика уроков */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-2xl font-bold">{totalLessons}</span>
            </div>
            <p className="text-xs text-muted-foreground">Всего уроков</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600 mr-1" />
              <span className="text-2xl font-bold">{completedLessons}</span>
            </div>
            <p className="text-xs text-muted-foreground">Пройдено</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-orange-600 mr-1" />
              <span className="text-2xl font-bold">
                {studyHistory?.totalStudyTime ? Math.floor(studyHistory.totalStudyTime / 60) : 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Часов</p>
          </div>
        </div>

        {/* Текущий урок */}
        {currentLessonTitle && (
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start gap-2">
              <Badge variant="default" className="bg-emerald-600">
                Урок {currentLessonNumber}
              </Badge>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{currentLessonTitle}</h4>
                <p className="text-xs text-muted-foreground">{currentLessonTopic}</p>
              </div>
            </div>
          </div>
        )}

        {/* Пройденные темы */}
        {studyHistory && studyHistory.topicsCovered && studyHistory.topicsCovered.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Пройденные темы:</h4>
            <div className="flex flex-wrap gap-1">
              {studyHistory.topicsCovered.slice(-5).map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {studyHistory.topicsCovered.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{studyHistory.topicsCovered.length - 5} ещё
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressCard;

