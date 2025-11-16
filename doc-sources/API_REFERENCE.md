# SuperSafe Wallet - API Reference

**Created:** October 13, 2025  
**Last Updated:** November 15, 2025  
**Version:** 3.0.2+  
**Status:** ✅ CURRENT

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Stream-Based Communication](#stream-based-communication)
3. [Session API](#session-api)
4. [Provider API (EIP-1193)](#provider-api-eip-1193)
5. [Controller APIs](#controller-apis)
6. [Swap API](#swap-api)
7. [Transaction History API](#transaction-history-api)
8. [External APIs](#external-apis)
   - [Bebop API](#bebop-api)
   - [SuperSeed RPC](#superseed-rpc)
   - [SuperSafe Price API](#supersafe-price-api)
   - [API Key Rotation System](#api-key-rotation-system)
9. [Transaction Decoding APIs](#transaction-decoding-apis)
10. [Signing System APIs](#signing-system-apis)

---

## API Overview

SuperSafe Wallet uses **stream-based communication** between frontend and background via Chrome's `chrome.runtime.connect()` for long-lived connections. All APIs follow a request-response pattern with typed messages.

### Communication Pattern

```javascript
// Request format
{
  type: 'MESSAGE_TYPE',
  payload: { /* parameters */ }
}

// Response format
{
  success: boolean,
  data: any,        // On success
  error: string     // On failure
}
```

---

## Stream-Based Communication

### Stream Channels

| Channel | Purpose | Handler Location |
|---------|---------|------------------|
| `session` | Wallet & session operations | `SessionStreamHandler.js` |
| `provider` | dApp EIP-1193 requests | `ProviderStreamHandler.js` |
| `swap` | Bebop swap operations | `SwapStreamHandler.js` |
| `send` | Token transfer operations | `SendStreamHandler.js` |
| `blockchain` | Blockchain queries | `BlockchainStreamHandler.js` |
| `api` | External API calls | `ApiStreamHandler.js` |

### Usage Example

```javascript
// Frontend: Connect to stream
import { StreamConnectionManager } from './utils/NativeStreamManager.js';

// Send request
const response = await StreamConnectionManager.sendRequest('session', {
  type: 'UNLOCK',
  payload: { password: 'user_password' }
});

if (response.success) {
  console.log('Unlocked:', response.data);
} else {
  console.error('Error:', response.error);
}
```

---

## Session API

### GET_SESSION_STATE

Get complete session state snapshot.

**Request:**
```javascript
{
  type: 'GET_SESSION_STATE'
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    isUnlocked: boolean,
    hasVault: boolean,
    currentWalletIndex: number,
    currentNetworkKey: string,
    wallets: [{
      address: string,
      name: string,
      emoji: string
    }],
    currentNetwork: {
      chainId: number,
      name: string,
      rpcUrl: string
    }
  }
}
```

### UNLOCK

Unlock vault with password.

**Request:**
```javascript
{
  type: 'UNLOCK',
  payload: {
    password: string
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    wallets: Array,
    currentWalletIndex: number
  }
}
```

### CREATE_WALLET

Create new wallet.

**Request:**
```javascript
{
  type: 'CREATE_WALLET',
  payload: {
    name: string,
    emoji: string
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    address: string,
    name: string,
    emoji: string
  }
}
```

### SWITCH_WALLET

Switch to different wallet.

**Request:**
```javascript
{
  type: 'SWITCH_WALLET',
  payload: {
    index: number
  }
}
```

**Response:**
```javascript
{
  success: true
}
```

### LOCK

Lock wallet.

**Request:**
```javascript
{
  type: 'LOCK'
}
```

**Response:**
```javascript
{
  success: true
}
```

---

## Provider API (EIP-1193)

### eth_requestAccounts

Request account access (connection).

**Request:**
```javascript
window.ethereum.request({
  method: 'eth_requestAccounts'
})
```

**Response:**
```javascript
['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb']  // Array of addresses
```

**Errors:**
- `4001`: User rejected request
- `4100`: Unauthorized origin (not in allowlist)
- `4900`: Disconnected

### eth_accounts

Get currently connected accounts.

**Request:**
```javascript
window.ethereum.request({
  method: 'eth_accounts'
})
```

**Response:**
```javascript
['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb']  // Empty if not connected
```

### eth_chainId

Get current chain ID.

**Request:**
```javascript
window.ethereum.request({
  method: 'eth_chainId'
})
```

**Response:**
```javascript
'0x14d2'  // Hex string (5330 = SuperSeed)
```

### eth_sendTransaction

Send transaction.

**Request:**
```javascript
window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    to: '0x...',
    value: '0x0',
    data: '0x...',
    gas: '0x5208'
  }]
})
```

**Response:**
```javascript
'0x...'  // Transaction hash
```

---

## Signing Methods

SuperSafe Wallet supports all standard Ethereum signing methods with comprehensive security validations and professional UI screens.

### personal_sign

Sign arbitrary messages (UTF-8 or hex-encoded). Commonly used for authentication (SIWE - Sign-In with Ethereum).

**Method:** `personal_sign`  
**UI Screen:** `SigningConfirmationScreen`  
**Supported:** ✅ Full support with SIWE detection

**Request:**
```javascript
window.ethereum.request({
  method: 'personal_sign',
  params: [
    '0x48656c6c6f20576f726c64', // Message (hex or UTF-8)
    '0x...'                      // Address
  ]
})
```

**Parameter Order:** Accepts both `[message, address]` and `[address, message]` (auto-detected)

**Response:**
```javascript
'0x...'  // Signature (65 bytes)
```

**Features:**
- ✅ Automatic hex to UTF-8 decoding
- ✅ SIWE message detection with special UI
- ✅ Parameter order auto-detection
- ✅ Off-chain signature (no gas)

**Error Codes:**
- `-32602`: Invalid parameters (missing message or address)
- `4100`: Site not connected
- `4001`: User rejected the request
- `-32603`: Internal error

---

### eth_signTypedData, eth_signTypedData_v3, eth_signTypedData_v4

Sign structured data according to EIP-712. All variants (v3, v4, legacy) are supported.

**Methods:** `eth_signTypedData`, `eth_signTypedData_v3`, `eth_signTypedData_v4`  
**UI Screen:** `TypedDataConfirmationScreen`  
**Supported:** ✅ Full support for all EIP-712 versions

**Request:**
```javascript
window.ethereum.request({
  method: 'eth_signTypedData_v4',  // or v3, or legacy
  params: [
    '0x...',  // Address
    JSON.stringify({
      domain: {
        name: 'MyDApp',
        version: '1',
        chainId: 5330,
        verifyingContract: '0x...'
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' }
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' }
        ]
      },
      message: {
        from: { name: 'Alice', wallet: '0x...' },
        to: { name: 'Bob', wallet: '0x...' },
        contents: 'Hello!'
      }
    })
  ]
})
```

**Response:**
```javascript
'0x...'  // Signature (65 bytes)
```

**Features:**
- ✅ Supports v3, v4, and legacy EIP-712
- ✅ Token permit (EIP-2612) detection
- ✅ Domain verification display
- ✅ Structured data visualization
- ✅ Off-chain signature (no gas)

**Common Use Cases:**
- Token permits (EIP-2612)
- Gasless approvals
- Meta-transactions
- Message authentication

**Error Codes:**
- `-32602`: Invalid parameters or malformed JSON
- `4100`: Site not connected
- `4001`: User rejected the request
- `-32603`: Internal error

---

### eth_sendTransaction

Send a transaction (ETH transfer, token operations, contract interactions).

**Method:** `eth_sendTransaction`  
**UI Screen:** `TransactionConfirmationScreen`  
**Supported:** ✅ Full support with transaction decoding

**Request:**
```javascript
window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{
    from: '0x...',     // Required: Sender address
    to: '0x...',       // Required: Recipient or contract
    value: '0x...',    // Optional: Amount in wei (hex)
    data: '0x...',     // Optional: Contract call data
    gas: '0x...',      // Optional: Gas limit (hex)
    gasPrice: '0x...', // Optional: Gas price (hex)
  }]
})
```

**Response:**
```javascript
'0x...'  // Transaction hash
```

**Decoded Transaction Types:**

SuperSafe automatically decodes and displays transaction details for:

1. **Simple ETH Transfer** (no data)
   - UI: "Simple Transfer"
   
2. **Token Approval** (`0x095ea7b3`)
   - UI: "Spending Cap Request"
   - Displays: Spender, amount, token symbol

3. **Token Transfer** (`0xa9059cbb`)
   - UI: "Token Transfer"
   - Displays: Recipient, amount, token symbol

4. **Token TransferFrom** (`0x23b872dd`)
   - UI: "Token Transfer"

5. **Uniswap V2 Swap** (`0x38ed1739`)
   - UI: "Token Swap"
   - Displays: "Uniswap V2: Exchange tokens"

6. **Uniswap V3 Swap** (`0x414bf389`)
   - UI: "Token Swap"
   - Displays: "Uniswap V3: Exchange tokens"

7. **NFT Mint** (`0x40c10f19`, `0xa0712d68`, `0x6a627842`)
   - UI: "NFT Mint"
   - Displays: Contract name (if known)

8. **ERC-1155 Transfer** (`0xf242432a`)
   - UI: "NFT Transfer (ERC-1155)"
   - Displays: Token ID, amount, recipient

9. **Multicall** (`0xac9650d8`)
   - UI: "Batch Transaction"
   - Warning: Review each operation carefully

10. **Bebop JAM Settlement** (`0x2143d82c`)
    - UI: "JAM Settlement"

11. **Unknown Function**
    - UI: "Contract Interaction"
    - Displays: Function signature

**Features:**
- ✅ Automatic transaction decoding
- ✅ Token symbol/decimals lookup
- ✅ Address book integration
- ✅ Gas estimation
- ✅ Network validation

**Error Codes:**
- `-32602`: Invalid parameters (missing from/to)
- `4100`: Site not connected
- `4001`: User rejected the request
- `-32603`: Internal error

---

### eth_sign (⚠️ DEPRECATED - NOT SUPPORTED)

**Status:** ❌ Disabled for security

`eth_sign` is a dangerous method that was deprecated by the Ethereum community due to security risks. It allows signing arbitrary data that could be interpreted as a transaction.

**Error Response:**
```javascript
{
  error: {
    code: -32601,  // Method not found
    message: 'eth_sign is deprecated and disabled for security reasons. Please use personal_sign or eth_signTypedData instead.'
  }
}
```

**Alternatives:**
- Use `personal_sign` for simple messages
- Use `eth_signTypedData_v4` for structured data

---

## EIP-1193 Error Codes

All methods follow the EIP-1193 error code standard:

| Code | Description | When It Occurs |
|------|-------------|----------------|
| `4001` | User Rejected Request | User clicked "Cancel" on any popup |
| `4100` | Unauthorized | Site not connected to wallet |
| `4200` | Unsupported Method | Method not implemented |
| `4900` | Disconnected | Provider disconnected |
| `4902` | Unrecognized chain ID | Requested chain not added |
| `-32700` | Parse error | Invalid JSON |
| `-32600` | Invalid Request | Request format error |
| `-32601` | Method not found | Unsupported or deprecated method (e.g., `eth_sign`) |
| `-32602` | Invalid params | Missing or malformed parameters |
| `-32603` | Internal error | Internal server/wallet error |
| `-32000` | Server error | Generic server error |

**Example Error:**
```javascript
{
  error: {
    code: 4001,
    message: 'User rejected the request'
  }
}
```

---

### wallet_switchEthereumChain

Request network switch.

**Request:**
```javascript
window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0xa' }]  // 10 = Optimism
})
```

**Response:**
```javascript
null  // Success
```

**Errors:**
- `4001`: User rejected
- `4902`: Chain not added

---

## Controller APIs

### Token Controller

#### GET_TOKENS

Get token list for network and address.

**Request:**
```javascript
{
  type: 'GET_TOKENS',
  payload: {
    networkKey: 'superseed',
    address: '0x...'
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: [{
    address: '0x...',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    balance: '1000000000'  // In wei
  }]
}
```

#### ADD_CUSTOM_TOKEN

Add custom token.

**Request:**
```javascript
{
  type: 'ADD_CUSTOM_TOKEN',
  payload: {
    networkKey: 'optimism',
    token: {
      address: '0x...',
      symbol: 'TOKEN',
      name: 'Token Name',
      decimals: 18
    }
  }
}
```

### Network Controller

#### GET_CURRENT_NETWORK

Get current network configuration.

**Request:**
```javascript
{
  type: 'GET_CURRENT_NETWORK'
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    networkKey: 'superseed',
    chainId: 5330,
    name: 'SuperSeed',
    rpcUrl: 'https://mainnet.superseed.xyz'
  }
}
```

#### SWITCH_NETWORK

Switch to different network.

**Request:**
```javascript
{
  type: 'SWITCH_NETWORK',
  payload: {
    networkKey: 'optimism'
  }
}
```

---

## Swap API

### SWAP_GET_QUOTE

Get swap quote from Bebop.

**Request:**
```javascript
{
  type: 'SWAP_GET_QUOTE',
  payload: {
    sellToken: {
      address: '0x...',
      symbol: 'USDC',
      decimals: 6
    },
    buyToken: {
      address: '0x...',
      symbol: 'ETH',
      decimals: 18
    },
    sellAmount: '1000000',  // 1 USDC
    takerAddress: '0x...',
    slippage: 0.5,  // 0.5%
    chain: { name: 'superseed' }
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    quote_id: '...',
    buy_amount: '500000000000000',  // 0.0005 ETH
    sell_amount: '1000000',
    gas_estimate: '150000',
    settlement_address: '0x...',
    order: { /* EIP-712 order data */ }
  }
}
```

### SWAP_SIGN_AND_SUBMIT

Sign and submit swap order.

**Request:**
```javascript
{
  type: 'SWAP_SIGN_AND_SUBMIT',
  payload: {
    quote: { /* quote from SWAP_GET_QUOTE */ },
    takerAddress: '0x...',
    networkKey: 'superseed'
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    status: 'Pending',
    txHash: '0x...'
  }
}
```

### SWAP_CHECK_STATUS

Check order status.

**Request:**
```javascript
{
  type: 'SWAP_CHECK_STATUS',
  payload: {
    quoteId: '...',
    networkKey: 'superseed'
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    status: 'Executed',  // Pending | Executed | Failed
    txHash: '0x...'
  }
}
```

---

## Transaction History API

### Overview

SuperSafe implements a universal transaction history system that works across multiple blockchain networks. The system automatically selects the appropriate explorer API based on the network's chainId.

**See:** [MULTICHAIN_TRANSACTION_HISTORY.md](./MULTICHAIN_TRANSACTION_HISTORY.md) for complete documentation.

### API_GET_TRANSACTION_HISTORY

Get transaction history for an address on a specific network.

**Request:**
```javascript
{
  type: 'API_GET_TRANSACTION_HISTORY',
  params: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    chainId: 56,  // BSC
    limit: 10
  }
}
```

**Response:**
```javascript
{
  success: true,
  transactions: [
    {
      hash: '0x...',
      from: '0x...',
      to: '0x...',
      value: '1000000000000000000',  // 1 ETH in wei
      timestamp: 1698765432000,
      blockNumber: 12345678,
      status: 1,  // 1 = success, 0 = failed
      gasUsed: '21000',
      method: 'transfer'
    }
  ],
  totalCount: 42,
  pagination: { hasNext: true, nextPage: 2 },
  _meta: {
    source: 'moralis',  // 'blockscout' | 'moralis' | 'etherscan'
    chain: 'bsc'
  }
}
```

### API_GET_TOKEN_TRANSFERS

Get ERC-20 token transfer history for an address.

**Request:**
```javascript
{
  type: 'API_GET_TOKEN_TRANSFERS',
  params: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    chainId: 5330,  // SuperSeed
    options: {
      limit: 10,
      tokenAddress: '0x...'  // Optional: filter by token
    }
  }
}
```

**Response:**
```javascript
{
  success: true,
  transfers: [
    {
      transactionHash: '0x...',
      from: '0x...',
      to: '0x...',
      token: {
        address: '0x...',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        type: 'ERC-20'
      },
      amount: '1000000',  // 1 USDC (6 decimals)
      amountFormatted: '1.0',
      timestamp: 1698765432000,
      blockNumber: 12345678
    }
  ],
  _meta: {
    source: 'blockscout',
    requestTime: '2025-10-29T...'
  }
}
```

### API_GET_COMBINED_HISTORY

Get combined transaction and token transfer history (optimized for UI display).

**Request:**
```javascript
{
  type: 'API_GET_COMBINED_HISTORY',
  params: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    chainId: 10,  // Optimism
    options: {
      limit: 5,  // Per type (max 10 total)
      includeTransactions: true,
      includeTokenTransfers: true
    }
  }
}
```

**Response:**
```javascript
{
  success: true,
  history: [
    {
      itemType: 'transaction',  // 'transaction' | 'token_transfer'
      hash: '0x...',
      from: '0x...',
      to: '0x...',
      value: '1000000000000000000',
      timestamp: 1698765432000,
      // ... other fields
    },
    {
      itemType: 'token_transfer',
      transactionHash: '0x...',
      token: { name: 'USDC', symbol: 'USDC', ... },
      amount: '1000000',
      // ... other fields
    }
  ],
  summary: {
    transactionCount: 5,
    transferCount: 5,
    totalItems: 10,
    fetchTimeMs: 234
  }
}
```

### Supported Networks

| Network | ChainId | Explorer Type | Status |
|---------|---------|---------------|--------|
| SuperSeed | 5330 | Blockscout | ✅ |
| Optimism | 10 | Moralis | ✅ |
| Base | 8453 | Moralis | ✅ (as of Nov 14, 2025) |
| BSC | 56 | Moralis | ✅ |
| Arbitrum | 42161 | Moralis | ✅ |

---

## Token Security Filtering

### Overview

SuperSafe implements a **multi-layered security filter** for tokens retrieved from blockchain explorers (Moralis, Blockscout). This prevents display of scam, spam, and unverified tokens while ensuring legitimate tokens are always shown.

**Backend Location:** `src/background/handlers/streams/BlockchainStreamHandler.js`  
**Frontend Location:** `src/components/common/Dashboard/TokensList.jsx`

**Note:** The whitelist check is applied in BOTH backend (API response filtering) and frontend (Safe Mode UI filtering) to ensure curated tokens always display.

### Filter Criteria (Applied in Order)

#### 1. Curated Whitelist (Priority Check)

**Purpose:** Trusted tokens bypass all security checks.

Tokens in the **curated list** (`CURATED_TOKEN_LOGOS`) are pre-verified and always displayed, regardless of API flags:
- ✅ **510+ tokens** across 6 chains (Ethereum, Optimism, BSC, Base, Arbitrum, SuperSeed)
- ✅ Includes major tokens: USDC, USDT, WETH, WBTC, LINK, AAVE, etc.
- ✅ Bypasses `possible_spam`, `security_score`, and `verified_contract` checks

**Example:**
```javascript
// Token from Moralis API
{
  "token_address": "0x4200000000000000000000000000000000000006",
  "symbol": "WETH",
  "verified_contract": false,  // ❌ Would normally be filtered
  "security_score": null,       // ❌ Would normally be filtered
  "possible_spam": false
}

// ✅ PASSES: Found in curated list for chainId 8453 (Base)
// Log: "✅ Token WETH is in curated whitelist - bypassing security filters"
```

**Curated List Location:** `src/utils/curatedTokenLogos.js`

**Checking Format:**
```javascript
const curatedKey = `${chainId}:${token.token_address.toLowerCase()}`;
const isCurated = !!CURATED_TOKEN_LOGOS[curatedKey];

// Example keys:
// '8453:0x4200000000000000000000000000000000000006' - WETH on Base
// '1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'   - USDC on Ethereum
// '56:0x0000000000000000000000000000000000000000'  - BNB on BSC
```

#### 2. Spam Filter (For Non-Curated Tokens)

**Rule:** If `possible_spam === true` → **Filter out**

```javascript
// ❌ FILTERED:
{
  "symbol": "$TRUMP - Claim: t.ly/TRUMP - #1",
  "possible_spam": true,
  // ... other fields
}
```

**Log:** `🚫 Filtering out spam token: ${symbol} (possible_spam: true)`

#### 3. Security Check (For Non-Curated Tokens)

**Rule:** Filter out ONLY if **BOTH** conditions are met:
- `security_score === null`
- `verified_contract === false`

```javascript
// ❌ FILTERED (both conditions met):
{
  "symbol": "SCAMTOKEN",
  "security_score": null,
  "verified_contract": false,
  "possible_spam": false
}

// ✅ PASSES (only one condition met):
{
  "symbol": "USDT",
  "security_score": null,       // null, but...
  "verified_contract": true,    // ...contract is verified
  "possible_spam": false
}
```

**Log:** `🚫 Filtering out suspicious token: ${symbol} (security_score: null + verified_contract: false)`

**Important:** Legitimate tokens like USDT/WETH often have `security_score: null` but `verified_contract: true`, so they pass this filter.

#### 4. All Other Tokens Pass

Any token not caught by the above filters is displayed to the user.

### Filter Priority Diagram

```
┌───────────────────────────────────────────────┐
│         Token received from API               │
└─────────────────┬─────────────────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ In Curated List?   │
         └────────┬───────────┘
                  │
        ┌─────────┴─────────┐
        │ YES               │ NO
        ▼                   ▼
  ✅ SHOW TOKEN      ┌─────────────────┐
  (bypass checks)    │ possible_spam?  │
                     └────────┬────────┘
                              │
                   ┌──────────┴──────────┐
                   │ YES                 │ NO
                   ▼                     ▼
            ❌ FILTER          ┌────────────────────┐
                               │ security_score==null│
                               │ AND                 │
                               │ verified==false?    │
                               └─────────┬───────────┘
                                         │
                              ┌──────────┴──────────┐
                              │ YES                 │ NO
                              ▼                     ▼
                       ❌ FILTER               ✅ SHOW TOKEN
```

### Implementation Example

```javascript
// Location: src/background/handlers/streams/BlockchainStreamHandler.js

const filteredTokens = tokensResponse.filter(token => {
  // CHECK 0: Whitelist - trusted tokens bypass all checks
  const curatedKey = `${chainId}:${token.token_address.toLowerCase()}`;
  const isCuratedToken = !!CURATED_TOKEN_LOGOS[curatedKey];
  
  if (isCuratedToken) {
    logger.debug(`✅ Token ${token.symbol} is in curated whitelist - bypassing security filters`);
    return true; // Always keep curated tokens
  }
  
  // CHECK 1: Spam filter (non-curated only)
  if (token.possible_spam === true) {
    logger.debug(`🚫 Filtering out spam token: ${token.symbol}`);
    return false;
  }
  
  // CHECK 2: Security check (non-curated only)
  if (token.security_score === null && token.verified_contract === false) {
    logger.debug(`🚫 Filtering out suspicious token: ${token.symbol}`);
    return false;
  }
  
  // All other tokens pass
  return true;
});
```

### Adding Tokens to Curated List

To add a token to the trusted whitelist:

**File:** `src/utils/curatedTokenLogos.js`

```javascript
export const CURATED_TOKEN_LOGOS = {
  // Format: 'chainId:address_lowercase': { symbol: 'SYMBOL' }
  
  // Example: Adding USDC on Base (8453)
  '8453:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': { symbol: 'USDC' },
  
  // Example: Adding WETH on Base (8453)
  '8453:0x4200000000000000000000000000000000000006': { symbol: 'WETH' },
  
  // ... 510+ tokens already included
};
```

**Benefits of Curated Whitelist:**
1. ✅ **Prevents false positives:** Legitimate tokens with incomplete API data are shown
2. ✅ **Performance:** No additional validation needed for known-good tokens
3. ✅ **Privacy:** Local check, no external API calls
4. ✅ **Reliability:** Works even if external APIs flag tokens incorrectly

### Frontend Safe Mode Filter

The **Frontend** also applies the curated whitelist in the "Safe Mode" filter to prevent UI hiding of trusted tokens.

**Location:** `src/components/common/Dashboard/TokensList.jsx`

**Behavior:**
- **Safe Mode ON (default):** Shows only tokens with valid prices AND security flags
- **Curated tokens ALWAYS pass:** Bypasses all Safe Mode checks
- **Safe Mode OFF:** Shows all tokens (including those without prices)

**Filter Logic:**
```javascript
// In TokensList.jsx
const filteredTokens = useMemo(() => {
  if (!safeMode) return detailedPortfolioBalances; // Show all
  
  return detailedPortfolioBalances.filter(balance => {
    // CHECK 0: Curated whitelist (highest priority)
    const curatedKey = `${network.chainId}:${balance.address.toLowerCase()}`;
    if (CURATED_TOKEN_LOGOS[curatedKey]) {
      return true; // ✅ Always show curated tokens
    }
    
    // CHECK 1: Price validity
    const hasValidPrice = balance.has_price || parseFloat(balance.exchange_rate) > 0;
    
    // CHECK 2: Security flags
    const isSafeToken = 
      balance.security_score !== null ||
      balance.type === 'NATIVE' ||
      balance.verified_contract === true;
    
    return hasValidPrice && isSafeToken;
  });
}, [detailedPortfolioBalances, safeMode, network]);
```

**Why Two Filters (Backend + Frontend)?**

1. **Backend filter:** Prevents spam/scam tokens from ever reaching the UI (saves bandwidth, improves security)
2. **Frontend filter:** Safe Mode UI feature to hide tokens without prices (user preference, UX enhancement)
3. **Curated whitelist:** Applied in BOTH to ensure trusted tokens always display

**Example Flow:**
```
Token: WETH on Base (0x4200...0006)
├─ Backend: ✅ Curated → Sent to frontend
├─ Frontend Safe Mode ON: ✅ Curated → Displayed to user
└─ Result: User sees WETH with balance

Token: SCAMTOKEN (not curated, no security_score, unverified)
├─ Backend: ❌ Filtered → NOT sent to frontend
└─ Result: User never sees it (security protection)

Token: NEWTOKEN (not curated, but has price & verified)
├─ Backend: ✅ Passes security check → Sent to frontend
├─ Frontend Safe Mode ON: ✅ Has price & verified → Displayed
└─ Result: User sees new verified token

Token: NOPRICE (not curated, no price data)
├─ Backend: ✅ Passes (not spam) → Sent to frontend
├─ Frontend Safe Mode ON: ❌ No price → Hidden behind lock icon
└─ Frontend Safe Mode OFF: ✅ Shown
└─ Result: User can toggle Safe Mode to see it
```

### Related Documentation

- [FRONTEND.md#token-logos-integration](./FRONTEND.md#token-logos-integration) - Token logo resolution system (uses same curated list)
- [SECURITY.md](./SECURITY.md) - Overall security architecture

---

## External APIs

### Bebop API

**Base URL:** `https://api.bebop.xyz/jam/{network}/v2/`

**Endpoints:**

#### GET /quote

Get swap quote.

**Query Parameters:**
- `sell_tokens`: Token address
- `buy_tokens`: Token address
- `sell_amounts`: Amount in wei
- `taker_address`: User address
- `approval_type`: 'Standard' | 'Permit2'
- `slippage`: Slippage in basis points (50 = 0.5%)
- `receiver_address`: Partner fee receiver
- `buy_tokens_ratios`: Fee in basis points

#### POST /order

Submit signed order.

**Body:**
```json
{
  "signature": "0x...",
  "quote_id": "..."
}
```

### SuperSeed RPC

**Endpoint:** `https://mainnet.superseed.xyz`

Standard JSON-RPC 2.0 methods:
- `eth_blockNumber`
- `eth_getBalance`
- `eth_sendRawTransaction`
- `eth_call`
- `eth_estimateGas`

---

### SuperSafe Price API

**Base URL:** `https://api.supersafe.cool/api/v1/`  
**Purpose:** Token price data with 24h historical comparison across multiple chains  
**Service:** `SuperSafeApiWrapper.js`

#### Overview

SuperSafe Price API provides real-time and historical token price data for portfolio tracking and 24h change calculations. The service includes automatic retry logic with exponential backoff and graceful fallback handling.

**Features:**
- ✅ Multi-chain support (SuperSeed, Optimism, BSC, Ethereum, Base)
- ✅ Batch request optimization (fetch multiple tokens in one call)
- ✅ Automatic retry with exponential backoff (2 retries, 1s/2s delays)
- ✅ Graceful 503 handling (returns fallback data instead of errors)
- ✅ Performance optimization for portfolio calculations

#### Endpoints

##### GET /tokens/{address}/price24h

Get 24h price data for a single token.

**URL:** `GET /tokens/{address}/price24h?chain_id={chainId}`

**Parameters:**
- `address` (path, required) - Token contract address (0x-prefixed, 40 hex chars)
- `chain_id` (query, optional) - Filter by chain ID (5330=SuperSeed, 10=Optimism, 56=BSC, 1=Ethereum, 8453=Base)

**Response:**
```json
{
  "token_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "chain_id": 1,
  "price_now": 1.0015,
  "price_24h_ago": 1.0002,
  "symbol": "USDC",
  "name": "USD Coin"
}
```

**Error Responses:**
- `404` - Token not found on specified chain
- `503` - Service temporarily unavailable (handled gracefully with fallback)

##### GET /tokens/price24h

**Batch endpoint** - Get 24h price data for multiple tokens at once.

**URL:** `GET /tokens/price24h?chain_id={chainId}&addresses={addr1,addr2,...}`

**Parameters:**
- `chain_id` (query, required) - Chain ID to query
- `addresses` (query, optional) - Comma-separated list of token addresses
- `symbols` (query, optional) - Comma-separated list of token symbols
- `limit` (query, optional) - Maximum tokens to return (default: 100, max: 1000)
- `offset` (query, optional) - Pagination offset (default: 0)

**Response:**
```json
{
  "tokens": [
    {
      "token_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      "chain_id": 1,
      "price_now": 1.0015,
      "price_24h_ago": 1.0002,
      "symbol": "USDC",
      "name": "USD Coin"
    },
    {
      "token_address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "chain_id": 1,
      "price_now": 1.0001,
      "price_24h_ago": 0.9998,
      "symbol": "USDT",
      "name": "Tether USD"
    }
  ],
  "total": 2
}
```

#### Internal API Functions

##### getBatchTokenPrices()

**NEW in v3.0.1+** - Optimized batch price fetching.

**Location:** `src/background/services/SuperSafeApiWrapper.js`

**Signature:**
```javascript
async getBatchTokenPrices(addresses, chainId)
```

**Parameters:**
- `addresses` (string[]) - Array of token contract addresses
- `chainId` (number) - Chain ID (decimal format)

**Returns:**
```javascript
{
  success: true,
  data: Map<address, {
    current: number,
    previous: number,
    change24h: number,
    source: 'supersafe'
  }>,
  temporarilyUnavailable: boolean  // True if API returned 503 with fallback
}
```

**Example:**
```javascript
import { getBatchTokenPrices } from './services/SuperSafeApiWrapper.js';

// Fetch prices for 27 tokens in ONE API call (vs 27 individual calls)
const addresses = [
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',  // USDC
  '0xdac17f958d2ee523a2206206994597c13d831ec7',  // USDT
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'   // WBTC
];

const result = await getBatchTokenPrices(addresses, 1); // Ethereum

if (result.success) {
  const usdcPrice = result.data.get('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
  console.log(`USDC: $${usdcPrice.current} (24h change: $${usdcPrice.change24h})`);
}
```

**Performance Impact:**
- **Before**: 27 tokens = 27 API calls (~5-10 seconds, prone to 503 errors)
- **After**: 27 tokens = 1 API call (~500ms, resilient with retry logic)
- **Improvement**: 96.3% reduction in API calls

##### getTokenPriceDataWrapper()

Legacy function for single token price lookup.

**Signature:**
```javascript
async getTokenPriceDataWrapper(contractAddress, chainId = null)
```

**Note:** For multiple tokens, use `getBatchTokenPrices()` instead for better performance.

##### getNativeTokenPriceDataWrapper()

Get price data for native tokens (ETH, BNB, etc) using zero address.

**Signature:**
```javascript
async getNativeTokenPriceDataWrapper(chainId = null)
```

#### Error Handling & Resilience

**Automatic Retry Logic:**
```javascript
// Attempt 1: Immediate
// Attempt 2: After 1 second (if 503)
// Attempt 3: After 2 seconds (if 503)
// Final: Return graceful fallback (zeros) instead of throwing error
```

**503 Service Unavailable Handling:**
- ⚠️ Logs warning (not error) to reduce console spam
- ✅ Returns `{ success: true, data: {...}, temporarilyUnavailable: true }`
- ✅ Uses fallback values (zeros) to prevent UI crashes
- ✅ Portfolio calculations continue with degraded data

**Example Error Response:**
```javascript
{
  success: true,  // Still success! (graceful degradation)
  data: {
    current: 0,
    previous: 0,
    change24h: 0,
    source: 'supersafe'
  },
  temporarilyUnavailable: true  // Flag for caller awareness
}
```

#### API Stream Messages

These are the internal stream messages that frontend components use to interact with the Price API:

##### API_CALCULATE_PORTFOLIO_CHANGE_24H

Calculate 24h portfolio change for all tokens.

**Request:**
```javascript
{
  type: 'API_CALCULATE_PORTFOLIO_CHANGE_24H',
  params: {
    portfolioBalances: [{
      address: '0x...',
      symbol: 'USDC',
      amount: '1000000',
      decimals: 6,
      value_usd: 1.0
    }],
    nativeTokenBalance: {
      balance: '1000000000000000000',  // 1 ETH
      usdValue: 3819.66
    },
    chainId: 1
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    change24h: 123.45,
    isPositive: true,
    changePercentage: 5.2,
    currentValue: 2500.00,
    previousValue: 2376.55
  }
}
```

**Optimization:** Uses `getBatchTokenPrices()` internally to fetch all token prices in one API call.

##### API_CALCULATE_TOKEN_CHANGE_24H

Calculate 24h change for a single token balance.

**Request:**
```javascript
{
  type: 'API_CALCULATE_TOKEN_CHANGE_24H',
  params: {
    tokenBalance: {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      amount: '1000000',
      decimals: 6,
      value_usd: 1.0
    },
    chainId: 1
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    change24h: 0.15,
    isPositive: true,
    changePercentage: 0.015,
    currentValue: 1.0015,
    previousValue: 1.0000,
    hasError: false
  }
}
```

#### Supported Networks

| Network | Chain ID | Status | Rate Limit |
|---------|----------|--------|------------|
| SuperSeed | 5330 | ✅ Active | 1000 req/min |
| Optimism | 10 | ✅ Active | 1000 req/min |
| BSC | 56 | ✅ Active | 1000 req/min |
| Ethereum | 1 | ✅ Active | 1000 req/min |
| Base | 8453 | ✅ Active | 1000 req/min |

**Rate Limiting:** 1000 requests per minute per API key (shared across all networks).

---

### API Key Rotation System

**Version:** 2.0.0  
**Status:** ✅ Production Ready

#### Overview

SuperSafe implements an **automatic API key rotation system** with **random initial start** and **round-robin load balancing** to maximize throughput, improve reliability, and avoid rate limiting when calling external APIs (Moralis, Blockscout, etc.).

**Key Features:**
- ✅ **Random Initial Start**: Each adapter instance starts with a random API key
- ✅ **Automatic Rotation**: Keys rotate on every request (not just retries)
- ✅ **Round-Robin Algorithm**: Distributes load evenly across all keys
- ✅ **Multiple Keys Support**: Works with 1, 2, 3, or more API keys
- ✅ **Load Balancing**: ~33% load per key with 3 keys (or 1/N with N keys)
- ✅ **Zero Configuration**: Falls back to single key if backups not provided
- ✅ **Transparent**: No application code changes needed
- ✅ **Secure**: Keys never logged or exposed in output

#### Architecture

**Components:**

1. **`buildApiKeyArray(...apiKeys)`** (`src/background/config/apiConfig.js`)
   - Helper function to construct key arrays
   - Accepts variable number of API keys using rest parameters
   - Filters out null/empty values automatically
   - Returns: `string` (single key) or `string[]` (multiple keys)

2. **`MoralisAdapter.constructor()`** (`src/background/adapters/MoralisAdapter.js`)
   - Initializes adapter with random starting key index
   - Formula: `this.currentKeyIndex = Math.floor(Math.random() * this.apiKey.length)`
   - Ensures different adapter instances start with different keys
   - Logs initialization with starting key index

3. **`MoralisAdapter.request()`** (`src/background/adapters/MoralisAdapter.js`)
   - Selects key using current index: `apiKeyToUse = this.apiKey[this.currentKeyIndex]`
   - Rotates to next key: `this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKey.length`
   - Rotation happens on **every request** (not just retries)
   - Logs key rotation every 10 requests for monitoring

4. **`SecureApiClient._makeRequest()`** (`src/background/services/SecureApiClient.js`)
   - Legacy system for other APIs (non-Moralis)
   - Implements retry-based rotation
   - Formula: `keyIndex = attemptNumber % config.API_KEY.length`

#### How It Works

**Random Start + Round-Robin Algorithm (Moralis)**

MoralisAdapter uses a sophisticated load balancing system:

```
INITIALIZATION (once per adapter instance):
  currentKeyIndex = Math.floor(Math.random() * apiKey.length)
  // Example with 3 keys:
  // Instance A: starts at index 0 (Key 1)
  // Instance B: starts at index 2 (Key 3)
  // Instance C: starts at index 1 (Key 2)

EACH REQUEST:
  1. Use current key: apiKeyToUse = apiKey[currentKeyIndex]
  2. Rotate index:    currentKeyIndex = (currentKeyIndex + 1) % apiKey.length
  3. Make API call with selected key
  
RESULT WITH 3 KEYS:
  Instance A: Key1 → Key2 → Key3 → Key1 → Key2 → Key3...
  Instance B: Key3 → Key1 → Key2 → Key3 → Key1 → Key2...
  Instance C: Key2 → Key3 → Key1 → Key2 → Key3 → Key1...
  
  → Each key receives ~33% of total load across all instances
```

**Load Distribution Example**

With **3 API keys** and **3 adapter instances**:

| Request # | Instance A | Instance B | Instance C | Load Distribution |
|-----------|------------|------------|------------|-------------------|
| 1         | Key 1      | Key 3      | Key 2      | 33% / 33% / 33%   |
| 2         | Key 2      | Key 1      | Key 3      | 33% / 33% / 33%   |
| 3         | Key 3      | Key 2      | Key 1      | 33% / 33% / 33%   |
| 4         | Key 1      | Key 3      | Key 2      | 33% / 33% / 33%   |

**Perfect load balancing** = Each Moralis account gets equal traffic

#### Configuration

**Environment Variables**

Create a `.env` file in the project root:

```bash
# Primary API Key (REQUIRED)
MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.primary_key_here

# Backup API Keys (OPTIONAL - enables load balancing)
MORALIS_API_KEY_BACKUP=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.backup_key_1_here
MORALIS_API_KEY_BACKUP2=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.backup_key_2_here

# You can add more backup keys if needed (requires code modification)
# MORALIS_API_KEY_BACKUP3=...
```

**Code Configuration**

In `src/background/config/apiConfig.js`:

```javascript
import { buildApiKeyArray } from './apiConfig.js';

export const API_CONFIG = {
  // Example with 3 Moralis API keys (recommended)
  OPTIMISM_MORALIS: {
    API_KEY: buildApiKeyArray(
      process.env.MORALIS_API_KEY,           // Key 1 (Primary)
      process.env.MORALIS_API_KEY_BACKUP,    // Key 2 (Backup 1)
      process.env.MORALIS_API_KEY_BACKUP2    // Key 3 (Backup 2)
    ),
    BASE_URL: 'https://deep-index.moralis.io/api/v2.2',
    TIMEOUT: 3000,
    RATE_LIMIT: {
      MAX_REQUESTS: 300,
      TIME_WINDOW: 60000
    }
  },
  
  // Example with 2 keys
  BSC: {
    API_KEY: buildApiKeyArray(
      process.env.MORALIS_API_KEY,
      process.env.MORALIS_API_KEY_BACKUP
    ),
    BASE_URL: 'https://deep-index.moralis.io/api/v2.2',
    TIMEOUT: 3000,
    RATE_LIMIT: {
      MAX_REQUESTS: 300,
      TIME_WINDOW: 60000
    }
  }
};
```

**Note:** `buildApiKeyArray()` accepts variable number of arguments and automatically filters out empty/null values.

#### Examples

**Example 1: Single API Key (No Rotation)**

**Configuration:**
```javascript
API_KEY: buildApiKeyArray(process.env.MORALIS_API_KEY)
// Result: "eyJhbGci..." (string)
```

**Behavior:**
- All requests use the same key
- No rotation occurs
- No load balancing benefits

**Use Case:** Testing, development, or single Moralis account

---

**Example 2: Two Keys (50/50 Load Distribution)**

**Configuration:**
```javascript
API_KEY: buildApiKeyArray(
  process.env.MORALIS_API_KEY,        // Key 1
  process.env.MORALIS_API_KEY_BACKUP  // Key 2
)
// Result: ["eyJhbGci...", "eyJhbGci..."] (array)
```

**Behavior:**
```
Instance A (random start=0): Key1 → Key2 → Key1 → Key2...
Instance B (random start=1): Key2 → Key1 → Key2 → Key1...

Load Distribution: 50% per key (2x effective rate limit)
```

**Use Case:** Double your Moralis rate limit with 2 accounts

---

**Example 3: Three Keys (33/33/33 Load Distribution) ⭐ RECOMMENDED**

**Configuration:**
```javascript
API_KEY: buildApiKeyArray(
  process.env.MORALIS_API_KEY,         // Key 1
  process.env.MORALIS_API_KEY_BACKUP,  // Key 2
  process.env.MORALIS_API_KEY_BACKUP2  // Key 3
)
// Result: ["eyJhbGci...", "eyJhbGci...", "eyJhbGci..."] (array)
```

**Behavior:**
```
Instance A (random start=0): Key1 → Key2 → Key3 → Key1 → Key2 → Key3...
Instance B (random start=1): Key2 → Key3 → Key1 → Key2 → Key3 → Key1...
Instance C (random start=2): Key3 → Key1 → Key2 → Key3 → Key1 → Key2...

Load Distribution: 33% per key (3x effective rate limit)
```

**Benefits:**
- **3x Rate Limit**: 900 requests/minute combined (300 × 3)
- **Perfect Balance**: Each account gets equal load
- **Random Start**: No "hot spots" on first key
- **High Availability**: System continues even if one key fails

**Use Case:** Production deployment with high traffic

---

**Example 4: More Than 3 Keys**

**Configuration:**
```javascript
API_KEY: buildApiKeyArray(
  process.env.MORALIS_API_KEY,
  process.env.MORALIS_API_KEY_BACKUP,
  process.env.MORALIS_API_KEY_BACKUP2,
  process.env.MORALIS_API_KEY_BACKUP3,
  // Add more as needed...
)
```

**Behavior:**
- Formula: Each key receives `1/N` of total load (N = number of keys)
- 4 keys = 25% each = 4x rate limit
- 5 keys = 20% each = 5x rate limit

**Use Case:** Enterprise deployments or very high traffic applications

#### Monitoring & Debugging

**Log Messages (MoralisAdapter)**

**Initialization (Multiple Keys):**
```
[MoralisAdapter] Moralis adapter initialized with 3 API keys, starting at index 1
```
This confirms the adapter is using 3 keys and started randomly at key #2 (index 1).

**Normal Operation:**
```
[MoralisAdapter] 🔍 Creating Moralis adapter for Optimism (10)
[TransactionHistoryService] 🔍 Fetching combined history for 0x... on chain 10
```

**Rotation Monitoring (Every 10 Requests):**
```
[MoralisAdapter] API key rotation: 10 requests processed, using key 2/3 for next request
[MoralisAdapter] API key rotation: 20 requests processed, using key 3/3 for next request
[MoralisAdapter] API key rotation: 30 requests processed, using key 1/3 for next request
```
This shows automatic round-robin rotation is working correctly.

**Error Scenarios:**
```
[MoralisAdapter] ❌ Moralis API Error: {
  status: 401,
  statusText: 'Unauthorized',
  url: '/wallets/[ADDRESS]/history',
  errorBody: '{"message":"Token is invalid format"}'
}
```

**Key Indicators:**

| Log Message | Meaning |
|------------|---------|
| `initialized with X API keys, starting at index Y` | Adapter created, random start selected |
| `API key rotation: N requests processed` | Every 10 requests, confirms rotation working |
| `using key X/Y for next request` | Shows which key will be used next |
| `Moralis API Error: status: 429` | Rate limit hit (load balancing helps prevent) |
| `Moralis API Error: status: 401` | Invalid API key (check `.env`) |
| `HTTP 401: {"message":"Token is invalid format"}` | API key in wrong format (check array handling) |

#### Security Considerations

**✅ Secure Practices**

1. **Keys Never Logged**: 
   - API keys are replaced with `[API_KEY_HIDDEN]` in curl commands
   - Only key index numbers are logged, never actual keys

2. **Environment Variables**:
   - Keys stored in `.env` (never committed to git)
   - `.env.example` provides template without real keys

3. **Single Source of Truth**:
   - All key access goes through `SecureApiClient`
   - No direct key usage in application code

**⚠️ Important Notes**

- **Do NOT commit `.env` file to version control**
- **Do NOT share API keys in logs or error messages**
- **Rotate keys periodically** (every 90 days recommended)
- **Monitor usage** via Moralis dashboard to detect abuse

#### Benefits

**1. True Load Balancing**

- **Random start** + **round-robin** = perfect distribution from first request
- No "hot spots" - all keys receive equal load
- Example with 3 keys: 33% / 33% / 33% distribution

**2. Higher Throughput**

- **3 keys = 3x rate limit capacity**
- Example: Moralis free tier = 300 req/min per key
  - Single key: 300 req/min
  - Three keys: 900 req/min effective capacity
- Scales linearly: N keys = N× throughput

**3. Improved Reliability**

- If one key hits rate limit → other keys continue service
- Random start prevents all instances from hitting same key
- Reduces downtime from rate limiting
- Automatic failover without manual intervention

**4. Cost Optimization**

- Use multiple free-tier keys instead of paid plan
- 3 Moralis free accounts = same throughput as mid-tier paid plan
- Pay-per-use models benefit from load distribution
- Save hundreds of dollars per month

**5. Graceful Degradation**

- Single key failure doesn't break the app
- System continues with remaining keys
- Logs indicate which key is problematic
- No user-facing errors during key failures

#### Troubleshooting

**Issue: "API KEY missing from x-api-key header"**

**Cause:** `API_KEY` not configured or `null`

**Solution:**
```bash
# Check .env file exists and has correct keys
cat .env | grep MORALIS_API_KEY

# Verify keys are non-empty
echo $MORALIS_API_KEY
```

**Issue: Both keys failing with 401**

**Cause:** Invalid API keys

**Solution:**
1. Verify keys on Moralis dashboard
2. Check for extra spaces or newlines in `.env`
3. Regenerate keys if compromised

**Issue: Rotation not happening**

**Cause:** Only one key configured

**Solution:**
```bash
# Add backup key to .env
echo "MORALIS_API_KEY_BACKUP=your_backup_key_here" >> .env

# Restart extension
npm run build
```

**Issue: "Using backup API key" on first attempt**

**Cause:** Primary key is `null` or empty

**Solution:**
```bash
# Verify primary key is set
grep MORALIS_API_KEY= .env

# Should show: MORALIS_API_KEY=eyJhbG...
```

---

## Transaction Decoding APIs

### TransactionDecoder.buildTransactionModalRequest()

**Purpose:** Main orchestrator for transaction decoding, routing to specialized decoders.

**Location:** `src/background/decoders/TransactionDecoder.js`

**Signature:**
```javascript
async buildTransactionModalRequest(tx, context = {})
```

**Parameters:**
- `tx` (object) - Transaction object with `to`, `data`, `value`, `from`
- `context` (object) - Optional context with:
  - `chainId` (number) - Network chain ID (decimal)
  - `provider` (ethers.Provider) - RPC provider for token metadata
  - `origin` (string) - dApp origin URL

**Returns:** Promise resolving to decoded transaction object:
```javascript
{
  type: string,           // "DEX Swap", "Token Approval", etc.
  title: string,          // User-friendly title
  subtitle: string,       // Additional context
  details: object,        // Type-specific details
  badges: string[],       // UI badges (e.g., "Uniswap V3", "Gasless")
  risks: string[],        // Security warnings
  steps: object[]         // Multi-step operations
}
```

**Example Usage:**
```javascript
// In ProviderStreamHandler.js
const decodedTransaction = await transactionDecoder.buildTransactionModalRequest(
  {
    to: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    data: '0x24856bc3...',
    value: '0x5af3107a4000'
  },
  {
    chainId: 10,
    provider: getProvider(10),
    origin: 'app.velodrome.finance'
  }
);
```

**Error Handling:**
- Throws error if token metadata unavailable (no fallbacks)
- Throws error if transaction data malformed
- Throws error if chainId not supported

### UniversalRouterDecoder.decode()

**Purpose:** Decodes Universal Router transactions (Uniswap, PancakeSwap).

**Location:** `src/background/decoders/UniversalRouterDecoder.js`

**Signature:**
```javascript
async decode(data, value, chainId, provider)
```

**Parameters:**
- `data` (string) - Transaction data (hex)
- `value` (string) - Transaction value (hex)
- `chainId` (number) - Network chain ID
- `provider` (ethers.Provider) - RPC provider

**Returns:** Promise resolving to decoded swap object with full token metadata

**Supported Commands:**
- V2_SWAP_EXACT_IN (0x08)
- V3_SWAP_EXACT_IN (0x00)
- V4_SWAP (0x10) - Uniswap
- INFI_SWAP (0x10) - PancakeSwap (context-aware)
- WRAP_ETH (0x0b)
- UNWRAP_WETH (0x0c)
- PERMIT2_PERMIT (0x0a)

### TokenMetadataService.getTokenMetadata()

**Purpose:** Fetch token metadata with strict validation (no fallbacks).

**Location:** `src/background/services/TokenMetadataService.js`

**Signature:**
```javascript
async getTokenMetadata(address, chainId, provider)
```

**Multi-Layer Lookup:**
1. **Cache** - LRU cache (1000 entries), <1ms
2. **BebopTokenService** - Local database, ~5ms
3. **On-Chain RPC** - Smart contract calls, 50-500ms

**Returns:**
```javascript
{
  symbol: string,      // Token symbol (e.g., "USDC")
  decimals: number,    // Token decimals (0-18)
  name: string,        // Token name (e.g., "USD Coin")
  address: string      // Token address (checksummed)
}
```

**Security:**
- **No fallbacks** - Throws error if metadata unavailable
- **Strict validation** - Decimals must be 0-18
- **Network-aware caching** - Separate cache per chainId

**Example:**
```javascript
const metadata = await tokenMetadataService.getTokenMetadata(
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  1,  // Ethereum
  provider
);
// Returns: { symbol: "USDC", decimals: 6, name: "USD Coin", address: "0x..." }
```

---

## Signing System APIs

### SigningRequestManager.createRequest()

**Purpose:** Create and manage signing requests with lifecycle tracking.

**Location:** `src/background/managers/SigningRequestManager.js`

**Signature:**
```javascript
createRequest(method, params, origin, metadata = {})
```

**Parameters:**
- `method` (string) - Signing method (personal_sign, eth_signTypedData_v4)
- `params` (array) - Method parameters
- `origin` (string) - dApp origin
- `metadata` (object) - Optional metadata

**Returns:** Request ID (string)

**Request Lifecycle:**
1. `created` - Request registered
2. `pending` - Popup shown to user
3. `completed` - User approved/rejected
4. `expired` - Timeout (5 minutes)

**Example:**
```javascript
const requestId = signingRequestManager.createRequest(
  'personal_sign',
  ['0x48656c6c6f', '0x742d35Cc...'],
  'app.uniswap.org'
);
```

### SigningModalAdapter.buildModalRequestFromRpc()

**Purpose:** Transform RPC requests into user-friendly modal data.

**Location:** `src/background/adapters/SigningModalAdapter.js`

**Signature:**
```javascript
buildModalRequestFromRpc(method, params, context = {})
```

**Transformations:**
- **personal_sign** - Hex to UTF-8 decoding
- **eth_signTypedData_v4** - JSON parsing, Permit2 detection
- **eth_sendTransaction** - Includes decoded transaction data

**Returns:**
```javascript
{
  type: string,
  message: string | object,
  origin: string,
  chainId: number,
  account: string,
  decodedTransaction: object  // For transactions only
}
```

### Network Switch APIs

### validateSigningNetwork()

**Purpose:** Ensure user is signing on a supported network.

**Location:** `src/background/handlers/streams/ProviderStreamHandler.js`

**Signature:**
```javascript
validateSigningNetwork(chainId, supportedNetworks, origin)
```

**Behavior:**
- If `supportedNetworks` empty/null → Allow any network
- If current network not in `supportedNetworks` → Throw error

**Example:**
```javascript
// dApp supports Optimism only
validateSigningNetwork(
  '0xa',  // Current network (Optimism)
  [10],   // Supported networks
  'app.velodrome.finance'
);
// ✅ Passes

validateSigningNetwork(
  '0x38', // Current network (BSC)
  [10],   // Supported networks
  'app.velodrome.finance'
);
// ❌ Throws: Network mismatch error
```

---

## Popup Management APIs

### PopupManager.createConnectionPopup()

**Purpose:** Create connection request popup with mutual exclusion.

**Location:** `src/background/managers/PopupManager.js`

**Signature:**
```javascript
async createConnectionPopup(origin, networkKey, supportedNetworks)
```

**Mutual Exclusion:**
- Checks for existing popups
- Closes extension if popup opens
- Focuses existing popup if already open

**Popup Types (Priority Order):**
1. Personal Sign
2. Typed Data
3. Transaction
4. Network Switch
5. Connection
6. Unlock

### PopupManager.checkAndFocusExistingPopups()

**Purpose:** Verify no extension-popup coexistence (Professionally Standardized).

**Returns:**
```javascript
{
  shouldClose: boolean,
  focusedPopup: string | null
}
```

**Triple Verification:**
1. Pre-render check (`main.jsx`)
2. Post-render safety net (`App.jsx`)
3. Centralized verification (`PopupManager`)



## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [BACKEND.md](./BACKEND.md) - Backend implementation
- [DAPP_CONNECTIONS.md](./DAPP_CONNECTIONS.md) - dApp integration
- [SWAP_SYSTEM.md](./SWAP_SYSTEM.md) - Swap functionality

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.2+

