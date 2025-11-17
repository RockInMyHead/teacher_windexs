import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { VoiceTeacherChat } from '@/components/VoiceTeacherChat';
import { ArrowLeft, BookOpen, Clock, Target, MessageCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Lesson {
  number: number;
  title: string;
  topic: string;
  aspects?: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

interface LessonPageProps {
  lesson?: Lesson;
  courseInfo?: {
    courseId: number;
    title: string;
    grade: number;
  };
  lessonIndex?: number;
  totalLessons?: number;
}

const Lesson: React.FC<LessonPageProps> = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Auto-scroll to video call when it opens
  useEffect(() => {
    if (showVideoCall) {
      setTimeout(() => {
        const videoCallElement = document.querySelector('[data-video-call]');
        if (videoCallElement) {
          videoCallElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [showVideoCall]);

  useEffect(() => {
    // Получаем данные из localStorage
    const storedData = localStorage.getItem('currentLesson');
    const storedCourseInfo = localStorage.getItem('courseInfo');
    const storedLessonIndex = localStorage.getItem('lessonIndex');
    const storedTotalLessons = localStorage.getItem('totalLessons');

    if (storedData) {
      const data = JSON.parse(storedData);
      setLesson(data);
    }

    if (storedCourseInfo) {
      setCourseInfo(JSON.parse(storedCourseInfo));
    }

    if (storedLessonIndex) {
      const index = parseInt(storedLessonIndex, 10);
      setLessonIndex(index);
    }

    if (storedTotalLessons) {
      const total = parseInt(storedTotalLessons, 10);
      setTotalLessons(total);
      if (storedLessonIndex) {
        const index = parseInt(storedLessonIndex, 10);
        setProgress((index / total) * 100);
      }
    }

    // Если нет данных, перенаправляем на главную
    if (!storedData) {
      navigate('/available-courses');
    }
  }, [navigate]);


  const handlePrevious = () => {
    if (lessonIndex > 0) {
      // Обновляем localStorage для предыдущего урока
      const personalizedCourse = localStorage.getItem('personalizedCourse');
      if (personalizedCourse) {
        const courseData = JSON.parse(personalizedCourse);
        if (courseData.lessons && courseData.lessons[lessonIndex - 1]) {
          const prevLesson = courseData.lessons[lessonIndex - 1];
          localStorage.setItem('currentLesson', JSON.stringify(prevLesson));
          localStorage.setItem('lessonIndex', String(lessonIndex - 1));
          window.location.reload();
        }
      }
    }
  };

  const handleNext = () => {
    if (lessonIndex < totalLessons - 1) {
      // Обновляем localStorage для следующего урока
      const personalizedCourse = localStorage.getItem('personalizedCourse');
      if (personalizedCourse) {
        const courseData = JSON.parse(personalizedCourse);
        if (courseData.lessons && courseData.lessons[lessonIndex + 1]) {
          const nextLesson = courseData.lessons[lessonIndex + 1];
          localStorage.setItem('currentLesson', JSON.stringify(nextLesson));
          localStorage.setItem('lessonIndex', String(lessonIndex + 1));
          window.location.reload();
        }
      }
    }
  };

  const handleBack = () => {
    navigate('/personalized-course');
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-blue-600 bg-blue-50';
      case 'advanced':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Основной';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return 'Общий';
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground text-lg">Загрузка урока...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к плану
          </Button>

          {/* Progress Section */}
          <Card className="mb-8 border-2 border-border/60 bg-card/80 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Прогресс обучения
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {courseInfo?.title} • {courseInfo?.grade} класс
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {lessonIndex + 1}/{totalLessons}
                  </p>
                  <p className="text-xs text-muted-foreground">Уроков</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(progress)}% пройдено
              </p>
            </CardContent>
          </Card>

          {/* Lesson Content */}
          <Card className="mb-8 border-2 border-border/60 bg-card/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-500">
            <CardHeader className="pb-6 border-b border-border/50">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary mb-2">Урок {lesson.number}</p>
                    <CardTitle className="text-3xl font-bold mb-2">
                      {lesson.title}
                    </CardTitle>
                    <p className="text-lg text-muted-foreground">
                      Тема: <span className="text-foreground font-semibold">{lesson.topic}</span>
                    </p>
                  </div>
                  {lesson.difficulty && (
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(
                        lesson.difficulty
                      )}`}
                    >
                      {getDifficultyLabel(lesson.difficulty)}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Main Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Содержание урока
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed bg-card/50 p-4 rounded-lg border border-border/50">
                    {lesson.aspects || lesson.description || 'Описание содержания урока'}
                  </p>
                </div>

                {/* Prerequisites */}
                {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Предварительные знания
                    </h3>
                    <ul className="space-y-2">
                      {lesson.prerequisites.map((prereq, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-muted-foreground p-3 bg-card/50 rounded-lg border border-border/50"
                        >
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 py-8">
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 gap-3"
              onClick={() => navigate('/chat?mode=lesson')}
            >
              <MessageCircle className="w-5 h-5" />
              Начать урок
              <Target className="w-5 h-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 hover:text-black transition-all duration-300"
              onClick={() => setShowVideoCall(true)}
            >
              Звонок учителю
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 pb-12">
            <Button
              onClick={handlePrevious}
              disabled={lessonIndex === 0}
              variant="outline"
              className="flex-1 h-12 border-2 text-base font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Предыдущий урок
            </Button>

            <Button
              onClick={handleNext}
              disabled={lessonIndex === totalLessons - 1}
              className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Следующий урок →
            </Button>
          </div>

          {/* Voice Teacher Chat */}
          {showVideoCall && (
            <div className="mt-8" data-video-call>
              <VoiceTeacherChat
                lessonTitle={lesson?.title || 'Урок'}
                lessonTopic={lesson?.topic || 'Тема'}
                lessonAspects={lesson?.aspects || lesson?.description || 'Материал урока'}
                onComplete={() => {
                  setShowVideoCall(false);
                  navigate('/personalized-course');
                }}
                onClose={() => setShowVideoCall(false)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Lesson;

