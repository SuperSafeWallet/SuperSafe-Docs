---
sidebar_position: 1
---

# 🔧 Troubleshooting

Common issues and solutions for SuperSafe Wallet users and developers.

## Common Issues

### Installation Issues

#### Extension Not Installing
**Problem**: SuperSafe Wallet extension fails to install from Chrome Web Store.

**Solutions**:
1. **Check Chrome Version**: Ensure Chrome is updated to version 88 or later
2. **Check Extension Permissions**: Grant necessary permissions during installation
3. **Disable Other Extensions**: Temporarily disable conflicting extensions
4. **Clear Browser Cache**: Clear Chrome cache and cookies
5. **Restart Browser**: Restart Chrome after installation

**Error Messages**:
- "Extension installation failed" → Check Chrome version and permissions
- "Insufficient permissions" → Grant all requested permissions
- "Conflicting extension" → Disable conflicting wallet extensions

#### Extension Not Loading
**Problem**: SuperSafe Wallet extension doesn't load or appears broken.

**Solutions**:
1. **Reload Extension**: Go to `chrome://extensions/` and click "Reload"
2. **Check Extension Status**: Ensure extension is enabled
3. **Check for Updates**: Update to latest version
4. **Reinstall Extension**: Remove and reinstall the extension
5. **Check Console**: Check browser console for errors

**Error Messages**:
- "Extension not responding" → Reload extension
- "Service worker failed" → Check console for errors
- "Manifest error" → Reinstall extension

### Connection Issues

#### dApp Connection Failed
**Problem**: Unable to connect to dApps or connection requests fail.

**Solutions**:
1. **Check AllowList**: Verify dApp is in SuperSafe AllowList
2. **Check Network**: Ensure dApp supports current network
3. **Refresh dApp**: Refresh the dApp page
4. **Check Extension**: Ensure SuperSafe is installed and enabled
5. **Clear dApp Data**: Clear dApp's local storage

**Error Messages**:
- "Connection rejected" → Check AllowList status
- "Network not supported" → Switch to supported network
- "Permission denied" → Check dApp permissions

#### Wallet Not Detected
**Problem**: dApps don't detect SuperSafe Wallet.

**Solutions**:
1. **Check Provider Injection**: Ensure provider is injected correctly
2. **Check Content Script**: Verify content script is running
3. **Refresh Page**: Refresh the dApp page
4. **Check Console**: Look for provider injection errors
5. **Reinstall Extension**: Reinstall SuperSafe if needed

**Error Messages**:
- "No provider found" → Check extension installation
- "Provider not injected" → Check content script
- "Wallet not detected" → Refresh page and check extension

### Transaction Issues

#### Transaction Failed
**Problem**: Transactions fail to execute or get stuck.

**Solutions**:
1. **Check Balance**: Ensure sufficient balance for transaction
2. **Check Gas**: Verify gas settings are appropriate
3. **Check Network**: Ensure correct network is selected
4. **Check Nonce**: Reset nonce if transaction is stuck
5. **Check RPC**: Verify RPC endpoint is working

**Error Messages**:
- "Insufficient funds" → Add more funds to wallet
- "Gas too low" → Increase gas limit
- "Nonce too low" → Reset nonce
- "Transaction reverted" → Check transaction data

#### Transaction Stuck
**Problem**: Transaction is pending for a long time.

**Solutions**:
1. **Check Network Status**: Verify network is operational
2. **Check Gas Price**: Increase gas price if needed
3. **Replace Transaction**: Send new transaction with higher gas
4. **Cancel Transaction**: Cancel stuck transaction
5. **Wait for Confirmation**: Wait for network confirmation

**Error Messages**:
- "Transaction pending" → Wait for confirmation
- "Gas price too low" → Increase gas price
- "Network congestion" → Wait or increase gas

### Network Issues

#### Network Switch Failed
**Problem**: Unable to switch between networks.

**Solutions**:
1. **Check Network Support**: Verify network is supported
2. **Check Network Configuration**: Verify network settings
3. **Add Network**: Add network if not present
4. **Check RPC**: Verify RPC endpoint is working
5. **Restart Extension**: Restart SuperSafe extension

**Error Messages**:
- "Network not supported" → Check supported networks
- "RPC error" → Check RPC endpoint
- "Network switch failed" → Try manual network addition

#### Wrong Network
**Problem**: Connected to wrong network.

**Solutions**:
1. **Switch Network**: Use network switcher to change
2. **Check dApp**: Verify dApp supports current network
3. **Add Network**: Add required network if missing
4. **Check Settings**: Verify network settings
5. **Restart dApp**: Restart dApp after network change

**Error Messages**:
- "Wrong network" → Switch to correct network
- "Network mismatch" → Check dApp requirements
- "Unsupported network" → Switch to supported network

### Security Issues

#### Vault Unlock Failed
**Problem**: Unable to unlock vault with password.

**Solutions**:
1. **Check Password**: Verify password is correct
2. **Check Caps Lock**: Ensure Caps Lock is off
3. **Check Keyboard Layout**: Verify keyboard layout
4. **Use Recovery Phrase**: Use recovery phrase to restore
5. **Check Vault**: Verify vault file is not corrupted

**Error Messages**:
- "Invalid password" → Check password spelling
- "Vault corrupted" → Use recovery phrase
- "Decryption failed" → Check password or vault

#### Private Key Issues
**Problem**: Private key not working or missing.

**Solutions**:
1. **Check Wallet**: Verify wallet is properly imported
2. **Check Private Key**: Verify private key format
3. **Reimport Wallet**: Reimport wallet with correct key
4. **Use Recovery Phrase**: Use recovery phrase to restore
5. **Check Encryption**: Verify private key encryption

**Error Messages**:
- "Invalid private key" → Check key format
- "Key not found" → Reimport wallet
- "Decryption failed" → Check password

### Performance Issues

#### Slow Performance
**Problem**: SuperSafe Wallet is slow or unresponsive.

**Solutions**:
1. **Check Memory**: Monitor memory usage
2. **Close Tabs**: Close unnecessary browser tabs
3. **Restart Browser**: Restart Chrome
4. **Check Extensions**: Disable other extensions
5. **Update Extension**: Update to latest version

**Performance Tips**:
- Close unused browser tabs
- Disable unnecessary extensions
- Clear browser cache regularly
- Keep Chrome updated
- Monitor memory usage

#### Memory Issues
**Problem**: High memory usage or memory leaks.

**Solutions**:
1. **Restart Extension**: Restart SuperSafe extension
2. **Clear Cache**: Clear browser cache
3. **Check Memory**: Monitor memory usage
4. **Update Extension**: Update to latest version
5. **Report Issue**: Report memory leak issues

**Memory Management**:
- Restart extension regularly
- Clear cache periodically
- Monitor memory usage
- Update to latest version
- Report memory issues

## Developer Issues

### Integration Issues

#### Provider Not Working
**Problem**: EIP-1193 provider not working correctly.

**Solutions**:
1. **Check Provider**: Verify provider is injected
2. **Check Events**: Ensure events are properly handled
3. **Check Methods**: Verify RPC methods are working
4. **Check Console**: Look for provider errors
5. **Check Documentation**: Review integration guide

**Error Messages**:
- "Provider not found" → Check provider injection
- "Method not supported" → Check method implementation
- "Event not fired" → Check event handling

#### Framework Issues
**Problem**: Issues with specific frameworks (RainbowKit, Wagmi, etc.).

**Solutions**:
1. **Check Framework Version**: Ensure compatible version
2. **Check Configuration**: Verify framework configuration
3. **Check Dependencies**: Update framework dependencies
4. **Check Documentation**: Review framework docs
5. **Check Examples**: Use provided examples

**Framework-Specific Issues**:
- **RainbowKit**: Check connector configuration
- **Wagmi**: Check provider setup
- **Web3-React**: Check connector setup
- **Dynamic**: Check wallet configuration

### API Issues

#### RPC Method Failed
**Problem**: RPC methods fail or return errors.

**Solutions**:
1. **Check Method**: Verify method is supported
2. **Check Parameters**: Verify method parameters
3. **Check Network**: Ensure correct network
4. **Check Permissions**: Verify required permissions
5. **Check Error**: Review error message

**Common RPC Errors**:
- `4001`: User rejected request
- `4100`: Unauthorized method
- `4200`: Unsupported method
- `4900`: Disconnected from chain
- `4902`: Chain not added

#### Stream Communication Failed
**Problem**: Stream communication between frontend and backend fails.

**Solutions**:
1. **Check Connection**: Verify stream connection
2. **Check Handlers**: Ensure handlers are registered
3. **Check Messages**: Verify message format
4. **Check Errors**: Review error messages
5. **Check Logs**: Check console logs

**Stream Issues**:
- Connection drops
- Message loss
- Handler errors
- Serialization errors
- Timeout issues

## Network-Specific Issues

### SuperSeed Issues

#### SuperSeed Connection Failed
**Problem**: Unable to connect to SuperSeed network.

**Solutions**:
1. **Check RPC**: Verify SuperSeed RPC endpoint
2. **Check Network**: Ensure SuperSeed is active
3. **Check Configuration**: Verify network configuration
4. **Check Status**: Check SuperSeed network status
5. **Contact Support**: Contact SuperSeed support

**SuperSeed Errors**:
- RPC endpoint down
- Network congestion
- Configuration issues
- Status problems

#### SuperSeed Swap Issues
**Problem**: Swaps fail on SuperSeed network.

**Solutions**:
1. **Check Bebop**: Verify Bebop integration
2. **Check Tokens**: Ensure tokens are supported
3. **Check Balance**: Verify sufficient balance
4. **Check Slippage**: Adjust slippage settings
5. **Check Status**: Check swap status

### Optimism Issues

#### Optimism Connection Failed
**Problem**: Unable to connect to Optimism network.

**Solutions**:
1. **Check RPC**: Verify Optimism RPC endpoint
2. **Check Alchemy**: Check Alchemy API key
3. **Check Network**: Ensure Optimism is active
4. **Check Configuration**: Verify network configuration
5. **Check Status**: Check Optimism status

**Optimism Errors**:
- RPC endpoint issues
- Alchemy API problems
- Network congestion
- Configuration errors

## Recovery Procedures

### Vault Recovery

#### Using Recovery Phrase
1. **Open SuperSafe**: Launch SuperSafe Wallet
2. **Select Restore**: Choose "Restore Wallet" option
3. **Enter Phrase**: Enter 12-word recovery phrase
4. **Set Password**: Create new vault password
5. **Verify**: Verify wallet restoration

#### Recovery Phrase Issues
**Problem**: Recovery phrase not working.

**Solutions**:
1. **Check Words**: Verify all 12 words are correct
2. **Check Order**: Ensure words are in correct order
3. **Check Spelling**: Verify word spelling
4. **Check Language**: Ensure correct language
5. **Contact Support**: Contact support if needed

### Wallet Recovery

#### Import Private Key
1. **Open SuperSafe**: Launch SuperSafe Wallet
2. **Select Import**: Choose "Import Wallet" option
3. **Enter Key**: Enter private key
4. **Set Name**: Set wallet name and emoji
5. **Verify**: Verify wallet import

#### Private Key Issues
**Problem**: Private key import fails.

**Solutions**:
1. **Check Format**: Verify key format (0x prefix)
2. **Check Length**: Ensure key is 64 characters
3. **Check Validity**: Verify key is valid
4. **Check Encoding**: Check key encoding
5. **Try Again**: Try importing again

## Getting Help

### Support Channels

#### Official Support
- **Email**: support@suersafe.cool
- **GitHub**: [SuperSafe Issues](https://github.com/SuperSafeWallet/SuperSafe/issues)
- **Discord**: [SuperSafe Discord](https://discord.gg/supersafe)
- **Twitter**: [@SuperSafeWallet](https://twitter.com/SuperSafeWallet)

#### Community Support
- **GitHub Discussions**: Community discussions
- **Discord Community**: Community chat
- **Reddit**: r/SuperSafeWallet
- **Telegram**: SuperSafe Community

### Reporting Issues

#### Bug Reports
When reporting bugs, include:
1. **Description**: Clear description of the issue
2. **Steps**: Steps to reproduce the issue
3. **Expected**: Expected behavior
4. **Actual**: Actual behavior
5. **Environment**: Browser, OS, extension version
6. **Logs**: Console logs and error messages
7. **Screenshots**: Screenshots if applicable

#### Feature Requests
When requesting features, include:
1. **Description**: Clear description of the feature
2. **Use Case**: Why this feature is needed
3. **Examples**: Examples of similar features
4. **Priority**: Priority level
5. **Implementation**: Suggested implementation

### Documentation

#### User Documentation
- **Getting Started**: Basic usage guide
- **User Guide**: Comprehensive user guide
- **Security Guide**: Security best practices
- **FAQ**: Frequently asked questions

#### Developer Documentation
- **Integration Guide**: dApp integration guide
- **API Reference**: Complete API reference
- **Examples**: Code examples and tutorials
- **Architecture**: Technical architecture details

## Prevention

### Best Practices

#### For Users
1. **Keep Updated**: Always use latest version
2. **Secure Password**: Use strong, unique password
3. **Backup Phrase**: Store recovery phrase securely
4. **Check URLs**: Verify dApp URLs
5. **Report Issues**: Report suspicious activity

#### For Developers
1. **Test Thoroughly**: Test all integrations
2. **Handle Errors**: Implement proper error handling
3. **Check Compatibility**: Verify framework compatibility
4. **Follow Standards**: Follow EIP-1193 standard
5. **Monitor Performance**: Monitor performance metrics

### Regular Maintenance

#### User Maintenance
1. **Update Extension**: Keep extension updated
2. **Clear Cache**: Clear browser cache regularly
3. **Check Security**: Review security settings
4. **Backup Data**: Backup important data
5. **Monitor Activity**: Monitor wallet activity

#### Developer Maintenance
1. **Update Dependencies**: Keep dependencies updated
2. **Test Integrations**: Test integrations regularly
3. **Monitor Errors**: Monitor error logs
4. **Update Documentation**: Keep docs updated
5. **Security Audits**: Regular security audits

---

**Need more help?** Check out our [FAQ](./faq.md) or [contact support](mailto:support@suersafe.cool)!
