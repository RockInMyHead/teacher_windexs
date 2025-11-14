import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, MessageCircle, Award, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Левая часть - Логотип */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => navigate('/available-courses')}
            >
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm sm:text-lg font-semibold hidden sm:block">Windexs-Учитель</h1>
          </div>

          {/* Центральная часть - Навигация */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate('/available-courses')}
            >
              <BookOpen className="w-4 h-4" />
              Курсы
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate('/chat')}
            >
              <MessageCircle className="w-4 h-4" />
              Чат
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate('/achievements')}
            >
              <Award className="w-4 h-4" />
              Достижения
            </Button>
          </nav>

          {/* Мобильная навигация */}
          <nav className="md:hidden flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2"
              onClick={() => navigate('/available-courses')}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden xs:inline">Курсы</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2"
              onClick={() => navigate('/chat')}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Чат</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2"
              onClick={() => navigate('/achievements')}
            >
              <Award className="w-4 h-4" />
              <span className="hidden xs:inline">Достижения</span>
            </Button>
          </nav>

          {/* Правая часть - Личный кабинет */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs sm:text-sm font-medium">Добро пожаловать, {user?.name}!</p>
              {user?.knowledgeLevel && (
                <Badge variant="secondary" className="text-xs">
                  {user.knowledgeLevel === 'beginner' ? 'Начинающий' :
                   user.knowledgeLevel === 'intermediate' ? 'Средний' : 'Продвинутый'}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/personal-account')}
            >
              Аккаунт
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Выход
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

