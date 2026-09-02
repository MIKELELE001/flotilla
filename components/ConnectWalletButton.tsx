"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        style={{ borderColor: "var(--color-border)" }}
      >
        {shortenAddress(address)}
      </button>
    );
  }

  const injectedConnector = connectors.find((c) => c.id === "injected") ?? connectors[0];

  return (
    <button
      onClick={() => injectedConnector && connect({ connector: injectedConnector })}
      disabled={isPending || !injectedConnector}
      className="px-4 py-2.5 rounded-full font-semibold text-sm gradient-accent text-[#0a0a0a] transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {isPending ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
