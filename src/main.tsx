import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global TTS cleanup handlers
const stopAllTTS = () => {
  try {
    // Stop OpenAI TTS
    if (typeof window !== 'undefined' && (window as any).OpenAITTS?.stop) {
      (window as any).OpenAITTS.stop();
      console.log('🔇 Global TTS stopped via OpenAI TTS');
    }

    // Stop browser speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      console.log('🔇 Global TTS stopped via speech synthesis');
    }

    // Stop any audio elements
    if (typeof document !== 'undefined') {
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      console.log('🔇 Global audio elements stopped');
    }
  } catch (error) {
    console.error('❌ Error in global TTS cleanup:', error);
  }
};

// Add global event listeners for TTS cleanup
if (typeof window !== 'undefined') {
  // Stop TTS when page is about to unload (refresh, close, navigate away)
  window.addEventListener('beforeunload', () => {
    console.log('🧹 Page unloading - stopping all TTS globally');
    stopAllTTS();
  });

  // Stop TTS when page becomes hidden (user switches tabs)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('👁️ Page hidden - stopping TTS');
      stopAllTTS();
    }
  });

  // Stop TTS on any navigation or popstate events
  window.addEventListener('popstate', () => {
    console.log('🔙 Navigation detected - stopping TTS');
    stopAllTTS();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
