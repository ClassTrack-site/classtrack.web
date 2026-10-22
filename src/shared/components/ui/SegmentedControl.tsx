import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'relative flex items-center p-1 bg-slate-200/70 rounded-2xl select-none',
        size === 'sm' ? 'h-9 text-xs' : 'h-11 text-sm',
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex-1 flex items-center justify-center gap-1.5 h-full px-3 font-semibold rounded-xl transition-all duration-300 cursor-pointer',
              isSelected
                ? 'bg-white text-slate-900 shadow-xs shadow-black/10 scale-[1.01]'
                : 'text-slate-500 hover:text-slate-800 active:scale-[0.97]',
            )}
          >
            {option.icon && (
              <span className={cn('shrink-0', isSelected ? 'text-[#0EA5E9]' : 'text-slate-400')}>
                {option.icon}
              </span>
            )}
            <span className="truncate">{option.label}</span>
            {option.badge !== undefined && (
              <span
                className={cn(
                  'ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold',
                  isSelected
                    ? 'bg-[#E0F2FE] text-[#0369A1]'
                    : 'bg-slate-300/80 text-slate-600',
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
