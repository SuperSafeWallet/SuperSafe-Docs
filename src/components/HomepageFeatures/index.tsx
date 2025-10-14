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
    title: 'MetaMask-Style Architecture',
    description: (
      <>
        Built with Service Worker architecture for reliability. 25K+ lines of code with military-grade security
        and MetaMask-compatible APIs.
      </>
    ),
  },
  {
    title: 'Smart Native Connection',
    description: (
      <>
        Real chainIds, no compatibility hacks. Connect to dApps with confidence using EIP-6963 and
        automatic framework detection.
      </>
    ),
  },
  {
    title: 'Gasless Token Swaps',
    description: (
      <>
        Swap tokens without paying gas fees. Integrated with Bebop JAM protocol for MEV protection
        and competitive pricing across SuperSeed and Optimism.
      </>
    ),
  },
  {
    title: 'AES-256-GCM Encryption',
    description: (
      <>
        Military-grade encryption with PBKDF2 key derivation. Security score of 96/100 with
        AllowList system for trusted dApps only.
      </>
    ),
  },
  {
    title: 'Multi-Chain Ready',
    description: (
      <>
        2 active networks (SuperSeed, Optimism) with 5+ planned. Seamless network switching with
        automatic dApp compatibility detection.
      </>
    ),
  },
  {
    title: 'Developer-First Approach',
    description: (
      <>
        Complete EIP-1193 implementation with framework support for RainbowKit, Wagmi, Web3-React,
        and Dynamic. Comprehensive API documentation.
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
        <div className="text--center padding-horiz--md">
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
