# Unified Configuration System

**Created:** November 19, 2025  
**Last Updated:** February 9, 2026  
**Version:** 3.1.8  
**Status:** ✅ PRODUCTION READY  
**Last Code Update:** February 9, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Configuration Files](#configuration-files)
4. [Import Patterns](#import-patterns)
5. [Adding New Networks](#adding-new-networks)
6. [Adding New APIs](#adding-new-apis)
7. [Environment Variables](#environment-variables)
8. [Security Model](#security-model)
9. [Migration Guide](#migration-guide)

---

## Overview

SuperSafe Wallet implements a **two-tier unified configuration system** following MetaMask industry standards. All configuration is centralized in dedicated directories with clear separation between public and sensitive data.

### Key Benefits

- ✅ **Single Import Point**: `import { X, Y, Z } from '../config'`
- ✅ **Clear Structure**: Easy to find and update settings
- ✅ **Zero Duplication**: Single source of truth for each configuration
- ✅ **Security First**: Strict frontend/backend separation
- ✅ **Type-Safe Ready**: Structured for future TypeScript migration
- ✅ **Maintainable**: Adding new networks/APIs requires minimal changes

---

## Architecture

### Two-Tier System

```
Configuration Layer 1: PUBLIC (Frontend-Safe)
├── src/config/
│   ├── index.js                    # Main export point (public)
│   ├── networks.config.js          # Network metadata (NO RPC URLs)
│   ├── apis.config.js              # Public API endpoints (NO keys)
│   ├── features.config.js          # Feature flags
│   ├── dapps.config.js             # Known dApps directory
│   └── gas.config.js               # Gas thresholds & validation

Configuration Layer 2: SENSITIVE (Backend-Only)
└── src/background/config/
    ├── index.js                    # Main export point (backend)
    ├── networkConfig.js            # RPC URLs with API keys
    ├── apis.config.js              # API keys & credentials
    ├── relayConfig.js              # Relay.link with helpers
    └── [legacy files...]           # Old configs (will be removed)
```

### Security Model

```
┌─────────────────────────────────────────────────┐
│              Frontend Context                   │
│  ✅ Can import: src/config/*                    │
│  ❌ Cannot import: src/background/config/*      │
│                                                  │
│  Safe data:                                     │
│  - Network names, chainIds                      │
│  - Public API endpoints                         │
│  - Feature flags                                │
│  - Contract addresses                           │
│  - Gas thresholds                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            Background Context                   │
│  ✅ Can import: src/background/config/*         │
│  ✅ Can import: src/config/* (re-exported)      │
│                                                  │
│  Sensitive data:                                │
│  - RPC URLs with API keys                       │
│  - Moralis/Bebop/Relay/Khalani credentials      │
│  - WalletConnect project ID                     │
│  - Explorer API keys                            │
└─────────────────────────────────────────────────┘
```

---

## Configuration Files

### src/config/ (Public - Frontend Safe)

#### networks.config.js (26 KB)

**Purpose:** Network metadata without sensitive credentials

**Exports:**
- `NETWORKS` - Complete network configurations (8 networks)
- `CHAIN_ID_TO_SERVICE` - ChainId to API service mapping
- `BEBOP_CONTRACTS` - Bebop contract addresses
- `ERC20_ABI` - Standard ERC-20 ABI
- Helper functions: `getNetworkConfig()`, `getActiveNetworks()`, etc.

**Key Features:**
- NO RPC URLs (moved to backend)
- Public endpoints only (Bebop APIs, explorers)
- Safe for frontend bundle
- 40+ utility functions

**Example Network:**
```javascript
ethereum: {
  active: true,
  networkKey: 'ethereum',
  name: "Ethereum",
  chainId: 1,
  // RPC URLs in backend/config/networkConfig.js
  currency: "ETH",
  explorer: "https://etherscan.io",
  bebop: {
    jamApi: 'https://api.bebop.xyz/jam/ethereum/v2/',
    // No API keys here
  }
}
```

#### apis.config.js (3.9 KB)

**Purpose:** Public API endpoints without authentication

**Exports:**
- `BEBOP_ENDPOINTS` - Bebop API URLs per network
- `RELAY_ENDPOINT` - Relay.link base URL
- `EXPLORER_URLS` - Block explorer URLs
- Helper functions: `getExplorerUrl()`, `getTransactionUrl()`, etc.

**Use Cases:**
- Building transaction explorer links
- Displaying API endpoints in UI
- Documentation and debugging

#### features.config.js (8.3 KB)

**Purpose:** Centralized feature toggle system

**Exports:**
- `FEATURE_FLAGS` - Global and per-network feature toggles
- Helper functions: `isFeatureEnabled()`, `isNetworkFeatureEnabled()`

**Example:**
```javascript
FEATURE_FLAGS = {
  BEBOP_SWAP_ENABLED: true,
  RELAY_SWAP_ENABLED: true,
  NFT_DISPLAY_ENABLED: true,
  SAFE_MODE_DEFAULT: true,
  // ... 20+ feature flags
  
  NETWORK_FEATURES: {
    ethereum: { swap: true, nfts: true },
    // ... per network
  }
}
```

#### dapps.config.js (8.7 KB)

**Purpose:** Known dApps directory with contract addresses and injection strategies.

**Exports:**
- `KNOWN_DAPPS` - Recognized dApps (Uniswap, Aave, OpenSea, etc.)
- `DAPP_CATEGORIES` - Category definitions
- Helper functions: `getDAppConfig()`, `isKnownDApp()`, etc.

**Use Cases:**
- Enhanced dApp connection UI
- Contract address verification
- **Handshake Strategy (EIP-6963 vs Legacy)**: Controls provider injection behavior via `handshake` field in `allowlist.json`.
- Transaction decoding
- Security warnings

#### gas.config.js (10 KB)

**Purpose:** Gas validation thresholds and monitoring

**Exports:**
- `GAS_THRESHOLDS` - Gas price thresholds per network (in Gwei)
- `GAS_PERCENTAGE_THRESHOLDS` - Percentage-based validation
- `GAS_ALERT_LEVEL` - Alert severity levels
- Helper functions: `getGasThresholds()`, `getGasPriceLevel()`, etc.

**Example:**
```javascript
GAS_THRESHOLDS = {
  ethereum: { low: 5, medium: 20, high: 60, extreme: 120 },
  optimism: { low: 0.001, medium: 0.01, high: 0.1, extreme: 0.5 },
  // ... per network
}
```

#### index.js (3.1 KB)

**Purpose:** Single public import point

**Exports:** All public configurations (re-exports from other config files)

**Usage:**
```javascript
// Single import for multiple configs
import { 
  NETWORKS, 
  FEATURE_FLAGS, 
  GAS_THRESHOLDS,
  KNOWN_DAPPS
} from '../config'
```

---

### src/background/config/ (Backend - Sensitive)

#### networkConfig.js (7.8 KB)

**Purpose:** RPC URLs with API keys (backend-only)

**Exports:**
- `RPC_URLS` - RPC endpoints with Moralis API keys
- `getRpcUrl()` - Secure RPC URL accessor
- `getRpcUrls()` - Get both primary and backup
- `getWorkingRpcUrl()` - Automatic failover

**Security:**
- Context validation (ensures background-only usage)
- Fail-fast on missing environment variables
- Validates HTTPS/WSS protocols

**Example:**
```javascript
RPC_URLS = {
  ethereum: {
    primary: process.env.MORALIS_RPC_ETHEREUM_1,
    backup: process.env.MORALIS_RPC_ETHEREUM_2
  }
}
```

#### apis.config.js (15 KB)

**Purpose:** API keys and sensitive credentials

**Exports:**
- `API_USER_AGENT` - HTTP User-Agent string for API requests
- `MORALIS_CONFIG` - Moralis API with key rotation
- `BEBOP_CONFIG` - Bebop partner credentials
- `RELAY_CONFIG` - Relay.link partner settings
- `WALLETCONNECT_CONFIG` - WalletConnect project ID
- `EXPLORER_APIS` - Explorer APIs with keys
- `PRICE_APIS` - Price feed APIs with keys

**Key Features:**
- Multi-key rotation support (3x rate limit)
- Partner fee calculations
- Unified API structure
- **User-Agent Maintenance:** The `API_USER_AGENT` should be reviewed quarterly to update the Chrome major version (e.g., Chrome/131) to avoid being flagged as outdated. Last updated: November 2025, next review: February 2026.

**Example:**
```javascript
BEBOP_CONFIG = {
  PARTNER: {
    SOURCE: process.env.BEBOP_PARTNER_SOURCE,
    AUTH: process.env.BEBOP_PARTNER_AUTH,
    FEE_BPS: 40, // 0.4%
    FEE_RECIPIENT: '0x4f831DfAd4bF39C7170999E17EA6e86A2Aa5B5d6'
  }
}
```

#### index.js (2.2 KB)

**Purpose:** Single backend import point

**Exports:** All backend configurations + re-exports public configs

**Usage:**
```javascript
// Backend files can import everything
import { 
  getRpcUrl,           // Backend-only
  MORALIS_CONFIG,      // Backend-only
  NETWORKS,            // Re-exported from public
  FEATURE_FLAGS        // Re-exported from public
} from './config'
```

---

## Import Patterns

### Frontend Files (Components, Hooks)

```javascript
// ✅ CORRECT: Import from public config
import { NETWORKS, FEATURE_FLAGS, GAS_THRESHOLDS } from '../config'

// ✅ CORRECT: Direct import for single config
import { NETWORKS } from '../config/networks.config.js'

// ❌ WRONG: Never import backend config in frontend
import { getRpcUrl } from '../background/config/networkConfig.js' // ERROR!
```

### Backend Files (Controllers, Services, Handlers)

```javascript
// ✅ CORRECT: Import from backend config
import { getRpcUrl, MORALIS_CONFIG } from './config'

// ✅ CORRECT: Import public data from backend index
import { NETWORKS, FEATURE_FLAGS } from './config'

// ✅ CORRECT: Direct imports for specific needs
import { getRpcUrl } from './config/networkConfig.js'
import { NETWORKS } from '../../config/networks.config.js'
```

### Legacy Imports (Being Migrated)

```javascript
// ⚠️ DEPRECATED: Old pattern (still works, will be removed in v4.0.0)
import { NETWORKS } from '../utils/networks.js'
import { API_CONFIG } from './background/config/apis.config.js'

// ✅ NEW: Use unified config
import { NETWORKS } from '../config'
import { API_CONFIG } from './background/config/apis.config.js'
```

---

## Adding New Networks

### Step 1: Add Public Network Configuration

Edit `src/config/networks.config.js`:

```javascript
export const NETWORKS = {
  // ... existing networks
  
  newchain: {
    active: true,
    networkKey: 'newchain',
    name: "New Chain",
    chainId: 12345,
    wsUrl: null,
    currency: "NEW",
    explorer: "https://explorer.newchain.xyz",
    testnet: false,
    localLogoNetworkPath: "assets/networks/12345_network.png",
    nativeCurrency: {
      name: "New Token",
      symbol: "NEW",
      decimals: 18
    },
    networkToken: {
      name: "Wrapped NEW",
      symbol: "WNEW",
      decimals: 18,
      address: "0x..." // Wrapped token address
    },
    networkStableToken: {
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      address: "0x..." // USDC address on new chain
    },
    supportBebopSwap: true,
    bebop: {
      bebopName: 'newchain',
      displayName: 'New Chain',
      apiSupport: ['JAM'],
      jamApi: 'https://api.bebop.xyz/jam/newchain/v2/',
      rfqApi: null,
      swapEnabled: true,
      contracts: {
        jamSettlement: "0x...",
        balanceManager: "0x...",
        rfqSettlement: "0x...",
        permit2: "0x..."
      }
    },
    relay: {
      enabled: true,
      relayChainId: 12345,
      displayName: 'New Chain',
      crossChainEnabled: true
    }
  }
}
```

### Step 2: Add Backend RPC Configuration

Edit `src/background/config/networkConfig.js`:

```javascript
export const RPC_URLS = {
  // ... existing networks
  
  newchain: {
    primary: process.env.MORALIS_RPC_NEWCHAIN_1,
    backup: process.env.MORALIS_RPC_NEWCHAIN_2
  }
}

// Update validation array:
const requiredEnvVars = [
  // ... existing vars
  'MORALIS_RPC_NEWCHAIN_1',
  'MORALIS_RPC_NEWCHAIN_2'
];
```

### Step 3: Add to .env File

```bash
# New Chain RPC URLs
MORALIS_RPC_NEWCHAIN_1=https://site1.moralis-nodes.com/newchain/YOUR_API_KEY
MORALIS_RPC_NEWCHAIN_2=https://site2.moralis-nodes.com/newchain/YOUR_API_KEY
```

### Step 4: Add Network Assets

```bash
# Add network logo
public/assets/networks/12345_network.png
```

### Step 5: Update Feature Flags (Optional)

Edit `src/config/features.config.js`:

```javascript
NETWORK_FEATURES: {
  // ... existing networks
  newchain: {
    swap: true,
    nfts: true,
    customTokens: true,
    transactionHistory: true,
    gasValidation: true
  }
}
```

### Step 6: Rebuild & Test

```bash
npm run build
# Reload extension in browser
# Test: Switch to new network, verify all features work
```

**That's it!** All configuration in 2 files, no scattered updates needed.

---

## Adding New APIs

### Example: Adding CoinMarketCap Price API

#### Step 1: Add Backend API Config

Edit `src/background/config/apis.config.js`:

```javascript
export const PRICE_APIS = {
  // ... existing APIs
  
  COINMARKETCAP: {
    API_KEY: process.env.COINMARKETCAP_API_KEY || '',
    BASE_URL: 'https://pro-api.coinmarketcap.com/v1',
    TIMEOUT: 3000,
    RATE_LIMIT: {
      MAX_REQUESTS: 30,
      TIME_WINDOW: 60000
    }
  }
}
```

#### Step 2: Add Public Endpoint (Optional)

Edit `src/config/apis.config.js`:

```javascript
export const PRICE_API_ENDPOINTS = {
  // ... existing
  coinmarketcap: 'https://coinmarketcap.com' // For display only
}
```

#### Step 3: Add Environment Variable

`.env`:
```bash
COINMARKETCAP_API_KEY=your_api_key_here
```

#### Step 4: Use in Code

```javascript
// Backend
import { PRICE_APIS } from './config/apis.config.js'
const cmcKey = PRICE_APIS.COINMARKETCAP.API_KEY
```

---

## Environment Variables

### Organization

Environment variables are organized in `.env` file with clear sections:

```bash
# ===========================================
# NETWORK RPC URLS (Background Only)
# ===========================================
MORALIS_RPC_ETHEREUM_1=https://...
MORALIS_RPC_ETHEREUM_2=https://...
# ... (10 required)

# ===========================================
# API KEYS - Core Services (Required)
# ===========================================
MORALIS_API_KEY=eyJhbGci...
WALLETCONNECT_PROJECT_ID=cac66c...

# ===========================================
# API KEYS - Optional Services
# ===========================================
MORALIS_API_KEY_BACKUP=eyJhbGci...
BEBOP_PARTNER_AUTH=399014e2...
RELAY_PARTNER_SOURCE=supersafe

# ===========================================
# API ENDPOINTS - Public URLs
# ===========================================
SUPERSEED_API_BASE_URL=https://...
OPTIMISM_API_BASE_URL=https://...
```

### Required Variables

**CRITICAL - Application won't start without these:**
```bash
# Moralis RPC URLs (10 required for 5 networks × 2 redundancy)
MORALIS_RPC_ETHEREUM_1
MORALIS_RPC_ETHEREUM_2
MORALIS_RPC_OPTIMISM_1
MORALIS_RPC_OPTIMISM_2
MORALIS_RPC_BASE_1
MORALIS_RPC_BASE_2
MORALIS_RPC_ARBITRUM_1
MORALIS_RPC_ARBITRUM_2
MORALIS_RPC_BSC_1
MORALIS_RPC_BSC_2

# Core API Keys
MORALIS_API_KEY         # Blockchain data
WALLETCONNECT_PROJECT_ID # Web3 modal
```

### Optional Variables

**RECOMMENDED - Enable enhanced features:**
```bash
# API Key Rotation (3x rate limit)
MORALIS_API_KEY_BACKUP
MORALIS_API_KEY_BACKUP2

# Partner Integrations (revenue sharing)
BEBOP_PARTNER_SOURCE
BEBOP_PARTNER_AUTH
BEBOP_PARTNER_FEE_BPS
BEBOP_PARTNER_FEE_RECIPIENT
RELAY_PARTNER_SOURCE

# Price Feeds (portfolio value)
SUPERSAFE_API_KEY
COINGECKO_API_KEY
DEXTOOLS_API_KEY
```

### Validation

**On Application Start:**
- ✅ Missing required vars → **Application fails with clear error**
- ⚠️ Missing optional vars → **Warning logged, features degraded**

**Example Error:**
```
CRITICAL: Missing required environment variables for RPC URLs:
  MORALIS_RPC_ETHEREUM_1
  MORALIS_RPC_ETHEREUM_2

Please ensure all MORALIS_RPC_* variables are defined in your environment.
The application cannot start with undefined RPC URLs.
```

---

## Security Model

### Frontend Bundle Security

**What's EXCLUDED from frontend bundle:**
- ❌ All RPC URLs with API keys
- ❌ Moralis API keys
- ❌ Bebop partner credentials
- ❌ WalletConnect project ID
- ❌ Explorer API keys
- ❌ Price API keys

**Verification:**
```bash
# Should return ZERO matches
grep "moralis-nodes.com" dist/popup.js
grep "MORALIS_API_KEY" dist/assets/*.js
```

**What's INCLUDED in frontend bundle:**
- ✅ Network names, chainIds, explorers
- ✅ Public API endpoints (no keys)
- ✅ Feature flags
- ✅ Gas thresholds
- ✅ dApp directory

### Backend Bundle Security

**What's INCLUDED in background bundle:**
- ✅ All RPC URLs with API keys
- ✅ All API keys and credentials
- ✅ All public configurations (re-exported)

**Context Validation:**

Backend configs validate they're not imported in frontend:

```javascript
// In networkConfig.js
export function validateBackgroundContext() {
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    throw new Error('Can only be used in extension background context');
  }
  
  if (typeof window !== 'undefined' && window.location) {
    throw new Error('SECURITY VIOLATION: imported in web page context');
  }
}

validateBackgroundContext(); // Runs on module load
```

---

## Migration Guide

### Migrating from Old Configuration System

#### Old Pattern (Pre-v3.0.3)

```javascript
// Scattered imports
import { NETWORKS } from '../config/networks.config.js'
import { API_CONFIG, WALLETCONNECT_CONFIG } from '../background/config/apis.config.js'
import { GAS_THRESHOLDS } from '../utils/gasConstants.js'
```

#### New Pattern (v3.0.3+)

**Frontend:**
```javascript
// Single import
import { NETWORKS, GAS_THRESHOLDS, FEATURE_FLAGS } from '../config'
```

**Backend:**
```javascript
// Single import with credentials
import { getRpcUrl, MORALIS_CONFIG, NETWORKS } from './config'
```

### Deprecated Files

**Deleted in v3.1.0:**
- ✅ `src/utils/networks.js` → **DELETED**, use `src/config/networks.config.js`
- ✅ `src/background/config/apiConfig.js` → **DELETED**, use `src/background/config/apis.config.js`
- ✅ `src/background/config/walletConnectConfig.js` → **DELETED**, merged into `apis.config.js`
- ✅ `src/background/config/bebopPartnerConfig.js` → **DELETED**, merged into `apis.config.js`

**Will be removed in v4.0.0:**
- ⚠️ `src/utils/gasConstants.js` → Use `src/config/gas.config.js`

**Kept for specific purposes:**
- ✅ `src/background/config/relayConfig.js` - Network-specific helpers
- ✅ `src/background/utils/feeConfig.js` - Complex calculations
- ✅ `src/utils/feeConfigClient.js` - Frontend-safe wrapper

---

## Examples

### Example 1: Component Using Multiple Configs

```javascript
// Modern pattern with unified import
import React from 'react';
import { 
  NETWORKS, 
  FEATURE_FLAGS, 
  isNetworkFeatureEnabled,
  getExplorerUrl 
} from '../config';

export default function Dashboard({ network }) {
  // Check if swap is enabled for this network
  const swapEnabled = isNetworkFeatureEnabled(network.networkKey, 'swap');
  
  // Get explorer URL
  const explorerUrl = getExplorerUrl(network.networkKey);
  
  return (
    <div>
      <h1>{network.name}</h1>
      {swapEnabled && FEATURE_FLAGS.BEBOP_SWAP_ENABLED && (
        <button>Swap Tokens</button>
      )}
      <a href={explorerUrl}>View on Explorer</a>
    </div>
  );
}
```

### Example 2: Backend Service Using RPC URLs

```javascript
// Backend service with secure RPC access
import { ethers } from 'ethers';
import { getRpcUrl, NETWORKS } from './config';

export async function getBalance(networkKey, address) {
  // Get network metadata (public)
  const network = NETWORKS[networkKey];
  
  // Get RPC URL (sensitive, backend-only)
  const rpcUrl = getRpcUrl(networkKey);
  
  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return await provider.getBalance(address);
}
```

### Example 3: Feature Flag Usage

```javascript
import { FEATURE_FLAGS, isFeatureEnabled } from '../config';

// Global feature check
if (isFeatureEnabled('BEBOP_SWAP_ENABLED')) {
  // Show Bebop swap panel
}

// Network-specific feature check
if (FEATURE_FLAGS.NETWORK_FEATURES.ethereum.nfts) {
  // Show NFT tab for Ethereum
}
```

---

## Best Practices

### DO ✅

1. **Import from unified entry points**
   - Frontend: `from '../config'`
   - Backend: `from './config'`

2. **Use helper functions**
   - `getNetworkConfig(key)` instead of `NETWORKS[key]`
   - `getRpcUrl(key)` instead of `RPC_URLS[key].primary`

3. **Check feature flags before rendering**
   - Wrap features in `isFeatureEnabled()` checks
   - Respect network-specific feature flags

4. **Validate environment variables**
   - Use fail-fast approach (throw errors)
   - Log warnings for optional vars

### DON'T ❌

1. **Don't import backend config in frontend**
   ```javascript
   // ❌ WRONG - Security violation
   import { getRpcUrl } from '../background/config/networkConfig.js'
   ```

2. **Don't hardcode configuration**
   ```javascript
   // ❌ WRONG - Should be in config
   const ETHEREUM_RPC = 'https://eth.llamarpc.com'
   
   // ✅ CORRECT - From backend config
   const rpcUrl = getRpcUrl('ethereum')
   ```

3. **Don't use process.env directly**
   ```javascript
   // ❌ WRONG - Not available in frontend
   const apiKey = process.env.MORALIS_API_KEY
   
   // ✅ CORRECT - From backend config
   import { MORALIS_CONFIG } from './config'
   const apiKey = MORALIS_CONFIG.API_KEYS
   ```

4. **Don't create parallel config systems**
   - Always add to existing config files
   - Never create standalone config constants

---

## Troubleshooting

### Error: "Cannot find module '../config'"

**Cause:** Incorrect relative path

**Solution:**
```javascript
// Adjust path based on file location
import { NETWORKS } from '../config'      // From src/components/
import { NETWORKS } from '../../config'   // From src/components/screens/
import { NETWORKS } from './config'       // From src/
```

### Error: "CRITICAL: Missing required environment variables"

**Cause:** .env file missing or incomplete

**Solution:**
1. Create `.env` file in project root
2. Copy template from `.env.example`
3. Fill in all required variables
4. Rebuild: `npm run build`

### Error: "networkConfig.js can only be used in extension background context"

**Cause:** Attempting to import backend config in frontend

**Solution:**
```javascript
// ❌ WRONG
import { getRpcUrl } from '../background/config/networkConfig.js'

// ✅ CORRECT - Use stream to request from backend
import { BlockchainAdapter } from '../utils/FrontendControllerAdapter.js'
const result = await BlockchainAdapter.someOperation()
```

### Warning: "API key not configured"

**Cause:** Optional API key missing from .env

**Impact:** Feature degradation (not critical)

**Solution:**
- Add key to `.env` if needed
- Or ignore if feature not used

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture overview
- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API documentation  
- [SECURITY.md](./SECURITY.md) - Security implementation details
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow

---

