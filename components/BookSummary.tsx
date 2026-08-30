import type { PortfolioSummary } from "@/lib/types";
import { ExposureGauge } from "./ExposureGauge";

interface Props {
  summary: PortfolioSummary;
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <div className="text-xs text-[var(--color-text-muted)] mb-1.5">{label}</div>
      <div className="text-2xl font-bold tabular tracking-tight" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
    </div>
  );
}

export function BookSummary({ summary }: Props) {
  return (
    <section
      className="rounded-3xl p-7 border relative overflow-hidden"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {/* soft ambient glow, matching the gradient-fade language from the reference dashboards */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "var(--color-accent)", opacity: 0.08, filter: "blur(60px)" }}
      />

      <div className="flex items-center justify-between mb-7 relative">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Your Book
        </h2>
        {summary.expiringSoonCount > 0 && (
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "var(--color-accent-dim)", color: "var(--color-accent)" }}
          >
            {summary.expiringSoonCount} expiring soon
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-7 relative">
        <Stat label="Total at risk" value={`$${summary.totalAtRiskHuman.toFixed(2)}`} />
        <Stat label="Potential payout" value={`$${summary.potentialPayoutHuman.toFixed(2)}`} accent="var(--color-up)" />
        <Stat label="Claimable" value={`$${summary.claimableHuman.toFixed(2)}`} accent="var(--color-accent)" />
        <Stat label="Net exposure" value={`${summary.upPct}% UP`} />
      </div>

      <ExposureGauge upPct={summary.upPct} downPct={summary.downPct} />
    </section>
  );
}
