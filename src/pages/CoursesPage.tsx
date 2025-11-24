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
  const [virtualCourses, setVirtualCourses] = useState<any[]>([]);

  useEffect(() => {
    // Загружаем сохраненные планы при загрузке страницы
    if (user?.id) {
      loadUserPlans();
    }
  }, [user?.id]);

  // Перезагружаем планы при возвращении на страницу (после создания плана)
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id) {
        loadUserPlans();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user?.id]);

  const loadUserPlans = async () => {
    console.log('🚀 [loadUserPlans] Starting to load plans for user:', user?.id);
    
    if (!user?.id) {
      console.log('❌ [loadUserPlans] No user ID, skipping');
      return;
    }
    
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
          // Сохраняем планы в localStorage для использования в CourseDetail
          localStorage.setItem('userLearningPlans', JSON.stringify(plansMap));
          console.log('💾 Saved plans to localStorage:', Object.keys(plansMap));

          // Создаем виртуальные курсы из планов
          const virtualCoursesFromPlans = data.plans?.map((plan: any) => {
            console.log('🔍 Processing plan:', plan.course_id, plan.plan_data?.courseInfo);

            if (!plan.plan_data?.courseInfo) {
              console.warn('⚠️ Plan missing courseInfo:', plan.course_id);
              return null;
            }

            const courseInfo = plan.plan_data.courseInfo;
            const virtualCourse = {
              id: plan.course_id,
              title: courseInfo.title,
              description: `Персонализированный курс: ${courseInfo.title}`,
              level: 'Персонализированный',
              grade: `${courseInfo.grade} класс`,
              progress: 0,
              modules: plan.plan_data.lessons?.length || 0,
              completedModules: 0,
              students: 1,
              icon: 'BookOpen', // Default icon
              color: 'from-purple-500 to-pink-500', // Special color for personalized courses
              isVirtual: true
            };

            console.log('✅ Created virtual course:', virtualCourse.title, 'ID:', virtualCourse.id);
            return virtualCourse;
          }).filter(Boolean) || [];

          console.log('🎯 Virtual courses created:', virtualCoursesFromPlans.length);
          setVirtualCourses(virtualCoursesFromPlans);

          console.log('✅ Learning plans loaded:', {
            count: data.plans?.length || 0,
            validPlans: Object.keys(plansMap).length,
            virtualCourses: virtualCoursesFromPlans.length,
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
    console.log('🎯 handleContinueCourse called:', {
      courseId: course.id,
      courseTitle: course.title,
      grade: course.grade,
      userId: user?.id,
      isVirtual: course.isVirtual,
      hasPlan: !!savedPlans[course.id] || !!savedPlans[course.id.toString()]
    });

    try {
      // Сохраняем данные курса в localStorage для передачи на страницу деталей
      const courseData = {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        grade: course.grade,
        progress: course.progress,
        modules: course.modules,
        completedModules: course.completedModules,
        students: course.students,
        isVirtual: course.isVirtual
      };

      localStorage.setItem('selectedCourseData', JSON.stringify(courseData));
      console.log('💾 Saved course data to localStorage:', courseData);

      // Перейти на страницу выбора типа обучения
      console.log('📖 Opening learning type selection for course:', course.title, 'ID:', course.id);
      navigate(`/course/${course.id}/select-mode`);
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
                {/* Active courses */}
                {user?.activeCourses?.map((course) => {
                  const Icon = getIconByName(course.icon);
                  return (
                    <Card key={`active-${course.id}`} className="hover:shadow-lg transition-shadow">
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
                              'Продолжить обучение'
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Virtual courses from plans - DISABLED to prevent duplication */}
                {false && virtualCourses.map((course) => {
                  const Icon = getIconByName(course.icon);
                  return (
                    <Card key={`virtual-${course.id}`} className="hover:shadow-lg transition-shadow border-2 border-purple-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            {course.level}
                          </Badge>
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
                            <span>{course.completedModules} из {course.modules} уроков</span>
                            <span>Персонализированный</span>
                          </div>
                          <Button
                            className="w-full"
                            size="sm"
                            disabled={loadingCourseId === course.id.toString()}
                            onClick={() => {
                              console.log('🔍 Virtual course clicked:', { courseId: course.id, courseTitle: course.title });
                              handleContinueCourse(course);
                            }}
                          >
                            {loadingCourseId === course.id.toString() ? (
                              <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Загрузка...
                              </>
                            ) : (
                              'Начать обучение'
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
