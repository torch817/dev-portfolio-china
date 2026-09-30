import React from 'react';
import { ShoppingBag, Globe, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ProjectsSectionProps {
  onOpenDemo: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenDemo }) => {
  return (
    <section id="projects" className="py-12 border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Проекты</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Примеры решений и текущий проект</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: China Sourcing Demo */}
          <Card className="flex flex-col justify-between border-cyan-500/30 bg-slate-50/80 dark:bg-slate-900/60 relative overflow-hidden group hover:border-cyan-500/60">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                  Рабочее демо
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Демо: сервис заказов из Китая
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                <strong className="text-slate-700 dark:text-slate-200">Задача:</strong> автоматизировать приём заявок на выкуп товаров (1688 / Taobao / Poizon), прозрачный расчёт стоимости с доставкой и статусы грузов.
              </p>

              <div className="space-y-1.5 mb-5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                  <span>Форма с валидацией ссылок и калькулятором</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                  <span>Разбивка: курс CNY, комиссия, карго доставка</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                  <span>Таблица заказов со статусами и трекингом</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['React', 'TypeScript', 'Tailwind CSS', 'Serverless', 'Telegram API'].map(tag => (
                  <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                    {tag}
                  </span>
                ))}
              </div>

              <Button 
                variant="primary" 
                size="sm" 
                onClick={onOpenDemo}
                className="w-full justify-between group/btn"
              >
                <span>Открыть интерактивное демо</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          {/* Card 2: This Portfolio */}
          <Card className="flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  Портфолио
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Этот сайт-визитка
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                <strong className="text-slate-700 dark:text-slate-200">Задача:</strong> создать быстрый, адаптивный сайт с чистой архитектурой и демонстрацией реальных компонентов для приёма заказов.
              </p>

              <div className="space-y-1.5 mb-5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>Тёмная и светлая тема без мерцания</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>Адаптивность под мобильные устройства</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>Форма обратной связи с Toast-нотификацией</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['React', 'Vite', 'TypeScript', 'Tailwind', 'Vercel'].map(tag => (
                  <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                    {tag}
                  </span>
                ))}
              </div>

              <a href="https://github.com/torch817" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>Репозиторий на GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
