'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GOLD_PURITIES, SILVER_PURITIES, Metal, Purity } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';

export default function CalculatorPage() {
  const [selectedMetal, setSelectedMetal] = useState<Metal>('GOLD');
  const [selectedPurity, setSelectedPurity] = useState<Purity>(GOLD_PURITIES[0]);
  const [selectedUnit, setSelectedUnit] = useState<'g' | 'don'>('don');
  const [quantity, setQuantity] = useState('');
  const [pricePerGram, setPricePerGram] = useState('265333');
  
  const purities = selectedMetal === 'GOLD' ? GOLD_PURITIES : SILVER_PURITIES;
  
  // 계산
  const quantityNum = parseFloat(quantity) || 0;
  const priceNum = parseFloat(pricePerGram) || 0;
  const quantityInGrams = selectedUnit === 'don' ? quantityNum * 3.75 : quantityNum;
  const purityPrice = priceNum * selectedPurity.ratio;
  const totalPrice = quantityInGrams * purityPrice;
  const vat = totalPrice * 0.1;
  const finalPrice = totalPrice + vat;
  
  const handleMetalChange = (metal: Metal) => {
    setSelectedMetal(metal);
    setSelectedPurity(metal === 'GOLD' ? GOLD_PURITIES[0] : SILVER_PURITIES[0]);
    setPricePerGram(metal === 'GOLD' ? '265333' : '1250');
  };
  
  return (
    <main className="min-h-screen bg-gray-50 pb-6">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-bold text-lg">계산기</h1>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* 금속 선택 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">금속 선택</p>
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
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {metal === 'GOLD' ? '금' : '은'}
              </button>
            ))}
          </div>
          
          <p className="text-sm text-gray-500 mt-4 mb-3">순도</p>
          <div className="flex flex-wrap gap-2">
            {purities.map((purity) => (
              <button
                key={purity.id}
                onClick={() => setSelectedPurity(purity)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedPurity.id === purity.id
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {purity.shortName}
              </button>
            ))}
          </div>
          
          <p className="text-sm text-gray-500 mt-4 mb-3">단위</p>
          <div className="flex gap-2">
            {(['don', 'g'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedUnit === unit
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {unit === 'don' ? '돈' : 'g'}
              </button>
            ))}
          </div>
        </div>
        
        {/* 입력 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              수량 ({selectedUnit === 'don' ? '돈' : 'g'})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              기준 단가 (원/g) - 순금 기준
            </label>
            <input
              type="number"
              value={pricePerGram}
              onChange={(e) => setPricePerGram(e.target.value)}
              placeholder="현재 시세"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        
        {/* 결과 */}
        <div className="bg-amber-50 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">계산 결과</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">수량</span>
              <span className="font-medium">{quantityInGrams.toFixed(2)}g</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{selectedPurity.shortName} 단가</span>
              <span className="font-medium">{formatPrice(purityPrice)}/g</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">금액</span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">부가세 (10%)</span>
              <span className="font-medium">{formatPrice(vat)}</span>
            </div>
            
            <hr className="border-amber-200" />
            
            <div className="flex justify-between">
              <span className="font-bold text-lg">총 금액</span>
              <span className="font-bold text-lg text-amber-600">
                {formatPrice(finalPrice)}
              </span>
            </div>
          </div>
        </div>
        
        {/* 단위 정보 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-3">단위 환산 정보</h4>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• 1돈 = 3.75g</li>
            <li>• 24K (순금) = 99.9% 순도</li>
            <li>• 18K = 75% 순도 (24K 가격의 75%)</li>
            <li>• 14K = 58.5% 순도 (24K 가격의 58.5%)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
