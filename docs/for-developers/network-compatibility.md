---
sidebar_position: 4
---

# 🌐 Network Compatibility

Learn how to ensure your dApp works seamlessly across different networks with SuperSafe's Smart Native Connection architecture.

## Overview

SuperSafe Wallet implements **Smart Native Connection** architecture that ensures your dApp works correctly across all supported networks without compatibility hacks or fake chainIds.

### Key Principles

- **Real ChainIds Only**: Never use fake chainIds for compatibility
- **Network-First Approach**: Respect dApp's supported networks
- **User Consent**: Always ask for network changes
- **Automatic Detection**: Detect dApp framework automatically

## Supported Networks

### Active Networks

#### SuperSeed (Chain ID: 5330)
- **Type**: Layer 1 blockchain
- **Native Token**: ETH
- **Network Token**: SUPR
- **RPC**: `https://mainnet.superseed.xyz`
- **Explorer**: `https://explorer.superseed.xyz`
- **Swap Support**: Bebop JAM

#### Optimism (Chain ID: 10)
- **Type**: Layer 2 (Optimistic Rollup)
- **Native Token**: ETH
- **Network Token**: OP
- **RPC**: Alchemy endpoint
- **Explorer**: `https://optimistic.etherscan.io`
- **Swap Support**: Bebop JAM + RFQ

### Planned Networks

#### Ethereum (Chain ID: 1)
- **Type**: Layer 1 blockchain
- **Native Token**: ETH
- **RPC**: Multiple providers
- **Explorer**: `https://etherscan.io`
- **Swap Support**: Bebop JAM + RFQ

#### Base (Chain ID: 8453)
- **Type**: Layer 2 (Optimistic Rollup)
- **Native Token**: ETH
- **RPC**: Multiple providers
- **Explorer**: `https://basescan.org`
- **Swap Support**: Bebop JAM + RFQ

#### BSC (Chain ID: 56)
- **Type**: Layer 1 blockchain
- **Native Token**: BNB
- **RPC**: Multiple providers
- **Explorer**: `https://bscscan.com`
- **Swap Support**: Bebop JAM + RFQ

## Network Detection

### Current Network Detection

#### Get Current Chain ID
```javascript
const getCurrentNetwork = async () => {
  try {
    const chainId = await window.ethereum.request({
      method: 'eth_chainId'
    });
    
    const networkInfo = getNetworkInfo(chainId);
    console.log('Current network:', networkInfo);
    return networkInfo;
  } catch (error) {
    console.error('Failed to get current network:', error);
    throw error;
  }
};
```

#### Network Information Mapping
```javascript
const NETWORK_INFO = {
  '0x1': {
    name: 'Ethereum Mainnet',
    chainId: 1,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/YOUR_PROJECT_ID'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  '0xa': {
    name: 'Optimism',
    chainId: 10,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io']
  },
  '0x14a2': {
    name: 'SuperSeed',
    chainId: 5330,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.superseed.xyz'],
    blockExplorerUrls: ['https://explorer.superseed.xyz']
  }
};

const getNetworkInfo = (chainId) => {
  return NETWORK_INFO[chainId] || {
    name: 'Unknown Network',
    chainId: parseInt(chainId, 16),
    nativeCurrency: { name: 'Unknown', symbol: 'UNK', decimals: 18 },
    rpcUrls: [],
    blockExplorerUrls: []
  };
};
```

### Network Change Detection

#### Listen for Network Changes
```javascript
const setupNetworkListener = () => {
  window.ethereum.on('chainChanged', (chainId) => {
    console.log('Network changed to:', chainId);
    
    const networkInfo = getNetworkInfo(chainId);
    updateUIForNetwork(networkInfo);
    
    // Check if dApp supports this network
    if (!isNetworkSupported(chainId)) {
      showNetworkSwitchModal(chainId);
    }
  });
};
```

#### Network Change Handler
```javascript
const handleNetworkChange = (chainId) => {
  const networkInfo = getNetworkInfo(chainId);
  
  // Update UI elements
  updateNetworkDisplay(networkInfo);
  
  // Update contract addresses if needed
  updateContractAddresses(networkInfo.chainId);
  
  // Refresh data for new network
  refreshDataForNetwork(networkInfo.chainId);
  
  // Show notification
  showNotification(`Switched to ${networkInfo.name}`);
};
```

## Network Switching

### Request Network Switch

#### Switch to Specific Network
```javascript
const switchToNetwork = async (targetChainId) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainId }]
    });
    
    console.log('Network switched successfully');
  } catch (error) {
    if (error.code === 4902) {
      // Chain not added, request to add it
      await addNetwork(targetChainId);
    } else {
      console.error('Failed to switch network:', error);
      throw error;
    }
  }
};
```

#### Add New Network
```javascript
const addNetwork = async (chainId) => {
  const networkConfig = getNetworkConfig(chainId);
  
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkConfig]
    });
    
    console.log('Network added successfully');
  } catch (error) {
    console.error('Failed to add network:', error);
    throw error;
  }
};
```

#### Network Configuration
```javascript
const getNetworkConfig = (chainId) => {
  const configs = {
    '0x1': {
      chainId: '0x1',
      chainName: 'Ethereum Mainnet',
      rpcUrls: ['https://mainnet.infura.io/v3/YOUR_PROJECT_ID'],
      blockExplorerUrls: ['https://etherscan.io'],
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      }
    },
    '0xa': {
      chainId: '0xa',
      chainName: 'Optimism',
      rpcUrls: ['https://mainnet.optimism.io'],
      blockExplorerUrls: ['https://optimistic.etherscan.io'],
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      }
    },
    '0x14a2': {
      chainId: '0x14a2',
      chainName: 'SuperSeed',
      rpcUrls: ['https://mainnet.superseed.xyz'],
      blockExplorerUrls: ['https://explorer.superseed.xyz'],
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      }
    }
  };
  
  return configs[chainId];
};
```

### Network Compatibility Check

#### Check if Network is Supported
```javascript
const SUPPORTED_NETWORKS = ['0x1', '0xa', '0x14a2']; // Ethereum, Optimism, SuperSeed

const isNetworkSupported = (chainId) => {
  return SUPPORTED_NETWORKS.includes(chainId);
};

const checkNetworkCompatibility = async () => {
  try {
    const chainId = await window.ethereum.request({
      method: 'eth_chainId'
    });
    
    if (!isNetworkSupported(chainId)) {
      showNetworkSwitchModal(chainId);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to check network compatibility:', error);
    return false;
  }
};
```

#### Network Switch Modal
```javascript
const showNetworkSwitchModal = (currentChainId) => {
  const currentNetwork = getNetworkInfo(currentChainId);
  const supportedNetworks = SUPPORTED_NETWORKS.map(chainId => getNetworkInfo(chainId));
  
  const modal = createNetworkSwitchModal({
    currentNetwork,
    supportedNetworks,
    onNetworkSelect: switchToNetwork,
    onCancel: () => console.log('Network switch cancelled')
  });
  
  document.body.appendChild(modal);
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

### Network Policy Enforcement

#### Check Network Compatibility
```javascript
const checkNetworkCompatibility = (origin, chainId) => {
  const policy = getPolicyForOrigin(origin);
  
  if (!policy) {
    return { allowed: false, reason: 'Not in AllowList' };
  }
  
  if (!policy.networks.includes(chainId)) {
    return { 
      allowed: false, 
      reason: 'Network not supported by dApp',
      supportedNetworks: policy.networks
    };
  }
  
  return { allowed: true };
};
```

#### Policy Lookup
```javascript
const getPolicyForOrigin = (origin) => {
  // This would typically come from the AllowList
  const allowList = {
    'https://app.uniswap.org': {
      allowed: true,
      networks: ['0x1', '0xa', '0x14a2'],
      permissions: ['eth_requestAccounts', 'eth_sendTransaction']
    }
  };
  
  return allowList[origin];
};
```

## Framework Integration

### RainbowKit Integration

#### Network Configuration
```javascript
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient } from 'wagmi';
import { mainnet, optimism } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';

const { connectors } = getDefaultWallets({
  appName: 'My dApp',
  projectId: 'your-project-id',
  chains: [mainnet, optimism] // Add SuperSeed when available
});

const { chains, provider } = configureChains(
  [mainnet, optimism],
  [
    alchemyProvider({ apiKey: 'your-alchemy-key' }),
    publicProvider()
  ]
);
```

#### Custom Chain Configuration
```javascript
import { Chain } from 'wagmi/chains';

const superSeed = {
  id: 5330,
  name: 'SuperSeed',
  network: 'superseed',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.superseed.xyz'],
    },
    public: {
      http: ['https://mainnet.superseed.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SuperSeed Explorer',
      url: 'https://explorer.superseed.xyz',
    },
  },
} as const satisfies Chain;
```

### Wagmi Integration

#### Network Configuration
```javascript
import { createConfig, http } from 'wagmi';
import { mainnet, optimism } from 'wagmi/chains';

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

#### Network Detection Hook
```javascript
import { useChainId, useSwitchChain } from 'wagmi';

function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const handleNetworkSwitch = (targetChainId) => {
    switchChain({ chainId: targetChainId });
  };
  
  return (
    <div>
      <p>Current network: {chainId}</p>
      <button onClick={() => handleNetworkSwitch(1)}>
        Switch to Ethereum
      </button>
      <button onClick={() => handleNetworkSwitch(10)}>
        Switch to Optimism
      </button>
    </div>
  );
}
```

## Best Practices

### Network Handling Guidelines

#### Always Check Network
```javascript
const initializeDApp = async () => {
  // Check if wallet is connected
  const accounts = await window.ethereum.request({
    method: 'eth_accounts'
  });
  
  if (accounts.length === 0) {
    showConnectButton();
    return;
  }
  
  // Check network compatibility
  const isCompatible = await checkNetworkCompatibility();
  if (!isCompatible) {
    return;
  }
  
  // Initialize dApp
  initializeApp();
};
```

#### Handle Network Changes
```javascript
const setupNetworkHandling = () => {
  // Listen for network changes
  window.ethereum.on('chainChanged', handleNetworkChange);
  
  // Check network on page load
  checkNetworkCompatibility();
  
  // Check network periodically
  setInterval(checkNetworkCompatibility, 30000); // Every 30 seconds
};
```

#### Provide Network Information
```javascript
const showNetworkInfo = (chainId) => {
  const networkInfo = getNetworkInfo(chainId);
  
  const networkDisplay = document.getElementById('network-display');
  networkDisplay.innerHTML = `
    <div class="network-info">
      <h3>Current Network</h3>
      <p>Name: ${networkInfo.name}</p>
      <p>Chain ID: ${networkInfo.chainId}</p>
      <p>Currency: ${networkInfo.nativeCurrency.symbol}</p>
    </div>
  `;
};
```

### Error Handling

#### Network Switch Errors
```javascript
const handleNetworkSwitchError = (error) => {
  switch (error.code) {
    case 4001:
      showError('User rejected network switch');
      break;
    case 4902:
      showError('Network not added to wallet');
      break;
    default:
      showError('Failed to switch network');
  }
};
```

#### Network Compatibility Errors
```javascript
const handleNetworkCompatibilityError = (error) => {
  if (error.code === 'NETWORK_NOT_SUPPORTED') {
    showNetworkSwitchModal(error.currentChainId);
  } else if (error.code === 'NETWORK_SWITCH_FAILED') {
    showError('Failed to switch network');
  } else {
    showError('Network compatibility error');
  }
};
```

## Testing

### Network Testing

#### Test Network Switching
```javascript
test('should switch to supported network', async () => {
  // Mock network switch
  mockProvider.request.mockResolvedValue(null);
  
  await switchToNetwork('0x1');
  
  expect(mockProvider.request).toHaveBeenCalledWith({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x1' }]
  });
});
```

#### Test Network Compatibility
```javascript
test('should check network compatibility', async () => {
  mockProvider.request.mockResolvedValue('0x1');
  
  const isCompatible = await checkNetworkCompatibility();
  
  expect(isCompatible).toBe(true);
});
```

## Troubleshooting

### Common Issues

#### Network Not Supported
- **Check AllowList**: Verify dApp is in AllowList
- **Check Network**: Verify network is supported
- **Request Switch**: Request network switch
- **Add Network**: Add network if not available

#### Network Switch Failed
- **Check Permissions**: Verify network switch permissions
- **Check Network**: Verify target network exists
- **Handle Errors**: Handle network switch errors
- **Provide Fallback**: Provide fallback options

## Next Steps

Now that you understand network compatibility:

1. **[Architecture Overview](./architecture-overview.md)** - Learn about architecture
2. **[Provider Events](./provider-events.md)** - Learn about provider events
3. **[RPC Methods](./rpc-methods.md)** - Understand RPC methods
4. **[Integration Overview](./integration-overview.md)** - Review integration guide

---

**Ready to learn about architecture?** Continue to [Architecture Overview](./architecture-overview.md)!
