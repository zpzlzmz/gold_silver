'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Metal } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';

interface StatData {
  label: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
}

export default function StatisticsPage() {
  const [selectedMetal, setSelectedMetal] = useState<Metal>('GOLD');
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);
  const [stats, setStats] = useState<StatData[]>([]);
  
  useEffect(() => {
    loadData();
  }, [selectedMetal, selectedPeriod]);
  
  const loadData = () => {
    // 더미 데이터 생성 (간격 기준)
    const basePrice = selectedMetal === 'GOLD' ? 268000 : 1220;
    const variance = selectedMetal === 'GOLD' ? 5000 : 50;
    const data: { date: string; price: number }[] = [];
    const now = new Date();
    
    let numPoints: number;
    let getDate: (index: number) => Date;
    let formatDate: (date: Date) => string;
    
    switch (selectedPeriod) {
      case '1W':
        // 1주 간격, 12주 데이터
        numPoints = 12;
        getDate = (i) => {
          const d = new Date(now);
          d.setDate(d.getDate() - (numPoints - 1 - i) * 7);
          return d;
        };
        formatDate = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
        break;
        
      case '1M':
        // 1개월 간격, 12개월 데이터
        numPoints = 12;
        getDate = (i) => {
          const d = new Date(now);
          d.setMonth(d.getMonth() - (numPoints - 1 - i));
          return d;
        };
        formatDate = (d) => `${d.getMonth() + 1}월`;
        break;
        
      case '3M':
        // 3개월 간격, 8분기 데이터 (2년)
        numPoints = 8;
        getDate = (i) => {
          const d = new Date(now);
          d.setMonth(d.getMonth() - (numPoints - 1 - i) * 3);
          return d;
        };
        formatDate = (d) => `${d.getFullYear().toString().slice(2)}.${d.getMonth() + 1}월`;
        break;
        
      case '1Y':
        // 1년 간격, 5년 데이터
        numPoints = 5;
        getDate = (i) => {
          const d = new Date(now);
          d.setFullYear(d.getFullYear() - (numPoints - 1 - i));
          return d;
        };
        formatDate = (d) => `${d.getFullYear()}년`;
        break;
        
      default:
        numPoints = 12;
        getDate = (i) => {
          const d = new Date(now);
          d.setMonth(d.getMonth() - (numPoints - 1 - i));
          return d;
        };
        formatDate = (d) => `${d.getMonth() + 1}월`;
    }
    
    for (let i = 0; i < numPoints; i++) {
      const date = getDate(i);
      const variation = Math.sin(i * 0.8) * variance + (Math.random() - 0.5) * variance;
      data.push({
        date: formatDate(date),
        price: Math.round(basePrice + variation),
      });
    }
    
    setChartData(data);
    
    // 통계 계산
    const prices = data.map(d => d.price);
    const currentPrice = prices[prices.length - 1];
    const startPrice = prices[0];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const priceChange = ((currentPrice - startPrice) / startPrice) * 100;
    
    setStats([
      {
        label: '현재가',
        value: formatPrice(currentPrice) + '/g',
        change: priceChange,
        icon: <DollarSign className="w-5 h-5" />,
      },
      {
        label: '평균가',
        value: formatPrice(avgPrice) + '/g',
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        label: '최고가',
        value: formatPrice(maxPrice) + '/g',
        icon: <TrendingUp className="w-5 h-5" />,
      },
      {
        label: '최저가',
        value: formatPrice(minPrice) + '/g',
        icon: <TrendingDown className="w-5 h-5" />,
      },
    ]);
  };
  
  const periods = [
    { id: '1W', label: '1주' },
    { id: '1M', label: '1개월' },
    { id: '3M', label: '3개월' },
    { id: '1Y', label: '1년' },
  ];
  
  return (
    <main className="min-h-screen bg-gray-50 pb-6">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-bold text-lg">시세 통계</h1>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* 금속 선택 */}
        <div className="flex gap-2">
          {(['GOLD', 'SILVER'] as Metal[]).map((metal) => (
            <button
              key={metal}
              onClick={() => setSelectedMetal(metal)}
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
        
        {/* 기간 선택 */}
        <div className="flex gap-2 bg-white rounded-xl p-1.5">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                selectedPeriod === period.id
                  ? "bg-amber-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
        
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div 
              key={stat.label}
              className={cn(
                "bg-white rounded-2xl p-4 shadow-sm",
                i === 0 && "col-span-2"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  selectedMetal === 'GOLD' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                )}>
                  {stat.icon}
                </div>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
              <p className={cn(
                "font-bold",
                i === 0 ? "text-2xl" : "text-lg"
              )}>
                {stat.value}
              </p>
              {stat.change !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 mt-1 text-sm font-medium",
                  stat.change >= 0 ? "text-red-500" : "text-blue-500"
                )}>
                  {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)}%</span>
                  <span className="text-gray-400 font-normal">({selectedPeriod})</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* 차트 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">가격 추이</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={selectedMetal === 'GOLD' ? '#f59e0b' : '#64748b'} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={selectedMetal === 'GOLD' ? '#f59e0b' : '#64748b'} 
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                />
                <Tooltip 
                  formatter={(value: number) => [formatPrice(value), '가격']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={selectedMetal === 'GOLD' ? '#f59e0b' : '#64748b'}
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 시세 변동 히스토리 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">최근 시세 변동</h3>
          <div className="space-y-3">
            {chartData.slice(-5).reverse().map((data, i) => {
              const prevPrice = chartData[chartData.length - i - 2]?.price || data.price;
              const change = ((data.price - prevPrice) / prevPrice) * 100;
              
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{data.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{formatPrice(data.price)}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      change >= 0 ? "text-red-500" : "text-blue-500"
                    )}>
                      {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
