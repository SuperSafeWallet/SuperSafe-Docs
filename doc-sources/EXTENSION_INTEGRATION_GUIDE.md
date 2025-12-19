# SuperSafe Extension Integration Guide

> **Version:** 2.0.0  
> **Last Updated:** 2025-12-04  
> **Target:** SuperSafe Wallet Chrome Extension

## Overview

This guide provides complete code examples and best practices for migrating the SuperSafe browser extension to use the secure API proxy system. After implementing this guide, your extension will:

1. ✅ Use secure installation tokens instead of exposed API keys
2. ✅ Route all external API calls through the SuperSafe proxy
3. ✅ Handle rate limiting with exponential backoff (429 responses)
4. ✅ Implement proper error handling and retry logic
5. ✅ Automatically regenerate tokens if they expire or are revoked

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Token Lifecycle](#token-lifecycle)
3. [Quick Start](#quick-start)
4. [Complete Implementation](#complete-implementation)
5. [Migration Checklist](#migration-checklist)
6. [Endpoint Mapping Reference](#endpoint-mapping-reference)
7. [Supported Chains](#supported-chains)
8. [Usage Examples](#usage-examples)
9. [Migration from Direct API Calls](#migration-from-direct-api-calls)
10. [Error Handling](#error-handling)
11. [Troubleshooting](#troubleshooting)
12. [Testing](#testing)
13. [Environment Variables to Remove](#environment-variables-to-remove)
14. [Manifest.json Updates](#manifestjson-updates)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     BEFORE (INSECURE)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Extension ──────────────────────────────> Moralis API             │
│      │                                         │                    │
│      │  X-API-Key: EXPOSED_KEY ❌               │                    │
│      │                                         │                    │
│      └──────────────────────────────────────> CoinGecko API         │
│                 x-cg-demo-api-key: EXPOSED ❌                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      AFTER (SECURE)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Extension ──────────────────────> api.supersafe.cool ───> Moralis │
│      │                                    │                         │
│      │  X-Installation-Token: ist_xxx ✅   │ X-API-Key: HIDDEN ✅    │
│      │                                    │                         │
│      └─────────────────────────────────────────────────────> CoinGecko
│                                           │                         │
│                                           └─────────────────> RPC   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Benefits:**
- API keys never leave the server
- Per-installation rate limiting (not shared across all users)
- Centralized caching reduces external API costs
- Easy key rotation without extension updates
- Abuse detection and blocking

---

## Token Lifecycle

### How Installation Tokens Work

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOKEN LIFECYCLE                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. FIRST INSTALL                                                   │
│     ┌─────────────┐                                                 │
│     │  Extension  │──── POST /auth/register ────> API               │
│     │  Installed  │                                                 │
│     └─────────────┘<─── { installation_token: "ist_xxx" } ──────    │
│           │                                                         │
│           ▼                                                         │
│     ┌─────────────┐                                                 │
│     │   chrome    │  Token stored locally                           │
│     │   storage   │  (persists across browser restarts)             │
│     └─────────────┘                                                 │
│                                                                     │
│  2. SUBSEQUENT REQUESTS                                             │
│     ┌─────────────┐                                                 │
│     │  Extension  │──── GET /proxy/moralis/... ────> API            │
│     │             │     X-Installation-Token: ist_xxx               │
│     └─────────────┘                                                 │
│                                                                     │
│  3. TOKEN INVALID (401)                                             │
│     ┌─────────────┐                                                 │
│     │  Extension  │──── Any request ────> API returns 401           │
│     │             │                                                 │
│     └─────────────┘                                                 │
│           │                                                         │
│           ▼  Automatic re-registration                              │
│     ┌─────────────┐                                                 │
│     │  Extension  │──── POST /auth/register ────> API               │
│     │             │     (same installation_id)                      │
│     └─────────────┘<─── { installation_token: "ist_NEW" } ──────    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Token Properties

| Property | Value |
|----------|-------|
| Format | `ist_` + 40 random characters |
| Expiration | **Never** (tokens don't expire) |
| Revocation | Admin can revoke abusive tokens |
| Storage | `chrome.storage.local` |
| Regeneration | Automatic on 401 response |

### When Tokens Become Invalid

1. **Admin revocation** - Token revoked due to abuse
2. **Database cleanup** - Inactive tokens purged after 90 days
3. **Storage cleared** - User cleared extension data

**The extension handles all these cases automatically** by re-registering.

---

## Quick Start

### 1. Install Dependencies (if using TypeScript)

```bash
npm install --save-dev @types/chrome
```

### 2. Add Required Files

Create these files in your extension's `src/api/` directory:

| File | Purpose |
|------|---------|
| `installation-manager.ts` | Token registration, storage, validation |
| `supersafe-client.ts` | HTTP client with auth, retries, rate limiting |
| `proxy-services.ts` | Service-specific methods (Moralis, CoinGecko, RPC) |

### 3. Initialize on Extension Startup

```typescript
// In your background.ts or service-worker.ts
import { installationManager } from './api/installation-manager';

// Initialize when extension is installed or started
chrome.runtime.onInstalled.addListener(async () => {
  await installationManager.initialize();
});

chrome.runtime.onStartup.addListener(async () => {
  await installationManager.initialize();
});
```

### 4. Replace Direct API Calls

```diff
- // OLD: Direct Moralis call with exposed key
- const response = await fetch(
-   `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=eth`,
-   { headers: { 'X-API-Key': process.env.MORALIS_API_KEY } }
- );

+ // NEW: Via SuperSafe proxy
+ import { moralisProxy } from './api/proxy-services';
+ const tokens = await moralisProxy.getWalletTokens(address, 1);
```

---

## Complete Implementation

### Installation Manager (`installation-manager.ts`)

```typescript
/**
 * Manages installation token lifecycle for SuperSafe extension.
 * Handles registration, storage, and token refresh.
 */

const API_BASE_URL = 'https://api.supersafe.cool/api/v1';
const STORAGE_KEYS = {
  INSTALLATION_ID: 'supersafe_installation_id',
  INSTALLATION_TOKEN: 'supersafe_installation_token',
  TOKEN_CREATED_AT: 'supersafe_token_created_at',
};

export class InstallationManager {
  private static instance: InstallationManager;
  private token: string | null = null;
  private installationId: string | null = null;

  private constructor() {}

  static getInstance(): InstallationManager {
    if (!InstallationManager.instance) {
      InstallationManager.instance = new InstallationManager();
    }
    return InstallationManager.instance;
  }

  /**
   * Initialize the installation manager.
   * Should be called when extension starts.
   */
  async initialize(): Promise<void> {
    await this.loadFromStorage();
    
    if (!this.token) {
      await this.register();
    } else {
      // * Validate existing token
      const isValid = await this.validateToken();
      if (!isValid) {
        await this.register();
      }
    }
  }

  /**
   * Get the current installation token.
   * Ensures token is valid before returning.
   */
  async getToken(): Promise<string> {
    if (!this.token) {
      await this.initialize();
    }
    return this.token!;
  }

  /**
   * Get or generate installation ID.
   */
  private async getInstallationId(): Promise<string> {
    if (this.installationId) {
      return this.installationId;
    }

    const result = await chrome.storage.local.get(STORAGE_KEYS.INSTALLATION_ID);
    
    if (result[STORAGE_KEYS.INSTALLATION_ID]) {
      this.installationId = result[STORAGE_KEYS.INSTALLATION_ID];
      return this.installationId!;
    }

    // * Generate new UUID
    this.installationId = crypto.randomUUID();
    await chrome.storage.local.set({
      [STORAGE_KEYS.INSTALLATION_ID]: this.installationId,
    });

    return this.installationId;
  }

  /**
   * Load token from storage.
   */
  private async loadFromStorage(): Promise<void> {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.INSTALLATION_TOKEN,
      STORAGE_KEYS.INSTALLATION_ID,
    ]);

    this.token = result[STORAGE_KEYS.INSTALLATION_TOKEN] || null;
    this.installationId = result[STORAGE_KEYS.INSTALLATION_ID] || null;
  }

  /**
   * Register with the API and get a new token.
   */
  private async register(): Promise<void> {
    const installationId = await this.getInstallationId();
    const manifest = chrome.runtime.getManifest();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          installation_id: installationId,
          extension_version: manifest.version,
          user_agent: navigator.userAgent,
        }),
      });

      if (response.status === 409) {
        // * Already registered - this shouldn't happen normally
        // * Clear local storage and try with new ID
        console.warn('Installation ID conflict, generating new ID...');
        await this.clearStorage();
        this.installationId = null;
        return this.register();
      }

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.status}`);
      }

      const data = await response.json();
      this.token = data.installation_token;

      // * Save to storage
      await chrome.storage.local.set({
        [STORAGE_KEYS.INSTALLATION_TOKEN]: this.token,
        [STORAGE_KEYS.TOKEN_CREATED_AT]: Date.now(),
      });

      console.log('SuperSafe: Installation registered successfully');
    } catch (error) {
      console.error('SuperSafe: Registration failed', error);
      throw error;
    }
  }

  /**
   * Validate the current token.
   */
  private async validateToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'X-Installation-Token': this.token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return false;

      const data = await response.json();
      return data.valid === true;
    } catch {
      return false;
    }
  }

  /**
   * Clear stored credentials.
   */
  async clearStorage(): Promise<void> {
    await chrome.storage.local.remove([
      STORAGE_KEYS.INSTALLATION_TOKEN,
      STORAGE_KEYS.TOKEN_CREATED_AT,
    ]);
    this.token = null;
  }

  /**
   * Handle token invalidation.
   * Called when API returns 401.
   */
  async handleInvalidToken(): Promise<string> {
    await this.clearStorage();
    await this.register();
    return this.token!;
  }
}

export const installationManager = InstallationManager.getInstance();
```

### SuperSafe API Client (`supersafe-client.ts`)

```typescript
/**
 * Main API client for SuperSafe extension.
 * Handles authentication, rate limiting, and retries.
 */

import { installationManager } from './installation-manager';

const API_BASE_URL = 'https://api.supersafe.cool/api/v1';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  maxRetries?: number;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  type: string;
}

export class SuperSafeClient {
  private static instance: SuperSafeClient;
  private rateLimitInfo: RateLimitInfo | null = null;

  private constructor() {}

  static getInstance(): SuperSafeClient {
    if (!SuperSafeClient.instance) {
      SuperSafeClient.instance = new SuperSafeClient();
    }
    return SuperSafeClient.instance;
  }

  /**
   * Make an authenticated request to the API.
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, maxRetries = 3, ...fetchOptions } = options;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await this.makeRequest(endpoint, fetchOptions, skipAuth);
        
        // * Update rate limit info from headers
        this.updateRateLimitInfo(response);

        // * Handle rate limiting (429)
        if (response.status === 429) {
          const retryAfter = this.getRetryAfter(response);
          console.warn(`Rate limited. Waiting ${retryAfter}s...`);
          await this.sleep(retryAfter * 1000);
          continue;
        }

        // * Handle server capacity (503)
        if (response.status === 503) {
          const delay = this.calculateBackoff(attempt);
          console.warn(`Server capacity exceeded. Retrying in ${delay}ms...`);
          await this.sleep(delay);
          continue;
        }

        // * Handle invalid token (401)
        if (response.status === 401 && !skipAuth) {
          console.warn('Token invalid, re-registering...');
          await installationManager.handleInvalidToken();
          continue;
        }

        // * Handle other errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new APIError(
            errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;
        
        if (error instanceof APIError) {
          throw error; // * Don't retry API errors
        }
        
        // * Network error - retry with backoff
        if (attempt < maxRetries - 1) {
          const delay = this.calculateBackoff(attempt);
          console.warn(`Request failed, retrying in ${delay}ms...`, error);
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  /**
   * Make a single request.
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit,
    skipAuth: boolean
  ): Promise<Response> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!skipAuth) {
      const token = await installationManager.getToken();
      (headers as Record<string, string>)['X-Installation-Token'] = token;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  }

  /**
   * Update rate limit info from response headers.
   */
  private updateRateLimitInfo(response: Response): void {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    const type = response.headers.get('X-RateLimit-Type');

    if (limit && remaining && reset) {
      this.rateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        type: type || 'unknown',
      };

      // * Warn when running low
      if (this.rateLimitInfo.remaining < 5) {
        console.warn(
          `SuperSafe: Low rate limit - ${this.rateLimitInfo.remaining}/${this.rateLimitInfo.limit} remaining`
        );
      }
    }
  }

  /**
   * Get retry-after value from response.
   */
  private getRetryAfter(response: Response): number {
    const retryAfter = response.headers.get('Retry-After');
    return retryAfter ? parseInt(retryAfter) : 60;
  }

  /**
   * Calculate backoff delay with jitter.
   */
  private calculateBackoff(attempt: number): number {
    const baseDelay = 1000;
    const maxDelay = 30000;
    const delay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000;
    return Math.min(delay + jitter, maxDelay);
  }

  /**
   * Sleep for specified milliseconds.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current rate limit status.
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo;
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const superSafeClient = SuperSafeClient.getInstance();
```

### Proxy Services (`proxy-services.ts`)

```typescript
/**
 * Service-specific clients for SuperSafe proxy endpoints.
 */

import { superSafeClient } from './supersafe-client';

// * ============================================
// * MORALIS PROXY SERVICE
// * ============================================

export interface TokenBalance {
  token_address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  usd_price?: number;
}

export interface WalletTokensResponse {
  data: {
    result: TokenBalance[];
  };
  metrics: {
    duration_ms: number;
    cache_hit: boolean;
  };
}

export const moralisProxy = {
  /**
   * Get all token balances for a wallet.
   */
  async getWalletTokens(
    address: string,
    chainId: number
  ): Promise<TokenBalance[]> {
    const response = await superSafeClient.request<WalletTokensResponse>(
      `/proxy/moralis/wallets/${address}/tokens?chain_id=${chainId}`
    );
    return response.data.result;
  },

  /**
   * Get native balance for a wallet.
   */
  async getNativeBalance(
    address: string,
    chainId: number
  ): Promise<string> {
    const response = await superSafeClient.request<{
      data: { balance: string };
    }>(`/proxy/moralis/${address}/balance?chain_id=${chainId}`);
    return response.data.balance;
  },

  /**
   * Get transaction history for a wallet.
   */
  async getWalletHistory(
    address: string,
    chainId: number,
    limit = 100,
    cursor?: string
  ): Promise<{ result: any[]; cursor?: string }> {
    let url = `/proxy/moralis/wallets/${address}/history?chain_id=${chainId}&limit=${limit}`;
    if (cursor) {
      url += `&cursor=${encodeURIComponent(cursor)}`;
    }
    
    const response = await superSafeClient.request<{ data: any }>(url);
    return response.data;
  },

  /**
   * Get ERC20 transfers for a wallet.
   */
  async getERC20Transfers(
    address: string,
    chainId: number,
    options?: {
      limit?: number;
      cursor?: string;
      fromBlock?: number;
      toBlock?: number;
    }
  ): Promise<{ result: any[]; cursor?: string }> {
    const params = new URLSearchParams({
      chain_id: chainId.toString(),
      limit: (options?.limit || 100).toString(),
    });
    
    if (options?.cursor) params.set('cursor', options.cursor);
    if (options?.fromBlock) params.set('from_block', options.fromBlock.toString());
    if (options?.toBlock) params.set('to_block', options.toBlock.toString());
    
    const response = await superSafeClient.request<{ data: any }>(
      `/proxy/moralis/${address}/erc20/transfers?${params}`
    );
    return response.data;
  },
};

// * ============================================
// * COINGECKO PROXY SERVICE
// * ============================================

export interface PriceData {
  usd: number;
  usd_24h_change?: number;
  usd_market_cap?: number;
}

export const coingeckoProxy = {
  /**
   * Get prices for multiple tokens by CoinGecko ID.
   */
  async getPrices(
    ids: string[],
    currencies: string[] = ['usd']
  ): Promise<Record<string, PriceData>> {
    const response = await superSafeClient.request<{ data: any }>(
      `/proxy/coingecko/simple/price?ids=${ids.join(',')}&vs_currencies=${currencies.join(',')}&include_24hr_change=true`
    );
    return response.data;
  },

  /**
   * Get native token prices for multiple chains.
   */
  async getNativePrices(
    chainIds: number[],
    currencies: string[] = ['usd']
  ): Promise<Record<number, PriceData>> {
    const response = await superSafeClient.request<{ data: any }>(
      `/proxy/coingecko/native/prices?chain_ids=${chainIds.join(',')}&vs_currencies=${currencies.join(',')}`
    );
    return response.data;
  },

  /**
   * Get token price by contract address.
   */
  async getTokenPrice(
    chainId: number,
    contractAddress: string,
    currencies: string[] = ['usd']
  ): Promise<PriceData | null> {
    try {
      const response = await superSafeClient.request<{ data: any }>(
        `/proxy/coingecko/token/${chainId}/${contractAddress}?vs_currencies=${currencies.join(',')}`
      );
      return response.data[contractAddress.toLowerCase()] || null;
    } catch {
      return null;
    }
  },
};

// * ============================================
// * RPC PROXY SERVICE
// * ============================================

export interface RPCResponse<T = any> {
  jsonrpc: string;
  id: number;
  result: T;
  error?: {
    code: number;
    message: string;
  };
  _metrics?: {
    duration_ms: number;
    cache_hit: boolean;
  };
}

export const rpcProxy = {
  /**
   * Make a JSON-RPC request.
   */
  async request<T = any>(
    chainId: number,
    method: string,
    params: any[] = []
  ): Promise<T> {
    const response = await superSafeClient.request<RPCResponse<T>>(
      `/proxy/rpc/${chainId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: Date.now(),
        }),
      }
    );

    if (response.error) {
      throw new Error(`RPC Error: ${response.error.message}`);
    }

    return response.result;
  },

  /**
   * Get native balance via RPC.
   */
  async getBalance(chainId: number, address: string): Promise<bigint> {
    const result = await this.request<string>(chainId, 'eth_getBalance', [
      address,
      'latest',
    ]);
    return BigInt(result);
  },

  /**
   * Get current gas price.
   */
  async getGasPrice(chainId: number): Promise<bigint> {
    const result = await this.request<string>(chainId, 'eth_gasPrice', []);
    return BigInt(result);
  },

  /**
   * Get current block number.
   */
  async getBlockNumber(chainId: number): Promise<number> {
    const result = await this.request<string>(chainId, 'eth_blockNumber', []);
    return parseInt(result, 16);
  },

  /**
   * Execute a contract call.
   */
  async call(
    chainId: number,
    to: string,
    data: string,
    block: string = 'latest'
  ): Promise<string> {
    return this.request<string>(chainId, 'eth_call', [{ to, data }, block]);
  },

  /**
   * Send a signed transaction.
   */
  async sendRawTransaction(
    chainId: number,
    signedTx: string
  ): Promise<string> {
    return this.request<string>(chainId, 'eth_sendRawTransaction', [signedTx]);
  },

  /**
   * Estimate gas for a transaction.
   */
  async estimateGas(
    chainId: number,
    tx: { from?: string; to: string; data?: string; value?: string }
  ): Promise<bigint> {
    const result = await this.request<string>(chainId, 'eth_estimateGas', [tx]);
    return BigInt(result);
  },

  /**
   * Get supported chains.
   */
  async getSupportedChains(): Promise<
    Array<{ chain_id: number; url_count: number; status: string }>
  > {
    const response = await superSafeClient.request<{ chains: any[] }>(
      '/proxy/rpc/chains'
    );
    return response.chains;
  },
};
```

---

## Migration Checklist

Use this checklist to track your migration progress:

### Phase 1: Setup (30 min)

- [ ] Create `src/api/` directory in extension
- [ ] Add `installation-manager.ts`
- [ ] Add `supersafe-client.ts`
- [ ] Add `proxy-services.ts`
- [ ] Initialize in background script (`chrome.runtime.onInstalled`)
- [ ] Test token registration works

### Phase 2: Moralis Migration

Based on `SuperSafe_Extension_ApiCalls.md`, update these files:

| Original File | Function to Update | New Import |
|---------------|-------------------|------------|
| `src/background/handlers/streams/ApiStreamHandler.js` | `API_GET_WALLET_BALANCES` | `moralisProxy.getWalletTokens()` |
| `src/background/handlers/streams/ApiStreamHandler.js` | `API_GET_WALLET_BALANCES` | `moralisProxy.getNativeBalance()` |
| `src/background/adapters/MoralisAdapter.js` | `getTransactionHistory()` | `moralisProxy.getWalletHistory()` |
| `src/background/adapters/MoralisAdapter.js` | `getTokenTransfers()` | `moralisProxy.getERC20Transfers()` |

### Phase 3: CoinGecko Migration

| Original File | Function to Update | New Import |
|---------------|-------------------|------------|
| `src/background/services/SuperSafeApiWrapper.js` | `getNativeTokenPriceFromCoinGecko()` | `coingeckoProxy.getNativePrices()` |

### Phase 4: RPC Migration

| Original File | Function to Update | New Import |
|---------------|-------------------|------------|
| `src/background/services/GasPriceService.js` | `eth_gasPrice` calls | `rpcProxy.getGasPrice()` |
| `src/background/config/networkConfig.js` | RPC URL configuration | `rpcProxy.request()` |
| All transaction files | `eth_sendRawTransaction` | `rpcProxy.sendRawTransaction()` |
| All contract calls | `eth_call` | `rpcProxy.call()` |
| All balance queries | `eth_getBalance` | `rpcProxy.getBalance()` |

### Phase 5: Cleanup

- [ ] Remove `MORALIS_API_KEY` from extension environment
- [ ] Remove `MORALIS_API_KEY_BACKUP` from extension environment
- [ ] Remove `MORALIS_API_KEY_BACKUP2` from extension environment
- [ ] Remove `COINGECKO_API_KEY` from extension environment
- [ ] Remove all `MORALIS_RPC_*` URLs from extension environment
- [ ] Update `manifest.json` - remove external API domains from permissions
- [ ] Test all functionality end-to-end
- [ ] Verify no API keys in bundled code (`grep -r "API_KEY" dist/`)

---

## Endpoint Mapping Reference

### Moralis API → SuperSafe Proxy

| Original Moralis Endpoint | SuperSafe Proxy Endpoint |
|---------------------------|--------------------------|
| `GET https://deep-index.moralis.io/api/v2.2/wallets/{address}/tokens?chain={chain}` | `GET /api/v1/proxy/moralis/wallets/{address}/tokens?chain_id={chainId}` |
| `GET https://deep-index.moralis.io/api/v2.2/{address}/balance?chain={chain}` | `GET /api/v1/proxy/moralis/{address}/balance?chain_id={chainId}` |
| `GET https://deep-index.moralis.io/api/v2.2/wallets/{address}/history?chain={chain}` | `GET /api/v1/proxy/moralis/wallets/{address}/history?chain_id={chainId}` |
| `GET https://deep-index.moralis.io/api/v2.2/{address}/erc20/transfers?chain={chain}` | `GET /api/v1/proxy/moralis/{address}/erc20/transfers?chain_id={chainId}` |

**Chain Parameter Mapping (Moralis string → Chain ID):**

| Moralis `chain` | Proxy `chain_id` |
|-----------------|------------------|
| `eth` | `1` |
| `optimism` | `10` |
| `bsc` | `56` |
| `polygon` | `137` |
| `base` | `8453` |
| `arbitrum` | `42161` |
| `monad` | `143` |

### CoinGecko API → SuperSafe Proxy

| Original CoinGecko Endpoint | SuperSafe Proxy Endpoint |
|-----------------------------|--------------------------|
| `GET https://api.coingecko.com/api/v3/simple/price?ids={ids}&vs_currencies={curr}` | `GET /api/v1/proxy/coingecko/simple/price?ids={ids}&vs_currencies={curr}` |
| (No direct equivalent) | `GET /api/v1/proxy/coingecko/native/prices?chain_ids={chainIds}&vs_currencies={curr}` |
| Token by contract | `GET /api/v1/proxy/coingecko/token/{chainId}/{contract}?vs_currencies={curr}` |

### RPC Endpoints → SuperSafe Proxy

**All RPC calls use a single endpoint pattern:**

```
POST /api/v1/proxy/rpc/{chain_id}
Content-Type: application/json
X-Installation-Token: ist_xxxxx

{
  "jsonrpc": "2.0",
  "method": "eth_call",
  "params": [...],
  "id": 1
}
```

| Original RPC URL | Proxy Chain ID |
|------------------|----------------|
| `https://site1.moralis-nodes.com/eth/mainnet/{key}` | `/proxy/rpc/1` |
| `https://site1.moralis-nodes.com/optimism/mainnet/{key}` | `/proxy/rpc/10` |
| `https://site1.moralis-nodes.com/bsc/mainnet/{key}` | `/proxy/rpc/56` |
| `https://site1.moralis-nodes.com/base/mainnet/{key}` | `/proxy/rpc/8453` |
| `https://site1.moralis-nodes.com/arbitrum/mainnet/{key}` | `/proxy/rpc/42161` |
| SuperSeed RPC | `/proxy/rpc/5330` |
| Monad RPC | `/proxy/rpc/143` |

**Supported RPC Methods (Whitelist):**

| Method | Description |
|--------|-------------|
| `eth_call` | Execute contract call (read) |
| `eth_getBalance` | Get native balance |
| `eth_getBlockByNumber` | Get block by number |
| `eth_getBlockByHash` | Get block by hash |
| `eth_getTransactionByHash` | Get transaction details |
| `eth_getTransactionReceipt` | Get transaction receipt |
| `eth_gasPrice` | Get current gas price |
| `eth_estimateGas` | Estimate gas for transaction |
| `eth_getCode` | Get contract bytecode |
| `eth_getLogs` | Get event logs |
| `eth_blockNumber` | Get current block number |
| `eth_chainId` | Get chain ID |
| `net_version` | Get network version |
| `eth_sendRawTransaction` | Submit signed transaction |

---

## Supported Chains

| Chain ID | Network | Moralis | CoinGecko | RPC | Native Token |
|----------|---------|---------|-----------|-----|--------------|
| 1 | Ethereum | ✅ | ✅ | ✅ | ETH |
| 10 | Optimism | ✅ | ✅ | ✅ | ETH |
| 56 | BSC | ✅ | ✅ | ✅ | BNB |
| 137 | Polygon | ✅ | ✅ | ❌ | MATIC |
| 8453 | Base | ✅ | ✅ | ✅ | ETH |
| 42161 | Arbitrum | ✅ | ✅ | ✅ | ETH |
| 5330 | SuperSeed | ❌ | ✅ (ETH) | ✅ | ETH |
| 143 | Monad | ✅ | ✅ | ✅ | MONAD |

---

## Usage Examples

### Initialize on Extension Startup

```typescript
// background.ts or service-worker.ts
import { installationManager } from './api/installation-manager';

// Register token on first install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('SuperSafe: First install, registering...');
  }
  await installationManager.initialize();
  console.log('SuperSafe: Extension initialized');
});

// Validate token on browser startup
chrome.runtime.onStartup.addListener(async () => {
  await installationManager.initialize();
  console.log('SuperSafe: Token validated');
});
```

### Get Wallet Balances

```typescript
import { moralisProxy, coingeckoProxy } from './api/proxy-services';

async function getWalletPortfolio(address: string, chainId: number) {
  // * Get token balances
  const tokens = await moralisProxy.getWalletTokens(address, chainId);
  
  // * Get native balance
  const nativeBalance = await moralisProxy.getNativeBalance(address, chainId);
  
  // * Get native token price
  const nativePrices = await coingeckoProxy.getNativePrices([chainId]);
  
  return {
    tokens,
    nativeBalance,
    nativePrice: nativePrices[chainId]?.usd || 0,
  };
}
```

### Make Contract Calls

```typescript
import { rpcProxy } from './api/proxy-services';

// * Example: Read ERC20 balance
async function getERC20Balance(
  chainId: number,
  tokenAddress: string,
  walletAddress: string
): Promise<bigint> {
  // * balanceOf(address) selector
  const selector = '0x70a08231';
  const paddedAddress = walletAddress.slice(2).padStart(64, '0');
  const data = selector + paddedAddress;
  
  const result = await rpcProxy.call(chainId, tokenAddress, data);
  return BigInt(result);
}
```

### Send Transaction

```typescript
import { rpcProxy } from './api/proxy-services';

async function sendTransaction(
  chainId: number,
  signedTx: string
): Promise<string> {
  try {
    const txHash = await rpcProxy.sendRawTransaction(chainId, signedTx);
    console.log('Transaction sent:', txHash);
    return txHash;
  } catch (error) {
    console.error('Failed to send transaction:', error);
    throw error;
  }
}
```

---

## Migration from Direct API Calls

### Moralis: Wallet Token Balances

```typescript
// ❌ BEFORE: Direct Moralis call (INSECURE)
// File: src/background/handlers/streams/ApiStreamHandler.js

const response = await fetch(
  `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=eth`,
  {
    headers: {
      'X-API-Key': process.env.MORALIS_API_KEY, // ! Exposed in bundle
    },
  }
);
const data = await response.json();
return data.result;
```

```typescript
// ✅ AFTER: Via SuperSafe Proxy (SECURE)
import { moralisProxy } from './api/proxy-services';

const tokens = await moralisProxy.getWalletTokens(address, 1); // chain_id = 1
// API key is never exposed to the extension
```

### Moralis: Native Balance

```typescript
// ❌ BEFORE
const response = await fetch(
  `https://deep-index.moralis.io/api/v2.2/${address}/balance?chain=eth`,
  {
    headers: { 'X-API-Key': process.env.MORALIS_API_KEY },
  }
);
const { balance } = await response.json();
```

```typescript
// ✅ AFTER
import { moralisProxy } from './api/proxy-services';

const balance = await moralisProxy.getNativeBalance(address, 1);
```

### Moralis: Transaction History

```typescript
// ❌ BEFORE
// File: src/background/adapters/MoralisAdapter.js

async getTransactionHistory(address, chain, limit = 25) {
  const response = await fetch(
    `https://deep-index.moralis.io/api/v2.2/wallets/${address}/history?chain=${chain}&limit=${limit}`,
    {
      headers: { 'X-API-Key': process.env.MORALIS_API_KEY },
    }
  );
  return response.json();
}
```

```typescript
// ✅ AFTER
import { moralisProxy } from './api/proxy-services';

async getTransactionHistory(address: string, chainId: number, limit = 25) {
  return moralisProxy.getWalletHistory(address, chainId, limit);
}
```

### CoinGecko: Native Token Prices

```typescript
// ❌ BEFORE
// File: src/background/services/SuperSafeApiWrapper.js

async getNativeTokenPriceFromCoinGecko(chainId) {
  const tokenId = CHAIN_TO_COINGECKO_ID[chainId]; // 'ethereum', 'binancecoin', etc.
  
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`,
    {
      headers: {
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY, // ! Exposed
      },
    }
  );
  return response.json();
}
```

```typescript
// ✅ AFTER
import { coingeckoProxy } from './api/proxy-services';

async getNativeTokenPrice(chainId: number) {
  const prices = await coingeckoProxy.getNativePrices([chainId]);
  return prices[chainId]; // { usd: 2345.67, usd_24h_change: 3.45 }
}

// Or for multiple chains at once:
const prices = await coingeckoProxy.getNativePrices([1, 10, 56, 8453]);
// { 1: {...}, 10: {...}, 56: {...}, 8453: {...} }
```

### RPC: Gas Price

```typescript
// ❌ BEFORE
// File: src/background/services/GasPriceService.js

async getGasPrice(chainId) {
  const rpcUrl = RPC_URLS[chainId]; // Contains API key in URL!
  
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_gasPrice',
      params: [],
      id: 1,
    }),
  });
  
  const { result } = await response.json();
  return BigInt(result);
}
```

```typescript
// ✅ AFTER
import { rpcProxy } from './api/proxy-services';

async getGasPrice(chainId: number): Promise<bigint> {
  return rpcProxy.getGasPrice(chainId);
}
```

### RPC: Send Transaction

```typescript
// ❌ BEFORE
async sendTransaction(chainId, signedTx) {
  const rpcUrl = RPC_URLS[chainId];
  
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_sendRawTransaction',
      params: [signedTx],
      id: Date.now(),
    }),
  });
  
  const { result, error } = await response.json();
  if (error) throw new Error(error.message);
  return result;
}
```

```typescript
// ✅ AFTER
import { rpcProxy } from './api/proxy-services';

async sendTransaction(chainId: number, signedTx: string): Promise<string> {
  return rpcProxy.sendRawTransaction(chainId, signedTx);
  // Includes automatic logging on server side for security auditing
}
```

### RPC: Contract Call (eth_call)

```typescript
// ❌ BEFORE
async readContract(chainId, contractAddress, callData) {
  const rpcUrl = RPC_URLS[chainId];
  
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{ to: contractAddress, data: callData }, 'latest'],
      id: 1,
    }),
  });
  
  const { result } = await response.json();
  return result;
}
```

```typescript
// ✅ AFTER
import { rpcProxy } from './api/proxy-services';

async readContract(chainId: number, contractAddress: string, callData: string) {
  return rpcProxy.call(chainId, contractAddress, callData);
}
```

---

## Error Handling

### HTTP Status Codes

The API returns these status codes:

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad Request | Fix request parameters |
| 401 | Unauthorized | Re-register (automatic) |
| 404 | Not Found | Check endpoint path |
| 429 | Rate Limited | Wait `Retry-After` seconds |
| 500 | Server Error | Retry with backoff |
| 502 | Bad Gateway | Upstream API issue, retry |
| 503 | Server Capacity | Retry with backoff |

### Rate Limiting Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 60        # Maximum requests per window
X-RateLimit-Remaining: 45    # Requests remaining
X-RateLimit-Reset: 1704067200 # Unix timestamp when limit resets
X-RateLimit-Type: default    # Rate limit category
```

When rate limited (429):
```
Retry-After: 30              # Seconds to wait before retrying
```

### Safe API Call Wrapper

```typescript
import { APIError, superSafeClient } from './api/supersafe-client';

/**
 * Wrapper for API calls with fallback support.
 * Handles rate limiting, server errors, and network issues.
 */
async function safeAPICall<T>(
  operation: () => Promise<T>,
  fallback: T,
  options?: {
    onRateLimit?: () => void;
    onError?: (error: Error) => void;
  }
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof APIError) {
      // * Rate limited - notify caller
      if (error.statusCode === 429) {
        console.warn('SuperSafe: Rate limited');
        options?.onRateLimit?.();
        return fallback;
      }
      
      // * Server capacity exceeded
      if (error.statusCode === 503) {
        console.warn('SuperSafe: Server busy');
        return fallback;
      }
      
      // * Upstream API error (Moralis/CoinGecko down)
      if (error.statusCode === 502) {
        console.warn('SuperSafe: Upstream service unavailable');
        return fallback;
      }
    }
    
    // * Log and notify
    console.error('SuperSafe: API call failed', error);
    options?.onError?.(error as Error);
    return fallback;
  }
}

// * Usage with callbacks
const tokens = await safeAPICall(
  () => moralisProxy.getWalletTokens(address, chainId),
  [], // * Fallback to empty array
  {
    onRateLimit: () => showToast('API rate limited, showing cached data'),
    onError: (e) => reportError(e),
  }
);
```

### Handling Token Invalidation

The `SuperSafeClient` automatically handles 401 responses by re-registering. However, you can also handle this manually:

```typescript
import { installationManager } from './api/installation-manager';

// * Force token refresh (e.g., user requests it)
async function refreshToken(): Promise<void> {
  await installationManager.handleInvalidToken();
  console.log('Token refreshed successfully');
}

// * Check token status
async function getTokenStatus(): Promise<{valid: boolean, remaining: number}> {
  const response = await fetch('https://api.supersafe.cool/api/v1/auth/status', {
    headers: {
      'X-Installation-Token': await installationManager.getToken(),
    },
  });
  return response.json();
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Registration failed: 500"

**Cause:** Server-side error during registration.

**Solution:**
```typescript
// Add retry logic to initialization
async function initializeWithRetry(maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await installationManager.initialize();
      return;
    } catch (error) {
      console.error(`Registration attempt ${i + 1} failed`, error);
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Failed to register after multiple attempts');
}
```

#### 2. "401 Unauthorized" on every request

**Cause:** Token was revoked or storage was cleared.

**Solution:** The client automatically re-registers, but if it persists:
```typescript
// Force clear and re-register
await installationManager.clearStorage();
await installationManager.initialize();
```

#### 3. "429 Too Many Requests" immediately

**Cause:** Rate limit already exhausted from previous requests.

**Solution:** Check rate limit headers and wait:
```typescript
const info = superSafeClient.getRateLimitInfo();
if (info && info.remaining === 0) {
  const waitTime = info.reset * 1000 - Date.now();
  console.log(`Rate limited. Reset in ${Math.ceil(waitTime / 1000)}s`);
}
```

#### 4. Chain ID not supported

**Cause:** Requested chain is not configured on the proxy.

**Solution:** Check supported chains:
```typescript
const chains = await rpcProxy.getSupportedChains();
console.log('Supported chains:', chains);
// [{chain_id: 1, url_count: 2, status: 'healthy'}, ...]
```

#### 5. RPC method not allowed

**Cause:** Method is not in the whitelist.

**Solution:** Check the [whitelist](#supported-rpc-methods-whitelist) above. Only standard read methods and `eth_sendRawTransaction` are allowed.

### Debug Mode

Enable debug logging in development:

```typescript
// Add to supersafe-client.ts
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(...args: any[]) {
  if (DEBUG) {
    console.log('[SuperSafe]', ...args);
  }
}

// Use in makeRequest
private async makeRequest(...) {
  debugLog('Request:', endpoint, options);
  const response = await fetch(...);
  debugLog('Response:', response.status, await response.clone().text());
  return response;
}
```

### Network Tab Inspection

To debug requests in Chrome DevTools:

1. Open extension background page (chrome://extensions → Inspect views: background page)
2. Go to Network tab
3. Filter by `api.supersafe.cool`
4. Check request/response headers and body

**Expected headers on requests:**
```
X-Installation-Token: ist_xxxxxxxxxxxxx
Content-Type: application/json
```

**Expected headers on responses:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1704067200
```

---

## Testing

### Mock the Client for Tests

```typescript
// __mocks__/supersafe-client.ts
export const superSafeClient = {
  request: jest.fn(),
  getRateLimitInfo: jest.fn().mockReturnValue({
    limit: 60,
    remaining: 59,
    reset: Date.now() / 1000 + 60,
    type: 'default',
  }),
};

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data: any
  ) {
    super(message);
  }
}
```

```typescript
// In your test file
import { moralisProxy } from './api/proxy-services';
import { superSafeClient, APIError } from './api/supersafe-client';

jest.mock('./api/supersafe-client');

describe('moralisProxy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getWalletTokens returns token list', async () => {
    (superSafeClient.request as jest.Mock).mockResolvedValue({
      data: { result: [{ symbol: 'USDT', balance: '1000' }] },
    });

    const tokens = await moralisProxy.getWalletTokens('0x123', 1);
    
    expect(tokens).toHaveLength(1);
    expect(tokens[0].symbol).toBe('USDT');
  });

  test('handles rate limiting', async () => {
    (superSafeClient.request as jest.Mock).mockRejectedValue(
      new APIError('Rate limited', 429, { retry_after: 30 })
    );

    await expect(moralisProxy.getWalletTokens('0x123', 1))
      .rejects.toThrow('Rate limited');
  });
});
```

### Integration Test with Real API

```typescript
// integration.test.ts (run manually, not in CI)
describe('SuperSafe API Integration', () => {
  test('can register and make request', async () => {
    await installationManager.initialize();
    
    const tokens = await moralisProxy.getWalletTokens(
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // vitalik.eth
      1 // Ethereum
    );
    
    expect(Array.isArray(tokens)).toBe(true);
  });
});
```

---

## Environment Variables to Remove

After migration, remove these from your extension's environment:

```bash
# ❌ REMOVE THESE FROM EXTENSION
MORALIS_API_KEY=xxx
MORALIS_API_KEY_BACKUP=xxx
MORALIS_API_KEY_BACKUP2=xxx
COINGECKO_API_KEY=xxx
MORALIS_RPC_ETHEREUM_1=xxx
MORALIS_RPC_ETHEREUM_2=xxx
MORALIS_RPC_OPTIMISM_1=xxx
MORALIS_RPC_OPTIMISM_2=xxx
MORALIS_RPC_BSC_1=xxx
MORALIS_RPC_BSC_2=xxx
MORALIS_RPC_BASE_1=xxx
MORALIS_RPC_BASE_2=xxx
MORALIS_RPC_ARBITRUM_1=xxx
MORALIS_RPC_ARBITRUM_2=xxx
MORALIS_RPC_SUPERSEED_1=xxx
MORALIS_RPC_SUPERSEED_2=xxx
MORALIS_RPC_MONAD_1=xxx
MORALIS_RPC_MONAD_2=xxx
```

These are now managed server-side by the SuperSafe API.

---

## Manifest.json Updates

Update your extension's permissions after migration:

```diff
{
  "permissions": [
    "storage",
-   "https://deep-index.moralis.io/*",
-   "https://api.coingecko.com/*",
-   "https://site1.moralis-nodes.com/*",
-   "https://site2.moralis-nodes.com/*"
+   "https://api.supersafe.cool/*"
  ]
}
```

---

## Related Documentation

- [Rate Limiting](RATE_LIMITING.md) - Understand rate limits and headers
- [Installation Tokens](INSTALLATION_TOKENS.md) - Token lifecycle details
- [Proxy API Reference](PROXY_API_REFERENCE.md) - Complete endpoint reference
- [Security Audit Response](SECURITY_AUDIT_RESPONSE.md) - How this addresses audit findings

---

## Changelog

### v2.0.0 (2025-12-04)
- Added installation token system
- Added API proxy for Moralis, CoinGecko, and RPC
- Added proper rate limiting (429) with headers
- Removed need for API keys in extension bundle

### v1.0.0 (Initial)
- Direct API calls with embedded keys

