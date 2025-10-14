# SuperSafe Wallet - Chrome Extension

<p align="center">
  <img src="https://github.com/JesCR/SuperSafe/blob/main/public/SuperSafe_2line.png" alt="SuperSafe Wallet Logo" />
</p>

**A secure Chrome Extension wallet for managing assets on the SuperSeed blockchain and interacting seamlessly with Decentralized Applications (dApps) via EIP-6963.**

**Documentation:** [Technical Documentation](Docs/Documentation.md) | [dApp Integration Guide](Docs/DAPP_INTEGRATION.md) | [Security Model](Docs/SECURITY.md) | [User Guide](Docs/USER_GUIDE.md)

<p align="center">
  <a href="https://youtu.be/xV-3PIRnCN8">
    <img src="https://i.sstatic.net/Vp2cE.png" alt="Watch the video (demo link)" />
  </a>
</p>

## 🚀 Key Features

- **EIP-6963 & EIP-1193 Compatibility**: Seamlessly discover SuperSafe and connect to dApps using the latest standards.
- **Secure dApp Interaction**: Clear consent screens for connections and transactions (future for txns), showing dApp origin and requested permissions.
- **Multi-Account Wallets**: Create or import multiple accounts within each wallet (e.g., using different derivation paths for HD wallets or managing multiple imported private keys under one named wallet).
- **Wallet Management**: Create new wallets (with seed phrases) or import existing ones using seed phrases or private keys.
- **Asset Management**: View balances and transfer ETH (SuperSeed native token) and ERC-20 tokens.
- **Connected Sites Management**: View and disconnect from dApps directly within the extension.
- **Automatic dApp Disconnection**: Enhances security by disconnecting dApps when the global active wallet is switched.
- **Multi-Network Support**: Compatible with SuperSeed Mainnet (ID 5330) and Sepolia Testnet (ID 53302).
- **Custom Token Support**: Add and manage any ERC-20 token.
- **Advanced Security**: AES-GCM encryption for private keys, with key derivation from a user-defined password.
- **Local Storage**: All sensitive data is encrypted and stored locally using `chrome.storage.local` and browser `localStorage` for UI preferences.

## 🔒 Security

SuperSafe implements a multi-layer security model designed to protect users' private keys, especially when interacting with dApps:

- **User Custody**: Private keys remain under the exclusive control of the user, encrypted locally.
- **No Seed Phrase Exposure to dApps**: Seed phrases are never shared with dApps.
- **Origin-Based Permissions**: dApps are granted permissions on a per-site basis, ensuring one dApp cannot impersonate another or access permissions granted to others.
- **Clear Prompts**: All dApp requests for connection or (in the future) transactions/signatures are presented in a human-readable format, clearly stating the requesting dApp's origin.
- **Defense in Depth**: Multiple security layers operate simultaneously, including robust encryption and secure communication protocols between extension components.

For more security details, check [SECURITY.md](Docs/SECURITY.md).

## 🏗️ Architecture (Chrome Extension)

SuperSafe operates as a Chrome Extension with a background script for core logic, content scripts for dApp interaction, and a React-based UI for the popup.

```
+----------------------------------------------------+
|                    dApp (Web Page)                 |
| +------------------------------------------------+ |
| |         window.ethereum (via provider.js)      | | <-- EIP-1193 / EIP-6963
| +-----------------------^------------------------+ |
|                         | window.postMessage       |
+-------------------------|--------------------------+
                          v
+----------------------------------------------------+
|      SuperSafe Content Script (content-script.js)  |
|                         | chrome.runtime.sendMessage |
+-------------------------|--------------------------+
                          v
+----------------------------------------------------+
|        SuperSafe Background (background.js)        |
|  (Wallets, Networks, RPC, Connected Sites Logic)   |
|                         | chrome.runtime.sendMessage |
+-------------------------|--------------------------+
                          v
+----------------------------------------------------+
|          SuperSafe Popup UI (React App)            |
+----------------------------------------------------+
```

Key components:
- **React Popup UI**: User interface for wallet management, settings, and dApp interaction prompts.
- **Background Script**: Core logic, wallet operations, network communication, dApp request handling.
- **Content Script**: Bridges communication between dApps and the background script.
- **Injected Provider Script**: EIP-1193/EIP-6963 compliant provider injected into dApps.
- **Secure Storage**: Utilizes `chrome.storage.local` for sensitive data and `localStorage` for UI state.

## 🛠️ Technologies

- **Frontend (Popup)**: React 18.2
- **Styling**: TailwindCSS 3.3
- **Build Tool (Popup)**: Vite 4.4
- **Blockchain Interaction**: ethers.js 5.7
- **Extension Core**: JavaScript, Chrome Extension APIs (Manifest V3)
- **Storage**: `chrome.storage.local`, Browser `localStorage`
- **Cryptography**: Web Crypto API (AES-GCM, PBKDF2)

## 📋 Requirements

- Node.js v16 or higher (for development)
- npm v7 or higher (for development)
- Google Chrome (or a Chromium-based browser that supports Manifest V3 extensions) for using the extension.

## 💻 Installation and Development

### Initial Setup (for Developers)

1. Clone the repository:
```bash
git clone https://github.com/JesCR/SuperSafe.git # Or your fork
cd SuperSafe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server (for the React popup UI with Hot Module Replacement):
```bash
npm run dev
```
   This typically makes the popup UI dev server available at `http://localhost:5173` (or similar, check Vite output), but the primary way to test the extension is by loading it into Chrome.

### Building and Using as a Chrome Extension

1.  **Build the Extension**:
    ```bash
    npm run build
    ```
    This command compiles the React popup and copies all necessary extension files (manifest.json, background.js, content-script.js, icons, etc.) into the `dist/` directory.

2.  **Load Unpacked Extension in Chrome**:
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable "Developer mode" (usually a toggle in the top right corner).
    *   Click on "Load unpacked".
    *   Select the `dist/` directory from your SuperSafe project.
    *   The SuperSafe extension icon should appear in your browser's toolbar. Click it to use the wallet.

(For more detailed debugging instructions, see [Development Guide](Docs/Documentation.md#development-guide) in the technical documentation.)

### Main `npm` Commands

```bash
# Start development server for popup UI (HMR)
npm run dev

# Build extension for production (outputs to dist/)
npm run build

# Preview the production build of the popup UI (useful for checking UI bundle)
npm run preview
```

## 📚 Documentation

- [Technical Documentation](Docs/Documentation.md) - Comprehensive technical details, architecture, and component guides.
- [dApp Integration Guide](Docs/DAPP_INTEGRATION.md) - How dApps can integrate with SuperSafe using EIP-6963.
- [Security Model](Docs/SECURITY.md) - In-depth information about SuperSafe's security mechanisms.
- [User Guide](Docs/USER_GUIDE.md) - Step-by-step guide for end-users.

## 🛣️ Roadmap

---

### Phase 1 – MVP (Minimum Viable Product)
**Goal**: Validate the concept, ensure basic security and minimal functionality
- [x] New Wallet creation and management (Implemented)
- [x] Connect DApps with SuperSafe (EIP-6963 Implemented)
- [x] Transfer Funds (ETH & ERC20 Implemented)
- [ ] Basic frontend for DEX (Swaps with predefined DEX) - *Upcoming*
- [x] Key recovery:
  - [x] From Settings (Reveal Seed Phrase Implemented)

---

### Phase 2 – Version 1.0
**Goal**: Add key features and cross-chain usability
- [ ] Aggregator for Swaps - *Upcoming*
- [ ] Token support (create/configure native token) - *Partially Implemented (ERC20 support exists)*
- [ ] Basic mobile app (login, wallet, balance) - *Future Consideration*
- [ ] Cross-token support (send/receive) - *Implemented for ETH/ERC20*
- [ ] Cross-NFT support - *Upcoming (NFT Viewing/Management)*
- [ ] Token distribution from backend (missions, crypto-coach) - *Future Consideration*
- [ ] Templates for each type of content/token - *Future Consideration*
- [ ] Token notifications (push or in-app) - *Upcoming (Push Notifications via Chrome Ext API)*
- [ ] User identity verification and security - *Ongoing Security Enhancements*
- [ ] Improve DEX frontend (UI/UX) - *Future Consideration*
- [ ] Explore liquidity aggregator (API availability) - *Future Consideration*
- [ ] Basic points system (no gamification yet) - *Future Consideration*
- [ ] Key recovery:
  - [ ] Backup to iCloud or Google Drive on mobile - *Future Consideration (related to mobile app)*
  - [x] Advanced Backup & Restore Options (More user-friendly mechanisms beyond just seed phrase) - *Planned*

---

### Phase 3 – Version 2.0 and Scaling
**Goal**: Scale the platform, retain users and gamify the experience
- [ ] Integration with SuperChain (If applicable, or other L2/sidechains) - *Future Consideration*
- [ ] Full reward/points system - *Future Consideration*
- [ ] User hub (personalized dashboard) - *Future Consideration*
- [ ] Complete flow for swaps, transfers, and purchases (FOS) - *Ongoing & Upcoming*
- [ ] Advanced Crypto Coach implementation (guidance & recommendations) - *Future Consideration*
- [ ] Enhanced key recovery:
  - [ ] Social Shared Recovery (Trusted Guardians) - *Future Consideration*
  - [ ] Local backup with encryption - *Planned as part of Advanced Backup options*
  - [ ] Secure backend integration (If needed for specific features, not for keys) - *Future Consideration*
- [ ] Gamified achievement system (EXR, visual backgrounds, badges, etc.) - *Future Consideration*

---

### Additional Planned Features & Enhancements (from previous Roadmap section)

- **Transaction Signing Flow for dApps**: Full support for `eth_sendTransaction` and common signing methods (`personal_sign`, `eth_signTypedData_v4`) initiated by dApps, with clear user confirmation prompts. - *High Priority Upcoming*
- **NFT Support**: View and manage non-fungible tokens (ERC-721/ERC-1155) in the popup. - *Upcoming*
- **Hardware Wallet Support**: Integration with popular hardware wallets like Ledger and Trezor. - *Planned*
- **Transaction History**: More detailed and filterable transaction history within the popup. - *Planned*
- **Address Book/Contacts**: Ability to save and label frequently used addresses. - *Planned*
- **Gas Fee Customization**: Allow users to adjust gas price/limit for transactions initiated from the wallet. - *Planned*

### Technical Improvements (from previous Roadmap section)

- **Performance Optimization**: Continuous review to reduce loading times and resource consumption of the popup and background processes. - *Ongoing*
- **Enhanced Security Audits**: Regular internal and potentially external security reviews. - *Ongoing*
- **Multi-language Support**: Full internationalization of the extension UI. - *Planned*
- **Comprehensive Automated Testing**: Expansion of unit, integration, and end-to-end test coverage (e.g., using Puppeteer or similar for extension testing). - *Ongoing*
- **Potential TypeScript Migration**: Evaluate migration to TypeScript for improved type safety and maintainability. - *Under Consideration*


## 🤝 Contribution

Contributions are welcome! Please read our (to-be-created) contribution guide before submitting a pull request. For now, feel free to open issues for bugs or feature requests.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
