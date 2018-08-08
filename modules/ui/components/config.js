export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const BRICK_HEIGHT = 25
export const BRICK_WIDTH = 25
export const BRICK_COLUMNS = 32
export const BRICK_ROWS = 24
export const BRICK_GAP = 1
export const BRICK_GRID = new Array(BRICK_COLUMNS * BRICK_ROWS).fill('red')
export const RESET_KEY = '`'
export const START_KEY = 'Enter'
export const ADD_PLAYER_KEY = 'p'
export const GAME_TIME = 120
export const rowColToArrayIndex = (col, row) => {
  return col + BRICK_COLUMNS * row
}
