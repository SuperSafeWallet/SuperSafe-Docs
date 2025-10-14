# SuperSafe Wallet - API Reference

**Created:** October 13, 2025  
**Version:** 3.0.0+  
**Status:** ✅ CURRENT

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Stream-Based Communication](#stream-based-communication)
3. [Session API](#session-api)
4. [Provider API (EIP-1193)](#provider-api-eip-1193)
5. [Controller APIs](#controller-apis)
6. [Swap API](#swap-api)
7. [External APIs](#external-apis)

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

### personal_sign

Sign message.

**Request:**
```javascript
window.ethereum.request({
  method: 'personal_sign',
  params: ['0x...' /* message */, '0x...' /* address */]
})
```

**Response:**
```javascript
'0x...'  // Signature
```

### eth_signTypedData_v4

Sign typed data (EIP-712).

**Request:**
```javascript
window.ethereum.request({
  method: 'eth_signTypedData_v4',
  params: ['0x...' /* address */, '{"types":...}' /* typed data */]
})
```

**Response:**
```javascript
'0x...'  // Signature
```

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

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [BACKEND.md](./BACKEND.md) - Backend implementation
- [DAPP_CONNECTIONS.md](./DAPP_CONNECTIONS.md) - dApp integration
- [SWAP_SYSTEM.md](./SWAP_SYSTEM.md) - Swap functionality

---

**Document Status:** ✅ Current as of October 13, 2025  
**Code Version:** v3.0.0+

