import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AIProcess from "@/components/AIProcess";
import LearningSteps from "@/components/LearningSteps";
import Courses from "@/components/Courses";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <AIProcess />
      <LearningSteps />
      <Courses />
      <CTA />
    </div>
  );
};

export default Index;
