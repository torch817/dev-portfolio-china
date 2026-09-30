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
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 shadow-sm focus:ring-zinc-400 dark:focus:ring-zinc-500",
    secondary: "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-700 focus:ring-zinc-400 dark:focus:ring-zinc-600",
    outline: "bg-transparent border border-zinc-300 hover:bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-800/80 dark:text-zinc-200 focus:ring-zinc-400 dark:focus:ring-zinc-600",
    ghost: "bg-transparent hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:hover:bg-zinc-800/50 dark:text-zinc-400 dark:hover:text-zinc-100 focus:ring-zinc-400 dark:focus:ring-zinc-600"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-sm gap-2.5"
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
