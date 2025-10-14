---
sidebar_position: 3
---

# 🔑 Importing an Existing Wallet

Import your existing wallet into SuperSafe using your private key or recovery phrase.

## Import Methods

SuperSafe supports importing wallets through:

- **Private Key**: Direct import using wallet private key
- **Recovery Phrase**: Import using 12-word seed phrase
- **Multiple Wallets**: Import multiple wallets into one vault

## Prerequisites

### What You'll Need
- **Private Key** or **Recovery Phrase** from your existing wallet
- **SuperSafe Wallet** installed and running
- **Vault Password** (if importing into existing vault)
- **Secure Environment** for handling sensitive information

### Security Considerations
- **Private Key Safety**: Never share your private key with anyone
- **Recovery Phrase**: Keep your seed phrase secure and offline
- **Environment**: Ensure you're in a private, secure location
- **Verification**: Double-check the private key or phrase before importing

## Method 1: Import via Private Key

### Step 1: Access Import Function

1. **Open SuperSafe**
   - Click the SuperSafe icon in your browser toolbar
   - If you have an existing vault, unlock it first

2. **Navigate to Import**
   - Go to **Settings** → **Wallets**
   - Click **"Add New Wallet"**
   - Select **"Import Existing Wallet"**

### Step 2: Enter Private Key

1. **Private Key Input**
   ```
   Format: 0x followed by 64 hexadecimal characters
   Example: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
   ```

2. **Paste Your Key**
   - Paste your private key into the input field
   - SuperSafe will validate the format
   - Ensure no extra spaces or characters

3. **Verify Address**
   - SuperSafe will show the corresponding wallet address
   - Verify this matches your expected address
   - **Important**: Double-check the address before proceeding

### Step 3: Customize Wallet

1. **Wallet Name**
   - Enter a custom name (e.g., "Imported Main Wallet")
   - Choose a descriptive name for easy identification

2. **Wallet Emoji**
   - Select an emoji to represent your wallet
   - Helps distinguish between multiple wallets

3. **Confirm Import**
   - Review all details
   - Click **"Import Wallet"** to complete

### Step 4: Import Complete

1. **Success Confirmation**
   - Wallet successfully imported
   - New wallet appears in your wallet list
   - Address matches your original wallet

2. **Verify Import**
   - Check that the address is correct
   - Verify you can see your wallet in the list
   - Test by switching to the imported wallet

## Method 2: Import via Recovery Phrase

### Step 1: Access Seed Import

1. **Open Import Options**
   - Go to **Settings** → **Wallets**
   - Click **"Add New Wallet"**
   - Select **"Import from Recovery Phrase"**

### Step 2: Enter Recovery Phrase

1. **Phrase Input**
   ```
   Format: 12 words separated by spaces
   Example: abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
   ```

2. **Enter Your Phrase**
   - Type or paste your 12-word recovery phrase
   - Ensure correct spelling and order
   - Use spaces to separate words

3. **Validation**
   - SuperSafe validates the phrase format
   - Checks for valid BIP39 words
   - Verifies phrase integrity

### Step 3: Generate Wallet

1. **Derivation Path**
   - SuperSafe uses standard BIP44 derivation path
   - Path: `m/44'/60'/0'/0/0` (Ethereum standard)
   - This generates the same address as other wallets

2. **Address Generation**
   - Wallet address is generated from the phrase
   - Verify the address matches your original wallet
   - **Critical**: Ensure address is correct before proceeding

### Step 4: Complete Import

1. **Wallet Customization**
   - Set custom name and emoji
   - Choose descriptive identifiers

2. **Final Confirmation**
   - Review all details
   - Confirm the address is correct
   - Complete the import process

## Multi-Wallet Management

### Adding Multiple Wallets

SuperSafe supports multiple wallets in one vault:

1. **Import Additional Wallets**
   - Repeat import process for each wallet
   - Each wallet gets its own name and emoji
   - All wallets share the same vault password

2. **Wallet Organization**
   - Use descriptive names (e.g., "Trading Wallet", "Savings")
   - Choose different emojis for easy identification
   - Organize by purpose or network

### Switching Between Wallets

1. **Wallet Selector**
   - Click wallet name in the top bar
   - Select from dropdown list
   - Current wallet is highlighted

2. **Quick Switch**
   - Use keyboard shortcuts if available
   - Recent wallets shown first
   - Easy access to all imported wallets

## Security Best Practices

### Private Key Security

- **Never Share**: Private keys should never be shared
- **Secure Storage**: Store private keys in secure, offline locations
- **No Screenshots**: Never take screenshots of private keys
- **Clean Clipboard**: Clear clipboard after pasting private keys

### Recovery Phrase Security

- **Physical Storage**: Write recovery phrases on paper
- **Multiple Copies**: Store in multiple secure locations
- **No Digital Storage**: Never store in cloud or digital files
- **Test Recovery**: Practice recovery process before needing it

### Import Security

- **Verify Address**: Always verify the generated address
- **Clean Environment**: Ensure no malware or keyloggers
- **Secure Network**: Use secure, private network connection
- **Immediate Backup**: Backup your vault immediately after import

## Troubleshooting

### Common Import Issues

#### Invalid Private Key
- **Format Check**: Ensure key starts with 0x and is 64 characters
- **Character Check**: Only hexadecimal characters (0-9, a-f)
- **Length Check**: Exactly 64 characters after 0x
- **Copy Issues**: Check for extra spaces or characters

#### Invalid Recovery Phrase
- **Word Count**: Ensure exactly 12 words
- **Spelling**: Check spelling of each word
- **Order**: Verify words are in correct order
- **BIP39 Words**: Ensure all words are valid BIP39 words

#### Address Mismatch
- **Double Check**: Verify private key or phrase is correct
- **Derivation Path**: Ensure using standard Ethereum path
- **Original Wallet**: Check derivation path in original wallet
- **Network**: Verify you're on the correct network

#### Import Failed
- **Vault Unlocked**: Ensure vault is unlocked
- **Permissions**: Check browser extension permissions
- **Storage Space**: Ensure sufficient disk space
- **Try Again**: Clean input and try again

### Recovery Options

#### If Import Fails
1. **Verify Input**: Double-check private key or phrase
2. **Clean Input**: Remove extra spaces or characters
3. **Try Different Method**: Use private key instead of phrase
4. **Check Original**: Verify with original wallet

#### If Address Doesn't Match
1. **Verify Source**: Check private key/phrase in original wallet
2. **Derivation Path**: Confirm derivation path matches
3. **Network**: Ensure you're on the correct network
4. **Contact Support**: If issue persists, contact support

## Verification Steps

### After Import

1. **Address Verification**
   - Confirm address matches original wallet
   - Check address in multiple places
   - Verify checksum is correct

2. **Balance Check**
   - Check token balances match
   - Verify transaction history
   - Test small transaction if possible

3. **Functionality Test**
   - Test sending small amount
   - Verify receiving works
   - Check all features work correctly

## Next Steps

After successfully importing your wallet:

1. **[Learn Navigation](../using-supersafe/navigation.md)** - Master the SuperSafe interface
2. **[Manage Your Wallets](../using-supersafe/wallet-management.md)** - Organize multiple wallets
3. **[Send and Receive](../using-supersafe/sending-receiving.md)** - Start using your imported wallet
4. **[Connect to dApps](../connecting-dapps/connecting.md)** - Use your wallet with dApps

## Security Reminder

🔒 **Critical Security Notes:**

- Your private keys are encrypted and stored locally
- SuperSafe never transmits private keys over the network
- Always verify the generated address matches your original
- Keep your recovery phrase and private keys secure
- Test with small amounts before large transactions

---

**Ready to start using your wallet?** Continue to [Navigating the Extension](../using-supersafe/navigation.md)!
