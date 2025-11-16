# SuperSafe Wallet - Transaction System

**Created:** October 26, 2025  
**Last Updated:** November 15, 2025  
**Version:** 3.0.0+  
**Status:** ✅ CURRENT  
**Last Code Update:** November 15, 2025

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Transaction Flow](#transaction-flow)
3. [Universal Router Support](#universal-router-support)
4. [Token Metadata System](#token-metadata-system)
5. [Supported Protocols](#supported-protocols)
6. [Security Model](#security-model)

---

## Executive Summary

SuperSafe Wallet implements a professional-grade transaction decoding system that transforms raw blockchain transactions into human-readable, user-friendly information. The system supports major DEX protocols (Uniswap V2/V3/V4, PancakeSwap Infinity, Velodrome, Aerodrome) on multiple EVM networks with a strict ‘no alternatives’ security policy.

### Key Features

- **✅ Multi-Protocol Support** - Uniswap, PancakeSwap, Velodrome, Aerodrome, and more
- **✅ Multi-Network** - Currently supports **7 active networks** (SuperSeed, Ethereum, Optimism, Base, BNB Chain, Arbitrum, Shardeum)
- **✅ Strict Security** - No fallbacks for critical parameters
- **✅ Token Metadata** - Multi-layer lookup with caching
- **✅ Universal Router** - Full command decoding and execution tracking
- **✅ Permit2 Support** - Gasless approvals with unlimited detection
- **✅ Recursive Multicall** - Batch operation breakdown

### System Metrics

```
Transaction Types Supported: 20+ types
DEX Protocols: 7 major protocols
Networks: 7 active EVM networks
Token Cache: LRU 1000 entries
Decode Success Rate: 95%+ (production)
Average Decode Time: <100ms
```

---

## Transaction Flow

### Complete Transaction Lifecycle

```mermaid
sequenceDiagram
    participant dApp
    participant Content as Content Script
    participant Provider as ProviderStreamHandler
    participant Decoder as TransactionDecoder
    participant TMS as TokenMetadataService
    participant RPC as Blockchain RPC
    participant Popup
    participant User

    dApp->>Content: eth_sendTransaction(txParams)
    Content->>Provider: Forward via stream
    Provider->>Provider: Validate network
    Provider->>Decoder: buildTransactionModalRequest(tx, context)
    
    Note over Decoder: Route to appropriate decoder
    
    alt Universal Router
        Decoder->>Decoder: Detect UR selector
        Decoder->>UniversalRouterDecoder: decode()
    else Standard Transaction
        Decoder->>Decoder: Decode based on selector
    end
    
    Decoder->>TMS: Fetch token metadata
    
    alt Tokens in Cache
        TMS-->>Decoder: Return cached metadata
    else Tokens not cached
        TMS->>RPC: Fetch symbol, decimals, name
        RPC-->>TMS: Return metadata
        TMS->>TMS: Cache for future use
        TMS-->>Decoder: Return metadata
    end
    
    Decoder->>Decoder: Format amounts with correct decimals
    Decoder->>Decoder: Build user-friendly structure
    
    alt Decode Success
        Decoder-->>Provider: Return decoded transaction
        Provider->>Popup: Create confirmation popup
        Popup->>User: Display human-readable details
        
        alt User Approves
            User->>Popup: Click "Confirm"
            Popup->>Provider: User approved
            Provider->>Provider: Sign transaction
            Provider->>RPC: Broadcast transaction
            RPC-->>Provider: Return txHash
            Provider->>dApp: Return txHash
        else User Rejects
            User->>Popup: Click "Cancel"
            Popup->>Provider: User rejected
            Provider->>dApp: Return error 4001
        end
    else Decode Failure
        Decoder-->>Provider: Throw error
        Provider->>dApp: Return error -32603
        Note over dApp,User: Transaction rejected for safety
    end
```

### Transaction Request Lifecycle

**Phase 1: Request Reception**
- dApp initiates `eth_sendTransaction` via injected provider
- Content script forwards request to background via stream
- ProviderStreamHandler receives and validates request

**Phase 2: Network Validation**
- Validate current network matches transaction chainId
- Check if dApp supports current network
- Ensure network is supported by wallet

**Phase 3: Transaction Decoding**
- Extract function selector from transaction data
- Route to appropriate decoder (Universal Router, ERC-20, etc.)
- Fetch token metadata for all involved tokens
- Format amounts with correct decimals
- Build human-readable transaction structure

**Phase 4: User Confirmation**
- Create popup with decoded transaction details
- Display origin, network, amounts, tokens, risks
- Wait for user approval or rejection

**Phase 5: Execution**
- Sign transaction with private key (background only)
- Broadcast to blockchain via RPC
- Return transaction hash to dApp

**Phase 6: Cleanup**
- Close popup
- Update transaction history
- Clean up pending request state

---

## Universal Router Support

### Overview

Universal Router is a smart contract pattern used by Uniswap and PancakeSwap to bundle multiple operations into a single transaction. It uses a command-based system where each command represents an operation.

### Command Structure

**Transaction Format:**
```javascript
{
  to: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD", // Universal Router address
  data: "0x3593564c" + "000000..." // Selector + ABI-encoded (commands, inputs, deadline)
}
```

**Decoded Structure:**
```javascript
{
  commands: "0x0b00", // Hex string of command bytes
  inputs: [
    "0x000000...", // Input for first command
    "0x000000..."  // Input for second command
  ],
  deadline: 1730000000 // Unix timestamp
}
```

### Supported Commands

| Command | Opcode | Description | Uniswap | PancakeSwap |
|---------|--------|-------------|---------|-------------|
| **V2_SWAP_EXACT_IN** | 0x08 | Uniswap V2 exact input | ✅ | ✅ |
| **V2_SWAP_EXACT_OUT** | 0x09 | Uniswap V2 exact output | ✅ | ✅ |
| **V3_SWAP_EXACT_IN** | 0x00 | Uniswap V3 exact input | ✅ | ✅ |
| **V3_SWAP_EXACT_OUT** | 0x01 | Uniswap V3 exact output | ✅ | ✅ |
| **V4_SWAP** | 0x10 | Uniswap V4 with hooks | ✅ | ❌ |
| **INFI_SWAP** | 0x10 | PancakeSwap Infinity CL | ❌ | ✅ |
| **WRAP_ETH** | 0x0b | Wrap native token | ✅ | ✅ |
| **UNWRAP_WETH** | 0x0c | Unwrap WETH | ✅ | ✅ |
| **PERMIT2_PERMIT** | 0x0a | Gasless approval | ✅ | ✅ |
| **SWEEP** | 0x04 | Collect tokens | ✅ | ✅ |
| **TRANSFER** | 0x05 | Transfer tokens | ✅ | ✅ |
| **PAY_PORTION** | 0x06 | Pay portion of balance | ✅ | ✅ |

### Context-Aware Opcode Interpretation

**Challenge:** Opcode `0x10` is overloaded - it means V4_SWAP for Uniswap and INFI_SWAP for PancakeSwap.

**Solution:** Router address detection

```javascript
// Detect PancakeSwap by router address
const PANCAKE_ROUTERS = [
  '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4', // PancakeSwap UR (Base)
  '0xd9C500DfF816a1Da21A48A732d3498Bf09dc9AEB'  // PancakeSwap UR (BSC)
];

const isPancakeSwap = PANCAKE_ROUTERS.includes(to.toLowerCase());

if (opcode === 0x10) {
  if (isPancakeSwap) {
    return 'INFI_SWAP'; // PancakeSwap Infinity
  } else {
    return 'V4_SWAP';   // Uniswap V4
  }
}
```

### Universal Router Decoding Flow

```mermaid
flowchart TD
    Start[Transaction Data] --> CheckSelector{Is Universal<br/>Router selector?}
    CheckSelector -->|No| StandardDecode[Standard Decoder]
    CheckSelector -->|Yes| ExtractCommands[Extract commands<br/>and inputs]
    
    ExtractCommands --> CheckRouter{Check router<br/>address}
    CheckRouter -->|PancakeSwap| DelegatePancake[Delegate to<br/>PancakeSwap Decoder]
    CheckRouter -->|Uniswap| ProcessCommands[Process Commands]
    
    DelegatePancake --> ParseActions[Parse INFI_SWAP<br/>actions & params]
    ParseActions --> ExtractTokens[Extract tokens<br/>heuristically]
    ExtractTokens --> MergeResults
    
    ProcessCommands --> IterateCommands{For each<br/>command}
    IterateCommands --> DecodeCommand[Decode command<br/>with ABI]
    DecodeCommand --> ExtractPath[Extract token path]
    ExtractPath --> FetchMetadata[Fetch token metadata]
    FetchMetadata --> FormatAmounts[Format amounts]
    FormatAmounts --> IterateCommands
    
    IterateCommands -->|Done| MergeResults[Merge all<br/>decoded commands]
    MergeResults --> BuildResult[Build user-friendly<br/>result structure]
    BuildResult --> End[Return decoded<br/>transaction]
    
    StandardDecode --> End
```

### V3 Swap Path Decoding

**Challenge:** Uniswap V3 encodes path as `token0 + fee + token1 + fee + token2...`

**Structure:**
```
0x + [20 bytes token0] + [3 bytes fee] + [20 bytes token1] + [3 bytes fee] + [20 bytes token2]
```

**Decoding Algorithm:**
```javascript
function decodePath(encodedPath) {
  const path = [];
  const fees = [];
  
  let offset = 0;
  while (offset < encodedPath.length) {
    // Extract token address (20 bytes)
    const token = '0x' + encodedPath.slice(offset, offset + 40);
    path.push(token);
    offset += 40;
    
    // Extract fee tier (3 bytes) if not last token
    if (offset < encodedPath.length) {
      const feeHex = encodedPath.slice(offset, offset + 6);
      const fee = parseInt(feeHex, 16);
      fees.push(fee);
      offset += 6;
    }
  }
  
  return { path, fees };
}
```

**Fee Tier Display:**
- `500` → 0.05%
- `3000` → 0.3%
- `10000` → 1%

### PancakeSwap Infinity Decoding

**Challenge:** PancakeSwap Infinity uses a different structure for concentrated liquidity swaps.

**Approach:** Heuristic-based decoding

**Strategy:**
1. **Detect swap direction** - Native (BNB) vs ERC-20 input
2. **Extract amountIn** - From tx.value or by scanning params for large uint256 values
3. **Find tokenOut** - Via sweep pattern or known addresses (USDT, WBNB)
4. **Calculate amountOutMin** - Word immediately following amountIn in params

**Example:**
```javascript
// Input: BNB → USDT swap
const amountIn = BigInt(tx.value); // 0.001 BNB
const tokenIn = 'NATIVE_BNB';

// Scan params for USDT address or sweep pattern
const tokenOut = '0x55d398326f99059fF775485246999027B3197955'; // USDT BSC

// Find amountOutMin by word position
const words = getWords32(params[0]);
const amountOutMinIndex = words.indexOf(amountIn) + 1;
const amountOutMin = words[amountOutMinIndex]; // 1.10 USDT (in Wei)
```

---

## Token Metadata System

### Overview

The TokenMetadataService is the central authority for all token information (symbol, decimals, name). It implements a strict "no fallbacks" policy to ensure user safety.

### Architecture

```mermaid
flowchart LR
    Decoder[Transaction Decoder] --> TMS[TokenMetadataService]
    TMS --> Cache{Check Cache}
    Cache -->|Hit| ReturnCached[Return Cached<br/>Metadata]
    Cache -->|Miss| CheckBebop{Check Bebop<br/>Database}
    CheckBebop -->|Found| UpdateCache1[Update Cache]
    CheckBebop -->|Not Found| OnChainRPC[On-Chain RPC<br/>Calls]
    OnChainRPC -->|Success| UpdateCache2[Update Cache]
    OnChainRPC -->|Failure| ThrowError[Throw Error<br/>NO FALLBACK]
    UpdateCache1 --> ReturnCached
    UpdateCache2 --> ReturnCached
    ThrowError --> RejectTx[Reject Transaction]
```

### Multi-Layer Lookup Strategy

**Layer 1: LRU Cache (Fastest)**
- **Capacity:** 1000 entries
- **Key:** `chainId + address` (lowercase)
- **Eviction:** Least Recently Used
- **Hit Rate:** ~90% for active trading
- **Latency:** <1ms

**Layer 2: BebopTokenService (Fast)**
- **Source:** Local token database
- **Coverage:** Major tokens on supported networks
- **Latency:** ~5ms
- **Fallback:** On-chain RPC if not found

**Layer 3: On-Chain RPC (Slow)**
- **Method:** Direct smart contract calls
- **Functions:** `token.symbol()`, `token.decimals()`, `token.name()`
- **Latency:** 50-500ms depending on RPC
- **Validation:** Strict type and range checks

### Caching Strategy

**Cache Key Format:**
```javascript
const cacheKey = `${chainId}:${address.toLowerCase()}`;
// Example: "56:0x55d398326f99059ff775485246999027b3197955"
```

**Cache Entry:**
```javascript
{
  symbol: "USDT",
  decimals: 18,
  name: "Tether USD",
  address: "0x55d398326f99059fF775485246999027B3197955"
}
```

**Cache Invalidation:**
- No time-based expiration (token metadata doesn't change)
- Only evicted when cache is full (LRU)
- Separate caches per chainId (same address, different token on different chains)

### Request Deduplication

**Problem:** Multiple decoders might request same token metadata simultaneously

**Solution:** Request tracking with Promise sharing

```javascript
class TokenMetadataService {
  constructor() {
    this.cache = new Map(); // LRU cache
    this.pendingRequests = new Map(); // Prevent duplicate RPC calls
  }
  
  async getTokenMetadata(address, chainId, provider) {
    const cacheKey = `${chainId}:${address.toLowerCase()}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // Check if request already in flight
    if (this.pendingRequests.has(cacheKey)) {
      return await this.pendingRequests.get(cacheKey);
    }
    
    // Create new request
    const requestPromise = this._fetchMetadata(address, chainId, provider);
    this.pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const metadata = await requestPromise;
      this.cache.set(cacheKey, metadata);
      return metadata;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }
}
```

### Batch Token Fetching

**Problem:** Universal Router swaps involve multiple tokens (path)

**Solution:** Batch fetching with parallel requests

```javascript
async batchGetTokenMetadata(addresses, chainId, provider) {
  const promises = addresses.map(address => 
    this.getTokenMetadata(address, chainId, provider)
  );
  
  return await Promise.all(promises);
}
```

**Benefits:**
- Parallel RPC calls for uncached tokens
- Shared cache across batch
- Single error point for missing tokens

### Strict Validation

**No Fallbacks Policy:**

```javascript
// ✅ CORRECT - Throws error if metadata unavailable
if (!symbol || !decimals || decimals < 0 || decimals > 18) {
  throw new Error(
    `Cannot fetch token metadata for ${address} on chain ${chainId}. ` +
    `This token may not be a valid ERC-20, or RPC is unavailable.`
  );
}

// ❌ NEVER DO THIS - Dangerous fallback
const decimals = metadata?.decimals || 18; // WRONG!
const symbol = metadata?.symbol || 'Unknown'; // WRONG!
```

**Validation Rules:**
- Symbol must be non-empty string
- Decimals must be 0-18 (ERC-20 standard)
- Address must be valid Ethereum address
- ChainId must be supported network

**Error Handling:**
- If metadata fetch fails → Throw error
- Transaction decode fails → Show error to user
- User sees: "Cannot decode transaction safely: Invalid token at 0x..."

---

## Supported Protocols

### Protocol Support Matrix

| Protocol | Network(s) | Function Selectors | Features |
|----------|------------|-------------------|----------|
| **Uniswap V2** | ETH, BSC | `0x38ed1739` (swapExactTokensForTokens)<br/>`0x7ff36ab5` (swapExactETHForTokens)<br/>`0x18cbafe5` (swapExactTokensForETH) | - Full path decoding<br/>- Multi-hop support<br/>- Slippage calculation |
| **Uniswap V3** | ETH, OPT, BASE | `0x414bf389` (exactInputSingle)<br/>`0xc04b8d59` (exactInput) | - Fee tier display<br/>- Encoded path parsing<br/>- Pool identification |
| **Uniswap V4** | ETH, OPT, BASE | `0x24856bc3` (UR cmd 0x10) | - Hook support<br/>- Actions decoding<br/>- Advanced routing |
| **Universal Router** | ETH, OPT, BASE, BSC | `0x24856bc3` (execute)<br/>`0x3593564c` (execute) | - Multi-command bundles<br/>- Permit2 integration<br/>- Recursive multicall |
| **PancakeSwap V2** | BSC | `0x38ed1739` | - Similar to Uniswap V2 |
| **PancakeSwap V3** | BSC | `0x414bf389`<br/>`0xc04b8d59` | - Similar to Uniswap V3 |
| **PancakeSwap Infinity** | BSC | `0x3593564c` (UR cmd 0x10) | - Heuristic decoding<br/>- CL swaps<br/>- Native + ERC-20 inputs |
| **Velodrome** | Optimism | Custom | - Stable/volatile pools<br/>- Gauge integration |
| **Aerodrome** | Base | Custom | - Similar to Velodrome |
| **ERC-20** | All networks | `0x095ea7b3` (approve)<br/>`0xa9059cbb` (transfer)<br/>`0x39509351` (increaseAllowance)<br/>`0xa457c2d7` (decreaseAllowance)<br/>`0xd505accf` (permit EIP-2612) | - Token metadata<br/>- Unlimited approval detection<br/>- Deadline display |
| **WETH** | All networks | `0xd0e30db0` (deposit/wrap)<br/>`0x2e1a7d4d` (withdraw/unwrap) | - Native ↔ Wrapped conversion |
| **Permit2** | All networks | `0x30f28b7a` (permit) | - Single token approvals<br/>- Batch approvals<br/>- Unlimited detection<br/>- Expiration display |
| **ERC-721** | All networks | `0x42842e0e` (safeTransferFrom)<br/>`0xb88d4fde` (safeTransferFrom with data)<br/>`0xa22cb465` (setApprovalForAll) | - NFT transfers<br/>- Operator approvals |
| **ERC-1155** | All networks | `0xf242432a` (safeTransferFrom)<br/>`0x2eb2c2d6` (safeBatchTransferFrom)<br/>`0xa22cb465` (setApprovalForAll) | - Multi-token transfers<br/>- Batch operations |

### Network Support Matrix

| Network | Chain ID | DEXes Supported | Status |
|---------|----------|-----------------|--------|
| **SuperSeed** | 5330 | Bebop (JAM), Uniswap V2/V3 (via Universal Router) | ✅ Active |
| **Ethereum** | 1 | Uniswap V2/V3/V4, Universal Router, 1inch | ✅ Active |
| **Optimism** | 10 | Uniswap V3, Universal Router, Velodrome | ✅ Active |
| **Base** | 8453 | Uniswap V3, Universal Router, Aerodrome | ✅ Active |
| **BNB Chain** | 56 | PancakeSwap V2/V3/Infinity, Universal Router | ✅ Active |
| **Arbitrum One** | 42161 | Uniswap V2/V3, Universal Router | ✅ Active |
| **Shardeum** | 8118 | Limited DEX support (transaction decoding available) | ✅ Active |

**Note:** Transaction decoding is available on all 7 active networks. DEX protocol support varies by network based on available liquidity and protocol deployments.

### Future Protocol Roadmap

**Q1 2026:**
- Curve Finance support
- Balancer V2 support
- Enhanced 1inch aggregator decoding

**Q2 2026:**
- 0x Protocol support
- CoW Swap support
- Paraswap aggregator

**Q3 2026:**
- Polygon network support
- Avalanche network support
- Additional DEX protocol integrations

---

## Security Model

### "No Fallbacks" Policy

**Core Principle:** Never use default or guessed values for critical transaction parameters in signing contexts.

**Rationale:**
- Better to show an error than incorrect amounts/tokens to user
- Prevents user from signing transactions with wrong information
- Eliminates risk of signing on wrong network or with wrong tokens
- Maintains user trust through transparency

### Security Validation Layers

```mermaid
flowchart TD
    Start[Transaction Request] --> ValidateNetwork{Network<br/>Supported?}
    ValidateNetwork -->|No| RejectNetwork[Reject: Network<br/>not supported]
    ValidateNetwork -->|Yes| ValidateSelector{Function<br/>Selector Known?}
    ValidateSelector -->|No| GenericDecode[Generic decode<br/>with warnings]
    ValidateSelector -->|Yes| DecodeFunction[Decode function<br/>with ABI]
    DecodeFunction --> ValidateTokens{All tokens<br/>resolvable?}
    ValidateTokens -->|No| RejectTokens[Reject: Cannot<br/>fetch token metadata]
    ValidateTokens -->|Yes| ValidateAmounts{Amounts<br/>valid?}
    ValidateAmounts -->|No| RejectAmounts[Reject: Invalid<br/>amount format]
    ValidateAmounts -->|Yes| ValidateRecipient{Recipient<br/>address valid?}
    ValidateRecipient -->|No| RejectRecipient[Reject: Invalid<br/>recipient]
    ValidateRecipient -->|Yes| BuildModal[Build user-friendly<br/>confirmation modal]
    BuildModal --> ShowToUser[Show to user<br/>for approval]
    
    RejectNetwork --> End[Return error<br/>to dApp]
    GenericDecode --> ShowToUser
    RejectTokens --> End
    RejectAmounts --> End
    RejectRecipient --> End
```

### Anti-Patterns to Avoid

**1. Defaulting to 18 Decimals**
```javascript
// ❌ WRONG - Could display 1000x incorrect amount
const decimals = token.decimals || 18;
const formatted = ethers.formatUnits(amount, decimals);

// ✅ CORRECT - Throws error if decimals unavailable
const metadata = await tokenMetadataService.getTokenMetadata(token, chainId, provider);
const formatted = ethers.formatUnits(amount, metadata.decimals);
```

**2. Using "Unknown" as Symbol**
```javascript
// ❌ WRONG - Confuses user
const symbol = token.symbol || 'Unknown';
const display = `${amount} ${symbol}`; // "0.5 Unknown" is meaningless

// ✅ CORRECT - Don't display if unknown
if (!token.symbol) {
  throw new Error(`Cannot resolve token at ${token.address}`);
}
const display = `${amount} ${token.symbol}`;
```

**3. Guessing Token Addresses**
```javascript
// ❌ WRONG - Could use wrong token
const wethAddress = chainId === 1 ? '0xC02a...' : '0xguess...';

// ✅ CORRECT - Use known addresses or fail
const wethAddress = KNOWN_WETH_ADDRESSES[chainId];
if (!wethAddress) {
  throw new Error(`WETH address not configured for chain ${chainId}`);
}
```

**4. Silently Failing Metadata Fetches**
```javascript
// ❌ WRONG - Transaction proceeds with incomplete data
try {
  const metadata = await fetchMetadata(token);
} catch (error) {
  console.warn('Could not fetch metadata, continuing anyway');
  // Dangerous! User might sign incorrect transaction
}

// ✅ CORRECT - Fail transaction if metadata unavailable
const metadata = await fetchMetadata(token); // Let error propagate
```

### Attack Prevention

**Phishing Protection:**
- Always display origin (dApp URL) in confirmation popup
- Show network name and chainId
- Highlight mismatches between expected and actual networks

**Network Mismatch Protection:**
- Validate transaction chainId matches wallet's current network
- Reject if dApp declares supported networks and current network not in list
- Clear error messages for network mismatches

**Unlimited Approval Detection:**
```javascript
// Detect MAX_UINT256 or MAX_UINT160 approvals
const MAX_UINT256 = BigInt('2') ** BigInt('256') - BigInt('1');
const MAX_UINT160 = BigInt('2') ** BigInt('160') - BigInt('1');

if (amount >= MAX_UINT256 * BigInt('99') / BigInt('100') || 
    amount >= MAX_UINT160 * BigInt('99') / BigInt('100')) {
  // Show prominent warning
  badges.push('⚠️ UNLIMITED APPROVAL');
  risks.push('This grants unlimited access to your tokens');
}
```

**Replay Attack Protection:**
- Include chainId in all signing operations
- Validate nonces for Permit2 and EIP-712 signatures
- Display deadline/expiration prominently

### User Safety Features

**Clear Warnings:**
- Unlimited approvals highlighted in yellow/red
- Unknown contracts flagged
- Large amount transfers require confirmation
- Network switches show "from" and "to" networks

**Transaction Breakdown:**
- Multi-step transactions shown as numbered list
- Each step decoded independently
- Failed decodes marked with warnings
- Total impact summarized at top

**Risk Assessment:**
```javascript
const risks = [];

// Check for unlimited approvals
if (isUnlimitedApproval(amount)) {
  risks.push('Unlimited approval - spender can use any amount of your tokens');
}

// Check for unknown contracts
if (!isKnownContract(to)) {
  risks.push('Unknown contract - verify the contract address before proceeding');
}

// Check for large amounts
if (valueInUSD > 10000) {
  risks.push(`Large transaction value: $${valueInUSD.toLocaleString()}`);
}

// Display all risks prominently in UI
```

---

## Implementation Notes

### Code Organization

```
src/background/
├── decoders/
│   ├── TransactionDecoder.js              # Main orchestrator
│   ├── UniversalRouterDecoder.js          # Universal Router (Uniswap)
│   └── UniversalRouterDecoderPancake.js   # PancakeSwap Infinity
├── services/
│   └── TokenMetadataService.js            # Token metadata management
├── abis/
│   ├── erc20.json                         # ERC-20 standard
│   ├── erc721.json                        # NFT standard
│   ├── erc1155.json                       # Multi-token standard
│   ├── weth9.json                         # WETH interface
│   ├── uniswapV2Router.json              # Uniswap V2
│   ├── uniswapV3Router.json              # Uniswap V3
│   ├── uniswapUniversalRouter.json       # Universal Router
│   ├── permit2.json                       # Permit2 approvals
│   ├── velodromeRouter.json              # Velodrome
│   ├── aerodromeRouter.json              # Aerodrome
│   └── pancakeSwapRouter.json            # PancakeSwap
└── utils/
    └── addressBook.js                     # Known contract addresses
```

### Performance Optimization

**Caching Strategy:**
- LRU cache prevents memory bloat
- Cache key includes chainId to avoid cross-chain collisions
- No time-based expiration (token metadata is immutable)

**Batch Processing:**
- Parallel token metadata fetches
- Request deduplication prevents redundant RPC calls
- Shared cache across batch reduces redundant lookups

**Lazy Loading:**
- ABIs loaded on demand
- Decoders initialized only when needed
- Provider created per transaction to avoid stale connections

**Error Recovery:**
- Graceful degradation for unknown transactions
- Partial decode with warnings better than no decode
- Clear error messages guide user to resolution

---

**Document Status:** ✅ Complete and Current  
**Last Updated:** November 15, 2025  
**Version:** 3.0.0+  
**Last Code Update:** November 15, 2025  
**Maintenance:** Review after transaction decoder changes or new protocol integrations

