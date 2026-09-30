import React from 'react';
import { OrderStatus } from '../../types';

interface BadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const config = {
    new: {
      label: 'Новый',
      dot: 'bg-zinc-500 dark:bg-zinc-400',
      bg: 'bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700'
    },
    purchased: {
      label: 'Выкуплен',
      dot: 'bg-blue-500 dark:bg-blue-400',
      bg: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30'
    },
    in_warehouse: {
      label: 'На складе в Гуанчжоу',
      dot: 'bg-purple-500 dark:bg-purple-400',
      bg: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30'
    },
    shipped: {
      label: 'В пути (Карго)',
      dot: 'bg-orange-500 dark:bg-orange-400',
      bg: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30'
    },
    delivered: {
      label: 'Доставлен в РФ',
      dot: 'bg-emerald-500 dark:bg-emerald-400',
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
    }
  };

  const item = config[status] || config.new;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
};
