'use client';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import * as web3 from '@solana/web3.js';
// import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

import { AutoConnectProvider, useAutoConnect } from '@/app/context/AutoConnectProvider';
import { NetworkConfigProvider } from '@/app/context/NetworkConfigProvider';
require('@solana/wallet-adapter-react-ui/styles.css');

// const ReactUIWalletModalProviderDynamic = dynamic(
//   async () => (await import('@solana/wallet-adapter-react-ui')).WalletModalProvider,
//   { ssr: false }
// );

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const endpoint = web3.clusterApiUrl('devnet');
  const { autoConnect } = useAutoConnect();

  const wallets = useMemo(() => {
    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect={autoConnect} wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ParentWalletContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NetworkConfigProvider>
        <AutoConnectProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </AutoConnectProvider>
      </NetworkConfigProvider>
    </>
  );
};
