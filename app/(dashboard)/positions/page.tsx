"use client";

import { useAccount } from "wagmi";
import { useRealPortfolio } from "@/lib/useRealPortfolio";
import { computeAlerts } from "@/lib/computeAlerts";
import { TopHeader } from "@/components/TopHeader";
import { PositionList } from "@/components/PositionList";
import { ClaimAllCard } from "@/components/ClaimAllCard";
import { EmergencyExitCard } from "@/components/EmergencyExitCard";
import { AlertsList } from "@/components/AlertsList";
import { ConnectPrompt, LoadingState, ErrorState } from "@/components/ConnectGate";

export default function PositionsPage() {
  const { address, isConnected } = useAccount();
  const { positions, claimable, summary, loading, error, refetch } = useRealPortfolio(address);

  const alerts = computeAlerts(positions, summary);

  return (
    <>
      <TopHeader
        title="Positions"
        subtitle="Every open Event Contract position, across every rolling window."
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
          <div className="grid sm:grid-cols-2 gap-4">
            <ClaimAllCard claimable={claimable} />
            <EmergencyExitCard positions={positions} />
          </div>

          <AlertsList alerts={alerts} />

          <PositionList positions={positions} />
        </>
      )}
    </>
  );
}
