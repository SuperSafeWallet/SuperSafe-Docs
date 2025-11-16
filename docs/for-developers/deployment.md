---
sidebar_position: 6
---

# 🚀 Deployment

SuperSafe Wallet deployment guide for Chrome Web Store submission and production releases.

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
- [ ] Test token transfers (native and ERC20)
- [ ] Test swap functionality (Bebop JAM/RFQ)
- [ ] Test cross-chain swaps (Relay.link)
- [ ] Test network switching (all 7 active networks)

### Security Checks

- [ ] No hardcoded API keys or secrets
- [ ] Environment variables properly configured
- [ ] AllowList properly configured (`public/assets/allowlist.json`)
- [ ] Fee receiver address verified (Bebop partner fees)
- [ ] RPC endpoints functional (all 7 active networks)
- [ ] External API endpoints accessible
- [ ] Content Security Policy (CSP) properly configured
- [ ] Logger system eliminates sensitive data in production builds

### Post-Release

- [ ] Monitor Chrome Web Store reviews
- [ ] Check error reporting (if implemented)
- [ ] Monitor user feedback
- [ ] Prepare hotfix plan if critical issues found

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.0+  
**Maintenance:** Review after major deployment changes

