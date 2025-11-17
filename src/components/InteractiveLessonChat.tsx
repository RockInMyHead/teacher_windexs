import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Send,
  MessageCircle,
  User,
  CheckCircle,
  Volume2,
  Mic,
  MicOff,
  Loader,
  Activity,
  Play
} from 'lucide-react';
import { OpenAITTS } from '@/lib/openaiTTS';
import { VoiceComm, VoiceUtils } from '@/lib/voiceComm';
import Header from '@/components/Header';

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

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LessonContent {
  title: string;
  theory: string;
  examples?: string[];
}

interface InteractiveLessonChatProps {
  lessonTitle: string;
  lessonTopic: string;
  lessonAspects: string;
  lessonContent?: LessonContent;
  onComplete: () => void;
  onToggleOnlineLesson?: () => void;
  isOnlineLesson?: boolean;
}

// Simple Markdown renderer component
const MarkdownContent = ({ content }: { content: string }) => {
  // Split content by lines
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Headings (### Level 3)
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-semibold mt-3 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
      i++;
      continue;
    }

    // Headings (## Level 2)
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-bold mt-4 mb-2">
          {line.replace('## ', '')}
        </h2>
      );
      i++;
      continue;
    }

    // Headings (# Level 1)
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-bold mt-5 mb-3">
          {line.replace('# ', '')}
        </h1>
      );
      i++;
      continue;
    }

    // Unordered lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside mb-3 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside mb-3 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // Regular paragraph with inline formatting
    if (line.trim()) {
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|🔹)/g);
      const formattedParts: React.ReactNode[] = [];

      parts.forEach((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          formattedParts.push(
            <span key={idx} className="text-green-600 font-semibold">
              {part.slice(2, -2)}
            </span>
          );
        } else if (part.startsWith('*') && part.endsWith('*')) {
          formattedParts.push(
            <em key={idx} className="italic">
              {part.slice(1, -1)}
            </em>
          );
        } else if (part.startsWith('`') && part.endsWith('`')) {
          formattedParts.push(
            <code key={idx} className="bg-muted px-2 py-1 rounded text-xs font-mono">
              {part.slice(1, -1)}
            </code>
          );
        } else if (part === '🔹') {
          formattedParts.push(
            <span key={idx} className="font-bold">
              🔹
            </span>
          );
        } else {
          formattedParts.push(part);
        }
      });

      elements.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed mb-3">
          {formattedParts}
        </p>
      );
    }

    i++;
  }

  return <div className="space-y-2">{elements}</div>;
};

const InteractiveLessonChat = ({
  lessonTitle,
  lessonTopic,
  lessonAspects,
  lessonContent,
  onComplete,
  onToggleOnlineLesson,
  isOnlineLesson = false
}: InteractiveLessonChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stage, setStage] = useState<'intro' | 'content' | 'practice' | 'complete'>('intro');
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechRecognitionAvailable, setIsSpeechRecognitionAvailable] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const [contentStage, setContentStage] = useState(0); // 0: intro, 1: theory, 2: examples, 3: practice
  const messageCountRef = useRef(1); // Track message count
  const contentPortionsRef = useRef<string[]>([]); // Store content portions
  const currentPortionRef = useRef(0); // Track current portion

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize Speech Recognition and Voice Communication
  useEffect(() => {
    console.log('🎤 Initializing Voice Communication...');
    
    // Инициализируем VoiceComm с коллбеками
    const isVoiceAvailable = VoiceComm.init(
      {
        language: 'ru-RU',
        ttsVoice: 'nova',
        ttsSpeed: 1.0,
        continuous: false
      },
      {
        onListeningStart: () => {
          console.log('🎙️ Listening started');
          setIsListening(true);
          setInterimTranscript('');
        },
        onListeningEnd: () => {
          console.log('🛑 Listening ended');
          setIsListening(false);
        },
        onTranscript: (text: string, isFinal: boolean) => {
          if (isFinal) {
            console.log('✅ Final transcript:', text);
            setInputMessage(text);
            setInterimTranscript('');
          } else {
            console.log('🔄 Interim transcript:', text);
            setInterimTranscript(text);
          }
        },
        onError: (error: string) => {
          console.error('❌ Voice error:', error);
          setIsListening(false);
          // Можно показать уведомление пользователю
        },
        onPlayStart: () => {
          console.log('🎤 TTS started');
        },
        onPlayEnd: () => {
          console.log('🎤 TTS ended');
        }
      }
    );

    if (isVoiceAvailable) {
      setIsSpeechRecognitionAvailable(true);
      console.log('✅ Voice Communication initialized');
    } else {
      console.warn('⚠️ Voice Communication not available');
      setIsSpeechRecognitionAvailable(false);
    }

    // Cleanup при размонтировании компонента
    return () => {
      console.log('🧹 Cleaning up Voice Communication');
      VoiceComm.cleanup();
    };
  }, []);

  // Split lesson content into portions for sequential display
  const splitContentIntoPortion = (content: LessonContent | undefined): string[] => {
    if (!content || !content.theory) return [];
    
    const portions: string[] = [];
    
    // Split by major sections (## Headers)
    const sections = content.theory.split(/(?=## )/);
    
    sections.forEach((section, idx) => {
      if (section.trim()) {
        // Split large sections further into paragraphs
        const paragraphs = section.split('\n\n').filter(p => p.trim());
        
        if (paragraphs.length > 1) {
          // If section has multiple paragraphs, add header + first paragraph as portion
          const header = paragraphs[0];
          portions.push(header + '\n\n' + paragraphs.slice(1, 3).join('\n\n'));
          
          // Add remaining paragraphs
          for (let i = 3; i < paragraphs.length; i += 2) {
            portions.push(paragraphs.slice(i, i + 2).join('\n\n'));
          }
        } else {
          portions.push(section);
        }
      }
    });
    
    // Add examples as separate portions if available
    if (content.examples && content.examples.length > 0) {
      portions.push('## Практические задания\n\n' + content.examples.slice(0, 2).join('\n- '));
      if (content.examples.length > 2) {
        portions.push(content.examples.slice(2).join('\n- '));
      }
    }
    
    return portions.filter(p => p.trim().length > 0);
  };

  // Initialize lesson with welcome message
  useEffect(() => {
    // Stop any ongoing voice communication before starting the lesson
    console.log('🧹 Initializing lesson - stopping any existing voice communication');
    try {
      VoiceComm.reset();
      console.log('🔇 Existing voice communication stopped');
    } catch (error) {
      console.error('❌ Error stopping existing voice communication:', error);
    }

    const initializeLesson = async () => {
      // Prepare content portions
      if (lessonContent) {
        const portions = splitContentIntoPortion(lessonContent);
        contentPortionsRef.current = portions;
        console.log('📚 Lesson content split into', portions.length, 'portions');
        console.log('📄 First portion (how it will appear in chat and TTS):');
        console.log(portions[0]);
        console.log('---');
        
        // If we have content portions, show the first one instead of welcome message
        if (portions.length > 0) {
          const firstPortionMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: portions[0],
            timestamp: new Date()
          };
          setMessages([firstPortionMessage]);
          currentPortionRef.current = 1; // Mark first portion as shown
          
          // Lesson initialized - waiting for user to press button to hear TTS
          console.log('✅ Lesson initialized - ready for user to press play button');
          console.log('📄 First portion content:');
          console.log(portions[0]);
          console.log('---');
          console.log('🎤 User can now click 🔊 button to hear this message');
          return;
        }
      }
      
      // Fallback: show welcome message if no lesson content
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `👋 Добро пожаловать на урок: "${lessonTitle}"!\n\nТема: ${lessonTopic}\n\nМы начнем с введения в материал. Нажмите "Далее" или напишите вопрос, если вам что-то непонятно.`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      // Lesson initialized - waiting for user to press button
      console.log('✅ Lesson initialized - ready for user to press play button');
      console.log('📝 Welcome message content:');
      console.log(welcomeMessage.content);
      console.log('---');
      console.log('🎤 User can now click 🔊 button to hear this message');
    };

    initializeLesson();

    // Cleanup: Stop all voice communication when component unmounts
    return () => {
      console.log('🧹 InteractiveLessonChat unmounting - stopping all voice communication');

      // Stop all voice communication immediately
      const stopAllVoiceComm = () => {
        try {
          VoiceComm.stopSpeaking();
          VoiceComm.stopListening();
          console.log('🔇 Voice communication stopped');

          // Try to stop any audio elements
          const audioElements = document.querySelectorAll('audio');
          audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
          });
          console.log('🔇 All audio elements stopped');
        } catch (error) {
          console.error('❌ Error stopping voice communication on unmount:', error);
        }
      };

      stopAllVoiceComm();
      setIsPlaying(false);

      // Also add beforeunload listener to stop voice communication if user navigates away
      const handleBeforeUnload = () => {
        stopAllVoiceComm();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup beforeunload listener
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    };
  }, [lessonTitle, lessonTopic, lessonContent]);

  // Function to speak text sentence by sentence using VoiceComm
  const speakSentenceBySentence = async (text: string) => {
    console.log('🎤 Starting sentence-by-sentence TTS...');

    try {
      await VoiceComm.speakText(text, {
        language: 'ru-RU',
        ttsVoice: 'nova',
        ttsSpeed: 1.0
      });
      console.log('✅ Text speaking completed');
    } catch (error) {
      console.error('❌ Error speaking text:', error);

      // Проверяем тип ошибки и показываем соответствующее сообщение
      if (error instanceof Error) {
        if (error.message.includes('NotSupportedError') ||
            error.message.includes('not supported') ||
            error.message.includes('Audio API not supported')) {
          console.warn('⚠️ TTS not supported in this browser');
          // Можно показать уведомление пользователю
        } else if (error.message.includes('OpenAI TTS API error')) {
          console.warn('⚠️ OpenAI TTS API error - check API key and network');
        }
      }
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check if user said "Далее" (Next) to get next content portion
    const isNextCommand = inputMessage.toLowerCase().includes('далее') || inputMessage.toLowerCase().includes('next');
    
    if (isNextCommand && contentPortionsRef.current.length > 0 && currentPortionRef.current < contentPortionsRef.current.length) {
      console.log(`📖 Showing content portion ${currentPortionRef.current + 1}/${contentPortionsRef.current.length}`);
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      
      // Get next portion
      const portion = contentPortionsRef.current[currentPortionRef.current];
      currentPortionRef.current += 1;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: portion,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      messageCountRef.current += 1;
      
      // Update progress
      const newProgress = Math.min(100, 20 + (messageCountRef.current * 10));
      setProgress(newProgress);
      
      // Mark lesson as complete after sufficient interaction
      if (messageCountRef.current >= 8) {
        console.log('🎉 Lesson progress complete - enabling finish button');
        setIsLessonComplete(true);
      }
      
      // Portion displayed - waiting for user to click play button
      console.log('✅ Next portion displayed - ready for user to press play button');
      console.log('📄 Portion content:');
      console.log(portion);
      console.log('---');
      console.log('🎤 User can now click 🔊 button to hear this message');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Force absolute path with version cache buster
      const apiUrl = `${window.location.origin}/api/chat/completions?v=${Date.now()}`;
      console.log('📤 Sending message to:', apiUrl, 'with', messages.length + 1, 'total messages');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Ты - опытный учитель английского языка. Ты ведешь интерактивный урок "${lessonTitle}" по теме "${lessonTopic}".

СТРОГИЕ ПРАВИЛА:
1. Материал должен быть основан ТОЛЬКО на следующих аспектах урока:
${lessonAspects}

2. Структура урока ДОЛЖНА быть такой же, как в традиционных конспектах:
   - ВВЕДЕНИЕ в тему
   - ОСНОВНЫЕ ПОНЯТИЯ И ПРАВИЛА (с примерами)
   - ПОДРОБНЫЕ ОБЪЯСНЕНИЯ с примерами
   - ПРАКТИЧЕСКИЕ УПРАЖНЕНИЯ
   - ТИПИЧНЫЕ ОШИБКИ И КАК ИХ ИЗБЕЖАТЬ
   - ДОПОЛНИТЕЛЬНЫЕ МАТЕРИАЛЫ

3. Используй английские слова и фразы в **двойных звездочках** для выделения
4. Давай материал ПОРЦИОННО - не все сразу, а постепенно
5. Будь дружелюбным, но строгим в объяснениях
6. Всегда предлагай продолжить урок или перейти к практике

Если ученик говорит "Далее" - давай следующую порцию материала.
Если ученик спрашивает о чем-то конкретном - объясняй подробно на основе аспектов урока.`,
            },
            ...messages.map(msg => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            })),
            {
              role: 'user' as const,
              content: userMessage.content
            }
          ],
          model: 'gpt-5.1',
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const errorData = await response.text().catch(() => 'Unknown error');
        console.error('API error:', response.status, errorData);
        throw new Error(`Failed to get response: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      messageCountRef.current += 1;

      // Update progress based on message count
      const newProgress = Math.min(100, 20 + (messageCountRef.current * 10));
      setProgress(newProgress);
      
      // Mark lesson as complete after sufficient interaction (8+ messages = ~80% progress)
      if (messageCountRef.current >= 8) {
        console.log('🎉 Lesson progress complete - enabling finish button');
        setIsLessonComplete(true);
      }

      // Don't auto-speak - only speak if user explicitly enabled TTS with the button
      // The toggleTTS function will handle speaking when needed
      console.log(`✅ Assistant message #${messageCountRef.current} received:`, assistantMessage.content.substring(0, 50) + '...');
      if (isPlaying) {
        console.log('🔊 TTS is enabled - user can click to play audio');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Извините, произошла ошибка. Попробуйте еще раз или обновите страницу.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNext = async () => {
    setInputMessage('Далее');
    // Trigger send after state update
    setTimeout(() => {
      sendMessage();
    }, 0);
  };

  // Function to toggle TTS for last assistant message
  const toggleTTS = async () => {
    if (isPlaying) {
      console.log('🔇 Stopping TTS');
      VoiceComm.stopSpeaking();
      setIsPlaying(false);
    } else {
      console.log('🔊 Starting TTS - Looking for assistant messages');
      
      // Get the last assistant message
      const lastMessage = messages.filter(m => m.role === 'assistant').pop();
      console.log('📝 Last assistant message (preview):', lastMessage?.content.substring(0, 100) + '...');

      if (lastMessage) {
        try {
          console.log('🎤 Reading message to user sentence by sentence...');
          console.log('📄 TTS Text:');
          console.log(lastMessage.content);
          console.log('---');

          setIsPlaying(true);
          // Use sentence-by-sentence speaking
          await speakSentenceBySentence(lastMessage.content);
          console.log('✅ TTS finished');
        } catch (error) {
          console.error('❌ Error toggling TTS:', error);
        } finally {
          setIsPlaying(false);
        }
      } else {
        console.warn('⚠️ No assistant message found');
        setIsPlaying(false);
      }
    }
  };

  const handleComplete = () => {
    console.log('🎉 Completing lesson...');

    // Stop all voice communication
    console.log('🧹 Stopping all voice communication before lesson completion');
    try {
      VoiceComm.stopSpeaking();
      VoiceComm.stopListening();
      console.log('🔇 All voice communication stopped');
    } catch (error) {
      console.error('❌ Error stopping voice communication on complete:', error);
    }
    setIsPlaying(false);

    setProgress(100);
    setStage('complete');
    
    // Show completion modal/message
    const completionMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `🎉 ПОЗДРАВЛЯЕМ! 🎉

Вы успешно завершили урок "${lessonTitle}"!

✅ Урок отмечен как пройденный
📊 Ваш прогресс: 100%
🏆 Отлично сработано!

За ваши старания вы получили:
• Новые знания по теме "${lessonTopic}"
• Практический опыт
• Сертификат о прохождении урока

Теперь вы можете:
→ Перейти к следующему уроку
→ Пересмотреть материал
→ Проверить ваш прогресс в курсе

Перенаправление в курс через 3 секунды...`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, completionMessage]);

    // Call completion callback after delay
    setTimeout(() => {
      console.log('📍 Redirecting to course page...');

      // Final voice communication cleanup before navigation
      console.log('🧹 Final voice communication cleanup before navigation');
      try {
        VoiceComm.cleanup();
        console.log('🔇 Final voice communication cleanup completed');
      } catch (error) {
        console.error('❌ Error in final voice communication cleanup:', error);
      }

      onComplete();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex flex-col">
      {/* Navigation Header */}
      <Header />

      {/* Lesson Header with title and progress */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{lessonTitle}</h1>
              <p className="text-sm text-muted-foreground">Тема: {lessonTopic}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTTS}
                className={isPlaying ? 'bg-primary/10' : ''}
                title={isPlaying ? 'Включить озвучку' : 'Включить озвучку'}
              >
                <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-primary' : ''}`} />
              </Button>
              {onToggleOnlineLesson && (
                <Button
                  variant={isOnlineLesson ? "destructive" : "default"}
                  size="sm"
                  onClick={onToggleOnlineLesson}
                  className="flex items-center gap-2"
                  title={isOnlineLesson ? "Перейти в оффлайн режим" : "Перейти в онлайн урок"}
                >
                  <Play className="w-4 h-4" />
                  {isOnlineLesson ? "Оффлайн" : "Онлайн урок"}
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Прогресс урока</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Card className="h-full flex flex-col">
          {/* Messages */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full" ref={scrollRef}>
              <div className="p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10">
                          <MessageCircle className="w-4 h-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-2xl rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-card border border-border rounded-bl-none'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      ) : (
                        <div className="text-sm">
                          <MarkdownContent content={message.content} />
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-muted">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Loader className="w-4 h-4 text-primary animate-spin" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-card border border-border rounded-lg rounded-bl-none px-4 py-3">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input area */}
          <div className="border-t border-border p-4 space-y-3">
            {stage !== 'complete' ? (
              <>
                {/* Voice indication display */}
                {isListening && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Слушаю вас...</p>
                      {interimTranscript && (
                        <p className="text-sm text-blue-700 italic">{interimTranscript}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder={isListening ? "Говорите сейчас..." : "Введите вопрос или напишите что-то..."}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isLoading) {
                        sendMessage();
                      }
                    }}
                    disabled={isLoading || isListening}
                    className="flex-1"
                  />
                  
                  {/* Microphone button */}
                  {isSpeechRecognitionAvailable && (
                    <Button
                      onClick={() => {
                        if (isListening) {
                          VoiceComm.stopListening();
                          setIsListening(false);
                        } else {
                          VoiceComm.startListening();
                        }
                      }}
                      variant={isListening ? "destructive" : "outline"}
                      size="icon"
                      title={isListening ? "Остановить запись" : "Начать запись"}
                      className="gap-2"
                    >
                      {isListening ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </Button>
                  )}

                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSendNext}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Далее ➜
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleComplete}
                    disabled={isLoading || !isLessonComplete}
                    className="flex-1 gap-2"
                    title={isLessonComplete ? 'Нажмите чтобы завершить урок' : 'Кнопка активируется после прохождения урока'}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Завершить урок {!isLessonComplete && '(недоступно)'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <h3 className="font-semibold text-green-900 mb-2">✅ Урок завершен!</h3>
                <p className="text-sm text-green-700">Вы успешно прошли урок. Перенаправление...</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default InteractiveLessonChat;

