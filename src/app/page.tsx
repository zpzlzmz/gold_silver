'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Settings, LogIn, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { PriceCard, SimplePriceItem } from '@/components/PriceCard';
import { PriceChart, PeriodSelector, UnitSelector } from '@/components/PriceChart';
import { QuickActions, GoldnShoppingBanner } from '@/components/QuickActions';
import { fetchGoldPrices, fetchPriceHistory } from '@/lib/api';
import { Price, PriceDataPoint, GOLD_PURITIES, SILVER_PURITIES } from '@/lib/types';
import { storage, cn } from '@/lib/utils';

export default function HomePage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [chartData, setChartData] = useState<PriceDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // 'week', 'month', '3month', 'year'
  const [selectedUnit, setSelectedUnit] = useState<'g' | 'don'>('don');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    loadData();
    // 로그인 상태 확인
    setIsLoggedIn(storage.get('isLoggedIn', false));
  }, []);
  
  useEffect(() => {
    loadChartData();
  }, [selectedPeriod]);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const priceData = await fetchGoldPrices();
      setPrices(priceData);
      
      const history = await fetchPriceHistory('GOLD', selectedPeriod);
      setChartData(history);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadChartData = async () => {
    try {
      const history = await fetchPriceHistory('GOLD', selectedPeriod);
      setChartData(history);
    } catch (error) {
      console.error('차트 데이터 로드 실패:', error);
    }
  };
  
  const goldPrice = prices.find(p => p.purity.id === 'gold_24k');
  const silverPrice = prices.find(p => p.purity.id === 'silver_999');
  
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <h1 className="font-bold text-lg">
              <span className="text-amber-500">Gold</span>
              <span className="text-slate-500">Silver</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href="/alerts"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </Link>
            <Link
              href="/settings"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* 로그인 배너 */}
        {!isLoggedIn && (
          <Link
            href="/login"
            className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center">
                <LogIn className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">로그인하고 시작하세요</p>
                <p className="text-xs text-gray-500">테스트: test@test.com / 1234</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        )}
        
        {/* 메인 가격 카드 */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {goldPrice && (
              <PriceCard 
                price={goldPrice} 
                unit={selectedUnit}
                onClick={() => {}}
              />
            )}
            {silverPrice && (
              <PriceCard 
                price={silverPrice} 
                unit={selectedUnit}
                onClick={() => {}}
              />
            )}
          </div>
        )}
        
        {/* 단위/기간 선택 */}
        <div className="flex items-center justify-between">
          <UnitSelector selected={selectedUnit} onSelect={setSelectedUnit} />
          <PeriodSelector selected={selectedPeriod} onSelect={setSelectedPeriod} />
        </div>
        
        {/* 차트 */}
        {chartData.length > 0 && (
          <PriceChart 
            data={chartData} 
            metal="GOLD" 
            unit={selectedUnit}
            intervalType={selectedPeriod}
          />
        )}
        
        {/* 빠른 메뉴 */}
        <QuickActions />
        
        {/* 골드앤 쇼핑 배너 */}
        <GoldnShoppingBanner />
        
        {/* 순도별 가격 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">순도별 시세</h3>
          
          {/* 금 */}
          <div className="mb-4">
            <p className="text-sm text-amber-600 font-semibold mb-2">금 (Gold)</p>
            <div className="space-y-2">
              {prices
                .filter(p => p.metal === 'GOLD')
                .map(p => (
                  <SimplePriceItem
                    key={p.purity.id}
                    label={p.purity.name}
                    price={p.buyPrice}
                    unit={selectedUnit}
                    isGold={true}
                  />
                ))}
            </div>
          </div>
          
          {/* 은 */}
          <div>
            <p className="text-sm text-slate-600 font-semibold mb-2">은 (Silver)</p>
            <div className="space-y-2">
              {prices
                .filter(p => p.metal === 'SILVER')
                .map(p => (
                  <SimplePriceItem
                    key={p.purity.id}
                    label={p.purity.name}
                    price={p.buyPrice}
                    unit={selectedUnit}
                    isGold={false}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단 네비게이션 */}
      <BottomNav />
    </main>
  );
}
