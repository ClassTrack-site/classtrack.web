import React from 'react';
import { cn } from '@/shared/utils/cn';

export type BadgeVariant =
  | 'present'
  | 'late'
  | 'absent'
  | 'excused'
  | 'not_registered'
  | 'cancelled'
  | 'sky'
  | 'neutral'
  | 'warning';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, { bg: string; text: string; dotColor: string }> = {
    present: {
      bg: 'bg-emerald-50 border border-emerald-200/60',
      text: 'text-[#16A34A]',
      dotColor: 'bg-[#16A34A]',
    },
    late: {
      bg: 'bg-amber-50 border border-amber-200/60',
      text: 'text-[#D97706]',
      dotColor: 'bg-[#D97706]',
    },
    absent: {
      bg: 'bg-rose-50 border border-rose-200/60',
      text: 'text-[#DC2626]',
      dotColor: 'bg-[#DC2626]',
    },
    excused: {
      bg: 'bg-sky-50 border border-blue-200/60',
      text: 'text-[#2563EB]',
      dotColor: 'bg-[#2563EB]',
    },
    not_registered: {
      bg: 'bg-slate-100 border border-slate-200',
      text: 'text-slate-600',
      dotColor: 'bg-slate-400',
    },
    cancelled: {
      bg: 'bg-zinc-100 border border-zinc-200',
      text: 'text-zinc-500',
      dotColor: 'bg-zinc-400',
    },
    sky: {
      bg: 'bg-[#E0F2FE] border border-sky-200/70',
      text: 'text-[#0369A1]',
      dotColor: 'bg-[#0EA5E9]',
    },
    neutral: {
      bg: 'bg-slate-100 border border-slate-200/70',
      text: 'text-slate-700',
      dotColor: 'bg-slate-400',
    },
    warning: {
      bg: 'bg-orange-50 border border-orange-200',
      text: 'text-orange-700',
      dotColor: 'bg-orange-500',
    },
  };

  const selected = variants[variant];
  const sizeStyles =
    size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full select-none',
        selected.bg,
        selected.text,
        sizeStyles,
        className,
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0 animate-pulse', selected.dotColor)} />}
      {children}
    </span>
  );
}
