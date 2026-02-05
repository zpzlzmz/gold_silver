import { Price, PriceDataPoint, GoldStore, GOLD_PURITIES, SILVER_PURITIES, Metal } from './types';

// 환경 변수
const DATA_GO_KR_API_KEY = process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY || '';
const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || '';

// 기본 시세 (API 실패 시 폴백)
const FALLBACK_GOLD_PRICE = 265333;
const FALLBACK_SILVER_PRICE = 1250;

// 금 시세 API 호출
export async function fetchGoldPrices(): Promise<Price[]> {
  try {
    if (DATA_GO_KR_API_KEY && DATA_GO_KR_API_KEY !== 'YOUR_API_KEY') {
      // 공공데이터포털 API 호출
      const response = await fetch(
        `https://apis.data.go.kr/1160100/service/GetGeneralProductInfoService/getGoldPriceInfo?serviceKey=${DATA_GO_KR_API_KEY}&numOfRows=100&resultType=json`
      );
      
      if (response.ok) {
        const data = await response.json();
        const items = data?.response?.body?.items?.item;
        
        if (items && items.length > 0) {
          // 금 1kg 데이터에서 g당 가격 계산
          const gold1kg = items.find((item: any) => item.itmsNm?.includes('1kg'));
          if (gold1kg) {
            const pricePerGram = parseFloat(gold1kg.clpr?.replace(/,/g, '') || '0') / 1000;
            const changePercent = parseFloat(gold1kg.fltRt || '0');
            const changeAmount = parseFloat(gold1kg.vs?.replace(/,/g, '') || '0') / 1000;
            
            return generatePrices(pricePerGram, changePercent, changeAmount);
          }
        }
      }
    }
  } catch (error) {
    console.error('금 시세 API 호출 실패:', error);
  }
  
  // 폴백 데이터 반환
  return generatePrices(FALLBACK_GOLD_PRICE, 1.22, 3200);
}

// 가격 데이터 생성
function generatePrices(goldBasePrice: number, changePercent: number, changeAmount: number): Price[] {
  const prices: Price[] = [];
  
  // 금 시세
  GOLD_PURITIES.forEach(purity => {
    prices.push({
      metal: 'GOLD',
      purity,
      buyPrice: goldBasePrice * purity.ratio,
      sellPrice: goldBasePrice * purity.ratio * 0.97,
      changeAmount: changeAmount * purity.ratio,
      changePercent,
      timestamp: new Date(),
    });
  });
  
  // 은 시세 (금 대비 약 1:212 비율)
  const silverBasePrice = goldBasePrice / 212;
  SILVER_PURITIES.forEach(purity => {
    prices.push({
      metal: 'SILVER',
      purity,
      buyPrice: silverBasePrice * purity.ratio,
      sellPrice: silverBasePrice * purity.ratio * 0.94,
      changeAmount: (changeAmount / 212) * purity.ratio,
      changePercent,
      timestamp: new Date(),
    });
  });
  
  return prices;
}

// 차트 데이터 가져오기
// intervalType: 'week' = 1주 간격, 'month' = 1개월 간격, '3month' = 3개월 간격, 'year' = 1년 간격
export async function fetchPriceHistory(metal: Metal, intervalType: string): Promise<PriceDataPoint[]> {
  // 시뮬레이션 데이터 생성
  const basePrice = metal === 'GOLD' ? FALLBACK_GOLD_PRICE : FALLBACK_SILVER_PRICE;
  const variance = metal === 'GOLD' ? 5000 : 50;
  
  const dataPoints: PriceDataPoint[] = [];
  const now = new Date();
  
  let numPoints: number;
  let getDate: (index: number) => Date;
  let formatDate: (date: Date) => string;
  
  switch (intervalType) {
    case 'week':
      // 1주 간격, 12주 데이터
      numPoints = 12;
      getDate = (i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (numPoints - 1 - i) * 7);
        return d;
      };
      formatDate = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
      break;
      
    case 'month':
      // 1개월 간격, 12개월 데이터
      numPoints = 12;
      getDate = (i) => {
        const d = new Date(now);
        d.setMonth(d.getMonth() - (numPoints - 1 - i));
        return d;
      };
      formatDate = (d) => `${d.getMonth() + 1}월`;
      break;
      
    case '3month':
      // 3개월 간격, 8분기 데이터 (2년)
      numPoints = 8;
      getDate = (i) => {
        const d = new Date(now);
        d.setMonth(d.getMonth() - (numPoints - 1 - i) * 3);
        return d;
      };
      formatDate = (d) => `${d.getFullYear().toString().slice(2)}.${d.getMonth() + 1}월`;
      break;
      
    case 'year':
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
    
    // 변동성 시뮬레이션 (시간에 따른 사이클)
    const variation = Math.sin(i * 0.8) * variance + (Math.random() - 0.5) * variance;
    const price = basePrice + variation;
    
    dataPoints.push({
      date: formatDate(date),
      price: Math.round(price),
      high: Math.round(price + variance * 0.1),
      low: Math.round(price - variance * 0.1),
    });
  }
  
  return dataPoints;
}

// 주변 금은방 검색
export async function searchNearbyStores(
  latitude: number,
  longitude: number
): Promise<GoldStore[]> {
  try {
    if (KAKAO_REST_API_KEY && KAKAO_REST_API_KEY !== 'YOUR_API_KEY') {
      const keywords = ['금은방', '귀금속', '금거래소'];
      const allStores: GoldStore[] = [];
      const seenIds = new Set<string>();
      
      for (const keyword of keywords) {
        const response = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}&x=${longitude}&y=${latitude}&radius=5000&sort=distance`,
          {
            headers: {
              Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          
          data.documents?.forEach((place: any) => {
            if (place.id && !seenIds.has(place.id)) {
              seenIds.add(place.id);
              
              const now = new Date();
              const hour = now.getHours();
              const isOpen = hour >= 10 && hour < 19;
              
              allStores.push({
                id: place.id,
                name: place.place_name,
                address: place.road_address_name || place.address_name,
                phone: place.phone || '전화번호 없음',
                distance: formatDistance(place.distance),
                latitude: parseFloat(place.y),
                longitude: parseFloat(place.x),
                rating: 4 + (parseInt(place.id) % 10) / 10,
                reviewCount: Math.max(10, parseInt(place.id) % 500),
                isOpen,
                openTime: '10:00 - 19:00',
                isPartner: false,
                placeUrl: place.place_url,
              });
            }
          });
        }
      }
      
      return allStores.sort((a, b) => {
        const distA = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
        const distB = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
        return distA - distB;
      });
    }
  } catch (error) {
    console.error('카카오 API 호출 실패:', error);
  }
  
  // 폴백 데이터
  return getFallbackStores();
}

function formatDistance(meters: string): string {
  const m = parseInt(meters);
  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`;
}

function getFallbackStores(): GoldStore[] {
  return [
    {
      id: '1',
      name: '골드앤 종로본점',
      address: '서울 종로구 종로3가 125-1',
      phone: '02-2266-1234',
      distance: '0.3km',
      latitude: 37.5704,
      longitude: 126.9922,
      rating: 4.8,
      reviewCount: 328,
      isOpen: true,
      openTime: '10:00 - 19:00',
      isPartner: true,
    },
    {
      id: '2',
      name: '한국금거래소 종로점',
      address: '서울 종로구 종로 128',
      phone: '02-2278-5678',
      distance: '0.5km',
      latitude: 37.5700,
      longitude: 126.9850,
      rating: 4.6,
      reviewCount: 245,
      isOpen: true,
      openTime: '09:30 - 18:30',
      isPartner: false,
    },
    {
      id: '3',
      name: '순금마을 강남점',
      address: '서울 강남구 테헤란로 123',
      phone: '02-555-9012',
      distance: '2.1km',
      latitude: 37.5012,
      longitude: 127.0396,
      rating: 4.5,
      reviewCount: 189,
      isOpen: true,
      openTime: '10:00 - 20:00',
      isPartner: false,
    },
    {
      id: '4',
      name: '프리미엄골드 명동점',
      address: '서울 중구 명동길 45',
      phone: '02-776-3456',
      distance: '1.2km',
      latitude: 37.5636,
      longitude: 126.9869,
      rating: 4.7,
      reviewCount: 412,
      isOpen: false,
      openTime: '10:00 - 19:00',
      isPartner: false,
    },
  ];
}
