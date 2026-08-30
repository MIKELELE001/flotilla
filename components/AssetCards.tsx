import type { AssetBreakdown } from "@/lib/mockData";

const ASSET_LABEL: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
};

function AssetCard({ breakdown }: { breakdown: AssetBreakdown }) {
  const pct = breakdown.potentialPayoutHuman > 0
    ? Math.min(100, (breakdown.atRiskHuman / breakdown.potentialPayoutHuman) * 100)
    : 0;

  return (
    <div
      className="rounded-3xl p-5 border flex-1 min-w-[200px]"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-bold">{breakdown.asset}</div>
          <div className="text-xs text-[var(--color-text-dim)]">{ASSET_LABEL[breakdown.asset] ?? breakdown.asset}</div>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: "var(--color-up-dim)", color: "var(--color-up)" }}
        >
          Active
        </span>
      </div>

      <div className="mb-1.5">
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full gradient-accent"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-[var(--color-text-dim)]">
          At risk: <span className="text-[var(--color-text)] font-semibold">${breakdown.atRiskHuman.toFixed(2)}</span>
        </span>
        <span className="text-[var(--color-text-dim)]">
          {breakdown.positionCount} position{breakdown.positionCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export function AssetCards({ breakdowns }: { breakdowns: AssetBreakdown[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {breakdowns.map((b) => (
        <AssetCard key={b.asset} breakdown={b} />
      ))}
    </div>
  );
}
