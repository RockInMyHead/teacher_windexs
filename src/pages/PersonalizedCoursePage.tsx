import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Brain,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Target,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Star
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';

const PersonalizedCoursePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentModule, setCurrentModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [modulesCollapsed, setModulesCollapsed] = useState(true);

  // Function to translate concept keys to Russian names
  const translateConcept = (concept: string): string => {
    const conceptLabels: Record<string, string> = {
      greetings_basic: 'Приветствия',
      greetings_simple: 'Простые приветствия',
      numbers_1_5: 'Числа 1–5',
      numbers_1_20: 'Числа 1–20',
      numbers_basic: 'Базовые числа',
      colors_basic: 'Основные цвета',
      alphabet_A_G: 'Алфавит A–G',
      alphabet_basic: 'Базовый алфавит',
      full_alphabet: 'Полный алфавит',
      animals_basic: 'Животные',
      verbs_basic: 'Базовые глаголы',
      family_basic: 'Семья и друзья',
      school_basic: 'Школа и учеба',
      food_basic: 'Еда и напитки',
      days_basic: 'Дни недели',
      weather_basic: 'Погода',
      time_basic: 'Время',
      pronouns_basic: 'Местоимения',
      phonics_basic: 'Произношение',
      classroom_objects: 'Предметы в классе',
      emotions_basic: 'Эмоции',
      hobbies_basic: 'Хобби и увлечения',
      present_simple: 'Present Simple',
      past_simple_regular: 'Past Simple (правильные глаголы)',
      present_continuous: 'Present Continuous',
      have_got: 'Have Got',
      prepositions_place: 'Предлоги места',
      to_be_full: 'To Be (полная форма)',
      reading_2_3_sent: 'Чтение простых предложений',
      present_perfect: 'Present Perfect',
      phrasal_verbs: 'Фразовые глаголы',
      comparative: 'Сравнительная степень',
      comparative_superlative: 'Сравнительные степени',
      health_sports: 'Здоровье и спорт',
      technology_gadgets: 'Технологии и гаджеты',
      conditionals: 'Условные предложения',
      passive_voice: 'Пассивный залог',
      passive_present: 'Пассивный залог (Present)',
      complex_times: 'Сложные времена',
      speaking_discussions: 'Говорение и дискуссии',
      academic_texts: 'Академические тексты',
      complex_grammar: 'Сложная грамматика',
      essay_writing: 'Написание эссе',
      oral_presentations: 'Устные презентации',
      exam_preparation: 'Подготовка к экзаменам',
      academic_writing: 'Академическое письмо',
      perfect_continuous: 'Perfect Continuous',
      english_idioms: 'Английские идиомы',
      discussions_arguments: 'Дискуссии и аргументация',
      ege_ielts_prep: 'Подготовка к ЕГЭ/IELTS',
      future_perfect: 'Future Perfect',
      academic_vocab: 'Академическая лексика',
      passive_voice_advanced: 'Сложный пассив',
      reported_speech: 'Косвенная речь',
      cohesive_devices: 'Связующие элементы текста',
      business_english: 'Бизнес-английский',
      negotiations_language: 'Лексика переговоров',
      emails_formal: 'Формальные письма',
      idioms_advanced: 'Продвинутые идиомы',
      presentation_skills: 'Навыки презентаций',
      modals_basic: 'Модальные глаголы',
      zero_conditional: 'Условные предложения (тип 0)'
    };

    return conceptLabels[concept] || concept;
  };

  const courseId = user?.personalizedCourse?.id || 'personalized';
  const completedLessons = new Set(user?.completedLessons || []);

  // Read URL parameters to highlight current lesson
  useEffect(() => {
    const courseParam = searchParams.get('course');
    const currentParam = searchParams.get('current');

    if (currentParam) {
      setActiveLesson(currentParam);
      // Parse module and lesson indices
      const [moduleIndex, lessonIndex] = currentParam.split('_').map(Number);
      if (!isNaN(moduleIndex)) {
        setCurrentModule(moduleIndex);
      }
    }
  }, [searchParams]);

  if (!user?.personalizedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Персональный курс не найден</h2>
            <p className="text-muted-foreground mb-4">
              Пройдите тестирование, чтобы получить персонализированный курс обучения.
            </p>
            <Button onClick={() => navigate('/assessment')}>
              Пройти тест
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const course = user.personalizedCourse;
  if (!course || !course.modules || course.modules.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Курс не найден</CardTitle>
            <CardDescription>
              Персонализированный курс еще не создан или недоступен.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/assessment')} className="w-full">
              Пройти тест для создания курса
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const module = course.modules[currentModule];
  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Модуль не найден</CardTitle>
            <CardDescription>
              Выбранный модуль недоступен.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/courses')} className="w-full">
              Вернуться к курсам
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentModule + 1) / course.modules.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
                <Badge variant="secondary">
                  {course.difficulty === 'beginner' ? 'Начинающий' :
                   course.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  {course.modules.length} модулей
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  ~{course.estimatedHours} часов
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Персонализирован
                </div>
              </div>
            </div>
          </div>

          {/* Topics Tags */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Ключевые темы курса:</h3>
            <div className="flex flex-wrap gap-2">
              {course.topics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {translateConcept(topic)}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Modules Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <Collapsible open={!modulesCollapsed} onOpenChange={() => setModulesCollapsed(!modulesCollapsed)}>
                <CardHeader className="pb-2">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto hover:bg-transparent"
                    >
                      <CardTitle className="text-lg">Модули курса</CardTitle>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${modulesCollapsed ? '-rotate-90' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent className="space-y-0">
                  <CardContent className="pt-0 space-y-2">
                    {course.modules.map((mod, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentModule(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          index === currentModule
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            index === currentModule ? 'bg-primary text-white' : 'bg-muted'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              index === currentModule ? 'text-primary' : ''
                            }`}>
                              {mod.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {mod.lessons.length} уроков
                            </p>
                          </div>
                          {index === currentModule && (
                            <ChevronRight className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>

          {/* Current Module Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{module.title}</CardTitle>
                    <CardDescription className="text-base">{module.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    Модуль {currentModule + 1}
                  </Badge>
                </div>
              </CardHeader>

            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalizedCoursePage;
