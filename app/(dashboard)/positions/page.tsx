"use client";

import { mockPositions, mockClaimable, mockAlerts, computeSummary } from "@/lib/mockData";
import { TopHeader } from "@/components/TopHeader";
import { PositionList } from "@/components/PositionList";
import { ClaimAllCard } from "@/components/ClaimAllCard";
import { EmergencyExitCard } from "@/components/EmergencyExitCard";
import { AlertsList } from "@/components/AlertsList";

export default function PositionsPage() {
  const summary = computeSummary(mockPositions, mockClaimable);

  return (
    <>
      <TopHeader
        title="Positions"
        subtitle="Every open Event Contract position, across every rolling window."
        expiringSoonCount={summary.expiringSoonCount}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <ClaimAllCard claimable={mockClaimable} />
        <EmergencyExitCard positions={mockPositions} />
      </div>

      <AlertsList alerts={mockAlerts} />

      <PositionList positions={mockPositions} />
    </>
  );
}
