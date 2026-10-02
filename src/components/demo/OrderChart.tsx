import React, { useId, useMemo } from 'react';
import {
  normalizeChartSlices,
  CHART_COLORS,
  CIRCUMFERENCE,
  RADIUS,
} from '../../utils/pricing';

export { CHART_COLORS, CIRCUMFERENCE, RADIUS };

export interface OrderChartProps {
  goodsCostRub: number;
  commissionRub: number;
  shippingRub: number;
  totalRub: number;
  className?: string;
}

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

  const chartData = useMemo(() => {
    return normalizeChartSlices(safeGoods, safeShipping, safeCommission);
  }, [safeGoods, safeShipping, safeCommission]);

  const { segments, hasData } = chartData;

  const displayTotal = totalRub > 0 ? totalRub : chartData.totalRub;
  const formattedTotal = displayTotal.toLocaleString('ru-RU');

  const goodsSeg = segments.find((s) => s.key === 'goods') ?? segments[0];
  const shippingSeg = segments.find((s) => s.key === 'shipping') ?? segments[1];
  const commissionSeg = segments.find((s) => s.key === 'commission') ?? segments[2];

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
              ? `Диаграмма структуры затрат: товары ${goodsSeg.percent}%, доставка ${shippingSeg.percent}%, комиссия ${commissionSeg.percent}%`
              : 'Диаграмма структуры затрат: нет данных'}
          </title>
          <desc id={descId}>
            {hasData
              ? `Себестоимость заказа: товары ${safeGoods} ₽, доставка ${safeShipping} ₽, комиссия ${safeCommission} ₽. Итого ${formattedTotal} ₽.`
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
          {segments.map((seg) => (
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

        {/* Center Label (horizontal) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
          <span className="text-[10px] uppercase tracking-wider text-content-muted font-medium">
            Итого
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-content-primary leading-tight text-center whitespace-nowrap">
            {formattedTotal} ₽
          </span>
        </div>
      </div>

      {/* Right Column: Distribution Bar & Accessible Legend */}
      <div className="w-full flex-1 space-y-3 min-w-0">
        {/* Segmented Horizontal Distribution Bar */}
        <div
          className="h-3 w-full rounded-full overflow-hidden flex bg-surface border border-default"
          role="progressbar"
          aria-label="Распределение затрат"
          aria-valuenow={hasData ? 100 : 0}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {segments.map((item) => (
            <div
              key={item.key}
              style={{
                width: `${item.percent}%`,
                backgroundColor: item.color,
              }}
              className="h-full flex items-center justify-center text-[9px] font-mono font-semibold text-white overflow-hidden transition-[width] duration-500 ease-out motion-reduce:transition-none"
              title={`${item.label}: ${item.percent}%`}
            >
              {item.percent >= 8 ? `${item.percent}%` : null}
            </div>
          ))}
        </div>

        {/* Legend & Breakdown Details */}
        <div
          className="w-full space-y-1.5 text-xs"
          role="region"
          aria-label="Легенда структуры затрат"
        >
          {segments.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-1 border-b border-default/50 last:border-b-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="text-content-secondary font-medium truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono shrink-0 ml-2">
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
    </div>
  );
};

export default OrderChart;
