# SuperSafe Wallet - Multichain Transaction History System

**Created:** October 29, 2025  
**Last Updated:** November 15, 2025  
**Version:** 1.0.0+  
**Status:** ✅ CURRENT  
**Last Code Update:** November 15, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Flow](#data-flow)
4. [Implementation Details](#implementation-details)
5. [Supported Networks](#supported-networks)
6. [Adding New Networks](#adding-new-networks)
7. [Testing](#testing)
8. [API Reference](#api-reference)
9. [Future Improvements](#future-improvements)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Implementation of a multichain system for transaction history visualization that supports different types of blockchain explorers depending on the network. Currently supports **7 active networks** with extensible adapter architecture for easy addition of new networks.

## Architecture

### 1. **Explorer Configuration** (`explorerConfig.js`)

Defines what type of explorer each network uses and its capabilities:

- **SuperSeed (5330, 53302)**: Blockscout API
- **Ethereum (1)**: Blockscout API
- **Optimism (10)**: Moralis API (OPTIMISM_MORALIS)
- **Base (8453)**: Moralis API (BASE_MORALIS)
- **BSC (56)**: Moralis API
- **Arbitrum (42161)**: Moralis API (ARBITRUM_MORALIS)
- **Shardeum (8118)**: Blockscout API
- **Future networks**: Easily extensible

### 2. **Adapters**

#### BlockscoutAdapter (`BlockscoutAdapter.js`)
- Generic adapter for Blockscout v2-based explorers
- Supports: SuperSeed, Ethereum, Shardeum, Injective (future)
- Endpoints:
  - `addresses/{address}/transactions` - Transaction history
  - `addresses/{address}/token-transfers` - Token transfers
- Features:
  - Integrated rate limiting
  - Robust error handling
  - Automatic retry logic

#### MoralisAdapter (`MoralisAdapter.js`)  
- Adapter for Moralis Web3 Data API
- Supports: Optimism, Base, BSC, Arbitrum, Ethereum (via Moralis)
- Endpoints:
  - `/{address}` - Transaction history
  - `/{address}/erc20/transfers` - ERC-20 transfers
- Features:
  - Automatic chainId to Moralis identifier mapping
  - Cursor-based pagination support
  - API key rotation support (multiple keys with round-robin)
  - Rate limiting per adapter instance

### 3. **Transaction History Service** (`TransactionHistoryService.js`)

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

## Implementation Details

### New Files Created

1. **`src/background/config/explorerConfig.js`**
   - Centralized explorer configuration by chainId
   - Helper functions to verify capabilities
   - Functions: `getExplorerConfig()`, `supportsTransactionHistory()`, `getChainIdsWithHistorySupport()`

2. **`src/background/adapters/BlockscoutAdapter.js`**
   - Generic adapter for Blockscout v2
   - Integrated rate limiting
   - Robust error handling
   - Methods: `getTransactionHistory()`, `getTokenTransfers()`, `getCombinedHistory()`

3. **`src/background/adapters/MoralisAdapter.js`**
   - Adapter for Moralis API
   - Automatic chainId to Moralis identifier mapping
   - Cursor-based pagination support
   - Methods: `getTransactionHistory()`, `getTokenTransfers()`, `getCombinedHistory()`

4. **`src/background/services/TransactionHistoryService.js`**
   - Singleton orchestrator service
   - Automatic adapter resolution
   - Instance caching for performance
   - Methods: `getTransactionHistory()`, `getTokenTransfers()`, `getCombinedHistory()`, `isSupported()`

### Modified Files

1. **`src/background/BackgroundControllers.js`** (lines 311-315)
   - `supportsTransactions` now determined dynamically from `explorerConfig`
   - Replaces hardcoded SuperSeed chainId check with extensible system

2. **`src/background/handlers/streams/ApiStreamHandler.js`** (lines 44-75, 471-513)
   - Uses `transactionHistoryService` instead of `callSuperSeedAPI`
   - Cases: `API_GET_TRANSACTION_HISTORY`, `API_GET_TOKEN_TRANSFERS`, `API_GET_COMBINED_HISTORY`
   - Properly passes chainId to service methods

3. **`src/background.js`** (lines 53, 736)
   - Import of `transactionHistoryService`
   - Passes service as dependency to `setupApiStreamHandler`

4. **`src/utils/apiProxy.js`** (lines 482-517)
   - `backgroundGetTokenTransfers`: Added `chainId` parameter
   - `backgroundGetCombinedHistory`: Added `chainId` parameter
   - Updated cache keys to include chainId

5. **`src/components/TransactionsList.jsx`** (lines 66, 225)
   - Passes `effectiveNetwork.chainId` to API calls
   - Enhanced logging with chainId information

6. **`src/utils/superseedApi.js`** (lines 623-643, 746-766)
   - `getTransactionHistory`: Added chainId parameter and SuperSeed validation
   - `getTokenTransfers`: Added chainId parameter and SuperSeed validation
   - Returns graceful error if chainId is not SuperSeed (5330, 53302)

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
  apiServiceKey: 'NEW_NETWORK_MORALIS',  // Use dedicated config
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

**Note:** For networks using Moralis, you can reuse the same API key configuration (like `BSC` or `OPTIMISM_MORALIS`) or create a dedicated configuration for better organization.

### Option 3: Network with Etherscan (Future)

When Etherscan adapter is implemented:

1. Add API configuration with Etherscan API key
2. Create `EtherscanAdapter` following same pattern as other adapters
3. Add to `explorerConfig.js` with `EXPLORER_TYPE.ETHERSCAN`

## Testing

To test the multichain system:

1. **SuperSeed (5330)**: Uses Blockscout API - Should work as before
2. **Ethereum (1)**: Uses Blockscout API - Verify transaction history loads
3. **Optimism (10)**: Uses Moralis API (`OPTIMISM_MORALIS`) - Verify transactions load
4. **Base (8453)**: Uses Moralis API (`BASE_MORALIS`) - Verify transactions load
5. **BSC (56)**: Uses Moralis API - Verify transactions load
6. **Arbitrum (42161)**: Uses Moralis API (`ARBITRUM_MORALIS`) - Verify transactions load
7. **Shardeum (8118)**: Uses Blockscout API - Verify transactions load
8. **Unsupported network**: Shows appropriate message

### Testing Checklist

- [ ] Test transaction history on all 7 active networks
- [ ] Verify token transfers load correctly
- [ ] Test combined history (transactions + token transfers)
- [ ] Verify network switching updates transaction history
- [ ] Check error handling for unsupported networks
- [ ] Verify rate limiting works correctly
- [ ] Test with wallets that have no transaction history

## Design Benefits

1. **Extensible**: Adding new networks is trivial
2. **Maintainable**: Each adapter is independent
3. **Efficient**: Adapter caching, per-adapter rate limiting
4. **Robust**: Error handling at every layer
5. **Type-safe**: Complete JSDoc in all files
6. **Clean Architecture**: Clear separation of concerns
7. **Testable**: Each component can be tested independently

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

## Important Notes

- **superseedApi.js**: Maintained for legacy compatibility, but new implementations should use `TransactionHistoryService`
- **Rate Limiting**: Each adapter manages its own rate limiting according to API limitations
- **Error Handling**: All methods return objects with `success: boolean` to facilitate error handling
- **Backwards Compatibility**: System maintains compatibility with existing code while migrating to new architecture
- **Security**: Never expose API keys in frontend code - all API calls go through background service

## Troubleshooting

### No transactions showing on BSC
- Verify `MORALIS_API_KEY` is configured in environment
- Check browser console for API errors
- Verify wallet has transaction history on BSC

### Transactions from wrong network
- Check that `chainId` is being passed correctly through the call chain
- Verify `explorerConfig.js` has correct chainId mapping
- Check logs for "Getting combined history for {address} on chainId {id}"

### Rate limit errors
- Each adapter has independent rate limiting
- Default: 300 requests per 60 seconds
- Adjust in `apiConfig.js` if needed

---

## Related Documentation

- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Architecture](./ARCHITECTURE.md) - System architecture overview
- [Blockchain Operations](./BLOCKCHAIN_OPERATIONS.md) - Blockchain interaction patterns
- [Transaction System](./TRANSACTION_SYSTEM.md) - Transaction management
- [Backend](./BACKEND.md) - Backend services and handlers

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.0+  
**Maintenance:** Review after adding new networks or explorer adapters
