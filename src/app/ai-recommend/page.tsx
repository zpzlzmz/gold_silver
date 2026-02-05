'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  action: 'buy' | 'sell' | 'hold';
  reasoning: string[];
  targetPrice?: number;
  riskLevel: 'low' | 'medium' | 'high';
  metal: 'GOLD' | 'SILVER';
  timestamp: Date;
}

interface MarketIndicator {
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export default function AiRecommendPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [indicators, setIndicators] = useState<MarketIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadRecommendations();
  }, []);
  
  const loadRecommendations = async () => {
    setIsLoading(true);
    
    // 시뮬레이션 데이터
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRecommendations([
      {
        id: '1',
        title: '금 매수 추천',
        description: '단기 상승 모멘텀이 강화되고 있습니다.',
        confidence: 78,
        action: 'buy',
        reasoning: [
          '글로벌 인플레이션 우려 지속',
          '달러 약세 전망',
          '중앙은행 금 매수 증가',
          '지정학적 리스크 확대',
        ],
        targetPrice: 275000,
        riskLevel: 'medium',
        metal: 'GOLD',
        timestamp: new Date(),
      },
      {
        id: '2',
        title: '은 관망 추천',
        description: '변동성이 높아 관망을 권장합니다.',
        confidence: 62,
        action: 'hold',
        reasoning: [
          '산업 수요 불확실성',
          '금/은 비율 고점 근접',
          '단기 조정 가능성',
        ],
        targetPrice: 1300,
        riskLevel: 'high',
        metal: 'SILVER',
        timestamp: new Date(),
      },
    ]);
    
    setIndicators([
      { name: '달러 인덱스', value: '103.2', change: -0.3, trend: 'down' },
      { name: '국제 금 시세', value: '$2,042', change: 1.2, trend: 'up' },
      { name: '금/은 비율', value: '85.4', change: -0.8, trend: 'down' },
      { name: 'VIX 지수', value: '14.2', change: 2.1, trend: 'up' },
    ]);
    
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
          <h1 className="font-bold text-lg">AI 투자 추천</h1>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* AI 헤더 */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-bold text-xl">AI 분석 리포트</h2>
              <p className="text-purple-200 text-sm">
                {new Date().toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 기준
              </p>
            </div>
          </div>
          
          <p className="text-purple-100 text-sm">
            시장 데이터와 기술적 분석을 바탕으로 투자 인사이트를 제공합니다.
          </p>
          
          <button
            onClick={loadRecommendations}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            분석 갱신
          </button>
        </div>
        
        {/* 시장 지표 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">주요 시장 지표</h3>
          <div className="grid grid-cols-2 gap-3">
            {indicators.map((ind) => (
              <div key={ind.name} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{ind.name}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">{ind.value}</span>
                  <span className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    ind.trend === 'up' ? "text-red-500" : "text-blue-500"
                  )}>
                    {ind.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(ind.change)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 추천 목록 */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        )}
        
        {/* 면책 조항 */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700">
              <p className="font-semibold mb-1">투자 유의사항</p>
              <p>
                AI 추천은 참고용이며, 투자 결정은 본인의 판단과 책임 하에 
                이루어져야 합니다. 과거 실적이 미래 수익을 보장하지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function RecommendationCard({ recommendation: rec }: { recommendation: Recommendation }) {
  const actionColors = {
    buy: 'bg-red-500',
    sell: 'bg-blue-500',
    hold: 'bg-gray-500',
  };
  
  const actionLabels = {
    buy: '매수',
    sell: '매도',
    hold: '관망',
  };
  
  const riskLabels = {
    low: '낮음',
    medium: '보통',
    high: '높음',
  };
  
  const riskColors = {
    low: 'text-green-600',
    medium: 'text-amber-600',
    high: 'text-red-600',
  };
  
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-3 py-1.5 rounded-lg text-white text-sm font-bold",
            actionColors[rec.action]
          )}>
            {actionLabels[rec.action]}
          </span>
          <div>
            <h3 className="font-bold text-gray-800">{rec.title}</h3>
            <p className="text-sm text-gray-500">{rec.description}</p>
          </div>
        </div>
      </div>
      
      {/* 신뢰도 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">신뢰도</span>
          <span className="font-semibold text-purple-600">{rec.confidence}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
            style={{ width: `${rec.confidence}%` }}
          />
        </div>
      </div>
      
      {/* 분석 근거 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">분석 근거</p>
        <ul className="space-y-1.5">
          {rec.reasoning.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-purple-500 mt-0.5">•</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
      
      {/* 추가 정보 */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {rec.targetPrice && (
            <div>
              <span className="text-gray-500">목표가</span>
              <span className="ml-1 font-semibold text-gray-700">
                ₩{rec.targetPrice.toLocaleString()}/g
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">위험도</span>
          <span className={cn("font-semibold", riskColors[rec.riskLevel])}>
            {riskLabels[rec.riskLevel]}
          </span>
        </div>
      </div>
    </div>
  );
}
