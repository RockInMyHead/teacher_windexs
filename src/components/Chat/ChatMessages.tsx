/**
 * ChatMessages - Display chat messages with optional TTS
 */

import React from 'react';
import { Message, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatMessagesProps } from './types';
import { logger } from '@/utils/logger';

export const ChatMessages = React.memo(
  ({
    messages,
    isLoading = false,
    onMessageSpeak,
    isSpeakingId = null,
    onMessageRemove,
  }: ChatMessagesProps) => {
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    React.useEffect(() => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    }, [messages]);

    const handleSpeak = async (message: Message) => {
      try {
        logger.debug('Speaking message', { id: message.id });
        await onMessageSpeak?.(message);
      } catch (error) {
        logger.error('Failed to speak message', error as Error);
      }
    };

    const handleRemove = (id: string) => {
      logger.debug('Removing message', { id });
      onMessageRemove?.(id);
    };

    return (
      <ScrollArea className="h-[500px] w-full rounded-lg border border-border bg-background p-4">
        <div ref={scrollAreaRef} className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Нет сообщений. Начните разговор!</p>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>
                    {message.role === 'user' ? '👤' : '🤖'}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`flex max-w-[70%] flex-col gap-2 rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="break-words text-sm">{message.content}</p>

                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <span>
                      {message.timestamp.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Action buttons for assistant messages */}
                  {message.role === 'assistant' && (
                    <div className="mt-2 flex gap-2">
                      {onMessageSpeak && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSpeak(message)}
                          disabled={isSpeakingId !== null && isSpeakingId !== message.id}
                          className="h-7 w-7 p-0"
                          title="Произнести вслух"
                        >
                          {isSpeakingId === message.id ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}

                      {onMessageRemove && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(message.id)}
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                          title="Удалить сообщение"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback>🤖</AvatarFallback>
              </Avatar>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0.1s' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0.2s' }} />
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
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.isSpeakingId === nextProps.isSpeakingId
    );
  }
);

ChatMessages.displayName = 'ChatMessages';

export default ChatMessages;

