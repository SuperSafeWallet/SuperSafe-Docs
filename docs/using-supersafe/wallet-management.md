---
sidebar_position: 2
---

# 💼 Wallet Management

Learn how to manage multiple wallets, switch between them, and organize your crypto portfolio effectively.

## Overview

SuperSafe Wallet supports multiple wallets within a single encrypted vault, allowing you to organize your crypto assets by purpose, network, or personal preference. All wallets share the same vault password but have separate addresses and balances.

## Wallet Types

### Created Wallets
- **New Generation**: Wallets created directly in SuperSafe
- **Recovery Phrase**: Generated from 12-word seed phrase
- **Full Control**: Complete control over private keys
- **Backup**: Can be backed up with recovery phrase

### Imported Wallets
- **Private Key Import**: Imported using private key
- **Recovery Phrase Import**: Imported using seed phrase
- **External Origin**: Originally created in other wallets
- **Full Functionality**: Same features as created wallets

## Creating Additional Wallets

### From Settings

1. **Access Wallet Settings**
   - Click ⚙️ Settings icon
   - Navigate to "Wallets" section
   - Click "Add New Wallet"

2. **Choose Creation Method**
   ```
   Create Options:
   ├── Create New Wallet
   │   └── Generate new private key
   └── Import Existing Wallet
       ├── Private Key
       └── Recovery Phrase
   ```

3. **Create New Wallet**
   - Click "Create New"
   - Enter wallet name (e.g., "Trading Wallet")
   - Choose emoji identifier (e.g., 📈)
   - Confirm creation

### Wallet Naming

#### Best Practices
- **Descriptive Names**: Use clear, descriptive names
- **Purpose-Based**: Name by intended use (Trading, Savings, DeFi)
- **Network-Specific**: Include network if wallet is network-specific
- **Avoid Generic**: Don't use "Wallet 1", "Wallet 2"

#### Examples
```
✅ Good Names:
- "Main Trading Wallet"
- "DeFi Operations"
- "Savings Account"
- "SuperSeed Portfolio"

❌ Avoid:
- "Wallet 1"
- "New Wallet"
- "Test"
- "My Wallet"
```

## Managing Multiple Wallets

### Wallet List View

Access all your wallets in the settings:

```
┌─────────────────────────────────────┐
│ 💼 Your Wallets                     │
│ ┌─────────────────────────────────┐ │
│ │ ✅ Main Wallet        🏠        │ │ ← Active Wallet
│ │    0x742d...5f0bEb             │ │
│ │    Balance: $1,234.56          │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ⚪ Trading Wallet     📈        │ │ ← Other Wallets
│ │    0x1234...5678Ab             │ │
│ │    Balance: $567.89            │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ⚪ DeFi Wallet        🔄        │ │
│ │    0xabcd...efgh12             │ │
│ │    Balance: $890.12            │ │
│ └─────────────────────────────────┘ │
│ [+ Add New Wallet]                 │ ← Add Button
└─────────────────────────────────────┘
```

### Switching Between Wallets

#### Quick Switch
1. **Click Wallet Name** in header
2. **Select Target Wallet** from dropdown
3. **Wallet Switches** immediately
4. **Interface Updates** to show new wallet

#### From Settings
1. **Go to Settings** → Wallets
2. **Click on Target Wallet**
3. **Select "Switch To"**
4. **Confirm Switch**

### Wallet Information

Each wallet displays:

- **Name and Emoji**: Custom identifier
- **Address**: Full wallet address
- **Balance**: Current total balance
- **Network**: Active network
- **Last Used**: Timestamp of last activity
- **Status**: Active or inactive

## Editing Wallet Details

### Rename Wallet

1. **Access Wallet Settings**
   - Go to Settings → Wallets
   - Click on target wallet
   - Select "Edit Details"

2. **Update Information**
   - Change wallet name
   - Select new emoji
   - Save changes

3. **Verification**
   - New name appears in wallet selector
   - Changes persist across sessions

### Change Emoji

1. **Emoji Selector**
   - Click emoji in wallet list
   - Choose from emoji picker
   - Select appropriate emoji

2. **Emoji Guidelines**
   ```
   Recommended Emojis:
   🏠 - Main/Home wallet
   📈 - Trading wallet
   💰 - Savings wallet
   🔄 - DeFi operations
   🎯 - Specific purpose
   ⭐ - Favorite wallet
   ```

## Wallet Security

### Vault Protection

All wallets are protected by the same vault:

- **Single Password**: One password for all wallets
- **AES-256-GCM Encryption**: Enterprise-grade encryption
- **Local Storage**: All data stored locally
- **No Cloud Sync**: No data transmitted to servers

### Access Control

- **Vault Unlock**: Unlock vault to access all wallets
- **Auto-Lock**: All wallets lock together after timeout
- **Session Management**: Single session for all wallets
- **Memory Security**: Private keys cleared on lock

### Backup Strategy

#### Individual Wallet Backup
- **Private Key**: Each wallet has unique private key
- **Recovery Phrase**: Created wallets share recovery phrase
- **Export Options**: Export individual wallet data

#### Vault Backup
- **Complete Vault**: Backup entire encrypted vault
- **Recovery Phrase**: For created wallets
- **Private Keys**: For imported wallets

## Wallet Organization

### By Purpose

Organize wallets by intended use:

```
Portfolio Organization:
├── 🏠 Main Wallet
│   └── Primary funds and daily use
├── 📈 Trading Wallet
│   └── Active trading and DeFi
├── 💰 Savings Wallet
│   └── Long-term holdings
└── 🎯 Specific Purpose
    └── Specialized use cases
```

### By Network

Organize by network preference:

```
Network Organization:
├── SuperSeed Wallets
│   ├── Main SuperSeed
│   └── Trading SuperSeed
├── Optimism Wallets
│   ├── Main Optimism
│   └── DeFi Optimism
└── Multi-Network
    └── Cross-chain operations
```

### By Risk Level

Organize by security/risk level:

```
Risk Organization:
├── 🔒 High Security
│   └── Large amounts, minimal use
├── ⚡ Medium Security
│   └── Regular use, moderate amounts
└── 🚀 High Activity
    └── Frequent transactions, small amounts
```

## Advanced Wallet Features

### Wallet Analytics

View detailed information for each wallet:

- **Transaction History**: All transactions for wallet
- **Balance History**: Balance changes over time
- **Network Activity**: Activity per network
- **Token Holdings**: Detailed token breakdown

### Wallet Export

#### Export Private Key
1. **Access Wallet Settings**
2. **Select "Export Private Key"**
3. **Enter Vault Password**
4. **Copy Private Key**
5. **Store Securely**

#### Export Recovery Phrase
1. **For Created Wallets Only**
2. **Access Security Settings**
3. **Select "Show Recovery Phrase"**
4. **Enter Vault Password**
5. **Write Down Phrase**

### Wallet Import

#### From Private Key
1. **Add New Wallet**
2. **Select "Import Private Key"**
3. **Paste Private Key**
4. **Verify Address**
5. **Complete Import**

#### From Recovery Phrase
1. **Add New Wallet**
2. **Select "Import Recovery Phrase"**
3. **Enter 12-Word Phrase**
4. **Verify Address**
5. **Complete Import**

## Wallet Maintenance

### Regular Tasks

#### Weekly
- **Check Balances**: Verify all wallet balances
- **Review Transactions**: Check transaction history
- **Update Names**: Adjust wallet names if needed
- **Security Check**: Verify wallet security

#### Monthly
- **Backup Vault**: Create fresh vault backup
- **Review Organization**: Adjust wallet organization
- **Clean Up**: Remove unused wallets if needed
- **Update Security**: Review security settings

### Wallet Cleanup

#### Remove Unused Wallets
1. **Verify Empty**: Ensure wallet has no funds
2. **Check History**: Confirm no important transactions
3. **Export Data**: Backup any important data
4. **Remove Wallet**: Delete from wallet list

#### Consolidate Wallets
1. **Identify Similar**: Find wallets with similar purposes
2. **Transfer Funds**: Move funds to primary wallet
3. **Update Records**: Update any external records
4. **Remove Duplicate**: Delete redundant wallets

## Troubleshooting

### Common Issues

#### Wallet Not Switching
- **Refresh Extension**: Reload the extension
- **Check Vault**: Ensure vault is unlocked
- **Restart Browser**: Close and reopen browser
- **Clear Cache**: Clear browser cache

#### Wallet Not Appearing
- **Check Import**: Verify import was successful
- **Refresh List**: Refresh wallet list
- **Check Settings**: Verify wallet settings
- **Re-import**: Try importing again

#### Balance Not Updating
- **Check Network**: Ensure correct network
- **Refresh Data**: Click refresh button
- **Check Connection**: Verify internet connection
- **Wait for Sync**: Allow time for synchronization

### Recovery Options

#### If Wallet Disappears
1. **Check Vault**: Ensure vault is unlocked
2. **Refresh Extension**: Reload the extension
3. **Re-import**: Import wallet again
4. **Check Backup**: Restore from backup

#### If Balance Wrong
1. **Check Network**: Verify correct network
2. **Wait for Sync**: Allow synchronization time
3. **Check Transactions**: Verify transaction history
4. **Contact Support**: If issue persists

## Best Practices

### Security
- **Regular Backups**: Backup vault regularly
- **Strong Password**: Use strong vault password
- **Secure Storage**: Store backups securely
- **Monitor Activity**: Check wallet activity regularly

### Organization
- **Clear Names**: Use descriptive wallet names
- **Logical Grouping**: Group wallets by purpose
- **Regular Review**: Review organization regularly
- **Documentation**: Keep records of wallet purposes

### Maintenance
- **Regular Updates**: Keep extension updated
- **Clean Organization**: Remove unused wallets
- **Monitor Performance**: Watch for issues
- **Stay Informed**: Keep up with updates

## Next Steps

Now that you can manage wallets:

1. **[Send and Receive Funds](./sending-receiving.md)** - Learn transaction basics
2. **[Manage Tokens](./token-management.md)** - Handle token operations
3. **[Swap Tokens](./swapping-tokens.md)** - Use the swap feature
4. **[Switch Networks](./network-switching.md)** - Work with different networks

---

**Ready to send funds?** Continue to [Sending and Receiving](./sending-receiving.md)!
