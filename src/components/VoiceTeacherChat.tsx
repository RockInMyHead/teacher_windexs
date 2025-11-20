/**
 * VoiceTeacherChat - Component for voice interaction with AI teacher
 * Teacher reads lesson notes via TTS, user can interrupt with voice questions
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Mic,
  MicOff,
  Clock,
  Brain,
  X,
  Languages
} from 'lucide-react';
import { OpenAITTS } from '@/lib/openaiTTS';

// Speech Recognition Interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

interface VoiceTeacherChatProps {
  lessonTitle: string;
  lessonTopic: string;
  lessonAspects: string;
  onComplete: () => void;
  onClose: () => void;
}

export const VoiceTeacherChat = ({
  lessonTitle,
  lessonTopic,
  lessonAspects,
  onComplete,
  onClose
}: VoiceTeacherChatProps) => {
  // console.log('🎤 VoiceTeacherChat props:', { lessonTitle, lessonTopic, lessonAspects });

  // Simple state
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lessonNotes, setLessonNotes] = useState<string[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [isReadingLesson, setIsReadingLesson] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'teacher' | 'student', text: string}>>([]);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  // Define helper functions BEFORE using them in useEffect
  
  // Auto-detect language based on lesson content
  const detectLanguageFromLesson = (title: string, topic: string, aspects: string) => {
    const content = `${title} ${topic} ${aspects}`.toLowerCase();

    if (content.includes('китай') || content.includes('china') || content.includes('chinese') || content.includes('中文')) {
      return 'zh-CN';
    } else if (content.includes('испан') || content.includes('spanish') || content.includes('español')) {
      return 'es-ES';
    } else if (content.includes('француз') || content.includes('french') || content.includes('français')) {
      return 'fr-FR';
    } else if (content.includes('немец') || content.includes('german') || content.includes('deutsch')) {
      return 'de-DE';
    } else if (content.includes('итальян') || content.includes('italian') || content.includes('italiano')) {
      return 'it-IT';
    } else if (content.includes('португал') || content.includes('portuguese') || content.includes('português')) {
      return 'pt-BR';
    } else if (content.includes('япон') || content.includes('japan') || content.includes('japanese') || content.includes('日本語')) {
      return 'ja-JP';
    } else if (content.includes('корей') || content.includes('korea') || content.includes('korean') || content.includes('한국어')) {
      return 'ko-KR';
    } else {
      return 'en-US'; // Default to English
    }
  };

  // Refs
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const isInterruptedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const thinkingSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer for call duration
  useEffect(() => {
    callStartTimeRef.current = Date.now();
    durationIntervalRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
      }
    }, 1000);

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Cleanup thinking sound on unmount
  useEffect(() => {
    console.log('🎤 VoiceTeacherChat cleanup effect running');
    return () => {
      console.log('🎤 VoiceTeacherChat cleanup function called');
      stopThinkingSound();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopThinkingSound]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Create thinking sound "пик пик пик" (slow beep)
  const startThinkingSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      let beepCount = 0;

      const playBeep = () => {
        if (beepCount >= 3) return; // Stop after 3 beeps

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz beep
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);

        beepCount++;
      };

      // Play beeps with 1 second intervals
      thinkingSoundIntervalRef.current = setInterval(() => {
        if (beepCount < 3) {
          playBeep();
        } else {
          // Stop the interval after 3 beeps
          if (thinkingSoundIntervalRef.current) {
            clearInterval(thinkingSoundIntervalRef.current);
            thinkingSoundIntervalRef.current = null;
          }
        }
      }, 1000);

    } catch (error) {
      console.warn('Could not play thinking sound:', error);
    }
  };

  // Stop thinking sound
  const stopThinkingSound = () => {
    if (thinkingSoundIntervalRef.current) {
      clearInterval(thinkingSoundIntervalRef.current);
      thinkingSoundIntervalRef.current = null;
    }
  };

  // Generate lesson notes using LLM
  const generateLessonNotes = useCallback(async () => {
    try {
      setIsProcessing(true);
      setIsGeneratingLesson(true);

      const prompt = `Создай подробный конспект урока по теме "${lessonTitle}" (${lessonTopic}).

Основные аспекты для изучения:
${lessonAspects}

КРИТИЧЕСКИ ВАЖНО: НЕ добавляй приветствие в начало урока - начинай сразу с материала.

Структура конспекта должна быть такой:
1. Материал урока (сразу начинай с темы)
2. Введение в тему
3. Основные понятия и определения
4. Законы и правила (с формулами если применимо)
5. Примеры и практические задания
6. Типичные ошибки и как их избежать
7. Итоговые выводы

Каждый пункт конспекта должен быть отдельным предложением или абзацем, подходящим для озвучивания через TTS.

ВАЖНО: Все цифры, числа, формулы и математические выражения ПИШИ СЛОВАМИ, а не цифрами. Например, вместо "2+2=4" пиши "два плюс два равно четыре". Вместо "5 класс" пиши "пятый класс". Вместо "2024 год" пиши "две тысячи двадцать четвертый год".

Верни ответ в формате JSON массива строк, где все элементы - это содержание урока (без приветствий).`;

      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Ты - Юля, профессиональный учитель с многолетним опытом преподавания. Твоя главная задача - объяснять сложные вещи простым и понятным языком, "на пальцах", чтобы каждый ученик мог легко понять материал.

ТВОЙ ПРОФЕССИОНАЛЬНЫЙ ПОДХОД:

1. ОБЪЯСНЕНИЕ "НА ПАЛЬЦАХ":
   - Используй простые аналогии из повседневной жизни
   - Разбивай сложные концепции на маленькие шаги
   - Приводи конкретные примеры, которые ученик может представить
   - Избегай сложных терминов без объяснения
   - Если нужно использовать термин - сначала объясни его простыми словами

2. СТРУКТУРА ОБЪЯСНЕНИЯ:
   - Начинай с простого и постепенно усложняй
   - Используй принцип "от общего к частному"
   - Каждое новое понятие связывай с уже известным
   - Повторяй ключевые моменты для закрепления

3. ПОДДЕРЖКА И ТЕРПЕНИЕ:
   - Всегда поддерживай ученика, даже если он ошибается
   - Никогда не осуждай и не критикуй
   - Если ученик не понял - объясни по-другому, используя другой пример
   - Верь в способности ученика и показывай это

4. ДОСТУПНОСТЬ ЯЗЫКА:
   - Говори простыми словами, как будто объясняешь другу
   - Используй короткие предложения
   - Избегай сложных конструкций
   - Все цифры, числа, формулы ПИШИ СЛОВАМИ (например: "два плюс два равно четыре", а не "2+2=4")

5. ПРАКТИЧНОСТЬ:
   - Показывай, как знания применяются в реальной жизни
   - Приводи примеры из жизни ученика
   - Объясняй, зачем это нужно знать

КРИТИЧЕСКИ ВАЖНО: НЕ добавляй приветствие в начало урока - начинай сразу с материала. Каждый элемент массива должен содержать логически завершенную мысль или абзац, подходящий для озвучивания.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 1200
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      // Try to parse JSON response
      try {
        const notes = JSON.parse(content);
        if (Array.isArray(notes) && notes.length > 0) {
          // Начинаем сразу с материала урока
          console.log('✅ Урок начинается с материала:', notes[0].substring(0, 50));

          // Add lesson content after greeting (skip the first note which is greeting)
          setLessonNotes(prev => [...prev, ...notes]);
          console.log('📝 Lesson notes generated:', notes.length, 'items');
          console.log('🎤 Первое сообщение (материал урока):', notes[0]);
        } else {
          // Fallback: split by newlines if not JSON
          const fallbackNotes = content.split('\n').filter(note => note.trim());
          // Приветствие больше не требуется
          setLessonNotes(prev => [...prev, ...fallbackNotes]);
          console.log('✅ Добавлено приветствие (fallback режим)');
        }
      } catch (parseError) {
        // Fallback: split by newlines
        const fallbackNotes = content.split('\n').filter(note => note.trim());
        // Убираем приветствие - начинаем сразу с материала
        setLessonNotes(prev => [...prev, ...fallbackNotes]);
        console.log('✅ Fallback без приветствия (parse error)');
      }

    } catch (error) {
      console.error('Error generating lesson notes:', error);
      // Fallback notes без приветствия - сразу с материала
      setLessonNotes(prev => [...prev, `Сегодня мы изучаем тему "${lessonTopic}"`, `Основные аспекты: ${lessonAspects}`]);
      console.log('✅ Использованы fallback notes без вопроса о знаниях');
    } finally {
      setIsProcessing(false);
      setIsGeneratingLesson(false);
    }
  }, [lessonTitle, lessonTopic, lessonAspects]);

  // Generate dynamic lesson content based on user response
  const generateDynamicContent = useCallback(async (userResponse: string): Promise<string> => {
    const startTime = Date.now();
    try {
      setIsGeneratingLesson(true);
      console.log('🎯 [TIMING] Start generating content:', userResponse);
      console.log('⏱️ [TIMING] T+0ms: Function started');

      // Start thinking sound "пик пик пик"
      startThinkingSound();
      console.log('⏱️ [TIMING] T+' + (Date.now() - startTime) + 'ms: Thinking sound started');

      const conversationContext = conversationHistory.slice(-4).map(msg =>
        `${msg.role === 'teacher' ? 'Юля' : 'Ученик'}: ${msg.text}`
      ).join('\n');
      console.log('⏱️ [TIMING] T+' + (Date.now() - startTime) + 'ms: Context prepared');

      const prompt = `Ты - Юля, профессиональный учитель, ведущая интерактивный урок. Ученик только что сказал: "${userResponse}"

КОНТЕКСТ УРОКА:
- Тема: "${lessonTitle}" (${lessonTopic})
- Аспекты для изучения: ${lessonAspects}
- Предыдущий разговор: ${conversationContext}

ТВОЯ ЗАДАЧА: Продолжи урок, создав 1-2 логически связанных предложения или абзаца, которые:

1. ОТВЕЧАЮТ на вопрос/замечание ученика - объясни "на пальцах", используя простые примеры из жизни
2. ОБЪЯСНЯЮТ материал по теме - разбей на простые шаги, используй аналогии
3. ЗАДАЮТ следующий вопрос для продолжения диалога - легкий, наводящий вопрос

КАК ОБЪЯСНЯТЬ "НА ПАЛЬЦАХ":
- Используй простые аналогии (например: "Представь, что это как...")
- Приводи конкретные примеры из повседневной жизни
- Разбивай сложное на простые части
- Избегай сложных терминов без объяснения
- Показывай связь с тем, что ученик уже знает

КРИТИЧЕСКИ ВАЖНО: 
- НИКОГДА НЕ ДОБАВЛЯЙ ПРИВЕТСТВИЯ! Ты уже поздоровалась в начале урока.
- ПРОДОЛЖАЙ УРОК С МАТЕРИАЛА, БЕЗ ЛЮБЫХ ПРИВЕТСТВИЙ ИЛИ ВВЕДЕНИЙ.

ВАЖНО: 
- Все цифры, числа, формулы ПИШИ СЛОВАМИ (например: "два плюс два равно четыре", а не "2+2=4")
- Говори простым, понятным языком, как будто объясняешь другу

Формат ответа: Просто текст для озвучивания, без JSON, без форматирования.`;
      console.log('⏱️ [TIMING] T+' + (Date.now() - startTime) + 'ms: Prompt prepared, starting API call');

      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Ты - Юля, профессиональный учитель с многолетним опытом. Твоя главная задача - объяснять сложные вещи простым и понятным языком, "на пальцах", чтобы каждый ученик мог легко понять материал.

ТВОЙ ПРОФЕССИОНАЛЬНЫЙ ПОДХОД К ОБЪЯСНЕНИЮ:

1. ОБЪЯСНЕНИЕ "НА ПАЛЬЦАХ" - ТВОЯ ГЛАВНАЯ СУПЕРСИЛА:
   - Используй простые аналогии из повседневной жизни (как будто объясняешь ребенку)
   - Разбивай сложные концепции на маленькие, понятные шаги
   - Приводи конкретные примеры, которые ученик может легко представить
   - Если нужно использовать термин - сначала объясни его простыми словами
   - Связывай новое с уже известным ученику

2. СТРУКТУРА ТВОЕГО ОТВЕТА:
   - Начинай с простого объяснения
   - Приведи 1-2 конкретных примера из жизни
   - Покажи, как это работает на практике
   - Задай вопрос для проверки понимания

3. ТОН И СТИЛЬ:
   - Профессиональный, но очень теплый и дружелюбный
   - Поддерживающий и терпеливый
   - Никогда не осуждай и не критикуй
   - Верь в способности ученика

4. ЕСЛИ УЧЕНИК НЕ ПОНИМАЕТ:
   - Не повторяй то же самое - объясни по-другому
   - Используй другой пример или аналогию
   - Разбей объяснение на еще более мелкие шаги
   - Покажи связь с тем, что ученик уже знает

5. ЕСЛИ УЧЕНИК МОЛЧИТ ИЛИ ГОВОРИТ "НИЧЕГО", "НЕ ЗНАЮ":
   - Не начинай новую тему сразу
   - Пошути про сложность темы (легко и дружелюбно)
   - Приведи простой жизненный пример
   - Задай легкий наводящий вопрос, который поможет ученику начать думать

ВАЖНО: 
- Все цифры, числа, формулы ПИШИ СЛОВАМИ (например: "два плюс два равно четыре", а не "2+2=4")
- НИКОГДА НЕ ДОБАВЛЯЙ ПРИВЕТСТВИЯ! Ты уже поздоровалась в начале урока.
- Продолжай урок с материала, без любых приветствий или введений.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 300
        })
      });
      console.log('⏱️ [TIMING] T+' + (Date.now() - startTime) + 'ms: API response received');

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

          const data = await response.json();
          console.log('⏱️ [TIMING] T+' + (Date.now() - startTime) + 'ms: Response parsed');

          let newContent = data.choices?.[0]?.message?.content || 'Извините, не удалось получить ответ.';

          // Remove any greetings that might have slipped through
          const greetingPatterns = [
            /^Здравствуйте[^.!]*[.!]/i,
            /^Привет[^.!]*[.!]/i,
            /^Меня зовут Юля[^.!]*[.!]/i,
            /^Давайте начнем урок[^.!]*[.!]/i,
            /^Я Юля[^.!]*[.!]/i
          ];

          greetingPatterns.forEach(pattern => {
            newContent = newContent.replace(pattern, '').trim();
          });

          console.log('✅ Generated dynamic content (filtered):', newContent.substring(0, 100) + '...');
          console.log('⏱️ [TIMING] T+' + (Date.now() - startTime) + 'ms: TOTAL TIME');
          return newContent.trim();

    } catch (error) {
      console.error('❌ Error generating dynamic content:', error);
      return 'Извините, произошла ошибка. Можете перефразировать свой вопрос?';
    } finally {
      setIsGeneratingLesson(false);
      // Stop thinking sound
      stopThinkingSound();
    }
  }, [lessonTitle, lessonTopic, lessonAspects, conversationHistory]);

  // Initialize lesson with greeting and then generate content
  useEffect(() => {
    console.log('🎤 VoiceTeacherChat init effect running with deps:', { lessonTitle, lessonTopic, lessonAspects });
    const initializeLesson = async () => {
      try {
        // Auto-detect language based on lesson content
        const detectedLanguage = detectLanguageFromLesson(lessonTitle, lessonTopic, lessonAspects);
        setSelectedLanguage(detectedLanguage);
        console.log('🎯 Auto-detected language:', detectedLanguage, 'for lesson:', lessonTitle);

        // Start with greeting
        const greeting = `Привет! Я Юля. Давай начнем урок по теме "${lessonTitle}". ${lessonTopic ? `Тема: ${lessonTopic}.` : ''}`;
        setLessonNotes([greeting]);
        // Also add greeting to conversation history for tracking
        setConversationHistory([{ role: 'teacher', text: greeting }]);
        console.log('🎤 Lesson initialized with greeting');

        // Auto-generate lesson content after greeting
        setTimeout(async () => {
          console.log('🎯 Auto-generating lesson content after greeting');
          try {
            await generateLessonNotes();
            setLessonStarted(true);
          } catch (error) {
            console.error('❌ Error generating lesson notes:', error);
            setLessonStarted(true); // Continue anyway
          }
        }, 2000); // Small delay to let greeting be set first
      } catch (error) {
        console.error('❌ Error in initializeLesson:', error);
      }
    };

    initializeLesson();
  }, []); // Removed all dependencies to avoid circular dependencies

  // Simple TTS function
  const speakText = useCallback(async (text: string) => {
    if (!text || text.trim() === '') return;

    try {
      console.log('🎤 Speaking:', text.substring(0, 50) + '...');
      await OpenAITTS.speak(text, {
        voice: 'nova',
        speed: 1.0,
        onStart: () => console.log('TTS started'),
        onEnd: () => console.log('TTS ended'),
        onError: (error) => console.error('TTS error:', error)
      });
    } catch (error) {
      console.error('Error in speakText:', error);
    }
  }, []);

  // Auto-start lesson when ready
  useEffect(() => {
    if (lessonNotes.length > 0 && lessonStarted && currentNoteIndex === 0) {
      console.log('🎤 Auto-starting lesson');
      const timer = setTimeout(() => {
        if (lessonNotes[0]) {
          speakText(lessonNotes[0]);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lessonNotes.length, lessonStarted, currentNoteIndex, speakText]);

  // Initialize basic speech recognition
  useEffect(() => {
    console.log('🎤 Initializing speech recognition');
    // Simplified - no complex speech recognition for now
  }, []);

  // Handle voice input
  const handleVoiceInput = useCallback(async (message: string) => {
    console.log('🎤 Voice input received:', message);
    setIsProcessing(true);

    // Add to history
    setConversationHistory(prev => [...prev, { role: 'student', text: message }]);

    try {
      const response = await generateDynamicContent(message);
      setConversationHistory(prev => [...prev, { role: 'teacher', text: response }]);
      setLessonNotes(prev => [...prev, response]);

      // Speak response
      await speakText(response);
    } catch (error) {
      console.error('Error handling voice input:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [generateDynamicContent]);

  // Toggle voice listening
  const toggleListening = () => {
    if (!speechRecognitionRef.current) return;

    if (isListening) {
      speechRecognitionRef.current.stop();
    } else {
      // Stop TTS if speaking
      if (isSpeaking) {
        OpenAITTS.stop();
        setIsSpeaking(false);
        isInterruptedRef.current = true;
      }

      // Start the lesson on first interaction
      if (!lessonStarted) {
        console.log('🎤 Starting lesson on first user interaction');
        setLessonStarted(true);
      }

      speechRecognitionRef.current.start();
    }
  };

  return (
    <Card className="w-full h-full flex flex-col border-2 border-primary/20 bg-card/95 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Звонок учителю</CardTitle>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(callDuration)}
            </Badge>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">🇺🇸 English</SelectItem>
                  <SelectItem value="es-ES">🇪🇸 Español</SelectItem>
                  <SelectItem value="fr-FR">🇫🇷 Français</SelectItem>
                  <SelectItem value="de-DE">🇩🇪 Deutsch</SelectItem>
                  <SelectItem value="it-IT">🇮🇹 Italiano</SelectItem>
                  <SelectItem value="pt-BR">🇧🇷 Português</SelectItem>
                  <SelectItem value="ru-RU">🇷🇺 Русский</SelectItem>
                  <SelectItem value="zh-CN">🇨🇳 中文</SelectItem>
                  <SelectItem value="ja-JP">🇯🇵 日本語</SelectItem>
                  <SelectItem value="ko-KR">🇰🇷 한국어</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">(авто)</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-sm mb-1">{lessonTitle}</h3>
            <p className="text-xs text-muted-foreground">{lessonTopic}</p>
          </div>

          {lessonNotes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Прогресс урока</span>
                <span>{currentNoteIndex + 1}/{lessonNotes.length}</span>
              </div>
              <Progress value={lessonProgress} className="h-1" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Start screen - before lesson begins */}
        {!lessonStarted && (
          <div className="w-full max-w-md text-center space-y-6">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Готовы начать урок?</h3>
                <p className="text-sm text-muted-foreground">
                  Нажмите на микрофон, чтобы задать вопрос или начать разговор с Юлей
                </p>
              </div>
            </div>

            {/* Start lesson button */}
            <div className="relative flex items-center justify-center">
              <Button
                onClick={toggleListening}
                disabled={isProcessing || isSpeaking}
                className="w-32 h-32 rounded-full bg-green-400 hover:bg-green-500 shadow-lg transition-all"
              >
                <Mic className="w-12 h-12 text-white" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Нажмите на микрофон, чтобы начать звонок учителю
            </p>
          </div>
        )}

        {/* Lesson interface - after lesson starts */}
        {lessonStarted && (
          <>
            {/* Loading indicator when generating lesson or dynamic content */}
            {isGeneratingLesson && (
              <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-blue-900">
                  {lessonNotes.length === 0 ? 'Генерирую урок...' : 'Думаю над ответом...'}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {lessonNotes.length === 0
                    ? 'AI создает персональный урок специально для вас'
                    : 'AI адаптирует урок под ваш вопрос'
                  }
                </p>
              </div>
            )}

            {/* User transcript display */}
            {userTranscript && !isProcessing && !isGeneratingLesson && (
              <div className="w-full max-w-md bg-muted/50 rounded-lg p-4 border">
                <p className="text-sm text-center text-foreground">
                  <span className="font-medium">Вы сказали:</span>
                </p>
                <p className="text-sm text-center mt-2 italic text-muted-foreground">
                  "{userTranscript}"
                </p>
              </div>
            )}

            {/* Pulsing green circle for voice input */}
            {!isProcessing && !isGeneratingLesson && (
          <div className="relative flex items-center justify-center">
          <Button
            onClick={toggleListening}
            disabled={isProcessing || isSpeaking || isGeneratingLesson}
            className={`w-32 h-32 rounded-full ${
              isListening
                ? 'bg-green-500 hover:bg-green-600 animate-pulse'
                : 'bg-green-400 hover:bg-green-500'
            } shadow-lg transition-all`}
          >
            {isListening ? (
              <MicOff className="w-12 h-12 text-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </Button>
          
          {/* Pulsing ring effect when listening */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
              <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-50" />
            </>
          )}
        </div>
        )}
          </>
        )}

        {/* Status text */}
        {lessonStarted && (
          <div className="text-center space-y-2">
          {isProcessing && (
            <p className="text-sm text-muted-foreground animate-pulse">
              Обработка вопроса...
            </p>
          )}
          {isSpeaking && !isListening && (
            <p className="text-sm text-muted-foreground">
              Учитель объясняет...
            </p>
          )}
          {!isListening && !isSpeaking && !isProcessing && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Нажмите на микрофон, чтобы задать вопрос
              </p>
              {selectedLanguage !== 'ru-RU' && (
                <p className="text-xs text-amber-600">
                  💡 Говорите на {selectedLanguage === 'zh-CN' ? 'китайском' :
                                   selectedLanguage === 'ja-JP' ? 'японском' :
                                   selectedLanguage === 'ko-KR' ? 'корейском' :
                                   selectedLanguage === 'en-US' ? 'английском' :
                                   selectedLanguage === 'es-ES' ? 'испанском' :
                                   selectedLanguage === 'fr-FR' ? 'французском' :
                                   selectedLanguage === 'de-DE' ? 'немецком' :
                                   selectedLanguage === 'it-IT' ? 'итальянском' :
                                   selectedLanguage === 'pt-BR' ? 'португальском' : 'выбранном'} языке
                </p>
              )}
            </div>
          )}
          {isListening && (
            <div className="space-y-1">
              <p className="text-sm text-primary font-medium animate-pulse">
                Слушаю вас...
              </p>
              <p className="text-xs text-muted-foreground">
                Говорите на {selectedLanguage === 'zh-CN' ? 'китайском' :
                              selectedLanguage === 'ja-JP' ? 'японском' :
                              selectedLanguage === 'ko-KR' ? 'корейском' :
                              selectedLanguage === 'en-US' ? 'английском' :
                              selectedLanguage === 'es-ES' ? 'испанском' :
                              selectedLanguage === 'fr-FR' ? 'французском' :
                              selectedLanguage === 'de-DE' ? 'немецком' :
                              selectedLanguage === 'it-IT' ? 'итальянском' :
                              selectedLanguage === 'pt-BR' ? 'португальском' : 'выбранном'} языке
              </p>
            </div>
          )}
          </div>
        )}

        {/* Complete button - only show when lesson is active */}
        {lessonStarted && (
          <Button
            onClick={onComplete}
            variant="outline"
            className="gap-2"
          >
            Завершить урок
          </Button>
        )}
      </CardContent>
    </Card>
  );
  };

  VoiceTeacherChat.displayName = 'VoiceTeacherChat';

export default VoiceTeacherChat;
