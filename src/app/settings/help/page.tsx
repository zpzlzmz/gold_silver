'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MessageCircle, ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    category: '거래',
    question: '금/은 거래는 어떻게 하나요?',
    answer: '홈 화면 하단의 "거래" 탭을 눌러 매수/매도를 진행할 수 있습니다. 원하는 금속과 순도를 선택한 후 수량을 입력하면 예상 금액이 계산됩니다.',
  },
  {
    id: '2',
    category: '거래',
    question: '매수와 매도 가격이 다른 이유는?',
    answer: '매수가는 구매 시 가격, 매도가는 판매 시 가격입니다. 두 가격의 차이(스프레드)는 거래 업체의 수수료 및 운영비가 반영됩니다.',
  },
  {
    id: '3',
    category: '계정',
    question: '회원가입은 어떻게 하나요?',
    answer: '로그인 화면에서 "회원가입" 버튼을 눌러 이메일과 비밀번호를 입력하면 됩니다. 카카오, 네이버 계정으로도 간편 가입이 가능합니다.',
  },
  {
    id: '4',
    category: '계정',
    question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 화면에서 "비밀번호 찾기"를 눌러 가입 시 사용한 이메일을 입력하면 비밀번호 재설정 링크가 발송됩니다.',
  },
  {
    id: '5',
    category: '시세',
    question: '시세는 얼마나 자주 업데이트되나요?',
    answer: '금/은 시세는 공공데이터포털 API를 통해 매일 업데이트됩니다. 실시간 시세가 아닌 일일 기준 시세입니다.',
  },
  {
    id: '6',
    category: '시세',
    question: '순도별 가격 차이는 왜 있나요?',
    answer: '24K(순금)는 99.9% 순도이고, 18K는 75%, 14K는 58.5%입니다. 순도가 낮을수록 다른 금속이 섞여 있어 가격이 낮습니다.',
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  
  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };
  
  const categories = [...new Set(faqs.map(f => f.category))];
  
  return (
    <main className="min-h-screen bg-gray-50 pb-6">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/settings" className="p-2 -ml-2 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-bold text-lg">고객센터</h1>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* 문의 방법 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">문의하기</h2>
          
          <div className="space-y-3">
            <a 
              href="tel:02-1234-5678"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">전화 상담</p>
                <p className="text-sm text-gray-500">02-1234-5678</p>
              </div>
            </a>
            
            <a 
              href="mailto:support@goldsilver.com"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">이메일 문의</p>
                <p className="text-sm text-gray-500">support@goldsilver.com</p>
              </div>
            </a>
            
            <button 
              className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl text-left"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">카카오톡 상담</p>
                <p className="text-sm text-gray-500">@goldsilver</p>
              </div>
            </button>
          </div>
          
          {/* 운영시간 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>평일 09:00 - 18:00 (주말/공휴일 휴무)</span>
            </div>
          </div>
        </div>
        
        {/* FAQ */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">자주 묻는 질문</h2>
          
          {categories.map(category => (
            <div key={category} className="mb-4 last:mb-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{category}</p>
              <div className="space-y-2">
                {faqs.filter(f => f.category === category).map(faq => (
                  <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                      {openFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* 회사 정보 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">회사 정보</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="text-gray-400 w-20 inline-block">상호명</span> (주)금은세상</p>
            <p><span className="text-gray-400 w-20 inline-block">대표</span> 홍길동</p>
            <p><span className="text-gray-400 w-20 inline-block">사업자번호</span> 123-45-67890</p>
            <p><span className="text-gray-400 w-20 inline-block">주소</span> 서울시 종로구 종로 123, 5층</p>
          </div>
        </div>
      </div>
    </main>
  );
}
