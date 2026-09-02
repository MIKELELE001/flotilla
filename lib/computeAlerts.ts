import type { Position, ExposureAlert, PortfolioSummary } from "./types";

/**
 * Real, rules-based alerts computed from the wallet's own positions —
 * never predictions of where price is going, only observations about
 * what's already held. Mirrors the spec's four alert kinds.
 */
export function computeAlerts(positions: Position[], summary: PortfolioSummary): ExposureAlert[] {
  const alerts: ExposureAlert[] = [];
  if (positions.length === 0) return alerts;

  // Concentration: one asset > 60% of total at-risk capital.
  const byAsset = positions.reduce<Record<string, number>>((acc, p) => {
    acc[p.asset] = (acc[p.asset] ?? 0) + p.stakedHuman;
    return acc;
  }, {});
  const total = Object.values(byAsset).reduce((s, v) => s + v, 0);
  for (const [asset, atRisk] of Object.entries(byAsset)) {
    const pct = total > 0 ? Math.round((atRisk / total) * 100) : 0;
    if (pct > 60) {
      alerts.push({
        id: `concentration-${asset}`,
        kind: "concentration",
        message: `${asset} represents ${pct}% of your current exposure.`,
        actionLabel: `Review ${asset} positions`,
      });
    }
  }

  // Direction: portfolio leans heavily UP or DOWN.
  if (summary.upPct >= 70) {
    alerts.push({
      id: "direction-up",
      kind: "direction",
      message: `Your portfolio is ${summary.upPct}% biased toward UP.`,
    });
  } else if (summary.downPct >= 70) {
    alerts.push({
      id: "direction-down",
      kind: "direction",
      message: `Your portfolio is ${summary.downPct}% biased toward DOWN.`,
    });
  }

  // Expiry: positions expiring within 5 minutes.
  if (summary.expiringSoonCount > 0) {
    alerts.push({
      id: "expiry-soon",
      kind: "expiry",
      message: `${summary.expiringSoonCount} position${summary.expiringSoonCount !== 1 ? "s" : ""} expire within 5 minutes.`,
      actionLabel: "View expiring",
    });
  }

  return alerts;
}
