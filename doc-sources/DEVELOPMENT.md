# SuperSafe Wallet - Development Guide

**Created:** October 13, 2025  
**Version:** 3.0.0+  
**Status:** ✅ CURRENT

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Build System](#build-system)
5. [Debugging](#debugging)
6. [Code Standards](#code-standards)

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
    "build:debug": "npm run build:frontend && vite build --config vite.config.background.js --mode debug && npm run build:content",
    "verify:bundles": "node scripts/verify-bundle-separation.js",
    "zip": "cd dist && zip -r -X ../../supersafe-to-chromes-store.zip . -x \"*.DS_Store\" \"__MACOSX/*\""
  }
}
```

### Build Configuration

#### Frontend Build (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'popup.js',
        chunkFileNames: 'assets/[name].js'
      }
    }
  }
});
```

#### Background Worker (`vite.config.worker.js`)

```javascript
export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/background.js'),
      formats: ['es'],
      fileName: () => 'background.js'
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'secp256k1': ['@noble/secp256k1'],
          'storage': ['idb']
        }
      }
    }
  },
  plugins: [
    nodePolyfills({
      include: ['buffer', 'process', 'stream']
    })
  ]
});
```

#### Content Script (`vite.config.content.js`)

```javascript
export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/content-script.js'),
      formats: ['iife'],
      fileName: () => 'content-script.js'
    }
  }
});
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

### Error Handling

```javascript
// Always catch and log errors
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('[Component] Operation failed:', error);
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

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment process
- [BACKEND.md](./BACKEND.md) - Backend development
- [FRONTEND.md](./FRONTEND.md) - Frontend development

---

**Document Status:** ✅ Current as of October 13, 2025  
**Code Version:** v3.0.0+

