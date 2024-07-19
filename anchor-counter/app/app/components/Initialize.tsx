'use client';

import * as anchor from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

import idl from '../../../target/idl/anchor_counter.json';
import { PROGRAM_ID } from '../constants';

export const Initialize = ({
  setCounter,
  setTransactionUrl,
}: {
  setCounter: (v: anchor.Address) => void;
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

  const onClick = async () => {
    if (program) {
      const newAccount = anchor.web3.Keypair.generate();

      const sig = await program.methods
        .initialize()
        .accounts({
          counter: newAccount.publicKey,
        })
        .signers([newAccount])
        .rpc();

      setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
      setCounter(newAccount.publicKey);
    }
  };

  return <button onClick={onClick}>Initialize Counter</button>;
};
