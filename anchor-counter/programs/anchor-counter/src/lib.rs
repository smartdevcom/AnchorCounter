use anchor_lang::prelude::*;
use instructions::*;
use state::game::Tile;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

declare_id!("9sqmxJ8CAKANCGzv3cXH3D2UnKh9e9DPiSoDsq5EwUo9");

#[program]
pub mod anchor_counter {
  use super::*;

  pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
    instructions::counter::initialize(_ctx)
  }

  pub fn increment(_ctx: Context<Update>) -> Result<()> {
    instructions::counter::increment(_ctx)
  }

  pub fn decrement(_ctx: Context<Update>) -> Result<()> {
    instructions::counter::decrement(_ctx)
  }

  pub fn add_movie_review(
    _ctx: Context<AddMovieReview>,
    title: String,
    description: String,
    rating: u8,
  ) -> Result<()> {
    instructions::movie_review::add_movie_review(_ctx, title, description, rating)
  }

  pub fn update_movie_review(
    _ctx: Context<UpdateMovieReview>,
    title: String,
    description: String,
    rating: u8,
  ) -> Result<()> {
    instructions::movie_review::update_movie_review(_ctx, title, description, rating)
  }

  pub fn delete_movie_review(_ctx: Context<DeleteMovieReview>, title: String) -> Result<()> {
    instructions::movie_review::delete_movie_review(_ctx, title)
  }

  pub fn setup_game(_ctx: Context<SetupGame>, player_two: Pubkey) -> Result<()> {
    instructions::setup_game::setup_game(_ctx, player_two)
  }

  pub fn play(_ctx: Context<Play>, tile: Tile) -> Result<()> {
    instructions::play::play(_ctx, tile)
  }

  pub fn init_master(_ctx: Context<InitMaster>) -> Result<()> {
    instructions::lottery::init_master(_ctx)
  }

  pub fn create_lottery(_ctx: Context<CreateLottery>, _ticket_price: u64) -> Result<()> {
    instructions::lottery::create_lottery(_ctx, _ticket_price)
  }

  pub fn buy_ticket(_ctx: Context<BuyTicket>, _lottery_id: u32) -> Result<()> {
    instructions::lottery::buy_ticket(_ctx, _lottery_id)
  }

  pub fn pick_winner(_ctx: Context<PickWinner>, _lottery_id: u32) -> Result<()> {
    instructions::lottery::pick_winner(_ctx, _lottery_id)
  }

  pub fn claim_prize(_ctx: Context<ClaimPrize>, _lottery_id: u32, _ticket_id: u32) -> Result<()> {
    instructions::lottery::claim_prize(_ctx, _lottery_id, _lottery_id)
  }
}
