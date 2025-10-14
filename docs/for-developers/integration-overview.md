---
sidebar_position: 1
---

# 👨‍💻 Integration Overview

Learn how to integrate SuperSafe Wallet with your dApp using the EIP-1193 provider and supported frameworks.

## Overview

SuperSafe Wallet provides a **standard EIP-1193 provider** that seamlessly integrates with popular Web3 frameworks and libraries. The wallet implements **Smart Native Connection** architecture for secure, reliable dApp integration.

### Key Features for Developers

- **EIP-1193 Compliance**: Standard Ethereum provider interface
- **Framework Support**: RainbowKit, Wagmi, Web3-React, Dynamic
- **Smart Native Connection**: Real chainIds, no compatibility hacks
- **AllowList Security**: Whitelist-based dApp security
- **WalletConnect V2**: Mobile and cross-device support

## EIP-1193 Provider

### Provider Access

SuperSafe injects the EIP-1193 provider into the `window.ethereum` object:

```javascript
// Check if SuperSafe is available
if (window.ethereum && window.ethereum.isSuperSafe) {
  console.log('SuperSafe Wallet detected');
  // Use SuperSafe provider
} else {
  console.log('SuperSafe Wallet not detected');
  // Fallback to other wallets
}
```

### Provider Properties

```javascript
// Provider object structure
window.ethereum = {
  // SuperSafe specific
  isSuperSafe: true,
  isConnected: false,
  chainId: "0x14a2", // SuperSeed (5330)
  
  // Standard EIP-1193
  request: async (args) => { /* ... */ },
  on: (event, handler) => { /* ... */ },
  removeListener: (event, handler) => { /* ... */ },
  
  // Events
  accountsChanged: (accounts) => { /* ... */ },
  chainChanged: (chainId) => { /* ... */ },
  connect: (connectInfo) => { /* ... */ },
  disconnect: (error) => { /* ... */ }
}
```

## Framework Integration

### RainbowKit Integration

#### Automatic Detection
SuperSafe automatically detects RainbowKit and registers as an available wallet:

```javascript
// RainbowKit configuration
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient } from 'wagmi';
import { mainnet, optimism } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { connectors } = getDefaultWallets({
  appName: 'My dApp',
  projectId: 'your-project-id',
  chains: [mainnet, optimism]
});

const { chains, provider } = configureChains(
  [mainnet, optimism],
  [
    alchemyProvider({ apiKey: 'your-alchemy-key' }),
    publicProvider()
  ]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});
```

#### Custom Connector
```javascript
// Custom SuperSafe connector
import { SuperSafeConnector } from '@rainbow-me/rainbowkit/connectors/supersafe';

const supersafeConnector = new SuperSafeConnector({
  chains: [mainnet, optimism],
  options: {
    shimDisconnect: true,
  }
});
```

### Wagmi Integration

#### Provider Setup
```javascript
import { createConfig, http } from 'wagmi';
import { mainnet, optimism } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, optimism],
  connectors: [
    injected({
      target: 'superSafe',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
  },
});
```

#### Hooks Usage
```javascript
import { useAccount, useConnect, useDisconnect } from 'wagmi';

function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <p>Connected to {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  );
}
```

### Web3-React Integration

#### Connector Setup
```javascript
import { InjectedConnector } from '@web3-react/injected-connector';

const supersafeConnector = new InjectedConnector({
  supportedChainIds: [1, 10, 5330], // Ethereum, Optimism, SuperSeed
});

// Use in Web3ReactProvider
<Web3ReactProvider connectors={[supersafeConnector]}>
  <App />
</Web3ReactProvider>
```

#### Hook Usage
```javascript
import { useWeb3React } from '@web3-react/core';

function ConnectButton() {
  const { account, activate, deactivate } = useWeb3React();

  const connect = async () => {
    try {
      await activate(supersafeConnector);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <p>Connected: {account}</p>
          <button onClick={deactivate}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect SuperSafe</button>
      )}
    </div>
  );
}
```

### Dynamic Integration

#### Wallet Configuration
```javascript
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

const walletConnectors = [
  new EthereumWalletConnectors({
    walletConnectorExtensions: [
      // SuperSafe will be automatically detected
    ],
  }),
];

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: 'your-environment-id',
        walletConnectors,
      }}
    >
      <YourApp />
    </DynamicContextProvider>
  );
}
```

## Smart Native Connection

### Architecture Principles

#### Real ChainIds Only
SuperSafe never uses fake chainIds for compatibility:

```javascript
// ✅ Correct - Use real chainIds
const supportedChains = [
  { id: 1, name: 'Ethereum' },
  { id: 10, name: 'Optimism' },
  { id: 5330, name: 'SuperSeed' }
];

// ❌ Incorrect - Don't use fake chainIds
const fakeChains = [
  { id: 0x1, name: 'Ethereum' },
  { id: 0xa, name: 'Optimism' },
  { id: 0x14a2, name: 'SuperSeed' }
];
```

#### Network-First Approach
```javascript
// Check network compatibility
const checkNetworkCompatibility = async () => {
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  const supportedChains = ['0x1', '0xa', '0x14a2']; // Ethereum, Optimism, SuperSeed
  
  if (!supportedChains.includes(chainId)) {
    // Request network switch
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Switch to Ethereum
      });
    } catch (error) {
      console.error('Network switch failed:', error);
    }
  }
};
```

### Connection Flow

#### Standard Connection Flow
```javascript
const connectWallet = async () => {
  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    // Get current chain ID
    const chainId = await window.ethereum.request({
      method: 'eth_chainId'
    });
    
    // Check network compatibility
    if (!isSupportedNetwork(chainId)) {
      await requestNetworkSwitch();
    }
    
    return { accounts, chainId };
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
};
```

#### Network Switch Flow
```javascript
const requestNetworkSwitch = async (targetChainId) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainId }]
    });
  } catch (error) {
    if (error.code === 4902) {
      // Chain not added, request to add it
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [getChainConfig(targetChainId)]
      });
    } else {
      throw error;
    }
  }
};
```

## AllowList System

### AllowList Structure

SuperSafe uses an AllowList system to whitelist trusted dApps:

```json
{
  "policies": {
    "https://app.uniswap.org": {
      "allowed": true,
      "networks": ["0x1", "0xa", "0x14a2"],
      "permissions": ["eth_requestAccounts", "eth_sendTransaction"],
      "description": "Uniswap - Decentralized Exchange"
    }
  }
}
```

### Adding Your dApp

#### Request AllowList Addition
1. **Contact Security Team**: Email security@suersafe.cool
2. **Provide Information**: dApp URL, description, supported networks
3. **Security Review**: Security team reviews your dApp
4. **AllowList Update**: dApp added to AllowList

#### AllowList Requirements
- **HTTPS Only**: Must use HTTPS
- **Valid Certificate**: Must have valid SSL certificate
- **Clear Purpose**: Must have clear purpose
- **Security Review**: Must pass security review

## WalletConnect V2 Integration

### Mobile Support

#### QR Code Pairing
```javascript
import { WalletConnectConnector } from '@web3-react/walletconnect-v2';

const walletConnectConnector = new WalletConnectConnector({
  projectId: 'your-project-id',
  chains: [1, 10, 5330],
  showQrModal: true,
});

// Use in your app
const connect = async () => {
  try {
    await activate(walletConnectConnector);
  } catch (error) {
    console.error('WalletConnect failed:', error);
  }
};
```

#### Deep Link Support
```javascript
// Handle deep links
const handleDeepLink = (uri) => {
  // Open SuperSafe mobile app with deep link
  window.location.href = `supersafe://wc?uri=${encodeURIComponent(uri)}`;
};
```

## Error Handling

### Common Error Codes

#### EIP-1193 Error Codes
```javascript
const handleError = (error) => {
  switch (error.code) {
    case 4001:
      console.log('User rejected the request');
      break;
    case 4100:
      console.log('Unauthorized - request method not supported');
      break;
    case 4200:
      console.log('Unsupported method');
      break;
    case 4900:
      console.log('Disconnected from chain');
      break;
    case 4901:
      console.log('Chain disconnected');
      break;
    case 4902:
      console.log('Chain not added');
      break;
    default:
      console.log('Unknown error:', error);
  }
};
```

#### SuperSafe Specific Errors
```javascript
const handleSuperSafeError = (error) => {
  if (error.code === 'SUPERSAFE_NOT_INSTALLED') {
    console.log('SuperSafe Wallet not installed');
  } else if (error.code === 'SUPERSAFE_NOT_CONNECTED') {
    console.log('SuperSafe Wallet not connected');
  } else if (error.code === 'SUPERSAFE_NETWORK_MISMATCH') {
    console.log('Network mismatch - request network switch');
  }
};
```

## Best Practices

### Development Guidelines

#### Security First
- **Validate Inputs**: Always validate user inputs
- **Check Permissions**: Verify required permissions
- **Handle Errors**: Implement proper error handling
- **Test Thoroughly**: Test all integration scenarios

#### User Experience
- **Clear Messaging**: Provide clear error messages
- **Loading States**: Show loading states during operations
- **Fallback Options**: Provide fallback options
- **Mobile Support**: Ensure mobile compatibility

### Testing

#### Unit Testing
```javascript
// Mock SuperSafe provider for testing
const mockSuperSafe = {
  isSuperSafe: true,
  isConnected: false,
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

// Test connection
test('should connect to SuperSafe', async () => {
  mockSuperSafe.request.mockResolvedValue(['0x123...']);
  const result = await connectWallet();
  expect(result.accounts).toEqual(['0x123...']);
});
```

#### Integration Testing
```javascript
// Test with real SuperSafe extension
test('should integrate with SuperSafe', async () => {
  // Load test page with SuperSafe
  await page.goto('http://localhost:3000');
  
  // Click connect button
  await page.click('[data-testid="connect-button"]');
  
  // Verify connection
  const isConnected = await page.evaluate(() => {
    return window.ethereum.isConnected;
  });
  
  expect(isConnected).toBe(true);
});
```

## Troubleshooting

### Common Issues

#### Provider Not Detected
- **Check Extension**: Ensure SuperSafe is installed
- **Refresh Page**: Refresh the page
- **Check Console**: Check browser console for errors
- **Test Connection**: Test connection manually

#### Network Issues
- **Check Network**: Verify network compatibility
- **Request Switch**: Request network switch
- **Handle Errors**: Handle network switch errors
- **Fallback**: Provide fallback options

#### Permission Issues
- **Check Permissions**: Verify required permissions
- **Request Permissions**: Request missing permissions
- **Handle Denial**: Handle permission denial
- **Retry Logic**: Implement retry logic

## Next Steps

Now that you understand integration:

1. **[Provider Events](./provider-events.md)** - Learn about provider events
2. **[RPC Methods](./rpc-methods.md)** - Understand RPC methods
3. **[Network Compatibility](./network-compatibility.md)** - Learn network compatibility
4. **[Architecture Overview](./architecture-overview.md)** - Understand architecture

---

**Ready to learn about events?** Continue to [Provider Events](./provider-events.md)!
