---
sidebar_position: 5
---

# 🔄 Swapping Tokens

Swap tokens seamlessly with SuperSafe's multi-provider swap system — featuring **Uniswap**, **Relay.link**, and **Bebop** for the best prices, cross-chain support, and MEV protection.

## Overview

SuperSafe Wallet integrates **three professional swap providers**, each optimized for different use cases. A unified tab interface lets you switch between providers in one click, while shared features like slippage control and gas validation protect every swap.

| Provider | Best For | Key Advantage |
|----------|----------|---------------|
| **🦄 Uniswap** | Single-chain swaps | UniswapX gas optimization + curated token lists |
| **🔗 Relay.link** | Cross-chain swaps | Bridge + swap in one transaction across 85+ chains |
| **🐝 Bebop** | Same-chain swaps | Gasless swaps via Permit2 with MEV protection |

---

## Swap Providers

### 🦄 Uniswap (Primary)

SuperSafe's featured swap provider, powered by the **Uniswap Routing API** with UniswapX and Classic (v3/v4) routing.

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
1. **Select tokens** — Choose from the curated top-100 list or search for any token
2. **Enter amount** — Type the amount to swap or use quick buttons (Max, 50%, 25%)
3. **Review quote** — See price impact, route details, and fee breakdown
4. **Approve token** (first time only) — Confirm the approval with clear risk information
5. **Execute swap** — Sign and submit via UniswapX or Classic routing
6. **Track status** — Real-time status updates until confirmation

#### Fee Structure
- **SuperSafe Fee**: 0.2%
- **Uniswap Labs Fee**: 0.2%
- **Total**: 0.4%

:::tip Approval Confirmation
When approving a token for the first time, SuperSafe shows a detailed confirmation screen explaining what "Approve" means, the spender address, and any unlimited approval warnings. This protects you from unknowingly granting excessive permissions.
:::

---

### 🔗 Relay.link (Cross-Chain)

The go-to provider for **cross-chain swaps and bridging** — swap tokens between different networks in a single transaction.

#### Key Features
- **Cross-Chain Swaps**: Swap tokens across different networks in one step
- **85+ Blockchains**: Wide network support including all SuperSafe networks
- **Meta-Aggregation**: Best prices from multiple DEXs and bridges combined
- **Route Visualization**: See the step-by-step execution path (bridge, swap, approval)
- **Bridge Time Estimation**: Dynamic completion time based on network congestion
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
1. **Select origin token** — Uses your active network (switch network via the header to change)
2. **Select destination** — Choose the destination network and token
3. **Enter amount** — Specify how much to swap
4. **Review route** — See the multi-step route visualization (bridge + swap hops)
5. **Execute swap** — Approve and submit the cross-chain transaction
6. **Track bridging** — Follow real-time status with estimated completion time

#### Fee Structure
- **SuperSafe Partner Fee**: 0.4%
- **Total**: 0.4%

:::note Network Selection
The origin (Pay) network is always your currently active network. To swap from a different network, switch your active network first via the header. This ensures balances are always accurate and transactions can be properly signed.
:::

---

### 🐝 Bebop (Gasless)

The original SuperSafe swap provider — **completely gasless swaps** via the Bebop JAM (Just Another Market) protocol with built-in MEV protection.

#### Key Features
- **Gasless Swaps**: Zero gas fees via Permit2 — you only pay for the one-time token approval
- **MEV Protection**: Private mempool protects from sandwich attacks and frontrunning
- **EIP-712 Signing**: Orders are signed, not sent as transactions — no gas consumed
- **Best Price**: Aggregated liquidity from multiple professional market makers
- **Single Approval**: One-time Permit2 approval covers all future swaps for that token

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
1. **Select tokens** — Choose from and to tokens
2. **Enter amount** — Specify the amount to swap
3. **Review quote** — See price impact, route, and fee breakdown
4. **Approve token** (first time only) — One-time Permit2 approval (gas required)
5. **Sign order** — Sign the EIP-712 typed data (no gas!)
6. **Order executes** — Bebop settles the order on-chain

#### Fee Structure
- **SuperSafe Partner Fee**: 0.4%
- **Total**: 0.4%

:::tip Why Gasless?
Bebop uses Permit2 + EIP-712 signing, which means your swap doesn't require an on-chain transaction from you. The market maker settles the trade, so you pay zero gas for the swap itself. You only pay gas once per token for the initial Permit2 approval.
:::

---

## Provider Comparison

| Feature | 🦄 Uniswap | 🔗 Relay | 🐝 Bebop |
|---------|-----------|---------|---------|
| **Cross-Chain** | ❌ No | ✅ Yes | ❌ No |
| **Gasless Swaps** | ⚠️ UniswapX only | ❌ Gas required | ✅ Yes (Permit2) |
| **MEV Protection** | ✅ UniswapX | ⚠️ Partial | ✅ Full |
| **Networks** | 4 chains | 6 chains (85+ via Relay) | 6 chains |
| **Token Discovery** | ✅ Curated + search | ✅ Wide support | ✅ Market maker pairs |
| **Approval Type** | Standard ERC20 | Standard ERC20 | One-time Permit2 |
| **Total Fee** | 0.4% | 0.4% | 0.4% |

---

## Shared Features

### Slippage Configuration

All providers share the same slippage control:

```
Slippage Settings:
├── 0.1% - Very Low (May fail in volatile markets)
├── 0.5% - Recommended (Default)
├── 1.0% - Medium
├── 2.0% - High
└── Custom - User defined
```

### ⛽ Gas Validation System

SuperSafe protects every swap with real-time gas validation:

- **Scam Detection**: Blocks transactions with gas > 50% of swap value
- **Balance Validation**: Ensures sufficient native tokens for gas
- **Real-time Monitoring**: Fetches current network gas prices
- **Button-Integrated Alerts**: Visual feedback directly on the swap button

| Alert Level | Condition | Button Action |
|-------------|-----------|---------------|
| **BLOCKING** | Insufficient gas balance | ❌ Disabled |
| **BLOCKING** | Gas > 50% of swap value | ❌ Disabled |
| **CRITICAL** | Gas anomalous or > 20% | ✅ Enabled (logged) |
| **WARNING** | Gas > 5% or high congestion | ✅ Enabled (logged) |
| **NONE** | All clear | ✅ Enabled |

See [Gas Validation System](/docs/advanced/gas-validation) for full details.

### 🛡️ Price Deviation Alerts

All swap providers include standardized price deviation warnings:

- **> 5% deviation**: High alert — "Unfavorable quote" warning
- **> 2% deviation**: Moderate alert — caution indicator
- **< 2% deviation**: Normal — no alerts

---

## Swap Interface

### Provider Tabs

Switch between providers using the tab selector at the top of the swap screen:

```
┌─────────────────────────────────────┐
│  [🦄 Uniswap] [🔗 Relay] [🐝 Bebop]│ ← Provider Tabs
│ ┌─────────────────────────────────┐ │
│ │ Slippage: 0.5% [⚙️]            │ │ ← Shared Setting
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ From Token:                     │ │
│ │ [ETH ▼] [1.0] [Max] [50%] [25%]│ │ ← Input Token
│ │ Balance: 5.2345 ETH             │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ To Token:                       │ │
│ │ [USDC ▼] [1,200] [≈$1,200]     │ │ ← Output Token
│ │ Balance: 0 USDC                 │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 💰 Price Impact: 0.1%          │ │ ← Quote Details
│ │ ⛽ Gas: Varies by provider      │ │
│ │ 💸 Partner Fee: 0.4%           │ │
│ └─────────────────────────────────┘ │
│ [🔄 Swap Tokens]                   │ ← Action Button
└─────────────────────────────────────┘
```

### Token Selection
- **Click Token Dropdown**: Opens the token selector
- **Search**: Type to search for any token
- **Balance Display**: Shows your balance for each token
- **Quick Buttons**: Max, 50%, 25% for quick amount entry

---

## Fee Summary

All swap providers apply a **0.4% total fee**:

```
Fee Structure by Provider:
├── 🦄 Uniswap:   0.2% SuperSafe + 0.2% Uniswap Labs = 0.4%
├── 🔗 Relay:     0.4% SuperSafe Partner Fee           = 0.4%
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
| Cross-chain swap slow | Bridge congestion | Check the estimated bridge time in Relay panel |

### Choosing the Right Provider

- **Standard swaps (ETH ↔ USDC, etc.)**: Use **Uniswap** for best routing and token coverage
- **Cross-chain transfers**: Use **Relay.link** to swap + bridge in one step
- **Gas-free swaps**: Use **Bebop** for zero-gas swaps on supported networks

---

## Best Practices

- **Compare providers** — Check quotes across providers for best price
- **Start with small amounts** — Test new token pairs with small swaps first
- **Watch slippage** — Use 0.5% for stable pairs, higher for volatile tokens
- **Check gas alerts** — If the swap button shows a warning, investigate before proceeding
- **Verify tokens** — Always confirm the token contract address, especially for new tokens

---

## Next Steps

Now that you can swap tokens:

1. **[Switch Networks](./network-switching.md)** - Work with different networks
2. **[Connect to dApps](../connecting-dapps/connecting.md)** - Use with dApps
3. **[Security Overview](../security/overview.md)** - Learn about security

---

**Ready to switch networks?** Continue to [Network Switching](./network-switching.md)!

**Document Status:** ✅ Current as of February 12, 2026  
**Code Version:** v3.1.8
