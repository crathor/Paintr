export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const BRICK_HEIGHT = 40
export const BRICK_WIDTH = 40
export const BRICK_COLUMNS = 20
export const BRICK_ROWS = 15
export const BRICK_GAP = 1
export const PLAYER_SPEED = 10
export const PLAYER_BOOST = 15
export const PLAYER_SIZE = 20
export const BRICK_GRID = new Array(BRICK_COLUMNS * BRICK_ROWS).fill('red')
export const GAME_TIME = 60
export const FRAMES_PER_SECOND = 30
export const rowColToArrayIndex = (col, row) => {
  return col + BRICK_COLUMNS * row
}
