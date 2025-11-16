---
sidebar_position: 4
---

# 🪝 Hooks

SuperSafe Wallet provides custom React hooks for common operations, following the thin client pattern with all business logic delegated to the background.

## Overview

### Available Hooks

- **useSessionWallet** - Session and wallet state management
- **useNetworkSwitch** - Network switching operations
- **useSwap** - Swap operations (Bebop/Relay)
- **useRelayQuote** - Relay.link quote management
- **useRelaySwap** - Relay.link swap execution
- **useTokenLogo** - Token logo resolution
- **usePortfolioData** - Portfolio data fetching

---

## useSessionWallet

**Location:** `src/hooks/useSessionWallet.js`

**Purpose:** Manage session and wallet state

```javascript
function useSessionWallet() {
  const { 
    isUnlocked, 
    wallets, 
    currentWallet, 
    network,
    switchWallet,
    unlock,
    lock 
  } = useContext(WalletContext);
  
  return {
    isUnlocked,
    wallets,
    currentWallet,
    network,
    switchWallet,
    unlock,
    lock
  };
}
```

---

## useNetworkSwitch

**Location:** `src/hooks/useUnifiedNetworkSwitch.js`

**Purpose:** Unified network switching with context-aware behavior

```javascript
function useUnifiedNetworkSwitch(
  context = 'manual',
  options = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const switchNetwork = async (targetNetworkKey) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await NetworkAdapter.switchNetwork(targetNetworkKey, context);
      
      if (options.onSwitchComplete) {
        options.onSwitchComplete(targetNetworkKey);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    switchNetwork,
    isLoading,
    error
  };
}
```

**Context-Specific Hooks:**

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
```

---

## useSwap

**Location:** `src/hooks/useSwap.js`

**Purpose:** Bebop swap operations

```javascript
function useSwap() {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const getQuote = async (params) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await SwapAdapter.getSwapQuote(params);
      setQuote(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const executeSwap = async (quote, takerAddress, networkKey) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await SwapAdapter.signAndSubmitOrder(quote, takerAddress, networkKey);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    quote,
    isLoading,
    error,
    getQuote,
    executeSwap
  };
}
```

---

## useRelayQuote

**Location:** `src/hooks/useRelayQuote.js`

**Purpose:** Relay.link quote management with auto-refresh

```javascript
function useRelayQuote(params) {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!params) return;
    
    let intervalId;
    
    const fetchQuote = async () => {
      try {
        const result = await RelayAdapter.getQuote(params);
        setQuote(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };
    
    // Initial fetch
    fetchQuote();
    
    // Auto-refresh every 30 seconds
    intervalId = setInterval(fetchQuote, 30000);
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [params]);
  
  return {
    quote,
    isLoading,
    error,
    refetch: () => fetchQuote()
  };
}
```

---

## useRelaySwap

**Location:** `src/hooks/useRelaySwap.js`

**Purpose:** Relay.link swap execution and status polling

```javascript
function useRelaySwap() {
  const [swapStatus, setSwapStatus] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);
  
  const executeSwap = async (quote, walletAddress, networkKey) => {
    setIsExecuting(true);
    setError(null);
    
    try {
      const result = await RelayAdapter.executeSwap({
        quote,
        walletAddress,
        networkKey
      });
      
      // Start polling for status
      pollStatus(result.txHash, networkKey);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  };
  
  const pollStatus = async (txHash, networkKey) => {
    const intervalId = setInterval(async () => {
      try {
        const status = await RelayAdapter.checkStatus({ txHash, networkKey });
        setSwapStatus(status);
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Status check failed:', err);
      }
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(intervalId);
  };
  
  return {
    executeSwap,
    swapStatus,
    isExecuting,
    error
  };
}
```

---

## useTokenLogo

**Location:** `src/hooks/useTokenLogoNew.js`

**Purpose:** Token logo resolution with multi-provider cascade

```javascript
function useTokenLogo({ chainId, address, metadata, skipValidation, enabled }) {
  const [logoUrl, setLogoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!enabled || !chainId || !address) {
      setIsLoading(false);
      return;
    }
    
    const abortController = new AbortController();
    
    const resolveLogo = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const url = await resolveLogoURL({
          chainId,
          address,
          metadata,
          skipValidation,
          signal: abortController.signal
        });
        
        setLogoUrl(url);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    resolveLogo();
    
    return () => {
      abortController.abort();
    };
  }, [chainId, address, metadata, skipValidation, enabled]);
  
  return {
    logoUrl,
    isLoading,
    error,
    refetch: () => {
      // Trigger re-resolution
      setLogoUrl(null);
      setIsLoading(true);
    }
  };
}
```

---

## usePortfolioData

**Location:** `src/hooks/usePortfolioData.js`

**Purpose:** Portfolio data fetching and caching

```javascript
function usePortfolioData(networkKey, walletAddress) {
  const [tokens, setTokens] = useState([]);
  const [nfts, setNFTs] = useState([]);
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!networkKey || !walletAddress) {
      setIsLoading(false);
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch tokens
        const tokenList = await BlockchainAdapter.getTokens(networkKey, walletAddress);
        setTokens(tokenList);
        
        // Fetch NFTs
        const nftList = await BlockchainAdapter.getNFTs(networkKey, walletAddress);
        setNFTs(nftList);
        
        // Fetch balance
        const nativeBalance = await BlockchainAdapter.getBalance(networkKey, walletAddress);
        setBalance(nativeBalance);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    return () => clearInterval(intervalId);
  }, [networkKey, walletAddress]);
  
  return {
    tokens,
    nfts,
    balance,
    isLoading,
    error,
    refetch: () => fetchData()
  };
}
```

---

## Hook Best Practices

### 1. Always Clean Up

```javascript
useEffect(() => {
  const port = chrome.runtime.connect({ name: 'session' });
  
  return () => {
    port.disconnect(); // Cleanup on unmount
  };
}, []);
```

### 2. Handle Loading States

```javascript
const { quote, isLoading, error } = useRelayQuote(params);

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
```

### 3. Use AbortController for Cancellation

```javascript
useEffect(() => {
  const abortController = new AbortController();
  
  fetchData({ signal: abortController.signal });
  
  return () => {
    abortController.abort(); // Cancel on unmount
  };
}, []);
```

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.0+  
**Maintenance:** Review after major hook changes

