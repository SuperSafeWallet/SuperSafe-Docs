---
sidebar_position: 1
---

# 🏗️ Architecture Deep Dive

Explore the intricate details of SuperSafe Wallet's MetaMask-style Service Worker architecture and understand how each component works together.

## Executive Summary

SuperSafe Wallet implements a **MetaMask-style Service Worker architecture** that provides a secure, efficient, and scalable foundation for Web3 wallet functionality. The architecture emphasizes security, performance, and developer experience through careful separation of concerns and robust communication patterns.

### Key Architectural Decisions

- **Service Worker as Single Source of Truth**: Centralized state management
- **Thin Client Pattern**: Frontend focuses on UI, backend handles logic
- **Stream-Based Communication**: Efficient inter-process communication
- **Zero Frontend Crypto**: No cryptographic operations in frontend
- **MetaMask-Style Controllers**: Familiar architecture for developers

## System Architecture

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Pages (dApps)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Uniswap       │  │   OpenSea       │  │   Other     │  │
│  │   dApp          │  │   dApp          │  │   dApps     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ EIP-1193 Provider
                              │ Content Script
                              │
┌─────────────────────────────────────────────────────────────┐
│                Extension Context                            │
│  ┌─────────────────┐              ┌─────────────────────┐   │
│  │   Popup UI      │              │  Background Service │   │
│  │   (Frontend)    │◄────────────►│  Worker (Backend)   │   │
│  │                 │   Streams    │                     │   │
│  │  React 18.2.0   │              │  Controllers        │   │
│  │  Vite 6.3.6     │              │  Handlers           │   │
│  │  TailwindCSS    │              │  Managers           │   │
│  └─────────────────┘              └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Chrome Storage API
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Storage Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Vault         │  │   Session       │  │   Local     │   │
│  │   (Encrypted)   │  │   (Memory)      │  │   Storage   │   │
│  │   AES-256-GCM   │  │   Auto-Lock     │  │   Settings  │   │
│  └─────────────────┘  └─────────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Model

#### Frontend-Backend Communication
```
Frontend Component ──Stream Request──► Background Service Worker
        │                                    │
        │                                    │ Process Request
        │                                    │
        │◄───Stream Response─────────────────│
        │                                    │
        │                                    │
        │◄───Stream Events───────────────────│
```

#### Content Script Integration
```
Web Page ──EIP-1193 Request──► Content Script ──Stream──► Background
    │                              │
    │                              │
    │◄───EIP-1193 Response─────────│◄───Stream Response───│
    │                              │
    │                              │
    │◄───Provider Events───────────│◄───Stream Events────│
```

## Background Service Worker

### Core Architecture

The background service worker is the **single source of truth** for all wallet state and operations:

```
Background Service Worker
├── background.js (Main Entry Point)
│   ├── Initialization
│   ├── Stream Handler Registration
│   ├── Manager Initialization
│   └── Event Loop
├── BackgroundSessionController (3,979 lines)
│   ├── Vault Management
│   │   ├── Create Vault
│   │   ├── Unlock Vault
│   │   ├── Lock Vault
│   │   └── Vault Operations
│   ├── Wallet Management
│   │   ├── Create Wallet
│   │   ├── Import Wallet
│   │   ├── Switch Wallet
│   │   └── Wallet Operations
│   ├── Session Management
│   │   ├── Session State
│   │   ├── Auto-Lock System
│   │   ├── Session Persistence
│   │   └── Session Security
│   ├── Connected Sites
│   │   ├── AllowList Management
│   │   ├── Permission Management
│   │   ├── Connection Tracking
│   │   └── Security Validation
│   └── Network Coordination
│       ├── Network Switching
│       ├── Network Validation
│       ├── Network Events
│       └── Network Security
├── BackgroundControllers (497 lines)
│   ├── TokenController
│   │   ├── Token Management
│   │   ├── Balance Tracking
│   │   ├── Price Updates
│   │   └── Token Operations
│   ├── NetworkController
│   │   ├── Network Management
│   │   ├── Network Switching
│   │   ├── Network Validation
│   │   └── Network Events
│   ├── TransactionController
│   │   ├── Transaction Management
│   │   ├── Transaction Signing
│   │   ├── Transaction Broadcasting
│   │   └── Transaction Tracking
│   └── NetworkSwitchService
│       ├── Switch Requests
│       ├── Network Validation
│       ├── User Consent
│       └── Switch Execution
└── Stream Handlers
    ├── SessionStreamHandler
    ├── ProviderStreamHandler
    ├── SwapStreamHandler
    ├── SendStreamHandler
    ├── BlockchainStreamHandler
    └── ApiStreamHandler
```

### BackgroundSessionController Deep Dive

#### Vault Management
```javascript
class BackgroundSessionController {
  constructor() {
    this.vault = null;
    this.sessionState = null;
    this.connectedSites = new Map();
    this.autoLockTimer = null;
  }

  // Vault operations
  async createVault(password, recoveryPhrase) {
    const masterKey = await this.deriveMasterKey(password);
    const vault = await this.encryptVault({
      wallets: [],
      settings: {},
      connections: []
    }, masterKey);
    
    await this.storeVault(vault);
    this.vault = vault;
  }

  async unlockVault(password) {
    const masterKey = await this.deriveMasterKey(password);
    const vault = await this.decryptVault(this.storedVault, masterKey);
    
    this.vault = vault;
    this.sessionState = this.createSessionState();
    this.startAutoLockTimer();
  }

  async lockVault() {
    this.clearSensitiveData();
    this.sessionState = null;
    this.stopAutoLockTimer();
  }
}
```

#### Session Management
```javascript
class SessionManager {
  constructor() {
    this.sessionState = {
      isUnlocked: false,
      currentWallet: null,
      connectedSites: new Map(),
      networkState: null,
      lastActivity: Date.now()
    };
    this.autoLockTimeout = 15 * 60 * 1000; // 15 minutes
  }

  startAutoLockTimer() {
    this.autoLockTimer = setInterval(() => {
      if (this.shouldAutoLock()) {
        this.lockVault();
      }
    }, 60000); // Check every minute
  }

  shouldAutoLock() {
    const timeSinceActivity = Date.now() - this.sessionState.lastActivity;
    return timeSinceActivity > this.autoLockTimeout;
  }

  updateActivity() {
    this.sessionState.lastActivity = Date.now();
  }
}
```

### Stream Handler Architecture

#### Stream Communication Pattern
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

#### Session Stream Handler
```javascript
class SessionStreamHandler extends StreamHandler {
  constructor() {
    super('session');
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
}
```

## Frontend Architecture

### React Application Structure

#### Component Hierarchy
```
App.jsx
├── Router
│   ├── Dashboard
│   │   ├── WalletSelector
│   │   ├── BalanceDisplay
│   │   ├── QuickActions
│   │   └── RecentTransactions
│   ├── WalletManagement
│   │   ├── WalletList
│   │   ├── CreateWallet
│   │   ├── ImportWallet
│   │   └── WalletSettings
│   ├── SendTransaction
│   │   ├── RecipientInput
│   │   ├── AmountInput
│   │   ├── GasSettings
│   │   └── TransactionReview
│   ├── SwapTokens
│   │   ├── TokenSelector
│   │   ├── AmountInput
│   │   ├── QuoteDisplay
│   │   └── SwapConfirmation
│   └── Settings
│       ├── SecuritySettings
│       ├── NetworkSettings
│       ├── TokenSettings
│       └── AboutSettings
└── Modals
    ├── ConnectionRequest
    ├── TransactionConfirmation
    ├── NetworkSwitch
    └── ErrorModal
```

#### State Management
```javascript
// WalletProvider Context
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

  // Stream communication
  useEffect(() => {
    const port = chrome.runtime.connect({ name: 'session' });
    
    port.onMessage.addListener((message) => {
      if (message.type === 'response') {
        handleStreamResponse(message);
      } else if (message.type === 'event') {
        handleStreamEvent(message);
      }
    });

    return () => port.disconnect();
  }, []);

  const handleStreamResponse = (message) => {
    const { type, payload } = message;
    
    switch (type) {
      case 'GET_SESSION_STATE':
        setSessionState(payload);
        break;
      case 'GET_WALLET_STATE':
        setWalletState(payload);
        break;
      // ... other handlers
    }
  };

  return (
    <WalletContext.Provider value={{
      walletState,
      sessionState,
      // ... other values
    }}>
      {children}
    </WalletContext.Provider>
  );
};
```

### Custom Hooks Architecture

#### useSessionWallet Hook
```javascript
const useSessionWallet = () => {
  const { sessionState, walletState } = useContext(WalletContext);
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
      
      // Wait for response
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

  return {
    sessionState,
    walletState,
    connectWallet,
    isLoading,
    error
  };
};
```

#### useSwapLogic Hook
```javascript
const useSwapLogic = () => {
  const [swapState, setSwapState] = useState({
    fromToken: null,
    toToken: null,
    amount: '',
    quote: null,
    isQuoteLoading: false
  });

  const getQuote = async (fromToken, toToken, amount) => {
    setSwapState(prev => ({ ...prev, isQuoteLoading: true }));
    
    try {
      const port = chrome.runtime.connect({ name: 'swap' });
      
      port.postMessage({
        type: 'SWAP_GET_QUOTE',
        payload: { fromToken, toToken, amount }
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
      
      setSwapState(prev => ({
        ...prev,
        quote: response,
        isQuoteLoading: false
      }));
      
      return response;
    } catch (error) {
      setSwapState(prev => ({ ...prev, isQuoteLoading: false }));
      throw error;
    }
  };

  return {
    swapState,
    getQuote,
    // ... other swap functions
  };
};
```

## Data Flow Patterns

### Connection Request Flow

```
1. dApp requests connection
   ↓
2. Content script intercepts EIP-1193 request
   ↓
3. Content script sends stream message to background
   ↓
4. Background service worker processes request
   ↓
5. AllowList validation
   ↓
6. Network compatibility check
   ↓
7. User consent request (if needed)
   ↓
8. Connection established
   ↓
9. Provider events emitted to dApp
```

### Transaction Signing Flow

```
1. dApp requests transaction
   ↓
2. Background service worker validates transaction
   ↓
3. SigningRequestManager processes request
   ↓
4. User confirmation dialog shown
   ↓
5. User approves/rejects transaction
   ↓
6. Transaction signing (if approved)
   ↓
7. Transaction broadcast to network
   ↓
8. Confirmation events sent to dApp
```

### Network Switch Flow

```
1. dApp requests network switch
   ↓
2. Background service worker validates request
   ↓
3. NetworkSwitchService processes request
   ↓
4. User consent request shown
   ↓
5. Network switch executed (if approved)
   ↓
6. Provider events emitted
   ↓
7. dApp notified of network change
```

## Security Architecture

### Defense-in-Depth Model

#### Layer 1: Browser Isolation
- **Extension Sandbox**: Isolated from web pages
- **Content Script**: Controlled access to web pages
- **Service Worker**: Isolated from web pages

#### Layer 2: Context Separation
- **Frontend/Backend**: Clear separation of concerns
- **Memory Isolation**: Sensitive data in memory only
- **Process Isolation**: Isolated processes

#### Layer 3: Cryptographic Protection
- **Vault Encryption**: All sensitive data encrypted
- **Key Derivation**: Secure key derivation
- **Memory Security**: Sensitive data in memory only

#### Layer 4: Session Management
- **Auto-Lock System**: Automatic locking
- **Session Persistence**: UI state preserved
- **Memory Clearing**: Sensitive data cleared

#### Layer 5: Access Control
- **AllowList System**: Whitelist-based security
- **Permission Management**: Granular permissions
- **User Consent**: Explicit user consent

#### Layer 6: Attack Mitigation
- **Rate Limiting**: Prevent brute force attacks
- **Request Deduplication**: Prevent duplicate requests
- **Phishing Protection**: Detect and prevent phishing

### Trust Boundaries

#### Trust Boundary 1: Web Page ↔ Content Script
- **EIP-1193 Interface**: Standardized interface
- **Input Validation**: Validate all inputs
- **Output Sanitization**: Sanitize all outputs

#### Trust Boundary 2: Content Script ↔ Background
- **Stream Communication**: Secure communication
- **Message Validation**: Validate all messages
- **Error Handling**: Handle errors gracefully

#### Trust Boundary 3: Frontend ↔ Backend
- **Stream Communication**: Secure communication
- **State Synchronization**: Synchronize state
- **Event Handling**: Handle events properly

#### Trust Boundary 4: Background ↔ Storage
- **Encryption**: All data encrypted
- **Access Control**: Controlled access
- **Integrity Checks**: Verify data integrity

## Performance Architecture

### Optimization Strategies

#### Stream Communication
- **Efficient Serialization**: Optimize message serialization
- **Connection Pooling**: Reuse connections
- **Message Batching**: Batch multiple messages
- **Error Recovery**: Handle connection errors

#### Memory Management
- **Memory Pooling**: Reuse memory objects
- **Garbage Collection**: Optimize garbage collection
- **Memory Monitoring**: Monitor memory usage
- **Memory Leak Detection**: Detect memory leaks

#### Bundle Optimization
- **Code Splitting**: Split code into chunks
- **Tree Shaking**: Remove unused code
- **Minification**: Minify JavaScript
- **Compression**: Compress assets

### Performance Metrics

#### Response Times
- **Average Response**: &lt;150ms
- **Connection Time**: &lt;200ms
- **Transaction Signing**: &lt;300ms
- **Network Switch**: &lt;250ms

#### Resource Usage
- **Memory Usage**: &lt;50MB
- **CPU Usage**: &lt;5%
- **Network Usage**: &lt;1MB/min
- **Storage Usage**: &lt;10MB

## Development Architecture

### Build System

#### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup.html',
        background: 'src/background/background.js',
        content: 'src/content-script.js'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
});
```

#### Build Process
```
1. TypeScript Compilation
   ↓
2. React Compilation
   ↓
3. Bundle Optimization
   ↓
4. Asset Processing
   ↓
5. Manifest Generation
   ↓
6. Extension Packaging
```

### Testing Architecture

#### Unit Testing
```javascript
// Test structure
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── background/
├── __mocks__/
└── test-utils/
```

#### Integration Testing
```javascript
// Integration test setup
const setupIntegrationTest = async () => {
  // Load extension
  const extension = await chrome.management.getSelf();
  
  // Load test page
  await page.goto('http://localhost:3000');
  
  // Inject test utilities
  await page.evaluate(() => {
    window.testUtils = {
      mockProvider: mockProvider,
      mockStreams: mockStreams
    };
  });
};
```

## Troubleshooting

### Common Architecture Issues

#### Service Worker Issues
- **Service Worker Termination**: Handle termination gracefully
- **Message Queue**: Implement message queuing
- **State Persistence**: Persist state across restarts
- **Error Recovery**: Recover from errors

#### Stream Communication Issues
- **Connection Drops**: Handle connection drops
- **Message Loss**: Implement message acknowledgments
- **Serialization Errors**: Handle serialization errors
- **Timeout Issues**: Implement timeouts

#### Memory Issues
- **Memory Leaks**: Detect and fix memory leaks
- **Memory Pressure**: Handle memory pressure
- **Garbage Collection**: Optimize garbage collection
- **Memory Monitoring**: Monitor memory usage

## Next Steps

Now that you understand the architecture deep dive:

1. **[Main Components](./main-components.md)** - Learn about main components
2. **[State Management](./state-management.md)** - Understand state management
3. **[Networks Configuration](./networks-config.md)** - Learn network configuration
4. **[Storage Architecture](./storage.md)** - Understand storage architecture

---

**Ready to learn about main components?** Continue to [Main Components](./main-components.md)!
