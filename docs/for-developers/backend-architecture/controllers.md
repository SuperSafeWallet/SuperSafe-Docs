---
sidebar_position: 2
---

# 🎮 Controllers

SuperSafe Wallet implements a **Professionally Standardized controller architecture** with modular, single-responsibility controllers managing different aspects of wallet state.

## Overview

### Controller System

```
BackgroundControllers
├── TokenController
│   ├── State: Map<networkKey, tokens[]>
│   ├── Methods: loadTokens, addCustomToken, removeToken
│   └── Storage: chrome.storage.local['tokens_{network}']
│
├── NetworkController
│   ├── State: currentNetwork, customNetworks
│   ├── Methods: getCurrentNetwork, switchNetwork, addCustomNetwork
│   └── Storage: chrome.storage.local['currentNetwork']
│
├── TransactionController
│   ├── State: Map<networkKey+address, transactions[]>
│   ├── Methods: addTransaction, getHistory, updateStatus
│   └── Storage: chrome.storage.local['txHistory_{network}_{address}']
│
└── NetworkSwitchService
    ├── Dependencies: NetworkController, SessionController
    ├── Methods: switchNetwork, requestNetworkSwitch, validateNetworkSwitch
    └── Context-Aware: manual | dapp_request | connection | automatic
```

---

## BackgroundControllers (497 lines)

**Location:** `src/background/BackgroundControllers.js`

**Architecture:**

```javascript
class BackgroundControllers {
  constructor() {
    this.tokenController = new TokenController();
    this.networkController = new NetworkController();
    this.transactionController = new TransactionController();
    this.networkSwitchService = null;  // Initialized later
    this.getPrivateKeyFunction = null;
  }
  
  async initialize(networkKey, provider, getPrivateKeyFn) {
    // Initialize each controller
    await this.tokenController.initialize(networkKey, provider, getPrivateKeyFn);
    await this.networkController.initialize(networkKey, provider, getPrivateKeyFn);
    await this.transactionController.initialize(networkKey, provider, getPrivateKeyFn);
    
    // Initialize network switch service
    this.networkSwitchService = initializeNetworkSwitchService(
      this.networkController,
      getPrivateKeyFn?.sessionController
    );
    
    // Load persistent data
    await this.loadAllPersistentData();
    
    this.isInitialized = true;
  }
  
  // Message handlers
  async handleTokenMessage(message) { /* ... */ }
  async handleNetworkMessage(message) { /* ... */ }
  async handleTransactionMessage(message) { /* ... */ }
}
```

---

## TokenController

**Purpose:** ERC20 token management

**Key Operations:**
- `loadTokens(networkKey, address)` - Load tokens for wallet on network
- `addCustomToken(networkKey, token)` - Add custom token
- `removeToken(networkKey, address)` - Remove token
- `getTokenBalance(token, wallet)` - Get token balance

**Storage:** `chrome.storage.local['tokens_{network}']`

---

## NetworkController

**Purpose:** Network configuration and management

**Key Operations:**
- `getCurrentNetwork()` - Get current network
- `switchNetwork(networkKey)` - Switch to different network
- `addCustomNetwork(config)` - Add custom network
- `getNetworkList()` - Get all available networks

**Storage:** `chrome.storage.local['currentNetwork']`

---

## TransactionController

**Purpose:** Transaction history management

**Key Operations:**
- `addTransaction(tx)` - Add transaction to history
- `getHistory(network, address)` - Get transaction history
- `updateStatus(txHash, status)` - Update transaction status
- `clearHistory(network, address)` - Clear history

**Storage:** `chrome.storage.local['txHistory_{network}_{address}']`

---

## NetworkSwitchService

**Purpose:** Unified network switching with bidirectional dApp synchronization

**Features:**
- ✅ Extension → dApp propagation (chainChanged events)
- ✅ dApp → Extension consent (wallet_switchEthereumChain)
- ✅ Unsupported network detection
- ✅ Network validation before signing

**Architecture:**

```javascript
class NetworkSwitchService {
  async switchNetwork(networkKey) {
    // 1. Update wallet state
    await backgroundSessionController.switchNetwork(networkKey);
    
    // 2. Get new chainId
    const chainId = getChainIdByNetworkKey(networkKey);
    
    // 3. Broadcast to all connected dApps
    await this.propagateNetworkChangeToConnectedDApps(chainId);
  }
  
  async propagateNetworkChangeToConnectedDApps(chainId) {
    const connectedSites = await backgroundSessionController.getConnectedSites();
    
    for (const [origin, siteData] of connectedSites) {
      if (siteData.isConnected) {
        await eip1193EventsManager.notifyChainChanged(origin, chainId);
      }
    }
  }
}
```

---

## Controller Communication

### Inter-Controller Event Handling

```javascript
_setupControllerEventHandlers() {
  // When network changes, update all controllers
  this.networkController.on('networkChanged', async (networkKey) => {
    console.log('[BackgroundControllers] 🔄 Network changed:', networkKey);
    
    // Update token controller
    await this.tokenController.onNetworkChange(networkKey);
    
    // Update transaction controller
    await this.transactionController.onNetworkChange(networkKey);
    
    // Broadcast to frontend
    this.broadcastNetworkChange(networkKey);
  });
}
```

---

## BackgroundSessionController (3,979 lines)

**Location:** `src/background/BackgroundSessionController.js`

**Core Responsibilities:**
- Vault lifecycle management (create, unlock, lock)
- Wallet management (create, import, remove, switch)
- Session state management
- Connected sites tracking
- Auto-lock functionality
- Network coordination

**Class Structure:**

```javascript
class BackgroundSessionController {
  constructor() {
    // Session state (memory only)
    this.isUnlocked = false;
    this.password = null;
    this.vaultData = null;
    this.decryptedWallets = new Map();
    
    // Connected sites
    this.connectedSites = new Map();
    
    // Auto-lock
    this.autoLockTimer = null;
    this.autoLockTimeoutMs = 15 * 60 * 1000;  // 15 minutes
    
    // Rate limiting
    this.unlockAttempts = [];
    this.maxAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000;
  }
  
  // Vault operations
  async createVault(wallets, settings, password)
  async unlock(password, origin, tokenController)
  async lock()
  
  // Wallet operations
  async createWallet(name, emoji)
  async importWallet(privateKey, name, emoji)
  async removeWalletAtIndex(index)
  async switchWallet(index, origin)
  
  // Connected sites
  async connectSite(origin, accounts, tabId, walletInfo, policy)
  async disconnectSite(origin, eip1193EventsManager, updateBadge)
  
  // Network management
  async switchNetwork(networkKey, provider, getPrivateKeyFunction)
  
  // Session state
  async getCompleteSessionSnapshot(tokenController)
  async persistSessionState()
  async checkPersistentSession()
}
```

---

## Session State Model

```javascript
// Complete session state structure
SessionState {
  // Authentication
  isUnlocked: boolean,
  hasVault: boolean,
  
  // Current context
  currentWalletIndex: number,
  currentNetworkKey: string,
  
  // Wallets (non-sensitive)
  wallets: [
    {
      address: string,
      name: string,
      emoji: string,
      isHD: boolean
    }
  ],
  
  // Network info
  currentNetwork: {
    chainId: number,
    name: string,
    rpcUrl: string,
    explorer: string
  },
  
  // Settings
  settings: {
    autoLockMinutes: number,
    currency: string,
    language: string
  },
  
  // Connected sites
  connectedSites: Map<origin, {
    accounts: string[],
    connectedAt: timestamp,
    lastUsed: timestamp,
    policy: Object
  }>
}
```

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.2+  
**Maintenance:** Review after major controller changes

