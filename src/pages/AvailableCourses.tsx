import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Languages,
  Calculator,
  Atom,
  Globe,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  Brain,
  Star,
  CheckCircle,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const availableCourses = [
  {
    id: 0,
    icon: Languages,
    title: "Русский язык",
    description: "Углубленное изучение русского языка для носителей: литература, стилистика, филология и лингвистический анализ",
    level: "Средний+",
    duration: "6 месяцев",
    students: "1.8K",
    rating: 4.8,
    color: "from-red-500 to-pink-600",
    features: ["Литературный анализ", "Стилистика и риторика", "Филология", "Лингвистика", "Русская литература"],
    price: "Бесплатно",
    modules: 5
  },
  {
    id: 1,
    icon: Languages,
    title: "Английский язык",
    description: "Комплексное изучение английского языка от начального до продвинутого уровня с AI-ассистентом",
    level: "Все уровни",
    duration: "6 месяцев",
    students: "12.5K",
    rating: 4.8,
    color: "from-blue-500 to-blue-600",
    features: ["Разговорная практика", "Грамматика", "Словарный запас", "Бизнес английский"],
    price: "Бесплатно",
    modules: 6
  },
  {
    id: 2,
    icon: Languages,
    title: "Арабский язык",
    description: "Изучение современного арабского языка с фокусом на разговорную практику",
    level: "Начинающий",
    duration: "8 месяцев",
    students: "3.2K",
    rating: 4.7,
    color: "from-green-500 to-green-600",
    features: ["Современный арабский", "Культура", "Письмо", "Фонетика"],
    price: "Бесплатно",
    modules: 4
  },
  {
    id: 3,
    icon: Languages,
    title: "Китайский язык",
    description: "Изучение китайского языка с упором на иероглифику и разговорную речь",
    level: "Начинающий",
    duration: "10 месяцев",
    students: "4.1K",
    rating: 4.6,
    color: "from-red-500 to-red-600",
    features: ["Иероглифика", "Пиньинь", "HSK подготовка", "Культура"],
    price: "Бесплатно",
    modules: 4
  },
  {
    id: 4,
    icon: Calculator,
    title: "Математика",
    description: "Полный курс математики от арифметики до высшей математики",
    level: "Все уровни",
    duration: "12 месяцев",
    students: "8.7K",
    rating: 4.9,
    color: "from-purple-500 to-purple-600",
    features: ["Алгебра", "Геометрия", "Тригонометрия", "Математический анализ"],
    price: "Бесплатно",
    modules: 4
  },
  {
    id: 5,
    icon: Atom,
    title: "Физика",
    description: "Изучение физики от механики до квантовой физики",
    level: "Средний+",
    duration: "9 месяцев",
    students: "5.3K",
    rating: 4.8,
    color: "from-orange-500 to-orange-600",
    features: ["Механика", "Электричество", "Оптика", "Квантовая физика"],
    price: "Бесплатно",
    modules: 4
  },
  {
    id: 6,
    icon: Globe,
    title: "География",
    description: "Изучение географии мира, стран и природных явлений",
    level: "Все уровни",
    duration: "6 месяцев",
    students: "3.8K",
    rating: 4.5,
    color: "from-teal-500 to-teal-600",
    features: ["Физическая география", "Политическая карта", "Климат", "Экономика"],
    price: "Бесплатно",
    modules: 4
  },
  {
    id: 7,
    icon: Clock,
    title: "История",
    description: "История человечества от древних цивилизаций до современности",
    level: "Все уровни",
    duration: "8 месяцев",
    students: "6.2K",
    rating: 4.7,
    color: "from-amber-500 to-amber-600",
    features: ["Древний мир", "Средние века", "Новое время", "История России"],
    price: "Бесплатно",
    modules: 4
  },
  {
    id: 8,
    icon: Users,
    title: "Обществознание",
    description: "Изучение общества, человека и социальных отношений. Психология, социология, право, экономика и философия",
    level: "Все уровни",
    duration: "7 месяцев",
    students: "4.9K",
    rating: 4.6,
    color: "from-indigo-500 to-indigo-600",
    features: ["Социология", "Психология", "Право", "Экономика", "Философия"],
    price: "Бесплатно",
    modules: 5
  }
];

const AvailableCourses = () => {
  const { user, startCourse } = useAuth();
  const navigate = useNavigate();
  const [customTopic, setCustomTopic] = useState('');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  const handleCreateCustomCourse = () => {
    if (!customTopic.trim()) return;

    setIsCreatingCustom(true);
    // Navigate to assessment with custom topic
    navigate(`/custom-assessment?topic=${encodeURIComponent(customTopic.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Доступные <span className="text-primary">курсы</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Выберите предмет и начните персонализированное обучение с AI-ассистентом.
            Все курсы адаптируются под ваш уровень и темп обучения.
          </p>

          {/* Custom Course Creator */}
          <div className="max-w-md mx-auto mb-8">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Создать свой курс</h3>
                  <p className="text-sm text-muted-foreground">
                    Введите любую тему и мы создадим персонализированный курс обучения
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="custom-topic" className="text-sm font-medium">
                      Тема курса
                    </Label>
                    <Input
                      id="custom-topic"
                      placeholder="Например: 'Машинное обучение', 'Фотография', 'Йога'..."
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateCustomCourse()}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleCreateCustomCourse}
                    disabled={!customTopic.trim() || isCreatingCustom}
                    className="w-full"
                  >
                    {isCreatingCustom ? 'Создание курса...' : 'Создать персонализированный курс'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {availableCourses.map((course, index) => {
            const Icon = course.icon;
            return (
              <Card
                key={course.id}
                className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border-2 hover:border-primary/50 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>

                  <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>

                  <CardDescription className="text-base leading-relaxed">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Course Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {course.students}
                    </div>
                    <div className="flex items-center gap-2 font-medium text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      {course.price}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Что вы изучите:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                      <Button
                        className="w-full group-hover:bg-primary/90 transition-colors"
                        onClick={() => {
                          // Добавить курс в активные курсы пользователя
                          startCourse({
                            id: course.id.toString(),
                            title: course.title,
                            description: course.description,
                            progress: 0,
                            level: course.level,
                            students: course.students,
                            color: course.color,
                            modules: course.modules || 10, // fallback value
                            completedModules: 0,
                            icon: course.icon.name // Convert icon component to string name
                          });

                          // Всегда вести на страницу выбранного курса
                          navigate(`/course/${course.id}`);
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {user?.activeCourses?.some(ac => ac.id === course.id.toString())
                          ? 'Продолжить обучение'
                          : 'Начать обучение'}
                      </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AvailableCourses;
