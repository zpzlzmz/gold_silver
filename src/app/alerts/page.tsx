'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Bell, BellOff, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { GOLD_PURITIES, SILVER_PURITIES, Purity, Metal } from '@/lib/types';
import { formatPrice, cn, storage } from '@/lib/utils';

interface PriceAlert {
  id: string;
  purity: Purity;
  targetPrice: number;
  direction: 'above' | 'below';
  isEnabled: boolean;
  createdAt: Date;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    const savedAlerts = storage.get<PriceAlert[]>('priceAlerts', []);
    setAlerts(savedAlerts);
  }, []);
  
  const saveAlerts = (newAlerts: PriceAlert[]) => {
    storage.set('priceAlerts', newAlerts);
    setAlerts(newAlerts);
  };
  
  const toggleAlert = (id: string) => {
    const updated = alerts.map(a => 
      a.id === id ? { ...a, isEnabled: !a.isEnabled } : a
    );
    saveAlerts(updated);
  };
  
  const deleteAlert = (id: string) => {
    const updated = alerts.filter(a => a.id !== id);
    saveAlerts(updated);
  };
  
  const addAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    saveAlerts([...alerts, newAlert]);
    setShowModal(false);
  };
  
  return (
    <main className="min-h-screen bg-gray-50 pb-6">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="font-bold text-lg">가격 알림</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Plus className="w-5 h-5 text-amber-500" />
          </button>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* 설명 */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 mb-6 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">목표 가격에 도달하면 알려드려요</h3>
              <p className="text-sm text-gray-600">
                금/은 가격이 설정한 목표에 도달하면 푸시 알림을 보내드립니다.
              </p>
            </div>
          </div>
        </div>
        
        {/* 알림 목록 */}
        {alerts.length === 0 ? (
          <div className="text-center py-20">
            <BellOff className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">설정된 알림이 없습니다</h2>
            <p className="text-gray-500 mb-6">원하는 가격에 알림을 설정해 보세요</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
            >
              알림 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onToggle={() => toggleAlert(alert.id)}
                onDelete={() => deleteAlert(alert.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 알림 추가 모달 */}
      {showModal && (
        <AddAlertModal
          onClose={() => setShowModal(false)}
          onAdd={addAlert}
        />
      )}
    </main>
  );
}

function AlertCard({ 
  alert, 
  onToggle, 
  onDelete 
}: { 
  alert: PriceAlert; 
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-4 shadow-sm transition-opacity",
      !alert.isEnabled && "opacity-60"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            alert.direction === 'above' 
              ? "bg-red-100 text-red-500"
              : "bg-blue-100 text-blue-500"
          )}>
            {alert.direction === 'above' 
              ? <TrendingUp className="w-6 h-6" />
              : <TrendingDown className="w-6 h-6" />
            }
          </div>
          <div>
            <p className="font-bold text-gray-800">{alert.purity.name}</p>
            <p className="text-sm text-gray-500">
              {formatPrice(alert.targetPrice)}/g {alert.direction === 'above' ? '이상' : '이하'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className={cn(
              "w-12 h-7 rounded-full transition-colors relative",
              alert.isEnabled ? "bg-amber-500" : "bg-gray-300"
            )}
          >
            <span className={cn(
              "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform",
              alert.isEnabled ? "translate-x-6" : "translate-x-1"
            )} />
          </button>
          
          <button
            onClick={onDelete}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddAlertModal({ 
  onClose, 
  onAdd 
}: { 
  onClose: () => void;
  onAdd: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
}) {
  const [selectedMetal, setSelectedMetal] = useState<Metal>('GOLD');
  const [selectedPurity, setSelectedPurity] = useState<Purity>(GOLD_PURITIES[0]);
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  
  const purities = selectedMetal === 'GOLD' ? GOLD_PURITIES : SILVER_PURITIES;
  
  const handleSubmit = () => {
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;
    
    onAdd({
      purity: selectedPurity,
      targetPrice: price,
      direction,
      isEnabled: true,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-w-lg mx-auto bg-white rounded-t-3xl p-6 animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">알림 추가</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            닫기
          </button>
        </div>
        
        {/* 금속 선택 */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">금속</label>
          <div className="flex gap-2">
            {(['GOLD', 'SILVER'] as Metal[]).map((metal) => (
              <button
                key={metal}
                onClick={() => {
                  setSelectedMetal(metal);
                  setSelectedPurity(metal === 'GOLD' ? GOLD_PURITIES[0] : SILVER_PURITIES[0]);
                }}
                className={cn(
                  "flex-1 py-2.5 rounded-xl font-medium transition-all",
                  selectedMetal === metal
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {metal === 'GOLD' ? '금' : '은'}
              </button>
            ))}
          </div>
        </div>
        
        {/* 순도 선택 */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">순도</label>
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
        </div>
        
        {/* 방향 선택 */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">알림 조건</label>
          <div className="flex gap-2">
            <button
              onClick={() => setDirection('above')}
              className={cn(
                "flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                direction === 'above'
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              <TrendingUp className="w-4 h-4" />
              이상일 때
            </button>
            <button
              onClick={() => setDirection('below')}
              className={cn(
                "flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                direction === 'below'
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              <TrendingDown className="w-4 h-4" />
              이하일 때
            </button>
          </div>
        </div>
        
        {/* 가격 입력 */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">목표 가격 (원/g)</label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!targetPrice || parseFloat(targetPrice) <= 0}
          className={cn(
            "w-full py-4 rounded-xl font-bold transition-all",
            targetPrice && parseFloat(targetPrice) > 0
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          알림 추가
        </button>
      </div>
    </div>
  );
}
