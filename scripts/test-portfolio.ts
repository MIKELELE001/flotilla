// Flotilla — portfolio data layer test.
// Goal: pull a real wallet's full Event Contract portfolio (open positions,
// exposure, claimable winnings) using the SDK's native aggregation surfaces,
// and print exactly the numbers the dashboard needs. No UI yet — just proving
// the data pipeline end to end.
//
// Run with: npx tsx scripts/test-portfolio.ts <wallet-address>

import { SomniaMarkets, SOMNIA_TESTNET_ADDRESSES, claimableFrom, type ClaimableInput } from "@somnia-chain/markets-sdk";
import { somniaShannon } from "@somnia-chain/markets-sdk/chains";

const TESTNET_INDEXER_URL = "https://dev.smk.somnia.host/v1/graphql";
const TESTNET_WS_RPC_URL = "wss://api.infra.testnet.somnia.network/ws";

function isHexId(id: string): id is `0x${string}` {
  return id.startsWith("0x");
}

async function main() {
  const account = process.argv[2];
  if (!account) {
    console.error("Usage: npx tsx scripts/test-portfolio.ts <wallet-address>");
    console.error("Pass any Somnia Shannon testnet wallet address that has traded Event Contracts.");
    process.exit(1);
  }

  const exchange = new SomniaMarkets({
    indexerUrl: TESTNET_INDEXER_URL,
    chain: somniaShannon,
    wsRpcUrl: TESTNET_WS_RPC_URL,
    addresses: SOMNIA_TESTNET_ADDRESSES,
  });

  console.log(`Fetching portfolio for ${account}...\n`);

  const portfolio = await exchange.client.getPortfolio(account, { ordersLimit: 200, tradesLimit: 50 });

  console.log(`Open positions: ${portfolio.positions.length}`);
  console.log(`Open orders: ${portfolio.openOrders.length}`);
  console.log(`Recent trades: ${portfolio.trades.length}\n`);

  if (portfolio.positions.length === 0) {
    console.log("No open positions for this wallet. Try a wallet that has traded Event Contracts on testnet,");
    console.log("or use the faucet + place a small order first (see @somnia-chain/markets-sdk/testnet faucet()).");
  }

  let totalAtRiskRaw = BigInt(0);
  let upExposureRaw = BigInt(0);
  let downExposureRaw = BigInt(0);

  console.log("Position breakdown:\n");
  for (const p of portfolio.positions) {
    const decimals = p.market.quoteDecimals;
    const balance = BigInt(p.balance);
    const human = Number(balance) / 10 ** decimals;
    const side = p.outcomeIndex === 0 ? "UP" : "DOWN";
    const secondsLeft = Number(p.market.expiry) - Date.now() / 1000;

    console.log(`  ${p.market.asset} ${side} · ${p.market.interval ?? "?"}`);
    console.log(`    balance: ${human} contracts | status: ${p.market.status}`);
    console.log(`    expires in: ${Math.max(0, Math.round(secondsLeft / 60))} min\n`);

    totalAtRiskRaw += balance;
    if (side === "UP") upExposureRaw += balance;
    else downExposureRaw += balance;
  }

  const totalExposure = Number(upExposureRaw + downExposureRaw);
  const upPct = totalExposure > 0 ? (Number(upExposureRaw) / totalExposure) * 100 : 0;
  const downPct = totalExposure > 0 ? (Number(downExposureRaw) / totalExposure) * 100 : 0;

  console.log("--- YOUR BOOK ---");
  console.log(`Net exposure: ${upPct.toFixed(0)}% UP / ${downPct.toFixed(0)}% DOWN\n`);

  console.log("Checking for claimable (settled) positions...\n");

  const settled = await exchange.client.listBinaryMarkets({ status: "Finalized", limit: 120 });
  const settledIds: Set<string> = new Set(settled.map((m) => m.marketId));

  const claimableInputs: ClaimableInput[] = [];
  for (const p of portfolio.positions) {
    if (!settledIds.has(p.market.id)) continue;
    if (!isHexId(p.market.id)) continue;
    const onchain = await exchange.client.getMarketOnchain(p.market.id);
    claimableInputs.push({
      marketId: p.market.id,
      pool: p.market.poolAddress,
      outcomeIdx: p.outcomeIndex as 0 | 1,
      amount: BigInt(p.balance),
      winningOutcome: onchain.winningOutcome ?? null,
      voided: onchain.isVoided,
      status: onchain.isVoided ? "Voided" : onchain.isResolved ? "Resolved" : "Trading",
      settlementFeeBps: BigInt(0),
    });
  }

  const claimable = claimableFrom(claimableInputs);
  const totalClaimableRaw = claimable.reduce((sum, c) => sum + c.estPayout, BigInt(0));

  console.log(`Claimable positions: ${claimable.length}`);
  if (claimable.length > 0) {
    console.log(`Total estimated payout (raw units, mixed decimals — format per market in UI): ${totalClaimableRaw}`);
  }

  console.log("\nPortfolio data pipeline confirmed working.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Portfolio test failed:");
  console.error(err);
  process.exit(1);
});