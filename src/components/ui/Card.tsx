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
          "rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/60 shadow-sm dark:shadow-none p-6 backdrop-blur-sm transition-all duration-200",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
