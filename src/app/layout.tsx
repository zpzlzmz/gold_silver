import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoldSilver - 금은 시세 & 자산관리",
  description: "실시간 금은 시세 확인, 자산 관리, 주변 금은방 찾기",
  keywords: ["금시세", "은시세", "금값", "귀금속", "자산관리", "금은방"],
  authors: [{ name: "GoldSilver" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GoldSilver",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F59E0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 다크모드 초기화 스크립트 (깜빡임 방지)
  const darkModeScript = `
    (function() {
      try {
        var darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'true') {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
