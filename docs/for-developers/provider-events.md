---
sidebar_position: 2
---

# 📡 Provider Events

Learn how to listen to and handle provider events from SuperSafe Wallet using the EIP-1193 event system.

## Event Overview

SuperSafe Wallet implements the **EIP-1193 event system** to notify dApps of important changes in wallet state, including account changes, network switches, and connection status updates.

### Supported Events

- **`accountsChanged`**: Active account changed
- **`chainChanged`**: Network/chain changed
- **`connect`**: Wallet connected to dApp
- **`disconnect`**: Wallet disconnected from dApp
- **`message`**: Incoming message from dApp
- **`notification`**: Wallet notification

## Event Listening

### Basic Event Listening

#### Add Event Listeners
```javascript
// Listen for account changes
window.ethereum.on('accountsChanged', (accounts) => {
  console.log('Accounts changed:', accounts);
  // Handle account change
});

// Listen for network changes
window.ethereum.on('chainChanged', (chainId) => {
  console.log('Chain changed:', chainId);
  // Handle network change
});

// Listen for connection
window.ethereum.on('connect', (connectInfo) => {
  console.log('Connected:', connectInfo);
  // Handle connection
});

// Listen for disconnection
window.ethereum.on('disconnect', (error) => {
  console.log('Disconnected:', error);
  // Handle disconnection
});
```

#### Remove Event Listeners
```javascript
// Remove specific listener
const handleAccountsChanged = (accounts) => {
  console.log('Accounts changed:', accounts);
};

window.ethereum.on('accountsChanged', handleAccountsChanged);

// Later, remove the listener
window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
```

### Advanced Event Handling

#### Event Handler with Error Handling
```javascript
const handleAccountsChanged = (accounts) => {
  try {
    if (accounts.length === 0) {
      console.log('No accounts connected');
      // Handle no accounts
    } else {
      console.log('Active account:', accounts[0]);
      // Update UI with new account
    }
  } catch (error) {
    console.error('Error handling accounts change:', error);
  }
};

window.ethereum.on('accountsChanged', handleAccountsChanged);
```

#### Event Handler with State Management
```javascript
class WalletManager {
  constructor() {
    this.accounts = [];
    this.chainId = null;
    this.isConnected = false;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
    window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
    window.ethereum.on('connect', this.handleConnect.bind(this));
    window.ethereum.on('disconnect', this.handleDisconnect.bind(this));
  }
  
  handleAccountsChanged(accounts) {
    this.accounts = accounts;
    this.updateUI();
  }
  
  handleChainChanged(chainId) {
    this.chainId = chainId;
    this.updateUI();
  }
  
  handleConnect(connectInfo) {
    this.isConnected = true;
    this.updateUI();
  }
  
  handleDisconnect(error) {
    this.isConnected = false;
    this.accounts = [];
    this.chainId = null;
    this.updateUI();
  }
  
  updateUI() {
    // Update your UI based on wallet state
    console.log('Wallet state:', {
      accounts: this.accounts,
      chainId: this.chainId,
      isConnected: this.isConnected
    });
  }
}
```

## Event Details

### accountsChanged Event

#### Event Description
Triggered when the active account changes in the wallet.

#### Event Data
```javascript
// Event payload
{
  accounts: string[] // Array of connected account addresses
}
```

#### Example Usage
```javascript
window.ethereum.on('accountsChanged', (accounts) => {
  if (accounts.length === 0) {
    // User disconnected all accounts
    console.log('No accounts connected');
    // Redirect to login or show connect button
  } else {
    // User switched accounts or connected new account
    const activeAccount = accounts[0];
    console.log('Active account:', activeAccount);
    // Update UI with new account
    updateUserInterface(activeAccount);
  }
});
```

#### Common Scenarios
- **Account Switch**: User switches between multiple wallets
- **Account Disconnect**: User disconnects current account
- **New Account**: User connects a new account
- **All Accounts Disconnected**: User disconnects all accounts

### chainChanged Event

#### Event Description
Triggered when the active network/chain changes in the wallet.

#### Event Data
```javascript
// Event payload
{
  chainId: string // New chain ID (hex string)
}
```

#### Example Usage
```javascript
window.ethereum.on('chainChanged', (chainId) => {
  console.log('Network changed to:', chainId);
  
  // Convert hex to decimal for easier handling
  const chainIdDecimal = parseInt(chainId, 16);
  
  switch (chainIdDecimal) {
    case 1:
      console.log('Switched to Ethereum Mainnet');
      break;
    case 10:
      console.log('Switched to Optimism');
      break;
    case 5330:
      console.log('Switched to SuperSeed');
      break;
    default:
      console.log('Switched to unknown network:', chainIdDecimal);
  }
  
  // Update your dApp for the new network
  updateNetworkInterface(chainId);
});
```

#### Network Mapping
```javascript
const NETWORK_NAMES = {
  '0x1': 'Ethereum Mainnet',
  '0xa': 'Optimism',
  '0x14a2': 'SuperSeed',
  '0x89': 'Polygon',
  '0x38': 'BSC'
};

window.ethereum.on('chainChanged', (chainId) => {
  const networkName = NETWORK_NAMES[chainId] || 'Unknown Network';
  console.log(`Switched to ${networkName} (${chainId})`);
});
```

### connect Event

#### Event Description
Triggered when the wallet connects to the dApp.

#### Event Data
```javascript
// Event payload
{
  chainId: string // Chain ID of the connected network
}
```

#### Example Usage
```javascript
window.ethereum.on('connect', (connectInfo) => {
  console.log('Wallet connected:', connectInfo);
  
  // Get connected accounts
  window.ethereum.request({ method: 'eth_accounts' })
    .then(accounts => {
      console.log('Connected accounts:', accounts);
      // Update UI to show connected state
      showConnectedState(accounts, connectInfo.chainId);
    })
    .catch(error => {
      console.error('Error getting accounts:', error);
    });
});
```

#### Connection Flow
```javascript
const handleConnect = async (connectInfo) => {
  try {
    // Get current accounts
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    // Get current chain ID
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    // Update application state
    setWalletState({
      isConnected: true,
      accounts: accounts,
      chainId: chainId
    });
    
    // Show success message
    showNotification('Wallet connected successfully!');
    
  } catch (error) {
    console.error('Error handling connection:', error);
    showError('Failed to get wallet information');
  }
};

window.ethereum.on('connect', handleConnect);
```

### disconnect Event

#### Event Description
Triggered when the wallet disconnects from the dApp.

#### Event Data
```javascript
// Event payload
{
  code: number, // Error code
  message: string // Error message
}
```

#### Example Usage
```javascript
window.ethereum.on('disconnect', (error) => {
  console.log('Wallet disconnected:', error);
  
  // Clear application state
  setWalletState({
    isConnected: false,
    accounts: [],
    chainId: null
  });
  
  // Show disconnection message
  showNotification('Wallet disconnected');
  
  // Redirect to login or show connect button
  showConnectButton();
});
```

#### Disconnection Handling
```javascript
const handleDisconnect = (error) => {
  // Log disconnection reason
  if (error) {
    console.log('Disconnection reason:', error.message);
  }
  
  // Clear all wallet-related state
  clearWalletState();
  
  // Update UI to disconnected state
  updateUIForDisconnected();
  
  // Optionally, redirect to home page
  // window.location.href = '/';
};

window.ethereum.on('disconnect', handleDisconnect);
```

## Event Management

### Event Lifecycle

#### Setup Phase
```javascript
// Setup event listeners when dApp loads
const setupWalletEvents = () => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('connect', handleConnect);
    window.ethereum.on('disconnect', handleDisconnect);
  }
};

// Call setup when dApp loads
document.addEventListener('DOMContentLoaded', setupWalletEvents);
```

#### Cleanup Phase
```javascript
// Cleanup event listeners when dApp unloads
const cleanupWalletEvents = () => {
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
    window.ethereum.removeListener('connect', handleConnect);
    window.ethereum.removeListener('disconnect', handleDisconnect);
  }
};

// Call cleanup when dApp unloads
window.addEventListener('beforeunload', cleanupWalletEvents);
```

### Event State Management

#### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useWallet = () => {
  const [accounts, setAccounts] = useState([]);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (newAccounts) => {
      setAccounts(newAccounts);
      setIsConnected(newAccounts.length > 0);
    };

    const handleChainChanged = (newChainId) => {
      setChainId(newChainId);
    };

    const handleConnect = (connectInfo) => {
      setIsConnected(true);
      setChainId(connectInfo.chainId);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setAccounts([]);
      setChainId(null);
    };

    // Add event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('connect', handleConnect);
    window.ethereum.on('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('connect', handleConnect);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    };
  }, []);

  return { accounts, chainId, isConnected };
};
```

#### Vue.js Composable Example
```javascript
import { ref, onMounted, onUnmounted } from 'vue';

export const useWallet = () => {
  const accounts = ref([]);
  const chainId = ref(null);
  const isConnected = ref(false);

  const handleAccountsChanged = (newAccounts) => {
    accounts.value = newAccounts;
    isConnected.value = newAccounts.length > 0;
  };

  const handleChainChanged = (newChainId) => {
    chainId.value = newChainId;
  };

  const handleConnect = (connectInfo) => {
    isConnected.value = true;
    chainId.value = connectInfo.chainId;
  };

  const handleDisconnect = () => {
    isConnected.value = false;
    accounts.value = [];
    chainId.value = null;
  };

  onMounted(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('connect', handleConnect);
      window.ethereum.on('disconnect', handleDisconnect);
    }
  });

  onUnmounted(() => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('connect', handleConnect);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    }
  });

  return { accounts, chainId, isConnected };
};
```

## Error Handling

### Event Error Handling

#### Global Error Handler
```javascript
// Global error handler for wallet events
const handleWalletError = (error) => {
  console.error('Wallet error:', error);
  
  // Handle specific error types
  if (error.code === 4001) {
    showError('User rejected the request');
  } else if (error.code === 4100) {
    showError('Unauthorized - request method not supported');
  } else if (error.code === 4900) {
    showError('Wallet disconnected');
  } else {
    showError('An unexpected error occurred');
  }
};

// Add error handler to all events
window.ethereum.on('accountsChanged', (accounts) => {
  try {
    handleAccountsChanged(accounts);
  } catch (error) {
    handleWalletError(error);
  }
});
```

#### Event-Specific Error Handling
```javascript
const handleAccountsChanged = (accounts) => {
  try {
    if (!Array.isArray(accounts)) {
      throw new Error('Invalid accounts data');
    }
    
    // Process accounts
    processAccounts(accounts);
    
  } catch (error) {
    console.error('Error processing accounts change:', error);
    showError('Failed to process account change');
  }
};
```

## Best Practices

### Event Handling Guidelines

#### Performance
- **Debounce Events**: Debounce frequent events like chain changes
- **Minimize Listeners**: Only add necessary event listeners
- **Cleanup Listeners**: Always remove listeners when done
- **Avoid Heavy Operations**: Keep event handlers lightweight

#### Error Handling
- **Try-Catch Blocks**: Wrap event handlers in try-catch
- **Error Logging**: Log errors for debugging
- **User Feedback**: Provide user-friendly error messages
- **Graceful Degradation**: Handle errors gracefully

#### State Management
- **Single Source of Truth**: Maintain single wallet state
- **Immutable Updates**: Use immutable state updates
- **State Validation**: Validate state changes
- **Consistent State**: Keep state consistent across components

## Troubleshooting

### Common Issues

#### Events Not Firing
- **Check Provider**: Ensure SuperSafe is installed
- **Check Connection**: Verify wallet is connected
- **Check Console**: Look for JavaScript errors
- **Test Manually**: Test events manually

#### Memory Leaks
- **Remove Listeners**: Always remove event listeners
- **Cleanup on Unmount**: Cleanup in component unmount
- **Avoid Closures**: Avoid closures in event handlers
- **Use WeakMap**: Use WeakMap for event references

#### Performance Issues
- **Debounce Events**: Debounce frequent events
- **Minimize Re-renders**: Minimize component re-renders
- **Use Memoization**: Use memoization for expensive operations
- **Profile Performance**: Profile event handling performance

## Next Steps

Now that you understand provider events:

1. **[RPC Methods](./rpc-methods.md)** - Learn about RPC methods
2. **[Network Compatibility](./network-compatibility.md)** - Understand network compatibility
3. **[Architecture Overview](./architecture-overview.md)** - Learn about architecture
4. **[Integration Overview](./integration-overview.md)** - Review integration guide

---

**Ready to learn about RPC methods?** Continue to [RPC Methods](./rpc-methods.md)!
