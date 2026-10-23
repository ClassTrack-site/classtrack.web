import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full h-11 px-3.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 text-sm rounded-2xl border border-transparent focus:border-[#0EA5E9]/50 focus:ring-3 focus:ring-[#0EA5E9]/15 transition-all outline-hidden font-medium appearance-none cursor-pointer',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/15 bg-red-50/30',
            className,
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <p className="mt-1 ml-1 text-xs text-red-600 font-medium animate-in fade-in duration-150">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
