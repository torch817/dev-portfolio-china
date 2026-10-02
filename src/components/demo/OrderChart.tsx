import React, { useId, useMemo } from 'react';

export interface OrderChartProps {
  goodsCostRub: number;
  commissionRub: number;
  shippingRub: number;
  totalRub: number;
  className?: string;
}

interface BreakdownSegment {
  key: string;
  label: string;
  amountRub: number;
  percent: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const OrderChart: React.FC<OrderChartProps> = ({
  goodsCostRub,
  commissionRub,
  shippingRub,
  totalRub,
  className = '',
}) => {
  const titleId = useId();
  const descId = useId();

  const safeGoods = Math.max(0, Number(goodsCostRub) || 0);
  const safeCommission = Math.max(0, Number(commissionRub) || 0);
  const safeShipping = Math.max(0, Number(shippingRub) || 0);
  const sumRub = safeGoods + safeCommission + safeShipping;
  const effectiveTotal = Math.max(0, Number(totalRub) || sumRub);

  const { segments, hasData } = useMemo(() => {
    if (effectiveTotal <= 0) {
      return {
        hasData: false,
        segments: [
          {
            key: 'goods',
            label: 'Товары',
            amountRub: safeGoods,
            percent: 0,
            color: '#3b82f6',
            dashArray: `0 ${CIRCUMFERENCE}`,
            dashOffset: 0,
          },
          {
            key: 'commission',
            label: 'Комиссия',
            amountRub: safeCommission,
            percent: 0,
            color: '#60a5fa',
            dashArray: `0 ${CIRCUMFERENCE}`,
            dashOffset: 0,
          },
          {
            key: 'shipping',
            label: 'Доставка',
            amountRub: safeShipping,
            percent: 0,
            color: '#94a3b8',
            dashArray: `0 ${CIRCUMFERENCE}`,
            dashOffset: 0,
          },
        ] as BreakdownSegment[],
      };
    }

    const goodsRatio = safeGoods / effectiveTotal;
    const commissionRatio = safeCommission / effectiveTotal;
    const shippingRatio = safeShipping / effectiveTotal;

    const goodsLen = goodsRatio * CIRCUMFERENCE;
    const commissionLen = commissionRatio * CIRCUMFERENCE;
    const shippingLen = shippingRatio * CIRCUMFERENCE;

    const goodsPct = Math.round(goodsRatio * 100);
    const commPct = Math.round(commissionRatio * 100);
    const shipPct = Math.max(0, 100 - goodsPct - commPct);

    const segs: BreakdownSegment[] = [
      {
        key: 'goods',
        label: 'Товары',
        amountRub: safeGoods,
        percent: goodsPct,
        color: '#3b82f6',
        dashArray: `${goodsLen} ${CIRCUMFERENCE}`,
        dashOffset: 0,
      },
      {
        key: 'commission',
        label: 'Комиссия',
        amountRub: safeCommission,
        percent: commPct,
        color: '#60a5fa',
        dashArray: `${commissionLen} ${CIRCUMFERENCE}`,
        dashOffset: -goodsLen,
      },
      {
        key: 'shipping',
        label: 'Доставка',
        amountRub: safeShipping,
        percent: shipPct,
        color: '#94a3b8',
        dashArray: `${shippingLen} ${CIRCUMFERENCE}`,
        dashOffset: -(goodsLen + commissionLen),
      },
    ];

    return {
      hasData: true,
      segments: segs,
    };
  }, [safeGoods, safeCommission, safeShipping, effectiveTotal]);

  const formattedTotal = effectiveTotal.toLocaleString('ru-RU');

  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-5 sm:gap-6 p-4 rounded-lg bg-surface border border-default ${className}`}
    >
      {/* SVG Donut Visual */}
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
        <svg
          role="img"
          aria-label="Диаграмма структуры затрат"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 120 120"
          className="w-full h-full -rotate-90 origin-center overflow-visible"
        >
          <title id={titleId}>
            {hasData
              ? `Диаграмма структуры затрат: товары ${segments[0].percent}%, комиссия ${segments[1].percent}%, доставка ${segments[2].percent}%`
              : 'Диаграмма структуры затрат: нет данных'}
          </title>
          <desc id={descId}>
            {hasData
              ? `Себестоимость заказа: товары ${safeGoods} ₽, комиссия ${safeCommission} ₽, доставка ${safeShipping} ₽. Итого ${effectiveTotal} ₽.`
              : 'Расчёт себестоимости заказа пока не содержит данных.'}
          </desc>

          {/* Background Track Circle */}
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="14"
            className="opacity-40"
          />

          {/* Colored Segments */}
          {hasData &&
            segments.map((seg) => (
              <circle
                key={seg.key}
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="butt"
                className="transition-[stroke-dasharray,stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
              />
            ))}
        </svg>

        {/* Center Label (rotated back to normal horizontal) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
          <span className="text-[10px] uppercase tracking-wider text-content-muted font-medium">
            Итого
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-content-primary truncate max-w-[85px]">
            {formattedTotal} ₽
          </span>
        </div>
      </div>

      {/* Legend & Breakdown Details */}
      <div
        className="w-full flex-1 space-y-2 text-xs"
        role="region"
        aria-label="Легенда структуры затрат"
      >
        {segments.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-1 border-b border-default/50 last:border-b-0"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="text-content-secondary font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-content-primary font-medium">
                {item.amountRub.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-content-muted text-[11px] w-9 text-right">
                ({item.percent}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderChart;
