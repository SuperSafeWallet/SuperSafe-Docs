---
sidebar_position: 5
---

# 🔍 Framework Detection

SuperSafe Wallet automatically detects dApp frameworks and adapts connection behavior accordingly, ensuring seamless integration with RainbowKit, Wagmi, Dynamic, and other popular frameworks.

## Overview

SuperSafe implements automatic framework detection to provide optimal connection behavior for different dApp frameworks. This ensures compatibility with modern React-based dApp frameworks without requiring manual configuration.

### Supported Frameworks

- **✅ RainbowKit**: Full compatibility with RainbowKit's provider detection
- **✅ Wagmi**: React hooks compatibility
- **✅ Dynamic**: Framework detection and adaptation
- **✅ Web3-React**: Standard web3-react compatibility
- **✅ WalletConnect**: WalletConnect v2/Reown integration

---

## Automatic Detection System

**Location:** `src/utils/dAppFrameworkDetector.js`

### Detection Logic

```javascript
export function detectDAppFramework(origin, injectedObjects = {}) {
  const detectionResults = {
    framework: 'unknown',
    confidence: 'low',
    indicators: []
  };
  
  // Check for RainbowKit
  if (injectedObjects.isRainbowKit || 
      window.location.href.includes('rainbow')) {
    detectionResults.framework = 'rainbowkit';
    detectionResults.confidence = 'high';
    detectionResults.indicators.push('RainbowKit detected');
  }
  
  // Check for Wagmi
  else if (injectedObjects.isWagmi) {
    detectionResults.framework = 'wagmi';
    detectionResults.confidence = 'high';
    detectionResults.indicators.push('Wagmi detected');
  }
  
  // Check for Dynamic
  else if (window.dynamic || injectedObjects.isDynamic) {
    detectionResults.framework = 'dynamic';
    detectionResults.confidence = 'high';
    detectionResults.indicators.push('Dynamic detected');
  }
  
  // Check for Web3-React
  else if (injectedObjects.isWeb3React) {
    detectionResults.framework = 'web3-react';
    detectionResults.confidence = 'medium';
  }
  
  return detectionResults;
}
```

### Detection Indicators

The detection system uses multiple indicators to identify frameworks:

1. **Window Object Properties**: Checks for framework-specific global objects
2. **URL Patterns**: Analyzes URL patterns for framework-specific paths
3. **Injected Objects**: Checks for framework-specific injected objects
4. **Event Listeners**: Monitors for framework-specific event patterns

---

## Framework-Specific Strategies

**Location:** `src/background/strategy/ConnectionStrategies.js`

### Strategy Configuration

```javascript
export function getConnectionStrategy(framework) {
  const strategies = {
    rainbowkit: {
      name: 'RainbowKit',
      requiresImmediateResponse: true,
      supportsAccountsChanged: true,
      supportsChainChanged: true,
      handshake: null  // Smart Native Connection
    },
    
    wagmi: {
      name: 'Wagmi',
      requiresImmediateResponse: true,
      supportsAccountsChanged: true,
      supportsChainChanged: true,
      handshake: null
    },
    
    walletconnect: {
      name: 'WalletConnect',
      requiresSession: true,
      supportsMultiChain: true,
      usesNamespaces: true
    }
  };
  
  return strategies[framework] || strategies.rainbowkit;
}
```

### RainbowKit Strategy

**Characteristics:**
- Uses EIP-6963 provider discovery
- Supports automatic wallet detection
- Requires immediate response to connection requests
- Fully compatible with Smart Native Connection

**Connection Flow:**
1. RainbowKit detects SuperSafe via EIP-6963
2. User clicks "Connect Wallet" in RainbowKit UI
3. RainbowKit calls `eth_requestAccounts`
4. SuperSafe shows connection popup
5. User approves connection
6. RainbowKit receives account address
7. Connection established

### Wagmi Strategy

**Characteristics:**
- Uses React hooks for wallet connection
- Supports EIP-6963 provider discovery
- Requires immediate response to connection requests
- Compatible with Smart Native Connection

**Connection Flow:**
1. Wagmi detects SuperSafe via EIP-6963
2. Wagmi hook calls `eth_requestAccounts`
3. SuperSafe shows connection popup
4. User approves connection
5. Wagmi hook receives account address
6. Connection established

### Dynamic Strategy

**Characteristics:**
- Uses Dynamic SDK for wallet connection
- Supports multiple wallet providers
- Requires framework-specific detection
- Adapts connection behavior for Dynamic

**Connection Flow:**
1. Dynamic detects SuperSafe provider
2. Dynamic SDK initiates connection
3. SuperSafe shows connection popup
4. User approves connection
5. Dynamic SDK receives account address
6. Connection established

---

## EIP-6963 Provider Discovery

### Overview

EIP-6963 provides a standardized way for wallets to announce themselves to dApps, enabling automatic detection without relying on `window.ethereum`.

### Implementation

```javascript
// EIP-6963: Announce provider to dApps
function announceProvider(provider) {
  const detail = {
    info: {
      uuid: 'super-safe-wallet',
      name: 'SuperSafe',
      icon: 'data:image/svg+xml;base64,...',
      rdns: 'cool.supersafe'
    },
    provider: provider
  };
  
  // Announce provider
  window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
    detail: detail
  }));
  
  // Listen for provider requests
  window.addEventListener('eip6963:requestProvider', () => {
    window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
      detail: detail
    }));
  });
}
```

### Benefits

- ✅ **RainbowKit/Wagmi Automatic Detection**: Frameworks automatically detect SuperSafe
- ✅ **Multi-Wallet Coexistence**: Multiple wallets can coexist without conflicts
- ✅ **Standardized Discovery Protocol**: Follows EIP-6963 standard
- ✅ **Better dApp Compatibility**: Works with modern dApp frameworks

---

## Framework Detection in Action

### RainbowKit Detection

When a RainbowKit dApp loads:

1. **Framework Detection**: SuperSafe detects RainbowKit indicators
2. **Provider Announcement**: SuperSafe announces via EIP-6963
3. **RainbowKit Detection**: RainbowKit detects SuperSafe provider
4. **Connection Ready**: RainbowKit shows SuperSafe in wallet list
5. **User Selection**: User selects SuperSafe from RainbowKit UI
6. **Connection Established**: Connection proceeds normally

### Wagmi Detection

When a Wagmi dApp loads:

1. **Framework Detection**: SuperSafe detects Wagmi indicators
2. **Provider Announcement**: SuperSafe announces via EIP-6963
3. **Wagmi Detection**: Wagmi detects SuperSafe provider
4. **Hook Integration**: Wagmi hooks integrate with SuperSafe provider
5. **Connection Ready**: Wagmi hooks ready for connection
6. **User Interaction**: User triggers connection via Wagmi hook
7. **Connection Established**: Connection proceeds normally

---

## AllowList Integration

Framework detection integrates with the AllowList system:

```json
{
  "version": "1.0.0",
  "policies": {
    "https://velodrome.finance": {
      "name": "Velodrome Finance",
      "supportedChains": [10, 5330],
      "defaultChain": 10,
      "autoApprove": false,
      "requiresConsent": true,
      "framework": "rainbowkit"
    }
  }
}
```

The `framework` field in allowlist policies helps SuperSafe:
- Optimize connection behavior for specific frameworks
- Provide framework-specific error messages
- Adapt UI/UX for framework-specific patterns

---

## Debugging Framework Detection

### Checking Detection Results

To check which framework was detected:

1. Open browser console
2. Check for SuperSafe detection logs
3. Look for framework detection indicators
4. Verify EIP-6963 announcements

### Common Issues

**Framework Not Detected:**
- Check if framework is supported
- Verify EIP-6963 implementation
- Check browser console for errors

**Connection Not Working:**
- Verify framework is in allowlist
- Check network compatibility
- Verify provider injection

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.0+  
**Maintenance:** Review after adding new framework support

