"use client";

import { useState } from "react";
import type { Position } from "@/lib/types";

interface Props {
  positions: Position[];
}

export function EmergencyExitCard({ positions }: Props) {
  const [state, setState] = useState<"idle" | "reviewing" | "exiting" | "done">("idle");
  const [exitedCount, setExitedCount] = useState(0);

  const exitable = positions.filter((p) => p.status === "Trading");
  const stuck = positions.filter((p) => p.status !== "Trading");

  if (positions.length === 0) return null;

  const estimatedReturn = exitable.reduce((s, p) => s + p.stakedHuman * 0.92, 0);
  const estimatedLoss = exitable.reduce((s, p) => s + p.stakedHuman, 0) - estimatedReturn;

  return (
    <div
      className="rounded-3xl p-6 border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {state === "idle" && (
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-sm mb-1">Emergency Exit</div>
            <div className="text-xs text-[var(--color-text-muted)]">
              Flatten what's exitable right now
            </div>
          </div>
          <button
            onClick={() => setState("reviewing")}
            className="px-6 py-3 rounded-full font-bold text-sm border transition-colors hover:bg-white/[0.03]"
            style={{ borderColor: "var(--color-down)", color: "var(--color-down)" }}
          >
            Review Exit
          </button>
        </div>
      )}

      {state === "reviewing" && (
        <div>
          <h3 className="font-bold mb-3">Emergency Exit Review</h3>
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <div className="text-[var(--color-text-dim)] text-xs mb-1.5">{positions.length} open positions</div>
              <div className="font-semibold" style={{ color: "var(--color-up)" }}>{exitable.length} can be exited</div>
              <div className="text-[var(--color-text-muted)]">{stuck.length} cannot right now</div>
            </div>
            <div>
              <div className="text-[var(--color-text-dim)] text-xs mb-1.5">Estimated result</div>
              <div className="tabular font-semibold">Return: ${estimatedReturn.toFixed(2)}</div>
              <div className="tabular font-semibold" style={{ color: "var(--color-down)" }}>
                Loss: ${estimatedLoss.toFixed(2)}
              </div>
            </div>
          </div>
          {stuck.length > 0 && (
            <div className="text-xs text-[var(--color-text-dim)] mb-5">
              {stuck.length} position{stuck.length !== 1 ? "s are" : " is"} locked (window ended, awaiting
              settlement) — can't be exited early.
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setState("exiting")}
              disabled={exitable.length === 0}
              className="flex-1 px-4 py-3 rounded-full font-bold text-sm disabled:opacity-40"
              style={{ background: "var(--color-down)", color: "#0a0a0a" }}
            >
              Exit {exitable.length} Position{exitable.length !== 1 ? "s" : ""}
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

      {state === "exiting" && (
        <div className="py-2">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--color-down)", borderTopColor: "transparent" }}
            />
            <span className="text-sm text-[var(--color-text-muted)]">
              Exiting {exitedCount} of {exitable.length}…
            </span>
          </div>
          <button
            onClick={() => {
              if (exitedCount + 1 >= exitable.length) {
                setState("done");
              } else {
                setExitedCount((c) => c + 1);
              }
            }}
            className="text-xs underline text-[var(--color-text-dim)]"
          >
            (demo: confirm next signature)
          </button>
        </div>
      )}

      {state === "done" && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: "var(--color-down)" }}>
            {exitable.length} position{exitable.length !== 1 ? "s" : ""} exited, ${estimatedReturn.toFixed(2)} returned
          </span>
        </div>
      )}
    </div>
  );
}
