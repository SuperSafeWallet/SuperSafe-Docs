---
sidebar_position: 1
---

# 🧭 Navigating the Extension

Master the SuperSafe Wallet interface and learn how to efficiently navigate all features.

## Extension Overview

SuperSafe Wallet features a clean, intuitive interface designed for both beginners and advanced users. The extension popup provides quick access to all wallet functions while maintaining security and ease of use.

## Main Interface

### Header Section

The top section of the extension contains essential information and controls:

```
┌─────────────────────────────────────┐
│ [🌐] SuperSeed    [👤] Wallet 1    │ ← Network & Wallet Selector
│ [⚙️] [📊] [🔄] [💸] [⚡] [🔗]      │ ← Action Buttons
└─────────────────────────────────────┘
```

#### Network Selector
- **Current Network**: Shows active network (SuperSeed, Optimism)
- **Network Switch**: Click to change networks
- **Network Status**: Visual indicator of connection status

#### Wallet Selector
- **Current Wallet**: Shows active wallet name and emoji
- **Wallet Switch**: Click to change between wallets
- **Wallet Count**: Indicates total number of wallets

### Action Buttons

Quick access to primary functions:

| Button | Function | Description |
|--------|----------|-------------|
| ⚙️ | Settings | Access wallet settings and preferences |
| 📊 | Portfolio | View detailed portfolio and analytics |
| 🔄 | Swap | Token swapping interface (NEW!) |
| 💸 | Send | Send funds to other addresses |
| ⚡ | Receive | Receive funds and show QR code |
| 🔗 | dApps | Connected dApps and connections |

## Dashboard View

### Portfolio Overview

The main dashboard displays your wallet's current state:

```
┌─────────────────────────────────────┐
│ 💰 Total Balance: $1,234.56        │ ← Portfolio Value
│ ┌─────────────────────────────────┐ │
│ │ 🪙 ETH    1.2345    $1,200.00  │ │ ← Token Balances
│ │ 🪙 USDC   34.56     $34.56     │ │
│ │ 🪙 SUPR   100.00    $0.00      │ │
│ └─────────────────────────────────┘ │
│ [📈] [📊] [🔄] [⚙️]              │ ← Quick Actions
└─────────────────────────────────────┘
```

#### Balance Display
- **Total Value**: Sum of all token values in USD
- **Token List**: Individual token balances
- **Price Updates**: Real-time price information
- **Network Specific**: Balances shown per network

### Quick Actions

Access common functions directly from the dashboard:

- **📈 Portfolio**: Detailed portfolio view
- **📊 Analytics**: Transaction history and charts
- **🔄 Swap**: Quick token swapping
- **⚙️ Settings**: Wallet configuration

## Settings Panel

### Accessing Settings

1. **Click Settings Icon** (⚙️) in the header
2. **Navigate Sections** using the sidebar
3. **Apply Changes** and return to dashboard

### Settings Sections

#### Security Settings
```
🔒 Security
├── Password & Recovery
├── Auto-Lock Settings
├── Session Management
└── Security Audit
```

#### Wallet Management
```
💼 Wallets
├── Wallet List
├── Add New Wallet
├── Import Wallet
└── Wallet Details
```

#### Network Configuration
```
🌐 Networks
├── Active Networks
├── Network Settings
├── Custom Networks
└── Network Status
```

#### Token Management
```
🪙 Tokens
├── Token List
├── Add Custom Token
├── Token Settings
└── Price Sources
```

#### dApp Connections
```
🔗 dApp Connections
├── Connected Sites
├── AllowList Management
├── Connection History
└── Security Settings
```

## Swap Interface (NEW!)

### Accessing Swap

1. **Click Swap Button** (🔄) in header
2. **Select Tokens** from dropdown menus
3. **Enter Amount** to swap
4. **Review Quote** and confirm

### Swap Interface Layout

```
┌─────────────────────────────────────┐
│ 🔄 Token Swap                       │
│ ┌─────────────────────────────────┐ │
│ │ From: ETH    [1.0]    [Max]    │ │ ← Input Token
│ │ To:   USDC   [1,200]  [≈$1,200]│ │ ← Output Token
│ └─────────────────────────────────┘ │
│ Slippage: 0.5%  [⚙️]              │ ← Slippage Settings
│ ┌─────────────────────────────────┐ │
│ │ 💰 Price Impact: 0.1%          │ │ ← Quote Details
│ │ ⛽ Gas: 0.002 ETH              │ │
│ │ 🔄 Route: Bebop JAM            │ │
│ └─────────────────────────────────┘ │
│ [🔄 Swap Tokens]                   │ ← Action Button
└─────────────────────────────────────┘
```

## Network Switching

### Network Selector

Click the network name in the header to switch networks:

```
┌─────────────────────────────────────┐
│ 🌐 Select Network                   │
│ ┌─────────────────────────────────┐ │
│ │ ✅ SuperSeed (5330)            │ │ ← Active Network
│ │   RPC: mainnet.superseed.xyz   │ │
│ │   Explorer: explorer.superseed │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ⚪ Optimism (10)                │ │ ← Available Network
│ │   RPC: opt-mainnet.g.alchemy   │ │
│ │   Explorer: optimistic.etherscan│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Network Features

Each network shows different capabilities:

- **SuperSeed**: Native network with JAM swap support
- **Optimism**: Layer 2 with JAM + RFQ swap support
- **Planned Networks**: Ethereum, Base, BSC (coming soon)

## Wallet Management

### Wallet Selector

Switch between multiple wallets:

```
┌─────────────────────────────────────┐
│ 👤 Select Wallet                    │
│ ┌─────────────────────────────────┐ │
│ │ ✅ My Main Wallet    🏠         │ │ ← Active Wallet
│ │   0x742d...5f0bEb              │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ⚪ Trading Wallet   📈          │ │ ← Other Wallets
│ │   0x1234...5678Ab              │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ⚪ Savings Wallet  💰           │ │
│ │   0xabcd...efgh12              │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Wallet Information

Each wallet shows:
- **Name and Emoji**: Custom identifier
- **Address**: Full wallet address
- **Balance**: Current token balance
- **Status**: Active or inactive

## Transaction Interface

### Send Transaction

```
┌─────────────────────────────────────┐
│ 💸 Send Transaction                 │
│ ┌─────────────────────────────────┐ │
│ │ To: 0x1234...5678              │ │ ← Recipient Address
│ │ Amount: 1.0 ETH                 │ │ ← Amount to Send
│ │ Token: ETH                      │ │ ← Token Selection
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Gas: 0.002 ETH                 │ │ ← Gas Estimation
│ │ Total: 1.002 ETH               │ │
│ └─────────────────────────────────┘ │
│ [📝 Edit] [✅ Send]               │ ← Action Buttons
└─────────────────────────────────────┘
```

### Receive Transaction

```
┌─────────────────────────────────────┐
│ ⚡ Receive Funds                    │
│ ┌─────────────────────────────────┐ │
│ │ Your Address:                   │ │
│ │ 0x742d35Cc6634C0532925a3b844Bc9e│ │
│ │ 7595f0bEb                      │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │        [QR CODE]                │ │ ← QR Code
│ └─────────────────────────────────┘ │
│ [📋 Copy Address] [📱 Share QR]    │ ← Actions
└─────────────────────────────────────┘
```

## Keyboard Shortcuts

### Navigation Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd + 1` | Dashboard | Go to main dashboard |
| `Ctrl/Cmd + 2` | Swap | Open swap interface |
| `Ctrl/Cmd + 3` | Send | Open send transaction |
| `Ctrl/Cmd + 4` | Receive | Open receive interface |
| `Ctrl/Cmd + ,` | Settings | Open settings panel |
| `Ctrl/Cmd + W` | Switch Wallet | Change active wallet |
| `Ctrl/Cmd + N` | Switch Network | Change active network |

### Transaction Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd + Enter` | Confirm | Confirm current transaction |
| `Escape` | Cancel | Cancel current operation |
| `Ctrl/Cmd + R` | Refresh | Refresh balances and data |
| `Ctrl/Cmd + S` | Settings | Quick access to settings |

## Mobile Responsiveness

### Responsive Design

SuperSafe adapts to different screen sizes:

- **Desktop**: Full interface with all features
- **Tablet**: Optimized layout for touch
- **Mobile**: Simplified interface for small screens

### Touch Gestures

- **Swipe**: Navigate between sections
- **Tap**: Select options and buttons
- **Long Press**: Access additional options
- **Pinch**: Zoom QR codes and charts

## Accessibility Features

### Visual Accessibility

- **High Contrast**: Dark mode with high contrast
- **Large Text**: Adjustable text sizes
- **Color Blind**: Color-blind friendly palette
- **Icons**: Clear, descriptive icons

### Keyboard Navigation

- **Tab Order**: Logical tab navigation
- **Focus Indicators**: Clear focus indicators
- **Screen Reader**: Compatible with screen readers
- **Voice Control**: Voice command support

## Tips for Efficient Navigation

### Quick Access

1. **Use Action Buttons**: Primary functions are one click away
2. **Keyboard Shortcuts**: Learn common shortcuts
3. **Recent Actions**: Quick access to recent transactions
4. **Favorites**: Pin frequently used functions

### Organization

1. **Wallet Names**: Use descriptive wallet names
2. **Emoji Identifiers**: Choose clear emojis for wallets
3. **Network Awareness**: Always check current network
4. **Balance Monitoring**: Keep track of token balances

### Security

1. **Lock When Away**: Always lock when stepping away
2. **Verify Addresses**: Double-check recipient addresses
3. **Check Networks**: Ensure correct network before transactions
4. **Review Transactions**: Always review before confirming

## Troubleshooting Navigation

### Common Issues

#### Interface Not Loading
- **Refresh**: Click refresh button or reload extension
- **Restart**: Close and reopen extension
- **Check Network**: Ensure internet connection

#### Buttons Not Working
- **Permissions**: Check extension permissions
- **Update**: Ensure latest version installed
- **Clear Cache**: Clear browser cache and data

#### Slow Performance
- **Close Tabs**: Close unnecessary browser tabs
- **Restart Browser**: Restart browser application
- **Check Resources**: Monitor system resources

## Next Steps

Now that you understand the interface:

1. **[Manage Your Wallets](./wallet-management.md)** - Learn wallet management features
2. **[Send and Receive Funds](./sending-receiving.md)** - Master transactions
3. **[Manage Tokens](./token-management.md)** - Handle token operations
4. **[Swap Tokens](./swapping-tokens.md)** - Use the new swap feature

---

**Ready to manage your wallets?** Continue to [Wallet Management](./wallet-management.md)!

**Document Status:** ✅ Current as of February 10, 2026  
**Code Version:** v3.1.8
