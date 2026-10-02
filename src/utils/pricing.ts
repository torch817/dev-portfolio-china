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

export interface CompetitorComparison {
  param: string;
  us: string;
  compA: string;
  compB: string;
  isHighlight?: boolean;
  usStyle?: string;
  compStyle?: string;
}

export type CompetitorComparisonRow = CompetitorComparison;

export const CHART_COLORS = {
  goods: '#3b82f6',
  commission: '#60a5fa',
  shipping: '#94a3b8',
} as const;

export const RADIUS = 46;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~289.027

export function normalizeChartSlices(
  goodsRub: number,
  shippingRub: number,
  commissionRub: number
): NormalizedChartData {
  const safeGoods = Math.max(0, Number.isFinite(goodsRub) ? goodsRub : 0);
  const safeShipping = Math.max(0, Number.isFinite(shippingRub) ? shippingRub : 0);
  const safeCommission = Math.max(0, Number.isFinite(commissionRub) ? commissionRub : 0);
  const totalRub = safeGoods + safeShipping + safeCommission;

  if (totalRub <= 0) {
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
          dashArray: '0 289.026',
          dashOffset: 0,
        },
        {
          key: 'commission',
          label: 'Комиссия',
          amountRub: 0,
          percent: 0,
          color: CHART_COLORS.commission,
          dashArray: '0 289.026',
          dashOffset: 0,
        },
        {
          key: 'shipping',
          label: 'Доставка',
          amountRub: 0,
          percent: 0,
          color: CHART_COLORS.shipping,
          dashArray: '0 289.026',
          dashOffset: 0,
        },
      ],
    };
  }

  const goodsRatio = safeGoods / totalRub;
  const commissionRatio = safeCommission / totalRub;
  const shippingRatio = safeShipping / totalRub;

  const goodsPct = Math.round(goodsRatio * 100);
  const commPct = Math.round(commissionRatio * 100);
  const shipPct = Math.max(0, 100 - goodsPct - commPct);

  const goodsLen = goodsRatio * CIRCUMFERENCE;
  const commissionLen = commissionRatio * CIRCUMFERENCE;
  const shippingLen = shippingRatio * CIRCUMFERENCE;

  return {
    hasData: true,
    totalRub,
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
        key: 'commission',
        label: 'Комиссия',
        amountRub: safeCommission,
        percent: commPct,
        color: CHART_COLORS.commission,
        dashArray: `${commissionLen} ${CIRCUMFERENCE}`,
        dashOffset: -goodsLen,
      },
      {
        key: 'shipping',
        label: 'Доставка',
        amountRub: safeShipping,
        percent: shipPct,
        color: CHART_COLORS.shipping,
        dashArray: `${shippingLen} ${CIRCUMFERENCE}`,
        dashOffset: -(goodsLen + commissionLen),
      },
    ],
  };
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
  rows: CompetitorComparison[];
} {
  const safeGoods = Math.max(0, Number.isFinite(goodsRub) ? goodsRub : 0);
  const safeWeight = Math.max(0, Number.isFinite(weightKg) ? weightKg : 0);
  const safeTariff = Math.max(0, Number.isFinite(tariffRatePerKg) ? tariffRatePerKg : 0);
  const isCrate = Boolean(woodenCrate);

  // Our cost: 5% commission, tariffRatePerKg, +300 ₽ crate if selected
  const ourShipping = Math.round(safeWeight * safeTariff) + (isCrate ? 300 : 0);
  const ourComm = Math.round(safeGoods * 0.05);
  const ourTotal = safeGoods + ourComm + ourShipping;

  // Comp A: 8% comm, +40 ₽/kg markup, +400 ₽ crate if selected
  const compAShipping = Math.round(safeWeight * (safeTariff + 40)) + (isCrate ? 400 : 0);
  const compAComm = Math.round(safeGoods * 0.08);
  const compATotal = safeGoods + compAComm + compAShipping;

  // Comp B: 10% comm, +70 ₽/kg markup, +500 ₽ crate if selected
  const compBShipping = Math.round(safeWeight * (safeTariff + 70)) + (isCrate ? 500 : 0);
  const compBComm = Math.round(safeGoods * 0.10);
  const compBTotal = safeGoods + compBComm + compBShipping;

  const savingsA = Math.max(0, compATotal - ourTotal);
  const savingsB = Math.max(0, compBTotal - ourTotal);

  const rows: CompetitorComparison[] = [
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
      compA: savingsA > 0 ? `−${savingsA.toLocaleString('ru-RU')} ₽` : '0 ₽',
      compB: savingsB > 0 ? `−${savingsB.toLocaleString('ru-RU')} ₽` : '0 ₽',
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
