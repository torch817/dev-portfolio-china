import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              "w-full rounded-xl border bg-white dark:bg-zinc-900/80 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
              "border-zinc-300 dark:border-zinc-800 transition-colors duration-150 focus:border-zinc-500 dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:focus:ring-zinc-400",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
              className
            )
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>}
        {error && <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
