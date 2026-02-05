'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import { Holding, GOLD_PURITIES, SILVER_PURITIES } from '@/lib/types';
import { formatPrice, formatPercent, cn, storage } from '@/lib/utils';

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const user = storage.get('user', null);
    setIsLoggedIn(!!user);
    
    if (user) {
      loadHoldings();
    }
  }, []);
  
  const loadHoldings = () => {
    // 더미 데이터
    const allPurities = [...GOLD_PURITIES, ...SILVER_PURITIES];
    const dummyHoldings: Holding[] = [
      {
        purity: allPurities.find(p => p.id === 'gold_24k')!,
        quantity: 25.5,
        averagePrice: 258000,
        currentPrice: 268000,
      },
      {
        purity: allPurities.find(p => p.id === 'gold_18k')!,
        quantity: 10,
        averagePrice: 195000,
        currentPrice: 201000,
      },
      {
        purity: allPurities.find(p => p.id === 'silver_999')!,
        quantity: 100,
        averagePrice: 1150,
        currentPrice: 1220,
      },
    ];
    
    setHoldings(dummyHoldings);
  };
  
  // 총 평가 금액
  const totalValue = holdings.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0);
  // 총 투자 금액
  const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.averagePrice, 0);
  // 총 손익
  const totalPnl = totalValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
            <h1 className="font-bold text-lg">포트폴리오</h1>
          </div>
        </header>
        
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <Wallet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-500 mb-6">자산 현황을 확인하려면 로그인해 주세요.</p>
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
          >
            로그인하기
          </a>
        </div>
        
        <BottomNav />
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <h1 className="font-bold text-lg">포트폴리오</h1>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* 총 자산 - 미니멀하고 고급스러운 디자인 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 tracking-wider uppercase mb-2">Total Assets</p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-1">
            {formatPrice(totalValue)}
          </h2>
          
          <div className="flex items-center gap-3 mt-4">
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              totalPnl >= 0 ? "text-emerald-600" : "text-rose-600"
            )}>
              {totalPnl >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{totalPnl >= 0 ? '+' : ''}{formatPrice(totalPnl)}</span>
            </div>
            <span className={cn(
              "px-2 py-0.5 rounded text-xs font-semibold",
              totalPnl >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              {formatPercent(totalPnlPercent)}
            </span>
          </div>
          
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">투자 원금</span>
              <span className="font-medium text-gray-700">{formatPrice(totalInvested)}</span>
            </div>
          </div>
        </div>
        
        {/* 자산 구성 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-gray-800">자산 구성</h3>
          </div>
          
          {/* 비율 바 */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex mb-4">
            {holdings.map((h, i) => {
              const ratio = totalValue > 0 
                ? (h.quantity * h.currentPrice / totalValue) * 100 
                : 0;
              return (
                <div
                  key={h.purity.id}
                  className={cn(
                    "h-full",
                    h.purity.metal === 'GOLD' 
                      ? i === 0 ? "bg-amber-500" : "bg-amber-400"
                      : "bg-slate-400"
                  )}
                  style={{ width: `${ratio}%` }}
                />
              );
            })}
          </div>
          
          {/* 범례 */}
          <div className="flex flex-wrap gap-3">
            {holdings.map((h, i) => {
              const ratio = totalValue > 0 
                ? (h.quantity * h.currentPrice / totalValue) * 100 
                : 0;
              return (
                <div key={h.purity.id} className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    h.purity.metal === 'GOLD' 
                      ? i === 0 ? "bg-amber-500" : "bg-amber-400"
                      : "bg-slate-400"
                  )} />
                  <span className="text-sm text-gray-600">
                    {h.purity.shortName} {ratio.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 보유 목록 */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-800 px-1">보유 내역</h3>
          
          {holdings.map((holding) => (
            <HoldingCard key={holding.purity.id} holding={holding} />
          ))}
        </div>
      </div>
      
      <BottomNav />
    </main>
  );
}

function HoldingCard({ holding }: { holding: Holding }) {
  const value = holding.quantity * holding.currentPrice;
  const invested = holding.quantity * holding.averagePrice;
  const pnl = value - invested;
  const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
  
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
            holding.purity.metal === 'GOLD' 
              ? "bg-gradient-to-br from-amber-400 to-amber-600"
              : "bg-gradient-to-br from-slate-400 to-slate-600"
          )}>
            {holding.purity.metal === 'GOLD' ? 'Au' : 'Ag'}
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{holding.purity.name}</h4>
            <p className="text-sm text-gray-500">{holding.purity.shortName}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-bold text-gray-800">{formatPrice(value)}</p>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium justify-end",
            pnl >= 0 ? "text-red-500" : "text-blue-500"
          )}>
            {pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{pnl >= 0 ? '+' : ''}{formatPrice(pnl)}</span>
            <span>({formatPercent(pnlPercent)})</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">보유량</p>
          <p className="font-semibold text-gray-700">{holding.quantity.toFixed(2)}g</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">평균 단가</p>
          <p className="font-semibold text-gray-700">{formatPrice(holding.averagePrice)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">현재가</p>
          <p className="font-semibold text-gray-700">{formatPrice(holding.currentPrice)}</p>
        </div>
      </div>
    </div>
  );
}
