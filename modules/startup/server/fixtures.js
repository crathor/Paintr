import { Meteor } from 'meteor/meteor'
import { GameBoard } from '../../api/gameboard'

const BRICK_COLUMNS = 20
const BRICK_ROWS = 16
const BRICK_GRID = new Array(BRICK_COLUMNS * BRICK_ROWS).fill('red')

Meteor.startup(() => {
  if (!GameBoard.findOne()) {
    BRICK_GRID.forEach(brick => {
      GameBoard.insert({ color: '#f4f4f4' })
    })
  }
})
