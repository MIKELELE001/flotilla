import { SomniaMarkets, SOMNIA_TESTNET_ADDRESSES } from "@somnia-chain/markets-sdk";
import { somniaShannon } from "@somnia-chain/markets-sdk/chains";

const TESTNET_INDEXER_URL = "https://dev.smk.somnia.host/v1/graphql";
const TESTNET_WS_RPC_URL = "wss://api.infra.testnet.somnia.network/ws";

let client: SomniaMarkets | null = null;

// A single shared read-only SDK client (no privateKey — all portfolio
// reads run through exchange.client.*, which never needs a signer).
// Same connection config proven working in scripts/test-portfolio.ts.
export function getSomniaClient(): SomniaMarkets {
  if (!client) {
    client = new SomniaMarkets({
      indexerUrl: TESTNET_INDEXER_URL,
      chain: somniaShannon,
      wsRpcUrl: TESTNET_WS_RPC_URL,
      addresses: SOMNIA_TESTNET_ADDRESSES,
    });
  }
  return client;
}
