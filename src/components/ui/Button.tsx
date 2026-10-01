import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-160 focus:outline-none focus:ring-2 focus:ring-accent-focus disabled:opacity-50 disabled:cursor-not-allowed select-none h-11";

  const variants = {
    primary:
      "bg-accent text-white hover:bg-accent-hover shadow-card",
    secondary:
      "bg-raised text-content-primary border border-default hover:bg-hover",
    outline:
      "bg-transparent border border-strong text-content-primary hover:bg-hover",
    ghost:
      "bg-transparent text-content-muted hover:text-content-primary hover:bg-hover",
  };

  const sizes = {
    sm: 'px-3 text-xs gap-1.5',
    md: 'px-4 text-sm gap-2',
    lg: 'px-5 text-sm gap-2.5 h-12',
  };

  return (
    <button
      className={twMerge(clsx(base, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};