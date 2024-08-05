use anchor_lang::prelude::*;

#[account]
pub struct Master {
  pub last_id: u32, // 4 bytes
}

#[account]
pub struct Lottery {
  pub id: u32,                // 4 bytes
  pub authority: Pubkey,      // 32 bytes
  pub ticket_price: u64,      // 8 bytes
  pub last_ticket_id: u32,    // 4 bytes
  pub winner_id: Option<u32>, // 4 + 1 bytes(4 bytes for the u32 value and 1 byte for the discriminant)
  pub claimed: bool,          // 1 byte
}

#[account]
pub struct Ticket {
  pub id: u32,
  pub authority: Pubkey,
  pub lottery_id: u32,
}
