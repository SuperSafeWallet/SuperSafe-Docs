import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <img
              src="/img/logo.svg"
              alt="SuperSafe Wallet Logo"
              className={styles.logo}
            />
            <div className={styles.versionBadge}>
              v3.0.0+
            </div>
            
            {/* Network Status */}
            <div className={styles.networkStatus}>
              <div className={styles.networkItem}>
                <div className={styles.networkDot} style={{backgroundColor: '#627EEA'}}></div>
                <span>Ethereum (Chain ID: 1)</span>
              </div>
              <div className={styles.networkItem}>
                <div className={styles.networkDot} style={{backgroundColor: '#F3BA2F'}}></div>
                <span>Binance Smart Chain (Chain ID: 56)</span>
              </div>
              <div className={styles.networkItem}>
                <div className={styles.networkDot} style={{backgroundColor: '#28A0F0'}}></div>
                <span>Arbitrum (Chain ID: 42161)</span>
              </div>
              <div className={styles.networkItem}>
                <div className={styles.networkDot} style={{backgroundColor: '#FF0420'}}></div>
                <span>Optimism (Chain ID: 10)</span>
              </div>
              <div className={styles.networkItem}>
                <div className={styles.networkDot} style={{backgroundColor: '#0052FF'}}></div>
                <span>Base (Chain ID: 8453)</span>
              </div>
              <div className={styles.networkItem}>
                <div className={styles.networkDot} style={{backgroundColor: '#10b981'}}></div>
                <span>SuperSeed (Chain ID: 5330)</span>
              </div>
              <div className={styles.networkItem}>
                <div className={styles.networkDot} style={{backgroundColor: '#6b7280'}}></div>
                <span>More networks coming soon...</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <Heading as="h1" className={styles.heroTitle}>
              🛡️ SuperSafe Wallet
            </Heading>
            <p className={styles.heroSubtitle}>
              A next-generation secure Chrome Extension wallet with enterprise-grade security for managing digital assets across multiple EVM-compatible networks and seamlessly interacting with Decentralized Applications (dApps).
            </p>

            {/* Key Features Grid */}
            <div className={styles.keyFeatures}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🔐</span>
                <span className={styles.featureText}>AES-256-GCM Encryption</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🌐</span>
                <span className={styles.featureText}>7 Active Networks</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>⚡</span>
                <span className={styles.featureText}>&lt;150ms Response Time</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🔄</span>
                <span className={styles.featureText}>Gasless Swaps</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={styles.ctaSection}>
            <Link
              className={clsx("button button--primary button--lg", styles.primaryButton)}
              to="/docs/intro">
              Read Documentation
            </Link>
            <Link
              className={clsx("button button--outline button--lg", styles.secondaryButton)}
              to="https://github.com/SuperSafeWallet/SuperSafe-Docs">
              View on GitHub
            </Link>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className={styles.backgroundPattern}></div>
    </header>
  );
}

function StatsSection() {
  return (
    <section className={styles.statsSection}>
      <div className="container">
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>96/100</div>
            <div className={styles.statLabel}>Security Score</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>7</div>
            <div className={styles.statLabel}>Active Networks</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>&lt;150ms</div>
            <div className={styles.statLabel}>Response Time</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>30K+</div>
            <div className={styles.statLabel}>Lines of Code</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="SuperSafe Wallet - Professionally Standardized Service Worker Architecture"
      description="Secure web3 browser wallet extension with Smart Native Connection, Multi-chain support, and Gasless swaps via Bebop JAM protocol">
      <HomepageHeader />
      <StatsSection />
      <main className={styles.mainContent}>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
