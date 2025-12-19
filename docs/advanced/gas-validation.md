---
sidebar_position: 10
---

# ⛽ Gas Validation System

SuperSafe Wallet implements a comprehensive gas validation system that protects users from malicious transactions, scams, and uneconomical swaps.

## Overview

The gas validation system provides real-time protection by:

- **💰 Insufficient Balance Detection**: Ensures users have enough native tokens to pay gas fees
- **🚨 Scam Detection**: Identifies malicious contracts with abnormally high gas costs
- **📊 Network Congestion Awareness**: Warns users about high network congestion
- **⚠️ Uneconomical Swap Prevention**: Alerts when gas fees exceed reasonable percentages of swap value

### Key Features

- **✅ Real-time Gas Monitoring**: Fetches current network gas prices via Moralis RPC
- **✅ Dual Validation**: Compares network gas vs quote gas to detect anomalies
- **✅ Multi-Network Support**: Network-specific thresholds for 6 EVM chains
- **✅ Progressive Alerts**: 5-level alert system (NONE → BLOCKING)
- **✅ Button-Integrated UI**: Alerts shown directly on swap button
- **✅ Automatic Blocking**: Disables swap when insufficient balance or gas > 50% of value

---

## Alert Levels

The gas validation system uses a 5-level alert system:

| Level | Condition | Button Action |
|-------|-----------|---------------|
| **BLOCKING** | Insufficient balance for gas | ❌ Button Disabled |
| **BLOCKING** | Gas > 50% of swap value (scam indicator) | ❌ Button Disabled |
| **CRITICAL** | Gas anomalous or > 20% of value | ✅ Enabled (logged warning) |
| **WARNING** | Gas > 5% or high network congestion | ✅ Enabled (logged warning) |
| **INFO** | Moderate network congestion | ✅ Enabled (logged info) |
| **NONE** | All clear | ✅ Enabled |

:::tip
Only **BLOCKING** level alerts disable the swap button and change the button text. Lower levels are logged but don't interrupt your swap flow.
:::

---

## Gas Price Thresholds

Based on Q4 2025 market data from official explorers and wallet providers:

| Network | Low | Medium | High | Extreme |
|---------|-----|--------|------|---------|
| **Ethereum** | 5 Gwei | 20 Gwei | 60 Gwei | 120 Gwei |
| **Optimism** | 0.001 Gwei | 0.01 Gwei | 0.1 Gwei | 0.5 Gwei |
| **Arbitrum** | 0.01 Gwei | 0.1 Gwei | 1 Gwei | 5 Gwei |
| **Base** | 0.001 Gwei | 0.01 Gwei | 0.1 Gwei | 0.5 Gwei |
| **BSC** | 0.05 Gwei | 0.5 Gwei | 2 Gwei | 5 Gwei |
| **SuperSeed** | 0.001 Gwei | 0.01 Gwei | 0.1 Gwei | 0.5 Gwei |

:::info
These thresholds are updated quarterly based on current market conditions.
:::

---

## How It Works

### Three-Layer Validation

#### 1. Balance Validation

Ensures you can afford gas + swap value:

```
For native token swaps (ETH, BNB, etc.):
  totalNeeded = gasEstimate + swapValue
  
For ERC20 swaps:
  totalNeeded = gasEstimate only (swap value is ERC20)
  
If userBalance < totalNeeded:
  → BLOCKING: "Insufficient ETH for Gas"
```

#### 2. Gas Price Analysis (Scam Detection)

Compares the gas price in the quote against current network prices:

- Calculates implied gas price from swap quote
- Fetches current network gas price from Moralis RPC
- Flags **anomalous** prices (significantly higher than network average)

```
If quote gas price >> network gas price:
  → Possible scam contract detected
```

#### 3. Percentage Analysis

Ensures gas cost is economical relative to swap value:

| Gas % of Swap Value | Alert Level |
|---------------------|-------------|
| > 50% | **BLOCKING** - "Gas Fee Too High - Possible Scam" |
| > 20% | **CRITICAL** - Strong warning |
| > 5% | **WARNING** - Gas fee notice |
| ≤ 5% | **NONE** - All clear |

---

## Coverage

### Protected Transactions

The gas validation system protects you across:

- **Internal Swaps**: BebopSwapPanel, RelaySwapPanel
- **External dApp Transactions**: Any `eth_sendTransaction` from dApps (Uniswap, PancakeSwap, Velodrome, etc.)
- **Token Approvals**: ERC20 approve calls
- **NFT Mints**: ERC-721, ERC-1155 operations
- **Complex Interactions**: Multicall, batch operations
- **Native Transfers**: ETH, BNB, etc.

### Not Covered (No Gas Needed)

- `personal_sign` - Off-chain signatures
- `eth_signTypedData` - Off-chain typed data
- Permit2 signatures - Gasless approvals

---

## User Interface

### Swap Panel

When gas validation detects an issue, the swap button reflects the alert:

- **Normal**: "Swap" or "Confirm Swap" (green, enabled)
- **Insufficient Gas**: "Insufficient ETH for Gas" (red, disabled)
- **Scam Detected**: "Gas Fee Too High - Possible Scam" (red, disabled)

### Transaction Confirmation Screen

For dApp transactions, the gas section shows:

- **Color-coded background**: Red (BLOCKING), Orange (CRITICAL), Yellow (WARNING)
- **Expandable details**: Network gas price, transaction gas price, congestion level
- **Automatic button blocking**: Unsafe transactions are blocked

---

## Frequently Asked Questions

### Why is my swap blocked?

Your swap may be blocked if:
1. **Insufficient balance**: You don't have enough native tokens (ETH, BNB, etc.) to pay gas fees
2. **Scam detection**: The gas cost is more than 50% of your swap value, indicating a potentially malicious contract

### How do I fix "Insufficient ETH for Gas"?

Ensure you have enough native tokens in your wallet to cover gas fees. The exact amount needed is shown in the error details.

### What if I'm sure it's not a scam?

If you believe the transaction is legitimate but gas validation is blocking it:
1. Check if network congestion is unusually high
2. Wait for gas prices to normalize
3. Try a smaller swap amount

:::warning
SuperSafe blocks transactions with gas > 50% of swap value for your protection. This threshold cannot be bypassed.
:::

---

## Technical Details

For developers, the gas validation system consists of:

- **Backend Service**: `GasPriceService.js` - Fetches and caches gas prices
- **Stream Handler**: `GasStreamHandler.js` - Validates balance and provides gas data
- **Frontend Utility**: `gasMonitor.js` - Performs comprehensive validation
- **Configuration**: `gasConstants.js` - Network-specific thresholds

---

**Document Status**: ✅ Current  
**Version**: v3.1.4  
**Last Updated**: December 18, 2025
