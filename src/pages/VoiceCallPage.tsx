import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone, PhoneOff, Mic, X } from 'lucide-react';
import Header from '@/components/Header';
import { OpenAITTS } from '@/lib/openaiTTS';
import { VoiceComm } from '@/lib/voiceComm';
import { VoiceTeacherChat } from '@/features/voice';

const VoiceCallPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Component mounted
    return () => {
      // Component unmounted - cleanup
      OpenAITTS.stop();
      VoiceComm.stopListening();
    };
  }, []);

  const [lessonData, setLessonData] = useState<any>({
    title: 'Урок',
    topic: 'Тема урока',
    aspects: 'Содержание урока',
    description: 'Содержание урока'
  });
  const [courseInfo, setCourseInfo] = useState<any>({
    title: 'Курс',
    grade: '5 класс'
  });
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Chat/Call Logic State
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'teacher' | 'student', text: string}>>([]);
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);

  // Refs for call management
  const abortControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef<number>(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const historyRef = useRef(conversationHistory);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Загружаем данные урока из localStorage
    const storedLesson = localStorage.getItem('currentLesson');
    const storedCourseInfo = localStorage.getItem('courseInfo');

    if (storedLesson) {
      const lesson = JSON.parse(storedLesson);
      setLessonData(prev => ({ ...prev, ...lesson }));
    }

    if (storedCourseInfo) {
      const course = JSON.parse(storedCourseInfo);
      setCourseInfo(prev => ({ ...prev, ...course }));
    }

    // Устанавливаем загрузку как завершенную
    setIsLoading(false);
  }, [navigate]);

  // Keep historyRef updated
  useEffect(() => { historyRef.current = conversationHistory; }, [conversationHistory]);

  // Set video element for TTS synchronization
  useEffect(() => {
    if (videoRef.current) {
      console.log('🎥 Setting video element for TTS sync');
      OpenAITTS.setVideoElement(videoRef.current);
    } else {
      OpenAITTS.setVideoElement(null);
    }

    return () => {
      OpenAITTS.setVideoElement(null);
    };
  }, [showVideoCall]); // Re-run when showVideoCall changes

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      OpenAITTS.stop();
      VoiceComm.stopListening();
    };
  }, []);

  // Проверяем, есть ли данные урока (для голосового звонка без урока)
  const hasLessonData = lessonData.title !== 'Урок' && lessonData.topic !== 'Тема урока' && lessonData.description !== 'Содержание урока';

  // Always allow voice call, even without specific lesson data
  const canStartVoiceCall = true;

  const handleEndCall = () => {
    setIsCallActive(false);
    navigate('/courses');
  };

  const startCallLogic = async () => {
    if (isCallActive) {
      // Stop call
      VoiceComm.stopListening();
      OpenAITTS.stop();
      setIsCallActive(false);
      return;
    }

    // Start call
    setIsCallActive(true);

    // Activate audio context first
    try {
      if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const AudioContextClass = AudioContext || webkitAudioContext;
        const audioContext = new AudioContextClass();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
      }
    } catch (error) {
      console.warn('Failed to activate audio context:', error);
    }

    try {
      // Generate greeting
      const greeting = `Привет! Я Юля. Мы начинаем урок "${lessonData.title}". ${lessonData.topic ? 'Тема: ' + lessonData.topic : ''}. Что ты уже знаешь об этом?`;

      setConversationHistory([{ role: 'teacher', text: greeting }]);

      // Speak greeting and start voice recognition
      await speakGreetingAndStartChat(greeting);

      // Initialize VoiceComm
      VoiceComm.init(
          { language: 'ru-RU', continuous: true },
          {
              onListeningStart: () => console.log('🎤 Listening started'),
              onListeningEnd: () => console.log('🎤 Listening ended'),
              onTranscript: (text, isFinal) => {
                  if (isFinal && text.trim()) {
                      handleUserTranscript(text, isFinal);
                  }
              },
              onError: (e) => console.error('VoiceComm error:', e)
          }
      );
    } catch (error) {
      console.error('Failed to start call:', error);
      setIsCallActive(false);
    }
  };

  const speakGreetingAndStartChat = useCallback(async (greeting: string) => {
    try {
      console.log('🎤 Speaking greeting:', greeting.substring(0, 50) + '...');

      await OpenAITTS.speak(greeting, {
        voice: 'nova',
        speed: 1.0,
        onEnd: async () => {
          console.log('✅ Greeting TTS ended, starting voice recognition');
          try {
            await VoiceComm.startListening();
          } catch (error) {
            console.error('❌ Failed to start voice recognition after greeting:', error);
          }
        },
        onError: (error) => {
          console.error('❌ Greeting TTS error:', error);
        }
      });
    } catch (error) {
      console.error('❌ Failed to speak greeting:', error);
    }
  }, []);

  const handleUserTranscript = useCallback(async (text: string, isFinal: boolean) => {
    console.log('🔍 handleUserTranscript called:', { text, isFinal });

    if (!isFinal || !text.trim()) {
      return;
    }

    // Cancel any pending processing
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    OpenAITTS.stop();

    // Update Request ID
    const currentRequestId = ++latestRequestIdRef.current;

    console.log('📝 User said (final):', text);
    setConversationHistory(prev => [...prev, { role: 'student', text: text }]);

    // Process after a short delay
    processingTimeoutRef.current = setTimeout(async () => {
        const startTime = Date.now();
        try {
          setIsProcessingQuestion(true);

          const controller = new AbortController();
          abortControllerRef.current = controller;

          const context = historyRef.current.slice(-4).map(h =>
            `${h.role === 'teacher' ? 'Юля' : 'Ученик'}: ${h.text}`
          ).join('\n');

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
4. ЕСЛИ ОТВЕТ НЕВЕРНЫЙ: Скажи "Не совсем так", объясни ошибку, переспроси.
5. ЕСЛИ ОТВЕТ НЕПОНЯТЕН: Переспроси четко.
6. ЕСЛИ ОТВЕТ ПРАВИЛЬНЫЙ: Кратко похвали и переходи к следующему.
7. СЛЕДУЮЩИЙ ШАГ: После проверки всегда переходи к следующему пункту плана.

ПРАВИЛА ДЛЯ ТЕКСТА В РЕЧЬ (TTS):
- Расставляй УДАРЕНИЯ в сложных словах знаком + перед ударной гласной (например: "м+ама", "г+ород").
- Для омографов (зам+ок/з+амок) обязательно ставь ударение по контексту.

ПЛАН ТЕКУЩЕГО УРОКА:
${lessonData?.aspects || 'Изучаем основы'}

ТЕКУЩИЙ УРОК: "${lessonData?.title || 'Урок'}" (${lessonData?.topic || 'Тема'})
КОНТЕКСТ РАЗГОВОРА:
${context}

УЧЕНИК СКАЗАЛ: "${text}"

ИНСТРУКЦИЯ ДЛЯ ОТВЕТА:
1. Если ученик ответил на твой вопрос: Оцени правильность ответа.
2. Если ученик спросил что-то: Ответь, но верни к плану урока.
3. Всегда заканчивай объяснением материала или вопросом.
`;

          const response = await fetch('/api/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Ученик только что сказал: "${text}". Продолжи урок.` }
              ],
              model: 'gpt-4o',
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
            if (err.name !== 'AbortError') {
                 console.error('❌ Error generating teacher response:', err);
            }
        } finally {
          if (currentRequestId === latestRequestIdRef.current) {
             setIsProcessingQuestion(false);
             abortControllerRef.current = null;
          }
        }
      }, 500);
  }, [conversationHistory, lessonData]);

  const handleStartVideoCall = () => {
    setShowVideoCall(true);
    // Also start the call logic immediately
    startCallLogic();
  };

  const handleCloseVideoCall = () => {
    setShowVideoCall(false);
    setIsCallActive(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="p-8 max-w-md text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка голосового звонка...</p>
          </Card>
        </div>
      </div>
    );
  }

  // Если данных урока нет, показываем пустую страницу с хедером
  if (!hasLessonData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Голосовой звонок с учителем</h1>
            <p className="text-gray-600">Функциональность голосового общения находится в разработке.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться назад
          </Button>

          {/* Voice Teacher Chat */}
          {(() => {
            const title = lessonData.title || 'Голосовой урок';
            const topic = lessonData.topic || 'Общее обучение';
            const aspects = lessonData.aspects || lessonData.description || 'Интерактивное обучение с голосом';
            console.log('🎤 Rendering VoiceTeacherChat with data:', { title, topic, aspects });

            return (
              <VoiceTeacherChat
                lessonTitle={title}
                lessonTopic={topic}
                lessonAspects={aspects}
                onComplete={() => {
                  console.log('🎤 Voice call completed, navigating to courses');
                  navigate('/courses');
                }}
                onClose={() => {
                  console.log('🎤 Voice call closed, navigating to courses');
                  navigate('/courses');
                }}
              />
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default VoiceCallPage;
