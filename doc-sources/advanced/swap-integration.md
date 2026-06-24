---
sidebar_position: 4
---

# 🔄 Swap Integration

SuperSafe Wallet integrates **four major swap providers**: **Uniswap** for same-chain DEX swaps, **Relay.link** for cross-chain bridge + swap routes, **Khalani / HyperStream** for cross-chain intent routes, and **Bebop** for gasless same-chain swaps with MEV protection.

## Swap Overview

### Key Features

- **✅ Uniswap Integration**: Native DEX swaps on Ethereum, Optimism, Base, and Arbitrum.
- **✅ Relay.link Integration**: Cross-chain swap + bridge routes across 85+ blockchains.
- **✅ Khalani / HyperStream Integration**: Cross-chain intent routes with quote expiry and order lifecycle tracking.
- **✅ Gasless Swaps**: Same-chain gasless swaps via Bebop Permit2 orders.
- **✅ MEV Protection**: Protected same-chain execution via Bebop.
- **✅ Partner Fees**: 0.4% for Bebop/Relay, 0.2% + 0.2% Uniswap Labs for Uniswap, and shared SuperSafe fee configuration for Khalani when referrer fees are available.
- **✅ Background Signing Boundary**: Swap execution that needs keys is delegated to the background service worker.

---

## Swap Provider Comparison

| Feature | Uniswap | Relay.link | Khalani | Bebop |
|---------|---------|------------|---------|-------|
| Same-chain swaps | Yes | Yes | Route-dependent | Yes |
| Cross-chain swaps | No | Yes | Yes | No |
| Intent routing | No | No | Yes | Yes, for Bebop orders |
| Gasless swap execution | UniswapX only | No | No, source-chain deposit required | Yes after approval |
| Order lifecycle tracking | Yes | Yes | Yes | Yes |
| Best use case | Same-chain DEX routing | Bridge + swap | Cross-chain intent routes | Gasless MEV-protected swaps |

---

## Unified Panel Architecture

**Version:** 3.1.8 + Khalani / HyperStream integration  
**Current provider count:** 4

SuperSafe implements a unified panel architecture for swap providers, keeping provider selection and shared controls in the container while each provider owns its quote, execution, and status logic.

```text
Swap.jsx (~115 lines)                    # Container/Orchestrator
  ├─ SwapProviderSelector                # Tab selector (Uniswap | Relay | Khalani | Bebop)
  ├─ SlippageControl (shared)            # Slippage configuration
  └─ Conditional Rendering:
      ├─ UniswapSwapPanel.jsx            # UniswapX + Classic routing
      ├─ RelaySwapPanel.jsx              # Cross-chain bridge + swap
      ├─ KhalaniSwapPanel.jsx            # HyperStream intent routing
      └─ BebopSwapPanel.jsx              # Bebop JAM gasless swaps
```

### Container Responsibilities

```javascript
const Swap = ({ 
  onTransactionComplete, 
  preselectedToken,
  onClearPreselection,
  walletTokensWithBalance,
  nativeTokenBalance 
}) => {
  const [swapProvider, setSwapProvider] = useState('uniswap');
  const [slippage, setSlippage] = useState(0.5);
  
  return (
    <>
      <SwapProviderSelector selected={swapProvider} onChange={setSwapProvider} />
      <SlippageControl slippage={slippage} onChange={setSlippage} />
      
      {swapProvider === 'uniswap' ? (
        <UniswapSwapPanel {...props} slippage={slippage} />
      ) : swapProvider === 'relay' ? (
        <RelaySwapPanel {...props} slippage={slippage} />
      ) : swapProvider === 'khalani' ? (
        <KhalaniSwapPanel {...props} slippage={slippage} />
      ) : (
        <BebopSwapPanel {...props} slippage={slippage} />
      )}
    </>
  );
};
```

**Key Points:**

- Single responsibility: provider selection and routing.
- No swap business logic in the container.
- Shared slippage state.
- Provider panels remain independently testable.
- Private-key operations stay in the background context.

### Provider Panels

| Panel | Responsibility | Background Adapter / Handler |
|-------|----------------|------------------------------|
| `UniswapSwapPanel.jsx` | UniswapX and Classic same-chain routing | Uniswap adapter + secure proxy |
| `RelaySwapPanel.jsx` | Cross-chain bridge + swap routing | `RelayAdapter` / Relay stream handler |
| `KhalaniSwapPanel.jsx` | HyperStream route discovery, route selection, deposit execution, order tracking | `KhalaniAdapter` / `KhalaniStreamHandler` |
| `BebopSwapPanel.jsx` | Bebop JAM gasless same-chain orders | `SwapAdapter` / `SwapStreamHandler` |

### Shared Components (`src/components/swap/`)

| Component | Purpose | Used By |
|-----------|---------|---------|
| `CompactNetworkSelector.jsx` | Network dropdown | Relay, Khalani |
| `RouteVisualization.jsx` | Visual route display | Relay, Khalani where route data is available |
| `BridgeTimeDisplay.jsx` | Bridge time estimation | Relay |
| `GasEstimateDisplay.jsx` | Gas cost display | Relay and other transaction-backed swaps |
| `UniswapApprovalConfirmation.jsx` | Approval consent modal | Uniswap |
| `LoadingDots.jsx` | Loading animation | All panels |

---

## Khalani / HyperStream Integration

### Overview

Khalani is integrated as a cross-chain intent-routing provider powered by HyperStream. It lets users select a source token, destination network, destination token, and amount. HyperStream returns executable routes, and SuperSafe tracks the resulting order until it is filled, refunded, or failed.

### Key Features

- Cross-chain intent routing through HyperStream.
- Multiple route support when HyperStream returns alternatives.
- Route sorting that prioritizes executable `CONTRACT_CALL` routes, sufficient quote lifetime, best output amount, and shorter expected duration.
- Quote expiry handling to prevent users from executing stale routes.
- Order lifecycle tracking after deposit submission.
- Shared SuperSafe fee configuration when referrer fees are available.
- Background-only execution: the popup delegates to the background stream handler; private keys never leave the background service worker.

### Supported Networks

| Network | Chain ID | Khalani / HyperStream |
|---------|----------|------------------------|
| Ethereum | 1 | Active |
| Optimism | 10 | Active |
| BNB Chain | 56 | Active |
| Base | 8453 | Active |
| Arbitrum One | 42161 | Active |
| Monad | 143 | Active |
| SuperSeed | 5330 | Disabled |
| U2U | 39 | Disabled |

Khalani is enabled per network through the `khalani` key in `src/config/networks.config.js`:

```javascript
khalani: {
  enabled: true,
  hyperstreamChainId: 8453,
  displayName: 'Base',
  crossChainEnabled: true
}
```

### How Khalani Swaps Work

1. The user selects the source token on the active wallet network.
2. The user selects the destination network and destination token.
3. SuperSafe requests an `EXACT_INPUT` quote from HyperStream.
4. HyperStream returns one or more executable routes.
5. The user confirms the selected route.
6. SuperSafe asks HyperStream to build the deposit actions.
7. The background service worker validates every returned EIP-1193 action before executing it.
8. SuperSafe submits the deposit transaction hash to HyperStream.
9. SuperSafe polls the order until it reaches a terminal status such as filled, refunded, or failed.

### Security Model

SuperSafe executes Khalani routes only through the background context. Returned EIP-1193 actions are validated before execution:

- `wallet_switchEthereumChain` must target the expected source chain.
- `eth_sendTransaction.from` must match the active wallet.
- Transaction `chainId` must match the source chain.
- Transaction `to` must be a valid EVM address.
- Unsupported action types fail closed.
- MVP execution is scoped to EVM `CONTRACT_CALL` deposit routes.

### HyperStream Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /v1/tokens?chainIds=...` | Token list for Khalani-supported chains |
| `POST /v1/quotes` | Route discovery and pricing |
| `POST /v1/deposit/build` | Build ordered wallet actions for a selected route |
| `PUT /v1/deposit/submit` | Register deposit transaction hash and create/order reconcile |
| `GET /v1/orders/by-id/{orderId}` | Poll order lifecycle status |

Default API base URL: `https://api.hyperstream.dev`.

Environment overrides:

- **Background**: `KHALANI_HYPERSTREAM_API_BASE_URL` or `HYPERSTREAM_API_BASE_URL`
- **Frontend token list**: `VITE_KHALANI_HYPERSTREAM_API_BASE_URL` or `VITE_HYPERSTREAM_API_BASE_URL`

Chrome extension CSP must allow `https://api.hyperstream.dev` in `connect-src`.

### MVP Limitations

- EVM-only execution.
- `CONTRACT_CALL` deposit routes only.
- No Solana actions.
- No direct `TRANSFER` or `PERMIT2` deposit execution in the first integration.
- SuperSafe does not run a Khalani/Medusa solver.
- SuperSeed and U2U remain disabled until HyperStream supports those chains.

---

## Uniswap Integration

**Networks Supported:** Ethereum (1), Optimism (10), Base (8453), Arbitrum One (42161)

SuperSafe integrates the official **Uniswap Routing API**, **Uniswap Universal Router**, and **UniswapX Dutch Order Protocol** for same-chain DEX swaps on supported networks.

### Key Features

- Native DEX access to Uniswap liquidity.
- UniswapX Dutch orders for competitive filling.
- Real-time quote API pricing.
- Curated token lists per network.
- Backend proxy for API-key protection.
- Explicit approval confirmation before ERC-20 approvals.

### Active Network Support

| Network | Chain ID | Uniswap Support | UniswapX | Status |
|---------|----------|-----------------|----------|--------|
| Ethereum | 1 | V3 + V2 | Enabled | Active |
| Optimism | 10 | V3 | Enabled | Active |
| Base | 8453 | V3 | Enabled | Active |
| Arbitrum One | 42161 | V3 | Enabled | Active |

### Uniswap Swap Flow

```text
User → UniswapSwapPanel → UniswapAdapter → Background → Uniswap Proxy → Uniswap API
```

---

## Relay.link Integration

Relay.link enables cross-chain swaps and bridge functionality across 85+ blockchains.

### Key Features

- Cross-chain swaps between different networks in one transaction.
- AppFees support using the shared SuperSafe fee configuration.
- Meta-aggregation across DEXs and bridges.
- Route visualization for bridge, swap, and approval steps.
- Dynamic bridge time estimation.

### Active Network Support

| Network | Chain ID | Relay Chain ID | Cross-Chain | Status |
|---------|----------|----------------|-------------|--------|
| SuperSeed | 5330 | 5330 | Enabled | Active |
| Ethereum | 1 | 1 | Enabled | Active |
| Optimism | 10 | 10 | Enabled | Active |
| Base | 8453 | 8453 | Enabled | Active |
| BNB Chain | 56 | 56 | Enabled | Active |
| Arbitrum One | 42161 | 42161 | Enabled | Active |

### Network Selection Architecture

Relay.link uses a restricted origin network model:

- **Origin (Pay)**: Always uses the active wallet network.
- **Destination (Receive)**: User can select any supported destination network.
- **To swap from a different network**: User must switch the active network via the app header first.

---

## Bebop Integration

Bebop provides gasless same-chain swaps through the Bebop JAM protocol with Permit2 and EIP-712 order signing.

### Active Network Support

| Network | Chain ID | Bebop API | Swap Enabled | Contracts |
|---------|----------|-----------|--------------|-----------|
| SuperSeed | 5330 | JAM v2 | Active | Custom deployment |
| Ethereum | 1 | JAM v2 + RFQ v3 | Active | Standard EVM |
| Optimism | 10 | JAM v2 + RFQ v3 | Active | Standard EVM |
| Base | 8453 | JAM v2 + RFQ v3 | Active | Standard EVM |
| BNB Chain | 56 | JAM v2 + RFQ v3 | Active | Standard EVM |
| Arbitrum One | 42161 | JAM v2 + RFQ v3 | Active | Standard EVM |

### Bebop Execution Model

1. The panel requests a JAM quote.
2. The background checks allowance and handles Permit2 approval when needed.
3. The wallet signs an EIP-712 order.
4. Bebop settles the order on-chain.
5. SuperSafe polls order status until completion.

---

## Partner Fee System

### Fee Configuration

**Location:** `src/background/utils/feeConfig.js`

```javascript
const FEE_CONFIG = {
  feeBps: 40,
  partnerInfo: {
    name: 'SuperSafe',
    receiverAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    website: 'https://supersafe.xyz'
  },
  minFeeBps: 0,
  maxFeeBps: 300
};

export function getFeeConfiguration() {
  return {
    feeBps: FEE_CONFIG.feeBps,
    partnerInfo: FEE_CONFIG.partnerInfo
  };
}
```

### Fee Usage by Provider

| Provider | Fee Behavior |
|----------|--------------|
| Uniswap | 0.2% SuperSafe + 0.2% Uniswap Labs when routed through supported fee parameters |
| Relay.link | 0.4% SuperSafe partner fee via AppFees |
| Khalani / HyperStream | Shared SuperSafe fee configuration when referrer fees are available |
| Bebop | 0.4% SuperSafe partner fee in JAM orders |

---

## Gas Validation System

SuperSafe protects swap execution with real-time gas validation:

- Real-time gas price monitoring.
- Native-token balance validation.
- Blocking alerts for insufficient gas.
- Scam detection for gas costs greater than 50% of swap value.
- Button-integrated warnings and disabled states.

:::tip Complete Documentation
For comprehensive gas validation documentation, see **[Gas Validation System](/docs/advanced/gas-validation)**.
:::

---

## Adding New Providers

To add another swap provider:

1. Create `src/components/swap/NewProviderSwapPanel.jsx`.
2. Follow the same panel boundary used by `UniswapSwapPanel.jsx`, `RelaySwapPanel.jsx`, `KhalaniSwapPanel.jsx`, or `BebopSwapPanel.jsx`.
3. Create a frontend adapter if the panel needs one.
4. Add a background stream handler for API calls or execution steps that require secure context.
5. Add the provider to `SwapProviderSelector.jsx`.
6. Add conditional rendering in `Swap.jsx`.

---

## Future Enhancements

- [x] Uniswap integration (UniswapX + Classic routing)
- [x] Khalani / HyperStream integration (cross-chain intents)
- [ ] Expand Khalani beyond EVM `CONTRACT_CALL` deposit routes when supported
- [ ] Add direct best-price comparison across providers
- [ ] Add provider-level swap history filters

---

**Document Status:** ✅ Current as of June 24, 2026  
**Code Version:** v3.1.8 + Khalani / HyperStream integration  
**Major Changes:**

- **🆕 Khalani / HyperStream Integration**: Cross-chain intent routing with route sorting, quote expiry, deposit action validation, and order lifecycle polling.
- **🆕 Unified Panel Architecture**: Four-provider architecture: Uniswap, Relay.link, Khalani / HyperStream, and Bebop.
- **🆕 Provider Comparison**: Documents all four current providers.
