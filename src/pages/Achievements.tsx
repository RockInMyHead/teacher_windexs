import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Star,
  BookOpen,
  Brain,
  Target,
  Clock,
  MessageCircle,
  CheckCircle,
  Award,
  Flame,
  Zap,
  Crown,
  Medal,
  Shield,
  ArrowLeft,
  Lock,
  Sparkles,
  Heart,
  Coffee,
  Sun,
  Moon,
  Calendar,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Users,
  Rocket,
  Gift,
  Diamond,
  Globe,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: 'learning' | 'activity' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  points: number;
}

const achievements: Achievement[] = [
  // Обучение (Learning)
  {
    id: 'first-lesson',
    title: 'Первый урок',
    description: 'Завершите свой первый урок',
    icon: BookOpen,
    color: 'text-blue-500',
    category: 'learning',
    rarity: 'common',
    requirement: 'Завершить 1 урок',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 10
  },
  {
    id: 'lesson-master',
    title: 'Мастер уроков',
    description: 'Завершите 10 уроков',
    icon: Brain,
    color: 'text-purple-500',
    category: 'learning',
    rarity: 'rare',
    requirement: 'Завершить 10 уроков',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    points: 50
  },
  {
    id: 'scholar',
    title: 'Ученый',
    description: 'Завершите 50 уроков',
    icon: Crown,
    color: 'text-yellow-500',
    category: 'learning',
    rarity: 'epic',
    requirement: 'Завершить 50 уроков',
    progress: 0,
    maxProgress: 50,
    unlocked: false,
    points: 200
  },
  {
    id: 'knowledge-seeker',
    title: 'Искатель знаний',
    description: 'Завершите 100 уроков',
    icon: Lightbulb,
    color: 'text-orange-500',
    category: 'learning',
    rarity: 'legendary',
    requirement: 'Завершить 100 уроков',
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    points: 500
  },
  {
    id: 'perfect-score',
    title: 'Идеальный балл',
    description: 'Получите 100% за тест',
    icon: Target,
    color: 'text-green-500',
    category: 'learning',
    rarity: 'rare',
    requirement: 'Получить 100% в тесте',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 75
  },
  {
    id: 'consistent-learner',
    title: 'Последовательный ученик',
    description: 'Учитесь 7 дней подряд',
    icon: Calendar,
    color: 'text-indigo-500',
    category: 'learning',
    rarity: 'rare',
    requirement: '7 дней подряд обучения',
    progress: 0,
    maxProgress: 7,
    unlocked: false,
    points: 100
  },
  {
    id: 'early-bird',
    title: 'Ранняя пташка',
    description: 'Завершите урок до 8 утра',
    icon: Sun,
    color: 'text-yellow-400',
    category: 'learning',
    rarity: 'common',
    requirement: 'Урок до 8:00',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 25
  },
  {
    id: 'night-owl',
    title: 'Ночная сова',
    description: 'Завершите урок после 22:00',
    icon: Moon,
    color: 'text-blue-400',
    category: 'learning',
    rarity: 'common',
    requirement: 'Урок после 22:00',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 25
  },
  {
    id: 'speed-demon',
    title: 'Гонщик',
    description: 'Завершите урок за менее чем 10 минут',
    icon: Zap,
    color: 'text-yellow-300',
    category: 'learning',
    rarity: 'rare',
    requirement: 'Урок < 10 мин',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 40
  },
  {
    id: 'deep-thinker',
    title: 'Глубокий мыслитель',
    description: 'Проведите 2 часа за одним уроком',
    icon: Brain,
    color: 'text-purple-600',
    category: 'learning',
    rarity: 'rare',
    requirement: '2 часа за уроком',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 60
  },

  // Активность (Activity)
  {
    id: 'first-login',
    title: 'Добро пожаловать!',
    description: 'Войдите в приложение впервые',
    icon: Sparkles,
    color: 'text-pink-500',
    category: 'activity',
    rarity: 'common',
    requirement: 'Первый вход',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 5
  },
  {
    id: 'week-warrior',
    title: 'Воин недели',
    description: 'Активность в приложении 7 дней',
    icon: Flame,
    color: 'text-red-500',
    category: 'activity',
    rarity: 'common',
    requirement: '7 дней активности',
    progress: 0,
    maxProgress: 7,
    unlocked: false,
    points: 30
  },
  {
    id: 'month-master',
    title: 'Мастер месяца',
    description: 'Активность в приложении 30 дней',
    icon: Calendar,
    color: 'text-blue-600',
    category: 'activity',
    rarity: 'epic',
    requirement: '30 дней активности',
    progress: 0,
    maxProgress: 30,
    unlocked: false,
    points: 150
  },
  {
    id: 'dedicated-student',
    title: 'Преданный ученик',
    description: 'Накопите 10 часов обучения',
    icon: Clock,
    color: 'text-gray-600',
    category: 'activity',
    rarity: 'rare',
    requirement: '10 часов обучения',
    progress: 0,
    maxProgress: 600, // минуты
    unlocked: false,
    points: 80
  },
  {
    id: 'marathon-runner',
    title: 'Марафонец',
    description: 'Накопите 50 часов обучения',
    icon: TrendingUp,
    color: 'text-green-600',
    category: 'activity',
    rarity: 'epic',
    requirement: '50 часов обучения',
    progress: 0,
    maxProgress: 3000, // минуты
    unlocked: false,
    points: 300
  },
  {
    id: 'centurion',
    title: 'Столп знания',
    description: 'Накопите 100 часов обучения',
    icon: Crown,
    color: 'text-gold-500',
    category: 'activity',
    rarity: 'legendary',
    requirement: '100 часов обучения',
    progress: 0,
    maxProgress: 6000, // минуты
    unlocked: false,
    points: 750
  },
  {
    id: 'chatty-student',
    title: 'Общительный ученик',
    description: 'Задайте 10 вопросов AI преподавателю',
    icon: MessageCircle,
    color: 'text-cyan-500',
    category: 'activity',
    rarity: 'common',
    requirement: '10 вопросов AI',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    points: 20
  },
  {
    id: 'ai-disciple',
    title: 'Ученик AI',
    description: 'Задайте 100 вопросов AI преподавателю',
    icon: Brain,
    color: 'text-purple-500',
    category: 'activity',
    rarity: 'epic',
    requirement: '100 вопросов AI',
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    points: 250
  },
  {
    id: 'coffee-break',
    title: 'Кофейная пауза',
    description: 'Сделайте перерыв после 5 уроков подряд',
    icon: Coffee,
    color: 'text-amber-600',
    category: 'activity',
    rarity: 'common',
    requirement: 'Перерыв после 5 уроков',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 15
  },
  {
    id: 'perfectionist',
    title: 'Перфекционист',
    description: 'Повторите урок 3 раза',
    icon: Target,
    color: 'text-red-500',
    category: 'activity',
    rarity: 'rare',
    requirement: 'Повторение урока 3 раза',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 45
  },

  // Социальные (Social)
  {
    id: 'social-butterfly',
    title: 'Социальная бабочка',
    description: 'Поделитесь достижением в соцсетях',
    icon: Users,
    color: 'text-pink-400',
    category: 'social',
    rarity: 'common',
    requirement: 'Поделиться достижением',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 10
  },
  {
    id: 'ambassador',
    title: 'Посол знаний',
    description: 'Пригласите 5 друзей в приложение',
    icon: Users,
    color: 'text-blue-500',
    category: 'social',
    rarity: 'rare',
    requirement: 'Пригласить 5 друзей',
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    points: 100
  },
  {
    id: 'community-leader',
    title: 'Лидер сообщества',
    description: 'Пригласите 20 друзей в приложение',
    icon: Crown,
    color: 'text-purple-600',
    category: 'social',
    rarity: 'epic',
    requirement: 'Пригласить 20 друзей',
    progress: 0,
    maxProgress: 20,
    unlocked: false,
    points: 400
  },
  {
    id: 'feedback-guru',
    title: 'Гуру обратной связи',
    description: 'Оставьте 10 отзывов об уроках',
    icon: Star,
    color: 'text-yellow-500',
    category: 'social',
    rarity: 'rare',
    requirement: '10 отзывов',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    points: 50
  },
  {
    id: 'mentor',
    title: 'Наставник',
    description: 'Помогите 3 друзьям с уроками',
    icon: Heart,
    color: 'text-red-400',
    category: 'social',
    rarity: 'epic',
    requirement: 'Помочь 3 друзьям',
    progress: 0,
    maxProgress: 3,
    unlocked: false,
    points: 120
  },

  // Специальные (Special)
  {
    id: 'first-victory',
    title: 'Первая победа',
    description: 'Получите первое достижение',
    icon: Trophy,
    color: 'text-yellow-600',
    category: 'special',
    rarity: 'common',
    requirement: 'Любое достижение',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 15
  },
  {
    id: 'achievement-hunter',
    title: 'Охотник за достижениями',
    description: 'Получите 10 достижений',
    icon: Target,
    color: 'text-green-500',
    category: 'special',
    rarity: 'rare',
    requirement: '10 достижений',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    points: 100
  },
  {
    id: 'legend',
    title: 'Легенда',
    description: 'Получите 25 достижений',
    icon: Crown,
    color: 'text-purple-700',
    category: 'special',
    rarity: 'epic',
    requirement: '25 достижений',
    progress: 0,
    maxProgress: 25,
    unlocked: false,
    points: 500
  },
  {
    id: 'ultimate-scholar',
    title: 'Высший ученый',
    description: 'Получите все достижения',
    icon: Diamond,
    color: 'text-cyan-400',
    category: 'special',
    rarity: 'legendary',
    requirement: 'Все достижения',
    progress: 0,
    maxProgress: 50,
    unlocked: false,
    points: 2000
  },
  {
    id: 'speedrunner',
    title: 'Спидираннер',
    description: 'Получите достижение за 1 день после регистрации',
    icon: Rocket,
    color: 'text-red-600',
    category: 'special',
    rarity: 'epic',
    requirement: 'Достижение за 1 день',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 150
  },
  {
    id: 'renaissance-man',
    title: 'Человек эпохи Возрождения',
    description: 'Завершите курсы по 5 разным предметам',
    icon: BookOpen,
    color: 'text-indigo-600',
    category: 'special',
    rarity: 'legendary',
    requirement: '5 разных предметов',
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    points: 800
  },
  {
    id: 'time-traveler',
    title: 'Путешественник во времени',
    description: 'Учитесь в приложении ровно 1 год',
    icon: Calendar,
    color: 'text-teal-500',
    category: 'special',
    rarity: 'legendary',
    requirement: '1 год активности',
    progress: 0,
    maxProgress: 365,
    unlocked: false,
    points: 1000
  },
  {
    id: 'polyglot',
    title: 'Полиглот',
    description: 'Изучайте 3 разных языка',
    icon: Globe,
    color: 'text-green-500',
    category: 'special',
    rarity: 'epic',
    requirement: '3 языка',
    progress: 0,
    maxProgress: 3,
    unlocked: false,
    points: 300
  },
  {
    id: 'quiz-master',
    title: 'Мастер викторин',
    description: 'Ответьте правильно на 1000 вопросов',
    icon: Brain,
    color: 'text-orange-500',
    category: 'special',
    rarity: 'legendary',
    requirement: '1000 правильных ответов',
    progress: 0,
    maxProgress: 1000,
    unlocked: false,
    points: 600
  },
  {
    id: 'streak-master',
    title: 'Мастер серий',
    description: 'Поддерживайте серию обучения 100 дней',
    icon: Flame,
    color: 'text-red-700',
    category: 'special',
    rarity: 'legendary',
    requirement: '100 дней подряд',
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    points: 1200
  },

  // Дополнительные достижения для полноты списка
  {
    id: 'bookworm',
    title: 'Книжный червь',
    description: 'Прочитайте 100 страниц учебного материала',
    icon: BookOpen,
    color: 'text-brown-600',
    category: 'learning',
    rarity: 'rare',
    requirement: '100 страниц',
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    points: 40
  },
  {
    id: 'memory-champion',
    title: 'Чемпион памяти',
    description: 'Повторите урок через месяц после изучения',
    icon: Brain,
    color: 'text-purple-400',
    category: 'learning',
    rarity: 'epic',
    requirement: 'Повтор через месяц',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 90
  },
  {
    id: 'goal-setter',
    title: 'Целеполагатель',
    description: 'Установите и достигните 10 личных целей',
    icon: Target,
    color: 'text-green-600',
    category: 'activity',
    rarity: 'rare',
    requirement: '10 достигнутых целей',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    points: 70
  },
  {
    id: 'night-shift',
    title: 'Ночная смена',
    description: 'Завершите урок в полночь',
    icon: Moon,
    color: 'text-indigo-300',
    category: 'activity',
    rarity: 'common',
    requirement: 'Урок в 00:00',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 35
  },
  {
    id: 'weekend-warrior',
    title: 'Воин выходных',
    description: 'Учитесь по выходным 10 раз',
    icon: Calendar,
    color: 'text-orange-500',
    category: 'activity',
    rarity: 'common',
    requirement: '10 выходных уроков',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    points: 30
  },
  {
    id: 'collaborator',
    title: 'Соработник',
    description: 'Участвуйте в командном задании',
    icon: Users,
    color: 'text-teal-500',
    category: 'social',
    rarity: 'rare',
    requirement: 'Командное задание',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 55
  },
  {
    id: 'content-creator',
    title: 'Создатель контента',
    description: 'Создайте и поделитесь учебным материалом',
    icon: Lightbulb,
    color: 'text-yellow-600',
    category: 'social',
    rarity: 'epic',
    requirement: 'Создать контент',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 180
  },
  {
    id: 'beta-tester',
    title: 'Бета-тестер',
    description: 'Сообщите о 5 найденных ошибках',
    icon: Shield,
    color: 'text-gray-500',
    category: 'special',
    rarity: 'rare',
    requirement: '5 баг-репортов',
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    points: 65
  },
  {
    id: 'loyal-user',
    title: 'Лояльный пользователь',
    description: 'Используйте приложение 6 месяцев',
    icon: Heart,
    color: 'text-red-500',
    category: 'special',
    rarity: 'epic',
    requirement: '6 месяцев использования',
    progress: 0,
    maxProgress: 180,
    unlocked: false,
    points: 250
  },
  {
    id: 'pioneer',
    title: 'Пионер',
    description: 'Будьте среди первых 100 пользователей',
    icon: Rocket,
    color: 'text-blue-700',
    category: 'special',
    rarity: 'legendary',
    requirement: 'Топ-100 пользователей',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 1000
  },
  {
    id: 'motivator',
    title: 'Мотиватор',
    description: 'Напишите мотивационный пост для сообщества',
    icon: Sparkles,
    color: 'text-pink-600',
    category: 'social',
    rarity: 'common',
    requirement: 'Мотивационный пост',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 20
  },
  {
    id: 'language-lover',
    title: 'Любитель языков',
    description: 'Изучите основы 10 языков',
    icon: Globe,
    color: 'text-emerald-500',
    category: 'learning',
    rarity: 'legendary',
    requirement: '10 языков',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    points: 900
  },
  {
    id: 'consistency-king',
    title: 'Король последовательности',
    description: 'Завершайте по 1 уроку ежедневно 365 дней',
    icon: Crown,
    color: 'text-gold-600',
    category: 'activity',
    rarity: 'legendary',
    requirement: '365 дней по 1 уроку',
    progress: 0,
    maxProgress: 365,
    unlocked: false,
    points: 1500
  },
  {
    id: 'question-asker',
    title: 'Вопроситель',
    description: 'Задайте 50 разных вопросов AI',
    icon: MessageCircle,
    color: 'text-cyan-600',
    category: 'activity',
    rarity: 'rare',
    requirement: '50 вопросов AI',
    progress: 0,
    maxProgress: 50,
    unlocked: false,
    points: 125
  },
  {
    id: 'feedback-hero',
    title: 'Герой отзывов',
    description: 'Получите 10 полезных отзывов от других учеников',
    icon: Star,
    color: 'text-amber-500',
    category: 'social',
    rarity: 'epic',
    requirement: '10 отзывов',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    points: 200
  },
  {
    id: 'milestone-master',
    title: 'Мастер вех',
    description: 'Достигните всех основных этапов обучения',
    icon: Trophy,
    color: 'text-silver-500',
    category: 'special',
    rarity: 'epic',
    requirement: 'Все основные этапы',
    progress: 0,
    maxProgress: 20,
    unlocked: false,
    points: 350
  },
  {
    id: 'explorer',
    title: 'Исследователь',
    description: 'Попробуйте все доступные функции приложения',
    icon: Rocket,
    color: 'text-indigo-500',
    category: 'activity',
    rarity: 'rare',
    requirement: 'Все функции',
    progress: 0,
    maxProgress: 15,
    unlocked: false,
    points: 85
  },
  {
    id: 'social-share',
    title: 'Шеринг-чемпион',
    description: 'Поделитесь 25 достижениями в соцсетях',
    icon: Users,
    color: 'text-blue-400',
    category: 'social',
    rarity: 'epic',
    requirement: '25 поделённых достижений',
    progress: 0,
    maxProgress: 25,
    unlocked: false,
    points: 175
  },
  {
    id: 'perfection-seeker',
    title: 'Искатель совершенства',
    description: 'Получите 95%+ во всех тестах за месяц',
    icon: Medal,
    color: 'text-gold-500',
    category: 'learning',
    rarity: 'legendary',
    requirement: '95%+ в тестах за месяц',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    points: 700
  },
  {
    id: 'community-helper',
    title: 'Помощник сообщества',
    description: 'Ответьте на 50 вопросов других учеников',
    icon: Heart,
    color: 'text-rose-500',
    category: 'social',
    rarity: 'epic',
    requirement: '50 ответов на вопросы',
    progress: 0,
    maxProgress: 50,
    unlocked: false,
    points: 275
  }
];

const Achievements = () => {
  const { user, checkAchievements } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | Achievement['category']>('all');
  const [selectedRarity, setSelectedRarity] = useState<'all' | Achievement['rarity']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get real user data
  const userStats = user?.stats || { totalLessonsCompleted: 0, achievements: 0 };
  const userAchievements = user?.achievements || [];
  const userAchievementProgress = user?.achievementProgress || [];
  const userPerformanceMetrics = user?.performanceMetrics || { totalStudyTime: 0, streakDays: 0 };

  // Check achievements on component mount
  useEffect(() => {
    if (checkAchievements) {
      checkAchievements();
    }
  }, [checkAchievements]);

  // Use real user achievements data or fall back to default achievements
  const baseAchievements = userAchievements.length > 0 ? userAchievements : achievements;
  const updatedAchievements = baseAchievements.map(achievement => {
    const progressData = userAchievementProgress.find(p => p.achievementId === achievement.id);
    const currentProgress = progressData ? progressData.currentProgress : 0;

    return {
      ...achievement,
      progress: Math.min(currentProgress, achievement.maxProgress)
    };
  });

  // Фильтрация достижений
  const filteredAchievements = updatedAchievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAchievements = filteredAchievements.slice(startIndex, startIndex + itemsPerPage);

  // Статистика
  const totalAchievements = updatedAchievements.length;
  const unlockedAchievements = updatedAchievements.filter(a => a.unlocked).length;
  const totalPoints = updatedAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getCategoryName = (category: Achievement['category']) => {
    switch (category) {
      case 'learning': return 'Обучение';
      case 'activity': return 'Активность';
      case 'social': return 'Социальные';
      case 'special': return 'Особые';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Общий прогресс</h2>
                  <p className="text-muted-foreground">
                    Продолжайте учиться, чтобы получать новые достижения!
                  </p>
                </div>
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Полученные достижения</span>
                    <span>{unlockedAchievements}/{totalAchievements}</span>
                  </div>
                  <Progress value={(unlockedAchievements / totalAchievements) * 100} className="h-3" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{unlockedAchievements}</div>
                    <div className="text-xs text-muted-foreground">Достижений</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
                    <div className="text-xs text-muted-foreground">Очков</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {updatedAchievements.filter(a => a.category === 'learning' && a.unlocked).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Обучение</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {updatedAchievements.filter(a => a.category === 'activity' && a.unlocked).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Активность</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Категория</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">Все категории</option>
                <option value="learning">Обучение</option>
                <option value="activity">Активность</option>
                <option value="social">Социальные</option>
                <option value="special">Особые</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Редкость</label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">Все редкости</option>
                <option value="common">Обычные</option>
                <option value="rare">Редкие</option>
                <option value="epic">Эпические</option>
                <option value="legendary">Легендарные</option>
              </select>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const isUnlocked = achievement.unlocked;

            return (
              <Card
                key={achievement.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  isUnlocked
                    ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5'
                    : 'border-border/50 opacity-75'
                }`}
              >
                {/* Rarity indicator */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  achievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                  achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                  'bg-gradient-to-r from-gray-400 to-gray-500'
                }`} />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isUnlocked ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`w-6 h-6 ${isUnlocked ? achievement.color : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getRarityColor(achievement.rarity)}`}
                      >
                        {achievement.rarity === 'common' ? 'Обычное' :
                         achievement.rarity === 'rare' ? 'Редкое' :
                         achievement.rarity === 'epic' ? 'Эпическое' : 'Легендарное'}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {getCategoryName(achievement.category)}
                      </div>
                    </div>
                  </div>

                  <CardTitle className={`text-lg ${isUnlocked ? '' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className={isUnlocked ? '' : 'text-muted-foreground'}>
                    {achievement.description}
                  </CardDescription>

                  {/* Progress */}
                  {!isUnlocked && achievement.maxProgress > 1 && (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Прогресс</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress
                        value={(achievement.progress / achievement.maxProgress) * 100}
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Lock overlay for locked achievements */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Points and requirement */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      {achievement.requirement}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{achievement.points}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Achievement Categories Legend */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Категории достижений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Обучение</div>
                    <div className="text-sm text-muted-foreground">Завершение уроков и тесты</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-medium">Активность</div>
                    <div className="text-sm text-muted-foreground">Регулярность и время</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-pink-500" />
                  <div>
                    <div className="font-medium">Социальные</div>
                    <div className="text-sm text-muted-foreground">Взаимодействие с другими</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Diamond className="w-5 h-5 text-cyan-500" />
                  <div>
                    <div className="font-medium">Особые</div>
                    <div className="text-sm text-muted-foreground">Уникальные достижения</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Achievements;
