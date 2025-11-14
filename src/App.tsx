import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CoursesPage from "./pages/CoursesPage";
import AvailableCourses from "./pages/AvailableCourses";
import CourseDetail from "./pages/CourseDetail";
import PersonalizedCoursePage from "./pages/PersonalizedCoursePage";
import Assessment from "./pages/Assessment";
import Chat from "./pages/Chat";
import Lesson from "./pages/Lesson";
import LessonComplete from "./pages/LessonComplete";
import Achievements from "./pages/Achievements";
import PersonalAccount from "./pages/PersonalAccount";
import CustomAssessment from "./pages/CustomAssessment";
import DuolingoAssessment from "./pages/DuolingoAssessment";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Component to handle TTS cleanup on navigation
const TTSNavigationHandler = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('🧭 Navigation detected:', location.pathname);

    // Stop all TTS when navigating to any page
    const stopAllTTS = () => {
      try {
        // Stop OpenAI TTS
        if (typeof window !== 'undefined' && (window as any).OpenAITTS?.stop) {
          (window as any).OpenAITTS.stop();
          console.log('🔇 TTS stopped via OpenAI TTS on navigation');
        }

        // Stop browser speech synthesis
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          console.log('🔇 TTS stopped via speech synthesis on navigation');
        }

        // Stop any audio elements
        if (typeof document !== 'undefined') {
          const audioElements = document.querySelectorAll('audio');
          audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
          });
          console.log('🔇 All audio elements stopped on navigation');
        }
      } catch (error) {
        console.error('❌ Error stopping TTS on navigation:', error);
      }
    };

    // Small delay to ensure cleanup happens after any new TTS might start
    const timeoutId = setTimeout(stopAllTTS, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <TTSNavigationHandler />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/available-courses" element={<AvailableCourses />} />
                <Route path="/course/:id" element={<CourseDetail />} />
                <Route path="/personalized-course" element={<PersonalizedCoursePage />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/lesson/:courseId/:moduleId/:lessonId" element={<Lesson />} />
                <Route path="/lesson-complete/:courseId/:moduleId/:lessonId" element={<LessonComplete />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/account" element={<PersonalAccount />} />
                <Route path="/custom-assessment" element={<CustomAssessment />} />
                <Route path="/duolingo-assessment" element={<DuolingoAssessment />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
