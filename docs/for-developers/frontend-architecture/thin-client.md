---
sidebar_position: 1
---

# 🎨 Thin Client Pattern

SuperSafe Wallet's frontend implements a **Thin Client Pattern** where all business logic resides in the background service worker. The React application is purely presentational, communicating with the background via Chrome streams.

## Overview

### Frontend Metrics

```
Total Frontend Files: 61 JSX components
Main App Component: 1,569 lines
Total Frontend Code: ~8,000 lines
Framework: React 18.2.0
Styling: TailwindCSS 3.3.3
Build Tool: Vite 6.3.6
```

### Key Principles

- **✅ Thin Client**: Zero business logic in frontend
- **✅ Stream Communication**: Long-lived connections to background
- **✅ Presentational Components**: Pure UI rendering
- **✅ Centralized State**: WalletProvider context
- **✅ Adapter Pattern**: Background communication abstraction

---

## Architecture Overview

### Component Hierarchy

```
Frontend (React)
       │
       │ chrome.runtime.connect({ name: 'session' })
       ↓
┌─────────────────────────────────────────┐
│  StreamConnectionManager                │
│  • Manages long-lived connections        │
│  • Handles reconnection                 │
│  • Message queuing                      │
└────────┬────────────────────────────────┘
         │ sendRequest('session', { type: 'GET_SESSION_STATE' })
         ↓
┌─────────────────────────────────────────┐
│  Adapters (Thin Client Layer)          │
│  • FrontendSessionAdapter               │
│  • SwapAdapter                          │
│  • RelayAdapter                          │
│  • SendAdapter                           │
│  • BlockchainAdapter                     │
└────────┬────────────────────────────────┘
         │ Delegates to background
         ↓
┌─────────────────────────────────────────┐
│  Background Service Worker              │
│  • All business logic                   │
│  • Crypto operations                    │
│  • State management                     │
└─────────────────────────────────────────┘
```

---

## Adapter Pattern

### Frontend Adapters

**Purpose:** Abstract background communication from components.

#### FrontendSessionAdapter

**Location:** `src/utils/FrontendSessionAdapter.js`

```javascript
class FrontendSessionAdapter {
  static async getSessionState() {
    return await StreamConnectionManager.sendRequest('session', {
      type: 'GET_SESSION_STATE'
    });
  }
  
  static async unlock(password) {
    return await StreamConnectionManager.sendRequest('session', {
      type: 'UNLOCK',
      payload: { password }
    });
  }
  
  static async createWallet(name, emoji) {
    return await StreamConnectionManager.sendRequest('session', {
      type: 'CREATE_WALLET',
      payload: { name, emoji }
    });
  }
  
  static async switchWallet(index) {
    return await StreamConnectionManager.sendRequest('session', {
      type: 'SWITCH_WALLET',
      payload: { index }
    });
  }
}
```

#### SwapAdapter

**Location:** `src/utils/SwapAdapter.js`

```javascript
class SwapAdapter {
  static async getSwapQuote(params) {
    return await StreamConnectionManager.sendRequest('swap', {
      type: 'SWAP_GET_QUOTE',
      payload: params
    });
  }
  
  static async signAndSubmitOrder(quote, takerAddress, networkKey) {
    return await StreamConnectionManager.sendRequest('swap', {
      type: 'SWAP_SIGN_AND_SUBMIT',
      payload: { quote, takerAddress, networkKey }
    });
  }
  
  static async checkOrderStatus(quoteId, networkKey) {
    return await StreamConnectionManager.sendRequest('swap', {
      type: 'SWAP_CHECK_STATUS',
      payload: { quoteId, networkKey }
    });
  }
}
```

#### RelayAdapter

**Location:** `src/utils/RelayAdapter.js`

```javascript
class RelayAdapter {
  static async getQuote(params) {
    return await StreamConnectionManager.sendRequest('relay', {
      type: 'RELAY_GET_QUOTE',
      payload: params
    });
  }
  
  static async executeSwap(params) {
    return await StreamConnectionManager.sendRequest('relay', {
      type: 'RELAY_EXECUTE_SWAP',
      payload: params
    });
  }
  
  static async checkStatus(params) {
    return await StreamConnectionManager.sendRequest('relay', {
      type: 'RELAY_GET_STATUS',
      payload: params
    });
  }
}
```

---

## Stream Connection Manager

**Location:** `src/utils/StreamConnectionManager.js`

**Purpose:** Manage long-lived Chrome connections to background

**Features:**
- ✅ Automatic reconnection
- ✅ Message queuing
- ✅ Connection health monitoring
- ✅ Error handling

```javascript
class StreamConnectionManager {
  constructor() {
    this.connections = new Map();  // channel -> port
    this.messageQueue = new Map(); // channel -> messages[]
    this.reconnectAttempts = new Map();
  }
  
  async connect(channel) {
    const port = chrome.runtime.connect({ name: channel });
    
    port.onDisconnect.addListener(() => {
      console.warn(`[StreamConnection] ${channel} disconnected`);
      this.connections.delete(channel);
      this.reconnect(channel);
    });
    
    this.connections.set(channel, port);
    
    // Process queued messages
    this.processQueue(channel);
    
    return port;
  }
  
  async sendRequest(channel, message) {
    let port = this.connections.get(channel);
    
    if (!port) {
      port = await this.connect(channel);
    }
    
    return new Promise((resolve, reject) => {
      const messageId = this.generateMessageId();
      
      const listener = (response) => {
        if (response.id === messageId) {
          port.onMessage.removeListener(listener);
          
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error));
          }
        }
      };
      
      port.onMessage.addListener(listener);
      
      port.postMessage({
        ...message,
        id: messageId
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        port.onMessage.removeListener(listener);
        reject(new Error('Request timeout'));
      }, 30000);
    });
  }
}
```

---

## Architecture Compliance

**✅ ARCHITECTURE.md Compliance:**
- ✅ **NO ethers imports**: Frontend never imports ethers.js
- ✅ **Uses Adapters only**: All crypto operations via adapters
- ✅ **Thin client pattern**: Zero business logic in frontend
- ✅ **All crypto in background**: Private keys never exposed

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.0+  
**Maintenance:** Review after major frontend changes

