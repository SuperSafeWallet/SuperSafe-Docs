---
sidebar_position: 2
---

# 🎮 Controller APIs

SuperSafe Wallet implements controller APIs for token management, network configuration, and transaction history.

## Token Controller

### GET_TOKENS

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

### ADD_CUSTOM_TOKEN

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

---

## Network Controller

### GET_CURRENT_NETWORK

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

### SWITCH_NETWORK

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

## Transaction Controller

### GET_TRANSACTION_HISTORY

Get transaction history for network and address.

**Request:**
```javascript
{
  type: 'GET_TRANSACTION_HISTORY',
  payload: {
    networkKey: 'superseed',
    address: '0x...',
    limit: 10
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: [{
    hash: '0x...',
    from: '0x...',
    to: '0x...',
    value: '1000000000000000000',
    timestamp: 1698765432000,
    blockNumber: 12345678,
    status: 1,  // 1 = success, 0 = failed
    gasUsed: '21000',
    method: 'transfer'
  }]
}
```

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.2+

