---
sidebar_position: 6
---

# 🔄 Swap Integration

Learn how SuperSafe Wallet integrates with Bebop's JAM protocol to provide gasless, MEV-protected token swaps across multiple networks.

## Swap Integration Overview

SuperSafe Wallet integrates with **Bebop's JAM protocol** to provide users with gasless, MEV-protected token swaps across multiple supported networks.

### Key Features

- **Gasless Swaps**: No gas fees for users
- **MEV Protection**: Protection against Maximal Extractable Value attacks
- **Multi-Chain Support**: Swaps across multiple networks
- **Partner Fees**: 1% configurable partner fee
- **Best Prices**: Competitive pricing through Bebop's aggregation

## Bebop Integration

### Bebop JAM Protocol

#### Protocol Overview
```
Bebop JAM Protocol:
├── Quote Request
│   ├── Token Selection
│   ├── Amount Input
│   ├── Slippage Settings
│   └── Network Selection
├── Quote Response
│   ├── Price Information
│   ├── Fee Breakdown
│   ├── Execution Time
│   └── MEV Protection
├── Order Signing
│   ├── EIP-712 Signature
│   ├── Permit2 Approval
│   ├── Order Validation
│   └── Signature Verification
└── Order Execution
    ├── Order Submission
    ├── Transaction Broadcasting
    ├── Status Monitoring
    └── Completion Confirmation
```

#### Supported Networks
```javascript
const BEBOP_NETWORKS = {
  '0x14a2': { // SuperSeed
    protocol: 'JAM',
    apiUrl: 'https://api.bebop.xyz/jam/superseed/v2/',
    contracts: {
      BEBOP_CONTRACT: '0x...',
      PERMIT2_CONTRACT: '0x...'
    }
  },
  '0xa': { // Optimism
    protocol: 'JAM + RFQ',
    apiUrl: 'https://api.bebop.xyz/jam/optimism/v2/',
    contracts: {
      BEBOP_CONTRACT: '0x...',
      PERMIT2_CONTRACT: '0x...'
    }
  },
  '0x1': { // Ethereum
    protocol: 'JAM + RFQ',
    apiUrl: 'https://api.bebop.xyz/jam/ethereum/v2/',
    contracts: {
      BEBOP_CONTRACT: '0x...',
      PERMIT2_CONTRACT: '0x...'
    }
  }
};
```

### Swap Service Architecture

#### Swap Service Structure
```javascript
class SwapService {
  constructor() {
    this.bebopClients = new Map();
    this.partnerFee = 0.01; // 1% partner fee
    this.setupBebopClients();
  }

  setupBebopClients() {
    for (const [chainId, config] of Object.entries(BEBOP_NETWORKS)) {
      this.bebopClients.set(chainId, new BebopClient(config));
    }
  }

  async getQuote(chainId, fromToken, toToken, amount, slippage = 0.5) {
    const client = this.bebopClients.get(chainId);
    if (!client) {
      throw new Error('Swap not supported on this network');
    }

    return await client.getQuote(fromToken, toToken, amount, slippage);
  }

  async executeSwap(chainId, swapData) {
    const client = this.bebopClients.get(chainId);
    if (!client) {
      throw new Error('Swap not supported on this network');
    }

    return await client.executeSwap(swapData);
  }
}
```

#### Bebop Client Implementation
```javascript
class BebopClient {
  constructor(config) {
    this.config = config;
    this.apiUrl = config.apiUrl;
    this.contracts = config.contracts;
  }

  async getQuote(fromToken, toToken, amount, slippage) {
    try {
      const response = await fetch(`${this.apiUrl}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromToken,
          toToken,
          amount,
          slippage,
          partnerFee: this.partnerFee
        })
      });

      if (!response.ok) {
        throw new Error(`Quote request failed: ${response.statusText}`);
      }

      const quote = await response.json();
      return this.processQuote(quote);
    } catch (error) {
      throw new Error(`Failed to get quote: ${error.message}`);
    }
  }

  processQuote(quote) {
    return {
      fromToken: quote.fromToken,
      toToken: quote.toToken,
      fromAmount: quote.fromAmount,
      toAmount: quote.toAmount,
      priceImpact: quote.priceImpact,
      fee: quote.fee,
      partnerFee: quote.partnerFee,
      executionTime: quote.executionTime,
      mevProtection: quote.mevProtection,
      validUntil: quote.validUntil
    };
  }
}
```

## Swap Flow

### Complete Swap Process

#### Step 1: Quote Request
```javascript
class SwapQuoteManager {
  async requestQuote(swapRequest) {
    const { chainId, fromToken, toToken, amount, slippage } = swapRequest;
    
    try {
      // Validate swap request
      this.validateSwapRequest(swapRequest);
      
      // Get quote from Bebop
      const quote = await this.swapService.getQuote(
        chainId,
        fromToken,
        toToken,
        amount,
        slippage
      );
      
      // Store quote for later use
      this.storeQuote(quote);
      
      return quote;
    } catch (error) {
      throw new Error(`Quote request failed: ${error.message}`);
    }
  }

  validateSwapRequest(request) {
    const { chainId, fromToken, toToken, amount } = request;
    
    if (!chainId || !fromToken || !toToken || !amount) {
      throw new Error('Missing required swap parameters');
    }
    
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    if (fromToken === toToken) {
      throw new Error('From and to tokens cannot be the same');
    }
  }

  storeQuote(quote) {
    // Store quote with expiration
    const quoteData = {
      ...quote,
      timestamp: Date.now(),
      expiresAt: Date.now() + (quote.validUntil * 1000)
    };
    
    this.quotes.set(quote.id, quoteData);
  }
}
```

#### Step 2: Order Signing
```javascript
class SwapOrderSigner {
  async signOrder(quote, wallet) {
    try {
      // Create EIP-712 order
      const order = this.createOrder(quote);
      
      // Sign order with wallet
      const signature = await this.signEIP712Order(order, wallet);
      
      // Create signed order
      const signedOrder = {
        ...order,
        signature
      };
      
      return signedOrder;
    } catch (error) {
      throw new Error(`Order signing failed: ${error.message}`);
    }
  }

  createOrder(quote) {
    return {
      fromToken: quote.fromToken,
      toToken: quote.toToken,
      fromAmount: quote.fromAmount,
      toAmount: quote.toAmount,
      slippage: quote.slippage,
      partnerFee: quote.partnerFee,
      validUntil: quote.validUntil,
      nonce: this.generateNonce()
    };
  }

  async signEIP712Order(order, wallet) {
    const domain = {
      name: 'Bebop',
      version: '1',
      chainId: wallet.chainId,
      verifyingContract: this.contracts.BEBOP_CONTRACT
    };

    const types = {
      Order: [
        { name: 'fromToken', type: 'address' },
        { name: 'toToken', type: 'address' },
        { name: 'fromAmount', type: 'uint256' },
        { name: 'toAmount', type: 'uint256' },
        { name: 'slippage', type: 'uint256' },
        { name: 'partnerFee', type: 'uint256' },
        { name: 'validUntil', type: 'uint256' },
        { name: 'nonce', type: 'uint256' }
      ]
    };

    const signature = await wallet.signTypedData(domain, types, order);
    return signature;
  }
}
```

#### Step 3: Permit2 Approval
```javascript
class Permit2Approval {
  async approveToken(tokenAddress, amount, wallet) {
    try {
      // Create Permit2 approval
      const approval = this.createPermit2Approval(tokenAddress, amount);
      
      // Sign approval with wallet
      const signature = await this.signPermit2Approval(approval, wallet);
      
      // Submit approval to Bebop
      await this.submitPermit2Approval(approval, signature);
      
      return { success: true };
    } catch (error) {
      throw new Error(`Permit2 approval failed: ${error.message}`);
    }
  }

  createPermit2Approval(tokenAddress, amount) {
    return {
      token: tokenAddress,
      amount: amount,
      spender: this.contracts.BEBOP_CONTRACT,
      deadline: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    };
  }

  async signPermit2Approval(approval, wallet) {
    const domain = {
      name: 'Permit2',
      version: '1',
      chainId: wallet.chainId,
      verifyingContract: this.contracts.PERMIT2_CONTRACT
    };

    const types = {
      PermitSingle: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'spender', type: 'address' },
        { name: 'deadline', type: 'uint256' }
      ]
    };

    const signature = await wallet.signTypedData(domain, types, approval);
    return signature;
  }
}
```

#### Step 4: Order Execution
```javascript
class SwapExecutor {
  async executeSwap(signedOrder) {
    try {
      // Submit order to Bebop
      const orderId = await this.submitOrder(signedOrder);
      
      // Monitor order status
      const status = await this.monitorOrderStatus(orderId);
      
      return {
        orderId,
        status,
        success: status === 'completed'
      };
    } catch (error) {
      throw new Error(`Swap execution failed: ${error.message}`);
    }
  }

  async submitOrder(signedOrder) {
    const response = await fetch(`${this.apiUrl}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signedOrder)
    });

    if (!response.ok) {
      throw new Error(`Order submission failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.orderId;
  }

  async monitorOrderStatus(orderId) {
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${this.apiUrl}/order/${orderId}/status`);
        const status = await response.json();
        
        if (status.status === 'completed' || status.status === 'failed') {
          return status.status;
        }
        
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        attempts++;
      } catch (error) {
        console.error('Status check failed:', error);
        attempts++;
      }
    }
    
    return 'timeout';
  }
}
```

## Partner Fee System

### Fee Configuration

#### Fee Structure
```javascript
const FEE_CONFIG = {
  partnerFee: 0.01, // 1% partner fee
  minFee: 0.001, // Minimum fee in ETH
  maxFee: 0.1, // Maximum fee in ETH
  feeRecipient: '0x...', // Partner fee recipient
  feeToken: 'ETH' // Fee token
};
```

#### Fee Calculation
```javascript
class FeeCalculator {
  calculatePartnerFee(swapAmount, feeRate = FEE_CONFIG.partnerFee) {
    const fee = swapAmount * feeRate;
    
    // Apply min/max constraints
    const minFee = FEE_CONFIG.minFee;
    const maxFee = FEE_CONFIG.maxFee;
    
    return Math.max(minFee, Math.min(maxFee, fee));
  }

  calculateTotalFees(swapAmount) {
    const partnerFee = this.calculatePartnerFee(swapAmount);
    const bebopFee = this.calculateBebopFee(swapAmount);
    
    return {
      partnerFee,
      bebopFee,
      totalFee: partnerFee + bebopFee
    };
  }

  calculateBebopFee(swapAmount) {
    // Bebop fee calculation logic
    return swapAmount * 0.005; // 0.5% Bebop fee
  }
}
```

### Fee Management

#### Fee Collection
```javascript
class FeeCollector {
  async collectFees(orderId, fees) {
    try {
      // Collect partner fees
      await this.collectPartnerFees(orderId, fees.partnerFee);
      
      // Collect Bebop fees
      await this.collectBebopFees(orderId, fees.bebopFee);
      
      return { success: true };
    } catch (error) {
      throw new Error(`Fee collection failed: ${error.message}`);
    }
  }

  async collectPartnerFees(orderId, feeAmount) {
    // Transfer partner fees to fee recipient
    const transferTx = await this.transferFees(
      FEE_CONFIG.feeRecipient,
      feeAmount,
      FEE_CONFIG.feeToken
    );
    
    return transferTx;
  }

  async collectBebopFees(orderId, feeAmount) {
    // Transfer Bebop fees to Bebop
    const transferTx = await this.transferFees(
      BEBOP_FEE_RECIPIENT,
      feeAmount,
      FEE_CONFIG.feeToken
    );
    
    return transferTx;
  }
}
```

## Multi-Chain Support

### Network-Specific Configuration

#### Network Configuration
```javascript
const NETWORK_SWAP_CONFIG = {
  '0x14a2': { // SuperSeed
    protocol: 'JAM',
    apiUrl: 'https://api.bebop.xyz/jam/superseed/v2/',
    contracts: {
      BEBOP_CONTRACT: '0x...',
      PERMIT2_CONTRACT: '0x...'
    },
    tokens: {
      native: 'ETH',
      stablecoin: 'USDC'
    }
  },
  '0xa': { // Optimism
    protocol: 'JAM + RFQ',
    apiUrl: 'https://api.bebop.xyz/jam/optimism/v2/',
    contracts: {
      BEBOP_CONTRACT: '0x...',
      PERMIT2_CONTRACT: '0x...'
    },
    tokens: {
      native: 'ETH',
      stablecoin: 'USDC'
    }
  }
};
```

#### Network Validation
```javascript
class NetworkSwapValidator {
  validateSwapNetwork(chainId) {
    const config = NETWORK_SWAP_CONFIG[chainId];
    if (!config) {
      throw new Error('Swap not supported on this network');
    }
    
    return config;
  }

  getSupportedTokens(chainId) {
    const config = this.validateSwapNetwork(chainId);
    return config.tokens;
  }

  getSwapProtocol(chainId) {
    const config = this.validateSwapNetwork(chainId);
    return config.protocol;
  }
}
```

### Cross-Chain Swaps

#### Cross-Chain Swap Manager
```javascript
class CrossChainSwapManager {
  async executeCrossChainSwap(swapRequest) {
    const { fromChain, toChain, fromToken, toToken, amount } = swapRequest;
    
    try {
      // Validate cross-chain swap
      this.validateCrossChainSwap(swapRequest);
      
      // Execute swap on source chain
      const sourceSwap = await this.executeSourceSwap(fromChain, fromToken, amount);
      
      // Bridge tokens to destination chain
      const bridgeTx = await this.bridgeTokens(fromChain, toChain, amount);
      
      // Execute swap on destination chain
      const destSwap = await this.executeDestinationSwap(toChain, toToken, amount);
      
      return {
        sourceSwap,
        bridgeTx,
        destSwap,
        success: true
      };
    } catch (error) {
      throw new Error(`Cross-chain swap failed: ${error.message}`);
    }
  }

  validateCrossChainSwap(swapRequest) {
    const { fromChain, toChain, fromToken, toToken, amount } = swapRequest;
    
    if (fromChain === toChain) {
      throw new Error('Source and destination chains cannot be the same');
    }
    
    if (!this.isChainSupported(fromChain) || !this.isChainSupported(toChain)) {
      throw new Error('Unsupported chain for cross-chain swap');
    }
  }
}
```

## Swap UI Components

### Swap Interface

#### Swap Form Component
```javascript
const SwapForm = () => {
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetQuote = async () => {
    if (!fromToken || !toToken || !amount) return;
    
    setIsLoading(true);
    try {
      const quoteData = await swapService.getQuote(
        currentChainId,
        fromToken.address,
        toToken.address,
        amount,
        slippage
      );
      setQuote(quoteData);
    } catch (error) {
      console.error('Failed to get quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteSwap = async () => {
    if (!quote) return;
    
    try {
      const result = await swapService.executeSwap(quote);
      console.log('Swap executed:', result);
    } catch (error) {
      console.error('Swap execution failed:', error);
    }
  };

  return (
    <div className="swap-form">
      <div className="token-selection">
        <TokenSelector
          token={fromToken}
          onTokenSelect={setFromToken}
          label="From"
        />
        <TokenSelector
          token={toToken}
          onTokenSelect={setToToken}
          label="To"
        />
      </div>
      
      <div className="amount-input">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
        />
      </div>
      
      <div className="slippage-settings">
        <label>Slippage: {slippage}%</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={slippage}
          onChange={(e) => setSlippage(parseFloat(e.target.value))}
        />
      </div>
      
      <button onClick={handleGetQuote} disabled={isLoading}>
        {isLoading ? 'Getting Quote...' : 'Get Quote'}
      </button>
      
      {quote && (
        <div className="quote-display">
          <h3>Quote</h3>
          <p>From: {quote.fromAmount} {quote.fromToken}</p>
          <p>To: {quote.toAmount} {quote.toToken}</p>
          <p>Price Impact: {quote.priceImpact}%</p>
          <p>Fee: {quote.fee} ETH</p>
          <button onClick={handleExecuteSwap}>
            Execute Swap
          </button>
        </div>
      )}
    </div>
  );
};
```

#### Token Selector Component
```javascript
const TokenSelector = ({ token, onTokenSelect, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const supportedTokens = await swapService.getSupportedTokens(currentChainId);
      setTokens(supportedTokens);
    } catch (error) {
      console.error('Failed to load tokens:', error);
    }
  };

  return (
    <div className="token-selector">
      <label>{label}</label>
      <div className="token-input" onClick={() => setIsOpen(!isOpen)}>
        {token ? (
          <div className="selected-token">
            <img src={token.logo} alt={token.symbol} />
            <span>{token.symbol}</span>
          </div>
        ) : (
          <span>Select Token</span>
        )}
      </div>
      
      {isOpen && (
        <div className="token-list">
          {tokens.map((tokenOption) => (
            <div
              key={tokenOption.address}
              className="token-option"
              onClick={() => {
                onTokenSelect(tokenOption);
                setIsOpen(false);
              }}
            >
              <img src={tokenOption.logo} alt={tokenOption.symbol} />
              <span>{tokenOption.symbol}</span>
              <span>{tokenOption.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Error Handling

### Swap Error Management

#### Error Types
```javascript
const SWAP_ERRORS = {
  QUOTE_FAILED: 'QUOTE_FAILED',
  ORDER_SIGNING_FAILED: 'ORDER_SIGNING_FAILED',
  PERMIT2_APPROVAL_FAILED: 'PERMIT2_APPROVAL_FAILED',
  ORDER_EXECUTION_FAILED: 'ORDER_EXECUTION_FAILED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT'
};
```

#### Error Handler
```javascript
class SwapErrorHandler {
  handleError(error, context) {
    console.error(`Swap error in ${context}:`, error);
    
    switch (error.type) {
      case SWAP_ERRORS.QUOTE_FAILED:
        return this.handleQuoteError(error);
      case SWAP_ERRORS.ORDER_SIGNING_FAILED:
        return this.handleSigningError(error);
      case SWAP_ERRORS.ORDER_EXECUTION_FAILED:
        return this.handleExecutionError(error);
      default:
        return this.handleGenericError(error);
    }
  }

  handleQuoteError(error) {
    return {
      message: 'Failed to get swap quote',
      suggestion: 'Please try again or check your token selection',
      retryable: true
    };
  }

  handleSigningError(error) {
    return {
      message: 'Failed to sign swap order',
      suggestion: 'Please check your wallet connection and try again',
      retryable: true
    };
  }

  handleExecutionError(error) {
    return {
      message: 'Swap execution failed',
      suggestion: 'Please check your balance and try again',
      retryable: true
    };
  }
}
```

## Troubleshooting

### Common Swap Issues

#### Quote Issues
- **Check Token Support**: Verify tokens are supported
- **Check Network**: Verify network is supported
- **Check Amount**: Verify amount is valid
- **Check Slippage**: Verify slippage settings

#### Execution Issues
- **Check Balance**: Verify sufficient balance
- **Check Approval**: Verify token approval
- **Check Network**: Verify network connection
- **Check Gas**: Verify gas settings

## Next Steps

Now that you understand swap integration:

1. **[Main Components](./main-components.md)** - Review main components
2. **[State Management](./state-management.md)** - Review state management
3. **[Networks Configuration](./networks-config.md)** - Review network configuration
4. **[Architecture Deep Dive](./architecture-deep-dive.md)** - Review architecture details

---

**Ready to learn more about the architecture?** Continue to [Main Components](./main-components.md)!
