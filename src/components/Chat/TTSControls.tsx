/**
 * TTSControls - Text-to-Speech control buttons and progress
 */

import React from 'react';
import { Volume2, VolumeX, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { TTSControlsProps } from './types';
import { logger } from '@/utils/logger';

export const TTSControls = React.memo(
  ({
    isEnabled,
    isSpeaking,
    currentSentence,
    totalSentences,
    onToggle,
    onStop,
    disabled = false,
  }: TTSControlsProps) => {
    const handleToggle = () => {
      logger.debug('Toggling TTS', { isEnabled });
      onToggle();
    };

    const handleStop = () => {
      logger.debug('Stopping TTS');
      onStop();
    };

    const progressPercent =
      totalSentences > 0 ? Math.round((currentSentence / totalSentences) * 100) : 0;

    return (
      <div className="space-y-2 rounded-lg border border-border bg-background p-4">
        {/* Main control buttons */}
        <div className="flex gap-2">
          <Button
            variant={isEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggle}
            disabled={disabled}
            className="flex-1"
            title={isEnabled ? 'Отключить TTS' : 'Включить TTS'}
          >
            {isEnabled ? (
              <>
                <VolumeX className="mr-2 h-4 w-4" />
                TTS включен
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Включить TTS
              </>
            )}
          </Button>

          {/* Stop button - only visible when speaking */}
          {isSpeaking && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleStop}
              disabled={disabled}
              title="Остановить речь"
            >
              <Square className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Progress display */}
        {isSpeaking && totalSentences > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Предложение {currentSentence}/{totalSentences}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1" />
          </div>
        )}

        {/* Status indicator */}
        {isEnabled && (
          <div className="text-xs text-muted-foreground">
            {isSpeaking ? (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                <span>Произнесение...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Готов к произнесению</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

TTSControls.displayName = 'TTSControls';

export default TTSControls;

