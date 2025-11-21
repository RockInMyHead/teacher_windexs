/**
 * ChatMessages - Display chat messages
 */

import React from 'react';
import { MessageSquare, Trash2, Volume2, VolumeX, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatMessagesProps } from './types';
import { logger } from '@/utils/logger';
import { MarkdownRenderer } from './MarkdownRenderer';
import { OpenAITTS, isTTSAvailable } from '@/lib/openaiTTS';

// Streaming text component with character-by-character animation
const StreamingText: React.FC<{ content: string }> = ({ content }) => {
  // Нормализуем текст для правильной обработки UTF-8
  const normalizedContent = content.normalize('NFC');
  console.log('🎯 StreamingText RENDERED with content:', normalizedContent, 'length:', normalizedContent.length);

  const [displayedText, setDisplayedText] = React.useState('');
  const currentIndexRef = React.useRef(0);
  const contentRef = React.useRef('');
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    console.log('🎯 StreamingText useEffect triggered with content:', normalizedContent, 'length:', normalizedContent.length);
    // If content changed (new chars added), continue typing
    if (normalizedContent !== contentRef.current) {
      contentRef.current = normalizedContent;
      console.log('📝 Content updated:', normalizedContent.length, 'chars, currentIndex:', currentIndexRef.current);

      // Start typing if not already running
      if (!timerRef.current) {
        const typeNext = () => {
          if (currentIndexRef.current < contentRef.current.length) {
            // Используем Array.from для правильной работы с UTF-8 символами
            const chars = Array.from(contentRef.current);
            const char = chars[currentIndexRef.current];
            const delay = char === ' ' ? 10 : char === '\n' ? 30 : 15;

            console.log(`⌨️ Typing char ${currentIndexRef.current}: "${char}"`);

            currentIndexRef.current++;
            // Используем Array.from и slice для правильного substring с UTF-8
            const displayedChars = chars.slice(0, currentIndexRef.current);
            setDisplayedText(displayedChars.join(''));

            timerRef.current = setTimeout(typeNext, delay);
          } else {
            console.log('✅ Typing complete');
            timerRef.current = null;
          }
        };

        console.log('🚀 Starting typing animation');
        typeNext();
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [content]);

  // Reset on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <MarkdownRenderer content={displayedText} isStreaming={true} />
      {currentIndexRef.current < content.length && (
        <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
      )}
    </>
  );
};

export const ChatMessages = React.memo(
  ({
    messages,
    isLoading = false,
    onMessageRemove,
    streamingMessage,
  }: ChatMessagesProps) => {
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    // TTS state
    const [speakingMessageId, setSpeakingMessageId] = React.useState<string | null>(null);
    const [ttsSupported, setTtsSupported] = React.useState(false);

    // Check TTS availability on mount
    React.useEffect(() => {
      setTtsSupported(isTTSAvailable());
    }, []);

    // Auto-scroll to bottom when new messages arrive
    React.useEffect(() => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    }, [messages, streamingMessage]);

    // TTS functions
    const speakMessage = async (messageId: string, content: string) => {
      if (!ttsSupported) return;

      try {
        setSpeakingMessageId(messageId);

        // Clean markdown from content for TTS
        const cleanContent = content
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.*?)\*/g, '$1')     // Remove italic
          .replace(/```.*?```/gs, '')      // Remove code blocks
          .replace(/`(.*?)`/g, '$1')       // Remove inline code
          .replace(/#{1,6}\s/g, '')        // Remove headers
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
          .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
          .replace(/\n+/g, ' ')            // Replace newlines with spaces
          .trim();

        await OpenAITTS.speak(cleanContent);
      } catch (error) {
        logger.error('TTS error:', error);
      } finally {
        setSpeakingMessageId(null);
      }
    };

    const stopSpeaking = () => {
      OpenAITTS.stop();
      setSpeakingMessageId(null);
    };


    const handleRemove = (id: string) => {
      logger.debug('Removing message', { id });
      onMessageRemove?.(id);
    };

    return (
      <ScrollArea className="h-full w-full bg-background">
        <div ref={scrollAreaRef} className="space-y-4 p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground px-4">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg">Нет сообщений. Начните разговор!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map(message => (
              <div
                key={message.id}
                className={`flex group ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Message bubble */}
                <div className={`max-w-[80%] sm:max-w-[70%]`}>
                  {/* Time stamp */}
                  <div className={`text-xs text-muted-foreground mb-1 px-1 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  {/* Message content */}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-card border border-border/50 text-card-foreground'
                    }`}
                  >
                    {/* Images */}
                    {(message.images || message.imageUrls) && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {(message.images || []).map((image, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Attachment ${index + 1}`}
                            className="max-w-32 max-h-32 object-cover rounded-lg border border-border/50"
                          />
                        ))}
                        {(message.imageUrls || []).map((url, index) => (
                          <img
                            key={`url-${index}`}
                            src={url}
                            alt={`Attachment ${index + 1}`}
                            className="max-w-32 max-h-32 object-cover rounded-lg border border-border/50"
                          />
                        ))}
                      </div>
                    )}

                    {/* Text content */}
                    {message.content && (
                      <div className="text-sm leading-relaxed">
                        {message.role === 'user' ? (
                          <p className="break-words">{message.content}</p>
                        ) : (
                          <MarkdownRenderer content={message.content} />
                        )}
                      </div>
                    )}

                    {/* Action buttons for assistant messages */}
                    {message.role === 'assistant' && (
                      <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* TTS Button */}
                        {ttsSupported && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (speakingMessageId === message.id) {
                                stopSpeaking();
                              } else {
                                speakMessage(message.id, message.content);
                              }
                            }}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                            title={speakingMessageId === message.id ? "Остановить озвучку" : "Озвучить сообщение"}
                          >
                            {speakingMessageId === message.id ? (
                              <VolumeX className="h-3 w-3" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                          </Button>
                        )}

                        {onMessageRemove && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(message.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Удалить сообщение"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              ))}

              {/* Streaming message */}
              {streamingMessage && (
                <div className="flex gap-0 group justify-start">
                  {/* Message bubble */}
                  <div className="max-w-[80%] sm:max-w-[70%]">
                    {/* Time stamp */}
                    <div className="text-xs text-muted-foreground mb-1 px-1 text-left">
                      {streamingMessage.timestamp.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>

                    {/* Message content */}
                    <div className="rounded-2xl px-4 py-3 shadow-sm bg-card border border-border/50 text-card-foreground">
                      <div className="text-sm leading-relaxed">
                        <StreamingText content={streamingMessage.content} />
                      </div>

                      {/* Status indicator */}
                      <div className="flex items-center gap-2 text-xs opacity-70 mt-2">
                        <span className="text-blue-500">Печатает...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback>🤖</AvatarFallback>
              </Avatar>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memoization
    return (
      prevProps.messages === nextProps.messages &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

ChatMessages.displayName = 'ChatMessages';

export default ChatMessages;

