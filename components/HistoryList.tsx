"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/lib/types";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}

interface Props {
  history: HistoryEntry[];
  expanded?: boolean; // full page vs. dashboard preview
}

export function HistoryList({ history, expanded = false }: Props) {
  const [filter, setFilter] = useState<"all" | "won" | "lost">("all");
  const [query, setQuery] = useState("");

  if (history.length === 0) return null;

  const filtered = history
    .filter((h) => filter === "all" || (filter === "won" ? h.outcome === "Won" : h.outcome === "Lost"))
    .filter((h) => h.asset.toLowerCase().includes(query.toLowerCase()));

  return (
    <section
      className="rounded-3xl p-7 border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-base font-bold">Position History</h2>

        {expanded && (
          <div className="flex items-center gap-2">
            {(["all", "won", "lost"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full capitalize transition-colors"
                style={
                  filter === f
                    ? { background: "var(--color-accent)", color: "#0a0a0a" }
                    : { color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }
                }
              >
                {f}
              </button>
            ))}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search asset..."
              className="text-sm px-3.5 py-1.5 rounded-full border bg-transparent outline-none placeholder:text-[var(--color-text-dim)]"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)] py-4">No matching history.</p>
      ) : (
        <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
          {(expanded ? filtered : filtered.slice(0, 3)).map((h) => (
            <div key={h.id} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">
                  {h.asset} · {h.side}
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    color: h.outcome === "Won" ? "var(--color-up)" : "var(--color-down)",
                    background: h.outcome === "Won" ? "var(--color-up-dim)" : "var(--color-down-dim)",
                  }}
                >
                  {h.outcome}
                </span>
                <span className="text-xs text-[var(--color-text-dim)]">{formatTime(h.timestamp)}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold tabular">
                  {h.outcome === "Won" ? "+" : ""}${h.payoutHuman.toFixed(2)}
                </span>
                {h.oracleQuestionId && (
                  <a
                    href={`https://prd.oracle.somnia.host/questions/${h.oracleQuestionId}?view=graph`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline text-[var(--color-text-dim)] hover:text-[var(--color-text-muted)]"
                  >
                    audit
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!expanded && history.length > 3 && (
        <div className="mt-3 text-xs text-[var(--color-text-dim)]">
          Showing 3 of {history.length} — see the History page for the full record.
        </div>
      )}
    </section>
  );
}
