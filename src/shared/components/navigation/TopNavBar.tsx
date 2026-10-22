import React from 'react';
import { cn } from '@/shared/utils/cn';
import { ChevronLeft } from 'lucide-react';

interface TopNavBarProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
  centerNode?: React.ReactNode;
}

export function TopNavBar({
  title,
  subtitle,
  onBack,
  backLabel,
  leading,
  trailing,
  className,
  centerNode,
}: TopNavBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full ios-glass border-b border-black/[0.04] transition-colors',
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
        {/* Left: Back or Leading */}
        <div className="flex items-center gap-2 min-w-[70px]">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 text-[#0EA5E9] hover:text-[#0284C7] font-semibold text-sm active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              {backLabel && <span className="hidden sm:inline">{backLabel}</span>}
            </button>
          ) : (
            leading
          )}
        </div>

        {/* Center */}
        <div className="flex-1 text-center min-w-0 px-2 flex justify-center">
          {centerNode ? (
            centerNode
          ) : (
            <div className="truncate">
              {title && (
                <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight truncate">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Trailing Actions */}
        <div className="flex items-center justify-end gap-2 min-w-[70px]">
          {trailing}
        </div>
      </div>
    </header>
  );
}
