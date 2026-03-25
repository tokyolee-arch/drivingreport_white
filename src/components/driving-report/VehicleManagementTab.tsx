'use client';

import { useState } from 'react';
import ProgressBar from '@/components/shared/ProgressBar';
import Receipt from '@/components/service/Receipt';
import ReceiptImageModal from '@/components/service/ReceiptImageModal';
import BatteryCheckModal from '@/components/vehicle/BatteryCheckModal';
import { consumableRisks } from '@/data/mock-driving-data';

// ── 영수증 데이터 타입 생략 (이전과 동일) ──
interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface ReceiptData {
  receiptNumber: string;
  center: string;
  centerAddress: string;
  centerPhone: string;
  date: string;
  time: string;
  vehicle: string;
  mileage: number;
  items: ReceiptItem[];
  subtotal: number;
  vat: number;
  total: number;
  technician: string;
  paymentMethod: string;
}

interface ServiceRecord {
  center: string;
  date: string;
  items: string[];
  totalCost: number;
  icon: string;
  receiptData?: ReceiptData;
  receiptImageUrl?: string;
}

// ── 소모품 데이터 (5,000km 스케일) ──
const CONSUMABLE_SCALE_KM = 5000;
const CONSUMABLES = [
  { label: '브레이크패드(전)', remainKm: 4200, detail: '4,200km 남음', color: '#f59e0b' },
  { label: '브레이크패드(후)', remainKm: 3500, detail: '3,500km 남음', color: '#10b981' },
  { label: '에어컨필터', remainKm: 300, detail: '즉시 교체 권장', color: '#ef4444' },
  { label: '와이퍼블레이드', remainKm: 1800, detail: '1,800km 남음', color: '#f59e0b' },
];

// ── 정비 이력 데이터 ──
const SERVICE_RECORDS: ServiceRecord[] = [
  {
    center: '현대 강남 서비스센터',
    date: '2026-01-15',
    items: ['엔진오일 교체', '오일필터 교체', '차량 점검'],
    totalCost: 125000,
    icon: '🛢️',
    receiptData: {
      receiptNumber: 'SVC-2026-0115-001',
      center: '현대 강남 서비스센터',
      centerAddress: '서울특별시 강남구 테헤란로 123',
      centerPhone: '02-1234-5678',
      date: '2026-01-15',
      time: '14:30',
      vehicle: 'IONIQ 5 (2023)',
      mileage: 75000,
      items: [
        { name: '엔진오일 교체', quantity: 1, unitPrice: 45000, amount: 45000 },
        { name: '오일필터 교체', quantity: 1, unitPrice: 15000, amount: 15000 },
        { name: '차량 종합점검', quantity: 1, unitPrice: 50000, amount: 50000 },
      ],
      subtotal: 110000,
      vat: 11000,
      total: 121000,
      technician: '김정비',
      paymentMethod: '신용카드 (현대카드 ****-1234)',
    },
    receiptImageUrl: '/receipts/receipt-gangnam-2026-01.png',
  },
  {
    center: '현대 분당 서비스센터',
    date: '2025-11-22',
    items: ['에어컨 필터 교체', '실내 항균 세정'],
    totalCost: 55000,
    icon: '❄️',
    receiptData: {
      receiptNumber: 'SVC-2025-1122-042',
      center: '현대 분당 서비스센터',
      centerAddress: '경기도 성남시 분당구 정자일로 456',
      centerPhone: '031-2345-6789',
      date: '2025-11-22',
      time: '10:15',
      vehicle: 'IONIQ 5 (2023)',
      mileage: 70000,
      items: [
        { name: '에어컨 필터 교체', quantity: 1, unitPrice: 25000, amount: 25000 },
        { name: '실내 항균 세정', quantity: 1, unitPrice: 25000, amount: 25000 },
      ],
      subtotal: 50000,
      vat: 5000,
      total: 55000,
      technician: '이기술',
      paymentMethod: '체크카드 (신한카드 ****-5678)',
    },
    receiptImageUrl: '/receipts/receipt-bundang-2025-11.png',
  },
  {
    center: '현대 수원 서비스센터',
    date: '2025-09-10',
    items: ['종합점검', '엔진오일 교체', '브레이크액 보충', '타이어 공기압 조정'],
    totalCost: 185000,
    icon: '🔧',
    receiptData: {
      receiptNumber: 'SVC-2025-0910-128',
      center: '현대 수원 서비스센터',
      centerAddress: '경기도 수원시 영통구 광교중앙로 789',
      centerPhone: '031-3456-7890',
      date: '2025-09-10',
      time: '15:45',
      vehicle: 'IONIQ 5 (2023)',
      mileage: 65000,
      items: [
        { name: '차량 종합점검', quantity: 1, unitPrice: 80000, amount: 80000 },
        { name: '엔진오일 교체', quantity: 1, unitPrice: 45000, amount: 45000 },
        { name: '브레이크액 보충', quantity: 1, unitPrice: 20000, amount: 20000 },
        { name: '타이어 공기압 조정', quantity: 4, unitPrice: 5000, amount: 20000 },
      ],
      subtotal: 165000,
      vat: 16500,
      total: 181500,
      technician: '박엔진',
      paymentMethod: '신용카드 (삼성카드 ****-9012)',
    },
    receiptImageUrl: '/receipts/receipt-suwon-2025-09.png',
  },
];

const RECENT_RECORDS = SERVICE_RECORDS.slice(0, 3);

// ── 유틸 ──
function formatDateLarge(dateStr: string): { month: string; day: string; year: string } {
  const d = new Date(dateStr);
  return {
    month: String(d.getMonth() + 1).padStart(2, '0'),
    day: String(d.getDate()).padStart(2, '0'),
    year: String(d.getFullYear()),
  };
}

function formatCost(cost: number): string {
  return `₩${cost.toLocaleString()}`;
}

function summarizeItems(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items[0]} 외 ${items.length - 1}건`;
}

// ── 컴포넌트 ──
function formatRiskWon(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

export default function VehicleManagementTab() {
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [selectedReceiptImage, setSelectedReceiptImage] = useState<{ url: string; title: string } | null>(null);
  const [showBatteryCheck, setShowBatteryCheck] = useState(false);
  const [showRiskDetail, setShowRiskDetail] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-col gap-8">

        {/* ── 1. 배터리 헬스 ── */}
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">배터리 헬스</h3>
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-ivi-accent">94</span>
                <span className="text-2xl font-bold text-gray-900">%</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">양호</p>
                <p className="text-xs text-gray-900 mt-1">72.8 / 77.4 kWh</p>
              </div>
            </div>
            <button
              onClick={() => setShowBatteryCheck(true)}
              className="w-full mt-4 py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              배터리 점검하기
            </button>
          </div>
        </div>

        {/* ── 2. 보험사 긴급호출 ── */}
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">보험사 긴급호출</h3>
          <button className="w-full border border-red-200 rounded-lg p-5 bg-red-50/40 hover:bg-red-50 transition-colors text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-900 mb-1">긴급 출동 서비스</p>
                <p className="text-sm text-gray-600">사고·고장 시 보험사 긴급 출동을 요청합니다</p>
              </div>
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* ── 3. 소모품상태(교체 잔여시점) ── */}
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">소모품상태(교체 잔여시점)</h3>
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="space-y-5">
              {CONSUMABLES.map((c) => (
                <ProgressBar
                  key={c.label}
                  value={Math.min(c.remainKm, CONSUMABLE_SCALE_KM)}
                  max={CONSUMABLE_SCALE_KM}
                  color={c.color}
                  label={c.label}
                  detail={c.detail}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold">0km</span>
              <span className="text-[10px] text-gray-400 font-semibold">5,000km</span>
            </div>
          </div>
        </div>

        {/* ── 4. 리스크 금액화 (FMS 유니크B 적용) ── */}
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-2">⚠️ 리스크 금액화</h3>
          <p className="text-xs text-gray-500 mb-4">
            정비를 미루면 발생할 수 있는 피해를 금액으로 환산합니다
          </p>

          <div className="space-y-3">
            {consumableRisks.map((risk) => {
              const isExpanded = showRiskDetail === risk.consumableName;
              return (
                <div
                  key={risk.consumableName}
                  className="border border-red-200 rounded-xl overflow-hidden bg-red-50/30"
                >
                  {/* 리스크 요약 */}
                  <button
                    onClick={() =>
                      setShowRiskDetail(isExpanded ? null : risk.consumableName)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-red-50/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        {risk.consumableName}
                      </p>
                      <p className="text-[11px] text-red-600 mt-0.5">
                        {risk.currentStatus}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-red-600">
                          {formatRiskWon(risk.totalRisk)}
                        </p>
                        <p className="text-[9px] text-red-500">리스크</p>
                      </div>
                      <svg
                        width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  {/* 상세 시뮬레이션 */}
                  <div className="expand-panel" data-open={isExpanded}>
                    <div className="expand-inner">
                      <div className="px-4 pb-4 border-t border-red-100">
                        <div className="bg-red-50 rounded-lg p-3 mt-3">
                          <p className="text-[11px] font-bold text-red-700 mb-2">
                            ⚠️ 무시 시 리스크 시뮬레이션
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[10px] text-gray-500">고장 확률</p>
                              <p className="text-sm font-bold text-red-600">{risk.damageProb}%</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500">최대 수리비</p>
                              <p className="text-sm font-bold text-red-600">
                                {formatRiskWon(risk.replaceCost)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-red-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] text-gray-600">지금 교체 비용</p>
                                <p className="text-sm font-bold text-emerald-600">
                                  {formatRiskWon(risk.repairCost)}
                                </p>
                              </div>
                              <div className="text-center px-2">
                                <p className="text-[10px] text-gray-400">vs</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-gray-600">무시 시 리스크</p>
                                <p className="text-sm font-bold text-red-600">
                                  {formatRiskWon(risk.totalRisk)}
                                </p>
                              </div>
                            </div>
                            <p className="text-[12px] font-bold text-red-700 text-center mt-2">
                              → {risk.riskMultiplier}배 차이
                            </p>
                          </div>
                        </div>

                        <button className="w-full mt-3 py-2.5 bg-red-500 text-white rounded-lg text-[13px] font-bold hover:bg-red-600 transition-colors">
                          지금 정비 예약하기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 총 리스크 합산 */}
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">총 방치 리스크</span>
              <span className="text-lg font-extrabold text-red-600">
                {formatRiskWon(consumableRisks.reduce((sum, r) => sum + r.totalRisk, 0))}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              지금 정비 시 총 비용: {formatRiskWon(consumableRisks.reduce((sum, r) => sum + r.repairCost, 0))}
              {' '}→{' '}
              <span className="text-emerald-600 font-semibold">
                {consumableRisks.reduce((sum, r) => sum + r.totalRisk, 0) > 0
                  ? Math.round(
                      consumableRisks.reduce((sum, r) => sum + r.totalRisk, 0) /
                        consumableRisks.reduce((sum, r) => sum + r.repairCost, 0)
                    )
                  : 0}
                배 절감
              </span>
            </p>
          </div>
        </div>

        {/* ── 3. 방문 정비 이력 ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-gray-900">방문 정비 이력</h3>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-ivi-accent text-white rounded-lg text-sm font-bold hover:bg-ivi-accent/90 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
                <circle cx="12" cy="13" r="4" />
                <path d="M12 3v2" />
              </svg>
              영수증 사진찍기
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {RECENT_RECORDS.map((rec, i) => {
              const isLast = i === RECENT_RECORDS.length - 1;
              const isExpanded = expandedRecord === i;
              const dt = formatDateLarge(rec.date);

              return (
                <div
                  key={`${rec.date}-${rec.center}`}
                  className={!isLast ? 'border-b border-gray-200' : ''}
                >
                  {/* 메인 행 */}
                  <button
                    onClick={() => setExpandedRecord(isExpanded ? null : i)}
                    className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    {/* 날짜 */}
                    <div className="shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        {dt.month}.{dt.day}
                      </p>
                      <p className="text-xs text-gray-900 mt-0.5">
                        {dt.year}
                      </p>
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {summarizeItems(rec.items)}
                      </p>
                      <p className="text-xs text-gray-900 truncate mt-0.5">
                        {rec.center}
                      </p>
                    </div>

                    {/* 비용 + 화살표 */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-gray-900">
                        {formatCost(rec.totalCost)}
                      </span>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className={`text-gray-900 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  {/* 확장 영역 */}
                  <div className="expand-panel" data-open={isExpanded}>
                    <div className="expand-inner">
                      <div className="px-6 pb-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 mt-4 mb-4">
                          {rec.items.map((item, j) => (
                            <span
                              key={j}
                              className="text-xs font-semibold bg-gray-100 text-gray-900 px-3 py-1.5 rounded-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {rec.receiptImageUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReceiptImage({
                                  url: rec.receiptImageUrl!,
                                  title: `${rec.center} — ${rec.date}`,
                                });
                              }}
                              className="flex-1 py-3 border border-ivi-accent rounded-lg text-sm font-bold text-ivi-accent hover:bg-ivi-accentLight transition-colors flex items-center justify-center gap-2"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
                                <circle cx="12" cy="13" r="4" />
                                <path d="M12 3v2" />
                              </svg>
                              계산서 보기
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (rec.receiptData) {
                                setSelectedReceipt(rec.receiptData);
                              }
                            }}
                            className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            영수증 상세
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4. 정비 알림 ── */}
        <div>
          <div className="border border-ivi-warning rounded-lg p-5 bg-ivi-warningLight/30">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-900 mb-1">정비 알림</p>
                <p className="text-sm text-gray-900">
                  브레이크 패드(전) 점검 권장 · 에어컨 필터 교체 필요
                </p>
              </div>
            </div>
            <button className="w-full py-3 bg-ivi-warning text-white rounded-lg text-sm font-bold hover:bg-ivi-warning/90 transition-colors">
              정비 예약하기
            </button>
          </div>
        </div>

        {/* ── 5. 사용자 매뉴얼 ── */}
        <button className="w-full py-4 border border-gray-300 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors">
          사용자 매뉴얼 보기
        </button>
      </div>

      {/* 영수증 텍스트 모달 */}
      {selectedReceipt && (
        <Receipt
          data={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* 영수증 이미지 모달 */}
      {selectedReceiptImage && (
        <ReceiptImageModal
          imageUrl={selectedReceiptImage.url}
          title={selectedReceiptImage.title}
          onClose={() => setSelectedReceiptImage(null)}
        />
      )}

      {/* 배터리 점검 모달 */}
      {showBatteryCheck && (
        <BatteryCheckModal onClose={() => setShowBatteryCheck(false)} />
      )}
    </>
  );
}
