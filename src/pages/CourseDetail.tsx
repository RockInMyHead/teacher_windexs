import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Target,
  Award,
  Zap,
  Book,
  MessageSquare,
  TestTube,
  Lock
} from 'lucide-react';

const courseDetails = {
  0: {
    title: "Русский язык",
    subtitle: "Углубленное изучение для носителей",
    description: "Академический курс русского языка и литературы для носителей, желающих углубить знания по филологии, литературе и лингвистике. Курс охватывает русскую литературу от XIX века до современности.",
    level: "Средний+",
    duration: "6 месяцев",
    students: "1.8K",
    rating: 4.8,
    color: "from-red-500 to-pink-600",
    icon: Languages,
    features: [
      "Русская литература XIX-XXI веков",
      "Литературный анализ и интерпретация",
      "Филология и лингвистика",
      "Стилистика и текстология",
      "Академическое исследование"
    ],
    modules: [
      {
        title: "Модуль 1: Русская литература XIX века",
        description: "Пушкин, Лермонтов, Гоголь, Тургенев, Достоевский, Толстой",
        lessons: 12,
        completed: false
      },
      {
        title: "Модуль 2: Серебряный век русской литературы",
        description: "Символизм, акмеизм, футуризм. Блок, Ахматова, Мандельштам, Булгаков",
        lessons: 10,
        completed: false
      },
      {
        title: "Модуль 3: Советская литература",
        description: "Социалистический реализм, авангард, диссидентская литература",
        lessons: 14,
        completed: false
      },
      {
        title: "Модуль 4: Современная русская литература",
        description: "Постмодернизм, метареализм, актуальная проза и поэзия",
        lessons: 10,
        completed: false
      },
      {
        title: "Модуль 5: Филология и лингвистика",
        description: "Текстология, стилистика, лингвистический анализ, методология исследования",
        lessons: 8,
        completed: false
      }
    ],
    skills: [
      "Глубокий анализ литературных произведений",
      "Филологическое исследование текстов",
      "Лингвистический анализ",
      "Академическое письмо",
      "Критическое мышление"
    ],
    requirements: [
      "Хороший уровень русского языка",
      "Базовые знания литературы",
      "Компьютер с доступом к интернету",
      "4-5 часов в неделю на изучение"
    ]
  },
  1: {
    title: "Английский язык",
    subtitle: "Комплексное изучение английского языка",
    description: "Полный курс английского языка от начального до продвинутого уровня. Вы освоите все аспекты языка: грамматику, лексику, разговорную практику и бизнес английский. Курс адаптируется под ваш уровень и темп обучения.",
    level: "Все уровни",
    duration: "6 месяцев",
    students: "12.5K",
    rating: 4.8,
    color: "from-blue-500 to-blue-600",
    icon: Languages,
    features: [
      "Разговорная практика - повседневные и профессиональные ситуации",
      "Грамматика - все времена и конструкции",
      "Словарный запас - 5000+ слов и выражений",
      "Бизнес английский - деловая переписка и переговоры"
    ],
    modules: [
      {
        title: "Модуль 1: Основы английского",
        description: "Алфавит, произношение, базовые фразы",
        lessons: 8,
        completed: false
      },
      {
        title: "Модуль 2: Грамматика для начинающих",
        description: "Present Simple, Present Continuous, основные конструкции",
        lessons: 12,
        completed: false
      },
      {
        title: "Модуль 3: Развитие словарного запаса",
        description: "Тематический словарь, идиомы, фразовые глаголы",
        lessons: 10,
        completed: false
      },
      {
        title: "Модуль 4: Разговорная практика",
        description: "Ежедневные ситуации, ролевые игры",
        lessons: 15,
        completed: false
      },
      {
        title: "Модуль 5: Продвинутая грамматика",
        description: "Past tenses, Future tenses, условные предложения",
        lessons: 18,
        completed: false
      },
      {
        title: "Модуль 6: Бизнес английский",
        description: "Деловая переписка, презентации, переговоры",
        lessons: 12,
        completed: false
      }
    ],
    skills: [
      "Свободное общение на английском",
      "Чтение и понимание текстов",
      "Письменная коммуникация",
      "Понимание речи на слух",
      "Бизнес английский"
    ],
    requirements: [
      "Компьютер или смартфон с доступом к интернету",
      "Наушники для аудио материалов",
      "3-4 часа в неделю на занятия"
    ]
  },
  2: {
    title: "Арабский язык",
    subtitle: "Изучение современного арабского языка",
    description: "Курс современного арабского языка с акцентом на разговорную практику. Вы научитесь читать и писать арабскую вязь, понимать современную арабскую речь и общаться в повседневных ситуациях.",
    level: "Начинающий",
    duration: "8 месяцев",
    students: "3.2K",
    rating: 4.7,
    color: "from-green-500 to-green-600",
    icon: Languages,
    features: [
      "Современный арабский - фusha и 'ammiyya",
      "Культура - традиции и обычаи арабского мира",
      "Письмо - арабская вязь и каллиграфия",
      "Фонетика - правильное произношение"
    ],
    modules: [
      {
        title: "Модуль 1: Арабский алфавит",
        description: "Знакомство с буквами и основами письма",
        lessons: 10,
        completed: false
      },
      {
        title: "Модуль 2: Фонетика и произношение",
        description: "Особенности арабской фонетики",
        lessons: 8,
        completed: false
      },
      {
        title: "Модуль 3: Базовая грамматика",
        description: "Основы арабской грамматики",
        lessons: 12,
        completed: false
      },
      {
        title: "Модуль 4: Разговорная практика",
        description: "Ежедневные ситуации и диалоги",
        lessons: 15,
        completed: false
      }
    ],
    skills: [
      "Чтение арабской вязи",
      "Письменная коммуникация",
      "Устная речь на арабском",
      "Понимание арабской культуры"
    ],
    requirements: [
      "Компьютер с поддержкой арабского шрифта",
      "Наушники для аудио практики",
      "4-5 часов в неделю на изучение"
    ]
  },
  3: {
    title: "Китайский язык",
    subtitle: "Изучение китайского языка с иероглификой",
    description: "Полный курс китайского языка с акцентом на иероглифику и разговорную речь. Вы освоите чтение и письмо иероглифов, тоны произношения и сможете общаться на повседневные темы.",
    level: "Начинающий",
    duration: "10 месяцев",
    students: "4.1K",
    rating: 4.6,
    color: "from-red-500 to-red-600",
    icon: Languages,
    features: [
      "Иероглифика - чтение и письмо 500+ иероглифов",
      "Пиньинь - транскрибационная система",
      "HSK подготовка - сертификационный экзамен",
      "Культура - традиции и обычаи Китая"
    ],
    modules: [
      {
        title: "Модуль 1: Пиньинь и тоны",
        description: "Фонетика китайского языка",
        lessons: 12,
        completed: false
      },
      {
        title: "Модуль 2: Основные иероглифы",
        description: "Первые 150 иероглифов",
        lessons: 15,
        completed: false
      },
      {
        title: "Модуль 3: Базовая грамматика",
        description: "Основы китайской грамматики",
        lessons: 18,
        completed: false
      },
      {
        title: "Модуль 4: Разговорная практика",
        description: "Ежедневные ситуации на китайском",
        lessons: 20,
        completed: false
      }
    ],
    skills: [
      "Чтение и письмо иероглифов",
      "Правильное произношение с тонами",
      "Устная коммуникация",
      "Понимание китайской культуры"
    ],
    requirements: [
      "Компьютер с поддержкой китайских шрифтов",
      "Наушники для практики произношения",
      "5-6 часов в неделю на занятия"
    ]
  },
  4: {
    title: "Математика",
    subtitle: "Полный курс математики от арифметики до высшей",
    description: "Комплексный курс математики, охватывающий все уровни от базовой арифметики до высшей математики. Курс включает алгебру, геометрию, тригонометрию и математический анализ.",
    level: "Все уровни",
    duration: "12 месяцев",
    students: "8.7K",
    rating: 4.9,
    color: "from-purple-500 to-purple-600",
    icon: Calculator,
    features: [
      "Алгебра - уравнения, функции, матрицы",
      "Геометрия - плоскость и пространство",
      "Тригонометрия - углы, синусы, косинусы",
      "Математический анализ - пределы, производные, интегралы"
    ],
    modules: [
      {
        title: "Модуль 1: Арифметика и алгебра",
        description: "Основы математики и алгебраические операции",
        lessons: 20,
        completed: false
      },
      {
        title: "Модуль 2: Геометрия",
        description: "Планиметрия и стереометрия",
        lessons: 25,
        completed: false
      },
      {
        title: "Модуль 3: Тригонометрия",
        description: "Тригонометрические функции и тождества",
        lessons: 15,
        completed: false
      },
      {
        title: "Модуль 4: Математический анализ",
        description: "Пределы, производные, интегралы",
        lessons: 30,
        completed: false
      }
    ],
    skills: [
      "Решение алгебраических задач",
      "Геометрические построения",
      "Тригонометрические расчеты",
      "Дифференцирование и интегрирование"
    ],
    requirements: [
      "Базовые знания математики",
      "Калькулятор (желательно)",
      "Тетрадь для решения задач",
      "4-5 часов в неделю на практику"
    ]
  },
  5: {
    title: "Физика",
    subtitle: "Изучение физики от механики до квантовой",
    description: "Полный курс физики, охватывающий все разделы от классической механики до квантовой физики. Курс включает теоретические основы и практические эксперименты.",
    level: "Средний+",
    duration: "9 месяцев",
    students: "5.3K",
    rating: 4.8,
    color: "from-orange-500 to-orange-600",
    icon: Atom,
    features: [
      "Механика - законы Ньютона, энергия, импульс",
      "Электричество - цепи, магнетизм, электромагнетизм",
      "Оптика - свет, линзы, волновая оптика",
      "Квантовая физика - атомы, фотоэффект, волновые функции"
    ],
    modules: [
      {
        title: "Модуль 1: Механика",
        description: "Кинематика, динамика, законы сохранения",
        lessons: 15,
        completed: false
      },
      {
        title: "Модуль 2: Молекулярная физика",
        description: "Термодинамика, газовые законы",
        lessons: 12,
        completed: false
      },
      {
        title: "Модуль 3: Электричество и магнетизм",
        description: "Электрические цепи, электромагнитное поле",
        lessons: 18,
        completed: false
      },
      {
        title: "Модуль 4: Оптика и квантовая физика",
        description: "Волновая оптика, атомная физика",
        lessons: 20,
        completed: false
      }
    ],
    skills: [
      "Решение физических задач",
      "Проведение экспериментов",
      "Понимание физических явлений",
      "Применение физики в жизни"
    ],
    requirements: [
      "Базовые знания математики",
      "Возможность проведения простых экспериментов",
      "Калькулятор для расчетов",
      "3-4 часа в неделю на занятия"
    ]
  },
  6: {
    title: "География",
    subtitle: "Изучение географии мира и природных явлений",
    description: "Комплексный курс географии, включающий физическую и политическую географию мира. Вы изучите континенты, страны, природные зоны и глобальные процессы.",
    level: "Все уровни",
    duration: "6 месяцев",
    students: "3.8K",
    rating: 4.5,
    color: "from-teal-500 to-teal-600",
    icon: Globe,
    features: [
      "Физическая география - рельеф, климат, почвы",
      "Политическая карта - страны и столицы мира",
      "Климатология - погодные явления и зоны",
      "Экономическая география - ресурсы и хозяйство"
    ],
    modules: [
      {
        title: "Модуль 1: Общее землеведение",
        description: "Форма Земли, движение планеты",
        lessons: 8,
        completed: false
      },
      {
        title: "Модуль 2: Физическая география",
        description: "Рельеф, климат, природные зоны",
        lessons: 15,
        completed: false
      },
      {
        title: "Модуль 3: Политическая география",
        description: "Страны, границы, столицы",
        lessons: 12,
        completed: false
      },
      {
        title: "Модуль 4: Экономическая география",
        description: "Ресурсы, хозяйство, глобализация",
        lessons: 10,
        completed: false
      }
    ],
    skills: [
      "Знание географии мира",
      "Понимание природных процессов",
      "Анализ географических карт",
      "Изучение культур разных народов"
    ],
    requirements: [
      "Географическая карта мира (желательно)",
      "Доступ к интернету для поиска информации",
      "2-3 часа в неделю на изучение"
    ]
  },
  7: {
    title: "История",
    subtitle: "История человечества от древности до современности",
    description: "Полный курс истории человечества от древних цивилизаций до наших дней. Курс охватывает все континенты и ключевые исторические события, формировавшие мир.",
    level: "Все уровни",
    duration: "8 месяцев",
    students: "6.2K",
    rating: 4.7,
    color: "from-amber-500 to-amber-600",
    icon: Clock,
    features: [
      "Древний мир - цивилизации Месопотамии, Египта, Греции",
      "Средние века - феодализм, Возрождение, открытия",
      "Новое время - революции, колониализм, индустриализация",
      "История России - от Киевской Руси до современности"
    ],
    modules: [
      {
        title: "Модуль 1: Древний мир",
        description: "Первые цивилизации и античность",
        lessons: 15,
        completed: false
      },
      {
        title: "Модуль 2: Средние века",
        description: "Феодализм, Возрождение, Великие открытия",
        lessons: 18,
        completed: false
      },
      {
        title: "Модуль 3: Новое время",
        description: "Революции, индустриализация, колониализм",
        lessons: 20,
        completed: false
      },
      {
        title: "Модуль 4: Новейшая история",
        description: "XX-XXI века, глобализация",
        lessons: 22,
        completed: false
      }
    ],
    skills: [
      "Знание ключевых исторических событий",
      "Понимание исторических процессов",
      "Анализ причинно-следственных связей",
      "Критическое мышление"
    ],
    requirements: [
      "Базовые знания истории желательны",
      "Тетрадь для конспектов",
      "Доступ к дополнительным источникам",
      "3-4 часа в неделю на занятия"
    ]
  }
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const courseId = parseInt(id || '0');
  const course = courseDetails[courseId as keyof typeof courseDetails];

  // Debug logging
  console.log('CourseDetail: received id param:', id);
  console.log('CourseDetail: parsed courseId:', courseId, 'isNaN:', isNaN(courseId));
  console.log('CourseDetail: course found:', !!course);

  if (!course || isNaN(courseId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Курс не найден</h1>
          <p className="text-muted-foreground mb-4">
            {isNaN(courseId) ? `Некорректный ID курса: ${id}` : `Курс с ID ${courseId} не существует.`}
          </p>
          <Button onClick={() => navigate('/available-courses')}>
            Вернуться к курсам
          </Button>
        </div>
      </div>
    );
  }

  // Логика для английского языка - последний модуль доступен только после тестирования
  const hasPassedAssessment = user?.assessmentResult !== undefined;
  const isEnglishCourse = courseId === 1; // Английский язык имеет id: 1

  // Фильтруем модули для английского курса
  const visibleModules = isEnglishCourse && !hasPassedAssessment
    ? course.modules.slice(0, -1) // Показываем все кроме последнего
    : course.modules;

  // Debug logging
  console.log('CourseDetail: id from params:', id);
  console.log('CourseDetail: parsed courseId:', courseId);
  console.log('CourseDetail: course found:', course?.title);

  const Icon = course.icon;

  const handleStartAssessment = () => {
    // Здесь будет логика для начала тестирования
    navigate(`/assessment?courseId=${courseId}`);
  };

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
                onClick={() => navigate('/available-courses')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад к курсам
              </Button>
            </div>

            {/* Right side - Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold">Windexs-Учитель</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className={`w-20 h-20 bg-gradient-to-br ${course.color} rounded-3xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold">{course.title}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-medium">{course.rating}</span>
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-4">{course.subtitle}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{course.level}</Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {course.students} студентов
                </div>
                <div className="flex items-center gap-2 font-medium text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Бесплатно
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                О курсе
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{course.description}</p>
            </CardContent>
          </Card>

          {/* Assessment CTA */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Готовы начать?</h3>
                  <p className="text-muted-foreground mb-4">
                    Пройдите тест оценки знаний, чтобы мы могли подобрать оптимальный план обучения
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TestTube className="w-4 h-4" />
                      15 вопросов
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      10 минут
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Персонализация
                    </div>
                  </div>
                </div>
                <Button size="lg" onClick={handleStartAssessment} className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Пройти тест
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* What You'll Learn */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Что вы изучите
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {course.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Skills You'll Gain */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Навыки, которые вы получите
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Modules */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Структура курса
              </CardTitle>
              <CardDescription>
                Курс разделен на логические модули для постепенного освоения материала
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visibleModules.map((module, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{module.title}</h4>
                      <Badge variant="secondary">{module.lessons} уроков</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{module.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Progress value={0} className="flex-1 h-2" />
                      <span>0%</span>
                    </div>
                  </div>
                ))}

                {/* Показываем заблокированный модуль для английского курса, если тест не пройден */}
                {isEnglishCourse && !hasPassedAssessment && course.modules.length > visibleModules.length && (
                  <div className="border border-dashed border-muted-foreground/30 rounded-lg p-4 bg-muted/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-muted-foreground flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        {course.modules[course.modules.length - 1].title}
                      </h4>
                      <Badge variant="outline" className="text-muted-foreground">
                        {course.modules[course.modules.length - 1].lessons} уроков
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {course.modules[course.modules.length - 1].description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Progress value={0} className="flex-1 h-2 opacity-50" />
                      <span>Заблокировано</span>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      🔒 Доступна только после прохождения тестового тестирования
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Требования к участникам
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Начните свое путешествие в мир {course.title.toLowerCase()}!
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Пройдите тест оценки знаний, и мы создадим персональную программу обучения,
                адаптированную именно под ваш уровень и цели.
              </p>
              <Button size="lg" onClick={handleStartAssessment} className="px-8">
                <TestTube className="w-5 h-5 mr-2" />
                Пройти тест оценки знаний
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
