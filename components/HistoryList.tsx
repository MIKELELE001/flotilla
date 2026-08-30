import type { HistoryEntry } from "@/lib/types";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}

export function HistoryList({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) return null;

  return (
    <section
      className="rounded-3xl p-7 border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase mb-5">
        Position History
      </h2>
      <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
        {history.map((h) => (
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
    </section>
  );
}
