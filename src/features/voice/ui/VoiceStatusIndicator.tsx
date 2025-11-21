/**
 * Voice Status Indicator Component
 * Shows current voice interaction status (listening, processing, speaking)
 * @module features/voice/ui/VoiceStatusIndicator
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VoiceStatusIndicatorProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript?: string;
  className?: string;
}

export function VoiceStatusIndicator({
  isListening,
  isProcessing,
  isSpeaking,
  transcript = '',
  className = ''
}: VoiceStatusIndicatorProps) {
  const getStatusInfo = () => {
    if (isProcessing) {
      return {
        icon: Brain,
        text: 'Обрабатываю...',
        variant: 'secondary' as const,
        color: 'text-blue-600'
      };
    }
    if (isSpeaking) {
      return {
        icon: Volume2,
        text: 'Говорю...',
        variant: 'secondary' as const,
        color: 'text-green-600'
      };
    }
    if (isListening) {
      return {
        icon: Mic,
        text: 'Слушаю...',
        variant: 'default' as const,
        color: 'text-red-600'
      };
    }
    return {
      icon: MicOff,
      text: 'Готов к общению',
      variant: 'outline' as const,
      color: 'text-muted-foreground'
    };
  };

  const { icon: Icon, text, variant, color } = getStatusInfo();

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isListening ? 'bg-red-100 animate-pulse' : 'bg-muted'}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div className="flex-1">
            <Badge variant={variant} className="mb-2">
              {text}
            </Badge>
            {transcript && (
              <p className="text-sm text-muted-foreground">
                "{transcript}"
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}




