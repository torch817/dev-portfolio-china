import React from 'react';
import { Layout, Server, Rocket, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

interface SkillsSectionProps {
  className?: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ className = '' }) => {
  const stackGroups = [
    {
      title: 'Фронтенд',
      icon: Layout,
      skills: ['React 18', 'TypeScript', 'Tailwind CSS'],
      outcome: 'Адаптивные B2B интерфейсы, быстрые формы ввода, калькуляторы логистики и валидация данных.',
      items: ['Компонентная архитектура', 'Строгая типизация TS', 'Mobile-first адаптивность'],
    },
    {
      title: 'Бэкенд и данные',
      icon: Server,
      skills: ['Node.js', 'REST API', 'JSON / Telegram API'],
      outcome: 'Надёжная обработка заявок, микросервисы и серверные API, мгновенные пуш-уведомления заказчику.',
      items: ['Node.js & Serverless API', 'Интеграция Telegram Bot API', 'Серверная валидация данных'],
    },
    {
      title: 'Запуск и инфраструктура',
      icon: Rocket,
      skills: ['Linux / VPS', 'Docker & CI/CD', 'Nginx & SSL', 'Git'],
      outcome: 'Боевой деплой на продакшен-серверы, контейнеризация, настройка доменов, HTTPS/SSL, автоматизация релизов и мониторинг.',
      items: ['Автоматический CI/CD пайплайн', 'Контроль размера бандла', 'Настройка Nginx и SSL'],
    },
  ];

  return (
    <section id="stack" className={`py-14 lg:py-20 border-b border-default bg-canvas ${className}`.trim()}>
      <div className="max-w-[1120px] mx-auto px-5 sm:px-8 space-y-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-accent font-mono mb-2">
            Технологический стек
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            Стек и компетенции
          </h2>
          <p className="text-sm text-content-secondary mt-1 max-w-xl">
            Стек инструментов, ориентированный на надёжность, скорость разработки и решение бизнес-задач
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stackGroups.map((group) => {
            const Icon = group.icon;
            return (
              <Card
                key={group.title}
                className="p-6 bg-surface border-default flex flex-col justify-between space-y-6 shadow-card"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-raised border border-default text-accent">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-base text-content-primary">
                      {group.title}
                    </h3>
                  </div>

                  <p className="text-xs text-content-secondary leading-relaxed">
                    {group.outcome}
                  </p>

                  <div className="space-y-1.5 pt-1 text-xs text-content-muted">
                    {group.items.map((it) => (
                      <div key={it} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-default/60">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-mono font-medium px-2.5 py-1 rounded-sm bg-raised text-content-primary border border-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
