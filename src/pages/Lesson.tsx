import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ArrowLeft, BookOpen, Clock, Target, MessageCircle, Phone, FileText, Loader, ChevronRight, CheckCircle, Lightbulb, Target as TargetIcon, BookOpen as BookIcon, Send, Info, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MarkdownRenderer } from '@/components/Chat/MarkdownRenderer';

interface Lesson {
  number: number;
  title: string;
  topic: string;
  aspects?: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

interface LessonPageProps {
  lesson?: Lesson;
  courseInfo?: {
    courseId: number;
    title: string;
    grade: number;
  };
  lessonIndex?: number;
  totalLessons?: number;
}

// Component for beautifully styled lesson blocks
// Component to render lesson block with interactive questions
const LessonBlockWithQuestions: React.FC<{
  content: string;
  blockIndex: number;
  questionAnswers: Map<string, any>;
  onAnswerChange: (questionId: string, answer: string) => void;
  onCheckAnswer: (questionId: string, question: string, answer: string, options?: Array<{ label: string; text: string }>) => void;
}> = ({ content, blockIndex, questionAnswers, onAnswerChange, onCheckAnswer }) => {
  // Parse content to find questions with options or open-ended
  const parseContentWithQuestions = (text: string) => {
    const parts: Array<{ 
      type: 'text' | 'question'; 
      content: string; 
      questionNumber?: number; 
      questionId?: string;
      options?: Array<{ label: string; text: string }>;
      questionType?: 'open' | 'single-choice' | 'multiple-choice';
    }> = [];
    
    const lines = text.split('\n').map(l => l.trim());
    let currentTextBuffer: string[] = [];
    let i = 0;
    let questionCounter = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Check if this line starts a numbered question (e.g., "1. ", "1) ", "1 ")
      const questionMatch = line.match(/^(\d+)[.\)]\s+(.+)$/);
      
      if (questionMatch && questionMatch[2].includes('?')) {
        // Flush text buffer first
        if (currentTextBuffer.length > 0) {
          parts.push({ type: 'text', content: currentTextBuffer.join('\n') });
          currentTextBuffer = [];
        }
        
        questionCounter++;
        const questionNumber = parseInt(questionMatch[1]);
        const questionText = questionMatch[2].trim();
        const questionId = `${blockIndex}-q${questionNumber}`;
        
        // Look ahead for options (A), B), C), D), etc.)
        const options: Array<{ label: string; text: string }> = [];
        let j = i + 1;
        
        // Skip empty lines immediately after question
        while (j < lines.length && lines[j] === '') {
          j++;
        }
        
        // Collect options
        while (j < lines.length) {
          const optionLine = lines[j].trim();
          const optionMatch = optionLine.match(/^([A-Za-z])[.\)]\s*(.+)$/);
          
          if (optionMatch) {
            options.push({
              label: optionMatch[1].toUpperCase(),
              text: optionMatch[2].trim()
            });
            j++;
          } else if (optionLine === '') {
            // Empty line - might be end of options or between options
            j++;
            // If next line is not an option, break
            if (j < lines.length && !lines[j].match(/^([A-Za-z])[.\)]\s*(.+)$/)) {
              break;
            }
          } else {
            // Not an option, break
            break;
          }
        }
        
        // Determine question type
        let questionType: 'open' | 'single-choice' | 'multiple-choice' = 'open';
        if (options.length > 0) {
          // Check if question asks for multiple answers
          const isMultiple = questionText.toLowerCase().includes('выберите все') ||
                           questionText.toLowerCase().includes('несколько') ||
                           questionText.toLowerCase().includes('какие из');
          questionType = isMultiple ? 'multiple-choice' : 'single-choice';
        }
        
        parts.push({
          type: 'question',
          content: questionText,
          questionNumber,
          questionId,
          options: options.length > 0 ? options : undefined,
          questionType
        });
        
        // Move index to after the options
        i = j;
      } else {
        // Regular text line
        currentTextBuffer.push(line);
        i++;
      }
    }
    
    // Flush remaining text buffer
    if (currentTextBuffer.length > 0) {
      parts.push({ type: 'text', content: currentTextBuffer.join('\n') });
    }
    
    // If no questions found, return all as text
    if (parts.length === 0 || parts.every(p => p.type === 'text')) {
      return [{ type: 'text' as const, content: text }];
    }
    
    return parts;
  };

  const parts = parseContentWithQuestions(content);

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <div key={`text-${index}`}>
              <MarkdownRenderer content={part.content} />
            </div>
          );
        } else if (part.type === 'question' && part.questionId) {
          const qa = questionAnswers.get(part.questionId);
          const currentAnswer = qa?.answer || '';
          const feedback = qa?.feedback || '';
          const isChecking = qa?.isChecking || false;

          // Render test question with options
          if (part.options && part.options.length > 0) {
            const selectedOptions = currentAnswer ? currentAnswer.split(',').map(s => s.trim()) : [];
            const isMultiple = part.questionType === 'multiple-choice';

            return (
              <div key={part.questionId} className="my-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-r-lg shadow-sm">
                {/* Question */}
                <div className="mb-4">
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm flex items-center justify-center font-bold shadow">
                      {part.questionNumber}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">{part.content}</p>
                      {isMultiple && (
                        <p className="text-xs text-blue-600 mt-1">Выберите несколько вариантов</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 ml-9">
                  {part.options.map((option) => {
                    const isSelected = selectedOptions.includes(option.label);
                    
                    return (
                      <label
                        key={option.label}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-100'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                        } ${(isChecking || feedback) ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type={isMultiple ? 'checkbox' : 'radio'}
                          name={part.questionId}
                          value={option.label}
                          checked={isSelected}
                          onChange={(e) => {
                            if (isChecking || feedback) return;
                            
                            let newAnswer: string;
                            if (isMultiple) {
                              // Multiple choice - toggle selection
                              if (e.target.checked) {
                                newAnswer = [...selectedOptions, option.label].sort().join(', ');
                              } else {
                                newAnswer = selectedOptions.filter(s => s !== option.label).join(', ');
                              }
                            } else {
                              // Single choice - replace selection
                              newAnswer = option.label;
                            }
                            onAnswerChange(part.questionId!, newAnswer);
                          }}
                          disabled={isChecking || !!feedback}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-blue-700 mr-2">{option.label})</span>
                          <span className="text-gray-800">{option.text}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Check Button */}
                {!feedback && (
                  <div className="ml-9 mt-4">
                    <Button
                      size="sm"
                      onClick={() => onCheckAnswer(part.questionId!, part.content, currentAnswer, part.options)}
                      disabled={!currentAnswer.trim() || isChecking}
                      className="w-full sm:w-auto"
                    >
                      {isChecking ? (
                        <>
                          <Loader className="w-3 h-3 animate-spin mr-2" />
                          Проверяю...
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3 mr-2" />
                          Проверить ответ
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div className="ml-9 mt-4 p-3 bg-white border border-blue-300 rounded-lg shadow-sm">
                    <MarkdownRenderer content={feedback} />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onAnswerChange(part.questionId!, '');
                      }}
                      className="mt-2 text-xs"
                    >
                      Попробовать ещё раз
                    </Button>
                  </div>
                )}
              </div>
            );
          }

          // Render open-ended question with textarea
          return (
            <div key={part.questionId} className="my-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              {/* Question */}
              <div className="mb-3">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-semibold">
                    {part.questionNumber}
                  </span>
                  <p className="text-gray-800 font-medium flex-1">{part.content}</p>
                </div>
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => onAnswerChange(part.questionId!, e.target.value)}
                  placeholder="Напишите ваш ответ..."
                  className="min-h-[80px] bg-white"
                  disabled={isChecking || !!feedback}
                />
                
                {/* Check Button */}
                {!feedback && (
                  <Button
                    size="sm"
                    onClick={() => onCheckAnswer(part.questionId!, part.content, currentAnswer)}
                    disabled={!currentAnswer.trim() || isChecking}
                    className="w-full sm:w-auto"
                  >
                    {isChecking ? (
                      <>
                        <Loader className="w-3 h-3 animate-spin mr-2" />
                        Проверяю...
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 mr-2" />
                        Проверить ответ
                      </>
                    )}
                  </Button>
                )}

                {/* Feedback */}
                {feedback && (
                  <div className="mt-3 p-3 bg-white border border-blue-200 rounded-lg">
                    <MarkdownRenderer content={feedback} />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onAnswerChange(part.questionId!, '');
                      }}
                      className="mt-2 text-xs"
                    >
                      Попробовать ещё раз
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const LessonBlock: React.FC<{ content: string; index: number }> = ({ content, index }) => {
  // Function to render content with proper styling
  const renderContent = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());

    return lines.map((line, lineIndex) => {
      // Headers with emojis
      if (line.match(/^(🎯|📚|✏️|📝|🎓|📖|💡|🔍|⚡|🏆|📋|💬)/)) {
        const iconMap: { [key: string]: any } = {
          '🎯': <TargetIcon className="w-5 h-5 text-blue-500" />,
          '📚': <BookIcon className="w-5 h-5 text-green-500" />,
          '✏️': <FileText className="w-5 h-5 text-orange-500" />,
          '📝': <CheckCircle className="w-5 h-5 text-purple-500" />,
          '🎓': <BookOpen className="w-5 h-5 text-indigo-500" />,
          '📖': <BookIcon className="w-5 h-5 text-teal-500" />,
          '💡': <Lightbulb className="w-5 h-5 text-yellow-500" />,
          '🔍': <TargetIcon className="w-5 h-5 text-red-500" />,
          '⚡': <Lightbulb className="w-5 h-5 text-yellow-400" />,
          '🏆': <CheckCircle className="w-5 h-5 text-gold-500" />,
          '📋': <FileText className="w-5 h-5 text-gray-500" />,
          '💬': <MessageCircle className="w-5 h-5 text-cyan-500" />
        };

        const emoji = line.match(/^(🎯|📚|✏️|📝|🎓|📖|💡|🔍|⚡|🏆|📋|💬)/)?.[0];
        const title = line.replace(/^(🎯|📚|✏️|📝|🎓|📖|💡|🔍|⚡|🏆|📋|💬)\s*/, '');

        // Special styling for question blocks
        const isQuestion = emoji === '💬';
        const bgColor = isQuestion ? 'bg-cyan-50 dark:bg-cyan-950/30' : 'bg-primary/10';
        const borderColor = isQuestion ? 'border-cyan-400' : 'border-primary';

        return (
          <div key={lineIndex} className="mb-4">
            <div className={`flex items-center gap-3 mb-3 p-3 ${bgColor} rounded-lg border-l-4 ${borderColor}`}>
              {emoji && iconMap[emoji]}
              <h3 className={`text-lg font-semibold ${isQuestion ? 'text-cyan-600 dark:text-cyan-400' : 'text-primary'}`}>
                {title}
              </h3>
            </div>
          </div>
        );
      }

      // Numbered lists
      if (line.match(/^\d+\./)) {
        return (
          <div key={lineIndex} className="flex items-start gap-3 mb-2 ml-4">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              {line.match(/^\d+/)?.[0]}
            </span>
            <span className="text-foreground leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }

      // Bullet points
      if (line.match(/^[-•*]\s/)) {
        return (
          <div key={lineIndex} className="flex items-start gap-3 mb-2 ml-4">
            <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
            <span className="text-foreground leading-relaxed">{line.replace(/^[-•*]\s*/, '')}</span>
          </div>
        );
      }

      // Regular text
      if (line.trim()) {
        return (
          <p key={lineIndex} className="text-foreground leading-relaxed mb-3 last:mb-0">
            {line}
          </p>
        );
      }

      return null;
    });
  };

  return (
    <div className={`animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ${index > 0 ? 'border-t border-border/30 pt-6 mt-6' : ''}`}>
      <div className="space-y-2">
        {renderContent(content)}
      </div>
    </div>
  );
};

const Lesson: React.FC<LessonPageProps> = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isStartingLesson, setIsStartingLesson] = useState(false);
  const [isStartingVoiceCall, setIsStartingVoiceCall] = useState(false);
  const [countdown, setCountdown] = useState(0);


  useEffect(() => {
    // Получаем данные из localStorage
    const storedData = localStorage.getItem('currentLesson');
    const storedCourseInfo = localStorage.getItem('courseInfo');
    const storedLessonIndex = localStorage.getItem('lessonIndex');
    const storedTotalLessons = localStorage.getItem('totalLessons');
    const voiceCallFlag = localStorage.getItem('lessonVoiceCall');

    if (storedData) {
      const data = JSON.parse(storedData);
      setLesson(data);
    }

    if (storedCourseInfo) {
      setCourseInfo(JSON.parse(storedCourseInfo));
    }

    if (storedLessonIndex) {
      const index = parseInt(storedLessonIndex, 10);
      setLessonIndex(index);
    }

    if (storedTotalLessons) {
      const total = parseInt(storedTotalLessons, 10);
      setTotalLessons(total);
      if (storedLessonIndex) {
        const index = parseInt(storedLessonIndex, 10);
        setProgress((index / total) * 100);
      }
    }

    // Автоматически запускаем урок или голосовой звонок
    if (storedData) {
      if (voiceCallFlag === 'true') {
        // Удаляем флаг и автоматически переходим к голосовому звонку
        localStorage.removeItem('lessonVoiceCall');
        setTimeout(() => {
          navigate('/voice-call');
        }, 500);
      } else {
        // Автоматически переходим к интерактивному уроку
        setIsStartingLesson(true);
        setCountdown(2); // 2 секунды для показа страницы

        // Обратный отсчет
        const interval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsStartingLesson(false);
              navigate('/voice-call');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    // Убрано перенаправление - теперь пустая страница обрабатывается в начале компонента
  }, [navigate]);

  // Lesson summary/note generation
  const [lessonSummary, setLessonSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [lessonBlocks, setLessonBlocks] = useState<string[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [blockRetryCount, setBlockRetryCount] = useState<Map<number, number>>(new Map());
  
  // User question input
  const [userQuestion, setUserQuestion] = useState('');
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  
  // Image generation
  const [generatingImages, setGeneratingImages] = useState<Set<string>>(new Set());
  
  // Interactive questions in lesson
  interface QuestionAnswer {
    questionId: string;
    answer: string;
    feedback: string;
    isChecking: boolean;
  }
  const [questionAnswers, setQuestionAnswers] = useState<Map<string, QuestionAnswer>>(new Map());

  // Lesson info dialog
  const [isLessonInfoOpen, setIsLessonInfoOpen] = useState(false);

  // Check answer with LLM
  const checkAnswer = async (questionId: string, question: string, userAnswer: string, options?: Array<{ label: string; text: string }>) => {
    if (!userAnswer.trim()) return;

    // Update state to show checking
    setQuestionAnswers(prev => {
      const updated = new Map(prev);
      updated.set(questionId, {
        questionId,
        answer: userAnswer,
        feedback: '',
        isChecking: true
      });
      return updated;
    });

    try {
      const courseTitle = searchParams.get('courseTitle') || '';
      const courseGrade = searchParams.get('courseGrade') || '';
      const lessonTitle = searchParams.get('lessonTitle') || '';
      const lessonTopic = searchParams.get('lessonTopic') || '';

      // Build options text if available
      const optionsText = options && options.length > 0
        ? `\n\nВАРИАНТЫ ОТВЕТОВ:\n${options.map(opt => `${opt.label}) ${opt.text}`).join('\n')}`
        : '';

      const prompt = `Ты - опытный преподаватель для ${courseGrade} класса. Ученик ответил на ${options ? 'тестовый вопрос' : 'вопрос'} во время изучения урока.

КОНТЕКСТ УРОКА:
- Курс: "${courseTitle}"
- Урок: "${lessonTitle}"
- Тема: "${lessonTopic}"

ВОПРОС: "${question}"${optionsText}

ОТВЕТ УЧЕНИКА: ${options ? `Выбрал вариант(ы): ${userAnswer}` : `"${userAnswer}"`}

Оцени ответ ученика и дай конструктивную обратную связь.

ФОРМАТ ОТВЕТА (строго следуй структуре):
**Оценка:** [Отлично / Хорошо / Частично верно / Неверно]

**Комментарий:** [2-3 предложения с объяснением: что правильно, что можно улучшить, какие моменты упущены]

**Подсказка:** [Если ответ неполный или неверный - дай наводящую подсказку или правильный ответ]

Будь доброжелательным, но честным. Хвали правильные моменты и мягко указывай на ошибки.`;

      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 500,
        }),
        signal: AbortSignal.timeout(60000) // 1 minute for answer checking
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const feedback = data.choices?.[0]?.message?.content || 'Не удалось получить оценку';

      // Update with feedback
      setQuestionAnswers(prev => {
        const updated = new Map(prev);
        updated.set(questionId, {
          questionId,
          answer: userAnswer,
          feedback: feedback,
          isChecking: false
        });
        return updated;
      });

    } catch (error) {
      console.error('Error checking answer:', error);
      setQuestionAnswers(prev => {
        const updated = new Map(prev);
        updated.set(questionId, {
          questionId,
          answer: userAnswer,
          feedback: '❌ Произошла ошибка при проверке ответа. Попробуйте ещё раз.',
          isChecking: false
        });
        return updated;
      });
    }
  };

  // Generate image using DALL-E 3
  const generateImage = async (prompt: string): Promise<string> => {
    try {
      // Truncate prompt if too long (DALL-E 3 has 4000 char limit)
      const truncatedPrompt = prompt.length > 1000 ? prompt.substring(0, 1000) + '...' : prompt;
      console.log('🎨 Generating image with DALL-E 3:', truncatedPrompt);
      
      const response = await fetch('/api/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt.substring(0, 4000), // DALL-E 3 max prompt length
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        }),
        signal: AbortSignal.timeout(60000) // 60 second timeout for image generation
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('❌ Image generation failed:', response.status, errorText);
        
        // Try to parse error JSON
        try {
          const errorData = JSON.parse(errorText);
          console.error('❌ Error details:', errorData);
        } catch (e) {
          // Not JSON, just log as text
        }
        
        return ''; // Return empty string instead of throwing
      }

      const data = await response.json();
      console.log('📦 Image generation response:', data);
      
      // DALL-E 3 returns data in format: { data: [{ url: "..." }] }
      if (data.data && data.data[0] && data.data[0].url) {
        const imageUrl = data.data[0].url;
        console.log('✅ Image generated:', imageUrl);
        return imageUrl;
      } else {
        console.error('❌ Unexpected response format:', data);
        return '';
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('❌ Image generation timeout');
      } else {
        console.error('❌ Error generating image:', error);
      }
      return ''; // Return empty string on error - don't break the lesson
    }
  };

  // Process IMAGE markers in text and replace with actual images
  const processImagesInText = async (text: string, blockIndex: number): Promise<string> => {
    // Support both [IMAGE: text] and [IMAGE text] formats
    const imageRegex = /\[IMAGE:?\s*([^\]]+)\]/g;
    const matches = Array.from(text.matchAll(imageRegex));
    
    console.log(`🔍 Looking for IMAGE markers in block ${blockIndex}, found: ${matches.length}`);
    
    if (matches.length === 0) return text;

    let processedText = text;
    
    for (const match of matches) {
      const fullMatch = match[0];
      const promptText = match[1].trim();
      const imageKey = `${blockIndex}-${promptText.substring(0, 50)}`;
      
      console.log(`🎨 Found IMAGE marker: "${promptText.substring(0, 100)}..."`);
      
      // Check if already generating
      if (generatingImages.has(imageKey)) {
        console.log(`⏳ Already generating this image, skipping...`);
        continue;
      }
      
      // Mark as generating
      setGeneratingImages(prev => new Set(prev).add(imageKey));
      console.log(`🚀 Starting image generation...`);
      
      // Generate image
      const imageUrl = await generateImage(promptText);
      console.log(`📸 Image generation result:`, imageUrl ? 'SUCCESS' : 'FAILED');
      
      // Remove from generating set
      setGeneratingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageKey);
        return newSet;
      });
      
      // Replace marker with image markdown
      if (imageUrl) {
        const imageMarkdown = `\n\n![Generated illustration](${imageUrl})\n*Иллюстрация: ${promptText.substring(0, 100)}...*\n\n`;
        processedText = processedText.replace(fullMatch, imageMarkdown);
        console.log(`✅ Replaced IMAGE marker with actual image`);
      } else {
        console.warn(`⚠️ Image generation failed, removing marker`);
        // Remove marker if generation failed
        processedText = processedText.replace(fullMatch, '');
      }
    }
    
    return processedText;
  };

  // Parse lesson summary into blocks
  const parseLessonIntoBlocks = (fullText: string): string[] => {
    // Split by common section headers
    const sections = fullText.split(/(?=🎯|📚|✏️|📝|🎓|📖|💡|🔍|⚡|🏆|📋)/);

    // Filter out empty sections and clean up
    return sections
      .map(section => section.trim())
      .filter(section => section.length > 0)
      .map(section => {
        // Add line breaks for better formatting
        return section.replace(/\n(?!\n)/g, '\n\n');
      });
  };

  // Go to next block
  const goToNextBlock = async () => {
    const nextIndex = currentBlockIndex + 1;

    // If the next block doesn't exist yet, generate it
    if (nextIndex >= lessonBlocks.length) {
      const courseTitle = searchParams.get('courseTitle') || '';
      const courseGrade = searchParams.get('courseGrade') || '';
      const lessonTitle = searchParams.get('lessonTitle') || '';
      const lessonTopic = searchParams.get('lessonTopic') || '';

      await generateLessonBlock(nextIndex, courseTitle, courseGrade, lessonTitle, lessonTopic);
    }

    // Move to next block
    setCurrentBlockIndex(nextIndex);
  };

  // Check if can go to next block (can always go to next if not generating and not at max blocks)
  const canGoNext = !isGeneratingSummary && currentBlockIndex < 4; // Max 5 blocks (0-4) for full 40-min lesson

  // Handle user question and add explanation to lesson
  const handleUserQuestion = async () => {
    if (!userQuestion.trim() || isGeneratingAnswer) return;

    const question = userQuestion.trim();
    setUserQuestion('');
    setIsGeneratingAnswer(true);

    try {
      // Get course and lesson context
      const courseTitle = searchParams.get('courseTitle') || '';
      const courseGrade = searchParams.get('courseGrade') || '';
      const lessonTitle = searchParams.get('lessonTitle') || '';
      const lessonTopic = searchParams.get('lessonTopic') || '';

      const prompt = `Ты - профессиональный преподаватель для ${courseGrade} класса. Ученик задал вопрос во время изучения урока.

КОНТЕКСТ УРОКА:
- Название курса: "${courseTitle}"
- Название урока: "${lessonTitle}"
- Тема урока: "${lessonTopic}"
- Текущий конспект: "${lessonSummary.slice(0, 500)}..."

ВОПРОС УЧЕНИКА: "${question}"

Создай дополнительный раздел конспекта, который отвечает на вопрос ученика.

ВАЖНО: Начни ответ СРАЗУ с 💬 без каких-либо заголовков или форматирования.

Формат ответа:
💬 Вопрос: ${question}

💡 Объяснение:
[Подробное, понятное объяснение с примерами]

Используй:
- Простой язык для ${courseGrade} класса
- Конкретные примеры
- Связь с темой урока
- Маркированные списки для структуры`;

      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 800,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate answer');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let accumulatedText = '';
      let newBlock = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Insert the new question block after the current block index
          if (newBlock.trim()) {
            setLessonBlocks(prev => {
              const updated = [...prev];
              // Insert the new block after the current block (user's current reading position)
              const insertPosition = Math.min(currentBlockIndex + 1, updated.length);
              updated.splice(insertPosition, 0, newBlock.trim());
              return updated;
            });
            setLessonSummary(prev => prev + '\n\n' + newBlock.trim());
            // Move to show the newly inserted block
            setCurrentBlockIndex(prev => prev + 1);
          }
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;

              if (content) {
                accumulatedText += content;
                newBlock = accumulatedText;

                // For streaming effect, temporarily show the accumulating block
                // Insert after current block position
                setLessonBlocks(prev => {
                  const updated = [...prev];
                  const insertPosition = Math.min(currentBlockIndex + 1, updated.length);
                  if (insertPosition >= updated.length) {
                    updated.push(newBlock);
                  } else {
                    updated[insertPosition] = newBlock;
                  }
                  return updated;
                });
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

    } catch (error) {
      console.error('Error generating answer:', error);
      const errorBlock = `💬 Вопрос: ${question}\n\n❌ Произошла ошибка при генерации ответа. Попробуйте задать вопрос ещё раз.`;
      setLessonBlocks(prev => {
        const updated = [...prev];
        // Insert error block after current position
        const insertPosition = Math.min(currentBlockIndex + 1, updated.length);
        updated.splice(insertPosition, 0, errorBlock);
        return updated;
      });
      setCurrentBlockIndex(prev => prev + 1);
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserQuestion();
    }
  };

  // Generate a single lesson block with streaming
  const generateLessonBlock = async (blockIndex: number, courseTitle: string, courseGrade: string, lessonTitle: string, lessonTopic: string) => {
    if (isGeneratingSummary) return;

    setIsGeneratingSummary(true);

    // Get context from previous blocks
    const previousBlocks = lessonBlocks.slice(0, blockIndex).join('\n\n---\n\n');
    const contextNote = previousBlocks 
      ? `\n\nКОНТЕКСТ ПРЕДЫДУЩИХ БЛОКОВ (НЕ повторяй эту информацию):\n${previousBlocks.substring(0, 2000)}...\n\n`
      : '';

    const blockConfigs = [
      {
        emoji: '🎯',
        title: 'Введение и цели урока',
        prompt: `Создай ПОДРОБНОЕ введение в урок "${lessonTitle}" по теме "${lessonTopic}" для ${courseGrade} класса.

СТРУКТУРА (СТРОГО следуй порядку):
1. **Приветствие и мотивация** (2-3 абзаца о важности темы в реальной жизни)
2. **Цели урока** (3-4 конкретные, измеримые цели)
3. **План урока** (краткий обзор 5 основных этапов)
4. **Входная диагностика** (5 вопросов для проверки базовых знаний БЕЗ ответов - ответы будут в конце урока)

ФОРМАТ ВОПРОСОВ (ОБЯЗАТЕЛЬНО):
Каждый вопрос пиши в формате:
1. Текст первого вопроса?

2. Текст второго вопроса?

3. Текст третьего вопроса?

(пустая строка между вопросами, нумерация с точкой)

Объём: 800-1000 слов. 
НЕ добавляй прощание - это только начало урока.
НЕ включай практические задания - они будут в конце.`
      },
      {
        emoji: '📚',
        title: 'Теоретическая часть - Основные понятия',
        prompt: `Продолжи урок "${lessonTitle}". Создай ПОДРОБНОЕ теоретическое объяснение темы "${lessonTopic}" для ${courseGrade} класса.

СТРУКТУРА (СТРОГО следуй порядку):
1. **Исторический контекст** (1-2 абзаца о предыстории)
2. **Основные понятия и термины** (5-7 понятий с развёрнутыми объяснениями)
3. **Ключевые принципы и закономерности** (3-4 принципа с примерами)
4. **Связь с другими темами** программы
5. **Типичные ошибки и заблуждения**

Объём: 1200-1500 слов.
НЕ повторяй приветствие или цели урока - они уже были.
НЕ добавляй прощание - урок продолжается.
НЕ включай практические задания - они будут в конце.
Используй аналогии, примеры, схемы (описывай словами).

ВАЖНО: В конце раздела добавь запрос на изображение в формате:
[IMAGE: подробное описание изображения для DALL-E 3 на английском языке, которое поможет визуализировать ключевое понятие темы]${contextNote}`
      },
      {
        emoji: '📖',
        title: 'Углублённое изучение',
        prompt: `Продолжи урок "${lessonTitle}". Создай ДЕТАЛЬНЫЙ разбор темы "${lessonTopic}" для ${courseGrade} класса.

СТРУКТУРА (СТРОГО следуй порядку):
1. **Практические примеры из жизни** (3-4 примера по 150-200 слов с детальным разбором)
2. **Пошаговые объяснения** решений
3. **Межпредметные связи** (как тема связана с другими науками)
4. **Современные применения** и актуальность
5. **Интересные факты** и кейсы

Объём: 1200-1500 слов.
НЕ повторяй теорию из предыдущего блока.
НЕ добавляй приветствие или прощание.
НЕ включай практические задания для самостоятельного решения - только разбор примеров.${contextNote}`
      },
      {
        emoji: '✏️',
        title: 'Практика и тестирование',
        prompt: `Продолжи урок "${lessonTitle}". Создай ПОДРОБНЫЙ блок практики и проверки знаний по теме "${lessonTopic}" для ${courseGrade} класса.

СТРУКТУРА (СТРОГО следуй порядку):

**Часть 1: ПРАКТИЧЕСКИЕ ЗАДАНИЯ**
1. **Разминочные задания** (3-4 простых задачи БЕЗ решений)
2. **Основные упражнения** (4-5 задач среднего уровня БЕЗ решений)
3. **Комплексные задачи** (2-3 сложные задачи БЕЗ решений)
4. **Творческое задание** или мини-проект

**Часть 2: ТЕСТ (10 вопросов)**
Создай 10 тестовых вопросов разных типов:
- 5 вопросов с выбором одного ответа (A, B, C, D)
- 3 вопроса с выбором нескольких ответов
- 2 вопроса на соответствие или последовательность

ФОРМАТ КАЖДОГО ВОПРОСА (ОБЯЗАТЕЛЬНО):
1. Текст первого вопроса?

2. Текст второго вопроса?

(пустая строка между вопросами, нумерация с точкой)

ВАЖНО: НЕ давай ответы на тест здесь - они будут в следующем блоке!

Объём: 1000-1200 слов.
НЕ повторяй теорию.
НЕ добавляй приветствие или прощание.
НЕ включай решения - они будут в следующем блоке.

ВАЖНО: В конце раздела добавь запрос на изображение в формате:
[IMAGE: подробное описание схемы или диаграммы для DALL-E 3 на английском языке, которая визуализирует практическое применение темы]${contextNote}`
      },
      {
        emoji: '📝',
        title: 'Решения, ответы и итоги',
        prompt: `Заверши урок "${lessonTitle}". Создай ПОДРОБНЫЙ финальный блок с решениями, ответами и итогами для ${courseGrade} класса.

СТРУКТУРА (СТРОГО следуй порядку):

**Часть 1: РЕШЕНИЯ ПРАКТИЧЕСКИХ ЗАДАНИЙ**
Дай подробные решения ВСЕХ заданий из предыдущего блока (разминочные, основные, комплексные).
Для каждой задачи:
- Пошаговое решение
- Объяснение логики
- Типичные ошибки

**Часть 2: ОТВЕТЫ НА ТЕСТ И АНАЛИЗ**
1. **Правильные ответы** на все 10 вопросов теста
2. **Подробное объяснение** каждого ответа
3. **Анализ типичных ошибок** для каждого вопроса
4. **Критерии оценки**:
   - 9-10 правильных ответов: отлично
   - 7-8 правильных ответов: хорошо
   - 5-6 правильных ответов: удовлетворительно
   - менее 5: нужно повторить материал

**Часть 3: ОТВЕТЫ НА ВХОДНУЮ ДИАГНОСТИКУ**
Дай ответы на 5 вопросов из начала урока с объяснениями.

**Часть 4: ИТОГИ УРОКА**
1. **Краткое резюме** (5-6 ключевых тезисов)
2. **Ответы на частые вопросы** (4-5 FAQ с ответами)
3. **Домашнее задание** (3 уровня сложности)
4. **Рекомендации** для дальнейшего изучения
5. **Рефлексия** (вопросы для самооценки)
6. **Прощание и мотивация** на следующий урок

Объём: 1500-2000 слов.
НЕ повторяй теорию из предыдущих блоков.
Это ФИНАЛ урока - включи прощание и позитивное завершение.${contextNote}`
      }
    ];

    const blockConfig = blockConfigs[blockIndex];
    if (!blockConfig) {
      setIsGeneratingSummary(false);
      return;
    }

    const blockPrompt = `Ты - опытный преподаватель, создающий ПОДРОБНЫЙ конспект 40-минутной лекции.

КОНТЕКСТ УРОКА:
- Тема урока: "${lessonTopic}"
- Урок: "${lessonTitle}"
- Курс: "${courseTitle}"
- Класс: ${courseGrade}
- Блок урока: ${blockIndex + 1} из 5

${previousBlocks ? '⚠️ ВАЖНО: Предыдущие блоки уже содержат теорию и объяснения. НЕ повторяй их содержание!' : ''}

ЗАДАНИЕ ДЛЯ ЭТОГО БЛОКА:
${blockConfig.prompt}

ОБЩИЕ ТРЕБОВАНИЯ:
- Пиши академично, но доступно для ${courseGrade} класса
- Используй конкретные примеры, аналогии, метафоры
- Структурируй текст с помощью подзаголовков (##), списков, выделений
- Избегай воды - каждое предложение должно нести информацию
- Обеспечь логическую связь с предыдущими блоками
- НЕ добавляй общий заголовок раздела в начале - начинай сразу с содержания
- НЕ повторяй информацию из предыдущих блоков

СТРУКТУРА ВСЕГО УРОКА (для понимания контекста):
1. Блок 1: Приветствие, цели, план, входная диагностика (БЕЗ прощания)
2. Блок 2: Теория, понятия, принципы (БЕЗ приветствия и прощания)
3. Блок 3: Углублённое изучение, примеры (БЕЗ приветствия и прощания)
4. Блок 4: Практические задания и тест БЕЗ решений (БЕЗ приветствия и прощания)
5. Блок 5: Решения, ответы на тест, итоги (С прощанием и мотивацией)

ВАЖНО: Это ${blockIndex === 0 ? 'НАЧАЛО' : blockIndex === 4 ? 'ФИНАЛ' : 'ПРОДОЛЖЕНИЕ'} урока!`;

    try {
      // Check if server is available before making request
      try {
        await fetch('/api/health', { method: 'GET', signal: AbortSignal.timeout(2000) });
      } catch (healthError) {
        console.warn('Server health check failed, but continuing with request');
      }

      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: blockPrompt }],
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: blockIndex === 4 ? 4000 : 3000, // More tokens for final block with solutions
          stream: true
        }),
        signal: AbortSignal.timeout(120000) // 2 minute timeout for long generation
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to generate block ${blockIndex + 1}: ${response.status} ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let blockContent = '';
      let isFirstToken = true;

      // Create initial block header
      const blockHeader = `${blockConfig.emoji} ${blockConfig.title}:`;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Finalize the block and process images
          let finalBlock = `${blockHeader}\n${blockContent.trim()}`;
          
          // Set initial block first (without images)
          setLessonBlocks(prev => {
            const updated = [...prev];
            updated[blockIndex] = finalBlock;
            return updated;
          });
          setLessonSummary(prev => prev + '\n\n' + finalBlock);
          
          // Process IMAGE markers and update when ready
          console.log(`📸 Starting image processing for block ${blockIndex}...`);
          const processedBlock = await processImagesInText(finalBlock, blockIndex);
          
          // Update with processed block (with images) if it changed
          if (processedBlock !== finalBlock) {
            console.log(`✅ Block ${blockIndex} updated with images`);
            setLessonBlocks(prev => {
              const updated = [...prev];
              updated[blockIndex] = processedBlock;
              return updated;
            });
          } else {
            console.log(`ℹ️ Block ${blockIndex} has no images to process`);
          }
          
          // Reset retry count for this block on success
          setBlockRetryCount(prev => {
            const updated = new Map(prev);
            updated.delete(blockIndex);
            return updated;
          });
          
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;

              if (content) {
                // Skip leading whitespace/newlines for first token
                if (isFirstToken && (content.trim() === '' || content === '\n')) {
                  continue;
                }
                isFirstToken = false;

                blockContent += content;

                // Update the block in real-time with streaming effect
                const currentBlock = `${blockHeader}\n${blockContent}`;
                setLessonBlocks(prev => {
                  const updated = [...prev];
                  updated[blockIndex] = currentBlock;
                  return updated;
                });
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

    } catch (error) {
      console.error('Error generating lesson block:', error);

      // Check if it's a timeout/abort error or network error - retry automatically
      const isRetryableError = 
        error.name === 'AbortError' || 
        error.message?.includes('Load failed') || 
        error.message?.includes('fetch') ||
        error.message?.includes('aborted');

      if (isRetryableError) {
        // Get current retry count for this block
        const currentRetries = blockRetryCount.get(blockIndex) || 0;
        const maxRetries = 2; // Maximum 2 retries (3 total attempts)

        if (currentRetries < maxRetries) {
          const errorType = error.name === 'AbortError' ? 'таймаут (генерация занимает время)' : 'сетевая ошибка';
          console.log(`🔄 Автоматически повторяем генерацию блока (попытка ${currentRetries + 2}/3) после: ${errorType}...`);
          
          // Increment retry count
          setBlockRetryCount(prev => {
            const updated = new Map(prev);
            updated.set(blockIndex, currentRetries + 1);
            return updated;
          });

          // Reset flag to allow retry
          setIsGeneratingSummary(false);
          
          // Show loading message
          setLessonBlocks(prev => {
            const updated = [...prev];
            updated[blockIndex] = `⏳ Генерация заняла больше времени... Повторная попытка ${currentRetries + 2}/3 через 3 секунды...`;
            return updated;
          });

          // Retry after delay
          setTimeout(() => {
            generateLessonBlock(blockIndex, courseTitle, courseGrade, lessonTitle, lessonTopic);
          }, 3000);
          return;
        } else {
          console.log('❌ Превышено максимальное количество попыток');
        }
      }

      // For other errors or max retries exceeded, show error message
      const errorBlock = `❌ Произошла ошибка при генерации блока "${blockConfig.title}". ${
        blockRetryCount.get(blockIndex) >= 2 
          ? 'Попробуйте позже или обновите страницу.' 
          : 'Попробуйте ещё раз.'
      }`;
      setLessonBlocks(prev => {
        const updated = [...prev];
        updated[blockIndex] = errorBlock;
        return updated;
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Initialize lesson summary with first block
  const generateLessonSummary = async (courseTitle: string, courseGrade: string, lessonTitle: string, lessonTopic: string) => {
    if (isGeneratingSummary) return;

    setLessonSummary('');
    setLessonBlocks([]);
    setCurrentBlockIndex(0);

    // Start with the first block
    await generateLessonBlock(0, courseTitle, courseGrade, lessonTitle, lessonTopic);
  };

  const handlePrevious = () => {
    if (lessonIndex > 0) {
      // Обновляем localStorage для предыдущего урока
      const personalizedCourse = localStorage.getItem('personalizedCourse');
      if (personalizedCourse) {
        const courseData = JSON.parse(personalizedCourse);
        if (courseData.lessons && courseData.lessons[lessonIndex - 1]) {
          const prevLesson = courseData.lessons[lessonIndex - 1];
          localStorage.setItem('currentLesson', JSON.stringify(prevLesson));
          localStorage.setItem('lessonIndex', String(lessonIndex - 1));
          window.location.reload();
        }
      }
    }
  };

  const handleNext = () => {
    if (lessonIndex < totalLessons - 1) {
      // Обновляем localStorage для следующего урока
      const personalizedCourse = localStorage.getItem('personalizedCourse');
      if (personalizedCourse) {
        const courseData = JSON.parse(personalizedCourse);
        if (courseData.lessons && courseData.lessons[lessonIndex + 1]) {
          const nextLesson = courseData.lessons[lessonIndex + 1];
          localStorage.setItem('currentLesson', JSON.stringify(nextLesson));
          localStorage.setItem('lessonIndex', String(lessonIndex + 1));
          window.location.reload();
        }
      }
    }
  };

  const handleBack = () => {
    navigate('/personalized-course');
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-blue-600 bg-blue-50';
      case 'advanced':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Основной';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return 'Общий';
    }
  };

  // Check if this is an empty lesson page (no lesson data in localStorage)
  const storedData = localStorage.getItem('currentLesson');
  const storedCourseInfo = localStorage.getItem('courseInfo');
  const storedLessonIndex = localStorage.getItem('lessonIndex');
  const storedTotalLessons = localStorage.getItem('totalLessons');
  const voiceCallFlag = localStorage.getItem('lessonVoiceCall');

  // Get URL parameters for empty page display
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = searchParams.get('courseId');
  const courseTitle = searchParams.get('courseTitle');
  const courseGrade = searchParams.get('courseGrade');
  const lessonTitle = searchParams.get('lessonTitle');
  const lessonTopic = searchParams.get('lessonTopic');

  const isEmptyPage = !storedData && !storedLessonIndex && !storedTotalLessons && !voiceCallFlag;

  // Auto-generate lesson summary when empty page loads
  useEffect(() => {
    if (isEmptyPage && (courseTitle || lessonTitle) && !lessonSummary && !isGeneratingSummary) {
      console.log('🎯 Auto-generating lesson summary for empty page');

      // Add delay to ensure component is fully loaded and network is ready
      const timer = setTimeout(() => {
        generateLessonSummary(courseTitle || '', courseGrade || '', lessonTitle || '', lessonTopic || '');
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [isEmptyPage, courseTitle, lessonTitle, lessonSummary, isGeneratingSummary]);

  // If no lesson data is stored but we have URL params (empty lesson page), show header with course/lesson info
  if (isEmptyPage && (courseTitle || lessonTitle)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <Header />

        {/* Back Button */}
        <div className="fixed top-16 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (courseId) {
                navigate(`/course/${courseId}`);
              } else {
                navigate('/courses');
              }
            }}
            className="rounded-full w-8 h-8 p-0 hover:bg-primary/10 hover:border-primary/30 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3 h-3 text-muted-foreground hover:text-primary" />
          </Button>
        </div>

        {/* Course and Lesson Info */}
        <main className="container mx-auto px-4 py-2">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-3">
              {/* Course Title - REMOVED per user request */}
              {/* {courseTitle && (
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {courseTitle}
                  </h1>
                  {courseGrade && (
                    <p className="text-lg text-muted-foreground">
                      {courseGrade} класс
                    </p>
                  )}
                </div>
              )} */}

              {/* Lesson Info Button - positioned at top-right */}
              {(lessonTitle || lessonTopic) && (
                <div className="fixed top-16 right-4 z-50">
                  <Dialog open={isLessonInfoOpen} onOpenChange={setIsLessonInfoOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full w-8 h-8 p-0 hover:bg-primary/10 hover:border-primary/30 transition-colors shadow-sm"
                      >
                        <Info className="w-3 h-3 text-muted-foreground hover:text-primary" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Info className="w-5 h-5 text-primary" />
                          Информация об уроке
                        </DialogTitle>
                        <DialogDescription className="text-left space-y-4 pt-4">
                          {lessonTitle && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-1">Урок:</h4>
                              <p className="text-muted-foreground">{lessonTitle}</p>
                            </div>
                          )}
                          {lessonTopic && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-1">Тема:</h4>
                              <p className="text-muted-foreground">{lessonTopic}</p>
                            </div>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Lesson Summary */}
              <Card className="border-2 border-border/60 bg-card/80 backdrop-blur-xl shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-primary" />
                      <CardTitle className="text-xl">Конспект урока</CardTitle>
                    </div>
                    {lessonBlocks.length > 1 && !isGeneratingSummary && (
                      <div className="text-sm text-muted-foreground">
                        {currentBlockIndex + 1} из 5
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {isGeneratingSummary ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="text-center space-y-2">
                        <Loader className="w-6 h-6 animate-spin text-primary mx-auto" />
                        <p className="text-sm text-muted-foreground">Генерирую конспект урока...</p>
                      </div>
                    </div>
                  ) : lessonBlocks.length > 0 ? (
                    <div className="space-y-4">
                      {/* Show all blocks up to current index */}
                      {lessonBlocks.slice(0, currentBlockIndex + 1).map((block, index) => (
                        <LessonBlockWithQuestions 
                          key={index} 
                          content={block} 
                          blockIndex={index}
                          questionAnswers={questionAnswers}
                          onAnswerChange={(questionId, answer) => {
                            setQuestionAnswers(prev => {
                              const updated = new Map(prev);
                              if (answer === '') {
                                updated.delete(questionId);
                              } else {
                                const existing = updated.get(questionId);
                                updated.set(questionId, {
                                  questionId,
                                  answer,
                                  feedback: existing?.feedback || '',
                                  isChecking: false
                                });
                              }
                              return updated;
                            });
                          }}
                          onCheckAnswer={checkAnswer}
                        />
                      ))}

                      {/* Next block button */}
                      {canGoNext && (
                        <div className="flex justify-center pt-4 border-t border-border/50">
                          <Button
                            onClick={goToNextBlock}
                            className="px-8 py-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            Далее
                            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                          </Button>
                        </div>
                      )}

                      {/* Completion message */}
                      {currentBlockIndex >= 4 && (
                        <div className="text-center pt-4 border-t border-border/50">
                          <p className="text-green-600 dark:text-green-400 font-medium">
                            🎉 Конспект урока завершён!
                          </p>
                        </div>
                      )}
                    </div>
                  ) : lessonSummary ? (
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {lessonSummary}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Конспект загружается...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Question Input - Fixed at bottom when lesson is visible */}
              {lessonBlocks.length > 0 && !isGeneratingSummary && (
                <Card className="border-2 border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl sticky bottom-1 mx-2">
                  <CardContent className="py-1 px-3">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <Textarea
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder=""
                        className="flex-1 min-h-[32px] max-h-16 resize-none bg-background text-xs"
                        disabled={isGeneratingAnswer}
                      />
                      <Button
                        onClick={handleUserQuestion}
                        disabled={!userQuestion.trim() || isGeneratingAnswer}
                        className="px-3 h-[32px] bg-primary hover:bg-primary/90 flex-shrink-0"
                        size="sm"
                      >
                        {isGeneratingAnswer ? (
                          <Loader className="w-3 h-3 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    {isGeneratingAnswer && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Loader className="w-2 h-2 animate-spin" />
                        <span>Генерирую...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground text-lg">Загрузка урока...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к плану
          </Button>

          {/* Progress Section */}
          <Card className="mb-8 border-2 border-border/60 bg-card/80 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Прогресс обучения
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {courseInfo?.title} • {courseInfo?.grade} класс
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {lessonIndex + 1}/{totalLessons}
                  </p>
                  <p className="text-xs text-muted-foreground">Уроков</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(progress)}% пройдено
              </p>
            </CardContent>
          </Card>

          {/* Lesson Content */}
          <Card className="mb-8 border-2 border-border/60 bg-card/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-500">
            <CardHeader className="pb-6 border-b border-border/50">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary mb-2">Урок {lesson.number}</p>
                    <CardTitle className="text-3xl font-bold mb-2">
                      {lesson.title}
                    </CardTitle>
                    <p className="text-lg text-muted-foreground">
                      Тема: <span className="text-foreground font-semibold">{lesson.topic}</span>
                    </p>
                  </div>
                  {lesson.difficulty && (
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(
                        lesson.difficulty
                      )}`}
                    >
                      {getDifficultyLabel(lesson.difficulty)}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Main Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Содержание урока
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed bg-card/50 p-4 rounded-lg border border-border/50">
                    {lesson.aspects || lesson.description || 'Описание содержания урока'}
                  </p>
                </div>

                {/* Prerequisites */}
                {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Предварительные знания
                    </h3>
                    <ul className="space-y-2">
                      {lesson.prerequisites.map((prereq, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-muted-foreground p-3 bg-card/50 rounded-lg border border-border/50"
                        >
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loading States */}
          {(isStartingLesson || isStartingVoiceCall) && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{countdown}</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  {isStartingLesson ? 'Создание интерактивного урока...' : 'Подготовка голосового звонка...'}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {isStartingLesson
                    ? 'Подготавливаем персонализированный урок специально для вас'
                    : 'Настраиваем голосовое общение с вашим персональным учителем'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isStartingLesson && !isStartingVoiceCall && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 py-8">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 gap-3"
                onClick={() => navigate('/voice-call')}
              >
                <MessageCircle className="w-5 h-5" />
                Начать урок
                <Target className="w-5 h-5" />
              </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-900 transition-all duration-300 gap-3"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 [LESSON] Button clicked! Starting voice call navigation');
                console.log('🎯 [LESSON] Current URL:', window.location.href);
                console.log('🎯 [LESSON] Current pathname:', window.location.pathname);
                
                // Direct navigation using window.location for reliability
                console.log('🎯 [LESSON] Navigating to /voice-call');
                window.location.href = '/voice-call';
              }}
            >
              <Phone className="w-5 h-5" />
              Звонок учителю
            </Button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pb-12">
            <Button
              onClick={handlePrevious}
              disabled={lessonIndex === 0}
              variant="outline"
              className="flex-1 h-12 border-2 text-base font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Предыдущий урок
            </Button>

            <Button
              onClick={handleNext}
              disabled={lessonIndex === totalLessons - 1}
              className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Следующий урок →
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Lesson;

