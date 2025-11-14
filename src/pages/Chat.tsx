import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, Send, User, MessageCircle, Upload, FileText, Image, File, X, Camera, Volume2, VolumeX, Mic, MicOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { OpenAITTS, isTTSAvailable } from '@/lib/openaiTTS';
import { runAdaptiveAssessment, AssessmentResult, AssessmentQuestion, mapGradeToCluster, buildTwoWeekPlan, GradeCluster } from '@/utils/adaptiveAssessment';
import { LessonContextManager, LessonContext, LessonBlock } from '@/utils/lessonContextManager';
import { getCourseRecommendation, CourseRecommendation } from '@/utils/coursePlans';
import Header from '@/components/Header';

// Global types for Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: ((event: Event) => void) | null;
}



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

declare global {
  interface Window {
    _assessmentResolver?: ((answer: string) => void) | null;
  }
}

const GRADE_INTRO_QUESTIONS: Record<GradeCluster, IntroTestQuestion[]> = {
  grade1: [
    {
      question: 'Что значит "Good morning"?',
      options: ['Доброе утро', 'Добрый вечер', 'Спокойной ночи']
    },
    {
      question: 'Как переводится слово "Dog"?',
      options: ['собака', 'кот', 'птица']
    },
    {
      question: 'Как сказать "Меня зовут..." по-английски?',
      options: ['My name is', 'I have', 'I like']
    },
    {
      question: 'Выберите слово, которое подходит: This is my ___.',
      options: ['book', 'blue', 'five']
    },
    {
      question: 'Что значит "Thank you"?',
      options: ['Спасибо', 'Пожалуйста', 'Привет']
    }
  ],
  grade2: [
    {
      question: 'Выберите правильный ответ: They ___ at school now.',
      options: ['are', 'is', 'be']
    },
    {
      question: 'Как переводится слово "often"?',
      options: ['часто', 'редко', 'никогда']
    },
    {
      question: 'Заполните пропуск: We ___ to the park on Sundays.',
      options: ['go', 'goes', 'going']
    },
    {
      question: 'Что значит выражение "How much is it?"',
      options: ['Сколько это стоит?', 'Где это?', 'Когда это?']
    },
    {
      question: 'Выберите слово, обозначающее "вчера":',
      options: ['yesterday', 'today', 'tomorrow']
    }
  ],
  grade3_4: [
    {
      question: 'Как задать вопрос: ___ you like pizza?',
      options: ['Do', 'Does', 'Are']
    },
    {
      question: 'Выберите верное продолжение: There ___ three books on the table.',
      options: ['are', 'is', 'be']
    },
    {
      question: 'Как переводится слово "winter"?',
      options: ['зима', 'весна', 'осень']
    },
    {
      question: 'Complete the sentence: She ___ homework every day.',
      options: ['does', 'do', 'doing']
    },
    {
      question: 'Выберите правильное слово: My friend is taller ___ me.',
      options: ['than', 'then', 'that']
    }
  ],
  grade5_6: [
    {
      question: 'Выберите верный вариант: I have never ___ to London.',
      options: ['been', 'was', 'be']
    },
    {
      question: 'Как сказать "Он сейчас читает книгу"?',
      options: ['He is reading a book now', 'He read a book now', 'He reads a book now']
    },
    {
      question: 'Выберите фразовый глагол со значением "поднять":',
      options: ['pick up', 'run out', 'give in']
    },
    {
      question: 'Complete the sentence: If it rains, we ___ at home.',
      options: ['will stay', 'stayed', 'stay']
    },
    {
      question: 'Как переводится выражение "to be good at"?',
      options: ['хорошо уметь', 'быть рядом', 'нравиться']
    }
  ],
  grade7_8: [
    {
      question: 'Выберите верное продолжение: She has been studying English ___ 2019.',
      options: ['since', 'for', 'from']
    },
    {
      question: 'Какой вариант в пассивном залоге? The letter ___ yesterday.',
      options: ['was sent', 'sent', 'has sent']
    },
    {
      question: 'Выберите правильный условный тип: If I ___ enough money, I would travel more.',
      options: ['had', 'have', 'will have']
    },
    {
      question: 'Что значит выражение "make up one\'s mind"?',
      options: ['принять решение', 'придумать историю', 'потерять сознание']
    },
    {
      question: 'Complete the sentence: The film was ___ interesting that I watched it twice.',
      options: ['so', 'such', 'too']
    }
  ],
  grade9: [
    {
      question: 'Выберите верное слово: The results were beyond our ___.',
      options: ['expectations', 'expecting', 'expected']
    },
    {
      question: 'Как переводится выражение "in terms of"?',
      options: ['в плане', 'вместо', 'вокруг']
    },
    {
      question: 'Complete the sentence: Had I known about the traffic, I ___ earlier.',
      options: ['would have left', 'will leave', 'left']
    },
    {
      question: 'Страдательный залог с модальным глаголом: The project ___ next week.',
      options: ['must be finished', 'must finish', 'must have finished']
    },
    {
      question: 'Выберите синоним к слову "significant":',
      options: ['important', 'simple', 'distant']
    }
  ],
  grade10_11: [
    {
      question: 'Выберите верную форму: It\'s high time we ___ the report.',
      options: ['submitted', 'submit', 'had submitted']
    },
    {
      question: 'Как переводится идиома "break the ice"?',
      options: ['растопить лёд в общении', 'буквально ломать лёд', 'устроить драку']
    },
    {
      question: 'Complete the sentence: Not only ___ the presentation, but she also led the discussion.',
      options: ['did she prepare', 'she prepared', 'prepared she']
    },
    {
      question: 'Выберите подходящее слово: The theory remains purely ___ at this stage.',
      options: ['hypothetical', 'historic', 'hospitable']
    },
    {
      question: 'Что означает фраза "regardless of"?',
      options: ['несмотря на', 'из-за', 'вместо']
    }
  ],
  grade12: [
    {
      question: 'Выберите правильную форму: "By next semester, I ___ my thesis."',
      options: ['will have finished', 'have finished', 'will finish', 'will be finish']
    },
    {
      question: 'Как лучше завершить предложение: "The lecturer highlighted the ___ significance of the findings."',
      options: ['theoretical', 'casual', 'random']
    },
    {
      question: 'Что означает выражение "critical thinking"?',
      options: ['критическое мышление', 'критикующий взгляд', 'жесткая критика']
    },
    {
      question: 'Выберите академическую вводную фразу:',
      options: ['Firstly, it is essential to note...', 'Guys, let me tell you...', 'You know what...']
    },
    {
      question: 'Как сказать "обобщить результаты" по-английски?',
      options: ['to summarize findings', 'to forget findings', 'to hide findings']
    }
  ],
  grade13: [
    {
      question: 'Выберите фразу для начала делового совещания:',
      options: ['Let\'s align on today\'s agenda.', 'Hey folks, what\'s up?', 'Skip the agenda.']
    },
    {
      question: 'Что означает выражение "value proposition"?',
      options: ['ценностное предложение', 'ценовая монополия', 'скидочное предложение']
    },
    {
      question: 'Как корректно перевести: "Он возглавляет отдел стратегии."',
      options: ['He leads the strategy department.', 'He follow strategy depart.', 'He leave the strategic department.']
    },
    {
      question: 'Какая фраза уместна для обсуждения рисков:',
      options: ['Let\'s assess potential risks before moving forward.', 'Ignore the risks for now.', 'Hope nothing goes wrong.']
    },
    {
      question: 'Как завершить официальное письмо-предложение?',
      options: ['We look forward to your feedback.', 'Catch you later!', 'Let me know, maybe.']
    }
  ]
};

const getIntroTotalForCluster = (cluster: GradeCluster): number => {
  const bank = GRADE_INTRO_QUESTIONS[cluster] || GRADE_INTRO_QUESTIONS['grade1'];
  return 2 + bank.length;
};

const TOPIC_OPTIONS_BY_CLUSTER: Record<GradeCluster, string[]> = {
  grade1: ['Знакомство с предметом', 'Числа (1–5)', 'Основные цвета', 'Простые приветствия', 'Ничего из перечисленного'],
  grade2: ['Расширенный алфавит', 'Семья и личное', 'Животные и природа', 'Школа и учеба', 'Все темы помню плохо'],
  grade3_4: ['Времена и события', 'Путешествия и места', 'Еда и напитки', 'Спорт и игры', 'Все темы помню плохо'],
  grade5_6: ['Прошедшие события', 'Здоровье и тело', 'Технологии', 'Сравнения и описания', 'Все темы помню плохо'],
  grade7_8: ['Модальные глаголы', 'Пассивный залог', 'Сложные времена', 'Условные предложения', 'Все темы помню плохо'],
  grade9: ['Косвенная речь', 'Академические тексты', 'Эссе и аргументация', 'Сложные конструкции', 'Подготовка к ОГЭ'],
  grade10_11: ['Perfect Continuous', 'Английские идиомы', 'Академическое письмо', 'Дискуссии и дебаты', 'Подготовка к ЕГЭ'],
  grade12: ['Бизнес-английский', 'Презентации на английском', 'Деловая переписка', 'Переговоры и совещания', 'TOEFL/IELTS Speaking'],
  grade13: ['Профессиональный английский', 'Стратегические презентации', 'Формальные документы', 'Деловые переговоры', 'Продвинутая бизнес коммуникация']
};

const getTopicOptionsForCluster = (cluster: GradeCluster, language: 'english' | 'russian' = 'english'): string[] => {
  // Если выбран русский язык, берем темы из COURSE_PLANS
  if (language === 'russian') {
    // Определяем класс на основе кластера
    let gradeNumber = 1;
    switch (cluster) {
      case 'grade1': gradeNumber = 1; break;
      case 'grade2': gradeNumber = 2; break;
      case 'grade3_4': gradeNumber = 3; break; // Можно выбрать 3 или 4
      case 'grade5_6': gradeNumber = 5; break; // Можно выбрать 5 или 6
      case 'grade7_8': gradeNumber = 7; break;
      case 'grade9': gradeNumber = 9; break;
      case 'grade10_11': gradeNumber = 10; break;
      case 'grade12': gradeNumber = 12; break;
      case 'grade13': gradeNumber = 13; break;
      default: gradeNumber = 1;
    }

    // Ищем курс русского языка для этого класса
    const russianCourse = COURSE_PLANS.find(course =>
      course.title.toLowerCase().includes('русский') && course.grade === gradeNumber
    );

    if (russianCourse && russianCourse.lessons.length > 0) {
      // Возвращаем темы уроков как варианты ответов
      const topics = russianCourse.lessons.map(lesson => lesson.topic);
      // Добавляем вариант "Все темы помню плохо" и "Ничего из перечисленного"
      return [...topics, 'Все темы помню плохо', 'Ничего из перечисленного'];
    }
  }

  // Для английского языка используем старые статические опции
  return TOPIC_OPTIONS_BY_CLUSTER[cluster] || TOPIC_OPTIONS_BY_CLUSTER['grade1'];
};


const Chat = () => {
  const { isAuthenticated, user, setPersonalizedCourse } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // Adaptive assessment states
  const [isInAdaptiveMode, setIsInAdaptiveMode] = useState(false);
  const [assessmentState, setAssessmentState] = useState<'initial' | 'collecting_language' | 'collecting_grade' | 'collecting_topic' | 'interview_questions' | 'in_progress' | 'completed'>('initial');
  const [classGrade, setClassGrade] = useState('');
  const [lastTopic, setLastTopic] = useState('');
  const [currentAssessmentQuestion, setCurrentAssessmentQuestion] = useState<AssessmentQuestion | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [learningPlanText, setLearningPlanText] = useState<string>('');
  const [courseRecommendation, setCourseRecommendation] = useState<CourseRecommendation | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'error'>('checking');
  const [ttsInterrupted, setTtsInterrupted] = useState(false);
  const [currentSentence, setCurrentSentence] = useState<number>(0);
  const [totalSentences, setTotalSentences] = useState<number>(0);
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false);
  const [showSphere, setShowSphere] = useState(false);
  const [isAudioTaskActive, setIsAudioTaskActive] = useState(false);
  const [audioTaskText, setAudioTaskText] = useState('');
  const [isRecordingAudioTask, setIsRecordingAudioTask] = useState(false);
  const [isOnlineCommunication, setIsOnlineCommunication] = useState(false);
  const [isTestQuestionActive, setIsTestQuestionActive] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'russian'>('english');
  const [testQuestionData, setTestQuestionData] = useState<{
    question: string;
    options: string[];
    currentQuestion: number;
    totalQuestions: number;
  } | null>(null);
  const [isLearningPlanActive, setIsLearningPlanActive] = useState(false);
  const [selectedGradeCluster, setSelectedGradeCluster] = useState<GradeCluster>('grade1');
  const [gradeQuestionBank, setGradeQuestionBank] = useState<IntroTestQuestion[]>(GRADE_INTRO_QUESTIONS['grade1']);
  const [gradeQuestionIndex, setGradeQuestionIndex] = useState(0);

  // Lesson context management
  const [lessonContextManager] = useState(() => new LessonContextManager());
  const [isLessonMode, setIsLessonMode] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const ttsContinueRef = useRef<boolean>(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const interruptionCheckIntervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

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

  // Initialize Speech Recognition
  useEffect(() => {
    console.log('🎤 Initializing Speech Recognition...');

    // Try different ways to access Speech Recognition API
    let SpeechRecognitionConstructor: any = null;

    if ((window as any).SpeechRecognition) {
      SpeechRecognitionConstructor = (window as any).SpeechRecognition;
      console.log('✅ Found SpeechRecognition');
    } else if ((window as any).webkitSpeechRecognition) {
      SpeechRecognitionConstructor = (window as any).webkitSpeechRecognition;
      console.log('✅ Found webkitSpeechRecognition');
    } else if ((window as any).mozSpeechRecognition) {
      SpeechRecognitionConstructor = (window as any).mozSpeechRecognition;
      console.log('✅ Found mozSpeechRecognition');
    } else if ((window as any).msSpeechRecognition) {
      SpeechRecognitionConstructor = (window as any).msSpeechRecognition;
      console.log('✅ Found msSpeechRecognition');
    }

    if (SpeechRecognitionConstructor) {
      try {
        recognitionRef.current = new SpeechRecognitionConstructor();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'ru-RU';
        console.log('✅ Speech Recognition initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing Speech Recognition:', error);
      }
    } else {
      console.log('❌ No Speech Recognition API found');
    }
  }, []);

  // Cleanup camera, TTS and speech recognition on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      // Stop TTS
      OpenAITTS.stop();
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [cameraStream]);


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
  const startVoiceChat = async () => {
    setShowSphere(true);
    console.log('🚀 Starting voice chat...');
    console.log('🔍 isTTSAvailable():', isTTSAvailable());
    console.log('🔍 Speech Recognition available:', 'webkitSpeechRecognition' in window && 'SpeechRecognition' in window);
    console.log('🔍 OpenAI API key:', import.meta.env.VITE_OPENAI_API_KEY ? 'present' : 'missing');
    console.log('🔍 VITE_OPENAI_API_KEY value:', import.meta.env.VITE_OPENAI_API_KEY);

    // No start sound - keeping it silent

    if (!isTTSAvailable()) {
      alert('OpenAI API ключ не настроен. Проверьте переменные окружения.');
      console.log('❌ OpenAI API key not available');
      return;
    }

    console.log('✅ OpenAI API key available');

    console.log('🔍 Checking Speech Recognition support...');
    console.log('webkitSpeechRecognition in window:', 'webkitSpeechRecognition' in window);
    console.log('SpeechRecognition in window:', 'SpeechRecognition' in window);
    console.log('navigator.userAgent:', navigator.userAgent);
    console.log('location.protocol:', location.protocol);

    if (!recognitionRef.current) {
      const userAgent = navigator.userAgent;
      const browserName = userAgent.includes('Firefox') ? 'Firefox' :
                           userAgent.includes('Chrome') ? 'Chrome' :
                           userAgent.includes('Safari') && !userAgent.includes('Chrome') ? 'Safari' :
                           userAgent.includes('Edge') ? 'Edge' : 'неизвестный браузер';

      const isHTTPS = location.protocol === 'https:';
      const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

      let reason = '';
      if (!isHTTPS && !isLocalhost) {
        reason = '\n\nПричина: Web Speech API требует HTTPS соединения.';
      } else if (browserName === 'Safari') {
        reason = '\n\nПримечание: Safari может требовать дополнительных разрешений или обновления.';
      }

      const choice = confirm(`🎤 Ваш браузер (${browserName}) не поддерживает распознавание речи.${reason}\n\nДоступные API:\n• webkitSpeechRecognition: ${'webkitSpeechRecognition' in window}\n• SpeechRecognition: ${'SpeechRecognition' in window}\n\nВыберите режим:\n\n• OK: Текстовый ввод с голосовыми ответами\n• Отмена: Только TTS для ответов на текстовые сообщения`);

      if (choice) {
        // Текстовый режим с TTS ответами
        alert('✍️ Текстовый режим активирован!\n\nПишите вопросы в чате - AI будет отвечать голосом.\n\nДля полноценного голосового общения установите Chrome или Edge.');
        setIsTtsEnabled(true);
        console.log('📝 Text mode with TTS enabled');
      } else {
        // Только TTS для ответов
        alert('🔊 TTS режим активирован!\n\nAI будет озвучивать ответы на ваши текстовые сообщения.\n\nДля голосового ввода установите Chrome или Edge.');
        setIsTtsEnabled(true);
        console.log('🔊 TTS-only mode enabled');
      }
      return;
    }

    console.log('🔍 Checking SpeechRecognition availability...');
    if (!recognitionRef.current) {
      console.log('❌ SpeechRecognition not initialized');
      alert('Ошибка инициализации распознавания речи. Попробуйте перезагрузить страницу.');
      return;
    }
    console.log('✅ SpeechRecognition initialized');

    if (isVoiceChatActive) {
      // Stop voice chat
      setIsVoiceChatActive(false);
      setIsListening(false);
      recognitionRef.current.stop();
      OpenAITTS.stop();
      return;
    }

    // Start voice chat
    setIsVoiceChatActive(true);
    setIsListening(true);

    try {
      // Configure for continuous listening with interim results
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      let isProcessing = false;
      let finalTranscript = '';
      let interimTranscript = '';

      recognitionRef.current.onresult = async (event) => {
        interimTranscript = '';
        finalTranscript = '';

        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        console.log('Final:', finalTranscript, 'Interim:', interimTranscript);

        // Interrupt TTS immediately when user starts speaking (even with minimal interim results)
        const shouldInterrupt = (interimTranscript.trim() && interimTranscript.trim().length > 0) ||
                                 (finalTranscript.trim() && finalTranscript.trim().length > 0);

        if (shouldInterrupt && (currentAudioRef.current || isGeneratingTTS || speakingMessageId)) {
          console.log('🛑 Interrupting TTS - user started speaking');

          // Stop current audio playback
          if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
          }

          // Stop TTS generation and playback
          OpenAITTS.stop();
          ttsContinueRef.current = false;

          // Stop continuous sound if playing
          stopContinuousSound();

          // Clear all interruption check intervals
          clearAllInterruptionChecks();

          // Reset TTS state
          setIsGeneratingTTS(false);
          setSpeakingMessageId(null);
          setCurrentSentence(0);
          setTotalSentences(0);
          setTtsInterrupted(true);

          // Reset interruption flag after delay
          setTimeout(() => setTtsInterrupted(false), 1000);

          console.log('✅ TTS interrupted successfully');
        }

        // If we have a final transcript and not currently processing
        if (finalTranscript.trim() && !isProcessing) {
          isProcessing = true;
          setIsListening(false);

          try {
            // Add user message
            const userMessage: Message = {
                id: Date.now().toString(),
                role: 'user',
                content: finalTranscript.trim(),
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, userMessage]);
            setIsLoading(true);

            // Start continuous thinking sound while AI generates response
            startContinuousSound(500, 1800);

            // Get AI response using GPT-3.5-turbo for faster response with fallback

            // Создать персонализированный системный промпт для голосового чата
            const voiceSystemPrompt = `Вы - профессиональный педагог и эксперт в образовании. Ваша задача - объяснять любые темы быстро, понятно и доступно. Давайте краткие, но полные объяснения.

ВАЖНО: Пишите ВСЕ числа, даты, математические знаки и операции БУКВАМИ, а не цифрами!

Правила написания:
- Числа: "двадцать три" вместо "23", "сто пятьдесят" вместо "150"
- Даты: "двенадцатое апреля тысяча девятьсот шестьдесят первого года" вместо "12 апреля 1961 года"
- Математика: "два плюс три равно пяти" вместо "2 + 3 = 5"
- Проценты: "тридцать пять процентов" вместо "35%"
- Дроби: "три пятых" вместо "3/5"
- Степени: "два в кубе" вместо "2³"
- Производные: "производная функции эф от икс" или "дифференциал игрек по дифференциал икс" вместо "f'(x)" или "dy/dx"
- Интегралы: "интеграл от нуля до бесконечности" вместо "∫∞0"
- Суммы: "сумма от и равняется единице до бесконечности" вместо "∑∞i=1"
- Греческие буквы: "пи", "сигма", "дельта" вместо "π", "σ", "δ"

Особенности вашего стиля:
- Объясняйте сложное простыми словами
- Используйте примеры и аналогии
- Будьте кратки, но информативны
- Задавайте наводящие вопросы для лучшего понимания
- Адаптируйте объяснения под уровень ученика

КРИТИЧНО ВАЖНО ДЛЯ ГОЛОСОВОГО ЧАТА: АКТИВНО ИСПОЛЬЗУЙТЕ ИСТОРИЮ БЕСЕДЫ!
- Всегда ссылайтесь на предыдущие сообщения в разговоре
- Помните, что обсуждалось ранее в этой беседе
- Продолжайте логическую нить разговора
- Избегайте повторений уже объясненного материала
- Используйте фразы типа "как мы только что обсуждали", "продолжая нашу тему", "на основе предыдущего объяснения"
- Отвечайте в контексте всего разговора, а не изолированно

СТРУКТУРА ГОЛОСОВОГО УРОКА:
Голосовой чат НЕ поддерживает интерактивные тесты, поэтому:
- Задавайте устные вопросы и ждите ответов ученика
- Давайте краткие объяснения (2-3 предложения)
- Проводите беседу в формате "вопрос-ответ"
- Поддерживайте разговорный стиль
- После каждого объяснения спрашивайте: "Понятно? Есть вопросы?"

Память и контекст: История последних 30 сообщений передается вам. ОБЯЗАТЕЛЬНО используйте её!`;


            let response;
            try {
                response = await fetch(`${window.location.origin}/api/chat/completions`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                      {
                        role: 'system',
                        content: voiceSystemPrompt,
                      },
                      ...messages.slice(-30).map(msg => ({ // Keep last 30 messages for teacher memory context
                        role: msg.role,
                        content: msg.content,
                      })),
                      {
                        role: 'user',
                        content: finalTranscript.trim(),
                      },
                    ],
                    max_tokens: 1000, // Increased for extended teacher memory context with 30 messages
                    temperature: 0.7,
                  }),
                });
            } catch (fetchError) {
                console.error('Fetch error:', fetchError);
                throw new Error('Ошибка сети при подключении к OpenAI');
            }

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

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.choices[0].message.content,
                timestamp: new Date(),
            };

            // Mark as TTS played to prevent auto-TTS duplication
            assistantMessage.ttsPlayed = true;

            setMessages(prev => [...prev, assistantMessage]);


            // Speak the response sentence by sentence for faster TTS
            await speakTextBySentences(assistantMessage.content, assistantMessage.id);

          } catch (error) {
            console.error('Voice chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Извините, произошла ошибка. Продолжайте говорить.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
          } finally {
            setIsLoading(false);
            isProcessing = false;
            // Stop continuous thinking sound
            stopContinuousSound();

            // Resume listening after a short delay
            setTimeout(() => {
                if (isVoiceChatActive && recognitionRef.current && !OpenAITTS.isPlaying()) {
                  setIsListening(true);
                  try {
                    recognitionRef.current.start();
                  } catch (e) {
                    // Recognition might already be started, ignore
                  }
                }
            }, 500);
          }
        }
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);

        // Try to restart listening if it's a non-fatal error
        if (isVoiceChatActive && event.error !== 'not-allowed' && event.error !== 'service-not-allowed') {
          setTimeout(() => {
            if (isVoiceChatActive && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (e) {
                  console.error('Failed to restart recognition:', e);
                }
            }
          }, 1000);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);

        // Restart listening if voice chat is still active and not speaking
        if (isVoiceChatActive && !OpenAITTS.isPlaying()) {
          setTimeout(() => {
            if (isVoiceChatActive && recognitionRef.current) {
                try {
                  setIsListening(true);
                  recognitionRef.current.start();
                } catch (e) {
                  console.error('Failed to restart recognition:', e);
                }
            }
          }, 300);
        }
      };

      // Start listening
      recognitionRef.current.start();

    } catch (error) {
      console.error('Voice chat start error:', error);
      setIsVoiceChatActive(false);
      setIsListening(false);
      alert('Ошибка запуска голосового общения.');
    }
  };

  // Function to start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera if available
        audio: false
      });
      setCameraStream(stream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Не удалось получить доступ к камере. Проверьте разрешения.');
    }
  };

  // Function to stop camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Function to capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  };

  // Function to retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Function to send captured photo as task
  const sendCapturedPhoto = async () => {
    if (!capturedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Я сфотографировал задачу. Пожалуйста, реши её.',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send photo to OpenAI Vision API for task recognition and solving
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
                content: `Ты - опытный преподаватель и решатель задач. Пользователь прислал фотографию задачи. 
                
ВАЖНЫЕ ИНСТРУКЦИИ:
1. Проанализируй изображение и распознай учебную задачу
2. Покажи пошаговое решение задачи
3. Объясни каждый шаг подробно
4. Если задача математическая - покажи все вычисления
5. Если задача текстовая - разбери её структуру
6. Дай окончательный ответ
7. Если не можешь распознать задачу - попроси пользователя сделать более качественное фото

Формат ответа:
1. **Распознанная задача**: [что ты увидел на фото]
2. **Решение**:
   - Шаг 1: [первый шаг]
   - Шаг 2: [второй шаг]
   ...
3. **Ответ**: [финальный результат]`,
            },
            {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Реши задачу на этой фотографии. Покажи подробное решение.'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: capturedImage
                    }
                  }
                ]
            },
          ],
          max_tokens: 2000,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze photo task');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error analyzing photo task:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Извините, произошла ошибка при анализе фотографии задачи. Попробуйте ещё раз.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setCapturedImage(null);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };


  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  // Function to remove uploaded file
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Function to get file icon based on type
  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type === 'application/pdf') return <FileText className="w-4 h-4" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  // Function to extract text from images using OpenAI Vision API
  const extractTextFromImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;

          const response = await fetch(`${window.location.origin}/api/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  {
                    role: 'user',
                    content: [
                      {
                        type: 'text',
                        text: 'Распознай весь текст на этом изображении. Верни только распознанный текст без дополнительных комментариев.'
                      },
                      {
                        type: 'image_url',
                        image_url: {
                          url: base64Image
                        }
                      }
                    ]
                  }
                ],
                max_tokens: 1000,
                temperature: 0.1,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to process image with OpenAI');
          }

          const data = await response.json();
          const extractedText = data.choices[0].message.content.trim();

          resolve(extractedText || `Не удалось распознать текст в изображении ${file.name}.`);
        } catch (error) {
          console.error('OCR Error:', error);
          reject(new Error(`Ошибка при распознавании текста: ${error.message}`));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Function to extract text from PDF using PDF.js
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Dynamic import of PDF.js to avoid bundle bloat
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');

        fullText += pageText + '\n\n';
      }

      return fullText.trim() || `Не удалось извлечь текст из PDF файла "${file.name}". Возможно, файл содержит только изображения или имеет сложную структуру.`;

    } catch (error) {
      console.error('PDF processing error:', error);
      return `Ошибка при обработке PDF файла "${file.name}": ${error.message}. Попробуйте скопировать текст вручную из файла.`;
    }
  };

  // Function to extract text from DOCX
  const extractTextFromDOCX = async (file: File): Promise<string> => {
    // For browser environment, we'll use a temporary approach
    // In production, you'd need a server-side solution or a browser-compatible DOCX library
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`DOCX файл "${file.name}" принят для обработки. Извлечение текста из Word документов требует серверной обработки. В реальном приложении здесь будет содержимое документа, извлеченное на сервере.`);
      }, 1500);
    });
  };

  // Function to process file and extract text
  const processFile = async (file: File): Promise<string> => {
    const fileType = file.type;

    if (fileType.startsWith('image/')) {
      return await extractTextFromImage(file);
    } else if (fileType === 'application/pdf') {
      return await extractTextFromPDF(file);
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return await extractTextFromDOCX(file);
    } else {
      return `Файл ${file.name} не поддерживается для OCR.`;
    }
  };

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

  const shuffleOptions = (options: string[]): string[] => {
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const showTestQuestion = (question: string, options: string[], currentQuestion: number, totalQuestions: number) => {
    const shuffledOptions = shuffleOptions(options);
    console.log(`🎯 showTestQuestion - Q${currentQuestion}/${totalQuestions}:`, {
      question: question.substring(0, 50),
      originalOptions: options,
      shuffledOptions: shuffledOptions
    });
    setIsTestQuestionActive(true);
    setTestQuestionData({
      question,
      options: shuffledOptions,
      currentQuestion,
      totalQuestions
    });
  };

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Check OpenAI API key on mount
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        setApiKeyStatus('invalid');
        return;
      }

      // Проверяем доступность API через health endpoint сервера
      try {
        const response = await fetch(`${window.location.origin}/health`);
        if (response.ok) {
          // Если сервер отвечает, считаем что API ключ настроен
          // (фактическая проверка происходит на стороне сервера)
          setApiKeyStatus('valid');
        } else {
          setApiKeyStatus('error');
        }
      } catch (error) {
        console.error('API key check failed:', error);
        setApiKeyStatus('error');
      }
    };

    checkApiKey();
  }, []);

  // Initialize chat with welcome message and start testing immediately
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const startParam = urlParams.get('start');

    if (startParam === 'true' && messages.length === 0) {
      // Always start in testing mode
      setIsInAdaptiveMode(true);
      setAssessmentState('collecting_language');

      // Start testing immediately without welcome message - first ask about language
      setTimeout(() => {
        showTestQuestion(
          'Какой язык вы хотите изучать?',
          ['Русский язык', 'Английский язык'],
          1,
          5 // Общее количество вопросов будет 5 (язык + класс + тема + 2 интервью)
        );
      }, 500);
    }
  }, [messages.length]);

  // Format assessment results for display - only show beautiful learning plan
  const generateLevelCompletionMessage = (level: string, lastTopic: string): string => {
    const levelNum = parseInt(level) || 1;

    if (levelNum === 1 || levelNum === 2) {
      return `Отлично! Мы можем адаптировать наши занятия по английскому языку для учеников 1-2 класса. Давайте начнем с основ.

1. Алфавит

Как мы обсуждали ранее, английский алфавит состоит из 26 букв. Можем начать с того, чтобы выучить их все. Например, давайте возьмем несколько букв: A, B, C.

- A как в слове "Apple" (яблоко)
- B как в слове "Ball" (мяч)
- C как в слове "Cat" (кот)

Попробуйте произнести эти слова вслух. Есть ли у вас любимое слово на английском?

2. Простые фразы

После алфавита можно перейти к простым фразам. Например: "Hello!" (Привет!) и "My name is…" (Меня зовут…).

Попробуйте сказать: "Hello! My name is…". Как вы думаете, как можно использовать эти фразы в повседневной жизни?

3. Играем

Давайте сделаем это интересным! Мы можем сыграть в игру: я называю букву, а вы должны придумать слово, которое начинается на эту букву. Например, если я скажу "D", вы можете сказать "Dog" (собака).

Как вы думаете, это будет весело?

Дайте знать, о чем вы хотите поговорить дальше или что вам интересно!`;
    }

    // Default message for other levels
    return `Отлично! Мы определили ваш уровень английского языка. Теперь можем начать персонализированное обучение!

🎯 **Ваш уровень:** ${level}
📚 **Последняя тема:** ${lastTopic || 'Начнем с основ'}

Давайте начнем с интересных упражнений и заданий, адаптированных под ваш уровень!

Дайте знать, о чем вы хотите поговорить или что вам интересно изучить!`;
  };

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

  const BASE_INTRO_PROFILE: { concept: string; p: number }[] = [
    { concept: 'greetings_basic', p: 1.0 },
    { concept: 'numbers_1_5', p: 0.4 },
    { concept: 'colors_basic', p: 0.2 },
    { concept: 'alphabet_A_G', p: 0.2 },
    { concept: 'family_basic', p: 0.3 }
  ];

  const INTRO_PROFILE_BY_CLUSTER: Partial<Record<GradeCluster, { concept: string; p: number }[]>> = {
    grade1: BASE_INTRO_PROFILE,
    grade2: [
      { concept: 'greetings_basic', p: 0.8 },
      { concept: 'numbers_1_20', p: 0.4 },
      { concept: 'colors_basic', p: 0.3 },
      { concept: 'full_alphabet', p: 0.3 },
      { concept: 'family_basic', p: 0.2 }
    ],
    grade3_4: [
      { concept: 'present_simple', p: 0.5 },
      { concept: 'to_be_full', p: 0.4 },
      { concept: 'have_got', p: 0.4 },
      { concept: 'prepositions_place', p: 0.3 },
      { concept: 'reading_2_3_sent', p: 0.3 }
    ],
    grade5_6: [
      { concept: 'past_simple_regular', p: 0.4 },
      { concept: 'comparative', p: 0.4 },
      { concept: 'present_continuous', p: 0.3 },
      { concept: 'have_got', p: 0.3 },
      { concept: 'prepositions_place', p: 0.3 }
    ],
    grade7_8: [
      { concept: 'present_perfect', p: 0.4 },
      { concept: 'modals_basic', p: 0.4 },
      { concept: 'reported_speech', p: 0.3 },
      { concept: 'zero_conditional', p: 0.3 },
      { concept: 'past_simple_regular', p: 0.2 }
    ],
    grade9: [
      { concept: 'passive_present', p: 0.4 },
      { concept: 'reported_speech', p: 0.4 },
      { concept: 'present_perfect', p: 0.3 },
      { concept: 'modals_basic', p: 0.3 },
      { concept: 'past_simple_regular', p: 0.2 }
    ],
    grade10_11: [
      { concept: 'academic_vocab', p: 0.4 },
      { concept: 'passive_voice_advanced', p: 0.3 },
      { concept: 'reported_speech', p: 0.4 },
      { concept: 'cohesive_devices', p: 0.3 },
      { concept: 'presentation_skills', p: 0.2 }
    ],
    grade12: [
      { concept: 'future_perfect', p: 0.4 },
      { concept: 'academic_vocab', p: 0.4 },
      { concept: 'passive_voice_advanced', p: 0.3 },
      { concept: 'reported_speech', p: 0.3 },
      { concept: 'cohesive_devices', p: 0.3 }
    ],
    grade13: [
      { concept: 'business_english', p: 0.4 },
      { concept: 'negotiations_language', p: 0.4 },
      { concept: 'emails_formal', p: 0.3 },
      { concept: 'idioms_advanced', p: 0.3 },
      { concept: 'presentation_skills', p: 0.3 }
    ]
  };

  const translateConcept = (concept: string): string => {
    if (conceptLabels[concept]) {
      return conceptLabels[concept];
    }
    return concept
      .replace(/_/g, ' ')
      .replace(/\b([a-z])/g, (_, letter) => letter.toUpperCase())
      .trim();
  };

  const formatAssessmentResults = (result: AssessmentResult, recommendation?: CourseRecommendation | null): string => {
    let text = 'Ваш персональный план обучения\n\n';

    // Show grade and last topic
    text += `Ваш уровень: Класс ${result.classGrade}\n`;
    text += `Последняя изученная тема: ${result.lastTopic || 'Начнем с основ'}\n\n`;

    // If we have a course recommendation, show it
    if (recommendation) {
      text += `🎯 Рекомендуемый курс: ${recommendation.plan.title}\n\n`;
      text += `${recommendation.reasoning}\n\n`;

      // Show the recommended lesson details
      text += `📖 Рекомендуемый урок:\n`;
      text += `Урок ${recommendation.recommendedLessonNumber}: ${recommendation.recommendedLesson.title}\n`;
      text += `Тема: ${recommendation.recommendedLesson.topic}\n`;
      text += `Уровень сложности: ${recommendation.recommendedLesson.difficulty === 'beginner' ? 'начальный' : recommendation.recommendedLesson.difficulty === 'intermediate' ? 'средний' : 'продвинутый'}\n\n`;
      text += `Основные аспекты:\n${recommendation.recommendedLesson.aspects}\n\n`;

      // Show lesson modules
      text += `📚 Модули урока:\n`;
      recommendation.lessonModules.forEach(module => {
        const typeIcon = {
          conspectus: '📋',
          theory: '📖',
          practice: '✏️',
          test: '✅'
        }[module.type] || '📄';

        text += `${typeIcon} ${module.number}. ${module.title}`;
        if (module.estimatedTime) {
          text += ` (${module.estimatedTime} мин)`;
        }
        text += '\n';
      });
      text += '\n';

      // Show what to expect in the course
      text += 'Что вас ждет в курсе:\n';
      text += '• Структурированная программа обучения\n';
      text += '• Систематическое изучение материала\n';
      text += '• Практические задания и упражнения\n';
      text += '• Отслеживание прогресса\n';
      if (recommendation.plan.grade === 90 || recommendation.plan.grade === 100) {
        text += '• Экзаменационная подготовка\n';
        text += '• Стратегии выполнения заданий\n';
      }
    } else {
      // Fallback to old 2-week plan format if no recommendation
      text += '2-недельная программа развития\n\n';

    result.plan2w.forEach(session => {
      if (session.targets.length > 0) {
        const week = Math.ceil(session.session / 2);
        const lessonNum = session.session % 2 === 1 ? 1 : 2;
          text += `Неделя ${week} - Занятие ${lessonNum}\n`;
        const translatedTargets = session.targets.map(translateConcept);
          text += `Основные темы: ${translatedTargets.join(', ')}\n`;
          text += `Подход: Повторение ${Math.round(session.mix.review * 100)}% | Практика ${Math.round(session.mix.weak * 100)}% | Новое ${Math.round(session.mix.new * 100)}%\n\n`;
      }
    });

      text += 'Что вас ждет:\n';
    text += '• Интерактивные упражнения\n';
    text += '• Персонализированные задания\n';
    text += '• Игровые элементы обучения\n';
      text += '• Отслеживание прогресса\n';
    }

    return text;
  };

  const completeIntroAssessment = () => {
    setAssessmentState('in_progress');
    setQuestionCount(0);
    setGradeQuestionIndex(0);

    // For now, just show completion message and learning plan
    // TODO: Integrate with actual adaptive assessment
    setTimeout(async () => {
      const cluster = mapGradeToCluster(classGrade);
      console.log('🎯 Assessment Debug:', {
        inputClassGrade: classGrade,
        detectedCluster: cluster,
        questionsCount: GRADE_INTRO_QUESTIONS[cluster]?.length || 0
      });
      const profileTemplate = INTRO_PROFILE_BY_CLUSTER[cluster] || BASE_INTRO_PROFILE;
      const profile = profileTemplate.map(item => ({ ...item }));
      const plan2w = buildTwoWeekPlan(profile, cluster);

      const mockResult: AssessmentResult = {
        classGrade: classGrade,
        lastTopic: lastTopic,
        cluster: cluster,
        profile: profile,
        plan2w: plan2w,
        timestamp: new Date()
      };

      setAssessmentState('completed');
      setAssessmentResult(mockResult);

      // Generate learning plan
      await generateLearningPlan(mockResult);
    }, 1000);
  };

  // Generate learning plan and show it
  const generateLearningPlan = async (result: AssessmentResult) => {
    console.log('🎓 Generating learning plan:', result);

    // Get course recommendation based on assessment results
    const recommendation = getCourseRecommendation(result);
    setCourseRecommendation(recommendation);

    // Save learning plan text for display in test interface
    const planText = formatAssessmentResults(result, recommendation);
    setLearningPlanText(planText);

    // Show learning plan confirmation buttons
    setTimeout(() => {
      setIsLearningPlanActive(true);
    }, 500);
  };

  // Global keyboard shortcuts for TTS control
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape or Space to stop TTS
      if ((event.key === 'Escape' || event.key === ' ') && OpenAITTS.isPlaying()) {
        event.preventDefault();
        OpenAITTS.stop();
        console.log('🛑 TTS stopped by keyboard shortcut');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);


  // Check if message contains audio task keywords
  const checkForAudioTask = (message: string): { isAudioTask: boolean; taskText: string } => {
    const audioTaskPatterns = [
      /повторим?\s+все/i,
      /повтори\s+за\s+мной/i,
      /проговори/i,
      /скажи\s+по-английски/i,
      /произнеси/i,
      /повтори\s+цвета/i,
      /повтори\s+числа/i,
      /давай\s+повторим/i,
      /теперь\s+повторим/i,
      /попробуем\s+снова/i
    ];

    const isAudioTask = audioTaskPatterns.some(pattern => pattern.test(message));
    let taskText = '';

    if (isAudioTask) {
      // Extract the specific task from the message
      if (message.includes('повтори')) {
        const match = message.match(/повтори[^\n]*/i);
        if (match) taskText = match[0];
      } else if (message.includes('проговори')) {
        const match = message.match(/проговори[^\n]*/i);
        if (match) taskText = match[0];
      } else if (message.includes('скажи')) {
        const match = message.match(/скажи[^\n]*/i);
        if (match) taskText = match[0];
      } else {
        taskText = 'Выполни задание голосом';
      }
    }

    return { isAudioTask, taskText };
  };

  // Check if message contains test question with options
  const checkForLearningPlan = (message: string): { isLearningPlan: boolean } => {
    // Check if message contains learning plan with "Готовы начать обучение?" question
    const hasPlan = message.includes('2-недельный план обучения:') || message.includes('📋 Темы:');
    const hasQuestion = message.includes('🚀 Готовы начать обучение?');

    return {
      isLearningPlan: hasPlan && hasQuestion
    };
  };

  const checkForTestQuestion = (message: string): { isTestQuestion: boolean; questionData?: { question: string; options: string[]; currentQuestion: number; totalQuestions: number } } => {
    const testQuestionPattern = /Вопрос\s+(\d+)\/(\d+):/i;
    const match = message.match(testQuestionPattern);

    if (!match) {
      return { isTestQuestion: false };
    }

    const currentQuestion = parseInt(match[1]);
    const totalQuestions = parseInt(match[2]);

    // First, check if this is from adaptive assessment and has structured options
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && currentAssessmentQuestion?.options) {
      return {
        isTestQuestion: true,
        questionData: {
          question: currentAssessmentQuestion.prompt,
          options: currentAssessmentQuestion.options,
          currentQuestion: currentQuestion,
          totalQuestions: totalQuestions
        }
      };
    }

    // Fallback: Look for options in parentheses like (in/on/under)
    const optionsMatch = message.match(/\(([^)]+)\)/);
    if (!optionsMatch) {
      return { isTestQuestion: false };
    }

    // Extract options
    const optionsText = optionsMatch[1];
    const options = optionsText.split('/').map(opt => opt.trim());

    // Extract the question text (everything before the options)
    const questionText = message.split('(')[0].trim();

    return {
      isTestQuestion: true,
      questionData: {
        question: questionText,
        options: options,
        currentQuestion: currentQuestion,
        totalQuestions: totalQuestions
      }
    };
  };

  // Handle audio task recording
  const startAudioTaskRecording = () => {
    if (!('webkitSpeechRecognition' in window && 'SpeechRecognition' in window)) {
      alert('Ваш браузер не поддерживает распознавание речи');
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Listen for English speech
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsRecordingAudioTask(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Audio task transcript:', transcript);
      setInputMessage(transcript);
      setIsAudioTaskActive(false);
      setAudioTaskText('');
      setIsRecordingAudioTask(false);
      // Auto-send the message
      setTimeout(() => {
        sendMessage();
      }, 100);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecordingAudioTask(false);
      alert('Ошибка распознавания речи. Попробуйте ещё раз.');
    };

    recognition.onend = () => {
      setIsRecordingAudioTask(false);
    };

    recognition.start();
  };

  // Handle test question answer selection
  const handleTestAnswer = async (selectedAnswer: string) => {
    console.log('🧪 handleTestAnswer called with:', selectedAnswer);
    console.log('🧪 isInAdaptiveMode:', isInAdaptiveMode);
    console.log('🧪 isTestQuestionActive:', isTestQuestionActive);
    console.log('🧪 assessmentState:', assessmentState);

    // Handle language selection
    if (isTestQuestionActive && testQuestionData?.currentQuestion === 1 && assessmentState === 'collecting_language') {
      console.log('🧪 Handling language selection:', selectedAnswer);

      // Set the selected language
      if (selectedAnswer === 'Русский язык') {
        setSelectedLanguage('russian');
      } else if (selectedAnswer === 'Английский язык') {
        setSelectedLanguage('english');
      }

      // Hide current test and show grade question
      setIsTestQuestionActive(false);
      setTestQuestionData(null);

      // Show next question: "В каком ты классе учишься?"
      setTimeout(() => {
        showTestQuestion(
          'В каком ты классе учишься?',
          ['1-2 класс', '3-4 класс', '5-6 класс', '7-8 класс', '9-10 класс', '11 класс', 'Учусь в вузе', 'Окончил вуз'],
          2,
          5
        );

        // Update assessment state to collecting_grade
        setAssessmentState('collecting_grade');
      }, 500);

      return;
    }

    // Handle introductory test level selection
    if (isTestQuestionActive && testQuestionData?.currentQuestion === 2 && assessmentState === 'collecting_grade') {
      console.log('🧪 Handling introductory test level selection');

      // Set the selected level
      setClassGrade(selectedAnswer);
      setLastTopic(''); // Reset last topic
      const cluster = mapGradeToCluster(selectedAnswer);
      console.log('🎯 Grade Selection Debug:', {
        userInput: selectedAnswer,
        detectedCluster: cluster,
        questionsAvailable: GRADE_INTRO_QUESTIONS[cluster]?.length || 0,
        fallbackUsed: !GRADE_INTRO_QUESTIONS[cluster]
      });
      setSelectedGradeCluster(cluster);
      const clusterQuestions = GRADE_INTRO_QUESTIONS[cluster] || GRADE_INTRO_QUESTIONS['grade1'];
      const totalQuestions = 2 + clusterQuestions.length;
      setGradeQuestionBank(clusterQuestions);
      setGradeQuestionIndex(0);

      // Hide current test and show topic question
      setIsTestQuestionActive(false);
      setTestQuestionData(null);

      // Show next question: "What was the last thing you studied?"
      setTimeout(() => {
        const topicOptions = getTopicOptionsForCluster(cluster, selectedLanguage);
        console.log('📚 Topic question - Cluster:', cluster, 'Language:', selectedLanguage, 'Options:', topicOptions);
        showTestQuestion(
          selectedLanguage === 'russian' ? 'Что последним проходил(а) по русскому?' : 'Что последним проходил(а) по английскому?',
          topicOptions,
          3,
          totalQuestions
        );

        // Update assessment state to collecting_topic
        setAssessmentState('collecting_topic');
      }, 500);

      return;
    }

    // Handle introductory test topic selection
    if (isTestQuestionActive && testQuestionData?.currentQuestion === 3 && assessmentState === 'collecting_topic') {
      console.log('🧪 Handling introductory test topic selection');

      // Set the selected last topic
      setLastTopic(selectedAnswer);
      const cluster = selectedGradeCluster;
      const clusterQuestions =
        gradeQuestionBank.length > 0 ? gradeQuestionBank : (GRADE_INTRO_QUESTIONS[cluster] || GRADE_INTRO_QUESTIONS['grade1']);
      const totalQuestions = 2 + clusterQuestions.length;
      setGradeQuestionBank(clusterQuestions);
      setGradeQuestionIndex(0);

      // Hide current test and start assessment
      setIsTestQuestionActive(false);
      setTestQuestionData(null);

      // Start the adaptive assessment with interview questions
      setTimeout(() => {
        if (clusterQuestions.length === 0) {
          completeIntroAssessment();
        } else {
          setAssessmentState('interview_questions');
          setQuestionCount(3);
          const firstQuestion = clusterQuestions[0];
          showTestQuestion(firstQuestion.question, firstQuestion.options, 3, totalQuestions);
        }
      }, 500);

      return;
    }

    // Handle interview questions
    if (isInAdaptiveMode && assessmentState === 'interview_questions') {
      console.log('🧪 Handling interview question answer');
      const currentIndex = gradeQuestionIndex;
      const totalQuestions = 2 + gradeQuestionBank.length;

      // Process answer and prepare for next question
      setIsTestQuestionActive(false);
      setTestQuestionData(null);

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < gradeQuestionBank.length) {
          setGradeQuestionIndex(nextIndex);
          setQuestionCount(3 + nextIndex);
          const nextQuestion = gradeQuestionBank[nextIndex];
          showTestQuestion(nextQuestion.question, nextQuestion.options, 3 + nextIndex, totalQuestions);
        } else {
          // Finish interview and start assessment
          completeIntroAssessment();
        }
      }, 500); // Small delay for smooth transition

      return;
    }

    // Directly resolve assessment promise if in adaptive mode
    if (isInAdaptiveMode && window._assessmentResolver) {
      console.log('🧪 Resolving adaptive assessment');
      window._assessmentResolver(selectedAnswer);
      setIsTestQuestionActive(false);
      setTestQuestionData(null);
      return;
    }

    // For test questions in regular chat, send directly
    console.log('🧪 Sending test answer directly');
    
    // Add user answer to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: selectedAnswer,
      timestamp: new Date(),
    };

    // Hide test UI immediately
    setIsTestQuestionActive(false);
    setTestQuestionData(null);
    setIsLoading(true);

    // Add message and send to AI
    setMessages(prev => [...prev, userMessage]);
    
    // Send the answer to AI
    await sendDirectTestAnswer(selectedAnswer);
  };

  // Handle learning plan confirmation
  const handleLearningPlanConfirm = () => {
    console.log('✅ Learning plan confirmed - navigating to personalized course page');
    console.log('📚 Course recommendation:', courseRecommendation);

    setIsLearningPlanActive(false);

    if (!assessmentResult) {
      console.log('❌ No assessment result, navigating to home');
      navigate('/');
      return;
    }

    // Create a personalized course object from the assessment result
    // Determine difficulty level based on cluster
    let courseDifficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (assessmentResult.cluster.includes('grade3_4') || assessmentResult.cluster.includes('grade5_6')) {
      courseDifficulty = 'intermediate';
    } else if (assessmentResult.cluster !== 'grade1' && assessmentResult.cluster !== 'grade2') {
      courseDifficulty = 'advanced';
    }

    // Use lessons from the course plan if available
    let modules: any[] = [];
    
    if (courseRecommendation && courseRecommendation.plan && courseRecommendation.plan.lessons) {
      console.log('📖 Using real course plan lessons');
      const coursePlan = courseRecommendation.plan;
      
      // Divide lessons into modules (approximately 2-3 lessons per module)
      const lessonsPerModule = 2;
      modules = [];
      
      for (let i = 0; i < coursePlan.lessons.length; i += lessonsPerModule) {
        const moduleLessons = coursePlan.lessons.slice(i, i + lessonsPerModule);
        const moduleNumber = Math.floor(i / lessonsPerModule) + 1;
        
        // Get the topics from lesson titles
        const topics = moduleLessons.map(lesson => lesson.topic).join(', ');
        
        modules.push({
          title: `Неделя ${Math.ceil(moduleNumber / 2)} - Занятие ${moduleNumber}`,
          description: `Темы: ${topics}`,
          lessons: moduleLessons.map(lesson => `${lesson.number}. ${lesson.title}`)
        });
      }
    } else {
      console.log('⚠️ No course plan found, generating default lessons');
      // Fallback to generated lessons if no real course plan
      modules = assessmentResult.plan2w.map((session, idx) => {
        const lessons: string[] = [];
        const lessonsPerConcept = Math.max(5, Math.ceil(12 / session.targets.length));

        session.targets.forEach(concept => {
          for (let i = 1; i <= lessonsPerConcept; i++) {
            const lessonTypes = [
              'Введение',
              'Теория',
              'Практика',
              'Задания',
              'Тест',
              'Материалы',
              'Закрепление'
            ];
            const lessonTitle = lessonTypes[(i - 1) % lessonTypes.length];
            const translatedConcept = translateConcept(concept).replace(/["']/g, '').trim();
            lessons.push(`${translatedConcept} - ${lessonTitle} ${i}`);
          }
        });

        const finalLessons = lessons.slice(0, Math.min(15, Math.max(10, lessons.length)));

        return {
          title: `Неделя ${Math.ceil(session.session / 2)} - Занятие ${session.session}`,
          description: `Основные темы: ${session.targets.map(t => translateConcept(t)).join(', ')}`,
          lessons: finalLessons
        };
      });
    }

    const personalizedCourse = {
      id: `course-${Date.now()}`,
      title: courseRecommendation?.plan?.title || `Персональный курс английского - ${assessmentResult.classGrade}`,
      description: courseRecommendation?.plan?.description || `Разработан специально для вас на основе теста`,
      topics: assessmentResult.profile.map(p => p.concept),
      difficulty: courseDifficulty,
      estimatedHours: 40,
      modules: modules
    };

    // Save the course to the auth context
    setPersonalizedCourse(personalizedCourse);

    // Navigate to the personalized course page
    navigate('/personalized-course');
  };

  // Handle retake assessment
  const handleRetakeAssessment = () => {
    console.log('🔄 Retaking assessment');

    // Reset learning plan state
    setIsLearningPlanActive(false);
    setAssessmentResult(null);

    // Reset adaptive assessment state
    setIsInAdaptiveMode(true);
    setAssessmentState('collecting_grade');
    setQuestionCount(0);
    setClassGrade('');
    setLastTopic('');
    setIsTestQuestionActive(false);
    setTestQuestionData(null);
    setSelectedGradeCluster('grade1');
    setGradeQuestionBank(GRADE_INTRO_QUESTIONS['grade1']);
    setGradeQuestionIndex(0);
    const defaultTotalQuestions = getIntroTotalForCluster('grade1');

    // Start introductory test again
    setTimeout(() => {
      showTestQuestion(
        'В каком ты классе учишься?',
        ['1-2 класс', '3-4 класс', '5-6 класс', '7-8 класс', '9-10 класс', '11 класс', 'Учусь в вузе', 'Окончил вуз'],
        1,
        defaultTotalQuestions
      );
    }, 300);
  };

  // Send test answer directly to AI
  const sendDirectTestAnswer = async (answer: string) => {
    try {
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
- Используйте фразы типа "как мы обсуждали ранее", "продолжая нашу тему", "на основе предыдущего объяснения"

КОНТЕКСТ ОБУЧЕНИЯ: Ученик выбрал курс "Английский язык". Вы преподаете именно английскому языку. Все объяснения и примеры должны быть связаны с этим предметом.`;

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
                content: systemPrompt,
            },
            ...messages.slice(-29).map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: 'user',
                content: answer
            }
          ],
          max_tokens: 2000,
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
        id: Date.now().toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending test answer:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке ответа.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipTest = async () => {
    console.log('🧪 handleSkipTest called');
    console.log('🧪 isInAdaptiveMode:', isInAdaptiveMode);
    console.log('🧪 assessmentState:', assessmentState);
    console.log('🧪 testQuestionData?.currentQuestion:', testQuestionData?.currentQuestion);

    // Handle skip in interview questions phase
    if (isInAdaptiveMode && assessmentState === 'interview_questions') {
      console.log('🧪 Skipping interview question');
      const currentIndex = gradeQuestionIndex;
      const totalQuestions = 2 + gradeQuestionBank.length;

      // Move to next question or finish
      setIsTestQuestionActive(false);
      setTestQuestionData(null);

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < gradeQuestionBank.length) {
          setGradeQuestionIndex(nextIndex);
          setQuestionCount(3 + nextIndex);
          const nextQuestion = gradeQuestionBank[nextIndex];
          console.log('🧪 Showing next interview question:', nextQuestion.question);
          showTestQuestion(nextQuestion.question, nextQuestion.options, 3 + nextIndex, totalQuestions);
        } else {
          // Finish interview and start assessment
          console.log('🧪 Interview complete, finishing assessment');
          completeIntroAssessment();
        }
      }, 500);
      return;
    }

    // Handle skip for grade selection question
    if (isInAdaptiveMode && assessmentState === 'collecting_grade' && testQuestionData?.currentQuestion === 1) {
      console.log('🧪 Skipping grade selection, using default');
      // Set default grade and continue
      setClassGrade('1 класс');
      setLastTopic('');
      const cluster = mapGradeToCluster('1 класс');
      setSelectedGradeCluster(cluster);
      const clusterQuestions = GRADE_INTRO_QUESTIONS[cluster] || GRADE_INTRO_QUESTIONS['grade1'];
      const totalQuestions = 2 + clusterQuestions.length;
      setGradeQuestionBank(clusterQuestions);
      setGradeQuestionIndex(0);

      setIsTestQuestionActive(false);
      setTestQuestionData(null);

      setTimeout(() => {
        const topicOptions = getTopicOptionsForCluster(cluster, selectedLanguage);
        showTestQuestion(
          selectedLanguage === 'russian' ? 'Что последним проходил(а) по русскому?' : 'Что последним проходил(а) по английскому?',
          topicOptions,
          3,
          totalQuestions
        );
        setAssessmentState('collecting_topic');
      }, 500);
      return;
    }

    // Handle skip for topic selection question
    if (isInAdaptiveMode && assessmentState === 'collecting_topic' && testQuestionData?.currentQuestion === 3) {
      console.log('🧪 Skipping topic selection, using default');
      // Set default topic and continue
      setLastTopic('Ничего из перечисленного');
      const cluster = selectedGradeCluster;
      const clusterQuestions =
        gradeQuestionBank.length > 0 ? gradeQuestionBank : (GRADE_INTRO_QUESTIONS[cluster] || GRADE_INTRO_QUESTIONS['grade1']);
      const totalQuestions = 2 + clusterQuestions.length;
      setGradeQuestionBank(clusterQuestions);
      setGradeQuestionIndex(0);

      setIsTestQuestionActive(false);
      setTestQuestionData(null);

      setTimeout(() => {
        if (clusterQuestions.length === 0) {
          completeIntroAssessment();
        } else {
          setAssessmentState('interview_questions');
          setQuestionCount(3);
          const firstQuestion = clusterQuestions[0];
          showTestQuestion(firstQuestion.question, firstQuestion.options, 3, totalQuestions);
        }
      }, 500);
      return;
    }

    // Directly resolve assessment promise if in adaptive mode
    if (isInAdaptiveMode && window._assessmentResolver) {
      console.log('🧪 Resolving skip in adaptive assessment');
      window._assessmentResolver('Пропустить');
      setIsTestQuestionActive(false);
      setTestQuestionData(null);
      return;
    }

    // For test questions in regular chat, send skip directly
    console.log('🧪 Sending skip action directly');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Пропустить',
      timestamp: new Date(),
    };

    // Hide test UI immediately
    setIsTestQuestionActive(false);
    setTestQuestionData(null);
    setIsLoading(true);

    // Add message and send to AI
    setMessages(prev => [...prev, userMessage]);
    
    // Send the skip action to AI
    await sendDirectTestAnswer('Пропустить');
  };

  // Handle new assistant message to check for audio tasks, test questions, and learning plans
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.ttsPlayed) {
      // Check for learning plan first (highest priority)
      const { isLearningPlan } = checkForLearningPlan(lastMessage.content);
      if (isLearningPlan) {
        console.log('📚 Learning plan detected - showing confirmation buttons');
        setIsLearningPlanActive(true);

        // Mark message as processed to prevent re-processing
        lastMessage.ttsPlayed = true;
        return;
      }

      // Check for audio tasks
      const { isAudioTask, taskText } = checkForAudioTask(lastMessage.content);
      if (isAudioTask) {
        setIsAudioTaskActive(true);
        setAudioTaskText(taskText || 'Выполни задание голосом');
      } else {
        // Check for test questions
        // Temporarily disable automatic test question conversion to prevent interference with normal chat
        // const { isTestQuestion, questionData } = checkForTestQuestion(lastMessage.content);
        // if (isTestQuestion && questionData) {
        //   // Convert text test question to interactive test
        //   console.log('🧪 Converting text test question to interactive test:', questionData);
        //   setIsTestQuestionActive(true);
        //   setTestQuestionData(questionData);

        //   // Mark message as processed to prevent re-processing
        //   lastMessage.ttsPlayed = true;
        // }
      }
    }
  }, [messages]);

  // Function to handle lesson questions with context
  const sendLessonQuestion = async () => {
    if ((!inputMessage.trim() && uploadedFiles.length === 0) || isLoading || isProcessingFile) return;
    const currentLessonContext = lessonContextManager.getCurrentContext();
    if (!currentLessonContext) return;

    // Stop any ongoing TTS and sounds when user sends a new message
    if (OpenAITTS.isPlaying()) {
      OpenAITTS.stop();
      console.log('🛑 TTS stopped due to new user message');
    }
    stopContinuousSound();

    let messageContent = inputMessage;
    const fileContents: string[] = [];

    // Process uploaded files first
    if (uploadedFiles.length > 0) {
      setIsProcessingFile(true);
      try {
        for (const file of uploadedFiles) {
          const extractedText = await processFile(file);
          fileContents.push(`\n\n--- Содержимое файла ${file.name} ---\n${extractedText}`);
        }
        messageContent += fileContents.join('\n');
      } catch (error) {
        console.error('Error processing files:', error);
        messageContent += '\n\nОшибка при обработке файлов.';
      } finally {
        setIsProcessingFile(false);
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setUploadedFiles([]); // Clear uploaded files after sending
    setIsLoading(true);

    // Get lesson-aware system prompt from context manager
    const lessonSystemPrompt = lessonContextManager.getSystemPrompt();
    if (!lessonSystemPrompt) {
      console.error('No lesson system prompt available');
      return;
    }

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
                content: lessonSystemPrompt,
            },
            ...messages.slice(-25).map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: 'user',
                content: userMessage.content,
            },
          ],
          max_tokens: 1500,
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
      console.error('Error sending lesson question:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке вашего вопроса. Попробуйте еще раз или продолжайте урок.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Focus back to input after response
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const sendMessage = async () => {
    if ((!inputMessage.trim() && uploadedFiles.length === 0) || isLoading || isProcessingFile) return;

    // Stop any ongoing TTS and sounds when user sends a new message
    if (OpenAITTS.isPlaying()) {
      OpenAITTS.stop();
      console.log('🛑 TTS stopped due to new user message');
    }
    stopContinuousSound();

    let messageContent = inputMessage;
    const fileContents: string[] = [];

    // Process uploaded files first
    if (uploadedFiles.length > 0) {
      setIsProcessingFile(true);
      try {
        for (const file of uploadedFiles) {
          const extractedText = await processFile(file);
          fileContents.push(`\n\n--- Содержимое файла ${file.name} ---\n${extractedText}`);
        }
        messageContent += fileContents.join('\n');
      } catch (error) {
        console.error('Error processing files:', error);
        messageContent += '\n\nОшибка при обработке файлов.';
      } finally {
        setIsProcessingFile(false);
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setUploadedFiles([]); // Clear uploaded files after sending
    setIsLoading(true);

    // Handle adaptive assessment mode
    if (isInAdaptiveMode) {
      if (assessmentState === 'collecting_grade') {
        setClassGrade(messageContent);
        const cluster = mapGradeToCluster(messageContent);
        console.log('🎯 Text Input Grade Debug:', {
          userInput: messageContent,
          detectedCluster: cluster,
          questionsAvailable: GRADE_INTRO_QUESTIONS[cluster]?.length || 0,
          fallbackUsed: !GRADE_INTRO_QUESTIONS[cluster]
        });
        setSelectedGradeCluster(cluster);
        const clusterQuestions = GRADE_INTRO_QUESTIONS[cluster] || GRADE_INTRO_QUESTIONS['grade1'];
        setGradeQuestionBank(clusterQuestions);
        setGradeQuestionIndex(0);
        const totalQuestions = 2 + clusterQuestions.length;
        setAssessmentState('collecting_topic');

        // Show topic question as interactive test instead of chat message
        const topicOptions = getTopicOptionsForCluster(cluster, selectedLanguage);
        showTestQuestion(selectedLanguage === 'russian' ? 'Что последним проходил(а) по русскому?' : 'Что последним проходил(а) по английскому?', topicOptions, 1, totalQuestions);

        setIsLoading(false);
        return;
      } else if (assessmentState === 'collecting_topic') {
        setLastTopic(messageContent);

        // Instead of starting adaptive assessment immediately, show next interview question
        setAssessmentState('interview_questions');
        setQuestionCount(1);

        // Show next interview question as interactive test
        showTestQuestion(
          'Что значит "Hello" по-русски?',
          ['привет', 'до свидания', 'спасибо'],
          3,
          8
        );

        setIsLoading(false);
        return;
      } else if (assessmentState === 'in_progress' && currentAssessmentQuestion) {
        // User answered the question - resolve the promise
        // Do not clear currentAssessmentQuestion or reset questionCount
        if (window._assessmentResolver) {
          window._assessmentResolver(messageContent);
        }
        // Return to allow adaptive loop to progress to the next question
        return;
      }
    }

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
          model: 'gpt-4o-mini',
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
          max_tokens: 2000,
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
      // Focus back to input after response
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  // Functions for lesson mode management
  const startLessonMode = (lessonData: {
    lessonId: string;
    currentTopic: string;
    lessonProgress?: string;
  }) => {
    lessonContextManager.startLesson(lessonData);
    setIsLessonMode(true);
    console.log('📚 Lesson mode activated:', lessonData);
  };

  const updateLessonBlock = (block: LessonBlock, blockIndex?: number, totalBlocks?: number) => {
    lessonContextManager.updateCurrentBlock(block, blockIndex, totalBlocks);
    console.log('📖 Lesson block updated:', block.title);
  };

  const endLessonMode = () => {
    lessonContextManager.endLesson();
    setIsLessonMode(false);
    console.log('📚 Lesson mode deactivated');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isLessonMode && lessonContextManager.getCurrentContext()) {
        sendLessonQuestion();
      } else {
        sendMessage();
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to auth
  }


  // Animated Sphere Component
  const AnimatedSphere = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
      <div className="relative">
        {/* Main sphere */}
        <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          <div className="absolute inset-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full opacity-80 animate-ping"></div>
          <div className="absolute inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-60 animate-bounce"></div>
        </div>

        {/* Orbiting elements */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"></div>
        </div>

        {/* Calm orbiting elements */}
        <div className="absolute inset-0" style={{
          animation: 'gentle-orbit 8s linear infinite'
        }}>
          <div className="w-2 h-2 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full absolute opacity-70 shadow-lg"
                 style={{
                   left: '50%',
                   top: '50%',
                   transform: 'translate(-50%, -50%) translateX(-80px)',
                   animation: 'float-glow 4s ease-in-out infinite alternate'
                 }}>
          </div>
        </div>

        <div className="absolute inset-0" style={{
          animation: 'gentle-orbit 8s linear infinite reverse'
        }}>
          <div className="w-1.8 h-1.8 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full absolute opacity-60 shadow-lg"
                 style={{
                   left: '50%',
                   top: '50%',
                   transform: 'translate(-50%, -50%) translateX(75px)',
                   animation: 'float-glow 3.5s ease-in-out infinite alternate reverse'
                 }}>
          </div>
        </div>

        {/* Back to chat button */}
        <Button
          onClick={() => setShowSphere(false)}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 mt-4"
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться к чату
        </Button>
      </div>
    </div>
  );

  if (showSphere) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <AnimatedSphere />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">

      {/* Header */}
      <Header />

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-[calc(100vh-12rem)]">

          <CardContent className="flex flex-col h-full">
            {/* Messages Area or Test Interface */}
            {isTestQuestionActive && testQuestionData ? null : (
            <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollAreaRef}>
                <div className="space-y-4">

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <Brain className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {/* Regular Message Bubble */}
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">
                          {formatMessageContent(message.content)}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                          {/* TTS Button - only for assistant messages and when auto-TTS is disabled */}
                          {message.role === 'assistant' && isTTSAvailable() && !isTtsEnabled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (!OpenAITTS.isPlaying()) {
                                  speakTextBySentences(message.content, message.id);
                                }
                              }}
                              className={`h-6 w-6 p-0 ${
                                speakingMessageId === message.id
                                  ? 'text-red-500 hover:text-red-600'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                              title={speakingMessageId === message.id ? 'Остановить озвучивание' : 'Озвучить сообщение'}
                            >
                              {speakingMessageId === message.id ? (
                                <VolumeX className="h-3 w-3" />
                              ) : (
                                <Volume2 className="h-3 w-3" />
                              )}
                            </Button>
                          )}

                          {/* Auto-TTS indicator - show when auto-TTS is enabled */}
                          {message.role === 'assistant' && isTtsEnabled && (
                            <div className="flex items-center text-green-600" title="Авто-озвучивание включено">
                              <Volume2 className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </div>

                      {message.role === 'user' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-accent text-accent-foreground">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Brain className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span className="text-sm text-muted-foreground">Учитель думает...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            </ScrollArea>
            )}

            {/* Camera Interface */}
            {isCameraActive && (
                <div className="mb-4 p-4 border rounded-lg bg-muted/30">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full max-h-64 bg-black rounded"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button
                        size="sm"
                        onClick={capturePhoto}
                        className="bg-primary hover:bg-primary/90"
                      >
                        📸 Сфотографировать
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={stopCamera}
                        className="bg-black/50 text-white border-white/30 hover:bg-black/70"
                      >
                        ❌ Отмена
                      </Button>
                    </div>
                  </div>
                </div>
            )}

            {/* Captured Image Preview */}
            {capturedImage && (
                <div className="mb-4 p-4 border rounded-lg bg-muted/30">
                  <div className="text-center">
                    <img
                      src={capturedImage}
                      alt="Сфотографированная задача"
                      className="max-h-64 mx-auto rounded"
                    />
                    <div className="mt-3 flex gap-2 justify-center">
                      <Button
                        size="sm"
                        onClick={sendCapturedPhoto}
                        disabled={isLoading}
                      >
                        {isLoading ? "Анализирую..." : "🧠 Решить задачу"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={retakePhoto}
                        disabled={isLoading}
                      >
                        🔄 Переснять
                      </Button>
                    </div>
                  </div>
                </div>
            )}

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
                <div className="px-4 py-2 border-t bg-muted/30">
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 border text-sm"
                      >
                        {getFileIcon(file)}
                        <span className="truncate max-w-32">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-4 w-4 p-0 hover:bg-destructive/20"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
            )}

            {/* Learning Plan Confirmation */}
            {isLearningPlanActive && (
                <div className="pt-4 border-t">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground text-center">
                      Готовы начать обучение по персонализированному плану?
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={handleLearningPlanConfirm}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                        disabled={isLoading}
                      >
                        ✅ Да
                      </Button>
                      <Button
                        onClick={handleRetakeAssessment}
                        variant="outline"
                        size="lg"
                        className="px-8"
                        disabled={isLoading}
                      >
                        🔄 Пройти тест еще раз
                      </Button>
                    </div>
                  </div>
                </div>
            )}

            {/* Test Question UI or Learning Plan */}
            {isTestQuestionActive && testQuestionData ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="text-center">
                  <p className="text-sm text-emerald-700 mb-4">
                    Вопрос {testQuestionData.currentQuestion}/{testQuestionData.totalQuestions}
                  </p>
                  <div className="bg-white rounded-lg p-6 border border-emerald-200 shadow-lg max-w-2xl">
                    <p className="text-lg font-medium text-gray-800 mb-6">
                      {testQuestionData.question}
                    </p>
                    <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                      {testQuestionData.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleTestAnswer(option)}
                          disabled={isLoading}
                          className="inline-flex items-center justify-start gap-3 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md border-2 border-emerald-400 text-sm w-full"
                        >
                          <span className="text-lg mr-3 font-bold min-w-[24px]">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="text-left">{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleSkipTest}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:text-accent-foreground rounded-md border-gray-300 hover:bg-gray-50 text-sm px-4 py-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-4 h-4 mr-2">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                      Пропустить тест
                    </button>
                  </div>
                </div>
              </div>
            ) : isLearningPlanActive && learningPlanText ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="text-center max-w-4xl">
                  <div className="bg-white rounded-lg p-8 border border-emerald-200 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Результаты тестирования
                    </h2>
                    <div className="whitespace-pre-line text-left text-gray-700 leading-relaxed">
                      {learningPlanText}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div></div>
            )}

            {/* Online Communication Status */}
            {isOnlineCommunication && (
              <div className="px-4 py-2 border-t bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center justify-between text-sm text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-2">
                    {isListening ? (
                      <>
                        <Mic className="w-4 h-4 animate-pulse text-green-600" />
                        <span>🎤 Учитель слушает - говорите ваш вопрос...</span>
                      </>
                    ) : isVoiceChatActive ? (
                      <>
                        <MessageCircle className="w-4 h-4 animate-pulse text-green-600" />
                        <span>💬 Онлайн общение активно - учитель думает...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span>🎯 Онлайн общение готово - нажмите для начала</span>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      setIsOnlineCommunication(false);
                      setIsVoiceChatActive(false);
                      setIsListening(false);
                      if (recognitionRef.current) {
                        recognitionRef.current.stop();
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Завершить
                  </Button>
                </div>
              </div>
            )}

            {/* Input Area - show only when assessment is not started */}
            {!isLearningPlanActive && assessmentState === 'initial' ? (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    title="Загрузить файл (изображение, PDF, DOCX)"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>

                {/* Camera Button */}
                <Button
                  variant={isCameraActive ? "destructive" : "outline"}
                  size="icon"
                  onClick={isCameraActive ? stopCamera : startCamera}
                  disabled={isLoading}
                  title={isCameraActive ? "Закрыть камеру" : "Сфотографировать задачу"}
                  className={isCameraActive ? "animate-pulse" : ""}
                >
                  <Camera className="w-4 h-4" />
                </Button>

                {/* Online Communication Button */}
                <Button
                  variant={isOnlineCommunication ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => {
                    if (isOnlineCommunication) {
                      // Stop online communication
                      setIsOnlineCommunication(false);
                      setIsVoiceChatActive(false);
                      setIsListening(false);
                      if (recognitionRef.current) {
                        recognitionRef.current.stop();
                      }
                    } else {
                      // Start online communication
                      setIsOnlineCommunication(true);
                      setShowChat(true); // Show chat interface
                      // Auto-start voice chat
                      setTimeout(() => {
                        startVoiceChat();
                      }, 500);
                    }
                  }}
                  disabled={isLoading}
                  title={isOnlineCommunication ? "Завершить онлайн общение" : "Начать онлайн общение с учителем"}
                  className={isOnlineCommunication ? "animate-pulse" : ""}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>

                {isAudioTaskActive ? (
                      <div className="w-full flex justify-start">
                        <div className="w-full max-w-xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Mic className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-blue-900 text-sm">🎯 Аудио-задание</p>
                                <p className="text-xs text-blue-700 truncate">{audioTaskText}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                onClick={startAudioTaskRecording}
                                disabled={isRecordingAudioTask || isLoading}
                                className="bg-red-500 hover:bg-red-600 text-white animate-pulse text-sm px-3 py-2 h-9"
                                size="sm"
                              >
                              {isRecordingAudioTask ? (
                                <>
                                  <Mic className="w-4 h-4 mr-1 animate-pulse" />
                                  Слушаю...
                                </>
                              ) : (
                                <>
                                  <Mic className="w-4 h-4 mr-1" />
                                  🎙️ Выполнить
                                </>
                              )}
                              </Button>
                              <Button
                                onClick={() => setIsAudioTaskActive(false)}
                                disabled={isRecordingAudioTask || isLoading}
                                variant="outline"
                                size="sm"
                                className="border-gray-300 hover:bg-gray-50 text-xs px-3 py-1 h-7"
                              >
                                <X className="w-3 h-3 mr-1" />
                                Отмена
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Input
                          ref={inputRef}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={
                            isLessonMode && lessonContextManager.getCurrentContext()
                              ? `Задайте вопрос по теме "${lessonContextManager.getCurrentContext()?.currentTopic}"...`
                              : "Задайте вопрос по любой учебной теме..."
                          }
                          disabled={isLoading || isProcessingFile}
                          className="flex-1"
                        />

                        <Button
                          onClick={() => {
                            if (inputMessage.trim()) {
                              // Если есть текст - отправить сообщение
                              sendMessage();
                            } else {
                              // Если текста нет - начать голосовой ввод
                              startVoiceChat();
                            }
                          }}
                          disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isLoading || isProcessingFile}
                          size="icon"
                        >
                          {isProcessingFile ? (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          ) : inputMessage.trim() ? (
                            <Send className="w-4 h-4" />
                          ) : (
                            <Mic className="w-4 h-4" />
                          )}
                        </Button>
                      </>
                    )}
            </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;

