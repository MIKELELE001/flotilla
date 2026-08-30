interface ExposureGaugeProps {
  upPct: number;
  downPct: number;
}

export function ExposureGauge({ upPct, downPct }: ExposureGaugeProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-sm text-[var(--color-text-muted)]">Exposure</span>
        <span className="text-sm font-semibold tabular">
          <span style={{ color: "var(--color-up)" }}>{upPct}%</span>
          <span className="text-[var(--color-text-dim)] mx-1">up</span>
          <span className="text-[var(--color-text-dim)] mx-1">·</span>
          <span style={{ color: "var(--color-down)" }}>{downPct}%</span>
          <span className="text-[var(--color-text-dim)] mx-1">down</span>
        </span>
      </div>
      <div
        className="relative h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(248, 113, 113, 0.15)" }}
        role="img"
        aria-label={`Exposure: ${upPct}% up, ${downPct}% down`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
          style={{
            width: `${upPct}%`,
            background: "linear-gradient(90deg, #22c99e 0%, var(--color-up) 100%)",
          }}
        />
      </div>
    </div>
  );
}
