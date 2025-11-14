import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, MessageCircle, Award, User, Languages, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Personalized Course */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Course info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Languages className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold">Русский язык</h2>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="secondary" className="text-base px-3 py-1">5</Badge>
                    <span className="text-muted-foreground">Персонализированное обучение для носителей</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Персональный</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Индивидуально</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Адаптивно</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>5 студентов</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Бесплатно
                    </Badge>
                  </div>
                </div>

                {/* Right side - CTA */}
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Готовы начать обучение?</h3>
                    <p className="text-muted-foreground">
                      Начните персонализированное обучение с AI-учителем, который адаптируется под ваш уровень и цели
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => navigate('/chat')}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Чат с AI-учителем
                    </Button>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 justify-center p-3 bg-card rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Гибкое расписание</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center p-3 bg-card rounded-lg">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>Персонализация</span>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/available-courses')}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Начать обучение
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Online Lesson CTA */}
        <div className="md:hidden">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Online-урок</h3>
              <p className="text-muted-foreground mb-4">Адаптивный для мобильной версии</p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/chat')}
              >
                <Play className="w-4 h-4 mr-2" />
                Начать онлайн урок
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
