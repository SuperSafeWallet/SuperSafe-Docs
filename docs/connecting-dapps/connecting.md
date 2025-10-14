---
sidebar_position: 2
---

# 🔗 Connecting to dApps

Learn how to connect SuperSafe Wallet to decentralized applications and understand the connection process.

## Overview

Connecting SuperSafe Wallet to dApps is a simple, secure process that follows the **Smart Native Connection** architecture. The wallet automatically detects dApp frameworks and provides seamless integration without compatibility hacks.

## Connection Methods

### Direct Injection (Automatic)

The most common connection method where SuperSafe automatically injects the EIP-1193 provider into web pages.

#### How It Works
1. **Page Load**: dApp loads in browser
2. **Provider Injection**: SuperSafe injects provider
3. **Framework Detection**: Detects dApp framework
4. **Connection Ready**: dApp can request connection

#### Supported dApps
- **Uniswap**: Decentralized exchange
- **1inch**: DEX aggregator
- **OpenSea**: NFT marketplace
- **Compound**: Lending protocol
- **Aave**: Lending protocol
- **Any EIP-1193 dApp**: Standard-compliant dApps

### WalletConnect V2/Reown

For mobile dApps or when direct injection isn't available.

#### How It Works
1. **QR Code**: dApp displays QR code
2. **Scan QR**: Scan with SuperSafe mobile app
3. **Pair Devices**: Pair desktop and mobile
4. **Connection Established**: Connection ready

#### Use Cases
- **Mobile dApps**: Mobile-first dApps
- **Desktop dApps**: When direct injection fails
- **Cross-Device**: Connect across devices
- **Public Computers**: Secure connection on public computers

## Step-by-Step Connection Process

### Step 1: Visit dApp

#### Navigate to dApp
1. **Open Browser**: Open Chrome or Brave
2. **Navigate to dApp**: Go to dApp website
3. **Wait for Load**: Wait for dApp to load completely
4. **Look for Connect**: Look for "Connect Wallet" button

#### Example dApp
```
Visit: https://app.uniswap.org
Look for: "Connect Wallet" button
Status: SuperSafe provider injected automatically
```

### Step 2: Initiate Connection

#### Click Connect Button
1. **Find Connect Button**: Look for "Connect Wallet" or similar
2. **Click Button**: Click the connect button
3. **Wallet Selection**: Choose SuperSafe from wallet list
4. **Connection Request**: Connection request appears

#### Wallet Selection
```
Available Wallets:
├── SuperSafe Wallet ✅
├── MetaMask
├── Coinbase Wallet
└── WalletConnect
```

### Step 3: Review Connection Request

#### Connection Request Modal
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
│ ┌─────────────────────────────────┐ │
│ │ Security Status: ✅ Trusted     │ │
│ │ AllowList: ✅ Verified          │ │
│ └─────────────────────────────────┘ │
│ [❌ Reject] [✅ Connect]           │
└─────────────────────────────────────┘
```

#### Review Information
- **dApp Name**: Verify dApp name
- **URL**: Check website URL
- **Network**: Confirm network compatibility
- **Permissions**: Review requested permissions
- **Security Status**: Check security indicators

### Step 4: Handle Network Compatibility

#### If Network Compatible
- **Direct Connection**: Connect immediately
- **No Network Switch**: Stay on current network
- **Full Functionality**: All features available

#### If Network Incompatible
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

#### Network Switch Options
- **Switch Network**: Change to required network
- **Cancel Connection**: Cancel connection request
- **Use Anyway**: Connect despite network mismatch
- **Check dApp**: Verify dApp network support

### Step 5: Approve Connection

#### Approve Connection
1. **Review Details**: Double-check all information
2. **Click Connect**: Click "Connect" button
3. **Wait for Confirmation**: Wait for connection confirmation
4. **Success**: Connection established

#### Connection Success
```
┌─────────────────────────────────────┐
│ ✅ Connected Successfully           │
│ ┌─────────────────────────────────┐ │
│ │ dApp: Uniswap                   │ │
│ │ Account: 0x742d...5f0bEb       │ │
│ │ Network: Ethereum (1)           │ │
│ │ Status: Connected               │ │
│ └─────────────────────────────────┘ │
│ [🎉 Start Using dApp]              │
└─────────────────────────────────────┘
```

## Framework-Specific Connections

### RainbowKit Integration

#### Automatic Detection
- **Framework Detection**: SuperSafe detects RainbowKit
- **Wallet Registration**: Registers as available wallet
- **Seamless Integration**: Appears in wallet list
- **Custom Connector**: Uses custom RainbowKit connector

#### Connection Process
1. **dApp Loads**: RainbowKit dApp loads
2. **Wallet List**: SuperSafe appears in wallet list
3. **Click Connect**: Click SuperSafe in list
4. **Standard Flow**: Follow standard connection flow

### Wagmi Integration

#### Provider Integration
- **Provider Detection**: Detects Wagmi provider
- **Hooks Support**: Full Wagmi hooks support
- **TypeScript**: Complete TypeScript support
- **React Integration**: Seamless React integration

#### Connection Process
1. **dApp Loads**: Wagmi dApp loads
2. **Provider Available**: Provider becomes available
3. **Connect Hook**: Use Wagmi connect hook
4. **Standard Flow**: Follow standard connection flow

### Web3-React Integration

#### Connector Integration
- **Connector Detection**: Detects Web3-React
- **Custom Connector**: Uses custom connector
- **Hooks Support**: Web3-React hooks support
- **Provider Integration**: Provider integration

#### Connection Process
1. **dApp Loads**: Web3-React dApp loads
2. **Connector Available**: Connector becomes available
3. **Connect Function**: Use connect function
4. **Standard Flow**: Follow standard connection flow

### Dynamic Integration

#### Wallet Integration
- **Wallet Detection**: Detects Dynamic wallet
- **Custom Wallet**: Uses custom Dynamic wallet
- **Multi-Wallet**: Multi-wallet support
- **Seamless Integration**: Seamless integration

#### Connection Process
1. **dApp Loads**: Dynamic dApp loads
2. **Wallet Available**: Wallet becomes available
3. **Connect Wallet**: Use Dynamic connect
4. **Standard Flow**: Follow standard connection flow

## Connection Troubleshooting

### Common Issues

#### Connection Not Working
- **Check Extension**: Ensure SuperSafe is installed
- **Refresh Page**: Refresh the dApp page
- **Check Network**: Verify network compatibility
- **Clear Cache**: Clear browser cache

#### Wallet Not Appearing
- **Framework Support**: Check if framework is supported
- **Detection Issues**: Try manual connection
- **Browser Compatibility**: Check browser compatibility
- **Extension Status**: Check extension status

#### Network Mismatch
- **Check dApp**: Verify dApp network support
- **Switch Network**: Switch to required network
- **Manual Switch**: Switch network manually
- **Check Settings**: Verify network settings

### Debug Steps

#### Check Provider
```javascript
// Check if provider is available
if (window.ethereum) {
  console.log('Provider available');
  console.log('Is SuperSafe:', window.ethereum.isSuperSafe);
} else {
  console.log('Provider not available');
}
```

#### Check Connection
```javascript
// Check connection status
ethereum.request({ method: 'eth_accounts' })
  .then(accounts => {
    console.log('Connected accounts:', accounts);
  })
  .catch(error => {
    console.error('Connection error:', error);
  });
```

#### Check Network
```javascript
// Check current network
ethereum.request({ method: 'eth_chainId' })
  .then(chainId => {
    console.log('Current chain ID:', chainId);
  })
  .catch(error => {
    console.error('Network error:', error);
  });
```

## Security Considerations

### Before Connecting

#### Verify dApp
- **Check URL**: Verify dApp URL is correct
- **Look for HTTPS**: Ensure secure connection
- **Check Reputation**: Research dApp reputation
- **Read Reviews**: Check user reviews

#### Review Permissions
- **Account Access**: Understand what account access means
- **Transaction Sending**: Understand transaction permissions
- **Message Signing**: Understand message signing
- **Network Switching**: Understand network switching

### During Connection

#### Check Security Indicators
- **Trusted dApp**: Green indicator for trusted dApps
- **Unknown dApp**: Yellow indicator for unknown dApps
- **Blocked dApp**: Red indicator for blocked dApps
- **Security Warning**: Clear security warnings

#### Verify Information
- **dApp Name**: Verify dApp name is correct
- **URL**: Check URL matches expected dApp
- **Network**: Confirm network is correct
- **Permissions**: Review requested permissions

### After Connection

#### Monitor Activity
- **Transaction History**: Check transaction history
- **Permission Changes**: Monitor permission changes
- **Network Changes**: Watch for network changes
- **Suspicious Activity**: Look for suspicious activity

#### Regular Review
- **Connection List**: Review connected dApps
- **Permission Audit**: Audit granted permissions
- **Security Check**: Regular security checks
- **Update Status**: Keep dApp status updated

## Best Practices

### For Users
- **Verify dApps**: Always verify dApp authenticity
- **Review Permissions**: Understand what permissions mean
- **Check Networks**: Be aware of current network
- **Monitor Activity**: Watch for suspicious activity

### For Developers
- **EIP-1193 Compliance**: Follow EIP-1193 standard
- **Error Handling**: Implement proper error handling
- **User Experience**: Provide clear user experience
- **Security**: Implement security best practices

## Connection Management

### Viewing Connections
- **Connected dApps**: List of connected dApps
- **Connection Details**: Details for each connection
- **Permission Status**: Current permission status
- **Network Status**: Network compatibility status

### Managing Connections
- **Disconnect dApp**: Disconnect from dApp
- **Revoke Permissions**: Revoke specific permissions
- **Update Permissions**: Update permission settings
- **Connection History**: View connection history

## Next Steps

Now that you can connect to dApps:

1. **[Approving Transactions](./approving-transactions.md)** - Learn transaction approval
2. **[Managing Connections](./managing-connections.md)** - Learn connection management
3. **[Security Overview](../security/overview.md)** - Understand security features
4. **[For Developers](../for-developers/integration-overview.md)** - Developer integration

---

**Ready to approve transactions?** Continue to [Approving Transactions](./approving-transactions.md)!
