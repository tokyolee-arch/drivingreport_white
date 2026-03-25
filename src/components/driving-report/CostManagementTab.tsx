'use client';

import { useState } from 'react';
import {
  dailyCostData,
  savingsData,
  aiInsights,
  streakData,
  dailyQuests,
  achievements,
  energyPriceData,
} from '@/data/mock-driving-data';

// ── 유틸 ──
function formatWon(n: number): string {
  return n.toLocaleString();
}

// ── 컴포넌트 ──
export default function CostManagementTab() {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const data = dailyCostData;
  const savings = savingsData;
  const insights = aiInsights;
  const streak = streakData;
  const quests = dailyQuests;
  const achs = achievements;
  const energy = energyPriceData;

  const recommendLabel =
    energy.recommendation === 'charge_now'
      ? '지금 충전 추천!'
      : energy.recommendation === 'wait'
        ? '내일까지 대기'
        : '보통';
  const recommendColor =
    energy.recommendation === 'charge_now'
      ? '#10b981'
      : energy.recommendation === 'wait'
        ? '#f59e0b'
        : '#64748b';

  return (
    <div className="flex flex-col gap-5">

      {/* ── 1. 일일 차량 비용 대시보드 (P&L 스타일) ── */}
      <div
        className="rounded-xl p-5 border border-white/[0.06]"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-gray-400">
              {data.date.replace(/-/g, '.')} · 오늘의 차량 비용
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold"
              style={{
                border: `3px solid ${data.healthScore >= 80 ? '#4ade80' : data.healthScore >= 60 ? '#fbbf24' : '#f87171'}`,
                color: data.healthScore >= 80 ? '#4ade80' : data.healthScore >= 60 ? '#fbbf24' : '#f87171',
              }}
            >
              {data.healthScore}
            </div>
            <div className="text-[9px] text-gray-400 leading-tight">
              건강<br />스코어
            </div>
          </div>
        </div>

        {/* 총 비용 */}
        <div className="text-center mb-4">
          <p className="text-[11px] text-gray-400 mb-1">오늘 총 차량 비용</p>
          <p className="text-3xl font-extrabold text-white">
            ₩{formatWon(data.totalCost)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            전일 대비{' '}
            <span className="text-emerald-400 font-semibold">-850원</span>
          </p>
        </div>

        {/* 비용 구성 */}
        <div className="bg-white/[0.06] rounded-lg p-3 flex flex-wrap gap-x-4 gap-y-1 justify-center">
          {data.costItems.map((item) => (
            <span key={item.category} className="text-[11px] text-gray-300 whitespace-nowrap">
              {item.icon} {formatWon(item.amount)}
            </span>
          ))}
        </div>
      </div>

      {/* ── 2. 절감 카운터 + 스트릭 (2열) ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* 절감 카운터 */}
        <div className="border border-gray-200 rounded-xl p-4" style={{ borderLeft: '3px solid #10b981' }}>
          <p className="text-[10px] text-emerald-600 font-bold mb-1">이번 달 절감</p>
          <p className="text-xl font-extrabold text-emerald-600">
            {formatWon(savings.monthlySavings)}원
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            오늘 +{formatWon(savings.todaySavings)}원
          </p>
        </div>

        {/* 스트릭 */}
        <div className="border border-gray-200 rounded-xl p-4" style={{ borderLeft: '3px solid #f59e0b' }}>
          <p className="text-[10px] text-amber-600 font-bold mb-1">연속 안전운전</p>
          <p className="text-xl font-extrabold text-amber-600">
            {streak.currentStreak}일 🔥
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            역대 최장 {streak.bestStreak}일
          </p>
        </div>
      </div>

      {/* ── 3. AI 인사이트 카드 ── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden" style={{ borderLeft: '3px solid #8b5cf6' }}>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] text-violet-600 font-bold mb-2">
                🔔 오늘의 인사이트
              </p>
              {insights.map((insight) => (
                <button
                  key={insight.id}
                  onClick={() =>
                    setExpandedInsight(expandedInsight === insight.id ? null : insight.id)
                  }
                  className="w-full text-left mb-2 last:mb-0"
                >
                  <p className="text-[13px] text-gray-800">
                    {insight.icon} {insight.message}
                  </p>
                  {insight.savingsAmount && (
                    <p className="text-[11px] text-violet-600 font-semibold mt-0.5">
                      월 {formatWon(insight.savingsAmount)}원 절감 가능
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. 충전 가격 + 퀘스트 (2열) ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* 충전 가격 */}
        <div className="border border-gray-200 rounded-xl p-4" style={{ borderLeft: '3px solid #ec4899' }}>
          <p className="text-[10px] text-pink-600 font-bold mb-1">
            ⚡ 충전 단가
          </p>
          <p className="text-lg font-extrabold text-gray-900">
            ₩{energy.currentPrice.toFixed(1)}{' '}
            <span
              className="text-[10px]"
              style={{ color: energy.priceChange < 0 ? '#10b981' : '#ef4444' }}
            >
              {energy.priceChange > 0 ? '↑' : '↓'}
              {Math.abs(energy.priceChange)}
            </span>
          </p>
          <p
            className="text-[10px] font-bold mt-1"
            style={{ color: recommendColor }}
          >
            {recommendLabel}
          </p>
        </div>

        {/* 오늘의 퀘스트 */}
        <div className="border border-gray-200 rounded-xl p-4" style={{ borderLeft: '3px solid #f97316' }}>
          <p className="text-[10px] text-orange-600 font-bold mb-1">
            🎮 오늘의 퀘스트
          </p>
          {quests.filter(q => q.status !== 'locked').slice(0, 2).map((q) => (
            <div key={q.id} className="flex items-center justify-between mb-1 last:mb-0">
              <p className="text-[11px] text-gray-700 truncate flex-1 mr-1">
                {q.status === 'completed' ? '✅' : '◻️'} {q.title}
              </p>
              <span className="text-[10px] font-bold text-orange-600 whitespace-nowrap">
                +{q.points}P
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. 주간 챌린지 ── */}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-900">🏆 주간 챌린지</p>
          <span className="text-xs font-bold text-violet-600">{streak.weeklyChallenge.reward}</span>
        </div>
        <p className="text-[13px] text-gray-700 mb-2">{streak.weeklyChallenge.title}</p>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${streak.weeklyChallenge.progress}%`,
              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
            }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1 text-right">
          {streak.weeklyChallenge.progress}% 달성
        </p>
      </div>

      {/* ── 6. 월간 비용 목표 ── */}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-900">📊 {streak.monthlyGoal.title}</p>
          <span className="text-xs font-semibold text-gray-500">
            {formatWon(streak.monthlyGoal.target)}{streak.monthlyGoal.unit} 목표
          </span>
        </div>
        <div className="flex items-end justify-between mb-2">
          <span className="text-2xl font-extrabold text-gray-900">
            {formatWon(streak.monthlyGoal.current)}
            <span className="text-sm font-normal text-gray-500">{streak.monthlyGoal.unit}</span>
          </span>
          <span className="text-xs text-emerald-600 font-semibold">
            잔여 {formatWon(streak.monthlyGoal.target - streak.monthlyGoal.current)}{streak.monthlyGoal.unit}
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((streak.monthlyGoal.current / streak.monthlyGoal.target) * 100, 100)}%`,
              background:
                streak.monthlyGoal.current <= streak.monthlyGoal.target
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
            }}
          />
        </div>
      </div>

      {/* ── 7. 비용 상세 내역 ── */}
      <div className="border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-bold text-gray-900 mb-3">📋 오늘의 비용 상세</p>
        <div className="space-y-3">
          {data.costItems.map((item) => {
            const pct = data.totalCost > 0 ? (item.amount / data.totalCost) * 100 : 0;
            return (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700 font-medium">
                    {item.icon} {item.category}
                  </span>
                  <span className="text-xs font-bold text-gray-900">
                    ₩{formatWon(item.amount)}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 합계 */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">일일 총 비용</span>
          <span className="text-sm font-extrabold text-gray-900">₩{formatWon(data.totalCost)}</span>
        </div>
      </div>

      {/* ── 8. 업적 & 마일스톤 ── */}
      <div className="border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-bold text-gray-900 mb-3">🏅 업적 & 마일스톤</p>

        {/* 획득한 뱃지 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {achs.filter(a => a.earned).map((a) => (
            <span
              key={a.id}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              {a.icon} {a.title}
            </span>
          ))}
          {achs.filter(a => !a.earned).map((a) => (
            <span
              key={a.id}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 border border-dashed border-gray-300"
            >
              {a.icon} {a.title}
            </span>
          ))}
        </div>

        {/* 진행 중인 마일스톤 */}
        {achs.filter(a => !a.earned && a.progress != null).map((a) => (
          <div key={a.id} className="mb-2 last:mb-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-700">{a.icon} {a.title}</span>
              <span className="text-[10px] text-gray-500">{a.target}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${a.progress}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── 9. 절감 내역 ── */}
      <div className="border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-bold text-gray-900 mb-3">💰 이번 달 절감 내역</p>
        <div className="space-y-2">
          {savings.savingsSources.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-xs text-gray-600">✓ {s.label}</span>
              <span className="text-xs font-bold text-emerald-600">
                +{formatWon(s.amount)}원
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">총 절감</span>
          <span className="text-sm font-extrabold text-emerald-600">
            +{formatWon(savings.monthlySavings)}원
          </span>
        </div>
      </div>
    </div>
  );
}
