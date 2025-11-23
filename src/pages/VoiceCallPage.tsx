import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mic, Loader2, MicOff, PhoneOff } from 'lucide-react';
import Header from '@/components/Header';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const VoiceCallPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [speechTheses, setSpeechTheses] = useState<string[]>([]);
  const [audioBlocked, setAudioBlocked] = useState(false);
  
  // Use ref for lesson context to avoid closure issues
  const lessonContextRef = useRef<{
    title: string;
    topic: string;
    description: string;
  } | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const speechFramesRef = useRef<number>(0);
  const silenceFramesRef = useRef<number>(0);
  const silenceAfterSpeechRef = useRef<number>(0);
  const speechDetectedRef = useRef<boolean>(false);
  const processingTypeRef = useRef<'speech' | 'silence' | null>(null);
  const isActiveRef = useRef<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Voice detection parameters (balanced sensitivity)
  const CALIBRATION_FRAMES = 30; // ~1.5 seconds to measure background noise (more stable calibration)
  const QUICK_CALIBRATION_FRAMES = 10; // ~0.5 seconds for quick recalibration after resume
  const REQUIRED_SPEECH_FRAMES = 8; // ~0.4 seconds of speech to mark as started (stable detection)
  const SILENCE_AFTER_SPEECH_FRAMES = 50; // ~2.5 seconds of silence after speech to stop (longer pause)
  const REQUIRED_SILENCE_FRAMES = 150; // ~7.5 seconds of total silence for follow-up (reduced to avoid long waits)
  
  // Dynamic noise detection
  const noiseFloorRef = useRef<number>(0);
  const isCalibrationDoneRef = useRef<boolean>(false);
  const calibrationSamplesRef = useRef<number[]>([]);
  const isQuickCalibrationRef = useRef<boolean>(false); // Quick recalibration after resume

  // Toggle microphone mute/unmute
  const toggleMute = () => {
    if (isMuted) {
      // Unmute - resume listening
      setIsMuted(false);
      console.log('🎤 Microphone unmuted');
      if (!isListening && !isProcessing) {
        startListening();
      }
    } else {
      // Mute - stop listening
      setIsMuted(true);
      console.log('🔇 Microphone muted');
      stopRecording();
    }
  };

  // End lesson and navigate back
  const endLesson = () => {
    console.log('📞 Ending lesson');
    stopRecording();
    cleanup();
    setSpeechTheses([]);
    navigate(-1);
  };

  // Cleanup function
  const cleanup = () => {
    console.log('🧹 Cleanup started');
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('MediaRecorder stop error:', e);
      }
    }
    mediaRecorderRef.current = null;
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    
    analyserRef.current = null;
    audioChunksRef.current = [];
    speechFramesRef.current = 0;
    silenceFramesRef.current = 0;
    silenceAfterSpeechRef.current = 0;
    speechDetectedRef.current = false;
    processingTypeRef.current = null;
    isActiveRef.current = false;
    
    console.log('✅ Cleanup complete');
  };

  // Start listening
  const startListening = async () => {
    if (isActiveRef.current) {
      console.log('⚠️ Already active, skipping start');
      return;
    }

    try {
      console.log('🎤 Starting listening...');
      cleanup();
      
      isActiveRef.current = true;
      setIsListening(true);
      setError(null);
      
      // Reset detection state
      speechFramesRef.current = 0;
      silenceFramesRef.current = 0;
      silenceAfterSpeechRef.current = 0;
      speechDetectedRef.current = false;
      processingTypeRef.current = null;
      
      // Reset noise calibration (full calibration)
      isCalibrationDoneRef.current = false;
      calibrationSamplesRef.current = [];
      noiseFloorRef.current = 0;
      isQuickCalibrationRef.current = false; // Full calibration on start

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      audioStreamRef.current = stream;
      console.log('✅ Microphone access granted');

      // Setup MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('📼 Audio chunk received, size:', event.data.size, 'total chunks:', audioChunksRef.current.length);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('🎬 ONSTOP TRIGGERED!');
        const processingType = processingTypeRef.current;
        console.log('🎤 Recording stopped, type:', processingType, 'audioChunks:', audioChunksRef.current.length);
        
        if (!processingType) {
          console.warn('⚠️ No processing type set, restarting...');
          restartListening();
          return;
        }

        if (audioChunksRef.current.length === 0) {
          console.warn('⚠️ No audio data, restarting...');
          restartListening();
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('📦 Audio blob created - size:', audioBlob.size, 'bytes, type:', audioBlob.type);

        if (audioBlob.size < 5000) {
          console.warn('⚠️ Audio too small (', audioBlob.size, 'bytes), skipping and restarting...');
          restartListening();
          return;
        }

        // Process based on type
        console.log('✅ Processing audio, type:', processingType);
        if (processingType === 'speech') {
          await handleSpeech(audioBlob);
        } else if (processingType === 'silence') {
          // Silence detected - just restart listening without generating follow-up
          console.log('🔄 Silence detected, restarting listening...');
          restartListening();
        }
      };

      // Start recording
      mediaRecorder.start();
      console.log('🎙️ Recording started');

      // Setup audio analysis
      setupAudioAnalysis(stream);

    } catch (error) {
      console.error('❌ Start listening error:', error);
      setError('Ошибка доступа к микрофону');
      isActiveRef.current = false;
      setIsListening(false);
    }
  };

  // Setup audio analysis
  const setupAudioAnalysis = (stream: MediaStream) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;

      console.log('🎧 Audio analysis ready');

      // Start detection loop
      detectAudio();
    } catch (error) {
      console.error('❌ Audio analysis setup error:', error);
    }
  };

  // Detect audio levels with adaptive noise floor
  const detectAudio = () => {
    if (!isActiveRef.current || !analyserRef.current) {
      console.log('🛑 Detection stopped');
      return;
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average and max energy in voice frequency range (roughly bins 10-100 for typical sample rates)
    // Human voice is typically 85-255 Hz (low) to 3400 Hz (high)
    // We focus on bins that represent ~300-3000 Hz
    const voiceStartBin = Math.floor(bufferLength * 0.05); // ~5% of spectrum
    const voiceEndBin = Math.floor(bufferLength * 0.4); // ~40% of spectrum
    
    let sum = 0;
    let max = 0;
    let count = 0;
    
    for (let i = voiceStartBin; i < voiceEndBin && i < bufferLength; i++) {
      sum += dataArray[i];
      if (dataArray[i] > max) max = dataArray[i];
      count++;
    }
    
    const average = count > 0 ? sum / count : 0;
    
    // Calibration phase: measure background noise
    if (!isCalibrationDoneRef.current) {
      // Only add non-zero samples to calibration
      if (average > 1) {
        calibrationSamplesRef.current.push(average);
      }
      
      // Use quick calibration (0.5s) for resume, full calibration (1.5s) for initial start
      const requiredFrames = isQuickCalibrationRef.current ? QUICK_CALIBRATION_FRAMES : CALIBRATION_FRAMES;
      
      if (calibrationSamplesRef.current.length >= requiredFrames) {
        // Calculate noise floor as average of calibration samples
        const noiseSum = calibrationSamplesRef.current.reduce((a, b) => a + b, 0);
        const measuredNoiseFloor = noiseSum / calibrationSamplesRef.current.length;
        
        // Set minimum noise floor to avoid zero threshold (optimized for quiet environments)
        noiseFloorRef.current = Math.max(measuredNoiseFloor, 3);
        
        isCalibrationDoneRef.current = true;
        const calibType = isQuickCalibrationRef.current ? 'Quick' : 'Full';
        console.log(`🎚️ ${calibType} calibration: measured=${measuredNoiseFloor.toFixed(2)}, actual=${noiseFloorRef.current.toFixed(2)}, threshold=${(noiseFloorRef.current * 2.0).toFixed(2)}`);
      } else {
        // Still calibrating, continue
        animationFrameRef.current = requestAnimationFrame(detectAudio);
        return;
      }
    }
    
    // Dynamic speech threshold: noise floor * 1.8 (adaptive to environment)
    const MIN_THRESHOLD = 6; // Минимальный абсолютный порог (reasonable for various environments)
    const dynamicThreshold = Math.max(noiseFloorRef.current * 1.8, MIN_THRESHOLD);

    // Periodic logging to debug detection issues (every 50 frames = ~2.5 seconds)
    if (speechFramesRef.current === 0 && silenceFramesRef.current % 50 === 0 && silenceFramesRef.current > 0) {
      console.log(`👂 Listening... avg=${average.toFixed(1)}, max=${max}, threshold=${dynamicThreshold.toFixed(1)} (normal speaking volume)`);
    }

    // После начала речи используем стабильный порог для детекции тишины
    const silenceThreshold = speechDetectedRef.current
      ? Math.max(dynamicThreshold * 0.7, MIN_THRESHOLD * 0.6) // Более низкий порог после речи для стабильности
      : dynamicThreshold; // Порог для начала речи

    // Стабильная логика обнаружения речи с гистерезисом:
    // Добавляем небольшой буфер для предотвращения колебаний
    const speechHysteresis = 1.2; // Небольшой буфер для стабильности
    const silenceHysteresis = 0.9; // Буфер для тишины

    const effectiveSpeechThreshold = speechDetectedRef.current
      ? silenceThreshold * speechHysteresis // Немного выше для поддержания речи
      : dynamicThreshold;

    const effectiveSilenceThreshold = speechDetectedRef.current
      ? silenceThreshold * silenceHysteresis // Немного ниже для окончания речи
      : dynamicThreshold;

    const isSpeech = speechDetectedRef.current
      ? average > effectiveSilenceThreshold || max > noiseFloorRef.current * 2.0 // После начала речи - поддержание
      : average > effectiveSpeechThreshold || max > noiseFloorRef.current * 2.5; // Для начала речи
    
    if (isSpeech) {
      // Speech detected
      speechFramesRef.current++;
      silenceAfterSpeechRef.current = 0;

      // Mark that speech was detected
      if (speechFramesRef.current >= REQUIRED_SPEECH_FRAMES && !speechDetectedRef.current) {
        console.log(`🎤 SPEECH STARTED! avg=${average.toFixed(1)}, max=${max}, threshold=${dynamicThreshold.toFixed(1)}, silence_threshold=${silenceThreshold.toFixed(1)}`);
        speechDetectedRef.current = true;
      }

      // Log every 100 frames to monitor (less verbose)
      if (speechDetectedRef.current && speechFramesRef.current % 100 === 0) {
        console.log(`🗣️ Speaking... frames=${speechFramesRef.current}, avg=${average.toFixed(1)}, max=${max}, silence_threshold=${silenceThreshold.toFixed(1)}`);
      }
    } else {
      // Silence detected
      if (speechDetectedRef.current) {
        // We detected speech earlier, now counting silence after it
        silenceAfterSpeechRef.current++;
        
        if (silenceAfterSpeechRef.current === 1) {
          console.log(`🤫 Silence detected: avg=${average.toFixed(1)}, silence_threshold=${silenceThreshold.toFixed(1)}`);
        }

        if (silenceAfterSpeechRef.current % 30 === 0 && silenceAfterSpeechRef.current > 1) {
          console.log(`🤫 Silence progress: ${silenceAfterSpeechRef.current}/${SILENCE_AFTER_SPEECH_FRAMES}, avg=${average.toFixed(1)}`);
        }
        
        if (silenceAfterSpeechRef.current >= SILENCE_AFTER_SPEECH_FRAMES) {
          // Check minimum speech duration (at least 8 frames = ~0.4 seconds)
          const MIN_SPEECH_DURATION = 8;
          if (speechFramesRef.current >= MIN_SPEECH_DURATION) {
            console.log(`✅ SPEECH ENDED after ${silenceAfterSpeechRef.current} frames of silence (${speechFramesRef.current} speech frames)`);
            processingTypeRef.current = 'speech';
            stopRecording();
          } else {
            console.log(`⚠️ Speech too short (${speechFramesRef.current} frames), restarting listening...`);
            restartListening();
          }
          return;
        }
      } else {
        // No speech yet, just reset speech counter and continue listening
        silenceFramesRef.current++;
        speechFramesRef.current = 0;
        
        // Don't generate follow-up questions on silence - just keep listening
        // User will speak when ready
      }
    }

    // Continue detection
    animationFrameRef.current = requestAnimationFrame(detectAudio);
  };

  // Stop recording
  const stopRecording = () => {
    console.log('⏹️ Stop recording called, processingType:', processingTypeRef.current);

    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      console.log('✅ Animation frame cancelled');
    }

    // Stop media recorder
    if (mediaRecorderRef.current) {
      console.log('🎙️ MediaRecorder state:', mediaRecorderRef.current.state);
      if (mediaRecorderRef.current.state === 'recording') {
        console.log('⏹️ Stopping MediaRecorder...');
      mediaRecorderRef.current.stop();
      } else {
        console.warn('⚠️ MediaRecorder not in recording state:', mediaRecorderRef.current.state);
      }
    } else {
      console.warn('⚠️ No MediaRecorder reference');
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
      console.log('✅ AudioContext closed');
    }

    isActiveRef.current = false;
    setIsListening(false);
    console.log('✅ Stop recording complete');
  };

  // Handle user speech
  const handleSpeech = async (audioBlob: Blob) => {
    // Prevent concurrent processing
    if (isProcessing) {
      console.warn('⚠️ Already processing speech, skipping...');
      return;
    }

    try {
      console.log('🔊 Processing speech...');
      setIsProcessing(true);

      // Transcribe
      const transcription = await transcribeAudio(audioBlob);
      console.log('📝 Transcription:', transcription);

      if (!transcription || transcription.trim().length < 2) {
        console.warn('⚠️ Transcription too short');
        setIsProcessing(false);
        setIsSpeaking(false);
        resumeListening();
        return;
      }

      // Check for emoji or weird characters (Whisper hallucinations)
      const hasOnlyEmoji = /^[\p{Emoji}\s]+$/u.test(transcription.trim());
      // Allow common Unicode punctuation used in Russian: —, –, …, «, », №, etc.
      const hasWeirdChars = /[^\w\sа-яё\-.,!?;:()"«»—–…№\s]/gi.test(transcription.trim());

      if (hasOnlyEmoji || hasWeirdChars) {
        console.warn('⚠️ Transcription contains only emoji or weird characters:', transcription);
        setIsProcessing(false);
        setIsSpeaking(false);
        resumeListening();
        return;
      }
      
      // Add user message
      setMessages(prev => [...prev, {
        role: 'user',
        content: transcription,
        timestamp: new Date()
      }]);

      // Get LLM response
      console.log('📤 Getting LLM response for transcription:', transcription.substring(0, 100) + '...');
      const response = await getLLMResponse(transcription);
      console.log('🤖 LLM response received, length:', response ? response.length : 0);
      console.log('🤖 LLM response preview:', response ? response.substring(0, 200) + '...' : 'EMPTY');
      
      // Extract theses from response
      const theses = extractTheses(response);
      setSpeechTheses(theses);
      
      // Use full response for TTS (no sections to remove)
      let textForTTS = response.trim();
      
      // Add assistant message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);

      setIsProcessing(false);

      // Speak response (without theses)
      setIsSpeaking(true);
      await speakText(textForTTS);
      setIsSpeaking(false);

      // Add small delay after TTS to prevent audio context conflicts
      setTimeout(() => {
        resumeListening();
      }, 500);
      
    } catch (error) {
      console.error('❌ Handle speech error:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
      resumeListening();
    }
  };

  // Handle silence
  const handleSilence = async () => {
    try {
      console.log('🤫 Processing silence...');
      setIsProcessing(true);

      const message = "Есть вопросы? Я готова помочь!";
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: message,
        timestamp: new Date()
      }]);

      setIsProcessing(false);
      setIsSpeaking(true);
      await speakText(message);
      setIsSpeaking(false);

      // Add delay before restarting to prevent echo
      console.log('⏸️ Waiting 2 seconds before restart to prevent echo...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      restartListening();

    } catch (error) {
      console.error('❌ Handle silence error:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
      restartListening();
    }
  };

  // Resume listening after TTS with delay to prevent audio conflicts
  const resumeListening = async () => {
    if (isActiveRef.current) {
      console.log('⚠️ Already active, skipping resume');
      return;
    }

    try {
      console.log('⚡ Resuming listening after TTS...');

      // Reset detection state
      speechFramesRef.current = 0;
      silenceFramesRef.current = 0;
      silenceAfterSpeechRef.current = 0;
      speechDetectedRef.current = false;
      processingTypeRef.current = null;

      // Quick recalibration (0.5s) to adapt to current noise level
      isCalibrationDoneRef.current = false;
      calibrationSamplesRef.current = [];
      isQuickCalibrationRef.current = true;
      
      isActiveRef.current = true;
      setIsListening(true);
      setError(null);

      // Reuse existing stream or get new one
      let stream = audioStreamRef.current;
      if (!stream || !stream.active) {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        audioStreamRef.current = stream;
        console.log('✅ New microphone stream');
      } else {
        console.log('♻️ Reusing existing stream');
      }

      // Setup new MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const processingType = processingTypeRef.current;
        
        if (!processingType) {
          resumeListening();
          return;
        }

        if (audioChunksRef.current.length === 0) {
          resumeListening();
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioBlob.size < 5000) {
          resumeListening();
          return;
        }

        if (processingType === 'speech') {
          await handleSpeech(audioBlob);
        } else if (processingType === 'silence') {
          resumeListening();
        }
      };

      mediaRecorder.start();
      console.log('🎙️ Recording resumed');

      // Setup audio analysis - always create fresh context after TTS to avoid conflicts
      setupAudioAnalysis(stream);

    } catch (error) {
      console.error('❌ Resume listening error:', error);

      // Handle specific errors
      if (error.name === 'AbortError') {
        console.warn('⚠️ Audio operation was aborted, retrying in 1 second...');
        setTimeout(() => {
          if (isActiveRef.current) {
            resumeListening();
          }
        }, 1000);
        return;
      }

      setError('Ошибка доступа к микрофону');
      isActiveRef.current = false;
      setIsListening(false);
    }
  };

  // Restart listening (full reset with recalibration)
  const restartListening = () => {
    console.log('🔄 Restarting listening...');

    // Reset all detection state
    speechFramesRef.current = 0;
    silenceFramesRef.current = 0;
    silenceAfterSpeechRef.current = 0;
    speechDetectedRef.current = false;
    processingTypeRef.current = null;
    
    // Reset noise calibration (full calibration)
    isCalibrationDoneRef.current = false;
    calibrationSamplesRef.current = [];
    noiseFloorRef.current = 0;
    isQuickCalibrationRef.current = false; // Full calibration
    
    setTimeout(() => startListening(), 1500);
  };

  // Transcribe audio
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      // Determine language based on lesson context
      const lessonContext = lessonContextRef.current;
      let language = 'ru'; // Default to Russian

      if (lessonContext) {
        const title = lessonContext.title.toLowerCase();
        const description = lessonContext.description?.toLowerCase() || '';

        // Check if it's an English lesson
        if (title.includes('english') || title.includes('английский') ||
            title.includes('англ.') || description.includes('english')) {
          language = 'en';
          console.log('🌍 Detected English lesson, using language: en');
        } else if (title.includes('китайский') || title.includes('chinese')) {
          language = 'zh';
          console.log('🌍 Detected Chinese lesson, using language: zh');
        } else {
          console.log('🌍 Using default language: ru');
        }
      }

      formData.append('language', language);

      console.log('🎤 Sending transcription request to server...');

      const response = await fetch('/api/audio/transcriptions', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('❌ Transcription request failed:', response.status, errorText);
        throw new Error(`Transcription failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Transcription result:', result.text?.substring(0, 50) + '...');
      return result.text || '';
  };

  // Extract key theses from LLM response
  const extractTheses = (response: string): string[] => {
    const theses: string[] = [];

    // Extract theses from the main teacher response (before "Ключевые тезисы" section)
    // Split response at "Ключевые тезисы" to get only teacher explanations
    const teacherResponse = response.split(/Ключевые тезисы/i)[0].trim();

    if (!teacherResponse) {
      console.log('❌ No teacher response found before theses section');
      return theses;
    }

    console.log('📚 Extracting theses from teacher response, length:', teacherResponse.length);

    // Look for sentences that contain key concepts (sentences with important markers)
    const sentences = teacherResponse.split(/[.!?]+/).filter(s => s.trim().length > 10);

    // Extract meaningful sentences that likely contain key teachings
    const keyIndicators = [
      'общество', 'люди', 'связь', 'отношения', 'правила', 'ценности',
      'группа', 'коллектив', 'вместе', 'взаимодействие', 'цели',
      'толпа', 'собрание', 'объединение'
    ];

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length < 20 || trimmed.length > 120) continue;

      // Check if sentence contains key teaching concepts
      const hasKeyConcept = keyIndicators.some(indicator =>
        trimmed.toLowerCase().includes(indicator.toLowerCase())
      );

      if (hasKeyConcept && theses.length < 3) {
        // Clean up the sentence
        let cleanSentence = trimmed
          .replace(/^[*•-]\s*/, '') // Remove bullets
          .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove markdown bold
          .trim();

        if (cleanSentence && !theses.includes(cleanSentence)) {
          console.log('✅ Found teaching thesis:', cleanSentence);
          theses.push(cleanSentence);
        }
      }
    }

    // Fallback: if no key concepts found, extract first 2-3 meaningful sentences
    if (theses.length === 0) {
      console.log('⚠️ No key concepts found, extracting meaningful sentences...');
      for (const sentence of sentences.slice(0, 3)) {
        const trimmed = sentence.trim();
        if (trimmed.length >= 15 && trimmed.length <= 100) {
          let cleanSentence = trimmed
            .replace(/^[*•-]\s*/, '')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .trim();

          if (cleanSentence) {
            console.log('✅ Found fallback thesis:', cleanSentence);
            theses.push(cleanSentence);
          }
        }
      }
    }

    console.log('📌 Total teaching theses extracted:', theses.length);
    return theses.slice(0, 3); // Max 3 theses
  };

  // Get LLM response using GPT-5.1
  const getLLMResponse = async (userMessage: string): Promise<string> => {
    try {
      // Build lesson context if available (read from ref to avoid closure issues)
      const lessonContext = lessonContextRef.current;
      let lessonContextText = '';

      if (lessonContext) {
        lessonContextText = `

ТЕКУЩИЙ УРОК:
Название: "${lessonContext.title}"
Тема: ${lessonContext.topic}
Содержание урока: ${lessonContext.description}`;
      } else {
        console.warn('⚠️ No lesson context available');
      }

    // Always use Russian prompt for Julia, regardless of lesson type
    const systemPrompt = `Ты Юлия - профессиональный педагог с 20-летним стажем. Ведёшь урок по голосовой связи один-на-один.${lessonContextText}

ТВОЯ МЕТОДИКА:
1. Давай только ОДНО задание за раз. Не перегружай ученика.
2. Объясняй "на пальцах" - просто, понятно, с конкретными примерами из жизни.
3. Начинай с самого простого, постепенно усложняй.
4. После каждого ответа ученика - дай обратную связь (похвали или мягко поправь).
5. Задавай вопросы, чтобы проверить понимание.
6. Говори кратко (2-3 предложения) - это голосовой урок, не лекция.

ВАЖНЫЕ ПРАВИЛА:
- ВСЕ ЦИФРЫ ПИШИ СЛОВАМИ: вместо "1, 2, 3" пиши "один, два, три"
- Вместо "5 минут" пиши "пять минут"
- Вместо "10 слов" пиши "десять слов"
- Это голосовой урок - числа должны быть понятны при произнесении

СТРУКТУРА УРОКА:
- Если это первое сообщение: поприветствуй, скажи тему урока, дай ОДНО простое задание для разминки
- Далее: реагируй на ответы, хвали прогресс, давай следующее задание по порядку
- Если ученик не понял: объясни проще, приведи пример из жизни

История разговора:
${messages.map(m => `${m.role === 'user' ? 'Ученик' : 'Юлия'}: ${m.content}`).join('\n')}

Ученик: ${userMessage}

Ответь как Юлия (кратко, одно задание, на пальцах).

ФОРМАТИРУЙ ОТВЕТ С ПОМОЩЬЮ MARKDOWN:
- Используй ## для заголовков
- Используй **текст** для выделения важных понятий
- Используй нумерованные списки 1. 2. 3. для перечислений
- Используй - для маркированных списков`;

    console.log('📤 Sending to LLM with lesson context:', lessonContext ? 'YES' : 'NO');
    console.log('🌍 Julia always speaks Russian');
    if (lessonContext) {
      console.log('📖 Lesson:', lessonContext.title, '|', lessonContext.topic);
    }

    const response = await fetch('/api/responses', {
        method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        model: 'gpt-5.1',
        input: systemPrompt
        })
      });

      if (!response.ok) {
      throw new Error('LLM failed');
    }

      const result = await response.json();
      return result.output_text;
    } catch (error) {
      console.error('❌ Error in getLLMResponse:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      throw new Error('LLM failed');
    }
  };

  // Speak text
  const speakText = async (text: string): Promise<void> => {
    try {
      console.log('🔊 Speaking:', text.substring(0, 30) + '...');

      const response = await fetch('/api/audio/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: 'nova'
        })
      });

      if (!response.ok) {
        throw new Error('TTS failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return new Promise((resolve, reject) => {
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          console.log('✅ TTS complete');
          resolve();
        };

        audio.onerror = (error) => {
          console.error('❌ TTS playback error:', error);
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };

        // Try to play audio
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('🎵 TTS audio playing successfully');
              setAudioBlocked(false); // Audio works fine
            })
            .catch((playError) => {
              URL.revokeObjectURL(audioUrl);

              // Handle autoplay restrictions
              if (playError.name === 'NotAllowedError') {
                console.warn('⚠️ Autoplay blocked by browser. Switching to browser TTS...');
                setAudioBlocked(true); // Show indicator that audio is blocked

                // Fallback to browser TTS immediately
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'ru-RU';
                utterance.rate = 0.9; // Slightly slower for clarity
                utterance.pitch = 1.0;

                utterance.onend = () => {
                  console.log('✅ Browser TTS complete (fallback)');
                  resolve();
                };

                utterance.onerror = (error) => {
                  console.error('❌ Browser TTS error:', error);
                  resolve(); // Continue even if TTS fails
                };

                // Check if speech synthesis is available
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.speak(utterance);
                } else {
                  console.warn('⚠️ Speech synthesis not available');
                  resolve();
                }
              } else {
                console.error('❌ Unexpected play error:', playError);
                reject(playError);
              }
            });
        }
      });

    } catch (error) {
      console.error('❌ TTS error, using fallback:', error);

      // Fallback to browser TTS
      return new Promise((resolve) => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'ru-RU';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;

          utterance.onend = () => {
            console.log('✅ Browser TTS complete');
            resolve();
          };

          utterance.onerror = (error) => {
            console.error('❌ Browser TTS error:', error);
            resolve();
          };

          window.speechSynthesis.speak(utterance);
        } else {
          console.warn('⚠️ Speech synthesis not available');
          resolve();
        }
      });
    }
  };

  // Load lesson context from localStorage - ONCE at mount
  useEffect(() => {
    // Skip if already loaded
    if (lessonContextRef.current) {
      console.log('✅ Lesson context already loaded, skipping');
      return;
    }

    try {
      const storedLesson = localStorage.getItem('currentLesson');
      console.log('🔍 Checking localStorage for currentLesson...');
      
      if (storedLesson) {
        const lessonData = JSON.parse(storedLesson);
        const context = {
          title: lessonData.title || 'Урок',
          topic: lessonData.topic || '',
          description: lessonData.description || lessonData.aspects || lessonData.content || ''
        };
        
        lessonContextRef.current = context;
        console.log('📚 Lesson context loaded ONCE:');
        console.log('  Title:', context.title);
        console.log('  Topic:', context.topic);
        console.log('  Description:', context.description?.substring(0, 100) + '...');
      } else {
        console.warn('⚠️ No lesson context found in localStorage');
      }
    } catch (error) {
      console.error('❌ Error loading lesson context:', error);
    }
  }, []);

  // Mount effect
  useEffect(() => {
    console.log('🎓 VoiceCallPage mounted');
    startListening();

    return () => {
      console.log('🎓 VoiceCallPage unmounting');
      cleanup();
    };
  }, []);

  // Video control effect
  useEffect(() => {
    if (videoRef.current) {
      if (isSpeaking) {
        // TTS speaking - loop video
        videoRef.current.loop = true;
        videoRef.current.play().catch(console.error);
    } else {
        // Not speaking - pause at 00:00
        videoRef.current.loop = false;
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isSpeaking]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться назад
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Avatar */}
              <div className="text-center">
                <div className="relative inline-block">
                  <video
                    ref={videoRef}
                    className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                    muted
                    playsInline
                    autoPlay
                    loop
                  >
                    <source src="/Untitled Video.mp4" type="video/mp4" />
                    Ваш браузер не поддерживает видео элемент.
                  </video>

                  {/* Status overlay */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border">
                    {isListening && (
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Слушает</span>
                  </div>
                )}
                {isProcessing && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-sm font-medium">Обрабатывает</span>
                  </div>
                )}
                {isSpeaking && (
                      <div className="flex items-center gap-2 text-purple-600">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Говорит</span>
                      </div>
                    )}
                  </div>

                  {/* Audio blocked indicator */}
                  {audioBlocked && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 px-2 py-1 rounded-md shadow-sm">
                      <span className="text-xs text-yellow-800 flex items-center gap-1">
                        🔇 Автовоспроизведение заблокировано
                      </span>
                    </div>
                  )}
                </div>
              </div>


              {/* Control buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  onClick={toggleMute}
                  className="flex items-center gap-2"
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isMuted ? 'Включить микрофон' : 'Выключить микрофон'}
                </Button>
              </div>

              {/* Key Theses - Displayed between microphone button and end lesson button */}
              {speechTheses.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Ключевые тезисы урока
                  </h3>
                  <ol className="space-y-2">
                    {speechTheses.map((thesis, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="flex-1">{thesis}</span>
                      </li>
                    ))}
                  </ol>
                  <button
                    onClick={() => setSpeechTheses([])}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Скрыть
                  </button>
                </div>
              )}

              {/* End lesson button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={endLesson}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <PhoneOff className="w-4 h-4" />
                  Завершить урок
                </Button>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallPage;
