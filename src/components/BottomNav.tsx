'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Wallet, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/trade', icon: TrendingUp, label: '거래' },
  { href: '/portfolio', icon: Wallet, label: '자산' },
  { href: '/settings', icon: Settings, label: '설정' },
];

export function BottomNav() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-full",
                  "transition-colors duration-200",
                  isActive ? "text-amber-500" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon className={cn(
                  "w-6 h-6 mb-1",
                  isActive && "stroke-[2.5]"
                )} />
                <span className={cn(
                  "text-xs",
                  isActive && "font-semibold"
                )}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* 하단 세이프 에어리어 */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
}
