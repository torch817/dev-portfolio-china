import React from 'react';
import { ArrowRight, ShoppingBag, Send, Code } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  onOpenDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDemo }) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center px-4">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Открыт к заказам и проектам
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight mb-4">
          Михаил Соболев
        </h1>

        {/* Role */}
        <p className="text-lg sm:text-xl font-medium text-cyan-600 dark:text-cyan-400 mb-4">
          Веб-разработчик: сайты и сервисы для приёма заказов
        </p>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
          Делаю быстрые, понятные сайты под задачу: от макета до запуска.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button 
            variant="primary" 
            size="lg"
            onClick={onOpenDemo}
            className="group"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Посмотреть демо</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <a href="https://t.me/whhwheqkkwk" target="_blank" rel="noreferrer">
            <Button variant="secondary" size="lg">
              <Send className="w-4 h-4 text-sky-400" />
              <span>Написать мне</span>
            </Button>
          </a>

          <a href="https://github.com/torch817" target="_blank" rel="noreferrer">
            <Button variant="outline" size="lg" className="p-3">
              <Code className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
