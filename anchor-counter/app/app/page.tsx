'use client';

import type * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import { AppBar } from './components/AppBar';
import { Decrement } from './components/Decrement';
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
            <div>
              <Increment counter={counter} setTransactionUrl={setTransactionUrl} />
              <Decrement counter={counter} setTransactionUrl={setTransactionUrl} />
            </div>
          ) : (
            <Initialize setCounter={setCounter} setTransactionUrl={setTransactionUrl} />
          )
        ) : (
          <div color='white'>Connect Wallet</div>
        )}
        {transactionUrl && (
          <Link color='white' href={transactionUrl}>
            View most recent transaction
          </Link>
        )}
      </div>
    </div>
  );
}
