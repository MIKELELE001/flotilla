"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SomniaMarketsProvider } from "@somnia-chain/markets-sdk/react";
import { useState } from "react";
import { wagmiConfig } from "@/lib/wagmi";
import { getSomniaClient } from "@/lib/somnia";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [somniaClient] = useState(() => getSomniaClient().client);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SomniaMarketsProvider client={somniaClient}>{children}</SomniaMarketsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
