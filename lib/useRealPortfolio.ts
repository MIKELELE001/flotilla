"use client";

import { useMemo } from "react";
import { usePortfolio as useSdkPortfolio } from "@somnia-chain/markets-sdk/react";
import { claimableFrom, type ClaimableInput } from "@somnia-chain/markets-sdk";
import type { Position, ClaimablePosition, PortfolioSummary } from "./types";
import { computeSummary, type AssetBreakdown } from "./mockData";

// A market is settled — and so eligible for the claim check — once it's
// left Trading/Locked. "Finalized" supersedes Resolved/Voided once it lands
// (see BinaryMarketStatus docs), so we check the SDK's own voided/
// winningOutcome fields rather than re-deriving from the status string.
const SETTLED_STATUSES = new Set(["Resolved", "Voided", "Finalized"]);
const OPEN_STATUSES = new Set(["Trading", "Locked"]);

function toUiStatus(sdkStatus: string): Position["status"] {
  if (sdkStatus === "Trading") return "Trading";
  if (sdkStatus === "Locked") return "Locked";
  if (sdkStatus === "Voided") return "Voided";
  // Listed / Settling / Resolved / Finalized all read as settled-ish for
  // display purposes on an open-positions view (Listed shouldn't have a
  // position at all, but fall back safely rather than throw on an edge case).
  return "Resolved";
}

/**
 * Live equivalent of lib/mockData.ts, built on the SDK's official
 * usePortfolio() hook. Swaps in for the mock data once a wallet is
 * connected; returns loading/empty state cleanly when it isn't.
 *
 * History is intentionally left out here — see HistoryList's mock usage
 * and the TODO in app/(dashboard)/history/page.tsx. We haven't verified
 * the trade/outcome field shapes against a real funded wallet yet, and
 * getting that wrong would ship a page that silently shows wrong data
 * rather than failing loudly — worse than leaving it on mock for now.
 */
export function useRealPortfolio(account: string | undefined) {
  const { data, loading, error, refetch } = useSdkPortfolio(account, {
    ordersLimit: 200,
    tradesLimit: 50,
  });

  const positions: Position[] = useMemo(() => {
    if (!data) return [];
    return data.positions
      .filter((p) => OPEN_STATUSES.has(p.market.status))
      .map((p) => {
        const decimals = p.market.quoteDecimals;
        const balance = Number(BigInt(p.balance)) / 10 ** decimals;
        const side: Position["side"] = p.outcomeIndex === 0 ? "UP" : "DOWN";
        // Intentional: snapshot "now" once per data refresh as the countdown
        // baseline. PositionList ticks its own local `now` state every
        // second and subtracts from this fixed value — same pattern the
        // proven scripts/test-portfolio.ts script uses — so this doesn't
        // need to be reactive to time itself, only to `data` changing.
        // eslint-disable-next-line react-hooks/purity
        const expiresInSeconds = Math.max(0, Number(p.market.expiry) - Date.now() / 1000);

        return {
          id: `${p.market.id}-${p.outcomeIndex}`,
          asset: p.market.asset,
          interval: p.market.interval ?? "?",
          side,
          stakedHuman: balance,
          // The portfolio read doesn't carry a live quote — until we wire
          // fetchOrderBook per position, show potential payout as the
          // theoretical max (1 unit per contract), same convention the
          // protocol itself uses for a winning redemption.
          potentialPayoutHuman: balance,
          status: toUiStatus(p.market.status),
          expiresInSeconds,
          marketId: p.market.id,
        } satisfies Position;
      });
  }, [data]);

  const claimable: ClaimablePosition[] = useMemo(() => {
    if (!data) return [];

    const inputs: ClaimableInput[] = data.positions
      .filter((p) => SETTLED_STATUSES.has(p.market.status))
      .map((p) => ({
        marketId: p.market.id,
        pool: p.market.poolAddress,
        outcomeIdx: p.outcomeIndex as 0 | 1,
        amount: BigInt(p.balance),
        winningOutcome: p.market.winningOutcome ?? null,
        voided: p.market.voided,
        status: p.market.status,
        settlementFeeBps: BigInt(0), // dreamDEX sets all fees, including settlement, to zero
      }));

    const claimed = claimableFrom(inputs);

    return claimed.map((c) => {
      const source = data.positions.find(
        (p) => p.market.id === c.marketId && p.outcomeIndex === c.outcomeIdx
      );
      const decimals = source?.market.quoteDecimals ?? 18;
      return {
        id: `${c.marketId}-${c.outcomeIdx}`,
        asset: source?.market.asset ?? "?",
        interval: source?.market.interval ?? "?",
        side: c.outcomeIdx === 0 ? "UP" : "DOWN",
        payoutHuman: Number(c.estPayout) / 10 ** decimals,
        settledAt: new Date().toISOString(), // the portfolio read doesn't carry a settlement timestamp
      } satisfies ClaimablePosition;
    });
  }, [data]);

  const breakdowns: AssetBreakdown[] = useMemo(() => {
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
  }, [positions]);

  const summary: PortfolioSummary = useMemo(
    () => computeSummary(positions, claimable),
    [positions, claimable]
  );

  return { positions, claimable, breakdowns, summary, loading, error, refetch };
}
