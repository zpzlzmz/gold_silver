'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { PriceChart, PeriodSelector, UnitSelector } from '@/components/PriceChart';
import { fetchGoldPrices, fetchPriceHistory } from '@/lib/api';
import { Price, PriceDataPoint, GOLD_PURITIES, SILVER_PURITIES, Metal, Purity, TradeType } from '@/lib/types';
import { formatPrice, cn, storage } from '@/lib/utils';

export default function TradePage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [chartData, setChartData] = useState<PriceDataPoint[]>([]);
  const [selectedMetal, setSelectedMetal] = useState<Metal>('GOLD');
  const [selectedPurity, setSelectedPurity] = useState<Purity>(GOLD_PURITIES[0]);
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // 'week', 'month', '3month', 'year'
  const [selectedUnit, setSelectedUnit] = useState<'g' | 'don'>('don');
  const [tradeType, setTradeType] = useState<TradeType>('BUY');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // 보유량 (더미)
  const holdings = storage.get<Record<string, number>>('holdings', {
    'gold_24k': 25.5,
    'gold_18k': 10,
    'silver_999': 100,
  });
  const currentHolding = holdings[selectedPurity.id] || 0;
  
  const purities = selectedMetal === 'GOLD' ? GOLD_PURITIES : SILVER_PURITIES;
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    loadChartData();
  }, [selectedMetal, selectedPeriod]);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const priceData = await fetchGoldPrices();
      setPrices(priceData);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadChartData = async () => {
    try {
      const history = await fetchPriceHistory(selectedMetal, selectedPeriod);
      setChartData(history);
    } catch (error) {
      console.error('차트 데이터 로드 실패:', error);
    }
  };
  
  const handleMetalChange = (metal: Metal) => {
    setSelectedMetal(metal);
    setSelectedPurity(metal === 'GOLD' ? GOLD_PURITIES[0] : SILVER_PURITIES[0]);
    setQuantity('');
  };
  
  const handleQuantityChange = (value: string) => {
    // 숫자와 소수점만 허용
    const filtered = value.replace(/[^\d.]/g, '');
    
    // 매도 시 보유량 초과 방지
    if (tradeType === 'SELL' && currentHolding > 0) {
      const num = parseFloat(filtered) || 0;
      if (num > currentHolding) {
        setQuantity(currentHolding.toString());
        return;
      }
    }
    
    setQuantity(filtered);
  };
  
  // 가격 계산
  const currentPrice = prices.find(p => p.purity.id === selectedPurity.id);
  const pricePerUnit = currentPrice 
    ? (tradeType === 'BUY' ? currentPrice.buyPrice : currentPrice.sellPrice) 
      * (selectedUnit === 'don' ? 3.75 : 1)
    : 0;
  const quantityNum = parseFloat(quantity) || 0;
  const totalAmount = quantityNum * pricePerUnit;
  const vat = tradeType === 'BUY' ? totalAmount * 0.1 : 0;
  const finalAmount = totalAmount + vat;
  
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <h1 className="font-bold text-lg">거래</h1>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* 금속 선택 */}
        <div className="flex gap-2">
          {(['GOLD', 'SILVER'] as Metal[]).map((metal) => (
            <button
              key={metal}
              onClick={() => handleMetalChange(metal)}
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
              onClick={() => {
                setSelectedPurity(purity);
                setQuantity('');
              }}
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
        
        {/* 차트 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <UnitSelector selected={selectedUnit} onSelect={setSelectedUnit} />
            <PeriodSelector selected={selectedPeriod} onSelect={setSelectedPeriod} />
          </div>
          {chartData.length > 0 && (
            <PriceChart 
              data={chartData} 
              metal={selectedMetal} 
              unit={selectedUnit}
              intervalType={selectedPeriod}
            />
          )}
        </div>
        
        {/* 거래 유형 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex gap-2 mb-4">
            {(['BUY', 'SELL'] as TradeType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTradeType(type);
                  setQuantity('');
                }}
                className={cn(
                  "flex-1 py-3 rounded-xl font-semibold transition-all",
                  tradeType === type
                    ? type === 'BUY'
                      ? "bg-red-500 text-white"
                      : "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {type === 'BUY' ? '매수' : '매도'}
              </button>
            ))}
          </div>
          
          {/* 매도 시 보유량 표시 */}
          {tradeType === 'SELL' && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedPurity.shortName} 보유량
                </span>
                <span className="font-bold text-blue-700">
                  {currentHolding.toFixed(2)} {selectedUnit === 'don' ? '돈' : 'g'}
                </span>
              </div>
            </div>
          )}
          
          {/* 수량 입력 */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-2 block">
              수량 ({selectedUnit === 'don' ? '돈' : 'g'})
            </label>
            <div className="relative">
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
              />
              {tradeType === 'SELL' && currentHolding > 0 && (
                <button
                  onClick={() => setQuantity(currentHolding.toString())}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  전량
                </button>
              )}
            </div>
          </div>
          
          {/* 가격 정보 */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                {tradeType === 'BUY' ? '매수' : '매도'}가
              </span>
              <span className="font-medium">
                {formatPrice(pricePerUnit)} / {selectedUnit === 'don' ? '돈' : 'g'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">금액</span>
              <span className="font-medium">{formatPrice(totalAmount)}</span>
            </div>
            {tradeType === 'BUY' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">부가세 (10%)</span>
                <span className="font-medium">{formatPrice(vat)}</span>
              </div>
            )}
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span className="font-bold">총 금액</span>
              <span className={cn(
                "font-bold text-lg",
                tradeType === 'BUY' ? "text-red-500" : "text-blue-500"
              )}>
                {formatPrice(finalAmount)}
              </span>
            </div>
          </div>
          
          {/* 거래 버튼 */}
          <button
            disabled={quantityNum <= 0}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all btn-press",
              quantityNum > 0
                ? tradeType === 'BUY'
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {tradeType === 'BUY' ? '매수하기' : '매도하기'}
          </button>
        </div>
      </div>
      
      <BottomNav />
    </main>
  );
}
