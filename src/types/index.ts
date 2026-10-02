export type OrderStatus = 'new' | 'purchased' | 'in_warehouse' | 'shipped' | 'delivered';

export type DeliveryTariffId = 'regular-auto' | 'express-auto' | 'air';

export interface DeliveryTariff {
  id: DeliveryTariffId;
  name: string;
  days: string;
  ratePerKgRub: number;
}

export interface ChinaOrder {
  id: string;
  itemUrl: string;
  title?: string;
  cnyPrice: number;
  quantity: number;
  weightKg: number;
  comment?: string;
  totalRub: number;
  breakdown: {
    goodsCostRub: number;
    commissionRub: number;
    shippingRub: number;
    exchangeRate: number;
    commissionPercent: number;
    shippingPerKgRub: number;
  };
  status: OrderStatus;
  createdAt: string;
  trackNumber?: string;
  tariffId?: DeliveryTariffId;
  woodenCrate?: boolean;
}

export interface PricingConfig {
  cnyToRubRate: number; // 13.8 ₽ / ¥
  commissionPercent: number; // 5%
  shippingPerKgRub: number; // 480 ₽ / kg
}
