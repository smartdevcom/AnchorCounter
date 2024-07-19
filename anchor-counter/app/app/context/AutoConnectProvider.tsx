import { useLocalStorage } from '@solana/wallet-adapter-react';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface AutoConnectData {
  autoConnect: boolean;
  setAutoConnect: (v: boolean) => void;
}

export const AutoConnectContext = createContext<AutoConnectData | undefined>(undefined);

export function useAutoConnect() {
  const context = useContext(AutoConnectContext);

  if (context === undefined) {
    throw new Error(`useAutoConnect must be used within a AutoConnectProvider`);
  }

  return context;
}

export const AutoConnectProvider = ({ children }: { children: ReactNode }) => {
  // TODO: fix auto connect to actual reconnect on refresh/other.
  // TODO: make switch/slider settings
  const [autoConnect, setAutoConnect] = useLocalStorage('autoConnect', true);

  return (
    <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      {children}
    </AutoConnectContext.Provider>
  );
};
