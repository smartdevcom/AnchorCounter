use anchor_lang::prelude::*;
use instructions::*;
use state::game::Tile;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

declare_id!("4X3wohHowHuh1rcV9Pjay2nTNhkdcVJGYT6eoYuUL9LC");

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
}
