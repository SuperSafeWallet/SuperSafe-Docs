import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

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
    {type: 'doc', id: 'intro', label: '🚀 Introduction'},
    {
      type: 'category',
      label: '🛠️ Getting Started',
      items: [
        {type: 'doc', id: 'getting-started/installation', label: '📥 Installation'},
        {type: 'doc', id: 'getting-started/creating-wallet', label: '✨ Creating a New Wallet'},
        {type: 'doc', id: 'getting-started/importing-wallet', label: '🔑 Importing an Existing Wallet'},
      ],
    },
    {
      type: 'category',
      label: '💎 Using SuperSafe',
      items: [
        {type: 'doc', id: 'using-supersafe/navigation', label: '🧭 Navigation'},
        {type: 'doc', id: 'using-supersafe/wallet-management', label: '💼 Wallet Management'},
        {type: 'doc', id: 'using-supersafe/sending-receiving', label: '💸 Sending & Receiving'},
        {type: 'doc', id: 'using-supersafe/token-management', label: '🪙 Token Management'},
        {type: 'doc', id: 'using-supersafe/swapping-tokens', label: '🔄 Swapping Tokens'},
        {type: 'doc', id: 'using-supersafe/network-switching', label: '🌐 Network Switching'},
      ],
    },
    {
      type: 'category',
      label: '🔗 Connecting to dApps',
      items: [
        {type: 'doc', id: 'connecting-dapps/how-it-works', label: '💡 How It Works'},
        {type: 'doc', id: 'connecting-dapps/connecting', label: '🔌 Connecting'},
        {type: 'doc', id: 'connecting-dapps/approving-transactions', label: '✅ Approving Transactions'},
        {type: 'doc', id: 'connecting-dapps/managing-connections', label: '⚙️ Managing Connections'},
      ],
    },
    {
      type: 'category',
      label: '🛡️ Security',
      items: [
        {type: 'doc', id: 'security/overview', label: '🧐 Overview'},
        {type: 'doc', id: 'security/passwords-seeds', label: '🔐 Passwords & Seeds'},
        {type: 'doc', id: 'security/key-encryption', label: '🔒 Key Encryption'},
        {type: 'doc', id: 'security/safe-dapp-interaction', label: '🤝 Safe dApp Interaction'},
        {type: 'doc', id: 'security/configurations', label: '⚙️ Configurations'},
        {type: 'doc', id: 'security/vulnerability-reporting', label: '🐞 Vulnerability Reporting'},
      ],
    },
    {
      type: 'category',
      label: '👨‍💻 For Developers',
      items: [
        {type: 'doc', id: 'for-developers/integration-overview', label: '🧩 Integration Overview'},
        {type: 'doc', id: 'for-developers/provider-events', label: '📡 Provider Events'},
        {type: 'doc', id: 'for-developers/rpc-methods', label: '🔌 RPC Methods'},
        {type: 'doc', id: 'for-developers/network-compatibility', label: '🌐 Network Compatibility'},
        {type: 'doc', id: 'for-developers/architecture-overview', label: '🏗️ Architecture Overview'},
      ],
    },
    {
      type: 'category',
      label: '🧠 Advanced Topics',
      items: [
        {type: 'doc', id: 'advanced/architecture-deep-dive', label: '🔬 Architecture Deep Dive'},
        {type: 'doc', id: 'advanced/main-components', label: '🧱 Main Components'},
        {type: 'doc', id: 'advanced/state-management', label: '💾 State Management'},
        {type: 'doc', id: 'advanced/networks-config', label: '🌐 Networks Configuration'},
        {type: 'doc', id: 'advanced/storage', label: '📦 Storage Architecture'},
        {type: 'doc', id: 'advanced/swap-integration', label: '🔄 Swap Integration'},
      ],
    },
    {type: 'doc', id: 'troubleshooting', label: '🔧 Troubleshooting'},
    {type: 'doc', id: 'faq', label: '❓ FAQ'},
    {type: 'doc', id: 'roadmap', label: '🗺️ Roadmap'},
  ],
};

export default sidebars;
