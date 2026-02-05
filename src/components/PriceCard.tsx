'use client';

import { Price } from '@/lib/types';
import { formatPrice, formatPercent, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceCardProps {
  price: Price;
  unit?: 'g' | 'don';
  onClick?: () => void;
}

export function PriceCard({ price, unit = 'don', onClick }: PriceCardProps) {
  const multiplier = unit === 'don' ? 3.75 : 1;
  const displayBuyPrice = price.buyPrice * multiplier;
  const displaySellPrice = price.sellPrice * multiplier;
  const isPositive = price.changePercent >= 0;
  
  const isGold = price.metal === 'GOLD';
  const bgGradient = isGold 
    ? 'from-amber-500 to-yellow-600' 
    : 'from-slate-400 to-slate-500';

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 text-white cursor-pointer",
        "bg-gradient-to-br shadow-lg card-hover",
        bgGradient
      )}
    >
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              {isGold ? '금' : '은'} {price.purity.shortName}
            </span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              1{unit === 'don' ? '돈' : 'g'}
            </span>
          </div>
          
          {/* 변동률 */}
          <div className={cn(
            "flex items-center gap-1 text-sm font-semibold",
            "bg-white/20 px-2 py-1 rounded-full"
          )}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{formatPercent(price.changePercent)}</span>
          </div>
        </div>
        
        {/* 가격 */}
        <div className="space-y-2">
          <div>
            <p className="text-xs text-white/70">매수가</p>
            <p className="text-2xl font-bold">{formatPrice(displayBuyPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-white/70">매도가</p>
            <p className="text-lg font-semibold text-white/90">
              {formatPrice(displaySellPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 간단한 가격 리스트 아이템
interface SimplePriceItemProps {
  label: string;
  price: number;
  unit?: 'g' | 'don';
  isGold?: boolean;
}

export function SimplePriceItem({ label, price, unit = 'don', isGold = true }: SimplePriceItemProps) {
  const multiplier = unit === 'don' ? 3.75 : 1;
  const displayPrice = price * multiplier;
  
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white rounded-xl">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className={cn(
        "font-bold",
        isGold ? "text-amber-600" : "text-slate-600"
      )}>
        {formatPrice(displayPrice)}
        <span className="text-xs text-gray-400 ml-1">/{unit === 'don' ? '돈' : 'g'}</span>
      </span>
    </div>
  );
}
