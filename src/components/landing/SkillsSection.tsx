import React from 'react';
import { Layout, Server, Rocket } from 'lucide-react';
import { Card } from '../ui/Card';

export const SkillsSection: React.FC = () => {
  const skillGroups = [
    {
      title: 'Фронтенд',
      icon: Layout,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      desc: 'Адаптивные интерфейсы, PWA, интерактивные формы, калькуляторы и таблицы данных'
    },
    {
      title: 'Бэкенд и данные',
      icon: Server,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      skills: ['Node/serverless', 'REST API', 'PostgreSQL / JSON'],
      desc: 'Обработка заказов, серверлесс-функции, отправка уведомлений в Telegram, интеграции'
    },
    {
      title: 'Запуск',
      icon: Rocket,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      skills: ['Vercel', 'Git', 'CI/CD'],
      desc: 'Развёртывание проектов, настройка доменов, HTTPS, переменных окружения и мониторинг'
    }
  ];

  return (
    <section id="skills" className="py-12 border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Навыки</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Технологический стек под задачи бизнеса</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map((group) => {
            const Icon = group.icon;
            return (
              <Card key={group.title} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl border ${group.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">{group.title}</h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {group.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/60">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60"
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
