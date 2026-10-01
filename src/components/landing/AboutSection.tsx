import React from 'react';
import { ShieldCheck, Cpu, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';

export const AboutSection: React.FC = () => {
  const principles = [
    {
      num: '01',
      title: 'Прагматичная B2B разработка',
      desc: 'Создаю веб-сервисы и сайты под конкретную бизнес-цель: прозрачный расчёт стоимости, простота для заказчика и предсказуемые сроки сдачи.',
      icon: ShieldCheck,
    },
    {
      num: '02',
      title: 'Автоматизация приёма заказов',
      desc: 'Встраиваю валидацию ссылок (1688, Taobao, Poizon), пересчёт валют по актуальному курсу и моментальную нотификацию менеджеров через Telegram Bot.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Архитектура и запуск под ключ',
      desc: 'Никаких брошенных макетов: сдаю готовый проект с Vercel-деплоем, настроенным доменом, чистым кодом и готовностью к масштабированию.',
      icon: CheckCircle,
    },
  ];

  return (
    <section id="approach" className="py-14 lg:py-20 border-b border-default bg-canvas scroll-mt-16">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-8 space-y-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-accent font-mono mb-2">
            Инженерные стандарты
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            О подходе к работе
          </h2>
          <p className="text-sm text-content-secondary mt-1 max-w-xl">
            Три ключевых принципа создания надёжных веб-сервисов и инструментов приёма заказов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.num}
                className="p-6 bg-surface border-default flex flex-col justify-between space-y-4 shadow-card"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded-sm bg-raised border border-default">
                      {item.num}
                    </span>
                    <div className="p-1.5 rounded-md bg-raised text-content-muted">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-semibold text-base text-content-primary leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-content-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 text-[11px] text-content-muted border-t border-default/60">
                  Гарантия надёжности и чистоты архитектуры
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
