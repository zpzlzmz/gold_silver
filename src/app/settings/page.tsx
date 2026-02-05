'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';
import { 
  Bell, Shield, HelpCircle, FileText, LogOut, ChevronRight,
  Moon, Globe, Smartphone, Mail, User, Lock
} from 'lucide-react';
import { cn, storage } from '@/lib/utils';

interface SettingItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  toggle?: boolean;
  value?: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);
  
  useEffect(() => {
    const savedUser = storage.get('user', null);
    setUser(savedUser);
    
    setNotifications(storage.get('notifications', true));
    setDarkMode(storage.get('darkMode', false));
    setBiometric(storage.get('biometric', false));
  }, []);
  
  const handleLogout = () => {
    storage.remove('user');
    storage.remove('token');
    setUser(null);
    router.push('/');
  };
  
  const handleToggle = (key: string, value: boolean) => {
    storage.set(key, value);
    if (key === 'notifications') setNotifications(value);
    if (key === 'darkMode') {
      setDarkMode(value);
      // 다크모드 적용
      if (value) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
    if (key === 'biometric') setBiometric(value);
  };
  
  // 다크모드 초기화
  useEffect(() => {
    const isDark = storage.get('darkMode', false);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }, []);
  
  const accountSettings: SettingItem[] = user ? [
    {
      id: 'profile',
      icon: <User className="w-5 h-5" />,
      label: '프로필 관리',
      description: user.email,
      href: '/settings/profile',
    },
    {
      id: 'security',
      icon: <Lock className="w-5 h-5" />,
      label: '보안 설정',
      description: '비밀번호, 2단계 인증',
      href: '/settings/security',
    },
  ] : [];
  
  const appSettings: SettingItem[] = [
    {
      id: 'notifications',
      icon: <Bell className="w-5 h-5" />,
      label: '알림 설정',
      description: '가격 변동, 거래 알림',
      toggle: true,
      value: notifications,
      onClick: () => handleToggle('notifications', !notifications),
    },
    {
      id: 'darkMode',
      icon: <Moon className="w-5 h-5" />,
      label: '다크 모드',
      description: '어두운 테마 사용',
      toggle: true,
      value: darkMode,
      onClick: () => handleToggle('darkMode', !darkMode),
    },
    {
      id: 'biometric',
      icon: <Smartphone className="w-5 h-5" />,
      label: '생체 인증',
      description: '지문/Face ID로 로그인',
      toggle: true,
      value: biometric,
      onClick: () => handleToggle('biometric', !biometric),
    },
  ];
  
  const supportSettings: SettingItem[] = [
    {
      id: 'help',
      icon: <HelpCircle className="w-5 h-5" />,
      label: '고객센터',
      description: '도움말 및 문의',
      href: '/settings/help',
    },
    {
      id: 'terms',
      icon: <FileText className="w-5 h-5" />,
      label: '이용약관',
      href: '/settings/terms',
    },
    {
      id: 'privacy',
      icon: <Shield className="w-5 h-5" />,
      label: '개인정보처리방침',
      href: '/settings/privacy',
    },
  ];
  
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <h1 className="font-bold text-lg">설정</h1>
        </div>
      </header>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* 사용자 정보 */}
        {user ? (
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-amber-100">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-800 mb-1">로그인하세요</h2>
                <p className="text-sm text-gray-500">더 많은 기능을 이용할 수 있습니다</p>
              </div>
              <Link
                href="/login"
                className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold text-sm"
              >
                로그인
              </Link>
            </div>
          </div>
        )}
        
        {/* 계정 설정 */}
        {user && accountSettings.length > 0 && (
          <SettingSection title="계정" items={accountSettings} />
        )}
        
        {/* 앱 설정 */}
        <SettingSection title="앱 설정" items={appSettings} />
        
        {/* 지원 */}
        <SettingSection title="지원" items={supportSettings} />
        
        {/* 로그아웃 */}
        {user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm"
          >
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-semibold text-red-500">로그아웃</span>
          </button>
        )}
        
        {/* 버전 정보 */}
        <div className="text-center text-sm text-gray-400 pt-4">
          <p>금은세상 v1.0.0</p>
          <p className="mt-1">© 2025 GoldSilver. All rights reserved.</p>
        </div>
      </div>
      
      <BottomNav />
    </main>
  );
}

function SettingSection({ title, items }: { title: string; items: SettingItem[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 mb-2 px-1">{title}</h3>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {items.map((item, index) => (
          <SettingRow key={item.id} item={item} isLast={index === items.length - 1} />
        ))}
      </div>
    </div>
  );
}

function SettingRow({ item, isLast }: { item: SettingItem; isLast: boolean }) {
  const content = (
    <div className={cn(
      "flex items-center gap-3 p-4",
      !isLast && "border-b border-gray-100"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center",
        "bg-gray-100 text-gray-600"
      )}>
        {item.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800">{item.label}</p>
        {item.description && (
          <p className="text-sm text-gray-500 truncate">{item.description}</p>
        )}
      </div>
      
      {item.toggle ? (
        <button
          onClick={item.onClick}
          className={cn(
            "w-12 h-7 rounded-full transition-colors relative",
            item.value ? "bg-amber-500" : "bg-gray-300"
          )}
        >
          <span className={cn(
            "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform",
            item.value ? "translate-x-6" : "translate-x-1"
          )} />
        </button>
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </div>
  );
  
  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {content}
      </Link>
    );
  }
  
  if (item.onClick && !item.toggle) {
    return (
      <button onClick={item.onClick} className="w-full text-left">
        {content}
      </button>
    );
  }
  
  return content;
}
