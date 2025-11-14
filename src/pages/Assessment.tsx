import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowLeft, CheckCircle, XCircle, Clock, Target, ChevronRight, Users, Trophy, BookOpen } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCEFRLevelName, getCEFRLevelDescription, getCEFRScore, CEFRLevel } from '@/lib/CEFRUtils';
import Header from '@/components/Header';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}


interface AssessmentStep {
  id: 'level_selection' | 'goal_setting' | 'testing' | 'completed';
  title: string;
  description: string;
}

const Assessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateAssessmentResult } = useAuth();
  const courseId = parseInt(searchParams.get('courseId') || '0');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Skip all steps and go directly to completion
  const [currentStep, setCurrentStep] = useState<AssessmentStep['id']>('completed');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | null>(null);
  const [learningGoal, setLearningGoal] = useState('');
  const [isCompleting, setIsCompleting] = useState(true);

  const assessmentSteps: AssessmentStep[] = [
    { id: 'level_selection', title: 'Выберите ваш уровень', description: 'Укажите ваш текущий уровень владения языком' },
    { id: 'goal_setting', title: 'Определите цель обучения', description: 'Расскажите, зачем вы изучаете язык' },
    { id: 'testing', title: 'Проверка уровня', description: 'Ответьте на вопросы для точной оценки' }
  ];

  // Automatically complete assessment on component mount
  useEffect(() => {
    const completeAssessment = async () => {
      setIsCompleting(true);
      await handleTestCompletion();
      setIsCompleting(false);
    };
    completeAssessment();
  }, []);

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
      "question": "Текст вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Пояснение почему этот ответ правильный",
      "difficulty": "easy|medium|hard"
    }
  ]
}
НЕ добавляй никакого текста кроме JSON!
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

      1: `Ты - преподаватель английского языка IELTS/TOEFL. Создай 5 вопросов по АНГЛИЙСКОМУ ЯЗЫКУ для уровня {cefrLevel}.

ВАЖНО: Отвечай ТОЛЬКО валидным JSON формате, без дополнительного текста!

Формат ответа:
{
  "questions": [
    {
      "question": "Вопрос на английском языке",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Объяснение на русском языке",
      "difficulty": "easy"
    }
  ]
}

ПРИМЕРЫ ВОПРОСОВ ПО УРОВНЯМ:

**A1 (Beginner)**: Базовые слова и фразы
{"question": "What color is the sky?", "options": ["Blue", "Green", "Red", "Yellow"], "correctAnswer": 0, "explanation": "Небо голубое. Проверка базового словаря.", "difficulty": "easy"}

**A2 (Elementary)**: Простые времена
{"question": "I ___ to school every day.", "options": ["go", "goes", "going", "went"], "correctAnswer": 1, "explanation": "Для he/she/it добавляется -s в Present Simple.", "difficulty": "easy"}

**B1 (Intermediate)**: Сложные времена
{"question": "By the time we arrive, the movie ___ .", "options": ["will start", "will have started", "starts", "started"], "correctAnswer": 1, "explanation": "Future Perfect для действия, завершенного к определенному времени.", "difficulty": "medium"}

**B2 (Upper-Intermediate)**: Идиомы и сложные конструкции
{"question": "I'm afraid I can't make it. I ___ a meeting.", "options": ["have", "'m having", "had", "'ll have"], "correctAnswer": 1, "explanation": "Present Continuous для действий, происходящих сейчас.", "difficulty": "medium"}

**C1 (Advanced)**: Стилистические нюансы
{"question": "The research findings were ___ surprising that they changed the entire field.", "options": ["so", "such", "as", "like"], "correctAnswer": 0, "explanation": "Коррелят 'so...that' выражает степень.", "difficulty": "hard"}

**C2 (Proficiency)**: Экспертный уровень
{"question": "The CEO's decision to resign came as a complete surprise, leaving stakeholders ___ .", "options": ["dumbfounded", "astonished", "bewildered", "perplexed"], "correctAnswer": 0, "explanation": "'Dumbfounded' - крайняя степень удивления, подходящая для корпоративного контекста.", "difficulty": "hard"}

Создай 5 вопросов по АНГЛИЙСКОМУ ЯЗЫКУ для уровня {cefrLevel}.`,

      2: `Ты - преподаватель арабского языка. Создай 5 вопросов по АРАБСКОМУ ЯЗЫКУ для уровня {cefrLevel}.

ВАЖНО: Отвечай ТОЛЬКО валидным JSON формате, без дополнительного текста!

Формат ответа:
{
  "questions": [
    {
      "question": "Вопрос на арабском языке",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Объяснение на русском языке",
      "difficulty": "easy"
    }
  ]
}

ПРИМЕРЫ ВОПРОСОВ ПО УРОВНЯМ:

**A1 (Beginner)**: Базовые слова и фразы
{"question": "ما لون السماء؟", "options": ["أزرق", "أخضر", "أحمر", "أصفر"], "correctAnswer": 0, "explanation": "السماء زرقاء. Проверка базового словаря.", "difficulty": "easy"}

**A2 (Elementary)**: Простые времена
{"question": "أنا ___ إلى المدرسة كل يوم.", "options": ["أذهب", "يذهب", "ذاهب", "ذهب"], "correctAnswer": 0, "explanation": "المضارع للأفعال المنتظمة - настоящее время для регулярных действий.", "difficulty": "easy"}

**B1 (Intermediate)**: Сложные времена
{"question": "سأتصل بك عندما ___ العشاء.", "options": ["أطبخ", "أكون أطبخ", "سأطبخ", "طبخت"], "correctAnswer": 0, "explanation": "المضارع التام - настоящее совершенное для завершенных действий.", "difficulty": "medium"}

**B2 (Upper-Intermediate)**: Идиомы и сложные конструкции
{"question": "أخشى أنني لا أستطيع الحضور. لدي ___ اجتماع.", "options": ["اجتماع", "اجتماعي", "اجتمعت", "أجتمع"], "correctAnswer": 0, "explanation": "Местоимение 'لدي' + существительное - конструкция обладания.", "difficulty": "medium"}

**C1 (Advanced)**: Литературный арабский
{"question": "النتائج كانت ___ مثيرة للدهشة حتى غيرت المجال بأكمله.", "options": ["مثيرة", "مثيراً", "مثارة", "مثورة"], "correctAnswer": 0, "explanation": "Прилагательное в женском роде для абстрактного существительного.", "difficulty": "hard"}

**C2 (Proficiency)**: Экспертный уровень
{"question": "قرار الرئيس التنحي جاء كمفاجأة تامة، مما ترك المساهمين ___ .", "options": ["مذهولين", "متعجبين", "مرتبكين", "حائرين"], "correctAnswer": 0, "explanation": "'مذهولين' - крайняя степень удивления, подходящая для делового контекста.", "difficulty": "hard"}

Создай 5 вопросов по АРАБСКОМУ ЯЗЫКУ для уровня {cefrLevel}.`,

      3: `Ты - преподаватель китайского языка HSK. Создай 5 вопросов по КИТАЙСКОМУ ЯЗЫКУ для уровня {cefrLevel}.

ВАЖНО: Отвечай ТОЛЬКО валидным JSON формате, без дополнительного текста!

Формат ответа:
{
  "questions": [
    {
      "question": "Вопрос на китайском с иероглифами",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Объяснение на русском языке",
      "difficulty": "easy"
    }
  ]
}

ПРИМЕРЫ ВОПРОСОВ ПО УРОВНЯМ:

**A1 (Beginner)**: Базовые иероглифы и слова
{"question": "天空是什么颜色？", "options": ["蓝色", "绿色", "红色", "黄色"], "correctAnswer": 0, "explanation": "天空是蓝色的。Проверка базового словаря.", "difficulty": "easy"}

**A2 (Elementary)**: Простые времена
{"question": "我每天 ___ 去学校。", "options": ["去", "去了", "正在去", "会去"], "correctAnswer": 0, "explanation": "现在时 для регулярных действий - настоящее время.", "difficulty": "easy"}

**B1 (Intermediate)**: Сложные времена
{"question": "当我们到达时，电影 ___ 。", "options": ["开始", "开始了", "将开始", "已经开始"], "correctAnswer": 1, "explanation": "完成时 для действий, завершенных к определенному времени.", "difficulty": "medium"}

**B2 (Upper-Intermediate)**: Чэнъюй и сложные структуры
{"question": "我恐怕不能来了。我 ___ 开会。", "options": ["有", "有一个", "在有", "将会"], "correctAnswer": 0, "explanation": "进行时 для действий, происходящих сейчас.", "difficulty": "medium"}

**C1 (Advanced)**: Литературный китайский
{"question": "研究结果 ___ 令人惊讶，以至于改变了整个领域。", "options": ["如此", "如此地", "像", "这样的"], "correctAnswer": 0, "explanation": "关联词 '如此...以至于' 表示程度.", "difficulty": "hard"}

**C2 (Proficiency)**: Экспертный уровень
{"question": "CEO的辞职决定完全出人意料，让利益相关者 ___ 。", "options": ["目瞪口呆", "惊讶", "困惑", "不知所措"], "correctAnswer": 0, "explanation": "'目瞪口呆' - крайняя степень удивления, подходящая для делового контекста.", "difficulty": "hard"}

Создай 5 вопросов по КИТАЙСКОМУ ЯЗЫКУ для уровня {cefrLevel}.`,

      4: `Ты - академический преподаватель математики, кандидат физико-математических наук. Создай 5 вопросов по МАТЕМАТИКЕ для уровня {cefrLevel}.

ВАЖНО: Отвечай ТОЛЬКО валидным JSON формате, без дополнительного текста!

Формат ответа:
{
  "questions": [
    {
      "question": "Вопрос по математике",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Объяснение на русском языке",
      "difficulty": "easy"
    }
  ]
}

ПРИМЕРЫ ВОПРОСОВ ПО УРОВНЯМ:

**A1 (Beginner)**: Базовая арифметика
{"question": "Сколько будет 2 + 2?", "options": ["3", "4", "5", "6"], "correctAnswer": 1, "explanation": "2 + 2 = 4. Проверка базовых арифметических навыков.", "difficulty": "easy"}

**A2 (Elementary)**: Простые задачи
{"question": "Если у тебя 5 яблок и ты съел 2, сколько осталось?", "options": ["2", "3", "5", "7"], "correctAnswer": 1, "explanation": "5 - 2 = 3. Вычитание в практической задаче.", "difficulty": "easy"}

**B1 (Intermediate)**: Уравнения и проценты
{"question": "Реши уравнение: 2x + 3 = 7. x = ?", "options": ["1", "2", "3", "4"], "correctAnswer": 1, "explanation": "2x + 3 = 7; 2x = 4; x = 2. Решение линейного уравнения.", "difficulty": "medium"}

**B2 (Upper-Intermediate)**: Геометрия и функции
{"question": "Чему равна площадь круга радиуса 3?", "options": ["9π", "6π", "3π", "π"], "correctAnswer": 0, "explanation": "S = πr² = π×9 = 9π. Формула площади круга.", "difficulty": "medium"}

**C1 (Advanced)**: Продвинутая математика
{"question": "Найди производную функции f(x) = x² + 2x + 1", "options": ["2x", "2x + 2", "x²", "2x + 1"], "correctAnswer": 1, "explanation": "f'(x) = 2x + 2. Правила дифференцирования.", "difficulty": "hard"}

**C2 (Proficiency)**: Экспертный уровень
{"question": "Реши дифференциальное уравнение: y' + 2y = 0", "options": ["y = Ce^{-2x}", "y = Ce^{2x}", "y = Csin(2x)", "y = Ccos(2x)"], "correctAnswer": 0, "explanation": "Характеристическое уравнение: r + 2 = 0, r = -2. Общее решение: y = Ce^{-2x}.", "difficulty": "hard"}

Создай 5 вопросов по МАТЕМАТИКЕ для уровня {cefrLevel}.`,

      5: `Ты - академический преподаватель физики, кандидат физико-математических наук. Создай 5 вопросов по ФИЗИКЕ для уровня {cefrLevel}.

ВАЖНО: Отвечай ТОЛЬКО валидным JSON формате, без дополнительного текста!

Формат ответа:
{
  "questions": [
    {
      "question": "Вопрос по физике",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Объяснение на русском языке",
      "difficulty": "easy"
    }
  ]
}

ПРИМЕРЫ ВОПРОСОВ ПО УРОВНЯМ:

**A1 (Beginner)**: Базовые понятия
{"question": "Что изучает физика?", "options": ["Животных", "Законы природы", "Цветы", "Музыку"], "correctAnswer": 1, "explanation": "Физика изучает законы природы и фундаментальные явления.", "difficulty": "easy"}

**A2 (Elementary)**: Простые явления
{"question": "Что такое сила тяжести?", "options": ["Ветер", "Притяжение Земли", "Свет", "Тепло"], "correctAnswer": 1, "explanation": "Сила тяжести - это гравитационное притяжение между Землей и объектами.", "difficulty": "easy"}

**B1 (Intermediate)**: Законы и формулы
{"question": "Согласно второму закону Ньютона, сила равна...", "options": ["массе", "ускорению", "массе × ускорению", "массе ÷ ускорению"], "correctAnswer": 2, "explanation": "F = m×a. Сила пропорциональна массе и ускорению.", "difficulty": "medium"}

**B2 (Upper-Intermediate)**: Комплексные явления
{"question": "Что такое электромагнитная волна?", "options": ["Звук в воде", "Свет и радиоволны", "Тепло от огня", "Движение воздуха"], "correctAnswer": 1, "explanation": "Электромагнитные волны включают видимый свет, радиоволны, инфракрасное излучение.", "difficulty": "medium"}

**C1 (Advanced)**: Продвинутая физика
{"question": "Что утверждает принцип неопределенности Гейзенберга?", "options": ["Невозможно точно измерить положение и импульс частицы", "Энергия сохраняется", "Свет распространяется прямолинейно", "Тела притягиваются"], "correctAnswer": 0, "explanation": "Δx×Δp ≥ ℏ/2. Невозможно одновременно точно знать положение и импульс квантовой частицы.", "difficulty": "hard"}

**C2 (Proficiency)**: Экспертный уровень
{"question": "Что такое квантовая суперпозиция?", "options": ["Сложение векторов", "Состояние частицы в нескольких местах одновременно", "Супер проводимость", "Черные дыры"], "correctAnswer": 1, "explanation": "В квантовой механике частица может находиться в суперпозиции нескольких состояний до измерения.", "difficulty": "hard"}

Создай 5 вопросов по ФИЗИКЕ для уровня {cefrLevel}.`,

      6: `Ты - академический преподаватель географии, кандидат географических наук. Создай 5 вопросов по ГЕОГРАФИИ для уровня {cefrLevel}.

ВАЖНО: Отвечай ТОЛЬКО валидным JSON формате, без дополнительного текста!

Формат ответа:
{
  "questions": [
    {
      "question": "Вопрос по географии",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Объяснение на русском языке",
      "difficulty": "easy"
    }
  ]
}

ПРИМЕРЫ ВОПРОСОВ ПО УРОВНЯМ:

**A1 (Beginner)**: Базовые понятия
{"question": "Что такое река?", "options": ["Гора", "Водный поток", "Лес", "Пустыня"], "correctAnswer": 1, "explanation": "Река - это естественный водный поток, текущий в русле.", "difficulty": "easy"}

**A2 (Elementary)**: Материки и океаны
{"question": "На каком континенте находится Россия?", "options": ["Африка", "Европа и Азия", "Америка", "Австралия"], "correctAnswer": 1, "explanation": "Россия находится на двух континентах: Европе и Азии.", "difficulty": "easy"}

**B1 (Intermediate)**: Климат и погода
{"question": "Что такое экватор?", "options": ["Горная вершина", "Линия на карте", "Воображаемая линия, делящая Землю на полушария", "Океан"], "correctAnswer": 2, "explanation": "Экватор - это воображаемая линия, проходящая через центр Земли и делящая её на Северное и Южное полушария.", "difficulty": "medium"}

**B2 (Upper-Intermediate)**: Геополитика
{"question": "Что такое глобализация?", "options": ["Климатические изменения", "Интеграция экономик разных стран", "Увеличение населения", "Развитие технологий"], "correctAnswer": 1, "explanation": "Глобализация - процесс интеграции экономик, культур и обществ разных стран мира.", "difficulty": "medium"}

**C1 (Advanced)**: Продвинутая география
{"question": "Что такое урбанизация?", "options": ["Рост городов", "Увеличение сельского населения", "Климатические изменения", "Развитие промышленности"], "correctAnswer": 0, "explanation": "Урбанизация - процесс роста и развития городов, увеличения доли городского населения.", "difficulty": "hard"}

**C2 (Proficiency)**: Экспертный уровень
{"question": "Что такое геоинформатика?", "options": ["Изучение гор", "Применение информационных технологий в географии", "Климатология", "Океанография"], "correctAnswer": 1, "explanation": "Геоинформатика - научная дисциплина, изучающая применение информационных технологий для обработки географической информации.", "difficulty": "hard"}

Создай 5 вопросов по ГЕОГРАФИИ для уровня {cefrLevel}.`,

      7: `Ты - академический преподаватель истории, кандидат исторических наук. Создай 5 вопросов по ИСТОРИИ для уровня {cefrLevel}.

ВАЖНО: Отвечай ТОЛЬКО валидным JSON формате, без дополнительного текста!

Формат ответа:
{
  "questions": [
    {
      "question": "Вопрос по истории",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Объяснение на русском языке",
      "difficulty": "easy"
    }
  ]
}

ПРИМЕРЫ ВОПРОСОВ ПО УРОВНЯМ:

**A1 (Beginner)**: Базовые понятия
{"question": "Что такое история?", "options": ["Наука о будущем", "Наука о прошлом", "Наука о настоящем", "Наука о погоде"], "correctAnswer": 1, "explanation": "История - это наука, изучающая прошлое человечества и общества.", "difficulty": "easy"}

**A2 (Elementary)**: Основные события
{"question": "В каком году произошла Октябрьская революция в России?", "options": ["1914", "1917", "1921", "1939"], "correctAnswer": 1, "explanation": "Октябрьская революция произошла в 1917 году по старому стилю (1917 год).", "difficulty": "easy"}

**B1 (Intermediate)**: Исторические процессы
{"question": "Что такое промышленная революция?", "options": ["Сельскохозяйственная реформа", "Переход от ручного труда к машинному производству", "Военная реформа", "Политическая реформа"], "correctAnswer": 1, "explanation": "Промышленная революция - переход от ручного труда и ремесла к машинному производству и фабричной системе.", "difficulty": "medium"}

**B2 (Upper-Intermediate)**: Исторические закономерности
{"question": "Что такое феодализм?", "options": ["Рабовладельческий строй", "Социально-экономическая система средневековья", "Капиталистический строй", "Коммунистический строй"], "correctAnswer": 1, "explanation": "Феодализм - социально-экономическая система средневековья, основанная на земельной собственности и вассальных отношениях.", "difficulty": "medium"}

**C1 (Advanced)**: Историография
{"question": "Что такое источниковедение?", "options": ["Изучение источников", "Критика и анализ исторических источников", "Написание истории", "Преподавание истории"], "correctAnswer": 1, "explanation": "Источниковедение - дисциплина, занимающаяся критикой и анализом исторических источников.", "difficulty": "hard"}

**C2 (Proficiency)**: Методология истории
{"question": "Что такое историческая антропология?", "options": ["Изучение древних цивилизаций", "Изучение человека в историческом контексте", "Изучение первобытных обществ", "Изучение мифов"], "correctAnswer": 1, "explanation": "Историческая антропология изучает человека, его поведение и культуру в историческом развитии.", "difficulty": "hard"}

Создай 5 вопросов по ИСТОРИИ для уровня {cefrLevel}.`
    };

    return prompts[courseId] || prompts[0]; // По умолчанию русский язык
  };

  // Пользовательские промпты для разных курсов
  const getUserPrompt = (courseId: number): string => {
    const userPrompts: { [key: number]: string } = {
      0: 'Создай 5 вопросов по русской литературе и филологии для носителей русского языка, желающих углубить свои знания на академическом уровне.',
      1: 'Создай 5 простых вопросов по базовому английскому словарю для абсолютных начинающих. ВСЕ вопросы и ответы должны быть на русском языке.',
      2: 'Создай 5 простых вопросов по базовому арабскому словарю для абсолютных начинающих. ВСЕ вопросы и ответы должны быть на русском языке.',
      3: 'Создай 5 простых вопросов по базовому китайскому словарю для абсолютных начинающих. ВСЕ вопросы и ответы должны быть на русском языке.',
      4: 'Создай 5 вопросов по математике, охватывающих уровни от базового до экспертного.',
      5: 'Создай 5 вопросов по физике, охватывающих уровни от базового до экспертного.',
      6: 'Создай 5 вопросов по географии, охватывающих уровни от базового до экспертного.',
      7: 'Создай 5 вопросов по истории, охватывающих уровни от базового до экспертного.'
    };

    return userPrompts[courseId] || userPrompts[0]; // По умолчанию русский язык
  };

  // Function to get difficulty based on CEFR level
  const getDifficultyFromCEFR = (cefrLevel: CEFRLevel): 'easy' | 'medium' | 'hard' => {
    switch (cefrLevel) {
      case 'A1':
      case 'A2':
        return 'easy';
      case 'B1':
      case 'B2':
        return 'medium';
      case 'C1':
      case 'C2':
        return 'hard';
      default:
        return 'medium';
    }
  };


  // Function to get level name based on percentage and course
  const getLevelName = (percentage: number): string => {
    if (percentage >= 80) return 'Продвинутый';
    if (percentage >= 60) return 'Средний';
    return 'Начинающий';
  };

  // Functions for step navigation
  const handleLevelSelection = (level: CEFRLevel) => {
    setSelectedLevel(level);
    setCurrentStep('goal_setting');
  };

  const handleGoalSetting = async (goal: string) => {
    setLearningGoal(goal);
    // Skip testing and go directly to completion
    await handleTestCompletion();
  };

  const handleTestCompletion = async (correctCount?: number) => {
    // If testing was skipped, use default values
    const wasTestingSkipped = questions.length === 0;
    const finalScore = wasTestingSkipped ? 75 : (correctCount ?? score);
    const totalQuestions = wasTestingSkipped ? 10 : questions.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    const cefrResult = getCEFRScore(percentage);

    setFinalScore(cefrResult.score);
    setFinalCEFRLevel(cefrResult.level);

    // Collect assessment data
    const assessmentData = wasTestingSkipped ? {
      questions: [],
      userAnswers: [],
      correctAnswers: [],
      score: finalScore,
      totalQuestions: totalQuestions,
      selectedLevel: selectedLevel,
      learningGoal: learningGoal,
      finalCEFRLevel: cefrResult.level,
      finalScore: cefrResult.score
    } : {
      questions: questions,
      userAnswers: answers,
      correctAnswers: questions.map(q => q.correctAnswer),
      score: finalScore,
      totalQuestions: questions.length,
      selectedLevel: selectedLevel,
      learningGoal: learningGoal,
      finalCEFRLevel: cefrResult.level,
      finalScore: cefrResult.score
    };

    // Determine weak topics
    const weakTopics: string[] = [];
    if (!wasTestingSkipped) {
      const incorrectQuestions: any[] = [];
      answers.forEach((answer, index) => {
        if (answer !== questions[index].correctAnswer) {
          incorrectQuestions.push({
            question: questions[index].question,
            userAnswer: questions[index].options[answer] || 'Не ответил',
            correctAnswer: questions[index].options[questions[index].correctAnswer],
            explanation: questions[index].explanation,
            topic: getQuestionTopic(questions[index])
          });

          const topic = getQuestionTopic(questions[index]);
          if (!weakTopics.includes(topic)) {
            weakTopics.push(topic);
          }
        }
      });
    }

    // Update user assessment result with detailed data
    setIsGeneratingCourse(true);
    await updateAssessmentResult(finalScore, totalQuestions, weakTopics, assessmentData);
    setIsGeneratingCourse(false);

    // Navigate directly to personalized course after completion
    navigate('/personalized-course');
  };

  // Function to get static Russian language questions
  const getRussianLanguageQuestions = (cefrLevel: CEFRLevel): Question[] => {
    const questions: { [key in CEFRLevel]: Question[] } = {
      A1: [
        {
          id: 1,
          question: "Какой цвет у неба в ясный день?",
          options: ["Красный", "Синий", "Зелёный", "Жёлтый"],
          correctAnswer: 1,
          explanation: "Небо обычно имеет синий цвет в ясную погоду.",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "Я ___ в школу каждый день.",
          options: ["иду", "идёт", "идущий", "пошёл"],
          correctAnswer: 0,
          explanation: "Для первого лица единственного числа используем форму 'иду'.",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "Сколько пальцев на одной руке?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 1,
          explanation: "На руке пять пальцев.",
          difficulty: "easy"
        },
        {
          id: 4,
          question: "Привет! ___ тебя зовут?",
          options: ["Как", "Что", "Где", "Когда"],
          correctAnswer: 0,
          explanation: "'Как тебя зовут?' - это вопрос о имени.",
          difficulty: "easy"
        },
        {
          id: 5,
          question: "Это ___ или девочка?",
          options: ["мальчик", "девочка", "мальчика", "девочки"],
          correctAnswer: 0,
          explanation: "Вопрос о поле: мальчик или девочка.",
          difficulty: "easy"
        }
      ],
      A2: [
        {
          id: 6,
          question: "Вчера я ___ в кино.",
          options: ["пошёл", "иду", "пойду", "хожу"],
          correctAnswer: 0,
          explanation: "Для прошедшего времени используем 'пошёл'.",
          difficulty: "easy"
        },
        {
          id: 7,
          question: "У меня есть ___ сестра.",
          options: ["мою", "моя", "моё", "моём"],
          correctAnswer: 1,
          explanation: "Притяжательное местоимение в именительном падеже - 'моя'.",
          difficulty: "medium"
        },
        {
          id: 8,
          question: "Я живу ___ центре города.",
          options: ["в", "на", "за", "под"],
          correctAnswer: 0,
          explanation: "Предлог 'в' используется с центром города.",
          difficulty: "easy"
        },
        {
          id: 9,
          question: "Сейчас ___ часов.",
          options: ["который", "которая", "которое", "которые"],
          correctAnswer: 3,
          explanation: "Часы - множественное число, поэтому 'которые'.",
          difficulty: "medium"
        },
        {
          id: 10,
          question: "Завтра я ___ на работу.",
          options: ["пошёл", "иду", "пойду", "ходил"],
          correctAnswer: 2,
          explanation: "Для будущего времени используем 'пойду'.",
          difficulty: "easy"
        }
      ],
      B1: [
        {
          id: 11,
          question: "К тому времени, как мы приедем, фильм уже ___.",
          options: ["начнётся", "начался", "начинался", "начинался бы"],
          correctAnswer: 1,
          explanation: "Future Perfect: действие завершится к определённому времени.",
          difficulty: "hard"
        },
        {
          id: 12,
          question: "Я боюсь, что не смогу прийти. У меня ___ встреча.",
          options: ["есть", "будет", "была", "бывает"],
          correctAnswer: 1,
          explanation: "Present Continuous для запланированного действия в будущем.",
          difficulty: "medium"
        },
        {
          id: 13,
          question: "Он ___ книгу уже два часа.",
          options: ["читает", "читал", "прочитал", "почитает"],
          correctAnswer: 0,
          explanation: "Present Continuous для действия, происходящего сейчас.",
          difficulty: "medium"
        },
        {
          id: 14,
          question: "Если бы у меня было время, я бы ___.",
          options: ["пойду", "пошёл", "пошел бы", "ходил"],
          correctAnswer: 2,
          explanation: "Subjunctive mood для нереального условия.",
          difficulty: "hard"
        },
        {
          id: 15,
          question: "Я должен ___ эту работу до завтра.",
          options: ["закончить", "заканчиваю", "закончу", "заканчивал"],
          correctAnswer: 0,
          explanation: "Модальный глагол 'должен' + инфинитив.",
          difficulty: "medium"
        }
      ],
      B2: [
        {
          id: 16,
          question: "Укажите слово с ошибкой:",
          options: ["сторожевой", "прЕвосходный", "кристальный", "полумрак"],
          correctAnswer: 1,
          explanation: "Правильно: 'прекрасный', а не 'прЕвосходный'.",
          difficulty: "hard"
        },
        {
          id: 17,
          question: "Расставьте запятые правильно: Когда он вошёл в комнату все сразу замолчали.",
          options: ["Когда он вошёл, в комнату все сразу замолчали.", "Когда он вошёл в комнату, все сразу замолчали.", "Когда он, вошёл в комнату все, сразу замолчали.", "Когда, он вошёл, в комнату, все сразу, замолчали."],
          correctAnswer: 1,
          explanation: "Запятая ставится после придаточного предложения.",
          difficulty: "hard"
        },
        {
          id: 18,
          question: "Определите часть речи слова «смотря» в предложении: Смотря на небо, он задумался.",
          options: ["причастие", "деепричастие", "наречие", "глагол"],
          correctAnswer: 1,
          explanation: "«Смотря» - деепричастие, обозначает дополнительное действие.",
          difficulty: "medium"
        },
        {
          id: 19,
          question: "Найдите подлежащее в предложении: У дома зацвели белые акации.",
          options: ["дома", "акации", "белые", "зацвели"],
          correctAnswer: 1,
          explanation: "Подлежащее отвечает на вопрос 'кто?' или 'что?'.",
          difficulty: "easy"
        },
        {
          id: 20,
          question: "Укажите вариант с неверным употреблением слова:",
          options: ["Надень пальто.", "Ложи книгу на стол.", "Встань и открой окно.", "Положи ручку обратно."],
          correctAnswer: 1,
          explanation: "Правильно: 'положи', а не 'ложи'.",
          difficulty: "medium"
        }
      ],
      C1: [
        {
          id: 21,
          question: "Найдите правильно написанное слово:",
          options: ["прЕостановить", "прЕодолеть", "прИобрести", "прЕбегнуть"],
          correctAnswer: 2,
          explanation: "Правильно: 'приобрести' (приставка 'при-').",
          difficulty: "hard"
        },
        {
          id: 22,
          question: "Расставьте знаки препинания: Я уверен что если ты постараешься то всё получится.",
          options: ["Я уверен, что если ты постараешься, то всё получится.", "Я уверен что, если ты постараешься то всё получится.", "Я уверен что если ты постараешься то всё получится.", "Я уверен, что если ты постараешься то, всё получится."],
          correctAnswer: 0,
          explanation: "Запятые выделяют придаточные предложения.",
          difficulty: "hard"
        },
        {
          id: 23,
          question: "Укажите форму глагола «класть» в повелительном наклонении:",
          options: ["клади", "ложи", "положи", "кладь"],
          correctAnswer: 0,
          explanation: "Повелительное наклонение: 'клади'.",
          difficulty: "medium"
        },
        {
          id: 24,
          question: "Определите тип предложения: Он подошёл, но ничего не сказал.",
          options: ["простое", "сложносочинённое", "сложноподчинённое", "бессоюзное"],
          correctAnswer: 1,
          explanation: "Союз 'но' соединяет две части сложносочинённого предложения.",
          difficulty: "medium"
        },
        {
          id: 25,
          question: "Укажите предложение с речевой ошибкой:",
          options: ["Благодаря усилиям команда победила.", "Из-за дождя матч отменили.", "Благодаря дождю матч отменили.", "По причине болезни он не пришёл."],
          correctAnswer: 2,
          explanation: "'Благодаря' требует положительного значения.",
          difficulty: "hard"
        }
      ],
      C2: [
        {
          id: 26,
          question: "Укажите вариант, где все слова написаны верно:",
          options: ["непримиримый, непрошеный, несдержанный", "непримЕримый, непрошенный, несдержанный", "непримиримый, непрошенный, несдержанный", "не примиримый, не прошенный, не сдержанный"],
          correctAnswer: 2,
          explanation: "Правильное написание приставок с Н.",
          difficulty: "hard"
        },
        {
          id: 27,
          question: "Расставьте запятые: Он говорил и смеялся хотя глаза его оставались серьёзными.",
          options: ["Он говорил, и смеялся, хотя глаза его оставались серьёзными.", "Он говорил и смеялся, хотя глаза его оставались серьёзными.", "Он говорил и смеялся хотя, глаза его оставались серьёзными.", "Он, говорил и смеялся хотя глаза его оставались серьёзными."],
          correctAnswer: 1,
          explanation: "Запятая перед 'хотя' в уступительном придаточном.",
          difficulty: "hard"
        },
        {
          id: 28,
          question: "Укажите спряжение глагола «петь»:",
          options: ["I спряжение", "II спряжение", "неправильно спрягается", "не изменяется"],
          correctAnswer: 0,
          explanation: "Глагол 'петь' относится к I спряжению.",
          difficulty: "medium"
        },
        {
          id: 29,
          question: "Определите тип придаточного в предложении: Я видел, как он вошёл.",
          options: ["определительное", "изъяснительное", "обстоятельственное", "сравнительное"],
          correctAnswer: 1,
          explanation: "Союз 'как' вводит изъяснительное придаточное.",
          difficulty: "hard"
        },
        {
          id: 30,
          question: "Укажите фразеологизм, употреблённый не к месту:",
          options: ["Работает засучив рукава.", "Сидит сложа руки.", "Делает руками и ногами.", "Слушает в пол-уха."],
          correctAnswer: 2,
          explanation: "'Делает руками и ногами' означает 'очень старается', что не подходит.",
          difficulty: "hard"
        }
      ]
    };

    return questions[cefrLevel] || [];
  };

  // Function to get system prompt based on course and CEFR level
  const getSystemPromptForLevel = (courseId: number, cefrLevel: CEFRLevel): string => {
    const basePrompts: { [key: number]: { [key in CEFRLevel]: string } } = {
      0: { // Русский язык
        A1: `Ты - профессиональный преподаватель русского языка как иностранного, сертифицированный по методике ТРКИ. Создай 5 вопросов по русскому языку для уровня A1 (Элементарный).

ВАЖНО: ВСЕ вопросы должны быть на РУССКОМ языке, варианты ответов - на РУССКОМ, объяснения - на РУССКОМ!

УРОВЕНЬ A1: Проверка базовых навыков
- Понимание простых слов и фраз
- Базовые вопросы (Кто, Что, Где, Когда)
- Простые команды и инструкции
- Цвета, числа, дни недели

ПРИМЕРЫ ВОПРОСОВ A1:
"Какой цвет у неба?" (Синий, Зеленый, Красный, Желтый) - Проверка базового словаря

"Я ___ в школу каждый день." (иду, идет, идущий, пошел) - Проверка настоящего времени

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Вопросы должны быть для АБСОЛЮТНЫХ НАЧИНАЮЩИХ
- Каждый вопрос должен проверять реальные базовые навыки
- Объяснения простые и понятные

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Текст вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Пояснение почему этот ответ правильный",
      "difficulty": "easy|medium|hard"
    }
  ]
}
НЕ добавляй никакого текста кроме JSON!`,
        A2: `Ты - профессиональный преподаватель русского языка как иностранного. Создай 5 вопросов по русскому языку для уровня A2 (Базовый).

УРОВЕНЬ A2: Проверка элементарных навыков
- Настоящее время (Present Simple)
- Прошедшее время (Past Simple)
- Будущее время с "буду"
- Притяжательные местоимения
- Предлоги места и времени

ПРИМЕРЫ ВОПРОСОВ A2:
"Вчера я ___ в кино." (пошел, иду, пойду, хожу) - Проверка прошедшего времени

"У меня есть ___ сестра." (мою, моя, мое, моем) - Проверка притяжательных местоимений

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Вопросы должны соответствовать уровню A2
- Фокус на грамматике и повседневном общении
- Объяснения понятные с примерами`,
        B1: `Ты - преподаватель русского языка среднего уровня. Создай 5 вопросов по русскому языку для уровня B1 (Средний).

УРОВЕНЬ B1: Проверка среднего уровня
- Сложные времена (Present Perfect, Past Continuous)
- Условные предложения (Future Simple)
- Модальные глаголы (мочь, должен, хотеть)
- Пассивный залог
- Относительные местоимения

ПРИМЕРЫ ВОПРОСОВ B1:
"К тому времени, как мы приедем, фильм уже ___." (начнется, начался, начинался, начинался бы) - Проверка Future Perfect

"Я боюсь, что не смогу прийти. У меня ___ встреча." (есть, будет, была, бывает) - Проверка Present Continuous

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Вопросы для самостоятельного общения
- Фокус на сложной грамматике и лексике`,
        B2: `Ты - преподаватель русского языка выше среднего уровня. Создай 5 вопросов по русскому языку для уровня B2 (Выше среднего).

УРОВЕНЬ B2: Проверка выше среднего
- Сложные грамматические конструкции
- Идиомы и фразеологизмы
- Сложные условные предложения
- Инверсия и стилистические конструкции
- Формальный vs разговорный стиль

ПРИМЕРЫ ВОПРОСОВ B2:
"Не успели мы войти, ___ дождь." (как пошел, как пойдет, как идет, как пойдет бы) - Проверка сложных конструкций

"Его решение уйти в отставку стало полной неожиданностью, оставив акционеров ___." (в шоке, шокированными, шокирующими, шокируя) - Проверка точного словаря

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Вопросы для сложного общения
- Фокус на идиомах и стилистике`,
        C1: `Ты - преподаватель русского языка продвинутого уровня. Создай 5 вопросов по русскому языку для уровня C1 (Продвинутый).

УРОВЕНЬ C1: Проверка продвинутого уровня
- Стилистические нюансы
- Комплексные грамматические структуры
- Идиоматические выражения
- Академический словарь
- Сложные синтаксические конструкции

ПРИМЕРЫ ВОПРОСОВ C1:
"Результаты исследования были ___ удивительны, что изменили всю область." (настолько, такими, так, такие) - Проверка сложных структур

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Вопросы для профессионального общения
- Фокус на нюансах и стилистике`,
        C2: `Ты - преподаватель русского языка для носителей и продвинутых. Создай 5 вопросов по русскому языку для уровня C2 (В совершенстве).

УРОВЕНЬ C2: Проверка носителя
- Экспертное владение языком
- Редкие идиомы и выражения
- Литературный стиль
- Комплексный анализ текста
- Тонкие языковые нюансы

ПРИМЕРЫ ВОПРОСОВ C2:
"Его теория оказалась ___ прорывом в современной лингвистике." (тем, того, тем самым, того самого) - Проверка экспертного словаря

ТРЕБОВАНИЯ К ВОПРОСАМ:
- Вопросы для экспертного уровня
- Фокус на литературном языке и нюансах`
      },
      1: { // Английский язык
        A1: `Ты - преподаватель английского языка для абсолютных начинающих. Создай 5 вопросов по базовому английскому для уровня A1.

ТРЕБОВАНИЯ:
- Вопросы для уровня A1: базовые слова, простые фразы (hello, numbers, colors)
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть очень простыми

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Текст вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Пояснение почему этот ответ правильный",
      "difficulty": "easy|medium|hard"
    }
  ]
}
НЕ добавляй никакого текста кроме JSON!`,
        A2: `Ты - преподаватель английского языка для начинающих. Создай 5 вопросов по английскому для уровня A2.

ТРЕБОВАНИЯ:
- Вопросы для уровня A2: повседневные темы, Present Simple
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть понятными

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Текст вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Пояснение почему этот ответ правильный",
      "difficulty": "easy|medium|hard"
    }
  ]
}
НЕ добавляй никакого текста кроме JSON!`,
        B1: `Ты - преподаватель английского языка среднего уровня. Создай 5 вопросов по английскому для уровня B1.

ТРЕБОВАНИЯ:
- Вопросы для уровня B1: Past tenses, future forms, conditionals
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть подробными

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Текст вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Пояснение почему этот ответ правильный",
      "difficulty": "easy|medium|hard"
    }
  ]
}
НЕ добавляй никакого текста кроме JSON!`,
        B2: `Ты - преподаватель английского языка выше среднего уровня. Создай 5 вопросов по английскому для уровня B2.

ТРЕБОВАНИЯ:
- Вопросы для уровня B2: complex structures, phrasal verbs, idioms
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть академическими

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Текст вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Пояснение почему этот ответ правильный",
      "difficulty": "easy|medium|hard"
    }
  ]
}
НЕ добавляй никакого текста кроме JSON!`,
        C1: `Ты - преподаватель английского языка продвинутого уровня. Создай 5 вопросов по английскому для уровня C1.

ТРЕБОВАНИЯ:
- Вопросы для уровня C1: advanced grammar, formal language, nuances
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть глубокими

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Текст вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Пояснение почему этот ответ правильный",
      "difficulty": "easy|medium|hard"
    }
  ]
}
НЕ добавляй никакого текста кроме JSON!`,
        C2: `Ты - преподаватель английского языка для продвинутых. Создай 5 вопросов по английскому для уровня C2.

ТРЕБОВАНИЯ:
- Вопросы для уровня C2: expert level, literary language, complex topics
- Каждый вопрос должен иметь 4 варианта ответа (ТОЛЬКО ОДИН правильный)
- Объяснения должны быть академическими

Формат ответа (ТОЛЬКО JSON):
{
  "questions": [
    {
      "question": "Текст вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Пояснение почему этот ответ правильный",
      "difficulty": "easy|medium|hard"
    }
  ]
}
НЕ добавляй никакого текста кроме JSON!`
      }
    };

    const coursePrompts = basePrompts[courseId] || basePrompts[0];
    const levelPrompt = coursePrompts[cefrLevel] || coursePrompts.B1;

    return `${levelPrompt}
{
  "questions": [
    {
      "question": "Вопрос для уровня ${cefrLevel}",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctAnswer": 0,
      "explanation": "Объяснение ответа",
      "difficulty": "${getDifficultyFromCEFR(cefrLevel)}"
    }
  ]
}`;
  };

  // Function to get user prompt based on course and CEFR level
  const getUserPromptForLevel = (courseId: number, cefrLevel: CEFRLevel): string => {
    const prompts: { [key: number]: { [key in CEFRLevel]: string } } = {
      0: {
        A1: 'Создай 5 вопросов для уровня A1. Используй базовые слова и простые конструкции.',
        A2: 'Создай 5 вопросов для уровня A2. Проверяй базовую грамматику и повседневный словарь.',
        B1: 'Создай 5 вопросов для уровня B1. Проверяй сложные времена и конструкции.',
        B2: 'Создай 5 вопросов для уровня B2. Проверяй идиомы и сложные структуры.',
        C1: 'Создай 5 вопросов для уровня C1. Проверяй стилистику и продвинутую грамматику.',
        C2: 'Создай 5 вопросов для уровня C2. Проверяй экспертный уровень и литературный анализ.'
      },
      1: {
        A1: 'Создай 5 вопросов для уровня A1. Проверяй базовый словарь и простые фразы.',
        A2: 'Создай 5 вопросов для уровня A2. Проверяй Present Simple и базовую грамматику.',
        B1: 'Создай 5 вопросов для уровня B1. Проверяй сложные времена и модальные глаголы.',
        B2: 'Создай 5 вопросов для уровня B2. Проверяй идиомы и сложные конструкции.',
        C1: 'Создай 5 вопросов для уровня C1. Проверяй академический словарь и нюансы.',
        C2: 'Создай 5 вопросов для уровня C2. Проверяй экспертный уровень и литературный стиль.'
      },
      2: {
        A1: 'Создай 5 вопросов для уровня A1. Проверяй базовые арабские слова и фразы.',
        A2: 'Создай 5 вопросов для уровня A2. Проверяй времена и базовую грамматику.',
        B1: 'Создай 5 вопросов для уровня B1. Проверяй сложные конструкции.',
        B2: 'Создай 5 вопросов для уровня B2. Проверяй идиомы и формальный стиль.',
        C1: 'Создай 5 вопросов для уровня C1. Проверяй литературный арабский.',
        C2: 'Создай 5 вопросов для уровня C2. Проверяй экспертный уровень.'
      },
      3: {
        A1: 'Создай 5 вопросов для уровня A1. Проверяй базовые иероглифы и слова.',
        A2: 'Создай 5 вопросов для уровня A2. Проверяй базовую грамматику.',
        B1: 'Создай 5 вопросов для уровня B1. Проверяй времена и конструкции.',
        B2: 'Создай 5 вопросов для уровня B2. Проверяй чэнъюй и сложные структуры.',
        C1: 'Создай 5 вопросов для уровня C1. Проверяй литературный китайский.',
        C2: 'Создай 5 вопросов для уровня C2. Проверяй экспертный уровень.'
      }
    };

    const coursePrompts = prompts[courseId] || prompts[0];
    return coursePrompts[cefrLevel] || coursePrompts.B1;
  };

  // Function to generate minimal fallback questions when LLM completely fails
  const generateMinimalFallbackQuestions = (cefrLevel: CEFRLevel): Question[] => {
    console.log(`Using minimal fallback questions for level ${cefrLevel}`);

    // Very basic questions that work for any level when LLM fails
    const basicQuestions: Question[] = [
      {
        id: 1,
        question: "Какой сейчас год?",
        options: ["2023", "2024", "2025", "2026"],
        correctAnswer: 2,
        explanation: "Текущий год - 2025.",
        difficulty: 'easy' as const,
      },
      {
        id: 2,
        question: "Сколько дней в неделе?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "В неделе 7 дней: понедельник, вторник, среда, четверг, пятница, суббота, воскресенье.",
        difficulty: 'easy' as const,
      },
      {
        id: 3,
        question: "Какое время года идет после зимы?",
        options: ["Лето", "Осень", "Весна", "Зима"],
        correctAnswer: 2,
        explanation: "После зимы идет весна.",
        difficulty: 'easy' as const,
      },
      {
        id: 4,
        question: "Сколько месяцев в году?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation: "В году 12 месяцев.",
        difficulty: 'easy' as const,
      },
      {
        id: 5,
        question: "Какое животное говорит 'мяу'?",
        options: ["Собака", "Кошка", "Корова", "Свинья"],
        correctAnswer: 1,
        explanation: "Кошка говорит 'мяу'.",
        difficulty: 'easy' as const,
      },
    ];

    return basicQuestions;
  };

  // Function to generate fallback questions based on CEFR level (DEPRECATED - kept for compatibility)
  const generateFallbackQuestions = (cefrLevel: CEFRLevel): Question[] => {
    const questionsByLevel: { [key in CEFRLevel]: Question[] } = {
      A1: [
        {
          id: 1,
          question: "Как правильно пишется слово: 'м...ма'?",
          options: ["мама", "мома", "мема", "мыма"],
          correctAnswer: 0,
          explanation: "В слове 'мама' ударение падает на первый слог, поэтому пишется буква А.",
          difficulty: 'easy' as const,
        },
        {
          id: 2,
          question: "Как пишется слово: 'с...бака'?",
          options: ["собаки", "сабака", "субака", "сыбака"],
          correctAnswer: 1,
          explanation: "В слове 'собака' ударение на второй слог, поэтому в первом слоге пишется А.",
          difficulty: 'easy' as const,
        },
        {
          id: 3,
          question: "Какое слово пишется правильно: 'кот' или 'год'?",
          options: ["кот", "год", "кад", "гут"],
          correctAnswer: 1,
          explanation: "В слове 'год' слышится звук [о], поэтому пишется буква О.",
          difficulty: 'easy' as const,
        },
        {
          id: 4,
          question: "Как пишется слово: 'м...лко'?",
          options: ["малко", "мелко", "мылко", "молко"],
          correctAnswer: 3,
          explanation: "В слове 'молоко' ударение на второй слог, поэтому в первом слоге пишется О.",
          difficulty: 'easy' as const,
        },
        {
          id: 5,
          question: "Как правильно: 'дом' или 'дум'?",
          options: ["дом", "дум", "дам", "дым"],
          correctAnswer: 0,
          explanation: "В слове 'дом' слышится звук [о], поэтому пишется буква О.",
          difficulty: 'easy' as const,
        },
      ],
      A2: [
        {
          id: 1,
          question: "Как правильно пишется: 'ду... или 'ду...?'",
          options: ["дуб", "дуп", "дуп", "дуб"],
          correctAnswer: 3,
          explanation: "В конце слова звонкий согласный [б] оглушается, поэтому пишется буква Б.",
          difficulty: 'easy' as const,
        },
        {
          id: 2,
          question: "Какое слово пишется правильно: 'мост' или 'мосд'?",
          options: ["мост", "мосд", "мост", "мост"],
          correctAnswer: 0,
          explanation: "В конце слова звонкий [з] оглушается в [с], поэтому пишется буква С - 'мост'.",
          difficulty: 'easy' as const,
        },
        {
          id: 3,
          question: "Как пишется слово: 'з...ма'?",
          options: ["зима", "зыма", "зема", "зома"],
          correctAnswer: 0,
          explanation: "В слове 'зима' ударение на второй слог, поэтому в первом слоге пишется И.",
          difficulty: 'easy' as const,
        },
        {
          id: 4,
          question: "Как правильно: 'кн...га' или 'кн...га'?",
          options: ["книга", "кныга", "книга", "книга"],
          correctAnswer: 0,
          explanation: "В слове 'книга' слышится звук [и], поэтому пишется буква И.",
          difficulty: 'easy' as const,
        },
        {
          id: 5,
          question: "Какое слово пишется правильно: 'стол' или 'стул'?",
          options: ["стол", "стул", "стал", "стыл"],
          correctAnswer: 0,
          explanation: "В слове 'стол' слышится звук [о], поэтому пишется буква О.",
          difficulty: 'easy' as const,
        },
      ],
      B1: [
        {
          id: 1,
          question: "Как правильно пишется слово: 'солн...е' или 'сонл...е'?",
          options: ["солнце", "сонлце", "солнце", "солнце"],
          correctAnswer: 0,
          explanation: "В слове 'солнце' непроизносимый согласный Н сохраняется в написании.",
          difficulty: 'medium' as const,
        },
        {
          id: 2,
          question: "Какое слово пишется правильно: 'здравствуй' или 'здраствуй'?",
          options: ["здравствуй", "здраствуй", "здравствуй", "здравствуй"],
          correctAnswer: 0,
          explanation: "В слове 'здравствуй' сохраняется буква В после приставки.",
          difficulty: 'medium' as const,
        },
        {
          id: 3,
          question: "Как пишется: 'ч...век' или 'ч...ловек'?",
          options: ["человек", "челавек", "человек", "человек"],
          correctAnswer: 0,
          explanation: "В слове 'человек' пишется буква Е, а не Л.",
          difficulty: 'medium' as const,
        },
        {
          id: 4,
          question: "Как правильно: 'прекрасный' или 'прикрасный'?",
          options: ["прекрасный", "прикрасный", "прекрасный", "прекрасный"],
          correctAnswer: 0,
          explanation: "Приставка 'пре-' означает высшую степень качества, поэтому 'прекрасный'.",
          difficulty: 'medium' as const,
        },
        {
          id: 5,
          question: "Какое слово пишется правильно: 'весна' или 'висна'?",
          options: ["весна", "висна", "весна", "весна"],
          correctAnswer: 0,
          explanation: "В слове 'весна' ударение на первый слог, поэтому пишется буква Е.",
          difficulty: 'medium' as const,
        },
      ],
      B2: [
        {
          id: 1,
          question: "Как правильно пишется слово: 'инж...нер' или 'инжен...р'?",
          options: ["инженер", "инжинер", "инженер", "инженер"],
          correctAnswer: 0,
          explanation: "В иноязычном слове 'инженер' пишется буква Е, а не И.",
          difficulty: 'hard' as const,
        },
        {
          id: 2,
          question: "Какое слово пишется правильно: 'белорусский' или 'белорусский'?",
          options: ["белорусский", "белорусский", "белорусский", "белорусский"],
          correctAnswer: 0,
          explanation: "В сложном слове 'белорусский' пишется одна буква С.",
          difficulty: 'hard' as const,
        },
        {
          id: 3,
          question: "Как пишется: 'ж...знь' или 'ж...знь'?",
          options: ["жизнь", "жызнь", "жизнь", "жизнь"],
          correctAnswer: 0,
          explanation: "В слове 'жизнь' пишется буква И, хотя слышится звук, близкий к Ы.",
          difficulty: 'hard' as const,
        },
        {
          id: 4,
          question: "Как правильно: 'девушка' или 'девочка'?",
          options: ["девушка", "девочка", "девушка", "девушка"],
          correctAnswer: 0,
          explanation: "Слово 'девушка' пишется с буквой Ш, а не Ч.",
          difficulty: 'hard' as const,
        },
        {
          id: 5,
          question: "Какое слово пишется правильно: 'красивый' или 'красывый'?",
          options: ["красивый", "красывый", "красивый", "красивый"],
          correctAnswer: 0,
          explanation: "В слове 'красивый' пишется буква И, а не Ы.",
          difficulty: 'hard' as const,
        },
      ],
      C1: [
        {
          id: 1,
          question: "Как правильно пишется слово: 'блест...щий' или 'блист...щий'?",
          options: ["блестящий", "блистящий", "блестящий", "блестящий"],
          correctAnswer: 0,
          explanation: "В слове 'блестящий' пишется буква Е, несмотря на корень 'блеск'.",
          difficulty: 'hard' as const,
        },
        {
          id: 2,
          question: "Какое слово пишется правильно: 'коллектив' или 'калектив'?",
          options: ["коллектив", "калектив", "коллектив", "коллектив"],
          correctAnswer: 0,
          explanation: "В иноязычном слове 'коллектив' сохраняется двойная Л.",
          difficulty: 'hard' as const,
        },
        {
          id: 3,
          question: "Как пишется: 'п...еса' или 'п...эса'?",
          options: ["пьеса", "пиеса", "пьеса", "пьеса"],
          correctAnswer: 0,
          explanation: "В слове 'пьеса' пишется буква Ь перед Е.",
          difficulty: 'hard' as const,
        },
        {
          id: 4,
          question: "Как правильно: 'диалог' или 'диаллог'?",
          options: ["диалог", "диаллог", "диалог", "диалог"],
          correctAnswer: 0,
          explanation: "В иноязычном слове 'диалог' пишется одна буква Л.",
          difficulty: 'hard' as const,
        },
        {
          id: 5,
          question: "Какое слово пишется правильно: 'благодарить' или 'благодорить'?",
          options: ["благодарить", "благодорить", "благодарить", "благодарить"],
          correctAnswer: 0,
          explanation: "В слове 'благодарить' пишется буква А, а не О.",
          difficulty: 'hard' as const,
        },
      ],
      C2: [
        {
          id: 1,
          question: "Как правильно пишется слово: 'р...внина' или 'равн...на'?",
          options: ["равнина", "ровнина", "равнина", "равнина"],
          correctAnswer: 0,
          explanation: "В слове 'равнина' пишется буква А, несмотря на корень 'ровный'.",
          difficulty: 'hard' as const,
        },
        {
          id: 2,
          question: "Какое слово пишется правильно: 'гореть' или 'гареть'?",
          options: ["гореть", "гареть", "гореть", "гореть"],
          correctAnswer: 0,
          explanation: "В слове 'гореть' пишется буква О, несмотря на чередование в корне.",
          difficulty: 'hard' as const,
        },
        {
          id: 3,
          question: "Как пишется: 'ч...рствый' или 'черств...й'?",
          options: ["черствый", "чорствый", "черствый", "черствый"],
          correctAnswer: 0,
          explanation: "В слове 'черствый' пишется буква Е, а не О.",
          difficulty: 'hard' as const,
        },
        {
          id: 4,
          question: "Как правильно: 'щавель' или 'щавель'?",
          options: ["щавель", "щавель", "щавель", "щавель"],
          correctAnswer: 0,
          explanation: "В слове 'щавель' пишется буква Щ, а не ЩА.",
          difficulty: 'hard' as const,
        },
        {
          id: 5,
          question: "Какое слово пишется правильно: 'баловать' или 'баловать'?",
          options: ["баловать", "баловать", "баловать", "баловать"],
          correctAnswer: 0,
          explanation: "В слове 'баловать' пишется буква А, несмотря на ударение.",
          difficulty: 'hard' as const,
        },
      ],
    };

    return questionsByLevel[cefrLevel] || questionsByLevel.B1;
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
        high: '🎉 Отличный результат! Вы знаете базовые английские слова.',
        medium: '👍 Хороший результат! Вы знаете некоторые английские слова.',
        low: '📚 Вы только начинаете изучение английского. Начнем с основных слов!'
      },
      2: { // Арабский язык
        high: '🎉 Отличный результат! Вы знаете базовые арабские слова.',
        medium: '👍 Хороший результат! Вы знаете некоторые арабские слова.',
        low: '📚 Вы только начинаете изучение арабского. Начнем с основных слов!'
      },
      3: { // Китайский язык
        high: '🎉 Отличный результат! Вы знаете базовые китайские слова и иероглифы.',
        medium: '👍 Хороший результат! Вы знаете некоторые китайские слова.',
        low: '📚 Вы только начинаете изучение китайского. Начнем с основных слов!'
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCEFRLevel, setFinalCEFRLevel] = useState<CEFRLevel | null>(null);

  // Generate questions when moving to testing step
  useEffect(() => {
    if (currentStep === 'testing' && selectedLevel && !questions.length) {
    generateQuestions();
    }
  }, [currentStep, selectedLevel]);

  const generateQuestions = async (retryCount = 0) => {
    if (!selectedLevel) return;

    setIsGenerating(true);

    try {
      console.log(`Loading questions for ${selectedLevel} level`);

      // For Russian language (courseId = 0), use static questions
      if (courseId === 0) {
        const questions = getRussianLanguageQuestions(selectedLevel);
        if (questions.length > 0) {
          console.log(`Successfully loaded ${questions.length} static questions for Russian language`);
          setQuestions(questions);
          setIsGenerating(false);
          return;
        }
      }

      // For other courses, use AI generation
      const maxRetries = 3;
      console.log(`Generating questions for ${selectedLevel} (attempt ${retryCount + 1}/${maxRetries + 1})`);

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
              content: getSystemPromptForLevel(courseId, selectedLevel),
            },
            {
              role: 'user',
              content: `Создай 5 вопросов для уровня ${selectedLevel}.`,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
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
          if (!question.question ||
              !question.options ||
              typeof question.correctAnswer !== 'number' ||
              !question.explanation ||
              !['easy', 'medium', 'hard'].includes(question.difficulty)) {
            throw new Error('Invalid question structure');
          }
        }

        console.log(`Successfully generated ${parsedContent.questions.length} questions via LLM`);
      setQuestions(parsedContent.questions);

      } catch (parseError) {
        console.error('Failed to parse questions JSON:', parseError);
        console.error('Raw content:', content);

        // Try to retry if we haven't exceeded max retries
        if (retryCount < maxRetries) {
          console.log(`Retrying question generation (attempt ${retryCount + 2}/${maxRetries + 1})`);
          setTimeout(() => generateQuestions(retryCount + 1), 1000); // Wait 1 second before retry
          return;
        }

        // If all retries failed, use minimal fallback
        console.warn('All LLM attempts failed, using minimal fallback questions');
        const fallbackQuestions = generateMinimalFallbackQuestions(selectedLevel || 'B1');
        setQuestions(fallbackQuestions);
      }
    } catch (error) {
      console.error('Error generating questions:', error);

      // Try to retry if we haven't exceeded max retries
      if (retryCount < maxRetries) {
        console.log(`Network error, retrying (attempt ${retryCount + 2}/${maxRetries + 1})`);
        setTimeout(() => generateQuestions(retryCount + 1), 2000); // Wait 2 seconds before retry
        return;
      }

      // If all retries failed, use minimal fallback
      console.warn('All attempts failed, using minimal fallback questions');
      const fallbackQuestions = generateMinimalFallbackQuestions(selectedLevel || 'B1');
      setQuestions(fallbackQuestions);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      setShowExplanation(false);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Calculate score and move to results step
        const correctCount = newAnswers.reduce((count, answer, index) => {
          return count + (answer === questions[index].correctAnswer ? 1 : 0);
        }, 0);
        setScore(correctCount);

        // Move to results step with calculated score
        await handleTestCompletion(correctCount);
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

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  // Show loading while completing assessment
  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Создание персонального курса</h2>
            <p className="text-muted-foreground mb-4">
              Анализируем ваши предпочтения и создаем индивидуальную программу обучения...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show different UI based on current step
  if (currentStep === 'level_selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        {/* Header */}
        <Header />

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="mx-4">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl px-2">Выберите ваш уровень владения языком</CardTitle>
              <CardDescription>
                Укажите ваш текущий уровень, чтобы мы могли подобрать подходящие вопросы для точной оценки
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  Выберите уровень, который лучше всего описывает ваше текущее владение языком
                </p>
              </div>

              <RadioGroup onValueChange={(value) => setSelectedLevel(value as CEFRLevel)} className="space-y-3">
                {([
                  { level: 'A1' as CEFRLevel, icon: '👶', examples: 'Привет, спасибо, числа 1-10' },
                  { level: 'A2' as CEFRLevel, icon: '🧒', examples: 'Простые вопросы, семья, еда' },
                  { level: 'B1' as CEFRLevel, icon: '👨', examples: 'Путешествия, работа, хобби' },
                  { level: 'B2' as CEFRLevel, icon: '👨‍🎓', examples: 'Комплексные темы, дискуссии' },
                  { level: 'C1' as CEFRLevel, icon: '👨‍🏫', examples: 'Академический язык, нюансы' },
                  { level: 'C2' as CEFRLevel, icon: '👨‍🎓', examples: 'Свободное владение, как носитель' }
                ]).map(({ level, icon, examples }) => (
                  <div key={level} className="relative">
                    <div className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedLevel === level
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-border hover:border-primary/50 hover:shadow-md'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={level} id={level} className="mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{icon}</span>
                            <Label htmlFor={level} className="font-semibold cursor-pointer text-base">
                              {getCEFRLevelName(level)}
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                            {getCEFRLevelDescription(level)}
                          </p>
                          <div className="bg-muted/50 rounded-md p-3">
                            <p className="text-xs text-muted-foreground mb-1">Примеры тем:</p>
                            <p className="text-sm font-medium break-words">{examples}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <Button
                onClick={() => selectedLevel && handleLevelSelection(selectedLevel)}
                disabled={!selectedLevel}
                className="w-full"
                size="lg"
              >
                Продолжить
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'goal_setting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        {/* Header */}
        <Header />

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="mx-4">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-2">
                🎯 Определите свои цели
              </CardTitle>
              <CardDescription className="text-lg">
                Ваши цели помогут создать персональную программу обучения
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal" className="text-base font-medium">
                    Расскажите о ваших целях изучения языка
                  </Label>
                  <Textarea
                    id="goal"
                    placeholder="Например: Для работы в международной компании, путешествий по миру, общения с друзьями из разных стран, подготовки к экзаменам IELTS/TOEFL, чтения литературы в оригинале..."
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    className="min-h-[120px] resize-none text-base leading-relaxed"
                  />
                </div>

                {/* Goal Suggestions */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    💡 Популярные цели обучения:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      '💼 Для работы и карьеры',
                      '✈️ Для путешествий',
                      '👥 Для общения с друзьями',
                      '📚 Для чтения литературы',
                      '🎓 Для сдачи экзаменов',
                      '🎬 Для просмотра фильмов',
                      '💻 Для IT и технологий',
                      '🏥 Для медицины',
                      '⚖️ Для юриспруденции',
                      '🎨 Для творчества и искусства'
                    ].map((goal, index) => (
                      <button
                        key={index}
                        onClick={() => setLearningGoal(goal.replace(/^[^\s]+\s/, ''))}
                        className="text-left p-2 text-sm bg-white/60 hover:bg-white rounded border border-blue-100 hover:border-blue-300 transition-colors"
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Motivation Quote */}
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium italic">
                    "Цели - это мечты со сроками исполнения"
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    — Наполеон Хилл
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleGoalSetting('Для работы и карьеры')}
                  className="h-auto p-4 text-left justify-start"
                >
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-words">Для работы</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleGoalSetting('Для путешествий и туризма')}
                  className="h-auto p-4 text-left justify-start"
                >
                  <Target className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-words">Путешествия</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleGoalSetting('Для общения и дружбы')}
                  className="h-auto p-4 text-left justify-start"
                >
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-words">Общение</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleGoalSetting('Для сдачи экзаменов')}
                  className="h-auto p-4 text-left justify-start"
                >
                  <Trophy className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-words">Экзамены</span>
                </Button>
              </div>

              <Button
                onClick={() => learningGoal && handleGoalSetting(learningGoal)}
                disabled={!learningGoal.trim()}
                className="w-full"
                size="lg"
              >
                Начать тестирование
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                AI создает персональный тест...
              </h2>

              {/* Thinking Process Visualization */}
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="animate-pulse">Анализирую уровень {selectedLevel}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="animate-pulse" style={{ animationDelay: '1s' }}>Учитываю вашу цель: {learningGoal}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  <span className="animate-pulse" style={{ animationDelay: '2s' }}>Создаю подходящие вопросы</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
                  <span className="animate-pulse" style={{ animationDelay: '3s' }}>Готовлю точную оценку</span>
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
                Создание персонального теста для уровня {selectedLevel}...
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


  // Only render testing UI if we have questions and are in testing step
  if (currentStep === 'testing' && questions.length > 0) {
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    if (!currentQuestion) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 mx-auto text-primary animate-pulse mb-4" />
              <h2 className="text-xl font-bold mb-2">Загрузка вопроса...</h2>
              <p className="text-muted-foreground">Подождите, пожалуйста</p>
            </CardContent>
          </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Left side - Back button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                onClick={() => {
                  if (currentStep === 'testing') {
                    setCurrentStep('goal_setting');
                  } else {
                    navigate('/courses');
                  }
                }}
                className="flex items-center gap-2 px-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Назад</span>
              </Button>
            </div>

            {/* Center - Progress Steps (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-4">
              {assessmentSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep === step.id
                      ? 'bg-primary text-white'
                      : assessmentSteps.findIndex(s => s.id === currentStep) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  {index < assessmentSteps.length - 1 && (
                    <div className={`w-8 h-0.5 ${
                      assessmentSteps.findIndex(s => s.id === currentStep) > index
                        ? 'bg-green-500'
                        : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Right side - Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-sm sm:text-lg font-semibold hidden sm:block">Тест знаний</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress */}
        <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-muted-foreground">
                </span>
                <Badge className={`${getDifficultyColor(currentQuestion.difficulty)} flex items-center gap-1 w-fit`}>
                  {getDifficultyIcon(currentQuestion.difficulty)}
                  {getDifficultyText(currentQuestion.difficulty)}
                </Badge>
              </div>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative mb-2">
              <Progress value={progress} className="h-3" />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Начало</span>
              <span className="text-primary font-medium text-center flex-1 px-2">
                {progress < 30 ? 'Хороший старт!' :
                 progress < 60 ? 'Отлично продвигаетесь!' :
                 progress < 90 ? 'Почти закончили!' :
                 'Финишная прямая!'}
              </span>
              <span>Конец</span>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
              <span>Правильных: {score}</span>
              <span>Осталось: {questions.length - currentQuestionIndex - 1}</span>
            </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Выберите один правильный ответ:
                </p>
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  onClick={() => handleAnswerSelect(index)}
                    className={`h-auto p-4 text-left justify-start transition-all duration-200 w-full whitespace-normal ${
                      selectedAnswer === index
                        ? 'ring-2 ring-primary shadow-lg bg-primary text-primary-foreground'
                        : 'hover:shadow-md hover:border-primary/50 hover:bg-primary/5'
                    } ${
                      showExplanation && index === currentQuestion.correctAnswer
                        ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                        : showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer
                        ? 'bg-red-500 hover:bg-red-500 text-white border-red-500'
                        : ''
                    }`}
                  disabled={showExplanation}
                >
                    <div className="flex items-start gap-4 w-full">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        selectedAnswer === index
                          ? 'bg-white/20 text-white'
                          : showExplanation && index === currentQuestion.correctAnswer
                          ? 'bg-white text-green-600'
                          : showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer
                          ? 'bg-white text-red-600'
                          : 'bg-primary/10 text-primary border-2 border-primary/20'
                      }`}>
                        {showExplanation && selectedAnswer === index && index === currentQuestion.correctAnswer ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <div className="flex-1 text-left leading-relaxed">
                        {option}
                      </div>
                      {showExplanation && index === currentQuestion.correctAnswer && (
                        <div className="flex-shrink-0 ml-2">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                        <div className="flex-shrink-0 ml-2">
                          <XCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {/* Enhanced Explanation */}
            {showExplanation && (
              <div className="mt-6 space-y-4">
                {/* User's Answer Feedback */}
                {selectedAnswer !== currentQuestion.correctAnswer && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800 mb-1">Ваш ответ не совсем правильный</p>
                        <p className="text-sm text-red-700">
                          Вы выбрали: <span className="font-semibold">{String.fromCharCode(65 + selectedAnswer!)}</span> - {currentQuestion.options[selectedAnswer!]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Correct Answer */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                      <p className="font-medium text-green-800 mb-1">
                        {selectedAnswer === currentQuestion.correctAnswer ? 'Отлично! Правильный ответ:' : 'Правильный ответ:'}
                      </p>
                      <p className="text-sm text-green-700 mb-2">
                        <span className="font-semibold">{String.fromCharCode(65 + currentQuestion.correctAnswer)}</span> - {currentQuestion.options[currentQuestion.correctAnswer]}
                      </p>
                      <div className="bg-white/50 p-3 rounded border-l-4 border-green-400">
                        <p className="text-sm text-green-800 leading-relaxed">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Tip */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">💡</span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800 mb-1">Полезный совет</p>
                      <p className="text-sm text-blue-700">
                        {currentQuestion.difficulty === 'easy'
                          ? 'Это был простой вопрос. Продолжайте в том же духе!'
                          : currentQuestion.difficulty === 'medium'
                          ? 'Хорошая работа над средним уровнем сложности!'
                          : 'Отличная попытка с сложным вопросом. Вы на правильном пути!'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <Button
            variant="outline"
            onClick={handleShowExplanation}
            disabled={selectedAnswer === null || showExplanation}
            className="w-full sm:w-auto"
          >
            Показать объяснение
          </Button>

          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="w-full sm:w-auto sm:min-w-[120px]"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Завершить' : 'Далее'}
          </Button>
        </div>
      </main>
    </div>
    );
  }

  // Fallback for any unexpected state
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <Brain className="w-16 h-16 mx-auto text-primary animate-pulse mb-4" />
          <h2 className="text-xl font-bold mb-2">Загрузка...</h2>
          <p className="text-muted-foreground">Подготовка тестирования</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Assessment;
