# Tradesilvania RAMP Integration - SuperSafe Wallet

**Created:** January 11, 2026  
**Last Updated:** February 9, 2026  
**Version:** 3.1.8  
**Status:** ✅ CURRENT  
**Last Code Update:** February 9, 2026

**Partner ID:** 693a96463df18e08002ec459

---

## Table of Contents

- [Overview](#overview)
- [Integration Architecture](#integration-architecture)
- [Network Support](#network-support)
- [Implementation Details](#implementation-details)
- [Polling System](#polling-system)
- [Webhook Solution](#webhook-solution)
- [UI Specifications](#ui-specifications)
- [Testing Guide](#testing-guide)
- [API Reference](#api-reference)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

---

## Overview

SuperSafe Wallet has successfully integrated Tradesilvania's fiat-to-crypto on-ramp service, enabling users to purchase cryptocurrency directly within the wallet using credit cards, bank transfers, and digital wallets.

### Key Features

- **✅ Iframe Integration:** Full-screen Tradesilvania widget embedded in extension
- **✅ 3 Active Networks:** Ethereum, BNB Chain, Arbitrum One
- **✅ Pre-filled Wallet Address:** Enhanced security - destination address is read-only
- **✅ Default Asset Selection:** Auto-selects USDC/USDT for optimal UX
- **✅ Multi-language Support:** 6 languages (EN, RO, FR, ES, DE, IT)
- **✅ Transaction Tracking:** Real-time polling with `externalTransactionId`
- **✅ Payment Methods:** Card (instant), Bank transfer (0-3 days), Digital wallets

### Payment Options

| Payment Method | Code | Time | Currencies | Info |
|---------------|------|------|------------|------|
| **Credit Card** | `card` | Instant | EUR, USD, RON | Visa/Mastercard |
| **Bank Transfer** | `bank` | 0-3 days | EUR, RON | SEPA transfer |
| **Neteller** | `neteller` | Instant | EUR | Digital wallet |
| **Skrill** | `skrill` | Instant | EUR | Digital wallet |

---

## Integration Architecture

### System Overview

```
┌──────────────┐         ┌─────────────────┐         ┌──────────────────┐
│  Extension   │────────>│ Tradesilvania   │────────>│  User completes  │
│  (iframe)    │         │    Widget       │         │    purchase      │
└──────────────┘         └─────────────────┘         └──────────────────┘
       │                                                       │
       │ Polling                                               │ Webhook
       │ every 2s                                              ↓
       ↓                                              ┌──────────────────┐
┌──────────────┐                                     │ api.supersafe    │
│ GET /fiat-   │<────────────────────────────────────│ .cool/webhooks   │
│ ramp/tx/{id} │                                     │ /tradesilvania   │
└──────────────┘                                     └──────────────────┘
       │                                                       │
       │ Response: {found, status, ...}                        │
       ↓                                                       ↓
┌──────────────┐                                     ┌──────────────────┐
│ Update UI    │                                     │  PostgreSQL +    │
│ Show modal   │                                     │  Redis Cache     │
└──────────────┘                                     └──────────────────┘
```

### Integration Type

**Method:** Iframe (full-screen)  
**URL:** `https://ramp.tradesilvania.com/`  
**Context:** Browser Extension (375px × 600px popup)

### Extension Viewport

```
┌─────────────────────────────────────┐ ← 375px × 600px (Extension popup)
│ [Close] ← SuperSafe button (z-50)  │
│ ┌─────────────────────────────────┐ │
│ │ IFRAME TRADESILVANIA            │ │ ← Tradesilvania content
│ │ 327px × 552px                   │ │
│ │                                 │ │
│ │ All content:                    │ │
│ │ - Buy USDC header               │ │
│ │ - Input fields                  │ │
│ │ - Dropdowns                     │ │
│ │ - BUY NOW button                │ │
│ │ - Powered by Tradesilvania      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
     ↑ 24px padding on all sides
```

---

## Network Support

### ✅ Confirmed Networks

| Network | Chain ID | TS Code | Status | Default Asset |
|---------|----------|---------|--------|---------------|
| **Ethereum** | 1 | `erc20` | ✅ Active | USDC (`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`) |
| **BNB Chain** | 56 | `bnb` | ✅ Active | USDT (`0x55d398326f99059fF775485246999027B3197955`) |
| **Arbitrum One** | 42161 | `arbitrum` | ✅ Active | USDC (`0xaf88d065e77c8cC2239327C5EDb3A432268e5831`) |

### ⏳ Pending Confirmation

| Network | Chain ID | Expected Code | Status |
|---------|----------|---------------|--------|
| **Base** | 8453 | `base` | ⏳ Awaiting confirmation |
| **Optimism** | 10 | `optimism` | ⏳ Awaiting confirmation |

**Note:** According to Tradesilvania documentation, they support 70+ blockchain networks. BASE and OPTIMISM can likely be added upon request.

### Network Configuration

**File:** `src/config/tradesilvania.config.js`

```javascript
export const NETWORK_MAPPING = {
  1: {        // Ethereum Mainnet
    tsCode: 'erc20',
    name: 'Ethereum',
    displayName: 'Ethereum (ERC20)',
    defaultAssets: [
      {
        symbol: 'USDC',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6
      }
    ]
  },
  56: {       // BNB Chain
    tsCode: 'bnb',
    name: 'BNB Chain',
    displayName: 'BNB Chain (BEP20)',
    defaultAssets: [
      {
        symbol: 'USDT',
        address: '0x55d398326f99059fF775485246999027B3197955',
        decimals: 18
      }
    ]
  },
  42161: {    // Arbitrum One
    tsCode: 'arbitrum',
    name: 'Arbitrum',
    displayName: 'Arbitrum One',
    defaultAssets: [
      {
        symbol: 'USDC',
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        decimals: 6
      }
    ]
  }
};
```

---

## Implementation Details

### Component Structure

**Main Component:** `src/components/BuyCrypto.jsx`  
**Result Modal:** `src/components/modals/BuyCryptoResultModal.jsx`  
**Config:** `src/config/tradesilvania.config.js`  
**Utils:** `src/utils/tradeSilvaniaUtils.js`

### URL Building

**Function:** `buildTradeSilvaniaUrl(config)`

```javascript
import { buildTradeSilvaniaUrl } from '../utils/tradeSilvaniaUtils';

const url = buildTradeSilvaniaUrl({
  partnerId: '693a96463df18e08002ec459',
  networkTo: 'erc20',
  addressTo: '0x9FeA629011f273bC81586F5C1234567890b380D',
  assetTo: 'USDC',
  language: 'en',
  externalTransactionId: 'supersafe_1702828800_abc123'
});

// Result:
// https://ramp.tradesilvania.com/?partnerId=693a96463df18e08002ec459&networkTo=erc20&addressTo=0x9FeA...&assetTo=USDC&language=en&externalTransactionId=supersafe_1702828800_abc123
```

### Query Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `partnerId` | ✅ Yes | SuperSafe Partner ID | `693a96463df18e08002ec459` |
| `networkTo` | ✅ Yes | Network code | `erc20`, `bnb`, `arbitrum` |
| `addressTo` | ✅ Yes | Wallet address (pre-filled, read-only) | `0x9FeA...b380D` |
| `assetTo` | ⚠️ Recommended | Default crypto asset | `USDC`, `USDT` |
| `language` | ⚠️ Recommended | UI language | `en`, `ro`, `fr`, `es`, `de`, `it` |
| `externalTransactionId` | ✅ Yes | Tracking ID for polling | `supersafe_{timestamp}_{random}` |

### Transaction Flow

```
1. User clicks "Buy" in SuperSafe footer
   ↓
2. Extension generates externalTransactionId
   Format: supersafe_{timestamp}_{random}
   Example: supersafe_1702828800_abc123xyz789
   ↓
3. Load Tradesilvania iframe + START POLLING (every 2s)
   URL: https://ramp.tradesilvania.com/?partnerId=...
   Parameters: assetTo, networkTo, addressTo, externalTxId
   ↓
4. User completes purchase in Tradesilvania widget
   - Selects payment method
   - Completes KYC (if needed)
   - Makes payment
   ↓
5. Tradesilvania sends webhook to backend
   POST https://api.supersafe.cool/api/v1/webhooks/tradesilvania
   Body: { status: "settled", externalTransactionId: ..., }
   ↓
6. Backend validates & stores transaction
   - Verify RSA signature
   - Store in PostgreSQL
   - Cache in Redis (5 min TTL)
   ↓
7. Extension polling detects transaction
   GET /fiat-ramp/transactions/{externalTxId}
   Response: { found: true, status: "settled", ... }
   ↓
8. Stop polling & show result modal
   ✅ Purchase Successful!
   228.145193 USDC
   [View on Explorer] → txHash
```

---

## Polling System

### Overview

SuperSafe uses a polling mechanism to track transaction status in real-time, as browser extensions cannot receive traditional webhooks.

### Polling Configuration

**File:** `src/components/BuyCrypto.jsx`

```javascript
const POLL_INTERVAL = 2000;           // 2 seconds
const TIMEOUT = 30 * 60 * 1000;       // 30 minutes
```

### Transaction Status

| Status | Icon | Description | Polling | Final |
|--------|------|-------------|---------|-------|
| `waiting` | ⏳ | Waiting for user payment | ✅ Continue | ❌ No |
| `exchanging` | 🔄 | Converting fiat to crypto | ✅ Continue | ❌ No |
| `sending` | 📤 | Sending crypto to wallet | ✅ Continue | ❌ No |
| `settled` | ✅ | Transaction complete | ❌ Stop | ✅ Yes |
| `hold` | ⏸️ | Under AML review | ✅ Continue | ❌ No |
| `expired` | ⏱️ | Payment timeout | ❌ Stop | ✅ Yes |
| `rejected` | ❌ | Transaction rejected | ❌ Stop | ✅ Yes |
| `timeout` | ⌛ | Polling timeout (30 min) | ❌ Stop | ✅ Yes |

### Backend API Endpoints

#### 1. Webhook Receiver (Tradesilvania → Backend)

**Endpoint:** `POST https://api.supersafe.cool/api/v1/webhooks/tradesilvania`

**Headers:**
```
Content-Type: application/json
tradesilvania-signature: Base64(RSA512(...))
```

**Request Body:**
```json
{
  "id": "662930290ce5aa18b01556c5",
  "status": "settled",
  "orderType": "on-ramp",
  "assetFrom": "EURO",
  "amountFrom": "200",
  "assetTo": "USDC",
  "amountTo": "228.145193",
  "networkTo": "erc20",
  "addressTo": "0x...",
  "payoutBlockchainId": "0x...",
  "externalTransactionId": "supersafe_1702828800_abc123",
  "externalCustomerId": null,
  "paymentType": "card"
}
```

#### 2. Polling Endpoint (Extension → Backend)

**Endpoint:** `GET https://api.supersafe.cool/api/v1/fiat-ramp/transactions/{externalTransactionId}`

**Headers:**
```
X-Installation-Token: ist_your_installation_token_here
```

**Rate Limiting:**
- 30 requests per minute per installation token
- Polling frequency: every 2 seconds (30 req/min)

**Response (Transaction Not Found):**
```json
{
  "found": false,
  "externalTransactionId": "supersafe_1702828800_abc123",
  "message": "Transaction not received yet"
}
```

**Response (Transaction Found):**
```json
{
  "found": true,
  "transactionId": "662930290ce5aa18b01556c5",
  "externalTransactionId": "supersafe_1702828800_abc123",
  "status": "settled",
  "amount": "228.145193",
  "asset": "USDC",
  "network": "erc20",
  "txHash": "0xabc123def456789...",
  "updatedAt": "2025-12-17T10:30:00Z"
}
```

### Polling Implementation

#### Start Polling
```javascript
const startPolling = useCallback((txId) => {
  const POLL_INTERVAL = 2000; // 2 seconds
  const TIMEOUT = 30 * 60 * 1000; // 30 minutes

  pollStartTimeRef.current = Date.now();
  logger.debug('[FIAT-RAMP] Starting polling for transaction:', txId);

  // Immediate first poll
  pollTransactionStatus(txId).then((data) => {
    if (data && data.found) {
      handleTransactionUpdate(data);
    }
  });

  // Set up interval
  pollIntervalRef.current = setInterval(async () => {
    // Check timeout
    const elapsed = Date.now() - pollStartTimeRef.current;
    if (elapsed > TIMEOUT) {
      stopPolling();
      showTimeoutModal();
      return;
    }

    // Poll for status
    const data = await pollTransactionStatus(txId);
    if (data && data.found) {
      handleTransactionUpdate(data);
    }
  }, POLL_INTERVAL);
}, []);
```

#### Handle Transaction Update
```javascript
const handleTransactionUpdate = useCallback((data) => {
  logger.debug('[FIAT-RAMP] Transaction update:', data);

  setTransactionResult({
    transactionId: data.transactionId,
    transactionStatus: data.status,
    amountTo: data.amount,
    assetTo: data.asset,
    txHash: data.txHash
  });

  // Stop polling on final states
  const finalStates = ['settled', 'expired', 'rejected'];
  if (finalStates.includes(data.status)) {
    stopPolling();
    setShowResultModal(true);
    
    if (onComplete) {
      onComplete({
        transactionStatus: data.status,
        transactionId: data.transactionId,
        amount: data.amount,
        asset: data.asset,
        txHash: data.txHash
      });
    }
  }
}, [onComplete]);
```

### Error Handling

#### Rate Limiting (429)
```javascript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After') || '2';
  logger.warn('[FIAT-RAMP] Rate limit. Retry after:', retryAfter);
  return null; // Continue polling in next interval
}
```

#### Authentication Errors (401/403)
```javascript
if (response.status === 401 || response.status === 403) {
  logger.error('[FIAT-RAMP] Authentication error');
  stopPolling();
  showAuthErrorModal();
  return null;
}
```

#### Network Errors
```javascript
try {
  const response = await fetch(...);
} catch (error) {
  logger.error('[FIAT-RAMP] Network error:', error);
  return null; // Continue polling
}
```

#### Timeout (30 minutes)
```javascript
if (elapsed > TIMEOUT) {
  logger.warn('[FIAT-RAMP] Polling timeout (30 min)');
  stopPolling();
  setTransactionResult({
    transactionStatus: 'timeout',
    message: 'Transaction taking longer than expected'
  });
  setShowResultModal(true);
}
```

---

## Webhook Solution

### Context

SuperSafe is a **browser extension wallet** (not a web application with backend servers). Traditional webhooks (server-to-server) are not directly applicable. We use a hybrid solution:

1. **Backend receives webhooks** from Tradesilvania
2. **Extension polls backend** to retrieve transaction status
3. **Optional postMessage API** for real-time iframe communication

### ✅ Recommended: postMessage API

For real-time transaction updates without navigation disruption.

#### Implementation

**1. User completes transaction in Tradesilvania iframe**

**2. Tradesilvania sends message to parent window:**
```javascript
// From inside Tradesilvania iframe
window.parent.postMessage({
  type: 'TRADESILVANIA_TRANSACTION_COMPLETE',
  transactionId: 'xyz789',
  transactionStatus: 'settled',
  externalTransactionId: 'supersafe_abc123_xyz789',
  amountTo: '228.14',
  assetTo: 'USDC',
  networkTo: 'erc20',
  txHash: '0x1234567890abcdef...'
}, '*'); // Or specify origin: 'chrome-extension://[id]'
```

**3. SuperSafe receives and processes:**
```javascript
window.addEventListener('message', (event) => {
  // Verify origin for security
  if (event.origin === 'https://ramp.tradesilvania.com') {
    if (event.data.type === 'TRADESILVANIA_TRANSACTION_COMPLETE') {
      // ✅ Show success modal
      // ✅ Update wallet balance
      // ✅ Log transaction
      // ✅ User stays in extension context
    }
  }
});
```

#### Advantages
- ✅ No navigation/redirect (seamless UX)
- ✅ User stays in wallet context
- ✅ Works perfectly in iframes
- ✅ Real-time notification (no polling needed)
- ✅ Standard web API (widely supported)
- ✅ Secure (origin verification)

### Required Transaction Data

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `transactionId` | ✅ Yes | Tradesilvania transaction ID | `xyz789` |
| `transactionStatus` | ✅ Yes | Transaction status | `settled`, `rejected`, `waiting` |
| `externalTransactionId` | ✅ Yes | Our tracking ID | `supersafe_abc123_xyz789` |
| `amountTo` | ⚠️ Recommended | Crypto amount purchased | `228.14` |
| `assetTo` | ⚠️ Recommended | Crypto asset purchased | `USDC` |
| `networkTo` | ⚠️ Recommended | Network used | `erc20` |
| `txHash` | 🟡 Optional | Blockchain transaction hash | `0x1234...` |

---

## UI Specifications

### Critical Requirements

#### 1. 🔒 Missing Security Information

**Problem:** Users cannot see WHERE their crypto will be sent or WHICH network is being used.

**Required Display:**
```
Buy USDC

🌐 Network: Ethereum (ERC20)
📍 Destination: 0x9FeA...b380D
    (Set by wallet - Read only)

You pay: 200 EUR
You get: 228.145193 USDC
```

**Implementation:**
- Read `networkTo` parameter → Display network name
- Read `addressTo` parameter → Display destination wallet (truncated)
- Position: Below "Buy USDC" title, before "You pay" field

**Styling:**
- Background: `rgba(0, 255, 163, 0.1)` (light green)
- Border: `1px solid rgba(0, 255, 163, 0.3)`
- Text: White/light gray

#### 2. 📐 Layout Requirements

**Viewport Constraints:**
- Total iframe space: **327px × 552px**
- Design for exact size (no scaling)
- All menus/dropdowns must stay within viewport
- Add internal padding (12-16px on all sides)

**Common Issues:**
- ❌ Hamburger menu extends beyond edges
- ❌ Language dropdown gets cut off
- ❌ Currency dropdowns overflow at bottom
- ❌ Inputs touch right edge (no padding)
- ❌ "SuperSafe" branding missing in narrow viewport

**Required Fixes:**
- ✅ All content fits within 327px × 552px
- ✅ Internal padding on all sides
- ✅ Dropdowns constrained to viewport
- ✅ Header visible in narrow mode

### Network Display Mapping

| TS Code | Display Name |
|---------|-------------|
| `erc20` | Ethereum (ERC20) |
| `bnb` | BNB Chain (BEP20) |
| `arbitrum` | Arbitrum One |
| `polygon` | Polygon |
| `optimism` | Optimism |
| `base` | Base |

### Color Scheme (Optional)

To match SuperSafe's dark theme:

```css
Background: #000000
Primary: #00FFA3 (green)
Text: #FFFFFF (white)
Border: rgba(0, 255, 163, 0.2)
```

---

## Testing Guide

### Implementation Checklist

#### ✅ Completed Tasks

1. **Configuration** ✅
   - Created `src/config/tradesilvania.config.js` with partner ID and network mappings
   - Configured 3 confirmed networks: Ethereum, BNB Chain, Arbitrum
   - Set up default USDC/USDT assets per network

2. **Utilities** ✅
   - Created `src/utils/tradeSilvaniaUtils.js` with URL building and validation
   - Implemented network compatibility checks
   - Added transaction ID generation
   - Created error message helpers

3. **UI Components** ✅
   - Created `src/components/BuyCrypto.jsx` - Full-screen iframe component
   - Created `src/components/modals/BuyCryptoResultModal.jsx` - Result feedback modal
   - Created buy icons (`public/buy.svg`, `public/buy_green.svg`)

4. **Integration** ✅
   - Updated `src/components/AppFooter.jsx` - Replaced "Receive" with "Buy" button
   - Updated `src/components/Dashboard.jsx` - Added 'buy' tab case
   - No linter errors in any modified files

### Manual Testing Checklist

#### Test 1: Network Validation

**Objective:** Verify network compatibility checks work correctly

1. Open SuperSafe Wallet
2. Switch to **Ethereum** network
3. Click "Buy" tab in footer
4. ✅ **Expected:** Iframe loads successfully with Ethereum (erc20) configuration

5. Switch to **BNB Chain** network
6. Click "Buy" tab
7. ✅ **Expected:** Iframe loads successfully with BNB (bnb) configuration

8. Switch to **Arbitrum One** network
9. Click "Buy" tab
10. ✅ **Expected:** Iframe loads successfully with Arbitrum configuration

11. Switch to **SuperSeed** network (unsupported)
12. Click "Buy" tab
13. ✅ **Expected:** Error screen showing "Network Not Supported" with list of supported networks

#### Test 2: Iframe Integration

**Objective:** Verify Tradesilvania iframe loads and displays correctly

1. Switch to Ethereum network
2. Click "Buy" tab
3. Wait for iframe to load
4. ✅ **Expected:** 
   - Loading spinner appears initially
   - Tradesilvania interface loads within iframe
   - Header shows "Buy Crypto with Tradesilvania" and current network
   - Info icon shows tooltip about pre-filled wallet address

5. Check iframe content:
   - ✅ Wallet address should be pre-filled (verify it matches current wallet)
   - ✅ Language should match browser language (or default to English)
   - ✅ Network should be correct (erc20 for Ethereum)
   - ✅ Default asset should be USDC (if available)

#### Test 3: Error Handling

**Objective:** Verify error states display correctly

1. Test with no wallet (locked state):
   - Lock wallet
   - Try to access Buy tab
   - ✅ **Expected:** Unlock modal appears

2. Test with unsupported network:
   - Switch to Monad or Shardeum
   - Click Buy tab
   - ✅ **Expected:** Error screen with supported networks list

#### Test 4: Network Switching

**Objective:** Verify behavior when switching networks while on Buy tab

1. Open Buy tab on Ethereum
2. Switch to BNB Chain using header network selector
3. ✅ **Expected:** Iframe reloads with BNB Chain configuration

4. Switch to SuperSeed (unsupported)
5. ✅ **Expected:** Error screen appears

6. Switch back to Arbitrum
7. ✅ **Expected:** Iframe loads again with Arbitrum configuration

### Cross-Browser Testing

**Browsers to Test:**
- ✅ Chrome/Chromium (primary target)
- ✅ Brave (Chromium-based)
- ✅ Edge (Chromium-based)

**Steps:**
1. Install extension in each browser
2. Repeat Test 1 (Network Validation)
3. Repeat Test 2 (Iframe Integration)
4. Note any browser-specific issues

### Known Limitations

1. **BASE and OPTIMISM Networks:** Not yet confirmed with Tradesilvania
   - Currently commented out in config
   - Need to contact Tradesilvania for confirmation

2. **Transaction Callback:** `redirectTo` parameter not fully implemented
   - Tradesilvania redirects to callback URL after purchase
   - Extension URL handling needs additional setup
   - Result modal currently shows based on postMessage (if supported)

3. **Webhook Integration:** Polling-based (not real-time webhooks)
   - Real-time updates require backend webhook
   - Current implementation polls every 2 seconds

---

## API Reference

### Tradesilvania API Endpoints

#### 1. Price Quote (Real-time)

**URL:** `https://ramp.tradesilvania.com/api/quote/{PARTNER_ID}`  
**Method:** POST  
**Authentication:** Public (no auth required)

**Request Body:**
```json
{
  "amountFrom": "125",
  "assetFrom": "EURO",
  "assetTo": "GALA",
  "networkTo": "erc20",
  "paymentType": "bank"
}
```

**Response (200):**
```json
{
  "amountTo": "2150.924369",
  "rate": "0.05811"
}
```

**Error Codes:**
- `400` - Validation error (amount too small/big, invalid parameters)
- `404` - Partner not found

#### 2. Get Transaction

**URL:** `https://ramp.tradesilvania.com/api/partner/orders/{transactionId}`  
**Method:** GET  
**Authentication:** Bearer token (partnerApiToken)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {partnerApiToken}
```

**Response (200):**
```json
{
  "id": "662930290ce5aa18b01556c5",
  "status": "waiting",
  "orderType": "on-ramp",
  "createdAt": "2024-04-24T16:15:37.495Z",
  "paymentType": "card",
  "assetFrom": "RON",
  "amountFrom": "1000",
  "assetTo": "USDT",
  "networkTo": "trx",
  "networkNameTo": "Tron (TRC20)",
  "addressTo": "TPeQ6uB5T5p5P1bSAmiLW9aEfaiHvefDaH",
  "additionalTo": null,
  "progress": {
    "waiting": {
      "date": "2024-04-24T16:15:37.495Z"
    }
  },
  "expireAt": "2024-04-24T16:20:37.495Z",
  "paymentInfo": {
    "reference": "TODOEB92JRNXO"
  },
  "externalData": {
    "externalTransactionId": "661a64fce7d544f282ae3b10",
    "externalCustomerId": "661a649ce7d544f282ae3b10"
  }
}
```

#### 3. Get Transaction by External ID

**URL:** `https://ramp.tradesilvania.com/api/partner/orders/external-data/{externalTransactionId}`  
**Method:** GET  
**Authentication:** Bearer token

**Response:** Returns array of matching transactions (last 5 if multiple exist)

#### 4. Query Transactions

**URL:** `https://ramp.tradesilvania.com/api/partner/orders?status={status}&start={start}&end={end}&limit={limit}&offset={offset}`  
**Method:** GET  
**Authentication:** Bearer token

**Query Parameters:**
- `status` (optional): Filter by transaction status
- `start` (optional): Unix timestamp (milliseconds)
- `end` (optional): Unix timestamp (milliseconds)
- `limit` (optional): Max results (default: 100, max: 1000)
- `offset` (optional): Skip results (default: 0, max: 200000)

### Supported Networks (TS Codes)

```
erc20, bnb (BNB Smart Chain - BEP20), bep2 (BNB Beacon Chain BEP2), btc, xrp,
avax (AVAX C-Chain), egld, sol, polygon, ltc, eos, ada, bch, trx, dot, zil, doge, 
xtz, xlm, ftm, ksm, terra, algo, hbar, glmr, near, etc, arbitrum
```

**Note:** Tradesilvania supports 70+ blockchain networks. Additional networks can be requested.

---

## Security

### Webhook Signature Validation

Tradesilvania signs all webhook requests with RSA-SHA512.

**Header:** `tradesilvania-signature`  
**Format:** `Base64(RSA512(TS_WEBHOOK_PRIVATE_KEY, SHA512(requestBody)))`

**Public Key (Production):**
```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqJ8G5/Gw+mhhgEUpX7JT
9XoaAlFMS6wBorMMQasKWT4IabGoTT/GHewGBpfQceRxnJGgwwmOwnP/Vyrnd6ay
KB+/Qz/KUVb3rj5bXtzNmC6h+URZA6NPEAc+eQvi49yIbnZ9rBz1uNzgGpSEOrNP
ja0jkN1N9F1bgnu85FARvX6AAa/trrPuBUtHvQh2nAy5I83wsCVbHu8bNqp66nh
YZ064vxo8pgm+J+m4hmB2nbcNcvCkTdaBbIO4q0yD/8oIXTFUoyU6PN+MJ955BH
Aoi/O1uhY5I+zRsOOISCfGzTCh6XcMzynvABCATETb1K5MKXxIKFsaE/juySbkSC
tQIDAQAB
-----END PUBLIC KEY-----
```

**Node.js Validation:**
```javascript
const signature = headers["tradesilvania-signature"];

const verifier = crypto.createVerify('RSA-SHA512');
verifier.write(JSON.stringify(requestBody));
verifier.end();

const isVerified = verifier.verify(tsPublicKey, signature, "base64");
console.log("verified:", isVerified);
```

### Installation Token Security

- Required for all polling requests
- Stored in `chrome.storage.local`
- Validated by backend on every request
- Invalid token → 401/403 → polling stops

### Rate Limiting

- Prevents abuse of polling endpoint
- 30 req/min = 1 request every 2 seconds
- Per installation token
- 429 response → continue in next interval

### Pre-filled Wallet Address

- **Security Feature:** Address is pre-filled and read-only in Tradesilvania UI
- User cannot change destination address
- Protects against phishing/address manipulation
- Address validated against current wallet before loading iframe

---

## Troubleshooting

### Issue: Polling Not Detecting Transaction

**Symptoms:** Extension keeps polling but never shows result

**Debug Steps:**
1. Check console for `[FIAT-RAMP]` logs
2. Verify `externalTransactionId` matches in logs
3. Check backend logs for webhook receipt
4. Query backend directly:
   ```bash
   curl https://api.supersafe.cool/api/v1/fiat-ramp/transactions/supersafe_xxx \
     -H "X-Installation-Token: your_token"
   ```

**Common Causes:**
- Webhook signature validation failing
- Wrong `externalTransactionId` format
- Backend not caching properly
- Network firewall blocking requests

### Issue: Iframe Doesn't Load

**Symptoms:** Blank screen or loading spinner forever

**Debug Steps:**
1. Check browser console for errors
2. Verify network connectivity
3. Check Tradesilvania service status
4. Verify CSP allows `https://ramp.tradesilvania.com`

**Solutions:**
- Clear browser cache
- Disable conflicting extensions
- Check CSP policy in manifest.json

### Issue: Wrong Network in Iframe

**Symptoms:** Iframe shows different network than selected

**Debug Steps:**
1. Check network mapping in `tradesilvania.config.js`
2. Verify current network in header
3. Check URL parameters in iframe src

**Solution:**
- Verify `NETWORK_MAPPING` keys match chain IDs exactly
- Check that network is supported (not commented out)

### Issue: Wallet Address Not Pre-filled

**Symptoms:** User sees empty address field

**Debug Steps:**
1. Verify wallet is unlocked
2. Check console logs for URL building errors
3. Verify `addressTo` parameter in iframe URL

**Solution:**
- Ensure wallet is unlocked before loading iframe
- Check that `buildTradeSilvaniaUrl()` receives correct address

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Network Not Supported" | Current network not in `NETWORK_MAPPING` | Switch to supported network |
| "Wallet is locked" | User needs to unlock wallet | Show unlock modal |
| "Rate limit exceeded" | Too many polling requests | Backend issue - wait for next interval |
| "Authentication failed" | Invalid installation token | Re-authenticate extension |

---

## Support & Contact

### Tradesilvania Support

- **Website:** https://ramp.tradesilvania.com
- **Email:** support@tradesilvania.com
- **Documentation:** Official Tradesilvania RAMP DOC (Version 1)

### SuperSafe Development

- **Partner ID:** 693a96463df18e08002ec459
- **Integration:** Iframe (full-screen)
- **Current Networks:** 3 active (Ethereum, BNB Chain, Arbitrum)
- **Pending Networks:** 2 (BASE, OPTIMISM)

### Requesting New Networks

To request support for additional networks (e.g., BASE, OPTIMISM):

**Email Template:**
```
Subject: Network Support Confirmation - BASE and OPTIMISM

Hello Tradesilvania Team,

We are SuperSafe Wallet (Partner ID: 693a96463df18e08002ec459) and have 
successfully integrated your RAMP service for Ethereum, BNB Chain, and Arbitrum networks.

We would like to add support for two additional networks and need confirmation:

1. BASE Network (Chain ID 8453)
   - Is this network supported?
   - What is the correct network code for API calls?
   - Suggested code: "base"

2. OPTIMISM Network (Chain ID 10)
   - Is this network supported?
   - What is the correct network code for API calls?
   - Suggested code: "optimism"

Additional questions:
- Are USDC and native ETH available for purchase on these networks?
- Are all payment methods (card, bank, digital wallets) supported?
- Do you have a testnet/sandbox environment for testing?

Our integration is ready - we just need confirmation to enable these networks 
in production.

Thank you for your assistance!

Best regards,
SuperSafe Wallet Development Team
```

---

## Next Steps

### Extension (✅ Complete)
- [x] Polling implementation
- [x] Status handling
- [x] Error handling
- [x] Cleanup logic
- [x] Logging

### Backend (✅ Complete)
- [x] Webhook endpoint implementation
- [x] RSA signature validation
- [x] PostgreSQL table creation
- [x] Redis caching
- [x] Polling endpoint implementation
- [x] Rate limiting configuration

### Tradesilvania (⏳ Pending)
- [ ] Confirm BASE network support
- [ ] Confirm OPTIMISM network support
- [ ] Implement postMessage API (optional)
- [ ] Fix UI issues (network/address display, viewport constraints)

### Future Enhancements
- [ ] Add more supported networks as Tradesilvania confirms
- [ ] Implement transaction history view
- [ ] Add fiat currency preferences
- [ ] Enable custom amount pre-fill
- [ ] Support off-ramp (crypto → fiat)

---

**Document:** Version: 3.1.6
**Status:** ✅ Production Ready  
**Last Updated:** January 11, 2026  
**Integration Type:** Fiat On-Ramp (Buy Crypto)  
**Partner:** Tradesilvania RAMP  

---

**Related Documentation:**
- [SuperSafe Wallet Architecture](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
- [Security Documentation](./SECURITY.md)
- [Development Guide](./DEVELOPMENT.md)
