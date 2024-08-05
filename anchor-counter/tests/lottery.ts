import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { expect } from 'chai';
import { AnchorCounter } from '../target/types/anchor_counter';

describe('lottery', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorCounter as Program<AnchorCounter>;

  const [masterPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('master')],
    program.programId
  );

  it('of master is initialized!', async () => {
    // Add your test here.

    const tx = await program.methods.initMaster().accounts({ master: masterPda }).rpc();

    const master = await program.account.master.fetch(masterPda);

    expect(master.lastId === 0);
  });

  it('Is created!', async () => {
    const ticketPrice = new anchor.BN(100);

    const master = await program.account.master.fetch(masterPda);
    expect(master.lastId).to.equal(0);
    const lastIdPlusOne = master.lastId + 1;
    const lastIdPlusOneBytes = Buffer.alloc(4);
    lastIdPlusOneBytes.writeUInt32LE(lastIdPlusOne);

    const [lotteryPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('lottery'), lastIdPlusOneBytes],
      program.programId
    );

    const tx = await program.methods
      .createLottery(ticketPrice)
      .accounts({ lottery: lotteryPda, master: masterPda })
      .rpc();

    const lottery = await program.account.lottery.fetch(lotteryPda);
    expect(lottery.ticketPrice.toNumber()).to.equal(100);
  });
});
