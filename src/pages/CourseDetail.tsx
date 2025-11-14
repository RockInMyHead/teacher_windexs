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
import Header from '@/components/Header';

const courseDetails = {
  0: {
    title: "Русский язык",
    subtitle: "Персонализированное обучение для носителей",
    description: "Индивидуальная программа изучения русского языка, адаптированная под ваш уровень и личные цели. На основе результатов тестирования мы создадим персональный курс с фокусом на исправление ваших индивидуальных ошибок и развитие слабых сторон.",
    level: "Персональный",
    duration: "Индивидуально",
    students: "Адаптивно",
    rating: 5.0,
    color: "from-red-500 to-pink-600",
    icon: Languages,
    features: [
      "Персонализированные уроки на основе ваших ошибок",
      "Адаптация под ваш уровень владения языком",
      "Фокус на индивидуальных проблемных темах",
      "Интерактивные упражнения и практика",
      "Постоянное отслеживание прогресса"
    ],
    modules: [
      {
        title: "Модуль будет создан персонально",
        description: "После прохождения тестирования мы создадим индивидуальные модули, адаптированные под ваши нужды и ошибки",
        lessons: 0,
        completed: false
      }
    ],
    skills: [
      "Исправление индивидуальных ошибок",
      "Углубление понимания русского языка",
      "Развитие языковой интуиции",
      "Повышение грамотности письма",
      "Уверенное владение языком"
    ],
    requirements: [
      "Доступ к компьютеру или смартфону",
      "Готовность пройти начальное тестирование",
      "Желание развиваться и исправлять ошибки",
      "Регулярная практика 15-30 минут в день"
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
    // Проверить аутентификацию перед переходом в чат
    if (!user) {
      // Если пользователь не аутентифицирован, перенаправить на страницу входа
      navigate('/auth', { state: { redirectTo: `/chat?courseId=${courseId}&start=true&mode=adaptive` } });
      return;
    }

    // Начать адаптивное обучение с интервью
    navigate(`/chat?courseId=${courseId}&start=true&mode=adaptive`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <Header />

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

          {/* Assessment CTA */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Готовы начать обучение?</h3>
                  <p className="text-muted-foreground mb-4">
                    Начните персонализированное обучение с AI-учителем, который адаптируется под ваш уровень и цели
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      Чат с AI-учителем
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Гибкое расписание
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Персонализация
                    </div>
                  </div>
                </div>
                  <div className="flex gap-3">
                  <Button size="lg" onClick={handleStartAssessment} className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Начать обучение
                </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate('/chat')}
                      className="flex items-center gap-2 border-2 hover:bg-primary hover:text-primary-foreground"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Online-урок
                    </Button>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>


      </main>
    </div>
  );
};

export default CourseDetail;
