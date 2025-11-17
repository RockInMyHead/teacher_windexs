/**
 * VoiceTeacherChat - Component for voice interaction with AI teacher
 * Teacher reads lesson notes via TTS, user can interrupt with voice questions
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Mic,
  MicOff,
  Clock,
  Brain,
  X
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

export const VoiceTeacherChat = React.memo(({
  lessonTitle,
  lessonTopic,
  lessonAspects,
  onComplete,
  onClose
}: VoiceTeacherChatProps) => {
  // State
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lessonNotes, setLessonNotes] = useState<string[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [isReadingLesson, setIsReadingLesson] = useState(false);

  // Refs
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const isInterruptedRef = useRef(false);

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

  // Format duration
  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Generate lesson notes using LLM
  const generateLessonNotes = useCallback(async () => {
    try {
      setIsProcessing(true);

      const prompt = `Создай подробный конспект урока по теме "${lessonTitle}" (${lessonTopic}).

Основные аспекты для изучения:
${lessonAspects}

КРИТИЧЕСКИ ВАЖНО: Первый элемент массива ОБЯЗАТЕЛЬНО должен быть приветствием учителя ученику. 
Приветствие должно быть примерно таким: "Здравствуй! Меня зовут учитель. Сегодня мы с тобой изучим тему [название темы]. Давай начнем наш урок!"

Структура конспекта должна быть такой:
1. ПРИВЕТСТВИЕ (ОБЯЗАТЕЛЬНО ПЕРВЫМ!) - учитель должен сначала поздороваться с учеником
2. Введение в тему
3. Основные понятия и определения
4. Законы и правила (с формулами если применимо)
5. Примеры и практические задания
6. Типичные ошибки и как их избежать
7. Итоговые выводы

Каждый пункт конспекта должен быть отдельным предложением или абзацем, подходящим для озвучивания через TTS.

Верни ответ в формате JSON массива строк, где ПЕРВЫЙ элемент - это приветствие, а остальные - содержание урока.`;

      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'Ты - опытный педагог. Создай подробный конспект урока в формате JSON массива строк. КРИТИЧЕСКИ ВАЖНО: ПЕРВЫЙ элемент массива ОБЯЗАТЕЛЬНО должен быть приветствием от учителя ученику. Приветствие должно начинаться со слов "Здравствуй!" или "Привет!" и содержать представление учителя. Без приветствия урок начинаться НЕ ДОЛЖЕН. Каждый элемент массива должен содержать логически завершенную мысль или абзац, подходящий для озвучивания.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'gpt-4-turbo',
          temperature: 0.7,
          max_completion_tokens: 2000
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
          // Строгая проверка приветствия в первом элементе
          const firstNote = notes[0].toLowerCase().trim();
          const hasGreeting = firstNote.startsWith('здравствуй') || 
                             firstNote.startsWith('привет') || 
                             firstNote.includes('здравствуй!') || 
                             firstNote.includes('привет!') ||
                             firstNote.includes('добро пожаловать') ||
                             (firstNote.includes('меня зовут') && (firstNote.includes('учитель') || firstNote.includes('преподаватель')));
          
          // Если нет приветствия, ВСЕГДА добавляем его в начало
          if (!hasGreeting) {
            const greeting = `Здравствуй! Меня зовут учитель. Сегодня мы с тобой изучим тему "${lessonTitle}". Давай начнем наш урок!`;
            notes.unshift(greeting);
            console.log('✅ Добавлено приветствие в начало урока (не было найдено в ответе)');
          } else {
            console.log('✅ Приветствие найдено в первом элементе:', notes[0].substring(0, 50));
          }
          
          setLessonNotes(notes);
          console.log('📝 Lesson notes generated:', notes.length, 'items');
          console.log('🎤 Первое сообщение (приветствие):', notes[0]);
        } else {
          // Fallback: split by newlines if not JSON
          const fallbackNotes = content.split('\n').filter(note => note.trim());
          // ВСЕГДА добавляем приветствие в начало
          const greeting = `Здравствуй! Меня зовут учитель. Сегодня мы с тобой изучим тему "${lessonTitle}". Давай начнем наш урок!`;
          fallbackNotes.unshift(greeting);
          setLessonNotes(fallbackNotes);
          console.log('✅ Добавлено приветствие (fallback режим)');
        }
      } catch (parseError) {
        // Fallback: split by newlines
        const fallbackNotes = content.split('\n').filter(note => note.trim());
        // ВСЕГДА добавляем приветствие в начало
        const greeting = `Здравствуй! Меня зовут учитель. Сегодня мы с тобой изучим тему "${lessonTitle}". Давай начнем наш урок!`;
        fallbackNotes.unshift(greeting);
        setLessonNotes(fallbackNotes);
        console.log('✅ Добавлено приветствие (parse error fallback)');
      }

    } catch (error) {
      console.error('Error generating lesson notes:', error);
      // Fallback notes с приветствием ВСЕГДА первым
      setLessonNotes([
        `Здравствуй! Меня зовут учитель. Сегодня мы с тобой изучим тему "${lessonTitle}". Давай начнем наш урок!`,
        `Сегодня мы изучаем тему "${lessonTopic}"`,
        `Основные аспекты: ${lessonAspects}`,
        'Готовы начать изучение материала?'
      ]);
      console.log('✅ Использованы fallback notes с приветствием');
    } finally {
      setIsProcessing(false);
    }
  }, [lessonTitle, lessonTopic, lessonAspects]);

  // Initialize lesson notes on mount
  useEffect(() => {
    generateLessonNotes();
  }, [generateLessonNotes]);

  // Read current lesson note
  const readNextNote = useCallback(async () => {
    if (lessonNotes.length === 0 || currentNoteIndex >= lessonNotes.length) {
      // Lesson complete
      setLessonProgress(100);
      setIsReadingLesson(false);
      return;
    }

    if (isInterruptedRef.current) {
      // Don't continue if interrupted
      return;
    }

    const note = lessonNotes[currentNoteIndex];
    if (!note || note.trim() === '') {
      // Skip empty notes
      if (currentNoteIndex < lessonNotes.length - 1) {
        setCurrentNoteIndex(prev => prev + 1);
        setLessonProgress(((currentNoteIndex + 1) / lessonNotes.length) * 100);
        setTimeout(() => readNextNote(), 500);
      }
      return;
    }

    try {
      setIsReadingLesson(true);
      setIsSpeaking(true);

      // Speak the note
      await OpenAITTS.speak(note, {
        voice: 'nova',
        speed: 1.0,
        onStart: () => {
          console.log('TTS started for note:', currentNoteIndex);
        },
        onEnd: () => {
          console.log('TTS ended for note:', currentNoteIndex);
          setIsSpeaking(false);

          // Auto-advance to next note if not interrupted
          if (!isInterruptedRef.current && currentNoteIndex < lessonNotes.length - 1) {
            setCurrentNoteIndex(prev => prev + 1);
            setLessonProgress(((currentNoteIndex + 1) / lessonNotes.length) * 100);
            
            // Continue reading after a short pause
            setTimeout(() => {
              if (!isInterruptedRef.current) {
                readNextNote();
              }
            }, 1000);
          } else if (currentNoteIndex >= lessonNotes.length - 1) {
            // Lesson complete
            setLessonProgress(100);
            setIsReadingLesson(false);
          }
        },
        onError: (error) => {
          console.error('TTS error:', error);
          setIsSpeaking(false);
          setIsReadingLesson(false);
        }
      });

    } catch (error) {
      console.error('Error speaking note:', error);
      setIsSpeaking(false);
      setIsReadingLesson(false);
    }
  }, [lessonNotes, currentNoteIndex]);

  // Auto-start reading lesson when notes are ready
  useEffect(() => {
    if (lessonNotes.length > 0 && !isProcessing && !isReadingLesson && currentNoteIndex === 0) {
      // Убеждаемся, что первый элемент - это приветствие
      const firstNote = lessonNotes[0]?.toLowerCase().trim() || '';
      const hasGreeting = firstNote.startsWith('здравствуй') || 
                         firstNote.startsWith('привет') || 
                         firstNote.includes('здравствуй!') || 
                         firstNote.includes('привет!') ||
                         firstNote.includes('меня зовут');
      
      if (!hasGreeting && lessonNotes.length > 0) {
        console.warn('⚠️ Первый элемент не является приветствием, добавляем приветствие');
        const greeting = `Здравствуй! Меня зовут учитель. Сегодня мы с тобой изучим тему "${lessonTitle}". Давай начнем наш урок!`;
        setLessonNotes(prev => [greeting, ...prev]);
        return;
      }
      
      // Start reading after a short delay (начинаем с приветствия)
      console.log('🎤 Начинаем урок с приветствия:', lessonNotes[0]?.substring(0, 50));
      const timer = setTimeout(() => {
        readNextNote();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lessonNotes.length, isProcessing, isReadingLesson, currentNoteIndex, readNextNote, lessonNotes, lessonTitle]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        speechRecognitionRef.current = new SpeechRecognitionAPI();
        speechRecognitionRef.current.continuous = false;
        speechRecognitionRef.current.interimResults = false;
        speechRecognitionRef.current.lang = 'ru-RU';

        speechRecognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        speechRecognitionRef.current.onend = () => {
          setIsListening(false);
        };

        speechRecognitionRef.current.onresult = (event) => {
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            handleUserMessage(finalTranscript);
          }
        };

        speechRecognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
    };
  }, []);

  // Handle user voice message
  const handleUserMessage = useCallback(async (message: string) => {
    // Stop any ongoing TTS and mark as interrupted
    if (isSpeaking) {
      OpenAITTS.stop();
      setIsSpeaking(false);
      isInterruptedRef.current = true;
    }

    setIsProcessing(true);

    try {
      // Send to AI for response
      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Ты - опытный учитель по теме "${lessonTitle}" (${lessonTopic}).

Твоя задача - объяснять материал доступно, отвечать на вопросы ученика, и продолжать урок.

Текущий материал урока: ${lessonAspects}

Отвечай кратко и по делу. После ответа предложи продолжить урок.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          model: 'gpt-4-turbo',
          temperature: 0.7,
          max_completion_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Извините, не удалось получить ответ.';

      // Speak AI response
      try {
        setIsSpeaking(true);
        await OpenAITTS.speak(aiResponse, {
          voice: 'nova',
          speed: 1.0,
          onStart: () => console.log('Speaking AI response'),
          onEnd: () => {
            setIsSpeaking(false);
            // Resume reading lesson after response
            isInterruptedRef.current = false;
            setTimeout(() => {
              if (currentNoteIndex < lessonNotes.length) {
                readNextNote();
              }
            }, 1000);
          },
          onError: (error) => {
            console.error('TTS error:', error);
            setIsSpeaking(false);
            isInterruptedRef.current = false;
          }
        });
      } catch (error) {
        console.error('Error auto-speaking AI response:', error);
        setIsSpeaking(false);
        isInterruptedRef.current = false;
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsSpeaking(false);
      isInterruptedRef.current = false;
    } finally {
      setIsProcessing(false);
    }
  }, [lessonTitle, lessonTopic, lessonAspects, currentNoteIndex, lessonNotes.length, readNextNote]);

  // Toggle voice listening
  const toggleListening = useCallback(() => {
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
      speechRecognitionRef.current.start();
    }
  }, [isListening, isSpeaking]);

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
        {/* Pulsing green circle for voice input */}
        <div className="relative flex items-center justify-center">
          <Button
            onClick={toggleListening}
            disabled={isProcessing || isSpeaking}
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

        {/* Status text */}
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
            <p className="text-sm text-muted-foreground">
              Нажмите на микрофон, чтобы задать вопрос
            </p>
          )}
          {isListening && (
            <p className="text-sm text-primary font-medium animate-pulse">
              Слушаю вас...
            </p>
          )}
        </div>

        {/* Complete button */}
        <Button
          onClick={onComplete}
          variant="outline"
          className="gap-2"
        >
          Завершить урок
        </Button>
      </CardContent>
    </Card>
  );
});

VoiceTeacherChat.displayName = 'VoiceTeacherChat';

export default VoiceTeacherChat;
