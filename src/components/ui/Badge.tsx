import React from 'react';
import { OrderStatus } from '../../types';

interface BadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const config = {
    new: {
      label: 'Новый',
      dot: 'bg-status-neutral',
      bg: 'bg-status-neutral/10 text-content-primary border-status-neutral/40',
    },
    purchased: {
      label: 'Выкуплен',
      dot: 'bg-status-blue',
      bg: 'bg-status-blue/10 text-content-primary border-status-blue/40',
    },
    in_warehouse: {
      label: 'На складе в Гуанчжоу',
      dot: 'bg-status-muted',
      bg: 'bg-status-muted/10 text-content-primary border-status-muted/40',
    },
    shipped: {
      label: 'В пути (Карго)',
      dot: 'bg-status-dark',
      bg: 'bg-status-dark/10 text-content-primary border-status-dark/40',
    },
    delivered: {
      label: 'Доставлен в РФ',
      dot: 'bg-status-complete',
      bg: 'bg-status-complete/10 text-content-primary border-status-complete/40',
    },
  };

  const item = config[status] || config.new;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-medium border ${item.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
};