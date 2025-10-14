import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'SuperSafe Wallet Documentation',
  tagline: 'MetaMask-style Service Worker architecture with Smart Native Connection, Multi-chain support, and Gasless swaps',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://docs.supersafe.wallet',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'SuperSafeWallet', // Inferred GitHub organization/user
  projectName: 'SuperSafe-Docs', // Assumed docs repository name
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/SuperSafeWallet/SuperSafe-Docs/edit/main/',
        },
        blog: false, // Blog feature is disabled
        theme: {
          customCss: './src/css/custom.css', // Standard Docusaurus custom CSS file
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/supersafe-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'SuperSafe Wallet',
      logo: {
        alt: 'SuperSafe Wallet Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/SuperSafeWallet/SuperSafe',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://supersafe.wallet',
          label: 'Website',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Getting Started',
              to: '/docs/getting-started/installation',
            },
            {
              label: 'Security',
              to: '/docs/security/overview',
            },
            {
              label: 'For Developers',
              to: '/docs/for-developers/integration-overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/supersafe',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/SuperSafeWallet',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/SuperSafeWallet/SuperSafe',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Website',
              href: 'https://supersafe.wallet',
            },
            {
              label: 'Chrome Web Store',
              href: 'https://chrome.google.com/webstore/detail/supersafe-wallet',
            },
            {
              label: 'Support',
              href: 'mailto:support@supersafe.wallet',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SuperSafe Wallet. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
