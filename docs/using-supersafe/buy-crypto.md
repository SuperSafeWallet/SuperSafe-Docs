---
sidebar_position: 7
---

# 💳 Buy Crypto with Fiat

SuperSafe Wallet integrates with **Tradesilvania** to enable you to purchase cryptocurrency directly within the wallet using fiat currency (EUR, USD, RON).

## Overview

Buy crypto instantly with:

- **💳 Credit/Debit Cards**: Visa and Mastercard (instant)
- **🏦 Bank Transfers**: SEPA transfers (0-3 business days)
- **📱 Digital Wallets**: Neteller and Skrill (instant)

### Key Features

- **✅ Direct Purchase**: Buy crypto without leaving the wallet
- **✅ Pre-filled Address**: Your wallet address is automatically filled (read-only for security)
- **✅ Multiple Payment Methods**: Cards, bank transfers, and digital wallets
- **✅ Real-time Tracking**: Track your purchase status in real-time
- **✅ Multi-language**: Available in English, Romanian, French, Spanish, German, and Italian

---

## Supported Networks

Tradesilvania currently supports the following networks:

| Network | Status | Default Asset |
|---------|--------|---------------|
| **Ethereum** | ✅ Active | USDC |
| **BNB Chain** | ✅ Active | USDT |
| **Arbitrum One** | ✅ Active | USDC |
| **Base** | ⏳ Coming Soon | - |
| **Optimism** | ⏳ Coming Soon | - |

:::note
SuperSeed, Monad, and Shardeum are not currently supported for fiat purchases. Switch to a supported network to use this feature.
:::

---

## How to Buy Crypto

### Step 1: Access Buy Feature

1. Open SuperSafe Wallet
2. Ensure you're on a **supported network** (Ethereum, BNB Chain, or Arbitrum)
3. Click the **"Buy"** button in the footer navigation

### Step 2: Complete Purchase

1. The Tradesilvania widget opens within the wallet
2. Your wallet address is **pre-filled** (you cannot change it for security)
3. Enter the amount you want to spend in fiat (EUR, USD, or RON)
4. Select your preferred **payment method**:
   - Credit/Debit Card (instant)
   - Bank Transfer (0-3 days)
   - Neteller or Skrill (instant)
5. Complete the payment process

### Step 3: Track Your Purchase

Once you initiate a purchase:

1. SuperSafe automatically starts tracking your transaction
2. You'll see status updates as your purchase progresses:
   - **⏳ Waiting**: Waiting for payment confirmation
   - **🔄 Exchanging**: Converting fiat to crypto
   - **📤 Sending**: Sending crypto to your wallet
   - **✅ Settled**: Transaction complete!

### Step 4: Receive Your Crypto

When the purchase is complete:

1. A success modal appears with transaction details
2. Click **"View on Explorer"** to see the blockchain transaction
3. Your balance updates automatically

---

## Payment Methods

### Credit/Debit Cards

| Feature | Details |
|---------|---------|
| **Supported Cards** | Visa, Mastercard |
| **Processing Time** | Instant |
| **Currencies** | EUR, USD, RON |
| **Limits** | Varies by card issuer |

### Bank Transfers

| Feature | Details |
|---------|---------|
| **Type** | SEPA Transfer |
| **Processing Time** | 0-3 business days |
| **Currencies** | EUR, RON |
| **Limits** | Higher limits than cards |

### Digital Wallets

| Wallet | Processing Time | Currency |
|--------|----------------|----------|
| **Neteller** | Instant | EUR |
| **Skrill** | Instant | EUR |

---

## Frequently Asked Questions

### Why is Buy not available on my network?

The Buy feature requires network support from Tradesilvania. Currently supported networks are:
- Ethereum
- BNB Chain
- Arbitrum One

To use Buy, switch to one of these networks using the network selector in the header.

### Why can't I change the wallet address?

For your security, the destination wallet address is **pre-filled and read-only**. This ensures your purchased crypto is sent directly to YOUR wallet and prevents address manipulation attacks.

### How long does it take to receive my crypto?

| Payment Method | Processing Time |
|---------------|-----------------|
| Credit/Debit Card | Usually instant (up to 30 minutes) |
| Digital Wallets | Usually instant (up to 30 minutes) |
| Bank Transfer | 0-3 business days |

### What if my purchase is stuck?

Purchases are tracked for up to 30 minutes. If your purchase takes longer:

1. Check your email for updates from Tradesilvania
2. Contact Tradesilvania support at support@tradesilvania.com
3. Keep your transaction ID for reference

### Are there any fees?

Yes, Tradesilvania charges processing fees which vary by:
- Payment method (cards typically have higher fees than bank transfers)
- Amount purchased
- Currency pair

Fees are displayed before you confirm your purchase.

### What's the minimum/maximum purchase amount?

Limits depend on:
- Your payment method
- Your verification level with Tradesilvania
- Your card issuer limits

Typical minimums are around €10-20 EUR equivalent.

---

## Troubleshooting

### "Network Not Supported" Error

**Solution**: Switch to a supported network (Ethereum, BNB Chain, or Arbitrum) using the network selector in the wallet header.

### Purchase Not Showing Up

If your purchase completed but crypto hasn't appeared:

1. Wait a few minutes for blockchain confirmation
2. Refresh your wallet balance
3. Check the blockchain explorer using your transaction hash
4. Contact Tradesilvania support if still not received after 1 hour

### Widget Not Loading

If the Tradesilvania widget doesn't load:

1. Check your internet connection
2. Try closing and reopening the wallet
3. Ensure you're not using a VPN that blocks Tradesilvania

---

## Security Features

SuperSafe implements several security measures for fiat purchases:

- **🔒 Pre-filled Address**: Prevents address manipulation attacks
- **🔐 Secure iframe**: Tradesilvania widget runs in isolated context
- **📊 Real-time Tracking**: Backend webhook integration with RSA-SHA512 signature validation
- **⏱️ Timeout Protection**: Polling automatically stops after 30 minutes

---

**Document Status**: ✅ Current  
**Version**: v3.1.4  
**Last Updated**: December 18, 2025
