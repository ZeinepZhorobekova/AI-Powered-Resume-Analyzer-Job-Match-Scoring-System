export default function FitScoreGauge({ score }) {
  const clamped = Math.min(100, Math.max(0, score));

  const color =
    clamped >= 75 ? 'text-emerald-600' :
    clamped >= 50 ? 'text-amber-500' :
    'text-red-500';

  const ringColor =
    clamped >= 75 ? 'stroke-emerald-500' :
    clamped >= 50 ? 'stroke-amber-400' :
    'stroke-red-400';

  const label =
    clamped >= 75 ? 'Strong Match' :
    clamped >= 50 ? 'Partial Match' :
    'Weak Match';

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-700 ${ringColor}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${color}`}>{clamped}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${color}`}>{label}</span>
    </div>
  );
}
