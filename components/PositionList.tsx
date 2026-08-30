"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Search } from "lucide-react";
import type { Position } from "@/lib/types";

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "expired";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function PositionRow({ position, now, checked, onToggle }: {
  position: Position;
  now: number;
  checked: boolean;
  onToggle: () => void;
}) {
  const remaining = Math.max(0, position.expiresInSeconds - now);
  const isUrgent = position.status === "Trading" && remaining > 0 && remaining < 300;
  const isLocked = position.status === "Locked";

  return (
    <tr className="border-t" style={{ borderColor: "var(--color-border)" }}>
      <td className="py-4 pr-2 w-8">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-4 h-4 rounded accent-[var(--color-accent)]"
        />
      </td>
      <td className="py-4 pr-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--color-surface-raised)" }}
          >
            {position.asset.slice(0, 1)}
          </div>
          <div>
            <div className="text-sm font-semibold">{position.asset}</div>
            <div className="text-xs text-[var(--color-text-dim)]">{position.interval}</div>
          </div>
        </div>
      </td>
      <td className="py-4 pr-4">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            color: position.side === "UP" ? "var(--color-up)" : "var(--color-down)",
            background: position.side === "UP" ? "var(--color-up-dim)" : "var(--color-down-dim)",
          }}
        >
          {position.side}
        </span>
      </td>
      <td className="py-4 pr-4 text-sm font-semibold tabular">${position.stakedHuman.toFixed(2)}</td>
      <td className="py-4 pr-4 text-sm font-semibold tabular" style={{ color: "var(--color-up)" }}>
        ${position.potentialPayoutHuman.toFixed(2)}
      </td>
      <td className="py-4 pr-4">
        {isLocked ? (
          <span className="text-xs text-[var(--color-text-dim)]">Locked</span>
        ) : (
          <span
            className="text-xs font-semibold tabular"
            style={{ color: isUrgent ? "var(--color-accent)" : "var(--color-text-muted)" }}
          >
            {formatCountdown(remaining)}
          </span>
        )}
      </td>
      <td className="py-4 text-right">
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5">
          <MoreHorizontal size={16} className="text-[var(--color-text-dim)]" />
        </button>
      </td>
    </tr>
  );
}

export function PositionList({ positions }: { positions: Position[] }) {
  const [now, setNow] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setNow((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = positions.filter((p) => p.asset.toLowerCase().includes(query.toLowerCase()));

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (positions.length === 0) {
    return (
      <div
        className="rounded-3xl p-10 border text-center"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <p className="text-[var(--color-text-muted)]">No open positions. Your book is empty.</p>
      </div>
    );
  }

  return (
    <section
      className="rounded-3xl p-7 border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold">Open Positions</h2>
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-full border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Search size={14} className="text-[var(--color-text-dim)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search asset..."
            className="bg-transparent text-sm outline-none w-32 placeholder:text-[var(--color-text-dim)]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-[var(--color-text-dim)] uppercase tracking-wide">
              <th className="pb-2 font-medium w-8"></th>
              <th className="pb-2 font-medium">Asset</th>
              <th className="pb-2 font-medium">Side</th>
              <th className="pb-2 font-medium">At risk</th>
              <th className="pb-2 font-medium">Payout</th>
              <th className="pb-2 font-medium">Expires</th>
              <th className="pb-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <PositionRow
                key={p.id}
                position={p}
                now={now}
                checked={selected.has(p.id)}
                onToggle={() => toggle(p.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
