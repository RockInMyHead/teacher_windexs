import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HeaderWithHero } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Code, Languages, Calculator, Palette, Globe, ArrowLeft, Play, BookOpen, Trophy, MessageCircle, Award, User, Atom, Brain, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Функция для получения иконки по имени
const getIconByName = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'Languages': Languages,
    'Calculator': Calculator,
    'Atom': Atom,
    'Globe': Globe,
    'Code': Code,
    'Palette': Palette,
    'Brain': Brain,
    'BookOpen': BookOpen
  };
  return iconMap[iconName] || Languages; // Default to Languages if not found
};

const CoursesPage = () => {
  const { user, logout, updateUserStats } = useAuth();
  const navigate = useNavigate();
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    // Загружаем сохраненные планы при загрузке страницы
    if (user?.id) {
      loadUserPlans();
    }
  }, [user?.id]);

  const loadUserPlans = async () => {
    try {
      console.log('📚 Loading user learning plans for user:', user?.id);
      const response = await fetch(`/api/db/learning-plans/user/${user?.id}`);

      console.log('📡 API Response status:', response.status, 'content-type:', response.headers.get('content-type'));

      if (response.ok) {
        let data;
        try {
          data = await response.json();
          console.log('📦 Raw response data:', data);
        } catch (jsonError) {
          console.error('❌ Failed to parse JSON response:', jsonError);
          const textResponse = await response.text();
          console.error('📄 Raw text response:', textResponse.substring(0, 500));
          throw new Error('Invalid JSON in response');
        }

        if (data.success === true) {
          const plansMap: { [key: string]: any } = {};
          data.plans?.forEach((plan: any) => {
            if (plan.plan_data && typeof plan.plan_data === 'object' && plan.plan_data.error) {
              console.warn(`⚠️ Plan ${plan.course_id} has parsing error:`, plan.plan_data.error);
              return; // Пропускаем планы с ошибками
            }
            plansMap[plan.course_id] = plan;
            plansMap[plan.course_id.toString()] = plan; // Добавляем и как строку
          });
          setSavedPlans(plansMap);
          console.log('✅ Learning plans loaded:', {
            count: data.plans?.length || 0,
            validPlans: Object.keys(plansMap).length,
            plansMap: Object.keys(plansMap),
            fullData: data
          });
        } else {
          console.warn('⚠️ API returned error status:', data);
        }
      } else {
        console.warn('⚠️ API returned error status:', response.status);
        const errorText = await response.text();
        console.warn('📄 Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ Error loading learning plans:', error);
    }
  };

  const handleContinueCourse = async (course: any) => {
    setLoadingCourseId(course.id.toString());
    console.log('🎯 handleContinueCourse called:', { courseId: course.id, courseTitle: course.title, grade: course.grade, userId: user?.id });

    try {
      // Всегда переходить к уроку в режиме чата, независимо от наличия плана
      // Это позволит пользователю начать интерактивный урок через кнопку в чате
      console.log('📖 Opening lesson in chat mode for course:', course.title);

      // Создать базовую информацию об уроке из данных курса
      const lessonData = {
        number: 1,
        title: course.title,
        grade: course.grade,
        topic: course.description,
        aspects: course.description,
        description: course.description
      };

      // Сохранить в localStorage для режима урока
      localStorage.setItem('currentLesson', JSON.stringify(lessonData));
      localStorage.setItem('courseInfo', JSON.stringify({
        courseId: course.id,
        title: course.title,
        grade: course.level === 'Начальный' ? 1 : course.level === 'Средний' ? 5 : 10
      }));

      console.log('✅ Prepared lesson data for chat mode:', lessonData);
      navigate('/chat?mode=lesson');
    } catch (error) {
      console.error('❌ Error continuing course:', error);
      // В случае ошибки перейти к оценке уровня
      const courseIdNum = typeof course.id === 'number' ? course.id : parseInt(course.id);
      if (!isNaN(courseIdNum)) {
        console.log('➡️ Error occurred, navigating to assessment');
        navigate(`/assessment-level?courseId=${courseIdNum}`);
      }
    } finally {
      setLoadingCourseId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex flex-col">
      {/* Header */}
      <HeaderWithHero
        title="Библиотека"
        subtitle="Ваши активные курсы и персонализированные программы обучения"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        {user?.activeCourses && user.activeCourses.length > 0 ? (
          <>
            {/* Courses Grid */}
            <div className="mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                {user.activeCourses.map((course) => {
                  const Icon = getIconByName(course.icon);
                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="secondary">{course.level}</Badge>
                        </div>
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Прогресс</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{course.completedModules} из {course.modules} модулей</span>
                            <span>{course.students} студентов</span>
                          </div>
                          <Button
                            className="w-full"
                            size="sm"
                            disabled={loadingCourseId === course.id.toString()}
                            onClick={() => {
                              console.log('🔍 Course clicked:', { courseId: course.id, courseTitle: course.title });
                              handleContinueCourse(course);
                            }}
                          >
                            {loadingCourseId === course.id.toString() ? (
                              <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Загрузка...
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Продолжить обучение
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Empty State - Centered */
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                У вас пока нет активных курсов
              </h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Начните изучение, выбрав курс из нашего каталога
              </p>
              <Button
                onClick={() => navigate('/available-courses')}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg font-semibold gap-3"
              >
                <BookOpen className="w-5 h-5" />
                Выбрать курс
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursesPage;
