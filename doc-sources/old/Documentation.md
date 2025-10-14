# SuperSafe - Technical Documentation

## Index
1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Main Components](#main-components)
5. [Contexts and State Management](#contexts-and-state-management)
6. [Security](#security)
7. [Networks and Configuration](#networks-and-configuration)
8. [Storage](#storage)
9. [Key Features](#key-features)
10. [Development Guide](#development-guide)
11. [Deployment](#deployment)
12. [DApp Communication Flow (EIP-6963)](#dapp-communication-flow-eip-6963)

## Introduction

SuperSafe is a **Chrome Extension digital wallet** that allows users to manage their digital assets on the SuperSeed blockchain and interact securely with decentralized applications (dApps). The extension offers functionalities such as managing multiple wallets, connecting to dApps via EIP-6963, sending and receiving tokens, transaction management, and robust security features.

### Main Technologies & Concepts

- React.js: Frontend framework for the popup and UI components (v18.2.0)
- Ethers.js: Library for blockchain interaction (v5.7.2)
- TailwindCSS: CSS framework for interface design (v3.3.3)
- Vite: Build and development tool for the React app (v4.4.5)
- Web Crypto API: Native API for secure cryptographic operations
- **Chrome Extension APIs**: For background processes, storage, and communication.
- **Manifest V3**: Chrome Extension manifest version.
- **Background Script (`background.js`)**: Handles core logic, state, and communication.
- **Content Script (`content-script.js`)**: Injected into web pages to bridge communication between dApps and the extension.
- **Injected Provider Script (`provider.js`)**: Implements EIP-1193 and EIP-6963, injected into dApps by the content script.
- **EIP-6963**: Standard for discovering multiple injected browser wallet providers.
- **EIP-1193**: Ethereum Provider JavaScript API.

## Architecture

SuperSafe utilizes a modular architecture appropriate for a Chrome Extension. It combines a React-based UI for the popup with background and content scripts for core wallet functionality and dApp interaction.

### Core Components and Flow:

1.  **User Interface (Popup)**: Built with React (`App.jsx`, `main.jsx`), managed by Vite. Handles user interactions, wallet management, settings, and displaying connection/transaction prompts.
2.  **Background Script (`background.js`)**: The persistent brain of the extension. Manages:
    *   Wallet creation, storage, and encryption.
    *   Network configurations and RPC interactions.
    *   State of connected dApps (`connectedSites`).
    *   Pending dApp requests (`pendingConnectionRequest`).
    *   Communication with the popup and content scripts via `chrome.runtime.sendMessage` and `chrome.runtime.onMessage`.
    *   Opening popup windows for dApp requests.
3.  **Content Script (`content-script.js`)**: Injected into visited web pages (dApps). Acts as a bridge:
    *   Injects the `provider.js` into the page's `window` context.
    *   Listens for messages from the dApp (via `window.postMessage` from `provider.js`).
    *   Forwards these messages to `background.js`.
    *   Receives responses from `background.js` and posts them back to `provider.js`.
    *   Handles EIP-6963 `announceProvider` events.
4.  **Injected Provider Script (`provider.js`)**: Runs in the dApp's JavaScript context.
    *   Announces itself via EIP-6963 `eip6963:announceProvider`.
    *   Implements the EIP-1193 API (`request`, event listeners like `accountsChanged`, `chainChanged`).
    *   Communicates with `content-script.js` via `window.postMessage` to send requests to the extension's background.

### Architecture Diagram (Conceptual)

```
+----------------------------------------------------+
|                    dApp (Web Page)                 |
| +------------------------------------------------+ |
| |         window.ethereum (via provider.js)      | | <--- EIP-1193 / EIP-6963
| +-----------------------^------------------------+ |
|                         | window.postMessage       |
+-------------------------|--------------------------+
                          v
+----------------------------------------------------+
|      SuperSafe Content Script (content-script.js)  | -- Injected into dApp page
|           (Listens/Posts window.postMessage)       |
|                         | chrome.runtime.sendMessage |
+-------------------------|--------------------------+
                          v
+----------------------------------------------------+
|        SuperSafe Background (background.js)        | -- Persistent Extension Core
|  (Manages Wallets, Networks, Connected Sites, RPC) |
|                         | chrome.runtime.sendMessage |
+-------------------------|--------------------------+
                          v
+----------------------------------------------------+
|          SuperSafe Popup UI (React App)            |
| (Dashboard, Settings, ConnectionRequestScreen etc.)|
| +------------------------------------------------+ |
| |                WalletProvider                  | | <-- Global React State
| +------------------------------------------------+ |
+----------------------------------------------------+
```

## Project Structure

```
SuperSafe/
├── dist/                     # Compiled files for the extension & React app
├── public/                   # Static assets (icons, manifest.json)
│   └── manifest.json         # Chrome Extension Manifest V3
├── src/                      # Source code
│   ├── components/           # React UI components for the popup
│   ├── contexts/             # React Context providers (e.g., WalletProvider)
│   ├── styles/               # CSS and global styles
│   ├── utils/                # Utility functions (crypto, storage, networks)
│   ├── App.jsx               # Root React component for the popup UI
│   ├── index.css             # Global styles for React app
│   ├── main.jsx              # Entry point for the React popup app
│   ├── background.js         # Extension background script
│   ├── content-script.js     # Extension content script
│   ├── provider.js           # EIP-1193 provider script injected into dApps
├── index.html                # HTML template for the React popup
├── package.json              # Project dependencies and scripts
├── tailwind.config.js        # TailwindCSS configuration
├── postcss.config.js         # PostCSS configuration
└── vite.config.js            # Vite configuration (for React app build)
```

## Main Components

### App.jsx
Root component that handles the main navigation between Dashboard, Settings, and the add wallet form. It also manages the display of the `ConnectionRequestScreen` when a dApp interaction is pending.

### Dashboard.jsx
Main panel displaying current wallet information, balances, and available actions. Integrates with other components such as BalanceList, TransactionsList, and EcosystemGrid. It also shows a list of connected sites and allows disconnection.

### Settings.jsx
Component to manage configurations like security, wallet options (including switching active wallet), custom tokens, and network selection.

### AddWalletForm.jsx
Form to create or import a new wallet using a seed phrase or private key.

### SendTokenForm.jsx
Component to send tokens to other addresses, with validation and transaction confirmation. (This component might be part of a broader transaction flow initiated by dApps or user actions).

### BalanceList.jsx
Displays available token balances in the current wallet.

### TransactionsList.jsx
List of historical transactions with filtering and sorting.

### NetworkSwitcher.jsx
Selector to switch between different networks (mainnet, sepolia). The active network is managed by `WalletProvider`.

### WalletManager.jsx
Component to manage multiple wallets, including profile editing and deletion. Part of `Settings.jsx`.

### ConnectionRequestScreen.jsx (NEW)
Displayed within the popup when a dApp initiates a connection request (`eth_requestAccounts`) or other actions requiring user approval (e.g., `eth_sendTransaction` - future). Allows the user to:
- See which dApp (`origin`) is requesting connection.
- Select which account to connect if multiple accounts exist in the current wallet.
- View balances (ETH and $SUPR) of the selected account on the current network.
- Approve or Reject the connection request.
- If approved, it updates the global active wallet if the selected account belongs to a different wallet than the current global one.

## Contexts and State Management

### WalletProvider (`src/contexts/WalletProvider.jsx`)
Provides the global state and functions for the React popup UI. Key responsibilities include:
- Wallet management (add, remove, update, encrypt/decrypt, set active wallet).
- Network and token management (select network, manage custom tokens, fetch balances).
- Transaction functions (send ETH and tokens - primarily user-initiated from UI).
- Security mechanisms (lock, unlock, password management).
- Configuration persistence (via `localStorage` for popup settings).
- Communication with `background.js` for actions that require background processing or affect global extension state (e.g., notifying about wallet switches for dApp disconnections, fetching connected sites).

```jsx
// Example of context usage in components
const { wallets, currentWallet, network, sendETH, connectedSites, refreshConnectedSites, setCurrentWalletIndex } = useWallet();
```

### Main States (managed by `WalletProvider`):
- `wallets`: List of user wallets (encrypted private keys, addresses, names).
- `currentWalletIndex`: Index of the active wallet in the `wallets` array.
- `network` (previously `networkKey`): Object representing the current network (e.g., `{ key: 'mainnet', name: 'SuperSeed Mainnet', ... }`).
- `isLocked`: Application lock state for the popup UI.
- `securityToggles`: Security configurations (e.g., auto-lock timeout).
- `connectedSites`: Object mapping dApp origins to their connected accounts and permissions. Fetched from `background.js`.
- `isLoading`: General loading state for async operations in the popup.

### Background Script State (`background.js`):
While not a React context, `background.js` maintains critical persistent state using `chrome.storage.local`:
- **Wallets & Encryption Keys**: Manages the master encryption key derived from the user's password and uses it to encrypt/decrypt wallets stored in `chrome.storage.local` (this part needs to be harmonized with `WalletProvider`'s direct `localStorage` use for wallets if they are not already).
- **`connectedSites`**: Stores which dApps are connected to which accounts (`CONNECTED_SITES_KEY`). This is the source of truth for dApp connections.
- **`pendingConnectionRequest`**: Stores details of a dApp request awaiting user action in the popup (`PENDING_REQUEST_KEY`). Includes `origin`, `method`, `payload`.
- **`activeAddress`**: The most recently approved/used address from a connection flow (`ACTIVE_ADDRESS_KEY`).
- **User Password Hash**: For unlocking the extension.

## Security

SuperSafe implements multiple security layers to protect user assets:

### Private Key Encryption
- Algorithm: AES-GCM (industry standard).
- Key derivation: PBKDF2 with a high number of iterations (e.g., 100,000 or more) from the user's master password to derive the encryption key.
- Private keys are never stored in plain text. They are encrypted before being saved to `localStorage` (via `WalletProvider`) or `chrome.storage.local` (via `background.js`). **Note: Consistency in storage and encryption strategy between popup and background is critical.**

### Password Protection
- Master password used to encrypt/decrypt wallet data and unlock the extension.
- Password hashing (e.g., PBKDF2) used if storing a verifier for the password itself (though often the pattern is to derive keys and not store the password hash directly if not needed for re-validation without decryption attempt).

### Configurable Security Options
- Automatic lock after a configurable period of inactivity (e.g., 5 minutes).
- Lock on browser close or when the popup is closed (configurable or default behavior).
- Transaction confirmation prompts from dApps.
- Balance hiding option.

### dApp Interaction Security
- **Permissions per Origin**: dApps are granted access only to the specific account(s) the user approves for that dApp's origin.
- **Clear Prompts**: Connection and transaction requests from dApps clearly display the origin and the requested action/data.
- **EIP-6963**: Securely announces the provider without polluting the global namespace excessively or causing conflicts.
- **Message Validation**: Communication between content script, background, and provider uses `chrome.runtime.sendMessage` and `window.postMessage` with origin checks where applicable.

### Additional Measures
- Validation of all user inputs (addresses, amounts).
- Protection against duplicate wallet import attempts.
- Verification of address formats and private key integrity on import.

## Networks and Configuration

SuperSafe supports multiple blockchain networks:

### Available Networks
1. **SuperSeed Mainnet**
   - ChainID: `5330` (Decimal), `0x14D2` (Hex)
   - Currency: ETH (or native network token)
   - RPC URL: `https://mainnet.superseed.xyz`
   - Explorer: `https://explorer.superseed.xyz`

2. **SuperSeed Sepolia (Testnet)**
   - ChainID: `53302` (Decimal), `0xD036` (Hex)
   - Currency: ETH (or native network token)
   - RPC URL: `https://sepolia.superseed.xyz`
   - Explorer: `https://sepolia-explorer.superseed.xyz`

### Preconfigured Tokens
- $SUPR (SuperSafe Token) is pre-configured. Address is network-dependent, defined in `src/utils/networks.js`.
- Support for adding custom ERC-20 tokens by users.

## Storage

SuperSafe uses a combination of `chrome.storage.local` (managed by `background.js` for core extension data) and `localStorage` (managed by `WalletProvider.jsx` in the popup for UI state and some wallet data).

### `chrome.storage.local` (Background Script - Primary Persistent Storage)
- **Encrypted Wallets**: List of wallets, with private keys encrypted using a key derived from the user's master password. (Key: `WALLETS_KEY` - assumed, needs to be consistent).
- **User Password Hash/Verifier**: For unlocking the extension. (Key: `PASSWORD_HASH_KEY` - assumed).
- **Connected Sites**: Object mapping dApp origins to approved accounts (`CONNECTED_SITES_KEY`).
- **Pending dApp Request**: Details of the current request awaiting user confirmation in the popup (`PENDING_REQUEST_KEY`).
- **Active Address**: The last address selected by the user during a connection flow (`ACTIVE_ADDRESS_KEY`).
- **Network Settings**: Currently selected network key.
- **Security Settings**: User-defined security preferences (e.g., auto-lock timeout).

### `localStorage` (Popup UI - React App - `WalletProvider`)
- **Cached Wallets**: May hold a decrypted version of `currentWallet` in memory for UI purposes while unlocked. Encryption/decryption handled by `WalletProvider` using password-derived key.
- **UI Settings**: Preferences like theme (if implemented), visibility toggles.
- **Cached `currentWalletIndex`**: To remember the last active wallet in the UI.
- **Cached `networkKey`**: To remember the last selected network in the UI.
- **Custom Tokens**: User-added custom token configurations.
**Note**: It is critical to ensure that sensitive data like unencrypted private keys are never written to `localStorage` and that there's a clear strategy for how `WalletProvider` (popup) syncs with or relies on `chrome.storage.local` (background) as the source of truth for wallets and core settings. The background script should be the primary owner of sensitive data persistence.

### Storage Mechanisms (Conceptual - actual functions in `background.js` and `WalletProvider`)
- `background.js`:
    - `saveDataToChromeStorage(key, value)`
    - `loadDataFromChromeStorage(key)`
- `WalletProvider.jsx` (for its `localStorage` usage):
    - `saveWalletsToLocalStorage(encryptedWallets)`
    - `loadWalletsFromLocalStorage()`
    - `saveSettingToLocalStorage(key, value)`
    - `loadSettingFromLocalStorage(key)`

## Key Features

### Wallet Management
- Creation of new wallets (generates seed phrase).
- Import via seed phrase (mnemonic).
- Import via private key.
- Customization (alias, profile image - future placeholder for image).
- Support for multiple wallets within the extension.
- Setting a specific wallet as the globally active one.
- Secure encryption of private keys at rest.

### Transactions (User-Initiated from Popup)
- Sending native network currency (e.g., ETH on SuperSeed).
- Sending ERC-20 tokens.
- Transaction history visualization (placeholder, needs implementation).
- Transaction confirmation with password (if enabled).

### Token Management
- Token balance visualization for default (ETH, $SUPR) and custom tokens.
- Addition of custom ERC-20 tokens by providing contract address.
- Automatic detection of token symbol and decimals (best-effort).

### dApp Connectivity & Interaction (EIP-6963 & EIP-1193)
- **EIP-6963 Provider Discovery**: Announces SuperSafe to dApps, allowing users to choose SuperSafe from a list of available wallets.
- **Secure dApp Connection**: Handles `eth_requestAccounts` to establish a connection between a dApp and a user-selected account.
- **Account Selection**: Users can select which account to expose to a dApp if their active wallet has multiple accounts.
- **Origin-Based Permissions**: Connection permissions are granted on a per-dApp (origin) basis.
- **Display dApp Info**: Shows the requesting dApp's origin/URL during connection prompts.
- **Standard RPC Method Support**: Aims to support common EIP-1193 methods (e.g., `eth_accounts`, `eth_chainId`, `eth_sendTransaction`, signing methods - with user confirmation popups for sensitive operations).
- **`accountsChanged` Events**: Notifies connected dApps when the approved account changes or is disconnected.
- **`chainChanged` Events**: Notifies connected dApps when the user switches networks in the extension.
- **User-Initiated Disconnection (from Extension)**: Allows users to disconnect any dApp from the extension's UI (Dashboard).
- **dApp-Initiated Disconnection**: Supports dApps programmatically disconnecting via a `window.postMessage` (`SUPERSAFE_DAPP_WANTS_TO_DISCONNECT`).
- **Automatic dApp Disconnection on Global Wallet Switch**: If a dApp is connected and the user changes the globally active wallet in SuperSafe Settings, affected dApps are automatically disconnected (receive `accountsChanged` with `[]`).
- **Global Active Wallet Update on Connection**: If a user approves a connection from a specific account in the popup, and that account belongs to a wallet that isn't the current global active wallet, the global active wallet is switched.

### User Interface
- Responsive design with TailwindCSS for the popup.
- Light/dark themes (dark theme implemented, light theme as future option).
- Loading indicators for asynchronous operations.
- Clear error messages and user feedback.
- Intuitive navigation for managing wallets, settings, and connections.

### Security
- Master password protection.
- Encryption of sensitive data (private keys).
- Configurable auto-lock.
- Secure handling of dApp connection requests and transaction/signature confirmations.

## Development Guide

### Prerequisites
- Node.js v16 or higher
- npm v7 or higher
- Google Chrome (or any Chromium-based browser that supports extensions)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/SuperSafe.git # Replace with actual repo URL

# Install dependencies
cd SuperSafe
npm install
```

### Main Commands
```bash
# Start development server (for the React popup UI with HMR)
npm run dev

# Build the React popup app and copy all extension files to dist/
npm run build

# Preview the production build of the React popup (useful for checking the UI bundle)
npm run preview
```

### Working with the Chrome Extension

1.  **Build the Extension**: Run `npm run build`. This command, typically configured in `vite.config.js` and `package.json`, will compile the React app (popup) and copy all necessary files (manifest.json, background.js, content-script.js, provider.js, icons, HTML files) into the `dist/` directory.

2.  **Load Unpacked Extension in Chrome**:
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable "Developer mode" (usually a toggle in the top right corner).
    *   Click on "Load unpacked".
    *   Select the `dist/` directory from your SuperSafe project.
    *   The SuperSafe extension icon should appear in your browser's toolbar.

3.  **Debugging**:
    *   **Popup UI**: Right-click on the SuperSafe extension icon in the toolbar, then click "Inspect popup". This opens DevTools for the popup's React application.
    *   **Background Script (`background.js`)**: On the `chrome://extensions` page, find the SuperSafe extension card and click the link for "service worker" (or "background page" in some older contexts). This opens DevTools specifically for the background script.
    *   **Content Script (`content-script.js`)**: Open DevTools on any webpage where your content script is injected (e.g., your test dApp). Your content script logs will appear in that page's console, and you can find the script under the "Sources" tab -> "Content scripts".
    *   **Provider Script (`provider.js`)**: Debugged similarly to the content script, as it runs in the context of the dApp page. Look for its logs in the dApp page's console.

4.  **Reloading the Extension**:
    *   After making changes to `background.js`, `manifest.json`, or sometimes other core files, you'll need to reload the extension. On `chrome://extensions`, click the refresh icon on the SuperSafe card.
    *   For UI changes in the popup with `npm run dev` (HMR), the popup should update automatically. If not, closing and reopening the popup usually reflects changes.
    *   Content scripts might require a refresh of the dApp page they are injected into.

### Component Structure Example (React components in `src/components/`)
```jsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletProvider'; // Access global state
// import other_utils or components...

const MyComponent = () => {
  const { currentWallet, network } = useWallet();
  const [internalState, setInternalState] = useState(null);

  useEffect(() => {
    // Effects for fetching data or reacting to prop changes
  }, [currentWallet, network]);

  return (
    <div>
      {/* JSX for the component */}
    </div>
  );
};

export default MyComponent;
```

## Deployment

Once the extension is thoroughly tested and ready for distribution:

1.  **Final Build**: Ensure you have the correct version number in `manifest.json` and `package.json`.
    Run the production build command:
    ```bash
    npm run build
    ```
    This will generate the final, optimized files in the `dist/` directory.

2.  **Manual Packaging for Distribution (e.g., for testing or direct sharing)**:
    *   Navigate to the `dist/` directory in your file explorer.
    *   Select all files and subdirectories within `dist/`.
    *   Create a ZIP archive from these selected files. Name it appropriately, e.g., `supersafe_vX.Y.Z.zip`.
    *   This ZIP file can then be shared. Users would typically need to enable developer mode in `chrome://extensions` and drag-and-drop this ZIP file onto the page to install it (or Chrome might require them to unzip it first and use "Load unpacked").

3.  **Publishing to Chrome Web Store**:
    *   If you plan to publish on the Chrome Web Store, you will need a Google Developer account.
    *   Go to the Chrome Web Store Developer Dashboard.
    *   Choose "Add new item".
    *   Upload the ZIP file created in the previous step.
    *   Fill in all the required store listing information (description, icons, screenshots, privacy policy, etc.).
    *   Submit for review. Google will review your extension before it becomes publicly available.
    *   Refer to the official Chrome Web Store documentation for detailed steps and policies.

## DApp Communication Flow (EIP-6963)

SuperSafe Wallet leverages EIP-6963 for dApp provider discovery and EIP-1193 for communication. The following outlines the typical sequence of events and message flow when a dApp connects to SuperSafe and requests accounts.

### Overall Flow Diagram
(Refer to the conceptual diagram in the [Architecture](#architecture) section for a visual overview of the components involved.)

### Detailed Steps for `eth_requestAccounts`:

1.  **Provider Injection & Discovery**:
    *   When a dApp page loads, SuperSafe's `content-script.js` injects `provider.js` into the dApp's JavaScript context (the `window` object).
    *   The dApp, if compliant with EIP-6963, dispatches a `window.dispatchEvent(new Event('eip6963:requestProvider'))` event.
    *   SuperSafe's `provider.js` (or `content-script.js` acting as intermediary) listens for this and responds by dispatching an `eip6963:announceProvider` event. This event contains SuperSafe's `info` (UUID, name, icon, rdns) and its EIP-1193 compliant `provider` object.
    *   The dApp collects these announced providers and can then offer SuperSafe as a connection option to the user.

2.  **dApp Initiates Connection (`eth_requestAccounts`)**:
    *   The user selects SuperSafe in the dApp, and the dApp calls `selectedProvider.request({ method: 'eth_requestAccounts' })` using the provider object obtained from the EIP-6963 announcement.

3.  **Provider to Content Script (`provider.js` -> `content-script.js`)**:
    *   `provider.js`, running in the dApp's context, receives the `eth_requestAccounts` call.
    *   It constructs a message (e.g., `{ type: 'SUPERSAFE_FORWARD_TO_BACKGROUND', payload: { method: 'eth_requestAccounts', params: [], origin: window.location.origin } }`).
    *   It sends this message to `content-script.js` using `window.postMessage(message, window.location.origin)`.

4.  **Content Script to Background Script (`content-script.js` -> `background.js`)**:
    *   `content-script.js` has an event listener for `window.addEventListener('message', ...)`. It receives the message from `provider.js`.
    *   It validates the message source and type.
    *   It then forwards the `payload` of the message to `background.js` using `chrome.runtime.sendMessage(payload, callback)`. The `origin` from the payload is crucial here for `background.js` to identify the requesting dApp.

5.  **Background Script Processing (`background.js`)**:
    *   `background.js` has a listener `chrome.runtime.onMessage.addListener(...)`.
    *   It receives the request (e.g., `{ type: 'SUPERSAFE_REQUEST_ACCOUNTS', origin: 'dapp-origin.com', ... }` - assuming `provider.js` or `content-script.js` set the correct type for background processing, based on the original `eth_requestAccounts` method).
    *   It checks if a popup is already open for this request or if another request is pending for this origin. If not:
        *   It stores the request details (origin, method, any specific parameters) in `chrome.storage.local` under a `PENDING_REQUEST_KEY`.
        *   It opens the extension popup window using `chrome.windows.create({ url: 'index.html', type: 'popup', ... })`, potentially passing the origin or a request ID as a URL parameter to the popup (e.g., `index.html?origin=dapp-origin.com&requestType=connect`).

6.  **Popup Initialization & Request Display (`App.jsx`, `ConnectionRequestScreen.jsx`)**:
    *   The popup UI (`App.jsx`) loads.
    *   It checks its URL parameters (if any) to determine if it was opened for a dApp request.
    *   It sends a message to `background.js` (e.g., `{ type: 'POPUP_GET_PENDING_REQUEST' }`) to retrieve the details of the pending connection request associated with its context (e.g., based on origin passed in URL or a general fetch).
    *   `background.js` responds with the stored `pendingConnectionRequest` data.
    *   `App.jsx` receives these details and renders `ConnectionRequestScreen.jsx`, passing the origin, current wallets, network info, etc.
    *   `ConnectionRequestScreen.jsx` displays the dApp's origin, allows the user to select an account from the current wallet, shows balances, and presents "Approve" / "Reject" buttons.

7.  **User Action and Popup to Background (`ConnectionRequestScreen.jsx` -> `App.jsx` -> `background.js`)**:
    *   The user clicks "Approve" (or "Reject").
    *   `ConnectionRequestScreen.jsx` (via `WalletProvider`) constructs a response message (e.g., `{ type: 'APPROVE_CONNECTION', payload: { origin: 'dapp-origin.com', selectedAccount: '0x...', rememberMe: true } }`).
    *   This message is sent to `background.js`.

8.  **Background Script Finalizes Connection (`background.js`)**:
    *   `background.js` receives the approval/rejection message.
    *   If approved:
        *   It saves the `selectedAccount` to the `connectedSites` object in `chrome.storage.local` for the given `origin`.
        *   It might update the `ACTIVE_ADDRESS_KEY` and potentially the global active wallet index if the selected account belongs to a different wallet.
        *   It clears the `pendingConnectionRequest` from `chrome.storage.local`.
        *   It formulates a success response (e.g., `{ accounts: ['0x...'] }`).
    *   If rejected:
        *   It clears the `pendingConnectionRequest`.
        *   It formulates an error response (e.g., `{ error: { code: 4001, message: 'User rejected request' } }`).
    *   `background.js` then sends this success/error response back to the callback function provided by `content-script.js` in step 4.

9.  **Background to Content Script to Provider (`background.js` -> `content-script.js` -> `provider.js`)**:
    *   The callback in `content-script.js` receives the response from `background.js`.
    *   `content-script.js` posts this response back to `provider.js` using `window.postMessage({ type: 'SUPERSAFE_BACKGROUND_RESPONSE', requestId: ..., payload: response }, dAppOrigin)`.

10. **Provider Resolves Promise to dApp (`provider.js` -> dApp)**:
    *   `provider.js` receives the response message from `content-script.js`.
    *   It matches the `requestId` (if used) and resolves or rejects the original Promise that was returned to the dApp from the `provider.request({ method: 'eth_requestAccounts' })` call.
    *   The dApp receives the accounts array (e.g., `['0x...']`) or an error.

11. **Provider Emits `accountsChanged` (`provider.js` -> dApp)**:
    *   If the connection was successful and new accounts are available, `provider.js` should also emit an `accountsChanged` event with the new array of accounts: `provider.emit('accountsChanged', ['0x...'])`.
    *   It may also emit a `connect` event: `provider.emit('connect', { chainId: currentChainId })`.

This detailed flow ensures secure, isolated communication between the dApp and the SuperSafe extension, with the user having full control over approvals.

---
This integration guide will be updated as SuperSafe Wallet evolves. For the most current information, please refer to the official SuperSafe documentation channels. 