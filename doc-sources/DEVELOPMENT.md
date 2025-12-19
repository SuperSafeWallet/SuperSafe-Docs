# SuperSafe Wallet - Development Guide

**Created:** October 13, 2025  
**Last Updated:** November 19, 2025  
**Version:** 3.0.3  
**Status:** ✅ CURRENT  
**Last Code Update:** November 19, 2025

## 🆕 What's New in v3.0.3 (November 19, 2025)

### Unified Configuration System

SuperSafe now uses a **unified, two-tier configuration system** following MetaMask industry standards.

**New Import Pattern:**
```javascript
// ✅ NEW: Frontend files
import { NETWORKS, FEATURE_FLAGS, GAS_THRESHOLDS } from '../config'

// ✅ NEW: Backend files
import { getRpcUrl, MORALIS_CONFIG, NETWORKS } from './config'

// ⚠️ DEPRECATED: Old pattern (DELETED in v3.1.0)
// import { NETWORKS } from '../utils/networks.js' // No longer exists!
```

**Configuration Locations:**
- **Public:** `src/config/` (frontend-safe, no credentials)
- **Sensitive:** `src/background/config/` (backend-only, with API keys)

**Complete Guide:** See [CONFIGURATION.md](./CONFIGURATION.md)

---

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Build System](#build-system)
   - [Build Commands](#build-commands)
   - [Build Configuration](#build-configuration)
   - [Frontend Build](#frontend-build-viteconfigjs)
   - [Background Worker](#background-worker-viteconfigworkerjs)
   - [Content Script](#content-script-viteconfigcontentjs)
   - [TailwindCSS Configuration](#tailwindcss-configuration-tailwindconfigjs)
   - [Build Output](#build-output)
5. [Package.json Configuration](#packagejson-configuration)
   - [Project Metadata](#project-metadata)
   - [Dependencies](#dependencies)
   - [Dependency Architecture](#dependency-architecture)
   - [Environment Variables](#environment-variables)
6. [Debugging](#debugging)
7. [Code Standards](#code-standards)

---

## Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Chrome/Brave**: Latest version
- **Git**: For version control

### Installation

```bash
# Clone repository
git clone https://github.com/SuperSafeWallet/SuperSafe.git
cd SuperSafe

# Install dependencies
npm install

# Build extension
npm run build

# Or build in development mode
npm run build:debug
```

### Loading Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `dist/` directory
5. Extension should appear in your extensions list

---

## Project Structure

### Root Directory

```
SuperSafe/
├── src/                    # Source code
│   ├── background/         # Background service worker
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── controllers/        # Controller layer
│   ├── handlers/           # Request handlers
│   ├── services/           # Service layer
│   ├── utils/              # Utilities
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # React entry point
│   ├── background.js       # Background entry point
│   └── content-script.js   # Content script
├── public/                 # Static assets
│   └── assets/             # Images, fonts, configs
├── dist/                   # Build output (generated)
├── Docs/                   # Documentation
├── scripts/                # Build scripts
├── vite.config.js          # Frontend build config
├── vite.config.worker.js   # Background worker config
├── vite.config.content.js  # Content script config
├── tailwind.config.js      # TailwindCSS config
└── package.json            # Dependencies & scripts
```

---

## Development Workflow

### Development Mode

```bash
# Build with debug mode (more verbose logging)
npm run build:debug

# Watch mode (rebuild on file changes) - Not available
# Manual rebuild required after code changes
```

### Hot Reload

Chrome extensions don't support traditional hot reload. After code changes:

1. Rebuild: `npm run build`
2. Go to `chrome://extensions/`
3. Click the refresh icon on SuperSafe extension
4. Reload any open dApp pages

### Development Tips

**Console Logging:**
- **Background logs**: `chrome://extensions/` → Click "service worker" link
- **Popup logs**: Right-click popup → Inspect
- **Content script logs**: Open dApp page → F12 Console

**Debug Mode:**
```javascript
// Enable verbose logging
localStorage.setItem('SUPERSAFE_DEBUG', 'true');

// Check logs
console.log('[Component] Debug message');
```

---

## Build System

### Build Commands

**Location:** `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "clean": "rm -rf dist",
    "build:frontend": "vite build",
    "build:worker": "vite build --config vite.config.worker.js",
    "build:background": "npm run build:worker",
    "build:content": "vite build --config vite.config.content.js",
    "build": "npm run clean && npm run build:frontend && npm run build:background && npm run build:content",
    "build:dev": "NODE_ENV=development npm run build",
    "build:prod": "NODE_ENV=production npm run build",
    "build:debug": "npm run build:frontend && vite build --config vite.config.worker.js --mode debug && npm run build:content",
    "analyze:frontend": "npm run build:frontend -- --mode analyze",
    "analyze:background": "npm run build:background -- --mode analyze",
    "analyze:content": "npm run build:content -- --mode analyze",
    "verify:bundles": "node scripts/verify-bundle-separation.js",
    "build:verify": "npm run build && npm run verify:bundles",
    "preview": "vite preview",
    "zipmac": "cd dist && zip -r -X ../../supersafe-to-chromes-store-$(date +%Y%m%d_%H%M).zip . -x \"*.DS_Store\" \"__MACOSX/*\"",
    "zipwin": "cd dist; $d = Get-Date -Format yyyy-MM-dd_HHmm; zip -r -X ../../supersafe-to-chromes-store-$d.zip . -x '*.DS_Store' '__MACOSX/*'"
  }
}
```

**Script Descriptions:**

| Script | Purpose | Output |
|--------|---------|--------|
| `build` | Full production build (all bundles) | `dist/` with all files |
| `build:dev` | Development build (verbose logging) | `dist/` with source maps |
| `build:prod` | Production build (optimized) | `dist/` minified |
| `build:debug` | Debug build (background only) | `dist/` with debug symbols |
| `build:frontend` | Frontend only | `dist/popup.js`, `dist/provider.js` |
| `build:background` | Background only | `dist/background.js` |
| `build:content` | Content script only | `dist/content-script.js` |
| `analyze:*` | Bundle size analysis | HTML visualization files |
| `verify:bundles` | Verify bundle separation | Console report |
| `build:verify` | Build + verify | Full build with verification |
| `zipmac` / `zipwin` | Create Chrome Store ZIP | Timestamped ZIP file |

### Build Configuration

SuperSafe uses **three separate Vite configurations** to build different parts of the extension, ensuring proper bundle separation and architecture compliance.

#### Frontend Build (`vite.config.js`)

**Purpose:** Build React popup UI and provider injection script.

**Key Features:**
- ✅ React 18 with JSX runtime
- ✅ Static asset copying (icons, manifest, assets)
- ✅ Bundle analysis in development mode
- ✅ Logger system dead-code elimination
- ✅ Strict ethers.js exclusion (frontend must not import ethers)
- ✅ Content script and provider as separate entries

**Configuration Details:**

```javascript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        jsxRuntime: 'classic', // Avoid problems with chunks
        jsxImportSource: 'react'
      }),
      viteStaticCopy({
        targets: [
          { src: 'public/*.png', dest: '.' },      // Icons
          { src: 'public/*.svg', dest: '.' },      // SVGs
          { src: 'public/manifest.json', dest: '.' },
          { src: 'public/assets/', dest: 'assets/' } // Network/token logos
        ]
      }),
      // Bundle analyzer (development only)
      ...(mode === 'development' ? [visualizer()] : [])
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      '__LOG_LEVEL__': JSON.stringify(mode === 'production' ? 'error' : 'debug'),
      'global': 'globalThis'
    },
    build: {
      outDir: 'dist',
      sourcemap: 'inline',
      minify: mode === 'production' ? 'terser' : false,
      rollupOptions: {
        input: {
          popup: 'index.html',
          'content-script': 'src/content-script.js',
          'provider': 'src/utils/provider.js'
        },
        external: [
          'ethers',  // ⚠️ CRITICAL: Exclude from frontend
          'crypto',
          'stream',
          'buffer'
        ],
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'assets/[name].js',
          manualChunks: (id) => {
            // Keep React in main bundle
            if (id.includes('react') || id.includes('react-dom')) {
              return undefined;
            }
            // Split vendor libraries
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            // Split frontend utilities
            if (id.includes('src/utils/')) {
              return 'frontend-utils';
            }
          }
        }
      }
    }
  };
});
```

**Build Output:**
- `popup.js` - Main React application (~2.1 MB)
- `content-script.js` - Content script (self-contained, ~150 KB)
- `provider.js` - EIP-1193 provider injection
- `assets/` - Chunks and static assets

**Critical Architecture Rules:**
1. **No ethers.js in frontend** - Externalized, will fail if imported
2. **Content script self-contained** - No external chunk dependencies
3. **React in main bundle** - Fast initial load
4. **Logger dead-code elimination** - Production removes debug/info logs

#### Background Worker (`vite.config.worker.js`)

**Purpose:** Build background service worker with all backend logic.

**Key Features:**
- ✅ ES2020 target (BigInt support)
- ✅ Library mode (ES modules)
- ✅ Source maps enabled
- ✅ No minification (for debugging)
- ✅ External React (not needed in background)
- ✅ Environment variables injection

**Configuration Details:**

```javascript
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [],
    define: {
      'process.env': JSON.stringify(env)  // Full env access
    },
    build: {
      target: 'es2020',  // ⚠️ CRITICAL: BigInt bitwise operations
      lib: {
        entry: resolve(__dirname, 'src/background.js'),
        name: 'background',
        fileName: 'background',
        formats: ['es']  // ES modules
      },
      outDir: 'dist',
      emptyOutDir: false,  // Preserve other builds
      sourcemap: true,
      minify: false,  // Keep readable for debugging
      rollupOptions: {
        external: [
          'react',           // Not needed in background
          'react-dom',
          '@heroicons/react'
        ]
      }
    }
  };
});
```

**Build Output:**
- `background.js` - Service worker bundle (~1.8 MB)
- Includes: ethers.js, WalletConnect, all backend logic

**Key Points:**
- **ES2020 target** required for BigInt operations
- **Environment variables** fully available (unlike frontend)
- **No React** - Background is pure JavaScript
- **Source maps** always enabled for debugging

#### Content Script (`vite.config.content.js`)

**Purpose:** Build self-contained content script for web page injection.

**Key Features:**
- ✅ IIFE format (no ES modules in web context)
- ✅ Inline dynamic imports (single self-contained file)
- ✅ Logger system support
- ✅ Web context compatible

**Configuration Details:**

```javascript
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'dist',
    emptyOutDir: false,  // Preserve other builds
    sourcemap: 'inline',
    minify: mode === 'production' ? 'terser' : 'esbuild',
    rollupOptions: {
      input: 'src/content-script.js',
      output: {
        entryFileNames: 'content-script.js',
        inlineDynamicImports: true,  // ⚠️ KEY: Single file
        format: 'iife'               // ⚠️ KEY: IIFE for web context
      }
    },
    target: 'es2020'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    '__LOG_LEVEL__': JSON.stringify(mode === 'production' ? 'error' : 'debug'),
    'global': 'globalThis'
  }
}));
```

**Why Self-Contained?**
- Content scripts run in **web page context** (not extension context)
- Cannot use ES6 `import` statements for external chunks
- Must be a single IIFE file
- All dependencies (NativeStreamManager, etc.) must be inlined

**Build Output:**
- `content-script.js` - Single self-contained file (~150 KB)

#### TailwindCSS Configuration (`tailwind.config.js`)

**Purpose:** Custom styling system with SuperSafe brand colors and design tokens.

**Key Features:**
- ✅ SuperSafe color palette
- ✅ Custom fonts (Inter, Simple Handmade)
- ✅ Brand-specific utilities (neon glow, card shadows)
- ✅ Custom animations (float, marquee)

**Configuration Overview:**

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'supersafe': {
          'green': {
            'primary': '#97E4CE',
            'neon': '#21E2CB',
            // ... more shades
          },
          'gray': {
            'text': '#9BC8C3',
            'card': 'rgba(78, 78, 78, 0.26)',
            // ... more shades
          }
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'handmade': ['Simple Handmade', 'cursive']
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 238, 0.5)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)'
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'marquee': 'marquee 12s linear infinite'
      }
    }
  }
};
```

**Usage in Components:**
```jsx
<div className="bg-supersafe-dark text-supersafe-green-primary">
  <h1 className="font-handmade">SuperSafe</h1>
  <div className="shadow-neon">Neon glow effect</div>
</div>
```

### Build Output

```
dist/
├── index.html              # Popup HTML
├── popup.js                # Frontend bundle (~2.1 MB)
├── background.js           # Service worker bundle (~1.8 MB)
├── content-script.js       # Content script (~150 KB)
├── provider.js             # EIP-1193 provider
├── manifest.json           # Extension manifest
├── assets/                 # Static assets
│   ├── allowlist.json
│   ├── *.svg, *.png
│   └── vendor.js
└── *.js.map                # Source maps (debug mode)
```

---

## Debugging

### Background Script Debugging

```bash
# 1. Open extension page
chrome://extensions/

# 2. Find SuperSafe, click "service worker"
# Opens DevTools for background script

# 3. View logs, set breakpoints
console.log('[Background] Debug info');
debugger;  // Breakpoint
```

### Frontend Debugging

```bash
# 1. Open popup
# 2. Right-click → Inspect
# Opens DevTools for popup

# React DevTools available
```

### Content Script Debugging

```bash
# 1. Open dApp page
# 2. F12 → Console
# Filter by "content-script"

console.log('[Content Script] Message');
```

### Common Issues

**Issue: Service worker terminated**
- **Cause**: Inactive for 30+ seconds
- **Solution**: Long-lived streams keep it alive during operations

**Issue: Storage not persisting**
- **Cause**: Using wrong storage context
- **Solution**: All storage operations must go through background

**Issue: Provider not injected**
- **Cause**: Content script timing
- **Solution**: Check manifest.json `run_at: "document_start"`

**Issue: Build errors**
- **Cause**: Node polyfills missing
- **Solution**: Check vite.config.js has nodePolyfills plugin

---

## Code Standards

### Code Style

**JavaScript/JSX:**
- Use ES6+ syntax
- Prefer `const` over `let`
- Use async/await over promises
- Destructure objects and arrays
- Use template literals

**React:**
- Functional components only
- Use hooks (useState, useEffect, useCallback, useMemo)
- PropTypes or TypeScript for type checking
- Keep components small and focused

### Naming Conventions

```javascript
// Components: PascalCase
export function WalletManager() {}

// Functions: camelCase
function handleTransaction() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Private functions: _prefixed
function _internalHelper() {}

// File names: Match export name
// WalletManager.jsx exports WalletManager
```

### Comment Style

Use Better Comments style:

```javascript
// * Important information
// ! Warning or caution
// ? Question or uncertainty
// TODO: Future improvement
// ✅ Completed/verified
// ❌ Problem/issue
```

### Logging

SuperSafe uses a professional logging system with environment-aware execution and automatic sensitive data sanitization.

**✅ DO: Use Logger**
```javascript
import { createLogger } from './utils/logger/logger.js';
const logger = createLogger('ModuleName');

// Debug information (development only)
logger.debug('Processing transaction', { hash, value });

// General information (development only)
logger.info('User authenticated successfully');

// Warnings (both environments)
logger.warn('Rate limit approaching', { remaining });

// Errors (both environments)
logger.error('Transaction failed', error);
```

**❌ DON'T: Use console directly**
```javascript
// BAD - Don't do this
console.log('Debug info');
console.error('Error occurred');
```

**Namespace Naming:**
- Use PascalCase matching file/module name
- Examples: `BackgroundSessionController`, `TokenSelector`, `SwapAdapter`

**Log Levels:**
- `debug` - Detailed debugging (dev only, eliminated in production)
- `info` - General information (dev only, eliminated in production)
- `warn` - Warnings (visible in both dev and production)
- `error` - Errors (visible in both dev and production)

**Controlling Output (Development):**
```javascript
// In browser console
__SUPERSAFE_LOGGER__.disable('SecureApiClient');  // Silence noisy module
__SUPERSAFE_LOGGER__.enable('TokenController');   // Re-enable
__SUPERSAFE_LOGGER__.list();                      // Show all namespaces
```

**See also:** [LOGGER.md](./LOGGER.md) for complete reference

### Error Handling

```javascript
// Always catch and log errors with Logger
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed:', error);
  throw new Error(`Failed to complete: ${error.message}`);
}
```

### Async Best Practices

```javascript
// ✅ GOOD: Handle all promises
async function goodExample() {
  const data = await fetchData();
  return data;
}

// ❌ BAD: Unhandled promise
function badExample() {
  fetchData();  // Promise not awaited or handled
}
```

### Pre-Switch Handler Best Practices

SuperSafe uses a promise-based pre-switch coordination system to ensure all components are ready before network switches. Follow these best practices when implementing pre-switch handlers.

#### When to Use Pre-Switch Handlers

Use pre-switch handlers when your component needs to:
- Set flags or locks before network state changes
- Clear caches that are network-specific
- Cancel pending network-dependent requests
- Validate conditions before allowing switch

**DO NOT use for:**
- Fetching new network data (use network-changed event instead)
- Heavy computations
- Non-critical UI updates

#### Basic Handler Pattern

```javascript
import { useEffect } from 'react';
import { preSwitchCoordinator } from '../utils/PreSwitchCoordinator.js';

function MyComponent() {
  useEffect(() => {
    const handlerId = 'my-component-lock';
    
    preSwitchCoordinator.registerHandler(
      handlerId,
      async (targetNetworkKey) => {
        // ✅ GOOD: Fast synchronous operations
        isLoadingRef.current = true;
        pendingNetworkRef.current = targetNetworkKey;
        
        console.log(`[MyComponent] Ready for switch to ${targetNetworkKey}`);
      },
      {
        name: 'My Component Lock',
        timeout: 500  // Fast operation
      }
    );
    
    // ✅ CRITICAL: Always cleanup
    return () => {
      preSwitchCoordinator.unregisterHandler(handlerId);
    };
  }, []);
  
  // ... component code
}
```

#### Timeout Selection Guidelines

Choose appropriate timeouts based on operation type:

```javascript
// Fast synchronous operations (setting flags, refs)
timeout: 500

// Async cleanup (canceling requests, clearing caches)
timeout: 1000

// Validation with potential network checks
timeout: 2000

// Complex operations (avoid if possible)
timeout: 3000
```

**Rule of thumb:** If your handler needs > 2s, reconsider if it belongs in pre-switch.

#### Common Patterns

**Pattern 1: Lock/Flag Setting**
```javascript
preSwitchCoordinator.registerHandler(
  'network-lock',
  async (networkKey) => {
    // Set lock immediately
    isNetworkSwitchingRef.current = true;
    targetNetworkRef.current = networkKey;
    
    // Resolve immediately (synchronous)
    return Promise.resolve();
  },
  { name: 'Network Lock', timeout: 500 }
);
```

**Pattern 2: Request Cancellation**
```javascript
preSwitchCoordinator.registerHandler(
  'cancel-requests',
  async (networkKey) => {
    // Cancel all pending requests for old network
    abortControllerRef.current?.abort();
    
    // Clear request queue
    pendingRequestsRef.current = [];
    
    return Promise.resolve();
  },
  { name: 'Cancel Requests', timeout: 500 }
);
```

**Pattern 3: Cache Clearing**
```javascript
preSwitchCoordinator.registerHandler(
  'clear-cache',
  async (networkKey) => {
    // Clear network-specific cache
    networkCacheRef.current.clear();
    
    // Reset state
    setData(null);
    
    return Promise.resolve();
  },
  { name: 'Clear Cache', timeout: 500 }
);
```

**Pattern 4: Validation**
```javascript
preSwitchCoordinator.registerHandler(
  'validate-transition',
  async (networkKey) => {
    // Validate transition is allowed
    if (!canSwitchToNetwork(networkKey)) {
      throw new Error(`Cannot switch to ${networkKey}: validation failed`);
    }
    
    // Prepare for switch
    prepareForNetworkSwitch(networkKey);
    
    return Promise.resolve();
  },
  { name: 'Validate Transition', timeout: 1000 }
);
```

#### Anti-Patterns (What NOT to Do)

```javascript
// ❌ BAD: Fetching data in pre-switch
preSwitchCoordinator.registerHandler('fetch-data', async (networkKey) => {
  const data = await fetchNetworkData(networkKey);  // NO!
  setData(data);
});

// ✅ GOOD: Fetch data after switch via network-changed event
useEffect(() => {
  const handler = (event) => {
    const { targetNetworkKey } = event.detail;
    fetchNetworkData(targetNetworkKey).then(setData);
  };
  window.addEventListener('supersafe-network-changed', handler);
  return () => window.removeEventListener('supersafe-network-changed', handler);
}, []);
```

```javascript
// ❌ BAD: Not cleaning up handler
useEffect(() => {
  preSwitchCoordinator.registerHandler('my-handler', handler);
  // Missing cleanup! Will cause memory leak
}, []);

// ✅ GOOD: Always cleanup
useEffect(() => {
  preSwitchCoordinator.registerHandler('my-handler', handler);
  return () => preSwitchCoordinator.unregisterHandler('my-handler');
}, []);
```

```javascript
// ❌ BAD: Long timeout for simple operation
preSwitchCoordinator.registerHandler('set-flag', handler, {
  timeout: 5000  // Way too long for setting a flag
});

// ✅ GOOD: Appropriate timeout
preSwitchCoordinator.registerHandler('set-flag', handler, {
  timeout: 500  // Fast synchronous operation
});
```

#### Error Handling

Handlers should throw errors only for critical failures:

```javascript
preSwitchCoordinator.registerHandler(
  'critical-validation',
  async (networkKey) => {
    // ✅ Throw for critical failures
    if (!hasRequiredPermissions(networkKey)) {
      throw new Error('Missing required permissions for network switch');
    }
    
    // ✅ Log warnings for non-critical issues
    if (!hasOptionalFeature(networkKey)) {
      console.warn('[MyComponent] Optional feature not available');
      // Don't throw - allow switch to proceed
    }
    
    return Promise.resolve();
  },
  { name: 'Critical Validation', timeout: 1000 }
);
```

#### Debugging Tips

Enable detailed logging to debug coordination issues:

```javascript
// Check registered handlers
console.log('Registered handlers:', preSwitchCoordinator.getHandlers());

// Verify handler registration
console.log('Handler registered:', preSwitchCoordinator.hasHandler('my-handler'));

// View execution results
try {
  const result = await preSwitchCoordinator.executeHandlers('ethereum');
  console.log('Coordination result:', result);
} catch (error) {
  console.error('Coordination failed:', error);
}
```

Coordination failures will be logged with detailed context:
```
[PreSwitchCoordinator] ❌ Failed handlers (1/3):
  ❌ My Component Lock: Handler timeout after 500ms (TIMEOUT)
```

#### Testing

Test handlers in isolation:

```javascript
// Mock handler for testing
const mockHandler = async (networkKey) => {
  console.log(`Mock handler called for ${networkKey}`);
  return Promise.resolve();
};

// Register for test
preSwitchCoordinator.registerHandler('test-handler', mockHandler);

// Execute
await preSwitchCoordinator.executeHandlers('ethereum', {
  abortOnError: false  // Don't abort for test
});

// Cleanup
preSwitchCoordinator.unregisterHandler('test-handler');
```

#### Performance Considerations

Pre-switch handlers run synchronously (awaited) before network switches:
- Keep handlers **fast** (< 500ms for simple operations)
- Use **refs** instead of state updates (no re-renders)
- **Avoid** async operations like network requests
- **Cancel** long-running operations if needed

**Impact on UX:**
- Fast handlers (500ms): Imperceptible to user
- Slow handlers (2000ms): Noticeable delay
- Timed out handlers: Network switch aborted, error shown

#### Summary Checklist

When implementing pre-switch handlers:

- [ ] Handler performs only necessary preparation
- [ ] Timeout is appropriate for operation type
- [ ] Handler is registered in useEffect
- [ ] Handler is unregistered in cleanup function
- [ ] Handler ID is unique and descriptive
- [ ] Handler name is human-readable
- [ ] Errors are thrown only for critical failures
- [ ] No data fetching in handler
- [ ] No heavy computations in handler
- [ ] Tested in isolation

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment process
- [BACKEND.md](./BACKEND.md) - Backend development
- [FRONTEND.md](./FRONTEND.md) - Frontend development

---

## Package.json Configuration

### Project Metadata

```json
{
  "name": "superseed-wallet",
  "version": "0.1.0",
  "type": "module",
  "private": true
}
```

**Key Points:**
- `"type": "module"` - ES modules enabled
- `"private": true` - Not published to npm

### Dependencies

#### Core Dependencies

**UI Framework:**
- `react: ^18.2.0` - React UI library
- `react-dom: ^18.2.0` - React DOM renderer
- `@heroicons/react: ^2.2.0` - Icon library

**Ethereum Libraries:**
- `ethers: ^6.13.0` - Ethereum library (background only)
- `viem: ^2.38.6` - TypeScript-first Ethereum library (Relay.link)
- `@metamask/eth-sig-util: ^8.2.0` - Ethereum signing utilities
- `ethereum-cryptography: ^3.2.0` - Cryptographic primitives

**Wallet Integration:**
- `@reown/walletkit: ^1.2.8` - WalletConnect v2 / Reown SDK
- `@walletconnect/core: ^2.21.4` - WalletConnect core
- `@walletconnect/utils: ^2.21.4` - WalletConnect utilities

**Cross-Chain:**
- `@reservoir0x/relay-sdk: ^2.4.0` - Relay.link cross-chain swaps

**Utilities:**
- `axios: ^1.12.0` - HTTP client
- `buffer: ^6.0.3` - Buffer polyfill
- `idb: ^7.1.1` - IndexedDB wrapper
- `js-sha3: ^0.9.3` - SHA-3 hashing
- `pump: ^3.0.3` - Stream pump
- `readable-stream: ^4.7.0` - Stream polyfill
- `emoji-picker-react: ^4.12.2` - Emoji picker component
- `react-qr-code: ^2.0.15` - QR code generation

**Dependency Overrides:**
```json
{
  "overrides": {
    "ethereum-cryptography": "^3.2.0"
  }
}
```
Ensures consistent cryptographic library version across all dependencies.

#### Development Dependencies

**Build Tools:**
- `vite: ^6.3.6` - Build tool and dev server
- `@vitejs/plugin-react: ^4.0.3` - React plugin for Vite
- `@rollup/plugin-terser: ^0.4.4` - JavaScript minifier
- `rollup-plugin-visualizer: ^5.12.0` - Bundle analyzer

**Polyfills:**
- `@esbuild-plugins/node-globals-polyfill: ^0.2.3` - Node.js globals
- `vite-plugin-node-polyfills: ^0.24.0` - Node.js polyfills for Vite

**Static Assets:**
- `vite-plugin-static-copy: ^3.1.2` - Copy static files to dist

**Styling:**
- `tailwindcss: ^3.3.3` - Utility-first CSS framework
- `autoprefixer: ^10.4.14` - CSS vendor prefixing
- `postcss: ^8.4.27` - CSS post-processor

**TypeScript Types:**
- `@types/react: ^18.2.15` - React type definitions
- `@types/react-dom: ^18.2.7` - React DOM type definitions

**Utilities:**
- `dotenv: ^16.5.0` - Environment variable loading
- `glob: ^10.4.5` - File pattern matching

### Dependency Architecture

**Frontend Dependencies** (popup.js):
- React, React DOM
- Heroicons
- Emoji Picker
- React QR Code
- ❌ **NO ethers.js** (architecture compliance)

**Background Dependencies** (background.js):
- ethers.js v6
- WalletConnect/Reown
- Relay.link SDK
- Viem (for Relay)
- All cryptographic libraries
- ❌ **NO React** (pure JavaScript)

**Content Script Dependencies** (content-script.js):
- Minimal dependencies
- NativeStreamManager (inlined)
- ❌ **NO external chunks** (self-contained)

### Environment Variables

**Required Variables** (`.env` file):

```bash
# Alchemy RPC Keys
ALCHEMY_ETHEREUM_API_KEY=your_key_here
ALCHEMY_OPTIMISM_API_KEY=your_key_here

# WalletConnect
WALLETCONNECT_PROJECT_ID=your_project_id

# Relay.link
RELAY_PARTNER_SOURCE=supersafe
RELAY_API_BASE_URL=https://api.relay.link

# Bebop Partner Configuration
BEBOP_PARTNER_RECEIVER_ADDRESS=0x...
BEBOP_PARTNER_FEE_BPS=100
```

**Access in Code:**
- **Background**: `process.env.VARIABLE_NAME` (full access)
- **Frontend**: Must request via stream messages (security)

---

**Document Status:** ✅ Current as of November 19, 2025  
**Code Version:** v3.0.3+  
**Maintenance:** Review after major dependency updates

