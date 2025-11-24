import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeaderWithHero } from '@/components/Header';
import { COURSE_TEST_QUESTIONS } from '@/utils/coursePlans';
import { AdaptiveGradeLevelTest } from '@/components/AdaptiveGradeLevelTest';

// Маппинг courseId к названиям курсов
const COURSE_NAMES: { [key: number]: string } = {
  0: 'Русского языка',
  1: 'Английского языка',
  2: 'Арабского языка',
  4: 'Математики',
  5: 'Физики',
  6: 'Географии',
  7: 'Истории',
  8: 'Обществознания'
};

const getCourseNameById = (courseId: number): string => {
  return COURSE_NAMES[courseId] || 'выбранному курсу';
};

const AssessmentLevel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const courseIdNum = parseInt(courseId || '0');
  const gradeParam = searchParams.get('grade');
  const gradeFromUrl = gradeParam ? parseInt(gradeParam) : null;
  const courseName = getCourseNameById(courseIdNum);

  const [showAdaptiveTest, setShowAdaptiveTest] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  // Если grade уже передан в URL, автоматически определяем уровень и переходим к курсам
  useEffect(() => {
    if (gradeFromUrl && !selectedGrade) {
      // Для классов 1-10 сразу переходим к выбору курса
      if (gradeFromUrl >= 1 && gradeFromUrl <= 10) {
        navigate('/available-courses');
      }
    }
  }, [gradeFromUrl, selectedGrade, navigate]);

  // Маппинг уровней на grade значения
  // Используем доступные наборы вопросов (1, 3, 5, 7, 9 классы, 100 - ЕГЭ)
  const levelToGradeMap: { [key: string]: number } = {
    '1-3 класс': 1,
    '4-5 класс': 5,
    '6-7 класс': 7,
    '8-9 класс': 9,
    '10-11 класс': 9,
    'Вуз': 100,
    'Не знаю': 1
  };

  const handleLevelSelect = (level: string) => {
    const grade = levelToGradeMap[level];
    setSelectedLevel(level);
    setSelectedGrade(grade);
    // Сразу переходим к выбору курса
    navigate('/available-courses');
  };

  const handleAdaptiveTestComplete = (determinedGrade: number) => {
    // Найти соответствующий уровень для определённого grade
    const gradeToLevelMap: { [key: number]: string } = {
      1: '1-3 класс',
      3: '4-5 класс',
      5: '6-7 класс',
      7: '8-9 класс',
      9: '10-11 класс',
      100: 'Вуз'
    };

    const level = gradeToLevelMap[determinedGrade] || '1-3 класс';
    setSelectedLevel(level);
    setSelectedGrade(determinedGrade);
    setShowAdaptiveTest(false);
    // Сразу переходим к выбору курса
    navigate('/available-courses');
  }

  // Отображение адаптивного теста
  if (showAdaptiveTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container mx-auto px-4 py-8">
          <AdaptiveGradeLevelTest
            courseId={courseIdNum}
            onLevelDetermined={handleAdaptiveTestComplete}
            onCancel={() => navigate('/available-courses')}
          />
        </div>
      </div>
    );
  }

  const levelOptions = [
    '1-3 класс',
    '4-5 класс',
    '6-7 класс',
    '8-9 класс',
    '10-11 класс',
    'Вуз',
    'Не знаю'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <HeaderWithHero
        title={<>Оценка уровня знаний <span className="text-green-600 font-semibold">{courseName}</span></>}
        subtitle={gradeFromUrl ? `Выбран ${gradeFromUrl} класс. Укажите последнюю изученную тему для персонализации обучения` : "Помогите нам подобрать оптимальный уровень обучения для вас"}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="group border-2 border-border/60 bg-card/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-3xl animate-fade-in-up overflow-hidden">
            <CardHeader className="text-center pb-5">
              <CardTitle className="text-3xl font-bold tracking-tight mb-3 text-foreground group-hover:text-primary transition-colors">
                Оцените свой уровень знаний по {courseName}
              </CardTitle>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Выберите вариант, который лучше всего описывает ваш текущий уровень подготовки
              </p>
            </CardHeader>

            <CardContent className="space-y-6 px-6 sm:px-8 pb-8">
              <div className="grid gap-3">
                {levelOptions.map((level, index) => {
                  return (
                    <Button
                      key={level}
                      onClick={() => handleLevelSelect(level)}
                      variant="outline"
                      className="h-16 text-left justify-start border-2 border-border/50 bg-background/80 rounded-2xl hover:bg-primary/5 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01] animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      size="lg"
                    >
                      <span className="text-base font-semibold text-foreground/90">{level}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Adaptive Test Section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground/90">
                    Если вы не знаете свой уровень, мы вам поможем!
                  </p>
                  <Button
                    onClick={() => setShowAdaptiveTest(true)}
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                  >
                    Узнать свой уровень
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Адаптивный тест определит ваш уровень автоматически
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AssessmentLevel;
