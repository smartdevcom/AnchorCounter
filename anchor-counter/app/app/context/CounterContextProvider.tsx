'use client';

import type { Dispatch, ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

export interface CounterContextData {
  address?: `0x${string}`;
  setAddress: Dispatch<`0x${string}`>;
}

export const CounterContext = createContext<CounterContextData | undefined>(undefined);

export const CounterContextProvider = (
  {
    children,
  }: {
    children: ReactNode;
  } = { children: null }
) => {
  const [address, setAddress] = useState<`0x${string}` | undefined>();

  const value = useMemo(() => {
    return {
      address,
      setAddress,
    };
  }, [address, setAddress]);

  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
};

export function useCounterContext() {
  const context = useContext(CounterContext);

  if (context === undefined) {
    throw new Error(`useCounterContext must be used within a CounterContextProvider`);
  }

  return context;
}
