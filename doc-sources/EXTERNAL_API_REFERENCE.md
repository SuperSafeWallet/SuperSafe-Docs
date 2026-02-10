# External API Reference

**Created:** October 13, 2025  
**Last Updated:** February 9, 2026  
**Version:** 3.1.8  
**Status:** ✅ CURRENT  
**Last Code Update:** February 9, 2026

**Scope:** Complete inventory of all external API calls made by the SuperSafe Wallet extension

This document provides a comprehensive reference of all external API services consumed by the SuperSafe Wallet extension, including endpoints, parameters, and authentication requirements.

---

## Important Security Notice

> **API Proxy Migration (December 2025)**
>
> All sensitive API calls (Moralis, CoinGecko, RPC endpoints) now route through the SuperSafe API proxy at `api.supersafe.cool`. API keys are stored server-side and are **never exposed in the extension bundle**.
>
> - **Installation Token Authentication**: Each extension install has a unique token
> - **No Direct API Keys**: Moralis, CoinGecko, and RPC keys handled server-side
> - **See**: [API_PROXY_MIGRATION_REPORT.md](./Audits/API_PROXY_MIGRATION_REPORT.md)

---

## SuperSafe Proxy System

### Overview

The extension uses a proxy system to protect sensitive API keys. All calls to Moralis, CoinGecko, and RPC endpoints route through `api.supersafe.cool`.

### Authentication

```
X-Installation-Token: {token}
```

The installation token is:
- Generated on first extension install
- Stored in `chrome.storage.local`
- Automatically refreshed on 401 responses
- Unique per extension installation

### Proxy Endpoints

| External Service | Proxy Endpoint |
|-----------------|----------------|
| Moralis API | `/api/v1/proxy/moralis/*` |
| CoinGecko API | `/api/v1/proxy/coingecko/*` |
| RPC (all chains) | `/api/v1/proxy/rpc/{chainId}` |

### Implementation Files

- `src/background/api/InstallationManager.js` - Token lifecycle
- `src/background/api/SuperSafeProxyClient.js` - HTTP client
- `src/background/api/ProxyServices.js` - Service-specific methods

---

## Table of Contents

1. [SuperSafe Price API](#1-supersafe-price-api)
2. [Bebop Swap API](#2-bebop-swap-api)
3. [Relay.link Cross-Chain API](#3-relaylink-cross-chain-api)
4. [Moralis API](#4-moralis-api)
5. [Blockscout API](#5-blockscout-api)
6. [SuperSeed Explorer API](#6-superseed-explorer-api)
7. [CoinGecko API](#7-coingecko-api)
8. [WalletConnect / Reown](#8-walletconnect--reown)
9. [Token Logo Providers](#9-token-logo-providers)
10. [GoPlus Labs Security API](#10-goplus-labs-security-api)
11. [RPC Endpoints (Moralis Nodes)](#11-rpc-endpoints-moralis-nodes)
12. [Deprecated / Unused APIs](#12-deprecated--unused-apis)

---

## 1. SuperSafe Price API

**Base URL:** `https://api.supersafe.cool`  
**Authentication:** API Key via `X-API-Key` header  
**Purpose:** Token price data, 24h price history, and portfolio calculations

### 1.1 Get Token Price (24h Data)

```
GET /api/v1/tokens/{contractAddress}/price24h
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `contractAddress` | string | path | Yes | Token contract address (0x-prefixed, 40 hex chars) |
| `chain_id` | number | query | No | Chain ID to filter results (e.g., 5330, 10, 56) |

**Headers:**
```
Accept: application/json
X-API-Key: {SUPERSAFE_API_KEY}
```

**Response:**
```json
{
  "price_now": 1.234,
  "price_24h_ago": 1.200,
  "chain_id": 5330
}
```

**Usage in codebase:** `src/background/services/SuperSafeApiWrapper.js` - `getTokenPriceDataWrapper()`

---

### 1.2 Get Native Token Price (ETH/BNB)

```
GET /api/v1/tokens/0x0000000000000000000000000000000000000000/price24h
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `chain_id` | number | query | No | Chain ID (5330=SuperSeed, 10=Optimism, 56=BSC, etc.) |

**Usage in codebase:** `src/background/services/SuperSafeApiWrapper.js` - `getNativeTokenPriceDataWrapper()`

---

### 1.3 Get Token Prices by Chain (Bulk)

```
GET /api/v1/tokens/price24h
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `chain_id` | number | query | Yes | Chain ID to filter |
| `symbols` | string | query | No | Comma-separated token symbols |
| `addresses` | string | query | No | Comma-separated token addresses |
| `limit` | number | query | No | Max tokens (default: 100, max: 1000) |
| `offset` | number | query | No | Pagination offset |

**Usage in codebase:** `src/background/services/SuperSafeApiWrapper.js` - `getTokenPricesByChain()`, `getBatchTokenPrices()`

---

### 1.4 Get Token Historical Data

```
GET /api/v1/tokens/{contractAddress}/historical/{period}
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `contractAddress` | string | path | Yes | Token contract address |
| `period` | string | path | Yes | Time period (e.g., "24h", "7d", "30d") |
| `chain_id` | number | query | No | Chain ID filter |

**Usage in codebase:** `src/background/handlers/streams/ApiStreamHandler.js` - `API_GET_TOKEN_HISTORICAL_DATA`

---

### 1.5 Get Available Historical Tokens

```
GET /api/v1/tokens/historical/available
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `chain_id` | number | query | No | Chain ID filter |

**Usage in codebase:** `src/background/handlers/streams/ApiStreamHandler.js` - `API_GET_AVAILABLE_HISTORICAL_TOKENS`

---

## 2. Bebop Swap API

**Base URL:** `https://api.bebop.xyz`  
**Authentication:** Partner auth via `source-auth` header  
**Purpose:** DEX aggregator for token swaps (MEV-protected)

### 2.1 JAM Quote API (v2)

```
GET /jam/{network}/v2/quote
```

**Supported Networks:**
- `ethereum`
- `optimism`
- `base`
- `arbitrum`
- `bsc`
- `superseed`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `sell_tokens` | string | query | Yes | Token address to sell |
| `buy_tokens` | string | query | Yes | Token address to buy |
| `sell_amounts` | string | query | Yes | Amount to sell (in wei) |
| `taker_address` | string | query | Yes | Wallet address executing swap |
| `slippage` | string | query | No | Slippage tolerance (e.g., "0.01" for 1%) |
| `approval_type` | string | query | No | "Standard" or "Permit2" |
| `gasless` | boolean | query | No | Enable gasless swap |
| `skip_taker_checks` | boolean | query | No | Skip taker balance checks |
| `fee_recipient` | string | query | No | Partner fee recipient address |
| `fee` | number | query | No | Partner fee in basis points |

**Headers:**
```
Accept: application/json
source-auth: {BEBOP_PARTNER_AUTH}
```

**Response:** Quote object containing `quoteId`, `toSign`, `tx`, `buyTokens`, `sellTokens`

**Usage in codebase:** `src/background/handlers/streams/SwapStreamHandler.js` - `SWAP_GET_QUOTE`

---

### 2.2 JAM Order Submission API (v2)

```
POST /jam/{network}/v2/order
```

**Body:**
```json
{
  "signature": "0x...",
  "quote_id": "quote_abc123"
}
```

**Headers:**
```
Content-Type: application/json; charset=utf-8
source-auth: {BEBOP_PARTNER_AUTH}
```

**Usage in codebase:** `src/background/handlers/streams/SwapStreamHandler.js` - `SWAP_SIGN_AND_SUBMIT`

---

### 2.3 Order Status API (v2)

```
GET /jam/{network}/v2/order
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `quote_id` | string | query | Yes | Quote/Order ID |

**Usage in codebase:** `src/background/handlers/streams/SwapStreamHandler.js` - `SWAP_POLL_ORDER_STATUS`

---

### 2.4 Token List API

```
GET /tokens/v1/{network}/tokenlist
```

**Supported Networks:** Same as JAM API

**Response:**
```json
{
  "tokens": [
    {
      "address": "0x...",
      "symbol": "USDC",
      "name": "USD Coin",
      "decimals": 6,
      "logoURI": "https://..."
    }
  ]
}
```

**Usage in codebase:** 
- `src/utils/bebopTokenService.js` - `fetchTokens()`
- `src/hooks/useTokenList.js`

---

## 3. Relay.link Cross-Chain API

**Base URL:** `https://api.relay.link`  
**Authentication:** None (AppFees configuration for partner revenue)  
**Purpose:** Cross-chain token swaps and bridging

### 3.1 Get Quote

```
POST /quote
```

**Body:**
```json
{
  "user": "0x...",
  "originChainId": 1,
  "destinationChainId": 8453,
  "originCurrency": "0x...",
  "destinationCurrency": "0x...",
  "amount": "1000000000000000000",
  "recipient": "0x...",
  "tradeType": "EXACT_INPUT",
  "appFees": [
    {
      "recipient": "0x...",
      "fee": "30"
    }
  ]
}
```

**Response:** Quote object with `steps`, `timeEstimate`, `fees`, `details`

**Usage in codebase:** `src/background/handlers/streams/RelayStreamHandler.js` - `handleGetQuote()`

---

### 3.2 Get Supported Chains

```
GET /chains
```

**Response:**
```json
{
  "chains": [
    {
      "id": 1,
      "displayName": "Ethereum",
      "tokenSupport": "All",
      "currency": {...},
      "featuredTokens": [...],
      "erc20Currencies": [...],
      "solverCurrencies": [...]
    }
  ]
}
```

**Usage in codebase:** `src/utils/relayTokenService.js` - `fetchTokens()`

---

### 3.3 Execute Swap

Swap execution is performed using the Relay SDK (`@reservoir0x/relay-sdk`) which internally calls the API.

```javascript
import { execute } from '@reservoir0x/relay-sdk';

const result = await execute({
  quote: quote,
  wallet: viemWallet,
  onProgress: (progress) => {...}
});
```

**Usage in codebase:** `src/background/handlers/streams/RelayStreamHandler.js` - `handleExecuteSwap()`

---

## 4. Moralis API

**Base URL:** `https://deep-index.moralis.io/api/v2.2`  
**Authentication:** API Key via `X-API-Key` header (supports key rotation)  
**Purpose:** Multi-chain blockchain data (balances, transactions, token transfers)

### 4.1 Get Wallet Token Balances

```
GET /wallets/{address}/tokens
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `address` | string | path | Yes | Wallet address |
| `chain` | string | query | Yes | Chain identifier (eth, bsc, optimism, arbitrum, base, monad) |

**Headers:**
```
Accept: application/json
X-API-Key: {MORALIS_API_KEY}
```

**Response:**
```json
{
  "result": [
    {
      "token_address": "0x...",
      "symbol": "USDC",
      "name": "USD Coin",
      "decimals": 6,
      "balance": "1000000000"
    }
  ]
}
```

**Usage in codebase:** `src/background/handlers/streams/ApiStreamHandler.js` - `API_GET_WALLET_BALANCES`

---

### 4.2 Get Native Balance

```
GET /{address}/balance
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `address` | string | path | Yes | Wallet address |
| `chain` | string | query | Yes | Chain identifier |

**Usage in codebase:** `src/background/handlers/streams/ApiStreamHandler.js` - `API_GET_WALLET_BALANCES`

---

### 4.3 Get Wallet Transaction History

```
GET /wallets/{address}/history
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `address` | string | path | Yes | Wallet address |
| `chain` | string | query | Yes | Chain identifier |
| `order` | string | query | No | Sort order ("DESC" or "ASC") |
| `limit` | number | query | No | Max results (default: 25) |
| `cursor` | string | query | No | Pagination cursor |
| `include_internal_transactions` | boolean | query | No | Include internal txs |

**Response:** Transaction history with `category`, `summary`, `erc20_transfers`, `native_transfers`, `nft_transfers`

**Usage in codebase:** `src/background/adapters/MoralisAdapter.js` - `getTransactionHistory()`

---

### 4.4 Get Token Transfers

```
GET /{address}/erc20/transfers
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `address` | string | path | Yes | Wallet address |
| `chain` | string | query | Yes | Chain identifier |
| `limit` | number | query | No | Max results |
| `cursor` | string | query | No | Pagination cursor |
| `contract_addresses[]` | string | query | No | Filter by token |

**Usage in codebase:** `src/background/adapters/MoralisAdapter.js` - `getTokenTransfers()`

---

## 5. Blockscout API

**Base URLs:**
- Ethereum: `https://eth.blockscout.com/api/v2`
- Base: `https://base.blockscout.com/api/v2`
- Arbitrum: `https://arbitrum.blockscout.com/api/v2`
- Optimism: `https://explorer.optimism.io/api/v2`
- Injective: `https://blockscout-api.injective.network/api/v2`
- Shardeum: `https://explorer.shardeum.org/api/v2`

**Authentication:** None (Public API)  
**Purpose:** Transaction history and token transfers for Blockscout-based explorers

### 5.1 Get Transaction History

```
GET /addresses/{address}/transactions
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `address` | string | path | Yes | Wallet address |
| `limit` | number | query | No | Max results |
| `type` | string | query | No | Transaction type filter |
| `page` | number | query | No | Page number |

**Usage in codebase:** `src/background/adapters/BlockscoutAdapter.js` - `getTransactionHistory()`

---

### 5.2 Get Token Transfers

```
GET /addresses/{address}/token-transfers
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `address` | string | path | Yes | Wallet address |
| `limit` | number | query | No | Max results |
| `type` | string | query | No | Transfer type filter |
| `page` | number | query | No | Page number |
| `token` | string | query | No | Filter by token address |

**Usage in codebase:** `src/background/adapters/BlockscoutAdapter.js` - `getTokenTransfers()`

---

### 5.3 Get Address Info (for ERC-20 tokens)

```
GET /addresses/{address}/tokens
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `address` | string | path | Yes | Wallet address |
| `type` | string | query | No | Token type (e.g., "ERC-20") |

**Usage in codebase:** `src/background/handlers/streams/ApiStreamHandler.js` - `API_GET_WALLET_BALANCES`

---

## 6. SuperSeed Explorer API

**Base URL:** `https://explorer-superseed-mainnet-0.t.conduit.xyz/api/v2`  
**Authentication:** None (Public API)  
**Purpose:** SuperSeed network-specific data (transactions, token transfers, NFTs)

### 6.1 Get Token Info

```
GET /addresses/{contractAddress}
```

**Response:**
```json
{
  "hash": "0x...",
  "name": "Token Name",
  "is_contract": true,
  "is_verified": true,
  "token": {
    "symbol": "TKN",
    "decimals": "18",
    "exchange_rate": "1.23",
    "total_supply": "1000000000000000000000",
    "holders_count": 1000,
    "volume_24h": "50000"
  }
}
```

**Usage in codebase:** `src/utils/superseedApi.js` - `getTokenInfo()`

---

### 6.2 Get Gas Price

```
GET /api/v1/lines/averageGasPrice
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `from` | string | query | Yes | Start date (YYYY-MM-DD) |
| `to` | string | query | Yes | End date (YYYY-MM-DD) |
| `resolution` | string | query | Yes | Time resolution ("DAY") |

**Usage in codebase:** `src/background/services/GasPriceService.js` - `getSuperSeedGasPrice()`

---

### 6.3 Get Transaction History

```
GET /addresses/{address}/transactions
```

**Parameters:** Same as Blockscout API

**Usage in codebase:** `src/utils/superseedApi.js` - `getTransactionHistory()`

---

### 6.4 Get Token Transfers

```
GET /addresses/{address}/token-transfers
```

**Parameters:** Same as Blockscout API

**Usage in codebase:** `src/utils/superseedApi.js` - `getTokenTransfers()`

---

### 6.5 Get NFT Collections

```
GET /addresses/{address}/nft/collections
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `address` | string | path | Yes | Wallet address |
| `type` | string | query | No | NFT type filter |

**Usage in codebase:** `src/utils/superseedApi.js` - `getNFTCollections()`

---

## 7. CoinGecko API

**Base URL:** `https://api.coingecko.com/api/v3`  
**Authentication:** Demo API Key via `x-cg-demo-api-key` header  
**Purpose:** Fallback price data for native tokens (when SuperSafe API unavailable)

### 7.1 Get Simple Price

```
GET /simple/price
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `ids` | string | query | Yes | CoinGecko token IDs (comma-separated) |
| `vs_currencies` | string | query | Yes | Target currency (e.g., "usd") |
| `include_24hr_change` | boolean | query | No | Include 24h price change |

**Headers:**
```
Accept: application/json
x-cg-demo-api-key: {COINGECKO_API_KEY}
```

**Response:**
```json
{
  "ethereum": {
    "usd": 2345.67,
    "usd_24h_change": 3.45
  }
}
```

**Supported Token Mappings:**
| Chain ID | CoinGecko ID |
|----------|--------------|
| 1 (Ethereum) | ethereum |
| 10 (Optimism) | optimism |
| 56 (BSC) | binancecoin |
| 8453 (Base) | ethereum |
| 42161 (Arbitrum) | ethereum |
| 5330 (SuperSeed) | ethereum |
| 8118 (Shardeum) | shardeum |
| 1776 (Injective) | injective-protocol |

**Usage in codebase:** `src/background/services/SuperSafeApiWrapper.js` - `getNativeTokenPriceFromCoinGecko()`

---

## 8. WalletConnect / Reown

**Relay URL:** `wss://relay.walletconnect.org`  
**Authentication:** Project ID  
**Purpose:** dApp connections via WalletConnect v2 protocol

### Configuration

```javascript
{
  projectId: process.env.WALLETCONNECT_PROJECT_ID,
  metadata: {
    name: 'SuperSafe Wallet',
    description: 'Secure wallet for SuperSeed blockchain',
    url: 'https://www.supersafe.cool/',
    icons: ['https://www.supersafe.cool/icon.png']
  },
  relayUrl: 'wss://relay.walletconnect.org'
}
```

**SDK Used:** `@walletconnect/core`, `@reown/walletkit`

**Usage in codebase:** `src/utils/walletConnectManager.js`

---

## 9. Token Logo Providers

The extension uses multiple logo providers with cascading fallback:

### 9.1 SmolDapp

**Base URL:** `https://assets.smold.app`

```
GET /api/token/{chainId}/{address}/logo-{size}.{format}
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `chainId` | number | EVM chain ID |
| `address` | string | Token address (lowercase) |
| `size` | number | Image size (32, 64, 128) |
| `format` | string | Image format (svg, png) |

**Supported Chains:** 1, 10, 56, 137, 250, 8453, 42161, 43114, 5330

**Usage in codebase:** `src/utils/logoProviders/logoFromSmolDapp.js`

---

### 9.2 TrustWallet Assets

**Base URL:** `https://raw.githubusercontent.com/trustwallet/assets/master`

**Token Logo:**
```
GET /blockchains/{chainSlug}/assets/{checksumAddress}/logo.png
```

**Native Coin Logo:**
```
GET /blockchains/{chainSlug}/info/logo.png
```

**Chain Slug Mapping:**
| Chain ID | Slug |
|----------|------|
| 1 | ethereum |
| 10 | optimism |
| 56 | smartchain |
| 137 | polygon |
| 8453 | base |
| 42161 | arbitrum |

**Usage in codebase:** `src/utils/logoProviders/logoFromTrustWallet.js`

---

### 9.3 Bebop S3 Images

**Status:** ❌ **REMOVED in v3.1.8**
**Reason:** S3 bucket deprecated/inaccessible.
**Replacement:** Use curated logo orchestrator.

---

### 9.4 Dune Echo (Native Token Logos)

**Status:** ❌ **REMOVED in v3.1.8**
**Reason:** Legacy API dependency removed.
**Replacement:** Use curated logo orchestrator.

---

## 10. GoPlus Labs Security API

**Base URL:** `https://api.gopluslabs.io`  
**Authentication:** None (Public API)  
**Purpose:** Real-time token security verification (honeypot detection, tax analysis, ownership checks)

### Overview

GoPlus Labs provides comprehensive token security analysis for ERC-20 tokens across multiple EVM chains. SuperSafe uses this API in Phase 3 of progressive loading to verify token safety before displaying them to users.

**Integration**: Non-blocking background verification (fail-open strategy)  
**Cache TTL**: 5 minutes  
**Rate Limit**: 5 requests/second (implemented client-side)

### Supported Networks

| Chain ID | Network | Status |
|----------|---------|--------|
| 1 | Ethereum | ✅ Supported |
| 56 | BSC | ✅ Supported |
| 10 | Optimism | ✅ Supported |
| 42161 | Arbitrum One | ✅ Supported |
| 8453 | Base | ✅ Supported |
| 5330 | SuperSeed | ❌ Not supported (verification skipped) |
| 8118 | Shardeum | ❌ Not supported (verification skipped) |
| 143 | Monad | ❌ Not supported (verification skipped) |

### 10.1 Token Security Check

```
GET /api/v1/token_security/{chainId}
```

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `chainId` | string | path | Yes | Network chain ID (1, 56, 10, 42161, 8453) |
| `contract_addresses` | string | query | Yes | Comma-separated token addresses (lowercase) |

**Example Request:**
```
GET https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=0x6b175474e89094c44da98b954eedeac495271d0f,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
```

**Response Structure:**
```json
{
  "code": 1,
  "message": "OK",
  "result": {
    "0x6b175474e89094c44da98b954eedeac495271d0f": {
      "is_honeypot": "0",
      "honeypot_with_same_creator": "0",
      "buy_tax": "0",
      "sell_tax": "0",
      "slippage_modifiable": "0",
      "is_open_source": "1",
      "is_proxy": "0",
      "can_take_back_ownership": "0",
      "hidden_owner": "0",
      "trading_cooldown": "0",
      "cannot_buy": "0",
      "cannot_sell_all": "0",
      "is_anti_whale": "0",
      "is_blacklisted": "0",
      "holder_count": "285432",
      "total_supply": "5183805150714820000000000000",
      "lp_holder_count": "158",
      "lp_total_supply": "12345678",
      "is_true_token": "1",
      "is_airdrop_scam": "0",
      "trust_list": "1",
      "gas_abuse": null,
      "note": "",
      "fake_token": null,
      "contract_name": "Dai Stablecoin",
      "token_name": "Dai",
      "token_symbol": "DAI",
      "creator_address": "0x9759a6ac90977b93b58547b4a71c78317f391a28",
      "creator_balance": "0",
      "creator_percent": "0",
      "owner_address": null,
      "owner_balance": "0",
      "owner_percent": "0",
      "owner_change_balance": "0",
      "holders": [
        {
          "address": "0x...",
          "tag": "Binance",
          "is_contract": 0,
          "balance": "123456789",
          "percent": "0.0234",
          "is_locked": 0
        }
      ]
    }
  }
}
```

### Security Indicators Reference

**CRITICAL Risk Indicators**:
- `is_honeypot`: "1" = Token cannot be sold after purchase (CRITICAL)
- `honeypot_with_same_creator`: "1" = Creator has honeypot history (CRITICAL)
- `cannot_sell_all`: "1" = Forced partial sells only (CRITICAL)
- `cannot_buy`: "1" = Buying disabled (CRITICAL)

**HIGH Risk Indicators**:
- `buy_tax`: Percentage (HIGH if > 0.10, i.e., 10%)
- `sell_tax`: Percentage (HIGH if > 0.10, i.e., 10%)
- `slippage_modifiable`: "1" = Taxes can be dynamically changed (HIGH)
- `hidden_owner`: "1" = Ownership hidden but still active (HIGH)
- `can_take_back_ownership`: "1" = Ownership can be reclaimed (HIGH)
- `trading_cooldown`: "1" = Artificial trading restrictions (HIGH)
- `gas_abuse`: "1" = Excessive gas consumption patterns (HIGH)

**MEDIUM Risk Indicators**:
- `is_open_source`: "0" = Contract not verified (MEDIUM)
- `is_proxy`: "1" = Upgradeable proxy contract (MEDIUM)
- `is_anti_whale`: "1" = Whale manipulation protections (MEDIUM, can be abused)
- `is_blacklisted`: "1" = Token on known blacklists (MEDIUM)
- `holder_count`: Number (MEDIUM if < 100)

**Additional Metadata**:
- `token_name`, `token_symbol`: Token identification
- `contract_name`: Contract name from source code
- `total_supply`: Total token supply
- `creator_address`, `creator_balance`, `creator_percent`: Creator info
- `owner_address`, `owner_balance`, `owner_percent`: Current owner info
- `trust_list`: "1" = Token on GoPlus trust list
- `is_airdrop_scam`: "1" = Known airdrop scam
- `fake_token`: "1" = Impersonation/fake token
- `holders`: Array of top holders with tags (exchanges, etc.)

### SuperSafe Risk Classification

SuperSafe maps GoPlus indicators to 4 risk levels:

**CRITICAL** (Permanently Removed):
- `is_honeypot` === "1" OR
- `honeypot_with_same_creator` === "1" OR
- `cannot_sell_all` === "1" OR
- `cannot_buy` === "1"

**HIGH** (Hidden in Safe Mode):
- `buy_tax` > 0.10 OR
- `sell_tax` > 0.10 OR
- `slippage_modifiable` === "1" OR
- `hidden_owner` === "1" OR
- `can_take_back_ownership` === "1" OR
- `trading_cooldown` === "1" OR
- `gas_abuse` === "1"

**MEDIUM** (Hidden in Safe Mode):
- `is_open_source` === "0" OR
- `is_proxy` === "1" OR
- `is_anti_whale` === "1" OR
- `is_blacklisted` === "1" OR
- `holder_count` < 100

**SAFE** (Always Visible):
- None of the above conditions met

### Rate Limiting

**Client-Side Implementation**:
- Maximum 5 requests per second
- Batching: Process 5 tokens, wait 1 second, next batch
- Typical portfolio (10-20 tokens): 2-4 seconds total

**Behavior on Rate Limit**:
- API returns HTTP 429
- Client retries with exponential backoff
- Falls back to fail-open (displays tokens without security flags)

### Error Handling

**Network Errors**:
```json
{
  "code": 0,
  "message": "Network error",
  "result": null
}
```
**Action**: Fail-open, display tokens without security verification

**Invalid Chain**:
```json
{
  "code": 0,
  "message": "Chain not supported",
  "result": null
}
```
**Action**: Skip verification, return empty results

**Invalid Address**:
```json
{
  "code": 0,
  "message": "Invalid contract address",
  "result": {}
}
```
**Action**: Mark token as SAFE (no data = no risk detected)

### Caching Strategy

**Cache Key**: `{chainId}:{tokenAddress}` (lowercase)
**TTL**: 5 minutes (300,000ms)
**Storage**: In-memory Map in GoPlusSecurityService
**Invalidation**: Automatic on expiry, manual on network switch

**Cache Hit Rate**: ~90% (typical usage)
**Cache Miss Latency**: 500-2000ms (API call + processing)

### Usage in SuperSafe

**Service**: `src/background/services/GoPlusSecurityService.js`

**Methods**:
- `checkTokenSecurity(chainId, tokenAddress)` - Single token check
- `batchCheckTokens(chainId, tokenAddresses[])` - Batch verification
- `analyzeRisk(goPlusData)` - Map indicators to risk level
- `isSupportedChain(chainId)` - Check chain support

**Stream Handler**: `src/background/handlers/streams/BlockchainStreamHandler.js`
- Message type: `VERIFY_TOKEN_SECURITY`
- Payload: `{ chainId, tokenAddresses[] }`

**Frontend Integration**: `src/hooks/usePortfolioData.js`
- Phase 3: Async IIFE after Phase 2 completes
- Non-blocking background execution
- Security flags applied: `is_dangerous`, `is_suspicious`, `is_critical_risk`

### API Documentation

**Official Docs**: https://docs.gopluslabs.io/
**API Status**: No status page available
**Support**: https://gopluslabs.io/

### Privacy & Security

**Data Sent to GoPlus**:
- Token contract addresses (public blockchain data)
- Chain ID (public information)

**Data NOT Sent**:
- User wallet addresses
- User balances
- User transaction history
- Any personal information

**HTTPS**: Required via CSP (`connect-src https://api.gopluslabs.io`)
**No Tracking**: GoPlus does not track individual users
**No Authentication**: Public API, no API key required

### See Also

- [SECURITY.md - Token Security Verification](./SECURITY.md#token-security-verification)
- [API_REFERENCE.md - VERIFY_TOKEN_SECURITY](./API_REFERENCE.md#verify_token_security)

---

## 11. RPC Endpoints (Moralis Nodes)

RPC calls are made via Moralis node endpoints for blockchain operations.

**Pattern:** `https://site1.moralis-nodes.com/{network}/mainnet/{apiKey}`

**Supported Networks:**
- Ethereum
- Optimism
- Base
- Arbitrum
- BSC
- Injective
- Shardeum
- SuperSeed
- Monad

### 11.1 eth_gasPrice

```json
POST {rpcUrl}
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_gasPrice"
}
```

**Usage in codebase:** `src/background/services/GasPriceService.js`

### 11.2 Standard EVM RPC Methods

Used for:
- Transaction sending (`eth_sendRawTransaction`)
- Balance queries (`eth_getBalance`)
- Contract calls (`eth_call`)
- Transaction receipts (`eth_getTransactionReceipt`)

**Configuration:** `src/background/config/networkConfig.js`

---

## 11. Deprecated / Unused APIs

### 11.1 DexTools API

**Base URL:** `https://api.dextools.io/v2`  
**Status:** Configured but not actively used  
**Authentication:** `X-API-Key` header

---

### 11.2 Dune SIM API

**Status:** ❌ **REMOVED in v3.1.8**
**Reason:** Legacy dependency removed from send form.

---

## Environment Variables Summary

| Variable | Service | Required |
|----------|---------|----------|
| `MORALIS_API_KEY` | Moralis | Yes |
| `MORALIS_API_KEY_BACKUP` | Moralis (rotation) | No |
| `MORALIS_API_KEY_BACKUP2` | Moralis (rotation) | No |
| `MORALIS_RPC_{NETWORK}_1` | RPC Nodes | Yes |
| `MORALIS_RPC_{NETWORK}_2` | RPC Nodes | Yes |
| `WALLETCONNECT_PROJECT_ID` | WalletConnect | Yes |
| `BEBOP_PARTNER_SOURCE` | Bebop | No |
| `BEBOP_PARTNER_AUTH` | Bebop | No |
| `BEBOP_PARTNER_FEE_BPS` | Bebop | No |
| `BEBOP_PARTNER_FEE_RECIPIENT` | Bebop | No |
| `RELAY_PARTNER_SOURCE` | Relay.link | No |
| `SUPERSAFE_API_KEY` | SuperSafe | No |
| `COINGECKO_API_KEY` | CoinGecko | No |
| `DEXTOOLS_API_KEY` | DexTools | No |
| `DEXTOOLS_API_KEY` | DexTools | No |

---

## Rate Limits

| API | Limit | Window |
|-----|-------|--------|
| Moralis | 300 requests | 60 seconds |
| SuperSafe | 300 requests | 60 seconds |
| CoinGecko (Free) | 50 requests | 60 seconds |
| DexTools | 50 requests | 60 seconds |
| Dune SIM | 30 requests | 60 seconds |
| Blockscout | 300 requests | 60 seconds |
| SuperSeed Explorer | Adaptive | N/A |

---

## Security Considerations

1. **API Keys Storage:** All API keys are stored in environment variables and only accessible in the background context
2. **Key Rotation:** Moralis supports multi-key rotation for load balancing
3. **Frontend Isolation:** Frontend bundle never has access to API keys
4. **RPC Security:** RPC URLs with embedded API keys are only accessible in background scripts
5. **User-Agent:** Configurable User-Agent to avoid detection as bot traffic

---


