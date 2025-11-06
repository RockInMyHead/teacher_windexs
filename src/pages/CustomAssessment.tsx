import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Target, ArrowLeft, CheckCircle, Brain, Clock } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const CustomAssessment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateAssessmentResult } = useAuth();

  const topic = searchParams.get('topic') || '';
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Generate questions for custom topic
  useEffect(() => {
    if (topic) {
      generateQuestions();
    }
  }, [topic]);

  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
      const systemPrompt = `Ты - опытный преподаватель и создатель тестов. Создай 5 вопросов для определения уровня знаний по теме "${topic}".
Уровни сложности должны быть: 2 легких, 2 средних, 1 сложный.

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Вопрос на русском языке",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Подробное объяснение правильного ответа",
      "difficulty": "easy"
    }
  ]
}

Темы вопросов должны покрывать основные аспекты темы "${topic}" и позволять определить уровень знаний от начинающего до эксперта.
НЕ добавляй никакого текста кроме JSON!`;

      const apiUrl = `${window.location.origin}/api/chat/completions`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Создай 5 вопросов для тестирования уровня знаний по теме "${topic}".`
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Parse the JSON response
      let parsedContent;
      try {
        // Clean the content from markdown formatting
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();

        // Try to parse as JSON
        parsedContent = JSON.parse(cleanContent);

        // Validate the structure
        if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
          throw new Error('Invalid questions format - missing questions array');
        }

        // Validate each question structure
        for (const question of parsedContent.questions) {
          if (!question.question || !question.options || typeof question.correctAnswer !== 'number') {
            throw new Error('Invalid question structure');
          }
        }

        setQuestions(parsedContent.questions);
      } catch (parseError) {
        console.error('Failed to parse questions JSON:', parseError);
        console.error('Raw content:', content);
        throw new Error('Failed to parse questions response');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback questions
      setQuestions([
        {
          id: 1,
          question: `Что вы знаете об основах темы "${topic}"?`,
          options: ["Ничего не знаю", "Знаю основы", "Имею средние знания", "Эксперт в этой области"],
          correctAnswer: 1,
          explanation: "Этот вопрос помогает определить базовый уровень знаний по теме.",
          difficulty: 'easy' as const,
        },
        {
          id: 2,
          question: `Какой у вас опыт работы/изучения темы "${topic}"?`,
          options: ["Нет опыта", "1-6 месяцев", "6-24 месяцев", "Более 2 лет"],
          correctAnswer: 2,
          explanation: "Опыт важен для определения уровня сложности материалов.",
          difficulty: 'medium' as const,
        },
        {
          id: 3,
          question: `Какие аспекты темы "${topic}" вам интересны?`,
          options: ["Теория", "Практика", "Все аспекты", "Конкретные разделы"],
          correctAnswer: 0,
          explanation: "Интересы помогают персонализировать обучение.",
          difficulty: 'easy' as const,
        },
        {
          id: 4,
          question: `С какими сложностями вы сталкивались при изучении темы "${topic}"?`,
          options: ["Понимание основ", "Применение на практике", "Отсутствие ресурсов", "Нет сложностей"],
          correctAnswer: 3,
          explanation: "Понимание трудностей помогает адаптировать курс.",
          difficulty: 'medium' as const,
        },
        {
          id: 5,
          question: `Какую цель вы преследуете при изучении темы "${topic}"?`,
          options: ["Общее развитие", "Профессиональный рост", "Хобби", "Конкретный проект"],
          correctAnswer: 0,
          explanation: "Цели обучения влияют на структуру курса.",
          difficulty: 'hard' as const,
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      finishTest(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] || null);
      setShowExplanation(false);
    }
  };

  const finishTest = async (finalAnswers: number[]) => {
    setIsLoading(true);

    const correctCount = finalAnswers.reduce((count, answer, index) => {
      return count + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    setScore(correctCount);

    // Generate personalized course based on results
    try {
      const percentage = Math.round((correctCount / questions.length) * 100);
      const level: 'beginner' | 'intermediate' | 'advanced' =
        percentage >= 80 ? 'advanced' :
        percentage >= 60 ? 'intermediate' : 'beginner';

      // Generate personalized course for custom topic
      const personalizedCourse = await generateCustomCourse(topic, level, finalAnswers);

      // Update user with assessment results
      await updateAssessmentResult(correctCount, questions.length, [], {
        customTopic: topic,
        personalizedCourse,
        questions,
        userAnswers: finalAnswers
      });

      setTestCompleted(true);
    } catch (error) {
      console.error('Error finishing test:', error);
      setTestCompleted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCustomCourse = async (topic: string, level: string, userAnswers: number[]) => {
    try {
      const response = await fetch(`${window.location.origin}/api/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Ты - опытный преподаватель. Создай детальный персонализированный курс по теме "${topic}" для уровня "${level}".

ВАЖНЫЕ ТРЕБОВАНИЯ:
1. Создай 4-6 модулей по ключевым аспектам темы
2. Каждый модуль должен иметь 3-5 уроков
3. Учитывай уровень ученика: beginner/intermediate/advanced
4. Структура должна быть логичной и последовательной

Формат ответа (ТОЛЬКО JSON):
{
  "title": "Название курса",
  "description": "Описание курса",
  "topics": ["тема1", "тема2", ...],
  "difficulty": "${level}",
  "estimatedHours": число,
  "modules": [
    {
      "title": "Название модуля",
      "description": "Описание модуля",
      "lessons": ["Урок 1", "Урок 2", "Урок 3"]
    }
  ]
}`
            },
            {
              role: 'user',
              content: `Создай персонализированный курс по теме "${topic}" для уровня ${level}.`
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate custom course');
      }

      const data = await response.json();
      const courseData = JSON.parse(data.choices[0].message.content.replace(/```json\n?|\n?```/g, ''));

      return {
        id: `custom-${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        ...courseData
      };
    } catch (error) {
      console.error('Error generating custom course:', error);
      // Fallback course structure
      return {
        id: `custom-${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        title: `Курс по теме "${topic}"`,
        description: `Персонализированный курс изучения темы "${topic}"`,
        topics: [topic],
        difficulty: level,
        estimatedHours: 20,
        modules: [
          {
            title: `Введение в ${topic}`,
            description: `Основные понятия и введение в тему`,
            lessons: ["Основные понятия", "История развития", "Современное состояние"]
          },
          {
            title: `Практическое применение ${topic}`,
            description: `Практические аспекты и применение знаний`,
            lessons: ["Базовые навыки", "Продвинутые техники", "Реальные примеры"]
          },
          {
            title: `Глубокое изучение ${topic}`,
            description: `Углубленное изучение темы`,
            lessons: ["Теоретические основы", "Анализ случаев", "Будущие тенденции"]
          }
        ]
      };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легкий';
      case 'medium': return 'Средний';
      case 'hard': return 'Сложный';
      default: return 'Неизвестно';
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Генерация теста</h2>
            <p className="text-muted-foreground mb-4">
              Создаем персонализированные вопросы по теме "{topic}"
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (testCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const level = percentage >= 80 ? 'Продвинутый' : percentage >= 60 ? 'Средний' : 'Начинающий';

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">Тест завершен!</CardTitle>
              <CardDescription className="text-lg">
                Ваш результат: {score} из {questions.length} правильных ответов
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-32 h-32 rounded-full bg-gray-200 absolute"></div>
                <div
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-accent absolute"
                  style={{
                    background: `conic-gradient(from 0deg, #3b82f6 0deg, #3b82f6 ${percentage * 3.6}deg, #e5e7eb ${percentage * 3.6}deg, #e5e7eb 360deg)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{percentage}%</span>
                </div>
              </div>

              <Badge variant="secondary" className="text-lg px-4 py-2">
                Уровень: {level}
              </Badge>

              <div className="text-left space-y-4">
                <h3 className="font-semibold text-lg">Результаты по теме "{topic}"</h3>
                <div className="space-y-2">
                  <p className={`${
                    percentage >= 80 ? 'text-green-600' :
                    percentage >= 60 ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {percentage >= 80 ? `Отличный результат! Вы имеете хорошие знания по теме "${topic}".` :
                     percentage >= 60 ? `Хороший результат! У вас есть базовые знания, но есть над чем работать.` :
                     `Вы только начинаете изучение темы "${topic}". Начнем с основ!`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button onClick={() => navigate('/personalized-course')} className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Начать персонализированный курс
                </Button>
                <Button variant="outline" onClick={() => navigate('/available-courses')}>
                  Выбрать другой курс
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/available-courses')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к курсам
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Тест по теме</h1>
            <p className="text-muted-foreground">"{topic}"</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{currentQuestionIndex + 1} из {questions.length}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={(currentQuestionIndex + 1) / questions.length * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {getDifficultyText(currentQuestion.difficulty)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Вопрос {currentQuestionIndex + 1}
              </span>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <RadioGroup
              value={selectedAnswer?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base leading-relaxed"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {showExplanation && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-600">Правильный ответ</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Назад
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null || isLoading}
          >
            {isLoading ? 'Завершение...' :
             currentQuestionIndex === questions.length - 1 ? 'Завершить тест' : 'Далее'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomAssessment;
