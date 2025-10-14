---
sidebar_position: 3
---

# 🔄 State Management

Understand how SuperSafe Wallet manages state across the frontend and backend, ensuring data consistency and security.

## State Management Overview

SuperSafe Wallet implements a **centralized state management system** where the background service worker serves as the single source of truth, and the frontend synchronizes with it through stream-based communication.

### Key Principles

- **Single Source of Truth**: Background service worker holds all state
- **Thin Client Pattern**: Frontend focuses on UI, backend handles logic
- **Stream Synchronization**: Real-time state synchronization
- **Memory-First Security**: Sensitive data in memory only
- **Event-Driven Updates**: State changes trigger events

## State Architecture

### State Hierarchy

```
State Management Architecture
├── Background Service Worker (Single Source of Truth)
│   ├── Vault State
│   │   ├── Wallets
│   │   ├── Settings
│   │   ├── Connections
│   │   └── Metadata
│   ├── Session State
│   │   ├── Authentication
│   │   ├── Current Wallet
│   │   ├── Connected Sites
│   │   └── Network State
│   ├── Wallet State
│   │   ├── Balances
│   │   ├── Tokens
│   │   ├── Transactions
│   │   └── Network Info
│   └── UI State
│       ├── Modals
│       ├── Navigation
│       ├── Forms
│       └── Preferences
└── Frontend (Thin Client)
    ├── Local UI State
    ├── Stream Subscriptions
    ├── Event Handlers
    └── State Synchronization
```

### State Flow

```
State Flow:
Background State Change
    ↓
Stream Event Emission
    ↓
Frontend Event Reception
    ↓
Local State Update
    ↓
UI Re-render
```

## Background State Management

### Vault State

#### Vault State Structure
```javascript
class VaultState {
  constructor() {
    this.state = {
      version: '1.0',
      wallets: [],
      settings: {
        autoLockTimeout: 15 * 60 * 1000, // 15 minutes
        defaultNetwork: '0x1',
        securityLevel: 'high'
      },
      connections: [],
      metadata: {
        createdAt: Date.now(),
        lastModified: Date.now(),
        backupPhrase: null
      }
    };
  }

  getWallets() {
    return this.state.wallets;
  }

  addWallet(wallet) {
    this.state.wallets.push(wallet);
    this.state.metadata.lastModified = Date.now();
    this.emitStateChange('wallets', this.state.wallets);
  }

  updateWallet(walletId, updates) {
    const walletIndex = this.state.wallets.findIndex(w => w.id === walletId);
    if (walletIndex !== -1) {
      this.state.wallets[walletIndex] = { ...this.state.wallets[walletIndex], ...updates };
      this.state.metadata.lastModified = Date.now();
      this.emitStateChange('wallets', this.state.wallets);
    }
  }

  removeWallet(walletId) {
    this.state.wallets = this.state.wallets.filter(w => w.id !== walletId);
    this.state.metadata.lastModified = Date.now();
    this.emitStateChange('wallets', this.state.wallets);
  }
}
```

#### Vault State Persistence
```javascript
class VaultStatePersistence {
  constructor(vaultState) {
    this.vaultState = vaultState;
    this.setupPersistence();
  }

  setupPersistence() {
    // Listen for state changes
    this.vaultState.on('stateChange', (key, value) => {
      this.persistState(key, value);
    });
  }

  async persistState(key, value) {
    try {
      // Encrypt vault state
      const encryptedState = await this.encryptVaultState(this.vaultState.state);
      
      // Store in Chrome storage
      await chrome.storage.local.set({
        vault: encryptedState
      });
    } catch (error) {
      console.error('Failed to persist vault state:', error);
    }
  }

  async loadState() {
    try {
      const result = await chrome.storage.local.get(['vault']);
      if (result.vault) {
        const decryptedState = await this.decryptVaultState(result.vault);
        this.vaultState.setState(decryptedState);
      }
    } catch (error) {
      console.error('Failed to load vault state:', error);
    }
  }
}
```

### Session State

#### Session State Management
```javascript
class SessionState {
  constructor() {
    this.state = {
      isUnlocked: false,
      currentWallet: null,
      connectedSites: new Map(),
      networkState: {
        chainId: '0x1',
        networkName: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'
      },
      lastActivity: Date.now(),
      autoLockTimer: null
    };
  }

  unlock(password) {
    this.state.isUnlocked = true;
    this.state.lastActivity = Date.now();
    this.startAutoLockTimer();
    this.emitStateChange('session', this.getSessionState());
  }

  lock() {
    this.state.isUnlocked = false;
    this.state.currentWallet = null;
    this.state.connectedSites.clear();
    this.stopAutoLockTimer();
    this.emitStateChange('session', this.getSessionState());
  }

  setCurrentWallet(wallet) {
    this.state.currentWallet = wallet;
    this.emitStateChange('currentWallet', wallet);
  }

  addConnectedSite(origin, permissions) {
    this.state.connectedSites.set(origin, {
      permissions,
      connectedAt: Date.now(),
      lastActivity: Date.now()
    });
    this.emitStateChange('connectedSites', Array.from(this.state.connectedSites.entries()));
  }

  removeConnectedSite(origin) {
    this.state.connectedSites.delete(origin);
    this.emitStateChange('connectedSites', Array.from(this.state.connectedSites.entries()));
  }

  updateActivity() {
    this.state.lastActivity = Date.now();
  }

  startAutoLockTimer() {
    this.state.autoLockTimer = setInterval(() => {
      if (this.shouldAutoLock()) {
        this.lock();
      }
    }, 60000); // Check every minute
  }

  shouldAutoLock() {
    const timeSinceActivity = Date.now() - this.state.lastActivity;
    return timeSinceActivity > 15 * 60 * 1000; // 15 minutes
  }
}
```

### Wallet State

#### Wallet State Management
```javascript
class WalletState {
  constructor() {
    this.state = {
      balances: new Map(),
      tokens: new Map(),
      transactions: [],
      networkInfo: null,
      priceFeeds: new Map()
    };
  }

  async updateBalance(walletId, balance) {
    this.state.balances.set(walletId, balance);
    this.emitStateChange('balance', { walletId, balance });
  }

  async updateTokenBalance(walletId, tokenAddress, balance) {
    if (!this.state.balances.has(walletId)) {
      this.state.balances.set(walletId, new Map());
    }
    
    this.state.balances.get(walletId).set(tokenAddress, balance);
    this.emitStateChange('tokenBalance', { walletId, tokenAddress, balance });
  }

  addTransaction(transaction) {
    this.state.transactions.unshift(transaction);
    this.emitStateChange('transactions', this.state.transactions);
  }

  updateTransactionStatus(txHash, status) {
    const transaction = this.state.transactions.find(tx => tx.hash === txHash);
    if (transaction) {
      transaction.status = status;
      this.emitStateChange('transactionUpdate', transaction);
    }
  }

  setNetworkInfo(networkInfo) {
    this.state.networkInfo = networkInfo;
    this.emitStateChange('networkInfo', networkInfo);
  }

  updateTokenPrice(tokenAddress, price) {
    this.state.priceFeeds.set(tokenAddress, price);
    this.emitStateChange('tokenPrice', { tokenAddress, price });
  }
}
```

## Frontend State Management

### React Context State

#### WalletContext
```javascript
const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletState, setWalletState] = useState({
    isConnected: false,
    accounts: [],
    chainId: null,
    network: null,
    balance: null,
    tokens: []
  });

  const [sessionState, setSessionState] = useState({
    isUnlocked: false,
    currentWallet: null,
    connectedSites: []
  });

  const [uiState, setUiState] = useState({
    currentScreen: 'dashboard',
    modals: {
      connectionRequest: false,
      transactionConfirmation: false,
      networkSwitch: false
    },
    forms: {
      sendTransaction: {},
      swapTokens: {}
    }
  });

  // Stream communication
  useEffect(() => {
    const port = chrome.runtime.connect({ name: 'session' });
    
    port.onMessage.addListener((message) => {
      if (message.type === 'event') {
        handleStreamEvent(message);
      }
    });

    return () => port.disconnect();
  }, []);

  const handleStreamEvent = (message) => {
    const { event, data } = message;
    
    switch (event) {
      case 'sessionChanged':
        setSessionState(data);
        break;
      case 'walletChanged':
        setWalletState(prev => ({ ...prev, ...data }));
        break;
      case 'networkChanged':
        setWalletState(prev => ({ ...prev, network: data }));
        break;
      case 'balanceUpdated':
        setWalletState(prev => ({ ...prev, balance: data }));
        break;
    }
  };

  return (
    <WalletContext.Provider value={{
      walletState,
      sessionState,
      uiState,
      setUiState,
      // ... other values
    }}>
      {children}
    </WalletContext.Provider>
  );
};
```

#### Custom Hooks

##### useWallet Hook
```javascript
const useWallet = () => {
  const { walletState, sessionState } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const port = chrome.runtime.connect({ name: 'session' });
      
      port.postMessage({
        type: 'UNLOCK',
        payload: { password: 'user-password' }
      });
      
      const response = await new Promise((resolve, reject) => {
        port.onMessage.addListener((message) => {
          if (message.type === 'response') {
            resolve(message.payload);
          } else if (message.type === 'error') {
            reject(new Error(message.payload));
          }
        });
      });
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const port = chrome.runtime.connect({ name: 'session' });
      
      port.postMessage({
        type: 'LOCK',
        payload: {}
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    ...walletState,
    ...sessionState,
    connectWallet,
    disconnectWallet,
    isLoading,
    error
  };
};
```

##### useNetwork Hook
```javascript
const useNetwork = () => {
  const { walletState } = useContext(WalletContext);
  const [isSwitching, setIsSwitching] = useState(false);

  const switchNetwork = async (chainId) => {
    setIsSwitching(true);
    
    try {
      const port = chrome.runtime.connect({ name: 'provider' });
      
      port.postMessage({
        type: 'wallet_switchEthereumChain',
        payload: { chainId }
      });
      
      const response = await new Promise((resolve, reject) => {
        port.onMessage.addListener((message) => {
          if (message.type === 'response') {
            resolve(message.payload);
          } else if (message.type === 'error') {
            reject(new Error(message.payload));
          }
        });
      });
      
      return response;
    } catch (err) {
      throw err;
    } finally {
      setIsSwitching(false);
    }
  };

  return {
    chainId: walletState.chainId,
    network: walletState.network,
    switchNetwork,
    isSwitching
  };
};
```

## Stream-Based State Synchronization

### Stream Event System

#### Event Types
```javascript
const STREAM_EVENTS = {
  // Session events
  SESSION_UNLOCKED: 'sessionUnlocked',
  SESSION_LOCKED: 'sessionLocked',
  SESSION_STATE_CHANGED: 'sessionStateChanged',
  
  // Wallet events
  WALLET_CREATED: 'walletCreated',
  WALLET_SWITCHED: 'walletSwitched',
  WALLET_BALANCE_UPDATED: 'walletBalanceUpdated',
  
  // Network events
  NETWORK_CHANGED: 'networkChanged',
  NETWORK_SWITCHED: 'networkSwitched',
  
  // Transaction events
  TRANSACTION_SENT: 'transactionSent',
  TRANSACTION_CONFIRMED: 'transactionConfirmed',
  TRANSACTION_FAILED: 'transactionFailed',
  
  // Connection events
  SITE_CONNECTED: 'siteConnected',
  SITE_DISCONNECTED: 'siteDisconnected',
  
  // UI events
  MODAL_OPENED: 'modalOpened',
  MODAL_CLOSED: 'modalClosed',
  SCREEN_CHANGED: 'screenChanged'
};
```

#### Event Emission
```javascript
class StateEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  emit(event, data) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(listener);
  }

  off(event, listener) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
}
```

### Stream Communication

#### Background to Frontend
```javascript
class BackgroundToFrontendStream {
  constructor() {
    this.ports = new Set();
    this.setupStream();
  }

  setupStream() {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name === 'frontend') {
        this.ports.add(port);
        
        port.onDisconnect.addListener(() => {
          this.ports.delete(port);
        });
      }
    });
  }

  emitToFrontend(event, data) {
    this.ports.forEach(port => {
      try {
        port.postMessage({
          type: 'event',
          event: event,
          data: data
        });
      } catch (error) {
        console.error('Failed to emit event to frontend:', error);
        this.ports.delete(port);
      }
    });
  }
}
```

#### Frontend to Background
```javascript
class FrontendToBackgroundStream {
  constructor() {
    this.port = null;
    this.setupStream();
  }

  setupStream() {
    this.port = chrome.runtime.connect({ name: 'frontend' });
    
    this.port.onMessage.addListener((message) => {
      this.handleMessage(message);
    });
    
    this.port.onDisconnect.addListener(() => {
      this.port = null;
    });
  }

  sendMessage(type, payload) {
    if (this.port) {
      this.port.postMessage({
        type: type,
        payload: payload
      });
    }
  }

  handleMessage(message) {
    switch (message.type) {
      case 'event':
        this.handleEvent(message.event, message.data);
        break;
      case 'response':
        this.handleResponse(message.payload);
        break;
      case 'error':
        this.handleError(message.payload);
        break;
    }
  }
}
```

## State Persistence

### Memory-First Security

#### Sensitive Data Handling
```javascript
class SensitiveDataManager {
  constructor() {
    this.sensitiveData = new Map();
    this.encryptionKey = null;
  }

  storeSensitiveData(key, data) {
    // Encrypt sensitive data
    const encryptedData = this.encryptData(data);
    this.sensitiveData.set(key, encryptedData);
  }

  getSensitiveData(key) {
    const encryptedData = this.sensitiveData.get(key);
    if (encryptedData) {
      return this.decryptData(encryptedData);
    }
    return null;
  }

  clearSensitiveData() {
    this.sensitiveData.clear();
  }

  encryptData(data) {
    // Encrypt data with session key
    // Implementation details...
  }

  decryptData(encryptedData) {
    // Decrypt data with session key
    // Implementation details...
  }
}
```

#### Session Persistence
```javascript
class SessionPersistence {
  constructor() {
    this.uiState = {
      currentScreen: 'dashboard',
      modals: {},
      forms: {}
    };
  }

  saveUIState() {
    // Save UI state to Chrome storage
    chrome.storage.local.set({
      uiState: this.uiState
    });
  }

  loadUIState() {
    // Load UI state from Chrome storage
    chrome.storage.local.get(['uiState'], (result) => {
      if (result.uiState) {
        this.uiState = { ...this.uiState, ...result.uiState };
      }
    });
  }

  clearUIState() {
    // Clear UI state
    this.uiState = {
      currentScreen: 'dashboard',
      modals: {},
      forms: {}
    };
    chrome.storage.local.remove(['uiState']);
  }
}
```

## State Validation

### State Validation System

#### Validation Rules
```javascript
class StateValidator {
  constructor() {
    this.rules = new Map();
    this.setupValidationRules();
  }

  setupValidationRules() {
    this.rules.set('wallet', {
      id: { required: true, type: 'string' },
      name: { required: true, type: 'string' },
      address: { required: true, type: 'string', format: 'address' },
      privateKey: { required: true, type: 'string', format: 'privateKey' }
    });

    this.rules.set('transaction', {
      from: { required: true, type: 'string', format: 'address' },
      to: { required: true, type: 'string', format: 'address' },
      value: { required: true, type: 'string', format: 'hex' },
      gas: { required: true, type: 'string', format: 'hex' },
      gasPrice: { required: true, type: 'string', format: 'hex' }
    });
  }

  validate(stateType, data) {
    const rules = this.rules.get(stateType);
    if (!rules) {
      return { valid: true };
    }

    const errors = [];
    
    for (const [field, rule] of Object.entries(rules)) {
      if (rule.required && !data[field]) {
        errors.push(`${field} is required`);
      }
      
      if (data[field] && rule.type && typeof data[field] !== rule.type) {
        errors.push(`${field} must be of type ${rule.type}`);
      }
      
      if (data[field] && rule.format) {
        if (!this.validateFormat(data[field], rule.format)) {
          errors.push(`${field} has invalid format`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  validateFormat(value, format) {
    switch (format) {
      case 'address':
        return /^0x[a-fA-F0-9]{40}$/.test(value);
      case 'privateKey':
        return /^0x[a-fA-F0-9]{64}$/.test(value);
      case 'hex':
        return /^0x[a-fA-F0-9]+$/.test(value);
      default:
        return true;
    }
  }
}
```

## Performance Optimization

### State Update Optimization

#### Debounced Updates
```javascript
class DebouncedStateUpdater {
  constructor(updateFunction, delay = 100) {
    this.updateFunction = updateFunction;
    this.delay = delay;
    this.timeout = null;
  }

  update(data) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.updateFunction(data);
    }, this.delay);
  }
}
```

#### Batch Updates
```javascript
class BatchStateUpdater {
  constructor() {
    this.pendingUpdates = new Map();
    this.batchTimeout = null;
  }

  scheduleUpdate(key, value) {
    this.pendingUpdates.set(key, value);
    
    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => {
        this.flushUpdates();
      }, 16); // Next frame
    }
  }

  flushUpdates() {
    if (this.pendingUpdates.size > 0) {
      this.updateFunction(this.pendingUpdates);
      this.pendingUpdates.clear();
    }
    this.batchTimeout = null;
  }
}
```

## Troubleshooting

### Common State Issues

#### State Synchronization Issues
- **Check Stream Connection**: Verify stream connection is active
- **Check Event Handlers**: Ensure event handlers are properly registered
- **Check State Validation**: Validate state data before updates
- **Check Error Handling**: Handle errors in state updates

#### Memory Issues
- **Check Memory Usage**: Monitor memory usage
- **Clear Unused State**: Clear unused state data
- **Check Memory Leaks**: Detect and fix memory leaks
- **Optimize State Updates**: Optimize state update frequency

## Next Steps

Now that you understand state management:

1. **[Networks Configuration](./networks-config.md)** - Learn about network configuration
2. **[Storage Architecture](./storage.md)** - Understand storage architecture
3. **[Swap Integration](./swap-integration.md)** - Learn about swap integration
4. **[Architecture Deep Dive](./architecture-deep-dive.md)** - Review architecture details

---

**Ready to learn about network configuration?** Continue to [Networks Configuration](./networks-config.md)!
