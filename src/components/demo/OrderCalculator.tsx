import React, { useState, useMemo } from 'react';
import { Calculator, Info, TrendingUp, Send, Copy, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { OrderChart } from './OrderChart';
import { PricingConfig, DeliveryTariffId } from '../../types';
import { deliveryTariffs, WOODEN_CRATE_PRICE_RUB } from '../../config/china-pricing';
import { calculateCompetitorPrices } from '../../utils/pricing';
import { buildTelegramOrderLink, TelegramOrderQuote } from '../../utils/telegram';
import { useToast } from '../../context/ToastContext';

export interface OrderCalculatorProps {
  cnyPrice: number;
  quantity: number;
  weightKg: number;
  config: PricingConfig;
  currentRate?: number;
  isLiveRate?: boolean;
  rateSource?: string;
  onRateChange?: (rate: number) => void;
  selectedTariffId?: DeliveryTariffId;
  onTariffChange?: (tariffId: DeliveryTariffId) => void;
  woodenCrate?: boolean;
  onWoodenCrateChange?: (checked: boolean) => void;
  itemUrl?: string;
  title?: string;
  comment?: string;
  onDirectOrder?: () => void;
  onCopyQuote?: () => void;
}

export const RATE_OPTIONS = [13.5, 13.8, 14.2] as const;

export const OrderCalculator: React.FC<OrderCalculatorProps> = ({
  cnyPrice,
  quantity,
  weightKg,
  config,
  currentRate,
  isLiveRate = false,
  selectedTariffId,
  onTariffChange,
  woodenCrate,
  onWoodenCrateChange,
  itemUrl = '',
  title = '',
  comment = '',
  onDirectOrder,
  onCopyQuote,
}) => {
  const { showToast } = useToast();
  const [internalTariffId, setInternalTariffId] = useState<DeliveryTariffId>(selectedTariffId ?? 'express-auto');
  const [internalWoodenCrate, setInternalWoodenCrate] = useState<boolean>(woodenCrate ?? false);
  const [copied, setCopied] = useState<boolean>(false);

  const exchangeRate = currentRate ?? config.cnyToRubRate ?? 13.8;
  const activeTariffId = selectedTariffId !== undefined ? selectedTariffId : internalTariffId;
  const activeWoodenCrate = woodenCrate !== undefined ? woodenCrate : internalWoodenCrate;

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

  const competitorPrices = useMemo(() => {
    return calculateCompetitorPrices(
      goodsCostRub,
      safeWeight,
      activeTariff.ratePerKgRub,
      activeWoodenCrate
    );
  }, [goodsCostRub, safeWeight, activeTariff.ratePerKgRub, activeWoodenCrate]);

  const handleCopyQuote = async () => {
    if (onCopyQuote) {
      onCopyQuote();
      return;
    }

    const text = [
      '🇨🇳 Смета заказа из Китая:',
      itemUrl ? `🔗 Товар: ${itemUrl}` : '',
      `📦 Партия: ${safeQuantity} шт. × ${safePrice} ¥ (курс ${exchangeRate.toFixed(2)} ₽/¥)`,
      `⚖️ Вес: ${safeWeight} кг (${activeTariff.name}${activeWoodenCrate ? ' + обрешётка' : ''})`,
      '',
      `• Товары: ${goodsCostRub.toLocaleString('ru-RU')} ₽`,
      `• Комиссия (${config.commissionPercent}%): ${commissionRub.toLocaleString('ru-RU')} ₽`,
      `• Доставка: ${shippingRub.toLocaleString('ru-RU')} ₽`,
      `💰 Итого: ${totalRub.toLocaleString('ru-RU')} ₽`,
      comment ? `📝 Комментарий: ${comment}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Смета скопирована', 'Расчёт заказа успешно скопирован в буфер обмена', 'success');
    } catch {
      showToast('Ошибка копирования', 'Не удалось скопировать смету в буфер', 'error');
    }
  };

  const handleDirectTelegramOrder = () => {
    if (onDirectOrder) {
      onDirectOrder();
      return;
    }

    const quote: TelegramOrderQuote = {
      itemUrl: itemUrl || 'https://detail.1688.com/offer/71239841.html',
      title: title || 'Заказ товаров из Китая',
      cnyPrice: safePrice,
      quantity: safeQuantity,
      weightKg: safeWeight,
      rate: Number(exchangeRate.toFixed(2)),
      goodsRub: goodsCostRub,
      commissionRub: commissionRub,
      shippingRub: shippingRub,
      totalRub: totalRub,
      comment: comment,
    };

    const link = buildTelegramOrderLink(quote);
    window.open(link, '_blank', 'noopener,noreferrer');
    showToast('Переход в Telegram', 'Открываем диалог для быстрого оформления выкупа', 'info');
  };

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

        {/* Live / Real FX indicator badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-raised border border-default text-xs font-mono self-start sm:self-auto"
          aria-label="Текущий курс юаня"
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isLiveRate ? 'bg-emerald-500 animate-pulse' : 'bg-content-muted'
            }`}
            aria-hidden="true"
          />
          <span className="text-content-primary font-medium">
            1 ¥ = {exchangeRate.toFixed(2)} ₽
          </span>
          <span className="text-[10px] text-content-muted font-sans font-medium uppercase tracking-wider ml-1">
            {isLiveRate ? 'Live FX' : 'Базовый курс'}
          </span>
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

      {/* Dynamic Competitor Comparison Table */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-semibold text-content-primary">
            Сравнение условий с рынком
          </h5>
          <span className="text-[11px] font-mono text-content-muted">
            Текущий расчёт
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
              {competitorPrices.rows.map((row) => (
                <tr
                  key={row.param}
                  className={`hover:bg-hover/30 transition-colors ${row.isHighlight ? 'bg-accent/5' : ''}`}
                >
                  <td className={`py-2 px-3 ${row.isHighlight ? 'text-content-primary font-medium' : 'text-content-secondary'}`}>
                    {row.param}
                  </td>
                  <td className={`py-2 px-3 font-mono ${row.usStyle}`}>{row.us}</td>
                  <td className={`py-2 px-3 font-mono ${row.compStyle}`}>{row.compA}</td>
                  <td className={`py-2 px-3 font-mono ${row.compStyle}`}>{row.compB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Savings Highlight */}
      <div className="p-3 rounded-md bg-raised border border-default text-xs text-content-secondary flex items-start gap-2.5">
        <TrendingUp className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <span className="text-content-primary font-medium">
            Ориентир розницы на маркетплейсах РФ: ~{Math.round(totalRub * 1.9).toLocaleString('ru-RU')} ₽.
          </span>{' '}
          <span className="text-accent font-semibold">
            {competitorPrices.savingsA > 0 || competitorPrices.savingsB > 0
              ? `Экономия до ${Math.max(competitorPrices.savingsA, competitorPrices.savingsB).toLocaleString('ru-RU')} ₽ по сравнению с конкурентами.`
              : 'Прозрачная комиссия без скрытых наценок.'}
          </span>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="pt-2 space-y-2">
        <Button
          type="button"
          variant="primary"
          className="w-full text-sm font-semibold py-3 gap-2"
          onClick={handleDirectTelegramOrder}
        >
          <Send className="w-4 h-4" />
          <span>Заказать выкуп в Telegram</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full text-xs py-2 gap-1.5 text-content-secondary hover:text-content-primary"
          onClick={handleCopyQuote}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Смета скопирована!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Скопировать смету</span>
            </>
          )}
        </Button>
      </div>

      <div className="p-3 rounded-md bg-raised border border-default text-[11px] text-content-muted flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
        <span>
          Формула без скрытых комиссий и навязанных страховок. Доставка карго со склада в Гуанчжоу / Иу до Москвы.
        </span>
      </div>
    </Card>
  );
};

export default OrderCalculator;
