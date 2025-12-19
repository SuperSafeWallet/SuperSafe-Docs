# SuperSafe Wallet - Network Switching System

**Created:** November 3, 2025  
**Last Updated:** November 15, 2025  
**Version:** 3.1.0+  
**Status:** ✅ CURRENT  
**Last Code Update:** November 15, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Pre-Switch Coordination](#pre-switch-coordination)
4. [Switch Flow](#switch-flow)
5. [Context-Aware Switching](#context-aware-switching)
6. [Error Handling](#error-handling)
7. [Events & Communication](#events--communication)
8. [API Reference](#api-reference)
9. [Examples](#examples)

---

## Overview

SuperSafe Wallet implements a sophisticated network switching system that ensures all components are synchronized and ready before, during, and after network changes. The system prevents race conditions, maintains state consistency, and provides robust error handling.

**Supported Networks:** Currently supports **8 active networks** (SuperSeed, Ethereum, Optimism, Base, BNB Chain, Arbitrum, Monad, Shardeum) with extensible architecture for adding new networks.

### Key Features

- **Promise-Based Coordination**: Deterministic execution with timeout protection
- **Abort-on-Failure**: Network switches abort if preparation fails
- **Context-Aware**: Different behaviors for manual, dApp-requested, and connection switches
- **Event-Driven**: Components notified of network changes via custom events
- **Bidirectional**: Supports wallet→dApp and dApp→wallet network switching
- **State Consistency**: Ensures UI and backend stay synchronized

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                  Network Switch System                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         useUnifiedNetworkSwitch Hook                 │  │
│  │  • Context-aware switching                           │  │
│  │  • Pre-switch coordination                           │  │
│  │  • Session state refresh                             │  │
│  │  • Event broadcasting                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         PreSwitchCoordinator                         │  │
│  │  • Handler registration                              │  │
│  │  • Promise-based execution                           │  │
│  │  • Timeout protection                                │  │
│  │  • Error aggregation                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         NetworkAdapter (Background)                  │  │
│  │  • Network validation                                │  │
│  │  • Provider switching                                │  │
│  │  • Storage persistence                               │  │
│  │  • Controller updates                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Event Broadcasting                           │  │
│  │  • supersafe-network-changed                         │  │
│  │  • eth_chainChanged (to dApps)                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

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

### Handler Lifecycle

```
Registration (useEffect)
    ↓
Waiting (handler idle)
    ↓
Execution (network switch triggered)
    ↓
    ├─ Success → Continue with switch
    ├─ Timeout → Abort switch, show error
    └─ Error   → Abort switch, show error
    ↓
Cleanup (component unmount)
```

### Timeout Configuration

**Per-Handler Timeout** (default: 2000ms)
- Individual protection for each handler
- Configurable per handler registration
- Should match handler complexity

```javascript
preSwitchCoordinator.registerHandler(
  'my-handler',
  handler,
  { timeout: 500 }  // Fast operation
);
```

**Global Timeout** (default: 5000ms)
- Safety net for all handlers combined
- Prevents infinite hangs
- Configurable per execution

```javascript
await preSwitchCoordinator.executeHandlers(networkKey, {
  globalTimeout: 10000  // Override for specific switch
});
```

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

**Hook**: `useAppHeaderNetworkSwitch(onNetworkChange, onPostSwitch)`

**Example**:
```javascript
const { switchNetwork, isLoading, error } = useAppHeaderNetworkSwitch(
  (networkKey) => {
    console.log('Network changed to:', networkKey);
  },
  (networkKey, network) => {
    navigate('/dashboard');  // Redirect after switch
  }
);

// Switch to Optimism
await switchNetwork('optimism');
```

#### 2. Connection Context

**Trigger**: dApp connection with network mismatch

**Use Case**: User connecting to dApp that requires different network

**Behavior**:
- Show consent modal explaining mismatch
- Wait for user approval
- Switch network if approved
- Continue with connection after switch

**Hook**: `useConnectionNetworkSwitch(origin, onConnectionContinue)`

**Example**:
```javascript
const { switchNetwork } = useConnectionNetworkSwitch(
  'https://app.uniswap.org',
  async (networkKey, result) => {
    // Continue with connection after successful switch
    await approveConnection();
  }
);
```

#### 3. dApp-Requested Context

**Trigger**: dApp calls `wallet_switchEthereumChain` RPC method

**Use Case**: dApp needs wallet on different network

**Behavior**:
- Show consent modal with dApp origin
- Display target network details
- Wait for user approval
- Send response to dApp

**Hook**: `useDappRequestedNetworkSwitch(origin, requestId)`

**Example**:
```javascript
const { switchNetwork } = useDappRequestedNetworkSwitch(
  'https://opensea.io',
  'req_123456'
);

// dApp requested switch to Ethereum
await switchNetwork('ethereum');
```

---

## Error Handling

### Error Types

#### 1. Validation Errors

**Cause**: Invalid network key or unsupported network

**Example**:
```javascript
try {
  await switchNetwork('invalid-network');
} catch (error) {
  // Error: Invalid network key: invalid-network. 
  // Must be one of: superseed, ethereum, optimism, base, bsc, arbitrum, shardeum
}
```

**User Impact**: Immediate error message, no state change

#### 2. Coordination Errors

**Cause**: Pre-switch handler failed or timed out

**Example**:
```javascript
try {
  await switchNetwork('ethereum');
} catch (error) {
  // Error: Network switch aborted: Handler 'Portfolio Lock' 
  // timed out after 500ms
}
```

**User Impact**: Error modal, network stays on current chain

#### 3. Background Errors

**Cause**: Provider initialization failed, RPC unreachable

**Example**:
```javascript
try {
  await switchNetwork('ethereum');
} catch (error) {
  // Error: Failed to initialize provider for ethereum
}
```

**User Impact**: Error modal, may need to retry

#### 4. Session Errors

**Cause**: Failed to refresh session state after switch

**Example**:
```javascript
// Non-fatal: logged as warning, switch continues
console.warn('Session refresh failed, using cached state');
```

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
  operationType: 'SWITCH',  // or 'SYNC'
  syncMode: false,
  timestamp: 1698765432000
}
```

**Listeners**:
- `useSessionWallet` - Updates wallet context
- `usePortfolioData` - Refreshes portfolio for new network
- Dashboard components - Update UI

**Usage**:
```javascript
useEffect(() => {
  const handleNetworkChange = (event) => {
    const { targetNetworkKey, sessionData } = event.detail;
    console.log(`Network changed to ${targetNetworkKey}`);
    
    // Update component state
    setCurrentNetwork(targetNetworkKey);
    setSessionData(sessionData);
  };
  
  window.addEventListener('supersafe-network-changed', handleNetworkChange);
  
  return () => {
    window.removeEventListener('supersafe-network-changed', handleNetworkChange);
  };
}, []);
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

## API Reference

### useUnifiedNetworkSwitch()

Core hook for network switching.

```javascript
function useUnifiedNetworkSwitch(
  context?: 'manual' | 'connection' | 'dapp-requested',
  options?: {
    onNetworkChange?: (networkKey: string) => void,
    onSwitchComplete?: (networkKey: string, network: Network) => void,
    onSessionRefresh?: (sessionData: SessionData, networkKey: string) => Promise<void>,
    onConnectionContinue?: (networkKey: string, result: SwitchResult) => Promise<void>
  }
): {
  switchNetwork: (targetNetworkKey: string, contextOptions?: object) => Promise<SwitchResult>,
  isLoading: boolean,
  error: string | null,
  lastSwitchTime: number | null,
  clearError: () => void,
  isValidNetwork: (networkKey: string) => boolean,
  getAvailableNetworks: () => Network[],
  context: string,
  hasActiveOperation: boolean
}
```

**Parameters**:
- `context`: Switch context ('manual', 'connection', 'dapp-requested')
- `options`: Context-specific callbacks

**Returns**:
- `switchNetwork`: Function to initiate network switch
- `isLoading`: Whether switch is in progress
- `error`: Error message if switch failed
- `lastSwitchTime`: Timestamp of last successful switch
- `clearError`: Function to clear error state
- `isValidNetwork`: Function to check if network key is valid
- `getAvailableNetworks`: Function to get list of active networks
- `context`: Current switch context
- `hasActiveOperation`: Whether a switch is currently active

### Context-Specific Hooks

```javascript
// Manual switching (UI-initiated)
useAppHeaderNetworkSwitch(
  onNetworkChange?: (networkKey: string) => void,
  onPostSwitch?: (networkKey: string, network: Network) => void
)

// Connection-time switching
useConnectionNetworkSwitch(
  origin: string,
  onConnectionContinue?: (networkKey: string, result: SwitchResult) => Promise<void>
)

// dApp-requested switching
useDappRequestedNetworkSwitch(
  origin: string,
  requestId: string
)

// Settings interface
useSettingsNetworkSwitch()
```

---

## Examples

### Example 1: Basic Manual Switch

```javascript
import { useAppHeaderNetworkSwitch } from '../hooks/useUnifiedNetworkSwitch';

function NetworkSelector() {
  const { switchNetwork, isLoading, error } = useAppHeaderNetworkSwitch();
  
  const handleSwitch = async (networkKey) => {
    try {
      await switchNetwork(networkKey);
      console.log('Switch successful!');
    } catch (err) {
      console.error('Switch failed:', err);
    }
  };
  
  return (
    <div>
      <button onClick={() => handleSwitch('superseed')} disabled={isLoading}>
        Switch to SuperSeed
      </button>
      <button onClick={() => handleSwitch('ethereum')} disabled={isLoading}>
        Switch to Ethereum
      </button>
      <button onClick={() => handleSwitch('optimism')} disabled={isLoading}>
        Switch to Optimism
      </button>
      <button onClick={() => handleSwitch('base')} disabled={isLoading}>
        Switch to Base
      </button>
      <button onClick={() => handleSwitch('bsc')} disabled={isLoading}>
        Switch to BNB Chain
      </button>
      <button onClick={() => handleSwitch('arbitrum')} disabled={isLoading}>
        Switch to Arbitrum
      </button>
      <button onClick={() => handleSwitch('shardeum')} disabled={isLoading}>
        Switch to Shardeum
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### Example 2: Switch with Post-Action

```javascript
import { useNavigate } from 'react-router-dom';
import { useAppHeaderNetworkSwitch } from '../hooks/useUnifiedNetworkSwitch';

function AppHeader() {
  const navigate = useNavigate();
  
  const { switchNetwork } = useAppHeaderNetworkSwitch(
    undefined,
    (networkKey, network) => {
      // Redirect to dashboard after successful switch
      console.log(`Switched to ${network.name}`);
      navigate('/dashboard');
    }
  );
  
  return (
    <select onChange={(e) => switchNetwork(e.target.value)}>
      <option value="superseed">SuperSeed</option>
      <option value="ethereum">Ethereum</option>
      <option value="optimism">Optimism</option>
      <option value="base">Base</option>
      <option value="bsc">BNB Chain</option>
      <option value="arbitrum">Arbitrum One</option>
      <option value="shardeum">Shardeum</option>
    </select>
  );
}
```

### Example 3: Pre-Switch Handler Registration

```javascript
import { useEffect, useRef } from 'react';
import { preSwitchCoordinator } from '../utils/PreSwitchCoordinator';

function Portfolio() {
  const isLoadingRef = useRef(false);
  const pendingNetworkRef = useRef(null);
  const abortController = useRef(new AbortController());
  
  // Register pre-switch handler
  useEffect(() => {
    const handlerId = 'portfolio-preparation';
    
    preSwitchCoordinator.registerHandler(
      handlerId,
      async (targetNetworkKey) => {
        console.log(`Preparing portfolio for ${targetNetworkKey}`);
        
        // Set loading flag
        isLoadingRef.current = true;
        pendingNetworkRef.current = targetNetworkKey;
        
        // Cancel pending requests
        abortController.current?.abort();
        
        return Promise.resolve();
      },
      {
        name: 'Portfolio Preparation',
        timeout: 500
      }
    );
    
    return () => {
      preSwitchCoordinator.unregisterHandler(handlerId);
    };
  }, []);
  
  // Listen for network change
  useEffect(() => {
    const handleNetworkChange = (event) => {
      const { targetNetworkKey, sessionData } = event.detail;
      
      // Clear loading flag
      isLoadingRef.current = false;
      pendingNetworkRef.current = null;
      
      // Fetch data for new network
      fetchPortfolioData(targetNetworkKey, sessionData.currentWallet.address);
    };
    
    window.addEventListener('supersafe-network-changed', handleNetworkChange);
    return () => window.removeEventListener('supersafe-network-changed', handleNetworkChange);
  }, []);
  
  return <div>Portfolio Component</div>;
}
```

### Example 4: Connection-Time Switch

```javascript
import { useConnectionNetworkSwitch } from '../hooks/useUnifiedNetworkSwitch';

function ConnectionHandler({ dappOrigin, requiredNetwork }) {
  const { switchNetwork, isLoading, error } = useConnectionNetworkSwitch(
    dappOrigin,
    async (networkKey, result) => {
      // Continue with connection after successful switch
      console.log(`Switched to ${networkKey}, continuing connection...`);
      await approveConnection(dappOrigin, networkKey);
    }
  );
  
  const handleConnect = async () => {
    try {
      await switchNetwork(requiredNetwork);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };
  
  return (
    <div className="connection-modal">
      <h2>Network Switch Required</h2>
      <p>
        {dappOrigin} requires {requiredNetwork}.
        Please switch networks to continue.
      </p>
      <button onClick={handleConnect} disabled={isLoading}>
        {isLoading ? 'Switching...' : 'Switch & Connect'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall system architecture
- [FRONTEND.md](./FRONTEND.md) - Frontend API documentation
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Pre-switch handler best practices
- [DAPP_CONNECTIONS.md](./DAPP_CONNECTIONS.md) - dApp connection system

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.1.0+  
**Maintenance:** Review after adding new networks or modifying switch flow

