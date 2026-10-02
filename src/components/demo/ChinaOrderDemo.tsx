// allow: SIZE_OK — interactive china demo integrating order form, table, calculator and storage
import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Send } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { OrderCalculator } from './OrderCalculator';
import { OrdersTable } from './OrdersTable';
import { useToast } from '../../context/ToastContext';
import { defaultPricingConfig, sampleOrders, deliveryTariffs, WOODEN_CRATE_PRICE_RUB } from '../../config/china-pricing';
import { ChinaOrder, DeliveryTariffId } from '../../types';
import { validateMarketplaceUrl } from '../../utils/urlValidation';

interface ChinaOrderDemoProps {
  onBack?: () => void;
  onNavigate?: (to: string) => void;
}

const PRESETS = [
  { label: '1688 (Худи, 45 ¥)', url: 'https://detail.1688.com/offer/71239841.html', price: 45, qty: 50, weight: 28, comment: 'Партия зимних худи оверсайз (хлопок 420г)' },
  { label: 'Taobao (Микрофоны, 120 ¥)', url: 'https://item.taobao.com/item.htm?id=68219401', price: 120, qty: 10, weight: 3.5, comment: 'Беспроводные микрофоны для стриминга K9' },
  { label: 'Poizon (Кроссовки, 680 ¥)', url: 'https://poizon.com/product/581023', price: 680, qty: 2, weight: 2.4, comment: 'Кроссовки Nike Air Jordan 1 Low (Оригинал)' },
];

function getInitialOrders(): ChinaOrder[] {
  if (typeof window === 'undefined') return sampleOrders;
  try {
    const saved = localStorage.getItem('china_orders_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return sampleOrders;
}

export const ChinaOrderDemo: React.FC<ChinaOrderDemoProps> = ({ onBack, onNavigate }) => {
  const handleBack = () => {
    if (onNavigate) {
      onNavigate('/');
    } else if (onBack) {
      onBack();
    }
  };

  const { showToast } = useToast();
  const [orders, setOrders] = useState<ChinaOrder[]>(getInitialOrders);

  const [itemUrl, setItemUrl] = useState('https://detail.1688.com/offer/69410294.html');
  const [cnyPrice, setCnyPrice] = useState<number>(35);
  const [quantity, setQuantity] = useState<number>(10);
  const [weightKg, setWeightKg] = useState<number>(2.5);
  const [comment, setComment] = useState('Черный цвет, размеры L и XL поровну');
  const [currentRate, setCurrentRate] = useState<number>(defaultPricingConfig.cnyToRubRate || 13.8);
  const [selectedTariffId, setSelectedTariffId] = useState<DeliveryTariffId>('express-auto');
  const [woodenCrate, setWoodenCrate] = useState<boolean>(false);
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/rate', { signal: controller.signal })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (typeof data?.rate === 'number' && data.rate > 0) {
            setCurrentRate(data.rate);
          }
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('china_order_draft_v1');
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft && typeof draft === 'object') {
          if (typeof draft.itemUrl === 'string') setItemUrl(draft.itemUrl);
          if (typeof draft.cnyPrice === 'number' && draft.cnyPrice > 0) setCnyPrice(draft.cnyPrice);
          if (typeof draft.quantity === 'number' && draft.quantity > 0) setQuantity(draft.quantity);
          if (typeof draft.weightKg === 'number' && draft.weightKg > 0) setWeightKg(draft.weightKg);
          if (typeof draft.comment === 'string') setComment(draft.comment);
          if (draft.selectedTariffId === 'regular-auto' || draft.selectedTariffId === 'express-auto' || draft.selectedTariffId === 'air') {
            setSelectedTariffId(draft.selectedTariffId);
          }
          if (typeof draft.woodenCrate === 'boolean') setWoodenCrate(draft.woodenCrate);
        }
      }
    } catch {} finally {
      setHasHydratedDraft(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedDraft) return;
    try {
      localStorage.setItem('china_order_draft_v1', JSON.stringify({ itemUrl, cnyPrice, quantity, weightKg, comment, selectedTariffId, woodenCrate }));
    } catch {}
  }, [hasHydratedDraft, itemUrl, cnyPrice, quantity, weightKg, comment, selectedTariffId, woodenCrate]);

  const handleUrlChange = (val: string) => {
    setItemUrl(val);
    const res = validateMarketplaceUrl(val);
    if (!res.isValid) {
      setUrlError(res.error || 'Некорректная ссылка');
    } else {
      setUrlError('');
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateMarketplaceUrl(itemUrl);
    if (!validation.isValid) {
      setUrlError(validation.error || 'Некорректная ссылка');
      showToast('Ошибка валидации', validation.error || 'Проверьте ссылку на товар', 'error');
      return;
    }

    if (cnyPrice <= 0 || quantity <= 0 || weightKg <= 0) {
      showToast('Ошибка данных', 'Цена, количество и вес должны быть больше 0', 'error');
      return;
    }

    setIsSubmitting(true);
    const finalUrl = validation.normalizedUrl || itemUrl;

    const activeTariff = deliveryTariffs.find((t) => t.id === selectedTariffId) || deliveryTariffs[1];
    const shippingPerKgRub = activeTariff.ratePerKgRub;
    const goodsCostRub = Math.round(cnyPrice * quantity * currentRate);
    const commissionRub = Math.round(goodsCostRub * (defaultPricingConfig.commissionPercent / 100));
    const shippingRub = Math.round(weightKg * shippingPerKgRub) + (woodenCrate ? WOODEN_CRATE_PRICE_RUB : 0);
    const totalRub = goodsCostRub + commissionRub + shippingRub;

    const newOrder: ChinaOrder = {
      id: `CN-${Math.floor(10000 + Math.random() * 90000)}`,
      itemUrl: finalUrl,
      title: comment ? `Заказ: ${comment.slice(0, 35)}...` : `Товар ${validation.platform || 'Китай'}`,
      cnyPrice,
      quantity,
      weightKg,
      comment,
      totalRub,
      breakdown: {
        goodsCostRub,
        commissionRub,
        shippingRub,
        exchangeRate: currentRate,
        commissionPercent: defaultPricingConfig.commissionPercent,
        shippingPerKgRub,
      },
      status: 'new',
      createdAt: 'Сегодня, только что',
      trackNumber: 'В обработке',
      tariffId: selectedTariffId,
      woodenCrate,
    };

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 422) {
          const errData = await response.json().catch(() => ({}));
          showToast('Ошибка валидации', errData.error || 'Параметры заказа отклонены сервером', 'error');
        } else {
          showToast('Ошибка сервиса', 'Сервер вернул ошибку при приёме заказа. Повторите попытку.', 'error');
        }
        return;
      }

      setOrders((prev) => {
        const updated = [newOrder, ...prev];
        try {
          localStorage.setItem('china_orders_v1', JSON.stringify(updated));
        } catch {
        }
        return updated;
      });

      showToast(
        'Заказ успешно оформлен!',
        `Номер заказа ${newOrder.id} на сумму ${totalRub.toLocaleString('ru-RU')} ₽ принят в обработку.`,
        'success'
      );
      setComment('');
    } catch {
      showToast(
        'Сетевая ошибка',
        'Не удалось связаться с сервером заказов. Проверьте соединение и повторите попытку.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-[1120px] mx-auto px-5 sm:px-8 space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-default">
        <div>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs text-content-muted hover:text-content-primary mb-2 transition-colors focus:outline-none focus:ring-1 focus:ring-accent-focus rounded px-1 -ml-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться на главную</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-content-primary flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-accent" />
            <span>Демо: «Заказ товаров из Китая»</span>
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1">
            Интерактивный сервис выкупа, автоматического расчёта себестоимости и отслеживания заказов.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleBack} className="shrink-0 self-start sm:self-auto">
          Закрыть демо
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <Card className="p-6 bg-surface border-default shadow-card">
            <h2 className="text-base font-semibold text-content-primary mb-4">
              Оформить новый заказ на выкуп
            </h2>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <Input
                label="Ссылка на товар (1688 / Taobao / Poizon) *"
                placeholder="https://detail.1688.com/offer/..."
                value={itemUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                error={urlError}
                hint="Поддерживаются площадки 1688, Taobao, Tmall и Poizon (Dewu)"
                required
              />

              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <span className="text-[11px] text-content-muted">Быстрый выбор:</span>
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setItemUrl(p.url);
                      setCnyPrice(p.price);
                      setQuantity(p.qty);
                      setWeightKg(p.weight);
                      setComment(p.comment);
                      setUrlError('');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-sm bg-raised text-content-secondary hover:text-content-primary hover:bg-hover border border-default transition-colors focus:outline-none focus:ring-1 focus:ring-accent-focus"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Цена в Китае (¥ CNY) *"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={cnyPrice || ''}
                  onChange={(e) => setCnyPrice(parseFloat(e.target.value) || 0)}
                  required
                />
                <Input
                  label="Количество (шт) *"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  required
                />
                <Input
                  label="Примерный вес (кг) *"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={weightKg || ''}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.1)}
                  required
                />
              </div>

              <Textarea
                label="Параметры и комментарий"
                placeholder="Укажите цвет, размеры, требования к упаковке или проверке на брак..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full text-sm font-semibold py-3 gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Оформление...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Оформить заказ и отправить на выкуп</span>
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <OrderCalculator
            cnyPrice={cnyPrice}
            quantity={quantity}
            weightKg={weightKg}
            config={defaultPricingConfig}
            currentRate={currentRate}
            onRateChange={setCurrentRate}
            selectedTariffId={selectedTariffId}
            onTariffChange={setSelectedTariffId}
            woodenCrate={woodenCrate}
            onWoodenCrateChange={setWoodenCrate}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-default">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
};
