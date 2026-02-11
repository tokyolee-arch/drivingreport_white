'use client';

import { useState } from 'react';
import ProgressBar from '@/components/shared/ProgressBar';
import Receipt from '@/components/service/Receipt';
import BatteryCheckModal from '@/components/vehicle/BatteryCheckModal';

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
}

// ── 소모품 데이터 ──
const CONSUMABLES = [
  { label: '브레이크패드(전)', percent: 42, detail: '교체 4,200km 남음', color: '#f59e0b' },
  { label: '브레이크패드(후)', percent: 68, detail: '교체 11,500km 남음', color: '#10b981' },
  { label: '타이어마모도', percent: 55, detail: '교체 16,500km 남음', color: '#10b981' },
  { label: '에어컨필터', percent: 25, detail: '즉시 교체 권장', color: '#ef4444' },
  { label: '와이퍼블레이드', percent: 60, detail: '교체 6,000km 남음', color: '#10b981' },
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
export default function VehicleManagementTab() {
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [showBatteryCheck, setShowBatteryCheck] = useState(false);

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

        {/* ── 2. 소모품 상태 ── */}
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">소모품 상태</h3>
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="space-y-5">
              {CONSUMABLES.map((c) => (
                <ProgressBar
                  key={c.label}
                  value={c.percent}
                  max={100}
                  color={c.color}
                  label={c.label}
                  detail={c.detail}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. 방문 정비 이력 ── */}
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">방문 정비 이력</h3>
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (rec.receiptData) {
                              setSelectedReceipt(rec.receiptData);
                            }
                          }}
                          className="w-full py-3 border border-ivi-accent rounded-lg text-sm font-bold text-ivi-accent hover:bg-ivi-accentLight transition-colors"
                        >
                          영수증 · 계산서 보기
                        </button>
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

      {/* 영수증 모달 */}
      {selectedReceipt && (
        <Receipt
          data={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* 배터리 점검 모달 */}
      {showBatteryCheck && (
        <BatteryCheckModal onClose={() => setShowBatteryCheck(false)} />
      )}
    </>
  );
}
