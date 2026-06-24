import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// Updated FeatureItem type - Svg is now optional as we might not use it initially
type FeatureItem = {
  title: string;
  // Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

// Updated FeatureList with SuperSafe v3.0.0+ key features
const FeatureList: FeatureItem[] = [
  {
    title: 'Professionally Standardized Architecture',
    description: (
      <>
        Industry-standard Service Worker architecture with 30K+ lines of code. Stream-based communication
        for &lt;150ms response times. Thin client pattern ensures private keys never leave the background.
      </>
    ),
  },
  {
    title: 'Smart Native Connection',
    description: (
      <>
        Real chainIds only, zero compatibility hacks. Automatic framework detection for RainbowKit, Wagmi,
        Dynamic, and Web3-React. WalletConnect V2/Reown integration with AllowList security system.
      </>
    ),
  },
  {
    title: 'Gasless Token Swaps',
    description: (
      <>
        Swap tokens without paying gas fees via Bebop JAM protocol with MEV protection. Cross-chain swaps
        across 85+ blockchains via Relay.link, plus Khalani / HyperStream intent routes with order tracking.
      </>
    ),
  },
  {
    title: 'Enterprise-Grade Security',
    description: (
      <>
        Military-grade AES-256-GCM encryption with PBKDF2 (10,000 iterations). Security score 96/100.
        Auto-lock after 15 minutes. Professional transaction decoder with "no fallbacks" security policy.
      </>
    ),
  },
  {
    title: '7 Active Networks',
    description: (
      <>
        Ethereum, BSC, Arbitrum, Optimism, Base, SuperSeed, and Shardeum. Context-aware network switching
        with pre-switch coordination. Multichain transaction history with adapter architecture for easy expansion.
      </>
    ),
  },
  {
    title: 'Professional Transaction Decoder',
    description: (
      <>
        Human-readable transaction decoding for Uniswap V2/V3/V4, PancakeSwap Infinity, Velodrome, and Aerodrome.
        Multi-layer token metadata system with LRU caching. Universal Router support with comprehensive protocol coverage.
      </>
    ),
  },
  {
    title: 'Unified Signing System',
    description: (
      <>
        Enterprise signing system handling all request types with consistent validation. Network-aware signing
        with strict security controls. Comprehensive error handling and recovery mechanisms for maximum reliability.
      </>
    ),
  },
  {
    title: 'Developer-First Approach',
    description: (
      <>
        Complete EIP-1193 and EIP-6963 implementation. Stream-based APIs with typed messages. Comprehensive
        documentation with backend/frontend architecture guides. Full API reference with session, controller,
        and swap endpoints.
      </>
    ),
  },
  {
    title: 'Security Audits & Compliance',
    description: (
      <>
        Comprehensive security audits covering dApp connections, signing system, transaction decoding, and state
        management. 100% compliance achieved across all audit criteria. Professional-grade security practices
        with continuous monitoring and vulnerability reporting.
      </>
    ),
  },
];

// Updated Feature component - Svg rendering is now conditional
function Feature({title, /* Svg, */ description}: FeatureItem) {
  return (
    <div className={clsx('col', styles.featureCardWrapper)}>
      {/* {Svg && (
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
      )} */}
      <div className={styles.featureCard}>
        <div className="padding-horiz--md">
          <Heading as="h3" className={styles.featureCardTitle}>{title}</Heading>
          <p className={styles.featureCardDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={clsx('row', styles.featuresRow)}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
