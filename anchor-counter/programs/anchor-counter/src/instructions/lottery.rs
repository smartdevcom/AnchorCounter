use crate::constants::*;
use crate::error::LotteryError;
use crate::state::lottery::*;

use anchor_lang::{
  prelude::*,
  solana_program::{clock::Clock, hash::hash, program::invoke, system_instruction::transfer},
};

pub fn init_master(_ctx: Context<InitMaster>) -> Result<()> {
  let master = &mut _ctx.accounts.master;
  master.last_id = 0;

  msg!("Master Last Id: {}", master.last_id);

  Ok(())
}

// Create the lottery
pub fn create_lottery(_ctx: Context<CreateLottery>, _ticket_price: u64) -> Result<()> {
  // crate a lottery account
  // what is a lottery account -> holds the id of the winning address whoever wins total prize and it also holds if the prize was clainmed and who has authority over the lottery
  let lottery = &mut _ctx.accounts.lottery;
  let master = &mut _ctx.accounts.master;
  master.last_id += 1;

  // set the lottery values
  lottery.id = master.last_id;
  lottery.authority = _ctx.accounts.authority.key();
  lottery.ticket_price = _ticket_price;

  msg!("Created: lottery:{} ", lottery.id);
  msg!("authority {}", lottery.authority);
  msg!("ticket price {}", lottery.ticket_price);

  Ok(())
}

pub fn buy_ticket(_ctx: Context<BuyTicket>, lottery_id: u32) -> Result<()> {
  let lottery = &mut _ctx.accounts.lottery;
  let ticket = &mut _ctx.accounts.ticket;
  let buyer = &_ctx.accounts.buyer;

  if lottery.winner_id.is_some() {
    return err!(LotteryError::WinnerAlreadyExists);
  }

  // transfer sol to lottey pda
  invoke(
    &transfer(&buyer.key(), &lottery.key(), lottery.ticket_price),
    &[
      buyer.to_account_info(),
      lottery.to_account_info(),
      _ctx.accounts.system_program.to_account_info(),
    ],
  )?;

  lottery.last_ticket_id += 1;
  ticket.id = lottery.last_ticket_id;
  ticket.lottery_id = lottery_id;
  ticket.authority = buyer.key();

  msg!("tikcet id {}", ticket.id);
  msg!("tikcet authority {}", ticket.authority);

  Ok(())
}

pub fn pick_winner(_ctx: Context<PickWinner>, _lottery_id: u32) -> Result<()> {
  // select a random ticket as winner
  // and set the winner id to that winner
  // Pick a pseudo random winner
  let lottery = &mut _ctx.accounts.lottery;
  if lottery.winner_id.is_some() {
    return err!(LotteryError::WinnerAlreadyExists);
  }

  if lottery.last_ticket_id == 0 {
    return err!(LotteryError::NoTickets);
  }

  let clock = Clock::get()?;
  let pseudo_random_number = ((u64::from_le_bytes(
    <[u8; 8]>::try_from(&hash(&clock.unix_timestamp.to_be_bytes()).to_bytes()[..8]).unwrap(),
  ) * clock.slot)
    % u32::MAX as u64) as u32;

  let winner_id = (pseudo_random_number % lottery.last_ticket_id) + 1;
  lottery.winner_id = Some(winner_id);

  msg!("winner id {}", winner_id);

  Ok(())
}

pub fn claim_prize(_ctx: Context<ClaimPrize>, _lottery_id: u32, _ticket_id: u32) -> Result<()> {
  let lottery = &mut _ctx.accounts.lottery;
  let ticket = &_ctx.accounts.ticket;
  let winner = &_ctx.accounts.authority;

  if lottery.claimed {
    return err!(LotteryError::AlreadyClaimed);
  }

  match lottery.winner_id {
    Some(winner_id) => {
      if winner_id != ticket.id {
        return err!(LotteryError::InvalidWinner);
      }
    }
    None => {
      return err!(LotteryError::WinnerNotChoosen);
    }
  }

  let prize = lottery
    .ticket_price
    .checked_mul(lottery.last_ticket_id.into())
    .unwrap();

  **lottery.to_account_info().try_borrow_mut_lamports()? -= prize;
  **winner.to_account_info().try_borrow_mut_lamports()? += prize;

  lottery.claimed = true;

  msg!(
    "{} claimed {} lamports from lottery id {} with ticket id {}",
    winner.key(),
    prize,
    lottery.id,
    ticket.id,
  );

  Ok(())
}

#[derive(Accounts)]
pub struct InitMaster<'info> {
  // info life time variable
  #[account(
    init,
    payer = payer,
    space = 4 + 8,
    seeds =[MASTER_SEED.as_bytes()],
    bump,
)]
  pub master: Account<'info, Master>,

  #[account(mut)]
  pub payer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateLottery<'info> {
  #[account(
    init,
    payer= authority,
    space =  4 + 32 + 8 + 4 + 1 + 4 + 1 + 8,
    seeds = [LOTTERY_SEED.as_bytes(), &(master.last_id + 1).to_le_bytes()],
    bump,
  )]
  pub lottery: Account<'info, Lottery>,
  #[account(
    mut,
    seeds = [MASTER_SEED.as_bytes()],
    bump,
  )]
  pub master: Account<'info, Master>,

  #[account(mut)]
  pub authority: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(lottery_id:u32)]
pub struct BuyTicket<'info> {
  #[account(
    mut,
    seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
    bump
  )]
  pub lottery: Account<'info, Lottery>,

  #[account(
    init,
    payer= buyer,
    space = 4 + 4 + 32 + 8,
    seeds = [
      TICKET_SEED.as_bytes(),
      lottery.key().as_ref(),
      &(lottery.last_ticket_id + 1).to_le_bytes(),
    ],
    bump
  )]
  pub ticket: Account<'info, Ticket>,

  #[account(mut)]
  pub buyer: Signer<'info>,

  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct PickWinner<'info> {
  #[account(
    mut,
    seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
    bump,
    has_one = authority,
  )]
  pub lottery: Account<'info, Lottery>,
  pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(lottery_id:u32, ticket_id:u32)]
pub struct ClaimPrize<'info> {
  #[account(
    mut,
    seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
    bump
  )]
  pub lottery: Account<'info, Lottery>,
  #[account(
    seeds = [
      TICKET_SEED.as_bytes(),
      lottery.key().as_ref(),
      &ticket_id.to_le_bytes(),
    ],
    bump,
    has_one = authority
  )]
  pub ticket: Account<'info, Ticket>,
  #[account(mut)]
  pub authority: Signer<'info>,

  pub system_program: Program<'info, System>,
}
