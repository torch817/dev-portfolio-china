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
    <Card className="bg-slate-50/90 dark:bg-slate-900/60 border-cyan-500/30 dark:border-cyan-500/20">
      <div className="flex items-center gap-2 mb-4 text-cyan-600 dark:text-cyan-400">
        <Calculator className="w-4 h-4" />
        <h4 className="text-xs font-semibold uppercase tracking-wider">
          Прозрачный расчёт стоимости
        </h4>
      </div>

      <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400">Стоимость товара:</span>
          <span className="font-mono">
            {safePrice} ¥ × {safeQuantity} шт. × {config.cnyToRubRate} ₽ = <strong className="text-slate-900 dark:text-slate-100">{goodsCostRub.toLocaleString('ru-RU')} ₽</strong>
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400">Комиссия выкупа ({config.commissionPercent}%):</span>
          <span className="font-mono text-slate-800 dark:text-slate-200">{commissionRub.toLocaleString('ru-RU')} ₽</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400">Доставка в РФ ({safeWeight} кг × {config.shippingPerKgRub} ₽):</span>
          <span className="font-mono text-slate-800 dark:text-slate-200">{shippingRub.toLocaleString('ru-RU')} ₽</span>
        </div>

        <div className="flex justify-between items-center pt-2 text-sm">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Итого под ключ:</span>
          <span className="font-bold text-lg text-cyan-600 dark:text-cyan-400 font-mono">
            {totalRub.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      <div className="mt-4 p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <span>Курс: 1 ¥ = {config.cnyToRubRate} ₽ | Карго-склад: Гуанчжоу/Иу. Включает базовую проверку на брак.</span>
      </div>
    </Card>
  );
};
