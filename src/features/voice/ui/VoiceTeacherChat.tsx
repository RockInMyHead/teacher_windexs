/**
 * Voice Teacher Chat Component
 * Main component for voice-based AI teacher interaction
 * @module features/voice/ui/VoiceTeacherChat
 */

import React, { useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Mic,
  MicOff,
  X,
  Languages,
  Volume2,
  VolumeX
} from 'lucide-react';

// Internal imports
import { useVoiceLessonModel, useSpeechRecognition } from '../model/voiceModel';
import { SpeechRecognitionAPI } from '../api/speechRecognitionApi';
import { VoiceStatusIndicator } from './VoiceStatusIndicator';
import { VoiceLessonProgress } from './VoiceLessonProgress';
import { VoiceConversationHistory } from './VoiceConversationHistory';

// External imports
import { OpenAITTS } from '@/lib/openaiTTS';

interface VoiceTeacherChatProps {
  lessonTitle: string;
  lessonTopic: string;
  lessonAspects: string;
  onComplete: () => void;
  onClose: () => void;
}

export const VoiceTeacherChat = ({
  lessonTitle,
  lessonTopic,
  lessonAspects,
  onComplete,
  onClose
}: VoiceTeacherChatProps) => {
  // TTS state
  const [isTtsEnabled, setIsTtsEnabled] = React.useState(false);

  // Use our custom hooks with safe defaults
  const lesson = useVoiceLessonModel({
    lessonTitle: lessonTitle || 'Общий урок',
    lessonTopic: lessonTopic || 'Общение',
    lessonAspects: lessonAspects || 'Интерактивное обучение с голосом'
  });
  const speech = useSpeechRecognition();

  // Initialize lesson on mount
  useEffect(() => {
    if (!lesson.lessonStarted) {
      lesson.initializeLesson();
    }
  }, [lesson]);

  // Handle language change
  const handleLanguageChange = useCallback((language: string) => {
    lesson.updateState({ selectedLanguage: language });
  }, [lesson]);

  // Handle voice input start/stop
  const handleVoiceToggle = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
      const transcript = speech.getFinalTranscript();
      if (transcript.trim()) {
        lesson.handleVoiceInput(transcript).then(response => {
          if (isTtsEnabled && response) {
            speakText(response);
          }
        });
      }
    } else {
      speech.startListening(lesson.selectedLanguage);
    }
  }, [speech, lesson, isTtsEnabled]);

  // Handle TTS
  const speakText = useCallback(async (text: string) => {
    if (!isTtsEnabled) return;

    try {
      lesson.updateState({ isSpeaking: true });
      await OpenAITTS.speak(text, {
        voice: 'nova',
        model: 'tts-1',
        format: 'mp3',
        onStart: () => console.log('🔊 TTS started'),
        onEnd: () => {
          lesson.updateState({ isSpeaking: false });
          console.log('✅ TTS completed');
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      lesson.updateState({ isSpeaking: false });
    }
  }, [lesson, isTtsEnabled]);

  // Handle lesson completion
  const handleComplete = useCallback(async () => {
    const summary = await lesson.finishLesson();
    if (isTtsEnabled && summary) {
      speakText(summary);
    }
    onComplete();
  }, [lesson, isTtsEnabled, speakText, onComplete]);

  // Handle close
  const handleClose = useCallback(() => {
    lesson.resetLesson();
    OpenAITTS.stop();
    onClose();
  }, [lesson, onClose]);

  // Auto-speak current note when lesson starts
  useEffect(() => {
    if (lesson.lessonStarted && lesson.lessonNotes.length > 0 && isTtsEnabled) {
      const currentNote = lesson.lessonNotes[lesson.currentNoteIndex];
      if (currentNote) {
        speakText(currentNote);
      }
    }
  }, [lesson.lessonStarted, lesson.currentNoteIndex, lesson.lessonNotes, isTtsEnabled, speakText]);

  // Show loading state while initializing
  if (lesson.isGeneratingLesson) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 p-6">
            <div className="animate-pulse">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-primary">
                Генерирую урок...
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {lesson.generationStep || 'Подготовка материалов'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Голосовой урок
          </CardTitle>
          <Badge variant="outline">
            {lesson.lessonTitle || 'Общий урок'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <Select value={lesson.selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SpeechRecognitionAPI.getSupportedLanguages().map(lang => (
                <SelectItem key={lang} value={lang}>
                  {lang === 'ru-RU' ? 'Русский' :
                   lang === 'en-US' ? 'English' :
                   lang === 'es-ES' ? 'Español' :
                   lang === 'fr-FR' ? 'Français' :
                   lang === 'de-DE' ? 'Deutsch' : lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* TTS toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsTtsEnabled(!isTtsEnabled)}
            title={isTtsEnabled ? 'Отключить озвучку' : 'Включить озвучку'}
          >
            {isTtsEnabled ? (
              <Volume2 className="w-4 h-4 text-primary" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>

          {/* Close button */}
          <Button variant="outline" size="icon" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status indicator */}
        <VoiceStatusIndicator
          isListening={speech.isListening}
          isProcessing={lesson.isProcessing}
          isSpeaking={lesson.isSpeaking}
          transcript={speech.transcript}
        />

        {/* Lesson progress */}
        {lesson.lessonStarted && lesson.lessonNotes.length > 0 && (
          <VoiceLessonProgress
            currentNoteIndex={lesson.currentNoteIndex}
            totalNotes={lesson.lessonNotes.length}
            currentNote={lesson.lessonNotes[lesson.currentNoteIndex]}
            lessonProgress={lesson.lessonProgress}
            callDuration={lesson.callDuration}
            conversationHistory={lesson.conversationHistory}
            onNextNote={lesson.nextNote}
            onRepeatNote={lesson.repeatNote}
            onFinishLesson={handleComplete}
          />
        )}

        {/* Conversation history */}
        <VoiceConversationHistory
          conversationHistory={lesson.conversationHistory}
        />

        {/* Voice controls */}
        <div className="flex justify-center">
          {!lesson.lessonStarted ? (
            <Button
              size="lg"
              onClick={() => lesson.initializeLesson()}
              disabled={lesson.isGeneratingLesson}
              className="w-32 h-32 rounded-full text-white font-semibold bg-green-500 hover:bg-green-600"
            >
              <div className="flex flex-col items-center gap-2">
                <Mic className="w-8 h-8" />
                <span className="text-sm">Начать урок</span>
              </div>
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleVoiceToggle}
              disabled={lesson.isProcessing}
              className={`w-32 h-32 rounded-full text-white font-semibold ${
                speech.isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {speech.isListening ? (
                  <>
                    <MicOff className="w-8 h-8" />
                    <span className="text-sm">Стоп</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8" />
                    <span className="text-sm">Говорить</span>
                  </>
                )}
              </div>
            </Button>
          )}
        </div>

        {/* Error display */}
        {speech.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              Ошибка распознавания речи: {speech.error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
