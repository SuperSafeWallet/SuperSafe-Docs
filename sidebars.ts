import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    { type: 'doc', id: 'intro', label: '🚀 Introduction' },
    {
      type: 'category',
      label: '🛠️ Getting Started',
      items: [
        { type: 'doc', id: 'getting-started/installation', label: '📥 Installation' },
        { type: 'doc', id: 'getting-started/creating-wallet', label: '✨ Creating a New Wallet' },
        { type: 'doc', id: 'getting-started/importing-wallet', label: '🔑 Importing an Existing Wallet' },
      ],
    },
    {
      type: 'category',
      label: '💎 Using SuperSafe',
      items: [
        { type: 'doc', id: 'using-supersafe/navigation', label: '🧭 Navigation' },
        { type: 'doc', id: 'using-supersafe/wallet-management', label: '💼 Wallet Management' },
        { type: 'doc', id: 'using-supersafe/sending-receiving', label: '💸 Sending & Receiving' },
        { type: 'doc', id: 'using-supersafe/token-management', label: '🪙 Token Management' },
        { type: 'doc', id: 'using-supersafe/swapping-tokens', label: '🔄 Swapping Tokens' },
        { type: 'doc', id: 'using-supersafe/network-switching', label: '🌐 Network Switching' },
        { type: 'doc', id: 'using-supersafe/buy-crypto', label: '💳 Buy Crypto' },
      ],
    },
    {
      type: 'category',
      label: '🔗 Connecting to dApps',
      items: [
        { type: 'doc', id: 'connecting-dapps/how-it-works', label: '💡 How It Works' },
        { type: 'doc', id: 'connecting-dapps/connecting', label: '🔌 Connecting' },
        { type: 'doc', id: 'connecting-dapps/approving-transactions', label: '✅ Approving Transactions' },
        { type: 'doc', id: 'connecting-dapps/managing-connections', label: '⚙️ Managing Connections' },
        { type: 'doc', id: 'connecting-dapps/framework-detection', label: '🔍 Framework Detection' },
      ],
    },
    {
      type: 'category',
      label: '🛡️ Security',
      items: [
        { type: 'doc', id: 'security/overview', label: '🧐 Overview' },
        { type: 'doc', id: 'security/passwords-seeds', label: '🔐 Passwords & Seeds' },
        { type: 'doc', id: 'security/key-encryption', label: '🔒 Key Encryption' },
        { type: 'doc', id: 'security/safe-dapp-interaction', label: '🤝 Safe dApp Interaction' },
        { type: 'doc', id: 'security/configurations', label: '⚙️ Configurations' },
        { type: 'doc', id: 'security/memory-protection', label: '🧠 Memory Protection' },
        { type: 'doc', id: 'security/vulnerability-reporting', label: '🐞 Vulnerability Reporting' },
      ],
    },
    {
      type: 'category',
      label: '🧠 Advanced Topics',
      items: [
        { type: 'doc', id: 'advanced/architecture-deep-dive', label: '🔬 Architecture Deep Dive' },
        { type: 'doc', id: 'advanced/main-components', label: '🧱 Main Components' },
        { type: 'doc', id: 'advanced/state-management', label: '💾 State Management' },
        { type: 'doc', id: 'advanced/networks-config', label: '🌐 Networks Configuration' },
        { type: 'doc', id: 'advanced/storage', label: '📦 Storage Architecture' },
        { type: 'doc', id: 'advanced/swap-integration', label: '🔄 Swap Integration' },
        { type: 'doc', id: 'advanced/gas-validation', label: '⛽ Gas Validation System' },
        { type: 'doc', id: 'advanced/transaction-decoding', label: '🔍 Transaction Decoding' },
        { type: 'doc', id: 'advanced/transaction-history', label: '📜 Transaction History' },
        { type: 'doc', id: 'advanced/signing-system', label: '✍️ Signing System' },
      ],
    },
    {
      type: 'category',
      label: '🔍 Security Audits',
      items: [
        { type: 'doc', id: 'audits/overview', label: '📋 Overview' },
        // External Professional Audit
        { type: 'doc', id: 'audits/external-audit', label: '🏢 External Security Audit' },
        { type: 'doc', id: 'audits/external-audit-remediation', label: '✅ Audit Remediation' },
        // AI-Powered System Audits
        { type: 'doc', id: 'audits/dapp-connection-audit', label: '🔗 dApp Connection Audit' },
        { type: 'doc', id: 'audits/signing-audit', label: '✍️ Signing Audit' },
        { type: 'doc', id: 'audits/transaction-decoder-audit', label: '🔍 Transaction Decoder Audit' },
        { type: 'doc', id: 'audits/shared-state-audit', label: '📊 Shared State Audit' },
        { type: 'doc', id: 'audits/chainid-format-audit', label: '🔢 ChainId Format Audit' },
        { type: 'doc', id: 'audits/gas-validation-audit', label: '⛽ Gas Validation Audit' },
        { type: 'doc', id: 'audits/config-system-audit', label: '⚙️ Config System Audit' },
        { type: 'doc', id: 'audits/api-proxy-audit', label: '🔒 API Proxy Audit' },
        { type: 'doc', id: 'audits/storage-security-audit', label: '💾 Storage Security Audit' },
        { type: 'doc', id: 'audits/session-security-audit', label: '🔐 Session Security Audit' },
        // Summary Pages
        { type: 'doc', id: 'audits/compliance-scorecard', label: '📋 Compliance Scorecard' },
        { type: 'doc', id: 'audits/repair-summary', label: '🔧 Repair Summary' },
      ],
    },
    { type: 'doc', id: 'troubleshooting', label: '🔧 Troubleshooting' },
    { type: 'doc', id: 'faq', label: '❓ FAQ' },
    { type: 'doc', id: 'roadmap', label: '🗺️ Roadmap' },
  ],
};

export default sidebars;
