'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, ExternalLink, RefreshCw } from 'lucide-react';
import { Metal, GOLD_PURITIES, SILVER_PURITIES, Purity } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';

interface PriceSource {
  id: string;
  name: string;
  logo?: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  url: string;
  lastUpdate: Date;
  isBest?: boolean;
}

export default function PriceComparePage() {
  const [selectedMetal, setSelectedMetal] = useState<Metal>('GOLD');
  const [selectedPurity, setSelectedPurity] = useState<Purity>(GOLD_PURITIES[0]);
  const [sources, setSources] = useState<PriceSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const purities = selectedMetal === 'GOLD' ? GOLD_PURITIES : SILVER_PURITIES;
  
  useEffect(() => {
    loadPrices();
  }, [selectedMetal, selectedPurity]);
  
  const loadPrices = async () => {
    setIsLoading(true);
    
    // 시뮬레이션 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 더미 데이터
    const basePrice = selectedMetal === 'GOLD' 
      ? selectedPurity.ratio * 268000
      : selectedPurity.ratio * 1220;
    
    const dummySources: PriceSource[] = [
      {
        id: '1',
        name: '한국금거래소',
        buyPrice: basePrice,
        sellPrice: basePrice * 0.97,
        spread: 3,
        url: 'https://www.koreagoldx.co.kr',
        lastUpdate: new Date(),
      },
      {
        id: '2',
        name: '서울금거래소',
        buyPrice: basePrice * 1.01,
        sellPrice: basePrice * 0.965,
        spread: 4.5,
        url: '#',
        lastUpdate: new Date(),
      },
      {
        id: '3',
        name: '금방(Goldn)',
        buyPrice: basePrice * 0.995,
        sellPrice: basePrice * 0.975,
        spread: 2,
        url: 'https://goldn.co.kr',
        lastUpdate: new Date(),
        isBest: true,
      },
      {
        id: '4',
        name: '종로금은방',
        buyPrice: basePrice * 1.02,
        sellPrice: basePrice * 0.96,
        spread: 6,
        url: '#',
        lastUpdate: new Date(),
      },
    ].sort((a, b) => a.buyPrice - b.buyPrice);
    
    // 최저가 표시
    if (dummySources.length > 0) {
      dummySources[0].isBest = true;
    }
    
    setSources(dummySources);
    setIsLoading(false);
  };
  
  return (
    <main className="min-h-screen bg-gray-50 pb-6">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-bold text-lg">시세 비교</h1>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* 설명 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
          <p className="text-sm text-blue-700">
            여러 거래소의 금/은 시세를 비교해 보세요. 
            <span className="font-semibold"> 같은 순도라도 업체마다 가격이 다릅니다!</span>
          </p>
        </div>
        
        {/* 금속 선택 */}
        <div className="flex gap-2">
          {(['GOLD', 'SILVER'] as Metal[]).map((metal) => (
            <button
              key={metal}
              onClick={() => {
                setSelectedMetal(metal);
                setSelectedPurity(metal === 'GOLD' ? GOLD_PURITIES[0] : SILVER_PURITIES[0]);
              }}
              className={cn(
                "flex-1 py-3 rounded-xl font-semibold transition-all btn-press",
                selectedMetal === metal
                  ? metal === 'GOLD'
                    ? "bg-amber-500 text-white"
                    : "bg-slate-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              )}
            >
              {metal === 'GOLD' ? '금 (Gold)' : '은 (Silver)'}
            </button>
          ))}
        </div>
        
        {/* 순도 선택 */}
        <div className="flex flex-wrap gap-2">
          {purities.map((purity) => (
            <button
              key={purity.id}
              onClick={() => setSelectedPurity(purity)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedPurity.id === purity.id
                  ? "bg-amber-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              )}
            >
              {purity.shortName}
            </button>
          ))}
        </div>
        
        {/* 가격 목록 */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((source, i) => (
              <PriceSourceCard 
                key={source.id} 
                source={source} 
                rank={i + 1}
              />
            ))}
          </div>
        )}
        
        {/* 새로고침 */}
        <button
          onClick={loadPrices}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          시세 새로고침
        </button>
        
        {/* 안내 */}
        <p className="text-xs text-gray-400 text-center px-4">
          시세 정보는 참고용이며, 실제 거래 시 각 업체에 확인하시기 바랍니다.
        </p>
      </div>
    </main>
  );
}

function PriceSourceCard({ source, rank }: { source: PriceSource; rank: number }) {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-5 shadow-sm transition-all",
      source.isBest && "ring-2 ring-amber-400"
    )}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
            rank === 1 ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"
          )}>
            {rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-800">{source.name}</h3>
              {source.isBest && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-xs font-semibold rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  최저가
                </span>
              )}
            </div>
          </div>
        </div>
        
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      {/* 가격 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">매수가 (살 때)</p>
          <p className="font-bold text-red-500 text-lg">{formatPrice(source.buyPrice)}/g</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">매도가 (팔 때)</p>
          <p className="font-bold text-blue-500 text-lg">{formatPrice(source.sellPrice)}/g</p>
        </div>
      </div>
      
      {/* 스프레드 */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">스프레드</span>
        <span className={cn(
          "font-semibold text-sm",
          source.spread <= 3 ? "text-green-600" : source.spread <= 5 ? "text-amber-600" : "text-red-600"
        )}>
          {source.spread}%
        </span>
      </div>
    </div>
  );
}
