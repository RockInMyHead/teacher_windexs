import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Code, Languages, Calculator, Palette, Globe, ArrowLeft, Play, BookOpen, Trophy, MessageCircle, Award, User, Atom } from 'lucide-react';
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Левая часть - Логотип */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-sm sm:text-lg font-semibold hidden sm:block">Windexs-Учитель</h1>
            </div>

            {/* Центральная часть - Навигация */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => navigate('/available-courses')}
              >
                <BookOpen className="w-4 h-4" />
                Курсы
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => navigate('/chat')}
              >
                <MessageCircle className="w-4 h-4" />
                Чат
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => navigate('/achievements')}
              >
                <Award className="w-4 h-4" />
                Достижения
              </Button>
            </nav>

            {/* Мобильная навигация */}
            <nav className="md:hidden flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 px-2"
                onClick={() => navigate('/available-courses')}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden xs:inline">Курсы</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 px-2"
                onClick={() => navigate('/chat')}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden xs:inline">Чат</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 px-2"
                onClick={() => navigate('/achievements')}
              >
                <Award className="w-4 h-4" />
                <span className="hidden xs:inline">Достижения</span>
              </Button>
            </nav>

            {/* Правая часть - Личный кабинет */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs sm:text-sm font-medium">Добро пожаловать, {user?.name}!</p>
                {user?.knowledgeLevel && (
                  <Badge variant="secondary" className="text-xs">
                    {user.knowledgeLevel === 'beginner' ? 'Начинающий' :
                     user.knowledgeLevel === 'intermediate' ? 'Средний' : 'Продвинутый'}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4"
                onClick={() => navigate('/account')}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Личный кабинет</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        {/* Personalized Course */}
        {user?.personalizedCourse && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Ваш персонализированный курс
            </h2>
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">{user.personalizedCourse.title}</h3>
                  <Button onClick={() => navigate('/personalized-course')} className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Начать курс
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Courses Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Мои курсы</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {user?.activeCourses && user.activeCourses.length > 0 ? (
              user.activeCourses.map((course) => {
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
                          onClick={() => {
                            const courseId = typeof course.id === 'number' ? course.id : parseInt(course.id);
                            if (!isNaN(courseId)) {
                              navigate(`/course/${courseId}`);
                            } else {
                              console.error('Invalid course ID:', course.id);
                            }
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Продолжить обучение
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">У вас пока нет активных курсов</h3>
                <p className="text-muted-foreground mb-6">
                  Начните изучение, выбрав курс из нашего каталога
                </p>
                <Button onClick={() => navigate('/available-courses')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Выбрать курс
                </Button>
              </div>
            )}
          </div>
        </div>


      </main>
    </div>
  );
};

export default CoursesPage;
