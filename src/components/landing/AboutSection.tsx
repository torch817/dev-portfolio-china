import React from 'react';
import { Building2 } from 'lucide-react';
import { Card } from '../ui/Card';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-12 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100">Обо мне</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">Подход к разработке и специализация</p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex p-3 rounded-2xl bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
              <p>
                Занимаюсь разработкой B2B веб-сервисов, сайтов и личных кабинетов для приёма и обработки заказов. 
                Понимаю специфику e-commerce, оптовых закупок, интеграций с поставщиками и автоматизации бизнес-процессов.
              </p>
              <p>
                В работе ценю простоту архитектуры, высокую скорость интерфейсов и предсказуемость сроков. Довожу проекты от первого макета до боевого деплоя и настройки уведомлений.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-400">
                <div><span className="text-zinc-200 font-medium">Фокус:</span> B2B сервисы, e-commerce, кабинеты приёма заявок</div>
                <div><span className="text-zinc-200 font-medium">Формат:</span> Удалённо / Проектная разработка под ключ</div>
                <div><span className="text-zinc-200 font-medium">Связь:</span> Telegram (@whhwheqkkwk)</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
