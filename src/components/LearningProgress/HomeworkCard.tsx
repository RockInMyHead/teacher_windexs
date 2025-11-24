/**
 * HomeworkCard Component
 * Отображение домашних заданий
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookCheck, Clock, AlertCircle } from 'lucide-react';
import { CourseContext } from '@/services';

interface HomeworkCardProps {
  context: CourseContext;
  onSubmit?: () => void;
  className?: string;
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({ 
  context, 
  onSubmit,
  className 
}) => {
  const { previousHomework } = context;

  if (!previousHomework || !previousHomework.task) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookCheck className="w-5 h-5 text-blue-600" />
          Домашнее задание
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Статус */}
        <div className="flex items-center justify-between">
          {previousHomework.submitted ? (
            <Badge variant="default" className="bg-emerald-600">
              <Clock className="w-3 h-3 mr-1" />
              Сдано
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="w-3 h-3 mr-1" />
              Не сдано
            </Badge>
          )}
        </div>

        {/* Задание */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">{previousHomework.task}</p>
        </div>

        {/* Отзыв (если есть) */}
        {previousHomework.feedback && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold mb-1">Отзыв учителя:</h4>
            <p className="text-sm text-muted-foreground">{previousHomework.feedback}</p>
          </div>
        )}

        {/* Кнопка отправки */}
        {!previousHomework.submitted && onSubmit && (
          <Button onClick={onSubmit} className="w-full" variant="default">
            Рассказать учителю о выполнении
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default HomeworkCard;

