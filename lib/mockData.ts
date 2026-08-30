import type { Position, ClaimablePosition, HistoryEntry, ExposureAlert, PortfolioSummary } from "./types";

export const mockPositions: Position[] = [
  { id: "p1", asset: "BTC", interval: "15m", side: "UP", stakedHuman: 10, potentialPayoutHuman: 18.4, status: "Trading", expiresInSeconds: 272, marketId: "0xbe61" },
  { id: "p2", asset: "BTC", interval: "1h", side: "UP", stakedHuman: 20, potentialPayoutHuman: 35.2, status: "Trading", expiresInSeconds: 2538, marketId: "0xbe65" },
  { id: "p3", asset: "BTC", interval: "24h", side: "DOWN", stakedHuman: 15, potentialPayoutHuman: 27.1, status: "Trading", expiresInSeconds: 43980, marketId: "0xb74b" },
  { id: "p4", asset: "ETH", interval: "15m", side: "DOWN", stakedHuman: 7.5, potentialPayoutHuman: 13.9, status: "Trading", expiresInSeconds: 521, marketId: "0xbe6a" },
  { id: "p5", asset: "ETH", interval: "1h", side: "UP", stakedHuman: 12, potentialPayoutHuman: 21.8, status: "Locked", expiresInSeconds: 0, marketId: "0xbe66" },
  { id: "p6", asset: "SOL", interval: "1h", side: "UP", stakedHuman: 9.7, potentialPayoutHuman: 16.3, status: "Trading", expiresInSeconds: 1889, marketId: "0xa221" },
];

export const mockClaimable: ClaimablePosition[] = [
  { id: "c1", asset: "BTC", interval: "15m", side: "UP", payoutHuman: 8.2, settledAt: "2026-08-30T09:14:00Z", oracleQuestionId: "10432" },
  { id: "c2", asset: "ETH", interval: "1h", side: "DOWN", payoutHuman: 4.2, settledAt: "2026-08-30T08:40:00Z", oracleQuestionId: "10428" },
];

export const mockHistory: HistoryEntry[] = [
  { id: "h1", asset: "BTC", side: "UP", stakedHuman: 10, outcome: "Won", payoutHuman: 18.6, timestamp: "2026-08-30T07:12:00Z", txHash: "0x7ac2...4f19", oracleQuestionId: "10401" },
  { id: "h2", asset: "ETH", side: "DOWN", stakedHuman: 5, outcome: "Lost", payoutHuman: 0, timestamp: "2026-08-30T06:18:00Z", txHash: "0x91be...8a02", oracleQuestionId: "10395" },
  { id: "h3", asset: "SOL", side: "UP", stakedHuman: 8, outcome: "Won", payoutHuman: 14.9, timestamp: "2026-08-30T05:03:00Z", txHash: "0x2f4d...c7e1", oracleQuestionId: "10388" },
];

export const mockAlerts: ExposureAlert[] = [
  { id: "a1", kind: "concentration", message: "BTC represents 62% of your current exposure.", actionLabel: "Review BTC positions" },
  { id: "a2", kind: "direction", message: "Your portfolio is 71% biased toward UP." },
  { id: "a3", kind: "expiry", message: "2 positions expire within 5 minutes.", actionLabel: "View expiring" },
];

export function computeSummary(positions: Position[], claimable: ClaimablePosition[]): PortfolioSummary {
  const totalAtRiskHuman = positions.reduce((s, p) => s + p.stakedHuman, 0);
  const potentialPayoutHuman = positions.reduce((s, p) => s + p.potentialPayoutHuman, 0);
  const upStake = positions.filter((p) => p.side === "UP").reduce((s, p) => s + p.stakedHuman, 0);
  const downStake = positions.filter((p) => p.side === "DOWN").reduce((s, p) => s + p.stakedHuman, 0);
  const total = upStake + downStake;
  const upPct = total > 0 ? Math.round((upStake / total) * 100) : 0;
  const downPct = 100 - upPct;
  const claimableHuman = claimable.reduce((s, c) => s + c.payoutHuman, 0);
  const expiringSoonCount = positions.filter((p) => p.status === "Trading" && p.expiresInSeconds > 0 && p.expiresInSeconds < 300).length;

  return { totalAtRiskHuman, potentialPayoutHuman, upPct, downPct, claimableHuman, expiringSoonCount };
}

// Equity curve for the portfolio value chart — mock, cumulative claimed +
// unrealized value over recent time. Swap for real getBinaryPositionPnL-
// derived history once wired to a live wallet.
export const mockEquityCurve = [
  { t: "Mon", value: 42 },
  { t: "Tue", value: 58 },
  { t: "Wed", value: 51 },
  { t: "Thu", value: 74 },
  { t: "Fri", value: 68 },
  { t: "Sat", value: 91 },
  { t: "Sun", value: 84 },
];

export interface AssetBreakdown {
  asset: string;
  atRiskHuman: number;
  potentialPayoutHuman: number;
  positionCount: number;
}

export function computeAssetBreakdown(positions: Position[]): AssetBreakdown[] {
  const byAsset = positions.reduce<Record<string, AssetBreakdown>>((acc, p) => {
    if (!acc[p.asset]) {
      acc[p.asset] = { asset: p.asset, atRiskHuman: 0, potentialPayoutHuman: 0, positionCount: 0 };
    }
    acc[p.asset].atRiskHuman += p.stakedHuman;
    acc[p.asset].potentialPayoutHuman += p.potentialPayoutHuman;
    acc[p.asset].positionCount += 1;
    return acc;
  }, {});
  return Object.values(byAsset);
}
