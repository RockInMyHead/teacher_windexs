import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import {
  ArrowLeft,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Settings,
  Maximize2,
  MessageSquare
} from 'lucide-react';

// Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface TeacherInfo {
  name: string;
  subject: string;
  avatar: string;
  rating: number;
  experience: string;
}

const VideoCall: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [lessonInfo, setLessonInfo] = useState<any>(null);
  const [callMode, setCallMode] = useState<'video' | 'voice-ai'>('video'); // Добавлено состояние режима звонка

  // Состояния для голосового режима с ИИ
  const [isListening, setIsListening] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRefLocal = useRef<HTMLVideoElement>(null);
  const videoRefRemote = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Рефы для голосового режима с ИИ
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const teacherInfo: TeacherInfo = {
    name: 'Светлана Петровна',
    subject: 'Учитель русского языка',
    avatar: '👨‍🏫',
    rating: 4.9,
    experience: '15 лет опыта'
  };

  useEffect(() => {
    // Получаем информацию об уроке
    const storedLesson = localStorage.getItem('currentLesson');
    if (storedLesson) {
      setLessonInfo(JSON.parse(storedLesson));
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, []);

  const startCall = async () => {
    try {
      setIsCallActive(true);

      // Получаем доступ к камере и микрофону
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        });

        if (videoRefLocal.current) {
          videoRefLocal.current.srcObject = stream;
        }
      } catch (error) {
        console.warn('Camera/microphone access denied:', error);
        // Продолжаем даже без доступа к камере для демонстрации
      }

      // Запускаем таймер звонка
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Здесь должна быть логика WebRTC подключения к учителю
      // Для демонстрации просто показываем интерфейс вызова
    } catch (error) {
      console.error('Error starting call:', error);
      setIsCallActive(false);
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    setCallMode('video');

    // Останавливаем видеопоток
    if (videoRefLocal.current && videoRefLocal.current.srcObject) {
      const tracks = (videoRefLocal.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }

    // Закрываем таймер звонка
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }

    // Останавливаем распознавание речи
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Останавливаем TTS
    if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }

    // Очищаем таймер паузы
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    // Очищаем состояния
    setCurrentMessage('');
    setMessageQueue([]);
    setIsProcessing(false);

    // Возвращаемся на страницу урока
    navigate('/lesson');
  };

  const toggleMic = async () => {
    if (videoRefLocal.current && videoRefLocal.current.srcObject) {
      const tracks = (videoRefLocal.current.srcObject as MediaStream).getAudioTracks();
      tracks.forEach(track => {
        track.enabled = !isMicEnabled;
      });
      setIsMicEnabled(!isMicEnabled);
    }
  };

  const toggleVideo = async () => {
    if (videoRefLocal.current && videoRefLocal.current.srcObject) {
      const tracks = (videoRefLocal.current.srcObject as MediaStream).getVideoTracks();
      tracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  // Функции для голосового режима с ИИ
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ru-RU';

    recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setCurrentMessage(finalTranscript + interimTranscript);

      // Если есть финальный результат, запускаем таймер паузы
      if (finalTranscript) {
        startPauseTimer(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('🎤 Speech recognition ended');
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return recognition;
  };

  const startPauseTimer = (message: string) => {
    // Очищаем предыдущий таймер
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    // Запускаем новый таймер на 2 секунды
    pauseTimerRef.current = setTimeout(() => {
      console.log('⏰ Pause timer expired, processing message:', message);
      processMessage(message);
    }, 2000);
  };

  const processMessage = async (message: string) => {
    if (!message.trim()) return;

    console.log('🤖 Processing message:', message);
    setIsProcessing(true);

    try {
      // Отправляем сообщение в GPT
      const response = await callGPT(message);
      console.log('📥 GPT response:', response);

      // Озвучиваем ответ через TTS
      await speakText(response);

    } catch (error) {
      console.error('❌ Error processing message:', error);
      await speakText('Извините, произошла ошибка при обработке вашего вопроса. Попробуйте еще раз.');
    } finally {
      setIsProcessing(false);
      setCurrentMessage('');
    }
  };

  const callGPT = async (message: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found');
    }

    const lessonContext = lessonInfo ?
      `Тема урока: ${lessonInfo.title}. Предмет: ${lessonInfo.topic}. ` : '';

    const systemPrompt = `Вы - опытный учитель русского языка. ${lessonContext}Отвечайте на вопросы ученика ясно, доступно и по существу. Используйте дружелюбный тон и помогайте в обучении.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_completion_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`GPT API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Извините, не удалось получить ответ.';
  };

  const speakText = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      // Прерываем текущее озвучивание
      if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
        speechSynthesisRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      // Пытаемся выбрать русский голос
      const voices = speechSynthesis.getVoices();
      const russianVoice = voices.find(voice => voice.lang.startsWith('ru'));
      if (russianVoice) {
        utterance.voice = russianVoice;
      }

      utterance.onstart = () => {
        console.log('🔊 TTS started');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('🔊 TTS ended');
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('TTS error:', error);
        setIsSpeaking(false);
        resolve();
      };

      speechSynthesisRef.current = speechSynthesis;
      speechSynthesis.speak(utterance);
    });
  };

  const startVoiceCall = async () => {
    try {
      setCallMode('voice-ai');
      setIsCallActive(true);

      // Запускаем таймер звонка
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Инициализируем распознавание речи
      const recognition = initializeSpeechRecognition();
      if (recognition) {
        recognition.start();
      }

      console.log('🎯 Voice AI call started');

    } catch (error) {
      console.error('Error starting voice call:', error);
      setIsCallActive(false);
      setCallMode('video');
    }
  };

  const interruptTTS = () => {
    if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      console.log('⏹️ TTS interrupted by user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={() => navigate('/lesson')}
            variant="ghost"
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к уроку
          </Button>

          {/* Call Mode Selection */}
          {!isCallActive ? (
            <Card className="border-2 border-border/60 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-8 border-b border-border/50">
                <CardTitle className="text-2xl font-bold">Выберите режим звонка</CardTitle>
                <CardDescription>Как вы хотите пообщаться с учителем?</CardDescription>
              </CardHeader>

              <CardContent className="pt-8">
                <div className="max-w-md mx-auto space-y-6">
                  {/* Lesson Info */}
                  {lessonInfo && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-border/50">
                      <p className="text-sm text-muted-foreground mb-1">Тема обсуждения:</p>
                      <p className="font-semibold text-foreground">{lessonInfo.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{lessonInfo.topic}</p>
                    </div>
                  )}

                  {/* Voice AI Call */}
                  <Button
                    onClick={startVoiceCall}
                    className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 gap-3 font-semibold"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        🤖 <span>Голосовой звонок с ИИ</span>
                      </div>
                      <p className="text-xs opacity-90">Говорите голосом, получайте мгновенные ответы</p>
                    </div>
                  </Button>

                  <Button
                    onClick={() => navigate('/lesson')}
                    variant="outline"
                    className="w-full h-12 border-2"
                  >
                    Вернуться к уроку
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : callMode === 'voice-ai' ? (
            <Card className="border-2 border-border/60 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-8 border-b border-border/50">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  🤖 Голосовой звонок с ИИ
                  <div className="text-sm font-normal text-muted-foreground">
                    {formatTime(callDuration)}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-8">
                <div className="max-w-md mx-auto space-y-6">
                  {/* Status Indicators */}
                  <div className="space-y-3">
                    <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                      isListening ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' :
                      'bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800'
                    }`}>
                      <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium">
                        {isListening ? 'Слушаю вас...' : 'Готов слушать'}
                      </span>
                    </div>

                    {isProcessing && (
                      <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-sm font-medium">Обрабатываю вопрос...</span>
                      </div>
                    )}

                    {isSpeaking && (
                      <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                        <span className="text-sm font-medium">Говорю...</span>
                      </div>
                    )}
                  </div>

                  {/* Current Message */}
                  {currentMessage && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-border/50">
                      <p className="text-sm text-muted-foreground mb-1">Ваше сообщение:</p>
                      <p className="font-medium text-foreground">{currentMessage}</p>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex flex-col gap-3">
                    {isSpeaking && (
                      <Button
                        onClick={interruptTTS}
                        variant="outline"
                        className="w-full h-12 border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                      >
                        ⏹️ Прервать ответ
                      </Button>
                    )}

                    <Button
                      onClick={endCall}
                      variant="destructive"
                      className="w-full h-12 font-semibold"
                    >
                      <PhoneOff className="w-5 h-5 mr-2" />
                      Завершить звонок
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
            <Card className="border-2 border-border/60 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-8 border-b border-border/50">
                <CardTitle className="text-2xl font-bold">Онлайн звонок</CardTitle>
              </CardHeader>

              <CardContent className="pt-8">
                <div className="max-w-md mx-auto space-y-6">
                  {/* Lesson Info */}
                  {lessonInfo && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-border/50">
                      <p className="text-sm text-muted-foreground mb-1">Тема обсуждения:</p>
                      <p className="font-semibold text-foreground">{lessonInfo.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{lessonInfo.topic}</p>
                    </div>
                  )}

                  {/* Call Status */}
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-center text-sm font-medium text-green-800 dark:text-green-200">
                      Учитель онлайн и готов к звонку
                    </p>
                  </div>

                  {/* Start Call Button */}
                  <Button
                    onClick={startCall}
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-base gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Начать звонок
                  </Button>

                  <Button
                    onClick={() => navigate('/lesson')}
                    variant="outline"
                    className="w-full h-12 border-2"
                  >
                    Вернуться к уроку
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              {/* Main Video Area */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Remote Video (Teacher) */}
                <div className="lg:col-span-3 aspect-video bg-black rounded-lg overflow-hidden relative shadow-xl border-2 border-border/60">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <div className="text-center">
                      <div className="text-6xl mb-4">👨‍🏫</div>
                      <p className="text-white text-lg font-semibold">Учитель</p>
                      <p className="text-gray-400 text-sm">Онлайн</p>
                    </div>
                  </div>

                  {/* Call Duration */}
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full font-semibold">
                    {formatTime(callDuration)}
                  </div>
                </div>

                {/* Local Video (Student) */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-xl border-2 border-border/60">
                  <video
                    ref={videoRefLocal}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                    Вы
                  </div>
                </div>
              </div>

              {/* Controls */}
              <Card className="border-2 border-border/60 bg-card/80 backdrop-blur-xl">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {/* Mic Toggle */}
                    <Button
                      onClick={toggleMic}
                      variant={isMicEnabled ? 'default' : 'destructive'}
                      size="lg"
                      className="rounded-full w-14 h-14 p-0"
                      title={isMicEnabled ? 'Выключить микрофон' : 'Включить микрофон'}
                    >
                      {isMicEnabled ? (
                        <Mic className="w-6 h-6" />
                      ) : (
                        <MicOff className="w-6 h-6" />
                      )}
                    </Button>

                    {/* Video Toggle */}
                    <Button
                      onClick={toggleVideo}
                      variant={isVideoEnabled ? 'default' : 'destructive'}
                      size="lg"
                      className="rounded-full w-14 h-14 p-0"
                      title={isVideoEnabled ? 'Выключить камеру' : 'Включить камеру'}
                    >
                      {isVideoEnabled ? (
                        <Video className="w-6 h-6" />
                      ) : (
                        <VideoOff className="w-6 h-6" />
                      )}
                    </Button>

                    {/* Chat */}
                    <Button
                      onClick={() => navigate('/chat?mode=call')}
                      variant="outline"
                      size="lg"
                      className="rounded-full w-14 h-14 p-0"
                      title="Открыть чат"
                    >
                      <MessageSquare className="w-6 h-6" />
                    </Button>

                    {/* Share Screen */}
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full w-14 h-14 p-0"
                      title="Поделиться экраном"
                    >
                      <Share2 className="w-6 h-6" />
                    </Button>

                    {/* Settings */}
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full w-14 h-14 p-0"
                      title="Настройки"
                    >
                      <Settings className="w-6 h-6" />
                    </Button>

                    {/* Fullscreen */}
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full w-14 h-14 p-0"
                      title="На весь экран"
                    >
                      <Maximize2 className="w-6 h-6" />
                    </Button>

                    {/* End Call */}
                    <Button
                      onClick={endCall}
                      variant="destructive"
                      size="lg"
                      className="rounded-full w-14 h-14 p-0"
                      title="Завершить звонок"
                    >
                      <PhoneOff className="w-6 h-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Lesson Info */}
              {lessonInfo && (
                <Card className="border-2 border-border/60 bg-card/80 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Тема звонка</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-foreground mb-2">{lessonInfo.title}</h3>
                    <p className="text-muted-foreground">{lessonInfo.topic}</p>
                  </CardContent>
                </Card>
              )}
            </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoCall;

