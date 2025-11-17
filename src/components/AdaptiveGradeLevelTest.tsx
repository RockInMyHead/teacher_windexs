import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, X, ArrowLeft, Brain, Target } from 'lucide-react';
import { COURSE_TEST_QUESTIONS, TestQuestion } from '@/utils/coursePlans';
import { Header } from '@/components/Header';

interface AdaptiveGradeLevelTestProps {
  courseId: number;
  onLevelDetermined: (grade: number) => void;
  onCancel: () => void;
}

export const AdaptiveGradeLevelTest: React.FC<AdaptiveGradeLevelTestProps> = ({
  courseId,
  onLevelDetermined,
  onCancel
}) => {
  const availableGrades = [1, 3, 5, 7, 9, 100]; // Доступные уровни
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<TestQuestion | null>(null);
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
  const [testHistory, setTestHistory] = useState<{ grade: number; correct: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузить вопрос для текущего уровня
  useEffect(() => {
    const loadQuestion = () => {
      const grade = availableGrades[currentGradeIndex];
      console.log('Loading question for course:', courseId, 'grade:', grade);
      console.log('Available courses in COURSE_TEST_QUESTIONS:', Object.keys(COURSE_TEST_QUESTIONS));
      console.log('Available grades for this course:', COURSE_TEST_QUESTIONS[courseId] ? Object.keys(COURSE_TEST_QUESTIONS[courseId]) : 'Course not found');
      
      const questions = COURSE_TEST_QUESTIONS[courseId]?.[grade];
      console.log('Questions found:', questions ? questions.length : 0);
      
      if (questions && questions.length > 0) {
        // Выбрать случайный вопрос
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        setCurrentQuestion(randomQuestion);
      } else {
        console.warn(`No questions found for course ${courseId}, grade ${grade}`);
        // Если нет вопросов, установить заглушку
        setCurrentQuestion({
          question: `Вопросы для уровня ${grade} пока не загружены`,
          options: ['Перезагрузите страницу'],
          correctAnswer: 'Перезагрузите страницу'
        });
      }
    };

    loadQuestion();
  }, [currentGradeIndex, courseId]);

  const handleAnswer = (selectedAnswer: string) => {
    if (!currentQuestion) return;

    setIsLoading(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const currentGrade = availableGrades[currentGradeIndex];

    setTestHistory(prev => [...prev, { grade: currentGrade, correct: isCorrect }]);

    setTimeout(() => {
      if (isCorrect) {
        // Правильный ответ - переход на следующий уровень
        setWrongAnswerCount(0);
        
        if (currentGradeIndex < availableGrades.length - 1) {
          setCurrentGradeIndex(prev => prev + 1);
        } else {
          // Достигли максимального уровня
          onLevelDetermined(currentGrade);
        }
      } else {
        // Неправильный ответ
        setWrongAnswerCount(prev => {
          const newCount = prev + 1;
          
          if (newCount >= 2) {
            // 2 неправильных ответа подряд - возврат на grade 1
            if (currentGradeIndex > 0) {
              setCurrentGradeIndex(0);
              setWrongAnswerCount(0);
            } else {
              // Уже на минимальном уровне - завершить на этом
              onLevelDetermined(availableGrades[0]);
            }
          }
          
          return newCount;
        });
      }

      setIsLoading(false);
    }, 800);
  };

  const currentGrade = availableGrades[currentGradeIndex];
  const gradeLabel = {
    1: '1-3 класс',
    3: '4-5 класс',
    5: '6-7 класс',
    7: '8-9 класс',
    9: '10-11 класс',
    100: 'ЕГЭ уровень'
  }[currentGrade] || 'Неизвестный уровень';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={onCancel}
            variant="ghost"
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к выбору уровня
          </Button>

          {/* Main Card */}
          <Card className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border-2 hover:border-primary/50 animate-fade-in-up overflow-hidden bg-gradient-to-br from-card via-card/50 to-card/30">
            <CardHeader className="text-center pb-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                  <Brain className="w-6 h-6 text-primary" />
                  <span className="font-bold text-lg text-primary">Адаптивный тест</span>
                  <Target className="w-6 h-6 text-accent" />
                </div>
              </div>

              <CardTitle className="text-4xl font-bold mb-4 group-hover:text-primary transition-colors bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                🎯 Определение вашего уровня
              </CardTitle>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
                Мы адаптируем вопросы под ваш уровень знаний. Правильные ответы повышают уровень, неправильные — понижают.
              </p>

              {/* Progress Info */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Текущий уровень</div>
                    <Badge variant="secondary" className="text-lg px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30 font-semibold">
                      {gradeLabel}
                    </Badge>
                  </div>

                  {wrongAnswerCount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                      <X className="w-4 h-4" />
                      Неправильных: {wrongAnswerCount}/2
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Прогресс прохождения</span>
                    <span>{currentGradeIndex + 1} / {availableGrades.length}</span>
                  </div>
                  <Progress
                    value={(currentGradeIndex / (availableGrades.length - 1)) * 100}
                    className="h-3 bg-muted/50"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-8">
              {currentQuestion ? (
                <div className="space-y-6">
                  {/* Question */}
                  <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border-2 border-primary/10 group-hover:border-primary/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">🤔</span>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground leading-relaxed">
                          {currentQuestion.question}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                      Выберите правильный ответ:
                    </p>

                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full h-16 text-left justify-start px-6 border-2 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <span className="flex items-center gap-4 w-full">
                          <span className="w-8 h-8 rounded-full border-2 border-primary/30 flex items-center justify-center text-sm font-bold bg-card/80 group-hover:bg-primary/10 transition-colors">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-base leading-relaxed">{option}</span>
                        </span>
                      </Button>
                    ))}
                  </div>

                  {/* Test History */}
                  {testHistory.length > 0 && (
                    <div className="p-5 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border-2 border-muted/50">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📊</span>
                        <p className="text-sm font-medium text-muted-foreground">История ответов:</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {testHistory.map((item, idx) => (
                          <div
                            key={idx}
                            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border-2 ${
                              item.correct
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 transition-colors'
                            }`}
                          >
                            <span className="font-bold">
                              {item.grade === 100 ? 'ЕГЭ' : `${item.grade} кл.`}
                            </span>
                            {item.correct ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <span className="text-lg">Загрузка вопроса...</span>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-blue-50/50 rounded-lg border-2 border-blue-200/50">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">💡</span>
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-1">
                      <strong>Как работает тест:</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      Правильный ответ = переход на следующий уровень. Два неправильных ответа подряд = возврат к началу.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Spacing */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground/50">
              Шаг 1 из 2: Определение уровня и подбор плана
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdaptiveGradeLevelTest;

