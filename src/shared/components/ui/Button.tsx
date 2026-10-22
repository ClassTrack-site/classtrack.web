import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none cursor-pointer';

    const variants = {
      primary:
        'bg-[#0EA5E9] hover:bg-[#0284C7] active:bg-[#0369A1] text-white shadow-sm shadow-sky-500/20 font-semibold',
      secondary:
        'bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] font-semibold active:bg-sky-200',
      outline:
        'border border-slate-200/80 bg-white/70 hover:bg-white text-slate-700 active:bg-slate-100/80',
      ghost:
        'bg-transparent hover:bg-slate-100/70 text-slate-700 active:bg-slate-200/60',
      danger:
        'bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-500/20 font-semibold',
      glass:
        'ios-glass border border-white/60 text-slate-800 hover:bg-white/90 shadow-xs active:bg-white',
    };

    const sizes = {
      sm: 'h-9 px-3.5 text-xs rounded-xl gap-1.5',
      md: 'h-11 px-4 text-sm rounded-2xl gap-2',
      lg: 'h-13 px-6 text-base rounded-2xl gap-2.5 font-semibold',
      icon: 'h-10 w-10 p-0 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
