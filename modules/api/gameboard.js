import { METEOR } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

const GAME_WIDTH = 1000
const GAME_HEIGHT = 800
const BRICK_HEIGHT = 50
const BRICK_WIDTH = 50
const BRICK_COLUMNS = 20
const BRICK_ROWS = 16
const BRICK_GAP = 2
const BRICK_GRID = new Array(BRICK_COLUMNS * BRICK_ROWS).fill('red')

const rowColToArrayIndex = (col, row) => {
  return col + BRICK_COLUMNS * row
}

export const GameBoard = new Mongo.Collection('gameboard')

Meteor.methods({
  'get.gameboard'() {
    return GameBoard.findOne({})
  }
})
