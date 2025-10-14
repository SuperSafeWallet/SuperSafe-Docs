# SuperSafe Wallet - Deployment Guide

**Created:** October 13, 2025  
**Version:** 3.0.0+  
**Status:** ✅ CURRENT

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

# Create distribution package
npm run zip
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
   # Create zip file
   npm run zip
   
   # Upload supersafe-to-chromes-store.zip to dashboard
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
npm run zip

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
- Multi-network support (2 active: SuperSeed & Optimism)
- Bebop swap integration with partner fees
- WalletConnect v2 support

### Changed
- Complete architecture refactor
- New unified vault system
- Stream-based communication

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
- [ ] Extension loads in Chrome without errors
- [ ] Test on fresh profile (no previous wallet data)
- [ ] Test wallet creation flow
- [ ] Test wallet import flow
- [ ] Test dApp connection (at least 2 dApps)
- [ ] Test token transfers
- [ ] Test swap functionality
- [ ] Test network switching
- [ ] Test WalletConnect connection

### Security Checks

- [ ] No hardcoded API keys or secrets
- [ ] AllowList properly configured
- [ ] Fee receiver address verified
- [ ] RPC endpoints functional
- [ ] External API endpoints accessible

### Post-Release

- [ ] Monitor Chrome Web Store reviews
- [ ] Check error reporting (if implemented)
- [ ] Monitor user feedback
- [ ] Prepare hotfix plan if critical issues found

---

## Production Configuration

### Environment Variables

**Not used in current version** - All configuration is hardcoded or in config files.

**If implementing env vars:**

```javascript
// .env.production
VITE_API_ENDPOINT=https://api.supersafe.xyz
VITE_BEBOP_PARTNER_ID=supersafe
```

### Configuration Files

**AllowList** (`public/assets/allowlist.json`):
```json
{
  "version": "1.0.0",
  "policies": {
    "https://velodrome.finance": {
      "name": "Velodrome Finance",
      "supportedChains": [10, 5330]
    }
  }
}
```

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

**Production RPC URLs:**
```javascript
NETWORKS = {
  superseed: {
    rpcUrl: "https://mainnet.superseed.xyz"
  },
  optimism: {
    rpcUrl: "https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY"
  }
}
```

**⚠️ Important:** Update Alchemy API keys before production release.

---

## Related Documentation

- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development setup
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [SECURITY.md](./SECURITY.md) - Security considerations

---

**Document Status:** ✅ Current as of October 13, 2025  
**Code Version:** v3.0.0+

