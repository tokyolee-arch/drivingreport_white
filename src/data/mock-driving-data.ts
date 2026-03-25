import type {
  DailyTrip,
  DrivingEvent,
  WeeklySummary,
  SafetyDetail,
  ConsumableStatus,
  MaintenanceRecord,
  VehicleValueData,
  DailyCostData,
  SavingsData,
  AIInsight,
  StreakData,
  DailyQuest,
  Achievement,
  EnergyPriceData,
  ConsumableRisk,
  RepairVsReplaceData,
} from '@/types/driving-report';

// ============================================
// Helper: SVG path 생성
// ============================================
function buildSpeedPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

// ============================================
// 주행 요약 - 7일치 DailyTrip (Mon~Sun)
// ============================================
export const weeklyTrips: DailyTrip[] = [
  // 월요일 (2026-02-09)
  {
    date: '2026-02-09',
    dayOfWeek: 0,
    from: '서울 강남',
    to: '성남 분당',
    distance: 28.4,
    duration: 42,
    avgSpeed: 40.6,
    energyEfficiency: 15.2,
    energyConsumed: 4.3,
    estimatedCost: 860,
    ecoScore: 78,
    safetyScore: 85,
  },
  // 화요일
  {
    date: '2026-02-10',
    dayOfWeek: 1,
    from: '성남 분당',
    to: '서울 잠실',
    distance: 18.7,
    duration: 35,
    avgSpeed: 32.1,
    energyEfficiency: 16.8,
    energyConsumed: 3.1,
    estimatedCost: 620,
    ecoScore: 72,
    safetyScore: 88,
  },
  // 수요일 (이벤트 가장 많은 날)
  {
    date: '2026-02-11',
    dayOfWeek: 2,
    from: '서울 잠실',
    to: '하남 미사',
    distance: 35.2,
    duration: 58,
    avgSpeed: 36.4,
    energyEfficiency: 17.5,
    energyConsumed: 6.2,
    estimatedCost: 1240,
    ecoScore: 62,
    safetyScore: 71,
  },
  // 목요일 (주행 없음 - 이벤트 0건)
  {
    date: '2026-02-12',
    dayOfWeek: 3,
    from: '',
    to: '',
    distance: 0,
    duration: 0,
    avgSpeed: 0,
    energyEfficiency: 0,
    energyConsumed: 0,
    estimatedCost: 0,
    ecoScore: 0,
    safetyScore: 98,
  },
  // 금요일
  {
    date: '2026-02-13',
    dayOfWeek: 4,
    from: '서울 강남',
    to: '수원 영통',
    distance: 45.3,
    duration: 65,
    avgSpeed: 41.8,
    energyEfficiency: 14.9,
    energyConsumed: 6.7,
    estimatedCost: 1340,
    ecoScore: 85,
    safetyScore: 91,
  },
  // 토요일
  {
    date: '2026-02-14',
    dayOfWeek: 5,
    from: '수원 영통',
    to: '용인 수지',
    distance: 15.2,
    duration: 22,
    avgSpeed: 41.5,
    energyEfficiency: 13.5,
    energyConsumed: 2.1,
    estimatedCost: 420,
    ecoScore: 88,
    safetyScore: 93,
  },
  // 일요일
  {
    date: '2026-02-15',
    dayOfWeek: 6,
    from: '용인 수지',
    to: '서울 강남',
    distance: 35.8,
    duration: 48,
    avgSpeed: 44.8,
    energyEfficiency: 15.5,
    energyConsumed: 5.5,
    estimatedCost: 1100,
    ecoScore: 80,
    safetyScore: 87,
  },
];

// ============================================
// 주간 요약
// ============================================
export const weeklySummary: WeeklySummary = {
  weekStart: '2026-02-09',
  days: weeklyTrips.map((t) => ({
    distance: t.distance,
    efficiency: t.energyEfficiency,
    consumption: t.energyConsumed,
    ecoScore: t.ecoScore,
    safetyScore: t.safetyScore,
  })),
};

// ============================================
// 주행 이벤트 (~25건)
// 목요일 = 0건, 수요일 = 가장 많음 (5건)
// ============================================
export const drivingEvents: DrivingEvent[] = [
  // ──── 월요일 (4건) ────
  {
    id: 'ev-mon-01',
    tripDate: '2026-02-09',
    time: '08:23',
    type: 'warn',
    category: 'accel',
    title: '급가속 감지',
    location: '강남대로 역삼역 부근',
    gps: { lat: 37.5007, lng: 127.0365, address: '서울 강남구 역삼동 강남대로 396' },
    metrics: [
      { label: '가속도', value: '3.2G', color: '#f59e0b' },
      { label: '속도변화', value: '0→62km/h' },
      { label: '소요시간', value: '4.1초' },
    ],
    speedGraph: (() => {
      const line = [
        { x: 0, y: 80 }, { x: 25, y: 65 }, { x: 50, y: 45 },
        { x: 75, y: 25 }, { x: 100, y: 12 },
      ];
      return { line, path: buildSpeedPath(line), startLabel: '0', endLabel: '62km/h' };
    })(),
    comparison: {
      title: '급가속 횟수 비교',
      bars: [
        { label: '나', value: 3, max: 5, color: '#f59e0b', displayValue: '3회/일' },
        { label: '평균', value: 1.2, max: 5, color: '#00d4aa', displayValue: '1.2회/일' },
      ],
    },
    impact: '에너지 소비 12% 증가, 배터리 수명에 영향을 줄 수 있습니다.',
    tip: '출발 시 천천히 가속하면 에너지 효율이 15% 향상됩니다.',
  },
  {
    id: 'ev-mon-02',
    tripDate: '2026-02-09',
    time: '08:45',
    type: 'good',
    category: 'eco',
    title: '에코 드라이빙 구간 달성',
    location: '분당수서로 정자역 부근',
    gps: { lat: 37.3691, lng: 127.1085, address: '성남시 분당구 정자동 분당수서로 45' },
    metrics: [
      { label: '평균효율', value: '12.3kWh', color: '#00d4aa' },
      { label: '구간거리', value: '5.2km' },
      { label: '절약량', value: '0.8kWh', color: '#00d4aa', sub: '≈160원' },
    ],
    impact: '구간 에너지 효율 우수 — 평균 대비 18% 절약했습니다.',
    tip: '현재 운전 스타일을 유지하면 월 15,000원 절약이 가능합니다.',
  },

  // 월요일 추가 이벤트
  {
    id: 'ev-mon-03',
    tripDate: '2026-02-09',
    time: '08:52',
    type: 'warn',
    category: 'speed',
    title: '과속 주의 구간',
    location: '분당수서로 수내역 부근',
    gps: { lat: 37.3775, lng: 127.1119, address: '성남시 분당구 수내동 분당수서로' },
    metrics: [
      { label: '주행속도', value: '72km/h', color: '#f59e0b' },
      { label: '제한속도', value: '60km/h' },
      { label: '초과량', value: '+12km/h', color: '#f59e0b' },
    ],
    impact: '제한속도 초과 구간을 주행했습니다.',
    tip: '분당 시내 구간은 60km/h 이하로 주행해 주세요.',
  },
  {
    id: 'ev-mon-04',
    tripDate: '2026-02-09',
    time: '09:05',
    type: 'info',
    category: 'complete',
    title: '주행 완료',
    location: '성남 분당',
    gps: { lat: 37.3500, lng: 127.1100, address: '성남시 분당구' },
    metrics: [
      { label: '총 주행거리', value: '28.4km' },
      { label: '총 소요시간', value: '42분' },
      { label: '종합등급', value: 'B', color: '#3b82f6' },
    ],
    impact: '급가속 1건, 과속 1건이 감지된 주행입니다.',
    tip: '출퇴근 루트에서 과속 구간을 미리 인지하고 주행하세요.',
  },

  // ──── 화요일 (4건) ────
  {
    id: 'ev-tue-00',
    tripDate: '2026-02-10',
    time: '09:02',
    type: 'warn',
    category: 'accel',
    title: '급가속 감지',
    location: '강변북로 성수대교 부근',
    gps: { lat: 37.5340, lng: 127.0460, address: '서울 성동구 성수동 강변북로' },
    metrics: [
      { label: '가속도', value: '2.9G', color: '#f59e0b' },
      { label: '속도변화', value: '15→68km/h' },
      { label: '소요시간', value: '4.5초' },
    ],
    impact: '교통 흐름 합류 시 급가속이 발생했습니다.',
    tip: '합류 구간에서는 미리 속도를 맞추어 진입하세요.',
  },
  {
    id: 'ev-tue-01',
    tripDate: '2026-02-10',
    time: '09:12',
    type: 'danger',
    category: 'brake',
    title: '급제동 발생',
    location: '올림픽대로 잠실대교 부근',
    gps: { lat: 37.5172, lng: 127.0935, address: '서울 송파구 잠실동 올림픽대로' },
    metrics: [
      { label: '감속도', value: '-4.8G', color: '#ef4444' },
      { label: '속도변화', value: '72→15km/h' },
      { label: '제동거리', value: '28m', color: '#ef4444' },
    ],
    speedGraph: (() => {
      const line = [
        { x: 0, y: 10 }, { x: 20, y: 18 }, { x: 40, y: 35 },
        { x: 60, y: 55 }, { x: 80, y: 70 }, { x: 100, y: 78 },
      ];
      return { line, path: buildSpeedPath(line), startLabel: '72km/h', endLabel: '15km/h' };
    })(),
    comparison: {
      title: '급제동 횟수 비교',
      bars: [
        { label: '나', value: 2, max: 5, color: '#ef4444', displayValue: '2회/일' },
        { label: '평균', value: 0.8, max: 5, color: '#00d4aa', displayValue: '0.8회/일' },
      ],
    },
    impact: '타이어 마모가 가속되고 뒤차 추돌 위험이 있습니다.',
    tip: '전방 주시를 강화하고 충분한 안전거리를 유지하세요.',
  },
  {
    id: 'ev-tue-02',
    tripDate: '2026-02-10',
    time: '09:25',
    type: 'warn',
    category: 'speed',
    title: '과속 주의 구간',
    location: '올림픽대로 풍납동 부근',
    gps: { lat: 37.5235, lng: 127.1158, address: '서울 송파구 풍납동 올림픽대로' },
    metrics: [
      { label: '주행속도', value: '92km/h', color: '#f59e0b' },
      { label: '제한속도', value: '80km/h' },
      { label: '초과량', value: '+12km/h', color: '#f59e0b' },
    ],
    impact: '제한속도 초과로 과속 벌점 위험이 있습니다.',
    tip: '크루즈 컨트롤을 설정하면 속도를 일정하게 유지할 수 있습니다.',
  },
  {
    id: 'ev-tue-03',
    tripDate: '2026-02-10',
    time: '09:38',
    type: 'info',
    category: 'complete',
    title: '주행 완료',
    location: '서울 잠실',
    gps: { lat: 37.5133, lng: 127.1001, address: '서울 송파구 잠실동' },
    metrics: [
      { label: '총 주행거리', value: '18.7km' },
      { label: '총 소요시간', value: '35분' },
      { label: '효율등급', value: 'B+', color: '#3b82f6' },
    ],
    impact: '오늘의 주행 효율 등급: B+',
    tip: '내일은 에코 모드로 주행해 보세요!',
  },

  // ──── 수요일 (5건 — 가장 많은 날) ────
  {
    id: 'ev-wed-01',
    tripDate: '2026-02-11',
    time: '07:48',
    type: 'danger',
    category: 'accel',
    title: '위험 급가속',
    location: '잠실대교 남단',
    gps: { lat: 37.5155, lng: 127.0869, address: '서울 송파구 잠실동 잠실대교' },
    metrics: [
      { label: '가속도', value: '4.5G', color: '#ef4444' },
      { label: '속도변화', value: '0→78km/h' },
      { label: '소요시간', value: '3.8초' },
    ],
    speedGraph: (() => {
      const line = [
        { x: 0, y: 85 }, { x: 20, y: 68 }, { x: 40, y: 48 },
        { x: 60, y: 28 }, { x: 80, y: 12 }, { x: 100, y: 5 },
      ];
      return { line, path: buildSpeedPath(line), startLabel: '0', endLabel: '78km/h' };
    })(),
    comparison: {
      title: '급가속 강도 비교',
      bars: [
        { label: '이번', value: 4.5, max: 6, color: '#ef4444', displayValue: '4.5G' },
        { label: '평균', value: 2.1, max: 6, color: '#00d4aa', displayValue: '2.1G' },
      ],
    },
    impact: '배터리에 과도한 부하가 걸려 수명이 단축될 수 있습니다.',
    tip: '신호 출발 시 3초간 서서히 가속하는 습관을 들여보세요.',
  },
  {
    id: 'ev-wed-02',
    tripDate: '2026-02-11',
    time: '08:05',
    type: 'warn',
    category: 'brake',
    title: '급제동 감지',
    location: '올림픽대로 천호대교 부근',
    gps: { lat: 37.5382, lng: 127.1245, address: '서울 강동구 천호동 올림픽대로' },
    metrics: [
      { label: '감속도', value: '-3.2G', color: '#f59e0b' },
      { label: '속도변화', value: '65→20km/h' },
      { label: '제동거리', value: '18m' },
    ],
    speedGraph: (() => {
      const line = [
        { x: 0, y: 15 }, { x: 25, y: 28 }, { x: 50, y: 48 },
        { x: 75, y: 65 }, { x: 100, y: 72 },
      ];
      return { line, path: buildSpeedPath(line), startLabel: '65km/h', endLabel: '20km/h' };
    })(),
    impact: '전방 차량 급정거로 인한 긴급 제동이 발생했습니다.',
    tip: '전방 차량과 3초 이상의 안전거리를 유지하세요.',
  },
  {
    id: 'ev-wed-03',
    tripDate: '2026-02-11',
    time: '08:22',
    type: 'warn',
    category: 'speed',
    title: '과속 주의',
    location: '미사대로 하남 미사역 부근',
    gps: { lat: 37.5607, lng: 127.1942, address: '하남시 미사동 미사대로' },
    metrics: [
      { label: '주행속도', value: '78km/h', color: '#f59e0b' },
      { label: '제한속도', value: '60km/h' },
      { label: '초과량', value: '+18km/h', color: '#f59e0b' },
    ],
    comparison: {
      title: '과속 빈도 비교',
      bars: [
        { label: '나', value: 3, max: 5, color: '#f59e0b', displayValue: '3회/일' },
        { label: '평균', value: 0.8, max: 5, color: '#00d4aa', displayValue: '0.8회/일' },
      ],
    },
    impact: '주거지역 내 과속으로 사고 위험이 높습니다.',
    tip: '주택가 주변에서는 속도를 낮춰 안전 운전하세요.',
  },
  {
    id: 'ev-wed-04',
    tripDate: '2026-02-11',
    time: '08:35',
    type: 'danger',
    category: 'brake',
    title: '위험 급제동',
    location: '미사강변대로',
    gps: { lat: 37.5645, lng: 127.2015, address: '하남시 미사동 미사강변대로' },
    metrics: [
      { label: '감속도', value: '-5.1G', color: '#ef4444' },
      { label: '속도변화', value: '80→5km/h' },
      { label: '제동거리', value: '32m', color: '#ef4444' },
    ],
    speedGraph: (() => {
      const line = [
        { x: 0, y: 8 }, { x: 15, y: 15 }, { x: 30, y: 32 },
        { x: 50, y: 55 }, { x: 70, y: 72 }, { x: 100, y: 88 },
      ];
      return { line, path: buildSpeedPath(line), startLabel: '80km/h', endLabel: '5km/h' };
    })(),
    comparison: {
      title: '위험 급제동 비교',
      bars: [
        { label: '이번', value: 5.1, max: 6, color: '#ef4444', displayValue: '-5.1G' },
        { label: '위험기준', value: 4.0, max: 6, color: '#f59e0b', displayValue: '-4.0G' },
      ],
    },
    impact: 'ABS 작동 수준의 급제동입니다. 차량과 탑승자 안전에 주의하세요.',
    tip: '교차로 접근 시 미리 감속하고 방어 운전을 실천하세요.',
  },
  {
    id: 'ev-wed-05',
    tripDate: '2026-02-11',
    time: '08:52',
    type: 'info',
    category: 'complete',
    title: '주행 완료',
    location: '하남 미사',
    gps: { lat: 37.5610, lng: 127.1950, address: '하남시 미사동' },
    metrics: [
      { label: '총 주행거리', value: '35.2km' },
      { label: '총 소요시간', value: '58분' },
      { label: '효율등급', value: 'C', color: '#f59e0b' },
    ],
    impact: '이벤트가 많은 주행이었습니다. 안전점수 71점으로 주의가 필요합니다.',
    tip: '다음 주행에서는 여유로운 출발과 안전거리 확보를 실천해 보세요.',
  },

  // ──── 목요일 (0건 — 무결점) ────
  // 이벤트 없음

  // ──── 금요일 (4건) ────
  {
    id: 'ev-fri-01',
    tripDate: '2026-02-13',
    time: '10:15',
    type: 'good',
    category: 'eco',
    title: '최적 에너지 효율 달성',
    location: '용인서울고속도로',
    gps: { lat: 37.3300, lng: 127.0800, address: '용인시 수지구 용인서울고속도로' },
    metrics: [
      { label: '평균효율', value: '13.1kWh', color: '#00d4aa' },
      { label: '구간거리', value: '22.5km' },
      { label: '절약량', value: '2.1kWh', color: '#00d4aa', sub: '≈420원' },
    ],
    impact: '장거리 주행에서 우수한 에너지 효율을 기록했습니다.',
    tip: '고속도로 구간에서의 정속 주행이 매우 효과적입니다.',
  },
  {
    id: 'ev-fri-02a',
    tripDate: '2026-02-13',
    time: '10:35',
    type: 'good',
    category: 'eco',
    title: '회생제동 효율 구간',
    location: '용인서울고속도로 하행',
    gps: { lat: 37.3150, lng: 127.0650, address: '용인시 수지구 용인서울고속도로' },
    metrics: [
      { label: '회생에너지', value: '0.8kWh', color: '#00d4aa' },
      { label: '회생률', value: '28%', color: '#00d4aa' },
      { label: '절약비용', value: '160원' },
    ],
    impact: '내리막 구간에서 회생제동을 잘 활용했습니다.',
    tip: '고속도로 내리막에서 엑셀을 떼고 회생제동을 활용하세요.',
  },
  {
    id: 'ev-fri-02',
    tripDate: '2026-02-13',
    time: '10:48',
    type: 'warn',
    category: 'accel',
    title: '급가속 감지',
    location: '영동고속도로 수원IC',
    gps: { lat: 37.2880, lng: 127.0150, address: '수원시 영통구 영동고속도로' },
    metrics: [
      { label: '가속도', value: '2.8G', color: '#f59e0b' },
      { label: '속도변화', value: '30→85km/h' },
      { label: '소요시간', value: '5.8초' },
    ],
    impact: '고속도로 합류 시 급가속으로 에너지 소비가 8% 증가했습니다.',
    tip: '고속도로 진입 시에도 점진적 가속을 권장합니다.',
  },
  {
    id: 'ev-fri-03',
    tripDate: '2026-02-13',
    time: '11:20',
    type: 'info',
    category: 'complete',
    title: '이번 주 최장거리 주행',
    location: '수원 영통',
    gps: { lat: 37.2636, lng: 127.0286, address: '수원시 영통구 영통동' },
    metrics: [
      { label: '총 주행거리', value: '45.3km' },
      { label: '총 소요시간', value: '65분' },
      { label: '종합등급', value: 'A', color: '#00d4aa' },
    ],
    impact: '이번 주 최장거리이면서 높은 효율 주행을 달성했습니다!',
    tip: '장거리 주행에서도 안정적인 운전습관을 보여주고 있습니다.',
  },

  // ──── 토요일 (3건) ────
  {
    id: 'ev-sat-00',
    tripDate: '2026-02-14',
    time: '14:15',
    type: 'good',
    category: 'eco',
    title: '출발 시 부드러운 가속',
    location: '수원 영통 출발지',
    gps: { lat: 37.2636, lng: 127.0286, address: '수원시 영통구 영통동' },
    metrics: [
      { label: '가속도', value: '1.2G', color: '#00d4aa' },
      { label: '속도변화', value: '0→40km/h' },
      { label: '소요시간', value: '8.5초' },
    ],
    impact: '부드러운 출발로 에너지 절약과 배터리 보호에 기여했습니다.',
    tip: '이 습관을 유지하면 배터리 수명이 약 5% 연장됩니다.',
  },
  {
    id: 'ev-sat-01',
    tripDate: '2026-02-14',
    time: '14:30',
    type: 'good',
    category: 'eco',
    title: '에코 드라이빙 구간 달성',
    location: '수지IC ~ 용인',
    gps: { lat: 37.3221, lng: 127.0798, address: '용인시 수지구 죽전동' },
    metrics: [
      { label: '평균효율', value: '12.5kWh', color: '#00d4aa' },
      { label: '구간거리', value: '15.2km' },
      { label: '절약량', value: '0.9kWh', color: '#00d4aa', sub: '≈180원' },
    ],
    impact: '주말 여유로운 주행으로 높은 효율을 달성했습니다.',
    tip: '주말 주행 패턴이 매우 효율적입니다. 계속 유지하세요!',
  },
  {
    id: 'ev-sat-02',
    tripDate: '2026-02-14',
    time: '14:50',
    type: 'info',
    category: 'complete',
    title: '주행 완료',
    location: '용인 수지',
    gps: { lat: 37.3230, lng: 127.0830, address: '용인시 수지구' },
    metrics: [
      { label: '총 주행거리', value: '15.2km' },
      { label: '총 소요시간', value: '22분' },
      { label: '종합등급', value: 'A+', color: '#00d4aa' },
    ],
    impact: '짧은 거리에서도 높은 효율을 유지한 모범 주행입니다.',
    tip: '오늘처럼 여유로운 주행 습관을 평일에도 적용해 보세요.',
  },

  // ──── 일요일 (5건) ────
  {
    id: 'ev-sun-01',
    tripDate: '2026-02-15',
    time: '09:15',
    type: 'warn',
    category: 'brake',
    title: '급제동 감지',
    location: '경부고속도로 서초IC',
    gps: { lat: 37.4834, lng: 127.0154, address: '서울 서초구 서초동 경부고속도로' },
    metrics: [
      { label: '감속도', value: '-3.5G', color: '#f59e0b' },
      { label: '속도변화', value: '85→35km/h' },
      { label: '제동거리', value: '22m' },
    ],
    speedGraph: (() => {
      const line = [
        { x: 0, y: 12 }, { x: 25, y: 25 }, { x: 50, y: 45 },
        { x: 75, y: 62 }, { x: 100, y: 72 },
      ];
      return { line, path: buildSpeedPath(line), startLabel: '85km/h', endLabel: '35km/h' };
    })(),
    comparison: {
      title: '급제동 횟수 비교',
      bars: [
        { label: '나', value: 1, max: 5, color: '#f59e0b', displayValue: '1회/일' },
        { label: '평균', value: 0.8, max: 5, color: '#00d4aa', displayValue: '0.8회/일' },
      ],
    },
    impact: '일요일 교통량 증가로 인한 급제동이 발생했습니다.',
    tip: '주말 고속도로는 정체가 잦으니 차간 거리를 더 확보하세요.',
  },
  {
    id: 'ev-sun-01a',
    tripDate: '2026-02-15',
    time: '09:28',
    type: 'warn',
    category: 'accel',
    title: '급가속 감지',
    location: '양재IC 진입로',
    gps: { lat: 37.4700, lng: 127.0350, address: '서울 서초구 양재동 양재IC' },
    metrics: [
      { label: '가속도', value: '3.0G', color: '#f59e0b' },
      { label: '속도변화', value: '25→72km/h' },
      { label: '소요시간', value: '4.8초' },
    ],
    impact: 'IC 진입 시 급가속으로 에너지 효율이 저하되었습니다.',
    tip: 'IC 합류 시에는 가속 차로를 충분히 활용하세요.',
  },
  {
    id: 'ev-sun-01b',
    tripDate: '2026-02-15',
    time: '09:42',
    type: 'good',
    category: 'eco',
    title: '에코 드라이빙 구간 달성',
    location: '양재대로 서초 구간',
    gps: { lat: 37.4850, lng: 127.0300, address: '서울 서초구 서초동 양재대로' },
    metrics: [
      { label: '평균효율', value: '11.8kWh', color: '#00d4aa' },
      { label: '구간거리', value: '4.5km' },
      { label: '절약량', value: '0.6kWh', color: '#00d4aa', sub: '≈120원' },
    ],
    impact: '시내 구간에서도 우수한 에너지 효율을 달성했습니다.',
    tip: '정속 주행과 부드러운 가감속이 효율의 핵심입니다.',
  },
  {
    id: 'ev-sun-02',
    tripDate: '2026-02-15',
    time: '09:55',
    type: 'good',
    category: 'eco',
    title: '회생제동 활용 우수',
    location: '양재대로 ~ 강남대로',
    gps: { lat: 37.4957, lng: 127.0285, address: '서울 서초구 양재동 양재대로' },
    metrics: [
      { label: '회생에너지', value: '1.2kWh', color: '#00d4aa' },
      { label: '회생률', value: '35%', color: '#00d4aa' },
      { label: '절약비용', value: '240원', sub: '연간 8.7만원' },
    ],
    impact: '회생제동으로 에너지 효율이 크게 향상되었습니다.',
    tip: '내리막과 감속 시 회생제동을 적극 활용하세요.',
  },
  {
    id: 'ev-sun-03',
    tripDate: '2026-02-15',
    time: '10:05',
    type: 'info',
    category: 'complete',
    title: '주행 완료',
    location: '서울 강남',
    gps: { lat: 37.4979, lng: 127.0276, address: '서울 강남구 역삼동' },
    metrics: [
      { label: '총 주행거리', value: '35.8km' },
      { label: '총 소요시간', value: '48분' },
      { label: '종합등급', value: 'A-', color: '#3b82f6' },
    ],
    impact: '급제동 1회를 제외하면 전반적으로 안전한 주행이었습니다.',
    tip: '한 주의 마무리를 안전 운전으로 잘 마쳤습니다!',
  },
];

// ============================================
// 안전 점수 Tab
// ============================================
export const overallSafetyScore = 82;
export const safetyGrade = 'A';

export const safetyDetails: SafetyDetail[] = [
  { category: '급가속', score: 78, icon: '⚡' },
  { category: '급제동', score: 72, icon: '🛑' },
  { category: '급회전', score: 92, icon: '↩️' },
  { category: '과속', score: 75, icon: '💨' },
  { category: '차선유지', score: 88, icon: '🛤️' },
  { category: '안전거리', score: 80, icon: '📏' },
];

// ============================================
// 차량 관리 Tab
// ============================================
export const consumables: ConsumableStatus[] = [
  { name: '엔진오일', remainPercent: 35, detail: '교체 6,500km 남음', color: '#f59e0b' },
  { name: '브레이크 패드', remainPercent: 62, detail: '교체 11,500km 남음', color: '#00d4aa' },
  { name: '에어컨 필터', remainPercent: 12, detail: '즉시 교체 권장', color: '#ef4444' },
  { name: '타이어', remainPercent: 55, detail: '교체 16,500km 남음', color: '#00d4aa' },
  { name: '와이퍼', remainPercent: 40, detail: '교체 3,500km 남음', color: '#f59e0b' },
  { name: '배터리 냉각수', remainPercent: 78, detail: '교체 21,500km 남음', color: '#00d4aa' },
];

export const maintenanceRecords: MaintenanceRecord[] = [
  { date: '2026-01-15', item: '엔진오일 교체', mileage: 75000, cost: 85000, icon: '🛢️' },
  { date: '2025-11-22', item: '에어컨 필터 교체', mileage: 70000, cost: 35000, icon: '❄️' },
  { date: '2025-09-10', item: '종합점검 + 오일교체', mileage: 65000, cost: 150000, icon: '🔧' },
  { date: '2025-07-05', item: '타이어 로테이션', mileage: 60000, cost: 40000, icon: '🛞' },
  { date: '2025-05-18', item: '와이퍼 블레이드 교체', mileage: 55000, cost: 25000, icon: '🌧️' },
];

// ============================================
// 차량 가치 Tab
// ============================================
export const vehicleValueData: VehicleValueData = {
  trustScore: 91,
  totalMileage: 78500,
  vehicleAge: 3,
  accidentCount: 0,
  maintenanceRate: 95,
  batterySOH: 94,
  avgSafetyScore: 82,
  estimatedValue: {
    low: 28500000,
    mid: 31200000,
    high: 33800000,
  },
  valueFactors: [
    { factor: '무사고 이력', impact: '+150만원' },
    { factor: '정비이행률 95%', impact: '+80만원' },
    { factor: '배터리 SOH 94%', impact: '+120만원' },
    { factor: '안전점수 A등급', impact: '+50만원' },
    { factor: '주행거리 78,500km', impact: '기준' },
    { factor: '차령 3년', impact: '기준' },
  ],
};

// ============================================
// 비용관리 탭 데이터 (FMS P&L 일반차량 적용)
// ============================================

export const dailyCostData: DailyCostData = {
  date: '2026-03-15',
  totalCost: 12850,
  costItems: [
    { category: '충전비', icon: '⚡', amount: 5840, color: '#3b82f6' },
    { category: '일일 감가', icon: '📉', amount: 3970, color: '#8b5cf6' },
    { category: '소모품 마모', icon: '🔧', amount: 1480, color: '#f59e0b' },
    { category: '보험료 (일할)', icon: '🛡️', amount: 1060, color: '#06b6d4' },
    { category: '주차비', icon: '🅿️', amount: 500, color: '#64748b' },
  ],
  costRatio: 100,
  costRatioTarget: 100,
  healthScore: 87,
  healthScoreChange: 2,
};

export const savingsData: SavingsData = {
  monthlySavings: 48500,
  todaySavings: 3200,
  savingsSources: [
    { label: '에코드라이빙 절감', amount: 28000 },
    { label: '적시 정비 리스크 방지', amount: 12500 },
    { label: '최적 충전 타이밍', amount: 8000 },
  ],
};

export const aiInsights: AIInsight[] = [
  {
    id: 'ai-1',
    message: '어제 급가속 3회 → 줄이면 월 12,000원 절감 가능',
    savingsAmount: 12000,
    category: 'eco',
    icon: '💡',
    actionable: true,
  },
  {
    id: 'ai-2',
    message: '이번 주 에너지 효율 8% 하락 — 타이어 공기압 점검 추천',
    category: 'maintenance',
    icon: '🔧',
    actionable: true,
  },
];

export const streakData: StreakData = {
  currentStreak: 15,
  bestStreak: 18,
  weeklyChallenge: {
    title: '급제동 0회 달성',
    progress: 72,
    reward: '+500P',
  },
  monthlyGoal: {
    title: '차량비용 목표',
    current: 285000,
    target: 350000,
    unit: '원',
  },
};

export const dailyQuests: DailyQuest[] = [
  { id: 'q-1', title: '에코존(60km/h) 10분 유지', points: 50, progress: 65, status: 'active' },
  { id: 'q-2', title: '출발 전 타이어 점검', points: 40, progress: 0, status: 'active' },
  { id: 'q-3', title: '회생제동 30% 이상 달성', points: 60, progress: 100, status: 'completed' },
];

export const achievements: Achievement[] = [
  { id: 'ach-1', title: '10만원 절감', icon: '🎉', earned: true },
  { id: 'ach-2', title: '30일 연속 점검', icon: '🔥', earned: false, progress: 50, target: '15/30일' },
  { id: 'ach-3', title: '에너지효율 Top 10%', icon: '👑', earned: true },
  { id: 'ach-4', title: '50만원 절감', icon: '💎', earned: false, progress: 78, target: '39만/50만원' },
];

export const energyPriceData: EnergyPriceData = {
  currentPrice: 324.4,
  priceChange: -5.2,
  unit: 'kWh',
  recommendation: 'charge_now',
  nearestStation: {
    name: '한전 강남 급속충전소',
    price: 309.8,
    distance: '300m',
  },
  weeklyTrend: [330, 328, 335, 332, 329, 326, 324],
};

// ============================================
// 리스크 금액화 데이터 (FMS 유니크B 일반차량 적용)
// ============================================

export const consumableRisks: ConsumableRisk[] = [
  {
    consumableName: '에어컨필터',
    currentStatus: '교체 주기 2,000km 초과',
    damageProb: 8,
    repairCost: 35000,
    replaceCost: 250000,
    totalRisk: 55000,
    riskMultiplier: 7,
  },
  {
    consumableName: '브레이크패드(전)',
    currentStatus: '잔여 42% — 곧 교체 필요',
    damageProb: 5,
    repairCost: 85000,
    replaceCost: 450000,
    totalRisk: 107500,
    riskMultiplier: 5,
  },
  {
    consumableName: '엔진오일',
    currentStatus: '교체 주기 1,500km 초과',
    damageProb: 12,
    repairCost: 85000,
    replaceCost: 3500000,
    totalRisk: 505000,
    riskMultiplier: 41,
  },
];

// ============================================
// 수리 vs 교체 의사결정 데이터 (FMS 유니크C 일반차량 적용)
// ============================================

export const repairVsReplaceData: RepairVsReplaceData = {
  currentVehicleValue: 31200000,
  expectedRepairCost12m: 1850000,
  newVehiclePrice: 52000000,
  monthlyMaintCurrent: 285000,
  monthlyMaintNew: 195000,
  comparisonItems: [
    { label: '차량 가치', keepValue: '3,120만원', replaceValue: '5,200만원 (신규)', replaceHighlight: false, keepHighlight: false },
    { label: '12개월 예상 수리비', keepValue: '185만원', replaceValue: '20만원 (보증)', keepHighlight: true, replaceHighlight: false },
    { label: '월 에너지비', keepValue: '12만원', replaceValue: '10.5만원', keepHighlight: false, replaceHighlight: false },
    { label: '월 유지비 합계', keepValue: '28.5만원', replaceValue: '19.5만원', keepHighlight: true, replaceHighlight: false },
  ],
  recommendation: '현재 차량 상태 양호 — 12개월 더 유지 후 교체 시 매각가 최적',
  optimalReplaceMonths: 12,
};
