import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CoursesPage from "./pages/CoursesPage";
import AvailableCourses from "./pages/AvailableCourses";
import CourseDetail from "./pages/CourseDetail";
import PersonalizedCoursePage from "./pages/PersonalizedCoursePage";
import Assessment from "./pages/Assessment";
import Chat from "./pages/Chat";
import Lesson from "./pages/Lesson";
import Achievements from "./pages/Achievements";
import PersonalAccount from "./pages/PersonalAccount";
import CustomAssessment from "./pages/CustomAssessment";
import DuolingoAssessment from "./pages/DuolingoAssessment";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

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
