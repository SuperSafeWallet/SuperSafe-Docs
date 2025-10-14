---
sidebar_position: 3
---

# 🔌 RPC Methods

Learn about the RPC methods supported by SuperSafe Wallet, including EIP-1193 standard methods and custom extensions.

## Overview

SuperSafe Wallet implements the **EIP-1193 standard** for Ethereum provider RPC methods, providing a consistent interface for dApp integration. All methods are accessible through the `window.ethereum.request()` function.

### Method Categories

- **Account Methods**: Account management and access
- **Network Methods**: Network information and switching
- **Transaction Methods**: Transaction creation and signing
- **Signing Methods**: Message and data signing
- **Utility Methods**: Utility and permission methods

## Account Methods

### eth_requestAccounts

#### Description
Requests access to user accounts. This is the primary method for connecting to the wallet.

#### Parameters
```javascript
// No parameters required
```

#### Returns
```javascript
// Returns array of account addresses
string[] // Array of connected account addresses
```

#### Example Usage
```javascript
const connectWallet = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    console.log('Connected accounts:', accounts);
    return accounts;
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
};
```

#### Error Codes
- **4001**: User rejected the request
- **4100**: Unauthorized - request method not supported
- **4200**: Unsupported method

### eth_accounts

#### Description
Returns the currently connected accounts without requesting access.

#### Parameters
```javascript
// No parameters required
```

#### Returns
```javascript
// Returns array of account addresses
string[] // Array of connected account addresses
```

#### Example Usage
```javascript
const getAccounts = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    
    if (accounts.length === 0) {
      console.log('No accounts connected');
    } else {
      console.log('Connected accounts:', accounts);
    }
    
    return accounts;
  } catch (error) {
    console.error('Failed to get accounts:', error);
    throw error;
  }
};
```

### eth_coinbase

#### Description
Returns the current account address (first account in the accounts array).

#### Parameters
```javascript
// No parameters required
```

#### Returns
```javascript
// Returns current account address
string // Current account address or null
```

#### Example Usage
```javascript
const getCurrentAccount = async () => {
  try {
    const coinbase = await window.ethereum.request({
      method: 'eth_coinbase'
    });
    
    console.log('Current account:', coinbase);
    return coinbase;
  } catch (error) {
    console.error('Failed to get current account:', error);
    throw error;
  }
};
```

## Network Methods

### eth_chainId

#### Description
Returns the current chain ID of the connected network.

#### Parameters
```javascript
// No parameters required
```

#### Returns
```javascript
// Returns chain ID as hex string
string // Chain ID in hex format (e.g., "0x1" for Ethereum)
```

#### Example Usage
```javascript
const getChainId = async () => {
  try {
    const chainId = await window.ethereum.request({
      method: 'eth_chainId'
    });
    
    console.log('Current chain ID:', chainId);
    
    // Convert to decimal for easier handling
    const chainIdDecimal = parseInt(chainId, 16);
    console.log('Chain ID (decimal):', chainIdDecimal);
    
    return chainId;
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    throw error;
  }
};
```

#### Supported Chain IDs
```javascript
const SUPPORTED_CHAINS = {
  '0x1': 'Ethereum Mainnet',
  '0xa': 'Optimism',
  '0x14a2': 'SuperSeed',
  '0x89': 'Polygon',
  '0x38': 'BSC'
};
```

### wallet_switchEthereumChain

#### Description
Switches the wallet to the specified network.

#### Parameters
```javascript
{
  method: 'wallet_switchEthereumChain',
  params: [{
    chainId: string // Chain ID to switch to
  }]
}
```

#### Returns
```javascript
// Returns null on success
null
```

#### Example Usage
```javascript
const switchNetwork = async (chainId) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    });
    
    console.log('Network switched to:', chainId);
  } catch (error) {
    if (error.code === 4902) {
      // Chain not added, request to add it
      await addEthereumChain(chainId);
    } else {
      console.error('Failed to switch network:', error);
      throw error;
    }
  }
};
```

#### Error Codes
- **4001**: User rejected the request
- **4902**: Chain not added to wallet

### wallet_addEthereumChain

#### Description
Adds a new network to the wallet.

#### Parameters
```javascript
{
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: string, // Chain ID
    chainName: string, // Human-readable chain name
    rpcUrls: string[], // Array of RPC URLs
    blockExplorerUrls: string[], // Array of block explorer URLs
    nativeCurrency: {
      name: string, // Currency name
      symbol: string, // Currency symbol
      decimals: number // Number of decimals
    }
  }]
}
```

#### Returns
```javascript
// Returns null on success
null
```

#### Example Usage
```javascript
const addEthereumChain = async (chainId) => {
  const chainConfig = {
    chainId: '0x89', // Polygon
    chainName: 'Polygon',
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    }
  };
  
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [chainConfig]
    });
    
    console.log('Network added successfully');
  } catch (error) {
    console.error('Failed to add network:', error);
    throw error;
  }
};
```

## Transaction Methods

### eth_sendTransaction

#### Description
Sends a transaction to the network.

#### Parameters
```javascript
{
  method: 'eth_sendTransaction',
  params: [{
    from: string, // Sender address
    to: string, // Recipient address
    value: string, // Value in wei (hex)
    gas: string, // Gas limit (hex)
    gasPrice: string, // Gas price in wei (hex)
    data: string // Transaction data (hex)
  }]
}
```

#### Returns
```javascript
// Returns transaction hash
string // Transaction hash
```

#### Example Usage
```javascript
const sendTransaction = async (to, value) => {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    
    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: accounts[0],
        to: to,
        value: value, // Value in wei
        gas: '0x5208', // 21000 gas
        gasPrice: '0x3b9aca00' // 1 gwei
      }]
    });
    
    console.log('Transaction sent:', transactionHash);
    return transactionHash;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};
```

#### Error Codes
- **4001**: User rejected the request
- **4100**: Unauthorized - request method not supported
- **4200**: Unsupported method

### eth_signTransaction

#### Description
Signs a transaction without sending it.

#### Parameters
```javascript
{
  method: 'eth_signTransaction',
  params: [{
    from: string, // Sender address
    to: string, // Recipient address
    value: string, // Value in wei (hex)
    gas: string, // Gas limit (hex)
    gasPrice: string, // Gas price in wei (hex)
    data: string // Transaction data (hex)
  }]
}
```

#### Returns
```javascript
// Returns signed transaction
{
  raw: string, // Raw transaction (hex)
  tx: {
    // Transaction object
  }
}
```

#### Example Usage
```javascript
const signTransaction = async (to, value) => {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    
    const signedTx = await window.ethereum.request({
      method: 'eth_signTransaction',
      params: [{
        from: accounts[0],
        to: to,
        value: value,
        gas: '0x5208',
        gasPrice: '0x3b9aca00'
      }]
    });
    
    console.log('Transaction signed:', signedTx);
    return signedTx;
  } catch (error) {
    console.error('Signing failed:', error);
    throw error;
  }
};
```

## Signing Methods

### personal_sign

#### Description
Signs a message using the personal message format.

#### Parameters
```javascript
{
  method: 'personal_sign',
  params: [
    string, // Message to sign (hex)
    string  // Account address
  ]
}
```

#### Returns
```javascript
// Returns signature
string // Signature (hex)
```

#### Example Usage
```javascript
const signMessage = async (message) => {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    
    // Convert message to hex
    const messageHex = '0x' + Buffer.from(message, 'utf8').toString('hex');
    
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [messageHex, accounts[0]]
    });
    
    console.log('Message signed:', signature);
    return signature;
  } catch (error) {
    console.error('Signing failed:', error);
    throw error;
  }
};
```

### eth_sign

#### Description
Signs data using the eth_sign method.

#### Parameters
```javascript
{
  method: 'eth_sign',
  params: [
    string, // Account address
    string  // Data to sign (hex)
  ]
}
```

#### Returns
```javascript
// Returns signature
string // Signature (hex)
```

#### Example Usage
```javascript
const signData = async (data) => {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    
    const signature = await window.ethereum.request({
      method: 'eth_sign',
      params: [accounts[0], data]
    });
    
    console.log('Data signed:', signature);
    return signature;
  } catch (error) {
    console.error('Signing failed:', error);
    throw error;
  }
};
```

### eth_signTypedData_v4

#### Description
Signs typed data using EIP-712.

#### Parameters
```javascript
{
  method: 'eth_signTypedData_v4',
  params: [
    string, // Account address
    string  // Typed data (JSON string)
  ]
}
```

#### Returns
```javascript
// Returns signature
string // Signature (hex)
```

#### Example Usage
```javascript
const signTypedData = async (domain, types, message) => {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    
    const typedData = {
      domain: domain,
      types: types,
      primaryType: 'Message',
      message: message
    };
    
    const signature = await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [accounts[0], JSON.stringify(typedData)]
    });
    
    console.log('Typed data signed:', signature);
    return signature;
  } catch (error) {
    console.error('Signing failed:', error);
    throw error;
  }
};
```

## Utility Methods

### eth_requestPermissions

#### Description
Requests specific permissions from the user.

#### Parameters
```javascript
{
  method: 'eth_requestPermissions',
  params: [{
    eth_accounts: {} // Request account access
  }]
}
```

#### Returns
```javascript
// Returns permissions array
[{
  parentCapability: string, // Permission name
  date: number, // Grant date
  caveats: [{
    type: string, // Caveat type
    value: any // Caveat value
  }]
}]
```

#### Example Usage
```javascript
const requestPermissions = async () => {
  try {
    const permissions = await window.ethereum.request({
      method: 'eth_requestPermissions',
      params: [{
        eth_accounts: {}
      }]
    });
    
    console.log('Permissions granted:', permissions);
    return permissions;
  } catch (error) {
    console.error('Permission request failed:', error);
    throw error;
  }
};
```

### wallet_getPermissions

#### Description
Returns the current permissions granted to the dApp.

#### Parameters
```javascript
// No parameters required
```

#### Returns
```javascript
// Returns permissions array
[{
  parentCapability: string, // Permission name
  date: number, // Grant date
  caveats: [{
    type: string, // Caveat type
    value: any // Caveat value
  }]
}]
```

#### Example Usage
```javascript
const getPermissions = async () => {
  try {
    const permissions = await window.ethereum.request({
      method: 'wallet_getPermissions'
    });
    
    console.log('Current permissions:', permissions);
    return permissions;
  } catch (error) {
    console.error('Failed to get permissions:', error);
    throw error;
  }
};
```

## Error Handling

### Common Error Codes

#### EIP-1193 Error Codes
```javascript
const ERROR_CODES = {
  4001: 'User rejected the request',
  4100: 'Unauthorized - request method not supported',
  4200: 'Unsupported method',
  4900: 'Disconnected from chain',
  4901: 'Chain disconnected',
  4902: 'Chain not added to wallet'
};
```

#### Error Handling Example
```javascript
const handleRpcError = (error) => {
  switch (error.code) {
    case 4001:
      console.log('User rejected the request');
      showUserMessage('Transaction was rejected');
      break;
    case 4100:
      console.log('Unauthorized - request method not supported');
      showUserMessage('This action is not supported');
      break;
    case 4200:
      console.log('Unsupported method');
      showUserMessage('This method is not supported');
      break;
    case 4900:
      console.log('Disconnected from chain');
      showUserMessage('Wallet disconnected');
      break;
    case 4901:
      console.log('Chain disconnected');
      showUserMessage('Network disconnected');
      break;
    case 4902:
      console.log('Chain not added to wallet');
      showUserMessage('Network not added to wallet');
      break;
    default:
      console.log('Unknown error:', error);
      showUserMessage('An unexpected error occurred');
  }
};
```

## Best Practices

### Method Usage Guidelines

#### Performance
- **Batch Requests**: Batch multiple requests when possible
- **Cache Results**: Cache frequently used data
- **Minimize Calls**: Minimize unnecessary RPC calls
- **Use Events**: Use events instead of polling

#### Error Handling
- **Try-Catch Blocks**: Wrap all RPC calls in try-catch
- **Error Logging**: Log errors for debugging
- **User Feedback**: Provide user-friendly error messages
- **Graceful Degradation**: Handle errors gracefully

#### Security
- **Validate Inputs**: Validate all input parameters
- **Check Permissions**: Verify required permissions
- **Sanitize Data**: Sanitize user input
- **Use HTTPS**: Always use HTTPS for dApps

## Testing

### Unit Testing

#### Mock Provider
```javascript
// Mock SuperSafe provider for testing
const mockProvider = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  isSuperSafe: true
};

// Test RPC method
test('should request accounts', async () => {
  mockProvider.request.mockResolvedValue(['0x123...']);
  
  const accounts = await requestAccounts(mockProvider);
  
  expect(mockProvider.request).toHaveBeenCalledWith({
    method: 'eth_requestAccounts'
  });
  expect(accounts).toEqual(['0x123...']);
});
```

#### Integration Testing
```javascript
// Test with real SuperSafe extension
test('should connect to SuperSafe', async () => {
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

## Next Steps

Now that you understand RPC methods:

1. **[Network Compatibility](./network-compatibility.md)** - Learn about network compatibility
2. **[Architecture Overview](./architecture-overview.md)** - Understand architecture
3. **[Provider Events](./provider-events.md)** - Learn about provider events
4. **[Integration Overview](./integration-overview.md)** - Review integration guide

---

**Ready to learn about network compatibility?** Continue to [Network Compatibility](./network-compatibility.md)!
