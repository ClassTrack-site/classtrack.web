import React from 'react';
import { cn } from '@/shared/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl md:rounded-3xl border border-black/[0.04] p-4 md:p-6 transition-all duration-300 ios-hover-card',
        glass ? 'ios-glass shadow-xs' : 'bg-white shadow-xs shadow-slate-900/5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface InsetGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  footer?: string;
}

export function InsetGroup({
  title,
  footer,
  className,
  children,
  ...props
}: InsetGroupProps) {
  return (
    <div className={cn('w-full my-3', className)} {...props}>
      {title && (
        <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-black/[0.04] shadow-xs shadow-slate-900/5 overflow-hidden divide-y divide-slate-100">
        {children}
      </div>
      {footer && (
        <p className="px-4 mt-2 text-xs text-slate-400">
          {footer}
        </p>
      )}
    </div>
  );
}

interface InsetItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
}

export function InsetItem({
  icon,
  iconBg = 'bg-[#E0F2FE] text-[#0369A1]',
  title,
  subtitle,
  trailing,
  clickable = false,
  onClick,
  className,
  ...props
}: InsetItemProps) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3.5 transition-colors',
        clickable && 'cursor-pointer hover:bg-slate-50 active:bg-slate-100/70',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {icon && (
          <div
            className={cn(
              'h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-semibold',
              iconBg,
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {trailing && <div className="shrink-0 flex items-center">{trailing}</div>}
    </div>
  );
}
