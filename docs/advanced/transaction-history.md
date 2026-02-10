---
sidebar_position: 6
---

# 📜 Multichain Transaction History

Implementation of a multichain system for transaction history visualization that supports different types of blockchain explorers depending on the network. Currently supports **7 active networks** with extensible adapter architecture for easy addition of new networks.

## Overview

The multichain transaction history system provides a unified interface for viewing transaction history across all supported networks. It automatically selects the appropriate blockchain explorer API based on the network, providing a seamless experience regardless of which chain you're viewing.

## Architecture

### Explorer Configuration

Defines what type of explorer each network uses and its capabilities:

- **SuperSeed (5330, 53302)**: Blockscout API
- **Ethereum (1)**: Blockscout API
- **Optimism (10)**: Moralis API (OPTIMISM_MORALIS)
- **Base (8453)**: Moralis API (BASE_MORALIS)
- **BSC (56)**: Moralis API
- **Arbitrum (42161)**: Moralis API (ARBITRUM_MORALIS)
- **Shardeum (8118)**: Blockscout API
- **Future networks**: Easily extensible

### Adapters

#### BlockscoutAdapter

Generic adapter for Blockscout v2-based explorers

- **Supports:** SuperSeed, Ethereum, Shardeum, Injective (future)
- **Endpoints:**
  - `addresses/&#123;address&#125;/transactions` - Transaction history
  - `addresses/&#123;address&#125;/token-transfers` - Token transfers
- **Features:**
  - Integrated rate limiting
  - Robust error handling
  - Automatic retry logic

#### MoralisAdapter

Adapter for Moralis Web3 Data API

- **Supports:** Optimism, Base, BSC, Arbitrum, Ethereum (via Moralis)
- **Endpoints:**
  - `/&#123;address&#125;` - Transaction history
  - `/&#123;address&#125;/erc20/transfers` - ERC-20 transfers
- **Features:**
  - Automatic chainId to Moralis identifier mapping
  - Cursor-based pagination support
  - API key rotation support (multiple keys with round-robin)
  - Rate limiting per adapter instance

### Transaction History Service

Orchestrator service that:
- Automatically resolves which adapter to use based on chainId
- Caches adapter instances for efficiency
- Provides unified interface for all networks
- Handles errors and unsupported networks gracefully

## Data Flow

```
Frontend (TransactionsList.jsx)
  ↓
apiProxy.js (getCombinedHistory, getTokenTransfers)
  ↓
ApiStreamHandler.js
  ↓
TransactionHistoryService.js
  ↓
[Selects Adapter based on chainId]
  ↓
BlockscoutAdapter OR MoralisAdapter
  ↓
Explorer API
```

## Supported Networks

### Active Networks (7)

| Network | ChainId | Explorer Type | API Service | Status |
|---------|---------|---------------|-------------|--------|
| **SuperSeed Mainnet** | 5330 | Blockscout | SUPERSEED | ✅ Active |
| **Ethereum** | 1 | Blockscout | ETHEREUM | ✅ Active |
| **Optimism** | 10 | Moralis | OPTIMISM_MORALIS | ✅ Active |
| **Base** | 8453 | Moralis | BASE_MORALIS | ✅ Active |
| **BNB Chain (BSC)** | 56 | Moralis | BSC | ✅ Active |
| **Arbitrum One** | 42161 | Moralis | ARBITRUM_MORALIS | ✅ Active |
| **Shardeum** | 8118 | Blockscout | SHARDEUM | ✅ Active |

### Testnet Networks

| Network | ChainId | Explorer Type | API Service | Status |
|---------|---------|---------------|-------------|--------|
| SuperSeed Testnet | 53302 | Blockscout | SUPERSEED | ✅ Supported |

### Notes

- **Optimism**: Uses Moralis API (`OPTIMISM_MORALIS`) for transaction history (separate from portfolio Blockscout usage)
- **Base**: Uses Moralis API (`BASE_MORALIS`) for balance and transaction history
- **Arbitrum**: Uses Moralis API (`ARBITRUM_MORALIS`) for transaction history
- **Ethereum**: Uses Blockscout API (`ETHEREUM`) - Etherscan adapter planned for future
- **Shardeum**: Uses Blockscout API (`SHARDEUM`) for transaction history

## Adding New Networks

### Option 1: Network with Blockscout

1. Add API configuration in `apiConfig.js`:
```javascript
NEW_NETWORK: {
  API_KEY: null,
  BASE_URL: 'https://explorer.newnetwork.com/api/v2',
  TIMEOUT: 30000,
  RATE_LIMIT: { MAX_REQUESTS: 300, TIME_WINDOW: 60000 }
}
```

2. Add to `explorerConfig.js`:
```javascript
42: {  // chainId
  type: EXPLORER_TYPE.BLOCKSCOUT,
  apiServiceKey: 'NEW_NETWORK',
  supportsTransactionHistory: true,
  supportsTokenTransfers: true,
  networkName: 'New Network'
}
```

### Option 2: Network with Moralis

1. Add API configuration in `apiConfig.js`:
```javascript
NEW_NETWORK_MORALIS: {
  API_KEY: process.env.MORALIS_API_KEY,  // Can be array for rotation
  BASE_URL: 'https://deep-index.moralis.io/api/v2.2',
  TIMEOUT: 30000,
  RATE_LIMIT: { MAX_REQUESTS: 300, TIME_WINDOW: 60000 }
}
```

2. Add to `explorerConfig.js`:
```javascript
137: {  // chainId (example: Polygon)
  type: EXPLORER_TYPE.MORALIS,
  apiServiceKey: 'NEW_NETWORK_MORALIS',
  supportsTransactionHistory: true,
  supportsTokenTransfers: true,
  networkName: 'Polygon'
}
```

3. Update `getMoralisChainId` in `MoralisAdapter.js`:
```javascript
function getMoralisChainId(chainId) {
  const chainMap = {
    1: 'eth',
    10: 'optimism',
    56: 'bsc',
    137: 'polygon',  // Add new chain
    42161: 'arbitrum',
    8453: 'base',
    // Add more as needed
  };
  
  return chainMap[chainId] || chainId.toString();
}
```

## API Reference

### TransactionHistoryService

#### `getTransactionHistory(address, chainId, options)`

Fetches transaction history for an address on a specific chain.

**Parameters:**
- `address` (string): Wallet address
- `chainId` (number|string): Chain ID
- `options` (Object): Optional parameters
  - `limit` (number): Number of transactions (default: 10)
  - `type` (string): Transaction type filter
  - `page` (number): Page number for pagination

**Returns:** `Promise<Object>` with structure:
```javascript
{
  success: boolean,
  transactions: Array,
  totalCount: number,
  pagination: Object,
  _meta: Object
}
```

#### `getTokenTransfers(address, chainId, options)`

Fetches token transfer history for an address.

**Parameters:**
- `address` (string): Wallet address
- `chainId` (number|string): Chain ID
- `options` (Object): Optional parameters
  - `limit` (number): Number of transfers (default: 10)
  - `tokenAddress` (string): Filter by specific token

**Returns:** `Promise<Object>` with token transfer data

#### `getCombinedHistory(address, chainId, options)`

Fetches combined transaction and token transfer history.

**Parameters:**
- `address` (string): Wallet address
- `chainId` (number|string): Chain ID
- `options` (Object): Optional parameters
  - `limit` (number): Items per type (default: 5)
  - `includeTransactions` (boolean): Include transactions (default: true)
  - `includeTokenTransfers` (boolean): Include token transfers (default: true)

**Returns:** `Promise<Object>` with combined history

#### `isSupported(chainId)`

Checks if transaction history is supported for a chainId.

**Parameters:**
- `chainId` (number|string): Chain ID to check

**Returns:** `boolean`

## Design Benefits

1. **Extensible**: Adding new networks is trivial
2. **Maintainable**: Each adapter is independent
3. **Efficient**: Adapter caching, per-adapter rate limiting
4. **Robust**: Error handling at every layer
5. **Type-safe**: Complete JSDoc in all files
6. **Clean Architecture**: Clear separation of concerns
7. **Testable**: Each component can be tested independently

## Future Improvements

- [ ] Add Etherscan adapter for Ethereum mainnet (currently using Blockscout)
- [ ] Implement complete pagination in frontend
- [ ] Add advanced filters (by date, type, amount, etc.)
- [ ] Persistent cache for recent transactions (IndexedDB)
- [ ] Support for NFT transfers (ERC-721, ERC-1155)
- [ ] WebSocket subscriptions for real-time transaction updates
- [ ] Transaction details modal with decoded transaction data
- [ ] Export transaction history to CSV/JSON
- [ ] Multi-address transaction history aggregation
- [ ] Transaction search functionality
- [ ] Transaction categorization (swap, transfer, contract interaction, etc.)

## Troubleshooting

### No transactions showing on BSC
- Verify `MORALIS_API_KEY` is configured in environment
- Check browser console for API errors
- Verify wallet has transaction history on BSC

### Transactions from wrong network
- Check that `chainId` is being passed correctly through the call chain
- Verify `explorerConfig.js` has correct chainId mapping
- Check logs for "Getting combined history for &#123;address&#125; on chainId &#123;id&#125;"

### Rate limit errors
- Each adapter has independent rate limiting
- Default: 300 requests per 60 seconds
- Adjust in `apiConfig.js` if needed

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.0+  
**Maintenance:** Review after adding new networks or explorer adapters


**Document Status:** ✅ Current as of February 10, 2026  
**Code Version:** v3.1.8
