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

  // Voice detection parameters
  const CALIBRATION_FRAMES = 30; // ~1.5 seconds to measure background noise (first time)
  const QUICK_CALIBRATION_FRAMES = 10; // ~0.5 seconds for quick recalibration after resume
  const REQUIRED_SPEECH_FRAMES = 8; // ~0.4 seconds of speech to mark as started (even faster response)
  const SILENCE_AFTER_SPEECH_FRAMES = 40; // ~2 seconds of silence after speech to stop
  const REQUIRED_SILENCE_FRAMES = 200; // ~10 seconds of total silence for follow-up (increased to avoid false triggers)
  
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
        
        // Set minimum noise floor to avoid zero threshold (lowered to 5 for very quiet environments)
        noiseFloorRef.current = Math.max(measuredNoiseFloor, 5);
        
        isCalibrationDoneRef.current = true;
        const calibType = isQuickCalibrationRef.current ? 'Quick' : 'Full';
        console.log(`🎚️ ${calibType} calibration: measured=${measuredNoiseFloor.toFixed(2)}, actual=${noiseFloorRef.current.toFixed(2)}, threshold=${(noiseFloorRef.current * 2.0).toFixed(2)}`);
      } else {
        // Still calibrating, continue
        animationFrameRef.current = requestAnimationFrame(detectAudio);
        return;
      }
    }
    
    // Dynamic speech threshold: noise floor * 1.4 (речь должна быть громче фона)
    const MIN_THRESHOLD = 15; // Минимальный абсолютный порог (lowered for very quiet speech)
    const dynamicThreshold = Math.max(noiseFloorRef.current * 1.4, MIN_THRESHOLD);
    
    // Periodic logging to debug detection issues (every 100 frames = ~5 seconds)
    if (speechFramesRef.current === 0 && silenceFramesRef.current % 100 === 0 && silenceFramesRef.current > 0) {
      console.log(`👂 Listening... avg=${average.toFixed(1)}, max=${max}, threshold=${dynamicThreshold.toFixed(1)} (speak louder if not detecting)`);
    }
    
    // После начала речи используем более низкий порог для детекции тишины
    const silenceThreshold = speechDetectedRef.current
      ? Math.max(noiseFloorRef.current * 1.2, 8) // Более низкий порог после речи (much lower)
      : dynamicThreshold; // Исходный порог для начала речи
    
    // Речь детектируется если:
    // 1. Средняя энергия превышает порог
    // 2. И есть ярко выраженный пик (max > avg * 1.3)
    const isSpeech = speechDetectedRef.current 
      ? average > silenceThreshold // После начала речи используем низкий порог
      : average > dynamicThreshold && max > average * 1.3; // Для начала речи строгие критерии
    
    if (isSpeech) {
      // Speech detected
      speechFramesRef.current++;
      silenceAfterSpeechRef.current = 0;

      // Mark that speech was detected
      if (speechFramesRef.current >= REQUIRED_SPEECH_FRAMES && !speechDetectedRef.current) {
        console.log(`🎤 SPEECH STARTED! avg=${average.toFixed(1)}, max=${max}, threshold=${dynamicThreshold.toFixed(1)}, silence_threshold=${silenceThreshold.toFixed(1)}`);
        speechDetectedRef.current = true;
      }
      
      // Log every 50 frames to monitor
      if (speechDetectedRef.current && speechFramesRef.current % 50 === 0) {
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
        
        if (silenceAfterSpeechRef.current % 20 === 0) {
          console.log(`🤫 Silence progress: ${silenceAfterSpeechRef.current}/${SILENCE_AFTER_SPEECH_FRAMES}, avg=${average.toFixed(1)}`);
        }
        
        if (silenceAfterSpeechRef.current >= SILENCE_AFTER_SPEECH_FRAMES) {
          console.log(`✅ SPEECH ENDED after ${silenceAfterSpeechRef.current} frames of silence`);
          processingTypeRef.current = 'speech';
          stopRecording();
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
      const hasWeirdChars = /[^\w\sа-яё\-.,!?;:()"\s]/gi.test(transcription.trim());

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
      const response = await getLLMResponse(transcription);
      console.log('🤖 LLM:', response);
      
      // Extract theses from response
      const theses = extractTheses(response);
      setSpeechTheses(theses);
      
      // Remove "Ключевые тезисы" section from TTS (remove everything after "Ключевые тезисы")
      let textForTTS = response.replace(/Ключевые тезисы[\s\S]*$/i, '').trim();
      
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

      // Resume listening immediately (no delay needed)
      resumeListening();
      
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

  // Resume listening immediately (without recalibration)
  const resumeListening = async () => {
    if (isActiveRef.current) {
      console.log('⚠️ Already active, skipping resume');
      return;
    }

    try {
      console.log('⚡ Resuming listening immediately...');
      
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

      // Setup audio analysis (reuse context if possible)
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        setupAudioAnalysis(stream);
      } else {
        // Reconnect analyser to stream
        const source = audioContextRef.current.createMediaStreamSource(stream);
        if (analyserRef.current) {
          source.connect(analyserRef.current);
        }
        console.log('♻️ Reusing AudioContext');
        
        // Start detection immediately
        detectAudio();
      }

    } catch (error) {
      console.error('❌ Resume listening error:', error);
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

      const response = await fetch('/api/audio/transcriptions', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
      throw new Error('Transcription failed');
    }

    const result = await response.json();
    return result.text || '';
  };

  // Extract key theses from LLM response
  const extractTheses = (response: string): string[] => {
    const theses: string[] = [];
    
    // Look for "Ключевые тезисы" section - capture until end of text
    const thesesMatch = response.match(/Ключевые тезисы[\s\S]*$/i);
    if (!thesesMatch) {
      console.log('❌ No "Ключевые тезисы" section found');
      return theses;
    }
    
    const thesesText = thesesMatch[0];
    console.log('📋 Theses section found, length:', thesesText.length);
    
    // Extract numbered items - support both digits (1., 2., 3.) and words (один., два., три.)
    const numberWords = ['один', 'два', 'три', 'четыре', 'пять', 'первый', 'второй', 'третий'];
    
    // Pattern for digit numbering: "1. Text" or "1) Text"
    const digitPattern = /(?:^|\n)\s*(\d+)[.\)]\s*([^\n]+)/g;
    
    // Pattern for word numbering: "один. Text" or "Первый. Text"
    const wordPattern = new RegExp(`(?:^|\\n)\\s*(${numberWords.join('|')})[.\\):]\\s*([^\\n]+)`, 'gi');
    
    let match;
    
    // Try digit pattern first
    while ((match = digitPattern.exec(thesesText)) !== null) {
      const cleanItem = match[2].trim();
      if (cleanItem && cleanItem.length > 0 && cleanItem.length < 150) {
        console.log('✅ Found digit thesis:', cleanItem);
        theses.push(cleanItem);
      }
    }
    
    // If no digit pattern found, try word pattern
    if (theses.length === 0) {
      console.log('⚠️ No digit theses found, trying word pattern...');
      while ((match = wordPattern.exec(thesesText)) !== null) {
        const cleanItem = match[2].trim();
        if (cleanItem && cleanItem.length > 0 && cleanItem.length < 150) {
          console.log('✅ Found word thesis:', cleanItem);
          theses.push(cleanItem);
        }
      }
    }
    
    console.log('📌 Total theses extracted:', theses.length);
    return theses.slice(0, 3); // Max 3 theses
  };

  // Get LLM response using GPT-5.1
  const getLLMResponse = async (userMessage: string): Promise<string> => {
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

В КОНЦЕ ОТВЕТА добавь раздел "Ключевые тезисы" с 2-3 короткими тезисами (каждый не более 15 слов), которые помогут ученику быстро уловить суть. Формат:
Ключевые тезисы
1. Первый тезис
2. Второй тезис
3. Третий тезис`;

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

        audio.play().catch((playError) => {
          // Handle autoplay restrictions
          if (playError.name === 'NotAllowedError') {
            console.warn('⚠️ Autoplay blocked by browser. User interaction required.');
            URL.revokeObjectURL(audioUrl);
            resolve(); // Continue without sound
          } else {
            reject(playError);
          }
        });
      });

    } catch (error) {
      console.error('❌ TTS error, using fallback:', error);

      // Fallback to browser TTS
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        utterance.onend = () => {
          console.log('✅ Browser TTS complete');
          resolve();
        };
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
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
                  >
                    <source src="/Untitled Video.mp4" type="video/mp4" />
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

                <Button
                  variant="outline"
                  onClick={endLesson}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <PhoneOff className="w-4 h-4" />
                  Завершить урок
                </Button>
              </div>

              {/* Key Theses */}
              {speechTheses.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm mt-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Ключевые тезисы
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
