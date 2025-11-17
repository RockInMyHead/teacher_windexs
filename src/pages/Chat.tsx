declare global {
  interface Window {
    _assessmentResolver?: ((answer: string) => void) | null;
  }
}

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, Send, User, MessageCircle, Volume2, VolumeX, CheckCircle, X, BookOpen, Target, ArrowLeft, Phone } from 'lucide-react';
import { OpenAITTS, isTTSAvailable } from '@/lib/openaiTTS';
import { COURSE_TEST_QUESTIONS, TestQuestion, COURSE_PLANS } from '@/utils/coursePlans';
import { AssessmentResults } from '@/components/AssessmentResults';
import { createPersonalizedCourseData } from '@/utils/assessmentAnalyzer';
import { ChatContainer } from '@/components/Chat';
import { VoiceTeacherChat } from '@/components/VoiceTeacherChat';
import LessonDisplay from '@/components/LessonDisplay';
// Stub for lesson context manager
interface LessonBlock {
  id: number;
  title: string;
  content: string;
  type: string;
}

interface LessonContext {
  currentTopic?: string;
}

class LessonContextManager {
  getCurrentContext() {
    return null;
  }
  getSystemPrompt() {
    return '';
  }
  startLesson(data: any) {
    // stub
  }
  updateCurrentBlock(block: LessonBlock, blockIndex?: number, totalBlocks?: number) {
    // stub
  }
  endLesson() {
    // stub
  }
}
import { Header } from '@/components/Header';





interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  ttsPlayed?: boolean;
}

interface IntroTestQuestion {
  question: string;
  options: string[];
}

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const chatContainerRef = useRef<any>(null);
  const isNavigatingRef = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'error'>('checking');
  const [ttsInterrupted, setTtsInterrupted] = useState(false);
  const [currentSentence, setCurrentSentence] = useState<number>(0);
  const [totalSentences, setTotalSentences] = useState<number>(0);
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false);

  // Assessment testing states
  const [isAssessmentMode, setIsAssessmentMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [assessmentQuestions, setAssessmentQuestions] = useState<TestQuestion[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<{question: string, userAnswer: string, correctAnswer: string, isCorrect: boolean}[]>([]);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [personalizedCourseData, setPersonalizedCourseData] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isLessonMode, setIsLessonMode] = useState(false);

  // Lesson plan and interactive lesson states
  const [lessonPlan, setLessonPlan] = useState<any>(null);
  const [currentLessonStep, setCurrentLessonStep] = useState(0);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationError, setGenerationError] = useState<string>('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [lessonStarted, setLessonStarted] = useState(false);

  // Lesson sections for interactive learning
  const [currentLessonSections, setCurrentLessonSections] = useState<any[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentSectionTask, setCurrentSectionTask] = useState<any>(null);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [thinkingDots, setThinkingDots] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Auto-scroll to video call when it opens
  useEffect(() => {
    if (showVideoCall) {
      setTimeout(() => {
        const videoCallElement = document.querySelector('[data-video-call]');
        if (videoCallElement) {
          videoCallElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [showVideoCall]);
  const ttsContinueRef = useRef<boolean>(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const interruptionCheckIntervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // Effect for thinking dots animation
  useEffect(() => {
    if (isGeneratingPlan) {
      const interval = setInterval(() => {
        setThinkingDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    } else {
      setThinkingDots('');
    }
  }, [isGeneratingPlan]);

  // Audio feedback functions
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playBeep = async (frequency: number = 800, duration: number = 200, type: OscillatorType = 'sine') => {
    try {
      const audioContext = initAudioContext();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Could not play audio feedback:', error);
    }
  };

  const startContinuousSound = (frequency: number = 600, interval: number = 800) => {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
    }

    soundIntervalRef.current = setInterval(() => {
      playBeep(frequency, 100, 'sine');
    }, interval);
  };


  const stopContinuousSound = () => {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
  };

  // Clear all interruption check intervals
  const clearAllInterruptionChecks = () => {
    interruptionCheckIntervalsRef.current.forEach(interval => {
      clearInterval(interval);
    });
    interruptionCheckIntervalsRef.current.clear();
  };


  // Auto TTS for new messages when enabled
  useEffect(() => {
    if (isTtsEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only auto-speak assistant messages, not user messages, and only if not already speaking
      if (lastMessage.role === 'assistant' && !lastMessage.ttsPlayed && !OpenAITTS.isPlaying()) {
        // Mark as played to avoid re-playing
        lastMessage.ttsPlayed = true;
        speakTextBySentences(lastMessage.content, lastMessage.id); // Use sentence-by-sentence speaking
      }
    }
  }, [messages, isTtsEnabled]);


  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      // Stop TTS
      OpenAITTS.stop();
    };
  }, []);

  // Initialize lesson mode and load data
  useEffect(() => {
    const mode = searchParams.get('mode');
    const isLessonModeParam = mode === 'lesson';
    setIsLessonMode(isLessonModeParam);

    // Load current lesson data from localStorage
    if (isLessonModeParam) {
      const storedLesson = localStorage.getItem('currentLesson');
      const storedCourseInfo = localStorage.getItem('courseInfo');

      if (storedLesson) {
        try {
          const lessonData = JSON.parse(storedLesson);
          setCurrentLesson(lessonData);
          console.log('Loaded lesson data for lesson mode:', lessonData);
        } catch (error) {
          console.error('Failed to parse lesson data:', error);
        }
      }

      if (storedCourseInfo) {
        try {
          const courseInfo = JSON.parse(storedCourseInfo);
          // Create minimal personalizedCourseData structure for lesson mode
          setPersonalizedCourseData({
            courseInfo: courseInfo,
            lessons: [JSON.parse(storedLesson || '{}')]
          });
        } catch (error) {
          console.error('Failed to parse course info:', error);
        }
      }
    }

    // For regular chat mode (not lesson mode), don't load course context
    if (!isLessonModeParam) {
      console.log('Regular chat mode - not loading course context for universal teacher');
      // Clear any existing lesson context
      setCurrentLesson(null);
      setPersonalizedCourseData(null);
    }
  }, [searchParams]);

  // Generate lesson plan using AI
  const generateLessonPlan = async () => {
    console.log('🎯 generateLessonPlan called');
    console.log('Current lesson:', currentLesson);

    if (!currentLesson) {
      console.error('❌ No current lesson found!');
      return;
    }

    setIsGeneratingPlan(true);
    setGenerationStep('Анализирую тему урока...');

    // Simulate thinking steps with delays
    setTimeout(() => setGenerationStep('Изучаю тему и учебный материал...'), 600);
    setTimeout(() => setGenerationStep('Анализирую уровень сложности и возраст ученика...'), 1200);
    setTimeout(() => setGenerationStep('Определяю учебные цели и задачи...'), 1800);
    setTimeout(() => setGenerationStep('Структурирую содержание урока...'), 2400);
    setTimeout(() => setGenerationStep('Создаю практические задания и упражнения...'), 3000);
    setTimeout(() => setGenerationStep('Формирую итоговый план обучения...'), 3600);

    try {
      const prompt = `Создай урок для ученика по теме: "${currentLesson.title}" (${currentLesson.topic}).

Тема урока: ${currentLesson.aspects || currentLesson.description}

Создай урок в формате JSON со следующей структурой:
{
  "title": "Название урока",
  "objective": "Цель урока (1-2 предложения)",
  "duration": "Продолжительность урока в минутах",
  "materials": ["список необходимых материалов"],
  "content": "Полный конспект урока для ученика с объяснениями, примерами и упражнениями",
  "practice": [
    {
      "type": "exercise|question|task",
      "description": "Описание упражнения или задания",
      "example": "Пример выполнения"
    }
  ],
  "assessment": "Вопросы для проверки понимания или тест"
}

Урок должен быть написан для ученика, а не для учителя. Включи полные объяснения, примеры и практические задания.`;

      setGenerationStep('🚀 Отправляю запрос к ИИ...');
      console.log('📤 Sending API request for lesson plan...');
      console.log('Prompt length:', prompt.length);

      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5.1',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      setGenerationStep('📥 Обрабатываю ответ от ИИ...');

      console.log('📥 API response status:', response.status);

      if (!response.ok) {
        // Handle specific API key error
        if (response.status === 500) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.message && errorData.message.includes('OpenAI API key not properly configured')) {
            throw new Error('OpenAI API ключ не настроен. Пожалуйста, настройте правильный API ключ в файле .env');
          }
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 API response data:', data);

      const planText = data.choices[0].message.content;
      console.log('📝 Plan text from AI:', planText);

      // Parse JSON from response
      const jsonMatch = planText.match(/```json\s*([\s\S]*?)\s*```/) || planText.match(/\{[\s\S]*\}/);
      const planJson = jsonMatch ? jsonMatch[1] || jsonMatch[0] : planText;
      console.log('🔧 Extracted JSON:', planJson);

      try {
        const plan = JSON.parse(planJson);
        console.log('✅ Successfully parsed lesson plan:', plan);

        // Convert new format to steps-based format for compatibility
        const steps = [];

        // Main content step
        if (plan.content) {
          steps.push({
            step: 1,
            type: "content",
            title: "Основной материал",
            description: plan.content,
            duration: Math.floor(parseInt(plan.duration) * 0.6) || 30,
            content: plan.content
          });
        }

        // Practice steps
        if (plan.practice && plan.practice.length > 0) {
          plan.practice.forEach((practice: any, index: number) => {
            steps.push({
              step: steps.length + 1,
              type: "practice",
              title: `Практика ${index + 1}: ${practice.type}`,
              description: practice.description,
              duration: Math.floor(parseInt(plan.duration) * 0.2 / plan.practice.length) || 5,
              content: `${practice.description}\n\nПример: ${practice.example}`
            });
          });
        }

        // Assessment step
        if (plan.assessment) {
          steps.push({
            step: steps.length + 1,
            type: "assessment",
            title: "Проверка знаний",
            description: plan.assessment,
            duration: Math.floor(parseInt(plan.duration) * 0.2) || 10,
            content: plan.assessment
          });
        }

        // Validate we have at least one step
        if (steps.length === 0) {
          console.warn('⚠️ No steps generated, using fallback plan');
          throw new Error('No steps could be generated from lesson plan');
        }

        // Validate steps array
        console.log('✅ Steps array created:', {
          length: steps.length,
          steps: steps.map(s => ({ step: s.step, type: s.type, title: s.title }))
        });

        if (!Array.isArray(steps) || steps.length === 0) {
          throw new Error('Invalid steps array or no steps generated');
        }

        // Create compatible plan structure
        const compatiblePlan = {
          ...plan,
          steps: steps
        };

        console.log('🔄 Converted to compatible format with', steps.length, 'steps');
        
        // Verify steps are accessible
        if (!compatiblePlan.steps || !Array.isArray(compatiblePlan.steps)) {
          throw new Error('Steps array is missing or not an array in compatible plan');
        }

        console.log('📊 Total steps in plan:', compatiblePlan.steps.length);
        console.log('🔍 First step details:', {
          exists: !!compatiblePlan.steps[0],
          title: compatiblePlan.steps[0]?.title,
          type: compatiblePlan.steps[0]?.type
        });

        setGenerationStep('✨ Завершаю подготовку урока...');

        // Store plan in state
        console.log('💾 Setting lessonPlan in state...');
        setLessonPlan(compatiblePlan);

        // Auto-start lesson with first step
        console.log('🚀 Auto-starting lesson...');
        setLessonStarted(true);
        setCurrentLessonStep(0);

        // Generate content for first step
        const firstStep = compatiblePlan.steps[0];
        console.log('📝 First step object:', firstStep);
        
        if (!firstStep) {
          throw new Error('First step is not defined or is null');
        }

        console.log('📝 Generating content for first step:', firstStep.title);
        await generateStepContent(0, firstStep, compatiblePlan);
      } catch (parseError) {
        console.error('❌ Failed to parse lesson plan JSON:', parseError);
        console.error('Raw plan text:', planText);
        
        // Fallback: create basic plan
        const basicPlan = {
          title: currentLesson.title,
          objective: `Изучить тему: ${currentLesson.topic}`,
          duration: 45,
          materials: ["Текстовый материал", "Упражнения"],
          steps: [
            {
              step: 1,
              type: "introduction",
              title: "Введение в тему",
              description: "Знакомство с новой темой",
              duration: 10,
              content: currentLesson.aspects || currentLesson.description
            },
            {
              step: 2,
              type: "explanation",
              title: "Объяснение материала",
              description: "Подробное объяснение темы",
              duration: 20,
              content: "Основной учебный материал будет предоставлен интерактивно"
            },
            {
              step: 3,
              type: "practice",
              title: "Практика",
              description: "Закрепление изученного материала",
              duration: 10,
              content: "Практические задания"
            },
            {
              step: 4,
              type: "assessment",
              title: "Проверка понимания",
              description: "Тест на усвоение материала",
              duration: 5,
              content: "Вопросы для проверки"
            }
          ]
        };
        
        console.log('🔄 Using fallback plan with', basicPlan.steps.length, 'steps');
        setGenerationStep('✨ Завершаю подготовку урока...');
        setLessonPlan(basicPlan);
        setLessonStarted(true);
        setCurrentLessonStep(0);
        
        const firstStep = basicPlan.steps[0];
        if (firstStep) {
          console.log('📝 Generating content for fallback first step:', firstStep.title);
          await generateStepContent(0, firstStep, basicPlan);
        }
      }
      } catch (error) {
      console.error('Failed to generate lesson plan:', error);
      setGenerationError(error instanceof Error ? error.message : 'Неизвестная ошибка при генерации плана урока');
    } finally {
      setIsGeneratingPlan(false);
      setGenerationStep('');
    }
  };

  // Move to next lesson step
  const nextLessonStep = async () => {
    console.log('📚 Next lesson step called, current step:', currentLessonStep, 'total steps:', lessonPlan?.steps?.length);

    if (!lessonPlan || currentLessonStep >= lessonPlan.steps.length - 1) {
      // Lesson completed
      const completionMessage: Message = {
        id: `lesson-complete-${Date.now()}`,
        role: 'assistant',
        content: `🎉 **Урок завершен!**\n\nПоздравляю! Вы успешно прошли урок "${currentLesson?.title}".\n\n📊 **Результаты:**\n- Изучено: ${currentLesson?.topic}\n- Продолжительность: ${lessonPlan?.duration} минут\n- Шагов пройдено: ${lessonPlan?.steps?.length}\n\nХотите перейти к следующему уроку или повторить материал?`,
        timestamp: new Date(),
        ttsPlayed: false
      };
      setMessages(prev => [...prev, completionMessage]);
      return;
    }

    const nextStepIndex = currentLessonStep + 1;
    const nextStep = lessonPlan.steps[nextStepIndex];
    setCurrentLessonStep(nextStepIndex);

    // Reset section index for new lesson step
    setCurrentSectionIndex(0);

    await generateStepContent(nextStepIndex, nextStep, lessonPlan);
  };

  // Handle answer to lesson task
  const handleLessonTaskAnswer = async (answer: string) => {
    console.log('📝 Handling lesson task answer:', answer);

    // Add user answer to chat
    const userMessage: Message = {
      id: `user-answer-${Date.now()}`,
      role: 'user',
      content: answer,
      timestamp: new Date(),
      ttsPlayed: false
    };

    if (chatContainerRef.current?.addMessage) {
      chatContainerRef.current.addMessage(userMessage);
    } else {
      setMessages(prev => [...prev, userMessage]);
    }

    // Move to next section or complete lesson step
    const nextSectionIndex = currentSectionIndex + 1;
    if (nextSectionIndex < currentLessonSections.length) {
      // Show next section
      const nextSection = currentLessonSections[nextSectionIndex];
      let sectionContent = `🎓 **${nextSection.title}**\n\n${nextSection.content}`;

      // Add examples if they exist
      if (nextSection.examples && nextSection.examples.length > 0) {
        nextSection.examples.forEach((example, idx) => {
          sectionContent += `\n\n📝 Пример ${idx + 1}: ${example.example}\n`;
          if (example.explanation) {
            sectionContent += `💡 ${example.explanation}`;
          }
        });
      }

      // Add practice inside if it exists
      if (nextSection.practiceInside) {
        sectionContent += `\n\n💪 Практическое задание: ${nextSection.practiceInside.instruction}`;
        if (nextSection.practiceInside.hint) {
          sectionContent += `\n💡 Подсказка: ${nextSection.practiceInside.hint}`;
        }
      }

      // Add mistakes if they exist
      if (nextSection.mistakes && nextSection.mistakes.length > 0) {
        nextSection.mistakes.forEach((mistake) => {
          sectionContent += `\n\n⚠️ Ошибка: ${mistake.mistake}\n`;
          sectionContent += `💡 ${mistake.explanation}`;
        });
      }

      // Add tasks if they exist
      if (nextSection.tasks && nextSection.tasks.length > 0) {
        sectionContent += `\n\n📋 Практические упражнения:`;
        nextSection.tasks.forEach((task, idx) => {
          sectionContent += `\n\n${idx + 1}. ${task.task}`;
          if (task.hint) {
            sectionContent += `\n💡 Подсказка: ${task.hint}`;
          }
        });
      }

      // Add summary if it exists
      if (nextSection.summary) {
        sectionContent += `\n\n📌 Резюме: ${nextSection.summary}`;
      }

      const teacherMessage: Message = {
        id: `lesson-section-${nextSectionIndex}-${Date.now()}`,
        role: 'assistant',
        content: sectionContent,
        timestamp: new Date(),
        ttsPlayed: false
      };

      if (chatContainerRef.current?.addMessage) {
        chatContainerRef.current.addMessage(teacherMessage);
      } else {
        setMessages(prev => [...prev, teacherMessage]);
      }

      // TTS for next section
      if (isTTSAvailable() && isTtsEnabled) {
        try {
          await OpenAITTS.speak(sectionContent, teacherMessage.id);
        } catch (ttsError) {
          console.error('TTS error:', ttsError);
        }
      }

      setCurrentSectionIndex(nextSectionIndex);
      // For now, use the first task if available
      const nextTask = nextSection.tasks && nextSection.tasks.length > 0 ? nextSection.tasks[0] : null;
      setCurrentSectionTask(nextTask);
      setWaitingForAnswer(!!nextTask);
    } else {
      // All sections completed - move to next lesson step
      setWaitingForAnswer(false);
      setCurrentSectionTask(null);
      await nextLessonStep();
    }
  };

  // Generate content for specific lesson step
  const generateStepContent = async (stepIndex: number, step: any, plan?: any) => {
    console.log('🎯 generateStepContent called with stepIndex:', stepIndex, 'step:', step);
    console.log('📋 Params: plan provided=', !!plan, 'lessonPlan in state=', !!lessonPlan, 'currentLesson=', !!currentLesson);

    const currentPlan = plan || lessonPlan;
    console.log('🔍 Using plan:', {
      planProvided: !!plan,
      usingProvidedPlan: !!plan,
      currentPlanExists: !!currentPlan,
      currentPlanHasSteps: !!currentPlan?.steps,
      stepsLength: currentPlan?.steps?.length
    });

    if (!currentPlan || !currentLesson) {
      console.error('❌ Missing lessonPlan or currentLesson:', {
        currentPlan: !!currentPlan,
        currentLesson: !!currentLesson,
        lessonPlan: !!lessonPlan
      });
      return;
    }

    // Debug logging for prompt variables
    console.log('🔧 Debug prompt variables:', {
      currentLessonTitle: currentLesson.title,
      currentLessonTopic: currentLesson.topic,
      stepDescription: step?.description,
      stepDuration: step?.duration,
      currentPlanObjective: currentPlan?.objective
    });

    setIsGeneratingContent(true);
    try {
      // Validate required variables
      if (!currentLesson?.title || !currentLesson?.topic || !step?.description || !step?.duration || !currentPlan?.objective) {
        console.error('❌ Missing required variables for prompt generation:', {
          title: currentLesson?.title,
          topic: currentLesson?.topic,
          description: step?.description,
          duration: step?.duration,
          objective: currentPlan?.objective
        });
        setIsGeneratingContent(false);
        return;
      }

      const prompt = `Создай ПОДРОБНЫЙ и РАЗВЕРНУТЫЙ урок для ученика по теме: "${currentLesson.title}" (${currentLesson.topic})

Описание: ${step.description}
Продолжительность: ${step.duration} минут
Уровень: ${currentPlan.objective}

СТРУКТУРА УРОКА (обязательно следи!):
1. ОПРЕДЕЛЕНИЕ И ОСНОВЫ (большой блок с подробным объяснением, 3-5 абзацев)
2. ПРИМЕРЫ (5-7 конкретных примеров с подробным разбором каждого)
3. ПРАКТИЧЕСКИЙ ПРИМЕР В УРОКЕ (1 интерактивное задание внутри теории)
4. ТИПИЧНЫЕ ОШИБКИ (2-3 частых ошибки с объяснением)
5. ПРАКТИЧЕСКИЕ УПРАЖНЕНИЯ (3-4 задания для закрепления)
6. РЕЗЮМЕ (краткое повторение ключевых моментов)

Формат ответа ТОЛЬКО JSON:
{
  "sections": [
    {
      "title": "Определение и основы",
      "content": "БОЛЬШОЙ блок текста (5-10 предложений минимум). Подробное объяснение что это такое, зачем это нужно, как это работает. Объясни все доступным языком, разжевывая каждую мелочь.",
      "examples": [
        {"example": "Пример 1", "explanation": "Подробное объяснение этого примера"},
        {"example": "Пример 2", "explanation": "Подробное объяснение этого примера"}
      ],
      "practiceInside": {
        "type": "exercise",
        "instruction": "Что нужно сделать (для закрепления в процессе урока)",
        "hint": "Подсказка"
      }
    },
    {
      "title": "Типичные ошибки",
      "content": "Подробное объяснение ошибок (2-3 абзаца)",
      "mistakes": [
        {"mistake": "Ошибка 1", "explanation": "Почему это ошибка и как правильно"},
        {"mistake": "Ошибка 2", "explanation": "Почему это ошибка и как правильно"}
      ]
    },
    {
      "title": "Практика и закрепление",
      "tasks": [
        {"type": "exercise", "task": "Задание 1", "hint": "Подсказка"},
        {"type": "test", "question": "Вопрос", "options": ["A", "B", "C", "D"]}
      ]
    },
    {
      "title": "Резюме",
      "summary": "Краткое резюме всего урока (5-7 предложений). Повтори самые важные моменты."
    }
  ]
}

ТРЕБОВАНИЯ К КОНТЕНТУ:
- Подробность и ясность выше всего!
- Каждый пример должен быть разобран детально
- Объясни не только ЧТО, но и ПОЧЕМУ
- Используй аналогии, сравнения
- Напиши так, чтобы ученик ПОНЯЛ материал полностью`;

      console.log('📝 Generated prompt:', prompt.substring(0, 200) + '...');

      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5.1',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 4000
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API response error:', data);
        throw new Error(`API Error: ${response.status} - ${data.message || 'Unknown error'}`);
      }

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Invalid API response structure:', data);
        throw new Error('Invalid API response structure');
      }

      const rawContent = data.choices[0].message.content;
      console.log('📥 Raw AI response:', rawContent);

      // Parse JSON response with sections
      let lessonSections;
      try {
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          lessonSections = JSON.parse(jsonMatch[0]);
          console.log('✅ Parsed lesson sections:', lessonSections);
          
          // Validate structure
          if (!lessonSections.sections || !Array.isArray(lessonSections.sections)) {
            throw new Error('Invalid structure: missing sections array');
          }
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.warn('❌ Failed to parse JSON response, using fallback format:', parseError);
        // Fallback: create comprehensive section from raw text
        lessonSections = {
          sections: [{
            title: "Теоретический материал",
            content: rawContent,
            examples: [],
            tasks: [{
              type: "question",
              question: "Расскажи, что ты узнал(а) из этого урока?"
            }]
          }]
        };
      }

      // Store sections for interactive display
      setCurrentLessonSections(lessonSections.sections);
      setCurrentSectionIndex(0);

      // Start with first section
      if (lessonSections.sections && lessonSections.sections.length > 0) {
        const firstSection = lessonSections.sections[0];
        let sectionContent = `🎓 **${firstSection.title}**\n\n${firstSection.content}`;

        // Add examples if they exist
        if (firstSection.examples && firstSection.examples.length > 0) {
          firstSection.examples.forEach((example, idx) => {
            sectionContent += `\n\n📝 Пример ${idx + 1}: ${example.example}\n`;
            if (example.explanation) {
              sectionContent += `💡 ${example.explanation}`;
            }
          });
        }

        // Add practice inside if it exists
        if (firstSection.practiceInside) {
          sectionContent += `\n\n💪 Практическое задание: ${firstSection.practiceInside.instruction}`;
          if (firstSection.practiceInside.hint) {
            sectionContent += `\n💡 Подсказка: ${firstSection.practiceInside.hint}`;
          }
        }

        // Add mistakes if they exist
        if (firstSection.mistakes && firstSection.mistakes.length > 0) {
          firstSection.mistakes.forEach((mistake) => {
            sectionContent += `\n\n⚠️ Ошибка: ${mistake.mistake}\n`;
            sectionContent += `💡 ${mistake.explanation}`;
          });
        }

        // Add tasks if they exist
        if (firstSection.tasks && firstSection.tasks.length > 0) {
          sectionContent += `\n\n📋 Практические упражнения:`;
          firstSection.tasks.forEach((task, idx) => {
            sectionContent += `\n\n${idx + 1}. ${task.task}`;
            if (task.hint) {
              sectionContent += `\n💡 Подсказка: ${task.hint}`;
            }
          });
        }

        // Add summary if it exists
        if (firstSection.summary) {
          sectionContent += `\n\n📌 Резюме: ${firstSection.summary}`;
        }

        setLessonContent(sectionContent);

        // Add first section to chat
        const teacherMessage: Message = {
          id: `lesson-section-0-${Date.now()}`,
          role: 'assistant',
          content: sectionContent,
          timestamp: new Date(),
          ttsPlayed: false
        };

        console.log('💬 Adding first section to chat');

        // Add message through ChatContainer ref if available, otherwise use state
        if (chatContainerRef.current?.addMessage) {
          chatContainerRef.current.addMessage(teacherMessage);
        } else {
          setMessages(prev => [...prev, teacherMessage]);
        }

        // Add TTS for the first section
        if (isTTSAvailable() && isTtsEnabled) {
          console.log('🔊 Playing TTS for first section...');
          try {
            await OpenAITTS.speak(sectionContent, teacherMessage.id);
          } catch (ttsError) {
            console.error('TTS error:', ttsError);
          }
        }

        // Show task for first section
        if (firstSection.task) {
          setCurrentSectionTask(firstSection.task);
          setWaitingForAnswer(true);
        }
      }
    } catch (error) {
      console.error('Failed to generate step content:', error);

      // Show user-friendly error message
      const errorMessage = error instanceof Error && error.message.includes('API key')
        ? 'Не удалось сгенерировать контент урока: OpenAI API ключ не настроен. Обратитесь к администратору.'
        : 'Не удалось сгенерировать контент урока. Используем резервный контент.';

      // Fallback content
      const fallbackContent = `Привет! Мы начинаем изучение темы "${currentLesson.title}". ${step.description}`;
      setLessonContent(fallbackContent);

      // Show error message to user
      alert(errorMessage);

      const teacherMessage: Message = {
        id: `lesson-step-${stepIndex}-${Date.now()}`,
        role: 'assistant',
        content: `🎓 **Шаг ${step.step}: ${step.title}**\n\n${fallbackContent}`,
        timestamp: new Date(),
        ttsPlayed: false
      };

      setMessages(prev => [...prev, teacherMessage]);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Move to next lesson step
  // Handle next section within current lesson step
  const nextSection = async () => {
    console.log('📍 Next section called, current:', currentSectionIndex, 'total sections:', currentLessonSections.length);

    // Prevent double-click and concurrent navigation
    if (isGeneratingContent || isNavigatingRef.current) {
      console.log('⚠️ Already navigating or generating, ignoring click');
      return;
    }

    // Set navigation flag
    isNavigatingRef.current = true;

    try {
      // Check if we have more sections in current lesson step
      if (currentSectionIndex < currentLessonSections.length - 1) {
      // Move to next section within current step
      const nextSectionIndex = currentSectionIndex + 1;
      const nextSectionData = currentLessonSections[nextSectionIndex];

      console.log('🔄 Moving to next section:', nextSectionIndex, nextSectionData.title);

      let sectionContent = `🎓 **${nextSectionData.title}**\n\n${nextSectionData.content}`;

      // Add examples if they exist
      if (nextSectionData.examples && nextSectionData.examples.length > 0) {
        nextSectionData.examples.forEach((example, idx) => {
          sectionContent += `\n\n📝 Пример ${idx + 1}: ${example.example}\n`;
          if (example.explanation) {
            sectionContent += `💡 ${example.explanation}`;
          }
        });
      }

      // Add practice inside if it exists
      if (nextSectionData.practiceInside) {
        sectionContent += `\n\n💪 Практическое задание: ${nextSectionData.practiceInside.instruction}`;
        if (nextSectionData.practiceInside.hint) {
          sectionContent += `\n💡 Подсказка: ${nextSectionData.practiceInside.hint}`;
        }
      }

      // Add mistakes if they exist
      if (nextSectionData.mistakes && nextSectionData.mistakes.length > 0) {
        nextSectionData.mistakes.forEach((mistake) => {
          sectionContent += `\n\n⚠️ Ошибка: ${mistake.mistake}\n`;
          sectionContent += `💡 ${mistake.explanation}`;
        });
      }

      // Add tasks if they exist
      if (nextSectionData.tasks && nextSectionData.tasks.length > 0) {
        sectionContent += `\n\n📋 Практические упражнения:`;
        nextSectionData.tasks.forEach((task, idx) => {
          sectionContent += `\n\n${idx + 1}. ${task.task}`;
          if (task.hint) {
            sectionContent += `\n💡 Подсказка: ${task.hint}`;
          }
        });
      }

      // Add summary if it exists
      if (nextSectionData.summary) {
        sectionContent += `\n\n📌 Резюме: ${nextSectionData.summary}`;
      }

      const teacherMessage: Message = {
        id: `lesson-section-${nextSectionIndex}-${Date.now()}`,
        role: 'assistant',
        content: sectionContent,
        timestamp: new Date(),
        ttsPlayed: false
      };

      if (chatContainerRef.current?.addMessage) {
        chatContainerRef.current.addMessage(teacherMessage);
      } else {
        setMessages(prev => [...prev, teacherMessage]);
      }

      // TTS for next section
      if (isTTSAvailable() && isTtsEnabled) {
        try {
          await OpenAITTS.speak(sectionContent, teacherMessage.id);
        } catch (ttsError) {
          console.error('TTS error:', ttsError);
        }
      }

      setCurrentSectionIndex(nextSectionIndex);
      setLessonContent(sectionContent);

      // Set next task if available
      const nextTask = nextSectionData.tasks && nextSectionData.tasks.length > 0 ? nextSectionData.tasks[0] : null;
      setCurrentSectionTask(nextTask);
      setWaitingForAnswer(!!nextTask);
      } else {
        // All sections completed - move to next lesson step
        await nextLessonStep();
      }
    } finally {
      // Reset navigation flag
      isNavigatingRef.current = false;
    }
  };

  // Generate teacher system prompt based on course and lesson
  const getTeacherSystemPrompt = () => {
    let prompt = `Ты - опытный учитель английского языка. `;

    // Special prompt for interactive lesson mode
    if (isLessonMode && lessonPlan) {
      prompt = `Ты - интерактивный учитель, проводящий урок по теме "${currentLesson?.title}".

Ты должен создавать урок непосредственно для ученика, а не план для учителя.
Представляй материал ученику, задавай вопросы, проверяй понимание.

Текущий шаг урока: ${lessonPlan.steps[currentLessonStep]?.title || 'Введение'}
Тип шага: ${lessonPlan.steps[currentLessonStep]?.type || 'introduction'}

Твоя задача:
1. Проводить урок шаг за шагом
2. Объяснять материал ясно и доступно
3. Задавать вопросы для проверки понимания
4. Исправлять ошибки и объяснять правила
5. Делать урок увлекательным и интерактивным
6. Переходить к следующему шагу только после подтверждения ученика

Отвечай на русском языке, но используй английские термины и примеры в обучении где это уместно.`;
      return prompt;
    }

    if (personalizedCourseData) {
      prompt += `Ученик проходит персонализированный курс "${personalizedCourseData.courseInfo?.title || 'Английский язык'}" для ${personalizedCourseData.courseInfo?.grade ? `${personalizedCourseData.courseInfo.grade} класса` : 'соответствующего уровня'}. `;

      if (personalizedCourseData.foundTopic) {
        prompt += `Последняя изученная тема: "${personalizedCourseData.foundTopic.title}" (${personalizedCourseData.foundTopic.topic}). `;
      } else if (personalizedCourseData.userDescription && personalizedCourseData.userDescription !== 'Не указано (пропущено)') {
        prompt += `Ученик описал свою подготовку: "${personalizedCourseData.userDescription}". `;
      }
    }

    if (currentLesson) {
      prompt += `Сейчас изучается урок: "${currentLesson.title}" (${currentLesson.topic}). `;
      prompt += `Тема урока: ${currentLesson.aspects}. `;
    }

    prompt += `
Правила общения:
- Будь дружелюбным, терпеливым и поддерживающим
- Объясняй сложные концепции простыми словами
- Используй примеры из реальной жизни
- Задавай вопросы, чтобы проверить понимание
- Корректируй ошибки мягко и объясняй почему
- Поощряй прогресс ученика
- Адаптируй сложность под уровень ученика
- Используй разнообразные методы обучения (диалоги, игры, упражнения)

Твой ответ должен быть на русском языке, но можешь использовать английские слова и фразы для обучения.`;

    return prompt;
  };

  // Function to split text into sentences
  const splitIntoSentences = (text: string): string[] => {
    // Split by sentence endings, but keep the punctuation
    const sentences = text.split(/(?<=[.!?])\s+/);
    return sentences.filter(sentence => sentence.trim().length > 0);
  };

  // Function to speak text sentence by sentence for faster TTS
  const speakTextBySentences = async (text: string, messageId: string) => {
    if (!isTTSAvailable()) {
      alert('OpenAI API ключ не настроен. Проверьте переменные окружения.');
      return;
    }

    ttsContinueRef.current = true; // Reset continuation flag

    try {
      // Stop any currently speaking
      OpenAITTS.stop();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }

      setSpeakingMessageId(messageId);
      setIsGeneratingTTS(true);

      // Split text into sentences
      const sentences = splitIntoSentences(text).filter(s => s.trim().length > 0);
      console.log('📝 Split into sentences:', sentences);

      if (sentences.length === 0) {
        setSpeakingMessageId(null);
        setIsGeneratingTTS(false);
        return;
      }

      // Set total sentences for UI
      setTotalSentences(sentences.length);
      setCurrentSentence(0);

      console.log('🚀 Starting parallel TTS generation for', sentences.length, 'sentences');

      // Start continuous TTS generation sound (same pattern as LLM)
      startContinuousSound(500, 1800);

      // Generate all audio buffers in parallel
      const generationPromises = sentences.map(async (sentence, index) => {
        try {
          console.log(`📤 Generating TTS for sentence ${index + 1}:`, sentence.substring(0, 50) + '...');
          const audioBuffer = await OpenAITTS.generateSpeech(sentence, {
            voice: 'alloy',
            speed: 0.9,
            model: 'tts-1'
          });
          console.log(`✅ TTS generated for sentence ${index + 1}`);
          return { audioBuffer, sentence, index };
        } catch (error) {
          console.error(`❌ Failed to generate TTS for sentence ${index + 1}:`, error);
          return { audioBuffer: null, sentence, index, error };
        }
      });

      // Wait for all generations to complete
      const audioResults = await Promise.allSettled(generationPromises);
      const successfulResults = audioResults
        .filter((result): result is PromiseFulfilledResult<{ audioBuffer: ArrayBuffer | null; sentence: string; index: number; error?: any }> =>
          result.status === 'fulfilled' && result.value.audioBuffer !== null
        )
        .map(result => result.value);

      console.log('🎉 All TTS generation completed');

      // Stop continuous TTS generation sound
      stopContinuousSound();

      // Helper function to play a sentence
      const playSentence = async (audioBuffer: ArrayBuffer, sentence: string, sentenceNumber: number, totalSentences: number): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
          // Check if TTS was interrupted before starting playback
          if (!ttsContinueRef.current) {
            console.log('🛑 TTS interrupted before playback');
            reject(new Error('TTS interrupted'));
            return;
          }

          setCurrentSentence(sentenceNumber);
          console.log(`🔊 Playing sentence ${sentenceNumber}/${totalSentences}:`, sentence.substring(0, 50) + '...');

          // Silent playback

          try {
            const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);

            const checkInterruption = () => {
                if (!ttsContinueRef.current) {
                  console.log('🛑 TTS interrupted during playback');
                  audio.pause();
                  URL.revokeObjectURL(audioUrl);
                  currentAudioRef.current = null;
                  reject(new Error('TTS interrupted'));
                }
            };

            // Check for interruption every 100ms
            const interruptionCheck = setInterval(checkInterruption, 100);
            // Register the interval for cleanup
            interruptionCheckIntervalsRef.current.add(interruptionCheck);

            audio.onended = () => {
                clearInterval(interruptionCheck);
                interruptionCheckIntervalsRef.current.delete(interruptionCheck);
                URL.revokeObjectURL(audioUrl);
                currentAudioRef.current = null;
                resolve();
            };

            audio.onerror = (error) => {
                clearInterval(interruptionCheck);
                interruptionCheckIntervalsRef.current.delete(interruptionCheck);
                URL.revokeObjectURL(audioUrl);
                currentAudioRef.current = null;
                reject(error);
            };

            // Store reference to current audio for interruption
            currentAudioRef.current = audio;

            audio.play().catch((error) => {
                clearInterval(interruptionCheck);
                interruptionCheckIntervalsRef.current.delete(interruptionCheck);
                URL.revokeObjectURL(audioUrl);
                currentAudioRef.current = null;
                reject(error);
            });
          } catch (playError) {
            console.error(`Error setting up audio for sentence ${sentenceNumber}:`, playError);
            reject(playError);
          }
        });
      };

      // Play sentences sequentially
      for (let i = 0; i < successfulResults.length; i++) {
        const result = successfulResults[i];

        // Check if TTS was interrupted before starting next sentence
        if (!ttsContinueRef.current) {
          console.log('🛑 TTS interrupted before playing sentence', i + 1);
          break;
        }

        try {
          await playSentence(result.audioBuffer!, result.sentence, i + 1, successfulResults.length);

          // Small pause between sentences (only if not interrupted)
          if (i < successfulResults.length - 1 && ttsContinueRef.current) {
            await new Promise<void>((resolve, reject) => {
                const pauseCheck = setInterval(() => {
                  if (!ttsContinueRef.current) {
                    clearInterval(pauseCheck);
                    interruptionCheckIntervalsRef.current.delete(pauseCheck);
                    reject(new Error('TTS interrupted during pause'));
                  }
                }, 50);

                // Register the pause check interval
                interruptionCheckIntervalsRef.current.add(pauseCheck);

                setTimeout(() => {
                  clearInterval(pauseCheck);
                  interruptionCheckIntervalsRef.current.delete(pauseCheck);
                  if (ttsContinueRef.current) {
                    resolve();
    } else {
                    reject(new Error('TTS interrupted during pause'));
                  }
                }, 150);
            });
          }
        } catch (playError) {
          if (playError.message === 'TTS interrupted') {
            console.log('🛑 TTS playback interrupted by user');
            break;
          }
          console.error(`Error playing sentence ${i + 1}:`, playError);
          // Continue with next sentence
        }
      }

      // Reset counters and state only if not interrupted
      if (ttsContinueRef.current) {
        setCurrentSentence(0);
        setTotalSentences(0);
        setIsGeneratingTTS(false);
        setSpeakingMessageId(null);
      }

    } catch (error) {
      console.error('Parallel TTS error:', error);
      alert('Ошибка при генерации речи. Попробуйте еще раз.');
      setSpeakingMessageId(null);
      setCurrentSentence(0);
      setTotalSentences(0);
      setIsGeneratingTTS(false);
    }
  };

  // Function to speak text using OpenAI TTS (legacy function)
  const speakText = async (text: string, messageId: string, showVisualFeedback: boolean = true) => {
    if (!isTTSAvailable()) {
      alert('OpenAI API ключ не настроен. Проверьте переменные окружения.');
      return;
    }

    try {
      // Stop any currently speaking
      OpenAITTS.stop();

      if (showVisualFeedback && speakingMessageId === messageId) {
        // If already speaking this message, stop it
        setSpeakingMessageId(null);
        return;
      }

      if (showVisualFeedback) {
        setSpeakingMessageId(messageId);
      }

      // Use sentence-by-sentence speaking for better performance
      await speakTextBySentences(text, messageId);

    } catch (error) {
      console.error('OpenAI TTS error:', error);
      alert('Ошибка при генерации речи. Попробуйте еще раз.');
      if (showVisualFeedback) {
        setSpeakingMessageId(null);
      }
    }
  };

  // Function to toggle TTS mode
  const toggleTts = () => {
    if (isTtsEnabled) {
      // Disable TTS
      setIsTtsEnabled(false);
      setSpeakingMessageId(null);
      OpenAITTS.stop();
    } else {
      // Enable TTS
      setIsTtsEnabled(true);
    }
  };

  // Function to start voice chat







  // Function to parse **bold green text** within a string
  const parseBoldGreenText = (text: string, keyPrefix: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // This is a **bold green text** block
        const greenText = part.slice(2, -2); // Remove ** from both sides
        return (
          <span key={`${keyPrefix}-green-${index}`} className="text-green-600 font-semibold">
            {greenText}
          </span>
        );
      }
      // Regular text
      return part;
    });
  };

  // Function to parse and format message content with ### blocks and **green text**
  const formatMessageContent = (content: string) => {
    // Split by lines to process each line individually
    const lines = content.split('\n');
    const result: JSX.Element[] = [];
    let currentBlock: string[] = [];

    lines.forEach((line, index) => {
      if (line.trim().startsWith('### ')) {
        // If we were in a regular block, close it first
        if (currentBlock.length > 0) {
          const blockText = currentBlock.join('\n');
          result.push(
            <span key={`text-${result.length}`} className="whitespace-pre-wrap">
                {parseBoldGreenText(blockText, `text-${result.length}`)}
            </span>
          );
          currentBlock = [];
        }

        // Start or continue a ### block
        const blockContent = line.trim().replace(/^### /, '');
        result.push(
          <div key={`block-${result.length}`} className="text-green-600 font-bold text-lg my-2 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-md border-l-4 border-green-500">
            {parseBoldGreenText(blockContent, `block-${result.length}`)}
          </div>
        );
      } else {
        // Regular line
        currentBlock.push(line);
      }
    });

    // Add any remaining regular text
    if (currentBlock.length > 0) {
      const blockText = currentBlock.join('\n');
      result.push(
        <span key={`text-${result.length}`} className="whitespace-pre-wrap">
          {parseBoldGreenText(blockText, `text-${result.length}`)}
        </span>
      );
    }

    return result.length > 0 ? result : [<span key="empty" className="whitespace-pre-wrap">{parseBoldGreenText(content, 'empty')}</span>];
  };

  // Assessment testing functions
  const handleAssessmentAnswer = (selectedAnswer: string) => {
    if (!assessmentQuestions[currentQuestionIndex]) return;

    const currentQuestion = assessmentQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Save result
    setAssessmentResults(prev => [...prev, {
      question: currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    }]);

    // Move to next question or complete assessment
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setAssessmentCompleted(true);
    }
  };

  const restartAssessment = () => {
    setCurrentQuestionIndex(0);
    setAssessmentResults([]);
    setAssessmentCompleted(false);
  };

  const getAssessmentScore = () => {
    const correctAnswers = assessmentResults.filter(result => result.isCorrect).length;
    return Math.round((correctAnswers / assessmentResults.length) * 100);
  };

  const handleAssessmentCompleted = () => {
    // Преобразовать результаты в формат для analyzerа
    const formattedAnswers = assessmentResults.map((result, index) => ({
      questionIndex: index,
      isCorrect: result.isCorrect,
      question: result.question
    }));

    // Создать персонализированный курс
    const courseData = createPersonalizedCourseData(
      formattedAnswers,
      assessmentQuestions,
      selectedCourseId || 0,
      selectedGrade || 1
    );

    setPersonalizedCourseData(courseData);
  };

  const shuffleOptions = (options: string[]): string[] => {
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };





  // Initialize assessment testing if grade parameter is present
  useEffect(() => {
    const gradeParam = searchParams.get('grade');
    const courseIdParam = searchParams.get('courseId');
    const startParam = searchParams.get('start');

    if (gradeParam && courseIdParam && startParam === 'true') {
      const grade = parseInt(gradeParam);
      const courseId = parseInt(courseIdParam);

      setSelectedGrade(grade);
      setSelectedCourseId(courseId);

      // Load questions for this grade
      if (COURSE_TEST_QUESTIONS[courseId] && COURSE_TEST_QUESTIONS[courseId][grade]) {
        setAssessmentQuestions(COURSE_TEST_QUESTIONS[courseId][grade]);
        setIsAssessmentMode(true);
        setCurrentQuestionIndex(0);
        setAssessmentResults([]);
        setAssessmentCompleted(false);
      } else {
        console.warn(`No questions found for course ${courseId}, grade ${grade}`);
      }
    }
  }, [searchParams]);

  // Check OpenAI API key on mount
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        console.warn('API key not configured');
        setApiKeyStatus('invalid');
        return;
      }

      // Проверяем доступность API через health endpoint сервера
      try {
        // Используем абортивный контроллер с таймаутом 3 сек
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${window.location.origin}/health`, {
          signal: controller.signal
        });
        clearTimeout(timeout);
        
        if (response.ok) {
          // Если сервер отвечает, считаем что API ключ настроен
          setApiKeyStatus('valid');
        } else {
          setApiKeyStatus('error');
        }
      } catch (error) {
        console.warn('API key check timeout or failed, continuing anyway:', error);
        // Не блокируем работу даже если API недоступен
        setApiKeyStatus('valid');
      }
    };

    checkApiKey();
  }, []);






  // Check if message contains audio task keywords

  // Check if message contains test question with options
  const checkForLearningPlan = (message: string): { isLearningPlan: boolean } => {
    // Check if message contains learning plan with "Готовы начать обучение?" question
    const hasPlan = message.includes('2-недельный план обучения:') || message.includes('📋 Темы:');
    const hasQuestion = message.includes('🚀 Готовы начать обучение?');

    return {
      isLearningPlan: hasPlan && hasQuestion
    };
  };



  // Handle test question answer selection




  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Stop any ongoing sounds when user sends a new message
    stopContinuousSound();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);


    // Создать базовый системный промпт для чата
    const systemPrompt = `Вы - профессиональный педагог и эксперт в образовании. Ваша задача - объяснять любые темы быстро, понятно и доступно. Вы можете "разжевывать" сложные концепции, приводить примеры из реальной жизни, использовать аналогии и пошаговые объяснения.

Особенности вашего стиля:
- Объясняйте сложное простыми словами
- Используйте примеры и аналогии
- Разбивайте информацию на логические блоки
- Задавайте наводящие вопросы для лучшего понимания
- Будьте терпеливы и поддерживающи
- Адаптируйте объяснения под уровень ученика
- Поощряйте самостоятельное мышление

КРИТИЧНО ВАЖНО: АКТИВНО ИСПОЛЬЗУЙТЕ ИСТОРИЮ БЕСЕДЫ!
- Всегда ссылайтесь на предыдущие сообщения
- Помните, что обсуждалось ранее
- Продолжайте логическую нить разговора
- Избегайте повторений уже объясненного
- Используйте фразы типа "как мы обсуждали ранее", "продолжая нашу тему", "на основе предыдущего объяснения"`;

    try {
      const response = await fetch(`${window.location.origin}/api/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5.1',
          messages: [
            {
                role: 'system',
                content: systemPrompt,
            },
            ...messages.slice(-29).map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: 'user',
                content: userMessage.content,
            },
          ],
          max_tokens: 8000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });

        // Handle specific error codes
        if (response.status === 401) {
          throw new Error('Неверный API ключ OpenAI. Проверьте настройки.');
        } else if (response.status === 429) {
          throw new Error('Превышен лимит запросов к OpenAI. Попробуйте позже.');
        } else if (response.status === 500) {
          throw new Error('Ошибка сервера OpenAI. Попробуйте еще раз.');
        } else {
          throw new Error(`Ошибка OpenAI: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid OpenAI response:', data);
        throw new Error('Некорректный ответ от OpenAI');
      }

      const aiContent = data.choices[0].message.content;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке вашего сообщения. Попробуйте еще раз.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Functions for lesson mode management





  // Assessment Mode UI
  if (isAssessmentMode) {
    const currentQuestion = assessmentQuestions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        {/* Header */}
        <Header />

        {/* Assessment Container */}
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {personalizedCourseData ? (
            <div className="space-y-6 animate-fade-in-up">
              <AssessmentResults 
                data={personalizedCourseData}
                onStartCourse={() => {
                  // Сохранить данные курса и перейти к обучению
                  localStorage.setItem('personalizedCourse', JSON.stringify(personalizedCourseData));
                  window.location.href = '/courses';
                }}
              />
            </div>
          ) : !assessmentCompleted ? (
            <div className="space-y-6">
              {/* Progress Section */}
              <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-blue-800">
                      Вопрос {currentQuestionIndex + 1} из {assessmentQuestions.length}
                    </span>
                    <span className="text-sm text-blue-600 font-semibold">
                      {Math.round(((currentQuestionIndex + 1) / assessmentQuestions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                      style={{ width: `${((currentQuestionIndex + 1) / assessmentQuestions.length) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Question Card */}
              <Card className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-blue-900 leading-tight">
                    {currentQuestion?.question}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-2">
                  <div className="space-y-3">
                    {currentQuestion?.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAssessmentAnswer(option)}
                        variant="outline"
                        className="w-full text-left justify-start h-14 text-base font-medium border-2 border-blue-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md transition-all duration-200 group"
                        size="lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border-2 border-blue-300 group-hover:border-blue-500 flex items-center justify-center text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="group-hover:text-blue-800 transition-colors">{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 text-center">
                      <span className="font-medium">💡 Совет:</span> Выберите вариант, который считаете наиболее правильным
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results Header */}
              <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg mb-4">
                      <span className="text-3xl">🎉</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-green-900 mb-2">
                      Тестирование завершено!
                    </CardTitle>
                  </div>

                  <div className="bg-white/70 rounded-2xl p-6 shadow-inner">
                    <div className="text-7xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text mb-3">
                      {getAssessmentScore()}%
                    </div>
                    <p className="text-green-700 font-medium text-lg">
                      {assessmentResults.filter(r => r.isCorrect).length} из {assessmentResults.length} правильных ответов
                    </p>
                    <div className="mt-4">
                      {getAssessmentScore() >= 80 ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          <span>🌟</span> Отличный результат!
                        </div>
                      ) : getAssessmentScore() >= 60 ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          <span>👍</span> Хороший результат
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                          <span>📚</span> Есть над чем работать
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleAssessmentCompleted}
                      className="mt-6 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-base"
                    >
                      📊 Посмотреть результаты и рекомендации
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Results */}
              <Card className="bg-gradient-to-br from-white via-green-50/20 to-emerald-50/20 border-2 border-green-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-green-900 flex items-center gap-2">
                    <span>📋</span> Подробные результаты
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {assessmentResults.map((result, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/60 border border-green-100 hover:shadow-md transition-all duration-200">
                        <div className="flex-shrink-0 mt-1">
                          {result.isCorrect ? (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                              <X className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 mb-2 leading-tight">{result.question}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="text-sm text-gray-600">Ваш ответ:</span>
                            <span className={`font-medium ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {result.userAnswer}
                            </span>
                            {!result.isCorrect && (
                              <>
                                <span className="hidden sm:block text-gray-400">•</span>
                                <span className="text-sm text-green-600">
                                  Правильно: <span className="font-medium">{result.correctAnswer}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-green-200">
                    <Button
                      onClick={restartAssessment}
                      variant="outline"
                      className="flex-1 h-12 border-2 border-green-300 hover:border-green-400 hover:bg-green-50 transition-all duration-200"
                    >
                      🔄 Пройти заново
                    </Button>
                    <Button
                      onClick={() => window.history.back()}
                      className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      ← Вернуться назад
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">

      {/* Header */}
      <Header />

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Teacher Chat Interface */}
        <div className="space-y-6">

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Start Lesson Button (for lesson mode) */}
              {isLessonMode && !lessonStarted && (
                <Button
                  size="lg"
                  className="flex-1 sm:flex-none text-lg px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 gap-3 font-semibold"
                  onClick={generateLessonPlan}
                  disabled={isGeneratingPlan}
                >
                  {isGeneratingPlan ? (
                    <>Генерирую урок...</>
                  ) : (
                    <>🎓 Начать интерактивный урок</>
                  )}
                </Button>
              )}

              {/* Call Teacher Button (for lesson mode) */}
              {isLessonMode && (
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 sm:flex-none text-lg px-8 py-4 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 gap-3 font-semibold"
                  onClick={() => setShowVideoCall(true)}
                >
                  <Phone className="w-5 h-5 text-primary" />
                  📞 Звонок учителю
                </Button>
              )}

              {/* Error message */}
              {generationError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-red-500 mt-0.5">⚠️</div>
                    <div>
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                        Ошибка генерации плана урока
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {generationError}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => setGenerationError('')}
                      >
                        Закрыть
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Display with Formatted Content */}
            {isLessonMode && lessonStarted && lessonPlan && lessonContent && (
              <LessonDisplay
                stepTitle={lessonPlan.steps[currentLessonStep]?.title || 'Урок'}
                stepNumber={currentSectionIndex + 1}
                totalSteps={currentLessonSections.length}
                content={lessonContent}
                duration={lessonPlan.steps[currentLessonStep]?.duration || '5'}
                onNext={waitingForAnswer ? undefined : nextSection}
                isGenerating={isGeneratingContent}
                currentTask={currentSectionTask}
                waitingForAnswer={waitingForAnswer}
                onAnswer={handleLessonTaskAnswer}
              />
            )}

            {/* Lesson Progress Header */}
            {isLessonMode && personalizedCourseData && currentLesson && (
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          Текущий урок: {currentLesson.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {currentLesson.topic}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Прогресс</p>
                      <p className="font-medium text-primary">
                        Урок {currentLesson.number || 1}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Thinking message display during plan generation */}
            {isLessonMode && isGeneratingPlan && (
              <div className="mb-6">
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium text-foreground">ИИ анализирует</span>
                  </div>
                  <div className="text-sm text-muted-foreground ml-8">
                    {generationStep}{thinkingDots}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Container - hidden in lesson mode */}
            {!isLessonMode && (
            <ChatContainer
                ref={chatContainerRef}
              initialSystemPrompt={`Вы - профессиональный педагог и эксперт в образовании. Ваша задача - объяснять любые темы быстро, понятно и доступно. Вы можете "разжевывать" сложные концепции, приводить примеры из реальной жизни, использовать аналогии и пошаговые объяснения.

Особенности вашего стиля:
- Объясняйте сложное простыми словами
- Используйте примеры и аналогии
- Разбивайте информацию на логические блоки
- Задавайте наводящие вопросы для лучшего понимания
- Будьте терпеливы и поддерживающи
- Адаптируйте объяснения под уровень ученика
- Поощряйте самостоятельное мышление`}
              maxMessages={100}
              onChatStart={() => console.log('Chat started')}
              onChatEnd={() => console.log('Chat ended')}
            />
            )}
          </div>

          {/* Voice Teacher Chat */}
          {showVideoCall && (
            <div className="mt-8" data-video-call>
              <VoiceTeacherChat
                lessonTitle={currentLesson?.title || 'Урок'}
                lessonTopic={currentLesson?.topic || 'Тема'}
                lessonAspects={currentLesson?.aspects || currentLesson?.description || 'Материал урока'}
                onComplete={() => {
                  setShowVideoCall(false);
                  setLessonStarted(false);
                }}
                onClose={() => setShowVideoCall(false)}
              />
            </div>
          )}
        </div>
    </div>
  );
};

export default Chat;

