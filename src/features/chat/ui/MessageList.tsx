/**
 * MessageList Component
 * Displays a scrollable list of chat messages
 * @module features/chat/ui/MessageList
 */

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Brain, User, Volume2 } from 'lucide-react';
import type { Message } from '@/types';

interface MessageListProps {
  messages: Message[];
  speakingMessageId: string | null;
  onSpeakMessage?: (messageId: string, content: string) => void;
  showSpeakButton?: boolean;
}

export function MessageList({
  messages,
  speakingMessageId,
  onSpeakMessage,
  showSpeakButton = true
}: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Начните разговор с вашим учителем ИИ</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Brain className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              
              {message.role === 'assistant' && showSpeakButton && onSpeakMessage && (
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSpeakMessage(message.id, message.content)}
                    disabled={speakingMessageId === message.id}
                    className="h-6 px-2 text-xs"
                  >
                    <Volume2 className="w-3 h-3 mr-1" />
                    {speakingMessageId === message.id ? 'Озвучивается...' : 'Озвучить'}
                  </Button>
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-secondary">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

