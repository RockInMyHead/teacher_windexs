import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Play,
  GraduationCap
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HeaderWithHero } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { COURSE_PLANS } from '@/utils/coursePlans';

// Старые hardcoded курсы для предметов, которых нет в COURSE_PLANS
// id должны совпадать с subjectToCourseId маппингом
const fallbackCourses = [
  {
    id: 4, // Математика
    icon: Calculator,
    title: "Математика",
    description: "От арифметики до высшей математики",
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
    id: 5, // Физика
    icon: Atom,
    title: "Физика",
    description: "От механики до квантовой физики",
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
    id: 6, // География
    icon: Globe,
    title: "География",
    description: "Мир, страны и природные явления",
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
    id: 7, // История
    icon: Clock,
    title: "История",
    description: "От древних цивилизаций до современности",
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
    id: 8, // Обществознание
    icon: Users,
    title: "Обществознание",
    description: "Общество, человек и социальные отношения",
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

// Функция для генерации доступных курсов из COURSE_PLANS + fallback
const generateAvailableCoursesFromPlans = () => {
  const subjectMap: { [key: string]: { courses: CoursePlan[], subjectName: string } } = {};

  // Группируем курсы по предметам
  COURSE_PLANS.forEach(course => {
    let subjectName = '';
    
    // Обработка разных форматов названий
    if (course.title.includes(' для ')) {
      const titleParts = course.title.split(' для ');
      if (titleParts.length === 2) {
        subjectName = titleParts[0];
      }
    } else if (course.title.includes(', ')) {
      // Формат "Английский язык, 6 класс"
      const titleParts = course.title.split(', ');
      if (titleParts.length >= 1) {
        subjectName = titleParts[0];
      }
    } else if (course.title.startsWith('История')) {
      // Специальная обработка для истории
      if (course.title.includes('История России')) {
        subjectName = 'История';
      } else if (course.title.includes('История')) {
        subjectName = 'История';
      }
    } else if (course.title.startsWith('Подготовка к')) {
      // Обработка экзаменационных курсов
      if (course.title.includes('ОГЭ по')) {
        const match = course.title.match(/ОГЭ по (.+)/);
        if (match) {
          subjectName = match[1].trim();
        }
      } else if (course.title.includes('ЕГЭ по')) {
        const match = course.title.match(/ЕГЭ по (.+)/);
        if (match) {
          subjectName = match[1].trim();
        }
      }
    }
    
    if (subjectName) {
      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = { courses: [], subjectName };
      }
      subjectMap[subjectName].courses.push(course);
    }
  });

  // Фиксированный маппинг предметов к courseId (должен совпадать с AssessmentLevel.tsx)
  const subjectToCourseId: { [key: string]: number } = {
    'Русский язык': 0,
    'Английский язык': 1,
    'Арабский язык': 2,
    'Китайский язык': 3,
    'Математика': 4,
    'Физика': 5,
    'География': 6,
    'История': 7,
    'Обществознание': 8
  };

  // Создаем массив доступных курсов из COURSE_PLANS в правильном порядке
  const coursesFromPlans = Object.keys(subjectToCourseId)
    .filter(subjectName => subjectMap[subjectName]) // только те, которые есть в subjectMap
    .map(subjectName => {
      const courses = subjectMap[subjectName].courses;
      const sortedCourses = courses.sort((a, b) => a.grade - b.grade);

      // Определяем иконку для предмета
      const getIconForSubject = (subject: string) => {
        switch (subject) {
          case 'Русский язык': return Languages;
          case 'Английский язык': return Languages;
          case 'Арабский язык': return Languages;
          case 'Китайский язык': return Languages;
          case 'Математика': return Calculator;
          case 'Физика': return Atom;
          case 'География': return Globe;
          case 'История': return Clock;
          case 'Обществознание': return Users;
          default: return BookOpen;
        }
      };

      // Определяем цвет для предмета
      const getColorForSubject = (subject: string) => {
        switch (subject) {
          case 'Русский язык': return 'from-red-500 to-pink-600';
          case 'Английский язык': return 'from-blue-500 to-blue-600';
          case 'Арабский язык': return 'from-green-500 to-green-600';
          case 'Китайский язык': return 'from-red-500 to-red-600';
          case 'Математика': return 'from-purple-500 to-purple-600';
          case 'Физика': return 'from-orange-500 to-orange-600';
          case 'География': return 'from-teal-500 to-teal-600';
          case 'История': return 'from-amber-500 to-amber-600';
          case 'Обществознание': return 'from-indigo-500 to-indigo-600';
          default: return 'from-gray-500 to-gray-600';
        }
      };

      // Создаем описание на основе доступных классов
      const grades = sortedCourses.map(c => c.grade);
      const minGrade = Math.min(...grades);
      const maxGrade = Math.max(...grades);
      const gradeRange = minGrade === maxGrade ? `${minGrade} класс` : `${minGrade}-${maxGrade} классы`;

      // Создаем features на основе уроков первого курса
      const firstCourse = sortedCourses[0];
      const features = firstCourse?.lessons.slice(0, 4).map(lesson => lesson.title) || [];

      return {
        id: subjectToCourseId[subjectName],
        icon: getIconForSubject(subjectName),
        title: subjectName,
        description: `Изучение ${subjectName.toLowerCase()} для ${gradeRange}`,
        level: minGrade <= 4 ? 'Начальный' : minGrade <= 9 ? 'Средний' : 'Старший',
        duration: `${Math.ceil(sortedCourses.length / 3)} месяцев`,
        students: `${(Math.random() * 10 + 1).toFixed(1)}K`,
        rating: 4.5 + Math.random() * 0.5,
        color: getColorForSubject(subjectName),
        features: features,
        price: 'Бесплатно',
        modules: sortedCourses.length,
        availableGrades: grades
      };
    });

  // Добавляем fallback курсы для предметов, которых нет в COURSE_PLANS
  const existingSubjects = coursesFromPlans.map(course => course.title);
  const additionalCourses = fallbackCourses.filter(course => !existingSubjects.includes(course.title));

  return [...coursesFromPlans, ...additionalCourses];
};

const availableCourses = generateAvailableCoursesFromPlans();

const AvailableCourses = () => {
  const { user, startCourse } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [customTopic, setCustomTopic] = useState('');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showGradeSelection, setShowGradeSelection] = useState(false);

  // Auto-select first course for grade if grade parameter is in URL
  useEffect(() => {
    const gradeParam = searchParams.get('grade');
    if (gradeParam) {
      const grade = parseInt(gradeParam);
      // Find first course that supports this grade
      const courseForGrade = availableCourses.find(course => 
        course.availableGrades && course.availableGrades.includes(grade)
      );
      
      if (courseForGrade) {
        // Auto-select and navigate to course select-mode
        const courseId = `${courseForGrade.id}-${grade}`;
        // Start course if not already active
        const isAlreadyActive = user?.activeCourses?.some(ac => ac.id === courseId);
        if (!isAlreadyActive) {
          const coursePlans = COURSE_PLANS.filter(cp => cp.title.includes(courseForGrade.title.split(' ')[0]));
          const specificPlan = coursePlans.find(cp => cp.grade === grade);
          if (specificPlan) {
            startCourse({
              id: courseId,
              title: specificPlan.title,
              description: specificPlan.description,
              progress: 0,
              level: courseForGrade.level,
              students: courseForGrade.students,
              color: courseForGrade.color,
              modules: specificPlan.lessons.length,
              completedModules: 0,
              icon: courseForGrade.icon.name,
              grade: grade
            });
          }
        }
        // Navigate to course select-mode
        navigate(`/course/${courseId}/select-mode`);
      }
    }
  }, [searchParams, navigate, startCourse, user]);

  const handleCreateCustomCourse = () => {
    if (!customTopic.trim()) return;

    setIsCreatingCustom(true);
    // Navigate to assessment with custom topic
    navigate(`/custom-assessment?topic=${encodeURIComponent(customTopic.trim())}`);
  };

  const handleCourseSelect = (course: any) => {
    // Если у курса нет доступных классов, показать ошибку
    if (!course.availableGrades || course.availableGrades.length === 0) {
      console.error('No available grades for course:', course.title);
      alert(`Для курса "${course.title}" пока нет доступных классов. Пожалуйста, выберите другой курс.`);
      return;
    }
    
    // Если у курса есть доступные классы, показать выбор класса
    if (course.availableGrades.length > 1) {
      setSelectedCourse(course);
      setShowGradeSelection(true);
    } else {
      // Если только один класс, сразу начать курс
      const grade = course.availableGrades[0];
      startCourseWithGrade(course, grade);
    }
  };

  const handleGradeSelect = (grade: number) => {
    if (selectedCourse) {
      startCourseWithGrade(selectedCourse, grade);
      setShowGradeSelection(false);
      setSelectedCourse(null);
    }
  };

  const startCourseWithGrade = (course: any, grade: number) => {
    const coursePlans = COURSE_PLANS.filter(cp => cp.title.includes(course.title.split(' ')[0]));
    const specificPlan = coursePlans.find(cp => cp.grade === grade);

    if (!specificPlan) {
      console.error('Course plan not found for grade:', grade);
      return;
    }

    const isAlreadyActive = user?.activeCourses?.some(ac => ac.id === `${course.id}-${grade}`);

    if (!isAlreadyActive) {
      console.log('Adding new course to active courses with specific grade');
      startCourse({
        id: `${course.id}-${grade}`,
        title: specificPlan.title, // Используем полное название с классом
        description: specificPlan.description,
        progress: 0,
        level: course.level,
        students: course.students,
        color: course.color,
        modules: specificPlan.lessons.length,
        completedModules: 0,
        icon: course.icon.name,
        grade: grade // Добавляем grade для дальнейшего использования
      });
    }

    // КРИТИЧНО: Очищаем старые данные курса из localStorage
    console.log('🧹 Clearing old course data from localStorage');
    localStorage.removeItem('selectedCourseData');
    localStorage.removeItem('currentCourse');
    localStorage.removeItem('currentLesson');
    localStorage.removeItem('courseInfo');
    localStorage.removeItem('lessonContext');

    // Сохраняем правильные данные выбранного курса
    const courseData = {
      id: `${course.id}-${grade}`,
      title: specificPlan.title,
      description: specificPlan.description,
      level: course.level,
      grade: grade,
      modules: specificPlan.lessons.length,
      color: course.color,
      icon: course.icon.name,
      students: course.students
    };

    console.log('💾 Saving new course data to localStorage:', courseData);
    localStorage.setItem('selectedCourseData', JSON.stringify(courseData));

    // Переходим сразу к выбору способа урока
    const courseId = `${course.id}-${grade}`;
    console.log('🧭 Navigating to course select-mode for course:', courseId);
    navigate(`/course/${courseId}/select-mode`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background overflow-x-hidden">
      {/* Header */}
      <HeaderWithHero />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Список <span className="text-primary">курсов</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Выберите предмет и начните персонализированное обучение с AI-ассистентом. Все курсы адаптируются под ваш уровень и темп обучения.
          </p>
        </div>

        {/* Custom Course Creator */}
        {/*
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
        */}

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
                      {Icon && <Icon className="w-8 h-8 text-white" />}
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
                  {/* Action Button */}
                  <Button
                    className="w-full group-hover:bg-primary/90 transition-colors"
                    onClick={() => handleCourseSelect(course)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {user?.activeCourses?.some(ac => ac.id.startsWith(course.id.toString()))
                      ? 'Продолжить обучение'
                      : 'Начать обучение'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Grade Selection Dialog */}
        <Dialog open={showGradeSelection} onOpenChange={setShowGradeSelection}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Выберите класс</DialogTitle>
              <DialogDescription>
                Выберите класс для обучения {selectedCourse?.title?.toLowerCase() || 'предмету'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {selectedCourse?.availableGrades?.map((grade: number) => (
                  <Button
                    key={grade}
                    variant="outline"
                    className="h-12 text-lg font-medium"
                    onClick={() => handleGradeSelect(grade)}
                  >
                    {grade} класс
                  </Button>
                ))}
              </div>

              {/* Начинаю учить button */}
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => {
                  // Выбрать первый доступный класс по умолчанию
                  if (selectedCourse?.availableGrades?.length > 0) {
                    handleGradeSelect(selectedCourse.availableGrades[0]);
                  }
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Начинаю учить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AvailableCourses;