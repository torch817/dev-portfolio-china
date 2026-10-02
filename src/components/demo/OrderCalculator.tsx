import React, { useState, useMemo } from 'react';
import { Calculator, Info, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { OrderChart } from './OrderChart';
import { PricingConfig } from '../../types';

export interface OrderCalculatorProps {
  cnyPrice: number;
  quantity: number;
  weightKg: number;
  config: PricingConfig;
  onRateChange?: (rate: number) => void;
}

export const RATE_OPTIONS = [13.5, 13.8, 14.2] as const;

export const OrderCalculator: React.FC<OrderCalculatorProps> = ({
  cnyPrice,
  quantity,
  weightKg,
  config,
  onRateChange,
}) => {
  const [exchangeRate, setExchangeRate] = useState<number>(config.cnyToRubRate || 13.8);

  const handleRateChange = (newRate: number) => {
    setExchangeRate(newRate);
    onRateChange?.(newRate);
  };

  const safePrice = Math.max(0, Number(cnyPrice) || 0);
  const safeQuantity = Math.max(0, Number(quantity) || 0);
  const safeWeight = Math.max(0, Number(weightKg) || 0);

  const { goodsCostRub, commissionRub, shippingRub, totalRub } = useMemo(() => {
    const goodsCost = Math.round(safePrice * safeQuantity * exchangeRate);
    const commission = Math.round(goodsCost * (config.commissionPercent / 100));
    const shipping = Math.round(safeWeight * config.shippingPerKgRub);
    const total = goodsCost + commission + shipping;
    return {
      goodsCostRub: goodsCost,
      commissionRub: commission,
      shippingRub: shipping,
      totalRub: total,
    };
  }, [safePrice, safeQuantity, safeWeight, exchangeRate, config.commissionPercent, config.shippingPerKgRub]);

  return (
    <Card className="bg-surface border-default p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-raised border border-default text-accent">
            <Calculator className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-content-primary">
            Прозрачный расчёт себестоимости
          </h4>
        </div>

        <div
          className="flex items-center gap-1 bg-raised p-1 rounded-md border border-default self-start sm:self-auto"
          role="group"
          aria-label="Выбор курса юаня"
        >
          <span className="text-[11px] font-mono text-content-muted px-1 hidden xs:inline">
            Курс:
          </span>
          {RATE_OPTIONS.map((rate) => {
            const isActive = exchangeRate === rate;
            return (
              <button
                key={rate}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleRateChange(rate)}
                className={`px-2 py-0.5 text-xs font-mono rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-focus ${
                  isActive
                    ? 'bg-accent text-white font-semibold shadow-sm'
                    : 'text-content-secondary hover:text-content-primary hover:bg-hover'
                }`}
              >
                {rate} ₽
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-default/60">
          <span className="text-content-secondary">
            Стоимость партии ({safeQuantity} шт. × {safePrice} ¥):
          </span>
          <span className="font-mono text-content-primary font-medium">
            {goodsCostRub.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-default/60">
          <span className="text-content-secondary">
            Комиссия сервиса ({config.commissionPercent}%):
          </span>
          <span className="font-mono text-content-primary font-medium">
            {commissionRub.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-default/60">
          <span className="text-content-secondary">
            Карго доставка ({safeWeight} кг × {config.shippingPerKgRub} ₽):
          </span>
          <span className="font-mono text-content-primary font-medium">
            {shippingRub.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        <div className="flex justify-between items-baseline pt-2 text-sm">
          <span className="font-semibold text-content-primary">
            Итого себестоимость под ключ:
          </span>
          <span className="font-bold text-lg font-mono text-accent">
            {totalRub.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      <OrderChart
        goodsCostRub={goodsCostRub}
        commissionRub={commissionRub}
        shippingRub={shippingRub}
        totalRub={totalRub}
      />

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-semibold text-content-primary">
            Сравнение условий с рынком
          </h5>
          <span className="text-[11px] font-mono text-content-muted">
            Пример: 35 ¥ × 10 шт., 2.5 кг
          </span>
        </div>

        <div className="overflow-x-auto rounded-md border border-default bg-surface">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-default bg-raised/50 text-[11px] text-content-muted">
                <th scope="col" className="py-2.5 px-3 font-medium">Параметр</th>
                <th scope="col" className="py-2.5 px-3 font-semibold text-accent">Мы</th>
                <th scope="col" className="py-2.5 px-3 font-medium text-content-secondary">Конкурент A</th>
                <th scope="col" className="py-2.5 px-3 font-medium text-content-secondary">Конкурент B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default/40">
              <tr className="hover:bg-hover/30 transition-colors">
                <td className="py-2 px-3 text-content-secondary">Комиссия</td>
                <td className="py-2 px-3 font-mono font-medium text-accent">5%</td>
                <td className="py-2 px-3 font-mono text-content-muted">8%</td>
                <td className="py-2 px-3 font-mono text-content-muted">10%</td>
              </tr>
              <tr className="hover:bg-hover/30 transition-colors">
                <td className="py-2 px-3 text-content-secondary">Доставка (кг)</td>
                <td className="py-2 px-3 font-mono font-medium text-accent">480 ₽</td>
                <td className="py-2 px-3 font-mono text-content-muted">520 ₽</td>
                <td className="py-2 px-3 font-mono text-content-muted">550 ₽</td>
              </tr>
              <tr className="hover:bg-hover/30 transition-colors bg-accent/5">
                <td className="py-2 px-3 text-content-primary font-medium">Итого за пример</td>
                <td className="py-2 px-3 font-mono font-bold text-accent">6 272 ₽</td>
                <td className="py-2 px-3 font-mono text-content-secondary">7 184 ₽</td>
                <td className="py-2 px-3 font-mono text-content-secondary">7 890 ₽</td>
              </tr>
              <tr className="hover:bg-hover/30 transition-colors">
                <td className="py-2 px-3 text-content-secondary">Экономия</td>
                <td className="py-2 px-3 font-mono text-content-muted">—</td>
                <td className="py-2 px-3 font-mono font-medium text-accent">−912 ₽</td>
                <td className="py-2 px-3 font-mono font-medium text-accent">−1 618 ₽</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-3 rounded-md bg-raised border border-default text-xs text-content-secondary flex items-start gap-2.5">
        <TrendingUp className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <span className="text-content-primary font-medium">
            Ориентир розницы на маркетплейсах РФ: ~12 000 ₽.
          </span>{' '}
          <span className="text-accent font-semibold">
            Ваша чистая выгода: ~5 728 ₽ (48%).
          </span>
        </div>
      </div>

      <div className="p-3 rounded-md bg-raised border border-default text-[11px] text-content-muted flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
        <span>
          Формула без скрытых комиссий и навязанных страховок. Доставка авто-карго со склада в Гуанчжоу / Иу до Москвы.
        </span>
      </div>
    </Card>
  );
};
