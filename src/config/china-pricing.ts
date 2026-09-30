import { PricingConfig } from '../types';

export const defaultPricingConfig: PricingConfig = {
  cnyToRubRate: 13.8, // 1 ¥ = 13.8 ₽
  commissionPercent: 5, // 5% комиссия сервиса
  shippingPerKgRub: 480, // 480 ₽ за кг (Авто-карго из Гуанчжоу/Иу)
  insurancePercent: 2, // 2% страховка груза
};

export const sampleOrders = [
  {
    id: "CN-89412",
    itemUrl: "https://detail.1688.com/offer/71239841.html",
    title: "Партия зимних худи оверсайз (хлопок 420г)",
    cnyPrice: 45,
    quantity: 50,
    weightKg: 28,
    totalRub: 47285,
    breakdown: {
      goodsCostRub: 31050,
      commissionRub: 1552,
      shippingRub: 13440,
      exchangeRate: 13.8,
      commissionPercent: 5,
      shippingPerKgRub: 480
    },
    status: "in_warehouse" as const,
    createdAt: "2026-09-28 14:20",
    trackNumber: "CG-GZ-99214"
  },
  {
    id: "CN-89408",
    itemUrl: "https://item.taobao.com/item.htm?id=68219401",
    title: "Беспроводные микрофоны для стриминга K9",
    cnyPrice: 120,
    quantity: 10,
    weightKg: 3.5,
    totalRub: 19068,
    breakdown: {
      goodsCostRub: 16560,
      commissionRub: 828,
      shippingRub: 1680,
      exchangeRate: 13.8,
      commissionPercent: 5,
      shippingPerKgRub: 480
    },
    status: "shipped" as const,
    createdAt: "2026-09-27 11:05",
    trackNumber: "CG-YW-55102"
  },
  {
    id: "CN-89395",
    itemUrl: "https://poizon.com/product/581023",
    title: "Кроссовки Nike Air Jordan 1 Low (Оригинал)",
    cnyPrice: 680,
    quantity: 2,
    weightKg: 2.4,
    totalRub: 21183,
    breakdown: {
      goodsCostRub: 18768,
      commissionRub: 938,
      shippingRub: 1152,
      exchangeRate: 13.8,
      commissionPercent: 5,
      shippingPerKgRub: 480
    },
    status: "delivered" as const,
    createdAt: "2026-09-24 09:40",
    trackNumber: "CDEK-14920412"
  },
  {
    id: "CN-89420",
    itemUrl: "https://detail.1688.com/offer/8912041.html",
    title: "Чехлы силиконовые MagSafe iPhone 16 Pro",
    cnyPrice: 8.5,
    quantity: 200,
    weightKg: 12,
    totalRub: 30429,
    breakdown: {
      goodsCostRub: 23460,
      commissionRub: 1173,
      shippingRub: 5760,
      exchangeRate: 13.8,
      commissionPercent: 5,
      shippingPerKgRub: 480
    },
    status: "purchased" as const,
    createdAt: "2026-09-29 18:15",
    trackNumber: "CG-GZ-10492"
  }
];
