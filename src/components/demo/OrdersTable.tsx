import React from 'react';
import { Package, ExternalLink } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../ui/Table';
import { StatusBadge } from '../ui/Badge';
import { ChinaOrder } from '../../types';

interface OrdersTableProps {
  orders: ChinaOrder[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Мои заказы (Тестовые данные)</h3>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Всего заказов: {orders.length}</span>
      </div>

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
              <TableCell className="font-mono text-xs text-zinc-900 dark:text-zinc-100 font-semibold">
                {order.id}
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans font-normal">{order.createdAt}</div>
              </TableCell>

              <TableCell className="max-w-[220px]">
                <div className="font-medium text-xs text-zinc-900 dark:text-zinc-100 truncate">
                  {order.title || 'Товар по ссылке'}
                </div>
                <a
                  href={order.itemUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:underline truncate max-w-[200px]"
                >
                  <span className="truncate">{order.itemUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </TableCell>

              <TableCell className="text-center font-mono text-xs text-zinc-700 dark:text-zinc-200">{order.quantity} шт.</TableCell>

              <TableCell className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{order.weightKg} кг</TableCell>

              <TableCell className="font-mono font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                {order.totalRub.toLocaleString('ru-RU')} ₽
              </TableCell>

              <TableCell>
                <StatusBadge status={order.status} />
                {order.trackNumber && (
                  <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                    Трек: {order.trackNumber}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
