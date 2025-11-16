---
sidebar_position: 2
---

# 🧩 Components

SuperSafe Wallet's frontend is built with React 18, organized into a clear component hierarchy with presentational components and screen-based routing.

## Overview

### Component Organization

```
src/components/
├── App.jsx                          # Main application (1,569 lines)
├── Dashboard.jsx                    # Portfolio view
├── Swap.jsx                         # Swap interface (~115 lines container)
├── Settings.jsx                     # Settings panel
├── Ecosystem.jsx                    # Ecosystem explorer
│
├── screens/                         # Full-screen views
│   ├── ConnectionRequestScreen.jsx
│   ├── TransactionConfirmationScreen.jsx
│   ├── SigningConfirmationScreen.jsx
│   ├── TypedDataConfirmationScreen.jsx
│   ├── NetworkSwitchConfirmationScreen.jsx
│   ├── UnsupportedNetworkScreen.jsx
│   └── TransactionSuccessScreen.jsx
│
├── swap/                            # Swap provider panels
│   ├── BebopSwapPanel.jsx          # Bebop implementation (~1,400 lines)
│   ├── RelaySwapPanel.jsx          # Relay implementation (~1,288 lines)
│   └── shared/                      # Shared utilities
│       ├── CompactNetworkSelector.jsx
│       ├── RouteVisualization.jsx
│       ├── BridgeTimeDisplay.jsx
│       ├── GasEstimateDisplay.jsx
│       └── LoadingDots.jsx
│
├── modals/                          # Modal dialogs
│   ├── UnlockWalletModal.jsx
│   ├── EditWalletModal.jsx
│   ├── NetworkConsentModal.jsx
│   ├── SignatureModal.jsx
│   └── LoadingModal.jsx
│
├── settings/                        # Settings sections
│   ├── SecuritySection.jsx
│   ├── WalletsSection.jsx
│   ├── NetworkSection.jsx
│   ├── TokensSection.jsx
│   └── WalletConnectSection.jsx
│
└── common/                          # Reusable components
    ├── Dashboard/
    │   ├── PortfolioBalanceSection.jsx
    │   ├── TokensList.jsx
    │   ├── NFTsSection.jsx
    │   └── TokenCardDark.jsx
    ├── TokenImage.jsx              # Token logo display with fallback
    ├── TokenLogo.jsx               # Advanced logo with orchestrator
    └── NetworkIcon.jsx             # Network/chain logos
```

---

## App Component (1,569 lines)

**Location:** `src/App.jsx`

**Core Responsibilities:**
- Screen routing based on URL parameters
- Modal state management
- Connection request handling
- Transaction/signing confirmation
- Network switch consent

**Screen Routing:**

```javascript
// Mode detection from URL params
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const screen = urlParams.get('screen');

// Route to appropriate screen
if (screen === 'connection') {
  return <ConnectionRequestScreen />;
} else if (screen === 'transaction') {
  return <TransactionConfirmationScreen />;
} else if (screen === 'signing') {
  return <SigningConfirmationScreen />;
} else if (screen === 'typed_data') {
  return <TypedDataConfirmationScreen />;
} else if (screen === 'network_switch') {
  return <NetworkSwitchConfirmationScreen />;
} else if (screen === 'unsupported_network') {
  return <UnsupportedNetworkScreen />;
} else if (isUnlocked) {
  return <Dashboard />;
} else {
  return <UnlockWalletModal />;
}
```

---

## Screen Components

### TransactionConfirmationScreen

**Location:** `src/components/screens/TransactionConfirmationScreen.jsx`

**Enhanced Features (v3.0+):**
- ✅ Rich transaction decoding (DEX swaps, ERC-20, NFTs)
- ✅ Token logos integration via `getTokenLogo()`
- ✅ Collapsible detail sections (Contract Interaction, Batch Operations, Security, Raw Data)
- ✅ Wei amount detection and formatting
- ✅ "You Send" / "You Receive" prominent display
- ✅ Always-visible Security notice (outside scrollable area)

**Architecture:**

```javascript
function TransactionConfirmationScreen({ transaction, decodedTransaction, origin }) {
  const [showContractDetails, setShowContractDetails] = useState(false);
  const [showBatchOps, setShowBatchOps] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  
  // Extract decoded call information
  const decodedCall = decodedTransaction?.decodedCall;
  const isSwap = decodedCall?.type?.includes('Swap');
  
  return (
    <div className="confirmation-screen">
      {/* Main Transaction Block */}
      <div className="main-transaction-block">
        <NetworkHeader chainId={chainId} />
        <OriginLine origin={origin} />
        
        {isSwap && (
          <>
            {/* You Send - Always Visible */}
            <div className="you-send">
              <TokenImage address={decodedCall.tokenIn.address} symbol={decodedCall.tokenIn.symbol} />
              <span>{formatAmount(decodedCall.amountIn)} {decodedCall.tokenIn.symbol}</span>
            </div>
            
            {/* You Receive - Always Visible */}
            <div className="you-receive">
              <TokenImage address={decodedCall.tokenOut.address} symbol={decodedCall.tokenOut.symbol} />
              <span>~{formatAmount(decodedCall.amountOutMin)} {decodedCall.tokenOut.symbol}</span>
            </div>
          </>
        )}
      </div>
      
      {/* Collapsible Sections */}
      <CollapsibleSection title="Contract Interaction" isOpen={showContractDetails} />
      <CollapsibleSection title="Batch Operations" isOpen={showBatchOps} />
      <CollapsibleSection title="Raw Data" isOpen={showRawData} />
      
      {/* Security Notice - Always Visible */}
      <SecurityNotice origin={origin} warnings={decodedCall?.risks} />
      
      {/* Action Buttons */}
      <div className="actions">
        <button onClick={onReject}>Reject</button>
        <button onClick={onApprove}>Confirm</button>
      </div>
    </div>
  );
}
```

### TypedDataConfirmationScreen

**Location:** `src/components/screens/TypedDataConfirmationScreen.jsx`

**Enhanced Features (v3.0+):**
- ✅ PermitSingle (Permit2) rich display
- ✅ PermitBatchWitnessTransferFrom support
- ✅ Unlimited approval detection (MAX_UINT160)
- ✅ Human-readable expiration dates
- ✅ Token logos for approved tokens
- ✅ Collapsible "Additional Details" section

### SigningConfirmationScreen

**Location:** `src/components/screens/SigningConfirmationScreen.jsx`

**Enhanced Features (v3.0+):**
- ✅ Hex to UTF-8 decoding for personal_sign
- ✅ SIWE (Sign-In With Ethereum) detection
- ✅ Message preview with scroll
- ✅ Collapsible "Raw Message" section

### UnsupportedNetworkScreen

**Location:** `src/components/screens/UnsupportedNetworkScreen.jsx`

**Purpose:** Display clear error when dApp requests a network SuperSafe doesn't support.

---

## Swap Components

### Unified Panel Architecture (v2.0.0)

**Swap.jsx (~115 lines)** - Container/Orchestrator only

```javascript
const Swap = ({ 
  onTransactionComplete, 
  preselectedToken,
  onClearPreselection,
  walletTokensWithBalance,
  nativeTokenBalance 
}) => {
  const [swapProvider, setSwapProvider] = useState('bebop');
  const [slippage, setSlippage] = useState(0.5);
  
  return (
    <>
      <SwapProviderSelector selected={swapProvider} onChange={setSwapProvider} />
      <SlippageControl slippage={slippage} onChange={setSlippage} />
      
      {swapProvider === 'relay' ? (
        <RelaySwapPanel {...props} slippage={slippage} />
      ) : (
        <BebopSwapPanel {...props} slippage={slippage} />
      )}
    </>
  );
};
```

**BebopSwapPanel.jsx (~1,400 lines)** - Complete Bebop implementation

**RelaySwapPanel.jsx (~1,288 lines)** - Complete Relay.link implementation

---

## Common Components

### TokenLogo Component

**Location:** `src/components/common/TokenLogo.jsx`

**Features:**
- Uses logo orchestrator for intelligent resolution
- In-memory + persistent caching
- Automatic fallback through providers
- Error handling with placeholder

### TokenImage Component

**Location:** `src/components/common/TokenImage.jsx`

**Features:**
- Simpler component for basic use cases
- Manual logo URL construction
- Fallback to placeholder

---

## UI/UX Patterns

### Collapsible Sections Pattern

**Purpose:** Improve UX by hiding complex details by default while maintaining full transparency.

**Implementation:**

```javascript
function CollapsibleSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="collapsible-section">
      <div className="section-header" onClick={onToggle}>
        <h3>{title}</h3>
        <span className="chevron">{isOpen ? '▼' : '▶'}</span>
      </div>
      
      {isOpen && (
        <div className="section-content">
          {children}
        </div>
      )}
    </div>
  );
}
```

**Philosophy:**
- **Critical info always visible** (You Send, You Receive, Amount, Origin)
- **Technical details collapsible** (Contract Interaction, Batch Operations, Raw Data)
- **Security notice ALWAYS visible** (outside scrollable area, below action buttons)

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.0+  
**Maintenance:** Review after major component changes

