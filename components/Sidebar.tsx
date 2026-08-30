"use client";

import { LayoutGrid, Wallet, History, Settings } from "lucide-react";
import { Logo } from "./Logo";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Positions", icon: Wallet, active: false },
  { label: "History", icon: History, active: false },
  { label: "Settings", icon: Settings, active: false },
];

export function Sidebar() {
  return (
    <aside
      className="w-60 shrink-0 h-screen sticky top-0 border-r flex flex-col p-5"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="mb-10 px-1">
        <Logo size={34} />
      </div>

      <div className="text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wide mb-3 px-1">
        Menu
      </div>
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={
              active
                ? { background: "var(--color-accent)", color: "#0a0a0a" }
                : { color: "var(--color-text-muted)" }
            }
          >
            <Icon size={17} strokeWidth={2.2} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <div
          className="rounded-2xl p-4 border"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div className="text-xs text-[var(--color-text-dim)] mb-2">
            DreamDEX lets you trade Event Contracts.
          </div>
          <div className="text-sm font-semibold">Flotilla manages the book.</div>
        </div>
      </div>
    </aside>
  );
}
