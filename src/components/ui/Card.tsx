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
          "rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 shadow-sm dark:shadow-none p-6 backdrop-blur-sm transition-all duration-200",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
