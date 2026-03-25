'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import TripSummaryTab from '@/components/driving-report/TripSummaryTab';
import SafetyScoreTab from '@/components/driving-report/SafetyScoreTab';
import CostManagementTab from '@/components/driving-report/CostManagementTab';
import VehicleManagementTab from '@/components/driving-report/VehicleManagementTab';
import VehicleValueTab from '@/components/driving-report/VehicleValueTab';

// ── Tab 정의 ──

const TABS = [
  { icon: '💰', label: '홈' },
  { icon: '🚗', label: '주행요약' },
  { icon: '🛡️', label: '안전점수' },
  { icon: '🔧', label: 'Service' },
  { icon: '💎', label: '차량가치' },
];

// ── 오늘 날짜 문자열 ──

function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const w = weekdays[d.getDay()];
  return `${y}.${m}.${day} (${w})`;
}

// ── Tab 콘텐츠 렌더 ──

function TabContent({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <CostManagementTab />;
    case 1:
      return <TripSummaryTab />;
    case 2:
      return <SafetyScoreTab />;
    case 3:
      return <VehicleManagementTab />;
    case 4:
      return <VehicleValueTab />;
    default:
      return null;
  }
}

// ── 컴포넌트 ──

export default function DrivingReportPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Tab 키보드 네비게이션 (좌/우 화살표)
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next = activeTab;
      if (e.key === 'ArrowRight') next = (activeTab + 1) % TABS.length;
      else if (e.key === 'ArrowLeft') next = (activeTab - 1 + TABS.length) % TABS.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = TABS.length - 1;
      else return;

      e.preventDefault();
      setActiveTab(next);
    },
    [activeTab]
  );

  // 포커스를 새 활성 탭 버튼으로 이동
  useEffect(() => {
    const list = tabListRef.current;
    if (!list) return;
    const btn = list.querySelectorAll<HTMLButtonElement>('[role="tab"]')[activeTab];
    btn?.focus();
  }, [activeTab]);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* ── Header (sticky) ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            {/* 좌측 */}
            <div>
              <p className="text-[11px] text-gray-900 font-bold uppercase tracking-wider mb-1">
                DRIVING REPORT
              </p>
              <h1 className="text-2xl font-black text-gray-900">
                주행 리포트
              </h1>
            </div>

            {/* 우측 */}
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{getTodayString()}</p>
              <p className="text-xs font-extrabold text-ivi-accent flex items-center justify-end gap-1.5 mt-1">
                <span
                  className="inline-block w-2 h-2 rounded-full bg-ivi-accent"
                  aria-hidden="true"
                />
                LIVE
              </p>
            </div>
          </div>

          {/* ── Tab Bar (ARIA tablist) ── */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="주행 리포트 탭"
            onKeyDown={handleTabKeyDown}
            className="flex gap-1 p-1.5 bg-gray-100 rounded-xl"
          >
            {TABS.map((tab, i) => {
              const isActive = activeTab === i;
              return (
                <button
                  key={i}
                  role="tab"
                  id={`tab-${i}`}
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${i}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(i)}
                  aria-label={`${tab.label} 탭`}
                  className={`
                    flex-1 py-2.5 px-1 text-[11px] font-bold rounded-lg whitespace-nowrap
                    transition-all duration-300 relative overflow-hidden
                    ${
                      isActive
                        ? 'text-white shadow-lg scale-105'
                        : 'text-gray-900 hover:text-gray-900 hover:bg-white/50'
                    }
                  `}
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        }
                      : {}
                  }
                >
                  <span className="flex flex-col items-center gap-0.5 relative z-10">
                    <span className="text-base" aria-hidden="true">
                      {tab.icon}
                    </span>
                    <span className="leading-tight">{tab.label}</span>
                  </span>

                  {/* 활성 탭 글로우 효과 */}
                  {isActive && (
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Content (fade-in on tab switch) ── */}
      <main
        className="flex-1 min-h-0 overflow-y-auto px-6 py-6 animate-fade-in"
        key={activeTab}
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        <TabContent index={activeTab} />
      </main>

      {/* ── Footer ── */}
      <footer className="px-6 py-4 text-center border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-900">
          차량 VIN: KMH●●●●●●●●35820 · <span className="text-ivi-accent">Blockchain Verified</span>
        </p>
      </footer>
    </div>
  );
}
