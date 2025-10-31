import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, Send, User, ArrowLeft, MessageCircle, Upload, FileText, Image, File, X, Mic, MicOff, Camera, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const Chat = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ru-RU'; // Russian language

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(prev => prev + (prev ? ' ' : '') + transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setSpeechRecognition(recognition);
    }
  }, []);

  // Cleanup camera and speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      // Stop speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [cameraStream]);

  // Function to start voice recording
  const startVoiceRecording = () => {
    if (speechRecognition && !isRecording) {
      speechRecognition.start();
    }
  };

  // Function to stop voice recording
  const stopVoiceRecording = () => {
    if (speechRecognition && isRecording) {
      speechRecognition.stop();
    }
  };

  // Function to toggle voice recording
  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  // Function to speak text using Web Speech API
  const speakText = (text: string, messageId: string) => {
    if ('speechSynthesis' in window) {
      // Stop any currently speaking
      window.speechSynthesis.cancel();

      if (speakingMessageId === messageId) {
        // If already speaking this message, stop it
        setSpeakingMessageId(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Set Russian language for better pronunciation
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;

      utterance.onstart = () => {
        setSpeakingMessageId(messageId);
      };

      utterance.onend = () => {
        setSpeakingMessageId(null);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeakingMessageId(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Ваш браузер не поддерживает озвучивание текста.');
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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
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

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
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

  const sendMessage = async () => {
    if ((!inputMessage.trim() && uploadedFiles.length === 0) || isLoading || isProcessingFile) return;

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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
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

Помните: ваша цель - не просто дать ответ, а научить думать и понимать материал.`,
            },
            ...messages.map(msg => ({
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
        throw new Error('Failed to get response from OpenAI');
      }

      const data = await response.json();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/courses')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold">Windexs-Учитель</h1>
            </div>

            {/* Right side - Title */}
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">AI Учитель</h2>
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
              Задавайте вопросы по любым учебным темам - я объясню всё просто и понятно!
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
                        {message.role === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(message.content, message.id)}
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
            <div className="flex gap-2 pt-4 border-t">
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

                  {/* Voice Recording Button */}
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="icon"
                    onClick={toggleVoiceRecording}
                    disabled={isLoading || !speechRecognition}
                    title={isRecording ? "Остановить запись" : "Голосовой ввод"}
                    className={isRecording ? "animate-pulse" : ""}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
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
