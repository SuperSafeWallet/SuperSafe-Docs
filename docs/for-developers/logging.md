---
sidebar_position: 7
---

# 🔍 Logging System

SuperSafe implements a professional, centralized logging system that provides environment-aware logging with automatic sensitive data sanitization and dead-code elimination in production builds.

## Overview

**Key Features:**
- ✅ Environment-aware execution (development vs production)
- ✅ Namespace-based organization
- ✅ Automatic sensitive data sanitization
- ✅ Zero overhead in production (dead-code elimination)
- ✅ Per-namespace configuration in development
- ✅ Performance optimization via build-time elimination

---

## Quick Start

### Creating a Logger

```javascript
import { createLogger } from './utils/logger/logger.js';
const logger = createLogger('ModuleName');
```

**Namespace Naming Conventions:**
- Use PascalCase for class-based modules: `BackgroundSessionController`
- Use descriptive names: `TokenController`, `ProviderStreamHandler`
- Keep names concise but meaningful
- Match the file/module name when possible

---

## Logging Methods

### `logger.debug(...args)`

**Purpose:** Detailed debugging information  
**Visibility:** Development only  
**Production:** Completely eliminated (dead-code)

```javascript
logger.debug('Initializing with config:', config);
logger.debug('Processing transaction:', { hash, value, from, to });
```

### `logger.info(...args)`

**Purpose:** General informational messages  
**Visibility:** Development only  
**Production:** Completely eliminated (dead-code)

```javascript
logger.info('User logged in successfully');
logger.info('Network switched to:', networkName);
```

### `logger.warn(...args)`

**Purpose:** Warning messages  
**Visibility:** Both development and production  
**Production:** Sanitized according to environment rules

```javascript
logger.warn('Rate limit approaching:', { remaining: 10 });
logger.warn('Unexpected response format:', response);
```

### `logger.error(...args)`

**Purpose:** Error messages  
**Visibility:** Both development and production  
**Production:** Sanitized according to environment rules

```javascript
logger.error('Failed to unlock vault:', error);
logger.error('API request failed:', { url, status, error });
```

---

## Runtime Controls (Development Only)

Available in **ALL contexts:**
- ✅ Popup/UI (window context)
- ✅ Background Service Worker (service worker context)
- ✅ Content Scripts

### Quick Access

```javascript
// Show help
__SUPERSAFE_LOGGER__.help();

// List all active namespaces
__SUPERSAFE_LOGGER__.list();

// Disable noisy namespace
__SUPERSAFE_LOGGER__.disable('NativeStreamManager');
__SUPERSAFE_LOGGER__.disable('BackgroundSessionController');

// Enable specific namespace
__SUPERSAFE_LOGGER__.enable('TokenController');

// Show current configuration
__SUPERSAFE_LOGGER__.config();

// Reset all to defaults
__SUPERSAFE_LOGGER__.reset();
```

---

## Configuration

### Global Configuration

**Location:** `src/utils/logger/loggerConfig.js`

```javascript
const DEFAULT_CONFIG = {
  global: { enabled: true },
  'NativeStreamManager': false,  // Disable noisy module
  'SecureApiClient': false,
  'vaultStorage': false
};
```

### Per-Namespace Configuration

```javascript
const DEFAULT_CONFIG = {
  global: { enabled: true },
  'TransactionController': true,  // Enable specific ones
  'SwapAdapter': true,
  'TokenController': true
};
```

---

## Sensitive Data Sanitization

The logger automatically sanitizes sensitive data patterns:

**Sanitized Patterns:**
- Private keys: `0x[a-fA-F0-9]{64}` → `[PRIVATE_KEY_HIDDEN]`
- Passwords: `password`, `pwd`, `pass` → `[PASSWORD_HIDDEN]`
- API keys: `api[_-]?key`, `apikey` → `[API_KEY_HIDDEN]`
- Seeds: `seed`, `mnemonic`, `phrase` → `[SEED_HIDDEN]`

**Example:**
```javascript
logger.debug('Unlocking vault with password:', password);
// Development: "Unlocking vault with password: mypassword123"
// Production: "Unlocking vault with password: [PASSWORD_HIDDEN]"
```

---

## Build Configuration

### Production Build

**Dead-code elimination:**
- `debug()` and `info()` calls are completely removed
- `warn()` and `error()` calls remain but are sanitized
- Zero performance overhead for debug/info logs

**Vite Configuration:**
```javascript
define: {
  '__LOG_LEVEL__': JSON.stringify(mode === 'production' ? 'error' : 'debug')
}
```

---

## Best Practices

### 1. Use Appropriate Log Levels

```javascript
// ✅ GOOD: Use debug for detailed info
logger.debug('Processing swap quote:', quoteData);

// ✅ GOOD: Use info for important events
logger.info('Swap executed successfully:', txHash);

// ✅ GOOD: Use warn for recoverable issues
logger.warn('Rate limit approaching:', { remaining: 10 });

// ✅ GOOD: Use error for failures
logger.error('Swap failed:', error);
```

### 2. Include Context

```javascript
// ✅ GOOD: Include relevant context
logger.error('Failed to fetch token balance', {
  tokenAddress,
  networkKey,
  walletAddress,
  error: error.message
});

// ❌ BAD: Missing context
logger.error('Failed');
```

### 3. Avoid Logging Sensitive Data

```javascript
// ❌ BAD: Logging private key directly
logger.debug('Private key:', privateKey);

// ✅ GOOD: Log only non-sensitive info
logger.debug('Signing transaction with wallet:', walletAddress);
```

---

## Troubleshooting

### Namespaces Not Appearing

**Issue:** `__SUPERSAFE_LOGGER__.list()` returns empty array

**Solution:** Namespaces are lazy-loaded. Interact with the extension first (unlock wallet, switch network, etc.) to trigger module loading, then call `.list()` again.

### Logs Not Showing

**Check:**
1. Is the namespace enabled? `__SUPERSAFE_LOGGER__.config()`
2. Is global logging enabled? `__SUPERSAFE_LOGGER__.config().global.enabled`
3. Are you in development mode? Production builds eliminate debug/info logs

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v1.0.0+  
**Maintenance:** Review after major logging changes

