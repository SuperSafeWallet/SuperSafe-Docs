---
sidebar_position: 4
---

# 🏢 Enterprise Managers

SuperSafe Wallet implements enterprise-grade managers for signing requests, popup orchestration, event broadcasting, and stream persistence.

## Overview

### Manager Architecture

```
Manager Layer
├── SigningRequestManager
│   ├── Request lifecycle management
│   ├── Deduplication
│   ├── Concurrent request handling
│   ├── Stream persistence
│   └── Recovery system
│
├── PopupManager
│   ├── Popup window orchestration
│   ├── Multi-popup support
│   ├── Context routing
│   ├── Window state management
│   └── Cleanup on close
│
├── EIP1193EventsManager
│   ├── accountsChanged event broadcasting
│   ├── chainChanged event broadcasting
│   ├── connect/disconnect events
│   └── Multi-stream broadcasting
│
├── AutoEscalationManager
│   ├── Trusted dApp identification
│   ├── Auto-approval logic
│   ├── Risk assessment
│   └── User preference storage
│
└── StreamPersistenceManager
    ├── Stream reconnection
    ├── Request recovery
    ├── State synchronization
    └── Connection health monitoring
```

---

## SigningRequestManager

**Location:** `src/background/managers/SigningRequestManager.js`

**Purpose:** Enterprise-grade management of all signing requests (personal_sign, eth_signTypedData, eth_sendTransaction) with unified lifecycle, timeout protection, and request recovery.

**Key Features:**
- ✅ Unified request lifecycle for all signing types
- ✅ Timeout protection (5 minutes default)
- ✅ Request recovery on popup crash
- ✅ Deduplication of identical requests
- ✅ Queue-based processing
- ✅ Snake_case method support (personal_sign, personalSign)

**Architecture:**

```javascript
class SigningRequestManager {
  constructor(sessionController, popupManager) {
    this.sessionController = sessionController;
    this.popupManager = popupManager;
    
    // Request tracking
    this.pendingRequests = new Map();
    this.requestQueue = [];
    this.requestDeduplicator = new SigningRequestDeduplicator();
    
    // Sub-managers
    this.modalAdapter = new SigningModalAdapter();
    this.streamManager = new StreamPersistenceManager();
    this.recoverySystem = new SigningRequestRecovery(this);
    
    // Timeout configuration
    this.REQUEST_TIMEOUT = 5 * 60 * 1000; // 5 minutes
    
    // Stats
    this.requestStats = {
      total: 0,
      approved: 0,
      rejected: 0,
      deduplicated: 0,
      expired: 0,
      errors: 0
    };
  }
  
  async createRequest(method, params, origin, metadata = {}) {
    const requestId = this.generateRequestId();
    
    // Create request object
    const request = {
      id: requestId,
      method,
      params,
      origin,
      metadata,
      createdAt: Date.now(),
      status: 'created'
    };
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      this.expireRequest(requestId);
    }, this.REQUEST_TIMEOUT);
    
    request.timeoutId = timeoutId;
    
    // Store request
    this.pendingRequests.set(requestId, request);
    this.requestStats.total++;
    
    return requestId;
  }
  
  async handleResponse(requestId, response) {
    const request = this.pendingRequests.get(requestId);
    if (!request) {
      console.warn(`[SigningRequestManager] Request ${requestId} not found`);
      return;
    }
    
    // Clear timeout
    if (request.timeoutId) {
      clearTimeout(request.timeoutId);
    }
    
    // Update stats
    if (response.success) {
      this.requestStats.approved++;
    } else {
      this.requestStats.rejected++;
    }
    
    // Remove from pending
    this.pendingRequests.delete(requestId);
    
    // Resolve promise
    if (request.resolve) {
      request.resolve(response);
    }
  }
  
  expireRequest(requestId) {
    const request = this.pendingRequests.get(requestId);
    if (!request) return;
    
    console.warn(`[SigningRequestManager] Request ${requestId} expired`);
    
    this.requestStats.expired++;
    this.pendingRequests.delete(requestId);
    
    // Reject with timeout error
    if (request.reject) {
      request.reject(new Error('Request timeout'));
    }
  }
  
  recoverPendingRequests() {
    const pendingRequests = Array.from(this.pendingRequests.values());
    
    for (const request of pendingRequests) {
      const age = Date.now() - request.createdAt;
      
      if (age > this.REQUEST_TIMEOUT) {
        // Expire old requests
        this.expireRequest(request.id);
      } else {
        // Re-create popup for active requests
        this.popupManager.createSigningPopup(request);
      }
    }
  }
}
```

**Supported Methods:**
- `personal_sign` / `personalSign` - Personal message signing (SIWE)
- `eth_signTypedData_v4` - EIP-712 structured data signing (Permit2)
- `eth_signTypedData_v3` - Legacy typed data
- `eth_signTypedData` - Legacy typed data
- `eth_sendTransaction` - Transaction signing
- `eth_sign` - ❌ Permanently disabled (security risk)

---

## PopupManager

**Location:** `src/background/managers/PopupManager.js`

**Purpose:** Orchestrate popup windows for different contexts with mutual exclusion (Professionally Standardized UX).

**Key Features:**
- ✅ Mutual exclusion with extension UI
- ✅ Priority-based popup system
- ✅ Automatic focus management
- ✅ Triple verification system
- ✅ Cleanup on close

**Popup Types & Priority:**

| Priority | Type | Purpose |
|----------|------|---------|
| 1 | personal_sign | Personal message signing |
| 2 | typed_data | EIP-712 structured data |
| 3 | transaction | Transaction confirmation |
| 4 | network_switch | Network change consent |
| 5 | unsupported_network | Unsupported network error |
| 6 | connection | dApp connection request |
| 7 | unlock | Wallet unlock |

**Architecture:**

```javascript
class PopupManager {
  constructor(sessionController, controllers) {
    this.sessionController = sessionController;
    this.controllers = controllers;
    
    this.activePopups = new Map();  // type -> popupId
    this.popupData = new Map();     // popupId -> data
    
    // Popup priority (lower = higher priority)
    this.POPUP_PRIORITY = {
      personal_sign: 1,
      typed_data: 2,
      transaction: 3,
      network_switch: 4,
      unsupported_network: 5,
      connection: 6,
      unlock: 7
    };
  }
  
  async checkAndFocusExistingPopups() {
    const windows = await chrome.windows.getAll({ windowTypes: ['popup'] });
    
    if (windows.length === 0) {
      return { shouldClose: false, focusedPopup: null };
    }
    
    // Find highest priority popup
    let highestPriorityPopup = null;
    let lowestPriority = Infinity;
    
    for (const [type, popupId] of this.activePopups) {
      const priority = this.POPUP_PRIORITY[type] || 999;
      if (priority < lowestPriority) {
        lowestPriority = priority;
        highestPriorityPopup = { type, popupId };
      }
    }
    
    if (highestPriorityPopup) {
      // Focus highest priority popup
      await chrome.windows.update(highestPriorityPopup.popupId, { focused: true });
      return { shouldClose: true, focusedPopup: highestPriorityPopup.type };
    }
    
    return { shouldClose: false, focusedPopup: null };
  }
  
  async createConnectionPopup(origin, networkKey, supportedNetworks) {
    // Check for existing popups
    const existingCheck = await this.checkAndFocusExistingPopups();
    if (existingCheck.shouldClose) {
      return existingCheck.focusedPopup;
    }
    
    // Build popup URL
    const url = chrome.runtime.getURL(
      `index.html?screen=connection&origin=${encodeURIComponent(origin)}&network=${networkKey}`
    );
    
    // Create popup window
    const popup = await chrome.windows.create({
      url,
      type: 'popup',
      width: 375,
      height: 600,
      focused: true
    });
    
    // Track popup
    this.activePopups.set('connection', popup.id);
    this.popupData.set(popup.id, { origin, networkKey, supportedNetworks });
    
    return popup.id;
  }
  
  async createUnsupportedNetworkPopup(chainIdHex, origin) {
    const url = chrome.runtime.getURL(
      `index.html?screen=unsupported_network&chainId=${chainIdHex}&origin=${encodeURIComponent(origin)}`
    );
    
    const popup = await chrome.windows.create({
      url,
      type: 'popup',
      width: 375,
      height: 500,
      focused: true
    });
    
    this.activePopups.set('unsupported_network', popup.id);
    
    return popup.id;
  }
  
  async closePopup(popupId) {
    try {
      await chrome.windows.remove(popupId);
    } catch (error) {
      console.warn(`[PopupManager] Failed to close popup ${popupId}:`, error);
    }
    
    // Cleanup tracking
    for (const [type, id] of this.activePopups) {
      if (id === popupId) {
        this.activePopups.delete(type);
        break;
      }
    }
    
    this.popupData.delete(popupId);
  }
}
```

**Mutual Exclusion Implementation:**

1. **Pre-render Check** (`main.jsx`)
   - Before React renders, check for existing popups
   - Close extension if popup exists

2. **Post-render Safety Net** (`App.jsx`)
   - After React renders, verify no coexistence
   - Emergency closure if popup detected

3. **Centralized Verification** (`PopupManager.checkAndFocusExistingPopups()`)
   - Single source of truth for popup state
   - Enforces priority system
   - Focuses highest priority popup

**Benefits:**
- User never sees multiple SuperSafe windows
- Clear focus on current action
- Professional wallet UX (MetaMask-compatible)
- Prevents confusion and errors

---

## EIP1193EventsManager

**Purpose:** Broadcast EIP-1193 events to connected dApps

**Key Features:**
- ✅ accountsChanged event broadcasting
- ✅ chainChanged event broadcasting
- ✅ connect/disconnect events
- ✅ Multi-stream broadcasting

---

## AutoEscalationManager

**Purpose:** Auto-approval for trusted dApps

**Key Features:**
- ✅ Trusted dApp identification
- ✅ Auto-approval logic
- ✅ Risk assessment
- ✅ User preference storage

---

## StreamPersistenceManager

**Purpose:** Stream reconnection and request recovery

**Key Features:**
- ✅ Stream reconnection
- ✅ Request recovery
- ✅ State synchronization
- ✅ Connection health monitoring

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.2+  
**Maintenance:** Review after major manager changes

