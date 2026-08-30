// Types mirror what the real SDK returns (see scripts/test-portfolio.ts),
// so swapping mock data for a live getPortfolio() call later is a drop-in.

export type Side = "UP" | "DOWN";
export type MarketStatus = "Trading" | "Locked" | "Resolved" | "Voided";

export interface Position {
  id: string;
  asset: string; // "BTC" | "ETH"
  interval: string; // "15m" | "1h" | "24h" etc — human label
  side: Side;
  stakedHuman: number; // amount at risk, human units
  potentialPayoutHuman: number; // if this side wins
  status: MarketStatus;
  expiresInSeconds: number; // countdown to window expiry (or 0 if already expired/settled)
  marketId: string;
}

export interface ClaimablePosition {
  id: string;
  asset: string;
  interval: string;
  side: Side;
  payoutHuman: number;
  settledAt: string; // ISO timestamp
  txHash?: string;
  oracleQuestionId?: string;
}

export interface HistoryEntry {
  id: string;
  asset: string;
  side: Side;
  stakedHuman: number;
  outcome: "Won" | "Lost";
  payoutHuman: number;
  timestamp: string;
  txHash: string;
  oracleQuestionId?: string;
}

export interface ExposureAlert {
  id: string;
  kind: "concentration" | "direction" | "expiry" | "capital";
  message: string;
  actionLabel?: string;
}

export interface PortfolioSummary {
  totalAtRiskHuman: number;
  potentialPayoutHuman: number;
  upPct: number;
  downPct: number;
  claimableHuman: number;
  expiringSoonCount: number;
}
