import React from 'react';
import { ShoppingBag, Code2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentView: 'home' | 'demo';
  setCurrentView: (view: 'home' | 'demo') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            МС
          </div>
          <div>
            <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">Михаил Соболев</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Web Developer</div>
          </div>
        </button>

        <nav className="flex items-center gap-2 sm:gap-3">
          {currentView === 'home' ? (
            <>
              <a 
                href="#projects" 
                className="hidden sm:inline-block px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
              >
                Проекты
              </a>
              <a 
                href="#skills" 
                className="hidden sm:inline-block px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
              >
                Стек
              </a>
              <a 
                href="#contacts" 
                className="hidden sm:inline-block px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
              >
                Контакты
              </a>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setCurrentView('demo')}
                className="gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Демо: Китай</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setCurrentView('home')}
              className="gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Главная</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
