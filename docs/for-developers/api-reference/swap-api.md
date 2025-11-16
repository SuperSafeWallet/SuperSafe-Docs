---
sidebar_position: 3
---

# 🔄 Swap API

SuperSafe Wallet supports both Bebop JAM/RFQ swaps and Relay.link cross-chain swaps.

## Bebop Swap API

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

## Relay.link Cross-Chain Swap API

### RELAY_GET_QUOTE

Get cross-chain swap quote.

**Request:**
```javascript
{
  type: 'RELAY_GET_QUOTE',
  payload: {
    sellToken: {
      address: '0x...',
      chainId: 56  // BSC
    },
    buyToken: {
      address: '0x...',
      chainId: 1  // Ethereum
    },
    sellAmount: '1000000000000000000',  // 1 BNB
    takerAddress: '0x...',
    slippage: 0.5
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    quote_id: '...',
    buy_amount: '...',
    route: {
      steps: [/* bridge and swap steps */],
      estimated_time: 300  // seconds
    }
  }
}
```

### RELAY_EXECUTE_SWAP

Execute cross-chain swap.

**Request:**
```javascript
{
  type: 'RELAY_EXECUTE_SWAP',
  payload: {
    quote: { /* quote from RELAY_GET_QUOTE */ },
    takerAddress: '0x...',
    networkKey: 'bsc'
  }
}
```

### RELAY_GET_STATUS

Check transaction status.

**Request:**
```javascript
{
  type: 'RELAY_GET_STATUS',
  payload: {
    txHash: '0x...',
    networkKey: 'bsc'
  }
}
```

### RELAY_GET_FEE_CONFIG

Get fee configuration (unified with Bebop).

**Request:**
```javascript
{
  type: 'RELAY_GET_FEE_CONFIG'
}
```

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.2+

