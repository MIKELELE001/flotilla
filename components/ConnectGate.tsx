"use client";

import { ConnectWalletButton } from "./ConnectWalletButton";

/** The empty state shown when no wallet is connected yet. */
export function ConnectPrompt() {
  return (
    <div
      className="rounded-3xl p-12 border text-center flex flex-col items-center gap-4"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <p className="text-[var(--color-text-muted)] text-sm max-w-sm">
        Connect a Somnia Shannon testnet wallet to see your Event Contracts book.
      </p>
      <ConnectWalletButton />
    </div>
  );
}

export function LoadingState() {
  return (
    <div
      className="rounded-3xl p-12 border text-center"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div
        className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin mx-auto"
        style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
      />
      <p className="text-sm text-[var(--color-text-dim)] mt-3">Loading your book…</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="rounded-3xl p-8 border text-center"
      style={{ background: "var(--color-down-dim)", borderColor: "rgba(248, 113, 113, 0.25)" }}
    >
      <p className="text-sm" style={{ color: "var(--color-down)" }}>
        Couldn&apos;t load your portfolio: {message}
      </p>
      <button
        onClick={onRetry}
        className="mt-3 text-xs font-semibold underline text-[var(--color-text-muted)]"
      >
        Try again
      </button>
    </div>
  );
}
