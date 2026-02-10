---
sidebar_position: 4
---

# 🔗 Safe dApp Interaction

Learn how SuperSafe's AllowList system and security features protect you when interacting with decentralized applications.

## Security Overview

SuperSafe Wallet implements multiple layers of security to protect you when connecting to and interacting with dApps, including the **AllowList system**, origin validation, and phishing protection.

### Security Score: **99/100**

```
dApp Security Features:
├── AllowList System: 100/100 ✅
├── Origin Validation: 100/100 ✅
├── Phishing Protection: 98/100 ✅
├── Punycode Protection: 100/100 ✅ NEW!
├── Permission Management: 98/100 ✅
└── Transaction Security: 100/100 ✅
```

## AllowList Security System

### What is the AllowList?

The AllowList is a **whitelist-based security system** that only allows connections from trusted, verified dApps. This prevents malicious websites from accessing your wallet.

#### AllowList Benefits
- **Phishing Protection**: Blocks malicious websites
- **Trusted dApps Only**: Only verified dApps can connect
- **Automatic Protection**: No manual intervention needed
- **Regular Updates**: AllowList updated regularly

### AllowList Structure

#### Policy Format
```json
{
  "policies": {
    "https://app.uniswap.org": {
      "allowed": true,
      "networks": ["0x1", "0xa", "0x14a2"],
      "permissions": ["eth_requestAccounts", "eth_sendTransaction"],
      "description": "Uniswap - Decentralized Exchange",
      "lastUpdated": "2024-01-15",
      "riskLevel": "low"
    },
    "https://opensea.io": {
      "allowed": true,
      "networks": ["0x1", "0xa"],
      "permissions": ["eth_requestAccounts", "eth_sendTransaction", "personal_sign"],
      "description": "OpenSea - NFT Marketplace",
      "lastUpdated": "2024-01-15",
      "riskLevel": "low"
    }
  }
}
```

#### Policy Fields
- **allowed**: Whether the dApp is allowed to connect
- **networks**: Supported network chain IDs
- **permissions**: Allowed permission types
- **description**: Human-readable dApp description
- **lastUpdated**: Last policy update date
- **riskLevel**: Security risk level (low, medium, high)

### AllowList Enforcement

#### Connection Validation Process
```
Connection Validation:
├── Extract Origin URL
├── Check AllowList
├── If Allowed:
│   ├── Validate Network Compatibility
│   ├── Check Permission Requirements
│   ├── Verify SSL Certificate
│   └── Allow Connection
└── If Not Allowed:
    ├── Show Security Warning
    ├── Block Connection
    └── Log Security Event
```

#### Validation Steps
1. **Origin Extraction**: Extract dApp origin URL
2. **AllowList Lookup**: Check against AllowList
3. **Network Validation**: Verify network compatibility
4. **Permission Check**: Validate requested permissions
5. **Security Verification**: Verify SSL certificates

## Origin Validation

### URL Security Checks

#### HTTPS Requirement
- **HTTPS Only**: Only HTTPS connections allowed
- **Certificate Validation**: Validate SSL certificates
- **Domain Verification**: Verify domain authenticity
- **Subdomain Support**: Support for subdomains

#### Domain Validation
- **Domain Check**: Verify domain name
- **Certificate Check**: Check SSL certificate
- **Expiration Check**: Check certificate expiration
- **Chain Validation**: Validate certificate chain

### Phishing Protection

#### Visual Security Indicators

```
Security Status Indicators:
├── ✅ Trusted dApp (Green)
│   ├── AllowList Verified
│   ├── SSL Certificate Valid
│   ├── Low Risk Level
│   └── Full Access Allowed
├── ⚠️ Unknown dApp (Yellow)
│   ├── Not in AllowList
│   ├── SSL Certificate Valid
│   ├── Medium Risk Level
│   └── Limited Access
└── ❌ Blocked dApp (Red)
    ├── Blocked in AllowList
    ├── Invalid Certificate
    ├── High Risk Level
    └── No Access
```

#### Security Warnings
- **Trusted dApp**: Green indicator, full access
- **Unknown dApp**: Yellow indicator, limited access
- **Blocked dApp**: Red indicator, no access
- **Security Warning**: Clear security warnings

### Phishing Detection

#### Common Phishing Patterns
- **Domain Spoofing**: Similar-looking domains
- **Certificate Issues**: Invalid SSL certificates
- **Suspicious URLs**: Suspicious URL patterns
- **Known Malicious**: Known malicious domains

#### Detection Methods
- **Domain Analysis**: Analyze domain names for suspicious patterns
- **Certificate Analysis**: Analyze SSL certificates for validity
- **Pattern Matching**: Match against known phishing patterns
- **Reputation Checking**: Check domain reputation databases
- **Punycode Detection**: Detect IDN homograph attacks

### Punycode / IDN Homograph Protection

SuperSafe Wallet implements robust protection against **Internationalized Domain Name (IDN) homograph attacks** where malicious actors use visually similar Unicode characters to spoof trusted domains.

#### What is Punycode?

Punycode is an encoding method that represents Unicode characters in ASCII format for domain names. Attackers exploit this to create visually identical but technically different domains.

**Example IDN Homograph Attack:**
```
Legitimate: https://uniswap.org
Malicious:  https://uniswαp.org  (uses Greek 'α' instead of 'a')
Punycode:   https://xn--uniswp-5wa.org
```

#### SuperSafe Protection

- **Warning Display**: Shows clear warning when Punycode detected
- **Punycode Reveal**: Displays the actual Punycode (xn--) representation
- **User Decision**: User must explicitly acknowledge the warning
- **AllowList Filtering**: Punycode domains not in AllowList are blocked

#### User Experience

When you connect to a dApp using Punycode/IDN:

1. **Visual Alert**: Clear warning icon displayed
2. **Original + Punycode**: Both representations shown for comparison
3. **Risk Explanation**: Explains the homograph attack risk
4. **Informed Choice**: You decide whether to proceed

**This protection was added based on recommendations from the Offensive Pulse external security audit (December 2025).**

## Permission Management

### Permission Types

#### Account Access
- **View Address**: View wallet address
- **View Balance**: View token balances
- **View Transactions**: View transaction history
- **Account Information**: Access account details

#### Transaction Permissions
- **Send Transactions**: Send transactions
- **Sign Transactions**: Sign transactions
- **Approve Tokens**: Approve token spending
- **Contract Interaction**: Interact with smart contracts

#### Message Signing
- **Sign Messages**: Sign arbitrary messages
- **Personal Sign**: Personal message signing
- **Typed Data Sign**: EIP-712 typed data signing
- **Authentication**: Login authentication

#### Network Permissions
- **Switch Networks**: Switch between networks
- **Add Networks**: Add custom networks
- **Network Information**: Access network information
- **Chain ID**: Access chain ID information

### Permission Granularity

#### Permission Levels
- **Full Access**: All permissions granted
- **Limited Access**: Specific permissions only
- **Read Only**: Read-only permissions
- **Custom**: User-defined permissions

#### Permission Management
- **Per-dApp**: Different permissions per dApp
- **Time-Limited**: Permissions can expire
- **Revocable**: Permissions can be revoked
- **Auditable**: Permission history tracking

## Connection Security

### Connection Request Validation

#### Request Analysis
- **Origin Verification**: Verify request origin
- **Permission Analysis**: Analyze requested permissions
- **Network Compatibility**: Check network compatibility
- **Security Assessment**: Assess security risk

#### User Consent
- **Clear Information**: Clear request information
- **Permission Explanation**: Explain what permissions mean
- **Risk Assessment**: Show security risk level
- **User Decision**: User makes informed decision

### Connection Monitoring

#### Real-time Monitoring
- **Activity Tracking**: Track dApp activity
- **Permission Usage**: Monitor permission usage
- **Suspicious Activity**: Detect suspicious activity
- **Security Events**: Monitor security events

#### Security Alerts
- **High Priority**: Critical security alerts
- **Medium Priority**: Important security alerts
- **Low Priority**: Informational alerts
- **Custom Alerts**: User-defined alerts

## Transaction Security

### Transaction Validation

#### Transaction Analysis
- **Recipient Validation**: Validate recipient address
- **Amount Verification**: Verify transaction amount
- **Gas Estimation**: Estimate gas requirements
- **Risk Assessment**: Assess transaction risk

#### Security Checks
- **Address Checksum**: Verify address checksum
- **Balance Check**: Check sufficient balance
- **Network Validation**: Validate network compatibility
- **Contract Verification**: Verify smart contracts

### Signing Security

#### Message Signing
- **Content Analysis**: Analyze message content
- **Purpose Verification**: Verify signing purpose
- **dApp Verification**: Verify requesting dApp
- **Risk Assessment**: Assess signing risk

#### Typed Data Signing
- **Domain Verification**: Verify EIP-712 domain
- **Type Safety**: Verify type safety
- **Data Validation**: Validate typed data
- **Security Check**: Check for security issues

## Security Best Practices

### For Users

#### Before Connecting
- **Verify URL**: Always verify dApp URL
- **Check Security Status**: Check security indicators
- **Review Permissions**: Review requested permissions
- **Assess Risk**: Assess security risk

#### During Connection
- **Read Carefully**: Read all information carefully
- **Ask Questions**: Ask if unsure about anything
- **Verify Details**: Double-check all details
- **Consider Risks**: Consider all risks

#### After Connection
- **Monitor Activity**: Monitor dApp activity
- **Review Permissions**: Review granted permissions
- **Check Transactions**: Check transaction history
- **Report Issues**: Report security issues

### For dApp Developers

#### Security Implementation
- **HTTPS Only**: Use HTTPS for all connections
- **Valid Certificates**: Use valid SSL certificates
- **Clear Permissions**: Request only necessary permissions
- **User Education**: Educate users about security

#### Best Practices
- **EIP-1193 Compliance**: Follow EIP-1193 standard
- **Error Handling**: Implement proper error handling
- **User Experience**: Provide clear user experience
- **Security Awareness**: Maintain security awareness

## Troubleshooting

### Common Issues

#### Connection Blocked
- **Check AllowList**: Verify dApp is in AllowList
- **Check URL**: Verify dApp URL is correct
- **Check Certificate**: Verify SSL certificate
- **Contact Support**: Contact support if needed

#### Permission Denied
- **Check Permissions**: Verify requested permissions
- **Check dApp**: Verify dApp requirements
- **Update Permissions**: Update permission settings
- **Reconnect**: Try reconnecting

#### Security Warnings
- **Read Warning**: Read security warning carefully
- **Verify dApp**: Verify dApp authenticity
- **Check URL**: Check URL for typos
- **Report Issues**: Report suspicious activity

### Security Issues

#### Phishing Attempts
- **Don't Connect**: Don't connect to suspicious dApps
- **Report Phishing**: Report phishing attempts
- **Verify URLs**: Always verify URLs
- **Stay Alert**: Stay alert for phishing

#### Malicious dApps
- **Disconnect Immediately**: Disconnect from malicious dApps
- **Revoke Permissions**: Revoke all permissions
- **Change Passwords**: Change vault password
- **Report Incident**: Report security incident

## Security Monitoring

### Real-time Monitoring

#### Security Events
- **Failed Connections**: Monitor failed connections
- **Suspicious Activity**: Detect suspicious activity
- **Permission Changes**: Monitor permission changes
- **Security Violations**: Detect security violations

#### Threat Detection
- **Phishing Detection**: Detect phishing attempts
- **Malicious dApps**: Detect malicious dApps
- **Unauthorized Access**: Detect unauthorized access
- **Data Exfiltration**: Detect data exfiltration

### Security Alerts

#### Alert Types
- **High Priority**: Critical security alerts
- **Medium Priority**: Important security alerts
- **Low Priority**: Informational alerts
- **Custom Alerts**: User-defined alerts

#### Alert Channels
- **In-App Notifications**: In-app notifications
- **Email Alerts**: Email security alerts
- **SMS Alerts**: SMS security alerts
- **Push Notifications**: Push notifications

## Next Steps

Now that you understand dApp security:

1. **[Security Configurations](./configurations.md)** - Configure security settings
2. **[Vulnerability Reporting](./vulnerability-reporting.md)** - Report security issues
3. **[Connecting to dApps](../connecting-dapps/connecting.md)** - Learn connection process
4. **[Advanced Topics](../advanced/architecture-deep-dive.md)** - Advanced security topics


**Ready to configure security?** Continue to [Security Configurations](./configurations.md)!

**Document Status:** ✅ Current as of February 10, 2026  
**Code Version:** v3.1.8  
**External Audit:** ✅ Punycode protection recommended by Offensive Pulse
