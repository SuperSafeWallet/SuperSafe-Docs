---
sidebar_position: 4
---

# 🪙 Token Management

Learn how to manage ERC-20 tokens, add custom tokens, and organize your token portfolio across multiple networks.

## Overview

SuperSafe Wallet provides comprehensive token management across multiple networks. Whether you're dealing with native tokens like ETH, stablecoins like USDC, or custom ERC-20 tokens, the interface makes it easy to view balances, add new tokens, and manage your portfolio.

## Supported Token Types

### Native Tokens
- **ETH**: Ethereum native token (gas and transfers)
- **SUPR**: SuperSeed network token
- **OP**: Optimism network token

### Standard Tokens
- **ERC-20**: Standard Ethereum token contract
- **Stablecoins**: USDC, USDT, DAI, etc.
- **DeFi Tokens**: Governance and utility tokens
- **Custom Tokens**: User-added tokens

### Network-Specific Tokens

#### SuperSeed Network
- **ETH**: Native gas token
- **SUPR**: SuperSeed network token
- **USDC**: USD Coin on SuperSeed
- **Custom ERC-20**: Any ERC-20 token

#### Optimism Network
- **ETH**: Native gas token
- **OP**: Optimism token
- **USDC**: USD Coin on Optimism
- **L2 Tokens**: Layer 2 specific tokens

## Viewing Token Balances

### Portfolio View

```
┌─────────────────────────────────────┐
│ 💰 Portfolio: $1,234.56            │ ← Total Value
│ ┌─────────────────────────────────┐ │
│ │ 🪙 ETH     1.2345   $1,200.00  │ │ ← Token Balances
│ │ 🪙 USDC    34.56    $34.56     │ │
│ │ 🪙 SUPR    100.00   $0.00      │ │
│ │ 🪙 OP      50.00    $0.00      │ │
│ └─────────────────────────────────┘ │
│ [🔄 Refresh] [➕ Add Token]        │ ← Actions
└─────────────────────────────────────┘
```

### Token Information

Each token displays:
- **Symbol**: Token symbol (ETH, USDC, etc.)
- **Name**: Full token name
- **Balance**: Available balance
- **Value**: Current USD value
- **Price**: Price per token
- **Change**: 24h price change
- **Network**: Which network the token is on

### Balance Updates

#### Automatic Updates
- **Real-time**: Balances update automatically
- **Price Feeds**: Live price information
- **Network Sync**: Sync with blockchain
- **Background Refresh**: Updates in background

#### Manual Refresh
- **Refresh Button**: Click to update immediately
- **Pull to Refresh**: Swipe down to refresh
- **Auto Refresh**: Periodic automatic updates
- **Network Change**: Updates when switching networks

## Adding Custom Tokens

### Add Token Interface

```
┌─────────────────────────────────────┐
│ ➕ Add Custom Token                 │
│ ┌─────────────────────────────────┐ │
│ │ Token Contract Address:         │ │
│ │ 0x1234567890abcdef1234567890ab  │ │ ← Contract Address
│ │ [🔍 Verify] [📋 Paste]          │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Token Details:                  │ │
│ │ Symbol: USDC                    │ │ ← Auto-filled
│ │ Name: USD Coin                  │ │
│ │ Decimals: 6                     │ │
│ │ Network: SuperSeed              │ │
│ └─────────────────────────────────┘ │
│ [❌ Cancel] [✅ Add Token]         │
└─────────────────────────────────────┘
```

### Adding Process

#### Step 1: Enter Contract Address
1. **Get Contract Address**: Find token contract address
2. **Paste Address**: Paste into address field
3. **Verify Format**: Ensure correct format
4. **Check Network**: Verify correct network

#### Step 2: Token Verification
1. **Auto-Detection**: SuperSafe detects token details
2. **Verify Information**: Check symbol, name, decimals
3. **Network Check**: Ensure correct network
4. **Validation**: Confirm token is valid

#### Step 3: Add to Portfolio
1. **Review Details**: Check all token information
2. **Confirm Addition**: Add token to portfolio
3. **Balance Check**: Check if you have balance
4. **Portfolio Update**: Token appears in portfolio

### Finding Token Addresses

#### Blockchain Explorers
- **SuperSeed Explorer**: `explorer.superseed.xyz`
- **Optimistic Etherscan**: `optimistic.etherscan.io`
- **Etherscan**: `etherscan.io`
- **Search by Symbol**: Search for token symbol

#### Token Lists
- **Official Websites**: Check token project websites
- **CoinGecko**: Token information and addresses
- **CoinMarketCap**: Token details and contracts
- **DeFi Platforms**: Check DEX token lists

#### Common Token Addresses

##### SuperSeed Network
```
USDC: 0xC316C8252B5F2176d0135Ebb0999E99296998F2e
SUPR: 0x4200000000000000000000000000000000000042
```

##### Optimism Network
```
USDC: 0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85
OP:   0x4200000000000000000000000000000000000042
```

## Token Operations

### Sending Tokens

#### From Token List
1. **Click Token**: Select token from portfolio
2. **Send Option**: Click "Send" button
3. **Enter Details**: Recipient and amount
4. **Confirm Transaction**: Review and send

#### From Send Interface
1. **Open Send**: Click send button
2. **Select Token**: Choose from dropdown
3. **Enter Amount**: Specify amount to send
4. **Complete Transaction**: Send tokens

### Receiving Tokens

#### Share Address
1. **Open Receive**: Click receive button
2. **Select Token**: Choose specific token
3. **Share Address**: Copy or share QR code
4. **Wait for Funds**: Monitor for incoming tokens

#### Token-Specific QR
- **Token Address**: QR code includes token info
- **Network Information**: Shows correct network
- **Amount Suggestion**: Optional amount in QR
- **Mobile Compatible**: Works with mobile wallets

## Token Settings

### Token Configuration

#### Display Options
- **Show/Hide**: Toggle token visibility
- **Custom Name**: Set custom display name
- **Icon Selection**: Choose custom icon
- **Sort Order**: Arrange token order

#### Price Settings
- **Price Source**: Choose price feed
- **Currency**: Select display currency
- **Update Frequency**: Set refresh rate
- **Price Alerts**: Set price notifications

### Token Management

#### Edit Token
1. **Access Settings**: Go to token settings
2. **Edit Details**: Modify token information
3. **Update Icon**: Change token icon
4. **Save Changes**: Apply modifications

#### Remove Token
1. **Select Token**: Choose token to remove
2. **Remove Option**: Click remove button
3. **Confirm Removal**: Confirm action
4. **Portfolio Update**: Token removed from list

## Portfolio Analytics

### Portfolio Overview

```
┌─────────────────────────────────────┐
│ 📊 Portfolio Analytics              │
│ ┌─────────────────────────────────┐ │
│ │ Total Value: $1,234.56          │ │
│ │ 24h Change: +$12.34 (+1.01%)    │ │
│ │ 7d Change: +$45.67 (+3.85%)     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Asset Allocation:               │ │
│ │ ████████████ ETH (85%)          │ │
│ │ ████ USDC (12%)                 │ │
│ │ ██ SUPR (3%)                    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Performance Metrics

#### Price Tracking
- **Current Price**: Live token prices
- **24h Change**: Daily price change
- **7d Change**: Weekly price change
- **30d Change**: Monthly price change
- **All Time**: Since first purchase

#### Portfolio Metrics
- **Total Value**: Sum of all token values
- **Portfolio Change**: Overall portfolio change
- **Best Performer**: Highest gaining token
- **Worst Performer**: Lowest performing token

### Historical Data

#### Price Charts
- **1 Day**: Hourly price data
- **7 Days**: Daily price data
- **30 Days**: Daily price data
- **1 Year**: Weekly price data
- **All Time**: Monthly price data

#### Transaction History
- **All Transactions**: Complete transaction log
- **Token Specific**: Transactions for specific token
- **Date Range**: Filter by date range
- **Transaction Type**: Send, receive, swap

## Token Security

### Token Verification

#### Contract Verification
- **Source Code**: Verify contract source code
- **Audit Reports**: Check security audits
- **Community Trust**: Research community feedback
- **Official Sources**: Use official token addresses

#### Scam Prevention
- **Address Verification**: Double-check contract addresses
- **Official Websites**: Use official project websites
- **Community Warnings**: Check for scam warnings
- **Research Tokens**: Research before adding

### Token Permissions

#### Token Approvals
- **Approval Management**: Manage token approvals
- **Revoke Approvals**: Remove unnecessary approvals
- **Approval Limits**: Set approval limits
- **Security Monitoring**: Monitor approval changes

#### DApp Interactions
- **Permission Requests**: Review dApp permissions
- **Token Access**: Control token access
- **Revoke Access**: Remove dApp access
- **Security Alerts**: Get security notifications

## Advanced Features

### Token Lists

#### Curated Lists
- **Official Lists**: Use official token lists
- **Community Lists**: Community-maintained lists
- **Custom Lists**: Create custom token lists
- **List Management**: Manage multiple lists

#### List Sources
- **Token Lists**: Official token list repositories
- **DEX Lists**: Exchange token lists
- **DeFi Lists**: DeFi protocol token lists
- **Custom Sources**: Add custom list sources

### Token Swapping

#### Built-in Swaps
- **Quick Swap**: Swap tokens directly
- **Price Comparison**: Compare swap prices
- **Slippage Settings**: Configure slippage tolerance
- **Gas Optimization**: Optimize gas usage

#### External Swaps
- **DEX Integration**: Connect to DEXs
- **Aggregator Support**: Use price aggregators
- **Cross-Chain**: Swap across networks
- **Advanced Options**: Advanced swap settings

## Troubleshooting

### Common Issues

#### Token Not Showing
- **Check Network**: Ensure correct network
- **Verify Address**: Check contract address
- **Refresh Balance**: Try refreshing
- **Add Manually**: Add token manually

#### Wrong Balance
- **Network Mismatch**: Check correct network
- **Sync Issues**: Wait for synchronization
- **Contract Issues**: Verify token contract
- **Refresh Data**: Force refresh

#### Price Not Updating
- **Price Feed**: Check price feed source
- **Network Connection**: Verify internet connection
- **Token Support**: Ensure token is supported
- **Manual Update**: Force price update

### Token Issues

#### Invalid Token
- **Contract Address**: Verify address is correct
- **Network Check**: Ensure correct network
- **Token Exists**: Verify token exists
- **Remove Token**: Remove invalid token

#### Balance Issues
- **Transaction Pending**: Wait for confirmation
- **Network Sync**: Allow time for sync
- **Contract Problems**: Check token contract
- **Contact Support**: Get help if needed

## Best Practices

### Token Management
- **Verify Sources**: Always verify token sources
- **Regular Updates**: Keep token lists updated
- **Security First**: Prioritize security
- **Research Tokens**: Research before adding

### Portfolio Organization
- **Logical Grouping**: Group tokens logically
- **Regular Review**: Review portfolio regularly
- **Clean Up**: Remove unused tokens
- **Documentation**: Keep records of tokens

### Security
- **Approval Management**: Manage token approvals
- **Scam Prevention**: Be aware of scams
- **Official Sources**: Use official sources
- **Community Research**: Check community feedback

## Next Steps

Now that you can manage tokens:

1. **[Swap Tokens](./swapping-tokens.md)** - Learn about token swapping
2. **[Switch Networks](./network-switching.md)** - Work with different networks
3. **[Connect to dApps](../connecting-dapps/connecting.md)** - Use tokens with dApps
4. **[Security Overview](../security/overview.md)** - Learn about security

---

**Ready to swap tokens?** Continue to [Swapping Tokens](./swapping-tokens.md)!
