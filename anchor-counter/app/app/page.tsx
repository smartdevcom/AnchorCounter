'use client';

import type * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import Head from 'next/head';
import { useState } from 'react';

import { AppBar } from './components/AppBar';
import { Increment } from './components/Increment';
import { Initialize } from './components/Initialize';

export default function Home() {
  const [counter, setCounter] = useState<anchor.Address>();
  const [transactionUrl, setTransactionUrl] = useState('');
  const wallet = useWallet();

  return (
    <div>
      <Head>
        <title>Anchor Frontend Example</title>
      </Head>
      <AppBar />
      <div>
        {wallet.connected ? (
          counter ? (
            <Increment counter={counter} setTransactionUrl={setTransactionUrl} />
          ) : (
            <Initialize setCounter={setCounter} setTransactionUrl={setTransactionUrl} />
          )
        ) : (
          <div color='white'>Connect Wallet</div>
        )}
        {transactionUrl && (
          <button onClick={() => console.warn(transactionUrl)}>View most recent transaction</button>
        )}
      </div>
    </div>
  );
}
