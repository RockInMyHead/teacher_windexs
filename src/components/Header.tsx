import { Button } from "@/components/ui/button";
import { Brain, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold hidden sm:inline">Windexs-Учитель</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => handleNavigate('/courses')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Курсы
                </button>
                <button
                  onClick={() => handleNavigate('/personal-account')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Аккаунт
                </button>
              </>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-sm">
                  <p className="font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Авторизован</p>
                </div>
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
            )}

            {!isAuthenticated && (
              <Button
                onClick={() => navigate('/auth')}
                size="sm"
              >
                Войти
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-border/30 pt-4">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => handleNavigate('/courses')}
                  className="block w-full text-left py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Курсы
                </button>
                <button
                  onClick={() => handleNavigate('/personal-account')}
                  className="block w-full text-left py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Аккаунт
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-muted-foreground hover:text-primary transition-colors gap-2 flex items-center"
                >
                  <LogOut className="w-4 h-4" />
                  Выход
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

