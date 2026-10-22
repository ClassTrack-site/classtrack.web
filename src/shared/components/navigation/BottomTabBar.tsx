import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: number | string;
}

interface BottomTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function BottomTabBar({
  tabs,
  activeTab,
  onChange,
  className,
}: BottomTabBarProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 ios-glass border-t border-black/[0.05] pb-safe sm:hidden',
        className,
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-transform active:scale-90 cursor-pointer"
            >
              {/* Icon Container */}
              <div className="relative">
                <span
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? 'text-[#0EA5E9]' : 'text-slate-400',
                  )}
                >
                  {isActive && tab.activeIcon ? tab.activeIcon : tab.icon}
                </span>

                {/* Badge */}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-[#DC2626] text-white text-[9px] font-bold rounded-full min-w-4 text-center">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-[10px] tracking-tight mt-1 font-semibold transition-colors',
                  isActive ? 'text-[#0EA5E9]' : 'text-slate-400',
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
