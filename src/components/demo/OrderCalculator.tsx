import React from 'react';
import { Calculator, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { PricingConfig } from '../../types';

interface OrderCalculatorProps {
  cnyPrice: number;
  quantity: number;
  weightKg: number;
  config: PricingConfig;
}

export const OrderCalculator: React.FC<OrderCalculatorProps> = ({
  cnyPrice,
  quantity,
  weightKg,
  config,
}) => {
  const safePrice = Math.max(0, Number(cnyPrice) || 0);
  const safeQuantity = Math.max(0, Number(quantity) || 0);
  const safeWeight = Math.max(0, Number(weightKg) || 0);

  const goodsCostRub = Math.round(safePrice * safeQuantity * config.cnyToRubRate);
  const commissionRub = Math.round(goodsCostRub * (config.commissionPercent / 100));
  const shippingRub = Math.round(safeWeight * config.shippingPerKgRub);
  const totalRub = goodsCostRub + commissionRub + shippingRub;

  return (
    <Card className="bg-surface border-default p-5 sm:p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-default">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-raised border border-default text-accent">
            <Calculator className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-content-primary">
            Прозрачный расчёт себестоимости
          </h4>
        </div>
        <span className="text-[11px] font-mono text-content-muted">
          1 ¥ = {config.cnyToRubRate} ₽
        </span>
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

      <div className="p-3 rounded-md bg-raised border border-default text-[11px] text-content-muted flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
        <span>
          Формула без скрытых комиссий и навязанных страховок. Доставка авто-карго со склада в Гуанчжоу / Иу до Москвы.
        </span>
      </div>
    </Card>
  );
};
