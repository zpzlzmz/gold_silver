'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Navigation, Star, Clock, ExternalLink } from 'lucide-react';
import { searchNearbyStores } from '@/lib/api';
import { GoldStore } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function StoresPage() {
  const [stores, setStores] = useState<GoldStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAddress, setCurrentAddress] = useState('서울 종로구 종로3가');
  
  useEffect(() => {
    loadStores();
  }, []);
  
  const loadStores = async () => {
    setIsLoading(true);
    try {
      // 기본 위치: 종로3가
      const data = await searchNearbyStores(37.5704, 126.9922);
      setStores(data);
    } catch (error) {
      console.error('매장 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50 pb-6">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-bold text-lg">주변 금은방</h1>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* 현재 위치 */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/80">현재 위치</p>
              <p className="font-bold text-lg">{currentAddress}</p>
            </div>
            <button className="px-4 py-2 bg-white text-green-600 rounded-xl font-semibold text-sm">
              변경
            </button>
          </div>
        </div>
        
        {/* 검색 결과 */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800">검색 결과</h2>
          <span className="text-sm text-gray-500">{stores.length}개 매장</span>
        </div>
        
        {/* 매장 목록 */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StoreCard({ store }: { store: GoldStore }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* 상단 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-800">{store.name}</h3>
            {store.isPartner && (
              <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded">
                파트너
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-medium text-gray-700">{store.rating.toFixed(1)}</span>
              <span>({store.reviewCount})</span>
            </div>
            <span>•</span>
            <span>{store.distance}</span>
          </div>
        </div>
        
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-semibold",
          store.isOpen 
            ? "bg-green-100 text-green-600" 
            : "bg-red-100 text-red-600"
        )}>
          {store.isOpen ? '영업중' : '영업종료'}
        </span>
      </div>
      
      {/* 정보 */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{store.address}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{store.openTime || '영업시간 정보 없음'}</span>
        </div>
        {store.phone && store.phone !== '전화번호 없음' && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{store.phone}</span>
          </div>
        )}
      </div>
      
      {/* 버튼 */}
      <div className="flex gap-2">
        <a
          href={`tel:${store.phone}`}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium transition-colors",
            store.phone && store.phone !== '전화번호 없음'
              ? "text-gray-700 hover:bg-gray-50"
              : "text-gray-300 cursor-not-allowed"
          )}
        >
          <Phone className="w-4 h-4" />
          전화
        </a>
        
        <a
          href={`https://map.kakao.com/link/to/${store.name},${store.latitude},${store.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          길찾기
        </a>
        
        {store.placeUrl ? (
          <a
            href={store.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors",
              store.isPartner
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            )}
          >
            <ExternalLink className="w-4 h-4" />
            상세
          </a>
        ) : (
          <button
            disabled={!store.isOpen}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors",
              store.isOpen
                ? store.isPartner
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            예약
          </button>
        )}
      </div>
    </div>
  );
}
