# SuperSafe Wallet dApp Integration Guide

This guide outlines how decentralized applications (dApps) can integrate with SuperSafe Wallet. SuperSafe Wallet prioritizes the **EIP-6963** standard for provider discovery and connection, ensuring robust compatibility and coexistence with other browser wallets.

## 1. Core Integration: EIP-6963 Provider Discovery

dApps **MUST** use the EIP-6963 Multi-Injected Provider Discovery mechanism to reliably find and connect to SuperSafe Wallet (and other EIP-6963 compatible wallets).

### 1.1. How EIP-6963 Works

1.  **dApp Dispatches `eip6963:requestProvider` Event**: When your dApp loads, it should dispatch an `eip6963:requestProvider` event on the `window` object to signal to all EIP-6963 compliant wallets that it's looking for providers.
2.  **Wallets Announce Themselves**: Compatible wallets (like SuperSafe) listen for this event and respond by dispatching an `eip6963:announceProvider` event. This event contains details about the wallet and its EIP-1193 compliant provider object.

### 1.2. Discovering SuperSafe Wallet

Your dApp should listen for the `eip6963:announceProvider` event on the `window` object.

Each announced provider will include a `detail` object containing:
*   `info`: An object with metadata about the provider.
    *   `uuid` (string): A unique identifier for the wallet provider. For SuperSafe: `'c6b8adb0-3878-4be9-a40b-7aee15b04178'`.
    *   `name` (string): The display name of the wallet. For SuperSafe: `'SuperSafe'`.
    *   `icon` (string): A data URI (typically a base64 encoded SVG) for the wallet's icon.
    *   `rdns` (string): A reverse domain name identifier. For SuperSafe: `'io.supersafe.cool'`.
*   `provider`: The EIP-1193 compliant Ethereum provider object for that wallet.

**Example dApp Listener for EIP-6963:**

```javascript
const announcedProviders = [];

function handleProviderAnnouncement(event) {
  const { info, provider } = event.detail;
  console.log(`Discovered Wallet: ${info.name} (UUID: ${info.uuid}, RDNS: ${info.rdns})`);
  
  // Store the provider detail, e.g., to display a list to the user
  if (!announcedProviders.find(p => p.info.uuid === info.uuid)) {
    announcedProviders.push({ info, provider });
  }

  // Example: If you want to specifically identify SuperSafe
  if (info.uuid === 'c6b8adb0-3878-4be9-a40b-7aee15b04178') {
    console.log('SuperSafe Wallet found!', provider);
    // You can now offer this provider to the user or connect directly
    // connectToWallet(provider, info); 
  }
}

window.addEventListener('eip6963:announceProvider', handleProviderAnnouncement);

// Request providers to announce themselves
window.dispatchEvent(new Event('eip6963:requestProvider'));

// It's good practice to have a timeout if no providers are announced,
// to inform the user that no EIP-6963 wallets were detected.
setTimeout(() => {
  if (announcedProviders.length === 0) {
    console.warn("No EIP-6963 compatible wallets detected.");
    // Update UI to inform the user, perhaps suggest installing SuperSafe or another EIP-6963 wallet.
  }
}, 3000); // Example timeout: Adjust as needed
```

### 1.3. Requesting Account Access

Once you have obtained the SuperSafe `provider` object (from the `eip6963:announceProvider` event's `detail`), you can request access to the user's accounts using the standard EIP-1193 `request` method:

```javascript
async function connectToWallet(walletProvider, walletInfo) {
  try {
    const accounts = await walletProvider.request({ method: 'eth_requestAccounts' });
    if (accounts && accounts.length > 0) {
      console.log(`Successfully connected to ${walletInfo.name}!`);
      console.log('Selected Account:', accounts[0]);
      // Store accounts[0] and use it for subsequent operations
      // Update your dApp's UI to reflect the connected state
      return accounts[0];
    } else {
      // This case should ideally not happen if the user approves and has accounts.
      console.warn(`${walletInfo.name}: Connection approved but no accounts returned.`);
      return null;
    }
  } catch (error) {
    console.error(`Error connecting to ${walletInfo.name}:`, error.message);
    // Handle errors, e.g., user rejection (error.code === 4001 for user rejection)
    // or if the wallet window was closed before a decision.
    return null;
  }
}
```
Calling `eth_requestAccounts` will prompt the user via the SuperSafe extension popup to approve or reject the connection for your dApp's origin. The user must approve the connection for your dApp to receive their account address(es). SuperSafe will then display a connection screen allowing the user to select an account if they have multiple, and view its balances (ETH and $SUPR) before approving.

## 2. Interacting with the Provider

SuperSafe's EIP-1193 provider supports standard methods and events.

### 2.1. Provider Events (EIP-1193)

Your dApp **MUST** listen for these events to stay synchronized with the wallet's state:

*   **`accountsChanged`**: Emitted when:
    *   The user connects a new account or approves the dApp for the first time.
    *   The user switches the active/selected account for your dApp within SuperSafe (e.g., via the connection popup's account selector or global settings if it affects connected dApps).
    *   The user disconnects your dApp from SuperSafe (payload will be an empty array).
    *   The wallet becomes locked or the user revokes all account permissions for the dApp.
    *   Payload: `string[]` (An array of account addresses. An empty array `[]` indicates disconnection or that no accounts are currently available/permitted for your dApp).

    ```javascript
    walletProvider.on('accountsChanged', (accounts) => {
      console.log('SuperSafe: accountsChanged event received with', accounts);
      if (accounts.length === 0) {
        // Handle disconnection:
        // - Clear any dApp state related to the user's account (address, balances, etc.)
        // - Update UI to a disconnected state.
        // - The user will need to reconnect (e.g., call eth_requestAccounts again) for future interactions.
        console.log('SuperSafe is disconnected or no accounts are available/permitted.');
      } else {
        // Handle new account(s) or account switch:
        const newActiveAccount = accounts[0]; // Typically, dApps use the first account.
        console.log('New active account from SuperSafe:', newActiveAccount);
        // - Update dApp state with the new account.
        // - Re-fetch any necessary data associated with this new account.
      }
    });
    ```

*   **`chainChanged`**: Emitted when the user switches to a different network within SuperSafe.
    *   Payload: `string` (The new chain ID in hexadecimal format, e.g., `'0x1'` for Ethereum Mainnet).
    *   **Important**: Per EIP-1193, upon a `chainChanged` event, dApps should consider reloading the page or re-initializing their state to ensure compatibility with the new network. This is because network-specific information (like contract addresses, balances, transaction history) will likely be different.

    ```javascript
    walletProvider.on('chainChanged', (chainId) => {
      console.log('SuperSafe: chainChanged event. New chain ID:', chainId);
      // It's often recommended to reload the page to ensure dApp consistency.
      window.location.reload(); 
    });
    ```

*   **`connect`**: Emitted when the dApp successfully establishes a connection to the provider (e.g., after `eth_requestAccounts` is approved by the user).
    *   Payload: `{ chainId: string }` (The chain ID to which the dApp is connected).

    ```javascript
    walletProvider.on('connect', (connectInfo) => {
      console.log('SuperSafe: "connect" event. Successfully connected to chain ID:', connectInfo.chainId);
      // The 'accountsChanged' event will typically follow with the selected account(s).
    });
    ```

*   **`disconnect`**: Emitted if the provider becomes irreversibly disconnected from the RPC (e.g., due to network issues, or an explicit disconnect action initiated by the provider itself).
    *   Payload: `ProviderRpcError`
    *   Note: User-initiated dApp disconnections from the SuperSafe extension UI, or dApp-initiated disconnections, will primarily trigger `accountsChanged` with an empty array. The `disconnect` event is more for provider-level disconnections.

    ```javascript
    walletProvider.on('disconnect', (error) => {
      console.error('SuperSafe: "disconnect" event. Provider became disconnected.', error);
      // Handle provider disconnection, potentially update UI to reflect an error state.
    });
    ```

### 2.2. Supported RPC Methods

Once connected, dApps can use `walletProvider.request({ method, params })`.

**Core Methods:**

*   **`eth_requestAccounts`**: (As described in Section 1.3) Initiates connection and prompts user approval via the SuperSafe popup. Returns a `Promise` that resolves to `string[]` (account addresses).
*   **`eth_accounts`**: Returns a `Promise` that resolves to `string[]` of accounts the dApp is permitted to access for the current origin.
    *   If the dApp is connected, returns the approved account(s).
    *   If the dApp is not connected or no accounts are approved/available, returns `[]`.
    *   This method does **not** trigger a user popup.

**Other Standard JSON-RPC Methods:**
SuperSafe Wallet aims to support all standard Ethereum JSON-RPC methods. The behavior for some common methods is as follows:

*   **Read-only methods (e.g., `eth_chainId`, `eth_getBalance`, `eth_call`, `net_version`):**
    *   If the dApp is already connected, SuperSafe aims to return the data directly without further user prompts. The SuperSafe background script will forward these requests to the current network's RPC provider.
*   **Methods requiring user signature or confirmation (e.g., `eth_sendTransaction`, `personal_sign`, `eth_signTypedData_v4`):**
    *   SuperSafe will display an appropriate confirmation popup to the user, detailing the request before any action is taken.
*   **General Behavior:**
    *   If a method requiring user interaction (like `eth_sendTransaction` or an unhandled read method for a not-yet-connected site) is called, and the site is not yet connected, it may trigger the initial connection popup first.
    *   The SuperSafe injected provider script (`provider.js`) forwards requests to the SuperSafe background script (`background.js`), which then orchestrates the necessary interactions (fetching data from RPC, showing popups, etc.).

**Recommendation for dApp Development:**
For most dApp interactions, using a higher-level library like `ethers.js` or `web3.js`, initialized with the SuperSafe provider (obtained via EIP-6963), is highly recommended. These libraries correctly format RPC requests and handle responses.

```javascript
// Example using ethers.js after obtaining the SuperSafe provider object
// Ensure you have ethers.js installed in your dApp project.
// import { ethers } from 'ethers'; // Or specific import for Web3Provider

// Assuming 'superSafeEip6963Provider' is the provider object from event.detail.provider
// const ethersProvider = new ethers.providers.Web3Provider(superSafeEip6963Provider);
// const signer = ethersProvider.getSigner(); // Gets the connected account as a signer

// async function getChainAndBalance() {
//   if (!signer) {
//     console.log("Not connected yet.");
//     return;
//   }
//   const chainId = await ethersProvider.getNetwork().then(network => network.chainId);
//   console.log("Current Chain ID:", chainId);
//   const address = await signer.getAddress();
//   const balance = await ethersProvider.getBalance(address);
//   console.log("Balance:", ethers.utils.formatEther(balance));
// }
```

SuperSafe's support for the full range of JSON-RPC methods and context-specific popups (e.g., for transactions vs. general signatures) is continuously being improved.

## 3. Disconnection

### 3.1. Disconnection Initiated by the User (from SuperSafe Extension)

Users can disconnect a dApp at any time via the SuperSafe extension interface (e.g., in the "Connected Sites" section of the Dashboard or Settings). When this happens:

1.  SuperSafe removes the dApp's origin from its list of approved sites.
2.  The SuperSafe provider in the dApp context will emit an `accountsChanged` event with an empty array (`[]`) to all instances (tabs) of that dApp's origin.
3.  Your dApp **MUST** listen for this `accountsChanged` event and handle the empty array by:
    *   Clearing any stored account information and sensitive data (address, balances, etc.).
    *   Updating the UI to a disconnected state.
    *   Requiring the user to reconnect (e.g., call `eth_requestAccounts` again) for future interactions.

### 3.2. Disconnection Initiated by the dApp

Your dApp can signal to the SuperSafe extension that it wishes to be programmatically disconnected. This is useful if your dApp has its own "Disconnect Wallet" button.

To do this, your dApp should send a `window.postMessage` to the SuperSafe content script:

```javascript
function dAppWantsToDisconnect() {
  // Perform any dApp-specific state cleanup immediately
  // For example, clear connected account, update UI to disconnected state.
  // clearMyDappAccountState(); 
  // updateMyDappUIToDisconnected();

  console.log('[Your dApp] User initiated disconnect. Notifying SuperSafe Wallet extension.');
  window.postMessage({
    type: 'SUPERSAFE_DAPP_WANTS_TO_DISCONNECT', // Specific type SuperSafe's content script listens for
    origin: window.location.origin             // The dApp's origin
  }, window.location.origin);                   // Target origin for the message (should be self)
  
  // After posting the message, the dApp has already handled its own UI/state.
  // The SuperSafe extension will receive this message, process the disconnection 
  // on its side (remove from connected sites list), and update its own UI (popup).
}
```
When SuperSafe's content script receives this `SUPERSAFE_DAPP_WANTS_TO_DISCONNECT` message, it will notify the background script. The background script will then remove the site from its `connectedSites` list and update any open SuperSafe popups accordingly.

**Crucially, the dApp is responsible for its own UI and state cleanup when its disconnect button is pressed.** The `postMessage` serves to inform the SuperSafe extension of this action so it can also update its state.

## 4. `window.ethereum` (Legacy Fallback & Identification)

While EIP-6963 is the primary and **strongly recommended** integration method, SuperSafe's injected `provider.js` script also makes a best-effort attempt to interact with the `window.ethereum` object for basic compatibility and identification:

*   **If `window.ethereum` is not present**: SuperSafe may set its EIP-1193 provider object as `window.ethereum`.
*   **If `window.ethereum` is already present (e.g., set by another wallet)**:
    *   SuperSafe will **not** overwrite the existing provider's core methods (like `request`).
    *   It may add identifying properties to the existing `window.ethereum` object, such as:
        *   `window.ethereum.isSupersafe = true`
        *   `window.ethereum.isSuperSafe = true` (alternative capitalization)
        *   `window.ethereum.superSafeWalletVersion = "x.y.z"` (where x.y.z is the version from SuperSafe's `package.json`)

**Limitations of relying on `window.ethereum`:**
*   **Unreliable for Discovery**: If multiple EIP-6963 wallets are present, there's no guarantee which wallet (if any) will control `window.ethereum` or when. The EIP-6963 `announceProvider` events are the source of truth.
*   **Functionality Might Be Limited**: If SuperSafe does not control the primary `window.ethereum` object, dApps cannot directly access SuperSafe's full capabilities through it without specifically using the provider instance obtained via EIP-6963.

**Therefore, dApps SHOULD NOT rely on `window.ethereum` or properties like `isSupersafe` for discovering or specifically connecting to SuperSafe Wallet. Always use EIP-6963 for discovery and to obtain the correct provider instance.**

## 5. Provider-Specific Information

As detailed in Section 1.2, the `info` object announced via EIP-6963 for SuperSafe contains:
*   `uuid: 'c6b8adb0-3878-4be9-a40b-7aee15b04178'`
*   `name: 'SuperSafe'`
*   `icon: 'data:image/svg+xml;base64,...'` (A base64 encoded SVG string for the SuperSafe icon. dApps should render this icon.)
*   `rdns: 'io.supersafe.cool'`

The SuperSafe EIP-1193 `provider` object itself (obtained from `event.detail.provider` in an EIP-6963 announcement) also has these helpful identification properties:
*   `isSupersafe: true`
*   `isSuperSafe: true`
*   `superSafeWalletVersion: "x.y.z"` (reflects the version of SuperSafe, e.g., "0.1.0")

## 6. Best Practices for dApp Developers

*   **Prioritize EIP-6963:** This is the most robust and future-proof method to detect and interact with SuperSafe and other modern Ethereum wallets.
*   **Handle All Relevant EIP-1193 Events:** Crucially listen for `accountsChanged` and `chainChanged`. Update your dApp's state and UI promptly in response to these events.
*   **Graceful Disconnection Logic:**
    *   Implement logic for user-initiated disconnections from the wallet (via `accountsChanged` with an empty array).
    *   If your dApp has a "Disconnect" button, use `window.postMessage` (type `SUPERSAFE_DAPP_WANTS_TO_DISCONNECT`) to inform SuperSafe, and immediately clean up your dApp's state.
*   **Clear State on Disconnect/Account Change:** When accounts change or the dApp is disconnected, clear any sensitive user data (like addresses, balances, contract instances tied to a signer) from your dApp's state and update the UI.
*   **Network Awareness:** Be prepared for users to switch networks. Reloading your dApp on `chainChanged` is a common and safe pattern to ensure data consistency.
*   **User Feedback:** Provide clear messages to the user regarding connection status, network changes, errors, and required actions.
*   **Avoid `window.ethereum` for Discovery:** Do not rely on `window.ethereum` to specifically find or connect to SuperSafe. Use EIP-6963 for provider discovery.
*   **Security:** Always validate inputs and outputs. Be mindful of the origin of messages when using `postMessage`.

---
This integration guide will be updated as SuperSafe Wallet evolves. For the most current information, please refer to the official SuperSafe documentation channels. 