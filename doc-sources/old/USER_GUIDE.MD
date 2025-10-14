# User Guide - SuperSafe Chrome Extension

## Index
1.  [Introduction](#introduction)
2.  [Installation and Setup](#installation-and-setup)
    *   [Installing SuperSafe](#installing-supersafe)
    *   [Creating a New Wallet](#creating-a-new-wallet)
    *   [Importing an Existing Wallet](#importing-an-existing-wallet)
3.  [Navigating the Extension](#navigating-the-extension)
4.  [Wallet Management](#wallet-management)
    *   [Viewing Account Details](#viewing-account-details)
    *   [Switching Between Wallets/Accounts](#switching-between-walletsaccounts)
    *   [Editing Wallet/Account Name](#editing-walletaccount-name)
    *   [Deleting a Wallet](#deleting-a-wallet)
5.  [Interacting with DApps (Decentralized Applications)](#interacting-with-dapps-decentralized-applications)
    *   [How DApp Connection Works (EIP-6963)](#how-dapp-connection-works-eip-6963)
    *   [Connecting to a DApp](#connecting-to-a-dapp)
    *   [Approving Transactions from DApps](#approving-transactions-from-dapps)
    *   [Viewing Connected DApps](#viewing-connected-dapps)
    *   [Disconnecting from a DApp](#disconnecting-from-a-dapp)
6.  [Sending and Receiving Funds](#sending-and-receiving-funds)
    *   [Sending ETH and Tokens](#sending-eth-and-tokens)
    *   [Receiving Funds](#receiving-funds)
7.  [Token Management](#token-management)
    *   [Viewing Your Tokens](#viewing-your-tokens)
    *   [Adding Custom Tokens](#adding-custom-tokens)
    *   [Removing Custom Tokens](#removing-custom-tokens)
8.  [Security Best Practices](#security-best-practices)
    *   [Password Protection](#password-protection)
    *   [Seed Phrase Backup & Security](#seed-phrase-backup--security)
    *   [Interacting Safely with DApps](#interacting-safely-with-dapps)
9.  [Settings and Customization](#settings-and-customization)
    *   [Security Settings](#security-settings)
    *   [Network Configuration](#network-configuration)
    *   [Manage Connected Sites](#manage-connected-sites)
10. [Troubleshooting](#troubleshooting)
11. [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)

## 1. Introduction

Welcome to SuperSafe! SuperSafe is a secure, non-custodial cryptocurrency wallet that runs as a Chrome browser extension. It allows you to manage your digital assets, interact seamlessly with Decentralized Applications (DApps) on various compatible blockchains (like Ethereum), and maintain control over your private keys.

### Main Features

*   **Browser Extension**: Easy access directly from your Chrome browser.
*   **Multi-Wallet/Account Management**: Manage multiple accounts or wallets within the extension.
*   **DApp Interaction (EIP-6963 Support)**: Discover and connect to EIP-6963 compatible DApps effortlessly and securely.
*   **Send & Receive Crypto**: Transact with ETH and various tokens.
*   **Token Management**: View and add custom tokens.
*   **User-Controlled Security**: Your private keys are encrypted and stored locally, protected by your password. You are in full control.
*   **Clear Transaction Previews**: Understand what you are signing before approving any DApp transaction.

## 2. Installation and Setup

### Installing SuperSafe

1.  **Open Chrome Browser**: Ensure you are using Google Chrome.
2.  **Visit Chrome Web Store**: Go to the official SuperSafe page on the Chrome Web Store (link to be provided upon release).
3.  **Add to Chrome**: Click "Add to Chrome" and then "Add extension" in the confirmation dialog.
4.  **Pin the Extension**: After installation, click the puzzle piece icon (Extensions) in your Chrome toolbar and pin SuperSafe for easy access.

### Creating a New Wallet

1.  **Open SuperSafe**: Click the SuperSafe icon in your Chrome toolbar.
2.  **Welcome Screen**: You'll see the welcome screen. Click **"Create New Wallet"**.
3.  **Set Password**: Choose a strong password to protect your wallet. This password will be required to unlock your wallet and confirm transactions.
4.  **Secure Your Seed Phrase**:
    *   SuperSafe will generate a unique 12-word seed phrase (also known as a recovery phrase or mnemonic).
    *   **CRITICAL!** Write this phrase down on paper in the correct order. Store it in multiple secure, offline locations. This phrase is the ONLY way to recover your wallet if you forget your password or lose access to your computer.
    *   **Never share your seed phrase with anyone. SuperSafe support will never ask for it.**
5.  **Confirm Seed Phrase**: You will be asked to confirm your seed phrase to ensure you have saved it correctly.
6.  **Done!** Your first account in your new wallet is ready.

### Importing an Existing Wallet

1.  **Open SuperSafe**: Click the SuperSafe icon.
2.  **Welcome Screen**: Click **"Import Wallet"**.
3.  **Enter Seed Phrase**: Carefully type your 12-word seed phrase.
4.  **Set Password**: Choose a strong password for this imported wallet.
5.  **Done!** Your wallet and its accounts will be imported.

## 3. Navigating the Extension

When you click the SuperSafe icon in your Chrome toolbar, the extension popup will appear. This is your main interface for interacting with your wallet.

*   **Main View**: Shows your selected account's balance, address, and recent activity.
*   **Navigation Menu**: Typically found at the bottom or via a hamburger icon, allowing access to Send, Receive, DApps, Settings, etc.
*   **Account Switcher**: Allows you to switch between different accounts or wallets you manage.
*   **Network Indicator**: Shows the currently selected blockchain network.

## 4. Wallet Management

### Viewing Account Details

Your main account view will display:
*   Account name
*   Public address (can be copied)
*   ETH balance
*   Token balances
*   Transaction history

### Switching Between Wallets/Accounts

1.  Click on the current account name or avatar at the top of the popup.
2.  A list of your available accounts/wallets will appear.
3.  Select the account you wish to use. The view will update to reflect the selected account.

### Editing Wallet/Account Name

1.  Navigate to **Settings** within the extension popup.
2.  Look for a "Wallet Management" or "Accounts" section.
3.  Select the account you want to edit.
4.  You should find an option to change the name (alias) of the account.

### Deleting a Wallet

1.  Navigate to **Settings** > **Wallet Management** (or similar).
2.  Select the wallet you wish to remove from the extension.
3.  Follow the prompts to delete. You may need to enter your password.
4.  **Note**: This only removes the wallet from your SuperSafe extension. It does NOT delete the wallet or its addresses from the blockchain. You can always re-import it later using your seed phrase.

## 5. Interacting with DApps (Decentralized Applications)

SuperSafe makes it easy to connect to web-based DApps that support Ethereum and other compatible networks.

### How DApp Connection Works (EIP-6963)

SuperSafe utilizes EIP-6963, a standard for DApps to discover multiple wallet providers installed in a user's browser.
1.  When you visit a DApp, it can announce its presence and request a wallet connection.
2.  SuperSafe (and other EIP-6963 compatible wallets) will respond.
3.  The DApp will then typically display a list of available wallets, including SuperSafe, allowing you to choose which one to connect with.

### Connecting to a DApp

1.  **Visit a DApp**: Navigate to the DApp's website.
2.  **Initiate Connection**: Click the DApp's "Connect Wallet" button.
3.  **Choose SuperSafe**: If the DApp shows a list of wallets (due to EIP-6963), select SuperSafe.
4.  **SuperSafe Connection Prompt**: The SuperSafe extension popup will appear (or you may need to click the icon) displaying a connection request from the DApp. It will show:
    *   The DApp's website (origin) requesting connection.
    *   The account(s) SuperSafe will share (you can often select which account if you have multiple).
5.  **Select Account & Approve**: Choose the account you want to use with the DApp and click **"Connect"** or **"Approve"**.
6.  **Connected**: The DApp will now show your connected account address.

### Approving Transactions from DApps

When a DApp wants you to perform an on-chain action (e.g., mint an NFT, swap tokens, sign a message):
1.  The DApp will trigger a transaction request.
2.  The SuperSafe popup will appear, showing:
    *   The DApp requesting the signature.
    *   Details of the transaction: recipient, amount, gas fees, data to be signed.
    *   **Review Carefully!** Ensure the details match what you expect.
3.  **Confirm or Reject**:
    *   Click **"Confirm"** or **"Sign"** (you might need to enter your password).
    *   Click **"Reject"** if you don't want to proceed.

### Viewing Connected DApps

1.  Open SuperSafe and go to **Settings**.
2.  Look for a section like **"Connected Sites"** or **"DApp Permissions"**.
3.  This list will show all DApps currently authorized to interact with your wallet.

### Disconnecting from a DApp

**From SuperSafe:**
1.  Go to **Settings** > **Connected Sites**.
2.  Find the DApp you want to disconnect.
3.  Click the "Disconnect" or trash can icon next to it.

**From the DApp:**
1.  Most DApps have a "Disconnect" or "Log Out" button. Clicking this should sever the connection.
2.  Some DApps may also trigger a disconnect message to SuperSafe, which will update its internal list of connected sites.

If you switch to a different wallet/account within SuperSafe that was not the one connected to a DApp, SuperSafe may automatically disconnect DApps connected to the previous wallet/account to prevent unintended interactions.

## 6. Sending and Receiving Funds

### Sending ETH and Tokens

1.  **Open SuperSafe**: Click the extension icon.
2.  **Click "Send"**: This option is usually on the main screen or in the navigation menu.
3.  **Select Asset**: Choose ETH or the specific token you want to send.
4.  **Recipient Address**: Enter the recipient's public address carefully. Double-check it!
5.  **Amount**: Enter the amount to send.
6.  **Review Transaction**: Check the address, amount, and estimated gas fees.
7.  **Confirm**: Click **"Send"** or **"Confirm"**. You may need to enter your password.

### Receiving Funds

1.  **Open SuperSafe**.
2.  **Click "Receive"** or navigate to your main account view.
3.  **Copy Your Address**: Your public address for the selected account will be displayed, often with a QR code.
4.  **Share**: Share this address with the sender. They can send funds to this address.
5.  Funds will appear in your wallet once the transaction is confirmed on the blockchain.

## 7. Token Management

### Viewing Your Tokens

On the main account view, you'll see a list of your tokens and their balances.

### Adding Custom Tokens

If a token isn't automatically displayed:
1.  Open SuperSafe and go to the **Tokens** section (often under "Assets" or in Settings).
2.  Click **"Add Token"** or **"Import Token"**.
3.  You'll typically need the **Token Contract Address**, **Symbol**, and **Decimals**. This information can usually be found on a block explorer like Etherscan or the token's official project website.
4.  Enter the details and click **"Add"** or **"Save"**. The token will appear if you have a balance.

### Removing Custom Tokens

1.  Go to the **Tokens** list.
2.  Select the token you want to remove (this usually just hides it from your list, it doesn't affect your actual balance on the blockchain).
3.  Look for a "Remove" or "Hide" option.

## 8. Security Best Practices

### Password Protection

*   Your SuperSafe wallet is protected by the password you set.
*   This password is required to unlock the extension, approve transactions, and access sensitive settings.
*   Choose a strong, unique password.

### Seed Phrase Backup & Security

*   **Your Seed Phrase is Your Master Key**: Treat it with the utmost care.
*   **Offline Storage**: Store handwritten copies in multiple, secure, private, physical locations.
*   **Never Digital**: Avoid storing your seed phrase digitally (e.g., in emails, photos, cloud storage, password managers).
*   **No Sharing**: Never share your seed phrase with anyone, including anyone claiming to be SuperSafe support.
*   If you lose your seed phrase and password, you may lose access to your funds permanently.

### Interacting Safely with DApps

*   **Verify DApp URLs**: Always double-check you are on the correct, official DApp website. Phishing sites are common.
*   **Review Permissions**: Understand what permissions you grant when connecting to a DApp.
*   **Scrutinize Transactions**: Carefully review all transaction details (amount, recipient, function being called, gas fees) in the SuperSafe confirmation window before signing.
*   **Disconnect When Done**: Disconnect from DApps when you are finished using them.
*   **Beware of Scams**: If an offer from a DApp seems too good to be true, it probably is.

## 9. Settings and Customization

Access settings via the gear icon or menu in the SuperSafe popup.

### Security Settings

*   **Change Password**: Update your wallet password.
*   **Auto-Lock Timer**: Configure how long before the wallet automatically locks due to inactivity.
*   **Lock on Browser Close**: Option to lock the wallet when Chrome closes.
*   **Reveal Seed Phrase**: Securely view your seed phrase (requires password). Use this only for backup verification in a safe environment.

### Network Configuration

*   SuperSafe will typically show the network a connected DApp is using.
*   You can often switch between supported networks (e.g., Ethereum Mainnet, Testnets) if needed for development or specific DApps. This option is usually visible on the main screen or in settings.

### Manage Connected Sites

*   View and manage DApps that are currently connected or have been previously connected (see Section 5.3).

## 10. Troubleshooting

*   **SuperSafe Popup Doesn't Open**:
    *   Ensure Chrome is updated.
    *   Try restarting Chrome.
    *   Check for conflicting extensions (especially other wallet extensions). Try disabling them temporarily.
*   **DApp Doesn't Detect SuperSafe**:
    *   Ensure SuperSafe is unlocked.
    *   Refresh the DApp page.
    *   Ensure the DApp supports EIP-6963 or specifically SuperSafe.
    *   Check if another wallet extension is taking precedence. You might need to manage which extension is active for a site in your browser settings or the other wallet's settings.
*   **Transactions Pending or Failed**:
    *   Check a block explorer (e.g., Etherscan for Ethereum) for the transaction status using its hash.
    *   Network congestion can cause delays. You might need to wait or try with a higher gas fee (if SuperSafe allows adjustment).
*   **Incorrect Balance**:
    *   Ensure you are on the correct network and account.
    *   Try refreshing the extension or restarting Chrome.
    *   The RPC node SuperSafe uses might be temporarily out of sync; this usually resolves itself.

## 11. Frequently Asked Questions (FAQ)

**Is SuperSafe a custodial wallet?**
No, SuperSafe is non-custodial. You have full control over your private keys and seed phrase. SuperSafe developers cannot access your funds.

**How does EIP-6963 benefit me?**
EIP-6963 allows DApps to discover all compatible wallets you have installed, giving you a clear choice of which wallet to use for a particular DApp, rather than wallets potentially conflicting or one overriding another.

**What if I forget my password?**
If you forget your SuperSafe password, you will need to use your 12-word seed phrase to restore your wallet. Click "Import Wallet" on the startup screen and enter your seed phrase. You will then set a new password.

**Can I use SuperSafe on multiple computers?**
Yes. Install SuperSafe on another computer and import your wallet using your seed phrase.

**What happens if I lose my seed phrase?**
Losing your seed phrase can mean losing access to your funds if you also forget your password or lose access to your current installation. **Protect your seed phrase diligently.**

**Is SuperSafe free to use?**
Yes, SuperSafe is free to install and use. Standard blockchain network fees (gas fees) will apply to transactions you make.

**How do I know if a DApp is safe to connect to?**
Do your own research (DYOR) on any DApp. Check community reviews, project legitimacy, and always be cautious. SuperSafe provides transaction clarity, but the ultimate decision to interact is yours.

**Where is my data stored?**
Your encrypted private keys and wallet data are stored locally on your computer through `chrome.storage.local`, which is private to the SuperSafe extension. 