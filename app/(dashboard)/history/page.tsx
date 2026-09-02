"use client";

import { mockHistory } from "@/lib/mockData";
import { TopHeader } from "@/components/TopHeader";
import { HistoryList } from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <>
      <TopHeader
        title="History"
        subtitle="See how each settled position resolved, what it paid out, and audit the result."
      />
      <div
        className="rounded-2xl px-5 py-3.5 border mb-5 text-sm"
        style={{ background: "var(--color-accent-dim)", borderColor: "rgba(245, 166, 35, 0.25)", color: "var(--color-accent)" }}
      >
        Sample data for now. This will show your real trade history once you've placed a few trades.
      </div>
      <HistoryList history={mockHistory} expanded />
    </>
  );
}
