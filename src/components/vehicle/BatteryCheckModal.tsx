'use client';

import { useEffect, useState } from 'react';

interface BatteryCheckModalProps {
  onClose: () => void;
}

export default function BatteryCheckModal({ onClose }: BatteryCheckModalProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'scanning' | 'analyzing' | 'complete'>('scanning');
  const results = {
    health: 94,
    capacity: 72.8,
    maxCapacity: 77.4,
    voltage: 356.4,
    temperature: 28.5,
    cycles: 142,
    cellBalance: 98.2,
  };

  useEffect(() => {
    // 점검 진행 시뮬레이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 60) {
      setStage('scanning');
    } else if (progress < 100) {
      setStage('analyzing');
    } else {
      setStage('complete');
    }
  }, [progress]);

  const getStageText = () => {
    switch (stage) {
      case 'scanning':
        return '배터리 셀 스캔 중...';
      case 'analyzing':
        return '데이터 분석 중...';
      case 'complete':
        return '점검 완료';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-black text-gray-900">배터리 헬스 점검</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Vehicle Silhouette with Battery Animation */}
          <div className="relative bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl p-8 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(16, 185, 129, .3) 25%, rgba(16, 185, 129, .3) 26%, transparent 27%, transparent 74%, rgba(16, 185, 129, .3) 75%, rgba(16, 185, 129, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(16, 185, 129, .3) 25%, rgba(16, 185, 129, .3) 26%, transparent 27%, transparent 74%, rgba(16, 185, 129, .3) 75%, rgba(16, 185, 129, .3) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px'
              }} />
            </div>

            {/* Vehicle + Battery SVG */}
            <div className="relative z-10">
              <svg viewBox="0 0 400 220" className="w-full h-auto">
                {/* Vehicle Silhouette (현실적인 전기차 SUV) */}
                <g opacity="0.7" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {/* Main Body Outline - IONIQ 5 스타일 */}
                  <path d="M 70 125 L 85 125 Q 90 125 95 120 L 105 105 Q 108 100 115 97 L 135 90 Q 140 88 145 88 L 220 88 Q 225 88 230 90 L 250 97 Q 257 100 260 105 L 270 120 Q 275 125 280 125 L 310 125" />

                  {/* Roof Line */}
                  <path d="M 115 97 L 120 85 Q 125 78 135 78 L 175 78 Q 180 78 182 80 L 185 85 L 235 85 Q 240 87 243 92 L 250 97" />

                  {/* Front Windshield */}
                  <path d="M 115 97 L 120 85 L 135 85" stroke="#6B7280" strokeWidth="1.5" />

                  {/* Rear Windshield */}
                  <path d="M 235 85 L 243 92 L 250 97" stroke="#6B7280" strokeWidth="1.5" />

                  {/* Front Window */}
                  <path d="M 135 85 L 135 97" stroke="#6B7280" strokeWidth="1.5" />

                  {/* Rear Window */}
                  <path d="M 235 85 L 235 97" stroke="#6B7280" strokeWidth="1.5" />

                  {/* Side Windows - Passenger Compartment */}
                  <path d="M 140 85 Q 145 82 155 82 L 175 82 L 180 85" stroke="#6B7280" strokeWidth="1.5" fill="#E5E7EB" fillOpacity="0.3" />
                  <path d="M 188 85 Q 195 82 210 82 L 225 82 L 230 85" stroke="#6B7280" strokeWidth="1.5" fill="#E5E7EB" fillOpacity="0.3" />

                  {/* Door Lines */}
                  <line x1="180" y1="88" x2="180" y2="125" stroke="#4B5563" strokeWidth="1.5" />

                  {/* Headlight (Front) */}
                  <path d="M 75 115 Q 78 112 82 112 L 90 112 Q 94 112 97 115" fill="#FCD34D" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="1.5" />

                  {/* Taillight (Rear) */}
                  <path d="M 285 115 Q 288 112 292 112 L 300 112 Q 304 112 307 115" fill="#FCA5A5" fillOpacity="0.4" stroke="#EF4444" strokeWidth="1.5" />

                  {/* Front Bumper Detail */}
                  <path d="M 85 125 L 88 128 L 100 128 L 103 125" stroke="#6B7280" strokeWidth="1" />

                  {/* Rear Bumper Detail */}
                  <path d="M 277 125 L 280 128 L 292 128 L 295 125" stroke="#6B7280" strokeWidth="1" />

                  {/* Side Skirt Line */}
                  <path d="M 110 120 L 270 120" stroke="#4B5563" strokeWidth="1" opacity="0.5" />
                </g>

                {/* Wheels - More Realistic */}
                <g>
                  {/* Front Wheel */}
                  <circle cx="125" cy="135" r="18" fill="#1F2937" stroke="#374151" strokeWidth="2" />
                  <circle cx="125" cy="135" r="12" fill="none" stroke="#6B7280" strokeWidth="1.5" />
                  <circle cx="125" cy="135" r="6" fill="#9CA3AF" />
                  {/* Spokes */}
                  {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <line
                      key={`front-${angle}`}
                      x1="125"
                      y1="135"
                      x2={125 + 10 * Math.cos((angle * Math.PI) / 180)}
                      y2={135 + 10 * Math.sin((angle * Math.PI) / 180)}
                      stroke="#4B5563"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Rear Wheel */}
                  <circle cx="255" cy="135" r="18" fill="#1F2937" stroke="#374151" strokeWidth="2" />
                  <circle cx="255" cy="135" r="12" fill="none" stroke="#6B7280" strokeWidth="1.5" />
                  <circle cx="255" cy="135" r="6" fill="#9CA3AF" />
                  {/* Spokes */}
                  {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <line
                      key={`rear-${angle}`}
                      x1="255"
                      y1="135"
                      x2={255 + 10 * Math.cos((angle * Math.PI) / 180)}
                      y2={135 + 10 * Math.sin((angle * Math.PI) / 180)}
                      stroke="#4B5563"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Wheel Shadows */}
                  <ellipse cx="125" cy="153" rx="16" ry="3" fill="#000000" opacity="0.2" />
                  <ellipse cx="255" cy="153" rx="16" ry="3" fill="#000000" opacity="0.2" />
                </g>

                {/* Ground/Shadow */}
                <line x1="60" y1="155" x2="320" y2="155" stroke="#E5E7EB" strokeWidth="2" />

                {/* Battery Pack (바닥에 배터리) */}
                <g>
                  {/* Battery Outline - More realistic shape */}
                  <rect x="135" y="140" width="110" height="18" rx="2" fill="#10b981" fillOpacity="0.05" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" />

                  {/* Battery Pack Solid */}
                  <rect x="140" y="143" width="100" height="12" rx="2" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="2" />

                  {/* Battery Cells - More detailed */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <rect
                      key={i}
                      x={143 + i * 9.5}
                      y="145"
                      width="8"
                      height="8"
                      rx="1"
                      fill="#10b981"
                      fillOpacity={progress > i * 10 ? 0.7 : 0.2}
                      className="transition-all duration-300"
                    />
                  ))}

                  {/* Battery Terminals/Connectors */}
                  <rect x="238" y="147" width="3" height="4" rx="0.5" fill="#10b981" opacity="0.8" />
                  <rect x="242" y="147" width="3" height="4" rx="0.5" fill="#10b981" opacity="0.8" />

                  {/* Battery Label */}
                  <text x="190" y="169" fontSize="6" fill="#10b981" fontWeight="bold" textAnchor="middle" opacity="0.6">
                    77.4 kWh E-GMP
                  </text>
                </g>

                {/* Scanning Line (좌우로 움직이는 라인) */}
                {stage === 'scanning' && (
                  <g>
                    <line
                      x1="190"
                      y1="70"
                      x2="190"
                      y2="165"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      opacity="0.8"
                      className="animate-scan"
                      style={{ transformOrigin: 'center' }}
                    >
                      <animate
                        attributeName="x1"
                        values="100;280;100"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="x2"
                        values="100;280;100"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </line>

                    {/* Glow effect */}
                    <line
                      x1="190"
                      y1="70"
                      x2="190"
                      y2="165"
                      stroke="#10b981"
                      strokeWidth="10"
                      opacity="0.15"
                      className="blur-sm"
                    >
                      <animate
                        attributeName="x1"
                        values="100;280;100"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="x2"
                        values="100;280;100"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </line>

                    {/* Scan particles effect */}
                    {[0, 1, 2].map((i) => (
                      <circle
                        key={i}
                        r="2"
                        fill="#10b981"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="cx"
                          values="100;280;100"
                          dur="3s"
                          begin={`${i * 0.2}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          values={`${90 + i * 20};${90 + i * 20};${90 + i * 20}`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    ))}
                  </g>
                )}

                {/* Status Indicators */}
                {stage === 'complete' && (
                  <g>
                    {/* Success Badge */}
                    <circle cx="190" cy="100" r="24" fill="#10b981" fillOpacity="0.15" />
                    <circle cx="190" cy="100" r="18" fill="#10b981" fillOpacity="0.25" />
                    {/* Check Mark */}
                    <path
                      d="M 178 100 L 186 108 L 202 92"
                      stroke="#10b981"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* Scan Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-900">{getStageText()}</span>
                <span className="text-sm font-bold text-ivi-accent">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ivi-accent to-emerald-400 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Results (점검 완료 후 표시) */}
          {stage === 'complete' && (
            <div className="space-y-4 animate-fade-in-up">
              {/* Health Score */}
              <div className="bg-gradient-to-br from-ivi-accent/10 to-emerald-50 border border-ivi-accent/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-gray-900">배터리 상태</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-ivi-accent animate-pulse" />
                    <span className="text-sm font-bold text-ivi-accent">정상</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-6xl font-black text-ivi-accent">{results.health}</span>
                  <span className="text-3xl font-bold text-gray-400">%</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-1">사용 가능 용량</p>
                    <p className="text-lg font-black text-gray-900">{results.capacity} kWh</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-1">최대 용량</p>
                    <p className="text-lg font-black text-gray-900">{results.maxCapacity} kWh</p>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-base font-black text-gray-900 mb-4">상세 정보</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">전압</span>
                    <span className="text-sm font-bold text-gray-900">{results.voltage} V</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">온도</span>
                    <span className="text-sm font-bold text-gray-900">{results.temperature} °C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">충전 사이클</span>
                    <span className="text-sm font-bold text-gray-900">{results.cycles} 회</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">셀 밸런스</span>
                    <span className="text-sm font-bold text-ivi-accent">{results.cellBalance}%</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-gray-900 mb-2">권장사항</h4>
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-ivi-accent mt-0.5">•</span>
                        <span>배터리 상태가 양호합니다. 정기 점검을 권장합니다.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ivi-accent mt-0.5">•</span>
                        <span>최적의 배터리 수명을 위해 20-80% 충전을 유지하세요.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ivi-accent mt-0.5">•</span>
                        <span>급속 충전보다 완속 충전을 우선으로 사용하세요.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={stage !== 'complete'}
            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
              stage === 'complete'
                ? 'bg-gradient-to-r from-ivi-accent to-emerald-500 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {stage === 'complete' ? '확인' : '점검 진행 중...'}
          </button>
        </div>
      </div>
    </div>
  );
}
