import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-content-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={twMerge(
            clsx(
              'w-full min-h-[90px] rounded-md border bg-raised px-3.5 py-2.5 text-sm text-content-primary placeholder:text-content-muted resize-y',
              'border-default transition-colors duration-160 focus:border-accent-border focus:outline-none focus:ring-2 focus:ring-accent-focus',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-accent-border focus:ring-accent-focus',
              className
            )
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error && (
          <p className="text-xs text-content-secondary">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';