'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, User, Lock, Mail, AlertCircle } from 'lucide-react';
import { cn, storage } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  
  // 테스트 계정 정보
  const TEST_ACCOUNT = {
    email: 'test@goldsilver.com',
    password: 'test1234',
    name: '테스트 사용자',
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // 시뮬레이션 딜레이
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isRegister) {
      // 회원가입
      if (!name || !email || !password) {
        setError('모든 필드를 입력해 주세요.');
        setIsLoading(false);
        return;
      }
      
      // 더미 회원가입 성공
      const user = { id: Date.now().toString(), name, email };
      storage.set('user', user);
      storage.set('token', 'dummy_token_' + Date.now());
      router.push('/');
    } else {
      // 로그인
      if (email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
        const user = { id: '1', name: TEST_ACCOUNT.name, email: TEST_ACCOUNT.email };
        storage.set('user', user);
        storage.set('token', 'dummy_token_' + Date.now());
        router.push('/');
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    }
    
    setIsLoading(false);
  };
  
  const fillTestAccount = () => {
    setEmail(TEST_ACCOUNT.email);
    setPassword(TEST_ACCOUNT.password);
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-bold text-lg">{isRegister ? '회원가입' : '로그인'}</h1>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">Au</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">금은세상</h2>
          <p className="text-gray-500 mt-1">금/은 투자의 새로운 시작</p>
        </div>
        
        {/* 테스트 계정 안내 */}
        {!isRegister && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <p className="text-sm text-blue-700 mb-2 font-medium">
              테스트 계정으로 로그인해 보세요
            </p>
            <div className="text-sm text-blue-600 mb-3">
              <p>이메일: {TEST_ACCOUNT.email}</p>
              <p>비밀번호: {TEST_ACCOUNT.password}</p>
            </div>
            <button
              type="button"
              onClick={fillTestAccount}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              자동 입력
            </button>
          </div>
        )}
        
        {/* 에러 메시지 */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl mb-6 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">이름</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">이메일</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all btn-press",
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-amber-500 text-white hover:bg-amber-600"
            )}
          >
            {isLoading 
              ? '처리 중...' 
              : isRegister ? '회원가입' : '로그인'
            }
          </button>
        </form>
        
        {/* 회원가입/로그인 전환 */}
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            {isRegister ? '이미 계정이 있으신가요?' : '아직 계정이 없으신가요?'}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="ml-2 text-amber-600 font-semibold hover:underline"
            >
              {isRegister ? '로그인' : '회원가입'}
            </button>
          </p>
        </div>
        
        {/* 소셜 로그인 */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-50 text-sm text-gray-500">또는</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-yellow-400 rounded-xl font-semibold text-gray-800 hover:bg-yellow-500 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.682 2.545-.78 2.94-.123.492.18.485.378.353.156-.104 2.477-1.683 3.478-2.365.545.08 1.105.122 1.654.122 4.97 0 9-3.185 9-7.104C21 6.185 16.97 3 12 3z"/>
              </svg>
              카카오로 시작하기
            </button>
            
            <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors">
              <span className="text-lg font-bold">N</span>
              네이버로 시작하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
