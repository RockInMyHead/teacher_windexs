/**
 * ChatInput - Input field for sending messages
 */

import React, { useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ChatInputProps } from './types';
import { logger } from '@/utils/logger';

export const ChatInput = React.memo(
  ({
    onSendMessage,
    isLoading = false,
    disabled = false,
    placeholder = 'Введите сообщение...',
  }: ChatInputProps) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSendMessage = async () => {
      if (!message.trim() || isLoading || isSending) return;

      try {
        setIsSending(true);
        logger.debug('Sending message', { length: message.length });
        await onSendMessage(message.trim());
        setMessage('');

        // Focus input after sending
        inputRef.current?.focus();
      } catch (error) {
        logger.error('Failed to send message', error as Error);
      } finally {
        setIsSending(false);
      }
    };


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const isButtonDisabled = !message.trim() || isLoading || isSending || disabled;

    return (
      <div className="space-y-2 rounded-lg border border-border bg-background p-4">
        {/* Input and buttons */}
        <div className="flex gap-2">

          <Input
            ref={inputRef}
            value={message}
            onChange={e => setMessage(e.currentTarget.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            className="flex-1"
          />

          <Button
            onClick={handleSendMessage}
            disabled={isButtonDisabled}
            size="icon"
            title="Отправить (Enter)"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;

