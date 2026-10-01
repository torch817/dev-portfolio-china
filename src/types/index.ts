export type OrderStatus = 'new' | 'purchased' | 'in_warehouse' | 'shipped' | 'delivered';

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
}

export interface PricingConfig {
  cnyToRubRate: number; // 13.8 ₽ / ¥
  commissionPercent: number; // 5%
  shippingPerKgRub: number; // 480 ₽ / kg
}
