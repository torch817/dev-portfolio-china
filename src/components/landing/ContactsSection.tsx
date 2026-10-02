import React from 'react';
import { Send, Mail, Code, ArrowUpRight, MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ContactsSectionProps {
  className?: string;
}

export const ContactsSection: React.FC<ContactsSectionProps> = ({ className = '' }) => {
  const contactCards = [
    {
      title: 'Telegram',
      label: '@whhwheqkkwk',
      hint: 'Основной и самый оперативный канал связи',
      href: 'https://t.me/whhwheqkkwk',
      icon: Send,
    },
    {
      title: 'Email',
      label: 'ob0lev@yandex.ru',
      hint: 'Для ТЗ, документации и деловой переписки',
      href: 'mailto:ob0lev@yandex.ru',
      icon: Mail,
    },
    {
      title: 'GitHub',
      label: 'torch817',
      hint: 'Исходный код проектов, коммиты и архитектура',
      href: 'https://github.com/torch817',
      icon: Code,
    },
  ];

  return (
    <section id="contacts" className={`py-14 lg:py-20 border-b border-default bg-canvas ${className}`.trim()}>
      <div className="max-w-[1120px] mx-auto px-5 sm:px-8 space-y-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-accent font-mono mb-2">
            Связь напрямую
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            Контакты
          </h2>
          <p className="text-sm text-content-secondary mt-1 max-w-xl">
            Прямые каналы для обсуждения задач, оценки сроков и стоимости разработки
          </p>
        </div>

        {/* 3 Direct Channels Cards (without form) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {contactCards.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                className="group block focus:outline-none focus:ring-2 focus:ring-accent-focus rounded-lg"
              >
                <Card className="p-6 bg-surface border-default group-hover:border-accent-border transition-colors h-full flex flex-col justify-between shadow-card">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-md bg-raised border border-default text-accent group-hover:bg-hover transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-content-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <div>
                      <div className="text-xs text-content-muted font-medium">
                        {item.title}
                      </div>
                      <div className="text-base font-semibold text-content-primary mt-0.5 group-hover:text-accent transition-colors font-mono">
                        {item.label}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-content-secondary leading-relaxed pt-3 border-t border-default/60">
                    {item.hint}
                  </p>
                </Card>
              </a>
            );
          })}
        </div>

        {/* Final Telegram CTA Banner */}
        <div className="rounded-xl border border-default bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-card">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-accent">
              <MessageSquare className="w-4 h-4" />
              <span>Быстрый старт проекта</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-content-primary">
              Есть проект или задача по автоматизации заказов?
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
              Напишите в Telegram: отвечу в течение дня, обсудим требования и предложу оптимальный стек и сроки.
            </p>
          </div>

          <a
            href="https://t.me/whhwheqkkwk"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="lg"
              className="gap-2 w-full sm:w-auto justify-center"
            >
              <Send className="w-4 h-4" />
              <span>Написать в Telegram</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
