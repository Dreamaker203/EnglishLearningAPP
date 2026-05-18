"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-gray-400">{label}</span>
          <span className="text-gray-500">{current}/{total}</span>
        </div>
      )}
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-300 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
