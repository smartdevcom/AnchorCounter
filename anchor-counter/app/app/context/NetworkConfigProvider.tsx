import { useLocalStorage } from '@solana/wallet-adapter-react';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

export const NetworkConfigContext = createContext({});

export function useNetworkConfig() {
  return useContext(NetworkConfigContext);
}

export const NetworkConfigProvider = ({ children }: { children: ReactNode }) => {
  const [networkConfig, setNetworkConfig] = useLocalStorage('network', 'devnet');

  return (
    <NetworkConfigContext.Provider value={{ networkConfig, setNetworkConfig }}>
      {children}
    </NetworkConfigContext.Provider>
  );
};
