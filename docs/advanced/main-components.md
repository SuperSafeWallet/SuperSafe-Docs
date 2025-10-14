---
sidebar_position: 2
---

# 🧩 Main Components

Explore the core components that make up SuperSafe Wallet's architecture, including the BackgroundSessionController, BackgroundControllers, and key managers.

## Component Overview

SuperSafe Wallet is built around several core components that work together to provide secure, efficient wallet functionality. Each component has a specific responsibility and communicates through well-defined interfaces.

### Component Hierarchy

```
SuperSafe Wallet Components
├── Background Service Worker
│   ├── BackgroundSessionController (3,979 lines)
│   ├── BackgroundControllers (497 lines)
│   ├── Stream Handlers
│   ├── Managers
│   └── Utilities
├── Frontend Application
│   ├── React Components
│   ├── Custom Hooks
│   ├── Screens
│   └── Utilities
└── Content Script
    ├── Provider Injection
    ├── EIP-1193 Implementation
    └── Framework Detection
```

## BackgroundSessionController

### Overview

The **BackgroundSessionController** is the heart of SuperSafe Wallet, managing all core wallet functionality including vault operations, wallet management, session state, and connected sites.

#### Key Responsibilities
- **Vault Management**: Create, unlock, lock, and manage encrypted vault
- **Wallet Management**: Create, import, switch, and manage wallets
- **Session Management**: Handle session state and auto-lock
- **Connected Sites**: Manage dApp connections and permissions
- **Network Coordination**: Handle network switching and validation

### Vault Management

#### Vault Operations
```javascript
class VaultManager {
  constructor() {
    this.vault = null;
    this.masterKey = null;
    this.encryptionKey = null;
  }

  async createVault(password, recoveryPhrase) {
    // Generate master key from password
    this.masterKey = await this.deriveMasterKey(password);
    
    // Create initial vault structure
    const vaultData = {
      version: '1.0',
      wallets: [],
      settings: {},
      connections: [],
      metadata: {
        createdAt: Date.now(),
        recoveryPhrase: recoveryPhrase
      }
    };
    
    // Encrypt vault
    this.vault = await this.encryptVault(vaultData, this.masterKey);
    
    // Store encrypted vault
    await this.storeVault(this.vault);
    
    return this.vault;
  }

  async unlockVault(password) {
    try {
      // Derive master key from password
      this.masterKey = await this.deriveMasterKey(password);
      
      // Load encrypted vault from storage
      const encryptedVault = await this.loadVault();
      
      // Decrypt vault
      this.vault = await this.decryptVault(encryptedVault, this.masterKey);
      
      // Initialize session
      this.initializeSession();
      
      return { success: true };
    } catch (error) {
      throw new Error('Failed to unlock vault: ' + error.message);
    }
  }

  async lockVault() {
    // Clear sensitive data from memory
    this.clearSensitiveData();
    
    // Re-encrypt vault
    if (this.vault && this.masterKey) {
      this.vault = await this.encryptVault(this.vault, this.masterKey);
      await this.storeVault(this.vault);
    }
    
    // Clear session state
    this.clearSessionState();
  }

  clearSensitiveData() {
    this.masterKey = null;
    this.encryptionKey = null;
    // Clear other sensitive data
  }
}
```

#### Vault Encryption
```javascript
class VaultEncryption {
  async encryptVault(vaultData, masterKey) {
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Serialize vault data
    const serializedData = JSON.stringify(vaultData);
    const dataBuffer = new TextEncoder().encode(serializedData);
    
    // Encrypt with AES-256-GCM
    const key = await crypto.subtle.importKey(
      'raw',
      masterKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      dataBuffer
    );
    
    // Create vault structure
    return {
      version: '1.0',
      algorithm: 'AES-256-GCM',
      keyDerivation: 'PBKDF2',
      iterations: 10000,
      salt: this.salt,
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedData)),
      tag: Array.from(new Uint8Array(encryptedData.slice(-16)))
    };
  }

  async decryptVault(encryptedVault, masterKey) {
    // Import key
    const key = await crypto.subtle.importKey(
      'raw',
      masterKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Decrypt data
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedVault.iv) },
      key,
      new Uint8Array(encryptedVault.data)
    );
    
    // Deserialize vault data
    const serializedData = new TextDecoder().decode(decryptedData);
    return JSON.parse(serializedData);
  }
}
```

### Wallet Management

#### Wallet Operations
```javascript
class WalletManager {
  constructor(vaultManager) {
    this.vaultManager = vaultManager;
    this.wallets = new Map();
    this.currentWallet = null;
  }

  async createWallet(name, emoji) {
    // Generate new wallet
    const wallet = await this.generateWallet();
    
    // Add wallet to vault
    const walletData = {
      id: wallet.id,
      name: name,
      emoji: emoji,
      address: wallet.address,
      privateKey: wallet.privateKey, // Will be encrypted
      createdAt: Date.now()
    };
    
    // Encrypt private key
    walletData.privateKey = await this.encryptPrivateKey(
      wallet.privateKey,
      this.vaultManager.masterKey
    );
    
    // Add to vault
    this.vaultManager.vault.wallets.push(walletData);
    
    // Update storage
    await this.vaultManager.storeVault(this.vaultManager.vault);
    
    return walletData;
  }

  async importWallet(privateKey, name, emoji) {
    // Validate private key
    if (!this.isValidPrivateKey(privateKey)) {
      throw new Error('Invalid private key');
    }
    
    // Generate wallet from private key
    const wallet = await this.generateWalletFromPrivateKey(privateKey);
    
    // Add wallet to vault
    const walletData = {
      id: wallet.id,
      name: name,
      emoji: emoji,
      address: wallet.address,
      privateKey: await this.encryptPrivateKey(
        wallet.privateKey,
        this.vaultManager.masterKey
      ),
      createdAt: Date.now(),
      imported: true
    };
    
    this.vaultManager.vault.wallets.push(walletData);
    await this.vaultManager.storeVault(this.vaultManager.vault);
    
    return walletData;
  }

  async switchWallet(walletId) {
    const wallet = this.vaultManager.vault.wallets.find(w => w.id === walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    this.currentWallet = wallet;
    
    // Emit wallet changed event
    this.emitWalletChangedEvent(wallet);
    
    return wallet;
  }

  async getWalletBalance(walletId) {
    const wallet = this.vaultManager.vault.wallets.find(w => w.id === walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Get balance from network
    const balance = await this.getBalanceFromNetwork(wallet.address);
    
    return balance;
  }
}
```

### Session Management

#### Session State
```javascript
class SessionManager {
  constructor() {
    this.sessionState = {
      isUnlocked: false,
      currentWallet: null,
      connectedSites: new Map(),
      networkState: null,
      lastActivity: Date.now(),
      autoLockTimeout: 15 * 60 * 1000 // 15 minutes
    };
    this.autoLockTimer = null;
  }

  startSession() {
    this.sessionState.isUnlocked = true;
    this.sessionState.lastActivity = Date.now();
    this.startAutoLockTimer();
  }

  endSession() {
    this.sessionState.isUnlocked = false;
    this.sessionState.currentWallet = null;
    this.sessionState.connectedSites.clear();
    this.stopAutoLockTimer();
  }

  startAutoLockTimer() {
    this.autoLockTimer = setInterval(() => {
      if (this.shouldAutoLock()) {
        this.lockSession();
      }
    }, 60000); // Check every minute
  }

  shouldAutoLock() {
    const timeSinceActivity = Date.now() - this.sessionState.lastActivity;
    return timeSinceActivity > this.sessionState.autoLockTimeout;
  }

  updateActivity() {
    this.sessionState.lastActivity = Date.now();
  }

  lockSession() {
    this.endSession();
    // Emit session locked event
    this.emitSessionLockedEvent();
  }
}
```

### Connected Sites Management

#### Site Management
```javascript
class ConnectedSitesManager {
  constructor() {
    this.connectedSites = new Map();
    this.allowList = new Map();
    this.loadAllowList();
  }

  async connectSite(origin, permissions) {
    // Check AllowList
    const allowListEntry = this.allowList.get(origin);
    if (!allowListEntry) {
      throw new Error('Site not in AllowList');
    }
    
    // Validate permissions
    if (!this.validatePermissions(permissions, allowListEntry.allowedPermissions)) {
      throw new Error('Invalid permissions requested');
    }
    
    // Add to connected sites
    this.connectedSites.set(origin, {
      permissions: permissions,
      connectedAt: Date.now(),
      lastActivity: Date.now()
    });
    
    // Emit connection event
    this.emitSiteConnectedEvent(origin, permissions);
  }

  async disconnectSite(origin) {
    if (this.connectedSites.has(origin)) {
      this.connectedSites.delete(origin);
      this.emitSiteDisconnectedEvent(origin);
    }
  }

  validatePermissions(requestedPermissions, allowedPermissions) {
    return requestedPermissions.every(permission => 
      allowedPermissions.includes(permission)
    );
  }

  loadAllowList() {
    // Load AllowList from storage
    chrome.storage.local.get(['allowList'], (result) => {
      if (result.allowList) {
        this.allowList = new Map(Object.entries(result.allowList));
      }
    });
  }
}
```

## BackgroundControllers

### Overview

The **BackgroundControllers** provide specialized functionality for different aspects of the wallet, including token management, network operations, and transaction handling.

#### Controller Architecture
```javascript
class BackgroundControllers {
  constructor() {
    this.tokenController = new TokenController();
    this.networkController = new NetworkController();
    this.transactionController = new TransactionController();
    this.networkSwitchService = new NetworkSwitchService();
  }
}
```

### TokenController

#### Token Management
```javascript
class TokenController {
  constructor() {
    this.tokens = new Map();
    this.balances = new Map();
    this.priceFeeds = new Map();
  }

  async addToken(tokenData) {
    // Validate token data
    if (!this.validateTokenData(tokenData)) {
      throw new Error('Invalid token data');
    }
    
    // Add to tokens map
    this.tokens.set(tokenData.address, tokenData);
    
    // Get initial balance
    const balance = await this.getTokenBalance(tokenData.address);
    this.balances.set(tokenData.address, balance);
    
    // Start price feed
    this.startPriceFeed(tokenData.address);
    
    return tokenData;
  }

  async getTokenBalance(tokenAddress) {
    // Get balance from network
    const balance = await this.callContractMethod(
      tokenAddress,
      'balanceOf',
      [this.currentWallet.address]
    );
    
    return balance;
  }

  async updateTokenBalances() {
    for (const [address, token] of this.tokens) {
      try {
        const balance = await this.getTokenBalance(address);
        this.balances.set(address, balance);
      } catch (error) {
        console.error(`Failed to update balance for ${address}:`, error);
      }
    }
  }

  startPriceFeed(tokenAddress) {
    // Start price feed for token
    setInterval(async () => {
      try {
        const price = await this.getTokenPrice(tokenAddress);
        this.priceFeeds.set(tokenAddress, price);
      } catch (error) {
        console.error(`Failed to get price for ${tokenAddress}:`, error);
      }
    }, 30000); // Update every 30 seconds
  }
}
```

### NetworkController

#### Network Management
```javascript
class NetworkController {
  constructor() {
    this.currentNetwork = null;
    this.supportedNetworks = new Map();
    this.networkProviders = new Map();
    this.loadSupportedNetworks();
  }

  loadSupportedNetworks() {
    this.supportedNetworks.set('0x1', {
      name: 'Ethereum Mainnet',
      chainId: 1,
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
      explorerUrl: 'https://etherscan.io',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
    });
    
    this.supportedNetworks.set('0xa', {
      name: 'Optimism',
      chainId: 10,
      rpcUrl: 'https://mainnet.optimism.io',
      explorerUrl: 'https://optimistic.etherscan.io',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
    });
    
    this.supportedNetworks.set('0x14a2', {
      name: 'SuperSeed',
      chainId: 5330,
      rpcUrl: 'https://mainnet.superseed.xyz',
      explorerUrl: 'https://explorer.superseed.xyz',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
    });
  }

  async switchNetwork(chainId) {
    const network = this.supportedNetworks.get(chainId);
    if (!network) {
      throw new Error('Unsupported network');
    }
    
    // Switch to new network
    this.currentNetwork = network;
    
    // Update network provider
    await this.updateNetworkProvider(network);
    
    // Emit network changed event
    this.emitNetworkChangedEvent(network);
    
    return network;
  }

  async updateNetworkProvider(network) {
    // Create new provider for network
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    this.networkProviders.set(network.chainId, provider);
  }

  getCurrentNetwork() {
    return this.currentNetwork;
  }

  getSupportedNetworks() {
    return Array.from(this.supportedNetworks.values());
  }
}
```

### TransactionController

#### Transaction Management
```javascript
class TransactionController {
  constructor() {
    this.pendingTransactions = new Map();
    this.transactionHistory = [];
  }

  async sendTransaction(transactionData) {
    // Validate transaction
    if (!this.validateTransaction(transactionData)) {
      throw new Error('Invalid transaction data');
    }
    
    // Estimate gas
    const gasEstimate = await this.estimateGas(transactionData);
    
    // Create transaction
    const transaction = {
      ...transactionData,
      gas: gasEstimate,
      nonce: await this.getNonce(transactionData.from)
    };
    
    // Sign transaction
    const signedTransaction = await this.signTransaction(transaction);
    
    // Broadcast transaction
    const txHash = await this.broadcastTransaction(signedTransaction);
    
    // Track transaction
    this.trackTransaction(txHash, transaction);
    
    return txHash;
  }

  async signTransaction(transaction) {
    // Get wallet private key
    const privateKey = await this.getWalletPrivateKey(transaction.from);
    
    // Create wallet instance
    const wallet = new ethers.Wallet(privateKey);
    
    // Sign transaction
    const signedTransaction = await wallet.signTransaction(transaction);
    
    return signedTransaction;
  }

  async estimateGas(transactionData) {
    // Estimate gas for transaction
    const provider = this.getCurrentProvider();
    const gasEstimate = await provider.estimateGas(transactionData);
    
    return gasEstimate;
  }

  trackTransaction(txHash, transaction) {
    const transactionRecord = {
      hash: txHash,
      from: transaction.from,
      to: transaction.to,
      value: transaction.value,
      gas: transaction.gas,
      gasPrice: transaction.gasPrice,
      status: 'pending',
      createdAt: Date.now()
    };
    
    this.pendingTransactions.set(txHash, transactionRecord);
    this.transactionHistory.push(transactionRecord);
  }
}
```

## Stream Handlers

### Overview

Stream handlers manage communication between the frontend and background service worker through secure, efficient streams.

#### Handler Architecture
```javascript
class StreamHandler {
  constructor(streamName) {
    this.streamName = streamName;
    this.handlers = new Map();
    this.setupStream();
  }

  setupStream() {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name === this.streamName) {
        port.onMessage.addListener((message) => {
          this.handleMessage(message, port);
        });
      }
    });
  }

  handleMessage(message, port) {
    const { type, payload, id } = message;
    const handler = this.handlers.get(type);
    
    if (handler) {
      handler(payload)
        .then(result => {
          port.postMessage({
            type: 'response',
            payload: result,
            id: id
          });
        })
        .catch(error => {
          port.postMessage({
            type: 'error',
            payload: error.message,
            id: id
          });
        });
    }
  }

  registerHandler(type, handler) {
    this.handlers.set(type, handler);
  }
}
```

### SessionStreamHandler

#### Session Operations
```javascript
class SessionStreamHandler extends StreamHandler {
  constructor(sessionController) {
    super('session');
    this.sessionController = sessionController;
    this.setupHandlers();
  }

  setupHandlers() {
    this.registerHandler('GET_SESSION_STATE', this.getSessionState.bind(this));
    this.registerHandler('UNLOCK', this.unlock.bind(this));
    this.registerHandler('CREATE_WALLET', this.createWallet.bind(this));
    this.registerHandler('SWITCH_WALLET', this.switchWallet.bind(this));
    this.registerHandler('LOCK', this.lock.bind(this));
  }

  async getSessionState() {
    return {
      isUnlocked: this.sessionController.isUnlocked,
      currentWallet: this.sessionController.currentWallet,
      connectedSites: Array.from(this.sessionController.connectedSites.keys()),
      networkState: this.sessionController.networkState
    };
  }

  async unlock(payload) {
    const { password } = payload;
    await this.sessionController.unlockVault(password);
    return { success: true };
  }

  async createWallet(payload) {
    const { name, emoji } = payload;
    const wallet = await this.sessionController.createWallet(name, emoji);
    return wallet;
  }

  async switchWallet(payload) {
    const { walletId } = payload;
    const wallet = await this.sessionController.switchWallet(walletId);
    return wallet;
  }

  async lock() {
    await this.sessionController.lockVault();
    return { success: true };
  }
}
```

### ProviderStreamHandler

#### EIP-1193 Operations
```javascript
class ProviderStreamHandler extends StreamHandler {
  constructor(sessionController) {
    super('provider');
    this.sessionController = sessionController;
    this.setupHandlers();
  }

  setupHandlers() {
    this.registerHandler('eth_requestAccounts', this.requestAccounts.bind(this));
    this.registerHandler('eth_accounts', this.getAccounts.bind(this));
    this.registerHandler('eth_chainId', this.getChainId.bind(this));
    this.registerHandler('eth_sendTransaction', this.sendTransaction.bind(this));
    this.registerHandler('personal_sign', this.personalSign.bind(this));
    this.registerHandler('eth_signTypedData_v4', this.signTypedData.bind(this));
    this.registerHandler('wallet_switchEthereumChain', this.switchChain.bind(this));
  }

  async requestAccounts() {
    if (!this.sessionController.isUnlocked) {
      throw new Error('Wallet not unlocked');
    }
    
    const accounts = this.sessionController.getConnectedAccounts();
    return accounts;
  }

  async getAccounts() {
    if (!this.sessionController.isUnlocked) {
      return [];
    }
    
    return this.sessionController.getConnectedAccounts();
  }

  async getChainId() {
    const network = this.sessionController.getCurrentNetwork();
    return network ? `0x${network.chainId.toString(16)}` : '0x1';
  }

  async sendTransaction(transactionData) {
    if (!this.sessionController.isUnlocked) {
      throw new Error('Wallet not unlocked');
    }
    
    const txHash = await this.sessionController.sendTransaction(transactionData);
    return txHash;
  }

  async personalSign(message, account) {
    if (!this.sessionController.isUnlocked) {
      throw new Error('Wallet not unlocked');
    }
    
    const signature = await this.sessionController.signMessage(message, account);
    return signature;
  }

  async signTypedData(typedData, account) {
    if (!this.sessionController.isUnlocked) {
      throw new Error('Wallet not unlocked');
    }
    
    const signature = await this.sessionController.signTypedData(typedData, account);
    return signature;
  }

  async switchChain(chainId) {
    await this.sessionController.switchNetwork(chainId);
    return null;
  }
}
```

## Managers

### Overview

Managers provide specialized functionality for specific aspects of the wallet, including signing requests, popup management, and event handling.

#### Manager Architecture
```javascript
class ManagerSystem {
  constructor() {
    this.signingRequestManager = new SigningRequestManager();
    this.popupManager = new PopupManager();
    this.eip1193EventsManager = new EIP1193EventsManager();
    this.autoEscalationManager = new AutoEscalationManager();
    this.streamPersistenceManager = new StreamPersistenceManager();
  }
}
```

### SigningRequestManager

#### Request Management
```javascript
class SigningRequestManager {
  constructor() {
    this.pendingRequests = new Map();
    this.requestQueue = [];
  }

  async addSigningRequest(request) {
    const requestId = this.generateRequestId();
    
    const signingRequest = {
      id: requestId,
      type: request.type,
      data: request.data,
      from: request.from,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    this.pendingRequests.set(requestId, signingRequest);
    this.requestQueue.push(signingRequest);
    
    // Show popup for user approval
    await this.showSigningPopup(signingRequest);
    
    return requestId;
  }

  async approveRequest(requestId) {
    const request = this.pendingRequests.get(requestId);
    if (!request) {
      throw new Error('Request not found');
    }
    
    try {
      let result;
      
      switch (request.type) {
        case 'transaction':
          result = await this.signTransaction(request.data);
          break;
        case 'message':
          result = await this.signMessage(request.data);
          break;
        case 'typedData':
          result = await this.signTypedData(request.data);
          break;
        default:
          throw new Error('Unknown request type');
      }
      
      request.status = 'approved';
      request.result = result;
      
      // Emit approval event
      this.emitRequestApprovedEvent(request);
      
      return result;
    } catch (error) {
      request.status = 'failed';
      request.error = error.message;
      
      // Emit failure event
      this.emitRequestFailedEvent(request);
      
      throw error;
    }
  }

  async rejectRequest(requestId) {
    const request = this.pendingRequests.get(requestId);
    if (!request) {
      throw new Error('Request not found');
    }
    
    request.status = 'rejected';
    
    // Emit rejection event
    this.emitRequestRejectedEvent(request);
  }
}
```

### PopupManager

#### Popup Management
```javascript
class PopupManager {
  constructor() {
    this.popupWindow = null;
    this.popupPort = null;
  }

  async showPopup(type, data) {
    if (this.popupWindow) {
      // Focus existing popup
      chrome.windows.update(this.popupWindow.id, { focused: true });
      return;
    }
    
    // Create new popup window
    this.popupWindow = await chrome.windows.create({
      url: `popup.html?type=${type}&data=${encodeURIComponent(JSON.stringify(data))}`,
      type: 'popup',
      width: 400,
      height: 600,
      focused: true
    });
    
    // Setup popup communication
    this.setupPopupCommunication();
  }

  setupPopupCommunication() {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name === 'popup') {
        this.popupPort = port;
        
        port.onMessage.addListener((message) => {
          this.handlePopupMessage(message);
        });
        
        port.onDisconnect.addListener(() => {
          this.popupPort = null;
          this.popupWindow = null;
        });
      }
    });
  }

  handlePopupMessage(message) {
    switch (message.type) {
      case 'APPROVE_REQUEST':
        this.approveRequest(message.requestId);
        break;
      case 'REJECT_REQUEST':
        this.rejectRequest(message.requestId);
        break;
      case 'CLOSE_POPUP':
        this.closePopup();
        break;
    }
  }

  closePopup() {
    if (this.popupWindow) {
      chrome.windows.remove(this.popupWindow.id);
      this.popupWindow = null;
      this.popupPort = null;
    }
  }
}
```

## Next Steps

Now that you understand the main components:

1. **[State Management](./state-management.md)** - Learn about state management
2. **[Networks Configuration](./networks-config.md)** - Understand network configuration
3. **[Storage Architecture](./storage.md)** - Learn about storage
4. **[Swap Integration](./swap-integration.md)** - Understand swap integration

---

**Ready to learn about state management?** Continue to [State Management](./state-management.md)!
