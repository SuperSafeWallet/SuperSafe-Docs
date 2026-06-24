---
sidebar_position: 5
---

# 🔄 Swapping Tokens

Swap tokens with SuperSafe's multi-provider swap system: **Uniswap**, **Relay.link**, **Khalani / HyperStream**, and **Bebop** for same-chain DEX routing, cross-chain bridging, cross-chain intents, gasless execution, and MEV protection.

## Overview

SuperSafe Wallet integrates **four professional swap providers**, each optimized for a different route type. A unified tab interface lets you switch between providers in one click, while shared controls like slippage and gas validation protect every swap.

| Provider | Best For | Key Advantage |
|----------|----------|---------------|
| **🦄 Uniswap** | Same-chain DEX swaps | UniswapX gas optimization + curated token lists |
| **🔗 Relay.link** | Cross-chain swap + bridge | Bridge + swap in one transaction across 85+ chains |
| **Khalani / HyperStream** | Cross-chain intent routes | Executable intent routes with order lifecycle tracking |
| **🐝 Bebop** | Gasless same-chain swaps | Permit2 gasless swaps with MEV protection |

<img src="/img/khalani-mark-cobalt.svg" alt="Khalani logo" width="72" />

---

## Swap Providers

### 🦄 Uniswap (Same-Chain DEX)

SuperSafe's featured same-chain DEX provider, powered by the **Uniswap Routing API** with UniswapX and Classic (v3/v4) routing.

#### Key Features

- **UniswapX**: Gas-optimized Dutch auction routing for better prices
- **v4-first Routing**: Automatically selects the best route (v4 preferred, v3 fallback)
- **Curated Token List**: Top 100 tokens pre-loaded with smart balance-first sorting
- **Improved Token Search**: High-performance backend search for discovering any token
- **Approval Confirmation**: Explicit consent flow for all token approvals with risk visualization
- **Price Deviation Alerts**: Standardized safety warnings for unfavorable quotes

#### Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| **Ethereum** | 1 | ✅ Active |
| **Arbitrum One** | 42161 | ✅ Active |
| **Optimism** | 10 | ✅ Active |
| **Base** | 8453 | ✅ Active |

#### How Uniswap Swaps Work

1. **Select tokens**: Choose from the curated top-100 list or search for any token.
2. **Enter amount**: Type the amount to swap or use quick buttons.
3. **Review quote**: See price impact, route details, and fee breakdown.
4. **Approve token**: Confirm the approval with clear risk information when required.
5. **Execute swap**: Sign and submit via UniswapX or Classic routing.
6. **Track status**: Follow real-time updates until confirmation.

#### Fee Structure

- **SuperSafe Fee**: 0.2%
- **Uniswap Labs Fee**: 0.2%
- **Total**: 0.4%

:::tip Approval Confirmation
When approving a token for the first time, SuperSafe shows a detailed confirmation screen explaining what "Approve" means, the spender address, and any unlimited approval warnings.
:::

---

### 🔗 Relay.link (Cross-Chain Bridge + Swap)

Relay.link is the cross-chain bridge-and-swap provider for moving value between networks in one guided flow.

#### Key Features

- **Cross-Chain Swaps**: Swap tokens across different networks in one step
- **85+ Blockchains**: Wide network support including all SuperSafe networks
- **Meta-Aggregation**: Best prices from multiple DEXs and bridges combined
- **Route Visualization**: See bridge, swap, and approval steps before execution
- **Bridge Time Estimation**: Dynamic completion time based on route and congestion
- **Gas Estimation**: Real-time gas cost display per step and total

#### Supported Networks

| Network | Chain ID | Cross-Chain | Status |
|---------|----------|-------------|--------|
| **SuperSeed** | 5330 | ✅ Enabled | ✅ Active |
| **Ethereum** | 1 | ✅ Enabled | ✅ Active |
| **Optimism** | 10 | ✅ Enabled | ✅ Active |
| **Base** | 8453 | ✅ Enabled | ✅ Active |
| **BNB Chain** | 56 | ✅ Enabled | ✅ Active |
| **Arbitrum One** | 42161 | ✅ Enabled | ✅ Active |

#### How Relay Swaps Work

1. **Select origin token**: Uses your active network.
2. **Select destination**: Choose destination network and token.
3. **Enter amount**: Specify how much to swap.
4. **Review route**: Inspect the bridge + swap path.
5. **Execute swap**: Approve and submit the cross-chain transaction.
6. **Track bridging**: Follow status and estimated completion time.

#### Fee Structure

- **SuperSafe Partner Fee**: 0.4%
- **Total**: 0.4%

:::note Network Selection
The origin network is always your currently active network. To swap from a different network, switch your active network first via the header.
:::

---

### Khalani / HyperStream (Cross-Chain Intents)

Khalani is integrated as a cross-chain intent-routing provider powered by HyperStream. It lets users select a source token, destination network, destination token, and amount. HyperStream returns executable routes, and SuperSafe tracks the resulting order until it is filled, refunded, or failed.

#### Key Features

- Cross-chain intent routing through HyperStream.
- Multiple route support when HyperStream returns alternatives.
- Route sorting that prioritizes executable `CONTRACT_CALL` routes, sufficient quote lifetime, best output amount, and shorter expected duration.
- Quote expiry handling to prevent users from executing stale routes.
- Order lifecycle tracking after deposit submission.
- Shared SuperSafe fee configuration when referrer fees are available.
- Background-only execution: the popup delegates to the background stream handler; private keys never leave the background service worker.

#### Supported Networks

| Network | Chain ID | Khalani / HyperStream |
|---------|----------|------------------------|
| **Ethereum** | 1 | ✅ Active |
| **Optimism** | 10 | ✅ Active |
| **BNB Chain** | 56 | ✅ Active |
| **Base** | 8453 | ✅ Active |
| **Arbitrum One** | 42161 | ✅ Active |
| **Monad** | 143 | ✅ Active |
| **SuperSeed** | 5330 | Disabled |
| **U2U** | 39 | Disabled |

#### How Khalani Swaps Work

1. The user selects the source token on the active wallet network.
2. The user selects the destination network and destination token.
3. SuperSafe requests an `EXACT_INPUT` quote from HyperStream.
4. HyperStream returns one or more executable routes.
5. The user confirms the selected route.
6. SuperSafe asks HyperStream to build the deposit actions.
7. The background service worker validates every returned EIP-1193 action before executing it.
8. SuperSafe submits the deposit transaction hash to HyperStream.
9. SuperSafe polls the order until it reaches a terminal status such as filled, refunded, or failed.

#### Security Model

SuperSafe executes Khalani routes only through the background context. Returned EIP-1193 actions are validated before execution:

- `wallet_switchEthereumChain` must target the expected source chain.
- `eth_sendTransaction.from` must match the active wallet.
- Transaction `chainId` must match the source chain.
- Transaction `to` must be a valid EVM address.
- Unsupported action types fail closed.
- MVP execution is scoped to EVM `CONTRACT_CALL` deposit routes.

#### MVP Limitations

- EVM-only execution.
- `CONTRACT_CALL` deposit routes only.
- No Solana actions.
- No direct `TRANSFER` or `PERMIT2` deposit execution in the first integration.
- SuperSafe does not run a Khalani/Medusa solver.
- SuperSeed and U2U remain disabled until HyperStream supports those chains.

---

### 🐝 Bebop (Gasless Same-Chain)

Bebop provides **gasless same-chain swaps** via the Bebop JAM protocol with built-in MEV protection.

#### Key Features

- **Gasless Swaps**: Zero gas fees via Permit2 after the one-time token approval
- **MEV Protection**: Private execution protects from sandwich attacks and frontrunning
- **EIP-712 Signing**: Orders are signed, not sent as transactions
- **Best Price**: Aggregated liquidity from professional market makers
- **Single Approval**: One-time Permit2 approval covers future swaps for that token

#### Supported Networks

| Network | Chain ID | Protocol | Status |
|---------|----------|----------|--------|
| **SuperSeed** | 5330 | JAM | ✅ Active |
| **Ethereum** | 1 | JAM + RFQ | ✅ Active |
| **Optimism** | 10 | JAM + RFQ | ✅ Active |
| **Base** | 8453 | JAM + RFQ | ✅ Active |
| **BNB Chain** | 56 | JAM + RFQ | ✅ Active |
| **Arbitrum One** | 42161 | JAM + RFQ | ✅ Active |

#### How Bebop Swaps Work

1. **Select tokens**: Choose from and to tokens.
2. **Enter amount**: Specify the amount to swap.
3. **Review quote**: See price impact, route, and fee breakdown.
4. **Approve token**: Complete the one-time Permit2 approval when required.
5. **Sign order**: Sign EIP-712 typed data.
6. **Order executes**: Bebop settles the order on-chain.

#### Fee Structure

- **SuperSafe Partner Fee**: 0.4%
- **Total**: 0.4%

:::tip Why Gasless?
Bebop uses Permit2 + EIP-712 signing, so your swap does not require an on-chain transaction from you. The market maker settles the trade; you only pay gas once per token for the initial Permit2 approval.
:::

---

## Provider Comparison

| Feature | Uniswap | Relay.link | Khalani | Bebop |
|---------|---------|------------|---------|-------|
| Same-chain swaps | Yes | Yes | Route-dependent | Yes |
| Cross-chain swaps | No | Yes | Yes | No |
| Intent routing | No | No | Yes | Yes, for Bebop orders |
| Gasless swap execution | UniswapX only | No | No, source-chain deposit required | Yes after approval |
| Order lifecycle tracking | Yes | Yes | Yes | Yes |
| Best use case | Same-chain DEX routing | Bridge + swap | Cross-chain intent routes | Gasless MEV-protected swaps |

---

## Shared Features

### Slippage Configuration

All providers share the same slippage control:

```text
Slippage Settings:
├── 0.1% - Very Low (May fail in volatile markets)
├── 0.5% - Recommended (Default)
├── 1.0% - Medium
├── 2.0% - High
└── Custom - User defined
```

### ⛽ Gas Validation System

SuperSafe protects every swap with real-time gas validation:

- **Scam Detection**: Blocks transactions with gas > 50% of swap value.
- **Balance Validation**: Ensures sufficient native tokens for gas.
- **Real-time Monitoring**: Fetches current network gas prices.
- **Button-Integrated Alerts**: Visual feedback directly on the swap button.

See [Gas Validation System](/docs/advanced/gas-validation) for full details.

### 🛡️ Price Deviation Alerts

All swap providers include standardized price deviation warnings:

- **> 5% deviation**: High alert for unfavorable quotes.
- **> 2% deviation**: Moderate caution indicator.
- **< 2% deviation**: Normal.

---

## Swap Interface

### Provider Tabs

Switch between providers using the tab selector at the top of the swap screen:

```text
┌──────────────────────────────────────────────────────────┐
│ [🦄 Uniswap] [🔗 Relay] [Khalani] [🐝 Bebop]             │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Slippage: 0.5% [⚙️]                                 │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ From Token: [ETH ▼] [1.0] [Max] [50%] [25%]         │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ To Token / Network: [Base ▼] [USDC ▼] [≈$1,200]     │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Route, quote expiry, gas, lifecycle, and fee details │ │
│ └──────────────────────────────────────────────────────┘ │
│ [🔄 Swap Tokens]                                        │
└──────────────────────────────────────────────────────────┘
```

### Token Selection

- **Click Token Dropdown**: Opens the token selector.
- **Search**: Type to search for any token.
- **Balance Display**: Shows your balance for each token.
- **Quick Buttons**: Max, 50%, 25% for quick amount entry.

---

## Fee Summary

All swap providers apply or share the **0.4% SuperSafe fee configuration** when the provider supports it:

```text
Fee Structure by Provider:
├── 🦄 Uniswap:   0.2% SuperSafe + 0.2% Uniswap Labs = 0.4%
├── 🔗 Relay:     0.4% SuperSafe Partner Fee           = 0.4%
├── Khalani:      Shared SuperSafe fee configuration when referrer fees are available
└── 🐝 Bebop:     0.4% SuperSafe Partner Fee           = 0.4%
```

All fees are transparently displayed in the quote details before you confirm any swap.

---

## Troubleshooting

### Common Issues

| Issue | Likely Cause | Solution |
|-------|-------------|----------|
| Swap button disabled | Insufficient gas balance | Add native tokens (ETH, BNB, etc.) |
| "Gas Fee Too High" warning | Possible scam contract | Verify the token contract before proceeding |
| High price impact | Large amount or low liquidity | Reduce amount or wait for more liquidity |
| Approval failed | Insufficient gas | Ensure enough native tokens for the approval transaction |
| Slippage exceeded | Market moved during swap | Increase slippage tolerance and retry |
| Cross-chain swap slow | Bridge congestion or pending intent fill | Check the Relay bridge time or Khalani order status |
| Khalani quote expired | Quote lifetime elapsed | Request a fresh route before executing |

### Choosing the Right Provider

- **Standard same-chain swaps**: Use **Uniswap** for DEX routing and token coverage.
- **Bridge + swap transfers**: Use **Relay.link** to bridge and swap in one flow.
- **Cross-chain intent routes**: Use **Khalani / HyperStream** when you want intent routing with order lifecycle tracking.
- **Gasless same-chain swaps**: Use **Bebop** for zero-gas execution after approval.

---

## Best Practices

- **Compare providers**: Check quotes across providers for best price and route type.
- **Start with small amounts**: Test new token pairs with small swaps first.
- **Watch quote expiry**: Refresh expired Khalani and Relay quotes before execution.
- **Check gas alerts**: Investigate warnings before proceeding.
- **Verify tokens**: Confirm token contract addresses, especially for new tokens.

---

## Next Steps

Now that you can swap tokens:

1. **[Switch Networks](./network-switching.md)** - Work with different networks
2. **[Connect to dApps](../connecting-dapps/connecting.md)** - Use with dApps
3. **[Security Overview](../security/overview.md)** - Learn about security

---

**Ready to switch networks?** Continue to [Network Switching](./network-switching.md)!

**Document Status:** ✅ Current as of June 24, 2026  
**Code Version:** v3.1.8 + Khalani / HyperStream integration
