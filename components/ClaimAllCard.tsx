"use client";

import { useState } from "react";
import type { ClaimablePosition } from "@/lib/types";

export function ClaimAllCard({ claimable }: { claimable: ClaimablePosition[] }) {
  const [state, setState] = useState<"idle" | "reviewing" | "claiming" | "done">("idle");

  const total = claimable.reduce((s, c) => s + c.payoutHuman, 0);
  const marketCount = new Set(claimable.map((c) => `${c.asset}-${c.interval}`)).size;

  if (claimable.length === 0) return null;

  if (state === "done") {
    return (
      <div
        className="rounded-3xl p-6 border flex items-center justify-between"
        style={{ background: "var(--color-up-dim)", borderColor: "rgba(52, 211, 153, 0.25)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--color-up)" }}>
          ${total.toFixed(2)} claimed
        </span>
        <span className="text-xs text-[var(--color-text-dim)]">tx confirmed</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl p-6 border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {state === "idle" && (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--color-text-muted)] mb-1.5">Ready to claim</div>
            <div className="text-3xl font-bold tabular tracking-tight" style={{ color: "var(--color-accent)" }}>
              ${total.toFixed(2)}
            </div>
          </div>
          <button
            onClick={() => setState("reviewing")}
            className="px-6 py-3 rounded-full font-bold text-sm gradient-accent text-[#0a0a0a] transition-opacity hover:opacity-90"
          >
            Claim All
          </button>
        </div>
      )}

      {state === "reviewing" && (
        <div>
          <h3 className="font-bold mb-3">Claim Review</h3>
          <div className="text-sm text-[var(--color-text-muted)] mb-4">
            {claimable.length} winning position{claimable.length !== 1 ? "s" : ""}, {marketCount} market
            {marketCount !== 1 ? "s" : ""}, ${total.toFixed(2)} total
          </div>
          <div className="space-y-1 mb-5">
            {claimable.map((c) => (
              <div key={c.id} className="flex justify-between text-sm py-1.5">
                <span className="text-[var(--color-text-muted)]">
                  {c.asset} {c.side} · {c.interval}
                </span>
                <span className="font-semibold tabular" style={{ color: "var(--color-up)" }}>
                  +${c.payoutHuman.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setState("claiming")}
              className="flex-1 px-4 py-3 rounded-full font-bold text-sm gradient-accent text-[#0a0a0a]"
            >
              Sign & Claim (1 signature)
            </button>
            <button
              onClick={() => setState("idle")}
              className="px-5 py-3 rounded-full font-semibold text-sm border"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {state === "claiming" && (
        <div className="flex items-center gap-3 py-2">
          <div
            className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
          />
          <span className="text-sm text-[var(--color-text-muted)]">Waiting for signature…</span>
          <button onClick={() => setState("done")} className="ml-auto text-xs underline text-[var(--color-text-dim)]">
            (demo: confirm)
          </button>
        </div>
      )}
    </div>
  );
}
