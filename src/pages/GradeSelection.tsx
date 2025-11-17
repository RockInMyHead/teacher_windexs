import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeaderWithHero } from '@/components/Header';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';

const GradeSelection = () => {
  const navigate = useNavigate();

  const handleGradeSelect = (grade: number) => {
    if (grade === 11) {
      // 11 класс ведет на отдельную страницу с тестом
      navigate('/assessment-level?courseId=0&grade=11');
    } else {
      // Остальные классы ведут на выбор предмета
      navigate('/available-courses');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <HeaderWithHero />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>

          {/* Main Card */}
          <Card className="border-2 border-border/60 bg-card/80 backdrop-blur-xl shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Выберите класс для обучения
                </CardTitle>
              </div>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Выберите класс, в котором вы учитесь, чтобы мы подобрали подходящие материалы и уровень сложности
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((grade) => (
                  <Button
                    key={grade}
                    onClick={() => handleGradeSelect(grade)}
                    variant="outline"
                    className="h-16 text-lg font-medium border-2 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <BookOpen className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                      <span>{grade} класс</span>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Special note for 11th grade */}
              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 text-primary font-medium mb-2">
                  <GraduationCap className="w-5 h-5" />
                  11 класс
                </div>
                <p className="text-sm text-muted-foreground">
                  Для выпускников предусмотрена специальная диагностика уровня знаний перед началом обучения.
                  Вы будете перенаправлены на страницу тестирования.
                </p>
              </div>

              {/* Info section */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Что произойдет после выбора?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Для классов 1-10: переход к выбору предмета для изучения</li>
                  <li>• Для 11 класса: специальный тест для определения уровня подготовки</li>
                  <li>• На основе вашего выбора будут подобраны материалы соответствующего уровня</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GradeSelection;
