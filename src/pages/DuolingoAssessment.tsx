import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowLeft, CheckCircle, XCircle, Clock, Target, Volume2, Shuffle } from 'lucide-react';

interface DuolingoQuestion {
  id: number;
  type: 'translate' | 'select_missing' | 'complete_sentence' | 'match_pairs' | 'multiple_choice';
  question: string;
  englishText?: string;
  russianText?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pairs?: { english: string; russian: string }[];
}

const DuolingoAssessment = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<DuolingoQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [matchedPairs, setMatchedPairs] = useState<{[key: string]: string}>({});
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    setIsGenerating(true);
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
              content: `Ты - создатель упражнений в стиле Duolingo для изучения английского языка. Создай 6 разнообразных упражнений разных типов.

ТИПЫ УПРАЖНЕНИЙ DUOLINGO:

1. **translate** - Перевод фразы с английского на русский или наоборот
   Формат: "Переведите: 'Hello, how are you?'"

2. **select_missing** - Выберите пропущенное слово в предложении
   Формат: "Выберите правильное слово: I ___ to school every day."
   Options: ["go", "goes", "going", "went"]

3. **complete_sentence** - Дополните предложение правильным вариантом
   Формат: "She ___ her homework yesterday."
   Options: ["did", "does", "do", "doing"]

4. **match_pairs** - Сопоставьте английские слова с русскими переводами
   Формат: pairs: [{"english": "apple", "russian": "яблоко"}, {"english": "book", "russian": "книга"}]

5. **multiple_choice** - Выберите правильный перевод или грамматическую форму
   Формат: "Как переводится 'beautiful'?"
   Options: ["красивый", "большой", "маленький", "старый"]

ТРЕБОВАНИЯ:
- Создай 6 упражнений: 2 translate, 2 select_missing, 1 complete_sentence, 1 match_pairs
- Уровни: 3 легких, 2 средних, 1 сложный
- Все тексты должны быть на английском и русском языках
- Правильные ответы должны быть точными

Формат JSON:
{
  "questions": [
    {
      "id": 1,
      "type": "translate|select_missing|complete_sentence|match_pairs|multiple_choice",
      "question": "Текст вопроса",
      "englishText": "Английский текст (для translate)",
      "russianText": "Русский текст (для translate)",
      "options": ["вариант1", "вариант2", "вариант3", "вариант4"] // для select_missing, complete_sentence, multiple_choice
      "correctAnswer": "правильный ответ или индекс",
      "explanation": "Объяснение почему правильный ответ правильный",
      "difficulty": "easy|medium|hard",
      "pairs": [{"english": "word", "russian": "слово"}] // только для match_pairs
    }
  ]
}`
            },
            {
              role: 'user',
              content: 'Создай 6 упражнений в стиле Duolingo для изучения английского языка русскоязычными студентами.'
            }
          ],
          max_tokens: 3000,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      const parsedContent = JSON.parse(content.replace(/```json\n?|\n?```/g, ''));
      setQuestions(parsedContent.questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback questions
      setQuestions([
        {
          id: 1,
          type: 'translate',
          question: "Переведите на русский: 'Good morning'",
          englishText: "Good morning",
          correctAnswer: "Доброе утро",
          explanation: "'Good morning' переводится как 'Доброе утро'",
          difficulty: 'easy'
        },
        {
          id: 2,
          type: 'select_missing',
          question: "Выберите правильное слово: I ___ a student.",
          options: ["am", "is", "are", "be"],
          correctAnswer: 0,
          explanation: "После местоимения 'I' (я) используется глагол 'am' (есть)",
          difficulty: 'easy'
        },
        {
          id: 3,
          type: 'complete_sentence',
          question: "She ___ to music every day.",
          options: ["listen", "listens", "listening", "listened"],
          correctAnswer: 1,
          explanation: "В Present Simple с местоимением 'she' глагол принимает окончание -s",
          difficulty: 'medium'
        },
        {
          id: 4,
          type: 'multiple_choice',
          question: "Как переводится слово 'beautiful'?",
          options: ["красивый", "большой", "маленький", "старый"],
          correctAnswer: 0,
          explanation: "'Beautiful' означает 'красивый' или 'прекрасный'",
          difficulty: 'easy'
        },
        {
          id: 5,
          type: 'match_pairs',
          question: "Сопоставьте слова:",
          pairs: [
            { english: "cat", russian: "кот" },
            { english: "dog", russian: "собака" },
            { english: "bird", russian: "птица" },
            { english: "fish", russian: "рыба" }
          ],
          correctAnswer: "all_matched",
          explanation: "Правильные пары: cat-кот, dog-собака, bird-птица, fish-рыба",
          difficulty: 'medium'
        },
        {
          id: 6,
          type: 'translate',
          question: "Переведите на английский: 'Я люблю читать книги'",
          russianText: "Я люблю читать книги",
          correctAnswer: "I love reading books",
          explanation: "'I love reading books' - правильный перевод фразы 'Я люблю читать книги'",
          difficulty: 'hard'
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
  };

  const handleMatchPair = (english: string, russian: string) => {
    const newPairs = { ...matchedPairs, [english]: russian };
    setMatchedPairs(newPairs);

    // Check if all pairs are matched
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.pairs && Object.keys(newPairs).length === currentQuestion.pairs.length) {
      // Check if all matches are correct
      const allCorrect = currentQuestion.pairs.every(pair =>
        newPairs[pair.english] === pair.russian
      );
      setSelectedAnswer(allCorrect ? 'correct' : 'incorrect');
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setMatchedPairs({});
      setUserInput('');

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Calculate score
        const correctCount = newAnswers.reduce((count, answer, index) => {
          const question = questions[index];
          let isCorrect = false;

          if (question.type === 'match_pairs') {
            isCorrect = answer === 'correct';
          } else if (question.type === 'translate') {
            isCorrect = typeof answer === 'string' &&
              answer.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim();
          } else {
            isCorrect = answer === question.correctAnswer;
          }

          return count + (isCorrect ? 1 : 0);
        }, 0);

        setScore(correctCount);
        setTestCompleted(true);
      }
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
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
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="relative mb-8">
              <Brain className="w-16 h-16 mx-auto text-primary animate-pulse" />
              <div className="absolute -top-2 -right-8 w-3 h-3 bg-primary/60 rounded-full animate-ping" />
              <div className="absolute -top-6 -right-4 w-2 h-2 bg-primary/50 rounded-full animate-ping" />
              <div className="absolute -top-8 -right-8 w-4 h-4 bg-primary/40 rounded-full animate-ping" />
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Создание Duolingo-теста...
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Shuffle className="w-4 h-4 animate-spin" />
                <span>Генерация упражнений разных типов</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Подготовка переводов и вариантов</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Target className="w-4 h-4 animate-pulse" />
                <span>Создание заданий в стиле Duolingo</span>
              </div>
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
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-semibold">Duolingo Тест</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">Duolingo тест завершен!</CardTitle>
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
                <h3 className="font-semibold text-lg">Ваш уровень английского:</h3>
                <div className="space-y-2">
                  <p className={`${
                    percentage >= 80 ? 'text-green-600' :
                    percentage >= 60 ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {percentage >= 80 ? '🎉 Отличный результат! Вы имеете сильный уровень английского языка.' :
                     percentage >= 60 ? '👍 Хороший результат! У вас есть хорошая база, продолжайте практиковаться.' :
                     '📚 Вы только начинаете изучение английского. Продолжайте в том же духе!'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button onClick={() => navigate('/courses')} className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Выбрать курс английского
                </Button>
                <Button variant="outline" onClick={() => navigate('/available-courses')}>
                  Другие курсы
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case 'translate':
        return (
          <div className="space-y-4">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">{currentQuestion.question}</h3>
              {currentQuestion.englishText && (
                <p className="text-xl font-semibold text-primary">{currentQuestion.englishText}</p>
              )}
              {currentQuestion.russianText && (
                <p className="text-xl font-semibold text-primary">{currentQuestion.russianText}</p>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Введите перевод..."
                className="w-full p-4 border rounded-lg text-center text-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswerSelect(userInput.trim());
                  }
                }}
              />
            </div>
          </div>
        );

      case 'select_missing':
      case 'complete_sentence':
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            </div>
            <div className="grid gap-3">
              {currentQuestion.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="justify-start text-left h-auto p-4 whitespace-normal"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedAnswer === index ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showExplanation && selectedAnswer === index && (
                      <div className="flex-shrink-0">
                        {index === currentQuestion.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 'match_pairs':
        return (
          <div className="space-y-6">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-center">Английский</h4>
                {currentQuestion.pairs?.map((pair, index) => (
                  <div
                    key={`english-${index}`}
                    className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                      matchedPairs[pair.english] ? 'bg-green-100 border-green-300' : 'hover:bg-muted'
                    }`}
                  >
                    {pair.english}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-center">Русский</h4>
                {currentQuestion.pairs?.map((pair, index) => (
                  <div
                    key={`russian-${index}`}
                    className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                      Object.values(matchedPairs).includes(pair.russian) ? 'bg-green-100 border-green-300' : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      // Simple matching logic - find first unmatched English word
                      const unmatchedEnglish = currentQuestion.pairs?.find(p => !matchedPairs[p.english]);
                      if (unmatchedEnglish) {
                        handleMatchPair(unmatchedEnglish.english, pair.russian);
                      }
                    }}
                  >
                    {pair.russian}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Неизвестный тип вопроса</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold">Duolingo Тест</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Вопрос {currentQuestionIndex + 1} из {questions.length}
            </span>
            <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
              {getDifficultyText(currentQuestion.difficulty)}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              Упражнение {currentQuestionIndex + 1}: {currentQuestion.type === 'translate' ? 'Перевод' :
                                                     currentQuestion.type === 'select_missing' ? 'Выберите слово' :
                                                     currentQuestion.type === 'complete_sentence' ? 'Дополните предложение' :
                                                     currentQuestion.type === 'match_pairs' ? 'Сопоставьте пары' :
                                                     'Выберите ответ'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {renderQuestionContent()}

            {showExplanation && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Объяснение:</p>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                    {currentQuestion.correctAnswer && typeof currentQuestion.correctAnswer === 'string' && (
                      <p className="text-sm mt-2 text-green-600">
                        Правильный ответ: {currentQuestion.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleShowExplanation}
            disabled={selectedAnswer === null || showExplanation}
          >
            Показать объяснение
          </Button>

          <Button
            onClick={handleNextQuestion}
            disabled={
              currentQuestion.type === 'translate' ? !userInput.trim() :
              currentQuestion.type === 'match_pairs' ? selectedAnswer === null :
              selectedAnswer === null
            }
            className="min-w-[120px]"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Завершить' : 'Далее'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DuolingoAssessment;
