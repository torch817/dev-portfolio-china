import React from 'react';
import { UserCheck } from 'lucide-react';
import { Card } from '../ui/Card';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-12 border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Обо мне</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Кратко о подходе к разработке</p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                Занимаюсь веб-разработкой: создаю сайты, сервисы и личные кабинеты для приёма и обработки заказов. 
                В работе ценю простоту решений, чистый код и предсказуемые сроки.
              </p>
              <p>
                Сфокусирован на создании быстрых интерфейсов с понятным пользовательским опытом. Довожу проекты от первого наброска структуры до деплоя на продакшен-сервер и передачи инструкций.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
                <div><span className="text-slate-800 dark:text-slate-200 font-medium">Формат:</span> Удалённо / Проектная работа</div>
                <div><span className="text-slate-800 dark:text-slate-200 font-medium">Языки:</span> Русский, Английский (технический)</div>
                <div><span className="text-slate-800 dark:text-slate-200 font-medium">Связь:</span> Telegram (@whhwheqkkwk)</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
