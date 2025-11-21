/**
 * Voice Conversation History Component
 * Shows the conversation between teacher and student during voice lesson
 * @module features/voice/ui/VoiceConversationHistory
 */

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Brain, User, MessageCircle } from 'lucide-react';

interface ConversationEntry {
  role: 'teacher' | 'student';
  text: string;
}

interface VoiceConversationHistoryProps {
  conversationHistory: ConversationEntry[];
  className?: string;
}

export function VoiceConversationHistory({
  conversationHistory,
  className = ''
}: VoiceConversationHistoryProps) {
  if (conversationHistory.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-32 text-muted-foreground ${className}`}>
        <MessageCircle className="w-8 h-8 mb-2" />
        <p className="text-sm">История разговора появится здесь</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">История разговора</span>
        <Badge variant="secondary" className="text-xs">
          {conversationHistory.length} сообщений
        </Badge>
      </div>

      <ScrollArea className="h-48 rounded-lg border p-3">
        <div className="space-y-3">
          {conversationHistory.map((entry, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                entry.role === 'student' ? 'justify-end' : 'justify-start'
              }`}
            >
              {entry.role === 'teacher' && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    <Brain className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                  entry.role === 'student'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{entry.text}</p>
              </div>

              {entry.role === 'student' && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-secondary text-xs">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}


