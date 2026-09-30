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
    <Card className="bg-zinc-50/90 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-zinc-100">
        <Calculator className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
        <h4 className="text-xs font-semibold uppercase tracking-wider">
          Прозрачный расчёт стоимости
        </h4>
      </div>

      <div className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
        <div className="flex justify-between items-center py-1 border-b border-zinc-200 dark:border-zinc-800/60">
          <span className="text-zinc-500 dark:text-zinc-400">Стоимость товара:</span>
          <span className="font-mono">
            {safePrice} ¥ × {safeQuantity} шт. × {config.cnyToRubRate} ₽ = <strong className="text-zinc-900 dark:text-zinc-100">{goodsCostRub.toLocaleString('ru-RU')} ₽</strong>
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-zinc-200 dark:border-zinc-800/60">
          <span className="text-zinc-500 dark:text-zinc-400">Комиссия выкупа ({config.commissionPercent}%):</span>
          <span className="font-mono text-zinc-800 dark:text-zinc-200">{commissionRub.toLocaleString('ru-RU')} ₽</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-zinc-200 dark:border-zinc-800/60">
          <span className="text-zinc-500 dark:text-zinc-400">Доставка в РФ ({safeWeight} кг × {config.shippingPerKgRub} ₽):</span>
          <span className="font-mono text-zinc-800 dark:text-zinc-200">{shippingRub.toLocaleString('ru-RU')} ₽</span>
        </div>

        <div className="flex justify-between items-center pt-2 text-sm">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Итого под ключ:</span>
          <span className="font-bold text-lg text-zinc-900 dark:text-zinc-50 font-mono">
            {totalRub.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      <div className="mt-4 p-2.5 rounded-xl bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
        <span>Курс: 1 ¥ = {config.cnyToRubRate} ₽ | Карго-склад: Гуанчжоу/Иу. Включает базовую проверку на брак.</span>
      </div>
    </Card>
  );
};
