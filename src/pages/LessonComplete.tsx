import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, CheckCircle, Brain } from 'lucide-react';
import { logger } from '@/utils/logger';

interface LessonCompleteProps {}

const LessonComplete: React.FC<LessonCompleteProps> = () => {
  const { courseId, moduleId, lessonId } = useParams<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const [lessonContent, setLessonContent] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLessonContent = async () => {
      try {
        setIsLoading(true);

        // Получаем данные урока из localStorage или API
        const lessonData = localStorage.getItem(`lesson_${courseId}_${moduleId}_${lessonId}`);

        if (lessonData) {
          const parsedData = JSON.parse(lessonData);
          setLessonTitle(parsedData.title || `Урок ${parseInt(lessonId || '0') + 1}`);
          setLessonContent(parsedData.content || 'Содержимое урока будет загружено...');
        } else {
          // Если данных нет в localStorage, создаем базовый урок
          setLessonTitle(`Урок ${parseInt(lessonId || '0') + 1}`);
          setLessonContent(`
            <h2>🎉 Поздравляем! Вы прошли ознакомительный тест!</h2>

            <p>Теперь вы готовы приступить к изучению основного материала урока.</p>

            <h3>Что вас ждет в этом уроке:</h3>
            <ul>
              <li>📚 Теоретическая основа темы</li>
              <li>💡 Практические примеры</li>
              <li>✍️ Интерактивные упражнения</li>
              <li>🎯 Проверочные задания</li>
            </ul>

            <p>Приступим к изучению материала!</p>
          `);
        }

        logger.debug('Lesson complete page loaded', { courseId, moduleId, lessonId });
      } catch (error) {
        logger.error('Failed to load lesson content', error as Error);
        setLessonTitle(`Урок ${parseInt(lessonId || '0') + 1}`);
        setLessonContent('<p>Ошибка загрузки содержимого урока. Попробуйте обновить страницу.</p>');
      } finally {
        setIsLoading(false);
      }
    };

    loadLessonContent();
  }, [courseId, moduleId, lessonId]);

  const handleBackToCourse = () => {
    navigate('/personalized-course');
  };

  const handleStartLesson = () => {
    // Переходим обратно к обычному уроку без теста
    navigate(`/lesson/${courseId}/${moduleId}/${lessonId}?type=notes`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Brain className="w-12 h-12 animate-pulse mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Загрузка урока...</h3>
              <p className="text-muted-foreground">Подготовка материалов для изучения</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToCourse}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад к курсу
              </Button>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-primary">{lessonTitle}</h1>
              <p className="text-sm text-muted-foreground">Основной материал урока</p>
            </div>

            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="flex items-center gap-3 p-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  🎉 Ознакомительный тест пройден успешно!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Теперь вы можете приступить к изучению основного материала урока
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lesson Content */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Материалы урока
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: lessonContent }}
              />

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <Button
                  onClick={handleStartLesson}
                  size="lg"
                  className="flex-1"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Начать изучение урока
                </Button>

                <Button
                  variant="outline"
                  onClick={handleBackToCourse}
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Вернуться к курсу
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LessonComplete;
