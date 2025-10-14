---
sidebar_position: 2
---

# ✨ Creating a New Wallet

Learn how to create your first SuperSafe wallet with enterprise-grade security and multi-wallet support.

## Before You Begin

### Prerequisites
- SuperSafe Wallet installed and running
- Strong password ready (minimum 8 characters)
- Secure location to store recovery information

### Security Considerations
- **Password Strength**: Use a unique, complex password
- **Recovery Phrase**: Store your seed phrase in a secure, offline location
- **Backup Strategy**: Consider multiple backup methods
- **Environment**: Ensure you're in a private, secure environment

## Step-by-Step Wallet Creation

### Step 1: Launch SuperSafe

1. **Open Extension**
   - Click the SuperSafe icon in your browser toolbar
   - The extension popup will open

2. **Welcome Screen**
   - You'll see the SuperSafe welcome interface
   - Click **"Create New Wallet"** or **"Get Started"**

### Step 2: Set Up Your Vault

1. **Create Password**
   ```
   Password Requirements:
   - Minimum 8 characters
   - Mix of letters, numbers, and symbols
   - Avoid common words or patterns
   - Don't reuse passwords from other services
   ```

2. **Confirm Password**
   - Re-enter your password to confirm
   - Ensure both entries match exactly

3. **Password Strength Indicator**
   - SuperSafe will show password strength
   - Aim for "Strong" or "Very Strong" rating

### Step 3: Generate Recovery Phrase

1. **Seed Phrase Generation**
   - SuperSafe generates a 12-word recovery phrase
   - This phrase is cryptographically secure
   - **Never share this phrase with anyone**

2. **Write Down Your Phrase**
   ```
   Important: Write down your recovery phrase in this exact order:
   
   1. word1
   2. word2
   3. word3
   ... (continue for all 12 words)
   
   Store this in a secure, offline location.
   ```

3. **Verify Your Phrase**
   - SuperSafe will ask you to confirm random words
   - This ensures you've written it down correctly
   - Complete the verification to proceed

### Step 4: Complete Setup

1. **Vault Creation**
   - Your encrypted vault is created using AES-256-GCM encryption
   - Private keys are double-encrypted within the vault
   - Vault is stored locally on your device

2. **First Wallet Generated**
   - Your first wallet address is created
   - You can customize the wallet name and emoji
   - Default name: "Wallet 1"

3. **Setup Complete**
   - You'll see your wallet dashboard
   - Ready to start using SuperSafe!

## Wallet Customization

### Naming Your Wallet

1. **Access Settings**
   - Click the settings icon in the popup
   - Navigate to "Wallets" section

2. **Edit Wallet Details**
   - Click on your wallet name
   - Enter a custom name (e.g., "My Main Wallet")
   - Choose an emoji to represent your wallet
   - Save changes

### Adding More Wallets

SuperSafe supports multiple wallets in one vault:

1. **Create Additional Wallet**
   - Go to Settings → Wallets
   - Click "Add New Wallet"
   - Choose "Create New" or "Import Existing"

2. **Wallet Management**
   - Switch between wallets easily
   - Each wallet has its own address
   - All wallets share the same vault password

## Security Features

### Vault Encryption

Your wallet uses **enterprise-grade encryption**:

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Derivation**: PBKDF2 with 10,000 iterations
- **Salt**: 32-byte random salt per vault
- **Authentication**: Built-in authentication prevents tampering

### Auto-Lock Protection

- **Default Timeout**: 15 minutes of inactivity
- **Configurable**: Adjust in Settings → Security
- **Memory Security**: Private keys cleared from memory when locked
- **Session Persistence**: UI state preserved across locks

### Recovery Options

#### If You Remember Your Password
- Simply unlock with your password
- All wallets and settings restored

#### If You Forget Your Password
- **Recovery Phrase**: Use your 12-word seed phrase
- **Import Process**: Create new vault and import wallets
- **Previous Vault**: Cannot be recovered (by design for security)

## First-Time Usage

### Check Your Wallet

1. **View Address**
   - Your wallet address is displayed in the dashboard
   - Copy address for receiving funds
   - Share QR code for easy receiving

2. **Network Selection**
   - Default network: SuperSeed (Chain ID: 5330)
   - Switch to Optimism or other networks as needed
   - Each network shows different token balances

### Receive Your First Funds

1. **Copy Address**
   - Click the address to copy it
   - Share with sender or exchange

2. **QR Code**
   - Click QR icon to show QR code
   - Scan with mobile wallet for easy transfer

3. **Check Balance**
   - Funds will appear after network confirmation
   - Refresh if needed

## Best Practices

### Password Security
- **Unique Password**: Never reuse passwords
- **Password Manager**: Consider using a password manager
- **Regular Updates**: Change password periodically
- **No Sharing**: Never share your password

### Recovery Phrase Security
- **Physical Backup**: Write on paper, store safely
- **Multiple Copies**: Consider multiple secure locations
- **No Digital Storage**: Never store in cloud or digital files
- **Test Recovery**: Practice recovery process before needing it

### Wallet Management
- **Regular Backups**: Export wallet data periodically
- **Multiple Wallets**: Use different wallets for different purposes
- **Test Transactions**: Try small amounts first
- **Stay Updated**: Keep extension updated

## Troubleshooting

### Common Issues

#### Wallet Not Creating
- **Check Password**: Ensure password meets requirements
- **Browser Issues**: Try refreshing or restarting browser
- **Storage Space**: Ensure sufficient disk space
- **Permissions**: Check browser extension permissions

#### Recovery Phrase Issues
- **Word Order**: Ensure words are in exact order
- **Spelling**: Double-check spelling of each word
- **Case Sensitivity**: Words are case-sensitive
- **Complete Phrase**: All 12 words are required

#### Vault Creation Failed
- **Clean Install**: Try uninstalling and reinstalling
- **Clear Data**: Clear browser data and try again
- **Different Browser**: Try Chrome or Brave
- **Check Logs**: Look for error messages in console

## Next Steps

After creating your wallet:

1. **[Import Additional Wallets](./importing-wallet.md)** - Add more wallets to your vault
2. **[Learn Navigation](../using-supersafe/navigation.md)** - Master the interface
3. **[Send Your First Transaction](../using-supersafe/sending-receiving.md)** - Start using your wallet
4. **[Connect to dApps](../connecting-dapps/connecting.md)** - Interact with decentralized applications

## Security Reminder

🔒 **Important Security Notes:**

- Your private keys are encrypted and stored locally
- SuperSafe never has access to your funds
- Always verify you're on the correct website
- Never share your recovery phrase or password
- Keep your software updated

---

**Ready to import an existing wallet?** Continue to [Importing an Existing Wallet](./importing-wallet.md)!
