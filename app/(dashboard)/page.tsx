"use client";

import { useAccount } from "wagmi";
import { mockHistory, mockEquityCurve } from "@/lib/mockData";
import { useRealPortfolio } from "@/lib/useRealPortfolio";
import { computeAlerts } from "@/lib/computeAlerts";
import { TopHeader } from "@/components/TopHeader";
import { AssetCards } from "@/components/AssetCards";
import { EquityChart } from "@/components/EquityChart";
import { ExposureDonut } from "@/components/ExposureDonut";
import { PositionList } from "@/components/PositionList";
import { AlertsList } from "@/components/AlertsList";
import { ClaimAllCard } from "@/components/ClaimAllCard";
import { EmergencyExitCard } from "@/components/EmergencyExitCard";
import { HistoryList } from "@/components/HistoryList";
import { ConnectPrompt, LoadingState, ErrorState } from "@/components/ConnectGate";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { positions, claimable, breakdowns, summary, loading, error, refetch } = useRealPortfolio(address);

  const alerts = computeAlerts(positions, summary);

  return (
    <>
      <TopHeader
        title="Dashboard"
        subtitle="Your entire Event Contracts book, in one view."
        expiringSoonCount={summary.expiringSoonCount}
      />

      {!isConnected ? (
        <ConnectPrompt />
      ) : loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : (
        <>
          <AssetCards breakdowns={breakdowns} />

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              {/* Equity curve is still illustrative mock data — the portfolio
                  read doesn't carry historical value over time. Real history
                  charting is a later wiring pass. */}
              <EquityChart summary={summary} curve={mockEquityCurve} />
            </div>
            <ExposureDonut upPct={summary.upPct} downPct={summary.downPct} totalAtRiskHuman={summary.totalAtRiskHuman} />
          </div>

          <AlertsList alerts={alerts} />

          <div className="grid sm:grid-cols-2 gap-4">
            <ClaimAllCard claimable={claimable} />
            <EmergencyExitCard positions={positions} />
          </div>

          <PositionList positions={positions} />

          {/* Position History is still mock data — see the History page TODO. */}
          <HistoryList history={mockHistory} />
        </>
      )}
    </>
  );
}
