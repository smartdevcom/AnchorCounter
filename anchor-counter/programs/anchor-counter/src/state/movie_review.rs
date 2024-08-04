use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct MovieAccountState {
  pub reviewer: Pubkey,
  pub rating: u8,
  pub title: String,
  pub description: String,
}

impl Space for MovieAccountState {
  const INIT_SPACE: usize =
    ANCHOR_DISCRIMINATOR + PUBKEY_SIZE + U8_SIZE + STRING_LENGTH_PREFIX + STRING_LENGTH_PREFIX;
}
