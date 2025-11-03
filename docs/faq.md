---
sidebar_position: 2
---

# ❓ Frequently Asked Questions

Common questions and answers about SuperSafe Wallet.

## General Questions

### What is SuperSafe Wallet?

SuperSafe Wallet is a **MetaMask-style Chrome extension** that provides secure, efficient Web3 wallet functionality with advanced features like gasless swaps, multi-chain support, and enterprise-grade security.

**Key Features**:
- MetaMask-style Service Worker architecture
- Smart Native Connection for dApps
- Multi-chain support (SuperSeed, Optimism, and more)
- Gasless token swaps via Bebop integration
- Enterprise-grade security (AES-256-GCM encryption)
- AllowList-based dApp security

### How is SuperSafe different from other wallets?

SuperSafe Wallet offers several unique advantages:

**Architecture**:
- **MetaMask-style Service Worker**: Familiar, reliable architecture
- **Smart Native Connection**: Real chainIds, no compatibility hacks
- **Thin Client Pattern**: Frontend focuses on UI, backend handles logic

**Security**:
- **Enterprise-grade encryption**: AES-256-GCM with PBKDF2
- **AllowList system**: Whitelist-based dApp security
- **Memory-first security**: Sensitive data in memory only
- **Security score**: 96/100

**Features**:
- **Gasless swaps**: No gas fees for token swaps
- **MEV protection**: Protection against Maximal Extractable Value
- **Multi-chain ready**: 6 active networks
- **Partner fees**: 1% configurable partner fee

### Is SuperSafe Wallet free to use?

Yes, SuperSafe Wallet is **completely free** to download and use. There are no subscription fees or hidden costs.

**Costs**:
- **Extension**: Free to download and use
- **Transactions**: Standard network gas fees (except for swaps)
- **Swaps**: Gasless swaps with 1% partner fee
- **Support**: Free community and official support

### Which browsers are supported?

SuperSafe Wallet currently supports **Chrome-based browsers**:

**Supported Browsers**:
- **Google Chrome**: Version 88 or later
- **Microsoft Edge**: Version 88 or later
- **Brave Browser**: Version 1.20 or later
- **Opera**: Version 74 or later

**Not Supported**:
- Firefox (planned for future)
- Safari (planned for future)
- Mobile browsers (use WalletConnect V2)

## Installation & Setup

### How do I install SuperSafe Wallet?

**Installation Steps**:
1. **Visit Chrome Web Store**: Go to SuperSafe Wallet page
2. **Click "Add to Chrome"**: Click the install button
3. **Grant Permissions**: Allow necessary permissions
4. **Pin Extension**: Pin SuperSafe to your toolbar
5. **Open Extension**: Click the SuperSafe icon

**After Installation**:
1. **Create Wallet**: Set up your first wallet
2. **Set Password**: Create a strong vault password
3. **Backup Phrase**: Save your 12-word recovery phrase
4. **Start Using**: Begin using SuperSafe Wallet

### What permissions does SuperSafe need?

SuperSafe Wallet requires the following permissions:

**Required Permissions**:
- **Storage**: Store encrypted vault data
- **Tabs**: Inject provider into dApps
- **ActiveTab**: Access current tab for dApp interaction
- **Scripting**: Inject content scripts

**Why These Permissions**:
- **Storage**: Encrypt and store your wallet data
- **Tabs**: Connect to dApps and Web3 applications
- **ActiveTab**: Sign transactions and interact with dApps
- **Scripting**: Provide EIP-1193 provider to dApps

### How do I create my first wallet?

**Creating a New Wallet**:
1. **Open SuperSafe**: Click the SuperSafe icon
2. **Select "Create Wallet"**: Choose create new wallet option
3. **Set Password**: Create a strong vault password (8+ characters)
4. **Generate Phrase**: Generate 12-word recovery phrase
5. **Verify Phrase**: Verify recovery phrase by selecting words
6. **Complete Setup**: Finish wallet creation

**Important Notes**:
- **Password**: Choose a strong, unique password
- **Recovery Phrase**: Store securely, never share
- **Backup**: Create multiple backups of recovery phrase
- **Security**: Follow security best practices

## Security Questions

### How secure is SuperSafe Wallet?

SuperSafe Wallet implements **enterprise-grade security** with a security score of **96/100**:

**Security Features**:
- **AES-256-GCM Encryption**: Enterprise-grade encryption
- **PBKDF2 Key Derivation**: 10,000 iterations
- **Unified Vault System**: All data encrypted together
- **Memory-First Security**: Sensitive data in memory only
- **AllowList System**: Whitelist-based dApp security
- **Auto-Lock System**: Automatic locking after inactivity

**Security Layers**:
1. **Browser Isolation**: Extension sandbox
2. **Context Separation**: Frontend/backend separation
3. **Cryptographic Protection**: AES-256-GCM encryption
4. **Session Management**: Auto-lock and session security
5. **Access Control**: AllowList and permission management
6. **Attack Mitigation**: Rate limiting and phishing protection

### What is the AllowList system?

The **AllowList system** is a whitelist-based security feature that only allows connections from trusted, verified dApps:

**How It Works**:
- **Whitelist Only**: Only dApps in AllowList can connect
- **Automatic Protection**: No manual intervention needed
- **Regular Updates**: AllowList updated regularly
- **Security Review**: All dApps reviewed before addition

**Benefits**:
- **Phishing Protection**: Blocks malicious websites
- **Trusted dApps Only**: Only verified dApps can connect
- **Automatic Updates**: AllowList updated automatically
- **User Safety**: Protects users from scams

### Can I recover my wallet if I forget my password?

**Yes**, you can recover your wallet using your **12-word recovery phrase**:

**Recovery Process**:
1. **Open SuperSafe**: Launch SuperSafe Wallet
2. **Select "Restore Wallet"**: Choose restore option
3. **Enter Phrase**: Enter your 12-word recovery phrase
4. **Set New Password**: Create new vault password
5. **Verify Restoration**: Verify wallet restoration

**Important Notes**:
- **Recovery Phrase**: Store securely, never share
- **Password Recovery**: Not possible without recovery phrase
- **Backup Strategy**: Create multiple backups
- **Security**: Keep recovery phrase secure

### What happens if I lose my recovery phrase?

**Without recovery phrase, wallet recovery is not possible**:

**Why Recovery Phrase is Critical**:
- **Only Recovery Method**: Recovery phrase is the only way to restore wallet
- **No Password Recovery**: Cannot recover with password alone
- **No Centralized Recovery**: No central authority can help
- **Permanent Loss**: Lost recovery phrase means permanent loss

**Prevention**:
- **Multiple Backups**: Create multiple secure backups
- **Secure Storage**: Store in secure, separate locations
- **Regular Verification**: Verify recovery phrase periodically
- **Test Recovery**: Practice recovery process

## Network Questions

### Which networks are supported?

SuperSafe Wallet supports multiple networks with **Smart Native Connection**:

**Active Networks**:
- **SuperSeed** (Chain ID: 5330): Layer 1 blockchain
- **Optimism** (Chain ID: 10): Layer 2 (Optimistic Rollup)

**Planned Networks**:
- **Ethereum** (Chain ID: 1): Layer 1 blockchain
- **Base** (Chain ID: 8453): Layer 2 (Optimistic Rollup)
- **BSC** (Chain ID: 56): Layer 1 blockchain
- **Ethereum Sepolia** (Chain ID: 11155111): Testnet
- **SuperSeed Sepolia** (Chain ID: 53302): Testnet

**Network Features**:
- **Real ChainIds**: No fake chainIds for compatibility
- **Network-First**: Respect dApp's supported networks
- **User Consent**: Always ask for network changes
- **Automatic Detection**: Detect dApp framework automatically

### How do I switch between networks?

**Network Switching**:
1. **Click Network**: Click current network in SuperSafe
2. **Select Network**: Choose desired network from list
3. **Confirm Switch**: Confirm network switch
4. **Wait for Switch**: Wait for network switch to complete
5. **Verify Network**: Verify correct network is active

**Automatic Switching**:
- **dApp Request**: dApp requests network switch
- **User Consent**: User approves or rejects switch
- **Network Switch**: Switch to requested network
- **dApp Notification**: Notify dApp of network change

### Can I add custom networks?

**Yes**, you can add custom networks:

**Adding Custom Networks**:
1. **Open Settings**: Go to SuperSafe settings
2. **Select Networks**: Choose "Networks" section
3. **Add Network**: Click "Add Custom Network"
4. **Enter Details**: Enter network details
5. **Save Network**: Save custom network

**Network Details Required**:
- **Network Name**: Human-readable name
- **Chain ID**: Network chain ID
- **RPC URL**: RPC endpoint URL
- **Block Explorer**: Block explorer URL
- **Currency**: Native currency details

## Swap Questions

### How do gasless swaps work?

SuperSafe Wallet provides **gasless swaps** through Bebop's JAM protocol:

**How It Works**:
1. **Quote Request**: Request swap quote from Bebop
2. **Order Signing**: Sign swap order with EIP-712
3. **Permit2 Approval**: Approve token spending with Permit2
4. **Order Execution**: Bebop executes swap without gas fees
5. **Token Transfer**: Tokens transferred to your wallet

**Benefits**:
- **No Gas Fees**: No gas fees for users
- **MEV Protection**: Protection against Maximal Extractable Value
- **Best Prices**: Competitive pricing through aggregation
- **Multi-Chain**: Swaps across multiple networks

### Which tokens can I swap?

**Supported Tokens**:
- **Native Tokens**: ETH, BNB, etc.
- **Stablecoins**: USDC, USDT, DAI
- **Popular Tokens**: Major ERC-20 tokens
- **Network Tokens**: SUPR, OP, etc.

**Token Support by Network**:
- **SuperSeed**: ETH, SUPR, USDC
- **Optimism**: ETH, OP, USDC
- **Ethereum**: ETH, USDC, USDT, DAI
- **Base**: ETH, USDC
- **BSC**: BNB, USDT, USDC

### What are partner fees?

**Partner fees** are a 1% configurable fee that goes to SuperSafe:

**Fee Structure**:
- **Partner Fee**: 1% of swap amount
- **Bebop Fee**: 0.5% of swap amount
- **Total Fee**: 1.5% of swap amount
- **Fee Token**: Usually ETH or native token

**Fee Benefits**:
- **Development**: Supports SuperSafe development
- **Maintenance**: Covers maintenance costs
- **Features**: Enables new features
- **Support**: Provides user support

## dApp Integration Questions

### How do I connect to dApps?

**Connecting to dApps**:
1. **Visit dApp**: Go to supported dApp website
2. **Click Connect**: Click "Connect Wallet" button
3. **Select SuperSafe**: Choose SuperSafe from wallet list
4. **Approve Connection**: Approve connection in SuperSafe
5. **Start Using**: Begin using dApp with SuperSafe

**Supported dApps**:
- **Uniswap**: Decentralized exchange
- **OpenSea**: NFT marketplace
- **Aave**: Lending protocol
- **Compound**: Lending protocol
- **And many more**: Check AllowList for full list

### Which frameworks are supported?

SuperSafe Wallet supports popular Web3 frameworks:

**Supported Frameworks**:
- **RainbowKit**: Automatic detection and integration
- **Wagmi**: React hooks for Ethereum
- **Web3-React**: React framework for Web3
- **Dynamic**: Multi-wallet integration
- **EIP-1193**: Standard Ethereum provider

**Framework Detection**:
- **Automatic**: SuperSafe automatically detects frameworks
- **Manual**: Can be manually configured
- **Standards**: Follows EIP-1193 standard
- **Compatibility**: High compatibility with existing dApps

### What if a dApp is not in the AllowList?

**If a dApp is not in the AllowList**:

**Options**:
1. **Request Addition**: Contact SuperSafe to add dApp
2. **Wait for Review**: Wait for security review
3. **Use Alternative**: Use alternative wallet temporarily
4. **Check Status**: Check if dApp is being reviewed

**Adding dApp to AllowList**:
1. **Contact Support**: Email security@suersafe.cool
2. **Provide Details**: Provide dApp URL and description
3. **Security Review**: Security team reviews dApp
4. **AllowList Update**: dApp added to AllowList if approved

## Technical Questions

### What is the EIP-1193 provider?

**EIP-1193** is the standard Ethereum provider interface that SuperSafe implements:

**Provider Methods**:
- `eth_requestAccounts`: Request account access
- `eth_accounts`: Get connected accounts
- `eth_chainId`: Get current chain ID
- `eth_sendTransaction`: Send transaction
- `personal_sign`: Sign message
- `eth_signTypedData_v4`: Sign typed data
- `wallet_switchEthereumChain`: Switch network

**Provider Events**:
- `accountsChanged`: Account changed
- `chainChanged`: Network changed
- `connect`: Wallet connected
- `disconnect`: Wallet disconnected

### How does the Service Worker architecture work?

**Service Worker Architecture**:
- **Background Script**: Handles all wallet logic
- **Frontend UI**: Thin client for user interface
- **Content Script**: Injects provider into dApps
- **Stream Communication**: Secure inter-process communication

**Benefits**:
- **Security**: Sensitive data in background only
- **Performance**: Efficient resource usage
- **Reliability**: Stable background processing
- **Scalability**: Easy to extend and maintain

### What is Smart Native Connection?

**Smart Native Connection** ensures real chainIds and seamless dApp integration:

**Principles**:
- **Real ChainIds Only**: Never use fake chainIds
- **Network-First**: Respect dApp's supported networks
- **User Consent**: Always ask for network changes
- **Automatic Detection**: Detect dApp framework automatically
- **Graceful Disconnection**: Handle disconnection gracefully

**Benefits**:
- **Compatibility**: Better dApp compatibility
- **Security**: Prevents chainId spoofing
- **User Experience**: Seamless dApp interaction
- **Standards**: Follows Web3 standards

## Support Questions

### How can I get help?

**Support Channels**:
- **Email**: support@suersafe.cool
- **GitHub**: [SuperSafe Issues](https://github.com/SuperSafeWallet/SuperSafe/issues)
- **Discord**: [SuperSafe Discord](https://discord.gg/supersafe)
- **Twitter**: [@SuperSafeWallet](https://twitter.com/SuperSafeWallet)

**Community Support**:
- **GitHub Discussions**: Community discussions
- **Discord Community**: Community chat
- **Reddit**: r/SuperSafeWallet
- **Telegram**: SuperSafe Community

### How do I report a bug?

**Reporting Bugs**:
1. **Check Existing Issues**: Search GitHub issues first
2. **Create New Issue**: Create new GitHub issue
3. **Provide Details**: Include detailed description
4. **Include Logs**: Attach console logs and screenshots
5. **Follow Template**: Use provided bug report template

**Bug Report Template**:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Step-by-step reproduction
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, extension version
- **Logs**: Console logs and error messages

### How do I request a feature?

**Feature Requests**:
1. **Check Existing Requests**: Search GitHub discussions
2. **Create New Discussion**: Create new GitHub discussion
3. **Provide Details**: Include detailed description
4. **Explain Use Case**: Why this feature is needed
5. **Get Community Input**: Get community feedback

**Feature Request Template**:
- **Description**: Clear description of the feature
- **Use Case**: Why this feature is needed
- **Examples**: Examples of similar features
- **Priority**: Priority level
- **Implementation**: Suggested implementation

---

**Still have questions?** Check out our [Troubleshooting Guide](./troubleshooting.md) or [contact support](mailto:support@suersafe.cool)!
