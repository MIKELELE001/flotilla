import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { somniaShannon } from "@somnia-chain/markets-sdk/chains";

// Reuse the same testnet chain definition the SDK ships, so wagmi and the
// SDK agree on chain id / RPC without us hand-maintaining two configs.
export const wagmiConfig = createConfig({
  chains: [somniaShannon],
  connectors: [injected()],
  transports: {
    [somniaShannon.id]: http(),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
