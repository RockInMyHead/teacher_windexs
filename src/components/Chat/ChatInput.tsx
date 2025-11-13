/**
 * ChatInput - Input field with file attachment support
 */

import React, { useRef, useState } from 'react';
import { Send, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { ChatInputProps } from './types';
import { logger } from '@/utils/logger';
import { FILE_CONFIG } from '@/utils/constants';

export const ChatInput = React.memo(
  ({
    onSendMessage,
    onFileSelected,
    isLoading = false,
    disabled = false,
    placeholder = 'Введите сообщение...',
    uploadedFilesCount = 0,
  }: ChatInputProps) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const handleFileClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.currentTarget.files || []);

      if (files.length === 0) return;

      // Validate file count
      if (uploadedFilesCount + files.length > FILE_CONFIG.MAX_FILES) {
        logger.warn('Too many files', {
          current: uploadedFilesCount,
          new: files.length,
          max: FILE_CONFIG.MAX_FILES,
        });
        return;
      }

      // Validate file sizes
      const invalidFiles = files.filter(f => f.size > FILE_CONFIG.MAX_FILE_SIZE);
      if (invalidFiles.length > 0) {
        logger.warn('Files too large', { count: invalidFiles.length });
        return;
      }

      logger.debug('Files selected', { count: files.length });
      onFileSelected?.(files);

      // Reset file input
      e.currentTarget.value = '';
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
        {/* File attachments info */}
        {uploadedFilesCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {uploadedFilesCount} файл{uploadedFilesCount > 1 ? 'ов' : ''}
            </Badge>
            <span className="text-xs text-muted-foreground">
              прикреплено
            </span>
          </div>
        )}

        {/* Input and buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleFileClick}
            disabled={disabled || uploadedFilesCount >= FILE_CONFIG.MAX_FILES}
            title={`Прикрепить файл (макс ${FILE_CONFIG.MAX_FILES})`}
          >
            <Plus className="h-4 w-4" />
          </Button>

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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          accept={FILE_CONFIG.ALLOWED_FORMATS.ALL.join(',')}
          className="hidden"
          disabled={disabled}
        />
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;

