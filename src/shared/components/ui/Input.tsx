import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full h-11 px-3.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 text-sm rounded-2xl border border-transparent focus:border-[#0EA5E9]/50 focus:ring-3 focus:ring-[#0EA5E9]/15 transition-all outline-hidden placeholder:text-slate-400 font-medium',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/15 bg-red-50/30',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-slate-400 flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-in fade-in duration-150">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
