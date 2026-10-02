import React from 'react';
import { ShoppingBag, Send, Code, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { BackgroundBeams } from '../ui/BackgroundBeams';

interface HeroSectionProps {
  onOpenDemo?: () => void;
  onNavigate?: (to: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDemo, onNavigate }) => {
  const handleOpenDemo = () => {
    if (onNavigate) {
      onNavigate('/demo');
    } else if (onOpenDemo) {
      onOpenDemo();
    }
  };

  return (
    <section className="relative py-14 lg:py-20 border-b border-default overflow-hidden">
      <BackgroundBeams className="pointer-events-none absolute inset-0 z-0" />
      <div className="relative z-10 max-w-[1120px] mx-auto px-5 sm:px-8">
        <div className="max-w-3xl space-y-6 text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-default bg-surface text-content-secondary text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-status shrink-0" />
            <span>Открыт к новым проектам и сотрудничеству</span>
          </div>

          {/* Identity & Headings */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-content-primary leading-[1.08]">
              Михаил Соболев
            </h1>
            <p className="text-lg sm:text-xl font-medium text-content-secondary leading-snug">
              Веб-разработчик: современные сайты и сервисы под ключ
            </p>
            <p className="text-sm sm:text-base text-content-muted leading-relaxed max-w-xl">
              Делаю быстрые, понятные сайты и веб-сервисы под задачу: от макета до готового запуска.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://t.me/whhwheqkkwk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Button variant="primary" size="lg" className="gap-2">
                <Send className="w-4 h-4" />
                <span>Написать в Telegram</span>
              </Button>
            </a>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleOpenDemo}
              className="gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Интерактивное демо</span>
            </Button>

            <a
              href="https://github.com/torch817"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub профиль torch817"
              className="inline-flex"
            >
              <Button variant="outline" size="lg" className="px-3.5">
                <Code className="w-4 h-4 text-content-muted" />
              </Button>
            </a>
          </div>

          {/* Small Proof Metric */}
          <div className="pt-4 flex items-center gap-6 text-xs text-content-muted">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>Современный стек: React & TypeScript</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Серверная разработка и деплой</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
