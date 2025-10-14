---
sidebar_position: 4
---

# 🌐 Networks Configuration

Learn how SuperSafe Wallet configures and manages multiple blockchain networks, including active networks, planned networks, and network-specific features.

## Network Overview

SuperSafe Wallet supports multiple blockchain networks with a **Smart Native Connection** architecture that ensures real chainIds and seamless dApp integration across all supported networks.

### Network Architecture

```
Network Architecture:
├── Active Networks (2)
│   ├── SuperSeed (Chain ID: 5330)
│   └── Optimism (Chain ID: 10)
├── Planned Networks (5)
│   ├── Ethereum (Chain ID: 1)
│   ├── Base (Chain ID: 8453)
│   ├── BSC (Chain ID: 56)
│   ├── Ethereum Sepolia (Chain ID: 11155111)
│   └── SuperSeed Sepolia (Chain ID: 53302)
└── Network Features
    ├── Swap Support
    ├── RPC Endpoints
    ├── Block Explorers
    └── Native Currencies
```

## Active Networks

### SuperSeed (Chain ID: 5330)

#### Network Configuration
```javascript
const SUPERSEED_CONFIG = {
  chainId: 5330,
  name: 'SuperSeed',
  network: 'superseed',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: 'https://mainnet.superseed.xyz',
    public: 'https://mainnet.superseed.xyz'
  },
  blockExplorers: {
    default: {
      name: 'SuperSeed Explorer',
      url: 'https://explorer.superseed.xyz'
    }
  },
  features: {
    swap: {
      protocol: 'Bebop JAM',
      apiUrl: 'https://api.bebop.xyz/jam/superseed/v2/',
      contracts: {
        BEBOP_CONTRACT: '0x...',
        PERMIT2_CONTRACT: '0x...'
      }
    },
    tokens: {
      native: 'ETH',
      network: 'SUPR',
      stablecoin: 'USDC'
    }
  }
};
```

#### SuperSeed Features
- **Native Token**: ETH (gas and transfers)
- **Network Token**: SUPR (SuperSeed network token)
- **Stablecoin**: USDC (USD Coin on SuperSeed)
- **Swap Support**: Bebop JAM protocol
- **RPC Endpoint**: `https://mainnet.superseed.xyz`
- **Explorer**: `https://explorer.superseed.xyz`

### Optimism (Chain ID: 10)

#### Network Configuration
```javascript
const OPTIMISM_CONFIG = {
  chainId: 10,
  name: 'Optimism',
  network: 'optimism',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: 'https://mainnet.optimism.io',
    public: 'https://mainnet.optimism.io'
  },
  blockExplorers: {
    default: {
      name: 'Optimistic Etherscan',
      url: 'https://optimistic.etherscan.io'
    }
  },
  features: {
    swap: {
      protocol: 'Bebop JAM + RFQ',
      apiUrl: 'https://api.bebop.xyz/jam/optimism/v2/',
      contracts: {
        BEBOP_CONTRACT: '0x...',
        PERMIT2_CONTRACT: '0x...'
      }
    },
    tokens: {
      native: 'ETH',
      network: 'OP',
      stablecoin: 'USDC'
    }
  }
};
```

#### Optimism Features
- **Native Token**: ETH (gas and transfers)
- **Network Token**: OP (Optimism token)
- **Stablecoin**: USDC (USD Coin on Optimism)
- **Swap Support**: Bebop JAM + RFQ protocols
- **RPC Endpoint**: Alchemy endpoint
- **Explorer**: `https://optimistic.etherscan.io`

## Planned Networks

### Ethereum (Chain ID: 1)

#### Network Configuration
```javascript
const ETHEREUM_CONFIG = {
  chainId: 1,
  name: 'Ethereum Mainnet',
  network: 'ethereum',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    public: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io'
    }
  },
  features: {
    swap: {
      protocol: 'Bebop JAM + RFQ',
      apiUrl: 'https://api.bebop.xyz/jam/ethereum/v2/',
      contracts: {
        BEBOP_CONTRACT: '0x...',
        PERMIT2_CONTRACT: '0x...'
      }
    },
    tokens: {
      native: 'ETH',
      stablecoin: 'USDC'
    }
  }
};
```

### Base (Chain ID: 8453)

#### Network Configuration
```javascript
const BASE_CONFIG = {
  chainId: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: 'https://mainnet.base.org',
    public: 'https://mainnet.base.org'
  },
  blockExplorers: {
    default: {
      name: 'Basescan',
      url: 'https://basescan.org'
    }
  },
  features: {
    swap: {
      protocol: 'Bebop JAM + RFQ',
      apiUrl: 'https://api.bebop.xyz/jam/base/v2/',
      contracts: {
        BEBOP_CONTRACT: '0x...',
        PERMIT2_CONTRACT: '0x...'
      }
    },
    tokens: {
      native: 'ETH',
      stablecoin: 'USDC'
    }
  }
};
```

### BSC (Chain ID: 56)

#### Network Configuration
```javascript
const BSC_CONFIG = {
  chainId: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: {
    default: 'https://bsc-dataseed.binance.org',
    public: 'https://bsc-dataseed.binance.org'
  },
  blockExplorers: {
    default: {
      name: 'BSCScan',
      url: 'https://bscscan.com'
    }
  },
  features: {
    swap: {
      protocol: 'Bebop JAM + RFQ',
      apiUrl: 'https://api.bebop.xyz/jam/bsc/v2/',
      contracts: {
        BEBOP_CONTRACT: '0x...',
        PERMIT2_CONTRACT: '0x...'
      }
    },
    tokens: {
      native: 'BNB',
      stablecoin: 'USDT'
    }
  }
};
```

## Network Management

### Network Configuration System

#### Network Registry
```javascript
class NetworkRegistry {
  constructor() {
    this.networks = new Map();
    this.activeNetworks = new Set();
    this.loadNetworks();
  }

  loadNetworks() {
    // Load active networks
    this.networks.set('0x14a2', SUPERSEED_CONFIG);
    this.networks.set('0xa', OPTIMISM_CONFIG);
    
    // Mark as active
    this.activeNetworks.add('0x14a2');
    this.activeNetworks.add('0xa');
    
    // Load planned networks
    this.networks.set('0x1', ETHEREUM_CONFIG);
    this.networks.set('0x2105', BASE_CONFIG);
    this.networks.set('0x38', BSC_CONFIG);
  }

  getNetwork(chainId) {
    return this.networks.get(chainId);
  }

  getActiveNetworks() {
    return Array.from(this.activeNetworks).map(chainId => 
      this.networks.get(chainId)
    );
  }

  getPlannedNetworks() {
    return Array.from(this.networks.entries())
      .filter(([chainId]) => !this.activeNetworks.has(chainId))
      .map(([chainId, config]) => config);
  }

  isNetworkActive(chainId) {
    return this.activeNetworks.has(chainId);
  }

  isNetworkSupported(chainId) {
    return this.networks.has(chainId);
  }
}
```

#### Network Switch Service
```javascript
class NetworkSwitchService {
  constructor(networkRegistry) {
    this.networkRegistry = networkRegistry;
    this.currentNetwork = null;
    this.setupNetworkSwitch();
  }

  setupNetworkSwitch() {
    // Listen for network switch requests
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'SWITCH_NETWORK') {
        this.handleNetworkSwitch(message.chainId, sendResponse);
        return true; // Keep message channel open
      }
    });
  }

  async handleNetworkSwitch(chainId, sendResponse) {
    try {
      // Validate network
      if (!this.networkRegistry.isNetworkSupported(chainId)) {
        throw new Error('Unsupported network');
      }

      // Check if network is active
      if (!this.networkRegistry.isNetworkActive(chainId)) {
        throw new Error('Network not yet active');
      }

      // Switch network
      await this.switchToNetwork(chainId);
      
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }

  async switchToNetwork(chainId) {
    const network = this.networkRegistry.getNetwork(chainId);
    
    // Update current network
    this.currentNetwork = network;
    
    // Update network provider
    await this.updateNetworkProvider(network);
    
    // Emit network changed event
    this.emitNetworkChangedEvent(network);
    
    // Update UI
    this.updateNetworkUI(network);
  }

  async updateNetworkProvider(network) {
    // Create new provider for network
    const provider = new ethers.JsonRpcProvider(network.rpcUrls.default);
    
    // Store provider
    this.networkProviders.set(network.chainId, provider);
  }

  emitNetworkChangedEvent(network) {
    // Emit event to frontend
    chrome.runtime.sendMessage({
      type: 'NETWORK_CHANGED',
      chainId: network.chainId,
      network: network
    });
  }
}
```

### Network Validation

#### Network Compatibility Check
```javascript
class NetworkValidator {
  constructor() {
    this.validationRules = new Map();
    this.setupValidationRules();
  }

  setupValidationRules() {
    this.validationRules.set('rpc', {
      required: true,
      type: 'string',
      format: 'url'
    });
    
    this.validationRules.set('chainId', {
      required: true,
      type: 'number',
      min: 1,
      max: 999999999
    });
    
    this.validationRules.set('nativeCurrency', {
      required: true,
      type: 'object',
      properties: {
        name: { required: true, type: 'string' },
        symbol: { required: true, type: 'string' },
        decimals: { required: true, type: 'number', min: 0, max: 18 }
      }
    });
  }

  validateNetwork(network) {
    const errors = [];
    
    for (const [field, rule] of this.validationRules) {
      const value = network[field];
      
      if (rule.required && !value) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (value && rule.type && typeof value !== rule.type) {
        errors.push(`${field} must be of type ${rule.type}`);
      }
      
      if (value && rule.format) {
        if (!this.validateFormat(value, rule.format)) {
          errors.push(`${field} has invalid format`);
        }
      }
      
      if (value && rule.properties) {
        const propertyErrors = this.validateObject(value, rule.properties);
        errors.push(...propertyErrors);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  validateFormat(value, format) {
    switch (format) {
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  }

  validateObject(obj, rules) {
    const errors = [];
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = obj[field];
      
      if (rule.required && !value) {
        errors.push(`${field} is required`);
      }
      
      if (value && rule.type && typeof value !== rule.type) {
        errors.push(`${field} must be of type ${rule.type}`);
      }
      
      if (value && rule.min !== undefined && value < rule.min) {
        errors.push(`${field} must be at least ${rule.min}`);
      }
      
      if (value && rule.max !== undefined && value > rule.max) {
        errors.push(`${field} must be at most ${rule.max}`);
      }
    }
    
    return errors;
  }
}
```

## Network-Specific Features

### Swap Integration

#### Swap Protocol Configuration
```javascript
const SWAP_PROTOCOLS = {
  '0x14a2': { // SuperSeed
    protocol: 'Bebop JAM',
    apiUrl: 'https://api.bebop.xyz/jam/superseed/v2/',
    contracts: {
      BEBOP_CONTRACT: '0x...',
      PERMIT2_CONTRACT: '0x...'
    }
  },
  '0xa': { // Optimism
    protocol: 'Bebop JAM + RFQ',
    apiUrl: 'https://api.bebop.xyz/jam/optimism/v2/',
    contracts: {
      BEBOP_CONTRACT: '0x...',
      PERMIT2_CONTRACT: '0x...'
    }
  },
  '0x1': { // Ethereum
    protocol: 'Bebop JAM + RFQ',
    apiUrl: 'https://api.bebop.xyz/jam/ethereum/v2/',
    contracts: {
      BEBOP_CONTRACT: '0x...',
      PERMIT2_CONTRACT: '0x...'
    }
  }
};
```

#### Swap Service
```javascript
class SwapService {
  constructor(networkRegistry) {
    this.networkRegistry = networkRegistry;
    this.swapClients = new Map();
    this.setupSwapClients();
  }

  setupSwapClients() {
    for (const [chainId, network] of this.networkRegistry.networks) {
      const swapConfig = network.features?.swap;
      if (swapConfig) {
        this.swapClients.set(chainId, new SwapClient(swapConfig));
      }
    }
  }

  async getQuote(chainId, fromToken, toToken, amount) {
    const swapClient = this.swapClients.get(chainId);
    if (!swapClient) {
      throw new Error('Swap not supported on this network');
    }
    
    return await swapClient.getQuote(fromToken, toToken, amount);
  }

  async executeSwap(chainId, swapData) {
    const swapClient = this.swapClients.get(chainId);
    if (!swapClient) {
      throw new Error('Swap not supported on this network');
    }
    
    return await swapClient.executeSwap(swapData);
  }
}
```

### Token Support

#### Token Configuration
```javascript
const TOKEN_CONFIGS = {
  '0x14a2': { // SuperSeed
    native: 'ETH',
    network: 'SUPR',
    stablecoin: 'USDC',
    tokens: [
      { address: '0x...', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
      { address: '0x...', symbol: 'SUPR', name: 'SuperSeed Token', decimals: 18 }
    ]
  },
  '0xa': { // Optimism
    native: 'ETH',
    network: 'OP',
    stablecoin: 'USDC',
    tokens: [
      { address: '0x...', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
      { address: '0x...', symbol: 'OP', name: 'Optimism Token', decimals: 18 }
    ]
  }
};
```

#### Token Service
```javascript
class TokenService {
  constructor(networkRegistry) {
    this.networkRegistry = networkRegistry;
    this.tokenConfigs = TOKEN_CONFIGS;
  }

  getSupportedTokens(chainId) {
    return this.tokenConfigs[chainId]?.tokens || [];
  }

  getNativeToken(chainId) {
    return this.tokenConfigs[chainId]?.native || 'ETH';
  }

  getNetworkToken(chainId) {
    return this.tokenConfigs[chainId]?.network || null;
  }

  getStablecoin(chainId) {
    return this.tokenConfigs[chainId]?.stablecoin || 'USDC';
  }

  async getTokenBalance(chainId, tokenAddress, walletAddress) {
    const network = this.networkRegistry.getNetwork(chainId);
    const provider = new ethers.JsonRpcProvider(network.rpcUrls.default);
    
    if (tokenAddress === 'native') {
      return await provider.getBalance(walletAddress);
    }
    
    // ERC-20 token balance
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    return await contract.balanceOf(walletAddress);
  }
}
```

## Network Switching

### Smart Native Connection

#### Network Switch Flow
```javascript
class SmartNativeConnection {
  constructor(networkRegistry) {
    this.networkRegistry = networkRegistry;
    this.setupConnection();
  }

  setupConnection() {
    // Listen for dApp connection requests
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'CONNECTION_REQUEST') {
        this.handleConnectionRequest(message, sendResponse);
        return true;
      }
    });
  }

  async handleConnectionRequest(message, sendResponse) {
    const { origin, requestedChainId } = message;
    
    try {
      // Check if dApp supports current network
      const currentChainId = this.getCurrentChainId();
      if (requestedChainId && requestedChainId !== currentChainId) {
        // Request network switch
        const switchApproved = await this.requestNetworkSwitch(requestedChainId);
        if (!switchApproved) {
          throw new Error('Network switch rejected by user');
        }
      }
      
      // Establish connection
      await this.establishConnection(origin);
      
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }

  async requestNetworkSwitch(chainId) {
    // Show network switch modal
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: 'SHOW_NETWORK_SWITCH_MODAL',
        chainId: chainId
      }, (response) => {
        resolve(response.approved);
      });
    });
  }
}
```

### Network Switch UI

#### Network Switch Modal
```javascript
const NetworkSwitchModal = ({ targetNetwork, onApprove, onReject }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await onApprove();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onReject}>
      <div className="network-switch-modal">
        <h2>Network Switch Required</h2>
        <p>
          This dApp requires {targetNetwork.name} (Chain ID: {targetNetwork.chainId})
        </p>
        <p>Switch to {targetNetwork.name}?</p>
        <div className="modal-actions">
          <button onClick={onReject} disabled={isLoading}>
            Cancel
          </button>
          <button onClick={handleApprove} disabled={isLoading}>
            {isLoading ? 'Switching...' : 'Switch Network'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
```

## Network Monitoring

### Network Health Monitoring

#### Health Check Service
```javascript
class NetworkHealthService {
  constructor(networkRegistry) {
    this.networkRegistry = networkRegistry;
    this.healthStatus = new Map();
    this.setupHealthMonitoring();
  }

  setupHealthMonitoring() {
    // Check network health every 5 minutes
    setInterval(() => {
      this.checkAllNetworks();
    }, 5 * 60 * 1000);
  }

  async checkAllNetworks() {
    for (const [chainId, network] of this.networkRegistry.networks) {
      if (this.networkRegistry.isNetworkActive(chainId)) {
        await this.checkNetworkHealth(chainId, network);
      }
    }
  }

  async checkNetworkHealth(chainId, network) {
    try {
      const provider = new ethers.JsonRpcProvider(network.rpcUrls.default);
      
      // Check RPC endpoint
      const blockNumber = await provider.getBlockNumber();
      
      // Check response time
      const startTime = Date.now();
      await provider.getBlockNumber();
      const responseTime = Date.now() - startTime;
      
      this.healthStatus.set(chainId, {
        status: 'healthy',
        blockNumber: blockNumber,
        responseTime: responseTime,
        lastCheck: Date.now()
      });
    } catch (error) {
      this.healthStatus.set(chainId, {
        status: 'unhealthy',
        error: error.message,
        lastCheck: Date.now()
      });
    }
  }

  getNetworkHealth(chainId) {
    return this.healthStatus.get(chainId);
  }
}
```

## Troubleshooting

### Common Network Issues

#### Network Connection Issues
- **Check RPC Endpoint**: Verify RPC endpoint is accessible
- **Check Network Status**: Verify network is operational
- **Check Response Time**: Monitor response times
- **Check Error Messages**: Review error messages

#### Network Switch Issues
- **Check Network Support**: Verify network is supported
- **Check User Consent**: Ensure user approved switch
- **Check Network Validation**: Validate network configuration
- **Check Error Handling**: Handle switch errors

## Next Steps

Now that you understand network configuration:

1. **[Storage Architecture](./storage.md)** - Learn about storage architecture
2. **[Swap Integration](./swap-integration.md)** - Understand swap integration
3. **[Main Components](./main-components.md)** - Review main components
4. **[Architecture Deep Dive](./architecture-deep-dive.md)** - Review architecture details

---

**Ready to learn about storage architecture?** Continue to [Storage Architecture](./storage.md)!
