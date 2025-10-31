import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowLeft, CheckCircle, XCircle, Clock, Target } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const Assessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateAssessmentResult } = useAuth();
  const courseId = parseInt(searchParams.get('courseId') || '0');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Системные промпты для разных курсов
  const getSystemPrompt = (courseId: number): string => {
    const prompts: { [key: number]: string } = {
      0: `Ты - академический преподаватель русского языка и литературы, доктор филологических наук. Создай 5 вопросов для носителей русского языка, желающих углубить свои знания по филологии и литературе.

ПРОГРАММА ТЕСТИРОВАНИЯ:

1. **Средний уровень (Стилистика)**: Фигуры речи, тропы, стилистические приемы
2. **Продвинутый уровень (Литературный анализ)**: Жанры, композиция, мотивы в литературе
3. **Высший уровень (Филология)**: Лингвистический анализ, текстология, историческая грамматика
4. **Экспертный уровень (Литературоведение)**: Теория литературы, интертекстуальность, нарратология
5. **Академический уровень (Методология)**: Исследовательские методы, критический анализ

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Вопросы для носителей русского языка с хорошим базовым уровнем
- Фокус на углубленном анализе, а не на базовых правилах
- Вопросы должны проверять понимание сложных литературных и лингвистических концепций
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть академическими с ссылками на литературные примеры

ПРИМЕРЫ ВОПРОСОВ ДЛЯ НОСИТЕЛЕЙ:

1. **Стилистика**: "Какой стилистический прием используется в строке Пушкина 'Я помню чудное мгновенье'?"
   - Анафора
   - Эпитет
   - Метафора
   - Синекдоха

2. **Литературный анализ**: "Какой композиционный прием использует Толстой в 'Войне и мире' для показа исторических событий?"
   - Ретроспекция
   - Предварение
   - Параллельное повествование
   - Кольцевая композиция

3. **Филология**: "Как называется явление, при котором слово приобретает новое значение под влиянием контекста?"
   - Полисемия
   - Синонимия
   - Коннотация
   - Денотация

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Академическая формулировка вопроса по русской литературе/филологии",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Научное объяснение с примерами из русской литературы и анализа текста",
      "difficulty": "easy|medium|hard"
    }
  ]
}`,

      1: `Ты - академический преподаватель английского языка, кандидат филологических наук. Создай 5 вопросов, охватывающих уровни от начального до продвинутого по английскому языку.

ПРОГРАММА ТЕСТИРОВАНИЯ:

1. **Elementary (Базовая грамматика)**: Present Simple, артикли, базовый словарь
2. **Pre-Intermediate (Развитая грамматика)**: Past tenses, модальные глаголы
3. **Intermediate (Синтаксис)**: Future tenses, сложные конструкции, идиомы
4. **Upper-Intermediate (Лексика и стилистика)**: Phrasal verbs, коллокации, формальный стиль
5. **Advanced (Академический анализ)**: Сложные грамматические конструкции, стилистический анализ

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Каждый вопрос должен проверять фундаментальные знания английского языка
- Вопросы должны быть теоретическими, но практически применимыми
- Фокус на ПРАВИЛАХ языка и грамматике
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть академическими и полезными для глубокого понимания

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Академическая формулировка вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Научное объяснение с примерами из английской грамматики",
      "difficulty": "easy|medium|hard"
    }
  ]
}`,

      2: `Ты - академический преподаватель арабского языка, специалист по семитским языкам. Создай 5 вопросов, охватывающих уровни от начального до продвинутого по арабскому языку.

ПРОГРАММА ТЕСТИРОВАНИЯ:

1. **Начинающий (Алфавит и основы)**: Арабский алфавит, базовые слова, простые фразы
2. **Элементарный (Грамматика)**: Род, число, простые предложения
3. **Средний (Синтаксис)**: Сложные предложения, глагольные формы
4. **Продвинутый (Стилистика)**: Литературный арабский, идиомы, формальный стиль
5. **Эксперт (Лингвистический анализ)**: Диалектология, историческая грамматика

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Каждый вопрос должен проверять фундаментальные знания арабского языка
- Вопросы должны быть теоретическими, но практически применимыми
- Фокус на ПРАВИЛАХ языка и грамматике
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть академическими и полезными для глубокого понимания

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Академическая формулировка вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Научное объяснение с примерами из арабской грамматики",
      "difficulty": "easy|medium|hard"
    }
  ]
}`,

      3: `Ты - академический преподаватель китайского языка, специалист по восточным языкам. Создай 5 вопросов, охватывающих уровни от начального до продвинутого по китайскому языку.

ПРОГРАММА ТЕСТИРОВАНИЯ:

1. **Начинающий (Основы)**: Пиньинь, базовые иероглифы, простые фразы
2. **Элементарный (Грамматика)**: Структура предложений, счетные слова
3. **Средний (Лексика)**: Иероглифы, идиомы, формальный стиль
4. **Продвинутый (Стилистика)**: Литературный китайский, поэзия
5. **Эксперт (Лингвистический анализ)**: Этимология иероглифов, историческая грамматика

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Каждый вопрос должен проверять фундаментальные знания китайского языка
- Вопросы должны быть теоретическими, но практически применимыми
- Фокус на ПРАВИЛАХ языка и грамматике
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть академическими и полезными для глубокого понимания

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Академическая формулировка вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Научное объяснение с примерами из китайской грамматики",
      "difficulty": "easy|medium|hard"
    }
  ]
}`,

      4: `Ты - академический преподаватель математики, кандидат физико-математических наук. Создай 5 вопросов, охватывающих уровни от базового до продвинутого по математике.

ПРОГРАММА ТЕСТИРОВАНИЯ:

1. **Базовый уровень**: Арифметика, простые уравнения
2. **Средний уровень**: Алгебра, геометрия, тригонометрия
3. **Продвинутый уровень**: Математический анализ, теория вероятностей
4. **Высший уровень**: Линейная алгебра, дифференциальные уравнения
5. **Экспертный уровень**: Комплексный анализ, абстрактная алгебра

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Каждый вопрос должен проверять фундаментальные математические знания
- Вопросы должны быть теоретическими, но практически применимыми
- Фокус на ПРАВИЛАХ и методах решения
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть математически строгими

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Академическая формулировка вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Математически строгое объяснение с доказательствами",
      "difficulty": "easy|medium|hard"
    }
  ]
}`,

      5: `Ты - академический преподаватель физики, кандидат физико-математических наук. Создай 5 вопросов, охватывающих уровни от базового до продвинутого по физике.

ПРОГРАММА ТЕСТИРОВАНИЯ:

1. **Базовый уровень**: Механика, термодинамика
2. **Средний уровень**: Электричество, оптика, волновые явления
3. **Продвинутый уровень**: Квантовая физика, теория относительности
4. **Высший уровень**: Ядерная физика, физика элементарных частиц
5. **Экспертный уровень**: Теоретическая физика, космология

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Каждый вопрос должен проверять фундаментальные физические знания
- Вопросы должны быть теоретическими, но практически применимыми
- Фокус на ЗАКОНАХ и ПРИНЦИПАХ физики
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть физически строгими

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Академическая формулировка вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Физически строгое объяснение с математическими доказательствами",
      "difficulty": "easy|medium|hard"
    }
  ]
}`,

      6: `Ты - академический преподаватель географии, кандидат географических наук. Создай 5 вопросов, охватывающих уровни от базового до продвинутого по географии.

ПРОГРАММА ТЕСТИРОВАНИЯ:

1. **Базовый уровень**: Физическая география, политическая карта
2. **Средний уровень**: Климатология, геоморфология
3. **Продвинутый уровень**: Геополитика, экономическая география
4. **Высший уровень**: География населения, урбанистика
5. **Экспертный уровень**: Геоинформатика, ландшафтоведение

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Каждый вопрос должен проверять фундаментальные географические знания
- Вопросы должны быть теоретическими, но практически применимыми
- Фокус на ЗАКОНОМЕРНОСТЯХ и ПРОЦЕССАХ
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть научно обоснованными

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Академическая формулировка вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Научно обоснованное объяснение с географическими примерами",
      "difficulty": "easy|medium|hard"
    }
  ]
}`,

      7: `Ты - академический преподаватель истории, кандидат исторических наук. Создай 5 вопросов, охватывающих уровни от базового до продвинутого по истории.

ПРОГРАММА ТЕСТИРОВАНИЯ:

1. **Базовый уровень**: Древняя история, средние века
2. **Средний уровень**: Новое время, история России
3. **Продвинутый уровень**: Историография, источниковедение
4. **Высший уровень**: Социальная история, история культуры
5. **Экспертный уровень**: Методология истории, историческая антропология

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Каждый вопрос должен проверять фундаментальные исторические знания
- Вопросы должны быть теоретическими, но практически применимыми
- Фокус на ИСТОРИЧЕСКИХ ПРОЦЕССАХ и ЗАКОНОМЕРНОСТЯХ
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть исторически точными и обоснованными

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Академическая формулировка вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Исторически точное объяснение с ссылками на источники",
      "difficulty": "easy|medium|hard"
    }
  ]
}`
    };

    return prompts[courseId] || prompts[0]; // По умолчанию русский язык
  };

  // Пользовательские промпты для разных курсов
  const getUserPrompt = (courseId: number): string => {
    const userPrompts: { [key: number]: string } = {
      0: 'Создай 5 вопросов по русской литературе и филологии для носителей русского языка, желающих углубить свои знания на академическом уровне.',
      1: 'Создай 5 вопросов по английскому языку, охватывающих уровни от Elementary до Advanced.',
      2: 'Создай 5 вопросов по арабскому языку, охватывающих уровни от начального до экспертного.',
      3: 'Создай 5 вопросов по китайскому языку, охватывающих уровни от начального до экспертного.',
      4: 'Создай 5 вопросов по математике, охватывающих уровни от базового до экспертного.',
      5: 'Создай 5 вопросов по физике, охватывающих уровни от базового до экспертного.',
      6: 'Создай 5 вопросов по географии, охватывающих уровни от базового до экспертного.',
      7: 'Создай 5 вопросов по истории, охватывающих уровни от базового до экспертного.'
    };

    return userPrompts[courseId] || userPrompts[0]; // По умолчанию русский язык
  };

  // Function to get level name based on percentage and course
  const getLevelName = (percentage: number): string => {
    if (percentage >= 80) return 'Продвинутый';
    if (percentage >= 60) return 'Средний';
    return 'Начинающий';
  };

  // Function to get level description based on percentage and course
  const getLevelDescription = (percentage: number, courseId: number): string => {
    const descriptions: { [key: number]: { high: string; medium: string; low: string } } = {
      0: { // Русский язык
        high: '🎉 Отличный результат! Вы имеете хорошую базу русского языка.',
        medium: '👍 Хороший результат! У вас есть базовые знания, но есть над чем работать.',
        low: '📚 Вы только начинаете изучение русского языка. Начнем с основ!'
      },
      1: { // Английский язык
        high: '🎉 Excellent result! You have a strong foundation in English.',
        medium: '👍 Good result! You have basic knowledge, but there\'s room for improvement.',
        low: '📚 You\'re just starting to learn English. Let\'s begin with the basics!'
      },
      2: { // Арабский язык
        high: '🎉 نتيجة ممتازة! لديك أساس قوي في اللغة العربية.',
        medium: '👍 نتيجة جيدة! لديك معرفة أساسية، ولكن هناك مجال للتحسين.',
        low: '📚 أنت فقط تبدأ في تعلم اللغة العربية. دعونا نبدأ بالأساسيات!'
      },
      3: { // Китайский язык
        high: '🎉 优秀的结果！你有很强的中文基础。',
        medium: '👍 好的结果！你有基本知识，但还有改进空间。',
        low: '📚 你才刚刚开始学习中文。让我们从基础开始！'
      },
      4: { // Математика
        high: '🎉 Отличный результат! У вас крепкие математические знания.',
        medium: '👍 Хороший результат! У вас есть базовые навыки, но нужна практика.',
        low: '📚 Вы только начинаете изучение математики. Начнем с основ!'
      },
      5: { // Физика
        high: '🎉 Отличный результат! Вы хорошо разбираетесь в физике.',
        medium: '👍 Хороший результат! У вас есть базовые знания физики.',
        low: '📚 Вы только начинаете изучение физики. Начнем с основ!'
      },
      6: { // География
        high: '🎉 Отличный результат! Вы хорошо ориентируетесь в географии.',
        medium: '👍 Хороший результат! У вас есть базовые знания географии.',
        low: '📚 Вы только начинаете изучение географии. Начнем с основ!'
      },
      7: { // История
        high: '🎉 Отличный результат! Вы хорошо знаете историю.',
        medium: '👍 Хороший результат! У вас есть базовые знания истории.',
        low: '📚 Вы только начинаете изучение истории. Начнем с основ!'
      }
    };

    const courseDescriptions = descriptions[courseId] || descriptions[0];

    if (percentage >= 80) return courseDescriptions.high;
    if (percentage >= 60) return courseDescriptions.medium;
    return courseDescriptions.low;
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);

  // Generate questions using OpenAI
  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
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
              content: getSystemPrompt(courseId),
            },
            {
              role: 'user',
              content: getUserPrompt(courseId),
            },
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
      const parsedContent = JSON.parse(content.replace(/```json\n?|\n?```/g, ''));
      setQuestions(parsedContent.questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback questions in case API fails - академические вопросы по школьной программе
      setQuestions([
        {
          id: 1,
          question: "В предложении 'Девочка читает книгу' слово 'девочка' является:",
          options: ["Подлежащим", "Сказуемым", "Дополнением", "Обстоятельством"],
          correctAnswer: 0,
          explanation: "Подлежащее - главный член предложения, обозначающий предмет действия. В данном предложении 'девочка' - это лицо, совершающее действие 'читает', поэтому является подлежащим.",
          difficulty: 'easy' as const,
        },
        {
          id: 2,
          question: "В каком падеже стоит существительное в словосочетании 'ехать на автобусе'?",
          options: ["Именительном", "Родительном", "Предложном", "Винительном"],
          correctAnswer: 2,
          explanation: "Предлог 'на' с предложным падежом используется для обозначения транспорта. В словосочетании 'на автобусе' существительное 'автобус' стоит в предложном падеже (с окончанием -е).",
          difficulty: 'easy' as const,
        },
        {
          id: 3,
          question: "Какой частью речи является слово 'быстро' в предложении 'Он быстро бежал'?",
          options: ["Существительным", "Прилагательным", "Наречием", "Глаголом"],
          correctAnswer: 2,
          explanation: "Наречие - часть речи, которая обозначает признак действия, качества, другого признака. Слово 'быстро' отвечает на вопрос 'как?' и характеризует действие 'бежал', поэтому является наречием.",
          difficulty: 'medium' as const,
        },
        {
          id: 4,
          question: "Какой троп используется в выражении 'золотая осень'?",
          options: ["Эпитет", "Метафора", "Метонимия", "Сравнение"],
          correctAnswer: 0,
          explanation: "Эпитет - художественное определение, подчеркивающее наиболее характерные признаки предмета. Слово 'золотая' в сочетании 'золотая осень' является эпитетом, подчеркивающим цвет осенней листвы.",
          difficulty: 'medium' as const,
        },
        {
          id: 5,
          question: "Как называется стилистический прием, основанный на повторении начальных звуков слов?",
          options: ["Эпифора", "Анафора", "Аллюзия", "Антитеза"],
          correctAnswer: 1,
          explanation: "Анафора - стилистический прием, состоящий в повторении начальных звуков, слогов или слов в начале смежных отрезков речи. Пример: 'Широка страна моя родная, Широко поле, широко река...' (А. Блок).",
          difficulty: 'hard' as const,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      setShowExplanation(false);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Calculate score and analyze weak topics
        const correctCount = newAnswers.reduce((count, answer, index) => {
          return count + (answer === questions[index].correctAnswer ? 1 : 0);
        }, 0);
        setScore(correctCount);

        // Collect detailed assessment data
        const assessmentData = {
          questions: questions,
          userAnswers: newAnswers,
          correctAnswers: questions.map(q => q.correctAnswer),
          score: correctCount,
          totalQuestions: questions.length
        };

        // Determine weak topics based on incorrect answers
        const weakTopics: string[] = [];
        const incorrectQuestions: any[] = [];

        newAnswers.forEach((answer, index) => {
          if (answer !== questions[index].correctAnswer) {
            incorrectQuestions.push({
              question: questions[index].question,
              userAnswer: questions[index].options[answer] || 'Не ответил',
              correctAnswer: questions[index].options[questions[index].correctAnswer],
              explanation: questions[index].explanation,
              topic: getQuestionTopic(questions[index])
            });

            // Map question topics based on content
            const topic = getQuestionTopic(questions[index]);
            if (!weakTopics.includes(topic)) {
              weakTopics.push(topic);
            }
          }
        });

        // Update user assessment result with detailed data
        updateAssessmentResult(correctCount, questions.length, weakTopics, assessmentData);

        setTestCompleted(true);
      }
    }
  };

  const getQuestionTopic = (question: Question): string => {
    const questionText = question.question.toLowerCase();
    if (questionText.includes('падеж') || questionText.includes('предложный') || questionText.includes('родительный')) {
      return 'Падежи и предлоги';
    } else if (questionText.includes('часть речи') || questionText.includes('наречие') || questionText.includes('прилагательное')) {
      return 'Части речи';
    } else if (questionText.includes('член предложения') || questionText.includes('подлежащее') || questionText.includes('сказуемое')) {
      return 'Члены предложения';
    } else if (questionText.includes('троп') || questionText.includes('эпитет') || questionText.includes('метафора')) {
      return 'Тропы и стилистические приемы';
    } else if (questionText.includes('анафора') || questionText.includes('повтор')) {
      return 'Стилистические приемы';
    } else {
      return 'Общие правила русского языка';
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
            {/* Main AI Brain */}
            <div className="relative mb-8">
              <Brain className="w-16 h-16 mx-auto text-primary animate-pulse" />

              {/* Thought Bubbles Animation */}
              <div className="absolute -top-2 -right-8 w-3 h-3 bg-primary/60 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
              <div className="absolute -top-6 -right-4 w-2 h-2 bg-primary/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -top-8 -right-8 w-4 h-4 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '1s' }} />

              <div className="absolute -top-1 -left-6 w-2.5 h-2.5 bg-accent/60 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
              <div className="absolute -top-5 -left-3 w-3.5 h-3.5 bg-accent/50 rounded-full animate-ping" style={{ animationDelay: '0.8s' }} />
              <div className="absolute -top-9 -left-7 w-2 h-2 bg-accent/40 rounded-full animate-ping" style={{ animationDelay: '1.2s' }} />
            </div>

            {/* Animated Text */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI думает...
              </h2>

              {/* Thinking Process Visualization */}
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="animate-pulse">Анализирую ваш уровень знаний</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="animate-pulse" style={{ animationDelay: '1s' }}>Подбираю подходящие вопросы</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  <span className="animate-pulse" style={{ animationDelay: '2s' }}>Создаю тестовые задания</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
                  <span className="animate-pulse" style={{ animationDelay: '3s' }}>Готовлю объяснения ответов</span>
                </div>
              </div>
            </div>

            {/* Progress Visualization */}
            <div className="mb-6">
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"
                     style={{
                       width: '60%',
                       animation: 'pulse 1.5s ease-in-out infinite, width 3s ease-out forwards'
                     }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Создание персонального теста...
              </p>
            </div>

            {/* Neural Network Visualization */}
            <div className="flex justify-center items-center gap-1 mb-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-8 bg-gradient-to-t from-primary/20 to-primary/80 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>

            {/* Final Message */}
            <div className="text-center">
              <p className="text-muted-foreground animate-pulse">
                Пожалуйста, подождите несколько секунд...
              </p>
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
        {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-semibold">Windexs-Учитель</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Results */}
        <main className="container mx-auto px-4 py-8 max-w-2xl">
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
              {/* Progress Circle */}
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

              {/* Level Badge */}
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Уровень: {getLevelName(percentage)}
              </Badge>

              {/* Description */}
              <div className="text-left space-y-4">
                <h3 className="font-semibold text-lg">Ваш уровень знаний:</h3>
                <div className="space-y-2">
                  <p className={`${
                    percentage >= 80 ? 'text-green-600' :
                    percentage >= 60 ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {getLevelDescription(percentage, courseId)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button onClick={() => navigate('/personalized-course')} className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Начать обучение
                </Button>
                <Button variant="outline" onClick={() => navigate(`/course/${courseId}`)}>
                  Посмотреть курс
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
                onClick={() => navigate('/course/0')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад к курсу
              </Button>
            </div>

            {/* Right side - Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold">Тест знаний</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress */}
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

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
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

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Правильный ответ: {String.fromCharCode(65 + currentQuestion.correctAnswer)}</p>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
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
            disabled={selectedAnswer === null}
            className="min-w-[120px]"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Завершить' : 'Далее'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Assessment;
