// 금속 타입
export type Metal = 'GOLD' | 'SILVER';

// 순도 타입
export interface Purity {
  id: string;
  name: string;
  shortName: string;
  ratio: number;
  metal: Metal;
}

// 금 순도
export const GOLD_PURITIES: Purity[] = [
  { id: 'gold_24k', name: '24K 순금 (99.9%)', shortName: '24K 순금', ratio: 1.0, metal: 'GOLD' },
  { id: 'gold_18k', name: '18K 금 (75%)', shortName: '18K', ratio: 0.75, metal: 'GOLD' },
  { id: 'gold_14k', name: '14K 금 (58.5%)', shortName: '14K', ratio: 0.585, metal: 'GOLD' },
];

// 은 순도
export const SILVER_PURITIES: Purity[] = [
  { id: 'silver_999', name: '순은 (99.9%)', shortName: '순은', ratio: 1.0, metal: 'SILVER' },
  { id: 'silver_925', name: '스털링실버 (92.5%)', shortName: '스털링', ratio: 0.925, metal: 'SILVER' },
];

// 가격 정보
export interface Price {
  metal: Metal;
  purity: Purity;
  buyPrice: number;
  sellPrice: number;
  changeAmount: number;
  changePercent: number;
  timestamp?: Date;
}

// 차트 데이터 포인트
export interface PriceDataPoint {
  date: string;
  price: number;
  high?: number;
  low?: number;
}

// 거래 타입
export type TradeType = 'BUY' | 'SELL';

// 거래 기록
export interface Trade {
  id: string;
  metal: Metal;
  purity: Purity;
  type: TradeType;
  quantity: number;
  pricePerGram: number;
  totalAmount: number;
  vat: number;
  finalAmount: number;
  note?: string;
  tradedAt: Date;
}

// 보유 자산
export interface Holding {
  metal: Metal;
  purity: Purity;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

// 금은방 정보
export interface GoldStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openTime: string;
  isPartner: boolean;
  placeUrl?: string;
}

// 사용자 정보
export interface User {
  id: string;
  name: string;
  email: string;
}
