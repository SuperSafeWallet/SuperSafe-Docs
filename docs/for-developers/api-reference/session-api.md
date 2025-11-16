---
sidebar_position: 1
---

# 📡 Session API

SuperSafe Wallet uses **stream-based communication** between frontend and background via Chrome's `chrome.runtime.connect()` for long-lived connections. All APIs follow a request-response pattern with typed messages.

## Communication Pattern

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

## Stream Channels

| Channel | Purpose | Handler Location |
|---------|---------|------------------|
| `session` | Wallet & session operations | `SessionStreamHandler.js` |
| `provider` | dApp EIP-1193 requests | `ProviderStreamHandler.js` |
| `swap` | Bebop swap operations | `SwapStreamHandler.js` |
| `relay` | Relay.link cross-chain swaps | `RelayStreamHandler.js` |
| `send` | Token transfer operations | `SendStreamHandler.js` |
| `blockchain` | Blockchain queries | `BlockchainStreamHandler.js` |
| `api` | External API calls | `ApiStreamHandler.js` |

## Usage Example

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

## GET_SESSION_STATE

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

---

## UNLOCK

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

---

## CREATE_WALLET

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

---

## SWITCH_WALLET

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

---

## LOCK

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

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.2+

