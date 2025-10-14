# Security Documentation - SuperSafe

## Index
1. [Security Overview](#security-overview)
2. [Security Architecture](#security-architecture)
3. [Key Encryption](#key-encryption)
4. [Password Management](#password-management)
5. [Authentication and Authorization](#authentication-and-authorization)
6. [Security Configurations](#security-configurations)
7. [Threat Mitigation](#threat-mitigation)
8. [Best Practices for Users](#best-practices-for-users)
9. [Vulnerability Reporting](#vulnerability-reporting)

## Security Overview

SuperSafe implements a multi-level security model designed to protect users' private keys and ensure the integrity of cryptocurrency operations. As a **Chrome browser extension**, it operates within the browser's security sandbox but also faces unique challenges related to the web environment and interactions with Decentralized Applications (DApps). The application uses modern cryptographic standards and follows industry best practices to safeguard digital assets.

### Security Principles

1. **User Custody**: Private keys remain under the exclusive control of the user, stored locally and encrypted.
2. **End-to-End Encryption**: All sensitive keys and data are encrypted locally within the extension's storage.
3. **Zero Knowledge**: The application and its developers cannot access user keys without their password.
4. **Defense in Depth**: Multiple security layers operate simultaneously, including browser-enforced isolation and internal extension security measures.
5. **Secure DApp Interaction**: Standardized and transparent communication (EIP-6963) with DApps to minimize risks.

## Security Architecture

SuperSafe uses a client-centered security architecture where all critical operations are performed locally in the user's browser via its different components:

```
+---------------------------------------+
| User's Browser (Chrome)               |
+---------------------------------------+
|  +-----------------+  +-------------+  |
|  | SuperSafe Popup |  | Content     |<-----> DApp (Website)
|  | (UI, User Inter.)|  | Script (JS) |  |
|  +-------^---------+  +------^------+  |
|          |                   |          |
|  +-------v-------------------v------+  |
|  | SuperSafe Background Script    |  |
|  | (Core Logic, State, Storage,   |  |
|  |  Crypto, DApp Communication)   |  |
|  +--------------------------------+  |
|  | Chrome Storage (Encrypted Data)|  |
|  +--------------------------------+  |
+---------------------------------------+
```

### Security Components

1.  **Popup (`popup.html`, `App.jsx`):** Handles user interface, displays information, and captures user input (e.g., password, transaction approval). Runs in its own sandboxed process.
2.  **Background Script (`background.js`):** The core of the extension. Manages state, handles cryptographic operations, interacts with `chrome.storage.local`, orchestrates communication between popup and content scripts, and manages DApp connections (EIP-6963). It has a longer lifecycle than other components.
3.  **Content Scripts (`content-script.js`):** Injected into web pages (DApps) to facilitate communication between the DApp and the extension (e.g., announcing the provider via EIP-6963, relaying messages). Operates in the context of the web page but with some isolation.
4.  **Encryption Module (`src/utils/crypto.js`):** Handles all cryptographic operations (key derivation, encryption, decryption).
5.  **Secure Storage (`chrome.storage.local`):** Manages secure data persistence for sensitive information like encrypted private keys, settings, and connected DApp details. Data stored here is isolated to the extension.
6.  **Password Manager**: Implements password validation, hashing, and unlocking mechanisms for the wallet.
7.  **Transaction Verifier**: Ensures all transaction details are clearly presented to the user for confirmation before signing.
8.  **DApp Connector (EIP-6963 implementation):** Manages discovery of and secure communication with DApps, ensuring the user explicitly approves connections.

## Key Encryption

SuperSafe uses modern encryption algorithms to protect private keys:

### Encryption Process

1. **Algorithm**: AES-GCM (Advanced Encryption Standard in Galois/Counter Mode)
2. **Key Size**: 256 bits
3. **Initialization Vector (IV)**: Randomly generated for each operation
4. **Key Derivation**: PBKDF2 with 100,000 iterations and SHA-256

### Technical Implementation

```javascript
// Simplified code for the encryption process
const encryptPrivateKey = async (privateKey, password) => {
  // Generate random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Derive key from password
  const key = await deriveKey(password);
  
  // Encrypt the private key
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(privateKey)
  );
  
  // Combine IV and encrypted data
  const result = combineIVAndData(iv, encryptedBuffer);
  
  // Encode in Base64
  return btoa(result);
};
```

### Decryption Process

The decryption process reverses these operations, requiring the user's password to obtain the private key. Without the correct password, the private key cannot be recovered.

## Password Management

SuperSafe implements a robust password management system:

### Password Storage

1. **Hash Method**: PBKDF2 with 210,000 iterations (for password hash used to unlock the wallet)
2. **Hash Algorithm**: SHA-256
3. **Salt**: Randomly generated for each password (16 bytes)
4. **Storage**: Only the password hash is stored in `chrome.storage.local`, never the plaintext password.

### Password Verification

```javascript
// Simplified code for password verification
const verifyPassword = async (password, storedHash) => {
  // Extract stored salt and hash
  const { salt, hash } = extractSaltAndHash(storedHash);
  
  // Derive hash with the same salt
  const computedHash = await pbkdf2(password, salt, 210000, 'SHA-256');
  
  // Comparison resistant to timing attacks
  return timingSafeEqual(computedHash, hash);
};
```

### Password Policies

- Minimum length: 3 characters (recommended: 12+)
- No limitation on special characters
- No password history stored

## Authentication and Authorization

SuperSafe implements a local authentication model:

### Unlock Process

1. The user enters their password
2. The password is verified against the stored hash
3. If correct, the application is unlocked
4. Private keys are decrypted as needed for specific operations

### Authentication States

- **Locked**: Restricted access to all critical operations. The popup will prompt for a password.
- **Unlocked**: Access to viewing operations and initiating transactions. Private keys are decrypted in memory only when needed for signing and are not persisted in decrypted form.
- **Transaction in Progress**: Additional user confirmation (potentially password re-entry, depending on settings) for critical operations like signing transactions.
- **DApp Connection Approval**: User must explicitly approve connecting SuperSafe to a DApp. The DApp only gains access to the selected address, not private keys.

## Security Configurations

SuperSafe allows customizing the following security configurations:

### Configurable Options

1. **Automatic Lock**: Locks the application after 5 minutes of inactivity
2. **Lock on Exit**: Locks the application when the window/tab is closed
3. **Transaction Confirmation**: Requires password for each transaction
4. **Hide Balances**: Hides balance values in the interface
5. **Request Password on Open**: Requires unlocking when starting the application

### Default Values

```javascript
const defaultSecurityToggles = {
  lockOnExit: true,
  confirmTransactions: true,
  hideBalances: false,
  requestPasswordOnOpen: true,
  autoLockAfter5Min: true
};
```

## Threat Mitigation

SuperSafe implements measures to mitigate the following threats:

### Against Brute Force Attacks

- Computationally intensive key derivation for both password hashing (PBKDF2 with 210,000 iterations) and private key encryption (PBKDF2 with 100,000 iterations).
- Temporary lockout after multiple failed password attempts (planned feature).

### Against Phishing Attacks

- **Extension Source Verification**: Users are advised to install SuperSafe only from the official Chrome Web Store.
- **DApp Domain Verification**: While SuperSafe facilitates connection, users should always verify the URL of the DApp they are interacting with. EIP-6963 helps by allowing DApps to discover trusted wallet providers, reducing the risk of connecting to spoofed wallet interfaces.
- **Clear Connection Prompts**: SuperSafe clearly displays which DApp (origin) is requesting a connection.
- **No External Key/Seed Requests**: SuperSafe will never ask for private keys or seed phrases through email or any channel outside the extension itself.

### Against Malware

- **Browser Sandboxing**: Extensions operate within the browser's security model, offering some level of isolation from other processes on the user's system.
- **Limited Permissions**: SuperSafe requests only necessary permissions during installation.
- **Validation of Destination Addresses**: Users are prompted to confirm transaction details, including the destination address, before signing.
- **QR Code Option for Verification**: Can help reduce errors in address input.
- **Risk of System-Level Malware**: Sophisticated malware on the user's computer could potentially compromise browser security. Keeping the OS and browser updated is crucial.
- **Risk of Malicious Extensions**: Other installed browser extensions with excessive permissions could potentially interfere or attempt to steal data. Users should be cautious about installed extensions.

### Against XSS (Cross-Site Scripting) Attacks

- **Extension Isolation**: SuperSafe's popup and background script run in their own contexts, separate from web pages.
- **Content Script Isolation**: Content scripts operate in the context of the DApp's page but have limited access to the extension's core functions. Communication is strictly managed via `chrome.runtime.sendMessage`.
- **Input Sanitization**: Where applicable, inputs are sanitized (though most user input is for passwords or within controlled UI elements).
- **DApp Vulnerabilities**: SuperSafe cannot protect against XSS vulnerabilities within the DApps themselves. However, it ensures that any data received from a DApp via content scripts is treated as untrusted and handled carefully by the background script. The primary risk is a DApp tricking a user into signing a malicious transaction, which SuperSafe mitigates via clear transaction previews.

### Against Malicious DApps

- **Explicit Connection Approval**: Users must approve every new DApp connection.
- **Scoped Access**: DApps are only granted access to the address(es) the user explicitly shares, not the private keys.
- **Clear Transaction Signing Prompts**: SuperSafe displays all transaction parameters (amount, recipient, data, gas fees) for user review and confirmation before signing. This is critical to prevent DApps from tricking users into signing unintended actions.
- **No Direct Private Key Access for DApps**: DApps can request a signature for a transaction, but the signing itself happens within SuperSafe, after user confirmation.

### Against Compromised Content Scripts

- **Principle of Least Privilege**: Content scripts have limited capabilities and cannot directly access sensitive functions or data (like private keys) within the background script.
- **Structured Messaging**: All communication between content scripts and the background script uses well-defined messages. The background script validates requests.
- **Limited Trust**: The background script treats messages from content scripts with caution, as the content script's environment (the DApp's page) is less controlled.

## Best Practices for Users

Recommendations for users:

1.  **Strong Passwords**: Use unique and complex passwords for SuperSafe.
2.  **Seed Phrase Backup**: Store seed phrases in multiple secure, offline locations. Never store them digitally or in cloud services.
3.  **Address Verification**: Always meticulously verify destination addresses before sending funds or signing transactions.
4.  **Software Updates**: Keep the Chrome browser, operating system, and the SuperSafe extension itself updated to the latest versions.
5.  **URL Verification**: Always check that the URL of any DApp is correct before connecting your wallet or interacting with it. Bookmark trusted DApps.
6.  **Extension Vigilance**:
    *   Install extensions only from the official Chrome Web Store or trusted developer sources.
    *   Regularly review the permissions of all installed extensions.
    *   Be wary of extensions requesting overly broad permissions.
7.  **DApp Caution**:
    *   Understand the permissions you grant to DApps.
    *   Carefully review all transaction details before approving them in SuperSafe.
    *   If a DApp seems suspicious, disconnect from it via SuperSafe's settings.
8.  **Avoid Public Computers**: Do not use SuperSafe or access your crypto wallets on public or untrusted computers.

## Vulnerability Reporting

If you discover a security vulnerability in SuperSafe:

1. **Do Not Disclose Publicly**: Avoid disclosing the vulnerability in public forums
2. **Contact the Team**: Send an email to security@supersafe.xyz with the details
3. **Provide Details**: Include steps to reproduce, potential impact, and possible mitigation

SuperSafe follows a responsible disclosure process and commits to:
- Confirming receipt within 48 hours
- Providing periodic updates on progress
- Giving credit to discoverers (if desired)
- Resolving vulnerabilities as quickly as possible 