interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  label: string;
  detail: string;
}

export default function ProgressBar({
  value,
  max,
  color,
  label,
  detail,
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 행 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900">{label}</span>
        <span className="text-xs font-semibold text-gray-500">{detail}</span>
      </div>

      {/* 바 */}
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
