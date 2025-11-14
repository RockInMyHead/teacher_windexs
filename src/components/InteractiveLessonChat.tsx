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
  Loader
} from 'lucide-react';
import { OpenAITTS } from '@/lib/openaiTTS';
import Header from '@/components/Header';

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
  onComplete
}: InteractiveLessonChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stage, setStage] = useState<'intro' | 'content' | 'practice' | 'complete'>('intro');
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
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
    // Stop any ongoing TTS before starting the lesson - comprehensive cleanup
    console.log('🧹 Initializing lesson - stopping any existing TTS');
    try {
      if (typeof OpenAITTS !== 'undefined' && OpenAITTS.stop) {
        OpenAITTS.stop();
        console.log('🔇 Existing TTS stopped via OpenAITTS.stop()');
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('🔇 Existing TTS stopped via speechSynthesis.cancel()');
      }
    } catch (error) {
      console.error('❌ Error stopping existing TTS:', error);
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
          
          // Auto-speak first portion
          console.log('✅ Lesson initialized - auto-playing first portion');
          console.log('📄 TTS Text:');
          console.log(portions[0]);
          console.log('---');
          
          // Give a small delay for the component to fully render
          setTimeout(() => {
            if (typeof OpenAITTS !== 'undefined' && OpenAITTS.speak) {
              try {
                console.log('🎤 Auto-reading first portion...');
                speakSentenceBySentence(portions[0]);
                setIsPlaying(true);
              } catch (error) {
                console.error('❌ Error auto-speaking first portion:', error);
              }
            }
          }, 500);
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
      
      // Auto-speak welcome message when lesson initializes
      console.log('✅ Lesson initialized - auto-playing welcome message (no content)');
      console.log('📝 Welcome message content:');
      console.log(welcomeMessage.content);
      console.log('---');
      
      // Give a small delay for the component to fully render
      setTimeout(() => {
        if (typeof OpenAITTS !== 'undefined' && OpenAITTS.speak) {
          try {
            console.log('🎤 Auto-reading welcome message...');
            console.log('📄 TTS Text:');
            console.log(welcomeMessage.content);
            console.log('---');
            speakSentenceBySentence(welcomeMessage.content);
            setIsPlaying(true);
          } catch (error) {
            console.error('❌ Error auto-speaking welcome:', error);
          }
        }
      }, 500);
    };

    initializeLesson();

    // Cleanup: Stop TTS when component unmounts
    return () => {
      console.log('🧹 InteractiveLessonChat unmounting - stopping all TTS');

      // Stop all TTS immediately
      const stopAllTTS = () => {
        try {
          if (typeof OpenAITTS !== 'undefined' && OpenAITTS.stop) {
            OpenAITTS.stop();
            console.log('🔇 TTS stopped via OpenAITTS.stop()');
          }
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            console.log('🔇 TTS stopped via speechSynthesis.cancel()');
          }
          // Try to stop any audio elements
          const audioElements = document.querySelectorAll('audio');
          audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
          });
          console.log('🔇 All audio elements stopped');
        } catch (error) {
          console.error('❌ Error stopping TTS on unmount:', error);
        }
      };

      stopAllTTS();
      setIsPlaying(false);

      // Also add beforeunload listener to stop TTS if user navigates away
      const handleBeforeUnload = () => {
        stopAllTTS();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      // Note: cleanup function for beforeunload would be handled by browser
      // when page unloads, but we add it for completeness
    };
  }, [lessonTitle, lessonTopic, lessonContent]);

  // Function to speak text sentence by sentence
  const speakSentenceBySentence = async (text: string) => {
    console.log('🎤 Starting sentence-by-sentence TTS...');

    // Split text into sentences (basic splitting)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).map(s => s.trim() + '.');

    // Additional check to stop if TTS was disabled while preparing
    if (!isPlaying) {
      console.log('🛑 TTS was stopped before starting sentence-by-sentence');
      return;
    }

    console.log(`📝 Found ${sentences.length} sentences to speak`);

    // Speak each sentence sequentially
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      if (sentence.trim().length < 5) continue; // Skip very short sentences

      console.log(`🎵 Speaking sentence ${i + 1}/${sentences.length}: "${sentence.substring(0, 50)}..."`);

      try {
        // Check if TTS is still enabled
        if (!isPlaying) {
          console.log('🛑 TTS stopped by user');
          break;
        }

        await OpenAITTS.speak(sentence);
        console.log(`✅ Sentence ${i + 1} completed`);

        // Small pause between sentences (except last one)
        if (i < sentences.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.error(`❌ Error speaking sentence ${i + 1}:`, error);
        // Continue with next sentence
      }
    }

    console.log('🎤 Sentence-by-sentence TTS completed');
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
      
      // Auto-speak the portion
      if (typeof OpenAITTS !== 'undefined' && OpenAITTS.speak) {
        try {
          console.log('🎤 Auto-reading portion...');
          console.log('📄 TTS Text:');
          console.log(portion);
          console.log('---');
          await speakSentenceBySentence(portion);
          setIsPlaying(true);
        } catch (error) {
          console.error('❌ Error speaking portion:', error);
        }
      }
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
          model: 'gpt-4-turbo',
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

  // Function to speak text sentence by sentence
  const toggleTTS = async () => {
    if (typeof OpenAITTS === 'undefined') {
      console.warn('🔇 TTS not available');
      return;
    }

    if (isPlaying) {
      console.log('🔇 Stopping TTS');
      if (OpenAITTS.stop) {
        OpenAITTS.stop();
      }
      setIsPlaying(false);
    } else {
      console.log('🔊 Starting TTS - Looking for assistant messages');
      setIsPlaying(true);
      // Speak the last assistant message
      const lastMessage = messages.filter(m => m.role === 'assistant').pop();
      console.log('📝 Last assistant message (preview):', lastMessage?.content.substring(0, 100) + '...');

      if (lastMessage && OpenAITTS.speak) {
        try {
          console.log('🎤 Reading message to user sentence by sentence...');
          console.log('📄 TTS Text:');
          console.log(lastMessage.content);
          console.log('---');

          // Use sentence-by-sentence speaking
          await speakSentenceBySentence(lastMessage.content);
          console.log('✅ TTS finished');
        } catch (error) {
          console.error('❌ Error toggling TTS:', error);
        } finally {
          setIsPlaying(false);
        }
      } else {
        console.warn('⚠️ No assistant message found or OpenAITTS.speak not available');
        setIsPlaying(false);
      }
    }
  };

  const handleComplete = () => {
    console.log('🎉 Completing lesson...');

    // Stop TTS immediately when completing - multiple methods
    console.log('🧹 Stopping all TTS before lesson completion');
    try {
      if (typeof OpenAITTS !== 'undefined' && OpenAITTS.stop) {
        OpenAITTS.stop();
        console.log('🔇 TTS stopped via OpenAITTS.stop()');
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('🔇 TTS stopped via speechSynthesis.cancel()');
      }
    } catch (error) {
      console.error('❌ Error stopping TTS on complete:', error);
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

      // Final TTS cleanup before navigation
      console.log('🧹 Final TTS cleanup before navigation');
      try {
        if (typeof OpenAITTS !== 'undefined' && OpenAITTS.stop) {
          OpenAITTS.stop();
          console.log('🔇 Final TTS stop via OpenAITTS.stop()');
        }
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          console.log('🔇 Final TTS stop via speechSynthesis.cancel()');
        }
      } catch (error) {
        console.error('❌ Error in final TTS cleanup:', error);
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
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите вопрос или напишите что-то..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isLoading) {
                        sendMessage();
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1"
                  />
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

