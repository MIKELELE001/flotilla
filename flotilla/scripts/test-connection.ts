// Flotilla — Day 1 SDK integration smoke test.
// Goal: prove we can reach Somnia Shannon testnet, list live Event Contract
// markets, and read on-chain state, before any UI work begins.
//
// Run with: npx tsx scripts/test-connection.ts

import { SomniaMarkets, isBinaryMarket, SOMNIA_TESTNET_ADDRESSES } from "@somnia-chain/markets-sdk";
import { somniaShannon } from "@somnia-chain/markets-sdk/chains";

const TESTNET_INDEXER_URL = "https://dev.smk.somnia.host/v1/graphql";
const TESTNET_WS_RPC_URL = "wss://api.infra.testnet.somnia.network/ws";

async function main() {
  console.log("Connecting to Somnia Shannon testnet...\n");

  // Read-only client — no privateKey needed just to discover markets.
  const exchange = new SomniaMarkets({
    indexerUrl: TESTNET_INDEXER_URL,
    chain: somniaShannon,
    wsRpcUrl: TESTNET_WS_RPC_URL,
    addresses: SOMNIA_TESTNET_ADDRESSES,
  });

  console.log("Fetching live binary (Event Contract) markets...\n");

  const liveMarkets = await exchange.client.listLiveBinaryMarkets({ limit: 20 });

  if (liveMarkets.length === 0) {
    console.log("No live binary markets returned. This could mean:");
    console.log("  - Indexer URL/env mismatch (dev vs staging)");
    console.log("  - No markets currently trading on testnet");
    console.log("  - Network/auth issue reaching the indexer");
    return;
  }

  console.log(`Found ${liveMarkets.length} live market row(s):\n`);

  const now = Date.now() / 1000;

  for (const m of liveMarkets) {
    const onchain = await exchange.client.getMarketOnchain(m.marketId as `0x${string}`);
    const secondsLeft = Number(m.expiry) - now;

    console.log(`  ${m.asset ?? "?"} | interval: ${Number(m.intervalSec ?? 0) / 60}m`);
    console.log(`    marketId: ${m.marketId}`);
    console.log(`    on-chain status: ${onchain.status} (1 = Trading)`);
    console.log(`    expires in: ${Math.round(secondsLeft / 60)} min`);
    console.log("");
  }

  console.log("Connection + read pipeline confirmed working.");
}

main().catch((err) => {
  console.error("Smoke test failed:");
  console.error(err);
  process.exit(1);
});
