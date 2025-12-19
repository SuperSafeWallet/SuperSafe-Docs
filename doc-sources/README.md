# SuperSafe Wallet - Documentation Index

**Version:** 3.1.4  
**Last Updated:** December 18, 2025  
**Status:** ✅ Current  
**Last Code Update:** December 18, 2025

---

## 📚 Documentation Overview

Welcome to the SuperSafe Wallet documentation. This comprehensive guide covers architecture, security, development, and deployment for the modern Ethereum-compatible browser extension wallet.

### Quick Links

- 🏗️ [**Architecture**](#architecture-documentation) - System design and component structure
- 🔍 [**Transaction System**](#transaction-system) - Transaction decoding and token metadata
- ✍️ [**Signing System**](#signing-system) - Unified signing request management
- 🔒 [**Security**](#security-documentation) - Cryptography and security model
- 📋 [**Audits**](#audit-reports) - Security audits and compliance scorecard
- 💻 [**Development**](#development-documentation) - Backend, frontend, and APIs
- 🔗 [**Integration**](#integration-documentation) - dApp connections and blockchain operations
- 💳 [**Fiat On-Ramp**](#fiat-on-ramp) - Tradesilvania buy crypto integration
- 🛠️ [**Operations**](#operations-documentation) - Development setup and deployment

---

## 🏗️ Architecture Documentation

### [ARCHITECTURE.md](./ARCHITECTURE.md)
**Comprehensive system architecture overview**

- Executive summary and key features
- High-level architecture diagrams
- Component interaction models
- Transaction decoder architecture
- Signing system architecture
- dApp connection architecture
- Service worker lifecycle
- Data flow patterns
- Technology stack
- Directory structure
- Performance metrics
- **🆕 One Window Policy** (v3.1.3)
- **🆕 Responsive Design System** (v3.1.3)

**Key Topics:**
- MetaMask-style Service Worker architecture
- Smart Native Connection design
- Thin Client pattern
- Stream-based communication
- Controller system architecture
- **🆕 One Window Policy implementation**
- **🆕 Responsive viewport detection**

---

## 🔍 Transaction System

### [TRANSACTION_SYSTEM.md](./TRANSACTION_SYSTEM.md)
**Professional-grade transaction decoding system**

- Complete transaction lifecycle
- Universal Router support (Uniswap, PancakeSwap, Velodrome, Aerodrome)
- Token metadata service with multi-layer lookup
- Supported protocols across 7 active EVM networks
- "No Fallbacks" security policy
- Performance optimization strategies

**Key Features:**
- 20+ transaction types supported
- Multi-protocol decoding (Uniswap V2/V3/V4, PancakeSwap Infinity)
- Strict token metadata validation
- LRU caching (1000 entries)
- User-friendly transaction display

### [MULTICHAIN_TRANSACTION_HISTORY.md](./MULTICHAIN_TRANSACTION_HISTORY.md)
**Multichain transaction history visualization system**

- Universal explorer API integration (Blockscout, Moralis, Etherscan)
- Automatic adapter selection based on network
- Transaction and token transfer history
- Combined history views with intelligent merging
- Support for all 8 active networks (SuperSeed, Ethereum, Optimism, Base, BNB Chain, Arbitrum, Monad, Shardeum)

**Key Features:**
- Network-agnostic architecture with pluggable adapters
- Rate limiting and caching per network
- Unified API interface across all explorers
- Easy extensibility for new networks
- Graceful handling of unsupported networks

---

## ✍️ Signing System

### [SIGNING_SYSTEM.md](./SIGNING_SYSTEM.md)
**Unified signing request management**

- Complete signing methods (personal_sign, eth_signTypedData_v4)
- Signing request lifecycle with timeout protection
- Network validation before signing
- Security validation layers
- 100+ test scenarios matrix

**Key Features:**
- SigningRequestManager for unified handling
- SigningModalAdapter for RPC-to-modal transformation
- eth_sign permanently disabled for security
- Snake_case method compatibility
- Permit2 integration with enhanced UI

---

## 🔒 Security Documentation

### [SECURITY.md](./SECURITY.md)
**Military-grade security implementation**

- Security model and principles
- Cryptographic implementation (AES-256-GCM, PBKDF2)
- Unified Vault System
- Session security and auto-lock
- Memory protection strategies
- dApp security (AllowList system)
- Attack mitigation techniques

**Security Score:** 96/100

**Key Features:**
- Zero-knowledge architecture
- Defense-in-depth security layers
- Vault-centric encrypted storage
- Memory-first security model

### [CSP_POLICY.md](./CSP_POLICY.md)
**Content Security Policy documentation**

- Complete CSP directive breakdown
- Domain-by-domain purpose documentation
- Security audit guidelines
- Testing and validation procedures
- Browser compatibility notes

**Key Categories:**
- RPC providers & infrastructure (9 services)
- Block explorers (7 services)
- DEX & swap aggregators (3 services)
- Chain infrastructure (10+ networks)
- CDN & asset sources (5 services)

---

## 📋 Audit Reports

### [AUDITS.md](./AUDITS.md)
**Comprehensive security and system audits**

- Executive summary of all audits
- dApp connection system audit
- Signing system implementation audit
- Transaction decoder implementation audit
- Shared state consistency audit
- ChainId format audit
- Compliance scorecard (A+ grade, 98.8% overall)
- Recommendations for future enhancements

**Audit Status:**
- Total Audits: 10 completed
- Critical Issues: 15 found, 15 resolved (100%)
- Security Vulnerabilities: 5 found, 5 resolved (100%)
- Production Ready: ✅ YES

**Detailed Reports:** All audit reports available in [/Docs/Audits/](./Audits/) directory

---

## 💻 Development Documentation

### Backend

#### [BACKEND.md](./BACKEND.md)
**Complete backend architecture and implementation**

- Service Worker architecture
- BackgroundSessionController (3,979 lines)
- BackgroundControllers system
- Stream handler architecture
- Manager system (SigningRequestManager, PopupManager)
- Handler layer organization
- External integrations (WalletConnect, Bebop)
- Message routing

**Core Components:**
- Session management
- Controller pattern
- Enterprise managers
- Stream handlers
- External service integrations

### Frontend

#### [FRONTEND.md](./FRONTEND.md)
**React application structure and patterns**

- Thin Client pattern implementation
- Component hierarchy (61 components)
- State management (WalletProvider context)
- Adapter pattern for background communication
- Screen flows and user journeys
- Custom hooks architecture
- UI component organization
- **🆕 Responsive Design Implementation** (v3.1.3)
- **🆕 Viewport Detection Utilities** (v3.1.3)
- **🆕 One Window Policy Enforcement** (v3.1.3)

**Key Patterns:**
- Presentational components only
- Zero business logic in frontend
- Stream-based state synchronization
- Adapter abstraction layer
- **🆕 Context-aware responsive layout**
- **🆕 Single window enforcement**

### APIs

#### [API_REFERENCE.md](./API_REFERENCE.md)
**Complete API documentation**

- Stream-based communication protocols
- Session API (unlock, create wallet, switch wallet)
- Provider API (EIP-1193 compliance)
- Controller APIs (tokens, networks, transactions)
- Swap API (Bebop integration)
- External APIs (SuperSafe Price API, Bebop, SuperSeed RPC)

**API Channels:**
- `session` - Wallet operations
- `provider` - dApp requests
- `swap` - Token swaps
- `send` - Transfers
- `blockchain` - Queries
- `api` - External calls

#### [API Key Rotation System](./API_REFERENCE.md#api-key-rotation-system)
**API key rotation and failover system** (see [API_REFERENCE.md](./API_REFERENCE.md#api-key-rotation-system))

- Round-robin rotation algorithm
- Automatic failover on rate limits
- Configuration and setup guide
- Monitoring and debugging
- Security best practices
- Troubleshooting guide

**Key Features:**
- 2x rate limit capacity with backup keys
- Zero-downtime failover
- Transparent retry logic
- Comprehensive logging
- No code changes required

---

## 🔗 Integration Documentation

### dApp Connections

#### [DAPP_CONNECTIONS.md](./DAPP_CONNECTIONS.md)
**dApp connection mechanisms and frameworks**

- Smart Native Connection architecture
- AllowList security system (v3.1.0)
- Direct injection (RainbowKit, Wagmi)
- EIP-6963 provider discovery
- WalletConnect V2 / Reown integration
- Framework detection (automatic)
- Connection flow diagrams
- Network compatibility handling

**Supported Frameworks:**
- RainbowKit
- Wagmi  
- WalletConnect v2
- Dynamic
- Web3-React
- EIP-6963 compliant wallets

### Blockchain Operations

#### [BLOCKCHAIN_OPERATIONS.md](./BLOCKCHAIN_OPERATIONS.md)
**Multi-chain blockchain operations**

- Multi-network support (8 active networks)
- Network switching architecture
- Transaction management and lifecycle
- Smart contract interactions (ERC20, ERC721)
- Provider implementation (EIP-1193, EIP-6963)
- Gas estimation and fee calculation
- RPC communication

**Active Networks:**
| Network | Chain ID | Swap Support | Relay Support |
|---------|----------|--------------|---------------|
| SuperSeed | 5330 | ✅ Bebop (JAM) | ✅ Cross-chain |
| Ethereum | 1 | ✅ Bebop (JAM+RFQ) | ✅ Cross-chain |
| Optimism | 10 | ✅ Bebop (JAM+RFQ) | ✅ Cross-chain |
| Base | 8453 | ✅ Bebop (JAM+RFQ) | ✅ Cross-chain |
| BNB Chain | 56 | ✅ Bebop (JAM+RFQ) | ✅ Cross-chain |
| Arbitrum One | 42161 | ✅ Bebop (JAM+RFQ) | ✅ Cross-chain |
| Shardeum | 8118 | ❌ Not supported | ❌ Not supported |

### Swap System

#### [SWAP_SYSTEM.md](./SWAP_SYSTEM.md)
**Unified swap system with Bebop and Relay.link**

- Unified Panel Architecture (v2.0.0)
- Bebop JAM protocol integration (6 active networks)
- Relay.link cross-chain swaps (6 active networks)
- Multi-chain swap support (8 active networks total)
- Quote fetching and validation
- Gasless swaps with Permit2 (Bebop)
- Cross-chain swaps (Relay.link)
- Partner fee system (configurable)
- Order signing (EIP-712)
- Status polling and tracking

**Features:**
- MEV protection (Bebop)
- Best price aggregation
- Cross-chain support (Relay.link)
- Unified fee system
- Provider switching (Bebop ↔ Relay)
- **Gas validation and scam detection** 🆕

#### [GAS_VALIDATION_SYSTEM.md](./GAS_VALIDATION_SYSTEM.md) 🆕
**Comprehensive gas validation and scam detection**

- Real-time gas price monitoring via Moralis RPC
- Balance validation for native token swaps
- Anomaly detection (scam contracts)
- Network-specific thresholds (Q4 2025 data)
- 5-level progressive alert system
- Button-integrated UI (no separate components)
- Automatic blocking for unsafe transactions

**Key Features:**
- Insufficient balance detection
- Gas > 50% of swap value = automatic block
- Anomalous gas price detection
- Network congestion warnings
- Validated on 6 active swap networks

### Network Management

#### [NETWORK_SWITCHING.md](./NETWORK_SWITCHING.md)
**Network switching system**

- Three-phase switching process (pre-switch, execution, post-switch)
- Promise-based handler system
- Context-aware switching
- Network validation and error handling
- State synchronization across contexts
- Support for all 8 active networks

**Key Features:**
- Pre-switch coordination (validation, handlers)
- Execution phase (network change, state update)
- Post-switch broadcast (notifications, state sync)
- Robust error handling and recovery

### Logging System

#### [LOGGER.md](./LOGGER.md)
**Professional logging system**

- Namespace-based logging architecture
- Multiple log levels (debug, info, warn, error)
- Profile-based configuration
- Performance monitoring
- Development and production profiles

**Key Features:**
- Namespace isolation
- Configurable log levels per namespace
- Performance metrics
- Production-safe logging

---

## 💳 Fiat On-Ramp

### [TRADESILVANIA_INTEGRATION.md](./TRADESILVANIA_INTEGRATION.md)
**Comprehensive Tradesilvania RAMP integration (v3.1.4)**

- Complete fiat-to-crypto on-ramp service integration
- Iframe integration with full-screen widget (327px × 552px)
- 3 active networks (Ethereum, BNB Chain, Arbitrum) + 2 pending (BASE, Optimism)
- Real-time transaction polling system (every 2 seconds)
- Backend webhook integration with RSA-SHA512 signature validation
- Pre-filled wallet address (read-only security)
- Default USDC/USDT selection per network
- Multi-language support (EN, RO, FR, ES, DE, IT)
- External transaction ID tracking
- postMessage API support for real-time updates

**Key Features:**
- One-click access via footer "Buy" button
- Network validation and compatibility checks
- Polling timeout protection (30 minutes)
- Status tracking (waiting, exchanging, sending, settled, rejected, expired)
- Transaction result modal with blockchain explorer links
- Rate limiting (30 req/min per installation token)
- Installation token authentication
- PostgreSQL + Redis caching on backend

**Supported Payment Methods:**
- Visa/Mastercard (instant, EUR/USD/RON)
- SEPA bank transfer (0-3 days, EUR/RON)
- Digital wallets: Neteller, Skrill (instant, EUR)

**Documentation Sections:**
- Integration architecture and data flow
- Network support and configuration
- Polling system implementation
- Webhook solution and postMessage API
- UI specifications and viewport constraints
- Comprehensive testing guide
- Tradesilvania API reference
- Security (webhook signatures, rate limiting)
- Troubleshooting and support

---

## 🛠️ Operations Documentation

### Development

#### [DEVELOPMENT.md](./DEVELOPMENT.md)
**Development setup and workflow**

- Project setup and prerequisites
- Development workflow
- Build system (Vite configs)
- Debugging techniques
- Code standards and conventions
- Common issues and solutions

**Build Commands:**
```bash
npm install          # Install dependencies
npm run build        # Production build
npm run build:debug  # Debug build
npm run zip          # Create distribution package
```

### Deployment

#### [DEPLOYMENT.md](./DEPLOYMENT.md)
**Production deployment process**

- Build process and verification
- Chrome Web Store submission
- Version management (semantic versioning)
- Release checklist
- Production configuration
- Post-release monitoring

**Release Process:**
1. Update version
2. Build and verify
3. Run checklist
4. Package extension
5. Submit to Chrome Web Store
6. Monitor deployment

---

## 📊 Project Metrics

```
Total Project Files: 195+ JavaScript/JSX files
Total Lines of Code: ~33,000+ lines
Documentation: 21+ comprehensive documents (~27,000+ lines)
Supported Networks: 8 active networks
Security Score: 96/100
Architecture Pattern: MetaMask-style Service Worker
Swap Providers: Bebop (6 networks) + Relay.link (6 networks)
Swap Security: Gas validation + scam detection
Fiat On-Ramp: Tradesilvania (3 active + 2 pending networks) - v3.1.4
Fiat Documentation: Consolidated comprehensive guide
UI/UX: Responsive design (popup + fullpage)
Window Policy: One window enforcement
```

---

## 🚀 Quick Start

### For Users

1. Install SuperSafe Wallet from Chrome Web Store
2. Create or import wallet
3. Connect to dApps
4. Start swapping and transacting

### For Developers

```bash
# Clone and setup
git clone https://github.com/SuperSafeWallet/SuperSafe.git
cd SuperSafe
npm install

# Build extension
npm run build

# Load in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Load unpacked → select dist/ folder
```

**Read:** [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup.

---

## 📖 Documentation Guidelines

### Reading Order

**For New Contributors:**
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand system design
2. [SECURITY.md](./SECURITY.md) - Learn security model
3. [DEVELOPMENT.md](./DEVELOPMENT.md) - Setup environment
4. [BACKEND.md](./BACKEND.md) or [FRONTEND.md](./FRONTEND.md) - Deep dive

**For Integrators:**
1. [DAPP_CONNECTIONS.md](./DAPP_CONNECTIONS.md) - Connection methods
2. [API_REFERENCE.md](./API_REFERENCE.md) - API usage
3. [BLOCKCHAIN_OPERATIONS.md](./BLOCKCHAIN_OPERATIONS.md) - Blockchain interactions

**For Security Auditors:**
1. [SECURITY.md](./SECURITY.md) - Security architecture
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
3. [BACKEND.md](./BACKEND.md) - Implementation details

---

## 🔄 Documentation Updates

This documentation is maintained to reflect the current codebase state.

**Last Major Update:** December 18, 2025  
**Code Version:** v3.1.4  
**Last Code Update:** December 18, 2025 (Tradesilvania Documentation Consolidation)  
**Next Review:** February 2026

**Recent Updates:**
- December 18, 2025: Tradesilvania Documentation Consolidation (v3.1.4) 🆕
- December 15, 2025: Tradesilvania Fiat On-Ramp Integration (v3.2.0)
- December 10, 2025: One Window Policy + Responsive Design (v3.1.3)
- December 8, 2025: Full Proxy Migration (v3.1.2)
- November 17, 2025: Gas Validation System (v3.0.0+)

**Update Process:**
1. Code changes trigger documentation review
2. Major releases require full documentation audit
3. Security updates documented immediately
4. API changes updated within same PR

---

## 📞 Support & Contribution

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/SuperSafeWallet/SuperSafe/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SuperSafeWallet/SuperSafe/discussions)
- **Discord**: [SuperSafe Community](#)

### Contributing

We welcome contributions! Please:

1. Read [DEVELOPMENT.md](./DEVELOPMENT.md)
2. Follow code standards
3. Add tests for new features
4. Update documentation
5. Submit PR with clear description

---

## 📜 License

SuperSafe Wallet is open-source software.  
See [LICENSE](../LICENSE) file for details.

---

## 🗂️ Archived Documentation

Previous versions of documentation are available in [`./olds/`](./olds/) directory for historical reference. These documents may contain outdated information and should not be used for current development.

---

**Document Index Status:** ✅ Complete and Current  
**Total Documents:** 21+ comprehensive guides  
**Coverage:** Architecture, Security, Development, Integration, Operations, Logging, Transactions, Signing, Swaps, Network Switching, Gas Validation, One Window Policy, Responsive Design, Fiat On-Ramp (Consolidated)  
**Maintenance:** Active and up-to-date (last review: December 18, 2025)

