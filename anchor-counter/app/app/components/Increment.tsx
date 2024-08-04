'use client';

import * as anchor from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import idl from '../../../target/idl/anchor_counter.json';
import { PROGRAM_ID } from '../constants';

export const Increment = ({
  counter,
  setTransactionUrl,
}: {
  counter: anchor.Address;
  setTransactionUrl: (v: string) => void;
}) => {
  const [count, setCount] = useState(0);
  const [program, setProgram] = useState<anchor.Program>();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const notify = () => {
    toast.success('Success Notification !', {
      autoClose: 8000,
      position: 'top-right',
      className: 'black-background',
      bodyClassName: 'grow-font-size',
      progressClassName: 'fancy-progress-bar',
    });
  };

  const refreshCount = useCallback(
    async (program: anchor.Program) => {
      const counterAccount = await program.account.counter.fetch(counter);
      setCount((counterAccount.count as anchor.BN).toNumber());
    },
    [counter]
  );

  useEffect(() => {
    let provider: anchor.Provider;

    try {
      provider = anchor.getProvider();
    } catch {
      if (wallet) {
        provider = new anchor.AnchorProvider(connection, wallet, {});
        anchor.setProvider(provider);
      }
    }

    const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID);
    setProgram(program);
    refreshCount(program);
  }, [connection, refreshCount, wallet]);

  const incrementCount = async () => {
    if (program && wallet) {
      const sig = await program.methods
        .increment()
        .accounts({
          counter: counter,
          user: wallet.publicKey,
        })
        .rpc();

      setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
    }
  };

  const handleRefresh = () => {
    if (program) {
      refreshCount(program);
    }
  };

  return (
    <div>
      <div>
        <button onClick={incrementCount}>Increment Counter</button>
        <button onClick={handleRefresh}>Refresh count</button>
        <button onClick={notify}>Notify !</button>
      </div>
      <div>Count: {count}</div>
    </div>
  );
};
