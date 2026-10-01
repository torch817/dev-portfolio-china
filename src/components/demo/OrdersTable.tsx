import React from 'react';
import { Package, ExternalLink } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../ui/Table';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { ChinaOrder } from '../../types';

interface OrdersTableProps {
  orders: ChinaOrder[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-raised border border-default text-accent">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-content-primary">
            Журнал заказов (Интерактивная таблица)
          </h3>
        </div>
        <span className="text-xs font-mono text-content-muted">
          Всего: {orders.length}
        </span>
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

                <TableCell className="max-w-[260px]">
                  <div className="font-medium text-xs text-content-primary truncate">
                    {order.title || 'Товар по ссылке'}
                  </div>
                  <a
                    href={order.itemUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent-hover truncate max-w-[240px] mt-0.5"
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
                className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent-hover truncate max-w-[300px] mt-1"
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

            {order.trackNumber && (
              <div className="text-[10px] font-mono text-content-muted pt-1">
                Трек: {order.trackNumber}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
