---
sidebar_position: 3
---

# 💸 Sending and Receiving Funds

Master the art of sending and receiving cryptocurrency with SuperSafe Wallet's intuitive transaction interface.

## Overview

SuperSafe Wallet makes sending and receiving cryptocurrency simple and secure. Whether you're sending ETH, ERC-20 tokens, or receiving funds from others, the process is streamlined with clear confirmations and security checks.

## Sending Funds

### Quick Send

#### From Dashboard
1. **Click Send Button** (💸) in header
2. **Enter Recipient Address**
3. **Select Amount and Token**
4. **Review and Confirm**

#### From Token List
1. **Click Token** in portfolio
2. **Select "Send"** option
3. **Enter Transaction Details**
4. **Confirm Transaction**

### Send Interface

```
┌─────────────────────────────────────┐
│ 💸 Send Transaction                 │
│ ┌─────────────────────────────────┐ │
│ │ Recipient Address:              │ │
│ │ 0x1234567890abcdef1234567890ab  │ │ ← Address Input
│ │ [📋] [👤] [📱]                  │ │ ← Address Actions
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Amount:                         │ │
│ │ [1.5] ETH    [Max] [50%] [25%]  │ │ ← Amount Input
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Token: ETH ▼                    │ │ ← Token Selection
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Gas: 0.002 ETH                 │ │ ← Gas Estimation
│ │ Total: 1.502 ETH               │ │
│ └─────────────────────────────────┘ │
│ [📝 Edit] [✅ Send Transaction]    │ ← Action Buttons
└─────────────────────────────────────┘
```

### Address Input Methods

#### Manual Entry
- **Paste Address**: Copy and paste full address
- **Type Address**: Enter address manually
- **Validation**: Real-time address validation
- **Checksum**: Automatic checksum verification

#### Address Book
- **Saved Addresses**: Access previously saved addresses
- **Contact Management**: Add names to addresses
- **Quick Selection**: Click to select saved address
- **Edit Contacts**: Modify saved address information

#### QR Code Scanner
- **Scan QR Code**: Use camera to scan QR codes
- **Mobile Integration**: Scan from mobile wallets
- **Address Extraction**: Automatically extract address
- **Validation**: Verify scanned address

### Amount Selection

#### Manual Entry
- **Decimal Input**: Enter precise amounts
- **Token Units**: Amount in token units (not wei)
- **Validation**: Check sufficient balance
- **Precision**: Respect token decimals

#### Quick Buttons
- **Max**: Send entire balance (minus gas)
- **50%**: Send half of balance
- **25%**: Send quarter of balance
- **Custom**: Enter specific amount

#### Amount Validation
- **Balance Check**: Ensure sufficient funds
- **Gas Consideration**: Account for gas fees
- **Minimum Amount**: Respect minimum transaction amounts
- **Precision Limits**: Check decimal precision

### Token Selection

#### Available Tokens
- **Native Token**: ETH for gas and transfers
- **ERC-20 Tokens**: All supported tokens
- **Network Specific**: Tokens for current network
- **Custom Tokens**: Manually added tokens

#### Token Information
- **Symbol**: Token symbol (ETH, USDC, etc.)
- **Name**: Full token name
- **Balance**: Available balance
- **Value**: USD value of balance

### Gas Configuration

#### Automatic Gas
- **Gas Estimation**: Automatic gas calculation
- **Network Conditions**: Based on current network
- **Transaction Type**: Optimized for transaction type
- **Speed Optimization**: Balance speed and cost

#### Manual Gas Settings
```
Gas Configuration:
├── Gas Price (Gwei)
│   ├── Slow: 20 Gwei
│   ├── Standard: 30 Gwei
│   └── Fast: 50 Gwei
└── Gas Limit
    ├── Automatic: 21,000
    ├── Custom: User-defined
    └── Maximum: 100,000
```

#### EIP-1559 Support
- **Max Fee**: Maximum fee willing to pay
- **Priority Fee**: Fee for miners
- **Base Fee**: Network-determined base fee
- **Dynamic Pricing**: Automatic fee adjustment

### Transaction Confirmation

#### Review Screen
```
┌─────────────────────────────────────┐
│ ✅ Confirm Transaction              │
│ ┌─────────────────────────────────┐ │
│ │ To: 0x1234...5678              │ │
│ │ Amount: 1.5 ETH                │ │
│ │ Token: Ethereum                 │ │
│ │ Network: SuperSeed              │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Gas Fee: 0.002 ETH             │ │
│ │ Total: 1.502 ETH               │ │
│ │ Estimated Time: ~30 seconds    │ │
│ └─────────────────────────────────┘ │
│ [❌ Cancel] [✅ Confirm & Send]    │
└─────────────────────────────────────┘
```

#### Security Checks
- **Address Verification**: Double-check recipient
- **Amount Confirmation**: Verify amount is correct
- **Network Check**: Ensure correct network
- **Gas Validation**: Confirm gas settings

## Receiving Funds

### Receive Interface

```
┌─────────────────────────────────────┐
│ ⚡ Receive Funds                    │
│ ┌─────────────────────────────────┐ │
│ │ Your Address:                   │ │
│ │ 0x742d35Cc6634C0532925a3b844Bc9e│ │
│ │ 7595f0bEb                      │ │
│ │ [📋 Copy] [📱 Share]            │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │        [QR CODE]                │ │
│ │     Scan with mobile            │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Network: SuperSeed (5330)       │ │
│ │ Token: ETH                      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Address Sharing

#### Copy Address
- **One-Click Copy**: Click to copy address
- **Clipboard Notification**: Confirmation of copy
- **Format Options**: Choose address format
- **Checksum Format**: Use checksummed address

#### QR Code
- **High Resolution**: Clear, scannable QR code
- **Mobile Compatible**: Works with mobile wallets
- **Network Information**: Includes network details
- **Token Specific**: QR for specific token

#### Share Options
- **Text Message**: Share via SMS
- **Email**: Send via email
- **Social Media**: Share on platforms
- **Messaging Apps**: Share via messaging

### Network-Specific Receiving

#### SuperSeed Network
- **Native Token**: ETH for gas and transfers
- **SUPR Token**: SuperSeed network token
- **USDC**: Stablecoin on SuperSeed
- **Custom Tokens**: ERC-20 tokens

#### Optimism Network
- **Native Token**: ETH for gas and transfers
- **OP Token**: Optimism network token
- **USDC**: Stablecoin on Optimism
- **L2 Tokens**: Layer 2 specific tokens

## Transaction History

### Viewing History

#### Transaction List
```
┌─────────────────────────────────────┐
│ 📊 Transaction History              │
│ ┌─────────────────────────────────┐ │
│ │ ✅ Sent     1.5 ETH             │ │
│ │    To: 0x1234...5678           │ │
│ │    Time: 2 hours ago            │ │
│ │    Status: Confirmed            │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ⚡ Received  0.5 ETH             │ │
│ │    From: 0xabcd...efgh          │ │
│ │    Time: 1 day ago              │ │
│ │    Status: Confirmed            │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Transaction Details
- **Transaction Hash**: Unique transaction identifier
- **Block Number**: Block containing transaction
- **Gas Used**: Actual gas consumed
- **Gas Price**: Price paid per gas unit
- **Timestamp**: When transaction occurred
- **Status**: Confirmed, pending, or failed

### Transaction Status

#### Pending
- **In Mempool**: Waiting for miner inclusion
- **Gas Price**: May need higher gas price
- **Network Congestion**: Network may be busy
- **Cancel Option**: Can cancel if needed

#### Confirmed
- **Block Confirmation**: Included in blockchain
- **Final State**: Transaction is final
- **Balance Updated**: Balances reflect changes
- **Explorer Link**: View on blockchain explorer

#### Failed
- **Error Message**: Reason for failure
- **Gas Issues**: Insufficient gas or price
- **Contract Issues**: Smart contract problems
- **Retry Option**: Can retry with adjustments

## Advanced Features

### Batch Transactions

#### Multiple Recipients
- **Add Recipients**: Add multiple addresses
- **Individual Amounts**: Set amount per recipient
- **Single Transaction**: Combine into one transaction
- **Gas Optimization**: More efficient gas usage

#### Token Transfers
- **Different Tokens**: Send different tokens
- **Mixed Transactions**: ETH and tokens together
- **Custom Amounts**: Individual amounts per token
- **Gas Calculation**: Automatic gas estimation

### Transaction Scheduling

#### Delayed Sending
- **Set Time**: Schedule for specific time
- **Recurring**: Set up recurring transactions
- **Conditions**: Send based on conditions
- **Cancel Anytime**: Cancel before execution

#### Conditional Transactions
- **Price Triggers**: Send when price reaches target
- **Balance Triggers**: Send when balance changes
- **Time Triggers**: Send at specific times
- **Event Triggers**: Send based on events

## Security Considerations

### Address Verification

#### Double-Check Address
- **Visual Verification**: Compare address carefully
- **Checksum Validation**: Ensure checksum is correct
- **Network Match**: Verify address is for correct network
- **Recipient Confirmation**: Confirm with recipient

#### Common Mistakes
- **Wrong Network**: Sending to wrong network
- **Typo in Address**: Single character mistake
- **Copy Error**: Incomplete address copy
- **Case Sensitivity**: Wrong case in address

### Transaction Security

#### Before Sending
- **Verify Amount**: Double-check amount
- **Check Network**: Ensure correct network
- **Review Gas**: Confirm gas settings
- **Recipient**: Verify recipient is correct

#### During Transaction
- **Don't Close**: Keep extension open
- **Monitor Status**: Watch transaction status
- **Network Issues**: Check network connection
- **Gas Price**: Monitor gas price changes

## Troubleshooting

### Common Issues

#### Transaction Stuck
- **Check Gas Price**: May need higher gas price
- **Network Congestion**: Wait for network to clear
- **Cancel Transaction**: Cancel and retry
- **Contact Support**: If issue persists

#### Wrong Address
- **Immediate Action**: Contact recipient immediately
- **Check Network**: Verify correct network
- **Recovery Options**: Limited recovery options
- **Learn Lesson**: Be more careful next time

#### Insufficient Gas
- **Increase Gas**: Use higher gas price
- **Check Balance**: Ensure sufficient ETH for gas
- **Gas Estimation**: Use automatic estimation
- **Network Conditions**: Consider network congestion

### Recovery Options

#### Failed Transactions
- **Retry**: Try again with higher gas
- **Cancel**: Cancel stuck transaction
- **Wait**: Wait for network to clear
- **Contact Support**: Get help if needed

#### Wrong Network
- **Check Explorer**: Verify on correct explorer
- **Network Switch**: Switch to correct network
- **Recovery**: May be recoverable on correct network
- **Support**: Contact for assistance

## Best Practices

### Before Sending
- **Verify Address**: Double-check recipient address
- **Test Small Amount**: Send small amount first
- **Check Network**: Ensure correct network
- **Review Details**: Check all transaction details

### During Transaction
- **Monitor Status**: Watch transaction progress
- **Don't Close**: Keep extension open
- **Be Patient**: Allow time for confirmation
- **Check Explorer**: Monitor on blockchain explorer

### After Transaction
- **Verify Confirmation**: Check transaction is confirmed
- **Update Records**: Update your records
- **Notify Recipient**: Let recipient know
- **Save Details**: Keep transaction details

## Next Steps

Now that you can send and receive:

1. **[Manage Tokens](./token-management.md)** - Learn token operations
2. **[Swap Tokens](./swapping-tokens.md)** - Use the swap feature
3. **[Switch Networks](./network-switching.md)** - Work with different networks
4. **[Connect to dApps](../connecting-dapps/connecting.md)** - Use with dApps

---

**Ready to manage tokens?** Continue to [Token Management](./token-management.md)!

**Document Status:** ✅ Current as of February 10, 2026  
**Code Version:** v3.1.8
