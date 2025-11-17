/**
 * ChatMessages - Display chat messages
 */

import React from 'react';
import { Message, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatMessagesProps } from './types';
import { logger } from '@/utils/logger';
import { MarkdownRenderer } from './MarkdownRenderer';

export const ChatMessages = React.memo(
  ({
    messages,
    isLoading = false,
    onMessageRemove,
    streamingMessage,
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
            <>
              {messages.map(message => (
              <div
                key={message.id}
                className="flex flex-col gap-2"
              >

                <div
                  className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                    {message.role === 'user' ? (
                  <p className="break-words text-sm">{message.content}</p>
                    ) : (
                      <MarkdownRenderer content={message.content} />
                    )}

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
              ))}

              {/* Streaming message */}
              {streamingMessage && (
                <div className="flex flex-col gap-2">
                  <div className="rounded-lg bg-muted p-3">
                    <MarkdownRenderer content={streamingMessage.content} isStreaming={true} />
                    <div className="flex items-center gap-2 text-xs opacity-70 mt-2">
                      <span>
                        {streamingMessage.timestamp.toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-blue-500">Печатает...</span>
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

