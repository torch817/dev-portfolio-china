// allow: SIZE_OK — interactive china demo integrating order form, table, calculator and storage
import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, ArrowLeft, Send, Tag } from 'lucide-react';
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
import { buildTelegramOrderLink, TelegramOrderQuote } from '../../utils/telegram';

interface ChinaOrderDemoProps {
  onBack?: () => void;
  onNavigate?: (to: string) => void;
}

interface PresetItem {
  label: string;
  url: string;
  price: number;
  qty: number;
  weight: number;
  comment: string;
  title: string;
  category: string;
  seller: string;
}

const PRESETS: PresetItem[] = [
  {
    label: '1688 (Худи, 45 ¥)',
    url: 'https://detail.1688.com/offer/71239841.html',
    price: 45,
    qty: 50,
    weight: 28,
    comment: 'Партия зимних худи оверсайз (хлопок 420г)',
    title: 'Партия зимних худи оверсайз (хлопок 420г)',
    category: 'Одежда и трикотаж',
    seller: 'Фабрика Guangzhou Yinuo (8 лет)',
  },
  {
    label: 'Taobao (Микрофоны, 120 ¥)',
    url: 'https://item.taobao.com/item.htm?id=68219401',
    price: 120,
    qty: 10,
    weight: 3.5,
    comment: 'Беспроводные микрофоны для стриминга K9',
    title: 'Беспроводные микрофоны для стриминга K9 (Type-C / Lightning)',
    category: 'Электроника и звук',
    seller: 'Shenzhen Tech Gold Seller (Топ 1%)',
  },
  {
    label: 'Poizon (Кроссовки, 680 ¥)',
    url: 'https://poizon.com/product/581023',
    price: 680,
    qty: 2,
    weight: 2.4,
    comment: 'Кроссовки Nike Air Jordan 1 Low (Оригинал)',
    title: 'Nike Air Jordan 1 Low (Оригинал с сертификатом Dewu)',
    category: 'Обувь и сникеры',
    seller: 'Poizon Verified Warehouse (100% аутентичность)',
  },
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
  const [weightKg, setWeightKg] = useState<number>(1.0); // Base delivery on 1.0 kg
  const [comment, setComment] = useState('Черный цвет, размеры L и XL поровну');
  const [currentRate, setCurrentRate] = useState<number>(defaultPricingConfig.cnyToRubRate || 13.8);
  const [isLiveRate, setIsLiveRate] = useState<boolean>(false);
  const [selectedTariffId, setSelectedTariffId] = useState<DeliveryTariffId>('express-auto');
  const [woodenCrate, setWoodenCrate] = useState<boolean>(false);
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');

  // Fetch FX rate on mount
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/rate', { signal: controller.signal })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (typeof data?.rate === 'number' && data.rate > 0) {
            setCurrentRate(data.rate);
            setIsLiveRate(data.source !== 'fallback');
          }
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Hydrate draft from localStorage
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
          if (
            draft.selectedTariffId === 'regular-auto' ||
            draft.selectedTariffId === 'express-auto' ||
            draft.selectedTariffId === 'air'
          ) {
            setSelectedTariffId(draft.selectedTariffId);
          }
          if (typeof draft.woodenCrate === 'boolean') setWoodenCrate(draft.woodenCrate);
        }
      }
    } catch {} finally {
      setHasHydratedDraft(true);
    }
  }, []);

  // Persist draft to localStorage
  useEffect(() => {
    if (!hasHydratedDraft) return;
    try {
      localStorage.setItem(
        'china_order_draft_v1',
        JSON.stringify({ itemUrl, cnyPrice, quantity, weightKg, comment, selectedTariffId, woodenCrate })
      );
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

  // Smart metadata deduction for preview card
  const previewData = useMemo(() => {
    const matchingPreset = PRESETS.find((p) => p.url === itemUrl);
    const validation = validateMarketplaceUrl(itemUrl);

    if (matchingPreset) {
      return {
        platform: validation.platform || '1688',
        title: matchingPreset.title,
        category: matchingPreset.category,
        seller: matchingPreset.seller,
        isVerified: true,
      };
    }

    const platform = validation.platform || '1688';
    let category = 'Потребительские товары';
    const lowerComment = (comment || '').toLowerCase();
    if (lowerComment.includes('худи') || lowerComment.includes('одежд') || lowerComment.includes('размер')) {
      category = 'Одежда и трикотаж';
    } else if (lowerComment.includes('микрофон') || lowerComment.includes('чехол') || lowerComment.includes('кабель')) {
      category = 'Электроника и аксессуары';
    } else if (lowerComment.includes('кроссов') || lowerComment.includes('обув')) {
      category = 'Обувь и сникеры';
    }

    return {
      platform,
      title: comment ? `Товар: ${comment.slice(0, 45)}` : `Товар с площадки ${platform}`,
      category,
      seller: '★ 4.9 • Проверенный поставщик',
      isVerified: true,
    };
  }, [itemUrl, comment]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateMarketplaceUrl(itemUrl);
    if (!validation.isValid) {
      setUrlError(validation.error || 'Некорректная ссылка');
      showToast('Ошибка валидации', validation.error || 'Проверьте ссылку на товар', 'error');
      return;
    }

    if (cnyPrice < 0.1) {
      showToast('Ошибка данных', 'Цена товара должна быть не менее 0.1 ¥', 'error');
      return;
    }
    if (quantity < 1 || quantity > 100000) {
      showToast('Ошибка данных', 'Количество должно быть от 1 до 100 000 шт.', 'error');
      return;
    }
    if (weightKg < 0.1 || weightKg > 10000) {
      showToast('Ошибка данных', 'Вес партии должен быть от 0.1 до 10 000 кг', 'error');
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
        } catch {}
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

  // Direct Telegram CTA execution
  const handleDirectTelegramOrder = () => {
    const validation = validateMarketplaceUrl(itemUrl);
    const finalUrl = validation.isValid && validation.normalizedUrl ? validation.normalizedUrl : itemUrl;

    const activeTariff = deliveryTariffs.find((t) => t.id === selectedTariffId) || deliveryTariffs[1];
    const shippingPerKgRub = activeTariff.ratePerKgRub;
    const goodsCostRub = Math.round(cnyPrice * quantity * currentRate);
    const commissionRub = Math.round(goodsCostRub * (defaultPricingConfig.commissionPercent / 100));
    const shippingRub = Math.round(weightKg * shippingPerKgRub) + (woodenCrate ? WOODEN_CRATE_PRICE_RUB : 0);
    const totalRub = goodsCostRub + commissionRub + shippingRub;

    const orderId = `CN-${Math.floor(10000 + Math.random() * 90000)}`;

    const quote: TelegramOrderQuote = {
      id: orderId,
      itemUrl: finalUrl,
      title: comment ? `Заказ: ${comment.slice(0, 35)}...` : `Товар ${validation.platform || 'Китай'}`,
      cnyPrice,
      quantity,
      weightKg,
      rate: Number(currentRate.toFixed(2)),
      goodsRub: goodsCostRub,
      commissionRub: commissionRub,
      shippingRub: shippingRub,
      totalRub: totalRub,
      comment: comment,
    };

    const link = buildTelegramOrderLink(quote);
    window.open(link, '_blank', 'noopener,noreferrer');

    const newOrder: ChinaOrder = {
      id: orderId,
      itemUrl: finalUrl,
      title: quote.title,
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

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem('china_orders_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showToast(
      'Заказ сформирован для Telegram!',
      `Номер заказа ${orderId} на сумму ${totalRub.toLocaleString('ru-RU')} ₽ добавлен в журнал.`,
      'success'
    );
  };

  // Repopulate form from historical orders
  const handleLoadOrder = (order: ChinaOrder) => {
    setItemUrl(order.itemUrl);
    setCnyPrice(order.cnyPrice);
    setQuantity(order.quantity);
    setWeightKg(order.weightKg);
    setComment(order.comment || '');
    if (order.tariffId) setSelectedTariffId(order.tariffId);
    if (typeof order.woodenCrate === 'boolean') setWoodenCrate(order.woodenCrate);
    setUrlError('');
    showToast('Заказ загружен', `Параметры заказа ${order.id} подставлены в калькулятор`, 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset orders history to initial samples
  const handleResetOrders = () => {
    setOrders(sampleOrders);
    try {
      localStorage.removeItem('china_orders_v1');
    } catch {}
    showToast('История сброшена', 'Список заказов сброшен к исходным демонстрационным данным', 'info');
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

              {/* Interactive Smart Product Preview Card */}
              <div className="p-3.5 rounded-lg bg-raised border border-default flex items-center gap-3.5 transition-all">
                <div className="w-12 h-12 rounded-md bg-surface border border-default flex flex-col items-center justify-center shrink-0 text-accent font-mono font-bold text-xs shadow-sm">
                  <span>{previewData.platform}</span>
                  <span className="text-[9px] text-content-muted font-sans font-normal">Китай</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-content-primary truncate">
                      {previewData.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-default text-accent font-medium">
                      {previewData.platform} Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-content-muted mt-1 flex-wrap">
                    <span className="text-amber-400 font-medium">★ 4.9</span>
                    <span>•</span>
                    <span className="text-content-secondary truncate">{previewData.seller}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-content-muted">
                      <Tag className="w-3 h-3 text-accent" />
                      {previewData.category}
                    </span>
                  </div>
                </div>
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
                  max="100000"
                  step="1"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  required
                />
                <Input
                  label="Примерный вес (кг) *"
                  type="number"
                  min="0.1"
                  max="10000"
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
            isLiveRate={isLiveRate}
            onRateChange={setCurrentRate}
            selectedTariffId={selectedTariffId}
            onTariffChange={setSelectedTariffId}
            woodenCrate={woodenCrate}
            onWoodenCrateChange={setWoodenCrate}
            itemUrl={itemUrl}
            title={comment ? `Заказ: ${comment.slice(0, 35)}...` : undefined}
            comment={comment}
            onDirectOrder={handleDirectTelegramOrder}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-default">
        <OrdersTable
          orders={orders}
          onLoadOrder={handleLoadOrder}
          onResetOrders={handleResetOrders}
        />
      </div>
    </div>
  );
};

export default ChinaOrderDemo;
