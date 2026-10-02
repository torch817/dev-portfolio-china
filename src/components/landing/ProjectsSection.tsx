import React from 'react';
import { ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ProjectsSectionProps {
  onOpenDemo?: () => void;
  onNavigate?: (to: string) => void;
  className?: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenDemo, onNavigate, className = '' }) => {
  const handleOpenDemo = () => {
    if (onNavigate) {
      onNavigate('/demo');
    } else if (onOpenDemo) {
      onOpenDemo();
    }
  };

  const flowSteps = [
    { num: '01', title: 'Ссылка', text: 'Валидация форматов 1688, Taobao и Poizon' },
    { num: '02', title: 'Калькуляция', text: 'Курс 13.8 ₽, 5% сбор, карго 480 ₽/кг' },
    { num: '03', title: 'Telegram', text: 'Мгновенный пуш заявки через Serverless API' },
    { num: '04', title: 'Статусы', text: 'Таблица трекинга от склада до выдачи в РФ' },
  ];

  const stackTags = [
    'React 18',
    'TypeScript 5.7',
    'Tailwind CSS 3.4',
    'Vite 6',
    'Serverless API',
    'Telegram Bot',
  ];

  return (
    <section id="solution" className={`py-14 lg:py-20 border-b border-default bg-canvas ${className}`.trim()}>
      <div className="max-w-[1120px] mx-auto px-5 sm:px-8 space-y-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-accent font-mono mb-2">
            Кейс / Интерактивное решение
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            Решение для B2B заказов
          </h2>
          <p className="text-sm text-content-secondary mt-1 max-w-xl">
            Полноценный прототип системы приёма, расчёта и нотификации заказов
          </p>
        </div>

        {/* Wide Featured Solution Card */}
        <Card className="p-6 sm:p-8 bg-surface border-default shadow-card">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-raised border border-default text-accent">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-sm bg-raised text-content-secondary border border-default">
                  Live интерактивное демо
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-content-primary leading-snug">
                Демо: сервис заказов из Китая (1688 / Taobao / Poizon)
              </h3>

              <p className="text-sm text-content-secondary leading-relaxed">
                <strong className="text-content-primary">Задача:</strong> автоматизировать приём заявок на выкуп товаров, калькуляцию себестоимости с учётом веса, комиссий сервиса и трекинг статусов грузов.
              </p>

              {/* 4-step Flow */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-content-muted">
                  Процесс обработки заявки (Flow)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {flowSteps.map((step) => (
                    <div
                      key={step.num}
                      className="p-3 rounded-md bg-raised border border-default flex items-start gap-3"
                    >
                      <span className="font-mono text-xs text-accent font-bold mt-0.5">
                        {step.num}
                      </span>
                      <div className="text-xs">
                        <div className="font-semibold text-content-primary">
                          {step.title}
                        </div>
                        <div className="text-content-muted mt-0.5 leading-snug">
                          {step.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features bullet checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-content-secondary pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Валидация ссылок 1688 / Taobao / Poizon</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Прозрачный расчёт без скрытых страховок</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Таблица заказов с трек-номерами</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Serverless эндпоинт отправки в Telegram</span>
                </div>
              </div>

              {/* Stack tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {stackTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono font-medium px-2.5 py-1 rounded-sm bg-raised text-content-secondary border border-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA action column */}
            <div className="lg:w-72 shrink-0 flex flex-col justify-center space-y-3 pt-2 lg:pt-0">
              <div className="p-4 rounded-md border border-default bg-raised text-xs space-y-2 text-content-secondary">
                <div className="font-semibold text-content-primary">
                  Готовое решение
                </div>
                <p className="text-[11px] text-content-muted leading-relaxed">
                  Попробуйте ввод ссылки, калькулятор партий и тестовую отправку заказа вживую.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleOpenDemo}
                className="w-full justify-center gap-2 group/btn"
              >
                <span>Открыть демо</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
