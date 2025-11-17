import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, TrendingUp, BookOpen, Play } from 'lucide-react';
import { PersonalizedCourseData } from '@/utils/assessmentAnalyzer';

interface AssessmentResultsProps {
  data: PersonalizedCourseData;
  onStartCourse?: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  data,
  onStartCourse
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'weak':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'Отлично! 🎉';
      case 'good':
        return 'Хорошо! 👍';
      case 'moderate':
        return 'Удовлетворительно';
      case 'weak':
        return 'Требует внимания';
      default:
        return 'Анализируется...';
    }
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Превосходный результат!';
    if (percentage >= 75) return 'Хороший результат!';
    if (percentage >= 60) return 'Результат среднего уровня';
    return 'Нужно больше практики';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Overall Score Card */}
      <Card className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border-2 bg-gradient-to-br from-card via-card/50 to-card/30 overflow-hidden">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold mb-4">
            Результаты тестирования
          </CardTitle>
          <CardDescription className="text-lg">
            {getScoreMessage(data.overallPercentage)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Visualization */}
          <div className="text-center space-y-3">
            <div className="text-5xl font-bold text-primary">
              {data.overallPercentage}%
            </div>
            <Progress 
              value={data.overallPercentage} 
              className="h-3"
            />
            <p className="text-sm text-muted-foreground">
              Правильно ответлено на {(data.weakTopics?.reduce((sum, t) => sum + t.correctAnswers, 0) || 0) + (data.strongTopics?.reduce((sum, t) => sum + t.correctAnswers, 0) || 0)} из {(data.weakTopics?.reduce((sum, t) => sum + t.totalQuestions, 0) || 0) + (data.strongTopics?.reduce((sum, t) => sum + t.totalQuestions, 0) || 0)} вопросов
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strong Topics */}
      {data.strongTopics?.length > 0 && (
        <Card className="border-2 border-green-200/50 bg-green-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <CardTitle className="text-green-900">Ваши сильные стороны</CardTitle>
            </div>
            <CardDescription className="text-green-800">
              Темы, которые вы хорошо знаете
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.strongTopics?.map((topic, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-white rounded-lg border border-green-200/50 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-green-900">{topic.topic}</h4>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      {topic.percentage}%
                    </Badge>
                  </div>
                  <Progress value={topic.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Правильно: {topic.correctAnswers}/{topic.totalQuestions}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weak Topics */}
      {data.weakTopics?.length > 0 && (
        <Card className="border-2 border-orange-200/50 bg-orange-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-orange-900">Требует внимания</CardTitle>
            </div>
            <CardDescription className="text-orange-800">
              Темы, на которые стоит обратить внимание
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.weakTopics?.map((topic, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-white rounded-lg border border-orange-200/50 hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-orange-900">{topic.topic}</h4>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                      {topic.percentage}%
                    </Badge>
                  </div>
                  <Progress value={topic.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Правильно: {topic.correctAnswers}/{topic.totalQuestions}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Lessons */}
      <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle>Рекомендованный курс обучения</CardTitle>
          </div>
          <CardDescription>
            Первые 2 урока, адаптированные под ваш уровень
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.recommendedLessons.slice(0, 2).map((lesson, idx) => (
            <div 
              key={idx}
              className="p-4 bg-white rounded-lg border-2 border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                    <span className="text-sm font-bold text-primary">{idx + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {lesson.topic}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
                {lesson.aspects}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                <div className="flex gap-2">
                  {lesson.difficulty && (
                    <Badge variant="outline" className="text-xs">
                      {lesson.difficulty === 'beginner' && '🟢 Начинающий'}
                      {lesson.difficulty === 'intermediate' && '🟡 Средний'}
                      {lesson.difficulty === 'advanced' && '🔴 Продвинутый'}
                    </Badge>
                  )}
                </div>
                <BookOpen className="w-4 h-4 text-primary/50" />
              </div>
            </div>
          ))}

          <Button 
            onClick={onStartCourse}
            className="w-full mt-6 h-12 text-base font-semibold gap-2 group-hover:bg-primary/90"
          >
            <Play className="w-4 h-4" />
            Начать обучение
          </Button>

          {data.recommendedLessons.length > 2 && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              + ещё {data.recommendedLessons.length - 2} уроков доступно
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentResults;

