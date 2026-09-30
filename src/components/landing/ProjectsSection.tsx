import React from 'react';
import { ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ProjectsSectionProps {
  onOpenDemo: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenDemo }) => {
  return (
    <section id="projects" className="py-12 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100">Проекты</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">Интерактивные решения и прототипы</p>
        </div>

        <div>
          {/* Featured China Sourcing Demo Card */}
          <Card className="border-zinc-700 bg-zinc-900/60 p-6 sm:p-8 hover:border-zinc-600 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Рабочее интерактивное демо
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-100">
                  Демо: сервис заказов из Китая (1688 / Taobao / Poizon)
                </h3>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  <strong className="text-zinc-100">Задача:</strong> автоматизировать приём заявок на выкуп товаров, калькуляцию себестоимости с учётом веса, комиссий сервиса и трекинг статусов грузов.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400 pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
                    <span>Форма с валидацией ссылок маркетплейсов</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
                    <span>Разбивка: курс ¥, комиссия, карго доставка</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
                    <span>Таблица заказов с бейджами статусов</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
                    <span>Serverless API уведомлений в Telegram</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Serverless', 'Telegram API'].map(tag => (
                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:w-64 shrink-0 flex flex-col justify-center">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={onOpenDemo}
                  className="w-full justify-center gap-2 group/btn"
                >
                  <span>Открыть демо</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
