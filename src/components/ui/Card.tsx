import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-lg border border-default bg-surface p-6 shadow-card',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};