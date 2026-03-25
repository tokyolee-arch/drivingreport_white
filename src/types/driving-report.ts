// ============================================
// BV IVI Driving Report - Type Definitions
// ============================================

/** 일별 주행 정보 */
export interface DailyTrip {
  date: string;                  // 'YYYY-MM-DD'
  dayOfWeek: number;             // 0(Mon) ~ 6(Sun)
  from: string;                  // 출발지
  to: string;                    // 목적지
  distance: number;              // km
  duration: number;              // minutes
  avgSpeed: number;              // km/h
  energyEfficiency: number;      // kWh/100km
  energyConsumed: number;        // kWh
  estimatedCost: number;         // won
  ecoScore: number;              // 0~100
  safetyScore: number;           // 0~100
}

/** 이벤트 수치 데이터 */
export interface EventMetricItem {
  label: string;
  value: string | number;
  color?: string;
  sub?: string;
}

/** 속도 변화 그래프 (SVG path 기반) */
export interface SpeedGraphData {
  line: { x: number; y: number }[];
  path: string;                  // SVG path 문자열
  startLabel: string;            // 시작 속도 라벨
  endLabel: string;              // 종료 속도 라벨
}

/** 비교 바 항목 */
export interface ComparisonBarItem {
  label: string;
  value: number;
  max: number;
  color: string;
  displayValue: string;
}

/** 비교 데이터 */
export interface ComparisonData {
  title: string;
  bars: ComparisonBarItem[];
}

/** 주행 이벤트 */
export interface DrivingEvent {
  id: string;
  tripDate: string;              // 'YYYY-MM-DD'
  time: string;                  // 'HH:mm'
  type: 'warn' | 'danger' | 'good' | 'info';
  category: 'accel' | 'brake' | 'speed' | 'eco' | 'complete';
  title: string;
  location: string;
  gps: {
    lat: number;
    lng: number;
    address: string;
  };
  metrics: EventMetricItem[];
  speedGraph?: SpeedGraphData;
  comparison?: ComparisonData;
  impact: string;
  tip: string;
}

/** 주간 메트릭 유형 */
export type WeeklyMetricType =
  | 'distance'
  | 'efficiency'
  | 'consumption'
  | 'eco'
  | 'score';

/** 주간 요약 일별 데이터 */
export interface WeeklyDayData {
  distance: number;
  efficiency: number;
  consumption: number;
  ecoScore: number;
  safetyScore: number;
}

/** 주간 요약 */
export interface WeeklySummary {
  weekStart: string;             // 'YYYY-MM-DD' (월요일)
  days: WeeklyDayData[];         // length: 7 (Mon~Sun)
}

/** 안전 세부항목 */
export interface SafetyDetail {
  category: string;
  score: number;                 // 0~100
  icon: string;
}

/** 소모품 상태 */
export interface ConsumableStatus {
  name: string;
  remainPercent: number;         // 0~100
  detail: string;
  color: string;
}

/** 정비 이력 */
export interface MaintenanceRecord {
  date: string;                  // 'YYYY-MM-DD'
  item: string;
  mileage: number;               // km
  cost: number;                  // won
  icon: string;
}

/** 차량 가치 예상 시세 */
export interface EstimatedValue {
  low: number;
  mid: number;
  high: number;
}

/** 가치 요인 */
export interface ValueFactorItem {
  factor: string;
  impact: string;
}

/** 차량 가치 종합 데이터 */
export interface VehicleValueData {
  trustScore: number;            // 0~100
  totalMileage: number;          // km
  vehicleAge: number;            // years
  accidentCount: number;
  maintenanceRate: number;       // 0~100 %
  batterySOH: number;            // 0~100 %
  avgSafetyScore: number;        // 0~100
  estimatedValue: EstimatedValue;
  valueFactors: ValueFactorItem[];
}

// ============================================
// 비용관리 탭 (FMS P&L 일반차량 적용)
// ============================================

/** 일일 차량 비용 항목 */
export interface DailyCostItem {
  category: string;           // '충전비' | '감가상각' | '소모품마모' | '보험료' | '주차비'
  icon: string;
  amount: number;             // won
  color: string;
}

/** 일일 차량 비용 대시보드 */
export interface DailyCostData {
  date: string;               // 'YYYY-MM-DD'
  totalCost: number;          // 총 일일 비용
  costItems: DailyCostItem[];
  costRatio: number;          // 비용 대비 비율 (%)
  costRatioTarget: number;    // 목표 비율 (%)
  healthScore: number;        // 차량 건강 스코어 (0~100)
  healthScoreChange: number;  // 전일 대비 변화
}

/** 절감 카운터 */
export interface SavingsData {
  monthlySavings: number;     // 이번 달 절감 누적
  todaySavings: number;       // 오늘 절감액
  savingsSources: {
    label: string;
    amount: number;
  }[];
}

/** AI 인사이트 */
export interface AIInsight {
  id: string;
  message: string;
  savingsAmount?: number;     // 절감 가능 금액
  category: 'eco' | 'maintenance' | 'safety' | 'fuel';
  icon: string;
  actionable: boolean;
}

/** 스트릭 & 챌린지 */
export interface StreakData {
  currentStreak: number;      // 현재 연속 일수
  bestStreak: number;         // 역대 최장
  weeklyChallenge: {
    title: string;
    progress: number;         // 0~100
    reward: string;
  };
  monthlyGoal: {
    title: string;
    current: number;
    target: number;
    unit: string;
  };
}

/** 일일 미니 퀘스트 */
export interface DailyQuest {
  id: string;
  title: string;
  points: number;
  progress: number;           // 0~100
  status: 'active' | 'completed' | 'locked';
}

/** 업적 & 마일스톤 */
export interface Achievement {
  id: string;
  title: string;
  icon: string;
  earned: boolean;
  progress?: number;          // 0~100 (미달성 시)
  target?: string;            // 목표 설명
}

/** 충전/유가 정보 */
export interface EnergyPriceData {
  currentPrice: number;       // 현재 가격 (원/kWh 또는 원/L)
  priceChange: number;        // 전일 대비 변화
  unit: string;               // 'kWh' | 'L'
  recommendation: 'charge_now' | 'wait' | 'normal';
  nearestStation: {
    name: string;
    price: number;
    distance: string;
  };
  weeklyTrend: number[];      // 7일 추세
}

// ============================================
// 리스크 금액화 (FMS 유니크B 일반차량 적용)
// ============================================

/** 소모품 리스크 금액화 */
export interface ConsumableRisk {
  consumableName: string;
  currentStatus: string;      // '교체 주기 초과' 등
  damageProb: number;         // 고장 확률 (%)
  repairCost: number;         // 수리 비용 (원)
  replaceCost: number;        // 교체 비용 (원)
  totalRisk: number;          // 총 리스크 금액 (원)
  riskMultiplier: number;     // 무시 대비 배율 (예: 67배)
}

// ============================================
// 수리 vs 교체 의사결정 (FMS 유니크C 일반차량 적용)
// ============================================

/** 수리 vs 교체 비교 항목 */
export interface RepairVsReplaceItem {
  label: string;
  keepValue: string;
  replaceValue: string;
  keepHighlight?: boolean;
  replaceHighlight?: boolean;
}

/** 수리 vs 교체 의사결정 데이터 */
export interface RepairVsReplaceData {
  currentVehicleValue: number;        // 현재 차량 가치
  expectedRepairCost12m: number;      // 향후 12개월 예상 수리비
  newVehiclePrice: number;            // 신차 매입 가격
  monthlyMaintCurrent: number;        // 현재 차량 월 유지비
  monthlyMaintNew: number;            // 신차 월 유지비
  comparisonItems: RepairVsReplaceItem[];
  recommendation: string;             // AI 추천 메시지
  optimalReplaceMonths: number;       // 교체 최적 시점 (개월)
}

/** 탭 ID */
export type TabId = 'summary' | 'safety' | 'cost' | 'maintenance' | 'value';

/** 탭 설정 */
export interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}
