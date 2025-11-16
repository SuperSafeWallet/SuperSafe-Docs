---
sidebar_position: 3
---

# 📡 Stream Handlers

SuperSafe Wallet uses **stream-based communication** via Chrome's long-lived connections for bidirectional, real-time communication between frontend and background.

## Overview

### Stream Communication Model

```
Frontend/Content Script
       │
       │ chrome.runtime.connect({ name: 'session' })
       ↓
┌────────────────┐
│  Stream Port   │ ← Long-lived connection
└────────┬───────┘
         │ postMessage({ type: 'GET_SESSION_STATE' })
         ↓
┌─────────────────────────────────────────┐
│  BackgroundStreamManager                │
│  onMessage('session', handler)          │
└────────┬────────────────────────────────┘
         │ Route to SessionStreamHandler
         ↓
┌─────────────────────────────────────────┐
│  SessionStreamHandler                   │
│  switch (message.type) {                │
│    case 'GET_SESSION_STATE':            │
│      return sessionSnapshot;            │
│  }                                      │
└────────┬────────────────────────────────┘
         │ Response
         ↓
    Return to Frontend
```

---

## Stream Handlers Overview

| Handler | Channel | Purpose | Key Messages |
|---------|---------|---------|--------------|
| **SessionStreamHandler** | `session` | Session & wallet operations | GET_SESSION_STATE, CREATE_WALLET, SWITCH_WALLET, UNLOCK, LOCK |
| **ProviderStreamHandler** | `provider` | dApp EIP-1193 requests | ETH_REQUEST_ACCOUNTS, ETH_SEND_TRANSACTION, ETH_SIGN, WALLET_SWITCH_ETHEREUM_CHAIN |
| **SwapStreamHandler** | `swap` | Bebop swap operations | SWAP_GET_QUOTE, SWAP_SIGN_AND_SUBMIT, SWAP_CHECK_STATUS |
| **RelayStreamHandler** | `relay` | Relay.link cross-chain swaps | RELAY_GET_QUOTE, RELAY_EXECUTE_SWAP, RELAY_GET_STATUS, RELAY_GET_FEE_CONFIG |
| **SendStreamHandler** | `send` | Token transfer operations | SEND_ESTIMATE_GAS, SEND_TRANSACTION |
| **BlockchainStreamHandler** | `blockchain` | Blockchain queries | GET_BALANCE, GET_TOKENS, GET_NFTS, GET_TRANSACTION_HISTORY |
| **ApiStreamHandler** | `api` | External API calls | API_CALCULATE_PORTFOLIO_CHANGE_24H, API_GET_TRANSACTION_HISTORY |

---

## Stream Handler Implementation

### SessionStreamHandler

**Location:** `src/background/handlers/streams/SessionStreamHandler.js`

```javascript
export function setupSessionStreamHandler(backgroundStreamManager, dependencies) {
  const { backgroundSessionController, backgroundControllers } = dependencies;
  
  backgroundStreamManager.onMessage('session', async (message, port) => {
    console.log('[SessionStreamHandler] 📨 Message:', message.type);
    
    switch (message.type) {
      case 'GET_SESSION_STATE': {
        // Check persistent session
        if (!backgroundSessionController.isUnlocked) {
          await backgroundSessionController.checkPersistentSession();
        }
        
        const snapshot = await backgroundSessionController.getCompleteSessionSnapshot(
          backgroundControllers?.tokenController
        );
        
        return { success: true, data: snapshot };
      }
      
      case 'UNLOCK': {
        const { password } = message.payload;
        const result = await backgroundSessionController.unlock(
          password,
          null,
          backgroundControllers?.tokenController
        );
        
        return { success: true, data: result };
      }
      
      case 'CREATE_WALLET': {
        const { name, emoji } = message.payload;
        const result = await backgroundSessionController.createWallet(name, emoji);
        
        return { success: true, data: result };
      }
      
      case 'SWITCH_WALLET': {
        const { index } = message.payload;
        await backgroundSessionController.switchWallet(index);
        
        return { success: true };
      }
      
      default:
        throw new Error(`Unknown session message type: ${message.type}`);
    }
  });
}
```

---

## ProviderStreamHandler

**Location:** `src/background/handlers/streams/ProviderStreamHandler.js`

**Purpose:** Handle dApp EIP-1193 requests

**Key Messages:**
- `ETH_REQUEST_ACCOUNTS` - Request account access
- `ETH_SEND_TRANSACTION` - Send transaction
- `ETH_SIGN` - ❌ Permanently disabled
- `PERSONAL_SIGN` - Sign personal message
- `ETH_SIGN_TYPED_DATA_V4` - Sign EIP-712 typed data
- `WALLET_SWITCH_ETHEREUM_CHAIN` - Switch network

---

## SwapStreamHandler

**Location:** `src/background/handlers/streams/SwapStreamHandler.js`

**Purpose:** Handle Bebop JAM and RFQ swap operations

**Key Messages:**
- `SWAP_GET_QUOTE` - Get swap quote
- `SWAP_SIGN_AND_SUBMIT` - Sign and submit order
- `SWAP_CHECK_STATUS` - Check order status

**Example:**

```javascript
case 'SWAP_GET_QUOTE': {
  const { sellToken, buyToken, sellAmount, takerAddress, slippage, chain } = payload;
  
  // Validate network
  const networkKey = mapChainNameToNetworkKey(chain.name);
  const networkValidation = validateSwapNetwork(networkKey);
  
  if (!networkValidation.valid) {
    return { success: false, error: networkValidation.reason };
  }
  
  // Get Bebop API endpoint
  const bebopApiUrl = getBebopApiEndpoint(networkKey, 'JAM');
  
  // Get fee configuration
  const feeConfig = getFeeConfiguration();
  
  // Build quote request
  const quoteParams = new URLSearchParams({
    sell_tokens: sellToken.address,
    buy_tokens: buyToken.address,
    sell_amounts: amountInWei,
    taker_address: takerAddress,
    approval_type: isNative ? 'Standard' : 'Permit2',
    slippage: slippage * 100,
    receiver_address: feeConfig.partnerInfo.receiverAddress,
    buy_tokens_ratios: feeConfig.feeBps
  });
  
  // Fetch quote
  const response = await fetch(`${bebopApiUrl}quote?${quoteParams}`);
  const quoteData = await response.json();
  
  return { success: true, data: quoteData };
}
```

---

## RelayStreamHandler

**Location:** `src/background/handlers/streams/RelayStreamHandler.js`

**Purpose:** Handle Relay.link cross-chain swap operations

**Key Messages:**
- `RELAY_GET_QUOTE` - Get cross-chain swap quote
- `RELAY_EXECUTE_SWAP` - Execute cross-chain swap
- `RELAY_GET_STATUS` - Check transaction status
- `RELAY_GET_FEE_CONFIG` - Get fee configuration

**Architecture:**

```javascript
export function setupRelayStreamHandler(backgroundStreamManager, dependencies) {
  const { ethers, NETWORKS, backgroundSessionController } = dependencies;
  
  backgroundStreamManager.onMessage('relay', async (message, port) => {
    const { type, payload } = message;
    
    switch (type) {
      case 'RELAY_GET_QUOTE': {
        return await handleGetQuote(payload, { ethers, NETWORKS, backgroundSessionController });
      }
      
      case 'RELAY_EXECUTE_SWAP': {
        return await handleExecuteSwap(payload, { ethers, NETWORKS, backgroundSessionController });
      }
      
      case 'RELAY_GET_STATUS': {
        return await handleGetStatus(payload, { ethers, NETWORKS, backgroundSessionController });
      }
      
      case 'RELAY_GET_FEE_CONFIG': {
        return await handleGetFeeConfig();
      }
    }
  });
}
```

---

## SendStreamHandler

**Location:** `src/background/handlers/streams/SendStreamHandler.js`

**Purpose:** Handle token transfer operations

**Key Messages:**
- `SEND_ESTIMATE_GAS` - Estimate gas for transfer
- `SEND_TRANSACTION` - Send transfer transaction

---

## BlockchainStreamHandler

**Location:** `src/background/handlers/streams/BlockchainStreamHandler.js`

**Purpose:** Handle blockchain queries

**Key Messages:**
- `GET_BALANCE` - Get native token balance
- `GET_TOKENS` - Get ERC20 token list
- `GET_NFTS` - Get NFT list
- `GET_TRANSACTION_HISTORY` - Get transaction history

---

## ApiStreamHandler

**Location:** `src/background/handlers/streams/ApiStreamHandler.js`

**Purpose:** Handle external API calls (SuperSafe Price API)

**Key Messages:**
- `API_CALCULATE_PORTFOLIO_CHANGE_24H` - Calculate 24h portfolio change
- `API_CALCULATE_TOKEN_CHANGE_24H` - Calculate 24h token change
- `API_FORMAT_TOKEN_AMOUNT` - Format token amount
- `API_GET_TRANSACTION_HISTORY` - Get transaction history
- `API_GET_TOKEN_TRANSFERS` - Get token transfers
- `API_GET_COMBINED_HISTORY` - Get combined history

---

## Stream Registration

```javascript
// Background script stream setup
function setupAllStreamHandlers() {
  const dependencies = {
    backgroundSessionController,
    backgroundControllers,
    ethers,
    NETWORKS,
    signingRequestManager,
    popupManager,
    eip1193EventsManager
  };
  
  // Register all handlers
  setupSessionStreamHandler(backgroundStreamManager, dependencies);
  setupProviderStreamHandler(backgroundStreamManager, dependencies);
  setupSwapStreamHandler(backgroundStreamManager, dependencies);
  setupRelayStreamHandler(backgroundStreamManager, dependencies);
  setupSendStreamHandler(backgroundStreamManager, dependencies);
  setupBlockchainStreamHandler(backgroundStreamManager, dependencies);
  setupApiStreamHandler(backgroundStreamManager, dependencies);
}
```

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.2+  
**Maintenance:** Review after major handler changes

