import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Phone, PhoneOff, ChevronLeft, ChevronRight, Target, Users, Clock, Star, X } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { OpenAITTS } from '@/lib/openaiTTS';
import { VoiceComm } from '@/lib/voiceComm';

interface CourseData {
  id: number;
  title: string;
  description: string;
  level: string;
  grade: string;
  progress: number;
  modules: number;
  completedModules: number;
  students: number;
  currentLesson?: {
    number: number;
    title: string;
    topic: string;
    content: string;
  };
}

export default function CourseDetail() {
  const { courseId, mode } = useParams<{ courseId: string; mode?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLessonNumber, setCurrentLessonNumber] = useState(1);
  const [learningPlan, setLearningPlan] = useState<any>(null);

  // Debug logging
  console.log('🎯 CourseDetail rendered:', { courseId, mode });

  // Voice call states
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'teacher' | 'student', text: string}>>([]);
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
  const [isLessonSpeaking, setIsLessonSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef<number>(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const historyRef = useRef(conversationHistory);

  // Mock lessons data based on course subject
  const getMockLesson = (lessonNumber: number, courseTitle?: string) => {
    // Определяем предмет по названию курса
    let subject = 'general';
    if (courseTitle) {
      console.log('🔍 Determining subject for courseTitle:', courseTitle, 'lowercased:', courseTitle.toLowerCase());
      if (courseTitle.toLowerCase().includes('физик')) {
        subject = 'physics';
      } else if (courseTitle.toLowerCase().includes('математик')) {
        subject = 'math';
        console.log('✅ Detected math subject for course:', courseTitle);
      } else if (courseTitle.toLowerCase().includes('хими')) {
        subject = 'chemistry';
      } else if (courseTitle.toLowerCase().includes('биологи')) {
        subject = 'biology';
      } else if (courseTitle.toLowerCase().includes('истори')) {
        subject = 'history';
      } else if (courseTitle.toLowerCase().includes('обществознани')) {
        subject = 'social_studies';
      } else if (courseTitle.toLowerCase().includes('литератур')) {
        subject = 'literature';
      } else if (courseTitle.toLowerCase().includes('английск') || courseTitle.toLowerCase().includes('english')) {
        subject = 'english';
      } else if (courseTitle.toLowerCase().includes('арабск')) {
        subject = 'arabic';
      }
      console.log('📚 Determined subject:', subject, 'for courseTitle:', courseTitle);
    }

    const lessonsBySubject: { [key: string]: any[] } = {
      biology: [
        {
          number: 1,
          title: 'Введение в биологию ОГЭ',
          topic: 'Основные понятия и термины',
          content: 'Знакомство с основными понятиями и терминами биологии ОГЭ. Клетка, ткани, органы, организмы. Подготовка к успешной сдаче экзамена.'
        },
        {
          number: 2,
          title: 'Клетка - основа жизни',
          topic: 'Строение и функции клетки',
          content: 'Строение растительной и животной клетки. Клеточная оболочка, цитоплазма, ядро. Органоиды клетки и их функции.'
        },
        {
          number: 3,
          title: 'Размножение и развитие организмов',
          topic: 'Бесполое и половое размножение',
          content: 'Типы размножения организмов. Митоз и мейоз. Оплодотворение, эмбриональное развитие.'
        },
        {
          number: 4,
          title: 'Наследственность и изменчивость',
          topic: 'Законы Менделя',
          content: 'Основные закономерности наследственности. Гены и хромосомы. Типы изменчивости.'
        },
        {
          number: 5,
          title: 'Эволюция',
          topic: 'Теории эволюции',
          content: 'Доказательства эволюции. Движущие силы эволюции. Видообразование.'
        },
        {
          number: 6,
          title: 'Царства живой природы',
          topic: 'Бактерии, грибы, растения, животные',
          content: 'Характеристика основных царств живой природы. Классификация организмов.'
        },
        {
          number: 7,
          title: 'Человек и его здоровье',
          topic: 'Системы органов человека',
          content: 'Строение и функции основных систем органов. Здоровье человека и факторы его определяющие.'
        },
        {
          number: 8,
          title: 'Экосистемы и среда обитания',
          topic: 'Взаимосвязи в экосистемах',
          content: 'Пищевые цепи и сети. Круговорот веществ. Влияние человека на экосистемы.'
        },
        {
          number: 9,
          title: 'Биосфера и человек',
          topic: 'Глобальные экологические проблемы',
          content: 'Биосфера Земли. Антропогенное воздействие на природу. Охрана окружающей среды.'
        },
        {
          number: 10,
          title: 'Биотехнологии',
          topic: 'Современные биотехнологии',
          content: 'Генетическая инженерия, клонирование, биотехнологии в медицине и сельском хозяйстве.'
        }
      ],
      math: [
        {
          number: 1,
          title: 'Введение в математику ЕГЭ',
          topic: 'Основные понятия и термины',
          content: 'Знакомство с основными понятиями и терминами математики ЕГЭ. Числа, множества, функции. Подготовка к успешной сдаче экзамена.'
        },
        {
          number: 2,
          title: 'Алгебраические преобразования',
          topic: 'Тождественные преобразования выражений',
          content: 'Преобразование алгебраических выражений, приведение подобных слагаемых, разложение на множители. Практика решения задач.'
        },
        {
          number: 3,
          title: 'Уравнения и неравенства',
          topic: 'Линейные и квадратные уравнения',
          content: 'Решение линейных уравнений, квадратных уравнений, систем уравнений. Графическое решение неравенств.'
        },
        {
          number: 4,
          title: 'Функции и графики',
          topic: 'Линейные и квадратичные функции',
          content: 'Изучение свойств линейных и квадратичных функций, построение графиков, нахождение экстремумов.'
        },
        {
          number: 5,
          title: 'Тригонометрия',
          topic: 'Тригонометрические функции и тождества',
          content: 'Синус, косинус, тангенс. Основные тригонометрические тождества и их применение в задачах.'
        },
        {
          number: 6,
          title: 'Геометрия на плоскости',
          topic: 'Треугольники и четырехугольники',
          content: 'Свойства треугольников, прямоугольников, параллелограммов. Теоремы Пифагора, косинусов, синусов.'
        },
        {
          number: 7,
          title: 'Геометрия в пространстве',
          topic: 'Тела и поверхности',
          content: 'Призма, пирамида, цилиндр, конус, шар. Площади поверхностей и объемы тел.'
        },
        {
          number: 8,
          title: 'Векторы и координаты',
          topic: 'Векторная алгебра',
          content: 'Действия с векторами, скалярное и векторное произведение, координаты в пространстве.'
        },
        {
          number: 9,
          title: 'Производные и интегралы',
          topic: 'Основы математического анализа',
          content: 'Понятие производной, правила дифференцирования, нахождение первообразных и определенных интегралов.'
        },
        {
          number: 10,
          title: 'Теория вероятностей',
          topic: 'Элементы комбинаторики и вероятности',
          content: 'Комбинаторные правила, классическая вероятность, геометрическая вероятность.'
        }
      ],
      physics: [
        {
          number: 1,
          title: 'Введение в физику',
          topic: 'Что изучает физика',
          content: 'Основные понятия физики, физические явления и величины. Измерение физических величин.'
        },
        {
          number: 2,
          title: 'Механика: основы движения',
          topic: 'Кинематика',
          content: 'Механическое движение, траектория, путь и перемещение. Равномерное и равноускоренное движение.'
        },
        {
          number: 3,
          title: 'Силы и взаимодействие',
          topic: 'Динамика',
          content: 'Силы, виды сил, закон Ньютона. Сила тяжести, вес, сила трения.'
        },
        {
          number: 4,
          title: 'Работа и энергия',
          topic: 'Энергетика',
          content: 'Механическая работа, мощность, кинетическая и потенциальная энергия.'
        },
        {
          number: 5,
          title: 'Давление жидкостей и газов',
          topic: 'Гидростатика',
          content: 'Давление в жидкостях и газах. Закон Паскаля, Архимеда.'
        },
        {
          number: 6,
          title: 'Электричество и магнетизм',
          topic: 'Электродинамика',
          content: 'Электрический ток, сопротивление, электрические цепи. Магнитное поле и электромагнитная индукция.'
        },
        {
          number: 7,
          title: 'Оптика',
          topic: 'Свет и оптические явления',
          content: 'Распространение света, отражение и преломление. Линзы и оптические приборы.'
        },
        {
          number: 8,
          title: 'Колебания и волны',
          topic: 'Механические колебания',
          content: 'Гармонические колебания, маятники. Звуковые волны и их свойства.'
        },
        {
          number: 9,
          title: 'Тепловые явления',
          topic: 'Термодинамика',
          content: 'Внутренняя энергия, теплопередача, агрегатные состояния вещества.'
        },
        {
          number: 10,
          title: 'Атомная и ядерная физика',
          topic: 'Строение атома',
          content: 'Строение атома, радиоактивность, ядерные реакции.'
        }
      ],
      social_studies: [
        {
          number: 1,
          title: 'Введение в обществознание',
          topic: 'Человек и общество',
          content: 'Общество как система, социальные связи, нормы и ценности.'
        },
        {
          number: 2,
          title: 'Политика и власть',
          topic: 'Политическая сфера общества',
          content: 'Государство: сущность и функции. Политическая система РФ.'
        },
        {
          number: 3,
          title: 'Демократия и гражданское участие',
          topic: 'Демократический процесс',
          content: 'Избирательная система и выборы. Гражданские права и обязанности.'
        },
        {
          number: 4,
          title: 'Экономика и труд',
          topic: 'Экономическая сфера',
          content: 'Основы рыночной экономики, собственность, предпринимательство.'
        },
        {
          number: 5,
          title: 'Социальные отношения',
          topic: 'Социальная сфера',
          content: 'Социальные группы, семья, образование, культура.'
        },
        {
          number: 6,
          title: 'Право и правовые отношения',
          topic: 'Правовая сфера',
          content: 'Основы права, конституция, юридическая ответственность.'
        },
        {
          number: 7,
          title: 'Международные отношения',
          topic: 'Глобализация и международное сотрудничество',
          content: 'Международные организации, глобальные проблемы современности.'
        },
        {
          number: 8,
          title: 'Человек в современном мире',
          topic: 'Личность и общество',
          content: 'Самореализация личности, социализация, жизненные ценности.'
        },
        {
          number: 9,
          title: 'Наука и техника в обществе',
          topic: 'Научно-технический прогресс',
          content: 'Влияние науки и техники на развитие общества.'
        },
        {
          number: 10,
          title: 'Культура и духовная жизнь',
          topic: 'Культурное наследие',
          content: 'Формы культуры, культурные традиции, искусство.'
        }
      ],
      english: [
        {
          number: 1,
          title: 'Алфавит и базовые звуки',
          topic: 'Знакомство с английским алфавитом',
          content: 'Изучение английского алфавита, правила произношения букв и звуков. Основные звуковые сочетания.'
        },
        {
          number: 2,
          title: 'Приветствия и знакомство',
          topic: 'Базовые фразы для общения',
          content: 'Hello, Hi, Good morning, How are you? Представление себя: My name is..., I am... Nice to meet you.'
        },
        {
          number: 3,
          title: 'Цвета и числа',
          topic: 'Основная лексика',
          content: 'Изучение цветов (red, blue, green) и чисел от 1 до 20. Практика использования в предложениях.'
        },
        {
          number: 4,
          title: 'Моя семья',
          topic: 'Семья и родственники',
          content: 'Слова mother, father, sister, brother. Построение простых предложений о семье: This is my...'
        },
        {
          number: 5,
          title: 'Мой дом',
          topic: 'Комнаты и предметы в доме',
          content: 'Названия комнат (bedroom, kitchen, bathroom) и мебели (table, chair, bed). Предлоги места.'
        },
        {
          number: 6,
          title: 'Школа и учеба',
          topic: 'Школьные предметы',
          content: 'School subjects, classroom objects. I like..., I don\'t like... Выражение предпочтений.'
        },
        {
          number: 7,
          title: 'Еда и напитки',
          topic: 'Продукты питания',
          content: 'Названия еды (apple, bread, milk) и напитков. I would like... Can I have...?'
        },
        {
          number: 8,
          title: 'Животные',
          topic: 'Домашние и дикие животные',
          content: 'Dog, cat, lion, elephant. Описание животных: It is big/small, it can run/fly.'
        },
        {
          number: 9,
          title: 'Глагол to be',
          topic: 'Основной глагол английского языка',
          content: 'Формы I am, you are, he/she/it is, we/they are. Построение утвердительных и отрицательных предложений.'
        },
        {
          number: 10,
          title: 'Настоящее простое время',
          topic: 'Present Simple',
          content: 'Правила образования, использование для повседневных действий. I play, he plays, they don\'t like.'
        }
      ],
      arabic: [
        {
          number: 1,
          title: 'Старт года: входная диагностика',
          topic: 'Проверка уровня после 4 класса',
          content: 'Чтение текста 15–18 предложений; краткий письменный ответ на вопросы; повтор местоимений, 3 времён (наст./прош./буд.), притяжательных форм; определение сильных и слабых сторон класса.'
        },
        {
          number: 2,
          title: 'Основы арабского алфавита',
          topic: 'Знакомство с буквами',
          content: 'Изучение основных букв арабского алфавита, правила чтения и написания. Практика произношения.'
        },
        {
          number: 3,
          title: 'Простые предложения',
          topic: 'Построение предложений',
          content: 'Изучение структуры простых предложений на арабском языке. Практика составления и чтения предложений.'
        },
        {
          number: 4,
          title: 'Числительные 1-10',
          topic: 'Счет на арабском',
          content: 'Изучение арабских числительных от 1 до 10. Практика счета и использования чисел в предложениях.'
        },
        {
          number: 5,
          title: 'Приветствия и знакомство',
          topic: 'Социальные фразы',
          content: 'Изучение основных приветствий, представлений и вежливых выражений на арабском языке.'
        },
        {
          number: 6,
          title: 'Семья и родственники',
          topic: 'Личные отношения',
          content: 'Изучение лексики по теме семьи, родственников и личных отношений.'
        },
        {
          number: 7,
          title: 'Школа и образование',
          topic: 'Учебный процесс',
          content: 'Изучение слов и выражений, связанных со школой, предметами и образованием.'
        },
        {
          number: 8,
          title: 'Еда и напитки',
          topic: 'Питание',
          content: 'Изучение названий продуктов питания, напитков и связанных с едой выражений.'
        },
        {
          number: 9,
          title: 'Города и страны',
          topic: 'География',
          content: 'Изучение названий стран, городов, географических понятий на арабском языке.'
        },
        {
          number: 10,
          title: 'Времена года и погода',
          topic: 'Природа и климат',
          content: 'Изучение названий времен года, типов погоды и связанных выражений.'
        }
      ],
      general: [
        {
          number: 1,
          title: 'Введение в предмет',
          topic: 'Основные понятия',
          content: 'Знакомство с основными понятиями и терминами предмета.'
        },
        {
          number: 2,
          title: 'Основные темы',
          topic: 'Ключевые концепции',
          content: 'Изучение основных тем и концепций предмета.'
        },
        {
          number: 3,
          title: 'Практические задания',
          topic: 'Применение знаний',
          content: 'Выполнение практических заданий и упражнений.'
        },
        {
          number: 4,
          title: 'Контроль знаний',
          topic: 'Проверка усвоения',
          content: 'Тестирование и проверка полученных знаний.'
        },
        {
          number: 5,
          title: 'Заключительные темы',
          topic: 'Итоговые понятия',
          content: 'Изучение заключительных тем и обобщение материала.'
        },
        {
          number: 6,
          title: 'Углубленное изучение',
          topic: 'Расширенные знания',
          content: 'Углубленное изучение сложных тем и понятий.'
        },
        {
          number: 7,
          title: 'Практическое применение',
          topic: 'Реальные задачи',
          content: 'Решение практических задач и применение знаний на практике.'
        },
        {
          number: 8,
          title: 'Анализ и синтез',
          topic: 'Критическое мышление',
          content: 'Развитие навыков анализа, синтеза и критического мышления.'
        },
        {
          number: 9,
          title: 'Творческие задания',
          topic: 'Креативный подход',
          content: 'Выполнение творческих заданий и проектов.'
        },
        {
          number: 10,
          title: 'Итоговое закрепление',
          topic: 'Комплексное повторение',
          content: 'Комплексное повторение и закрепление изученного материала.'
        }
      ]
    };

    const subjectLessons = lessonsBySubject[subject] || lessonsBySubject.general;
    console.log('📚 Subject lessons for', subject, ':', subjectLessons.length, 'lessons available');

    // Если урок существует в массиве, возвращаем его
    if (subjectLessons[lessonNumber - 1]) {
      console.log('✅ Returning lesson', lessonNumber, 'from subject', subject, ':', subjectLessons[lessonNumber - 1].title);
      return subjectLessons[lessonNumber - 1];
    }

    // Иначе генерируем урок на основе номера
    const baseLesson = subjectLessons[0] || subjectLessons.general[0];
    return {
      number: lessonNumber,
      title: `Урок ${lessonNumber}: ${baseLesson.title.split(': ').slice(1).join(': ') || 'Тема урока'}`,
      topic: `Тема урока ${lessonNumber}`,
      content: `Содержание урока ${lessonNumber}. ${baseLesson.content}`,
      aspects: `Аспекты изучения урока ${lessonNumber}`,
      description: `Описание урока ${lessonNumber}`
    };
  };

  // Load learning plan for this course
  const loadLearningPlan = async () => {
    console.log('🔍 [loadLearningPlan] Called with courseId:', courseId, 'type:', typeof courseId);
    
    if (!courseId) {
      console.log('❌ [loadLearningPlan] courseId is empty, returning null');
      return null;
    }

    console.log('🔍 Starting to load learning plan for courseId:', courseId, 'type:', typeof courseId);

    try {
      // Сначала пытаемся найти план в localStorage (может быть сохранен из CoursesPage)
      const savedPlansStr = localStorage.getItem('userLearningPlans');
      console.log('📦 Checking localStorage for plans:', savedPlansStr ? 'EXISTS' : 'NOT FOUND');

      if (savedPlansStr) {
        try {
          const savedPlans = JSON.parse(savedPlansStr);
          console.log('📦 Parsed saved plans keys:', Object.keys(savedPlans));
          console.log('📦 Available plans:', Object.keys(savedPlans).map(key => ({
            key,
            title: savedPlans[key]?.plan_data?.courseInfo?.title,
            courseId: savedPlans[key]?.course_id
          })));

          // Пытаемся найти план по courseId
          let plan = savedPlans[courseId] || savedPlans[courseId.toString()];
          console.log('🔍 Direct lookup result for courseId', courseId, ':', plan ? 'FOUND' : 'NOT FOUND');

          // Если не нашли по ID, пытаемся найти по названию курса
          if (!plan) {
            const savedCourseData = localStorage.getItem('selectedCourseData');
            console.log('📋 Checking selectedCourseData:', savedCourseData ? 'EXISTS' : 'NOT FOUND');

            if (savedCourseData) {
              const courseData = JSON.parse(savedCourseData);
              const courseTitle = courseData.title;
              console.log('📋 Course title from localStorage:', courseTitle);

              // Ищем план, где название курса совпадает (проверяем разные поля)
              for (const [key, planData] of Object.entries(savedPlans)) {
                const planTitle = planData.plan_data?.courseInfo?.title;
                const planSubject = planData.subject_name;
                
                console.log('🔍 Checking plan:', {
                  key,
                  planTitle,
                  planSubject,
                  courseTitle,
                  titleMatch: planTitle === courseTitle,
                  subjectMatch: planSubject === courseTitle
                });

                // Сравниваем по названию курса или subject_name
                if (planTitle === courseTitle || planSubject === courseTitle) {
                  plan = planData;
                  console.log('✅ Learning plan found by course title:', courseTitle, 'key:', key);
                  break;
                }
              }

              // Если все еще не нашли, попробуем частичное совпадение
              if (!plan) {
                console.log('🔍 Trying partial match...');
                for (const [key, planData] of Object.entries(savedPlans)) {
                  const planTitle = planData.plan_data?.courseInfo?.title || '';
                  const planSubject = planData.subject_name || '';
                  
                  // Проверяем частичное совпадение (например "Китайский язык" в "Китайский язык для 5 класса")
                  if (planTitle.includes(courseTitle) || courseTitle.includes(planTitle) ||
                      planSubject.includes(courseTitle) || courseTitle.includes(planSubject)) {
                    plan = planData;
                    console.log('✅ Learning plan found by partial match:', courseTitle, 'key:', key);
                    break;
                  }
                }
              }
            }
          }

          if (plan) {
            console.log('✅ Learning plan found in localStorage:', {
              title: plan.plan_data?.courseInfo?.title,
              lessonsCount: plan.plan_data?.lessons?.length,
              courseId: plan.course_id
            });
            setLearningPlan(plan);
            return plan;
          } else {
            console.log('❌ No plan found in localStorage for courseId:', courseId);
          }
        } catch (error) {
          console.warn('⚠️ Failed to parse saved plans from localStorage:', error);
        }
      }

      // Если не нашли в localStorage, пытаемся загрузить из API
      if (user?.id) {
        console.log('🌐 Loading learning plan from API for user:', user.id, 'course:', courseId);
        const response = await fetch(`/api/db/learning-plans/${user.id}/${courseId}`);

        if (response.ok) {
          const responseData = await response.json();
          console.log('✅ API Response for plan:', responseData);
          
          const plan = responseData.plan || responseData; // Поддержка обоих форматов
          
          console.log('✅ Learning plan loaded from API:', {
            title: plan.plan_data?.courseInfo?.title,
            lessonsCount: plan.plan_data?.lessons?.length,
            courseId: plan.course_id
          });
          setLearningPlan(plan);
          return plan;
        } else {
          console.log('❌ API returned error for plan:', response.status, await response.text());
        }
      }

      console.log('ℹ️ No learning plan found for this course');
      return null;
    } catch (error) {
      console.error('❌ Error loading learning plan:', error);
      return null;
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId, currentLessonNumber]);

  const loadCourse = async () => {
    try {
      console.log('🎯 Starting to load course:', courseId);

      // Проверяем, является ли это курсом экзамена (ЕГЭ или ОГЭ)
      const isExamCourse = courseId && (courseId.startsWith('ЕГЭ-') || courseId.startsWith('ОГЭ-'));

      if (isExamCourse) {
        console.log('📚 Loading exam course:', courseId);

        // Загружаем данные курса экзамена из localStorage
        const storedCourses = localStorage.getItem('examCourses');
        if (storedCourses) {
          const examCourses = JSON.parse(storedCourses);
          const examCourse = examCourses.find((course: any) => course.id === courseId);

          if (examCourse) {
            console.log('✅ Found exam course:', examCourse);

            // Создаем данные курса на основе examCourse
            const courseData = {
              id: parseInt(examCourse.id.split('-').pop() || '1'), // Берем timestamp из ID
              title: examCourse.subject,
              description: `Подготовка к ${examCourse.examType}: ${examCourse.subject}`,
              level: 'Экзаменационный',
              grade: examCourse.examType === 'ЕГЭ' ? '11 класс' : '9 класс',
              progress: examCourse.progress,
              modules: examCourse.totalTopics,
              completedModules: examCourse.completedTopics,
              students: 1
            };

            // Создаем урок на основе плана обучения или mock данных
            let currentLesson;
            console.log('🔍 Checking for lesson in plan for exam course...');

            // Для экзаменационных курсов используем getMockLesson с названием предмета
            console.log('📚 Getting mock lesson for exam course:', examCourse.subject, 'lesson number:', currentLessonNumber);
            currentLesson = getMockLesson(currentLessonNumber, examCourse.subject);
            console.log('⚠️ Using mock lesson for exam course:', {
              title: currentLesson.title,
              topic: currentLesson.topic,
              content: currentLesson.content?.substring(0, 50) + '...'
            });

            const finalCourseData: CourseData = {
              ...courseData,
              currentLesson: currentLesson
            };

            console.log('🎯 Final exam course data:', finalCourseData);
            setCourse(finalCourseData);
            setLoading(false);
            return;
          }
        }

        console.log('❌ Exam course not found in localStorage');
        // Продолжаем с обычной логикой загрузки
      }

      // Сначала пытаемся загрузить план обучения
      const plan = await loadLearningPlan();
      console.log('📚 Plan loaded:', plan ? 'YES' : 'NO', plan);

      // Получаем данные курса
      let courseData: any = null;

      // Сначала пытаемся получить данные из localStorage
      const savedCourseData = localStorage.getItem('selectedCourseData');
      if (savedCourseData) {
        console.log('📦 Loading course from localStorage');
        const parsedCourseData = JSON.parse(savedCourseData);
        console.log('📦 Parsed course data:', parsedCourseData);
        console.log('🔍 Comparing IDs - URL courseId:', courseId, 'localStorage id:', parsedCourseData.id);
        
        // КРИТИЧНО: Проверяем, что ID курса совпадает с URL
        if (parsedCourseData.id === courseId || parsedCourseData.id === courseId.toString()) {
          courseData = parsedCourseData;
          console.log('✅ Course IDs match, using localStorage data');
        } else {
          console.warn('⚠️ Course ID mismatch! URL:', courseId, 'localStorage:', parsedCourseData.id);
          console.log('🧹 Clearing mismatched course data');
          localStorage.removeItem('selectedCourseData');
          courseData = null;
        }
      }
      
      // Если нет в localStorage или ID не совпал, пытаемся получить из API
      if (!courseData) {
        console.log('📡 Loading course from API:', courseId);
        try {
          const response = await fetch(`/api/courses/${courseId}`);
          if (response.ok) {
            courseData = await response.json();
            console.log('📡 Course data from API:', courseData);
          }
        } catch (error) {
          console.error('❌ API request failed:', error);
        }
      }

      if (courseData) {
        console.log('🔍 Course data found, creating lesson...');

        // Создаем урок на основе плана обучения или mock данных
        let currentLesson;
        console.log('🔍 Checking for lesson in plan:', {
          planExists: !!plan,
          planDataExists: !!plan?.plan_data,
          lessonsExist: !!plan?.plan_data?.lessons,
          lessonsCount: plan?.plan_data?.lessons?.length || 0,
          currentLessonNumber,
          lessonIndex: currentLessonNumber - 1
        });

        if (plan && plan.plan_data?.lessons?.[currentLessonNumber - 1]) {
          currentLesson = plan.plan_data.lessons[currentLessonNumber - 1];
          console.log('✅ Using lesson from plan:', {
            title: currentLesson.title,
            topic: currentLesson.topic,
            content: currentLesson.content?.substring(0, 50) + '...'
          });
        } else {
          currentLesson = getMockLesson(currentLessonNumber, courseData.title);
          console.log('⚠️ Using mock lesson:', {
            title: currentLesson.title,
            topic: currentLesson.topic,
            content: currentLesson.content?.substring(0, 50) + '...'
          });
        }

        const finalCourseData: CourseData = {
          ...courseData,
          currentLesson: currentLesson
        };

        console.log('🎯 Final course data:', finalCourseData);
        setCourse(finalCourseData);
      } else {
        // Если API недоступен, используем fallback данные
        console.warn('API not available, using fallback data');
        const mockCourseData: CourseData = {
          id: parseInt(courseId || '1'),
          title: 'Курс не найден',
          description: 'Данные курса недоступны',
          level: 'Средний',
          grade: 'Не указан',
          progress: 0,
          modules: 34,
          completedModules: 0,
          students: 1,
          currentLesson: getMockLesson(currentLessonNumber, 'Курс не найден')
        };
        setCourse(mockCourseData);
      }
    } catch (error) {
      console.error('Error loading course:', error);
      // Fallback к базовым данным
      const mockCourseData: CourseData = {
        id: parseInt(courseId || '1'),
        title: 'Курс не найден',
        description: 'Произошла ошибка при загрузке курса',
        level: 'Средний',
        grade: 'Не указан',
        progress: 0,
        modules: 34,
        completedModules: 0,
        students: 1,
        currentLesson: getMockLesson(currentLessonNumber, 'Курс не найден')
      };
      setCourse(mockCourseData);
    } finally {
      setLoading(false);
    }
  };

  const startInteractiveLesson = () => {
    // Start new chat session with the teacher
    console.log('🚀 [COURSE DETAIL] startInteractiveLesson called - starting new chat session');
    console.log('📍 Current location:', window.location.href);

    // Clear any existing chat data to start fresh
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('lessonContext');
    localStorage.removeItem('currentCourse'); // Clear old course data
    localStorage.removeItem('personalizedCourseData'); // Clear any cached course data

    // Save course info for the chat session with lesson context
    const courseData = {
      id: course?.id,
      title: course?.title,
      grade: course?.grade,
      description: course?.description,
      currentLesson: course?.currentLesson
    };

    // Get or create lesson session data
    const lessonSessionKey = `lesson_session_${course?.id}`;
    const existingSession = localStorage.getItem(lessonSessionKey);
    let sessionData;

    if (existingSession) {
      sessionData = JSON.parse(existingSession);
      // Increment lesson number for next lesson
      sessionData.lessonNumber = (sessionData.lessonNumber || 0) + 1;
      sessionData.lastLessonDate = new Date().toISOString();
    } else {
      // First lesson
      sessionData = {
        lessonNumber: 1,
        completedLessons: [],
        homeworks: [],
        lastLessonDate: new Date().toISOString()
      };
    }

    // Save lesson session
    localStorage.setItem(lessonSessionKey, JSON.stringify(sessionData));
    
    // Save current course with session info
    const courseWithSession = {
      ...courseData,
      sessionData
    };

    localStorage.setItem('currentCourse', JSON.stringify(courseWithSession));

    console.log('💾 [COURSE DETAIL] Saved course data for chat session:', courseData);

    // Navigate to chat page
    console.log('🧭 [COURSE DETAIL] Navigating to /chat...');
    navigate('/chat');
    console.log('✅ [COURSE DETAIL] navigate() called successfully');
  };

  // Keep historyRef updated
  useEffect(() => { historyRef.current = conversationHistory; }, [conversationHistory]);

  // Set video element for TTS synchronization
  useEffect(() => {
    if (videoRef.current) {
      OpenAITTS.setVideoElement(videoRef.current);
    } else {
      OpenAITTS.setVideoElement(null);
    }
    return () => {
      OpenAITTS.setVideoElement(null);
    };
  }, [showVideoCall]);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      OpenAITTS.stop();
      VoiceComm.stopListening();
    };
  }, []);

  const speakGreetingAndStartChat = useCallback(async (greeting: string) => {
    try {
      console.log('🎤 Speaking greeting:', greeting.substring(0, 50) + '...');
      setIsLessonSpeaking(true);

      await OpenAITTS.speak(greeting, {
        voice: 'nova',
        speed: 1.0,
        onEnd: async () => {
          console.log('✅ Greeting TTS ended, starting voice recognition');
          setIsLessonSpeaking(false);
          try {
            await VoiceComm.startListening();
          } catch (error) {
            console.error('❌ Failed to start voice recognition after greeting:', error);
          }
        },
        onError: (error) => {
          console.error('❌ Greeting TTS error:', error);
          setIsLessonSpeaking(false);
        }
      });
    } catch (error) {
      console.error('❌ Failed to speak greeting:', error);
      setIsLessonSpeaking(false);
    }
  }, []);

  const handleUserTranscript = useCallback(async (text: string, isFinal: boolean) => {
    console.log('🔍 handleUserTranscript called:', { text, isFinal });

    if (!isFinal || !text.trim()) {
      return;
    }

    // Cancel any pending processing
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      console.log('🚫 Aborting previous request due to new input');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    OpenAITTS.stop();

    // Update Request ID
    const currentRequestId = ++latestRequestIdRef.current;

    console.log('📝 User said (final):', text);
    setConversationHistory(prev => [...prev, { role: 'student', text: text }]);

    // Process after a short delay
    processingTimeoutRef.current = setTimeout(async () => {
        const startTime = Date.now();
        try {
          setIsProcessingQuestion(true);

          const controller = new AbortController();
          abortControllerRef.current = controller;

          const context = historyRef.current.slice(-4).map(h =>
            `${h.role === 'teacher' ? 'Юля' : 'Ученик'}: ${h.text}`
          ).join('\n');

          const currentLesson = course?.currentLesson || {
            title: course?.title || 'Урок',
            topic: course?.description || 'Тема',
            aspects: course?.description || ''
          };

          const systemPrompt = `Ты - Юля, профессиональный школьный учитель с 15-летним стажем. Твоя задача - ВЕСТИ УРОК ПО ПЛАНУ, а не просто поддерживать разговор.

ТВОЙ ПОДХОД К ОБУЧЕНИЮ:
🎯 ТЫ ВЕДЕШЬ УРОК: Рассказывай теорию, объясняй темы, задавай вопросы для проверки понимания.
📚 СТРУКТУРА УРОКА: Сначала объясняй материал, потом спрашивай у ученика.
🚫 НЕ ЖДИ, ПОКА УЧЕНИК ЗАДАСТ ВОПРОС: Ты ведешь урок, ты задаешь вопросы.
📝 ПЕРЕХОДИ К СЛЕДУЮЩЕМУ: После объяснения и проверки понимания, переходи к следующему пункту плана.

ПРАВИЛА ПРОВЕДЕНИЯ УРОКА:
1. РАССКАЗЫВАЙ ТЕОРИЮ: Объясняй темы из плана урока понятным языком.
2. ЗАДАВАЙ ВОПРОСЫ: После объяснения спрашивай у ученика, понял ли он.
3. ПРОВЕРЯЙ ОТВЕТЫ: Анализируй, правильно ли ответил ученик.
4. ЕСЛИ ОТВЕТ НЕВЕРНЫЙ: Скажи "Не совсем так", объясни ошибку, переспроси.
5. ЕСЛИ ОТВЕТ НЕПОНЯТЕН: Переспроси четко.
6. ЕСЛИ ОТВЕТ ПРАВИЛЬНЫЙ: Кратко похвали и переходи к следующему.
7. СЛЕДУЮЩИЙ ШАГ: После проверки всегда переходи к следующему пункту плана.

ПРАВИЛА ДЛЯ ТЕКСТА В РЕЧЬ (TTS):
- Расставляй УДАРЕНИЯ в сложных словах знаком + перед ударной гласной (например: "м+ама", "г+ород").
- Для омографов (зам+ок/з+амок) обязательно ставь ударение по контексту.

ПЛАН ТЕКУЩЕГО УРОКА:
${currentLesson.aspects || 'Изучаем основы'}

ТЕКУЩИЙ УРОК: "${currentLesson.title || 'Урок'}" (${currentLesson.topic || 'Тема'})
КОНТЕКСТ РАЗГОВОРА:
${context}

УЧЕНИК СКАЗАЛ: "${text}"

ИНСТРУКЦИЯ ДЛЯ ОТВЕТА:
1. Если ученик ответил на твой вопрос: Оцени правильность ответа.
2. Если ученик спросил что-то: Ответь, но верни к плану урока.
3. Всегда заканчивай объяснением материала или вопросом.
`;

          const response = await fetch('/api/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Ученик только что сказал: "${text}". Продолжи урок.` }
              ],
              model: 'gpt-4o-mini',
              temperature: 0.7,
              max_tokens: 300
            }),
            signal: controller.signal
          });

          if (response.ok) {
            const data = await response.json();
            const teacherResponse = data.choices[0].message.content;
            console.log('✅ Teacher response:', teacherResponse);

            if (controller.signal.aborted) return;

            setConversationHistory(prev => [...prev, { role: 'teacher', text: teacherResponse }]);

            await OpenAITTS.speak(teacherResponse, {
              voice: 'nova',
              speed: 1.0,
              onEnd: () => {
                setTimeout(() => {
                  VoiceComm.startListening();
              }, 1000);
            }
            });
          }
        } catch (error) {
            const err = error as Error;
            if (err.name !== 'AbortError') {
                 console.error('❌ Error generating teacher response:', err);
            }
        } finally {
          if (currentRequestId === latestRequestIdRef.current) {
             setIsProcessingQuestion(false);
             abortControllerRef.current = null;
          }
        }
      }, 500);
  }, [conversationHistory, course]);

  const handleCall = async () => {
    if (isCallActive) {
      // End call
      console.log('📞 Ending call...');
      VoiceComm.stopListening();
      OpenAITTS.stop();
      setIsCallActive(false);
      setConversationHistory([]);
      setIsLessonSpeaking(false);
    } else {
      // Start call
      console.log('📞 Starting call...');

      // Activate audio context first
      try {
        console.log('🔊 Activating audio context...');

        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
          const AudioContextClass = AudioContext || webkitAudioContext;
          const audioContext = new AudioContextClass();
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
          }
          console.log('✅ Web Audio API context activated');
        } else {
          const audio = new Audio();
          audio.volume = 0.01;
          audio.muted = true;
          audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

          audio.play().then(() => {
            audio.pause();
            console.log('✅ HTML5 Audio context activated');
          }).catch((err) => {
            console.warn('⚠️ HTML5 Audio activation failed, continuing anyway:', err.message);
          });

          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.warn('⚠️ Failed to activate audio context, continuing anyway:', (error as Error).message);
      }

      try {
        // Generate greeting
        const currentLesson = course?.currentLesson || {
          title: course?.title || 'математике',
          topic: course?.description || ''
        };
        const notes = ['Привет! Я Юля. Давай начнем урок по теме "' + currentLesson.title + '". Что ты уже знаешь по этой теме?'];
        console.log('✅ Greeting ready, count:', notes?.length);

        // Start the conversation with greeting
        console.log('🎓 Starting conversation with greeting...');
        setTimeout(async () => {
          try {
            await speakGreetingAndStartChat(notes[0]);
          } catch (error) {
            console.error('❌ Failed to start conversation:', error);
          }
        }, 500);

        // Initialize VoiceComm with callbacks
        const isInitialized = VoiceComm.init(
          {
            language: 'ru-RU',
            continuous: true
          },
          {
            onListeningStart: () => {
              console.log('🎤 Call listening started (callback fired)');
              setIsCallActive(true);
              OpenAITTS.stop();
            },
            onListeningEnd: () => {
              console.log('🎤 Call listening ended');
              setIsCallActive(false);
              setIsLessonSpeaking(false);
            },
            onTranscript: (text: string, isFinal: boolean) => {
              if (isFinal && text.trim()) {
                console.log('📝 Call transcript:', text);
                handleUserTranscript(text, isFinal);
              }
            },
            onError: (error: string) => {
              console.error('❌ Call error:', error);
              setIsCallActive(false);
              setIsLessonSpeaking(false);
            }
          }
        );

        if (!isInitialized) {
          throw new Error('Speech Recognition not supported in this browser');
        }

        // Start voice recognition
        console.log('🎙️ Calling VoiceComm.startListening()...');
        const started = VoiceComm.startListening();
        console.log('🎙️ VoiceComm.startListening() returned:', started);
      } catch (error) {
        console.error('❌ Failed to start call:', error);
        setIsCallActive(false);
      }
    }
  };

  const startVoiceCall = () => {
    // Navigate to dedicated voice call page with lesson context
    console.log('🎯 [COURSE DETAIL] Navigating to voice-call page with lesson context');
    console.log('🔍 Current course data:', {
      id: course?.id,
      title: course?.title,
      currentLesson: course?.currentLesson
    });

    // Ensure lesson data is saved before navigation
    const lessonData = {
      number: course?.currentLesson?.number || 1,
      title: course?.currentLesson?.title || course?.title || 'Урок',
      grade: course?.grade || '5 класс',
      topic: course?.currentLesson?.topic || course?.description || '',
      aspects: course?.description || '',
      description: course?.currentLesson?.content || course?.currentLesson?.aspects || course?.currentLesson?.description || course?.description || ''
    };

    console.log('💾 Saving to localStorage:', lessonData);

    localStorage.setItem('currentLesson', JSON.stringify(lessonData));
    localStorage.setItem('courseInfo', JSON.stringify({
      courseId: course?.id,
      title: course?.title,
      grade: course?.grade
    }));

    console.log('✅ Lesson data saved, navigating to /voice-call');

    // Navigate to voice call page
    navigate('/voice-call');
  };

  const handleCloseVideoCall = () => {
    // Stop call logic
    VoiceComm.stopListening();
    OpenAITTS.stop();
    setIsCallActive(false);
    setShowVideoCall(false);
    setConversationHistory([]);
  };

  const goToPreviousLesson = () => {
    if (currentLessonNumber > 1) {
      setCurrentLessonNumber(prev => prev - 1);
    }
  };

  const goToNextLesson = () => {
    if (currentLessonNumber < (course?.modules || 34)) {
      setCurrentLessonNumber(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка курса...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <p className="text-lg mb-4">Курс не найден</p>
          <Button onClick={() => navigate('/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к курсам
          </Button>
        </Card>
      </div>
    );
  }

  const progressPercentage = course.progress;

  // Если это режим выбора типа обучения
  console.log('🔍 Checking mode for select-mode:', mode);
  if (mode === 'select-mode') {
    console.log('✅ Showing select-mode page');
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-12">
          <div className="max-w-2xl w-full">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Выберите тип обучения
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Как вы хотите изучать курс?
              </p>
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                {course?.title}
              </div>
            </div>

            {/* Learning Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Chat Option */}
              <div className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200 hover:border-green-300 overflow-hidden">
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Чат
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Интерактивное обучение с ИИ-учителем в текстовом формате.
                      Задавайте вопросы, получайте подробные объяснения.
                    </p>

                    <ul className="space-y-2 mb-8">
                      <li className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Подробные объяснения
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Мгновенные ответы
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Персонализированный подход
                      </li>
                    </ul>

                    <Button
                      size="lg"
                      onClick={startInteractiveLesson}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Начать чат-обучение
                      <BookOpen className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Voice Option */}
              <div className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200 hover:border-green-300 overflow-hidden">
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Онлайн общение
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Голосовое обучение с Юлией. Говорите естественно,
                      получайте живые ответы и объяснения.
                    </p>

                    <ul className="space-y-2 mb-8">
                      <li className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                        Естественное общение
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                        Голосовые ответы
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                        Иммерсивное обучение
                      </li>
                    </ul>

                    <Button
                      size="lg"
                      onClick={startVoiceCall}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Начать голосовое обучение
                      <Phone className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/courses')}
                className="text-green-700 hover:text-green-800 hover:bg-green-50 px-6 py-3 rounded-xl font-medium transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к списку курсов
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 md:mb-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/courses')}
              className="h-auto p-2 rounded-full hover:bg-white/60 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="ml-2 font-medium text-gray-700 group-hover:text-gray-900">Назад</span>
            </Button>
          </nav>
        </div>

        {/* Course Progress Section */}
        <div className="mb-6 md:mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">Прогресс обучения</h1>
                  <p className="text-sm md:text-base text-gray-600 mt-1">{course.title} • {course.grade}</p>
                </div>
                <Badge variant="secondary" className="text-xs md:text-sm w-fit">
                  {course.level}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 text-xs md:text-sm">{course.completedModules} из {course.modules} уроков</span>
                  <span className="font-medium text-gray-900 text-xs md:text-sm">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs md:text-sm text-gray-500 text-center">
                  {progressPercentage === 0 ? 'Начните обучение прямо сейчас' : 'Продолжайте обучение'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
                <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-gray-900">{course.completedModules}</div>
                  <div className="text-xs md:text-sm text-gray-600">Пройдено</div>
                </div>
                <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-gray-900">{course.modules - course.completedModules}</div>
                  <div className="text-xs md:text-sm text-gray-600">Осталось</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Lesson Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-4 md:px-6 py-3 md:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge variant="outline" className="text-xs">
                    Урок {currentLessonNumber}
                  </Badge>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mt-1 truncate">
                    {course.currentLesson?.title || 'Урок не найден'}
                  </h2>
                </div>
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                <div className="text-xs md:text-sm text-gray-500">Тема</div>
                <div className="text-xs md:text-sm font-medium text-gray-900 max-w-xs truncate">
                  {course.currentLesson?.topic || course.description}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              {/* Lesson Description */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Содержание урока</h3>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {course.currentLesson?.content || course.currentLesson?.aspects || course.currentLesson?.description || course.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Button
                  size="lg"
                  onClick={startInteractiveLesson}
                  className="w-full h-auto py-3 md:py-4"
                >
                  <BookOpen className="w-4 md:w-5 h-4 md:h-5 mr-2 flex-shrink-0" />
                  <div className="text-center">
                    <div className="font-medium">Начать урок</div>
                    <span className="text-xs opacity-75 block leading-tight">Интерактивное обучение</span>
                  </div>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={startVoiceCall}
                  className="w-full h-auto py-3 md:py-4"
                >
                  <Phone className="w-4 md:w-5 h-4 md:h-5 mr-2 flex-shrink-0" />
                  <div className="text-center">
                    <div className="font-medium">Онлайн урок</div>
                    <span className="text-xs opacity-75 block leading-tight">Голосовое обучение</span>
                  </div>
                </Button>
              </div>

              {/* Video Call Interface */}
              {showVideoCall && (
                <div className="mt-6 bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Видео звонок с учителем</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={isCallActive ? "destructive" : "default"}
                        size="sm"
                        onClick={handleCall}
                        className="gap-2"
                      >
                        {isCallActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                        {isCallActive ? 'Завершить звонок' : 'Позвонить'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCloseVideoCall}
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Закрыть
                      </Button>
                    </div>
                  </div>
                  <div className="w-[300px] h-[300px] bg-black rounded-full overflow-hidden mx-auto">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                      src="/Untitled Video.mp4"
                      onError={(e) => {
                        console.error('Video load error:', e);
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex items-center justify-center h-full text-white">
                              <div class="text-center">
                                <p class="text-lg mb-2">🎥 Видео не найдено</p>
                                <p class="text-sm opacity-75">Поместите файл "Untitled Video.mp4" в папку public</p>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    >
                      Ваш браузер не поддерживает видео.
                    </video>
                  </div>
                  <div className="mt-4 text-center min-h-[20px]">
                    {isCallActive && (
                      <p className="text-sm text-muted-foreground animate-pulse">
                        {isProcessingQuestion ? 'Юля думает...' : 'Юля слушает...'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Lesson Navigation */}
              <div className="border-t border-gray-100 pt-4 md:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
                  <Button
                    variant="ghost"
                    disabled={currentLessonNumber <= 1}
                    className={`w-full sm:w-auto justify-center sm:justify-start ${
                      currentLessonNumber <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={goToPreviousLesson}
                    title={currentLessonNumber <= 1 ? 'Это первый урок' : 'Перейти к предыдущему уроку'}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Предыдущий урок</span>
                    <span className="sm:hidden">Предыдущий</span>
                  </Button>

                  <div className="text-center flex-shrink-0">
                    <div className="text-xs md:text-sm text-gray-600">Урок {currentLessonNumber} из {course.modules}</div>
                    <div className="w-24 md:w-32 h-1 bg-gray-200 rounded-full mx-auto mt-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(currentLessonNumber / course.modules) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    disabled={currentLessonNumber >= course.modules}
                    className={`w-full sm:w-auto justify-center sm:justify-end ${
                      currentLessonNumber >= course.modules ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={goToNextLesson}
                    title={currentLessonNumber >= course.modules ? 'Это последний урок' : 'Перейти к следующему уроку'}
                  >
                    <span className="hidden sm:inline">Следующий урок</span>
                    <span className="sm:hidden">Следующий</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs md:text-sm text-gray-500">
                    Используйте кнопки выше для навигации между уроками или выберите тип обучения ниже
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}