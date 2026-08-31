"use client";

import { mockHistory } from "@/lib/mockData";
import { TopHeader } from "@/components/TopHeader";
import { HistoryList } from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <>
      <TopHeader
        title="History"
        subtitle="Every settled position — outcome, payout, and a link to audit the resolution."
      />
      <HistoryList history={mockHistory} expanded />
    </>
  );
}
