import React from 'react';
import { ShoppingBag, Rocket, BellCheck } from 'lucide-react';
import { Card } from '../ui/Card';

export const ProofSection: React.FC = () => {
  const proofs = [
    {
      title: 'B2B и e-commerce',
      desc: 'Интерфейсы для оптовых заказов, выкупа с 1688, Taobao и Poizon, калькуляции себестоимости и учёта партий.',
      icon: ShoppingBag,
    },
    {
      title: 'От макета до запуска',
      desc: 'Полный инженерный цикл: адаптивная верстка, строгая типизация, валидация ссылок, Vercel-деплой и CI/CD.',
      icon: Rocket,
    },
    {
      title: 'Приём заказов и уведомления',
      desc: 'Мгновенная доставка заявок через Serverless API в Telegram Bot заказчика с сохранением истории заказов.',
      icon: BellCheck,
    },
  ];

  return (
    <section className="py-10 lg:py-14 border-b border-default bg-canvas">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {proofs.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="p-5 sm:p-6 bg-surface border-default flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-raised border border-default text-accent shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-content-primary">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
