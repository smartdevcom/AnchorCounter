import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import * as web3 from '@solana/web3.js';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
require('@solana/wallet-adapter-react-ui/styles.css');

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const endpoint = web3.clusterApiUrl('devnet');
  const wallets = useMemo(() => {
    return [
      new walletAdapterWallets.PhantomWalletAdapter(),
      new walletAdapterWallets.SolflareWalletAdapter(),
    ];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect={true} wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
