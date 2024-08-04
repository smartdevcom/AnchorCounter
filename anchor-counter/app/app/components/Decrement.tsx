'use client';

import * as anchor from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

import idl from '../../../target/idl/anchor_counter.json';
import { PROGRAM_ID } from '../constants';

export const Decrement = ({
  counter,
  setTransactionUrl,
}: {
  counter: anchor.Address;
  setTransactionUrl: (v: string) => void;
}) => {
  const [program, setProgram] = useState<anchor.Program>();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

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
  }, [connection, wallet]);

  const decrementCount = async () => {
    if (program && wallet) {
      const sig = await program.methods
        .decrement()
        .accounts({
          counter: counter,
          user: wallet.publicKey,
        })
        .rpc();

      setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
    }
  };

  return (
    <div>
      <div>
        <button onClick={decrementCount}>Increment Counter</button>
      </div>
    </div>
  );
};
