'use client';

import { useState } from 'react';
import Badge from '@/components/shared/Badge';
import { repairVsReplaceData } from '@/data/mock-driving-data';

// ── 등급 설정 ──
const GRADE = 'A';
const GRADE_CONFIG: Record<string, { color: string; glow: string; label: string }> = {
  A: { color: '#3b82f6', glow: 'rgba(59,130,246,0.3)', label: 'EXCELLENT' },
  B: { color: '#00d4aa', glow: 'rgba(0,212,170,0.3)', label: 'GOOD' },
  C: { color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', label: 'FAIR' },
};
const gradeInfo = GRADE_CONFIG[GRADE] ?? GRADE_CONFIG.B;

// ── 차량 기본 정보 ──
const VEHICLE_INFO = [
  { label: '총 주행거리', value: '35,820', unit: 'km', icon: '📍' },
  { label: '차량 연식', value: '1년 4개월', unit: '', icon: '📅' },
];

// ── 신뢰 지표 (하나의 블록) ──
const TRUST_METRICS = [
  { label: '사고이력', value: '0', unit: '건', icon: '🛡️', color: '#00d4aa' },
  { label: '정비이행률', value: '100', unit: '%', icon: '🔧', color: '#3b82f6' },
  { label: '배터리 헬스', value: '94', unit: '%', icon: '🔋', color: '#22c55e' },
  { label: '안전운전점수', value: '82', unit: '점', icon: '⭐', color: '#f59e0b' },
];

// ── 가치 상승 요인 ──

const VALUE_FACTORS = [
  { factor: '무사고 이력 인증', impact: '+150만원' },
  { factor: '정비이행률 100%', impact: '+95만원' },
  { factor: '배터리 헬스 94%', impact: '+120만원' },
  { factor: '안전점수 A등급', impact: '+50만원' },
];

// ── 컴포넌트 ──

export default function VehicleValueTab() {
  const [showRepairVsReplace, setShowRepairVsReplace] = useState(false);
  const rvr = repairVsReplaceData;

  return (
    <div className="flex flex-col gap-3">
      {/* ── 1. Vehicle Trust Grade 히어로 ── */}
      <div
        className="rounded-xl p-6 border border-white/[0.06] flex flex-col items-center"
        style={{
          background: 'linear-gradient(180deg, #111d33 0%, #0f1a2e 100%)',
        }}
      >
        <p className="text-[10px] text-gray-900 tracking-[0.25em] font-semibold mb-5">
          VEHICLE TRUST GRADE
        </p>

        {/* 등급 뱃지 */}
        <div className="relative flex items-center justify-center">
          {/* 글로우 배경 */}
          <div
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, ${gradeInfo.glow} 0%, transparent 70%)`,
            }}
          />
          {/* 원형 테두리 */}
          <div
            className="relative w-28 h-28 rounded-full border-[3px] flex items-center justify-center"
            style={{ borderColor: `${gradeInfo.color}40` }}
          >
            {/* 내부 원 */}
            <div
              className="w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${gradeInfo.color}15, ${gradeInfo.color}08)`,
              }}
            >
              <span
                className="text-5xl font-black leading-none"
                style={{ color: gradeInfo.color }}
              >
                {GRADE}
              </span>
              <span
                className="text-[8px] font-bold tracking-[0.15em] mt-1"
                style={{ color: gradeInfo.color }}
              >
                GRADE
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Badge text={`CERTIFIED ${gradeInfo.label}`} color={gradeInfo.color} />
        </div>

        <p className="mt-2 text-[10px] text-gray-900">
          블록체인 인증 완료 · 데이터 무결성 검증됨
        </p>
      </div>

      {/* ── 2. 차량 기본 정보 (2열) ── */}
      <div className="grid grid-cols-2 gap-2">
        {VEHICLE_INFO.map((m) => (
          <div
            key={m.label}
            className="bg-ivi-surfaceLight rounded-xl px-4 py-3 border border-white/[0.06]"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">{m.icon}</span>
              <span className="text-[10px] text-gray-900">{m.label}</span>
            </div>
            <p className="text-lg font-bold text-gray-100 leading-tight">
              {m.value}
              {m.unit && (
                <span className="text-[10px] font-normal text-gray-900 ml-0.5">
                  {m.unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* ── 3. 차량 신뢰 지표 (하나의 블록) ── */}
      <div className="bg-ivi-surfaceLight rounded-xl p-4 border border-white/[0.06]">
        <h3 className="text-sm font-bold text-gray-100 mb-3">
          🏅 차량 신뢰 지표
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {TRUST_METRICS.map((m) => (
            <div key={m.label} className="flex flex-col items-center text-center gap-1.5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-base"
                style={{ backgroundColor: `${m.color}15` }}
              >
                {m.icon}
              </div>
              <p className="text-lg font-extrabold text-gray-100 leading-none">
                {m.value}
                {m.unit && (
                  <span className="text-[9px] font-normal text-gray-900">{m.unit}</span>
                )}
              </p>
              <p className="text-[9px] text-gray-900 leading-tight">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. 예상 시세 카드 ── */}
      <div className="bg-ivi-surfaceLight rounded-xl p-5 border border-white/[0.06]">
        <h3 className="text-sm font-bold text-gray-100 mb-4">
          💎 예상 시세
        </h3>

        {/* 중앙 적정가 */}
        <div className="text-center mb-2">
          <span
            className="text-3xl font-extrabold"
            style={{
              background: 'linear-gradient(135deg, #00d4aa, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ₩32,500,000
          </span>
        </div>

        <p className="text-center text-[11px] text-gray-900 mb-4">
          잔존 가치율{' '}
          <span className="text-gray-300 font-semibold">72%</span> · 동급 평균
          대비{' '}
          <span className="text-ivi-accent font-semibold">+8%</span>
        </p>

        {/* 3칸: 하한가 / 적정가 / 상한가 */}
        <div className="grid grid-cols-3 gap-2">
          <PriceCell label="하한가" value="₩30,200,000" muted />
          <PriceCell label="적정가" value="₩32,500,000" highlighted />
          <PriceCell label="상한가" value="₩34,800,000" muted />
        </div>
      </div>

      {/* ── 4. 가치 상승 요인 카드 ── */}
      <div className="bg-ivi-surfaceLight rounded-xl p-5 border border-white/[0.06]">
        <h3 className="text-sm font-bold text-gray-100 mb-3">
          📈 가치 상승 요인
        </h3>

        <div className="space-y-2.5">
          {VALUE_FACTORS.map((f) => (
            <div
              key={f.factor}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-ivi-accent text-[10px]">✦</span>
                <span className="text-xs text-gray-300 truncate">
                  {f.factor}
                </span>
              </div>
              <span className="text-xs font-bold text-ivi-accent shrink-0 ml-2">
                {f.impact}
              </span>
            </div>
          ))}
        </div>

        {/* 합산 */}
        <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
          <span className="text-xs text-gray-900">총 가치 상승 효과</span>
          <span className="text-sm font-extrabold text-ivi-accent">+415만원</span>
        </div>
      </div>

      {/* ── 5. 수리 vs 교체 의사결정 엔진 (FMS 유니크C 적용) ── */}
      <div className="bg-ivi-surfaceLight rounded-xl border border-white/[0.06] overflow-hidden">
        <button
          onClick={() => setShowRepairVsReplace(!showRepairVsReplace)}
          className="w-full p-5 flex items-center justify-between text-left"
        >
          <div>
            <h3 className="text-sm font-bold text-gray-100">
              🔄 수리 vs 교체 의사결정
            </h3>
            <p className="text-[10px] text-gray-500 mt-1">
              이 차를 더 탈까, 바꿀까? 데이터 기반 분석
            </p>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className={`text-gray-500 transition-transform duration-300 ${showRepairVsReplace ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showRepairVsReplace && (
          <div className="px-5 pb-5 border-t border-white/[0.04]">
            {/* 비교 테이블 */}
            <div className="mt-4 rounded-lg overflow-hidden border border-white/[0.06]">
              {/* 테이블 헤더 */}
              <div className="grid grid-cols-3 bg-white/[0.04]">
                <div className="p-2.5 text-[10px] font-bold text-gray-500">비교 항목</div>
                <div className="p-2.5 text-[10px] font-bold text-blue-400 text-center">현재 차량 유지</div>
                <div className="p-2.5 text-[10px] font-bold text-emerald-400 text-center">차량 교체</div>
              </div>

              {/* 테이블 본문 */}
              {rvr.comparisonItems.map((item, i) => (
                <div
                  key={item.label}
                  className={`grid grid-cols-3 ${i < rvr.comparisonItems.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                >
                  <div className="p-2.5 text-[11px] text-gray-400">{item.label}</div>
                  <div className={`p-2.5 text-[11px] text-center font-semibold ${item.keepHighlight ? 'text-red-400' : 'text-gray-300'}`}>
                    {item.keepValue}
                  </div>
                  <div className={`p-2.5 text-[11px] text-center font-semibold ${item.replaceHighlight ? 'text-emerald-400' : 'text-gray-300'}`}>
                    {item.replaceValue}
                  </div>
                </div>
              ))}
            </div>

            {/* AI 추천 */}
            <div className="mt-4 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-lg p-3">
              <p className="text-[10px] font-bold text-emerald-400 mb-1">🤖 AI 추천</p>
              <p className="text-[12px] text-gray-300">{rvr.recommendation}</p>
            </div>

            {/* 교체 최적 시점 카운트다운 */}
            <div className="mt-3 flex items-center justify-center gap-2 bg-white/[0.03] rounded-lg py-3">
              <span className="text-[11px] text-gray-500">교체 최적 시점까지</span>
              <span className="text-lg font-extrabold text-blue-400">D-{rvr.optimalReplaceMonths * 30}</span>
              <span className="text-[11px] text-gray-500">({rvr.optimalReplaceMonths}개월)</span>
            </div>

            {/* 정비로 매각가 올리기 팁 */}
            <p className="text-[10px] text-gray-500 mt-3 text-center">
              💡 지금 정비하면 매각 시 <span className="text-emerald-400 font-semibold">+120만원</span> 추가 가능
            </p>
          </div>
        )}
      </div>

      {/* ── 6. CTA 버튼 2개 ── */}
      <div className="flex gap-2">
        {/* 리포트 공유 (gradient) */}
        <button
          aria-label="차량 리포트 공유하기"
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white
                     transition-all duration-200 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #00d4aa, #3b82f6)',
            boxShadow: '0 4px 16px rgba(0,212,170,0.25)',
          }}
        >
          📄 리포트 공유
        </button>

        {/* 중고차 플랫폼 등록 (outline) */}
        <button
          aria-label="중고차 플랫폼 연동하기"
          className="flex-1 py-3 rounded-xl text-sm font-bold
                     border border-white/[0.12] text-gray-300
                     bg-white/[0.02] hover:bg-white/[0.06]
                     transition-all duration-200 active:scale-[0.98]"
        >
          🔗 중고차 플랫폼 등록
        </button>
      </div>
    </div>
  );
}

// ── 시세 셀 서브 컴포넌트 ──

interface PriceCellProps {
  label: string;
  value: string;
  highlighted?: boolean;
  muted?: boolean;
}

function PriceCell({ label, value, highlighted, muted }: PriceCellProps) {
  return (
    <div
      className={`rounded-lg p-2.5 text-center border ${
        highlighted
          ? 'bg-ivi-accent/[0.08] border-ivi-accent/20'
          : 'bg-ivi-bg border-white/[0.04]'
      }`}
    >
      <p className="text-[9px] text-gray-900 mb-1">{label}</p>
      <p
        className={`text-[11px] font-bold leading-tight ${
          muted ? 'text-gray-900' : 'text-ivi-accent'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
