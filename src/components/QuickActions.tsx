'use client';

import Link from 'next/link';
import { 
  Calculator, 
  MapPin, 
  Bell, 
  Sparkles, 
  BarChart3, 
  ShoppingBag,
  ArrowRightLeft,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
  bgColor: string;
}

const quickActions: QuickAction[] = [
  { 
    icon: Calculator, 
    label: '계산기', 
    href: '/calculator',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  { 
    icon: MapPin, 
    label: '주변 금은방', 
    href: '/stores',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  { 
    icon: Sparkles, 
    label: 'AI 추천', 
    href: '/ai-recommend',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  { 
    icon: BarChart3, 
    label: '시세 통계', 
    href: '/statistics',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  { 
    icon: Bell, 
    label: '가격 알림', 
    href: '/alerts',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  { 
    icon: Clock, 
    label: '거래 내역', 
    href: '/trade/history',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">빠른 메뉴</h3>
      <div className="grid grid-cols-3 gap-3">
        {quickActions.map(({ icon: Icon, label, href, color, bgColor }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors btn-press"
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-2",
              bgColor
            )}>
              <Icon className={cn("w-6 h-6", color)} />
            </div>
            <span className="text-xs text-gray-600 font-medium text-center">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 골드앤 쇼핑 배너
export function GoldnShoppingBanner() {
  return (
    <a
      href="https://goldn.co.kr"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-5 shadow-lg card-hover"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-amber-400 text-xs font-medium mb-1">파트너 쇼핑몰</p>
            <p className="text-white font-bold text-lg">골드앤 쥬얼리 쇼핑</p>
            <p className="text-gray-400 text-xs">프리미엄 귀금속 쇼핑몰</p>
          </div>
        </div>
        <ArrowRightLeft className="w-5 h-5 text-gray-400" />
      </div>
    </a>
  );
}
