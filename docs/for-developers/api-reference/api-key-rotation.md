---
sidebar_position: 5
---

# 🔑 API Key Rotation System

SuperSafe implements an **automatic API key rotation system** with **random initial start** and **round-robin load balancing** to maximize throughput, improve reliability, and avoid rate limiting when calling external APIs.

## Overview

**Version:** 2.0.0  
**Status:** ✅ Production Ready

**Key Features:**
- ✅ **Random Initial Start**: Each adapter instance starts with a random API key
- ✅ **Automatic Rotation**: Keys rotate on every request (not just retries)
- ✅ **Round-Robin Algorithm**: Distributes load evenly across all keys
- ✅ **Multiple Keys Support**: Works with 1, 2, 3, or more API keys
- ✅ **Load Balancing**: ~33% load per key with 3 keys (or 1/N with N keys)
- ✅ **Zero Configuration**: Falls back to single key if backups not provided
- ✅ **Transparent**: No application code changes needed
- ✅ **Secure**: Keys never logged or exposed in output

---

## Architecture

**Components:**

1. **`buildApiKeyArray(...apiKeys)`** (`src/background/config/apiConfig.js`)
   - Helper function to construct key arrays
   - Accepts variable number of API keys using rest parameters
   - Filters out null/empty values automatically
   - Returns: `string` (single key) or `string[]` (multiple keys)

2. **`MoralisAdapter.constructor()`** (`src/background/adapters/MoralisAdapter.js`)
   - Initializes adapter with random starting key index
   - Formula: `this.currentKeyIndex = Math.floor(Math.random() * this.apiKey.length)`
   - Ensures different adapter instances start with different keys

3. **`MoralisAdapter.request()`** (`src/background/adapters/MoralisAdapter.js`)
   - Selects key using current index: `apiKeyToUse = this.apiKey[this.currentKeyIndex]`
   - Rotates to next key: `this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKey.length`
   - Rotation happens on **every request** (not just retries)

---

## How It Works

**Random Start + Round-Robin Algorithm**

```
INITIALIZATION (once per adapter instance):
  currentKeyIndex = Math.floor(Math.random() * apiKey.length)
  // Example with 3 keys:
  // Instance A: starts at index 0 (Key 1)
  // Instance B: starts at index 2 (Key 3)
  // Instance C: starts at index 1 (Key 2)

EACH REQUEST:
  1. Use current key: apiKeyToUse = apiKey[currentKeyIndex]
  2. Rotate index:    currentKeyIndex = (currentKeyIndex + 1) % apiKey.length
  3. Make API call with selected key
  
RESULT WITH 3 KEYS:
  Instance A: Key1 → Key2 → Key3 → Key1 → Key2 → Key3...
  Instance B: Key3 → Key1 → Key2 → Key3 → Key1 → Key2...
  Instance C: Key2 → Key3 → Key1 → Key2 → Key3 → Key1...
  
  → Each key receives ~33% of total load across all instances
```

---

## Configuration

**Environment Variables**

Create a `.env` file in the project root:

```bash
# Primary API Key (REQUIRED)
MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.primary_key_here

# Backup API Keys (OPTIONAL - enables load balancing)
MORALIS_API_KEY_BACKUP=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.backup_key_1_here
MORALIS_API_KEY_BACKUP2=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.backup_key_2_here
```

**Code Configuration**

In `src/background/config/apiConfig.js`:

```javascript
import { buildApiKeyArray } from './apiConfig.js';

export const API_CONFIG = {
  // Example with 3 Moralis API keys (recommended)
  OPTIMISM_MORALIS: {
    API_KEY: buildApiKeyArray(
      process.env.MORALIS_API_KEY,           // Key 1 (Primary)
      process.env.MORALIS_API_KEY_BACKUP,    // Key 2 (Backup 1)
      process.env.MORALIS_API_KEY_BACKUP2    // Key 3 (Backup 2)
    ),
    BASE_URL: 'https://deep-index.moralis.io/api/v2.2',
    TIMEOUT: 3000
  }
};
```

---

## Examples

### Single API Key (No Rotation)

**Configuration:**
```javascript
API_KEY: buildApiKeyArray(process.env.MORALIS_API_KEY)
// Result: "eyJhbGci..." (string)
```

**Behavior:**
- All requests use the same key
- No rotation occurs
- No load balancing benefits

---

### Two Keys (50/50 Load Distribution)

**Configuration:**
```javascript
API_KEY: buildApiKeyArray(
  process.env.MORALIS_API_KEY,        // Key 1
  process.env.MORALIS_API_KEY_BACKUP  // Key 2
)
// Result: ["eyJhbGci...", "eyJhbGci..."] (array)
```

**Behavior:**
```
Instance A (random start=0): Key1 → Key2 → Key1 → Key2...
Instance B (random start=1): Key2 → Key1 → Key2 → Key1...

Load Distribution: 50% per key (2x effective rate limit)
```

---

### Three Keys (33/33/33 Load Distribution) ⭐ RECOMMENDED

**Configuration:**
```javascript
API_KEY: buildApiKeyArray(
  process.env.MORALIS_API_KEY,         // Key 1
  process.env.MORALIS_API_KEY_BACKUP,  // Key 2
  process.env.MORALIS_API_KEY_BACKUP2  // Key 3
)
```

**Benefits:**
- **3x Rate Limit**: 900 requests/minute combined (300 × 3)
- **Perfect Balance**: Each account gets equal load
- **Random Start**: No "hot spots" on first key
- **High Availability**: System continues even if one key fails

---

## Benefits

**1. True Load Balancing**
- Random start + round-robin = perfect distribution from first request
- No "hot spots" - all keys receive equal load

**2. Higher Throughput**
- 3 keys = 3x rate limit capacity
- Scales linearly: N keys = N× throughput

**3. Improved Reliability**
- If one key hits rate limit → other keys continue service
- Random start prevents all instances from hitting same key
- Reduces downtime from rate limiting

**4. Cost Optimization**
- Use multiple free-tier keys instead of paid plan
- 3 Moralis free accounts = same throughput as mid-tier paid plan

---

## Security Considerations

**✅ Secure Practices**

1. **Keys Never Logged**: 
   - API keys are replaced with `[API_KEY_HIDDEN]` in curl commands
   - Only key index numbers are logged, never actual keys

2. **Environment Variables**:
   - Keys stored in `.env` (never committed to git)
   - `.env.example` provides template without real keys

3. **Single Source of Truth**:
   - All key access goes through `SecureApiClient`
   - No direct key usage in application code

**⚠️ Important Notes**

- **Do NOT commit `.env` file to version control**
- **Do NOT share API keys in logs or error messages**
- **Rotate keys periodically** (every 90 days recommended)
- **Monitor usage** via Moralis dashboard to detect abuse

---

**Document Status:** ✅ Current as of November 15, 2025  
**Code Version:** v3.0.2+

