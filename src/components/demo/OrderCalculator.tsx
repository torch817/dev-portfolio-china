import React, { useState, useMemo } from 'react';
import { Calculator, Info, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { OrderChart } from './OrderChart';
import { PricingConfig, DeliveryTariffId } from '../../types';
import { deliveryTariffs, WOODEN_CRATE_PRICE_RUB } from '../../config/china-pricing';

export interface OrderCalculatorProps {
  cnyPrice: number;
  quantity: number;
  weightKg: number;
  config: PricingConfig;
  currentRate?: number;
  onRateChange?: (rate: number) => void;
  selectedTariffId?: DeliveryTariffId;
  onTariffChange?: (tariffId: DeliveryTariffId) => void;
  woodenCrate?: boolean;
  onWoodenCrateChange?: (checked: boolean) => void;
}

export const RATE_OPTIONS = [13.5, 13.8, 14.2] as const;

const COMPARISON_ROWS = [
  { param: 'Комиссия', us: '5%', compA: '8%', compB: '10%', usStyle: 'font-medium text-accent', compStyle: 'text-content-muted' },
  { param: 'Доставка (кг)', us: '480 ₽', compA: '520 ₽', compB: '550 ₽', usStyle: 'font-medium text-accent', compStyle: 'text-content-muted' },
  { param: 'Итого за пример', us: '6 272 ₽', compA: '7 184 ₽', compB: '7 890 ₽', isHighlight: true, usStyle: 'font-bold text-accent', compStyle: 'text-content-secondary' },
  { param: 'Экономия', us: '—', compA: '−912 ₽', compB: '−1 618 ₽', usStyle: 'text-content-muted', compStyle: 'font-medium text-accent' },
];

export const OrderCalculator: React.FC<OrderCalculatorProps> = ({
  cnyPrice,
  quantity,
  weightKg,
  config,
  currentRate,
  onRateChange,
  selectedTariffId,
  onTariffChange,
  woodenCrate,
  onWoodenCrateChange,
}) => {
  const [internalRate, setInternalRate] = useState<number>(currentRate ?? config.cnyToRubRate ?? 13.8);
  const [internalTariffId, setInternalTariffId] = useState<DeliveryTariffId>(selectedTariffId ?? 'express-auto');
  const [internalWoodenCrate, setInternalWoodenCrate] = useState<boolean>(woodenCrate ?? false);

  const exchangeRate = currentRate !== undefined ? currentRate : internalRate;
  const activeTariffId = selectedTariffId !== undefined ? selectedTariffId : internalTariffId;
  const activeWoodenCrate = woodenCrate !== undefined ? woodenCrate : internalWoodenCrate;

  const handleRateChange = (newRate: number) => {
    setInternalRate(newRate);
    onRateChange?.(newRate);
  };

  const handleTariffChange = (tariffId: DeliveryTariffId) => {
    setInternalTariffId(tariffId);
    onTariffChange?.(tariffId);
  };

  const handleWoodenCrateChange = (checked: boolean) => {
    setInternalWoodenCrate(checked);
    onWoodenCrateChange?.(checked);
  };

  const activeTariff = useMemo(() => {
    return deliveryTariffs.find((t) => t.id === activeTariffId) || deliveryTariffs[1];
  }, [activeTariffId]);

  const safePrice = Math.max(0, Number(cnyPrice) || 0);
  const safeQuantity = Math.max(0, Number(quantity) || 0);
  const safeWeight = Math.max(0, Number(weightKg) || 0);

  const { goodsCostRub, commissionRub, shippingRub, totalRub } = useMemo(() => {
    const goodsCost = Math.round(safePrice * safeQuantity * exchangeRate);
    const commission = Math.round(goodsCost * (config.commissionPercent / 100));
    const shipping = Math.round(safeWeight * activeTariff.ratePerKgRub) + (activeWoodenCrate ? WOODEN_CRATE_PRICE_RUB : 0);
    const total = goodsCost + commission + shipping;
    return {
      goodsCostRub: goodsCost,
      commissionRub: commission,
      shippingRub: shipping,
      totalRub: total,
    };
  }, [safePrice, safeQuantity, safeWeight, exchangeRate, config.commissionPercent, activeTariff.ratePerKgRub, activeWoodenCrate]);

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

      <div className="space-y-1.5">
        <span className="block text-xs font-medium text-content-secondary">
          Тариф доставки:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Тариф доставки">
          {deliveryTariffs.map((tariff) => {
            const isSelected = activeTariffId === tariff.id;
            return (
              <button
                key={tariff.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleTariffChange(tariff.id)}
                className={`p-2.5 rounded-md border text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus ${
                  isSelected
                    ? 'border-default bg-raised text-content-primary shadow-sm'
                    : 'border-default/60 bg-surface text-content-secondary hover:bg-hover hover:text-content-primary'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={isSelected ? 'font-semibold text-content-primary' : 'text-content-secondary'}>
                    {tariff.name}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </div>
                <div className="text-[11px] font-mono text-accent mt-0.5 font-medium">
                  {tariff.ratePerKgRub} ₽/кг
                </div>
                <div className="text-[10px] text-content-muted mt-0.5">
                  {tariff.days}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2.5 p-2.5 rounded-md bg-raised border border-default cursor-pointer hover:bg-hover transition-colors">
          <input
            type="checkbox"
            checked={activeWoodenCrate}
            onChange={(e) => handleWoodenCrateChange(e.target.checked)}
            className="w-4 h-4 rounded border-default text-accent bg-surface focus:ring-accent-focus focus:ring-offset-0 focus:outline-none"
          />
          <span className="text-xs text-content-primary select-none">
            Деревянная обрешётка груза (+{WOODEN_CRATE_PRICE_RUB} ₽)
          </span>
        </label>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-default/60">
          <span className="text-content-secondary">Стоимость партии ({safeQuantity} шт. × {safePrice} ¥):</span>
          <span className="font-mono text-content-primary font-medium">{goodsCostRub.toLocaleString('ru-RU')} ₽</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-default/60">
          <span className="text-content-secondary">Комиссия сервиса ({config.commissionPercent}%):</span>
          <span className="font-mono text-content-primary font-medium">{commissionRub.toLocaleString('ru-RU')} ₽</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-default/60">
          <span className="text-content-secondary">Доставка ({activeTariff.name}, {safeWeight} кг × {activeTariff.ratePerKgRub} ₽{activeWoodenCrate ? ` + обрешётка ${WOODEN_CRATE_PRICE_RUB} ₽` : ''}):</span>
          <span className="font-mono text-content-primary font-medium">{shippingRub.toLocaleString('ru-RU')} ₽</span>
        </div>

        <div className="flex justify-between items-baseline pt-2 text-sm">
          <span className="font-semibold text-content-primary">Итого себестоимость под ключ:</span>
          <span className="font-bold text-lg font-mono text-accent">{totalRub.toLocaleString('ru-RU')} ₽</span>
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
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.param} className={`hover:bg-hover/30 transition-colors ${row.isHighlight ? 'bg-accent/5' : ''}`}>
                  <td className={`py-2 px-3 ${row.isHighlight ? 'text-content-primary font-medium' : 'text-content-secondary'}`}>{row.param}</td>
                  <td className={`py-2 px-3 font-mono ${row.usStyle}`}>{row.us}</td>
                  <td className={`py-2 px-3 font-mono ${row.compStyle}`}>{row.compA}</td>
                  <td className={`py-2 px-3 font-mono ${row.compStyle}`}>{row.compB}</td>
                </tr>
              ))}
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
