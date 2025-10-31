import React, { createContext, useContext, useState, useEffect } from 'react';

interface PersonalizedCourse {
  id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  modules: {
    title: string;
    description: string;
    lessons: string[];
  }[];
}

interface AssessmentResult {
  score: number;
  totalQuestions: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  completedAt: Date;
  weakTopics: string[];
}

interface UserStats {
  activeCourses: number;
  completedModules: number;
  averageProgress: number;
  achievements: number;
  totalLessonsCompleted: number;
  studyTimeHours: number;
  streakDays: number;
}

interface ActiveCourse {
  id: string;
  title: string;
  description: string;
  progress: number;
  level: string;
  students: string;
  color: string;
  modules: number;
  completedModules: number;
  icon: string;
  startedAt: Date;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  maxCourses: number;
  maxFamilyMembers: number;
  voiceEnabled: boolean;
  chatEnabled: boolean;
}

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  courses: string[];
  username: string;
  password: string;
  createdAt: Date;
  isActive: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'activity' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  points: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  lastUpdated: Date;
}

interface PerformanceMetrics {
  totalStudyTime: number; // in minutes
  coursesCompleted: number;
  lessonsCompleted: number;
  averageScore: number;
  streakDays: number;
  weeklyProgress: {
    week: string;
    studyTime: number;
    lessonsCompleted: number;
  }[];
  monthlyProgress: {
    month: string;
    studyTime: number;
    lessonsCompleted: number;
  }[];
}

interface User {
  id: string;
  email: string;
  name: string;
  knowledgeLevel?: 'beginner' | 'intermediate' | 'advanced';
  assessmentResult?: AssessmentResult;
  personalizedCourse?: PersonalizedCourse;
  stats?: UserStats;
  completedLessons?: string[];
  activeCourses?: ActiveCourse[];
  achievements?: Achievement[];
  achievementProgress?: AchievementProgress[];
  subscription?: {
    planId: string;
    plan: SubscriptionPlan;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    autoRenewal: boolean;
  };
  familyMembers?: FamilyMember[];
  performanceMetrics?: PerformanceMetrics;
  isFamilyHead?: boolean;
  familyId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateAssessmentResult: (score: number, totalQuestions: number, weakTopics: string[], assessmentData?: any) => Promise<void>;
  updateUserStats: (updates: Partial<UserStats>) => void;
  completeLesson: (moduleId: number, lessonId: number) => void;
  startCourse: (courseData: Omit<ActiveCourse, 'startedAt'>) => void;
  updateSubscription: (planId: string) => Promise<void>;
  addFamilyMember: (memberData: Omit<FamilyMember, 'id' | 'username' | 'password' | 'createdAt'>) => Promise<void>;
  removeFamilyMember: (memberId: string) => Promise<void>;
  updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  stopCourse: (courseId: string) => void;
  updateAchievementProgress: (achievementId: string, newProgress: number) => void;
  checkAchievements: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { User, AssessmentResult, PersonalizedCourse, UserStats, ActiveCourse, SubscriptionPlan, FamilyMember, PerformanceMetrics, Achievement, AchievementProgress };

// Subscription plans data
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Бесплатный',
    price: 0,
    currency: 'RUB',
    features: [
      '1 курс в месяц',
      'Чат с AI бесплатно',
      'Базовые уроки',
      'Ограниченное время обучения'
    ],
    maxCourses: 1,
    maxFamilyMembers: 1,
    voiceEnabled: false,
    chatEnabled: true
  },
  {
    id: 'standard',
    name: 'Стандарт',
    price: 990,
    currency: 'RUB',
    features: [
      '3 курса в месяц',
      'Голосовое общение',
      'Чат с AI',
      'Расширенные материалы',
      'Прогресс отслеживание'
    ],
    maxCourses: 3,
    maxFamilyMembers: 1,
    voiceEnabled: true,
    chatEnabled: true
  },
  {
    id: 'family',
    name: 'Семейный',
    price: 1999,
    currency: 'RUB',
    features: [
      'Все курсы без ограничений',
      'Голосовое общение',
      'Чат с AI',
      'До 3 человек в семье',
      'Семейная статистика',
      'Родительский контроль'
    ],
    maxCourses: -1, // unlimited
    maxFamilyMembers: 3,
    voiceEnabled: true,
    chatEnabled: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const getInitialStats = (): UserStats => ({
    activeCourses: 0,
    completedModules: 0,
    averageProgress: 0,
    achievements: 0,
    totalLessonsCompleted: 0,
    studyTimeHours: 0,
    streakDays: 0
  });

  const getInitialAchievements = (): Achievement[] => [
    // Обучение (Learning)
    {
      id: 'first-lesson',
      title: 'Первый урок',
      description: 'Завершите свой первый урок',
      category: 'learning',
      rarity: 'common',
      requirement: 'Завершить 1 урок',
      points: 10,
      maxProgress: 1,
      unlocked: false
    },
    {
      id: 'lesson-master',
      title: 'Мастер уроков',
      description: 'Завершите 10 уроков',
      category: 'learning',
      rarity: 'rare',
      requirement: 'Завершить 10 уроков',
      points: 50,
      maxProgress: 10,
      unlocked: false
    },
    {
      id: 'scholar',
      title: 'Ученый',
      description: 'Завершите 50 уроков',
      category: 'learning',
      rarity: 'epic',
      requirement: 'Завершить 50 уроков',
      points: 200,
      maxProgress: 50,
      unlocked: false
    },
    {
      id: 'knowledge-seeker',
      title: 'Искатель знаний',
      description: 'Завершите 100 уроков',
      category: 'learning',
      rarity: 'legendary',
      requirement: 'Завершить 100 уроков',
      points: 500,
      maxProgress: 100,
      unlocked: false
    },
    {
      id: 'perfect-score',
      title: 'Идеальный балл',
      description: 'Получите 100% за тест',
      category: 'learning',
      rarity: 'rare',
      requirement: 'Получить 100% в тесте',
      points: 75,
      maxProgress: 1,
      unlocked: false
    },
    {
      id: 'consistent-learner',
      title: 'Последовательный ученик',
      description: 'Учитесь 7 дней подряд',
      category: 'learning',
      rarity: 'rare',
      requirement: '7 дней подряд обучения',
      points: 100,
      maxProgress: 7,
      unlocked: false
    },
    {
      id: 'early-bird',
      title: 'Ранняя пташка',
      description: 'Завершите урок до 8 утра',
      category: 'learning',
      rarity: 'common',
      requirement: 'Урок до 8:00',
      points: 25,
      maxProgress: 1,
      unlocked: false
    },
    {
      id: 'night-owl',
      title: 'Ночная сова',
      description: 'Завершите урок после 22:00',
      category: 'learning',
      rarity: 'common',
      requirement: 'Урок после 22:00',
      points: 25,
      maxProgress: 1,
      unlocked: false
    },
    {
      id: 'speed-demon',
      title: 'Гонщик',
      description: 'Завершите урок за менее чем 10 минут',
      category: 'learning',
      rarity: 'rare',
      requirement: 'Урок < 10 мин',
      points: 40,
      maxProgress: 1,
      unlocked: false
    },
    {
      id: 'deep-thinker',
      title: 'Глубокий мыслитель',
      description: 'Проведите 2 часа за одним уроком',
      category: 'learning',
      rarity: 'rare',
      requirement: '2 часа за уроком',
      points: 60,
      maxProgress: 1,
      unlocked: false
    },
    // Активность (Activity)
    {
      id: 'first-login',
      title: 'Добро пожаловать!',
      description: 'Войдите в приложение впервые',
      category: 'activity',
      rarity: 'common',
      requirement: 'Первый вход',
      points: 5,
      maxProgress: 1,
      unlocked: false
    },
    {
      id: 'week-warrior',
      title: 'Воин недели',
      description: 'Активность в приложении 7 дней',
      category: 'activity',
      rarity: 'common',
      requirement: '7 дней активности',
      points: 30,
      maxProgress: 7,
      unlocked: false
    },
    {
      id: 'month-master',
      title: 'Мастер месяца',
      description: 'Активность в приложении 30 дней',
      category: 'activity',
      rarity: 'epic',
      requirement: '30 дней активности',
      points: 150,
      maxProgress: 30,
      unlocked: false
    },
    {
      id: 'dedicated-student',
      title: 'Преданный ученик',
      description: 'Накопите 10 часов обучения',
      category: 'activity',
      rarity: 'rare',
      requirement: '10 часов обучения',
      points: 80,
      maxProgress: 600, // минуты
      unlocked: false
    },
    {
      id: 'marathon-runner',
      title: 'Марафонец',
      description: 'Накопите 50 часов обучения',
      category: 'activity',
      rarity: 'epic',
      requirement: '50 часов обучения',
      points: 300,
      maxProgress: 3000, // минуты
      unlocked: false
    },
    {
      id: 'centurion',
      title: 'Столп знания',
      description: 'Накопите 100 часов обучения',
      category: 'activity',
      rarity: 'legendary',
      requirement: '100 часов обучения',
      points: 750,
      maxProgress: 6000, // минуты
      unlocked: false
    },
    {
      id: 'chatty-student',
      title: 'Общительный ученик',
      description: 'Задайте 10 вопросов AI преподавателю',
      category: 'activity',
      rarity: 'common',
      requirement: '10 вопросов AI',
      points: 20,
      maxProgress: 10,
      unlocked: false
    },
    {
      id: 'ai-disciple',
      title: 'Ученик AI',
      description: 'Задайте 100 вопросов AI преподавателю',
      category: 'activity',
      rarity: 'epic',
      requirement: '100 вопросов AI',
      points: 250,
      maxProgress: 100,
      unlocked: false
    },
    // Социальные (Social)
    {
      id: 'social-butterfly',
      title: 'Социальная бабочка',
      description: 'Поделитесь достижением в соцсетях',
      category: 'social',
      rarity: 'common',
      requirement: 'Поделиться достижением',
      points: 10,
      maxProgress: 1,
      unlocked: false
    },
    {
      id: 'ambassador',
      title: 'Посол знаний',
      description: 'Пригласите 5 друзей в приложение',
      category: 'social',
      rarity: 'rare',
      requirement: 'Пригласить 5 друзей',
      points: 100,
      maxProgress: 5,
      unlocked: false
    },
    {
      id: 'community-leader',
      title: 'Лидер сообщества',
      description: 'Пригласите 20 друзей в приложение',
      category: 'social',
      rarity: 'epic',
      requirement: 'Пригласить 20 друзей',
      points: 400,
      maxProgress: 20,
      unlocked: false
    },
    // Специальные (Special)
    {
      id: 'first-victory',
      title: 'Первая победа',
      description: 'Получите первое достижение',
      category: 'special',
      rarity: 'common',
      requirement: 'Любое достижение',
      points: 15,
      maxProgress: 1,
      unlocked: false
    },
    {
      id: 'achievement-hunter',
      title: 'Охотник за достижениями',
      description: 'Получите 10 достижений',
      category: 'special',
      rarity: 'rare',
      requirement: '10 достижений',
      points: 100,
      maxProgress: 10,
      unlocked: false
    },
    {
      id: 'legend',
      title: 'Легенда',
      description: 'Получите 25 достижений',
      category: 'special',
      rarity: 'epic',
      requirement: '25 достижений',
      points: 500,
      maxProgress: 25,
      unlocked: false
    },
    {
      id: 'ultimate-scholar',
      title: 'Высший ученый',
      description: 'Получите все достижения',
      category: 'special',
      rarity: 'legendary',
      requirement: 'Все достижения',
      points: 2000,
      maxProgress: 50,
      unlocked: false
    }
  ];

  const getInitialPerformanceMetrics = (): PerformanceMetrics => ({
    totalStudyTime: 0,
    coursesCompleted: 0,
    lessonsCompleted: 0,
    averageScore: 0,
    streakDays: 0,
    weeklyProgress: [],
    monthlyProgress: []
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    if (email && password) {
      const existingUser = localStorage.getItem('user');
      if (existingUser) {
        const parsedUser = JSON.parse(existingUser);
        // Ensure achievements exist for existing users
        if (!parsedUser.achievements) {
          parsedUser.achievements = getInitialAchievements();
        }
        if (!parsedUser.achievementProgress) {
          parsedUser.achievementProgress = [];
        }
        if (!parsedUser.performanceMetrics) {
          parsedUser.performanceMetrics = getInitialPerformanceMetrics();
        }
        if (!parsedUser.stats) {
          parsedUser.stats = getInitialStats();
        }
        setUser(parsedUser);
        // Check achievements on login to unlock initial achievements
        setTimeout(() => {
          checkAchievements();
        }, 100);
      } else {
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0],
          stats: getInitialStats(),
          subscription: {
            planId: 'free',
            plan: SUBSCRIPTION_PLANS[0],
            startDate: new Date(),
            isActive: true,
            autoRenewal: false
          },
          performanceMetrics: getInitialPerformanceMetrics(),
          isFamilyHead: true,
          familyMembers: []
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    if (name && email && password) {
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name,
          stats: getInitialStats(),
          achievements: getInitialAchievements(),
          achievementProgress: [],
          subscription: {
            planId: 'free',
            plan: SUBSCRIPTION_PLANS[0],
            startDate: new Date(),
            isActive: true,
            autoRenewal: false
          },
          performanceMetrics: getInitialPerformanceMetrics(),
          isFamilyHead: true,
          familyMembers: []
        };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Check achievements for new user
      setTimeout(() => checkAchievements(), 100);
      return true;
    }
    return false;
  };

  const updateAssessmentResult = async (score: number, totalQuestions: number, weakTopics: string[], assessmentData?: any) => {
    if (!user) return;

    const percentage = Math.round((score / totalQuestions) * 100);
    const level: 'beginner' | 'intermediate' | 'advanced' =
      percentage >= 80 ? 'advanced' :
      percentage >= 60 ? 'intermediate' : 'beginner';

    const assessmentResult: AssessmentResult = {
      score,
      totalQuestions,
      level,
      completedAt: new Date(),
      weakTopics
    };

    const updatedUser = {
      ...user,
      knowledgeLevel: level,
      assessmentResult
    };

    // Generate personalized course based on weak topics and detailed assessment data
    const personalizedCourse = await generatePersonalizedCourse(weakTopics, level, assessmentData);

    updatedUser.personalizedCourse = personalizedCourse;

    // Add personalized course to active courses if not already there
    const activeCourses = updatedUser.activeCourses || [];
    const existingPersonalizedCourse = activeCourses.find(course => course.id === 'personalized');

    if (!existingPersonalizedCourse) {
      activeCourses.push({
        id: 'personalized',
        title: personalizedCourse.title,
        description: personalizedCourse.description,
        progress: 0,
        level: level === 'beginner' ? 'Начинающий' : level === 'intermediate' ? 'Средний' : 'Продвинутый',
        students: 'Персональный',
        color: 'from-purple-500 to-pink-600',
        modules: personalizedCourse.modules.length,
        completedModules: 0,
        icon: 'Brain',
        startedAt: new Date()
      });
    }

    updatedUser.activeCourses = activeCourses;

    // Update user statistics
    updatedUser.stats = {
      ...(updatedUser.stats || getInitialStats()),
      activeCourses: activeCourses.length,
      achievements: Math.max(updatedUser.stats?.achievements || 0, 1), // At least 1 achievement for completing assessment
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const generatePersonalizedCourse = async (weakTopics: string[], level: 'beginner' | 'intermediate' | 'advanced', assessmentData?: any): Promise<PersonalizedCourse> => {
    try {
      // Prepare detailed analysis from assessment data
      let detailedAnalysis = '';
      if (assessmentData) {
        const incorrectQuestions = assessmentData.questions.filter((q: any, index: number) =>
          assessmentData.userAnswers[index] !== q.correctAnswer
        );

        detailedAnalysis = `
Анализ результатов тестирования:
- Правильных ответов: ${assessmentData.score} из ${assessmentData.totalQuestions}
- Неправильные вопросы:
${incorrectQuestions.map((q: any, index: number) => {
  const userAnswerIndex = assessmentData.userAnswers[assessmentData.questions.indexOf(q)];
  const userAnswer = q.options[userAnswerIndex] || 'Не ответил';
  return `${index + 1}. "${q.question}"
     Ваш ответ: ${userAnswer}
     Правильный: ${q.options[q.correctAnswer]}
     Пояснение: ${q.explanation}`;
}).join('\n')}

На основе этих ошибок нужно создать курс, который исправит конкретные пробелы в знаниях.`;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Ты - опытный преподаватель русского языка и литературы, кандидат филологических наук. Создай детальный персонализированный курс обучения на основе конкретных ошибок студента в тестировании.

Уровень студента: ${level === 'beginner' ? 'Начинающий (нужны базовые знания)' : level === 'intermediate' ? 'Средний (нужны углубленные знания)' : 'Продвинутый (нужны экспертные знания)'}

Слабые темы: ${weakTopics.join(', ')}

${detailedAnalysis}

ВАЖНЫЕ ТРЕБОВАНИЯ:
1. Анализируй КОНКРЕТНЫЕ ошибки студента из результатов тестирования
2. Создай модули, которые напрямую исправляют выявленные пробелы
3. Каждый урок должен быть конкретным и целевым
4. Уроки должны идти от простого к сложному
5. Включи практические упражнения для закрепления материала

Структура курса:
- 3-5 модулей по слабым темам
- Каждый модуль: 4-6 конкретных уроков
- Уроки должны исправлять конкретные ошибки из теста

Примеры уроков для разных тем:
- Падежи: "Винительный падеж одушевленных существительных", "Предложный падеж с предлогами 'о/об'"
- Части речи: "Различение прилагательных и причастий", "Образование наречий"
- Члены предложения: "Различение подлежащего и дополнения", "Определения и обстоятельства"

Формат ответа (ТОЛЬКО JSON):
{
  "title": "Название курса (учитывающее слабые темы)",
  "description": "Подробное описание курса с анализом ошибок",
  "topics": ["тема1", "тема2", ...],
  "difficulty": "${level}",
  "estimatedHours": число,
  "modules": [
    {
      "title": "Название модуля (конкретная тема из ошибок)",
      "description": "Почему этот модуль нужен и что исправит",
      "lessons": [
        "Конкретный урок 1 - исправляет конкретную ошибку",
        "Конкретный урок 2 - закрепляет правило",
        "Конкретный урок 3 - практика применения"
      ]
    }
  ]
}`,
            },
            {
              role: 'user',
              content: `Создай персонализированный курс для исправления этих конкретных ошибок в тестировании. Фокус на том, что студент ответил неправильно.`,
            },
          ],
          max_tokens: 2500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate personalized course');
      }

      const data = await response.json();
      const courseData = JSON.parse(data.choices[0].message.content.replace(/```json\n?|\n?```/g, ''));

      return {
        id: `personalized-${Date.now()}`,
        ...courseData
      };
    } catch (error) {
      console.error('Error generating personalized course:', error);
      // Fallback course based on weak topics
      return {
        id: `personalized-${Date.now()}`,
        title: "Исправление пробелов в знаниях",
        description: `Персонализированный курс для исправления ошибок в темах: ${weakTopics.join(', ')}`,
        topics: weakTopics,
        difficulty: level,
        estimatedHours: Math.max(15, weakTopics.length * 5),
        modules: weakTopics.map((topic, index) => ({
          title: `Модуль ${index + 1}: ${topic}`,
          description: `Исправление пробелов в теме "${topic}" на основе ваших ошибок в тестировании`,
          lessons: [
            `Введение в ${topic.toLowerCase()}`,
            `Основные правила ${topic.toLowerCase()}`,
            `Практика применения правил`,
            `Закрепление материала`,
            `Контрольное тестирование`
          ]
        }))
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserStats = (updates: Partial<UserStats>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      stats: {
        ...(user.stats || getInitialStats()),
        ...updates
      } as UserStats
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const completeLesson = (moduleId: number, lessonId: number) => {
    if (!user) return;

    const lessonKey = `${moduleId}-${lessonId}`;
    const currentCompletedLessons = user.completedLessons || [];

    if (!currentCompletedLessons.includes(lessonKey)) {
      const updatedUser = {
        ...user,
        completedLessons: [...currentCompletedLessons, lessonKey],
        stats: {
          ...(user.stats || getInitialStats()),
          totalLessonsCompleted: (user.stats?.totalLessonsCompleted || 0) + 1,
          averageProgress: user.personalizedCourse ?
            Math.round((((user.stats?.totalLessonsCompleted || 0) + 1) /
              user.personalizedCourse.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)) * 100) :
            (user.stats?.averageProgress || 0)
        },
        performanceMetrics: {
          ...(user.performanceMetrics || getInitialPerformanceMetrics()),
          lessonsCompleted: (user.performanceMetrics?.lessonsCompleted || 0) + 1
        }
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Check for achievement unlocks
      checkAchievements();
    }
  };

  const startCourse = (courseData: Omit<ActiveCourse, 'startedAt'>) => {
    if (!user) return;

    // Ensure course ID is a string
    const courseId = typeof courseData.id === 'number' ? courseData.id.toString() : courseData.id;
    const normalizedCourseData = { ...courseData, id: courseId };

    const currentActiveCourses = user.activeCourses || [];
    const existingCourseIndex = currentActiveCourses.findIndex(course => course.id === courseId);

    if (existingCourseIndex === -1) {
      // Add new course
      const newCourse: ActiveCourse = {
        ...normalizedCourseData,
        startedAt: new Date()
      };

      const updatedUser = {
        ...user,
        activeCourses: [...currentActiveCourses, newCourse],
        stats: {
          ...(user.stats || getInitialStats()),
          activeCourses: (user.stats?.activeCourses || 0) + 1
        }
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateSubscription = async (planId: string): Promise<void> => {
    if (!user) return;

    const selectedPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
    if (!selectedPlan) return;

    const updatedUser = {
      ...user,
      subscription: {
        planId,
        plan: selectedPlan,
        startDate: new Date(),
        isActive: true,
        autoRenewal: true
      }
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const addFamilyMember = async (memberData: Omit<FamilyMember, 'id' | 'username' | 'password' | 'createdAt'>): Promise<void> => {
    if (!user || !user.isFamilyHead) return;

    const currentMembers = user.familyMembers || [];
    const maxMembers = user.subscription?.plan.maxFamilyMembers || 1;

    if (currentMembers.length >= maxMembers) {
      alert(`Превышен лимит членов семьи для вашего тарифа (${maxMembers})`);
      return;
    }

    // Generate username and password
    const username = `${memberData.name.toLowerCase().replace(/\s+/g, '')}${Date.now().toString().slice(-4)}`;
    const password = Math.random().toString(36).slice(-8);

    const newMember: FamilyMember = {
      ...memberData,
      id: Date.now().toString(),
      username,
      password,
      createdAt: new Date(),
      isActive: true
    };

    const updatedUser = {
      ...user,
      familyMembers: [...currentMembers, newMember]
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    alert(`Член семьи добавлен!\nЛогин: ${username}\nПароль: ${password}`);
  };

  const removeFamilyMember = async (memberId: string): Promise<void> => {
    if (!user || !user.isFamilyHead) return;

    const updatedUser = {
      ...user,
      familyMembers: user.familyMembers?.filter(member => member.id !== memberId) || []
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const updatePerformanceMetrics = (metrics: Partial<PerformanceMetrics>): void => {
    if (!user) return;

    const updatedUser = {
      ...user,
      performanceMetrics: {
        ...(user.performanceMetrics || getInitialPerformanceMetrics()),
        ...metrics
      }
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const stopCourse = (courseId: string): void => {
    if (!user) return;

    const updatedUser = {
      ...user,
      activeCourses: user.activeCourses?.filter(course => course.id !== courseId) || [],
      stats: {
        ...(user.stats || getInitialStats()),
        activeCourses: Math.max(0, (user.stats?.activeCourses || 0) - 1)
      }
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const updateAchievementProgress = (achievementId: string, newProgress: number): void => {
    if (!user) return;

    const currentProgress = user.achievementProgress || [];
    const existingProgressIndex = currentProgress.findIndex(p => p.achievementId === achievementId);

    if (existingProgressIndex >= 0) {
      currentProgress[existingProgressIndex] = {
        ...currentProgress[existingProgressIndex],
        currentProgress: Math.max(currentProgress[existingProgressIndex].currentProgress, newProgress),
        lastUpdated: new Date()
      };
    } else {
      currentProgress.push({
        achievementId,
        currentProgress: newProgress,
        lastUpdated: new Date()
      });
    }

    const updatedUser = {
      ...user,
      achievementProgress: currentProgress
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Check if achievement should be unlocked
    checkAchievements();
  };

  const checkAchievements = (): void => {
    if (!user) return;

    const achievements = user.achievements || [];
    const achievementProgress = user.achievementProgress || [];
    const stats = user.stats || getInitialStats();
    const performanceMetrics = user.performanceMetrics || getInitialPerformanceMetrics();

    let achievementsUnlocked = false;
    let totalPoints = 0;

    const updatedAchievements = achievements.map(achievement => {
      const progress = achievementProgress.find(p => p.achievementId === achievement.id);
      const currentProgress = progress ? progress.currentProgress : 0;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first-lesson':
          shouldUnlock = stats.totalLessonsCompleted >= 1;
          break;
        case 'lesson-master':
          shouldUnlock = stats.totalLessonsCompleted >= 10;
          break;
        case 'scholar':
          shouldUnlock = stats.totalLessonsCompleted >= 50;
          break;
        case 'knowledge-seeker':
          shouldUnlock = stats.totalLessonsCompleted >= 100;
          break;
        case 'consistent-learner':
          shouldUnlock = performanceMetrics.streakDays >= 7;
          break;
        case 'first-login':
          shouldUnlock = true; // Always unlocked for logged in users
          break;
        case 'week-warrior':
          shouldUnlock = performanceMetrics.streakDays >= 7;
          break;
        case 'month-master':
          shouldUnlock = performanceMetrics.streakDays >= 30;
          break;
        case 'dedicated-student':
          shouldUnlock = performanceMetrics.totalStudyTime >= 600; // 10 hours in minutes
          break;
        case 'marathon-runner':
          shouldUnlock = performanceMetrics.totalStudyTime >= 3000; // 50 hours in minutes
          break;
        case 'centurion':
          shouldUnlock = performanceMetrics.totalStudyTime >= 6000; // 100 hours in minutes
          break;
        case 'first-victory':
          shouldUnlock = achievements.some(a => a.unlocked && a.id !== 'first-victory');
          break;
        case 'achievement-hunter':
          shouldUnlock = achievements.filter(a => a.unlocked).length >= 10;
          break;
        case 'legend':
          shouldUnlock = achievements.filter(a => a.unlocked).length >= 25;
          break;
        case 'ultimate-scholar':
          shouldUnlock = achievements.filter(a => a.unlocked).length >= achievements.length - 1; // All except this one
          break;
        default:
          shouldUnlock = currentProgress >= achievement.maxProgress;
      }

      if (shouldUnlock && !achievement.unlocked) {
        achievementsUnlocked = true;
        totalPoints += achievement.points;
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date()
        };
      }

      return achievement;
    });

    if (achievementsUnlocked) {
      const unlockedCount = updatedAchievements.filter(a => a.unlocked).length;
      const totalPointsEarned = updatedAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

      const updatedUser = {
        ...user,
        achievements: updatedAchievements,
        stats: {
          ...stats,
          achievements: unlockedCount
        }
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    register,
    updateAssessmentResult,
    updateUserStats,
    completeLesson,
    startCourse,
    updateSubscription,
    addFamilyMember,
    removeFamilyMember,
    updatePerformanceMetrics,
    stopCourse,
    updateAchievementProgress,
    checkAchievements,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
