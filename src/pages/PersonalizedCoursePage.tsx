import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  ArrowLeft,
  Play,
  BookOpen,
  CheckCircle,
  Clock,
  Target,
  MessageSquare,
  ChevronRight,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonalizedCoursePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState(0);

  const courseId = user?.personalizedCourse?.id || 'personalized';
  const completedLessons = new Set(user?.completedLessons || []);

  if (!user?.personalizedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Персональный курс не найден</h2>
            <p className="text-muted-foreground mb-4">
              Пройдите тестирование, чтобы получить персонализированный курс обучения.
            </p>
            <Button onClick={() => navigate('/assessment')}>
              Пройти тест
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const course = user.personalizedCourse;
  if (!course || !course.modules || course.modules.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Курс не найден</CardTitle>
            <CardDescription>
              Персонализированный курс еще не создан или недоступен.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/assessment')} className="w-full">
              Пройти тест для создания курса
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const module = course.modules[currentModule];
  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Модуль не найден</CardTitle>
            <CardDescription>
              Выбранный модуль недоступен.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/courses')} className="w-full">
              Вернуться к курсам
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentModule + 1) / course.modules.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/courses')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад в кабинет
              </Button>
            </div>

            {/* Right side - Progress */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">Прогресс курса</p>
                <p className="text-xs text-muted-foreground">
                  {currentModule + 1} из {course.modules.length} модулей
                </p>
              </div>
              <div className="w-20">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
                <Badge variant="secondary">
                  {course.difficulty === 'beginner' ? 'Начинающий' :
                   course.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  {course.modules.length} модулей
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  ~{course.estimatedHours} часов
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Персонализирован
                </div>
              </div>
            </div>
          </div>

          {/* Topics Tags */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Ключевые темы курса:</h3>
            <div className="flex flex-wrap gap-2">
              {course.topics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Modules Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Модули курса</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.modules.map((mod, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentModule(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentModule
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index === currentModule ? 'bg-primary text-white' : 'bg-muted'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          index === currentModule ? 'text-primary' : ''
                        }`}>
                          {mod.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {mod.lessons.length} уроков
                        </p>
                      </div>
                      {index === currentModule && (
                        <ChevronRight className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Current Module Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{module.title}</CardTitle>
                    <CardDescription className="text-base">{module.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    Модуль {currentModule + 1}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                {/* Lessons List */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-lg mb-4">Уроки модуля:</h4>
                  {module.lessons.map((lesson, index) => {
                    const lessonKey = `${courseId}-${currentModule}-${index}`;
                    const isCompleted = completedLessons.has(lessonKey);

                    return (
                      <div key={index} className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                        isCompleted ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-border/50 hover:bg-muted/50'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {lesson}
                          </p>
                          {isCompleted && (
                            <p className="text-xs text-green-600 mt-1">✓ Завершено</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                              navigate(`/lesson/${courseId}/${currentModule}/${index}?type=notes`);
                          }}
                          variant={isCompleted ? "outline" : "default"}
                          className="flex items-center gap-2"
                        >
                            <BookOpen className="w-3 h-3" />
                            Конспект
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              navigate(`/lesson/${courseId}/${currentModule}/${index}?type=test`);
                            }}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Тест
                        </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Module Actions */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {module.lessons.length} уроков
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Интерактивное обучение
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {currentModule > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setCurrentModule(currentModule - 1)}
                        >
                          Предыдущий модуль
                        </Button>
                      )}

                      <Button
                        onClick={() => {
                          const firstIncompleteLesson = module.lessons.findIndex((lesson, index) => {
                            const lessonKey = `${courseId}-${currentModule}-${index}`;
                            return !completedLessons.has(lessonKey);
                          });
                          const lessonIndex = firstIncompleteLesson >= 0 ? firstIncompleteLesson : 0;
                          navigate(`/lesson/${courseId}/${currentModule}/${lessonIndex}`);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Начать обучение в этом модуле
                      </Button>

                      {currentModule < course.modules.length - 1 && (
                        <Button
                          onClick={() => setCurrentModule(currentModule + 1)}
                        >
                          Следующий модуль
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Progress Summary */}
            <Card className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Прогресс курса</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {completedLessons.size === 0 ? 'Отличный старт!' :
                       completedLessons.size >= course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0) * 0.8 ?
                       'Потрясающий прогресс!' : 'Хорошая работа!'}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{completedLessons.size}</div>
                    <div className="text-sm text-muted-foreground">Завершено уроков</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0) - completedLessons.size}</div>
                    <div className="text-sm text-muted-foreground">Осталось уроков</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentModule + 1}</div>
                    <div className="text-sm text-muted-foreground">Текущий модуль</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{Math.round((completedLessons.size / course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)) * 100)}%</div>
                    <div className="text-sm text-muted-foreground">Общий прогресс</div>
                  </div>
                </div>

                <Progress value={(completedLessons.size / course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)) * 100} className="h-3 mb-4" />

                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    {completedLessons.size === 0
                      ? "Начните свое обучение с первого урока!"
                      : completedLessons.size >= course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0) * 0.5
                      ? "Отличный прогресс! Продолжайте в том же духе!"
                      : "Хорошая работа! Каждый урок приближает вас к цели."
                    }
                  </p>
                  <Button onClick={() => {
                    // Найти следующий незавершенный урок во всем курсе
                    let nextModule = currentModule;
                    let nextLesson = -1;

                    // Сначала ищем в текущем модуле
                    for (let i = 0; i < course.modules[nextModule].lessons.length; i++) {
                      const lessonKey = `${courseId}-${nextModule}-${i}`;
                      if (!completedLessons.has(lessonKey)) {
                        nextLesson = i;
                        break;
                      }
                    }

                    // Если в текущем модуле нет незавершенных уроков, ищем в следующих модулях
                    if (nextLesson === -1) {
                      for (let m = nextModule + 1; m < course.modules.length; m++) {
                        for (let l = 0; l < course.modules[m].lessons.length; l++) {
                          const lessonKey = `${courseId}-${m}-${l}`;
                          if (!completedLessons.has(lessonKey)) {
                            nextModule = m;
                            nextLesson = l;
                            break;
                          }
                        }
                        if (nextLesson !== -1) break;
                      }
                    }

                    // Если нашли незавершенный урок, переходим к нему
                    if (nextLesson !== -1) {
                      navigate(`/lesson/${courseId}/${nextModule}/${nextLesson}`);
                    } else {
                      // Все уроки завершены, перейти в чат для дополнительного обучения
                      navigate('/chat');
                    }
                  }} className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    {completedLessons.size === course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)
                      ? 'Дополнительное обучение'
                      : 'Продолжить обучение'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalizedCoursePage;
