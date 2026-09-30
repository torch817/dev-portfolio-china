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
          <Package className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Мои заказы (Тестовые данные)</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Всего заказов: {orders.length}</span>
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
              <TableCell className="font-mono text-xs text-cyan-600 dark:text-cyan-300 font-medium">
                {order.id}
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">{order.createdAt}</div>
              </TableCell>

              <TableCell className="max-w-[220px]">
                <div className="font-medium text-xs text-slate-900 dark:text-slate-100 truncate">
                  {order.title || 'Товар по ссылке'}
                </div>
                <a
                  href={order.itemUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:underline truncate max-w-[200px]"
                >
                  <span className="truncate">{order.itemUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </TableCell>

              <TableCell className="text-center font-mono text-xs text-slate-700 dark:text-slate-200">{order.quantity} шт.</TableCell>

              <TableCell className="font-mono text-xs text-slate-700 dark:text-slate-300">{order.weightKg} кг</TableCell>

              <TableCell className="font-mono font-semibold text-xs text-slate-900 dark:text-slate-100">
                {order.totalRub.toLocaleString('ru-RU')} ₽
              </TableCell>

              <TableCell>
                <StatusBadge status={order.status} />
                {order.trackNumber && (
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
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
