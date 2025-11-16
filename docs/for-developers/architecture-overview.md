---
sidebar_position: 5
---

# 🏗️ Architecture Overview

Understand SuperSafe Wallet's Professionally Standardized Service Worker architecture and how it provides secure, efficient dApp integration.

## Architecture Overview

SuperSafe Wallet implements a **Professionally Standardized Service Worker architecture** that provides a secure, efficient, and scalable foundation for Web3 wallet functionality.

### Key Architectural Principles

- **Single Source of Truth**: Service worker as the central authority
- **Thin Client Pattern**: Frontend focuses on UI, backend handles logic
- **Stream-Based Communication**: Efficient inter-process communication
- **Zero Frontend Crypto**: No cryptographic operations in frontend
- **Professionally Standardized Controllers**: Familiar architecture for developers

## System Architecture

### High-Level Architecture

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
                              │
┌─────────────────────────────────────────────────────────────┐
│                Extension Context                            │
│  ┌─────────────────┐              ┌─────────────────────┐   │
│  │   Popup UI      │              │  Background Service │   │
│  │   (Frontend)    │◄────────────►│  Worker (Backend)   │   │
│  │                 │   Streams    │                     │   │
│  └─────────────────┘              └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Chrome Storage API
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Storage Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Vault         │  │   Session       │  │   Local     │  │
│  │   (Encrypted)   │  │   (Memory)      │  │   Storage   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

#### Background Service Worker
The background service worker is the **single source of truth** for all wallet state and operations:

```
Background Service Worker
├── BackgroundSessionController (3,979 lines)
│   ├── Vault Management
│   ├── Wallet Management
│   ├── Session Management
│   ├── Connected Sites
│   ├── Auto-Lock System
│   └── Network Coordination
├── BackgroundControllers (497 lines)
│   ├── TokenController
│   ├── NetworkController
│   ├── TransactionController
│   └── NetworkSwitchService
├── Stream Handlers
│   ├── SessionStreamHandler
│   ├── ProviderStreamHandler
│   ├── SwapStreamHandler
│   ├── SendStreamHandler
│   ├── BlockchainStreamHandler
│   └── ApiStreamHandler
└── Managers
    ├── SigningRequestManager
    ├── PopupManager
    ├── EIP1193EventsManager
    ├── AutoEscalationManager
    └── StreamPersistenceManager
```

#### Frontend Application
The frontend is a **thin client** that focuses on UI and user interaction:

```
Frontend Application
├── App.jsx (Main Application)
│   ├── Routing
│   ├── Modal Management
│   └── Confirmation Dialogs
├── Components
│   ├── Dashboard
│   ├── Wallet Management
│   ├── Transaction Interface
│   ├── Swap Interface
│   └── Settings
├── Screens
│   ├── Create Wallet
│   ├── Import Wallet
│   ├── Send Transaction
│   ├── Receive Funds
│   └── Swap Tokens
└── Hooks
    ├── useSessionWallet
    ├── useSwapLogic
    └── useNetworkSwitch
```

## Stream-Based Communication

### Communication Architecture

SuperSafe uses **stream-based communication** for efficient inter-process communication:

```
Communication Flow:
Frontend ──Stream──► Background Service Worker
    │                    │
    │                    │
    │◄───Response─────────│
    │                    │
    │                    │
    │◄───Events───────────│
```

#### Stream Channels
- **Session Channel**: Session management and authentication
- **Provider Channel**: EIP-1193 provider operations
- **Swap Channel**: Token swapping operations
- **Send Channel**: Transaction sending
- **Blockchain Channel**: Blockchain operations
- **API Channel**: External API calls

### Stream Handler Architecture

#### Session Stream Handler
```javascript
// Session management operations
const sessionOperations = {
  GET_SESSION_STATE: 'getSessionState',
  UNLOCK: 'unlock',
  CREATE_WALLET: 'createWallet',
  SWITCH_WALLET: 'switchWallet',
  LOCK: 'lock'
};
```

#### Provider Stream Handler
```javascript
// EIP-1193 provider operations
const providerOperations = {
  ETH_REQUEST_ACCOUNTS: 'eth_requestAccounts',
  ETH_ACCOUNTS: 'eth_accounts',
  ETH_CHAIN_ID: 'eth_chainId',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  WALLET_SWITCH_ETHEREUM_CHAIN: 'wallet_switchEthereumChain'
};
```

## Security Architecture

### Defense-in-Depth Model

SuperSafe implements multiple layers of security:

```
Security Layers:
├── Browser Isolation
│   ├── Extension Sandbox
│   ├── Content Script Isolation
│   └── Service Worker Isolation
├── Context Separation
│   ├── Frontend/Backend Separation
│   ├── Memory Isolation
│   └── Process Isolation
├── Cryptographic Protection
│   ├── AES-256-GCM Encryption
│   ├── PBKDF2 Key Derivation
│   └── Double Encryption
├── Session Management
│   ├── Auto-Lock System
│   ├── Memory-Only Storage
│   └── Session Persistence
├── Access Control
│   ├── AllowList System
│   ├── Permission Management
│   └── User Consent
└── Attack Mitigation
    ├── Rate Limiting
    ├── Request Deduplication
    └── Phishing Protection
```

### Trust Boundaries

#### Trust Boundary 1: Browser Isolation
- **Extension Sandbox**: Isolated from web pages
- **Content Script**: Controlled access to web pages
- **Service Worker**: Isolated from web pages

#### Trust Boundary 2: Context Separation
- **Frontend/Backend**: Clear separation of concerns
- **Memory Isolation**: Sensitive data in memory only
- **Process Isolation**: Isolated processes

#### Trust Boundary 3: Cryptographic Protection
- **Vault Encryption**: All sensitive data encrypted
- **Key Derivation**: Secure key derivation
- **Memory Security**: Sensitive data in memory only

## Data Flow Patterns

### Connection Request Flow

```
Connection Request Flow:
1. dApp requests connection
2. Content script intercepts request
3. Background service worker processes request
4. AllowList validation
5. Network compatibility check
6. User consent request
7. Connection established
8. Provider events emitted
```

### Transaction Signing Flow

```
Transaction Signing Flow:
1. dApp requests transaction
2. Background service worker validates
3. SigningRequestManager processes
4. User confirmation dialog
5. Transaction signing
6. Transaction broadcast
7. Confirmation events
```

### Network Switch Flow

```
Network Switch Flow:
1. dApp requests network switch
2. Background service worker validates
3. NetworkSwitchService processes
4. User consent request
5. Network switch execution
6. Provider events emitted
7. dApp notification
```

## Technology Stack

### Core Technologies

#### Frontend
- **React 18.2.0**: Modern React with hooks
- **Vite 6.3.6**: Fast build tool
- **TailwindCSS 3.3.3**: Utility-first CSS
- **Chrome Extension Manifest V3**: Latest extension API

#### Backend
- **Service Worker**: Background processing
- **Streams API**: Inter-process communication
- **Chrome Storage API**: Local storage
- **Crypto API**: Cryptographic operations

#### Blockchain
- **ethers.js 6.13.0**: Ethereum library
- **EIP-1193**: Provider standard
- **EIP-6963**: Wallet discovery
- **WalletConnect V2**: Mobile connectivity

### Performance Metrics

#### Response Times
- **Average Response**: &lt;150ms
- **Connection Time**: &lt;200ms
- **Transaction Signing**: &lt;300ms
- **Network Switch**: &lt;250ms

#### Bundle Sizes
- **Popup Bundle**: 2.1MB
- **Background Bundle**: 1.8MB
- **Content Script**: 0.5MB
- **Total Size**: 4.4MB

## Development Architecture

### Project Structure

```
SuperSafe/
├── src/
│   ├── background/           # Background service worker
│   │   ├── background.js     # Main background script
│   │   ├── controllers/      # Background controllers
│   │   ├── handlers/         # Stream handlers
│   │   ├── managers/         # Background managers
│   │   └── utils/           # Background utilities
│   ├── components/          # React components
│   │   ├── Dashboard/       # Dashboard components
│   │   ├── Wallet/          # Wallet components
│   │   ├── Transaction/     # Transaction components
│   │   └── Swap/            # Swap components
│   ├── screens/             # Screen components
│   │   ├── CreateWallet/    # Create wallet screen
│   │   ├── ImportWallet/    # Import wallet screen
│   │   └── SendTransaction/ # Send transaction screen
│   ├── hooks/               # Custom React hooks
│   │   ├── useSessionWallet.js
│   │   ├── useSwapLogic.js
│   │   └── useNetworkSwitch.js
│   └── utils/               # Utility functions
│       ├── networks.js      # Network configuration
│       ├── provider.js      # Provider utilities
│       └── security.js      # Security utilities
├── public/                  # Static assets
│   ├── assets/             # Images and icons
│   └── allowlist.json      # AllowList configuration
└── docs/                   # Documentation
```

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
      }
    }
  }
});
```

#### Build Output
```
dist/
├── popup.html              # Popup HTML
├── popup.js                # Popup JavaScript
├── background.js           # Background script
├── content-script.js       # Content script
├── assets/                 # Static assets
└── manifest.json           # Extension manifest
```

## Integration Patterns

### dApp Integration

#### Provider Injection
```javascript
// Content script injects provider
const injectProvider = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('provider.js');
  script.onload = () => script.remove();
  document.head.appendChild(script);
};
```

#### Framework Detection
```javascript
// Detect dApp framework
const detectFramework = () => {
  if (window.rainbowkit) return 'rainbowkit';
  if (window.wagmi) return 'wagmi';
  if (window.web3React) return 'web3-react';
  if (window.dynamic) return 'dynamic';
  return 'unknown';
};
```

### Mobile Integration

#### WalletConnect V2
```javascript
// WalletConnect integration
const walletConnect = new WalletConnect({
  projectId: 'your-project-id',
  chains: [1, 10, 5330],
  showQrModal: true
});
```

## Best Practices

### Development Guidelines

#### Security First
- **Validate Inputs**: Always validate user inputs
- **Check Permissions**: Verify required permissions
- **Handle Errors**: Implement proper error handling
- **Test Thoroughly**: Test all security scenarios

#### Performance Optimization
- **Stream Communication**: Use streams for efficiency
- **Memory Management**: Manage memory carefully
- **Bundle Optimization**: Optimize bundle sizes
- **Lazy Loading**: Use lazy loading where appropriate

#### Code Quality
- **TypeScript**: Use TypeScript for type safety
- **Testing**: Write comprehensive tests
- **Documentation**: Document all APIs
- **Code Review**: Regular code reviews

## Troubleshooting

### Common Issues

#### Architecture Issues
- **Service Worker**: Check service worker status
- **Stream Communication**: Verify stream handlers
- **Memory Leaks**: Check for memory leaks
- **Performance**: Monitor performance metrics

#### Integration Issues
- **Provider Injection**: Check provider injection
- **Framework Detection**: Verify framework detection
- **Event Handling**: Check event handlers
- **Error Handling**: Verify error handling

## Next Steps

Now that you understand the architecture:

1. **[Advanced Topics](../advanced/architecture-deep-dive.md)** - Deep dive into architecture
2. **[Main Components](../advanced/main-components.md)** - Learn about main components
3. **[State Management](../advanced/state-management.md)** - Understand state management
4. **[Integration Overview](./integration-overview.md)** - Review integration guide

---

**Ready to learn more about advanced topics?** Continue to [Advanced Topics](../advanced/architecture-deep-dive.md)!
