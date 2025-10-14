---
sidebar_position: 5
---

# 🔄 Swapping Tokens

Master the art of token swapping with SuperSafe's integrated Bebop swap system, featuring gasless swaps and MEV protection.

## Overview

SuperSafe Wallet integrates **Bebop's JAM (Just Another Market) protocol** for gasless, MEV-protected token swaps across multiple EVM networks. This advanced swap system provides the best prices, protection from frontrunning attacks, and seamless user experience.

## Key Features

### 🚀 **Gasless Swaps**
- **Permit2 Integration**: Only pay for token approval
- **No Gas Fees**: Swaps are completely gasless
- **Cost Savings**: Significant savings on transaction costs
- **Better UX**: Simplified swap experience

### 🛡️ **MEV Protection**
- **Frontrunning Protection**: Protected from sandwich attacks
- **Best Price Execution**: Always get the best available price
- **Slippage Protection**: Advanced slippage management
- **Secure Routing**: Secure swap routing

### 🌐 **Multi-Chain Support**
- **SuperSeed**: JAM protocol support
- **Optimism**: JAM + RFQ protocol support
- **Planned Networks**: Ethereum, Base, BSC (coming soon)
- **Cross-Chain**: Future cross-chain swap support

### 💰 **Partner Fee System**
- **1% Partner Fee**: Configurable revenue sharing
- **Transparent Fees**: Clear fee breakdown
- **Value Sharing**: Share in protocol value
- **Sustainable Model**: Long-term sustainability

## Supported Networks

### Active Networks

#### SuperSeed (Chain ID: 5330)
- **Protocol**: Bebop JAM
- **API**: `https://api.bebop.xyz/jam/superseed/v2/`
- **Contracts**: Custom SuperSeed deployment
- **Tokens**: ETH, SUPR, USDC, custom ERC-20

#### Optimism (Chain ID: 10)
- **Protocol**: Bebop JAM + RFQ
- **API**: JAM + RFQ endpoints
- **Contracts**: Standard EVM contracts
- **Tokens**: ETH, OP, USDC, L2 tokens

### Planned Networks
- **Ethereum** (Chain ID: 1): JAM + RFQ support
- **Base** (Chain ID: 8453): JAM + RFQ support
- **BSC** (Chain ID: 56): JAM + RFQ support

## Swap Interface

### Main Swap Screen

```
┌─────────────────────────────────────┐
│ 🔄 Token Swap                       │
│ ┌─────────────────────────────────┐ │
│ │ From Token:                     │ │
│ │ [ETH ▼] [1.0] [Max] [50%] [25%]│ │ ← Input Token
│ │ Balance: 5.2345 ETH             │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ To Token:                       │ │
│ │ [USDC ▼] [1,200] [≈$1,200]     │ │ ← Output Token
│ │ Balance: 0 USDC                 │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Slippage: 0.5% [⚙️]            │ │ ← Slippage Settings
│ │ Route: Bebop JAM               │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 💰 Price Impact: 0.1%          │ │ ← Quote Details
│ │ ⛽ Gas: 0.002 ETH (Approval)   │ │
│ │ 🔄 Route: Bebop JAM            │ │
│ │ 💸 Partner Fee: 1%             │ │
│ └─────────────────────────────────┘ │
│ [🔄 Swap Tokens]                   │ ← Action Button
└─────────────────────────────────────┘
```

### Token Selection

#### From Token (Sell)
1. **Click Token Dropdown**: Select token to sell
2. **Choose Amount**: Enter amount or use quick buttons
3. **Balance Check**: Verify sufficient balance
4. **Token Info**: View token details and balance

#### To Token (Buy)
1. **Click Token Dropdown**: Select token to buy
2. **View Quote**: See estimated amount
3. **Token Info**: View token details
4. **Price Impact**: Check price impact

### Amount Selection

#### Manual Entry
- **Precise Amount**: Enter exact amount
- **Decimal Support**: Full decimal precision
- **Validation**: Real-time validation
- **Balance Check**: Ensure sufficient balance

#### Quick Buttons
- **Max**: Use entire balance (minus gas)
- **50%**: Use half of balance
- **25%**: Use quarter of balance
- **Custom**: Enter specific amount

## Swap Process

### Step 1: Get Quote

#### Quote Request
1. **Select Tokens**: Choose from and to tokens
2. **Enter Amount**: Specify amount to swap
3. **Set Slippage**: Configure slippage tolerance
4. **Get Quote**: Request quote from Bebop

#### Quote Information
```
Quote Details:
├── Input Amount: 1.0 ETH
├── Output Amount: 1,200 USDC
├── Price Impact: 0.1%
├── Route: Bebop JAM
├── Gas Required: 0.002 ETH (Approval)
├── Partner Fee: 1% (12 USDC)
└── Total Output: 1,188 USDC
```

### Step 2: Review Quote

#### Quote Review
- **Price Check**: Verify quote is reasonable
- **Slippage Check**: Ensure slippage is acceptable
- **Route Check**: Review swap route
- **Fee Check**: Understand all fees

#### Quote Validation
- **Price Impact**: Check for high price impact
- **Liquidity**: Ensure sufficient liquidity
- **Route Quality**: Verify best route
- **Fee Breakdown**: Understand all costs

### Step 3: Approve Tokens

#### Token Approval
1. **Check Allowance**: Verify current allowance
2. **Approve Token**: Approve token for swap
3. **Gas Payment**: Pay gas for approval
4. **Wait Confirmation**: Wait for approval confirmation

#### Approval Details
- **Token**: Token being approved
- **Spender**: Bebop contract address
- **Amount**: Amount to approve
- **Gas Cost**: Gas required for approval

### Step 4: Execute Swap

#### Swap Execution
1. **Sign Order**: Sign EIP-712 order
2. **Submit Order**: Submit to Bebop
3. **Wait Execution**: Wait for swap execution
4. **Confirm Success**: Verify swap completion

#### Order Details
- **Order Hash**: Unique order identifier
- **Execution Time**: Time to execute
- **Final Amount**: Actual amount received
- **Transaction Hash**: Blockchain transaction

## Advanced Settings

### Slippage Configuration

#### Slippage Options
```
Slippage Settings:
├── 0.1% - Very Low (May fail)
├── 0.5% - Low (Recommended)
├── 1.0% - Medium
├── 2.0% - High
└── Custom - User defined
```

#### Slippage Impact
- **Low Slippage**: Better price, may fail
- **High Slippage**: More likely to succeed, worse price
- **Dynamic Slippage**: Adjust based on market conditions
- **Custom Slippage**: Set specific tolerance

### Route Selection

#### Available Routes
- **Bebop JAM**: Primary route (gasless)
- **Bebop RFQ**: Alternative route (Optimism)
- **Direct**: Direct token swap
- **Multi-hop**: Complex routing

#### Route Optimization
- **Best Price**: Choose route with best price
- **Lowest Slippage**: Minimize slippage
- **Fastest Execution**: Quickest completion
- **Gas Optimization**: Minimize gas costs

### Fee Configuration

#### Fee Breakdown
```
Fee Structure:
├── Network Fee: 0 ETH (Gasless)
├── Partner Fee: 1% (Configurable)
├── Protocol Fee: 0% (Bebop)
└── Total Fee: 1%
```

#### Fee Management
- **Partner Fee**: 1% default, configurable
- **Fee Receiver**: SuperSafe fee address
- **Transparent**: All fees clearly displayed
- **Value Sharing**: Share in protocol value

## Swap Status Tracking

### Status Types

#### Pending
- **Quote Generated**: Quote created successfully
- **Approval Pending**: Waiting for token approval
- **Order Pending**: Order submitted, waiting execution
- **Execution Pending**: Order executing

#### Executed
- **Swap Complete**: Swap executed successfully
- **Tokens Received**: Tokens in your wallet
- **Transaction Confirmed**: Blockchain confirmation
- **Success**: Swap completed successfully

#### Failed
- **Approval Failed**: Token approval failed
- **Order Failed**: Order execution failed
- **Slippage Exceeded**: Price moved beyond tolerance
- **Insufficient Liquidity**: Not enough liquidity

### Status Monitoring

#### Real-time Updates
- **Status Changes**: Live status updates
- **Progress Indicators**: Visual progress tracking
- **Time Estimates**: Estimated completion time
- **Error Messages**: Clear error descriptions

#### Notification System
- **Success Notifications**: Swap completion alerts
- **Failure Alerts**: Error and failure notifications
- **Status Updates**: Regular status updates
- **Email Notifications**: Optional email alerts

## Security Features

### MEV Protection

#### Frontrunning Protection
- **Private Mempool**: Orders not visible to MEV bots
- **Secure Routing**: Protected swap routing
- **Price Protection**: Protection from sandwich attacks
- **Slippage Protection**: Advanced slippage management

#### Best Price Execution
- **Price Aggregation**: Best price from multiple sources
- **Liquidity Optimization**: Optimal liquidity utilization
- **Route Optimization**: Best route selection
- **Real-time Pricing**: Live price updates

### Smart Contract Security

#### Audited Contracts
- **Bebop Contracts**: Audited by security firms
- **Permit2**: Standard, audited contract
- **Settlement Contracts**: Secure settlement
- **Regular Audits**: Ongoing security audits

#### Risk Management
- **Liquidity Checks**: Verify sufficient liquidity
- **Price Validation**: Validate quote prices
- **Slippage Limits**: Enforce slippage limits
- **Error Handling**: Comprehensive error handling

## Troubleshooting

### Common Issues

#### Swap Failed
- **Insufficient Balance**: Check token balance
- **Approval Failed**: Retry token approval
- **Slippage Exceeded**: Increase slippage tolerance
- **Network Issues**: Check network connection

#### High Price Impact
- **Large Amount**: Reduce swap amount
- **Low Liquidity**: Wait for better liquidity
- **Market Conditions**: Check market conditions
- **Alternative Routes**: Try different routes

#### Approval Issues
- **Insufficient Gas**: Ensure enough ETH for gas
- **Network Congestion**: Wait for less congestion
- **Contract Issues**: Check token contract
- **Retry Approval**: Try approval again

### Error Messages

#### Common Errors
- **"Insufficient Balance"**: Not enough tokens
- **"Slippage Exceeded"**: Price moved too much
- **"Approval Failed"**: Token approval failed
- **"Insufficient Liquidity"**: Not enough liquidity

#### Error Resolution
- **Check Balance**: Verify token balance
- **Increase Slippage**: Try higher slippage
- **Retry Approval**: Try approval again
- **Wait and Retry**: Wait and try again

## Best Practices

### Before Swapping
- **Check Prices**: Compare with other sources
- **Verify Tokens**: Ensure correct tokens
- **Set Slippage**: Use appropriate slippage
- **Check Liquidity**: Ensure sufficient liquidity

### During Swap
- **Monitor Status**: Watch swap progress
- **Don't Close**: Keep extension open
- **Be Patient**: Allow time for execution
- **Check Network**: Ensure stable connection

### After Swap
- **Verify Amount**: Check received amount
- **Update Records**: Update your records
- **Check Balance**: Verify new balance
- **Save Details**: Keep transaction details

## Advanced Features

### Limit Orders (Coming Soon)
- **Set Price**: Set specific price target
- **Time Limits**: Set order expiration
- **Partial Fills**: Allow partial execution
- **Order Management**: Manage active orders

### DCA (Dollar Cost Averaging)
- **Recurring Swaps**: Set up recurring swaps
- **Time Intervals**: Choose swap frequency
- **Amount Settings**: Set swap amounts
- **Automation**: Fully automated swapping

### Portfolio Rebalancing
- **Target Allocation**: Set target portfolio allocation
- **Automatic Rebalancing**: Automatic portfolio rebalancing
- **Threshold Settings**: Set rebalancing thresholds
- **Multi-token**: Rebalance multiple tokens

## Next Steps

Now that you can swap tokens:

1. **[Switch Networks](./network-switching.md)** - Work with different networks
2. **[Connect to dApps](../connecting-dapps/connecting.md)** - Use with dApps
3. **[Security Overview](../security/overview.md)** - Learn about security
4. **[For Developers](../for-developers/integration-overview.md)** - Developer integration

---

**Ready to switch networks?** Continue to [Network Switching](./network-switching.md)!
