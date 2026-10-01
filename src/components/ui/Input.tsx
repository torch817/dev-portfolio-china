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
          <label className="block text-xs font-medium text-content-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              'w-full h-11 rounded-md border bg-raised px-3.5 text-sm text-content-primary placeholder:text-content-muted',
              'border-default transition-colors duration-160 focus:border-accent-border focus:outline-none focus:ring-2 focus:ring-accent-focus',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-accent-border focus:ring-accent-focus',
              className
            )
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-content-muted">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-content-secondary">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';