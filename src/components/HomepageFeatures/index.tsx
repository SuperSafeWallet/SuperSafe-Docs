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

// Updated FeatureList with SuperSafe key features
const FeatureList: FeatureItem[] = [
  {
    title: 'Ultra-Secure Connection',
    // Svg: require('@site/static/img/logo.svg').default, // Placeholder if we want a generic logo later
    description: (
      <>
        Connect to dApps with confidence. We use EIP-6963 and AES-GCM encryption to protect your assets.
      </>
    ),
  },
  {
    title: 'Full Control in Your Hands',
    description: (
      <>
        Your private keys never leave your device. Simple and secure multi-account management.
      </>
    ),
  },
  {
    title: 'Seamless dApp Experience',
    description: (
      <>
        Transparent interaction with dApps. Clear permissions and instant management of connected sites.
      </>
    ),
  },
  {
    title: 'Your Wallet, Your Rules',
    description: (
      <>
        Multi-network support (SuperSeed, Sepolia) and easily add any ERC-20 token.
      </>
    ),
  },
  {
    title: 'Always Protected',
    description: (
      <>
        Automatic dApp disconnection when switching wallets and clear prompts for every action.
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
