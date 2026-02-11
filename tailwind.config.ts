import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ivi: {
          // 심플한 화이트 배경
          bg: "#ffffff",
          surface: "#ffffff",
          surfaceLight: "#fafafa",
          // 파스텔 액센트 컬러
          accent: "#10b981",        // 민트 그린
          accentLight: "#d1fae5",   // 연한 민트
          warning: "#f59e0b",       // 오렌지
          warningLight: "#fef3c7",  // 연한 오렌지
          danger: "#ef4444",        // 레드
          dangerLight: "#fee2e2",   // 연한 레드
          info: "#3b82f6",          // 블루
          infoLight: "#dbeafe",     // 연한 블루
          purple: "#8b5cf6",        // 퍼플
          purpleLight: "#ede9fe",   // 연한 퍼플
        },
      },
      maxWidth: {
        ivi: "480px",
      },
      fontWeight: {
        'extra-bold': '800',
        'black': '900',
      },
    },
  },
  plugins: [],
};
export default config;
