---
sidebar_position: 5
---

# 💾 Storage Architecture

Understand how SuperSafe Wallet manages data storage with the Unified Vault System, ensuring security and data integrity.

## Storage Overview

SuperSafe Wallet implements a **Unified Vault System** that provides secure, encrypted storage for all sensitive data while maintaining performance and accessibility.

### Storage Architecture

```
Storage Architecture:
├── Unified Vault System
│   ├── Encrypted Vault (Chrome Storage Local)
│   │   ├── Wallets
│   │   ├── Settings
│   │   ├── Connections
│   │   └── Metadata
│   └── Vault Encryption
│       ├── AES-256-GCM
│       ├── PBKDF2 Key Derivation
│       └── Random Salt & IV
├── Session Storage (Memory Only)
│   ├── Decrypted Data
│   ├── Private Keys
│   ├── Session State
│   └── Temporary Data
└── UI State Storage (Chrome Storage Local)
    ├── Interface State
    ├── User Preferences
    ├── Form Data
    └── Navigation State
```

## Unified Vault System

### Vault Structure

#### Encrypted Vault Format
```javascript
const VAULT_STRUCTURE = {
  version: '1.0',
  algorithm: 'AES-256-GCM',
  keyDerivation: 'PBKDF2',
  iterations: 10000,
  salt: '32-byte-random-salt',
  iv: '12-byte-random-iv',
  data: 'encrypted-vault-data',
  tag: '16-byte-authentication-tag'
};
```

#### Vault Data Structure
```javascript
const VAULT_DATA = {
  wallets: [
    {
      id: 'wallet-1',
      name: 'Main Wallet',
      emoji: '🏠',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      privateKey: 'encrypted-private-key',
      createdAt: 1640995200000,
      imported: false
    }
  ],
  settings: {
    autoLockTimeout: 900000, // 15 minutes
    defaultNetwork: '0x14a2',
    securityLevel: 'high',
    notifications: true
  },
  connections: [
    {
      origin: 'https://app.uniswap.org',
      permissions: ['eth_requestAccounts', 'eth_sendTransaction'],
      connectedAt: 1640995200000,
      lastActivity: 1640995200000
    }
  ],
  metadata: {
    createdAt: 1640995200000,
    lastModified: 1640995200000,
    version: '1.0',
    backupPhrase: 'encrypted-backup-phrase'
  }
};
```

### Vault Operations

#### Vault Creation
```javascript
class VaultManager {
  constructor() {
    this.vault = null;
    this.masterKey = null;
    this.encryptionKey = null;
  }

  async createVault(password, recoveryPhrase) {
    try {
      // Generate random salt
      const salt = crypto.getRandomValues(new Uint8Array(32));
      
      // Derive master key from password
      const masterKey = await this.deriveMasterKey(password, salt);
      
      // Create initial vault data
      const vaultData = {
        wallets: [],
        settings: this.getDefaultSettings(),
        connections: [],
        metadata: {
          createdAt: Date.now(),
          lastModified: Date.now(),
          version: '1.0',
          backupPhrase: recoveryPhrase
        }
      };
      
      // Encrypt vault
      const encryptedVault = await this.encryptVault(vaultData, masterKey, salt);
      
      // Store encrypted vault
      await this.storeVault(encryptedVault);
      
      this.vault = vaultData;
      this.masterKey = masterKey;
      
      return { success: true };
    } catch (error) {
      throw new Error('Failed to create vault: ' + error.message);
    }
  }

  async deriveMasterKey(password, salt) {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    const masterKey = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 10000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    return new Uint8Array(masterKey);
  }
}
```

#### Vault Encryption
```javascript
class VaultEncryption {
  async encryptVault(vaultData, masterKey, salt) {
    try {
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Serialize vault data
      const serializedData = JSON.stringify(vaultData);
      const dataBuffer = new TextEncoder().encode(serializedData);
      
      // Import master key
      const key = await crypto.subtle.importKey(
        'raw',
        masterKey,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );
      
      // Encrypt with AES-256-GCM
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        dataBuffer
      );
      
      // Create vault structure
      return {
        version: '1.0',
        algorithm: 'AES-256-GCM',
        keyDerivation: 'PBKDF2',
        iterations: 10000,
        salt: Array.from(salt),
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData)),
        tag: Array.from(new Uint8Array(encryptedData.slice(-16)))
      };
    } catch (error) {
      throw new Error('Failed to encrypt vault: ' + error.message);
    }
  }

  async decryptVault(encryptedVault, masterKey) {
    try {
      // Import master key
      const key = await crypto.subtle.importKey(
        'raw',
        masterKey,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );
      
      // Decrypt vault data
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(encryptedVault.iv) },
        key,
        new Uint8Array(encryptedVault.data)
      );
      
      // Deserialize vault data
      const serializedData = new TextDecoder().decode(decryptedData);
      return JSON.parse(serializedData);
    } catch (error) {
      throw new Error('Failed to decrypt vault: ' + error.message);
    }
  }
}
```

#### Vault Unlocking
```javascript
class VaultUnlocker {
  async unlockVault(password) {
    try {
      // Load encrypted vault from storage
      const encryptedVault = await this.loadVault();
      
      // Derive master key from password
      const masterKey = await this.deriveMasterKey(password, new Uint8Array(encryptedVault.salt));
      
      // Decrypt vault
      const vaultData = await this.decryptVault(encryptedVault, masterKey);
      
      // Validate vault data
      if (!this.validateVaultData(vaultData)) {
        throw new Error('Invalid vault data');
      }
      
      // Set vault and master key
      this.vault = vaultData;
      this.masterKey = masterKey;
      
      // Start session
      this.startSession();
      
      return { success: true };
    } catch (error) {
      throw new Error('Failed to unlock vault: ' + error.message);
    }
  }

  validateVaultData(vaultData) {
    // Validate vault structure
    if (!vaultData.wallets || !Array.isArray(vaultData.wallets)) {
      return false;
    }
    
    if (!vaultData.settings || typeof vaultData.settings !== 'object') {
      return false;
    }
    
    if (!vaultData.metadata || typeof vaultData.metadata !== 'object') {
      return false;
    }
    
    return true;
  }
}
```

## Chrome Storage Integration

### Storage Operations

#### Vault Storage
```javascript
class VaultStorage {
  async storeVault(encryptedVault) {
    try {
      await chrome.storage.local.set({
        vault: encryptedVault
      });
    } catch (error) {
      throw new Error('Failed to store vault: ' + error.message);
    }
  }

  async loadVault() {
    try {
      const result = await chrome.storage.local.get(['vault']);
      if (!result.vault) {
        throw new Error('No vault found');
      }
      return result.vault;
    } catch (error) {
      throw new Error('Failed to load vault: ' + error.message);
    }
  }

  async clearVault() {
    try {
      await chrome.storage.local.remove(['vault']);
    } catch (error) {
      throw new Error('Failed to clear vault: ' + error.message);
    }
  }
}
```

#### UI State Storage
```javascript
class UIStateStorage {
  async saveUIState(uiState) {
    try {
      await chrome.storage.local.set({
        uiState: uiState
      });
    } catch (error) {
      console.error('Failed to save UI state:', error);
    }
  }

  async loadUIState() {
    try {
      const result = await chrome.storage.local.get(['uiState']);
      return result.uiState || this.getDefaultUIState();
    } catch (error) {
      console.error('Failed to load UI state:', error);
      return this.getDefaultUIState();
    }
  }

  getDefaultUIState() {
    return {
      currentScreen: 'dashboard',
      modals: {
        connectionRequest: false,
        transactionConfirmation: false,
        networkSwitch: false
      },
      forms: {
        sendTransaction: {},
        swapTokens: {}
      }
    };
  }
}
```

### Storage Security

#### Data Encryption
```javascript
class StorageSecurity {
  constructor() {
    this.encryptionKey = null;
  }

  async encryptSensitiveData(data) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.importKey(
      'raw',
      this.encryptionKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      new TextEncoder().encode(JSON.stringify(data))
    );
    
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedData))
    };
  }

  async decryptSensitiveData(encryptedData) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }
    
    const key = await crypto.subtle.importKey(
      'raw',
      this.encryptionKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      key,
      new Uint8Array(encryptedData.data)
    );
    
    return JSON.parse(new TextDecoder().decode(decryptedData));
  }
}
```

## Session Storage

### Memory-Only Storage

#### Session Data Management
```javascript
class SessionStorage {
  constructor() {
    this.sessionData = new Map();
    this.autoLockTimer = null;
  }

  storeSessionData(key, data) {
    this.sessionData.set(key, data);
    this.updateActivity();
  }

  getSessionData(key) {
    return this.sessionData.get(key);
  }

  clearSessionData() {
    this.sessionData.clear();
  }

  updateActivity() {
    // Update last activity timestamp
    this.sessionData.set('lastActivity', Date.now());
    
    // Reset auto-lock timer
    this.resetAutoLockTimer();
  }

  resetAutoLockTimer() {
    if (this.autoLockTimer) {
      clearTimeout(this.autoLockTimer);
    }
    
    this.autoLockTimer = setTimeout(() => {
      this.clearSessionData();
    }, 15 * 60 * 1000); // 15 minutes
  }
}
```

#### Private Key Management
```javascript
class PrivateKeyManager {
  constructor() {
    this.privateKeys = new Map();
    this.encryptionKey = null;
  }

  async storePrivateKey(walletId, privateKey) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }
    
    // Encrypt private key
    const encryptedKey = await this.encryptPrivateKey(privateKey);
    
    // Store in memory
    this.privateKeys.set(walletId, encryptedKey);
  }

  async getPrivateKey(walletId) {
    const encryptedKey = this.privateKeys.get(walletId);
    if (!encryptedKey) {
      throw new Error('Private key not found');
    }
    
    // Decrypt private key
    return await this.decryptPrivateKey(encryptedKey);
  }

  async encryptPrivateKey(privateKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.importKey(
      'raw',
      this.encryptionKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      new TextEncoder().encode(privateKey)
    );
    
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedData))
    };
  }

  async decryptPrivateKey(encryptedKey) {
    const key = await crypto.subtle.importKey(
      'raw',
      this.encryptionKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedKey.iv) },
      key,
      new Uint8Array(encryptedKey.data)
    );
    
    return new TextDecoder().decode(decryptedData);
  }

  clearPrivateKeys() {
    this.privateKeys.clear();
  }
}
```

## Data Persistence

### Vault Persistence

#### Automatic Persistence
```javascript
class VaultPersistence {
  constructor(vaultManager) {
    this.vaultManager = vaultManager;
    this.setupPersistence();
  }

  setupPersistence() {
    // Listen for vault changes
    this.vaultManager.on('vaultChanged', (vaultData) => {
      this.persistVault(vaultData);
    });
  }

  async persistVault(vaultData) {
    try {
      // Encrypt vault data
      const encryptedVault = await this.vaultManager.encryptVault(vaultData);
      
      // Store in Chrome storage
      await chrome.storage.local.set({
        vault: encryptedVault
      });
    } catch (error) {
      console.error('Failed to persist vault:', error);
    }
  }

  async loadVault() {
    try {
      const result = await chrome.storage.local.get(['vault']);
      if (result.vault) {
        const vaultData = await this.vaultManager.decryptVault(result.vault);
        return vaultData;
      }
      return null;
    } catch (error) {
      console.error('Failed to load vault:', error);
      return null;
    }
  }
}
```

#### Manual Persistence
```javascript
class ManualPersistence {
  async saveVault() {
    try {
      const vaultData = this.vaultManager.getVaultData();
      const encryptedVault = await this.vaultManager.encryptVault(vaultData);
      
      await chrome.storage.local.set({
        vault: encryptedVault
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async exportVault() {
    try {
      const vaultData = this.vaultManager.getVaultData();
      const vaultJson = JSON.stringify(vaultData, null, 2);
      
      // Create download link
      const blob = new Blob([vaultJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'supersafe-vault-backup.json';
      a.click();
      
      URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

## Storage Monitoring

### Storage Health Monitoring

#### Storage Health Check
```javascript
class StorageHealthMonitor {
  constructor() {
    this.healthStatus = {
      vault: 'unknown',
      uiState: 'unknown',
      storage: 'unknown'
    };
    this.setupMonitoring();
  }

  setupMonitoring() {
    // Check storage health every 5 minutes
    setInterval(() => {
      this.checkStorageHealth();
    }, 5 * 60 * 1000);
  }

  async checkStorageHealth() {
    try {
      // Check vault storage
      const vaultResult = await chrome.storage.local.get(['vault']);
      this.healthStatus.vault = vaultResult.vault ? 'healthy' : 'missing';
      
      // Check UI state storage
      const uiStateResult = await chrome.storage.local.get(['uiState']);
      this.healthStatus.uiState = uiStateResult.uiState ? 'healthy' : 'missing';
      
      // Check storage quota
      const quota = await chrome.storage.local.getQuota();
      const usage = await chrome.storage.local.getBytesInUse();
      this.healthStatus.storage = usage < quota * 0.9 ? 'healthy' : 'warning';
      
    } catch (error) {
      this.healthStatus.storage = 'error';
      console.error('Storage health check failed:', error);
    }
  }

  getHealthStatus() {
    return this.healthStatus;
  }
}
```

### Storage Cleanup

#### Automatic Cleanup
```javascript
class StorageCleanup {
  constructor() {
    this.setupCleanup();
  }

  setupCleanup() {
    // Cleanup on extension startup
    chrome.runtime.onStartup.addListener(() => {
      this.cleanup();
    });
    
    // Cleanup on extension install
    chrome.runtime.onInstalled.addListener(() => {
      this.cleanup();
    });
  }

  async cleanup() {
    try {
      // Clean up old UI state
      await this.cleanupOldUIState();
      
      // Clean up temporary data
      await this.cleanupTemporaryData();
      
      // Clean up orphaned data
      await this.cleanupOrphanedData();
      
    } catch (error) {
      console.error('Storage cleanup failed:', error);
    }
  }

  async cleanupOldUIState() {
    const result = await chrome.storage.local.get(['uiState']);
    if (result.uiState) {
      const uiState = result.uiState;
      const now = Date.now();
      
      // Remove old form data (older than 7 days)
      if (uiState.forms) {
        for (const [formName, formData] of Object.entries(uiState.forms)) {
          if (formData.timestamp && now - formData.timestamp > 7 * 24 * 60 * 60 * 1000) {
            delete uiState.forms[formName];
          }
        }
        
        await chrome.storage.local.set({ uiState });
      }
    }
  }
}
```

## Troubleshooting

### Common Storage Issues

#### Vault Corruption
- **Check Vault Integrity**: Verify vault data integrity
- **Backup Recovery**: Use backup to recover vault
- **Vault Recreation**: Create new vault if necessary
- **Data Recovery**: Attempt data recovery

#### Storage Quota Issues
- **Check Storage Usage**: Monitor storage usage
- **Clean Up Data**: Remove unnecessary data
- **Optimize Storage**: Optimize storage usage
- **Increase Quota**: Request quota increase

#### Encryption Issues
- **Check Encryption Key**: Verify encryption key
- **Check Password**: Verify vault password
- **Check Algorithm**: Verify encryption algorithm
- **Check Data Format**: Verify data format

## Next Steps

Now that you understand storage architecture:

1. **[Swap Integration](./swap-integration.md)** - Learn about swap integration
2. **[Main Components](./main-components.md)** - Review main components
3. **[State Management](./state-management.md)** - Review state management
4. **[Architecture Deep Dive](./architecture-deep-dive.md)** - Review architecture details

---

**Ready to learn about swap integration?** Continue to [Swap Integration](./swap-integration.md)!
