---
sidebar_position: 6
---

# 🌐 Network Switching

SuperSafe Wallet implements a sophisticated network switching system that ensures all components are synchronized and ready before, during, and after network changes. The system prevents race conditions, maintains state consistency, and provides robust error handling.

## Overview

**Supported Networks:** Currently supports **8 active networks** (SuperSeed, Ethereum, Optimism, Base, BNB Chain, Arbitrum, Monad, Shardeum) with extensible architecture for adding new networks.

### Key Features

- **Promise-Based Coordination**: Deterministic execution with timeout protection
- **Abort-on-Failure**: Network switches abort if preparation fails
- **Context-Aware**: Different behaviors for manual, dApp-requested, and connection switches
- **Event-Driven**: Components notified of network changes via custom events
- **Bidirectional**: Supports wallet→dApp and dApp→wallet network switching
- **State Consistency**: Ensures UI and backend stay synchronized

---

## Supported Networks

### Active Networks (8)

| Network | Chain ID | Swap Support | Relay Support | Fiat On-Ramp | Status |
|---------|----------|--------------|---------------|--------------|--------|
| **SuperSeed** | 5330 | ✅ Bebop (JAM) | ✅ Cross-chain | ❌ | ✅ Active |
| **Ethereum** | 1 | ✅ Bebop (JAM+RFQ) | ✅ Cross-chain | ✅ Tradesilvania | ✅ Active |
| **Optimism** | 10 | ✅ Bebop (JAM+RFQ) | ✅ Cross-chain | ⏳ Coming | ✅ Active |
| **Base** | 8453 | ✅ Bebop (JAM+RFQ) | ✅ Cross-chain | ⏳ Coming | ✅ Active |
| **BNB Chain** | 56 | ✅ Bebop (JAM+RFQ) | ✅ Cross-chain | ✅ Tradesilvania | ✅ Active |
| **Arbitrum One** | 42161 | ✅ Bebop (JAM+RFQ) | ✅ Cross-chain | ✅ Tradesilvania | ✅ Active |
| **Monad** | TBD | ❌ Not supported | ❌ Not supported | ❌ | ✅ Active |
| **Shardeum** | 8118 | ❌ Not supported | ❌ Not supported | ❌ | ✅ Active |

---

## Architecture

### Three-Phase Switch Process

Network switching happens in three distinct phases:

#### Phase 1: Pre-Switch Coordination

**Purpose**: Ensure all components are ready before network state changes.

**Actions**:
- Execute registered pre-switch handlers
- Set component locks and flags
- Cancel network-dependent operations
- Validate switch conditions

**Timeout**: Per-handler (2s default) + Global (5s safety net)

**Failure Behavior**: Abort switch, show error to user

#### Phase 2: Network Switch Execution

**Purpose**: Update network state in background and frontend.

**Actions**:
- Validate target network exists and is supported
- Switch provider in background service
- Update session state (currentNetworkKey)
- Refresh custom tokens for new network
- Persist network selection to storage

**Failure Behavior**: Throw error, revert to previous network

#### Phase 3: Post-Switch Broadcast

**Purpose**: Notify all components of completed network change.

**Actions**:
- Broadcast `supersafe-network-changed` event to frontend
- Send `eth_chainChanged` event to connected dApps
- Execute context-specific post-switch actions
- Trigger UI updates and data refresh

**Failure Behavior**: Log warning, continue (switch already completed)

---

## Switch Flow

### Complete Switch Sequence

```
┌──────────────────────────────────────────────────────────┐
│ 1. Switch Initiated                                      │
│    • User clicks network selector                        │
│    • dApp requests wallet_switchEthereumChain            │
│    • Connection requires different network               │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 2. Validation                                            │
│    • Check targetNetworkKey exists in NETWORKS           │
│    • Verify network is active                            │
│    • Validate context permissions                        │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 3. Pre-Switch Coordination                               │
│    • Execute all registered handlers                     │
│    • Wait for handlers to complete (or timeout)          │
│    • Abort if any handler fails                          │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 4. Background Switch                                     │
│    • Call NetworkAdapter.switchNetwork()                 │
│    • Update provider in background                       │
│    • Switch controllers to new network                   │
│    • Persist network selection                           │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 5. Session State Refresh                                 │
│    • Fetch updated session state from background         │
│    • Load custom tokens for new network                  │
│    • Prepare session data for broadcast                  │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 6. Event Broadcasting                                    │
│    • Dispatch supersafe-network-changed event            │
│    • Include session data and context                    │
│    • Notify all frontend components                      │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 7. dApp Notification                                     │
│    • Send eth_chainChanged to connected dApps            │
│    • Update connection state                             │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 8. Post-Switch Actions                                   │
│    • Context-specific callbacks                          │
│    • UI updates (redirect, refresh)                      │
│    • Data fetching for new network                       │
└──────────────────────────────────────────────────────────┘
```

### Timing Breakdown

Typical network switch timing:

```
Pre-Switch Coordination:   50-500ms   (depends on handlers)
Background Switch:          20-50ms    (provider update)
Session Refresh:            10-30ms    (fetch session state)
Event Broadcasting:         <5ms       (dispatch events)
Post-Switch Actions:        Variable   (depends on context)
────────────────────────────────────────────────────────────
Total:                      ~100-600ms (user-perceived delay)
```

---

## Context-Aware Switching

SuperSafe supports different network switching contexts, each with specialized behavior.

### Switch Contexts

#### 1. Manual Context

**Trigger**: User clicks network selector in wallet UI

**Use Case**: User-initiated network changes

**Behavior**:
- No consent modal (user explicitly selected network)
- Immediate execution after validation
- Post-switch redirect to dashboard
- Refresh portfolio data

#### 2. Connection Context

**Trigger**: dApp connection with network mismatch

**Use Case**: User connecting to dApp that requires different network

**Behavior**:
- Show consent modal explaining mismatch
- Wait for user approval
- Switch network if approved
- Continue with connection after switch

#### 3. dApp-Requested Context

**Trigger**: dApp calls `wallet_switchEthereumChain` RPC method

**Use Case**: dApp needs wallet on different network

**Behavior**:
- Show consent modal with dApp origin
- Display target network details
- Wait for user approval
- Send response to dApp

---

## Pre-Switch Coordination

### Overview

Pre-switch coordination replaces fragile timing-based delays with promise-based handler execution. Components register async handlers that must complete successfully before the network switch proceeds.

### PreSwitchCoordinator

**Location**: `src/utils/PreSwitchCoordinator.js`

**Purpose**: Manages async handler registration and coordinated execution.

**Key Methods**:
```javascript
// Register a handler
preSwitchCoordinator.registerHandler(handlerId, handler, options)

// Unregister on cleanup
preSwitchCoordinator.unregisterHandler(handlerId)

// Execute all handlers (called by switch system)
await preSwitchCoordinator.executeHandlers(targetNetworkKey, options)
```

### Timeout Configuration

**Per-Handler Timeout** (default: 2000ms)
- Individual protection for each handler
- Configurable per handler registration
- Should match handler complexity

**Global Timeout** (default: 5000ms)
- Safety net for all handlers combined
- Prevents infinite hangs
- Configurable per execution

### Error Handling

**Abort-on-Failure** (default behavior):
- If any handler fails or times out, the network switch aborts
- Error is thrown with details about which handler failed
- User sees clear error message
- Network remains on current chain

**Benefits**:
- Prevents inconsistent states
- Ensures UI reflects actual network
- Clear failure visibility
- No silent failures

---

## Error Handling

### Error Types

#### 1. Validation Errors

**Cause**: Invalid network key or unsupported network

**User Impact**: Immediate error message, no state change

#### 2. Coordination Errors

**Cause**: Pre-switch handler failed or timed out

**User Impact**: Error modal, network stays on current chain

#### 3. Background Errors

**Cause**: Provider initialization failed, RPC unreachable

**User Impact**: Error modal, may need to retry

#### 4. Session Errors

**Cause**: Failed to refresh session state after switch

**User Impact**: Switch completes, may need manual refresh

### Error Recovery

**Automatic Recovery**:
- Concurrent switch prevention (only one switch at a time)
- Timeout protection prevents infinite hangs
- State rollback on pre-switch failures

**Manual Recovery**:
- Retry switch after fixing issue
- Refresh wallet if state inconsistent
- Check network RPC connectivity

---

## Events & Communication

### Frontend Events

#### supersafe-network-changed

**Purpose**: Notify frontend components of completed network switch

**Dispatched**: After successful network switch (Phase 3)

**Event Detail**:
```javascript
{
  targetNetworkKey: 'ethereum',
  sessionData: {
    isUnlocked: true,
    currentWallet: { address: '0x...', ... },
    network: { chainId: 1, name: 'Ethereum', ... },
    customTokens: [...],
    ...
  },
  context: 'manual',
  operationType: 'SWITCH',
  syncMode: false,
  timestamp: 1698765432000
}
```

### dApp Events

#### eth_chainChanged

**Purpose**: Notify connected dApps of network change

**Dispatched**: After successful network switch (to all connected dApps)

**Format**: EIP-1193 standard event

**Event Data**:
```javascript
{
  method: 'eth_chainChanged',
  params: {
    chainId: '0x1'  // Hex-encoded chain ID
  }
}
```

**dApp Behavior**:
- dApp should refresh UI for new network
- dApp may need to reload if network unsupported
- dApp should re-fetch network-dependent data

---

## Switching Networks

### Manual Network Switch

#### From Header
1. **Click Network Name**: Click current network in header
2. **Select Target Network**: Choose from dropdown
3. **Confirm Switch**: Network changes immediately (no confirmation needed for manual switches)
4. **Wait for Switch**: Wait for network switch (~100-600ms)

#### From Settings
1. **Go to Settings**: Click settings icon
2. **Navigate to Networks**: Go to network section
3. **Select Network**: Click target network
4. **Apply Changes**: Network switches automatically

### Automatic Network Switch

#### dApp Requested Switch
1. **dApp Requests Switch**: dApp requests network change via `wallet_switchEthereumChain`
2. **Show Consent Modal**: Display switch confirmation with dApp origin
3. **User Approves/Rejects**: User makes decision
4. **Execute Switch**: Switch if approved

#### Connection-Based Switch
1. **Connect to dApp**: Connect to dApp
2. **Check Network Compatibility**: Verify network support
3. **Show Switch Modal**: Show network switch modal if mismatch
4. **User Decision**: User chooses to switch or not

---

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

### Optimism Network

#### Layer 2 Features
- **Fast Transactions**: Layer 2 speed
- **Low Fees**: Reduced transaction costs
- **EVM Compatibility**: Full Ethereum compatibility
- **OP Token**: Optimism network token

#### Swap Support
- **Bebop JAM**: Gasless swaps
- **Bebop RFQ**: Request for Quote swaps
- **Relay.link**: Cross-chain swaps
- **Dual Protocol**: Both JAM and RFQ support

---

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

---

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

---

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

---

**Document Status:** ✅ Current as of December 18, 2025  
**Code Version:** v3.1.4  
**Maintenance:** Review after adding new networks or modifying switch flow

**Document Status:** ✅ Current as of February 10, 2026  
**Code Version:** v3.1.8
