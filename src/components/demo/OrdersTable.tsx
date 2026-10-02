import React from 'react';
import { Package, ExternalLink, RotateCcw, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../ui/Table';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { ChinaOrder } from '../../types';

export interface OrdersTableProps {
  orders: ChinaOrder[];
  onLoadOrder?: (order: ChinaOrder) => void;
  onResetOrders?: () => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onLoadOrder,
  onResetOrders,
}) => {
  const handleResetHistory = () => {
    if (window.confirm('Сбросить историю заказов к исходным?')) {
      onResetOrders?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-raised border border-default text-accent">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-content-primary">
            Журнал заказов (Интерактивная таблица)
          </h3>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-mono text-content-muted">
            Всего: {orders.length}
          </span>

          {onResetOrders && (
            <button
              type="button"
              onClick={handleResetHistory}
              className="inline-flex items-center gap-1.5 text-xs text-content-muted hover:text-red-400 p-1 rounded hover:bg-hover transition-colors focus:outline-none focus:ring-1 focus:ring-accent-focus"
              title="Сбросить историю заказов к исходным"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Очистить историю</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№ Заказа</TableHead>
              <TableHead>Товар / Ссылка</TableHead>
              <TableHead className="text-center">Кол-во</TableHead>
              <TableHead>Вес</TableHead>
              <TableHead>Итого (₽)</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действие</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs font-semibold text-content-primary whitespace-nowrap">
                  {order.id}
                  <div className="text-[10px] text-content-muted font-sans font-normal mt-0.5">
                    {order.createdAt}
                  </div>
                </TableCell>

                <TableCell className="max-w-[240px]">
                  <div className="font-medium text-xs text-content-primary truncate">
                    {order.title || 'Товар по ссылке'}
                  </div>
                  <a
                    href={order.itemUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent-hover truncate max-w-[220px] mt-0.5"
                  >
                    <span className="truncate">{order.itemUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </TableCell>

                <TableCell className="text-center font-mono text-xs text-content-secondary whitespace-nowrap">
                  {order.quantity} шт.
                </TableCell>

                <TableCell className="font-mono text-xs text-content-secondary whitespace-nowrap">
                  {order.weightKg} кг
                </TableCell>

                <TableCell className="font-mono font-semibold text-xs text-content-primary whitespace-nowrap">
                  {order.totalRub.toLocaleString('ru-RU')} ₽
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  <StatusBadge status={order.status} />
                  {order.trackNumber && (
                    <div className="text-[10px] font-mono text-content-muted mt-1">
                      {order.trackNumber}
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-right whitespace-nowrap">
                  {onLoadOrder && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] py-1 px-2.5 h-auto gap-1"
                      onClick={() => onLoadOrder(order)}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>В форму</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Mobile Cards View (390px viewport friendly) */}
      <div className="sm:hidden space-y-3">
        {orders.map((order) => (
          <Card key={order.id} className="p-4 bg-surface border-default space-y-3 shadow-card">
            <div className="flex items-center justify-between pb-2 border-b border-default/60">
              <div>
                <span className="font-mono text-xs font-bold text-content-primary">
                  {order.id}
                </span>
                <span className="text-[10px] text-content-muted block">
                  {order.createdAt}
                </span>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div>
              <div className="text-xs font-semibold text-content-primary">
                {order.title || 'Товар из Китая'}
              </div>
              <a
                href={order.itemUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent-hover truncate max-w-[280px] mt-1"
              >
                <span className="truncate">{order.itemUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-default/60 text-xs">
              <div>
                <div className="text-[10px] text-content-muted">Кол-во</div>
                <div className="font-mono text-content-primary">{order.quantity} шт.</div>
              </div>
              <div>
                <div className="text-[10px] text-content-muted">Вес</div>
                <div className="font-mono text-content-primary">{order.weightKg} кг</div>
              </div>
              <div>
                <div className="text-[10px] text-content-muted">Итого</div>
                <div className="font-mono font-bold text-accent">
                  {order.totalRub.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-default/60 text-xs">
              {order.trackNumber ? (
                <div className="text-[10px] font-mono text-content-muted">
                  Трек: {order.trackNumber}
                </div>
              ) : (
                <div />
              )}

              {onLoadOrder && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px] py-1 px-2.5 h-auto gap-1 ml-auto"
                  onClick={() => onLoadOrder(order)}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>В форму</span>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersTable;
