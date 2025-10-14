---
sidebar_position: 1
---

# 📥 Installation

Get started with SuperSafe Wallet by installing the Chrome extension and setting up your browser environment.

## System Requirements

### Browser Compatibility
- **Chrome**: Version 88+ (recommended)
- **Brave**: Version 1.20+ (Chrome-based)
- **Edge**: Version 88+ (Chromium-based)

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 50MB free space for extension
- **Internet**: Stable connection for blockchain interactions

## Installation Methods

### Method 1: Chrome Web Store (Recommended)

**Coming Soon!** SuperSafe Wallet will be available on the Chrome Web Store for easy installation.

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "SuperSafe Wallet"
3. Click **Add to Chrome**
4. Confirm installation in the popup dialog
5. The SuperSafe icon will appear in your browser toolbar

### Method 2: Developer Installation

For developers or early adopters, you can install the extension manually:

#### Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: For cloning the repository

#### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/SuperSafeWallet/SuperSafe.git
cd SuperSafe

# 2. Install dependencies
npm install

# 3. Build the extension
npm run build

# 4. Load in Chrome
# - Open chrome://extensions/
# - Enable "Developer mode" (toggle in top right)
# - Click "Load unpacked"
# - Select the 'dist/' folder from the SuperSafe directory
```

## Installation Verification

### Check Extension Status

1. **Open Extensions Page**
   - Navigate to `chrome://extensions/`
   - Look for "SuperSafe Wallet" in the list

2. **Verify Installation**
   - Extension should show as "Enabled"
   - No error messages should be displayed
   - SuperSafe icon should appear in browser toolbar

3. **Test Basic Functionality**
   - Click the SuperSafe icon in toolbar
   - Extension popup should open
   - You should see the welcome screen

### Troubleshooting Installation

#### Extension Not Loading
- **Check Developer Mode**: Ensure "Developer mode" is enabled in `chrome://extensions/`
- **Verify Build**: Run `npm run build` again to ensure clean build
- **Check Console**: Look for error messages in browser console

#### Permission Issues
- **Allow Extensions**: Ensure your browser allows extension installation
- **Admin Rights**: On Windows, run browser as administrator if needed
- **Antivirus**: Check if antivirus software is blocking the extension

#### Build Errors
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

## Post-Installation Setup

### First Launch
1. **Click SuperSafe Icon**: Open the extension popup
2. **Welcome Screen**: You'll see the SuperSafe welcome interface
3. **Create or Import**: Choose to create a new wallet or import an existing one
4. **Set Password**: Create a strong password for your vault (minimum 8 characters)

### Security Setup
- **Strong Password**: Use a unique, complex password
- **Backup Phrase**: Save your recovery phrase in a secure location
- **Auto-Lock**: Configure auto-lock timeout (default: 15 minutes)

## Browser Permissions

SuperSafe Wallet requires the following permissions:

### Required Permissions
- **Storage**: Store encrypted wallet data locally
- **Tabs**: Inject provider for dApp connections
- **Active Tab**: Access current tab for dApp interactions
- **Background**: Run service worker for wallet operations

### Optional Permissions
- **Notifications**: Show transaction confirmations (can be disabled)
- **Alarms**: Manage auto-lock timers

## Network Configuration

### Default Networks
SuperSafe comes pre-configured with:

- **SuperSeed** (Chain ID: 5330)
  - RPC: `https://mainnet.superseed.xyz`
  - Explorer: `https://explorer.superseed.xyz`
  - Swap Support: Bebop JAM

- **Optimism** (Chain ID: 10)
  - RPC: Alchemy endpoint
  - Explorer: `https://optimistic.etherscan.io`
  - Swap Support: Bebop JAM + RFQ

### Additional Networks
Five more networks are planned for future releases:
- Ethereum (Chain ID: 1)
- Base (Chain ID: 8453)
- BSC (Chain ID: 56)
- Ethereum Sepolia (Chain ID: 11155111)
- SuperSeed Sepolia (Chain ID: 53302)

## Next Steps

After successful installation:

1. **[Create Your First Wallet](./creating-wallet.md)** - Set up a new wallet
2. **[Import Existing Wallet](./importing-wallet.md)** - Import from private key
3. **[Learn the Interface](../using-supersafe/navigation.md)** - Navigate the extension
4. **[Connect to dApps](../connecting-dapps/connecting.md)** - Start using with dApps

## Support

### Getting Help
- **Documentation**: Browse this comprehensive guide
- **GitHub Issues**: [Report bugs or request features](https://github.com/SuperSafeWallet/SuperSafe/issues)
- **Community**: Join our Discord for community support

### Common Issues
- **Extension not loading**: Check developer mode and rebuild
- **Permission denied**: Run browser as administrator
- **Build failures**: Clean install with `npm run clean && npm install`

---

**Ready to create your wallet?** Continue to [Creating a New Wallet](./creating-wallet.md) to get started!
