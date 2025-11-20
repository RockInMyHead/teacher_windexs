/**
 * ChatHeader Component
 * Header for chat interface with controls
 * @module features/chat/ui/ChatHeader
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff,
  BookOpen 
} from 'lucide-react';

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  isTtsEnabled?: boolean;
  onToggleTTS?: () => void;
  onBack?: () => void;
  onVoiceCall?: () => void;
  isVoiceCallActive?: boolean;
  showVoiceButton?: boolean;
  showBackButton?: boolean;
}

export function ChatHeader({
  title = 'Учитель ИИ',
  subtitle,
  isTtsEnabled = false,
  onToggleTTS,
  onBack,
  onVoiceCall,
  isVoiceCallActive = false,
  showVoiceButton = false,
  showBackButton = false
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        {showBackButton && onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onToggleTTS && (
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleTTS}
            title={isTtsEnabled ? 'Отключить озвучку' : 'Включить озвучку'}
            className="h-8 w-8"
          >
            {isTtsEnabled ? (
              <Volume2 className="w-4 h-4 text-primary" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
        )}

        {showVoiceButton && onVoiceCall && (
          <Button
            variant={isVoiceCallActive ? 'destructive' : 'default'}
            size="sm"
            onClick={onVoiceCall}
            className="gap-2"
          >
            {isVoiceCallActive ? (
              <>
                <PhoneOff className="w-4 h-4" />
                Завершить звонок
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                Голосовой звонок
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

