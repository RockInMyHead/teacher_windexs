declare global {
  interface Window {
    _assessmentResolver?: ((answer: string) => void) | null;
  }
}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, Send, User, MessageCircle, Volume2, VolumeX, CheckCircle, X, BookOpen, Target, ArrowLeft, Phone, PhoneOff } from 'lucide-react';
import { OpenAITTS, isTTSAvailable } from '@/lib/openaiTTS';
import { VoiceComm, VoiceUtils } from '@/lib/voiceComm';
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

  // Generate content sections for a lesson step
  const generateStepContent = useCallback(async (stepIndex: number, step: any, lessonPlan: any) => {
    try {
      console.log('🎯 Generating content for step:', step.title);

      // Parse the description into sections
      const sections = parseLessonContent(step.description);

      // Set the sections for display
      setCurrentLessonSections(sections);
      setCurrentSectionIndex(0);
      setCurrentSectionTask(null);
      setWaitingForAnswer(false);

      console.log('✅ Generated', sections.length, 'sections for step:', step.title);
    } catch (error) {
      console.error('❌ Error generating step content:', error);
      // Fallback: create single section with the description
      setCurrentLessonSections([{
        title: step.title,
        content: step.description || 'Контент урока временно недоступен.'
      }]);
      setCurrentSectionIndex(0);
      setCurrentSectionTask(null);
      setWaitingForAnswer(false);
    }
  }, []);

  // Parse lesson content into sections
  const parseLessonContent = useCallback((content: string): any[] => {
    if (!content) return [{ title: 'Содержание', content: 'Контент не найден.' }];

    const sections: any[] = [];
    const lines = content.split('\n');

    let currentSection: any = null;
    let currentContent = '';

    for (const line of lines) {
      // Check for headers (### or ##)
      if (line.startsWith('### ')) {
        // Save previous section if exists
        if (currentSection) {
          currentSection.content = currentContent.trim();
          sections.push(currentSection);
        }

        // Start new section
        currentSection = {
          title: line.replace(/^###\s*/, '').trim(),
          content: ''
        };
        currentContent = '';
      } else if (line.startsWith('## ')) {
        // Save previous section if exists
        if (currentSection) {
          currentSection.content = currentContent.trim();
          sections.push(currentSection);
        }

        // Start new section
        currentSection = {
          title: line.replace(/^##\s*/, '').trim(),
          content: ''
        };
        currentContent = '';
      } else if (line.startsWith('# ')) {
        // Save previous section if exists
        if (currentSection) {
          currentSection.content = currentContent.trim();
          sections.push(currentSection);
        }

        // Start new section
        currentSection = {
          title: line.replace(/^#\s*/, '').trim(),
          content: ''
        };
        currentContent = '';
      } else if (currentSection) {
        // Add to current section content
        currentContent += line + '\n';
      } else {
        // No section started yet, create default
        currentSection = {
          title: 'Основной материал',
          content: line + '\n'
        };
      }
    }

    // Save the last section
    if (currentSection) {
      currentSection.content = currentContent.trim();
      sections.push(currentSection);
    }

    // If no sections were found, create one
    if (sections.length === 0) {
      sections.push({
        title: 'Содержание урока',
        content: content
      });
    }

    return sections;
  }, []);
  const [currentSectionTask, setCurrentSectionTask] = useState<any>(null);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [thinkingDots, setThinkingDots] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTranscript, setCallTranscript] = useState('');
  const [lessonNotes, setLessonNotes] = useState<string[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [isLessonSpeaking, setIsLessonSpeaking] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
  const [questionTimeout, setQuestionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lessonPausedAt, setLessonPausedAt] = useState<number | null>(null);
  const [isWaitingForStudentAnswer, setIsWaitingForStudentAnswer] = useState(false);
  const [currentTeacherQuestion, setCurrentTeacherQuestion] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'teacher' | 'student', text: string}>>([]);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [lessonStreamText, setLessonStreamText] = useState('');
  const [lessonGenerationComplete, setLessonGenerationComplete] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  const [isProcessingTextMessage, setIsProcessingTextMessage] = useState(false);
  const [savedLessons, setSavedLessons] = useState<any[]>([]);
  const [showSavedLessons, setShowSavedLessons] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Set video element for TTS synchronization
  useEffect(() => {
    if (showVideoCall && videoRef.current) {
      console.log('🎥 Setting video element for TTS sync');
      OpenAITTS.setVideoElement(videoRef.current);
    } else {
      OpenAITTS.setVideoElement(null);
    }
    
    return () => {
      OpenAITTS.setVideoElement(null);
    };
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
          model: 'gemini-3-pro-preview',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_completion_tokens: 2000
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
          await OpenAITTS.speak(sectionContent, {});
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

  // Handle user transcript with question detection
  const abortControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef<number>(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUserTranscript = useCallback(async (text: string, isFinal: boolean) => {
    console.log('🔍 handleUserTranscript called:', { text, isFinal });
    
    if (!isFinal || !text.trim()) {
      console.log('⏭️ Skipping: not final or empty');
      return;
    }
    
    // 1. Cancel any pending processing or speech
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
    
    if (abortControllerRef.current) {
      console.log('🚫 Aborting previous request due to new input');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    OpenAITTS.stop(); // Ensure TTS is stopped
    
    // 2. Update Request ID to ignore stale responses
    const currentRequestId = ++latestRequestIdRef.current;
    
    console.log('📝 User said (final):', text);
    setCallTranscript(prev => prev + (prev ? ' ' : '') + text);

    // 3. Smart History Update: Combine with previous if it was pending
    setConversationHistory(prev => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.role === 'student') {
         console.log('🔗 Appending to previous unanswered student message');
         const newHistory = [...prev];
         newHistory[newHistory.length - 1] = { 
           ...lastMsg, 
           text: lastMsg.text + ' ' + text 
         };
         return newHistory;
      } else {
         return [...prev, { role: 'student', text: text }];
      }
    });

    // Generate next step in conversation
    console.log('🎯 Generating next conversation step...');

    // Small debounce to allow rapid-fire sentences to merge before sending
    processingTimeoutRef.current = setTimeout(async () => {
        try {
          setIsProcessingQuestion(true);
          
          const controller = new AbortController();
          abortControllerRef.current = controller;
          
          // Use Ref to get latest history
          const context = historyRef.current.slice(-4).map(h =>
            `${h.role === 'teacher' ? 'Юля' : 'Ученик'}: ${h.text}`
          ).join('\n');
          
          const lastStudentMsg = historyRef.current[historyRef.current.length - 1];
          const textToSend = lastStudentMsg?.role === 'student' ? lastStudentMsg.text : text;

          const systemPrompt = `Ты - Юля, профессиональный школьный учитель с 15-летним стажем. Твоя задача - ВЕСТИ УРОК ПО ПЛАНУ, а не просто поддерживать разговор.

ТВОЙ ПОДХОД К ОБУЧЕНИЮ:
🎯 ТЫ ВЕДЕШЬ УРОК: Рассказывай теорию, объясняй темы, задавай вопросы для проверки понимания.
📚 СТРУКТУРА УРОКА: Сначала объясняй материал, потом спрашивай у ученика.
🚫 НЕ ЖДИ, ПОКА УЧЕНИК ЗАДАСТ ВОПРОС: Ты ведешь урок, ты задаешь вопросы.
📝 ПЕРЕХОДИ К СЛЕДУЮЩЕМУ: После объяснения и проверки понимания, переходи к следующему пункту плана.

ПРАВИЛА ПРОВЕДЕНИЯ УРОКА:
1. РАССКАЗЫВАЙ ТЕОРИЮ: Объясняй темы из плана урока понятным языком.
2. ЗАДАВАЙ ВОПРОСЫ: После объяснения спрашивай у ученика, понял ли он.
3. ПРОВЕРЯЙ ОТВЕТЫ: Анализируй, правильно ли ответил ученик.
4. ЕСЛИ ОТВЕТ НЕВЕРНЫЙ:
   - Скажи: "Не совсем так" или "Давай подумаем еще раз".
   - Объясни ошибку и правильный ответ.
   - Переспроси, чтобы проверить понимание.
5. ЕСЛИ ОТВЕТ НЕПОНЯТЕН:
   - Попробуй найти ОМОФОНЫ: "Грипп грибы" -> "Гриб грибы" (по контексту).
   - Если совсем непонятно - переспроси.
6. ЕСЛИ ОТВЕТ ПРАВИЛЬНЫЙ: Кратко похвали и переходи к следующему.
7. СЛЕДУЮЩИЙ ШАГ: После проверки всегда переходи к следующему пункту плана.

ПРАВИЛА ДЛЯ ТЕКСТА В РЕЧЬ (TTS):
- Расставляй УДАРЕНИЯ в сложных словах знаком + перед ударной гласной (например: "м+ама", "г+ород").
- Для омографов (зам+ок/з+амок) обязательно ставь ударение по контексту.

ПЛАН ТЕКУЩЕГО УРОКА:
${currentLesson?.aspects || 'Изучаем основы географии, формы Земли, карты и глобусы'}

ТЕКУЩИЙ УРОК: "${currentLesson?.title || 'Урок географии'}" (${currentLesson?.topic || 'Формы Земли'})
КОНТЕКСТ РАЗГОВОРА:
${context}

УЧЕНИК СКАЗАЛ: "${textToSend}"

ИНСТРУКЦИЯ ДЛЯ ОТВЕТА:
1. Если ученик ответил на твой вопрос: Оцени правильность ответа (учитывая омофоны).
2. Если ученик спросил что-то: Ответь, но верни к плану урока.
3. Всегда заканчивай объяснением материала или вопросом для проверки понимания.
4. Переходи к следующему пункту плана, когда ученик понял предыдущий.
`;

          const response = await fetch('/api/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Ученик только что сказал: "${textToSend}". Продолжи урок.` }
              ],
              model: 'gemini-3-pro-preview',
              temperature: 0.7,
              max_tokens: 300
            }),
            signal: controller.signal
          });

          if (response.ok) {
            const data = await response.json();
            const teacherResponse = data.choices[0].message.content;
            console.log('✅ Teacher response:', teacherResponse);

            if (controller.signal.aborted) return;

            setConversationHistory(prev => [...prev, { role: 'teacher', text: teacherResponse }]);
            await OpenAITTS.speak(teacherResponse, {
              voice: 'nova',
              speed: 1.0,
              onEnd: () => {
                setTimeout(() => {
                  VoiceComm.startListening();
              }, 1000);
            }
            });
          }
        } catch (error) {
            const err = error as Error;
            if (err.name === 'AbortError') {
                 console.log('🛑 Request aborted');
            } else {
                 console.error('❌ Error generating teacher response:', err);
            }
        } finally {
          if (currentRequestId === latestRequestIdRef.current) {
          setIsProcessingQuestion(false);
             abortControllerRef.current = null;
          }
        }
      }, 500);
  }, [conversationHistory, currentLesson]);
  
  const historyRef = useRef(conversationHistory);
  useEffect(() => { historyRef.current = conversationHistory; }, [conversationHistory]);
  const generateLessonNotesStreaming = useCallback(async (): Promise<string[]> => {
    console.log('📝 Starting streaming lesson generation...');
    setIsGeneratingLesson(true);
    setLessonStreamText('');
    setLessonGenerationComplete(false);

    try {
      const systemPrompt = `Ты - Юля, профессиональный педагог и методист с 15-летним опытом преподавания английского языка. Ты - мастер создания увлекательных уроков, которые ученики действительно хотят проходить.

ТВОЯ СПЕЦИАЛИЗАЦИЯ:
Создание персонализированных уроков английского языка, адаптированных под конкретного ученика, его уровень и интересы.

ПЕДАГОГИЧЕСКАЯ ЭКСПЕРТИЗА:
🎯 Диагностика уровня: Определяешь уровень ученика по первым ответам
🧠 Когнитивная психология: Используешь принципы эффективного обучения
📚 Методология: Применяешь современные методики преподавания
🎭 Психология: Мотивируешь и поддерживаешь учеников
🌟 Индивидуализация: Адаптируешь материал под конкретного человека

СТРАТЕГИИ ПРИВЕТСТВИЯ:
1. 🔥 Эмоциональное вовлечение: Начинай с энтузиазма и интереса
2. 🎯 Персонализация: Используй имя темы для создания связи
3. 📋 Планирование: Кратко опиши что будем изучать
4. 💪 Мотивация: Создай ожидание пользы и удовольствия
5. 🤝 Установление контакта: Покажи, что ты здесь, чтобы помочь

ФОРМАТ ПРИВЕТСТВИЯ:
- Будь живой и дружелюбной (используй эмодзи, восклицательные знаки)
- Покажи энтузиазм по теме
- Кратко расскажи о пользе урока
- Задай вопрос, чтобы начать диалог
- Используй обращение "мы" для создания команды

ПРИМЕР ХОРОШЕГО ПРИВЕТСТВИЯ:
"Привет! Я Юля, и мы с тобой сегодня разберемся с артиклями в английском! Это как дорожные знаки в языке - без них легко запутаться, но с ними все становится ясно! 🎯 Готов начать наше путешествие в мир артиклей?"

Создай персонализированное приветствие для темы "\${currentLesson?.title || 'Урок'}" (\${currentLesson?.topic || 'Тема'}).

Верни ответ в формате JSON массива строк, где ПЕРВЫЙ элемент - приветствие от Юли.`;

      const initialMessage = `Давай начнем урок по теме "\${currentLesson?.title || 'Урок'}". Поздоровайся, представься (Юлия) и кратко скажи, чем мы будем заниматься.`;

      const prompt = initialMessage;

          const response = await fetch('/api/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
            { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
              ],
              model: 'gemini-3-pro-preview',
              temperature: 0.7,
          max_tokens: 300
            })
          });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
      const rawContent = data.choices[0].message.content;
      console.log('📥 Raw greeting response:', rawContent);

      // Parse JSON response - expect simple array with greeting
      let notes;
      try {
        // Remove markdown code blocks if present
        let cleanedText = rawContent.replace(/```json\\s*/g, '').replace(/```\\s*$/g, '').trim();

        const parsed = JSON.parse(cleanedText);

        if (!Array.isArray(parsed)) {
          throw new Error('Parsed result is not an array');
        }

        notes = parsed;

        if (!notes || notes.length === 0) {
          throw new Error('Empty greeting');
        }

        console.log('✅ Generated greeting:', notes);
        return notes;

      } catch (parseError) {
        console.warn('❌ Failed to parse greeting JSON:', parseError);
        // Simple fallback greeting
        const fallbackNotes = ['Привет! Я Юля. Давай начнем урок!'];
        console.log('💬 Using fallback greeting:', fallbackNotes);
        return fallbackNotes;
      }

        } catch (error) {
      console.error('❌ Failed to generate greeting:', error);
      // Fallback greeting from Юля
      const fallbackNotes = ['Привет! Я Юля. Давай начнем урок!'];
      return fallbackNotes;
    } finally {
      setIsGeneratingLesson(false);
    }
  }, [currentLesson]);

  // Generate lesson notes for call
  const generateLessonNotesForCall = useCallback(async () => {
    try {
      console.log('📝 Generating lesson notes for call...');

      const systemPrompt = `Ты - Юля, профессиональный педагог и методист с 15-летним опытом преподавания английского языка. Ты - мастер создания увлекательных уроков, которые ученики действительно хотят проходить.

ТВОЯ СПЕЦИАЛИЗАЦИЯ:
Создание персонализированных уроков английского языка, адаптированных под конкретного ученика, его уровень и интересы.

ПЕДАГОГИЧЕСКАЯ ЭКСПЕРТИЗА:
🎯 Диагностика уровня: Определяешь уровень ученика по первым ответам
🧠 Когнитивная психология: Используешь принципы эффективного обучения
📚 Методология: Применяешь современные методики преподавания
🎭 Психология: Мотивируешь и поддерживаешь учеников
🌟 Индивидуализация: Адаптируешь материал под конкретного человека

СТРАТЕГИИ ПРИВЕТСТВИЯ:
1. 🔥 Эмоциональное вовлечение: Начинай с энтузиазма и интереса
2. 🎯 Персонализация: Используй имя темы для создания связи
3. 📋 Планирование: Кратко опиши что будем изучать
4. 💪 Мотивация: Создай ожидание пользы и удовольствия
5. 🤝 Установление контакта: Покажи, что ты здесь, чтобы помочь

ФОРМАТ ПРИВЕТСТВИЯ:
- Будь живой и дружелюбной (используй эмодзи, восклицательные знаки)
- Покажи энтузиазм по теме
- Кратко расскажи о пользе урока
- Задай вопрос, чтобы начать диалог
- Используй обращение "мы" для создания команды

ПРИМЕР ХОРОШЕГО ПРИВЕТСТВИЯ:
"Привет! Я Юля, и мы с тобой сегодня разберемся с артиклями в английском! Это как дорожные знаки в языке - без них легко запутаться, но с ними все становится ясно! 🎯 Готов начать наше путешествие в мир артиклей?"

Создай персонализированное приветствие для темы "${currentLesson?.title || 'Урок'}" (${currentLesson?.topic || 'Тема'}).

Верни ответ в формате JSON массива строк, где ПЕРВЫЙ элемент - приветствие от Юли.`;

      const initialMessage = `Давай начнем урок по теме "${currentLesson?.title || 'Урок'}". Поздоровайся, представься (Юлия) и кратко скажи, чем мы будем заниматься.`;

          const response = await fetch('/api/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: initialMessage
            }
              ],
              model: 'gemini-3-pro-preview',
          temperature: 0.7,
          max_tokens: 300
            })
          });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

            const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      // Parse JSON response or use fallback
      try {
        const notes = JSON.parse(content);
        if (Array.isArray(notes) && notes.length > 0) {
          console.log('✅ Приветствие от Юли:', notes[0].substring(0, 50));
          setLessonNotes(notes);
          console.log('📝 Lesson notes generated:', notes.length, 'items');
        } else {
          // Fallback greeting
          setLessonNotes(['Привет! Я Юля. Давай начнем урок!']);
          console.log('✅ Fallback greeting used');
        }
      } catch (parseError) {
        // Fallback greeting
        setLessonNotes(['Привет! Я Юля. Давай начнем урок!']);
        console.log('✅ Fallback greeting used (parse error)');
      }

        } catch (error) {
      console.error('Error generating lesson greeting:', error);
      // Fallback greeting
      setLessonNotes(['Привет! Я Юля. Давай начнем урок!']);
      console.log('✅ Fallback greeting used (error)');
    } finally {
      setIsProcessing(false);
      setIsGeneratingLesson(false);
    }
  }, [currentLesson]);

  // Speak greeting and start interactive chat
  const speakGreetingAndStartChat = useCallback(async (greeting: string) => {
    try {
      console.log('🎤 Speaking greeting:', greeting.substring(0, 50) + '...');
      setIsLessonSpeaking(true);

      // Speak the greeting
      await OpenAITTS.speak(greeting, {
        voice: 'nova',
        speed: 1.0,
        onStart: () => {
          console.log('🎤 Greeting TTS started');
        },
        onEnd: async () => {
          console.log('✅ Greeting TTS ended, starting voice recognition');
        setIsLessonSpeaking(false);

          // After greeting, immediately start voice recognition for user response
          try {
            await VoiceComm.startListening();
          } catch (error) {
            console.error('❌ Failed to start voice recognition after greeting:', error);
          }
        },
        onError: (error) => {
          console.error('❌ Greeting TTS error:', error);
          setIsLessonSpeaking(false);
        }
      });
    } catch (error) {
      console.error('❌ Failed to speak greeting:', error);
      setIsLessonSpeaking(false);
    }
  }, []);

  // Save lesson session to database
  const saveLessonSession = async (notes: string[]) => {
    try {
      console.log('💾 Saving lesson session to database...');
      const response = await fetch('/api/lesson-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
          user_id: null, // можно добавить user_id если есть авторизация
          course_name: personalizedCourseData?.courseName || 'Unknown Course',
          lesson_title: currentLesson?.title || 'Unknown Lesson',
          lesson_topic: currentLesson?.topic || '',
          lesson_number: currentLesson?.number || null,
          lesson_notes: notes,
          current_note_index: currentNoteIndex,
          call_transcript: callTranscript
                })
              });

              if (response.ok) {
                const data = await response.json();
        setCurrentSessionId(data.session_id);
        console.log('✅ Lesson session saved, ID:', data.session_id);
              } else {
        console.error('❌ Failed to save session:', await response.text());
      }
            } catch (error) {
      console.error('❌ Error saving session:', error);
    }
  };

  // Update lesson progress in database
  const updateLessonProgress = async (noteIndex: number, transcript?: string) => {
    if (!currentSessionId) return;
    
    try {
      await fetch(`/api/lesson-sessions/${currentSessionId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_note_index: noteIndex,
          call_transcript: transcript || callTranscript
        })
      });
      console.log('✅ Progress updated:', noteIndex);
    } catch (error) {
      console.error('❌ Error updating progress:', error);
    }
  };

  // Complete lesson session
  const completeLessonSession = async () => {
    if (!currentSessionId) return;
    
    try {
      await fetch(`/api/lesson-sessions/${currentSessionId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ Lesson session completed');
      setCurrentSessionId(null);
    } catch (error) {
      console.error('❌ Error completing session:', error);
    }
  };

  // Handle text message input
  const handleTextMessage = async (message: string) => {
    if (!message.trim() || isProcessingTextMessage) return;

    console.log('💬 Processing text message:', message);

    setIsProcessingTextMessage(true);
    const userMessage = message.trim();
    setTextMessage('');

    try {
      // Add to conversation history
      setConversationHistory(prev => [...prev, { role: 'student', text: userMessage }]);

      // Get lesson context
      const lessonContext = lessonNotes.slice(0, currentNoteIndex + 1).join(' ');

      const prompt = `Ты - Юля, профессиональный школьный учитель. Твоя задача - ВЕСТИ УРОК ПО ПЛАНУ, а не просто отвечать на вопросы.

ТВОЙ ПОДХОД К ОБУЧЕНИЮ:
🎯 ТЫ ВЕДЕШЬ УРОК: Рассказывай теорию, объясняй темы, задавай вопросы для проверки понимания.
📚 СТРУКТУРА УРОКА: Сначала объясняй материал, потом спрашивай у ученика.
🚫 НЕ ЖДИ ВОПРОСОВ: Ты ведешь урок, ты задаешь вопросы.

ПРАВИЛА ПРОВЕДЕНИЯ УРОКА:
1. РАССКАЗЫВАЙ ТЕОРИЮ: Объясняй темы из плана урока понятным языком.
2. ЗАДАВАЙ ВОПРОСЫ: После объяснения спрашивай у ученика, понял ли он.
3. ПРОВЕРЯЙ ОТВЕТЫ: Анализируй, правильно ли ответил ученик.
4. ЕСЛИ ОТВЕТ НЕВЕРНЫЙ: Скажи "Не совсем так", объясни ошибку, переспроси.
5. ЕСЛИ ОТВЕТ НЕПОНЯТЕН: Переспроси четко.
6. ЕСЛИ ОТВЕТ ПРАВИЛЬНЫЙ: Кратко похвали и переходи к следующему.
7. СЛЕДУЮЩИЙ ШАГ: После проверки всегда переходи к следующему пункту плана.

ТЕКУЩИЙ УРОК: "${currentLesson?.title || 'Урок географии'}" (${currentLesson?.topic || 'Формы Земли'})
ПЛАН ТЕКУЩЕГО УРОКА: ${currentLesson?.aspects || 'Изучаем основы географии, формы Земли, карты и глобусы'}

КОНТЕКСТ УРОКА:
${lessonContext}

НЕДАВНИЙ РАЗГОВОР:
${conversationHistory.slice(-3).map(h => `${h.role === 'teacher' ? 'Юля' : 'Ученик'}: ${h.text}`).join('\n')}

УЧЕНИК СПРОСИЛ: "${userMessage}"

ИНСТРУКЦИЯ ДЛЯ ОТВЕТА:
1. Если ученик ответил на твой вопрос: Оцени правильность и переходи дальше.
2. Если ученик спросил что-то: Ответь кратко и верни к плану урока.
3. Всегда заканчивай объяснением материала или вопросом для проверки.
4. Переходи к следующему пункту плана, когда ученик понял предыдущий.`;

      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        messages: [
            { role: 'system', content: `Ты - Юля, школьный учитель. Твоя цель - УЧИТЬ. 
1. Строго соблюдай тему урока: "${currentLesson?.title || 'Урок географии'}" (${currentLesson?.topic || 'Формы Земли'}). Вопросы не по теме - откладывай.
2. Честно оценивай ответы. Если ученик ошибается - ПОПРАВЛЯЙ его, а не хвали.
3. Если речь неразборчива - переспрашивай.
4. Будь дружелюбной, но требовательной.` },
            { role: 'user', content: prompt }
        ],
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (response.ok) {
        const data = await response.json();
        const teacherResponse = data.choices[0].message.content;

        console.log('✅ Teacher response for text message:', teacherResponse);

        // Add response to conversation history
        setConversationHistory(prev => [...prev, { role: 'teacher', text: teacherResponse }]);

        // Add response to lesson notes
        const newNote = `💬 ${userMessage}\n\n👩‍🏫 ${teacherResponse}`;
        const updatedNotes = [...lessonNotes];
        // Insert after current note
        const insertIndex = currentNoteIndex + 1;
        updatedNotes.splice(insertIndex, 0, newNote);
        setLessonNotes(updatedNotes);

        // Save updated lesson notes to database
        if (currentSessionId) {
          try {
            await fetch(`/api/lesson-sessions/${currentSessionId}/progress`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                current_note_index: currentNoteIndex + 1,
                call_transcript: callTranscript,
                lesson_notes: updatedNotes
              })
            });
            console.log('💾 Updated lesson notes saved to database');
          } catch (error) {
            console.error('❌ Error saving updated lesson notes:', error);
          }
        }

        console.log('📝 Added teacher response to lesson notes');

        // Speak the response
        await OpenAITTS.speak(teacherResponse, {});

        // Continue lesson from next note if not waiting for answer
        if (!isWaitingForStudentAnswer && currentNoteIndex + 2 < lessonNotes.length) {
          console.log('▶️ Continuing lesson after text response');
          setTimeout(async () => {
            await speakLessonNotes(lessonNotes.slice(currentNoteIndex + 2), currentNoteIndex + 2);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('❌ Error processing text message:', error);
    } finally {
      setIsProcessingTextMessage(false);
    }
  };

  // Load saved lessons
  const loadSavedLessons = async () => {
    try {
      const response = await fetch('/api/generated-lessons?limit=20');
      if (response.ok) {
        const data = await response.json();
        setSavedLessons(data.lessons || []);
        console.log('📚 Loaded saved lessons:', data.lessons?.length);
      }
    } catch (error) {
      console.error('❌ Error loading saved lessons:', error);
    }
  };

  // Save current text-based lesson
  const saveCurrentLesson = async () => {
    try {
      if (!lessonNotes.length || !conversationHistory.length) {
        alert('Нет данных для сохранения. Начните урок и пообщайтесь с учителем.');
        return;
      }

      const response = await fetch('/api/generated-lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_name: currentLesson?.courseName || 'General',
          lesson_title: currentLesson?.title || 'Text Lesson',
          lesson_topic: currentLesson?.topic || '',
          lesson_number: currentLesson?.number || null,
          lesson_notes: lessonNotes,
          generation_prompt: `Text-based lesson with conversation history`,
          conversation_history: conversationHistory,
          interaction_type: 'text',
          is_template: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('💾 Text lesson saved with ID:', data.lesson_id);
        alert('Урок сохранен! Теперь вы можете загрузить его из "Сохраненные уроки"');
      } else {
        throw new Error('Failed to save lesson');
      }
    } catch (error) {
      console.error('❌ Error saving current lesson:', error);
      alert('Ошибка при сохранении урока');
    }
  };

  // Delete saved lesson
  const deleteSavedLesson = async (lessonId: number) => {
    try {
      const response = await fetch(`/api/generated-lessons/${lessonId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove from local state
        setSavedLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
        console.log('🗑️ Deleted saved lesson:', lessonId);
      } else {
        throw new Error('Failed to delete lesson');
      }
    } catch (error) {
      console.error('❌ Error deleting saved lesson:', error);
      alert('Ошибка при удалении урока');
    }
  };

  // Load specific saved lesson
  const loadSavedLesson = async (lessonId: number) => {
    try {
      const response = await fetch(`/api/generated-lessons/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        const lesson = data.lesson;

        console.log('📖 Loaded saved lesson:', lesson.lesson_title, 'Type:', lesson.interaction_type);

        if (lesson.interaction_type === 'text' && lesson.conversation_history) {
          // Текстовое общение - загрузить историю чата и конспект
          console.log('💬 Loading text-based lesson with conversation history');

          setLessonNotes(lesson.lesson_notes);
          setConversationHistory(JSON.parse(lesson.conversation_history));
          setCurrentNoteIndex(lesson.lesson_notes.length - 1); // Начать с последней заметки
          setLessonGenerationComplete(true);

          // Clear voice-related state
          setIsWaitingForStudentAnswer(false);
          setCurrentTeacherQuestion('');

          // Показать сообщение о загрузке
          setTimeout(() => {
            alert(`Урок "${lesson.lesson_title}" загружен с историей переписки. Продолжайте общение в чате.`);
          }, 100);

        } else {
          // Голосовое общение - напомнить на чем закончили
          console.log('🎤 Loading voice-based lesson, reminding about last state');

          setLessonNotes(lesson.lesson_notes);
          setCurrentNoteIndex(0);
          setLessonGenerationComplete(true);

          // Clear any existing state
          setIsWaitingForStudentAnswer(false);
          setCurrentTeacherQuestion('');
          setConversationHistory([]);

          // Напомнить на чем закончили через TTS
          setTimeout(async () => {
            try {
              const lastNote = lesson.lesson_notes[lesson.lesson_notes.length - 1] || 'Мы закончили урок.';
              const reminder = `Привет! Это Юля. Напоминаю, на чем мы остановились в уроке "${lesson.lesson_title}": ${lastNote.substring(0, 100)}... Продолжим урок?`;

              await OpenAITTS.speak(reminder, {});
              console.log('🎤 Reminded about lesson state');
            } catch (error) {
              console.error('❌ Failed to remind about lesson state:', error);
              alert(`Урок "${lesson.lesson_title}" загружен. Мы остановились на последней теме урока.`);
            }
          }, 500);
        }

        setShowSavedLessons(false);
      }
    } catch (error) {
      console.error('❌ Error loading saved lesson:', error);
    }
  };

  // Handle video call with voice transcription and lesson
  const handleCall = async () => {
    if (isCallActive) {
      // End call
      console.log('📞 Ending call...');
      VoiceComm.stopListening();
      OpenAITTS.stop();
      setIsCallActive(false);
      setCallTranscript('');
      setLessonNotes([]);
      setCurrentNoteIndex(0);
      setIsLessonSpeaking(false);
    } else {
      // Start call
      console.log('📞 Starting call...');

      // Activate audio context first (important for browser autoplay policies)
      try {
        console.log('🔊 Activating audio context...');

        // Try Web Audio API first
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
          const AudioContextClass = AudioContext || webkitAudioContext;
          const audioContext = new AudioContextClass();
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
          }
          console.log('✅ Web Audio API context activated');
        } else {
          // Fallback to HTML5 Audio (may fail on some browsers)
          const audio = new Audio();
          audio.volume = 0.01;
          audio.muted = true;
          audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

          // Don't await, just try to play briefly
          audio.play().then(() => {
            audio.pause();
            console.log('✅ HTML5 Audio context activated');
          }).catch((err) => {
            console.warn('⚠️ HTML5 Audio activation failed, continuing anyway:', err.message);
          });

          // Wait a bit for potential activation
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.warn('⚠️ Failed to activate audio context, continuing anyway:', error.message);
      }

      try {
        // Generate simple greeting
        console.log('📚 Starting conversation...');
        setIsGeneratingLesson(true);
        const notes = ['Привет! Я Юля. Давай начнем урок по теме "' + (currentLesson?.title || 'математике') + '". Что ты уже знаешь по этой теме?'];
        setIsGeneratingLesson(false);
        console.log('✅ Greeting ready, count:', notes?.length);

        // Save the generated lesson
        try {
          const saveResponse = await fetch('/api/generated-lessons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              course_name: currentLesson?.courseName || 'General',
              lesson_title: currentLesson?.title || 'Generated Lesson',
              lesson_topic: currentLesson?.topic || '',
              lesson_number: currentLesson?.number || null,
              lesson_notes: notes,
              generation_prompt: 'Simple greeting',
              conversation_history: conversationHistory,
              interaction_type: 'voice',
              is_template: false
            })
          });

          if (saveResponse.ok) {
            const saveData = await saveResponse.json();
            console.log('💾 Generated lesson saved with ID:', saveData.lesson_id);
          } else {
            console.warn('⚠️ Failed to save generated lesson:', await saveResponse.text());
          }
        } catch (saveError) {
          console.warn('⚠️ Error saving generated lesson:', saveError);
        }

        // Start the conversation with greeting after generation completes
        console.log('🎓 Starting conversation with greeting...');
        setTimeout(async () => {
          try {
            // Speak the greeting and then start interactive chat
            await speakGreetingAndStartChat(notes[0]);
          } catch (error) {
            console.error('❌ Failed to start conversation:', error);
          }
        }, 500);

        // Initialize VoiceComm with callbacks
        const isInitialized = VoiceComm.init(
          {
            language: 'ru-RU',
            continuous: true
          },
          {
            onListeningStart: () => {
              console.log('🎤 Call listening started (callback fired)');
              console.log('🎤 Notes available:', !!notes, 'Notes length:', notes?.length);
              setIsCallActive(true);

              // Stop TTS immediately when user starts speaking to avoid conflicts
              console.log('🛑 Stopping TTS because user started speaking');
              OpenAITTS.stop();

              // Lesson already started automatically after generation, just ensure voice recognition is active
            },
            onListeningEnd: () => {
              console.log('🎤 Call listening ended');
              setIsCallActive(false);
              setIsLessonSpeaking(false);
            },
          onTranscript: (text: string, isFinal: boolean) => {
            if (isFinal && text.trim()) {
              console.log('📝 Call transcript:', text);
              handleUserTranscript(text, isFinal);
            }
          },
            onError: (error: string) => {
              console.error('❌ Call error:', error);
              setIsCallActive(false);
              setIsLessonSpeaking(false);
            }
          }
        );

        if (!isInitialized) {
          throw new Error('Speech Recognition not supported in this browser');
        }

        // Start voice recognition (without parameters)
        console.log('🎙️ Calling VoiceComm.startListening()...');
        const started = VoiceComm.startListening();
        console.log('🎙️ VoiceComm.startListening() returned:', started);
      } catch (error) {
        console.error('❌ Failed to start call:', error);
        setIsCallActive(false);
        setIsGeneratingLesson(false); // Скрыть индикатор при ошибке
      }
    }
  };

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
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 sm:flex-none text-lg px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 gap-3 font-semibold"
                    onClick={generateLessonPlan}
                    disabled={isGeneratingPlan}
                  >
                    {isGeneratingPlan ? (
                      <>Генерирую урок...</>
                    ) : (
                      <>Начать интерактивный урок</>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 sm:flex-none text-lg px-8 py-4 border-2 border-green-500/50 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all duration-300 gap-3 font-semibold"
                    onClick={saveCurrentLesson}
                  >
                    Сохранить урок
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 sm:flex-none text-lg px-8 py-4 border-2 border-blue-500/50 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 gap-3 font-semibold"
                    onClick={() => {
                      loadSavedLessons();
                      setShowSavedLessons(true);
                    }}
                  >
                    Сохраненные уроки
                  </Button>
                </div>
              )}

              {/* Call Teacher Button (for lesson mode) */}
              {isLessonMode && (
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 sm:flex-none text-lg px-8 py-4 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 hover:text-black transition-all duration-300 gap-3 font-semibold"
                  onClick={() => setShowVideoCall(true)}
                >
                  <Phone className="w-5 h-5 text-primary" />
                  Звонок учителю
                </Button>
              )}

              {/* Error Message */}
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
                        onClick={() => setGenerationError(null)}
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
                structuredContent={currentLessonSections}
                duration={lessonPlan.steps[currentLessonStep]?.duration || '5'}
                onNext={waitingForAnswer ? undefined : nextSection}
                isGenerating={isGeneratingContent}
                currentTask={currentSectionTask}
                waitingForAnswer={waitingForAnswer}
                onAnswer={handleLessonTaskAnswer}
              />
            )}

            {/* Current Lesson Info */}
            {isLessonMode && currentLesson && (
              <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-xl">
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
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Voice Call Interface */}
            {showVideoCall && (
              <VoiceTeacherChat
                lessonTitle={currentLesson?.title || 'Урок'}
                lessonTopic={currentLesson?.topic || 'Тема'}
                lessonAspects={currentLesson?.aspects || currentLesson?.description || ''}
                onComplete={() => {
                  setShowVideoCall(false);
                  setIsCallActive(false);
                }}
                onClose={() => {
                  setShowVideoCall(false);
                  setIsCallActive(false);
                }}
              />
            )}

            {/* Thinking message display during plan generation */}
            {isLessonMode && isGeneratingPlan && (
              <div className="mb-6">
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium text-foreground">ИИ анализирует</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Генерирую план урока на основе ваших требований...
                  </p>
                </div>
              </div>
            )}

            {/* Chat Interface */}
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

          {/* Video Call */}
          {showVideoCall && (
            <div className="mt-8" data-video-call>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Видео звонок с учителем</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={isCallActive ? "destructive" : "default"}
                      size="sm"
                      onClick={handleCall}
                      className="gap-2"
                    >
                      {isCallActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                      {isCallActive ? 'Завершить звонок' : 'Позвонить'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVideoCall(false)}
                    >
                      ✕ Закрыть
                    </Button>
                  </div>
                </div>
                <div className="w-[300px] h-[300px] bg-black rounded-full overflow-hidden mx-auto">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    src="/Untitled Video.mp4"
                    onError={(e) => {
                      console.error('Video load error:', e);
                      // Fallback: show message if video not found
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex items-center justify-center h-full text-white">
                            <div class="text-center">
                              <p class="text-lg mb-2">🎥 Видео не найдено</p>
                              <p class="text-sm opacity-75">Поместите файл "Untitled Video.mp4" в папку public</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  >
                    Ваш браузер не поддерживает видео.
                  </video>
                </div>
                      </div>
                        </div>
                      )}

            {/* Saved Lessons */}
      {/* Saved Lessons Modal */}
      {showSavedLessons && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Сохраненные уроки</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSavedLessons(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {savedLessons.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">У вас пока нет сохраненных уроков.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                          Завершите урок и нажмите "Сохранить урок" чтобы сохранить его для последующего использования.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                        {savedLessons.map((lesson) => (
                          <div key={lesson.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{lesson.lesson_title}</h3>
                                <p className="text-muted-foreground text-sm mt-1">
                                  {lesson.course_name} • {lesson.interaction_type === 'voice' ? '🎤 Голосовой урок' : '💬 Текстовый урок'}
                                </p>
                                <p className="text-muted-foreground text-xs mt-2">
                                  Создан: {new Date(lesson.created_at).toLocaleString('ru-RU')}
                                </p>
                                {lesson.lesson_topic && (
                                  <p className="text-muted-foreground text-sm mt-2">
                                    Тема: {lesson.lesson_topic}
                                  </p>
                                )}
                          </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                                  variant="outline"
                            size="sm"
                                  onClick={() => {
                                    loadSavedLesson(lesson.id);
                                  }}
                            className="gap-2"
                          >
                            📖 Загрузить
                          </Button>
                          <Button
                            variant="outline"
                                  size="sm"
                            onClick={() => {
                                    if (confirm('Вы уверены, что хотите удалить этот урок?')) {
                                deleteSavedLesson(lesson.id);
                              }
                            }}
                                  className="gap-2 text-red-600 hover:text-red-700"
                          >
                            🗑️ Удалить
                          </Button>
                        </div>
                      </div>
                        </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        </div>
        </div>
    </div>
  );
  }
export default Chat;
