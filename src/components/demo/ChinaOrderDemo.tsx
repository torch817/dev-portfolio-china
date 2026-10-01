import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Send } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { OrderCalculator } from './OrderCalculator';
import { OrdersTable } from './OrdersTable';
import { useToast } from '../../context/ToastContext';
import { defaultPricingConfig, sampleOrders } from '../../config/china-pricing';
import { ChinaOrder } from '../../types';
import { validateMarketplaceUrl } from '../../utils/urlValidation';

interface ChinaOrderDemoProps {
  onBack?: () => void;
  onNavigate?: (to: string) => void;
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
  const [orders, setOrders] = useState<ChinaOrder[]>(sampleOrders);

  // Form states
  const [itemUrl, setItemUrl] = useState('https://detail.1688.com/offer/69410294.html');
  const [cnyPrice, setCnyPrice] = useState<number>(35);
  const [quantity, setQuantity] = useState<number>(10);
  const [weightKg, setWeightKg] = useState<number>(2.5);
  const [comment, setComment] = useState('Черный цвет, размеры L и XL поровну');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');

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

    const goodsCostRub = Math.round(cnyPrice * quantity * defaultPricingConfig.cnyToRubRate);
    const commissionRub = Math.round(goodsCostRub * (defaultPricingConfig.commissionPercent / 100));
    const shippingRub = Math.round(weightKg * defaultPricingConfig.shippingPerKgRub);
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
        exchangeRate: defaultPricingConfig.cnyToRubRate,
        commissionPercent: defaultPricingConfig.commissionPercent,
        shippingPerKgRub: defaultPricingConfig.shippingPerKgRub,
      },
      status: 'new',
      createdAt: 'Сегодня, только что',
      trackNumber: 'В обработке',
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

      // Append order only on verified 2xx response
      setOrders((prev) => [newOrder, ...prev]);
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
      {/* Top Banner */}
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

      {/* Main Grid: Form + Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
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

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <span className="text-[11px] text-content-muted">Быстрый выбор:</span>
                <button
                  type="button"
                  onClick={() => {
                    setItemUrl('https://detail.1688.com/offer/71239841.html');
                    setCnyPrice(45);
                    setQuantity(50);
                    setWeightKg(28);
                    setComment('Партия зимних худи оверсайз (хлопок 420г)');
                    setUrlError('');
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-sm bg-raised text-content-secondary hover:text-content-primary hover:bg-hover border border-default transition-colors focus:outline-none focus:ring-1 focus:ring-accent-focus"
                >
                  1688 (Худи, 45 ¥)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItemUrl('https://item.taobao.com/item.htm?id=68219401');
                    setCnyPrice(120);
                    setQuantity(10);
                    setWeightKg(3.5);
                    setComment('Беспроводные микрофоны для стриминга K9');
                    setUrlError('');
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-sm bg-raised text-content-secondary hover:text-content-primary hover:bg-hover border border-default transition-colors focus:outline-none focus:ring-1 focus:ring-accent-focus"
                >
                  Taobao (Микрофоны, 120 ¥)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItemUrl('https://poizon.com/product/581023');
                    setCnyPrice(680);
                    setQuantity(2);
                    setWeightKg(2.4);
                    setComment('Кроссовки Nike Air Jordan 1 Low (Оригинал)');
                    setUrlError('');
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-sm bg-raised text-content-secondary hover:text-content-primary hover:bg-hover border border-default transition-colors focus:outline-none focus:ring-1 focus:ring-accent-focus"
                >
                  Poizon (Кроссовки, 680 ¥)
                </button>
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

        {/* Right Live Calculator */}
        <div className="lg:col-span-5 space-y-4">
          <OrderCalculator
            cnyPrice={cnyPrice}
            quantity={quantity}
            weightKg={weightKg}
            config={defaultPricingConfig}
          />
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="pt-6 border-t border-default">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
};
