# SuperSafe Wallet - Deployment Guide

**Created:** October 13, 2025  
**Last Updated:** February 9, 2026  
**Version:** 3.1.8  
**Status:** ✅ CURRENT  
**Last Code Update:** February 9, 2026

## 🆕 What's New in v3.1.6 (January 11, 2026)

### Unified Configuration System

**CRITICAL CHANGE:** Configuration system completely refactored for security and maintainability.

**Key Changes:**
- ✅ **Two-tier configuration:** Public (frontend) + Sensitive (backend)
- ✅ **Zero credentials in frontend:** All API keys isolated to background
- ✅ **Single import point:** `import from '../config'` pattern
- ✅ **Environment variables:** Only injected in background bundle

**Impact on Deployment:**
- All 10 `MORALIS_RPC_*` variables are now **REQUIRED** (fail-fast validation)
- `.env` file must be complete before build
- Configuration errors show clear messages at startup

**Migration:** See [CONFIGURATION.md](./CONFIGURATION.md) for complete guide

---

---

## Table of Contents

1. [Build Process](#build-process)
2. [Chrome Web Store](#chrome-web-store)
3. [Version Management](#version-management)
4. [Release Checklist](#release-checklist)
5. [Production Configuration](#production-configuration)

---

## Build Process

### Production Build

```bash
# Clean previous build
npm run clean

# Full production build
npm run build

# Verify bundle separation
npm run verify:bundles

# Create distribution package (macOS)
npm run zipmac

# Or for Windows PowerShell
npm run zipwin
```

### Build Output Verification

**Check dist/ directory:**
```
dist/
├── manifest.json           # ✓ Version matches package.json
├── index.html              # ✓ Popup entry
├── popup.js                # ✓ Frontend bundle
├── background.js           # ✓ Service worker
├── content-script.js       # ✓ Content script
├── provider.js             # ✓ EIP-1193 provider
└── assets/                 # ✓ All static assets
```

**Bundle Size Limits:**
- `popup.js`: < 3 MB (currently ~2.1 MB)
- `background.js`: < 2 MB (currently ~1.8 MB)
- `content-script.js`: < 200 KB (currently ~150 KB)
- Total extension: < 10 MB

---

## Chrome Web Store

### Initial Submission

1. **Create Developer Account**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 registration fee

2. **Prepare Store Listing**
   - Extension name: "SuperSafe Wallet"
   - Description: 400 character summary
   - Detailed description: Full feature list
   - Category: Productivity → Tools
   - Language: English (primary)

3. **Required Assets**
   ```
   Icon sizes:
   - 16x16px (manifest icon)
   - 48x48px (manifest icon)
   - 128x128px (manifest icon, Web Store)
   
   Screenshots:
   - 1280x800px or 640x400px
   - Minimum 1, maximum 5
   - Show key features
   
   Promotional images:
   - Small tile: 440x280px
   - Large tile: 920x680px (optional)
   - Marquee: 1400x560px (optional)
   ```

4. **Upload Package**
   ```bash
   # Create zip file (macOS)
   npm run zipmac
   
   # Or for Windows PowerShell
   npm run zipwin
   
   # Upload supersafe-to-chromes-store-YYYYMMDD_HHMM.zip to dashboard
   ```

5. **Privacy Policy**
   - URL: https://supersafe.xyz/privacy.html
   - Must explain data collection and usage
   - Hosted at persistent URL

6. **Submit for Review**
   - Review time: 1-3 business days
   - May request additional information

### Update Submission

```bash
# 1. Update version in package.json
vim package.json
# Change: "version": "3.0.1"

# 2. Update manifest.json (done automatically by build)
# manifest.json version synced with package.json

# 3. Build and package
npm run build
npm run zipmac  # or npm run zipwin on Windows

# 4. Upload to Chrome Web Store
# Dashboard → Edit → Upload updated package

# 5. Add release notes
# Describe changes, bug fixes, new features

# 6. Submit for review
```

---

## Version Management

### Semantic Versioning

Follow semver: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes, major architecture updates
- **MINOR**: New features, backwards-compatible
- **PATCH**: Bug fixes, minor improvements

**Examples:**
- `3.0.0` → Major release (Smart Native Connection)
- `3.1.0` → New feature (added network support)
- `3.0.1` → Bug fix (fixed swap issue)

### Version Update Process

```bash
# 1. Update package.json
{
  "version": "3.0.1"
}

# 2. Update manifest.json (if needed)
{
  "version": "3.0.1",
  "version_name": "3.0.1 - Bug Fixes"
}

# 3. Tag release in git
git tag -a v3.0.1 -m "Release v3.0.1: Bug fixes"
git push origin v3.0.1

# 4. Create GitHub release
# Include changelog and download link
```

### Changelog

**Location:** `CHANGELOG.md` (create if doesn't exist)

```markdown
# Changelog

## [3.0.3] - 2025-11-19

### Changed
- **CRITICAL:** Unified Configuration System - Complete refactor for security and maintainability
  - Two-tier configuration: Public (frontend) + Sensitive (backend)
  - Zero credentials in frontend: All API keys isolated to background
  - Single import point: `import from '../config'` pattern
  - Environment variables: Only injected in background bundle
- **REQUIRED:** All 10 `MORALIS_RPC_*` environment variables now mandatory (fail-fast validation)
- `.env` file must be complete before build
- Configuration errors show clear messages at startup
- See [CONFIGURATION.md](./CONFIGURATION.md) for complete migration guide

## [3.0.2] - 2025-11-01

### Added
- **NEW:** Batch token price fetching (`getBatchTokenPrices()`)
  - 96.3% reduction in API calls for portfolio calculations
  - Fetch 27 tokens in 1 API call instead of 27 separate calls
- Automatic retry logic with exponential backoff for API calls
  - 2 retries with 1s and 2s delays
  - Graceful fallback on persistent failures

### Changed
- **OPTIMIZATION:** Portfolio 24h change calculation now uses batch API
  - Reduced loading time from 5-10s to <1s for large portfolios
  - Eliminated 503 errors from API overload
- Improved error handling for SuperSafe Price API
  - Graceful 503 handling with fallback data
  - Reduced console spam (warnings instead of errors)
  - Portfolio continues functioning with degraded data

### Fixed
- Fixed race condition in network switching causing double portfolio loads
- Fixed tokens from wrong network appearing briefly during network switch
- Eliminated console spam from transient API failures

## [3.0.1] - 2025-10-15

### Fixed
- Fixed swap approval flow on Optimism
- Corrected gas estimation for native transfers
- Fixed network switch confirmation modal

### Changed
- Updated Bebop API to v2 endpoints
- Improved error messages for failed transactions

## [3.0.0] - 2025-10-01

### Added
- Smart Native Connection architecture
- Multi-network support (8 active networks: SuperSeed, Optimism, Ethereum, Base, BSC, Arbitrum, Monad, Shardeum)
- Bebop swap integration with partner fees (JAM and RFQ)
- Relay.link cross-chain swap integration (85+ blockchains)
- WalletConnect v2 / Reown support
- EIP-6963 provider discovery
- Professional logging system with environment-aware execution

### Changed
- Complete architecture refactor
- New unified vault system
- Stream-based communication
- Network switching coordination system
- Transaction decoder supporting major DEX protocols

### Removed
- Legacy handshake system
- Old connection mechanisms
```

---

## Release Checklist

### Pre-Release

- [ ] All tests passing
- [ ] No console errors in production build
- [ ] Linter checks passing
- [ ] Bundle sizes within limits
- [ ] Version numbers updated (package.json, manifest.json)
- [ ] Changelog updated
- [ ] Documentation updated
- [ ] Privacy policy current

### Build Verification

- [ ] Clean build successful: `npm run clean && npm run build`
- [ ] Bundle verification: `npm run verify:bundles`
- [ ] Extension loads in Chrome without errors
- [ ] Test on fresh profile (no previous wallet data)
- [ ] Test wallet creation flow
- [ ] Test wallet import flow
- [ ] Test dApp connection (at least 2 dApps)
- [ ] Test EIP-6963 provider discovery
- [ ] Test token transfers (native and ERC20)
- [ ] Test swap functionality (Bebop JAM/RFQ)
- [ ] Test cross-chain swaps (Relay.link)
- [ ] Test network switching (all 8 active networks)
- [ ] Test WalletConnect connection
- [ ] Test transaction history across networks

### Security Checks

- [ ] No hardcoded API keys or secrets
- [ ] Environment variables properly configured (Alchemy keys, WalletConnect Project ID)
- [ ] AllowList properly configured (`public/assets/allowlist.json`)
- [ ] Fee receiver address verified (Bebop partner fees)
- [ ] RPC endpoints functional (all 8 active networks)
- [ ] External API endpoints accessible (Bebop, Relay.link, SuperSafe Price API)
- [ ] Content Security Policy (CSP) properly configured in manifest.json
- [ ] Logger system eliminates sensitive data in production builds

### Post-Release

- [ ] Monitor Chrome Web Store reviews
- [ ] Check error reporting (if implemented)
- [ ] Monitor user feedback
- [ ] Prepare hotfix plan if critical issues found

---

## Production Configuration

### Environment Variables

**Required Environment Variables** (`.env` file):

```bash
# Alchemy RPC Keys (required for Ethereum and Optimism)
ALCHEMY_ETHEREUM_API_KEY=your_ethereum_key_here
ALCHEMY_OPTIMISM_API_KEY=your_optimism_key_here

# WalletConnect / Reown
WALLETCONNECT_PROJECT_ID=your_project_id_here

# Relay.link (optional, defaults provided)
RELAY_PARTNER_SOURCE=supersafe
RELAY_API_BASE_URL=https://api.relay.link

# Bebop Partner Configuration (hardcoded in feeConfig.js)
# Fee receiver address and BPS configured in src/background/utils/feeConfig.js
```

**Access in Code:**
- **Background**: Full access via `process.env.VARIABLE_NAME`
- **Frontend**: Must request via stream messages (security restriction)

**⚠️ Security Notes:**
- Never commit `.env` file to version control
- Add `.env` to `.gitignore`
- Use different API keys for development and production
- Rotate API keys periodically

### Configuration Files

**AllowList** (`public/assets/allowlist.json`):
```json
{
  "version": "1.0.0",
  "policies": {
    "https://velodrome.finance": {
      "name": "Velodrome Finance",
      "supportedChains": [10, 5330, 8453, 42161],
      "defaultChain": 10,
      "autoApprove": false,
      "framework": "web3-react"
    },
    "https://app.uniswap.org": {
      "name": "Uniswap",
      "supportedChains": [1, 10, 56, 8453, 42161],
      "defaultChain": 1,
      "autoApprove": false,
      "framework": "web3-react"
    }
  }
}
```

**Configuration Notes:**
- Supported chains should include all active networks where dApp operates
- `defaultChain` sets initial network when dApp connects
- `autoApprove` controls automatic connection approval
- `framework` helps with framework-specific optimizations

**Fee Configuration** (`src/background/utils/feeConfig.js`):
```javascript
const FEE_CONFIG = {
  feeBps: 100,  // 1%
  partnerInfo: {
    receiverAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  }
};
```

### Network Endpoints

**Production RPC URLs** (`src/background/config/networkConfig.js`):

```javascript
NETWORKS = {
  superseed: {
    rpcUrl: "https://mainnet.superseed.xyz",
    chainId: 5330
  },
  ethereum: {
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ETHEREUM_API_KEY}`,
    chainId: 1
  },
  optimism: {
    rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_OPTIMISM_API_KEY}`,
    chainId: 10
  },
  base: {
    rpcUrl: "https://mainnet.base.org",
    chainId: 8453
  },
  bsc: {
    rpcUrl: "https://bsc-dataseed.binance.org",
    chainId: 56
  },
  arbitrum: {
    rpcUrl: "https://arbitrum-one-rpc.publicnode.com",
    chainId: 42161
  },
  shardeum: {
    rpcUrl: "https://dapps.shardeum.org",
    chainId: 8118
  }
}
```

**⚠️ Important:** 
- Update Alchemy API keys (`ALCHEMY_ETHEREUM_API_KEY`, `ALCHEMY_OPTIMISM_API_KEY`) in environment variables before production release
- Verify all RPC endpoints are accessible and functional
- Test network switching across all 8 active networks

---

## Related Documentation

- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development setup
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [SECURITY.md](./SECURITY.md) - Security considerations

---

