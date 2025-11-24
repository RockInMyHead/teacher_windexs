import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, BookOpen, Lightbulb, MessageSquare, Send, AlertTriangle, Target, Trophy, Volume2, VolumeX } from 'lucide-react';
import { OpenAITTS } from '@/lib/openaiTTS';

interface LessonSection {
  title: string;
  content: string;
  examples?: Array<{example: string, explanation: string}>;
  practiceInside?: {
    type: string;
    instruction: string;
    hint?: string;
  };
  mistakes?: Array<{mistake: string, explanation: string}>;
  tasks?: Array<{type: string, task: string, hint?: string}>;
  summary?: string;
}

interface LessonDisplayProps {
  stepTitle: string;
  stepNumber: number;
  totalSteps: number;
  content: string;
  structuredContent?: LessonSection[];
  duration: string;
  onNext?: () => void;
  isGenerating?: boolean;
  onAnswer?: (answer: string) => void;
  currentTask?: any;
  waitingForAnswer?: boolean;
}

export const LessonDisplay: React.FC<LessonDisplayProps> = ({
  stepTitle,
  stepNumber,
  totalSteps,
  content,
  structuredContent,
  duration,
  onNext,
  isGenerating = false,
  onAnswer,
  currentTask,
  waitingForAnswer = false,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taskAnswer, setTaskAnswer] = useState('');
  const [playingSections, setPlayingSections] = useState<Set<number>>(new Set());
  const [autoSpokenSections, setAutoSpokenSections] = useState<Set<number>>(new Set());

  // Auto-speak first section when structured content loads
  useEffect(() => {
    if (structuredContent && structuredContent.length > 0 && !isGenerating) {
      const firstSection = structuredContent[0];
      if (firstSection && !autoSpokenSections.has(0)) {
        console.log('🎵 Auto-speaking first lesson section');
        // Add small delay to let UI render
        setTimeout(() => {
          speakSection(0, firstSection);
          setAutoSpokenSections(prev => new Set(prev).add(0));
        }, 1000);
      }
    }
  }, [structuredContent, isGenerating, autoSpokenSections]);

  // Reset animation when content changes
  useEffect(() => {
    if (content) {
      setDisplayedContent('');
      setCurrentIndex(0);
      setIsTyping(true);
    }
  }, [content]);

  // Typewriter effect for content
  useEffect(() => {
    if (!content || currentIndex >= content.length) {
      setIsTyping(false);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedContent(prev => prev + content[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, 15); // Скорость печати

    return () => clearTimeout(timer);
  }, [content, currentIndex]);

  const handleSkipAnimation = () => {
    setDisplayedContent(content);
    setCurrentIndex(content.length);
    setIsTyping(false);
  };

  // TTS functionality for sections
  const speakSection = async (sectionIndex: number, section: LessonSection) => {
    if (playingSections.has(sectionIndex)) {
      console.log('🔇 Stopping TTS for section', sectionIndex);
      OpenAITTS.stop();
      setPlayingSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(sectionIndex);
        return newSet;
      });
      return;
    }

    try {
      console.log('🔊 Starting TTS for section', sectionIndex);
      setPlayingSections(prev => new Set(prev).add(sectionIndex));

      // Build text to speak
      let textToSpeak = `${section.title}. ${section.content}`;

      if (section.examples && section.examples.length > 0) {
        textToSpeak += ' Примеры: ';
        section.examples.forEach((example, idx) => {
          textToSpeak += `Пример ${idx + 1}: ${example.example}. Объяснение: ${example.explanation}. `;
        });
      }

      if (section.practiceInside) {
        textToSpeak += ` Практическое задание: ${section.practiceInside.instruction}`;
        if (section.practiceInside.hint) {
          textToSpeak += ` Подсказка: ${section.practiceInside.hint}`;
        }
      }

      try {
        await OpenAITTS.speak(textToSpeak, `section-${sectionIndex}`);
      } catch (error) {
        // Если ошибка связана с autoplay, показываем специальное сообщение
        if (error.message.includes('NotAllowedError') || error.message.includes('blocked by browser')) {
          console.warn('TTS blocked by browser autoplay policy - user interaction required');
          // Можно добавить уведомление пользователю здесь
          throw new Error('Для озвучки требуется взаимодействие с страницей. Нажмите в любом месте страницы.');
        }
        throw error;
      }

      console.log('✅ TTS finished for section', sectionIndex);
    } catch (error) {
      console.error('❌ TTS error for section', sectionIndex, error);
    } finally {
      setPlayingSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(sectionIndex);
        return newSet;
      });
    }
  };

  // Helper function to process markdown in text
  const processMarkdown = (text: string): React.ReactNode => {
    if (!text) return text;

    // Process markdown formatting
    const parts: React.ReactNode[] = [];
    let key = 0;

    // Process **bold** text (non-greedy to handle multiple bold sections)
    const boldRegex = /\*\*([^*]+?)\*\*/g;
    let match;
    let currentIndex = 0;
    const matches: Array<{ index: number; length: number; text: string }> = [];

    // Collect all matches first
    while ((match = boldRegex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        text: match[1]
      });
    }

    // Process matches
    matches.forEach((boldMatch) => {
      // Add text before match
      if (boldMatch.index > currentIndex) {
        const beforeText = text.substring(currentIndex, boldMatch.index);
        if (beforeText) {
          parts.push(
            <span key={`text-${key++}`}>{beforeText}</span>
          );
        }
      }
      // Add bold text
      parts.push(
        <strong key={`bold-${key++}`} className="font-semibold text-foreground">
          {boldMatch.text}
        </strong>
      );
      currentIndex = boldMatch.index + boldMatch.length;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.substring(currentIndex);
      if (remainingText) {
        parts.push(
          <span key={`text-${key++}`}>{remainingText}</span>
        );
      }
    }

    return parts.length > 0 ? <>{parts}</> : text;
  };

  // Helper function to process inline markdown (emojis, etc.)
  const processMarkdownInline = (text: string): string => {
    return text;
  };

  // Render structured content with TTS buttons
  const renderStructuredContent = () => {
    if (!structuredContent || structuredContent.length === 0) return null;

    return (
      <div className="space-y-6">
        {structuredContent.map((section, index) => (
          <Card key={`section-${index}`} className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {section.title}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakSection(index, section)}
                  className="gap-2"
                  disabled={isGenerating}
                >
                  {playingSections.has(index) ? (
                    <>
                      <VolumeX className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">Стоп</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-primary" />
                      <span>Озвучить</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main content */}
              <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {section.content}
              </div>

              {/* Examples */}
              {section.examples && section.examples.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    Примеры:
                  </h4>
                  {section.examples.map((example, exIdx) => (
                    <Card key={`example-${exIdx}`} className="bg-yellow-50 border-yellow-200">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <p className="font-medium text-yellow-900">{example.example}</p>
                          <p className="text-sm text-yellow-800">{example.explanation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Practice inside */}
              {section.practiceInside && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-semibold text-blue-900">💪 Практическое задание:</p>
                        <p className="text-sm text-blue-800">{section.practiceInside.instruction}</p>
                        {section.practiceInside.hint && (
                          <p className="text-sm text-blue-700 italic">
                            💡 Подсказка: {section.practiceInside.hint}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mistakes */}
              {section.mistakes && section.mistakes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Типичные ошибки:
                  </h4>
                  {section.mistakes.map((mistake, misIdx) => (
                    <Card key={`mistake-${misIdx}`} className="bg-red-50 border-red-200">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <p className="font-medium text-red-900">{mistake.mistake}</p>
                          <p className="text-sm text-red-800">{mistake.explanation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {section.tasks && section.tasks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Практические упражнения:
                  </h4>
                  {section.tasks.map((task, taskIdx) => (
                    <Card key={`task-${taskIdx}`} className="bg-green-50 border-green-200">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <p className="font-medium text-green-900">{taskIdx + 1}. {task.task}</p>
                          {task.hint && (
                            <p className="text-sm text-green-800 italic">
                              💡 Подсказка: {task.hint}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Summary */}
              {section.summary && (
                <Card className="bg-purple-50 border-purple-200 border-l-4 border-l-purple-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-semibold text-purple-900">📌 Резюме:</p>
                        <p className="text-sm text-purple-800">{section.summary}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Parse and render content with smart formatting (fallback)
  const renderContent = () => {
    if (!displayedContent) return null;

    const parts: React.ReactNode[] = [];
    const lines = displayedContent.split('\n');
    let inQuestionBlock = false;
    let questionOptions: string[] = [];

    lines.forEach((line, idx) => {
      // Пропускаем пустые строки
      if (!line.trim()) {
        parts.push(<br key={`br-${idx}`} />);
        return;
      }

      // Интерактивный элемент (вопрос)
      if (line.includes('[Интерактивный элемент:]')) {
        inQuestionBlock = true;
        questionOptions = [];
        return;
      }

      // Опции вопроса (a), b), c), d))
      if (inQuestionBlock && line.match(/^[a-d]\)/)) {
        questionOptions.push(line.trim());
        return;
      }

      // Конец блока вопроса
      if (inQuestionBlock && !line.match(/^[a-d]\)/) && line.trim() !== '') {
        if (questionOptions.length > 0) {
          parts.push(
            <Card key={`question-${idx}`} className="mb-6 border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 mb-4">
                      {lines[idx - questionOptions.length - 1] || 'Вопрос для проверки знаний'}
                    </p>
                    <div className="space-y-2">
                      {questionOptions.map((option, optIdx) => (
                        <Button
                          key={`opt-${optIdx}`}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-2 px-4 hover:bg-blue-100 border-blue-300 font-medium"
                          onClick={() => {
                            onAnswer?.(option);
                          }}
                        >
                          <span className="text-blue-600 mr-2">{option[0]})</span>
                          <span>{option.substring(2)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          questionOptions = [];
        }
        inQuestionBlock = false;
      }

      // Слайд
      if (line.match(/\[\*?\*Слайд \d+:\*?\*\]/)) {
        const slideContent = line.replace(/\[\*?\*Слайд \d+:\*?\*\]/, '').trim();
        parts.push(
          <Card key={`slide-${idx}`} className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800 leading-relaxed font-medium">{slideContent}</p>
              </div>
            </CardContent>
          </Card>
        );
        return;
      }

      // Примеры и код
      if (line.includes('Пример:') || line.includes('Пример')) {
        parts.push(
          <Card key={`example-${idx}`} className="mb-4 bg-yellow-50 border-yellow-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-yellow-900 font-semibold mb-2">📝 Пример:</p>
                  <p className="text-gray-800 font-mono bg-yellow-100 p-3 rounded text-sm">
                    {line.replace(/Пример.*?:/i, '').trim()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        return;
      }

      // Типичные ошибки
      if (line.includes('Ошибка:') || line.includes('Неправильно') || line.includes('❌')) {
        parts.push(
          <Card key={`error-${idx}`} className="mb-4 bg-red-50 border-red-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-900 font-semibold mb-2">⚠️ Типичная ошибка:</p>
                  <p className="text-gray-800 bg-red-100 p-3 rounded text-sm">
                    {line.replace(/(Ошибка:|Неправильно|❌).*?:/i, '').trim()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        return;
      }

      // Резюме и выводы
      if (line.includes('Резюме:') || line.includes('Выводы:') || line.includes('Запомни:')) {
        parts.push(
          <Card key={`summary-${idx}`} className="mb-4 bg-green-50 border-green-200 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Trophy className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-900 font-semibold mb-2">📌 Ключевые моменты:</p>
                  <p className="text-gray-800">
                    {line.replace(/(Резюме:|Выводы:|Запомни:).*?:/i, '').trim()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        return;
      }

      // Цитаты и важное
      if (line.startsWith('💡') || line.startsWith('⭐') || line.startsWith('❗')) {
        parts.push(
          <Card key={`important-${idx}`} className="mb-4 bg-amber-50 border-amber-200 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pl-4">
              <p className="text-amber-900 font-medium">{line}</p>
            </CardContent>
          </Card>
        );
        return;
      }

      // Заголовки с эмодзи и markdown (🎓 **Заголовок**)
      const emojiHeadingMatch = line.match(/^([🎓📝💡⭐❗⚠️])\s+\*\*(.+?)\*\*/);
      if (emojiHeadingMatch) {
        const emoji = emojiHeadingMatch[1];
        const title = emojiHeadingMatch[2].trim();
        parts.push(
          <h2
            key={`heading-emoji-${idx}`}
            className="mb-4 mt-6 text-xl font-bold text-foreground flex items-center gap-2"
          >
            <span>{emoji}</span>
            <span>{title}</span>
          </h2>
        );
        return;
      }

      // Заголовки markdown (# ## ###)
      if (line.match(/^#{1,3}\s+/)) {
        const level = line.match(/^(#{1,3})/)?.[1].length || 1;
        const title = line.replace(/^#{1,3}\s+/, '').trim();
        const HeadingTag = `h${Math.min(level + 2, 6)}` as keyof JSX.IntrinsicElements;
        parts.push(
          <HeadingTag
            key={`heading-${idx}`}
            className={`mb-4 font-bold text-foreground ${
              level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'
            }`}
          >
            {processMarkdown(title)}
          </HeadingTag>
        );
        return;
      }

      // Обычный текст с markdown
      if (line.trim()) {
        parts.push(
          <p key={`text-${idx}`} className="mb-3 text-gray-800 leading-relaxed text-base">
            {processMarkdown(line.trim())}
          </p>
        );
      }
    });

    // Если есть оставшиеся вопросы
    if (inQuestionBlock && questionOptions.length > 0) {
      parts.push(
        <Card key="final-question" className="mb-6 border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="space-y-2">
                  {questionOptions.map((option, optIdx) => (
                    <Button
                      key={`final-opt-${optIdx}`}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2 px-4 hover:bg-blue-100 border-blue-300 font-medium"
                      onClick={() => {
                        onAnswer?.(option);
                      }}
                    >
                      <span className="text-blue-600 mr-2">{option[0]})</span>
                      <span>{option.substring(2)}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return parts;
  };

  return (
    <div className="w-full space-y-6">
      {/* Заголовок шага */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold shadow-lg">
                  {stepNumber}
                </span>
                Секция урока
              </CardTitle>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  📍 Секция {stepNumber} из {totalSteps}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  ⏱️ {duration} минут
                </span>
              </div>
            </div>

            {/* Прогресс бар */}
            <div className="flex-shrink-0">
              <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground text-right mt-1">
                {Math.round((stepNumber / totalSteps) * 100)}%
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Контент урока */}
      <div className="space-y-4">
        {structuredContent && structuredContent.length > 0 ? renderStructuredContent() : renderContent()}

        {/* Курсор печати */}
        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground py-4">
            <div className="w-1 h-6 bg-primary animate-pulse"></div>
            <span className="text-sm italic">Генерация контента урока...</span>
          </div>
        )}

        {/* Кнопка пропуска анимации */}
        {isTyping && displayedContent.length > 20 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipAnimation}
            className="text-muted-foreground hover:text-foreground"
          >
            ⏩ Показать полностью
          </Button>
        )}
      </div>

      {/* Task Section */}
      {!isTyping && currentTask && waitingForAnswer && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">
                {currentTask.type === 'test' ? '📝 Тест на закрепление материала:' :
                 currentTask.type === 'exercise' ? '💪 Практическое задание:' :
                 '❓ Вопрос для размышления:'}
              </h4>
              <p className="text-blue-800 mb-3">{currentTask.question}</p>

              {/* Options for test */}
              {currentTask.type === 'test' && currentTask.options && (
                <div className="space-y-2 mb-4">
                  {currentTask.options.map((option: string, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2 px-4 hover:bg-blue-100 border-blue-300"
                      onClick={() => {
                        onAnswer?.(option);
                        setTaskAnswer('');
                      }}
                    >
                      {String.fromCharCode(97 + index)}) {option}
                    </Button>
                  ))}
                </div>
              )}

              {/* Text input for other task types */}
              {(currentTask.type === 'exercise' || currentTask.type === 'question') && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Напиши свой ответ здесь..."
                    value={taskAnswer}
                    onChange={(e) => setTaskAnswer(e.target.value)}
                    className="min-h-[80px] border-blue-300 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (taskAnswer.trim()) {
                          onAnswer?.(taskAnswer);
                          setTaskAnswer('');
                        }
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (taskAnswer.trim()) {
                        onAnswer?.(taskAnswer);
                        setTaskAnswer('');
                      }
                    }}
                    disabled={!taskAnswer.trim()}
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Отправить ответ
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Кнопки управления */}
      {!isTyping && (
        <div className="flex gap-3 pt-6 border-t border-border">
          <Button
            onClick={onNext}
            disabled={isGenerating || waitingForAnswer}
            className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 gap-2 font-semibold text-base shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">⏳</span>
                Загрузка следующего шага...
              </>
            ) : stepNumber >= totalSteps ? (
              <>
                <CheckCircle className="w-5 h-5" />
                🎉 Завершить урок
              </>
            ) : waitingForAnswer ? (
              <>
                <MessageSquare className="w-5 h-5" />
                Сначала ответь на задачу
              </>
            ) : (
              <>
                ➡️ Следующий шаг
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessonDisplay;
