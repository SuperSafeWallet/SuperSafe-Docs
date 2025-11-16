---
sidebar_position: 4
---

# 🌐 External APIs

SuperSafe Wallet integrates with multiple external APIs for blockchain data, token prices, and swap operations.

## Bebop API

**Base URL:** `https://api.bebop.xyz/jam/&#123;network&#125;/v2/`

### GET /quote

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

### POST /order

Submit signed order.

**Body:**
```json
{
  "signature": "0x...",
  "quote_id": "..."
}
```

---

## SuperSeed RPC

**Endpoint:** `https://mainnet.superseed.xyz`

Standard JSON-RPC 2.0 methods:
- `eth_blockNumber`
- `eth_getBalance`
- `eth_sendRawTransaction`
- `eth_call`
- `eth_estimateGas`

---

## SuperSafe Price API

**Base URL:** `https://api.supersafe.cool/api/v1/`

### GET /tokens/&#123;address&#125;/price24h

Get 24h price data for a single token.

**URL:** `GET /tokens/&#123;address&#125;/price24h?chain_id=&#123;chainId&#125;`

**Parameters:**
- `address` (path, required) - Token contract address
- `chain_id` (query, optional) - Chain ID (5330=SuperSeed, 10=Optimism, 56=BSC, 1=Ethereum, 8453=Base)

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

### GET /tokens/price24h

Batch endpoint - Get 24h price data for multiple tokens.

**URL:** `GET /tokens/price24h?chain_id=&#123;chainId&#125;&addresses=&#123;addr1,addr2,...&#125;`

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
    }
  ],
  "total": 1
}
```

### Supported Networks

| Network | Chain ID | Status | Rate Limit |
|---------|----------|--------|------------|
| SuperSeed | 5330 | ✅ Active | 1000 req/min |
| Optimism | 10 | ✅ Active | 1000 req/min |
| BSC | 56 | ✅ Active | 1000 req/min |
| Ethereum | 1 | ✅ Active | 1000 req/min |
| Base | 8453 | ✅ Active | 1000 req/min |

---

## Relay.link API

**Base URL:** `https://api.relay.link/`

### Cross-Chain Swap Endpoints

- `GET /quote` - Get cross-chain swap quote
- `POST /execute` - Execute cross-chain swap
- `GET /status` - Check transaction status

**Supported Networks:** 85+ blockchains including SuperSeed, Ethereum, Optimism, Base, BSC, Arbitrum

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.2+

