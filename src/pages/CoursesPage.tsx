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
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <CardHeader className="pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Активных курсов</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl sm:text-2xl font-bold">{user?.stats?.activeCourses || 0}</div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Завершено модулей</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl sm:text-2xl font-bold">{user?.stats?.completedModules || 0}</div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Средний прогресс</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl sm:text-2xl font-bold">{user?.stats?.averageProgress || 0}%</div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Достижения</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl sm:text-2xl font-bold">{user?.stats?.achievements || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Course */}
        {user?.personalizedCourse && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Ваш персонализированный курс
            </h2>
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{user.personalizedCourse.title}</CardTitle>
                    <CardDescription className="mt-2">{user.personalizedCourse.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {user.personalizedCourse.difficulty === 'beginner' ? 'Начинающий' :
                     user.personalizedCourse.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Topics */}
                  <div>
                    <h4 className="font-semibold mb-3">Ключевые темы:</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.personalizedCourse.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Модулей:</span>
                        <span className="font-medium">{user.personalizedCourse.modules.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Примерное время:</span>
                        <span className="font-medium">{user.personalizedCourse.estimatedHours} часов</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modules Preview */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Структура курса:</h4>
                  <div className="space-y-2">
                    {user.personalizedCourse.modules.slice(0, 3).map((module, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{module.title}</p>
                          <p className="text-xs text-muted-foreground">{module.lessons.length} уроков</p>
                        </div>
                      </div>
                    ))}
                    {user.personalizedCourse.modules.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        ... и ещё {user.personalizedCourse.modules.length - 3} модулей
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button onClick={() => navigate('/personalized-course')} className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Начать персонализированный курс
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
