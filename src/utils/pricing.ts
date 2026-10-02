import { WOODEN_CRATE_PRICE_RUB } from '../config/china-pricing';

export interface ChartSlice {
  key: 'goods' | 'shipping' | 'commission';
  label: string;
  amountRub: number;
  percent: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

export interface NormalizedChartData {
  hasData: boolean;
  totalRub: number;
  segments: ChartSlice[];
}

export const CHART_COLORS = {
  goods: '#3b82f6',
  shipping: '#94a3b8',
  commission: '#60a5fa',
} as const;

export const RADIUS = 46;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function normalizeChartSlices(
  goodsRub: number,
  shippingRub: number,
  commissionRub: number
): NormalizedChartData {
  const safeGoods = Math.max(0, Number.isFinite(goodsRub) ? goodsRub : 0);
  const safeShipping = Math.max(0, Number.isFinite(shippingRub) ? shippingRub : 0);
  const safeCommission = Math.max(0, Number.isFinite(commissionRub) ? commissionRub : 0);
  const total = safeGoods + safeShipping + safeCommission;

  if (total <= 0) {
    return {
      hasData: false,
      totalRub: 0,
      segments: [
        {
          key: 'goods',
          label: 'Товары',
          amountRub: 0,
          percent: 0,
          color: CHART_COLORS.goods,
          dashArray: `0 ${CIRCUMFERENCE}`,
          dashOffset: 0,
        },
        {
          key: 'shipping',
          label: 'Доставка',
          amountRub: 0,
          percent: 0,
          color: CHART_COLORS.shipping,
          dashArray: `0 ${CIRCUMFERENCE}`,
          dashOffset: 0,
        },
        {
          key: 'commission',
          label: 'Комиссия',
          amountRub: 0,
          percent: 0,
          color: CHART_COLORS.commission,
          dashArray: `0 ${CIRCUMFERENCE}`,
          dashOffset: 0,
        },
      ],
    };
  }

  const goodsRatio = safeGoods / total;
  const shippingRatio = safeShipping / total;
  const commissionRatio = safeCommission / total;

  const goodsLen = goodsRatio * CIRCUMFERENCE;
  const shippingLen = shippingRatio * CIRCUMFERENCE;
  const commissionLen = commissionRatio * CIRCUMFERENCE;

  const goodsPct = Math.round(goodsRatio * 100);
  const commPct = Math.round(commissionRatio * 100);
  const shipPct = Math.max(0, 100 - goodsPct - commPct);

  return {
    hasData: true,
    totalRub: total,
    segments: [
      {
        key: 'goods',
        label: 'Товары',
        amountRub: safeGoods,
        percent: goodsPct,
        color: CHART_COLORS.goods,
        dashArray: `${goodsLen} ${CIRCUMFERENCE}`,
        dashOffset: 0,
      },
      {
        key: 'shipping',
        label: 'Доставка',
        amountRub: safeShipping,
        percent: shipPct,
        color: CHART_COLORS.shipping,
        dashArray: `${shippingLen} ${CIRCUMFERENCE}`,
        dashOffset: -goodsLen,
      },
      {
        key: 'commission',
        label: 'Комиссия',
        amountRub: safeCommission,
        percent: commPct,
        color: CHART_COLORS.commission,
        dashArray: `${commissionLen} ${CIRCUMFERENCE}`,
        dashOffset: -(goodsLen + shippingLen),
      },
    ],
  };
}

export interface CompetitorComparisonRow {
  param: string;
  us: string;
  compA: string;
  compB: string;
  isHighlight?: boolean;
  usStyle?: string;
  compStyle?: string;
}

export function calculateCompetitorPrices(
  goodsRub: number,
  weightKg: number,
  tariffRatePerKg: number,
  woodenCrate: boolean
): {
  ourTotal: number;
  compATotal: number;
  compBTotal: number;
  savingsA: number;
  savingsB: number;
  rows: CompetitorComparisonRow[];
} {
  const safeGoods = Math.max(0, Number.isFinite(goodsRub) ? goodsRub : 0);
  const safeWeight = Math.max(0, Number.isFinite(weightKg) ? weightKg : 0);
  const safeTariff = Math.max(0, Number.isFinite(tariffRatePerKg) ? tariffRatePerKg : 0);
  const crateCost = woodenCrate ? WOODEN_CRATE_PRICE_RUB : 0;

  // Us: 5% commission, safeTariff per kg
  const ourCommission = Math.round(safeGoods * 0.05);
  const ourShipping = Math.round(safeWeight * safeTariff) + crateCost;
  const ourTotal = safeGoods + ourCommission + ourShipping;

  // Comp A: 8% commission, +40 ₽/kg
  const compACommission = Math.round(safeGoods * 0.08);
  const compAShipping = Math.round(safeWeight * (safeTariff + 40)) + crateCost;
  const compATotal = safeGoods + compACommission + compAShipping;

  // Comp B: 10% commission, +70 ₽/kg
  const compBCommission = Math.round(safeGoods * 0.10);
  const compBShipping = Math.round(safeWeight * (safeTariff + 70)) + crateCost;
  const compBTotal = safeGoods + compBCommission + compBShipping;

  const savingsA = compATotal - ourTotal;
  const savingsB = compBTotal - ourTotal;

  const rows: CompetitorComparisonRow[] = [
    {
      param: 'Комиссия',
      us: '5%',
      compA: '8%',
      compB: '10%',
      usStyle: 'font-medium text-accent',
      compStyle: 'text-content-muted',
    },
    {
      param: 'Доставка (кг)',
      us: `${safeTariff.toLocaleString('ru-RU')} ₽`,
      compA: `${(safeTariff + 40).toLocaleString('ru-RU')} ₽`,
      compB: `${(safeTariff + 70).toLocaleString('ru-RU')} ₽`,
      usStyle: 'font-medium text-accent',
      compStyle: 'text-content-muted',
    },
    {
      param: 'Итого за пример',
      us: `${ourTotal.toLocaleString('ru-RU')} ₽`,
      compA: `${compATotal.toLocaleString('ru-RU')} ₽`,
      compB: `${compBTotal.toLocaleString('ru-RU')} ₽`,
      isHighlight: true,
      usStyle: 'font-bold text-accent',
      compStyle: 'text-content-secondary',
    },
    {
      param: 'Экономия',
      us: '—',
      compA: savingsA > 0 ? `−${savingsA.toLocaleString('ru-RU')} ₽` : `${savingsA.toLocaleString('ru-RU')} ₽`,
      compB: savingsB > 0 ? `−${savingsB.toLocaleString('ru-RU')} ₽` : `${savingsB.toLocaleString('ru-RU')} ₽`,
      usStyle: 'text-content-muted',
      compStyle: 'font-medium text-accent',
    },
  ];

  return {
    ourTotal,
    compATotal,
    compBTotal,
    savingsA,
    savingsB,
    rows,
  };
}
