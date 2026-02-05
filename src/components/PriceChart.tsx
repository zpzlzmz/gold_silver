'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { PriceDataPoint, Metal } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';

interface PriceChartProps {
  data: PriceDataPoint[];
  metal: Metal;
  unit?: 'g' | 'don';
  intervalType?: string;
}

export function PriceChart({ data, metal, unit = 'don', intervalType = 'month' }: PriceChartProps) {
  const multiplier = unit === 'don' ? 3.75 : 1;
  
  // 데이터 변환
  const chartData = data.map(point => ({
    ...point,
    price: Math.round(point.price * multiplier),
  }));
  
  // Y축 범위 계산
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice;
  const padding = Math.max(range * 0.1, minPrice * 0.02); // 최소 2% 패딩
  
  // 가격 범위에 따라 적절한 간격 계산
  const step = maxPrice >= 10000 ? 10000 : maxPrice >= 1000 ? 100 : 10;
  const yMin = Math.floor((minPrice - padding) / step) * step;
  const yMax = Math.ceil((maxPrice + padding) / step) * step;
  
  const chartColor = metal === 'GOLD' ? '#F59E0B' : '#64748B';
  
  // 현재가 및 변동
  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const firstPrice = chartData[0]?.price || currentPrice;
  const priceChange = currentPrice - firstPrice;
  const changePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;
  
  // 간격 라벨
  const intervalLabel = {
    week: '1주 간격',
    month: '1개월 간격',
    '3month': '3개월 간격',
    year: '1년 간격',
  }[intervalType] || '1개월 간격';
  
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800">
            {metal === 'GOLD' ? '금' : '은'} 시세 추이
          </h3>
          <p className="text-xs text-gray-400">
            1{unit === 'don' ? '돈' : 'g'} 기준 · {intervalLabel}
          </p>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-lg font-bold",
            metal === 'GOLD' ? "text-amber-600" : "text-slate-600"
          )}>
            {formatPrice(currentPrice)}
          </p>
          <p className={cn(
            "text-sm font-medium",
            changePercent >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {changePercent >= 0 ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
          </p>
        </div>
      </div>
      
      {/* 최저/최고 */}
      <div className="flex justify-between text-xs mb-2">
        <span className="text-blue-500">
          최저: {formatPrice(Math.min(...prices))}
        </span>
        <span className="text-red-500">
          최고: {formatPrice(Math.max(...prices))}
        </span>
      </div>
      
      {/* 차트 */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${metal}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[yMin, yMax]}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                // 가격 범위에 따라 포맷 변경
                if (value >= 10000) {
                  return `${(value / 10000).toFixed(0)}만`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(1)}천`;
                } else {
                  return `${value}`;
                }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              formatter={(value: number) => [formatPrice(value), '가격']}
              labelFormatter={(label) => `날짜: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fill={`url(#gradient-${metal})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 기간 선택 (간격 기준)
interface PeriodSelectorProps {
  selected: string;
  onSelect: (intervalType: string) => void;
}

export function PeriodSelector({ selected, onSelect }: PeriodSelectorProps) {
  const periods = [
    { type: 'week', label: '1주' },
    { type: 'month', label: '1개월' },
    { type: '3month', label: '3개월' },
    { type: 'year', label: '1년' },
  ];
  
  return (
    <div className="flex gap-2">
      {periods.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            selected === type
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// 단위 선택
interface UnitSelectorProps {
  selected: 'g' | 'don';
  onSelect: (unit: 'g' | 'don') => void;
}

export function UnitSelector({ selected, onSelect }: UnitSelectorProps) {
  return (
    <div className="flex gap-2">
      {(['g', 'don'] as const).map((unit) => (
        <button
          key={unit}
          onClick={() => onSelect(unit)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            selected === unit
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {unit === 'don' ? '돈' : 'g'}
        </button>
      ))}
    </div>
  );
}
