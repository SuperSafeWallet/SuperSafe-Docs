---
sidebar_position: 1
---

# 🔗 How dApp Connections Work

Understand the **Smart Native Connection** architecture and how SuperSafe Wallet seamlessly integrates with decentralized applications.

## Overview

SuperSafe Wallet implements a **Smart Native Connection** system that provides seamless, secure integration with dApps without compatibility hacks or fake chainIds. This architecture ensures real network support, user consent, and automatic framework detection.

## Smart Native Connection Architecture

### Core Principles

#### Real ChainIds Only
- **No Fake ChainIds**: Never use fake chainIds for compatibility
- **Real Network Support**: Support actual blockchain networks
- **Standard Compliance**: Follow EIP-1193 and EIP-6963 standards
- **Future-Proof**: Compatible with all current and future dApps

#### Network-First Approach
- **Respect dApp Networks**: Honor dApp's supported networks
- **User Consent**: Always ask for network changes
- **Automatic Detection**: Detect dApp framework automatically
- **Graceful Handling**: Handle network mismatches gracefully

#### User Consent
- **Connection Requests**: Clear connection request prompts
- **Network Switches**: Explicit consent for network changes
- **Transaction Approvals**: Clear transaction confirmation
- **Revocation Rights**: Easy connection revocation

### Connection Mechanisms

#### Direct Injection
- **Provider Injection**: Inject EIP-1193 provider into web pages
- **Content Script**: Chrome extension content script
- **Window Object**: Attach to `window.ethereum`
- **Automatic Detection**: Detect when dApp requests connection

#### WalletConnect V2/Reown
- **QR Code Pairing**: Pair via QR code scanning
- **Deep Link**: Mobile app deep linking
- **Session Management**: Persistent session management
- **Multi-Device**: Support multiple devices

## EIP-1193 Provider Implementation

### Provider Interface

SuperSafe implements the standard EIP-1193 provider interface:

```javascript
// Provider object structure
window.ethereum = {
  // Properties
  isSuperSafe: true,
  isConnected: false,
  chainId: "0x14a2", // SuperSeed (5330)
  
  // Methods
  request: async (args) => { /* ... */ },
  on: (event, handler) => { /* ... */ },
  removeListener: (event, handler) => { /* ... */ },
  
  // Events
  accountsChanged: (accounts) => { /* ... */ },
  chainChanged: (chainId) => { /* ... */ },
  connect: (connectInfo) => { /* ... */ },
  disconnect: (error) => { /* ... */ }
}
```

### Supported Methods

#### Account Methods
- **`eth_requestAccounts`**: Request account access
- **`eth_accounts`**: Get current accounts
- **`eth_coinbase`**: Get current account

#### Network Methods
- **`eth_chainId`**: Get current chain ID
- **`wallet_switchEthereumChain`**: Switch networks
- **`wallet_addEthereumChain`**: Add custom networks

#### Transaction Methods
- **`eth_sendTransaction`**: Send transactions
- **`eth_signTransaction`**: Sign transactions
- **`eth_sendRawTransaction`**: Send raw transactions

#### Signing Methods
- **`personal_sign`**: Sign messages
- **`eth_sign`**: Sign data
- **`eth_signTypedData_v4`**: Sign typed data (EIP-712)

#### Utility Methods
- **`eth_requestPermissions`**: Request permissions
- **`wallet_getPermissions`**: Get current permissions
- **`eth_getEncryptionPublicKey`**: Get encryption key

## Framework Detection

### Supported Frameworks

#### RainbowKit
- **Detection**: Automatic RainbowKit detection
- **Integration**: Seamless RainbowKit integration
- **Wallet List**: Appears in RainbowKit wallet list
- **Custom Connector**: Custom RainbowKit connector

#### Wagmi
- **Detection**: Automatic Wagmi detection
- **Hooks**: Full Wagmi hooks support
- **Providers**: Wagmi provider integration
- **TypeScript**: Full TypeScript support

#### Web3-React
- **Detection**: Web3-React detection
- **Connector**: Custom Web3-React connector
- **Hooks**: Web3-React hooks support
- **Providers**: Provider integration

#### Dynamic
- **Detection**: Dynamic wallet detection
- **Integration**: Dynamic wallet integration
- **Custom Wallet**: Custom Dynamic wallet
- **Multi-Wallet**: Multi-wallet support

### Detection Process

```
Framework Detection Flow:
├── Page Load
├── Scan for Framework
├── If RainbowKit Detected
│   ├── Register Wallet
│   └── Enable Integration
├── If Wagmi Detected
│   ├── Register Provider
│   └── Enable Hooks
├── If Web3-React Detected
│   ├── Register Connector
│   └── Enable Hooks
└── If Dynamic Detected
    ├── Register Wallet
    └── Enable Integration
```

## AllowList Security System

### Purpose

The AllowList system provides an additional layer of security by whitelisting trusted dApps and preventing connections from potentially malicious websites.

### AllowList Structure

```json
{
  "policies": {
    "https://app.uniswap.org": {
      "allowed": true,
      "networks": ["0x1", "0xa", "0x14a2"],
      "permissions": ["eth_requestAccounts", "eth_sendTransaction"],
      "description": "Uniswap - Decentralized Exchange"
    },
    "https://app.1inch.io": {
      "allowed": true,
      "networks": ["0x1", "0xa", "0x14a2"],
      "permissions": ["eth_requestAccounts", "eth_sendTransaction"],
      "description": "1inch - DEX Aggregator"
    }
  }
}
```

### Policy Enforcement

#### Connection Validation
- **Origin Check**: Verify request origin
- **Network Check**: Check network compatibility
- **Permission Check**: Validate requested permissions
- **Policy Lookup**: Look up origin in AllowList

#### Network Compatibility
- **Supported Networks**: Check if dApp supports current network
- **Network Switch**: Suggest network switch if needed
- **User Consent**: Ask for network switch consent
- **Graceful Fallback**: Handle unsupported networks

## Connection Flow

### Initial Connection

```
Connection Flow:
├── dApp Requests Connection
├── Check AllowList
├── If Allowed
│   ├── Check Network Compatibility
│   ├── If Compatible
│   │   ├── Show Connection Request
│   │   └── User Approves/Rejects
│   └── If Incompatible
│       ├── Show Network Switch Modal
│       ├── User Chooses to Switch
│       └── Switch Network or Reject
└── If Not Allowed
    ├── Show Security Warning
    └── User Chooses to Proceed
```

### Connection Request Modal

```
┌─────────────────────────────────────┐
│ 🔗 Connection Request               │
│ ┌─────────────────────────────────┐ │
│ │ dApp: Uniswap                   │ │
│ │ URL: https://app.uniswap.org    │ │
│ │ Network: SuperSeed (5330)       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Requested Permissions:          │ │
│ │ • View wallet address           │ │
│ │ • Send transactions             │ │
│ │ • Sign messages                 │ │
│ └─────────────────────────────────┘ │
│ [❌ Reject] [✅ Connect]           │
└─────────────────────────────────────┘
```

### Network Switch Modal

```
┌─────────────────────────────────────┐
│ 🌐 Network Switch Required         │
│ ┌─────────────────────────────────┐ │
│ │ dApp: Uniswap                   │ │
│ │ Current: SuperSeed (5330)       │ │
│ │ Required: Ethereum (1)          │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Switch to Ethereum?             │ │
│ │ This will change your active    │ │
│ │ network for all dApps.          │ │
│ └─────────────────────────────────┘ │
│ [❌ Cancel] [✅ Switch Network]    │
└─────────────────────────────────────┘
```

## Provider Events

### Event Types

#### Connection Events
- **`connect`**: Wallet connected to dApp
- **`disconnect`**: Wallet disconnected from dApp
- **`accountsChanged`**: Active account changed
- **`chainChanged`**: Network changed

#### Transaction Events
- **`message`**: Incoming message from dApp
- **`notification`**: Wallet notification
- **`error`**: Error occurred

### Event Handling

#### dApp Event Listening
```javascript
// Listen for account changes
ethereum.on('accountsChanged', (accounts) => {
  console.log('Accounts changed:', accounts);
});

// Listen for network changes
ethereum.on('chainChanged', (chainId) => {
  console.log('Chain changed:', chainId);
});

// Listen for connection
ethereum.on('connect', (connectInfo) => {
  console.log('Connected:', connectInfo);
});

// Listen for disconnection
ethereum.on('disconnect', (error) => {
  console.log('Disconnected:', error);
});
```

#### Wallet Event Emission
- **Account Changes**: Emit when user switches accounts
- **Network Changes**: Emit when user switches networks
- **Connection Status**: Emit connection/disconnection events
- **Error Events**: Emit error events

## Security Features

### Origin Validation

#### URL Validation
- **HTTPS Only**: Only allow HTTPS connections
- **Domain Validation**: Validate domain names
- **Subdomain Support**: Support subdomains
- **Port Validation**: Validate port numbers

#### AllowList Enforcement
- **Whitelist Check**: Check against AllowList
- **Policy Lookup**: Look up origin policies
- **Permission Validation**: Validate requested permissions
- **Network Check**: Check network compatibility

### Permission Management

#### Requested Permissions
- **Account Access**: View wallet address
- **Transaction Sending**: Send transactions
- **Message Signing**: Sign messages
- **Network Switching**: Switch networks

#### Permission Granularity
- **Per-dApp**: Different permissions per dApp
- **Time-Limited**: Permissions can expire
- **Revocable**: Permissions can be revoked
- **Auditable**: Permission history tracking

### Phishing Protection

#### Visual Indicators
- **Trusted dApp**: Green indicator for trusted dApps
- **Unknown dApp**: Yellow indicator for unknown dApps
- **Blocked dApp**: Red indicator for blocked dApps
- **Security Warning**: Clear security warnings

#### URL Verification
- **Domain Check**: Verify domain authenticity
- **Certificate Check**: Check SSL certificates
- **Phishing Detection**: Detect phishing attempts
- **User Warnings**: Warn users about suspicious sites

## Troubleshooting

### Common Issues

#### Connection Failed
- **Check AllowList**: Verify dApp is in AllowList
- **Network Mismatch**: Check network compatibility
- **Browser Issues**: Refresh browser or extension
- **Permissions**: Check extension permissions

#### Framework Not Detected
- **Framework Support**: Check if framework is supported
- **Detection Issues**: Try manual connection
- **Browser Compatibility**: Check browser compatibility
- **Extension Issues**: Check extension status

#### Network Switch Failed
- **Network Support**: Verify network is supported
- **RPC Issues**: Check RPC endpoint status
- **User Consent**: Ensure user approved switch
- **Browser Issues**: Refresh browser

### Debug Information

#### Connection Debug
- **Provider Status**: Check provider status
- **Network Status**: Check network status
- **Account Status**: Check account status
- **Permission Status**: Check permission status

#### Framework Debug
- **Detection Logs**: Check framework detection logs
- **Integration Status**: Check integration status
- **Error Messages**: Check error messages
- **Console Logs**: Check browser console

## Best Practices

### For Users
- **Verify URLs**: Always verify dApp URLs
- **Check Permissions**: Review requested permissions
- **Network Awareness**: Be aware of current network
- **Security First**: Prioritize security

### For Developers
- **EIP-1193 Compliance**: Follow EIP-1193 standard
- **Error Handling**: Implement proper error handling
- **User Experience**: Provide clear user experience
- **Security**: Implement security best practices

## Next Steps

Now that you understand how connections work:

1. **[Connecting to dApps](./connecting.md)** - Learn the connection process
2. **[Approving Transactions](./approving-transactions.md)** - Understand transaction approval
3. **[Managing Connections](./managing-connections.md)** - Learn connection management
4. **[Security Overview](../security/overview.md)** - Understand security features

---

**Ready to connect?** Continue to [Connecting to dApps](./connecting.md)!
