import React from 'react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentView: 'home' | 'demo';
  setCurrentView?: (view: 'home' | 'demo') => void;
  onNavigate?: (to: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onNavigate }) => {
  const navigate = (to: string) => {
    if (onNavigate) {
      onNavigate(to);
    } else if (setCurrentView) {
      setCurrentView(to === '/demo' ? 'demo' : 'home');
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (currentView === 'demo') {
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-default bg-canvas/90 backdrop-blur-md">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-accent-focus rounded-md p-1 -ml-1 transition-colors"
          aria-label="На главную"
        >
          <div className="w-9 h-9 rounded-md bg-surface text-content-primary border border-default flex items-center justify-center font-bold text-sm shadow-sm group-hover:border-accent-border transition-colors">
            МС
          </div>
          <div>
            <div className="font-semibold text-sm text-content-primary group-hover:text-accent transition-colors leading-tight">
              Михаил Соболев
            </div>
            <div className="text-[11px] text-content-muted leading-tight">
              Веб-разработчик
            </div>
          </div>
        </button>

        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Основная навигация">
          {currentView === 'home' ? (
            <>
              <div className="hidden md:flex items-center gap-1">
                <a
                  href="#solution"
                  onClick={(e) => handleNavClick(e, '#solution')}
                  className="px-3 py-2 text-xs font-medium text-content-secondary hover:text-content-primary transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-accent-focus"
                >
                  Решение
                </a>
                <a
                  href="#stack"
                  onClick={(e) => handleNavClick(e, '#stack')}
                  className="px-3 py-2 text-xs font-medium text-content-secondary hover:text-content-primary transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-accent-focus"
                >
                  Стек
                </a>
                <a
                  href="#approach"
                  onClick={(e) => handleNavClick(e, '#approach')}
                  className="px-3 py-2 text-xs font-medium text-content-secondary hover:text-content-primary transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-accent-focus"
                >
                  О подходе
                </a>
                <a
                  href="#contacts"
                  onClick={(e) => handleNavClick(e, '#contacts')}
                  className="px-3 py-2 text-xs font-medium text-content-secondary hover:text-content-primary transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-accent-focus"
                >
                  Контакты
                </a>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/demo')}
                className="gap-2 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Демо: Китай</span>
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Главная</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
