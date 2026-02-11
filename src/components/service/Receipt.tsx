'use client';

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

interface ReceiptProps {
  data: ReceiptData;
  onClose: () => void;
}

export default function Receipt({ data, onClose }: ReceiptProps) {
  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white text-black rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          aria-label="닫기"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* 영수증 내용 */}
        <div className="p-6" style={{ fontFamily: 'monospace' }}>
          {/* 헤더 */}
          <div className="text-center border-b-2 border-black pb-4 mb-4">
            <h1 className="text-xl font-bold mb-1">정비 영수증</h1>
            <p className="text-xs text-gray-600">SERVICE RECEIPT</p>
          </div>

          {/* 서비스센터 정보 */}
          <div className="mb-4 text-sm">
            <p className="font-bold text-base mb-2">{data.center}</p>
            <p className="text-xs text-gray-700">{data.centerAddress}</p>
            <p className="text-xs text-gray-700">TEL: {data.centerPhone}</p>
          </div>

          {/* 영수증 번호 및 일시 */}
          <div className="border-y border-gray-300 py-3 mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">영수증 번호</span>
              <span className="font-bold">{data.receiptNumber}</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">날짜</span>
              <span>{formatDate(data.date)} {data.time}</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">차량</span>
              <span>{data.vehicle}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">주행거리</span>
              <span>{data.mileage.toLocaleString()} km</span>
            </div>
          </div>

          {/* 정비 항목 */}
          <div className="mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2 font-bold">항목</th>
                  <th className="text-center py-2 font-bold w-12">수량</th>
                  <th className="text-right py-2 font-bold w-20">단가</th>
                  <th className="text-right py-2 font-bold w-24">금액</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">₩{item.unitPrice.toLocaleString()}</td>
                    <td className="text-right py-2 font-semibold">₩{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 합계 */}
          <div className="border-t-2 border-black pt-3 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">소계</span>
              <span>₩{data.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600">부가세 (10%)</span>
              <span>₩{data.vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
              <span>합계</span>
              <span>₩{data.total.toLocaleString()}</span>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="border-t border-gray-300 pt-3 mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">결제 방법</span>
              <span className="font-semibold">{data.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">담당 기술자</span>
              <span>{data.technician}</span>
            </div>
          </div>

          {/* 안내 사항 */}
          <div className="bg-gray-50 rounded p-3 text-xs text-gray-600 mb-4">
            <p className="mb-1">• 본 영수증은 현금영수증 및 세금계산서 발행 전 임시 영수증입니다.</p>
            <p className="mb-1">• 정비 후 3개월 또는 5,000km 이내 무상 A/S가 적용됩니다.</p>
            <p>• 문의사항은 고객센터 1588-5000으로 연락주시기 바랍니다.</p>
          </div>

          {/* QR 코드 영역 (시각적 요소) */}
          <div className="text-center pt-3 border-t border-gray-300">
            <div className="inline-flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="40" height="40" fill="#000" />
                  <rect x="60" y="0" width="40" height="40" fill="#000" />
                  <rect x="0" y="60" width="40" height="40" fill="#000" />
                  <rect x="10" y="10" width="20" height="20" fill="#fff" />
                  <rect x="70" y="10" width="20" height="20" fill="#fff" />
                  <rect x="10" y="70" width="20" height="20" fill="#fff" />
                  <rect x="50" y="50" width="10" height="10" fill="#000" />
                  <rect x="65" y="65" width="10" height="10" fill="#000" />
                  <rect x="80" y="80" width="10" height="10" fill="#000" />
                </svg>
              </div>
              <p className="text-xs text-gray-700">블록체인 인증 완료</p>
            </div>
          </div>

          {/* 푸터 */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-700">이용해 주셔서 감사합니다</p>
            <p className="text-xs text-gray-700">Thank you for your visit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
