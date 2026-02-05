import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 가격 포맷팅
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price);
}

// 숫자 포맷팅 (원 단위 없이)
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}

// 퍼센트 포맷팅
export function formatPercent(percent: number): string {
  const prefix = percent >= 0 ? '+' : '';
  return `${prefix}${percent.toFixed(2)}%`;
}

// 날짜 포맷팅
export function formatDate(date: Date, format: 'full' | 'short' | 'time' = 'short'): string {
  const options: Intl.DateTimeFormatOptions = 
    format === 'full' 
      ? { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      : format === 'short'
      ? { month: 'numeric', day: 'numeric' }
      : { hour: '2-digit', minute: '2-digit' };
  
  return new Intl.DateTimeFormat('ko-KR', options).format(date);
}

// g -> 돈 변환
export function gramToDon(gram: number): number {
  return gram / 3.75;
}

// 돈 -> g 변환
export function donToGram(don: number): number {
  return don * 3.75;
}

// 로컬스토리지 헬퍼
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};
