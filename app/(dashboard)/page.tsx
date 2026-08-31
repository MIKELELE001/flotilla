"use client";

import { mockPositions, mockClaimable, mockHistory, mockAlerts, mockEquityCurve, computeSummary, computeAssetBreakdown } from "@/lib/mockData";
import { TopHeader } from "@/components/TopHeader";
import { AssetCards } from "@/components/AssetCards";
import { EquityChart } from "@/components/EquityChart";
import { ExposureDonut } from "@/components/ExposureDonut";
import { PositionList } from "@/components/PositionList";
import { AlertsList } from "@/components/AlertsList";
import { ClaimAllCard } from "@/components/ClaimAllCard";
import { EmergencyExitCard } from "@/components/EmergencyExitCard";
import { HistoryList } from "@/components/HistoryList";

export default function DashboardPage() {
  const summary = computeSummary(mockPositions, mockClaimable);
  const breakdowns = computeAssetBreakdown(mockPositions);

  return (
    <>
      <TopHeader
        title="Dashboard"
        subtitle="Your entire Event Contracts book, in one view."
        expiringSoonCount={summary.expiringSoonCount}
      />

      <AssetCards breakdowns={breakdowns} />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <EquityChart summary={summary} curve={mockEquityCurve} />
        </div>
        <ExposureDonut upPct={summary.upPct} downPct={summary.downPct} totalAtRiskHuman={summary.totalAtRiskHuman} />
      </div>

      <AlertsList alerts={mockAlerts} />

      <div className="grid sm:grid-cols-2 gap-4">
        <ClaimAllCard claimable={mockClaimable} />
        <EmergencyExitCard positions={mockPositions} />
      </div>

      <PositionList positions={mockPositions} />

      <HistoryList history={mockHistory} />
    </>
  );
}
