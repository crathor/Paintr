import { drawPowerUp } from './drawPowerUp'

import {
  BRICK_COLUMNS,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  BRICK_GAP,
  BRICK_ROWS,
  rowColToArrayIndex
} from '../../config'

const drawGameboardTiles = (
  context,
  topLeftX,
  topLeftY,
  boxWidth,
  boxHeight,
  fillColor
) => {
  context.fillStyle = fillColor
  context.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
}

export const drawGameboard = (context, bricks) => {
  if (bricks.length > 0) {
    for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
      for (let eachCol = 0; eachCol < BRICK_COLUMNS; eachCol++) {
        const arrayIndex = rowColToArrayIndex(eachCol, eachRow)

        drawGameboardTiles(
          context,
          BRICK_WIDTH * eachCol,
          BRICK_HEIGHT * eachRow,
          BRICK_WIDTH - BRICK_GAP,
          BRICK_HEIGHT - BRICK_GAP,
          bricks[arrayIndex].color
        )
        if (bricks[arrayIndex].powerup) {
          drawPowerUp(
            context,
            BRICK_WIDTH * eachCol + BRICK_HEIGHT / 2,
            BRICK_HEIGHT * eachRow + BRICK_WIDTH / 2,
            5,
            15,
            10
          )
        }
      }
    }
  }
}

export const initGameboard = async (
  context,
  bricks,
  drawGame,
  framesPerSecond
) => {
  if (bricks.length > 0) {
    for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
      for (let eachCol = 0; eachCol < BRICK_COLUMNS; eachCol++) {
        const arrayIndex = rowColToArrayIndex(eachCol, eachRow)
        await Meteor.call('init.gameboard', bricks[arrayIndex]._id, arrayIndex)
        drawGameboardTiles(
          context,
          BRICK_WIDTH * eachCol,
          BRICK_HEIGHT * eachRow,
          BRICK_WIDTH - BRICK_GAP,
          BRICK_HEIGHT - BRICK_GAP,
          bricks[arrayIndex].color
        )
      }
    }
  }
  Meteor.call('reset.gameboard')
  setInterval(drawGame, 1000 / framesPerSecond)
}
