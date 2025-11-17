/**
 * EmbeddedAudioCall - Audio call component embedded within lesson page
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  MessageSquare,
  Clock
} from 'lucide-react';

interface LessonInfo {
  title: string;
  topic: string;
}

interface EmbeddedVideoCallProps {
  lessonInfo?: LessonInfo;
  onClose: () => void;
  className?: string;
}

// WebRTC and Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

export const EmbeddedAudioCall = React.memo(({ lessonInfo, onClose, className = '' }: EmbeddedVideoCallProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer for call duration
  useEffect(() => {
    if (isConnected) {
      callStartTimeRef.current = Date.now();
      durationIntervalRef.current = setInterval(() => {
        if (callStartTimeRef.current) {
          setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
        }
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isConnected]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate connection (in real app, this would connect to WebRTC)
  const startCall = () => {
    setIsConnected(true);
    // Simulate getting audio access only
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        // Audio stream is available for the call
        console.log('Audio access granted for call');
      })
      .catch(err => console.error('Error accessing audio:', err));
  };

  const endCall = () => {
    setIsConnected(false);
    // Stop all media streams
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(err => console.error('Error stopping audio:', err));
    onClose();
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // In real implementation, this would control audio track
  };


  useEffect(() => {
    // Auto-start call when component mounts
    const timer = setTimeout(startCall, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className={`w-full border-2 border-primary/20 bg-card/95 backdrop-blur-xl ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Звонок с учителем</CardTitle>
            </div>
            {isConnected && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Clock className="w-3 h-3" />
                {formatDuration(callDuration)}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        </div>

        {lessonInfo && (
          <div className="mt-2 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-1">{lessonInfo.title}</h4>
            <p className="text-xs text-muted-foreground">{lessonInfo.topic}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {!isConnected ? (
          // Connecting state
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Подключение к учителю...</h3>
            <p className="text-muted-foreground text-center">
              Пожалуйста, подождите пока учитель ответит на звонок
            </p>
            <div className="flex gap-2 mt-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          </div>
        ) : (
          // Connected state
          <div className="space-y-4">
            {/* Audio call interface */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Голосовой звонок активен</h3>
              <p className="text-muted-foreground text-center text-sm">
                Вы можете общаться с учителем голосом
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={toggleMic}
                variant={isMicOn ? "secondary" : "destructive"}
                size="lg"
                className="rounded-full w-14 h-14 p-0"
                title={isMicOn ? "Выключить микрофон" : "Включить микрофон"}
              >
                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </Button>

              <Button
                onClick={endCall}
                variant="destructive"
                size="lg"
                className="rounded-full w-14 h-14 p-0"
                title="Завершить звонок"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </div>

            {/* Additional info */}
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Чат доступен во время звонка</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

EmbeddedAudioCall.displayName = 'EmbeddedAudioCall';

export default EmbeddedAudioCall;
