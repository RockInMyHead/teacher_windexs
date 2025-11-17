import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Play,
  MessageCircle,
  Award,
  User,
  BookOpen,
  Target,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Heart,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-персонализация',
      description: 'Интеллектуальный анализ вашего уровня знаний и создание индивидуальной программы обучения'
    },
    {
      icon: MessageCircle,
      title: 'Интерактивные уроки',
      description: 'Общение с преподавателями в реальном времени, адаптивные задания и мгновенная обратная связь'
    },
    {
      icon: Target,
      title: 'Персонализированные цели',
      description: 'Установка достижимых целей и отслеживание прогресса с подробной аналитикой'
    },
    {
      icon: Award,
      title: 'Достижения и награды',
      description: 'Мотивационная система с ачивками, значками и рейтингами среди студентов'
    },
    {
      icon: BookOpen,
      title: 'Библиотека курсов',
      description: 'Более 1000 уроков по различным предметам: математика, языки, история, география и др.'
    },
    {
      icon: Clock,
      title: 'Гибкое расписание',
      description: 'Изучайте в удобное время, получайте напоминания и поддерживайте регулярность обучения'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Студентов' },
    { number: '95%', label: 'Успешность' },
    { number: '24/7', label: 'Поддержка' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Windexs-Учитель
              </h1>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Персонализированное обучение
              <br />
              <span className="text-primary">с искусственным интеллектом</span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Инновационная платформа для эффективного обучения. AI анализирует ваш уровень знаний,
              создает индивидуальную программу и помогает достичь целей быстрее традиционных методов.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 gap-3"
                onClick={() => navigate('/grade-selection')}
              >
                <Play className="w-5 h-5" />
                Начать обучение
                <ArrowRight className="w-5 h-5" />
              </Button>

              {user && (
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-2 hover:bg-primary/5 hover:text-black gap-3"
                  onClick={() => navigate('/courses')}
                >
                  <BookOpen className="w-5 h-5" />
                  Мои курсы
                </Button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center min-w-[120px]">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Почему выбирают Windexs-Учитель?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Наша платформа сочетает передовые технологии с проверенными методиками обучения
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Как это работает?
            </h3>
            <p className="text-lg text-muted-foreground">
              Простые шаги к эффективному обучению
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h4 className="text-xl font-semibold mb-3">Выберите предмет</h4>
              <p className="text-muted-foreground">
                Выберите интересующий вас предмет из нашей обширной библиотеки курсов
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h4 className="text-xl font-semibold mb-3">Пройдите тест</h4>
              <p className="text-muted-foreground">
                AI оценит ваш текущий уровень знаний и определит сильные и слабые стороны
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h4 className="text-xl font-semibold mb-3">Начните обучение</h4>
              <p className="text-muted-foreground">
                Получите персонализированную программу и начните эффективное обучение с AI-поддержкой
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wide">
                  Начните бесплатно
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Готовы изменить подход к обучению?
              </h3>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам студентов, которые уже улучшили свои результаты
                благодаря персонализированному подходу Windexs-Учителя
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 gap-3"
                  onClick={() => navigate('/available-courses')}
                >
                  <GraduationCap className="w-5 h-5" />
                  Выбрать курс
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
};

export default Index;
