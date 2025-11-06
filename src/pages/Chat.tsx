import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, Send, User, ArrowLeft, MessageCircle, Upload, FileText, Image, File, X, Camera, Volume2, VolumeX, Mic, MicOff, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { OpenAITTS, isTTSAvailable } from '@/lib/openaiTTS';

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

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  ttsPlayed?: boolean;
}


const Chat = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
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
    let SpeechRecognition = null;

    if ('SpeechRecognition' in window) {
      SpeechRecognition = window.SpeechRecognition;
      console.log('✅ Found SpeechRecognition');
    } else if ('webkitSpeechRecognition' in window) {
      SpeechRecognition = window.webkitSpeechRecognition;
      console.log('✅ Found webkitSpeechRecognition');
    } else if ('mozSpeechRecognition' in window) {
      SpeechRecognition = window.mozSpeechRecognition;
      console.log('✅ Found mozSpeechRecognition');
    } else if ('msSpeechRecognition' in window) {
      SpeechRecognition = window.msSpeechRecognition;
      console.log('✅ Found msSpeechRecognition');
    }

    if (SpeechRecognition) {
      try {
        recognitionRef.current = new SpeechRecognition();
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
                      content: `Вы - профессиональный педагог и эксперт в образовании. Ваша задача - объяснять любые темы быстро, понятно и доступно. Давайте краткие, но полные объяснения.

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

Память и контекст: История последних 30 сообщений передается вам. ОБЯЗАТЕЛЬНО используйте её!`,
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
      if (!apiKey) {
        setApiKeyStatus('invalid');
        return;
      }

      try {
        // Make a minimal request to check if API key is valid
        const response = await fetch(`${window.location.origin}/api/models`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (response.ok) {
          setApiKeyStatus('valid');
        } else if (response.status === 401) {
          setApiKeyStatus('invalid');
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


  const clearMemory = () => {
    // Keep only the first system message, clear all user/assistant messages
    setMessages(prev => prev.filter(msg => msg.role === 'system'));
    // Stop any ongoing TTS and sounds
    OpenAITTS.stop();
    stopContinuousSound();
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    ttsContinueRef.current = true;
    setSpeakingMessageId(null);
    setCurrentSentence(0);
    setTotalSentences(0);
    setIsGeneratingTTS(false);
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
    let fileContents: string[] = [];

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
              content: `Вы - профессиональный педагог и эксперт в образовании. Ваша задача - объяснять любые темы быстро, понятно и доступно. Вы можете "разжевывать" сложные концепции, приводить примеры из реальной жизни, использовать аналогии и пошаговые объяснения.

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

Помните: ваша цель - не просто дать ответ, а поддерживать непрерывный образовательный диалог!`,
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
          max_tokens: 1000,
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
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Left side - Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                onClick={() => navigate('/courses')}
                className="flex items-center gap-2 px-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Назад</span>
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-sm sm:text-lg font-semibold hidden sm:block">Windexs-Учитель</h1>
            </div>

            {/* Right side - Title */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-sm sm:text-lg font-medium hidden sm:block">AI Учитель</h2>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Чат с AI Учителем
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {apiKeyStatus === 'invalid' && (
                <span className="text-red-600 font-medium block mt-1">
                  ❌ OpenAI API ключ не настроен! Добавьте VITE_OPENAI_API_KEY в файл .env
                </span>
              )}
              {apiKeyStatus === 'error' && (
                <span className="text-orange-600 font-medium block mt-1">
                  ⚠️ Не удалось проверить API ключ. Возможно, проблемы с интернетом.
                </span>
              )}
            </p>
          </CardHeader>

          <CardContent className="flex flex-col h-full">
            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                    <p className="text-lg mb-2">Добро пожаловать в чат с AI Учителем!</p>
                    <p>Задайте свой первый вопрос, и я помогу разобраться в любой теме.</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <p><strong>Примеры вопросов:</strong></p>
                      <div className="space-y-1 text-left max-w-md mx-auto">
                        <p>• "Объясни, что такое производная"</p>
                        <p>• "Как работает фотосинтез?"</p>
                        <p>• "Расскажи про вторую мировую войну"</p>
                      </div>
                    </div>
                  </div>
                )}

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

            {/* Voice Chat Status */}
            {isVoiceChatActive && (
              <div className="px-4 py-2 border-t bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  {isListening ? (
                    <>
                      <Mic className="w-4 h-4 animate-pulse text-green-600" />
                      <span>🎤 Слушаю - говорите ваш вопрос...</span>
                    </>
                  ) : isGeneratingTTS ? (
                    <>
                      <Brain className="w-4 h-4 animate-pulse text-purple-600" />
                      <span>🎵 Подготовка ответа...</span>
                    </>
                  ) : OpenAITTS.isPlaying() ? (
                    <>
                      <Volume2 className="w-4 h-4 animate-pulse text-blue-600" />
                      <span>🔊 Отвечаю голосом...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 animate-pulse text-orange-600" />
                      <span>🤔 Обрабатываю ответ...</span>
                    </>
                  )}
                </div>
                {ttsInterrupted && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <span>⚡ TTS прерван речью пользователя</span>
                  </div>
                )}
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

            {/* Input Area */}
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

                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Задайте вопрос по любой учебной теме..."
                    disabled={isLoading || isProcessingFile}
                    className="flex-1"
                  />


                  {/* Voice Chat Button */}
                  <Button
                    variant={isVoiceChatActive ? "default" : "outline"}
                    size="icon"
                    onClick={startVoiceChat}
                    disabled={!isTTSAvailable()}
                    title={isVoiceChatActive ? "Остановить голосовое общение" : `Начать голосовое общение с AI Учителем${!('webkitSpeechRecognition' in window && 'SpeechRecognition' in window) ? ' (Браузер может не поддерживать распознавание речи)' : ''}`}
                    className={isVoiceChatActive ? "bg-red-600 hover:bg-red-700 animate-pulse" : ""}
                  >
                    {isVoiceChatActive ? (
                      isListening ? <Mic className="w-4 h-4 animate-pulse text-white" /> : <MicOff className="w-4 h-4" />
                    ) : (
                      <MessageCircle className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearMemory}
                    disabled={messages.length <= 1} // Disable if only system message
                    title="Очистить память учителя"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={sendMessage}
                    disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isLoading || isProcessingFile}
                    size="icon"
                  >
                {isProcessingFile ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
