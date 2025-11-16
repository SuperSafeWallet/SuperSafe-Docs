---
sidebar_position: 5
---

# 🛠️ Development Setup

SuperSafe Wallet development guide for setting up the development environment and building the extension.

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
│   ├── background.js      # Background entry point
│   └── content-script.js   # Content script
├── public/                 # Static assets
│   └── assets/            # Images, fonts, configs
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
    "build": "npm run clean && npm run build:frontend && npm run build:background && npm run build:content",
    "build:dev": "NODE_ENV=development npm run build",
    "build:prod": "NODE_ENV=production npm run build",
    "build:debug": "npm run build:frontend && vite build --config vite.config.worker.js --mode debug && npm run build:content",
    "build:frontend": "vite build",
    "build:background": "npm run build:worker",
    "build:content": "vite build --config vite.config.content.js",
    "clean": "rm -rf dist"
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

---

## Environment Variables

**Required Environment Variables** (`.env` file):

```bash
# Moralis API Keys (for transaction history)
MORALIS_API_KEY=your_moralis_api_key_here
MORALIS_API_KEY_BACKUP=backup_key_1  # Optional
MORALIS_API_KEY_BACKUP2=backup_key_2  # Optional

# WalletConnect Project ID
WALLETCONNECT_PROJECT_ID=your_project_id_here

# Alchemy API Keys (for RPC endpoints)
ALCHEMY_API_KEY_ETHEREUM=your_key_here
ALCHEMY_API_KEY_OPTIMISM=your_key_here
ALCHEMY_API_KEY_BASE=your_key_here
ALCHEMY_API_KEY_ARBITRUM=your_key_here
```

---

## Code Standards

### Architecture Compliance

- ✅ **NO ethers imports**: Frontend never imports ethers.js
- ✅ **Uses Adapters only**: All crypto operations via adapters
- ✅ **Thin client pattern**: Zero business logic in frontend
- ✅ **All crypto in background**: Private keys never exposed

### Code Style

- **JavaScript**: Follow Airbnb JavaScript Style Guide
- **TypeScript**: Follow TypeScript Deep Dive Guide
- **Comments**: Use Better Comments style (`// * Important`, `// ! Warning`, `// TODO:`)
- **Docstrings**: Use JSDoc for functions

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.0+  
**Maintenance:** Review after major development changes

