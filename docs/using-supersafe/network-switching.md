---
sidebar_position: 6
---

# 🌐 Network Switching

Learn how to switch between different blockchain networks and understand network-specific features in SuperSafe Wallet.

## Overview

SuperSafe Wallet supports multiple blockchain networks, each with its own characteristics, tokens, and features. The **Smart Native Connection** architecture ensures seamless dApp integration across all supported networks without compatibility hacks.

## Supported Networks

### Active Networks

#### SuperSeed (Chain ID: 5330)
- **Type**: Layer 1 blockchain
- **Native Token**: ETH
- **Network Token**: SUPR
- **Stablecoin**: USDC
- **RPC**: `https://mainnet.superseed.xyz`
- **Explorer**: `https://explorer.superseed.xyz`
- **Swap Support**: Bebop JAM
- **Status**: ✅ Active

#### Optimism (Chain ID: 10)
- **Type**: Layer 2 (Optimistic Rollup)
- **Native Token**: ETH
- **Network Token**: OP
- **Stablecoin**: USDC
- **RPC**: Alchemy endpoint
- **Explorer**: `https://optimistic.etherscan.io`
- **Swap Support**: Bebop JAM + RFQ
- **Status**: ✅ Active

### Planned Networks

#### Ethereum (Chain ID: 1)
- **Type**: Layer 1 blockchain
- **Native Token**: ETH
- **Stablecoin**: USDC
- **Swap Support**: Bebop JAM + RFQ
- **Status**: 💤 Planned

#### Base (Chain ID: 8453)
- **Type**: Layer 2 (Optimistic Rollup)
- **Native Token**: ETH
- **Stablecoin**: USDC
- **Swap Support**: Bebop JAM + RFQ
- **Status**: 💤 Planned

#### BSC (Chain ID: 56)
- **Type**: Layer 1 blockchain
- **Native Token**: BNB
- **Stablecoin**: USDT
- **Swap Support**: Bebop JAM + RFQ
- **Status**: 💤 Planned

#### Testnets
- **Ethereum Sepolia** (Chain ID: 11155111)
- **SuperSeed Sepolia** (Chain ID: 53302)
- **Status**: 💤 Planned (No swap support)

## Network Switching Interface

### Network Selector

```
┌─────────────────────────────────────┐
│ 🌐 Select Network                   │
│ ┌─────────────────────────────────┐ │
│ │ ✅ SuperSeed (5330)            │ │ ← Active Network
│ │   RPC: mainnet.superseed.xyz   │ │
│ │   Explorer: explorer.superseed │ │
│ │   Swap: Bebop JAM              │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ⚪ Optimism (10)                │ │ ← Available Network
│ │   RPC: opt-mainnet.g.alchemy   │ │
│ │   Explorer: optimistic.etherscan│ │
│ │   Swap: Bebop JAM + RFQ        │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 💤 Ethereum (1) - Coming Soon   │ │ ← Planned Network
│ │   RPC: mainnet.infura.io        │ │
│ │   Explorer: etherscan.io        │ │
│ │   Swap: Bebop JAM + RFQ        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Network Information

Each network displays:
- **Network Name**: Official network name
- **Chain ID**: Unique network identifier
- **RPC Endpoint**: Network RPC URL
- **Explorer**: Block explorer URL
- **Swap Support**: Available swap protocols
- **Status**: Active, planned, or testnet

## Switching Networks

### Manual Network Switch

#### From Header
1. **Click Network Name**: Click current network in header
2. **Select Target Network**: Choose from dropdown
3. **Confirm Switch**: Confirm network change
4. **Wait for Switch**: Wait for network switch

#### From Settings
1. **Go to Settings**: Click settings icon
2. **Navigate to Networks**: Go to network section
3. **Select Network**: Click target network
4. **Apply Changes**: Save network selection

### Automatic Network Switch

#### dApp Requested Switch
1. **dApp Requests Switch**: dApp requests network change
2. **Show Consent Modal**: Display switch confirmation
3. **User Approves/Rejects**: User makes decision
4. **Execute Switch**: Switch if approved

#### Connection-Based Switch
1. **Connect to dApp**: Connect to dApp
2. **Check Network Compatibility**: Verify network support
3. **Suggest Switch**: Suggest network switch if needed
4. **User Decision**: User chooses to switch or not

## Network-Specific Features

### SuperSeed Network

#### Native Features
- **SUPR Token**: SuperSeed network token
- **Custom Contracts**: SuperSeed-specific contracts
- **Fast Transactions**: Quick transaction confirmation
- **Low Fees**: Competitive transaction fees

#### Swap Support
- **Bebop JAM**: Gasless token swaps
- **Permit2**: Token approval system
- **MEV Protection**: Frontrunning protection
- **Best Prices**: Aggregated liquidity

#### Token Support
- **ETH**: Native gas token
- **SUPR**: SuperSeed network token
- **USDC**: USD Coin on SuperSeed
- **Custom ERC-20**: Any ERC-20 token

### Optimism Network

#### Layer 2 Features
- **Fast Transactions**: Layer 2 speed
- **Low Fees**: Reduced transaction costs
- **EVM Compatibility**: Full Ethereum compatibility
- **OP Token**: Optimism network token

#### Swap Support
- **Bebop JAM**: Gasless swaps
- **Bebop RFQ**: Request for Quote swaps
- **Dual Protocol**: Both JAM and RFQ support
- **Advanced Features**: More swap options

#### Token Support
- **ETH**: Native gas token
- **OP**: Optimism token
- **USDC**: USD Coin on Optimism
- **L2 Tokens**: Layer 2 specific tokens

## Smart Native Connection

### Architecture Principles

#### Real ChainIds Only
- **No Fake ChainIds**: Never use fake chainIds
- **Real Network Support**: Support actual networks
- **No Compatibility Hacks**: Clean, standard implementation
- **Future-Proof**: Compatible with all dApps

#### Network-First Approach
- **Respect dApp Networks**: Honor dApp's supported networks
- **User Consent**: Always ask for network changes
- **Automatic Detection**: Detect dApp framework automatically
- **Graceful Handling**: Handle network mismatches gracefully

### Connection Flow

```
dApp Connection Flow:
├── dApp Requests Connection
├── Check Network Compatibility
├── If Compatible
│   ├── Show Connection Request
│   └── User Approves/Rejects
└── If Incompatible
    ├── Show Network Switch Modal
    ├── User Chooses to Switch
    └── Switch Network or Reject
```

## Network Configuration

### RPC Endpoints

#### SuperSeed
- **Primary**: `https://mainnet.superseed.xyz`
- **WebSocket**: `wss://mainnet.superseed.xyz`
- **Backup**: Multiple backup endpoints
- **Status**: Monitored and maintained

#### Optimism
- **Primary**: Alchemy endpoint
- **Backup**: Multiple RPC providers
- **WebSocket**: Not available
- **Status**: Monitored and maintained

### Network Settings

#### Custom RPC
- **Add Custom RPC**: Add custom network endpoints
- **RPC Configuration**: Configure custom RPC settings
- **Network Validation**: Validate custom networks
- **Backup Endpoints**: Set backup RPC endpoints

#### Network Monitoring
- **Health Checks**: Monitor network health
- **Latency Monitoring**: Track RPC response times
- **Failover**: Automatic failover to backup
- **Status Alerts**: Network status notifications

## Network-Specific Tokens

### Token Management

#### Network-Specific Balances
- **Separate Balances**: Each network has separate balances
- **Token Lists**: Different tokens per network
- **Price Feeds**: Network-specific price feeds
- **Portfolio View**: Combined portfolio view

#### Token Migration
- **Cross-Chain**: Move tokens between networks
- **Bridge Support**: Use bridges for token migration
- **Gas Requirements**: Different gas requirements
- **Time Estimates**: Migration time estimates

### Token Discovery

#### Automatic Detection
- **Balance Scanning**: Scan for token balances
- **Token Detection**: Automatically detect tokens
- **Metadata Fetching**: Fetch token metadata
- **Price Integration**: Integrate price feeds

#### Manual Addition
- **Custom Tokens**: Add custom tokens manually
- **Token Lists**: Use curated token lists
- **Community Lists**: Community-maintained lists
- **Verification**: Verify token contracts

## Network Switching Scenarios

### User-Initiated Switch

#### Manual Switch
1. **User Clicks Network**: User clicks network selector
2. **Selects Target**: Chooses target network
3. **Confirms Switch**: Confirms network change
4. **Network Switches**: Network changes immediately

#### Settings Switch
1. **Go to Settings**: Navigate to settings
2. **Network Section**: Go to network settings
3. **Select Network**: Choose target network
4. **Apply Changes**: Save and apply changes

### dApp-Requested Switch

#### Connection Request
1. **dApp Requests Connection**: dApp requests connection
2. **Check Network**: Check if dApp supports current network
3. **Show Switch Modal**: Show network switch modal
4. **User Decision**: User approves or rejects switch

#### Transaction Request
1. **dApp Requests Transaction**: dApp requests transaction
2. **Check Network**: Verify network compatibility
3. **Suggest Switch**: Suggest network switch if needed
4. **Execute Switch**: Switch network if approved

## Troubleshooting

### Common Issues

#### Network Switch Failed
- **RPC Issues**: Check RPC endpoint status
- **Network Congestion**: Wait for network to clear
- **Browser Issues**: Refresh browser or extension
- **Permissions**: Check extension permissions

#### Wrong Network
- **Check dApp**: Verify dApp supports network
- **Manual Switch**: Switch network manually
- **Refresh dApp**: Refresh dApp page
- **Clear Cache**: Clear browser cache

#### Balance Not Showing
- **Network Mismatch**: Ensure correct network
- **Sync Issues**: Wait for synchronization
- **RPC Problems**: Check RPC endpoint
- **Refresh Data**: Force refresh data

### Network Issues

#### RPC Problems
- **Endpoint Down**: RPC endpoint is down
- **High Latency**: Slow RPC response
- **Rate Limiting**: RPC rate limiting
- **Switch RPC**: Try different RPC endpoint

#### Network Congestion
- **High Gas**: Network is congested
- **Slow Transactions**: Transactions are slow
- **Wait Time**: Wait for congestion to clear
- **Alternative Network**: Try different network

## Best Practices

### Network Selection
- **Choose Wisely**: Select appropriate network
- **Consider Fees**: Factor in transaction fees
- **Check dApp Support**: Ensure dApp supports network
- **Liquidity**: Consider available liquidity

### Network Switching
- **Check dApp**: Verify dApp compatibility
- **User Consent**: Always ask for consent
- **Clear Communication**: Explain network changes
- **Smooth Experience**: Ensure smooth switching

### Network Monitoring
- **Health Checks**: Monitor network health
- **Performance**: Track network performance
- **Uptime**: Monitor network uptime
- **Alerts**: Set up network alerts

## Advanced Features

### Multi-Network Portfolio
- **Combined View**: View all networks together
- **Network Breakdown**: See per-network breakdown
- **Total Value**: Combined portfolio value
- **Cross-Network**: Cross-network operations

### Network Analytics
- **Transaction History**: Per-network transaction history
- **Gas Usage**: Network-specific gas usage
- **Performance Metrics**: Network performance data
- **Cost Analysis**: Transaction cost analysis

### Custom Networks
- **Add Networks**: Add custom networks
- **RPC Configuration**: Configure custom RPC
- **Network Validation**: Validate custom networks
- **Token Support**: Add custom network tokens

## Next Steps

Now that you understand network switching:

1. **[Connect to dApps](../connecting-dapps/connecting.md)** - Learn dApp connections
2. **[Security Overview](../security/overview.md)** - Understand security
3. **[For Developers](../for-developers/integration-overview.md)** - Developer integration
4. **[Advanced Topics](../advanced/networks-config.md)** - Advanced network configuration

---

**Ready to connect to dApps?** Continue to [Connecting to dApps](../connecting-dapps/connecting.md)!
