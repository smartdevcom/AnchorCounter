'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import type { ReactNode } from 'react';
import type { State } from 'wagmi';
import { WagmiProvider } from 'wagmi';

import { config, projectId } from '@/app/config';

if (!projectId) throw new Error('Project ID is not defined');

const queryClient = new QueryClient();

// Create modal
createWeb3Modal({
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  projectId,
  wagmiConfig: config,
});

export function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
