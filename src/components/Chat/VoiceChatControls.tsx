/**
 * VoiceChatControls - Voice chat activation and control buttons
 */

import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VoiceChatControlsProps } from './types';
import { logger } from '@/utils/logger';

export const VoiceChatControls = React.memo(
  ({
    isActive,
    isListening,
    isSpeaking,
    onToggle,
    onStartListening,
    onStopListening,
    disabled = false,
  }: VoiceChatControlsProps) => {
    const handleToggleVoiceChat = () => {
      logger.debug('Toggling voice chat', { isActive });
      onToggle();
    };

    const handleListeningControl = () => {
      if (isListening) {
        logger.debug('Stopping listening');
        onStopListening();
      } else {
        logger.debug('Starting listening');
        onStartListening();
      }
    };

    return (
      <div className="flex gap-2 rounded-lg border border-border bg-background p-4">
        {/* Main voice chat toggle */}
        <Button
          variant={isActive ? 'default' : 'outline'}
          size="lg"
          onClick={handleToggleVoiceChat}
          disabled={disabled}
          className="flex-1"
          title={isActive ? 'Отключить голосовой чат' : 'Включить голосовой чат'}
        >
          {isActive ? (
            <>
              <VolumeX className="mr-2 h-4 w-4" />
              Голосовой чат активен
            </>
          ) : (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Включить голосовой чат
            </>
          )}
        </Button>

        {/* Listening control - only visible when voice chat is active */}
        {isActive && (
          <Button
            variant={isListening ? 'destructive' : 'secondary'}
            size="lg"
            onClick={handleListeningControl}
            disabled={disabled || isSpeaking}
            className="flex-1"
            title={isListening ? 'Остановить прослушивание' : 'Начать прослушивание'}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4 animate-pulse" />
                Слушаю...
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Начать говорить
              </>
            )}
          </Button>
        )}

        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 text-sm text-muted-foreground">
          {isActive ? (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span>Активен</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-muted-foreground" />
              <span>Неактивен</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

VoiceChatControls.displayName = 'VoiceChatControls';

export default VoiceChatControls;

