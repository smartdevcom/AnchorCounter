use anchor_lang::error_code;

#[error_code]
pub enum AnchorCounterError {
  TileOutOfBounds,
  TileAlreadySet,
  GameAlreadyOver,
  NotPlayersTurn,
  GameAlreadyStarted,
}

#[error_code]
pub enum TicTacToeError {
  TileOutOfBounds,
  TileAlreadySet,
  GameAlreadyOver,
  NotPlayersTurn,
  GameAlreadyStarted,
}

#[error_code]
pub enum MovieReviewError {
  #[msg("Rating must be between 1 and 5")]
  InvalidRating,
  #[msg("Movie Title too long")]
  TitleTooLong,
  #[msg("Movie Description too long")]
  DescriptionTooLong,
}
