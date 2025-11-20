import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

interface LessonData {
  id: number;
  lesson_title: string;
  lesson_topic: string;
  course_name: string;
  grade: string;
  lesson_notes: Array<{
    step: number;
    title: string;
    content: string;
  }>;
  interaction_type: 'text' | 'voice';
  created_at: string;
  total_lessons?: number;
  current_lesson_number?: number;
}

export default function LessonDetail() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const response = await fetch(`/api/generated-lessons/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setLesson(data.lesson);
      } else {
        console.error('Failed to load lesson');
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const startInteractiveLesson = () => {
    // Navigate to Chat page with lesson loaded
    navigate(`/chat?loadLesson=${lessonId}`);
  };

  const startVoiceCall = () => {
    // Navigate to Chat page with voice call mode
    navigate(`/chat?loadLesson=${lessonId}&voiceCall=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка урока...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <p className="text-lg mb-4">Урок не найден</p>
          <Button onClick={() => navigate('/chat')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к урокам
          </Button>
        </Card>
      </div>
    );
  }

  const totalLessons = lesson.total_lessons || 32;
  const currentLessonNumber = lesson.current_lesson_number || 1;
  const progressPercentage = Math.round((currentLessonNumber / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/chat')}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к плану
          </Button>

          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Прогресс обучения
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">{lesson.course_name}</span>
                  <span>•</span>
                  <span>{lesson.grade}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{currentLessonNumber}/{totalLessons}</span>
                  <span className="text-muted-foreground">Уроков</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-sm text-muted-foreground text-right">
                  {progressPercentage}% пройдено
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Lesson Content */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="space-y-6">
            {/* Lesson Header */}
            <div className="border-b pb-6">
              <Badge variant="outline" className="mb-3">
                Урок {currentLessonNumber}
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {lesson.lesson_title}
              </h2>
              <p className="text-lg text-muted-foreground">
                Тема: {lesson.lesson_topic}
              </p>
            </div>

            {/* Lesson Content */}
            <div className="prose prose-sm max-w-none">
              <h3 className="text-xl font-semibold mb-3">Содержание урока</h3>
              {lesson.lesson_notes && lesson.lesson_notes.length > 0 ? (
                <div className="space-y-4">
                  {lesson.lesson_notes.map((note, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-2">{note.title}</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">
                  {lesson.lesson_topic}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button
                size="lg"
                onClick={startInteractiveLesson}
                className="flex-1 text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-3"
              >
                <BookOpen className="w-5 h-5" />
                Начать урок
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={startVoiceCall}
                className="flex-1 text-lg py-6 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 gap-3"
              >
                <Phone className="w-5 h-5" />
                Звонок учителю
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="ghost"
                disabled={currentLessonNumber <= 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Предыдущий урок
              </Button>
              <Button
                variant="ghost"
                disabled={currentLessonNumber >= totalLessons}
                className="gap-2"
              >
                Следующий урок
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

