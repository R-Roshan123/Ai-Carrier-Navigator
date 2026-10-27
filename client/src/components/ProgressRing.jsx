export default function ProgressRing({ value = 78, label = 'Career readiness', size = 128, color = '#1D4ED8' }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 140 140" className="-rotate-90" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${value} out of 100`}>
          <circle cx="70" cy="70" r={radius} stroke="#E5E7EB" strokeWidth="10" fill="transparent" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-slate-900">{value}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">/ 100</span>
        </div>
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{label}</p>
    </div>
  );
}
