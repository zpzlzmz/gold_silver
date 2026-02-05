# 🪙 금은세상 (GoldSilver)

> 실시간 금/은 시세 확인 및 자산 관리 웹 애플리케이션

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📱 주요 기능

### 💰 시세 확인
- **실시간 금/은 시세** - 공공데이터포털 API 연동
- **순도별 가격** - 24K, 18K, 14K / 순은, 스털링
- **단위 변환** - g ↔ 돈 자유롭게 전환
- **시세 차트** - 1주/1개월/3개월/1년 간격 추이

### 📊 자산 관리
- **포트폴리오** - 보유 자산 현황 및 손익 계산
- **거래 기능** - 매수/매도 시뮬레이션
- **보유량 제한** - 매도 시 보유량 초과 방지

### 🔔 알림 & 분석
- **가격 알림** - 목표가 도달 시 알림
- **AI 투자 추천** - 시장 분석 기반 인사이트
- **시세 비교** - 업체별 가격 비교

### 🏪 부가 기능
- **주변 금은방** - 카카오맵 API 연동
- **계산기** - 금액/부가세 계산
- **다크 모드** - 눈 편한 테마 지원

---

## 🚀 시작하기

### 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/zpzlzmz/goldandsilver.git
cd goldandsilver

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 환경 변수 (선택)

```env
# .env.local
NEXT_PUBLIC_DATA_GO_KR_API_KEY=your_api_key
NEXT_PUBLIC_KAKAO_REST_API_KEY=your_kakao_key
```

> API 키가 없어도 더미 데이터로 동작합니다.

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Hooks |
| API | 공공데이터포털, 카카오 로컬 |

---

## 📁 프로젝트 구조

```
src/
├── app/                    # 페이지 (App Router)
│   ├── page.tsx           # 홈
│   ├── trade/             # 거래
│   ├── portfolio/         # 포트폴리오
│   ├── calculator/        # 계산기
│   ├── stores/            # 주변 매장
│   ├── ai-recommend/      # AI 추천
│   ├── alerts/            # 가격 알림
│   ├── statistics/        # 통계
│   ├── price-compare/     # 시세 비교
│   ├── login/             # 로그인
│   └── settings/          # 설정
├── components/            # 공통 컴포넌트
│   ├── PriceCard.tsx
│   ├── PriceChart.tsx
│   ├── BottomNav.tsx
│   └── QuickActions.tsx
└── lib/                   # 유틸리티
    ├── api.ts            # API 호출
    ├── types.ts          # 타입 정의
    └── utils.ts          # 헬퍼 함수
```

---

## 🔑 테스트 계정

| 항목 | 값 |
|------|-----|
| 이메일 | `test@goldsilver.com` |
| 비밀번호 | `test1234` |

---

## 📝 라이선스

MIT License - 자유롭게 사용하세요!

---

<p align="center">
  Made with ❤️ for Gold & Silver investors
</p>
